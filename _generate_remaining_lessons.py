"""Generate all remaining lessons in one shot.
Each lesson defined as dict with sections (each section has title + content).
KaTeX automatic backslash doubling. Pyodide code optional. Plotly snippets templated.
"""
import os
import re
from pathlib import Path

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")

OUTCOMES_PANEL_EN = """<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
{bullets}
</ul></div>
"""

OUTCOMES_PANEL_TR = """<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
{bullets}
</ul></div>
"""


def escape_katex(text):
    """In KaTeX math expressions (between $..$ or $$..$$), double all single backslashes."""
    def double(match):
        return re.sub(r'(?<!\\)\\(?!\\)', r'\\\\', match.group(0))
    text = re.sub(r'\$\$[\s\S]*?\$\$', double, text)
    text = re.sub(r'\$[^$\n]+?\$', double, text)
    return text


def lesson_html(outcomes_panel, outcomes_bullets, sections, plot_blocks=None, pyodide_code=None, lang='en'):
    parts = []
    parts.append(outcomes_panel.format(bullets='\n'.join(f'<li>{b}</li>' for b in outcomes_bullets)))
    for i, sec in enumerate(sections, 1):
        parts.append(f'<h2 class="lesson-title">{i}. {sec["title"]}</h2>')
        parts.append(sec['body'])
    if pyodide_code:
        pyodide_title = "Pyodide Lab" if lang == 'en' else "Pyodide Lab"
        run_label = "Run" if lang == 'en' else "Çalıştır"
        parts.append(f'<h2 class="lesson-title">{len(sections)+1}. {pyodide_title}</h2>')
        parts.append(f'<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\\\'.code-wrap\\\').querySelector(\\\'code\\\').textContent)">COPY</button></div><pre class="code-block"><code>{pyodide_code}</code></pre></div>')
    if plot_blocks:
        for pb in plot_blocks:
            parts.append(pb)
    return escape_katex('\n\n'.join(parts))


def make_lesson(track, lesson_num, module_var, content_en, content_tr):
    js = (
        f"window.{module_var} = {{\n\n"
        f"en: `{content_en}`,\n\n"
        f"tr: `{content_tr}`\n"
        f"}};\n"
    )
    out = ROOT / track / f"L{lesson_num}.js"
    out.write_text(js, encoding='utf-8')
    return out


# Standard Plotly templates
def plot_block(plot_id, height, plot_code):
    return f'<div id="{plot_id}" style="height:{height}px;margin:1rem 0"></div>\n<script>\nsetTimeout(function(){{\nif(typeof Plotly===\'undefined\')return;\n{plot_code}\n}},250);\n</script>'


# ============================================================
# LESSON DEFINITIONS — kept tight but complete
# ============================================================

LESSONS = []

# discrete/L5 - Spectral Graph Theory
LESSONS.append({
    'track': 'discrete', 'num': 5, 'module': 'DISCRETE_L5',
    'outcomes_en': [
        'Compute graph Laplacians and understand their spectral properties',
        'Use the Fiedler vector for graph partitioning',
        'Apply spectral clustering to cluster non-convex data',
        'See how Graph Convolutional Networks (GCN) build on spectral theory',
        'Understand the Cheeger inequality bounding graph connectivity',
        'Implement basic spectral algorithms in NumPy',
    ],
    'outcomes_tr': [
        'Çizge Laplacian hesaplama ve spektral özelliklerini anlama',
        'Çizge bölümlemesi için Fiedler vektörünü kullanma',
        'Konveks olmayan verileri kümelemek için spektral kümeleme uygulama',
        'Graph Convolutional Networks (GCN) spektral teori üzerine nasıl kurulduğunu',
        'Çizge bağlılığını sınırlayan Cheeger eşitsizliğini anlama',
        'NumPy ile temel spektral algoritmaları uygulama',
    ],
    'sections_en': [
        {'title': 'The Graph Laplacian', 'body': '<p class="l-text">For undirected graph $G=(V,E)$ with adjacency matrix $A$ and degree matrix $D=\\mathrm{diag}(\\deg(v_1),\\dots)$, the (unnormalized) Laplacian is:</p>$$L = D - A$$<p class="l-text">$L$ is symmetric, positive semidefinite, so its eigenvalues $0 = \\lambda_1 \\leq \\lambda_2 \\leq \\cdots \\leq \\lambda_n$ are all non-negative. The smallest eigenvalue is always 0, with eigenvector $\\mathbf{1}$. The multiplicity of $\\lambda=0$ equals the number of connected components.</p>'},
        {'title': 'Normalized Laplacians', 'body': '<p class="l-text">Two common normalizations:</p>$$L_{\\text{sym}} = D^{-1/2} L D^{-1/2}, \\qquad L_{\\text{rw}} = D^{-1}L$$<p class="l-text">Symmetric normalization preserves symmetry; random-walk Laplacian relates to the transition matrix $P=D^{-1}A$. Both have spectra in $[0, 2]$.</p>'},
        {'title': 'The Fiedler Vector', 'body': '<p class="l-text">The eigenvector corresponding to $\\lambda_2$ (second-smallest) is the <strong>Fiedler vector</strong> $v_2$. Splitting vertices by the sign of $v_2$ approximates the minimum-cut bipartition. Mathematically: $v_2$ minimizes the Dirichlet energy $\\sum_{(i,j)\\in E}(x_i - x_j)^2$ subject to $\\sum x_i = 0$ and $\\|x\\|=1$.</p>'},
        {'title': 'Spectral Clustering', 'body': '<p class="l-text">Algorithm (Ng-Jordan-Weiss 2002):</p><ol><li>Build similarity graph (e.g., $k$-NN or Gaussian kernel).</li><li>Compute $L_{\\text{sym}}$.</li><li>Take eigenvectors for the $k$ smallest non-zero eigenvalues, stack as $n \\times k$ matrix $U$.</li><li>Normalize rows of $U$ to unit length.</li><li>Run k-means on rows of $U$.</li></ol><p class="l-text">Cluster shapes can be non-convex — spectral clustering finds them where k-means in original space fails.</p>'},
        {'title': 'Cheeger Inequality', 'body': '<p class="l-text">The Cheeger constant $h(G)$ measures the bottleneck of $G$:</p>$$h(G) = \\min_{S \\subset V} \\frac{|\\partial S|}{\\min(|S|, |V \\setminus S|)}$$<p class="l-text">Cheeger inequality: $\\frac{\\lambda_2}{2} \\leq h(G) \\leq \\sqrt{2\\lambda_2}$. Small $\\lambda_2$ means small bottleneck (easy to disconnect). This connects spectrum to topology.</p>'},
        {'title': 'Spectral GNNs (Bruna 2014)', 'body': '<p class="l-text">Define graph convolution in spectral domain: signal $x$, filter $g$, then $g \\star x = U g(\\Lambda) U^T x$ where $L = U\\Lambda U^T$. Bruna et al. 2014 proposed the first spectral GNN. Drawback: $O(n^2)$ per layer.</p>'},
        {'title': 'ChebNet & GCN (Defferrard 2016, Kipf 2017)', 'body': '<p class="l-text">ChebNet approximates spectral filters with Chebyshev polynomials of $L$: $g_\\theta(L) \\approx \\sum_{k=0}^K \\theta_k T_k(\\tilde{L})$ — localized in $K$-hops, $O(K|E|)$ per layer. Kipf-Welling 2017 simplified to GCN: single layer $H^{(l+1)} = \\sigma(\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2} H^{(l)} W^{(l)})$ with $\\tilde{A} = A + I$. GCN dominates modern graph ML.</p>'},
        {'title': 'Applications', 'body': '<p class="l-text">Spectral methods power: image segmentation (Shi-Malik 2000 normalized cut), community detection in social networks, dimensionality reduction (Laplacian Eigenmaps, Belkin-Niyogi 2003), 3D mesh processing, and the foundation of all GNN architectures.</p>'},
    ],
    'sections_tr': [
        {'title': 'Çizge Laplacian', 'body': '<p class="l-text">Yönsüz çizge $G=(V,E)$ için, komşuluk matrisi $A$ ve derece matrisi $D=\\mathrm{diag}(\\deg(v_1),\\dots)$ ile (normalize edilmemiş) Laplacian:</p>$$L = D - A$$<p class="l-text">$L$ simetrik ve pozitif yarı-belirli, dolayısıyla özdeğerleri $0 = \\lambda_1 \\leq \\lambda_2 \\leq \\cdots \\leq \\lambda_n$ negatif değildir. En küçük özdeğer her zaman 0, özvektörü $\\mathbf{1}$. $\\lambda=0$ çokluğu bağlı bileşen sayısına eşittir.</p>'},
        {'title': 'Normalize Edilmiş Laplacian\'lar', 'body': '<p class="l-text">İki yaygın normalleştirme:</p>$$L_{\\text{sym}} = D^{-1/2} L D^{-1/2}, \\qquad L_{\\text{rw}} = D^{-1}L$$<p class="l-text">Simetrik normalleştirme simetriyi korur; rastgele yürüyüş Laplacian\'ı geçiş matrisi $P=D^{-1}A$ ile ilişkilidir. Her ikisinin de spektrumu $[0, 2]$\'dedir.</p>'},
        {'title': 'Fiedler Vektörü', 'body': '<p class="l-text">$\\lambda_2$\'ye (ikinci en küçük) karşılık gelen özvektör <strong>Fiedler vektörüdür</strong> $v_2$. $v_2$\'nin işaretine göre köşeleri ayırmak minimum-kesim ikilemesine yaklaşır. Matematiksel olarak: $v_2$, $\\sum x_i = 0$ ve $\\|x\\|=1$ kısıtları altında Dirichlet enerjisi $\\sum_{(i,j)\\in E}(x_i - x_j)^2$\'yi minimize eder.</p>'},
        {'title': 'Spektral Kümeleme', 'body': '<p class="l-text">Algoritma (Ng-Jordan-Weiss 2002):</p><ol><li>Benzerlik çizgesi inşa et ($k$-NN veya Gauss çekirdek).</li><li>$L_{\\text{sym}}$ hesapla.</li><li>$k$ en küçük sıfır olmayan özdeğer için özvektörleri al, $n \\times k$ matris $U$ olarak istifle.</li><li>$U$\'nun satırlarını birim uzunluğa normalize et.</li><li>$U$\'nun satırları üzerinde k-means çalıştır.</li></ol><p class="l-text">Küme şekilleri konveks olmayabilir — orijinal uzayda k-means başarısız olduğunda spektral kümeleme bulur.</p>'},
        {'title': 'Cheeger Eşitsizliği', 'body': '<p class="l-text">Cheeger sabiti $h(G)$, $G$\'nin darboğazını ölçer:</p>$$h(G) = \\min_{S \\subset V} \\frac{|\\partial S|}{\\min(|S|, |V \\setminus S|)}$$<p class="l-text">Cheeger eşitsizliği: $\\frac{\\lambda_2}{2} \\leq h(G) \\leq \\sqrt{2\\lambda_2}$. Küçük $\\lambda_2$ küçük darboğaz demektir (kolayca ayrılır). Bu, spektrumu topolojiye bağlar.</p>'},
        {'title': 'Spektral GNN\'ler (Bruna 2014)', 'body': '<p class="l-text">Spektral alanda çizge konvolüsyonu tanımla: sinyal $x$, filtre $g$, sonra $g \\star x = U g(\\Lambda) U^T x$ burada $L = U\\Lambda U^T$. Bruna et al. 2014 ilk spektral GNN\'i önerdi. Dezavantaj: katman başına $O(n^2)$.</p>'},
        {'title': 'ChebNet & GCN (Defferrard 2016, Kipf 2017)', 'body': '<p class="l-text">ChebNet, $L$\'nin Chebyshev polinomları ile spektral filtreleri yaklaştırır: $g_\\theta(L) \\approx \\sum_{k=0}^K \\theta_k T_k(\\tilde{L})$ — $K$-atlamada yerelleştirilmiş, katman başına $O(K|E|)$. Kipf-Welling 2017 GCN\'e basitleştirdi: $\\tilde{A} = A + I$ ile tek katman $H^{(l+1)} = \\sigma(\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2} H^{(l)} W^{(l)})$. GCN modern çizge ML\'e hakimdir.</p>'},
        {'title': 'Uygulamalar', 'body': '<p class="l-text">Spektral yöntemler şunları güçlendirir: görüntü bölümleme (Shi-Malik 2000 normalize edilmiş kesim), sosyal ağlarda topluluk tespiti, boyut indirgeme (Laplacian Eigenmaps, Belkin-Niyogi 2003), 3D mesh işleme ve tüm GNN mimarilerinin temeli.</p>'},
    ],
    'pyodide_en': """<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

<span class="cm"># Small two-cluster graph: 6 nodes</span>
<span class="cm"># Cluster 1: {0,1,2} fully connected; Cluster 2: {3,4,5} fully connected; weak link 2-3</span>
A = np.array([
    [<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0.2</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0.2</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],
    [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],
    [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>]], dtype=<span class="ty">float</span>)
D = np.diag(A.sum(<span class="num">1</span>))
L = D - A
<span class="fn">print</span>(<span class="str">"Laplacian eigenvalues:"</span>, np.round(np.linalg.eigvalsh(L), <span class="num">3</span>))

<span class="cm"># Fiedler vector splits the graph</span>
vals, vecs = np.linalg.eigh(L)
fiedler = vecs[:, <span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"Fiedler vector:"</span>, fiedler.round(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Cluster assignment (sign):"</span>, (fiedler &gt; <span class="num">0</span>).astype(<span class="ty">int</span>))

<span class="cm"># Spectral clustering on a non-convex 2D dataset (moons-like)</span>
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_moons
X, y_true = make_moons(n_samples=<span class="num">100</span>, noise=<span class="num">0.07</span>, random_state=<span class="num">0</span>)
<span class="cm"># Build kNN similarity, then symmetric Laplacian</span>
<span class="kw">from</span> scipy.spatial.distance <span class="kw">import</span> cdist
dist = cdist(X, X)
W = np.exp(-dist**<span class="num">2</span> / (<span class="num">2</span>*<span class="num">0.2</span>**<span class="num">2</span>))
np.fill_diagonal(W, <span class="num">0</span>)
D = np.diag(W.sum(<span class="num">1</span>))
L_sym = np.eye(<span class="num">100</span>) - np.diag(<span class="num">1</span>/np.sqrt(np.diag(D))) @ W @ np.diag(<span class="num">1</span>/np.sqrt(np.diag(D)))
vals, vecs = np.linalg.eigh(L_sym)
U = vecs[:, :<span class="num">2</span>]
U = U / np.linalg.norm(U, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
labels = KMeans(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).fit_predict(U)
<span class="fn">print</span>(<span class="str">"Cluster purity vs true labels:"</span>, np.mean(labels == y_true).round(<span class="num">2</span>))""",
    'pyodide_tr': """<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

<span class="cm"># Iki kumeli kucuk cizge: 6 dugum</span>
A = np.array([
    [<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">0.2</span>,<span class="num">0</span>,<span class="num">0</span>],
    [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0.2</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>],
    [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">0</span>,<span class="num">1</span>],
    [<span class="num">0</span>,<span class="num">0</span>,<span class="num">0</span>,<span class="num">1</span>,<span class="num">1</span>,<span class="num">0</span>]], dtype=<span class="ty">float</span>)
D = np.diag(A.sum(<span class="num">1</span>))
L = D - A
<span class="fn">print</span>(<span class="str">"Laplacian ozdegerleri:"</span>, np.round(np.linalg.eigvalsh(L), <span class="num">3</span>))

vals, vecs = np.linalg.eigh(L)
fiedler = vecs[:, <span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"Fiedler vektoru:"</span>, fiedler.round(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Kume atamasi (isaret):"</span>, (fiedler &gt; <span class="num">0</span>).astype(<span class="ty">int</span>))""",
    'plot_blocks': [
        '<div id="plot-l5-laplacian-en" style="height:320px;margin:1rem 0"></div>\n<script>\nsetTimeout(function(){\nif(typeof Plotly===\'undefined\')return;\nvar evals=[0,0.18,0.51,1.0,1.5,2.0,2.4,3.0,3.6,4.2,4.8,5.5,6.0,6.5,7.0];\nvar layout={paper_bgcolor:\'#0a0a0a\',plot_bgcolor:\'#0a0a0a\',font:{color:\'#e8e8e8\',family:\'Geist\'},xaxis:{title:\'eigenvalue index\',color:\'#e8e8e8\',gridcolor:\'#222\'},yaxis:{title:\'lambda\',color:\'#e8e8e8\',gridcolor:\'#222\'},legend:{orientation:\'h\',y:1.08,xanchor:\'center\',x:0.5},margin:{t:30,b:50,l:60,r:30}};\nPlotly.newPlot(\'plot-l5-laplacian-en\',[{x:evals.map((v,i)=>i),y:evals,name:\'L spectrum\',mode:\'lines+markers\',line:{color:\'#3b82f6\'}}],layout,{displayModeBar:false,responsive:true});\n},250);\n</script>',
        '<div id="plot-l5-laplacian-tr" style="height:320px;margin:1rem 0"></div>\n<script>\nsetTimeout(function(){\nif(typeof Plotly===\'undefined\')return;\nvar evals=[0,0.18,0.51,1.0,1.5,2.0,2.4,3.0,3.6,4.2,4.8,5.5,6.0,6.5,7.0];\nvar layout={paper_bgcolor:\'#0a0a0a\',plot_bgcolor:\'#0a0a0a\',font:{color:\'#e8e8e8\',family:\'Geist\'},xaxis:{title:\'ozdeger indeks\',color:\'#e8e8e8\',gridcolor:\'#222\'},yaxis:{title:\'lambda\',color:\'#e8e8e8\',gridcolor:\'#222\'},legend:{orientation:\'h\',y:1.08,xanchor:\'center\',x:0.5},margin:{t:30,b:50,l:60,r:30}};\nPlotly.newPlot(\'plot-l5-laplacian-tr\',[{x:evals.map((v,i)=>i),y:evals,name:\'L spektrumu\',mode:\'lines+markers\',line:{color:\'#3b82f6\'}}],layout,{displayModeBar:false,responsive:true});\n},250);\n</script>',
    ],
})


# markov/L6 - Bayesian Deep Learning & Modern Apps
LESSONS.append({
    'track': 'markov', 'num': 6, 'module': 'MARKOV_L6',
    'outcomes_en': ['Quantify aleatoric vs epistemic uncertainty in NN predictions','Apply Monte Carlo dropout as a cheap Bayesian approximation','Train deep ensembles for calibration','Understand RLHF reward modeling as Bayesian preference aggregation','See diffusion sampling as annealed MCMC','Use Bayesian optimization for hyperparameter tuning'],
    'outcomes_tr': ['Sinir agi tahminlerinde aleatoric vs epistemic belirsizligi nicelendirme','MC dropout\'u ucuz Bayes yaklasimi olarak uygulama','Kalibrasyon icin derin topluluklari egitme','RLHF odul modellemesini Bayes tercih toplama olarak anlama','Diffusion ornekleme = tavlanmis MCMC','Hiperparametre ayarlamasinda Bayes optimizasyonu'],
    'sections_en':[
        {'title':'Why Uncertainty Matters','body':'<p class="l-text">A point prediction tells you what the model thinks. A distribution tells you how sure it is. For medical diagnosis, autonomous driving, and safety-critical systems, "I don\'t know" is a valid — sometimes required — output. Two flavors: <strong>aleatoric</strong> (data noise, irreducible) and <strong>epistemic</strong> (model uncertainty, reducible with more data).</p>'},
        {'title':'Bayesian Neural Networks Setup','body':'<p class="l-text">Treat weights as random variables: $p(w \\mid \\mathcal{D})$ instead of point estimate. Predictive distribution:</p>$$p(y \\mid x, \\mathcal{D}) = \\int p(y \\mid x, w)\\, p(w \\mid \\mathcal{D})\\, dw$$<p class="l-text">Three paths: MCMC (exact, slow), VI (scalable, biased), ensembles (often the best practical option).</p>'},
        {'title':'SGLD — Stochastic Gradient Langevin Dynamics','body':'<p class="l-text">Welling-Teh 2011 inject Gaussian noise into SGD: $w_{t+1} = w_t - \\eta_t \\nabla \\log p(w \\mid \\mathcal{D}) + \\sqrt{2\\eta_t}\\, \\varepsilon_t$. As $\\eta_t \\to 0$, samples approach the true posterior. Scales to bigger models than HMC, but still challenging for foundation models.</p>'},
        {'title':'Monte Carlo Dropout','body':'<p class="l-text">Gal-Ghahramani 2016. Keep dropout ACTIVE at inference, run $K$ forward passes:</p>$$\\hat{y} = \\frac{1}{K}\\sum_k f_{w_k}(x), \\qquad \\hat{\\sigma}^2 = \\frac{1}{K}\\sum_k (f_{w_k}(x) - \\hat{y})^2$$<p class="l-text">Mathematically equivalent to VI with a specific approximate posterior. Practically: 1-line change. Zero retraining cost. Decent uncertainty estimates.</p>'},
        {'title':'Deep Ensembles','body':'<p class="l-text">Lakshminarayanan et al. 2017. Train $K$ independent NNs with different seeds. Use mean ± std as prediction + uncertainty. Often beats Bayesian methods in practice (Ovadia 2019). Why: SGD finds genuinely different modes — captures more uncertainty than single-Gaussian approx.</p>'},
        {'title':'Calibration & Reliability Diagrams','body':'<p class="l-text">A model is calibrated when "70% confident" is right 70% of the time. Modern DNNs are typically <strong>overconfident</strong> (Guo et al. 2017). Temperature scaling fixes it: divide logits by $T > 1$, find $T$ that minimizes validation NLL. Single-parameter, post-hoc, surprisingly effective.</p>'},
        {'title':'RLHF — Reward Modeling','body':'<p class="l-text">Christiano 2017, Ouyang 2022 (InstructGPT). (1) Collect human pairwise preferences. (2) Train reward $R_\\phi(x,y)$ via Bradley-Terry: $P(y_a \\succ y_b) = \\sigma(R(x,y_a) - R(x,y_b))$. (3) Optimize LLM via PPO with KL penalty from base. The reward model IS a Bayesian preference aggregator. Without uncertainty, reward hacking is a major risk.</p>'},
        {'title':'Diffusion = Annealed MCMC','body':'<p class="l-text">Score-based generative models sample via Langevin: $x_{t+1} = x_t + (\\eta/2) \\nabla \\log p(x_t) + \\sqrt{\\eta}\\, \\varepsilon_t$. This IS MCMC. The reverse SDE of diffusion is annealed Langevin sampling through $p_{\\sigma_1} \\to \\cdots \\to p_{\\text{data}}$. Diffusion = MCMC + clever noise schedule. Diffeq L6 ties this all together.</p>'},
        {'title':'Bayesian Optimization','body':'<p class="l-text">Hyperparameter tuning as Bayesian inference. Gaussian Process prior over $f(\\lambda)$ = validation loss. After each trial, update posterior. Pick next trial by maximizing an acquisition function: EI, UCB, Thompson sampling. Used in Google Vizier, SigOpt, AutoML. Much more sample-efficient than random search.</p>'},
        {'title':'Probabilistic Programming Languages','body':'<div class="calc-cards"><div class="calc-card"><div class="card-title">Pyro/NumPyro</div><p>PyTorch/JAX. ML-style Bayesian. NUTS + JAX = fast.</p></div><div class="calc-card"><div class="card-title">Stan</div><p>Statistician favorite. Mature. Traditional Bayesian.</p></div><div class="calc-card"><div class="card-title">PyMC</div><p>Pythonic. Easy curve. Best for prototyping.</p></div></div>'},
        {'title':'Open Problems & Future','body':'<p class="l-text">Scaling Bayes to foundation models: LoRA-Bayes, parameter-efficient Bayesian fine-tuning, LLM calibration (Lin 2024), uncertainty for agentic systems. As LLMs make consequential decisions, knowing-what-you-don\'t-know becomes mandatory.</p>'},
    ],
    'sections_tr':[
        {'title':'Belirsizlik Neden Onemli?','body':'<p class="l-text">Nokta tahmini modelin ne dusundugunu soyler. Dagilim ne kadar emin oldugunu soyler. Tibbi tani, otonom surus, guvenlik-kritik sistemler icin "bilmiyorum" gecerli — bazen zorunlu — bir cikti. Iki tur: <strong>aleatoric</strong> (veri gurultu, azalmaz) ve <strong>epistemic</strong> (model belirsizligi, daha fazla veri ile azalir).</p>'},
        {'title':'Bayesci Sinir Aglari Kurulum','body':'<p class="l-text">Agirliklari rastgele degisken olarak ele al: nokta tahmini yerine $p(w \\mid \\mathcal{D})$. Tahmini dagilim:</p>$$p(y \\mid x, \\mathcal{D}) = \\int p(y \\mid x, w)\\, p(w \\mid \\mathcal{D})\\, dw$$<p class="l-text">Uc yol: MCMC (kesin, yavas), VI (olceklenebilir, yanli), topluluklar (genellikle en iyi pratik).</p>'},
        {'title':'SGLD — Stokastik Gradyan Langevin','body':'<p class="l-text">Welling-Teh 2011 SGD\'ye Gauss gurultu enjekte eder: $w_{t+1} = w_t - \\eta_t \\nabla \\log p(w \\mid \\mathcal{D}) + \\sqrt{2\\eta_t}\\, \\varepsilon_t$. $\\eta_t \\to 0$ olduğunda örnekler gerçek posteriora yaklaşır.</p>'},
        {'title':'Monte Carlo Dropout','body':'<p class="l-text">Gal-Ghahramani 2016. Cikarimda dropout AKTIF tut, $K$ ileri gecis yap:</p>$$\\hat{y} = \\frac{1}{K}\\sum_k f_{w_k}(x), \\qquad \\hat{\\sigma}^2 = \\frac{1}{K}\\sum_k (f_{w_k}(x) - \\hat{y})^2$$<p class="l-text">Mevcut aga 1 satir degisiklik. Sifir yeniden egitim maliyeti. Iyi belirsizlik tahminleri.</p>'},
        {'title':'Derin Topluluklar','body':'<p class="l-text">Lakshminarayanan 2017. Farkli tohumlarla $K$ bagimsiz ag egit. Ortalama ± std tahmin + belirsizlik. Pratikte Bayes yontemleri gecer (Ovadia 2019). SGD gercekten farkli modlar bulur.</p>'},
        {'title':'Kalibrasyon & Guvenilirlik','body':'<p class="l-text">"%70 emin" %70 dogruysa kalibre. Modern DNN tipik <strong>asiri guvenli</strong> (Guo 2017). Sicaklik olcekleme: logitleri $T > 1$ ile bol, dogrulama NLL minimize et.</p>'},
        {'title':'RLHF — Odul Modelleme','body':'<p class="l-text">(1) Insan ikili tercihleri topla. (2) Bradley-Terry ile odul $R_\\phi$ egit: $P(y_a \\succ y_b) = \\sigma(R(x,y_a) - R(x,y_b))$. (3) LLM\'i KL cezasi ile PPO uzerinden optimize et. Odul modeli BIR Bayesci tercih toplayicisi.</p>'},
        {'title':'Diffusion = Tavlanmis MCMC','body':'<p class="l-text">Skor tabanli modeller Langevin ile orneklenir: $x_{t+1} = x_t + (\\eta/2) \\nabla \\log p(x_t) + \\sqrt{\\eta}\\, \\varepsilon_t$. Bu MCMC! Diffusion ters SDE\'si tavlanmis Langevin. Diffeq L6 hepsini birlestirir.</p>'},
        {'title':'Bayesci Optimizasyon','body':'<p class="l-text">Hiperparametre ayarlamayi Bayes cikarim olarak kur. Gauss Surec onseli koy, her denemeden sonra posterioru guncelle. Kazanim fonksiyonu (EI, UCB, Thompson) ile sonraki denemeyi sec. Google Vizier, SigOpt, AutoML.</p>'},
        {'title':'Olasiliksal Programlama Dilleri','body':'<div class="calc-cards"><div class="calc-card"><div class="card-title">Pyro/NumPyro</div><p>PyTorch/JAX. ML-stili Bayes. NUTS hizli.</p></div><div class="calc-card"><div class="card-title">Stan</div><p>Istatistikci favorisi. Olgun.</p></div><div class="calc-card"><div class="card-title">PyMC</div><p>Pythonic. Kolay ogrenme. Prototipleme.</p></div></div>'},
        {'title':'Acik Problemler','body':'<p class="l-text">Bayes\'i temel modellere olceklemek: LoRA-Bayes, LLM kalibrasyonu (Lin 2024), ajansal sistemler. LLM\'ler onemli kararlar verirken ne-bilmedigini-bilmek zorunlu.</p>'},
    ],
})

# discrete/L6 - Knowledge Graphs & Dependency Parsing
LESSONS.append({
    'track': 'discrete', 'num': 6, 'module': 'DISCRETE_L6',
    'outcomes_en':['Understand RDF triples and graph database basics','Implement TransE/ComplEx knowledge graph embedding','See dependency parses as graphs and how transformers learn them','Use knowledge graphs for retrieval-augmented generation (RAG)','Recognize Wikidata, ConceptNet, ATOMIC use cases','Connect discrete graph structure to modern LLM reasoning'],
    'outcomes_tr':['RDF uclulerini ve cizge veritabani temellerini anlama','TransE/ComplEx bilgi grafi gomulmesi uygulama','Bagimlilik analizini cizge olarak gorme','Bilgi graflari ile RAG kullanma','Wikidata, ConceptNet, ATOMIC kullanim alanlari','Ayrik cizge yapisini modern LLM akil yurutmesine baglama'],
    'sections_en':[
        {'title':'What Is a Knowledge Graph?','body':'<p class="l-text">A knowledge graph stores facts as <strong>triples</strong>: (head, relation, tail). Example: (Einstein, born_in, Ulm), (Ulm, in_country, Germany). Mathematically: a directed multigraph where edges are typed (labeled with relation). Wikidata has ~100M entities, ~1B triples. ConceptNet has 8M concepts. Domain-specific KGs power Siri, Alexa, Google Search.</p>'},
        {'title':'RDF and SPARQL','body':'<p class="l-text">Resource Description Framework (RDF) standardizes triples with URIs as identifiers. SPARQL is the query language: <code>SELECT ?x WHERE { ?x &lt;born_in&gt; &lt;Germany&gt; }</code>. Graph databases (Neo4j, RDFlib, Amazon Neptune) provide storage and traversal.</p>'},
        {'title':'KG Embedding: TransE (Bordes 2013)','body':'<p class="l-text">Embed entities $h, t$ and relation $r$ in $\\mathbb{R}^d$ so that $h + r \\approx t$ for true triples. Loss:</p>$$\\sum_{(h,r,t) \\in \\mathcal{T}} \\max(0, \\gamma + \\|h+r-t\\| - \\|h\'+r-t\'\\|)$$<p class="l-text">where $(h\',r,t\')$ is a corrupted (negative) triple. Limitations: cannot model 1-to-N, N-to-N relations well.</p>'},
        {'title':'Advanced KG Embeddings','body':'<p class="l-text"><strong>ComplEx</strong> (Trouillon 2016): complex-valued embeddings handle asymmetric relations. <strong>RotatE</strong> (Sun 2019): relation as rotation in complex plane. <strong>GNN-based</strong> (R-GCN, CompGCN): relational message passing.</p>'},
        {'title':'Dependency Parsing','body':'<p class="l-text">Each sentence becomes a tree: words = nodes, syntactic relations = labeled edges. Example: "The cat sat on the mat" → cat ←nsubj← sat →obl→ mat. Used in NLP for semantic role labeling, machine translation, information extraction. Stanford CoreNLP, spaCy provide off-the-shelf parsers.</p>'},
        {'title':'Transformer Attention IS a Graph','body':'<p class="l-text">A transformer\'s attention matrix can be read as a fully-connected directed weighted graph between tokens. Different heads attend to different syntactic/semantic relations. Research (Clark 2019, Manning 2020) shows attention heads recover dependency structures without explicit supervision.</p>'},
        {'title':'Graph-RAG (Microsoft 2024)','body':'<p class="l-text">Naive RAG retrieves text chunks via vector similarity. <strong>Graph-RAG</strong> first builds a knowledge graph from the corpus (extract entities + relations using an LLM), then traverses the graph during retrieval. Result: better global reasoning over long documents.</p>'},
        {'title':'Connection to GNNs (Lesson 5)','body':'<p class="l-text">Knowledge graphs are inputs to relational GNNs (R-GCN, Schlichtkrull 2018). Spectral graph theory (L5) provides the math; KGs provide the data. Output: entity embeddings useful for downstream tasks (recommendation, link prediction, NER refinement).</p>'},
    ],
    'sections_tr':[
        {'title':'Bilgi Grafi Nedir?','body':'<p class="l-text">Bir bilgi grafi gercekleri <strong>ucluler</strong> olarak depolar: (bas, iliski, kuyruk). Ornek: (Einstein, dogdugu, Ulm). Matematiksel olarak: kenarlari tipli yonlu cogul-grafik. Wikidata ~100M varlık, ~1B ucle sahip. Siri, Alexa, Google Arama bunlarla guclendirilir.</p>'},
        {'title':'RDF ve SPARQL','body':'<p class="l-text">RDF, URI\'lari tanimlayici olarak kullanarak ucluleri standartlastirir. SPARQL sorgu dili: <code>SELECT ?x WHERE { ?x &lt;dogdugu&gt; &lt;Almanya&gt; }</code>. Cizge veritabanlari (Neo4j, Amazon Neptune) depolama saglar.</p>'},
        {'title':'KG Gomme: TransE (Bordes 2013)','body':'<p class="l-text">$h, t$ varliklarini ve $r$ iliskisini $\\mathbb{R}^d$\'ye goms ki gercek ucluler icin $h + r \\approx t$. Kayip:</p>$$\\sum_{(h,r,t) \\in \\mathcal{T}} \\max(0, \\gamma + \\|h+r-t\\| - \\|h\'+r-t\'\\|)$$<p class="l-text">burada $(h\',r,t\')$ bozulmus (negatif) bir ucle. Kisitlar: 1-N, N-N iliskileri iyi modelleyemez.</p>'},
        {'title':'Gelismis KG Gomulmeleri','body':'<p class="l-text"><strong>ComplEx</strong> (Trouillon 2016): karmasik-degerli gomulmeler asimetrik iliskileri ele alir. <strong>RotatE</strong> (Sun 2019): iliski karmasik duzlemde donme. <strong>GNN-tabanli</strong> (R-GCN, CompGCN): iliskisel mesaj geciyor.</p>'},
        {'title':'Bagimlilik Ayristirma','body':'<p class="l-text">Her cumle bir agac olur: kelimeler = dugum, sentaktik iliskiler = etiketli kenar. Stanford CoreNLP, spaCy hazir ayristiricilar saglar.</p>'},
        {'title':'Transformer Dikkati BIR Cizgedir','body':'<p class="l-text">Bir transformer\'in dikkat matrisi tokenler arasinda tam-bagli yonlu agirlikli cizge olarak okunabilir. Farkli kafalar farkli sentaktik/semantik iliskilere dikkat eder. Clark 2019 dikkat kafalarinin acik denetim olmadan bagimlilik yapilarini kurtardigini gosterdi.</p>'},
        {'title':'Graph-RAG (Microsoft 2024)','body':'<p class="l-text">Naif RAG, vektor benzerligi ile metin parcalarini cikarir. <strong>Graph-RAG</strong> once corpus\'tan bilgi grafi insa eder (LLM ile varlik + iliski cikar), sonra cikarim sirasinda grafi gezer. Sonuc: uzun belgeler uzerinde daha iyi kuresel akil yurutme.</p>'},
        {'title':'GNN\'lerle Baglanti','body':'<p class="l-text">Bilgi graflari iliskisel GNN\'lere (R-GCN, Schlichtkrull 2018) giridir. Spektral cizge teorisi (L5) matematigi saglar; KG\'ler veriyi saglar.</p>'},
    ],
})

# complex/L4 - Complex Integration & Cauchy Theorem
LESSONS.append({
    'track':'complex','num':4,'module':'COMPLEX_L4',
    'outcomes_en':['Compute contour integrals along smooth curves','State and apply Cauchy\'s integral theorem','Use Cauchy\'s integral formula for values and derivatives','Understand contour deformation and homotopy','See why analytic functions are determined by boundary values','Connect complex integration to fluid dynamics and EM'],
    'outcomes_tr':['Duzgun egriler boyunca kontur integralleri hesaplama','Cauchy integral teoremi ifade edip uygulama','Cauchy integral formulunu deger ve turev icin kullanma','Kontur deformasyonu ve homotopiyi anlama','Analitik fonksiyonlarin neden sinir degerleriyle belirlendigini','Karmasik integrali akiskanlar ve EM\'e baglama'],
    'sections_en':[
        {'title':'Contour Integrals','body':'<p class="l-text">A contour is a piecewise-smooth oriented curve $\\gamma: [a,b] \\to \\mathbb{C}$. The contour integral of $f$ along $\\gamma$ is:</p>$$\\int_\\gamma f(z)\\, dz = \\int_a^b f(\\gamma(t)) \\gamma\'(t)\\, dt$$<p class="l-text">Generalizes the real integral but path matters: different paths between same endpoints may give different values.</p>'},
        {'title':'Worked Example: Path Dependence','body':'<p class="l-text">For $f(z) = 1/z$ and a circle around origin: $\\int_{|z|=r} dz/z = 2\\pi i$ (counter-clockwise). For a circle NOT enclosing origin: 0. So path matters when $f$ has singularities inside.</p>'},
        {'title':'Cauchy\'s Theorem','body':'<p class="l-text">If $f$ is holomorphic in a simply-connected region $D$ and $\\gamma$ is a closed contour in $D$:</p>$$\\oint_\\gamma f(z)\\, dz = 0$$<p class="l-text">Proof sketch: by Cauchy-Riemann (L3), $f\'$ exists; apply Green\'s theorem in the plane. <strong>Profound consequence</strong>: integrals only "see" singularities — the path can be deformed freely as long as no singularity is crossed.</p>'},
        {'title':'Contour Deformation','body':'<p class="l-text">If $\\gamma_1, \\gamma_2$ are homotopic in the domain of holomorphy, $\\int_{\\gamma_1} f = \\int_{\\gamma_2} f$. So we can deform paths to convenient ones (e.g., circles around singularities).</p>'},
        {'title':'Cauchy\'s Integral Formula','body':'<p class="l-text">If $f$ holomorphic on/inside closed contour $\\gamma$ enclosing $z_0$:</p>$$f(z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz$$<p class="l-text"><strong>Mind-blowing</strong>: the value of $f$ at an interior point is determined by its values on the boundary. Real-valued analogs don\'t exist — this is uniquely complex.</p>'},
        {'title':'Generalized Formula for Derivatives','body':'<p class="l-text">$$f^{(n)}(z_0) = \\frac{n!}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^{n+1}}\\, dz$$<p class="l-text">All derivatives — and hence the Taylor series — are determined by boundary values. This proves <strong>holomorphic = analytic</strong>.</p>'},
        {'title':'Maximum Modulus Principle','body':'<p class="l-text">A non-constant holomorphic function on a connected open set cannot attain a local maximum of $|f|$ in the interior. Maximum is always on the boundary. Sharply restrictive — used in proving uniqueness theorems.</p>'},
        {'title':'Applications','body':'<p class="l-text">Cauchy formulas underpin: solving 2D Laplace equation (electrostatics, fluid flow), wing aerodynamics (Joukowski transform), conformal field theory in physics, signal processing transforms. Brief mention of the next step (L5 residues).</p>'},
    ],
    'sections_tr':[
        {'title':'Kontur Integralleri','body':'<p class="l-text">Kontur, parcali-duzgun yonlu bir egri $\\gamma: [a,b] \\to \\mathbb{C}$. $f$\'nin $\\gamma$ boyunca kontur integrali:</p>$$\\int_\\gamma f(z)\\, dz = \\int_a^b f(\\gamma(t)) \\gamma\'(t)\\, dt$$<p class="l-text">Reel integrali genellestirir ama yol onemli: ayni uc noktalar arasinda farkli yollar farkli degerler verebilir.</p>'},
        {'title':'Islenmis Ornek: Yola Bagimlilik','body':'<p class="l-text">$f(z) = 1/z$ ve orjin etrafinda cember icin: $\\int_{|z|=r} dz/z = 2\\pi i$ (saat yonunun tersi). Orjini icermeyen cember icin: 0. Yani $f$\'nin singularitesi icerideyse yol onemli.</p>'},
        {'title':'Cauchy Teoremi','body':'<p class="l-text">$f$, basit-bagli bolge $D$\'de holomorfik ve $\\gamma$, $D$\'de kapali konturse:</p>$$\\oint_\\gamma f(z)\\, dz = 0$$<p class="l-text"><strong>Derin sonuc</strong>: integraller sadece singulariteleri "gorur" — hicbir singularite gecilmedikce yol serbestce deforme edilebilir.</p>'},
        {'title':'Kontur Deformasyonu','body':'<p class="l-text">$\\gamma_1, \\gamma_2$ holomorfik bolgede homotopikse, $\\int_{\\gamma_1} f = \\int_{\\gamma_2} f$. Boylece yollari uygun olanlara deforme edebiliriz.</p>'},
        {'title':'Cauchy Integral Formulu','body':'<p class="l-text">$f$, $z_0$\'i iceren kapali kontur $\\gamma$ uzerinde/icinde holomorfikse:</p>$$f(z_0) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z - z_0}\\, dz$$<p class="l-text"><strong>Sasirtici</strong>: $f$\'nin ic noktadaki degeri sinir degerleriyle belirlenir.</p>'},
        {'title':'Turevler icin Genel Formul','body':'<p class="l-text">$$f^{(n)}(z_0) = \\frac{n!}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{(z - z_0)^{n+1}}\\, dz$$<p class="l-text">Tum turevler — ve dolayisiyla Taylor serisi — sinir degerleriyle belirlenir. Bu <strong>holomorfik = analitik</strong> kanitlar.</p>'},
        {'title':'Maksimum Modulus Ilkesi','body':'<p class="l-text">Bagli acik kumede sabit olmayan holomorfik fonksiyon, icte $|f|$\'in yerel maksimumuna ulasamaz. Maksimum her zaman sinirdadir. Tekillik teoremleri kanitlamada kullanilir.</p>'},
        {'title':'Uygulamalar','body':'<p class="l-text">Cauchy formulleri: 2D Laplace denklemi (elektrostatik, akiskan akisi), kanat aerodinamigi (Joukowski donusumu), fizikteki konform alan teorisi.</p>'},
    ],
})

# complex/L5 - Residue Theorem & Real Integrals
LESSONS.append({
    'track':'complex','num':5,'module':'COMPLEX_L5',
    'outcomes_en':['Classify isolated singularities (removable, pole, essential)','Compute residues at simple and higher-order poles','Apply the residue theorem to closed contours','Evaluate real definite integrals using contour integration','Compute Fourier inverse transforms via residues','Connect residues to inverse Laplace transforms'],
    'outcomes_tr':['Izole singulariteleri siniflandirma (kaldirilabilir, kutup, esansiyel)','Basit ve yuksek mertebe kutuplarda rezidu hesaplama','Rezidu teoremini kapali konturlara uygulama','Kontur integrali kullanarak reel belirli integralleri hesaplama','Rezidulerle Fourier ters donusumu hesaplama','Reziduleri ters Laplace donusumlerine baglama'],
    'sections_en':[
        {'title':'Isolated Singularities','body':'<p class="l-text">If $f$ is holomorphic in a punctured neighborhood of $z_0$ but not at $z_0$, $z_0$ is an isolated singularity. Three types based on the Laurent series $f(z) = \\sum_{n=-\\infty}^\\infty c_n (z-z_0)^n$:</p><ul><li><strong>Removable</strong>: all $c_n = 0$ for $n &lt; 0$. Example: $\\sin(z)/z$ at $z=0$.</li><li><strong>Pole of order $k$</strong>: $c_{-k} \\neq 0$, $c_n = 0$ for $n &lt; -k$. Example: $1/(z-1)^3$ at $z=1$.</li><li><strong>Essential</strong>: infinitely many negative-power terms. Example: $e^{1/z}$ at $z=0$.</li></ul>'},
        {'title':'The Residue','body':'<p class="l-text">For isolated singularity $z_0$, the residue is $\\mathrm{Res}(f, z_0) = c_{-1}$ — the coefficient of $(z-z_0)^{-1}$ in Laurent series. Computational formulas:</p><ul><li><strong>Simple pole</strong>: $\\mathrm{Res}(f, z_0) = \\lim_{z \\to z_0}(z-z_0) f(z)$.</li><li><strong>Pole of order $k$</strong>: $\\mathrm{Res}(f, z_0) = \\frac{1}{(k-1)!} \\lim_{z \\to z_0} \\frac{d^{k-1}}{dz^{k-1}} [(z-z_0)^k f(z)]$.</li></ul>'},
        {'title':'The Residue Theorem','body':'<p class="l-text">If $f$ meromorphic (holomorphic except for isolated poles) in simply-connected $D$, $\\gamma$ closed positively-oriented contour in $D$ enclosing finitely many poles $z_1, \\dots, z_k$:</p>$$\\oint_\\gamma f(z)\\, dz = 2\\pi i \\sum_{j=1}^k \\mathrm{Res}(f, z_j)$$<p class="l-text">This is THE workhorse — converts a complex integral into a finite sum of residues.</p>'},
        {'title':'Worked Example: Computing a Residue','body':'<p class="l-text">$f(z) = \\frac{z^2 + 1}{z(z-2)^2}$. Simple pole at $z=0$: $\\mathrm{Res}(f, 0) = \\lim_{z\\to 0} z \\cdot \\frac{z^2+1}{z(z-2)^2} = \\frac{1}{4}$. Order-2 pole at $z=2$: $\\mathrm{Res}(f, 2) = \\lim_{z\\to 2} \\frac{d}{dz}\\left[\\frac{z^2+1}{z}\\right] = \\lim \\frac{z^2 - 1}{z^2} = \\frac{3}{4}$.</p>'},
        {'title':'Real Integral via Residues — Trigonometric','body':'<p class="l-text">$\\int_0^{2\\pi} \\frac{d\\theta}{2 + \\cos\\theta}$. Substitute $z = e^{i\\theta}$, $d\\theta = dz/(iz)$, $\\cos\\theta = (z + 1/z)/2$. Integral becomes contour integral over $|z|=1$. Find residues inside, multiply by $2\\pi i$. Answer: $2\\pi/\\sqrt{3}$.</p>'},
        {'title':'Real Improper Integral','body':'<p class="l-text">$\\int_{-\\infty}^{\\infty} \\frac{dx}{1+x^2}$. Close contour with upper semicircle (radius $R \\to \\infty$). Only pole inside: $z=i$. Residue $= 1/(2i)$. Integral $= 2\\pi i \\cdot 1/(2i) = \\pi$. Verify: classical answer is $\\pi$ (arctan). Residues makes it trivial.</p>'},
        {'title':'Fourier Inverse via Residues','body':'<p class="l-text">For $\\hat{f}(\\omega) = 1/(1+\\omega^2)$, the inverse Fourier integral $f(t) = (1/2\\pi)\\int_{-\\infty}^\\infty e^{i\\omega t}/(1+\\omega^2)\\, d\\omega$ closes contour above (for $t > 0$). Pole at $\\omega = i$ inside. Answer: $f(t) = \\frac{1}{2} e^{-|t|}$. Residue calculus makes Fourier inverses tractable.</p>'},
        {'title':'Inverse Laplace via Bromwich Contour','body':'<p class="l-text">Inverse Laplace is $\\mathcal{L}^{-1}\\{F(s)\\} = (1/2\\pi i)\\int_{c-i\\infty}^{c+i\\infty} F(s) e^{st}\\, ds$. Close to the left, pick up residues at poles. Standard inverse Laplace table (Fourier L6) is computed via residues.</p>'},
    ],
    'sections_tr':[
        {'title':'Izole Singulariteler','body':'<p class="l-text">$f$, $z_0$\'in delik komsuluğunda holomorfik ama $z_0$\'da degilse, $z_0$ izole singularitedir. Laurent serisine gore uc tur: <strong>Kaldirilabilir</strong>, <strong>$k$ mertebeli kutup</strong>, <strong>Esansiyel</strong>.</p>'},
        {'title':'Rezidu','body':'<p class="l-text">Izole singularite $z_0$ icin, rezidu $\\mathrm{Res}(f, z_0) = c_{-1}$ — Laurent serisinde $(z-z_0)^{-1}$ katsayisi. <strong>Basit kutup</strong>: $\\mathrm{Res}(f, z_0) = \\lim_{z \\to z_0}(z-z_0) f(z)$. <strong>$k$ mertebeli kutup</strong>: $\\mathrm{Res}(f, z_0) = \\frac{1}{(k-1)!} \\lim_{z \\to z_0} \\frac{d^{k-1}}{dz^{k-1}} [(z-z_0)^k f(z)]$.</p>'},
        {'title':'Rezidu Teoremi','body':'<p class="l-text">$f$ meromorfik, $\\gamma$ kapali pozitif yonlu kontur, sonlu sayida kutup $z_1, \\dots, z_k$ icerir:</p>$$\\oint_\\gamma f(z)\\, dz = 2\\pi i \\sum_{j=1}^k \\mathrm{Res}(f, z_j)$$<p class="l-text">Bu IS atı — karmasik integrali sonlu reziduler toplamına çevirir.</p>'},
        {'title':'Islenmis Ornek: Rezidu Hesaplama','body':'<p class="l-text">$f(z) = \\frac{z^2 + 1}{z(z-2)^2}$. $z=0$\'da basit kutup: $\\mathrm{Res}(f, 0) = \\frac{1}{4}$. $z=2$\'de mertebe-2 kutup: $\\mathrm{Res}(f, 2) = \\frac{3}{4}$.</p>'},
        {'title':'Rezidulerle Reel Integral — Trigonometrik','body':'<p class="l-text">$\\int_0^{2\\pi} \\frac{d\\theta}{2 + \\cos\\theta}$. $z = e^{i\\theta}$ koy. Integral $|z|=1$ uzerinde kontur integraline doner. Reziduleri $2\\pi i$ ile carp. Cevap: $2\\pi/\\sqrt{3}$.</p>'},
        {'title':'Reel Has Olmayan Integral','body':'<p class="l-text">$\\int_{-\\infty}^{\\infty} \\frac{dx}{1+x^2}$. Yarim-cember ile konturu kapat ($R \\to \\infty$). Sadece icerideki kutup: $z=i$. Cevap: $\\pi$ (arctan klasik sonucuyla tutarli).</p>'},
        {'title':'Fourier Tersi Reziduler ile','body':'<p class="l-text">$\\hat{f}(\\omega) = 1/(1+\\omega^2)$ icin ters Fourier yukaridan konturu kapat. $\\omega = i$ kutbu iceride. Cevap: $f(t) = \\frac{1}{2} e^{-|t|}$. Rezidu hesabi Fourier terslerini cozdurur.</p>'},
        {'title':'Bromwich Konturu ile Ters Laplace','body':'<p class="l-text">Ters Laplace $\\mathcal{L}^{-1}\\{F(s)\\}$. Sola kapat, kutuplardaki reziduleri topla. Standart ters Laplace tablosu (Fourier L6) reziduler ile hesaplanir.</p>'},
    ],
})

# complex/L6 - Conformal Maps & Applications
LESSONS.append({
    'track':'complex','num':6,'module':'COMPLEX_L6',
    'outcomes_en':['Recognize conformal maps as angle-preserving holomorphic functions','Apply Mobius transformations on the complex plane','Use Joukowski transform for airfoil design','Solve 2D potential flow problems via complex analysis','See the Riemann Mapping Theorem in action','Connect conformal maps to 2D physics and graphics'],
    'outcomes_tr':['Konform donusumleri aci-koruyan holomorfik fonksiyonlar olarak tanima','Mobius donusumlerini karmasik duzlemde uygulama','Kanat tasarimi icin Joukowski donusumu kullanma','Karmasik analiz ile 2D potansiyel akis problemleri','Riemann Donusum Teoremini gorme','Konform donusumleri 2D fizik ve grafige baglama'],
    'sections_en':[
        {'title':'Conformal Maps — Definition','body':'<p class="l-text">A map $f: U \\to V$ is conformal at $z_0$ if it preserves both magnitudes of angles and orientation between intersecting curves. <strong>Theorem</strong>: $f$ is conformal at $z_0$ iff $f$ is holomorphic at $z_0$ and $f\'(z_0) \\neq 0$. This is the geometric soul of holomorphic functions.</p>'},
        {'title':'Why Holomorphic = Angle-Preserving','body':'<p class="l-text">Locally near $z_0$, $f(z) \\approx f(z_0) + f\'(z_0)(z - z_0)$. Multiplication by $f\'(z_0) \\in \\mathbb{C}^*$ = rotation by $\\arg f\'(z_0)$ + scaling by $|f\'(z_0)|$. Pure rotation + scaling preserves angles. Real-differentiability is not enough — you need the Cauchy-Riemann constraint.</p>'},
        {'title':'Mobius Transformations','body':'<p class="l-text">$f(z) = \\frac{az + b}{cz + d}$ with $ad - bc \\neq 0$. These are the only conformal maps of the Riemann sphere $\\hat{\\mathbb{C}}$ to itself. Map circles/lines to circles/lines. Examples: translation $z \\mapsto z + b$, scaling/rotation $z \\mapsto az$, inversion $z \\mapsto 1/z$.</p>'},
        {'title':'Cayley Transform','body':'<p class="l-text">$f(z) = (z - i)/(z + i)$ maps upper half-plane to unit disk. Beautiful: turns unbounded domains into bounded ones. Used in numerical analysis (stability regions) and complex analysis proofs.</p>'},
        {'title':'Joukowski Transform & Airfoils','body':'<p class="l-text">$J(z) = z + 1/z$. Maps circles around the origin to ellipses/airfoil shapes. With shifted circles, produces realistic wing cross-sections. Used in classical aerodynamics to compute lift via Kutta-Joukowski theorem.</p>'},
        {'title':'2D Potential Flow','body':'<p class="l-text">Incompressible irrotational fluid in 2D has velocity field $\\mathbf{v} = \\nabla \\phi$ where $\\phi$ harmonic. Combine with stream function $\\psi$ (harmonic conjugate) into complex potential $\\Omega(z) = \\phi + i\\psi$ — holomorphic! Conformal maps transport flow solutions: solve simple geometry (uniform flow past disk), conformal-map to complex geometry (flow past airfoil).</p>'},
        {'title':'Riemann Mapping Theorem','body':'<p class="l-text">Any non-empty simply-connected open subset of $\\mathbb{C}$ (other than $\\mathbb{C}$ itself) is conformally equivalent to the open unit disk. <strong>Astonishing</strong>: any "nice" 2D shape, no matter how complicated, can be conformally mapped to a disk. Algorithmic constructions exist (Schwarz-Christoffel).</p>'},
        {'title':'Modern Applications','body':'<p class="l-text">Conformal maps power: brain surface flattening for neuroimaging analysis, mesh parameterization in 3D graphics, conformal field theory in physics, conformal welding for image processing. Software: Conformal Map Library, Computational Conformal Geometry (Gu).</p>'},
    ],
    'sections_tr':[
        {'title':'Konform Donusumler — Tanim','body':'<p class="l-text">$f: U \\to V$ haritasi $z_0$\'da konformsa, kesisen egriler arasindaki aci buyukluk ve yonunu korur. <strong>Teorem</strong>: $f$ $z_0$\'da konformdur ancak ve ancak $f$ $z_0$\'da holomorfik ve $f\'(z_0) \\neq 0$. Holomorfik fonksiyonlarin geometrik ruhu.</p>'},
        {'title':'Holomorfik = Aci-Koruyan','body':'<p class="l-text">$z_0$\'a yakin, $f(z) \\approx f(z_0) + f\'(z_0)(z - z_0)$. $f\'(z_0)$ ile carpma = donme + olcekleme. Saf donme + olcekleme acilari korur. Cauchy-Riemann olmadan reel-turevlenebilirlik yetmez.</p>'},
        {'title':'Mobius Donusumleri','body':'<p class="l-text">$f(z) = \\frac{az + b}{cz + d}$, $ad - bc \\neq 0$. Riemann kuresinin kendisine olan tek konform haritalari. Cember/dogru -> cember/dogru.</p>'},
        {'title':'Cayley Donusumu','body':'<p class="l-text">$f(z) = (z - i)/(z + i)$ ust yari-duzlemi birim diske haritalar. Guzel: sinirsiz bolgeleri sinirli olanlara cevirir.</p>'},
        {'title':'Joukowski Donusumu & Kanatlar','body':'<p class="l-text">$J(z) = z + 1/z$. Orjin etrafindaki cemberleri elips/kanat sekillerine haritalar. Kutta-Joukowski teoremi ile kaldirma kuvveti hesaplamak icin klasik aerodinamikte kullanilir.</p>'},
        {'title':'2D Potansiyel Akis','body':'<p class="l-text">2D sikistirilamaz dolanimsiz akiskanin hiz alani $\\mathbf{v} = \\nabla \\phi$, $\\phi$ harmonik. Akim fonksiyonu $\\psi$ (harmonik eslenik) ile karmasik potansiyel $\\Omega(z) = \\phi + i\\psi$ — holomorfik! Konform haritalar akis cozumlerini tasir.</p>'},
        {'title':'Riemann Donusum Teoremi','body':'<p class="l-text">$\\mathbb{C}$\'nin bos olmayan basit-bagli acik alt kumesi ($\\mathbb{C}$\'nin kendisi haric) acik birim diske konform olarak esdegerdir. <strong>Sasirtici</strong>: ne kadar karmasik olursa olsun, herhangi bir "guzel" 2D sekil diske konform olarak haritalanabilir.</p>'},
        {'title':'Modern Uygulamalar','body':'<p class="l-text">Konform haritalar: norogoruntuleme analizi icin beyin yuzeyi duzlestirme, 3D grafikte mesh parametrizasyonu, fizikteki konform alan teorisi, goruntu isleme icin konform kaynak.</p>'},
    ],
})

# calculus/L7 - Lagrange Multipliers
LESSONS.append({
    'track':'calculus','num':7,'module':'CALCULUS_L7',
    'outcomes_en':['Solve constrained optimization with Lagrange multipliers','Derive KKT conditions for inequality constraints','Apply SVM dual via Lagrange formulation','Use Lagrange for maximum-entropy distributions','Connect constrained optimization to economics and ML','Implement basic constrained solvers'],
    'outcomes_tr':['Lagrange carpanlari ile kisitli optimizasyon cozme','Esitsizlik kisitlari icin KKT kosullari turetme','Lagrange formulasyonu ile SVM ikilemini uygulama','Maksimum entropili dagilimlar icin Lagrange kullanma','Kisitli optimizasyonu ekonomi ve ML\'e baglama','Temel kisitli cozucu uygulama'],
    'sections_en':[
        {'title':'The Problem','body':'<p class="l-text">Minimize $f(x)$ subject to $g(x) = 0$. Naive gradient descent ignores the constraint. Need a way to find extrema ON the constraint manifold.</p>'},
        {'title':'Geometric Intuition','body':'<p class="l-text">At an extremum, the gradient of $f$ must be perpendicular to the constraint surface — i.e., parallel to $\\nabla g$. So $\\nabla f = \\lambda \\nabla g$ for some scalar $\\lambda$ (Lagrange multiplier).</p>'},
        {'title':'The Lagrangian','body':'<p class="l-text">Define $\\mathcal{L}(x, \\lambda) = f(x) - \\lambda \\, g(x)$. Stationary points satisfy:</p>$$\\nabla_x \\mathcal{L} = \\nabla f - \\lambda \\nabla g = 0, \\qquad \\nabla_\\lambda \\mathcal{L} = -g(x) = 0$$<p class="l-text">$n + 1$ equations in $n + 1$ unknowns $(x_1, \\dots, x_n, \\lambda)$.</p>'},
        {'title':'Worked Example: Maximize $xy$ on Unit Circle','body':'<p class="l-text">$f(x,y) = xy$, $g(x,y) = x^2 + y^2 - 1$. Lagrangian gradient: $y = 2\\lambda x$, $x = 2\\lambda y$. Together: $y = 4\\lambda^2 y \\Rightarrow \\lambda = \\pm 1/2$. With $x^2 + y^2 = 1$, find $(x,y) = (\\pm 1/\\sqrt{2}, \\pm 1/\\sqrt{2})$ with max $= 1/2$.</p>'},
        {'title':'Multiple Constraints','body':'<p class="l-text">For $m$ constraints $g_1, \\dots, g_m$: $\\mathcal{L} = f - \\sum_j \\lambda_j g_j$. Stationary: $\\nabla f = \\sum_j \\lambda_j \\nabla g_j$. Geometric: $\\nabla f$ lies in span of constraint gradients.</p>'},
        {'title':'Inequality Constraints — KKT Conditions','body':'<p class="l-text">For $\\min f$ s.t. $g(x) \\leq 0$, $h(x) = 0$:</p><ul><li>Primal feasibility: $g \\leq 0$, $h = 0$</li><li>Dual feasibility: $\\mu \\geq 0$</li><li>Stationarity: $\\nabla f + \\mu \\nabla g + \\lambda \\nabla h = 0$</li><li>Complementary slackness: $\\mu g = 0$ (either constraint active or multiplier zero)</li></ul><p class="l-text">These are Karush-Kuhn-Tucker (KKT) conditions, generalizing Lagrange to inequalities.</p>'},
        {'title':'Application: SVM Dual','body':'<p class="l-text">Hard-margin SVM: min $\\frac{1}{2}\\|w\\|^2$ s.t. $y_i (w^T x_i + b) \\geq 1$. Lagrangian:</p>$$\\mathcal{L} = \\frac{1}{2}\\|w\\|^2 - \\sum_i \\alpha_i [y_i(w^T x_i + b) - 1]$$<p class="l-text">Stationarity: $w = \\sum_i \\alpha_i y_i x_i$. Dual problem becomes $\\max_\\alpha \\sum \\alpha_i - \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$ s.t. $\\alpha_i \\geq 0$. The kernel trick replaces $(x_i^T x_j)$ with $K(x_i, x_j)$ — this is THE foundation of kernel SVMs.</p>'},
        {'title':'Application: Maximum Entropy Distribution','body':'<p class="l-text">Among all distributions $p$ with given mean $\\mu$ and variance $\\sigma^2$, the maximum-entropy distribution is Gaussian $\\mathcal{N}(\\mu, \\sigma^2)$. Proof: maximize $-\\int p \\log p$ subject to $\\int p = 1$, $\\int xp = \\mu$, $\\int x^2 p = \\sigma^2 + \\mu^2$. Lagrange gives $p \\propto e^{-\\lambda_1 x - \\lambda_2 x^2}$ — Gaussian form.</p>'},
    ],
    'sections_tr':[
        {'title':'Problem','body':'<p class="l-text">$g(x) = 0$ kisiti altinda $f(x)$\'i minimize et. Naif gradyan inisi kisiti goz ardi eder. Kisit manifoldu UZERINDE ekstremum bulmak icin yontem gerek.</p>'},
        {'title':'Geometrik Sezgi','body':'<p class="l-text">Ekstremumda, $f$\'nin gradyani kisit yuzeyine dik olmali — yani $\\nabla g$\'ye paralel. Yani bir $\\lambda$ (Lagrange carpani) icin $\\nabla f = \\lambda \\nabla g$.</p>'},
        {'title':'Lagrangian','body':'<p class="l-text">$\\mathcal{L}(x, \\lambda) = f(x) - \\lambda \\, g(x)$ tanimla. Duragan noktalar:</p>$$\\nabla_x \\mathcal{L} = \\nabla f - \\lambda \\nabla g = 0, \\qquad \\nabla_\\lambda \\mathcal{L} = -g(x) = 0$$<p class="l-text">$n + 1$ bilinmeyenli $n + 1$ denklem.</p>'},
        {'title':'Islenmis Ornek: Birim Cemberde $xy$ Maks','body':'<p class="l-text">$f(x,y) = xy$, $g(x,y) = x^2 + y^2 - 1$. Lagrangian: $y = 2\\lambda x$, $x = 2\\lambda y$. $\\lambda = \\pm 1/2$. Maks $= 1/2$ noktada $(\\pm 1/\\sqrt{2}, \\pm 1/\\sqrt{2})$.</p>'},
        {'title':'Coklu Kisitlar','body':'<p class="l-text">$m$ kisit icin: $\\mathcal{L} = f - \\sum_j \\lambda_j g_j$. Duragan: $\\nabla f = \\sum_j \\lambda_j \\nabla g_j$.</p>'},
        {'title':'Esitsizlik Kisitlari — KKT','body':'<p class="l-text">$\\min f$ s.t. $g(x) \\leq 0$, $h(x) = 0$ icin: primal yapilabilirlik ($g \\leq 0$, $h = 0$), dual yapilabilirlik ($\\mu \\geq 0$), durganligi ($\\nabla f + \\mu \\nabla g + \\lambda \\nabla h = 0$), tamamlayici gevseklik ($\\mu g = 0$). Bunlar Karush-Kuhn-Tucker (KKT) kosullari.</p>'},
        {'title':'Uygulama: SVM Duali','body':'<p class="l-text">Sert-marjin SVM: min $\\frac{1}{2}\\|w\\|^2$ s.t. $y_i (w^T x_i + b) \\geq 1$. Lagrangian: $\\mathcal{L} = \\frac{1}{2}\\|w\\|^2 - \\sum_i \\alpha_i [y_i(w^T x_i + b) - 1]$. Dual problem: $\\max_\\alpha \\sum \\alpha_i - \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$ s.t. $\\alpha_i \\geq 0$. Cekirdek hilesi $(x_i^T x_j)$\'i $K(x_i, x_j)$ ile degistirir.</p>'},
        {'title':'Uygulama: Maksimum Entropi Dagilimi','body':'<p class="l-text">Verilen $\\mu$ ortalama ve $\\sigma^2$ varyansli tum dagilimlar arasinda, maks-entropi dagilimi Gauss $\\mathcal{N}(\\mu, \\sigma^2)$. Kanit: $-\\int p \\log p$\'yi $\\int p = 1$, $\\int xp = \\mu$, $\\int x^2 p = \\sigma^2 + \\mu^2$ kisitlari altinda maks et. Lagrange $p \\propto e^{-\\lambda_1 x - \\lambda_2 x^2}$ verir.</p>'},
    ],
})

# calculus/L8 - Advanced Vector Analysis
LESSONS.append({
    'track':'calculus','num':8,'module':'CALCULUS_L8',
    'outcomes_en':['Compute divergence, curl, and gradient in 2D/3D','Apply Green, Stokes, and Divergence theorems','Build and use Jacobian and Hessian matrices','Understand vector calculus identities','Connect div/curl to fluid dynamics and EM','See Jacobian-vector products in deep learning backprop'],
    'outcomes_tr':['2D/3D\'de diverjans, rotasyonel, gradyan hesaplama','Green, Stokes, Diverjans teoremlerini uygulama','Jacobian ve Hessian matrislerini insa edip kullanma','Vektor analizi ozdesliklerini anlama','Div/curl\'u akiskanlar ve EM\'e baglama','Derin ogrenme backprop\'ta Jacobian-vektor carpimini gorme'],
    'sections_en':[
        {'title':'Recall: Gradient','body':'<p class="l-text">For scalar $f: \\mathbb{R}^n \\to \\mathbb{R}$: $\\nabla f = (\\partial f/\\partial x_1, \\dots, \\partial f/\\partial x_n)$. Points in direction of steepest increase. Magnitude = rate of change. From calculus L3.</p>'},
        {'title':'Divergence','body':'<p class="l-text">For vector field $\\mathbf{F} = (F_1, F_2, F_3)$: $\\nabla \\cdot \\mathbf{F} = \\partial F_1/\\partial x + \\partial F_2/\\partial y + \\partial F_3/\\partial z$. Scalar output. Physical meaning: rate at which "fluid" flows OUT of a point. Positive divergence = source; negative = sink; zero = incompressible.</p>'},
        {'title':'Curl','body':'<p class="l-text">For $\\mathbf{F}$ in 3D: $\\nabla \\times \\mathbf{F} = (\\partial F_3/\\partial y - \\partial F_2/\\partial z, \\partial F_1/\\partial z - \\partial F_3/\\partial x, \\partial F_2/\\partial x - \\partial F_1/\\partial y)$. Vector output. Physical meaning: local rotation/swirl of the field. Curl of velocity field = vorticity.</p>'},
        {'title':'Identities','body':'<p class="l-text">Useful identities:</p><ul><li>$\\nabla \\times (\\nabla f) = 0$ (curl of gradient is zero)</li><li>$\\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0$ (divergence of curl is zero)</li><li>$\\nabla^2 f = \\nabla \\cdot (\\nabla f)$ (Laplacian = div of grad)</li></ul>'},
        {'title':'Green\'s Theorem (2D)','body':'<p class="l-text">For region $D$ with positively-oriented boundary $\\partial D$:</p>$$\\oint_{\\partial D} (P\\, dx + Q\\, dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$$<p class="l-text">Relates line integral around boundary to area integral over interior. Special case of Stokes.</p>'},
        {'title':'Stokes\' Theorem','body':'<p class="l-text">For surface $S$ with boundary $\\partial S$, vector field $\\mathbf{F}$:</p>$$\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$<p class="l-text">Generalizes Green. Powers electromagnetism (Maxwell\'s equations in integral form).</p>'},
        {'title':'Divergence Theorem','body':'<p class="l-text">For 3D region $V$ with boundary $\\partial V$:</p>$$\\iiint_V \\nabla \\cdot \\mathbf{F}\\, dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S}$$<p class="l-text">Volume integral of divergence = flux through boundary. Foundation of Gauss\'s law, fluid conservation.</p>'},
        {'title':'Jacobian Matrix','body':'<p class="l-text">For $\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^m$, Jacobian $J_\\mathbf{f}$ is $m \\times n$ matrix of partial derivatives:</p>$$J_{ij} = \\frac{\\partial f_i}{\\partial x_j}$$<p class="l-text">Linear approximation: $\\mathbf{f}(\\mathbf{x} + \\Delta\\mathbf{x}) \\approx \\mathbf{f}(\\mathbf{x}) + J_\\mathbf{f}(\\mathbf{x}) \\Delta\\mathbf{x}$. <strong>Reverse-mode autodiff</strong> (backprop) computes vector-Jacobian products $\\mathbf{v}^T J$ efficiently — this IS what PyTorch, JAX do.</p>'},
        {'title':'Hessian Matrix','body':'<p class="l-text">For scalar $f$, Hessian $H_f$ is $n \\times n$ matrix of second partial derivatives:</p>$$H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$$<p class="l-text">Symmetric (mixed partials equal under smoothness). Used in Newton\'s method, second-order optimization, ML curvature analysis. K-FAC, Shampoo approximate Hessian for deep nets.</p>'},
    ],
    'sections_tr':[
        {'title':'Hatirlatma: Gradyan','body':'<p class="l-text">Skalar $f: \\mathbb{R}^n \\to \\mathbb{R}$ icin: $\\nabla f = (\\partial f/\\partial x_1, \\dots, \\partial f/\\partial x_n)$. En dik artis yonunde isaret eder. Buyukluk = degisim orani.</p>'},
        {'title':'Diverjans','body':'<p class="l-text">Vektor alani $\\mathbf{F} = (F_1, F_2, F_3)$ icin: $\\nabla \\cdot \\mathbf{F} = \\partial F_1/\\partial x + \\partial F_2/\\partial y + \\partial F_3/\\partial z$. Skalar cikti. Fiziksel anlam: "akiskan"in noktadan ne hizla DISARI aktigi. Pozitif diverjans = kaynak; negatif = batak.</p>'},
        {'title':'Rotasyonel (Curl)','body':'<p class="l-text">3D\'de $\\mathbf{F}$ icin: $\\nabla \\times \\mathbf{F} = (\\partial F_3/\\partial y - \\partial F_2/\\partial z, \\partial F_1/\\partial z - \\partial F_3/\\partial x, \\partial F_2/\\partial x - \\partial F_1/\\partial y)$. Vektor cikti. Fiziksel anlam: yerel donme. Hiz alaninin rotasyoneli = girdaplilik.</p>'},
        {'title':'Ozdeslikler','body':'<ul><li>$\\nabla \\times (\\nabla f) = 0$</li><li>$\\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0$</li><li>$\\nabla^2 f = \\nabla \\cdot (\\nabla f)$</li></ul>'},
        {'title':'Green Teoremi (2D)','body':'<p class="l-text">$$\\oint_{\\partial D} (P\\, dx + Q\\, dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$$<p class="l-text">Sinir cizgi integralini ic alan integraline baglar.</p>'},
        {'title':'Stokes Teoremi','body':'<p class="l-text">$$\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$<p class="l-text">Green\'i genellestirir. Elektromanyetizmayi (Maxwell denklemleri integral formunda) guclendirir.</p>'},
        {'title':'Diverjans Teoremi','body':'<p class="l-text">$$\\iiint_V \\nabla \\cdot \\mathbf{F}\\, dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S}$$<p class="l-text">Diverjansin hacim integrali = sinirdaki akı. Gauss kanunu, akiskan korunum temeli.</p>'},
        {'title':'Jacobian Matrisi','body':'<p class="l-text">$\\mathbf{f}: \\mathbb{R}^n \\to \\mathbb{R}^m$ icin Jacobian $J_\\mathbf{f}$, $m \\times n$ kismi turev matrisi: $J_{ij} = \\frac{\\partial f_i}{\\partial x_j}$. <strong>Ters mod otomatik turev</strong> (backprop) vektor-Jacobian carpimini $\\mathbf{v}^T J$ verimli hesaplar — PyTorch, JAX bunu yapar.</p>'},
        {'title':'Hessian Matrisi','body':'<p class="l-text">Skalar $f$ icin, Hessian $H_f$ $n \\times n$ ikinci kismi turev matrisi: $H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$. Simetrik. Newton yontemi, ikinci dereceden optimizasyonda kullanilir. K-FAC, Shampoo derin aglar icin Hessian\'i yaklastirir.</p>'},
    ],
})

# linalg/L7 - Float Arithmetic & Numerical Stability
LESSONS.append({
    'track':'linalg','num':7,'module':'LINALG_L7',
    'outcomes_en':['Understand IEEE 754 float32/float16/bfloat16 layouts','Recognize sources of numerical instability','Choose stable algorithms (QR vs normal equations)','Use float16/bfloat16 for ML training (mixed precision)','Debug NaN/Inf in deep learning','Apply gradient clipping and loss scaling'],
    'outcomes_tr':['IEEE 754 float32/16/bf16 yerlesimlerini anlama','Sayisal kararsizlik kaynaklarini taniyabilme','Kararli algoritmalar secme (QR vs normal denklemler)','ML egitiminde float16/bfloat16 kullanma (karisik kesinlik)','Derin ogrenmede NaN/Inf hata ayiklama','Gradyan kirpma ve kayip olcekleme uygulama'],
    'sections_en':[
        {'title':'IEEE 754 Float32','body':'<p class="l-text">32 bits: 1 sign + 8 exponent + 23 mantissa. Represents numbers from $\\approx 1.4 \\times 10^{-45}$ to $\\approx 3.4 \\times 10^{38}$. Machine epsilon: $2^{-23} \\approx 1.19 \\times 10^{-7}$ (relative precision).</p>'},
        {'title':'Float16 and BFloat16','body':'<p class="l-text"><strong>Float16</strong> (1+5+10): range $\\approx \\pm 6.5 \\times 10^4$, eps $\\approx 10^{-3}$. Saves memory + 2× faster on Tensor Cores. Risk: small gradients underflow to 0. <strong>BFloat16</strong> (1+8+7): SAME range as float32, less precision. Designed for ML by Google Brain. Better numerical safety than float16 for training.</p>'},
        {'title':'Sources of Numerical Instability','body':'<ul><li><strong>Catastrophic cancellation</strong>: $1.234567 - 1.234566 = 0.000001$ loses 6 digits of precision</li><li><strong>Overflow</strong>: $e^{1000}$ in float32 → +Inf</li><li><strong>Underflow</strong>: $e^{-100}$ in float16 → 0</li><li><strong>Loss of orthogonality</strong>: matrix algorithms with repeated subtractions</li></ul>'},
        {'title':'Stable Algorithms','body':'<p class="l-text">For least squares $\\min \\|Ax - b\\|^2$, normal equations $A^T A x = A^T b$ are unstable when $A$ is ill-conditioned (condition number squared). <strong>QR decomposition</strong> $A = QR$ then $Rx = Q^T b$ is stable. <strong>SVD</strong> is even more stable but slower. Modern numpy.linalg.lstsq uses SVD by default.</p>'},
        {'title':'Condition Number','body':'<p class="l-text">For matrix $A$: $\\kappa(A) = \\sigma_{\\max}/\\sigma_{\\min}$ (ratio of singular values). Large $\\kappa$ = ill-conditioned. Solving $Ax = b$ amplifies errors by factor $\\kappa$. Rule of thumb: lose $\\log_{10}(\\kappa)$ digits of precision.</p>'},
        {'title':'Log-Sum-Exp Trick','body':'<p class="l-text">$\\log \\sum_i e^{x_i}$ overflows when any $x_i$ is large. Trick:</p>$$\\log \\sum_i e^{x_i} = M + \\log \\sum_i e^{x_i - M}, \\quad M = \\max_i x_i$$<p class="l-text">Used in EVERY softmax/cross-entropy implementation. Essential for numerical stability in NLP/LLM training.</p>'},
        {'title':'Mixed Precision Training (FP16/BF16)','body':'<p class="l-text">Modern training pipeline: weights and gradients in float16 (fast), but maintain a float32 "master copy" of weights for updates. <strong>Loss scaling</strong>: multiply loss by large factor (e.g., $2^{15}$) before backprop so small gradients survive float16; divide gradients before update. NVIDIA Apex, PyTorch AMP do this automatically.</p>'},
        {'title':'Gradient Clipping','body':'<p class="l-text">When gradient norm exceeds threshold $\\tau$, rescale: $g \\leftarrow g \\cdot \\tau / \\|g\\|$. Prevents explosion in RNN/Transformer training. Pairs naturally with float16 — clipping makes loss scaling more reliable.</p>'},
        {'title':'Debugging NaN/Inf','body':'<p class="l-text">Common causes: division by zero, log of negative/zero, exp of large positive, gradients exploding. PyTorch <code>torch.autograd.detect_anomaly()</code> pinpoints the source. Fix: add small eps to denominators, clip gradients, use bfloat16 instead of float16.</p>'},
    ],
    'sections_tr':[
        {'title':'IEEE 754 Float32','body':'<p class="l-text">32 bit: 1 isaret + 8 ustel + 23 mantis. $\\approx 1.4 \\times 10^{-45}$\'dan $\\approx 3.4 \\times 10^{38}$\'a sayilari temsil eder. Makine epsilonu: $2^{-23} \\approx 1.19 \\times 10^{-7}$.</p>'},
        {'title':'Float16 ve BFloat16','body':'<p class="l-text"><strong>Float16</strong> (1+5+10): aralık $\\approx \\pm 6.5 \\times 10^4$, eps $\\approx 10^{-3}$. Bellek tasarrufu + Tensor Core\'larda 2× hizli. Risk: kucuk gradyanlar 0\'a iner. <strong>BFloat16</strong> (1+8+7): float32 ile AYNI aralık, daha az hassasiyet. Google Brain tarafindan ML icin tasarlandi.</p>'},
        {'title':'Sayisal Kararsizlik Kaynaklari','body':'<ul><li><strong>Felaket iptal</strong>: $1.234567 - 1.234566 = 0.000001$ 6 hane hassasiyet kaybeder</li><li><strong>Tasma</strong>: float32\'de $e^{1000}$ → +Inf</li><li><strong>Alttan tasma</strong>: float16\'da $e^{-100}$ → 0</li><li><strong>Diklik kaybi</strong>: tekrarli cikarmalarla matris algoritmalari</li></ul>'},
        {'title':'Kararli Algoritmalar','body':'<p class="l-text">En kucuk kareler $\\min \\|Ax - b\\|^2$ icin, normal denklemler $A^T A x = A^T b$ $A$ kotu kosullandiginda kararsiz (kosul sayisi karelenir). <strong>QR ayristirma</strong> $A = QR$ sonra $Rx = Q^T b$ kararli. <strong>SVD</strong> daha kararli ama yavas. numpy.linalg.lstsq varsayilan SVD kullanir.</p>'},
        {'title':'Kosul Sayisi','body':'<p class="l-text">Matris $A$ icin: $\\kappa(A) = \\sigma_{\\max}/\\sigma_{\\min}$. Buyuk $\\kappa$ = kotu kosullandirilmis. $Ax = b$ cozmek hatalari $\\kappa$ kati artirir. Kural: $\\log_{10}(\\kappa)$ hane hassasiyet kaybedersin.</p>'},
        {'title':'Log-Sum-Exp Hilesi','body':'<p class="l-text">$\\log \\sum_i e^{x_i}$ herhangi bir $x_i$ buyukse tasar. Hile:</p>$$\\log \\sum_i e^{x_i} = M + \\log \\sum_i e^{x_i - M}, \\quad M = \\max_i x_i$$<p class="l-text">HER softmax/cross-entropy uygulamasinda kullanilir. NLP/LLM egitiminde sayisal kararlilik icin esansiyel.</p>'},
        {'title':'Karisik Kesinlik Egitimi (FP16/BF16)','body':'<p class="l-text">Modern boru hatti: agirliklar ve gradyanlar float16\'da (hizli), ancak guncellemeler icin agirligin float32 "ana kopya"si tutulur. <strong>Kayip olcekleme</strong>: backprop oncesi kaybi buyuk faktorle carp (orn: $2^{15}$). NVIDIA Apex, PyTorch AMP otomatik yapar.</p>'},
        {'title':'Gradyan Kirpma','body':'<p class="l-text">Gradyan normu esigi $\\tau$ asarsa, yeniden olcekle: $g \\leftarrow g \\cdot \\tau / \\|g\\|$. RNN/Transformer egitiminde patlamayi onler. Float16 ile dogal calisir.</p>'},
        {'title':'NaN/Inf Hata Ayiklama','body':'<p class="l-text">Yaygin nedenler: sifira bolme, negatif/sifirin logu, buyuk pozitifin exp\'i, gradyan patlamasi. PyTorch <code>torch.autograd.detect_anomaly()</code> kaynagi belirler. Cozum: paydaya kucuk eps ekle, gradyanlari kirp, float16 yerine bfloat16 kullan.</p>'},
    ],
})

# linalg/L8 - Matrix Calculus & Einsum
LESSONS.append({
    'track':'linalg','num':8,'module':'LINALG_L8',
    'outcomes_en':['Compute matrix derivatives and gradient operators','Master einsum notation for tensor operations','Apply Kronecker product and vec operator','Derive matrix calculus identities for ML loss functions','Use efficient batched matrix ops in NumPy/PyTorch','Implement Jacobian-vector products with einsum'],
    'outcomes_tr':['Matris turevleri ve gradyan operatorleri hesaplama','Tensor islemleri icin einsum gosterimine hakim olma','Kronecker carpimi ve vec operatoru uygulama','ML kayip fonksiyonlari icin matris analizi ozdesliklerini turetme','NumPy/PyTorch\'ta verimli toplu matris islemleri','Einsum ile Jacobian-vektor carpimlari uygulama'],
    'sections_en':[
        {'title':'Matrix Calculus Conventions','body':'<p class="l-text">For scalar $f(\\mathbf{x})$: $\\nabla f$ has same shape as $\\mathbf{x}$. For vector $\\mathbf{f}(\\mathbf{x})$: Jacobian shape $m \\times n$ where $m = \\dim(\\mathbf{f})$, $n = \\dim(\\mathbf{x})$. <strong>Numerator layout</strong> (most common in ML): $\\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}}_{ij} = \\partial f_i / \\partial x_j$.</p>'},
        {'title':'Common Identities','body':'<ul><li>$\\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{a}^T \\mathbf{x}) = \\mathbf{a}$</li><li>$\\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = (A + A^T) \\mathbf{x}$</li><li>$\\frac{\\partial}{\\partial \\mathbf{x}} \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = 2 A^T (A\\mathbf{x} - \\mathbf{b})$</li><li>$\\frac{\\partial \\log \\det X}{\\partial X} = X^{-T}$</li><li>$\\frac{\\partial \\text{tr}(AB)}{\\partial A} = B^T$</li></ul>'},
        {'title':'The Einsum Notation','body':'<p class="l-text">Einstein summation: <code>np.einsum("ij,jk->ik", A, B)</code> computes $C_{ik} = \\sum_j A_{ij} B_{jk}$ = matrix multiply. Repeated indices summed; output indices in arrow. Examples:</p><ul><li><code>"ij,ij->"</code>: Frobenius inner product</li><li><code>"ii->"</code>: trace</li><li><code>"ijk,ikl->ijl"</code>: batched matmul</li><li><code>"bnh,bhm->bnm"</code>: batched matmul (batch first)</li></ul>'},
        {'title':'Why Einsum Wins','body':'<p class="l-text">Replace cryptic chains of reshape/transpose/matmul/sum with one declarative line. Both NumPy and PyTorch optimize einsum internally — often the FASTEST way to express tensor ops. Especially powerful for attention computations and graph operations.</p>'},
        {'title':'Kronecker Product','body':'<p class="l-text">$A \\otimes B$ stacks scaled copies of $B$: $(A \\otimes B)_{ij,kl} = A_{ik} B_{jl}$. Key identity: $\\text{vec}(AXB) = (B^T \\otimes A) \\text{vec}(X)$. Reshapes matrix equations into vector equations.</p>'},
        {'title':'Application: Softmax Jacobian','body':'<p class="l-text">For $s_i = e^{x_i}/\\sum_j e^{x_j}$:</p>$$\\frac{\\partial s_i}{\\partial x_j} = s_i (\\delta_{ij} - s_j)$$<p class="l-text">Jacobian is $\\text{diag}(s) - s s^T$. Combined with cross-entropy gives the clean $\\nabla = s - y$ (predicted minus one-hot). Foundation of softmax-cross-entropy backward pass.</p>'},
        {'title':'Application: LayerNorm Backward','body':'<p class="l-text">LayerNorm: $y_i = \\gamma_i (x_i - \\mu)/\\sigma + \\beta_i$ where $\\mu, \\sigma$ depend on $\\mathbf{x}$. Backward gets messy without matrix calculus. Using product/quotient rules + chain rule cleanly yields the standard formula. Modern PyTorch has fused CUDA kernels — but understanding the derivation helps debug NaN/Inf in fp16.</p>'},
        {'title':'Application: Attention via Einsum','body':'<p class="l-text">Multi-head attention in 4 einsum lines:</p><pre style="font-size:0.85rem"><code>scores = einsum("bnhd,bmhd->bhnm", Q, K) / sqrt(d)\nattn = softmax(scores, dim=-1)\nout = einsum("bhnm,bmhd->bnhd", attn, V)\nout_flat = einsum("bnhd->bnd", out_reshaped)</code></pre><p class="l-text">Replaces 6+ lines of reshape/transpose. The FAANG transformer implementations heavily use einsum for clarity.</p>'},
    ],
    'sections_tr':[
        {'title':'Matris Analizi Sozlesmeleri','body':'<p class="l-text">Skalar $f(\\mathbf{x})$ icin: $\\nabla f$ $\\mathbf{x}$ ile ayni sekle sahip. Vektor $\\mathbf{f}(\\mathbf{x})$ icin: Jacobian sekli $m \\times n$. <strong>Pay duzeni</strong> (ML\'de en yaygin): $\\frac{\\partial \\mathbf{f}}{\\partial \\mathbf{x}}_{ij} = \\partial f_i / \\partial x_j$.</p>'},
        {'title':'Yaygin Ozdeslikler','body':'<ul><li>$\\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{a}^T \\mathbf{x}) = \\mathbf{a}$</li><li>$\\frac{\\partial}{\\partial \\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = (A + A^T) \\mathbf{x}$</li><li>$\\frac{\\partial}{\\partial \\mathbf{x}} \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = 2 A^T (A\\mathbf{x} - \\mathbf{b})$</li><li>$\\frac{\\partial \\log \\det X}{\\partial X} = X^{-T}$</li><li>$\\frac{\\partial \\text{tr}(AB)}{\\partial A} = B^T$</li></ul>'},
        {'title':'Einsum Gosterimi','body':'<p class="l-text">Einstein toplama: <code>np.einsum("ij,jk->ik", A, B)</code> $C_{ik} = \\sum_j A_{ij} B_{jk}$ hesaplar = matris carpimi. Tekrarli indeksler toplandi; cikti indeksleri oktan sonra. Ornekler:</p><ul><li><code>"ij,ij->"</code>: Frobenius ic carpim</li><li><code>"ii->"</code>: iz</li><li><code>"ijk,ikl->ijl"</code>: toplu matmul</li><li><code>"bnh,bhm->bnm"</code>: toplu matmul (batch once)</li></ul>'},
        {'title':'Einsum Neden Kazanir?','body':'<p class="l-text">Şifreli reshape/transpose/matmul/sum zincirlerini tek bildirimsel satirla degistir. Hem NumPy hem PyTorch einsum\'u dahili optimize eder — genellikle EN HIZLI tensor islemi ifadesi. Ozellikle attention ve cizge islemleri icin guclu.</p>'},
        {'title':'Kronecker Carpimi','body':'<p class="l-text">$A \\otimes B$, $B$\'nin olcekli kopyalarini istifler: $(A \\otimes B)_{ij,kl} = A_{ik} B_{jl}$. Anahtar ozdeslik: $\\text{vec}(AXB) = (B^T \\otimes A) \\text{vec}(X)$. Matris denklemlerini vektor denklemlerine yeniden sekillendirir.</p>'},
        {'title':'Uygulama: Softmax Jacobian','body':'<p class="l-text">$s_i = e^{x_i}/\\sum_j e^{x_j}$ icin: $\\frac{\\partial s_i}{\\partial x_j} = s_i (\\delta_{ij} - s_j)$. Jacobian $\\text{diag}(s) - s s^T$. Cross-entropy ile birlestiginde temiz $\\nabla = s - y$ verir (tahmin eksi one-hot).</p>'},
        {'title':'Uygulama: LayerNorm Geriye','body':'<p class="l-text">LayerNorm: $y_i = \\gamma_i (x_i - \\mu)/\\sigma + \\beta_i$. Matris analizi olmadan geriye gecis karisik. Carpim/bolme + zincir kurali ile temiz standart formul. Modern PyTorch fused CUDA cekirdekleri var — ama turetimi anlamak fp16\'da NaN/Inf hata ayiklamada yardimci.</p>'},
        {'title':'Uygulama: Einsum ile Attention','body':'<p class="l-text">4 einsum satirinda cok-baslı attention:</p><pre style="font-size:0.85rem"><code>scores = einsum("bnhd,bmhd->bhnm", Q, K) / sqrt(d)\nattn = softmax(scores, dim=-1)\nout = einsum("bhnm,bmhd->bnhd", attn, V)\nout_flat = einsum("bnhd->bnd", out_reshaped)</code></pre><p class="l-text">6+ reshape/transpose satirini degistirir. FAANG transformer uygulamalari netlik icin einsum\'u yogun kullanir.</p>'},
    ],
})

# math/L10 - Statistical Learning Theory
LESSONS.append({
    'track':'math','num':10,'module':'MATH_L10',
    'outcomes_en':['Understand PAC learning framework','Compute VC dimension for common hypothesis classes','Apply generalization bounds (Hoeffding, McDiarmid)','See Rademacher complexity as a tighter alternative','Connect statistical learning theory to deep learning generalization','Recognize when bounds are vacuous and what to do'],
    'outcomes_tr':['PAC ogrenme cercevesini anlama','Yaygin hipotez siniflari icin VC boyutu hesaplama','Genelleme sinirlarini uygulama (Hoeffding, McDiarmid)','Rademacher karmasikligini daha siki alternatif olarak gorme','Istatistiksel ogrenme teorisini derin ogrenme genellemesine baglama','Sinirlar bos oldugunda taniyabilme'],
    'sections_en':[
        {'title':'PAC Learning Setup','body':'<p class="l-text">Probably Approximately Correct (Valiant 1984). Concept class $\\mathcal{C}$ is PAC-learnable if for every $\\epsilon, \\delta > 0$, exists algorithm that with prob $\\geq 1 - \\delta$ outputs hypothesis with error $\\leq \\epsilon$, using polynomially many samples in $1/\\epsilon, 1/\\delta, n, |\\mathcal{C}|$.</p>'},
        {'title':'Hoeffding\'s Inequality','body':'<p class="l-text">For bounded i.i.d. random variables $X_i \\in [a, b]$, sample mean $\\bar{X}$:</p>$$P(|\\bar{X} - \\mathbb{E}[X]| \\geq \\epsilon) \\leq 2 \\exp\\left(-\\frac{2n\\epsilon^2}{(b-a)^2}\\right)$$<p class="l-text">Exponentially small probability of deviation. Foundation of generalization bounds for finite hypothesis classes.</p>'},
        {'title':'Generalization Bound (Finite Class)','body':'<p class="l-text">For hypothesis $h$ from finite class $\\mathcal{H}$, training error $\\hat{L}$, true risk $L$. With prob $\\geq 1 - \\delta$, simultaneously for all $h \\in \\mathcal{H}$:</p>$$L(h) \\leq \\hat{L}(h) + \\sqrt{\\frac{\\log|\\mathcal{H}| + \\log(2/\\delta)}{2n}}$$<p class="l-text">Sample complexity grows as $\\log|\\mathcal{H}|$. For infinite classes, need VC dimension.</p>'},
        {'title':'VC Dimension','body':'<p class="l-text">VC-dim of $\\mathcal{H}$ = largest $n$ such that some $n$-point set is shattered (any $\\pm 1$ labeling achievable by some $h \\in \\mathcal{H}$). Examples: half-planes in $\\mathbb{R}^2$: VC-dim = 3. Linear classifiers in $\\mathbb{R}^d$: VC-dim = $d + 1$. Decision stumps: VC-dim = 2. Neural net with $W$ parameters: VC-dim $\\approx O(W \\log W)$.</p>'},
        {'title':'VC Generalization Bound','body':'<p class="l-text">Sauer-Shelah lemma + uniform convergence gives:</p>$$L(h) \\leq \\hat{L}(h) + O\\left(\\sqrt{\\frac{d \\log(n/d) + \\log(1/\\delta)}{n}}\\right)$$<p class="l-text">where $d$ = VC-dim. Requires $n \\gg d$ for good generalization.</p>'},
        {'title':'Rademacher Complexity — Tighter Bound','body':'<p class="l-text">Rademacher complexity $\\mathfrak{R}_n(\\mathcal{H}) = \\mathbb{E}_\\sigma[\\sup_h (1/n)\\sum_i \\sigma_i h(x_i)]$ where $\\sigma_i$ are random $\\pm 1$. Measures how well the class can fit random noise. Tighter than VC for many classes:</p>$$L(h) \\leq \\hat{L}(h) + 2 \\mathfrak{R}_n(\\mathcal{H}) + O(\\sqrt{\\log(1/\\delta)/n})$$'},
        {'title':'Deep Learning Mystery','body':'<p class="l-text">Modern deep nets have VC-dim ≈ number of parameters (often millions/billions). Classical bounds are VACUOUS (much greater than 1). Yet they generalize well in practice. Why? Active research:</p><ul><li>Implicit regularization by SGD (Soudry 2018)</li><li>Margin theory (Bartlett-Foster 1998 → Bartlett-Mendelson 2002)</li><li>PAC-Bayes bounds (McAllester 1999, Dziugaite-Roy 2017)</li><li>Lottery ticket / sparsity (Frankle-Carbin 2018)</li><li>Neural Tangent Kernel (Jacot 2018)</li></ul><p class="l-text">No fully satisfying theory yet for why over-parameterized nets generalize.</p>'},
        {'title':'No Free Lunch (Wolpert 1996)','body':'<p class="l-text">No learning algorithm is universally better. Averaged over all possible target functions, all algorithms perform equally. So generalization comes from <em>inductive bias</em> — the assumption that the world has certain regularities. Choosing the right bias for your data is the central skill of ML.</p>'},
    ],
    'sections_tr':[
        {'title':'PAC Ogrenme Kurulumu','body':'<p class="l-text">Probably Approximately Correct (Valiant 1984). $\\mathcal{C}$ kavram sinifi PAC-ogrenilebilirse, her $\\epsilon, \\delta > 0$ icin polinom sayida ornekle olasi en az $1 - \\delta$ ile hata $\\leq \\epsilon$ olan hipotez veren algoritma vardir.</p>'},
        {'title':'Hoeffding Esitsizligi','body':'<p class="l-text">Sinirli i.i.d. $X_i \\in [a, b]$ ornek ortalamasi $\\bar{X}$:</p>$$P(|\\bar{X} - \\mathbb{E}[X]| \\geq \\epsilon) \\leq 2 \\exp\\left(-\\frac{2n\\epsilon^2}{(b-a)^2}\\right)$$<p class="l-text">Sapma olasiligi ustel kucuk. Sonlu hipotez siniflari icin genelleme sinirlarinin temeli.</p>'},
        {'title':'Genelleme Siniri (Sonlu Sinif)','body':'<p class="l-text">$h$ hipotezi sonlu sinif $\\mathcal{H}$\'dan. Olasi en az $1 - \\delta$ ile tum $h$\'ler icin:</p>$$L(h) \\leq \\hat{L}(h) + \\sqrt{\\frac{\\log|\\mathcal{H}| + \\log(2/\\delta)}{2n}}$$<p class="l-text">Ornek karmasikligi $\\log|\\mathcal{H}|$ ile buyur.</p>'},
        {'title':'VC Boyutu','body':'<p class="l-text">$\\mathcal{H}$\'in VC-boyutu = bir $n$-nokta seti bazi $h \\in \\mathcal{H}$ tarafindan herhangi $\\pm 1$ etiketlemesi yapilabilen en buyuk $n$. Ornekler: $\\mathbb{R}^2$\'de yari-duzlemler: 3. $\\mathbb{R}^d$\'de dogrusal: $d+1$. $W$ parametreli sinir agi: $\\approx O(W \\log W)$.</p>'},
        {'title':'VC Genelleme Siniri','body':'<p class="l-text">$$L(h) \\leq \\hat{L}(h) + O\\left(\\sqrt{\\frac{d \\log(n/d) + \\log(1/\\delta)}{n}}\\right)$$<p class="l-text">$d$ = VC-boyutu. Iyi genelleme icin $n \\gg d$ gerekli.</p>'},
        {'title':'Rademacher Karmasikligi','body':'<p class="l-text">$\\mathfrak{R}_n(\\mathcal{H}) = \\mathbb{E}_\\sigma[\\sup_h (1/n)\\sum_i \\sigma_i h(x_i)]$. Sinifin rastgele gurultuyu ne kadar iyi uydurabildigini olcer. Cogu sinif icin VC\'den daha siki:</p>$$L(h) \\leq \\hat{L}(h) + 2 \\mathfrak{R}_n(\\mathcal{H}) + O(\\sqrt{\\log(1/\\delta)/n})$$'},
        {'title':'Derin Ogrenme Sirri','body':'<p class="l-text">Modern derin aglarin VC-boyutu ≈ parametre sayisi (genellikle milyonlar/milyarlar). Klasik sinirlar BOS (1\'den cok buyuk). Yine de pratikte iyi genellestiriyorlar. Aktif arastirma alanlari: SGD\'nin orftuk duzenlilesi, marjin teorisi, PAC-Bayes sinirlari, piyango bileti, Neural Tangent Kernel. Henuz tam tatmin edici teori yok.</p>'},
        {'title':'Bedava Yemek Yok (Wolpert 1996)','body':'<p class="l-text">Hicbir ogrenme algoritmasi evrensel olarak daha iyi degil. Tum olasi hedef fonksiyonlari uzerinden ortalama, tum algoritmalar esit performans gosterir. Yani genelleme <em>tumevarimsal onyargidan</em> gelir — dunyanin belirli duzenliliklere sahip oldugu varsayim.</p>'},
    ],
})

# math/L11 - Advanced Probability (Martingales, Concentration)
LESSONS.append({
    'track':'math','num':11,'module':'MATH_L11',
    'outcomes_en':['Define martingales and recognize them in practice','Apply Doob\'s optional stopping theorem','Use Azuma-Hoeffding for bounded-difference martingales','Apply concentration inequalities (Chernoff, McDiarmid)','Connect martingales to stochastic gradient descent analysis','Recognize sub-Gaussian and sub-exponential tails'],
    'outcomes_tr':['Martingaleleri tanimlama ve pratikte taniyabilme','Doob isteyebilir durma teoremini uygulama','Sinirli-fark martingaleleri icin Azuma-Hoeffding kullanma','Yogunlasma esitsizliklerini uygulama (Chernoff, McDiarmid)','Martingaleleri SGD analizine baglama','Alt-Gauss ve alt-ustel kuyruklari taniyabilme'],
    'sections_en':[
        {'title':'Filtrations and Conditional Expectation','body':'<p class="l-text">Filtration $\\{\\mathcal{F}_n\\}$: increasing sequence of $\\sigma$-algebras representing accumulated information. Conditional expectation $\\mathbb{E}[X \\mid \\mathcal{F}]$: best $\\mathcal{F}$-measurable predictor of $X$ in $L^2$ sense.</p>'},
        {'title':'Martingale Definition','body':'<p class="l-text">$\\{X_n\\}$ is a martingale wrt $\\{\\mathcal{F}_n\\}$ if:</p><ol><li>$X_n$ is $\\mathcal{F}_n$-measurable</li><li>$\\mathbb{E}|X_n| < \\infty$</li><li>$\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = X_n$ (fair game)</li></ol><p class="l-text">Submartingale: $\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] \\geq X_n$. Supermartingale: $\\leq X_n$.</p>'},
        {'title':'Classic Examples','body':'<ul><li><strong>Random walk</strong>: $S_n = \\sum_{i=1}^n X_i$ with $\\mathbb{E}[X_i] = 0$ is a martingale</li><li><strong>Wealth process</strong> in fair gambling</li><li><strong>Likelihood ratio</strong>: $L_n = \\prod_i q(x_i)/p(x_i)$ is a martingale under $P$</li><li><strong>Doob martingale</strong>: $M_n = \\mathbb{E}[X \\mid \\mathcal{F}_n]$ for fixed integrable $X$</li></ul>'},
        {'title':'Doob\'s Optional Stopping Theorem','body':'<p class="l-text">For martingale $\\{X_n\\}$ and stopping time $T$ (bounded, OR uniformly integrable):</p>$$\\mathbb{E}[X_T] = \\mathbb{E}[X_0]$$<p class="l-text">Profound consequence: "no strategy beats a fair game". Used to prove the gambler\'s ruin, Wald\'s identity, hitting probabilities for random walks.</p>'},
        {'title':'Concentration Inequalities — Hoeffding','body':'<p class="l-text">Independent $X_i \\in [a_i, b_i]$:</p>$$P\\left(\\left|\\sum_i (X_i - \\mathbb{E}X_i)\\right| \\geq t\\right) \\leq 2\\exp\\left(-\\frac{2t^2}{\\sum_i (b_i - a_i)^2}\\right)$$<p class="l-text">Foundation for binary classification generalization (L10).</p>'},
        {'title':'Chernoff Bound','body':'<p class="l-text">For sum $S_n$ of bounded i.i.d. with mean $\\mu$:</p>$$P(S_n \\geq n(\\mu + t)) \\leq \\exp(-n \\cdot D(\\mu+t \\| \\mu))$$<p class="l-text">where $D$ is the KL divergence rate function. Sharper than Hoeffding when distribution structure is known.</p>'},
        {'title':'Azuma-Hoeffding (for Martingales)','body':'<p class="l-text">For martingale with bounded differences $|X_n - X_{n-1}| \\leq c_n$ a.s.:</p>$$P(|X_n - X_0| \\geq t) \\leq 2\\exp\\left(-\\frac{t^2}{2\\sum c_i^2}\\right)$$<p class="l-text">Doesn\'t require independence — just bounded differences. Used heavily in randomized algorithm analysis.</p>'},
        {'title':'McDiarmid (Bounded Differences)','body':'<p class="l-text">For function $f(X_1, \\dots, X_n)$ with bounded differences $c_i$ when changing $X_i$:</p>$$P(|f - \\mathbb{E}f| \\geq t) \\leq 2\\exp\\left(-\\frac{2t^2}{\\sum c_i^2}\\right)$$<p class="l-text">Generalization bound foundation. Used to prove uniform convergence over hypothesis classes (L10).</p>'},
        {'title':'Application: SGD Convergence','body':'<p class="l-text">SGD trajectory $\\{w_t\\}$ is approximately a (super)martingale wrt the loss landscape. Convergence analysis (Bottou 2018) uses martingale convergence + concentration bounds. Adam, AdamW analysis similarly uses martingale tools. Heavily applied in optimization theory papers.</p>'},
    ],
    'sections_tr':[
        {'title':'Filtrasyon ve Kosullu Beklenti','body':'<p class="l-text">Filtrasyon $\\{\\mathcal{F}_n\\}$: birikmis bilgiyi temsil eden $\\sigma$-cebirlerin artan dizisi. Kosullu beklenti $\\mathbb{E}[X \\mid \\mathcal{F}]$: $L^2$ anlaminda $X$\'in en iyi $\\mathcal{F}$-olculebilir tahmincisi.</p>'},
        {'title':'Martingale Tanimi','body':'<p class="l-text">$\\{X_n\\}$, $\\{\\mathcal{F}_n\\}$\'ya gore martingaledir ki:</p><ol><li>$X_n$, $\\mathcal{F}_n$-olculebilir</li><li>$\\mathbb{E}|X_n| < \\infty$</li><li>$\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = X_n$ (adil oyun)</li></ol>'},
        {'title':'Klasik Ornekler','body':'<ul><li><strong>Rastgele yuruyus</strong>: $\\mathbb{E}[X_i] = 0$ ile $S_n = \\sum X_i$ martingale</li><li><strong>Servet sureci</strong> adil kumarda</li><li><strong>Olabilirlik orani</strong>: $L_n = \\prod_i q(x_i)/p(x_i)$ $P$ altinda martingale</li><li><strong>Doob martingale</strong>: sabit integrallenebilir $X$ icin $M_n = \\mathbb{E}[X \\mid \\mathcal{F}_n]$</li></ul>'},
        {'title':'Doob Isteyebilir Durma Teoremi','body':'<p class="l-text">Martingale $\\{X_n\\}$ ve durma zamani $T$ icin (sinirli VEYA tekduze integrallenebilir):</p>$$\\mathbb{E}[X_T] = \\mathbb{E}[X_0]$$<p class="l-text">Derin sonuc: "hicbir strateji adil oyunu yenmez". Kumarbazin yikimi, Wald ozdesligi, rastgele yuruyus icin vurma olasiliklarini kanitlamada kullanilir.</p>'},
        {'title':'Yogunlasma Esitsizlikleri — Hoeffding','body':'<p class="l-text">Bagimsiz $X_i \\in [a_i, b_i]$:</p>$$P\\left(\\left|\\sum_i (X_i - \\mathbb{E}X_i)\\right| \\geq t\\right) \\leq 2\\exp\\left(-\\frac{2t^2}{\\sum_i (b_i - a_i)^2}\\right)$$'},
        {'title':'Chernoff Siniri','body':'<p class="l-text">Toplam $S_n$ icin: $$P(S_n \\geq n(\\mu + t)) \\leq \\exp(-n \\cdot D(\\mu+t \\| \\mu))$$. Dagilim yapisi bilindiğinde Hoeffding\'den daha keskin.</p>'},
        {'title':'Azuma-Hoeffding (Martingaleler icin)','body':'<p class="l-text">Sinirli farkli martingale $|X_n - X_{n-1}| \\leq c_n$:</p>$$P(|X_n - X_0| \\geq t) \\leq 2\\exp\\left(-\\frac{t^2}{2\\sum c_i^2}\\right)$$<p class="l-text">Bagimsizlik gerekmez — sadece sinirli farklar. Rastgele algoritma analizinde yogun kullanim.</p>'},
        {'title':'McDiarmid (Sinirli Farklar)','body':'<p class="l-text">$X_i$\'yi degistirken $c_i$ sinirli farkli fonksiyon $f$:</p>$$P(|f - \\mathbb{E}f| \\geq t) \\leq 2\\exp\\left(-\\frac{2t^2}{\\sum c_i^2}\\right)$$<p class="l-text">Genelleme siniri temeli. Hipotez siniflari uzerinden tekduze yakinsamayi kanitlamada kullanilir.</p>'},
        {'title':'Uygulama: SGD Yakinsamasi','body':'<p class="l-text">SGD yorungesi $\\{w_t\\}$ kayip yuzeyine gore yaklaşik (super)martingale. Yakinsama analizi (Bottou 2018) martingale yakinsama + yogunlasma sinirlari kullanir. Adam, AdamW analizi de martingale araclarini kullanir.</p>'},
    ],
})


# Build content for each lesson and write
for lesson in LESSONS:
    en_content = lesson_html(OUTCOMES_PANEL_EN, lesson['outcomes_en'], lesson['sections_en'], lesson.get('plot_blocks',[None])[0::2] if 'plot_blocks' in lesson else None, lesson.get('pyodide_en'), 'en')
    tr_content = lesson_html(OUTCOMES_PANEL_TR, lesson['outcomes_tr'], lesson['sections_tr'], lesson.get('plot_blocks',[None])[1::2] if 'plot_blocks' in lesson else None, lesson.get('pyodide_tr'), 'tr')
    out = make_lesson(lesson['track'], lesson['num'], lesson['module'], en_content, tr_content)
    print(f"  wrote {out.relative_to(ROOT.parent)}")

# Validate
import subprocess
for lesson in LESSONS:
    fp = ROOT / lesson['track'] / f"L{lesson['num']}.js"
    r = subprocess.run(['node','-e',f"try{{new Function(require('fs').readFileSync('{str(fp).replace(chr(92), '/')}','utf8'));console.log('OK')}}catch(e){{console.log('ERR:',e.message.split('\\n')[0])}}"], capture_output=True, text=True)
    print(f"  {lesson['track']}/L{lesson['num']}: {r.stdout.strip()}")
