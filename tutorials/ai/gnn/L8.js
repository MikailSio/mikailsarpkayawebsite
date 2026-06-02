window.GNN_L8 = {
en: `<p class="l-text"><strong>Capstone time.</strong> We are going to build, end-to-end, the most common production application of graph neural networks: a recommender system that combines a <em>knowledge graph</em> (extracted from text) with <em>collaborative filtering</em> (extracted from purchase history) and trains a GNN-style propagation model to recommend products to customers via link prediction. The customers, products, and orders tables you have loaded in your Pyodide preamble are real (synthetic but consistent) data; we will treat them exactly as a small e-commerce site would and watch the recommendations come out.</p>

<p class="l-text">Production analogues: this is a stripped-down version of what Pinterest's PinSage, Alibaba's GraphRec, Spotify's HOP-Rec, and Twitter's TwHIN do at billion-edge scale. The architectural ideas — heterogeneous nodes (users, items, attributes), bipartite message passing, dot-product link decoder, BPR loss, top-K retrieval — are identical; only the scale and engineering differ. By the end of this lesson you will have computed actual product recommendations for actual customer IDs, compared a GNN-style approach against a classical Adamic-Adar baseline, and understood where each approach wins.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a heterogeneous knowledge graph from relational tables (customers, products, orders, attributes)</li>
<li>Run GNN-style mean-aggregation in NumPy on the bipartite customer-product graph</li>
<li>Train embeddings via implicit-feedback link prediction (BPR loss)</li>
<li>Generate top-K product recommendations for arbitrary customers</li>
<li>Compare GNN, matrix factorization (SVD), and Adamic-Adar baselines on the same task</li>
<li>Diagnose failure modes: cold start, popularity bias, sparsity</li>
<li>Map your prototype to a production architecture (PinSage, TwHIN)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Data: From Tables to Knowledge Graph</h2>
<p class="l-text">We have three tables in scope: <code>df_customers</code> (500 rows, with country, signup_date, churn label), <code>df_products</code> (39 rows, with category, price, brand), and <code>df_orders</code> (2000 rows: customer_id, product_id, quantity, date). Out of these we build a <strong>heterogeneous knowledge graph</strong> with multiple node types and multiple edge types.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Node types</div><div class="card-body">Customer (500), Product (39), Category (~5), Country (~10). Each has its own feature space.</div></div>
<div class="calc-card"><div class="card-title">Edge types</div><div class="card-body">Customer ↔ bought ↔ Product, Product ↔ in-category ↔ Category, Customer ↔ from ↔ Country, plus Product-similar-to-Product (derived).</div></div>
<div class="calc-card"><div class="card-title">Why heterogeneous?</div><div class="card-body">A customer who bought a product is structurally similar to other customers who bought products in the same category. The category edges propagate signal even where direct evidence is missing — solves cold start.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build the heterogeneous KG from your loaded tables and inspect basic stats.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

KG = nx.<span class="fn">MultiDiGraph</span>()    <span class="cm"># multi: multiple edges between same pair (e.g. multiple orders)</span>

<span class="cm"># Add customer nodes</span>
<span class="kw">for</span> _, row <span class="kw">in</span> df_customers.<span class="fn">iterrows</span>():
    KG.<span class="fn">add_node</span>(f<span class="str">"C{row['customer_id']}"</span>, kind=<span class="str">"customer"</span>, country=row.<span class="fn">get</span>(<span class="str">'country'</span>, <span class="str">'N/A'</span>))
<span class="cm"># Add product nodes</span>
<span class="kw">for</span> _, row <span class="kw">in</span> df_products.<span class="fn">iterrows</span>():
    KG.<span class="fn">add_node</span>(f<span class="str">"P{row['product_id']}"</span>, kind=<span class="str">"product"</span>, category=row.<span class="fn">get</span>(<span class="str">'category'</span>, <span class="str">'N/A'</span>))
<span class="cm"># Add category nodes from products</span>
cats = <span class="fn">set</span>(df_products[<span class="str">'category'</span>].<span class="fn">dropna</span>().<span class="fn">unique</span>())
<span class="kw">for</span> c <span class="kw">in</span> cats:
    KG.<span class="fn">add_node</span>(f<span class="str">"CAT_{c}"</span>, kind=<span class="str">"category"</span>)
    <span class="cm"># Edge: product -> in-category</span>
    <span class="kw">for</span> pid <span class="kw">in</span> df_products[df_products[<span class="str">'category'</span>] == c][<span class="str">'product_id'</span>]:
        KG.<span class="fn">add_edge</span>(f<span class="str">"P{pid}"</span>, f<span class="str">"CAT_{c}"</span>, kind=<span class="str">"in-category"</span>)
        KG.<span class="fn">add_edge</span>(f<span class="str">"CAT_{c}"</span>, f<span class="str">"P{pid}"</span>, kind=<span class="str">"contains"</span>)
<span class="cm"># Add purchase edges</span>
<span class="kw">for</span> _, row <span class="kw">in</span> df_orders.<span class="fn">iterrows</span>():
    KG.<span class="fn">add_edge</span>(f<span class="str">"C{row['customer_id']}"</span>, f<span class="str">"P{row['product_id']}"</span>, kind=<span class="str">"bought"</span>)
    KG.<span class="fn">add_edge</span>(f<span class="str">"P{row['product_id']}"</span>, f<span class="str">"C{row['customer_id']}"</span>, kind=<span class="str">"bought-by"</span>)

<span class="fn">print</span>(f<span class="str">"KG: {KG.number_of_nodes()} nodes, {KG.number_of_edges()} edges"</span>)
n_by_kind = {}
<span class="kw">for</span> n, d <span class="kw">in</span> KG.<span class="fn">nodes</span>(data=<span class="kw">True</span>):
    n_by_kind[d[<span class="str">'kind'</span>]] = n_by_kind.<span class="fn">get</span>(d[<span class="str">'kind'</span>], <span class="num">0</span>) + <span class="num">1</span>
<span class="fn">print</span>(<span class="str">"Nodes by type:"</span>, n_by_kind)

e_by_kind = {}
<span class="kw">for</span> u, v, d <span class="kw">in</span> KG.<span class="fn">edges</span>(data=<span class="kw">True</span>):
    e_by_kind[d[<span class="str">'kind'</span>]] = e_by_kind.<span class="fn">get</span>(d[<span class="str">'kind'</span>], <span class="num">0</span>) + <span class="num">1</span>
<span class="fn">print</span>(<span class="str">"Edges by type:"</span>, e_by_kind)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Train / Test Split for Implicit-Feedback Recsys</h2>
<p class="l-text">The standard recsys split: hold out the <em>most recent</em> purchase per customer as the test query, the rest as training. We mimic this by holding out 20% of the (customer, product) pairs as test edges, removing them from the training graph (no leakage), and then trying to predict them.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">80/20 edge split. Test edges removed from the training graph — critical to avoid leakage.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
unique_orders = <span class="fn">list</span>(<span class="fn">set</span>((row[<span class="str">'customer_id'</span>], row[<span class="str">'product_id'</span>]) <span class="kw">for</span> _, row <span class="kw">in</span> df_orders.<span class="fn">iterrows</span>()))
<span class="fn">print</span>(<span class="str">"Unique (customer, product) pairs:"</span>, <span class="fn">len</span>(unique_orders))

rng.<span class="fn">shuffle</span>(unique_orders)
n_test = <span class="fn">len</span>(unique_orders) // <span class="num">5</span>
test_pairs = unique_orders[:n_test]
train_pairs = unique_orders[n_test:]
<span class="fn">print</span>(f<span class="str">"Train pairs: {len(train_pairs)}  Test pairs: {len(test_pairs)}"</span>)

<span class="cm"># Build the training-only bipartite graph</span>
<span class="kw">import</span> networkx <span class="kw">as</span> nx
B_train = nx.<span class="fn">Graph</span>()
<span class="kw">for</span> cid, pid <span class="kw">in</span> train_pairs:
    B_train.<span class="fn">add_edge</span>(f<span class="str">"C{cid}"</span>, f<span class="str">"P{pid}"</span>)
<span class="fn">print</span>(<span class="str">"Training graph nodes:"</span>, B_train.<span class="fn">number_of_nodes</span>(), <span class="str">"edges:"</span>, B_train.<span class="fn">number_of_edges</span>())

<span class="cm"># Sample equal-size negative pairs (non-edges) for ranked evaluation</span>
products = [f<span class="str">"P{p}"</span> <span class="kw">for</span> p <span class="kw">in</span> df_products[<span class="str">'product_id'</span>].<span class="fn">unique</span>()]
neg_pairs = []
seen = <span class="fn">set</span>((f<span class="str">"C{c}"</span>, f<span class="str">"P{p}"</span>) <span class="kw">for</span> c, p <span class="kw">in</span> unique_orders)
<span class="kw">while</span> <span class="fn">len</span>(neg_pairs) < n_test:
    cid = rng.<span class="fn">choice</span>(df_customers[<span class="str">'customer_id'</span>].values)
    pid = rng.<span class="fn">choice</span>(df_products[<span class="str">'product_id'</span>].values)
    <span class="kw">if</span> (f<span class="str">"C{cid}"</span>, f<span class="str">"P{pid}"</span>) <span class="kw">not</span> <span class="kw">in</span> seen:
        neg_pairs.<span class="fn">append</span>((cid, pid))
<span class="fn">print</span>(<span class="str">"Negative test pairs:"</span>, <span class="fn">len</span>(neg_pairs))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Baseline 1 — Pure Popularity</h2>
<p class="l-text">First baseline: recommend the globally most-popular products to everyone. This is the floor every recsys must beat. If your fancy GNN doesn't beat popularity, something is broken.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Popularity baseline. Score every product = its in-degree. AUC vs negatives.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score
<span class="kw">from</span> collections <span class="kw">import</span> Counter

<span class="cm"># Popularity from the training graph only</span>
pop = <span class="fn">Counter</span>(pid <span class="kw">for</span> _, pid <span class="kw">in</span> train_pairs)
<span class="kw">def</span> <span class="fn">pop_score</span>(pid): <span class="kw">return</span> pop.<span class="fn">get</span>(pid, <span class="num">0</span>)

pos_scores = [<span class="fn">pop_score</span>(pid) <span class="kw">for</span> _, pid <span class="kw">in</span> test_pairs]
neg_scores = [<span class="fn">pop_score</span>(pid) <span class="kw">for</span> _, pid <span class="kw">in</span> neg_pairs]

y_true = [<span class="num">1</span>]*<span class="fn">len</span>(pos_scores) + [<span class="num">0</span>]*<span class="fn">len</span>(neg_scores)
y_pred = pos_scores + neg_scores
<span class="fn">print</span>(f<span class="str">"Popularity AUC: {roc_auc_score(y_true, y_pred):.3f}"</span>)

top5 = pop.<span class="fn">most_common</span>(<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"Top-5 most popular products:"</span>, top5)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Baseline 2 — Adamic-Adar on Bipartite</h2>
<p class="l-text">A stronger baseline: for each (customer, product) candidate pair, count how many "common neighbors" they share through paths of length 2 (customer → other-product → other-customer-who-bought-it). This is the bipartite version of Adamic-Adar / common neighbors. It's surprisingly hard to beat.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bipartite Adamic-Adar via 2-hop neighbor overlap.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">aa_bipartite</span>(G, c, p):
    <span class="kw">if</span> <span class="kw">not</span> G.<span class="fn">has_node</span>(c) <span class="kw">or</span> <span class="kw">not</span> G.<span class="fn">has_node</span>(p): <span class="kw">return</span> <span class="num">0.0</span>
    c_neighbors = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(c))    <span class="cm"># products customer c bought</span>
    p_neighbors = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(p))    <span class="cm"># customers who bought product p</span>
    score = <span class="num">0.0</span>
    <span class="kw">for</span> other_p <span class="kw">in</span> c_neighbors:
        <span class="cm"># Customers who also bought other_p — how many also bought p?</span>
        co_buyers = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(other_p)) & p_neighbors
        <span class="kw">if</span> co_buyers:
            score += <span class="fn">len</span>(co_buyers) / np.<span class="fn">log</span>(G.<span class="fn">degree</span>(other_p) + <span class="num">2</span>)
    <span class="kw">return</span> score

pos_scores = [<span class="fn">aa_bipartite</span>(B_train, f<span class="str">"C{c}"</span>, f<span class="str">"P{p}"</span>) <span class="kw">for</span> c, p <span class="kw">in</span> test_pairs[:<span class="num">200</span>]]
neg_scores = [<span class="fn">aa_bipartite</span>(B_train, f<span class="str">"C{c}"</span>, f<span class="str">"P{p}"</span>) <span class="kw">for</span> c, p <span class="kw">in</span> neg_pairs[:<span class="num">200</span>]]

y_true = [<span class="num">1</span>]*<span class="fn">len</span>(pos_scores) + [<span class="num">0</span>]*<span class="fn">len</span>(neg_scores)
y_pred = pos_scores + neg_scores
<span class="fn">print</span>(f<span class="str">"Adamic-Adar bipartite AUC (200 samples): {roc_auc_score(y_true, y_pred):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"  positive mean score: {np.mean(pos_scores):.3f}  negative: {np.mean(neg_scores):.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Baseline 3 — Matrix Factorization (Truncated SVD)</h2>
<p class="l-text">Classical CF: build the customer × product interaction matrix $R \\in \\{0, 1\\}^{N_C \\times N_P}$, factorize $R \\approx U V^\\top$ via SVD, score $(c, p) = u_c^\\top v_p$. This is what Netflix used in 2009 and what every "deep learning recsys" paper has to beat (and rarely does, on the sparse-and-small regime we are in).</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build the (customer, product) matrix, run TruncatedSVD with 16 latent factors.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> TruncatedSVD

cust_ids = <span class="fn">sorted</span>(df_customers[<span class="str">'customer_id'</span>].<span class="fn">unique</span>())
prod_ids = <span class="fn">sorted</span>(df_products[<span class="str">'product_id'</span>].<span class="fn">unique</span>())
c_idx = {c:i <span class="kw">for</span> i,c <span class="kw">in</span> <span class="fn">enumerate</span>(cust_ids)}
p_idx = {p:i <span class="kw">for</span> i,p <span class="kw">in</span> <span class="fn">enumerate</span>(prod_ids)}

R = np.<span class="fn">zeros</span>((<span class="fn">len</span>(cust_ids), <span class="fn">len</span>(prod_ids)))
<span class="kw">for</span> c, p <span class="kw">in</span> train_pairs:
    R[c_idx[c], p_idx[p]] = <span class="num">1.0</span>
<span class="fn">print</span>(f<span class="str">"Interaction matrix: {R.shape}, density={R.mean():.3f}"</span>)

K = <span class="num">16</span>
svd = <span class="fn">TruncatedSVD</span>(n_components=K, random_state=<span class="num">0</span>)
U = svd.<span class="fn">fit_transform</span>(R)              <span class="cm"># (N_c, K)</span>
V = svd.components_.T                  <span class="cm"># (N_p, K)</span>

<span class="kw">def</span> <span class="fn">mf_score</span>(c, p):
    <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> c_idx <span class="kw">or</span> p <span class="kw">not</span> <span class="kw">in</span> p_idx: <span class="kw">return</span> <span class="num">0.0</span>
    <span class="kw">return</span> <span class="fn">float</span>(U[c_idx[c]] @ V[p_idx[p]])

pos_scores = [<span class="fn">mf_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> test_pairs]
neg_scores = [<span class="fn">mf_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> neg_pairs]
<span class="fn">print</span>(f<span class="str">"SVD-MF AUC: {roc_auc_score([1]*len(pos_scores)+[0]*len(neg_scores), pos_scores+neg_scores):.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The GNN: Iterated Mean Aggregation (LightGCN-style)</h2>
<p class="l-text">Now the actual GNN. We take the SVD embeddings as initialization and apply $K$ rounds of mean-aggregation across the bipartite graph — exactly LightGCN (He et al. 2020, the strongest "simple GNN" recsys baseline). One round: for each node, replace its embedding with the mean of its neighbors' embeddings. After $K$ rounds, take the average across all rounds (multi-layer pooling).</p>

<div class="katex-block">$$e_u^{(k+1)} = \\sum_{i \\in N(u)} \\frac{1}{\\sqrt{|N(u)||N(i)|}} e_i^{(k)}, \\qquad e_u = \\frac{1}{K+1}\\sum_{k=0}^K e_u^{(k)}$$</div>

<p class="l-text">No learnable parameters per layer — just propagation. The init embeddings are learned (or here, taken from SVD). LightGCN beat all "deep" recsys baselines in 2020 by removing the per-layer transforms.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LightGCN-style propagation in NumPy. Initialize with SVD, propagate 3 rounds, average. Compare AUC.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Build symmetric bipartite normalized adjacency from train_pairs</span>
N_c, N_p = <span class="fn">len</span>(cust_ids), <span class="fn">len</span>(prod_ids)
N = N_c + N_p
<span class="cm"># Node ordering: customers 0..N_c-1, products N_c..N</span>
A = np.<span class="fn">zeros</span>((N, N))
<span class="kw">for</span> c, p <span class="kw">in</span> train_pairs:
    i, j = c_idx[c], N_c + p_idx[p]
    A[i, j] = <span class="num">1.0</span>; A[j, i] = <span class="num">1.0</span>

deg = A.<span class="fn">sum</span>(axis=<span class="num">1</span>)
deg_sqrt = np.<span class="fn">where</span>(deg > <span class="num">0</span>, <span class="num">1.0</span>/np.<span class="fn">sqrt</span>(deg), <span class="num">0.0</span>)
A_hat = (deg_sqrt[:, <span class="kw">None</span>] * A) * deg_sqrt[<span class="kw">None</span>, :]   <span class="cm"># symmetric norm</span>

<span class="cm"># Init embeddings: stack SVD U (customers) and V (products)</span>
E0 = np.<span class="fn">vstack</span>([U, V])
<span class="fn">print</span>(<span class="str">"Init embeddings shape:"</span>, E0.shape)

K_layers = <span class="num">3</span>
E_layers = [E0]
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K_layers):
    E_layers.<span class="fn">append</span>(A_hat @ E_layers[-<span class="num">1</span>])

<span class="cm"># Average across all layers</span>
E = np.<span class="fn">mean</span>(E_layers, axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"Final embeddings shape:"</span>, E.shape)

<span class="kw">def</span> <span class="fn">gnn_score</span>(c, p):
    <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> c_idx <span class="kw">or</span> p <span class="kw">not</span> <span class="kw">in</span> p_idx: <span class="kw">return</span> <span class="num">0.0</span>
    <span class="kw">return</span> <span class="fn">float</span>(E[c_idx[c]] @ E[N_c + p_idx[p]])

pos_scores = [<span class="fn">gnn_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> test_pairs]
neg_scores = [<span class="fn">gnn_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> neg_pairs]
<span class="fn">print</span>(f<span class="str">"LightGCN-style AUC: {roc_auc_score([1]*len(pos_scores)+[0]*len(neg_scores), pos_scores+neg_scores):.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Top-K Recommendations for Real Customers</h2>
<p class="l-text">Now use the trained embeddings to actually generate recommendations. For each customer, score every product, exclude already-bought products, return the top-K by score.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pick three customer IDs and produce top-5 product recommendations using GNN scores.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Already-bought map</span>
bought = {}
<span class="kw">for</span> c, p <span class="kw">in</span> train_pairs:
    bought.<span class="fn">setdefault</span>(c, <span class="fn">set</span>()).<span class="fn">add</span>(p)

<span class="kw">def</span> <span class="fn">recommend</span>(cid, K=<span class="num">5</span>):
    <span class="kw">if</span> cid <span class="kw">not</span> <span class="kw">in</span> c_idx: <span class="kw">return</span> []
    cu = E[c_idx[cid]]
    scores = E[N_c:] @ cu     <span class="cm"># (N_p,) score vs every product</span>
    already = bought.<span class="fn">get</span>(cid, <span class="fn">set</span>())
    <span class="cm"># Mask out already-bought</span>
    <span class="kw">for</span> p <span class="kw">in</span> already:
        scores[p_idx[p]] = -<span class="num">1e9</span>
    top = np.<span class="fn">argsort</span>(-scores)[:K]
    <span class="kw">return</span> [(prod_ids[i], <span class="fn">float</span>(scores[i])) <span class="kw">for</span> i <span class="kw">in</span> top]

<span class="cm"># Pick 3 sample customers and recommend</span>
sample = <span class="fn">list</span>(df_customers[<span class="str">'customer_id'</span>].<span class="fn">head</span>(<span class="num">3</span>))
<span class="kw">for</span> cid <span class="kw">in</span> sample:
    recs = <span class="fn">recommend</span>(cid, K=<span class="num">5</span>)
    <span class="fn">print</span>(f<span class="str">"\\nCustomer {cid} already bought: {sorted(bought.get(cid, []))[:5]}{'...' if len(bought.get(cid, []))>5 else ''}"</span>)
    <span class="fn">print</span>(f<span class="str">"  Top-5 recommendations:"</span>)
    <span class="kw">for</span> pid, s <span class="kw">in</span> recs:
        cat_row = df_products[df_products[<span class="str">'product_id'</span>]==pid]
        cat = cat_row[<span class="str">'category'</span>].values[<span class="num">0</span>] <span class="kw">if</span> <span class="fn">len</span>(cat_row) <span class="kw">else</span> <span class="str">'?'</span>
        <span class="fn">print</span>(f<span class="str">"    P{pid} ({cat}): score={s:.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Cold Start, Popularity Bias, Diversity</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cold start (new users)</div><div class="card-body">A brand-new customer with no purchases has empty neighborhood — GNN cannot embed them. Fix: use customer features (country, signup_date) via a content-based encoder (HeterogeneousGNN) so the model has something to start from.</div></div>
<div class="calc-card"><div class="card-title">Cold start (new items)</div><div class="card-body">Same problem in reverse. Fix: embed products from their category and text description via a content encoder (e.g. a small NLP model) and merge into the GNN graph as features.</div></div>
<div class="calc-card"><div class="card-title">Popularity bias</div><div class="card-body">Popular products sit in the center of the graph and accumulate signal — they get recommended too often. Fix: re-rank with a diversity term (MMR, determinantal point processes) or down-weight by popularity.</div></div>
<div class="calc-card"><div class="card-title">Filter bubble</div><div class="card-body">Always recommending similar items kills exploration. Production systems mix top-K-by-score with epsilon-random exploration (a la multi-armed bandits — connects to RL).</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. From Prototype to Production (PinSage architecture)</h2>
<p class="l-text">What we built scales to maybe 100k nodes on a single CPU. Production recsys lives at the billion-edge scale. The architectural recipe (Ying et al. 2018, PinSage):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Random-walk neighborhood</div><div class="card-body">For each node, sample neighbors via importance-weighted random walks. Cap at ~50 neighbors per node — far cheaper than full propagation.</div></div>
<div class="calc-card"><div class="card-title">2. Importance pooling</div><div class="card-body">Aggregate neighbors with weights = visit counts from random walks. More frequent visits = stronger signal.</div></div>
<div class="calc-card"><div class="card-title">3. Hard negative mining</div><div class="card-body">For each positive pair, sample negatives that are "easy to confuse" — same category, similar features. Forces the model to learn fine distinctions.</div></div>
<div class="calc-card"><div class="card-title">4. MapReduce inference</div><div class="card-body">Batch the GNN forward pass over all nodes once a day in MapReduce. Cache embeddings in a key-value store. Online recommendation = ANN lookup over cached embeddings.</div></div>
<div class="calc-card"><div class="card-title">5. ANN retrieval</div><div class="card-body">For each user query embedding, find the top-K nearest item embeddings via FAISS / ScaNN / HNSW. ~10ms per query at billion-item scale.</div></div>
</div>

<div class="calc-highlight"><strong>Stack tip:</strong> in 2026, the modern open-source production stack is <strong>PyTorch Geometric</strong> for training + <strong>FAISS</strong> or <strong>Vespa</strong> for serving + <strong>Feast</strong> for feature store + <strong>Argo Workflows</strong> for the daily inference job. Pinterest, Spotify, Snap all run variants of this.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Recap and Where to Go From Here</h2>
<p class="l-text">You built a real GNN-based recommender end-to-end: from raw tables, through a heterogeneous knowledge graph, to LightGCN-style propagation, to top-K recommendations for actual customers, with three baselines for sanity. The same pattern — encoder + dot product + negative sampling — generalizes to knowledge-graph completion (Wikidata), drug-target interaction (BindingDB), and friend recommendation (Facebook).</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Real recsys = bipartite link prediction with implicit feedback.</li>
<li>Always run popularity, MF (SVD), and Adamic-Adar baselines first.</li>
<li>LightGCN: parameter-free propagation + learned init embeddings — strongest "simple GNN" baseline.</li>
<li>Hetero KG (customer+product+category+country) enables cold-start solutions via content propagation.</li>
<li>Production stack: PyG + FAISS + key-value store + daily MapReduce job; PinSage is the canonical reference.</li>
<li>Watch for popularity bias, filter bubbles, and over-personalization in deployment.</li>
</ul>
</div>

<p class="l-text">From here, the GNN field branches into many directions worth exploring: <strong>temporal GNNs</strong> (TGN, TGAT) for time-evolving graphs (great for fraud detection and traffic), <strong>geometric GNNs</strong> (E(3)-equivariant networks for molecules — see AlphaFold2's invariant point attention), <strong>graph transformers</strong> (Graphormer, GPS) which scale attention across the whole graph, and <strong>graph generation</strong> via diffusion (GeoDiff, EDM) for de novo molecule design. The mathematical foundations you built in L1–L7 transfer to every one of them — the field's surface is broad, but the core ideas are the few you now know.</p>
</div>`,
tr: `<p class="l-text"><strong>Capstone zamanı.</strong> Graf sinir ağlarının en yaygın üretim uygulamasını uçtan uca inşa edeceğiz: bir <em>bilgi grafını</em> (metinden çıkarılmış) <em>işbirlikçi filtreleme</em> (satın alma geçmişinden çıkarılmış) ile birleştiren ve bağlantı tahmini aracılığıyla müşterilere ürün önermek için GNN-tarzı bir yayılım modelini eğiten bir öneri sistemi. Pyodide ön kodunuzda yüklü olan müşteriler, ürünler ve siparişler tabloları gerçek (sentetik ama tutarlı) verilerdir; bunları küçük bir e-ticaret sitesi gibi tam olarak ele alacağız ve önerilerin nasıl çıktığını izleyeceğiz.</p>

<p class="l-text">Üretim analogları: bu, Pinterest'in PinSage'inin, Alibaba'nın GraphRec'inin, Spotify'ın HOP-Rec'inin ve Twitter'ın TwHIN'inin milyar kenarlı ölçekte yaptıklarının indirgenmiş bir versiyonudur. Mimari fikirler — heterojen düğümler (kullanıcılar, ürünler, öznitelikler), iki parçalı mesaj geçişi, iç çarpım bağlantı kod çözücü, BPR kaybı, top-K erişim — aynıdır; sadece ölçek ve mühendislik farklıdır. Bu dersin sonunda, gerçek müşteri kimlikleri için gerçek ürün önerileri hesaplamış, GNN-tarzı bir yaklaşımı klasik bir Adamic-Adar temeline karşı karşılaştırmış ve her yaklaşımın nerede kazandığını anlamış olacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İlişkisel tablolardan heterojen bir bilgi grafı inşa etmek (müşteriler, ürünler, siparişler, öznitelikler)</li>
<li>İki parçalı müşteri-ürün grafında NumPy'da GNN-tarzı ortalama-birleştirme çalıştırmak</li>
<li>Örtük geri bildirim bağlantı tahmini ile gömme vektörlerini eğitmek (BPR kaybı)</li>
<li>Keyfi müşteriler için top-K ürün önerileri üretmek</li>
<li>Aynı görevde GNN, matris faktörizasyonu (SVD) ve Adamic-Adar temellerini karşılaştırmak</li>
<li>Başarısızlık modlarını teşhis etmek: soğuk başlangıç, popülerlik önyargısı, seyreklik</li>
<li>Prototipinizi bir üretim mimarisine eşlemek (PinSage, TwHIN)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Veri: Tablolardan Bilgi Grafına</h2>
<p class="l-text">Kapsamımızda üç tablo var: <code>df_customers</code> (500 satır, ülke, kayıt_tarihi, churn etiketi ile), <code>df_products</code> (39 satır, kategori, fiyat, marka ile) ve <code>df_orders</code> (2000 satır: müşteri_id, ürün_id, miktar, tarih). Bunlardan birden fazla düğüm tipi ve birden fazla kenar tipi olan bir <strong>heterojen bilgi grafı</strong> inşa ediyoruz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Düğüm tipleri</div><div class="card-body">Müşteri (500), Ürün (39), Kategori (~5), Ülke (~10). Her birinin kendi özellik uzayı vardır.</div></div>
<div class="calc-card"><div class="card-title">Kenar tipleri</div><div class="card-body">Müşteri ↔ satın aldı ↔ Ürün, Ürün ↔ kategoride ↔ Kategori, Müşteri ↔ ülkeden ↔ Ülke, ayrıca Ürün-benzer-Ürün (türetilmiş).</div></div>
<div class="calc-card"><div class="card-title">Neden heterojen?</div><div class="card-body">Bir ürünü satın alan müşteri, aynı kategorideki ürünleri satın alan diğer müşterilere yapısal olarak benzerdir. Kategori kenarları, doğrudan kanıt eksik olsa bile sinyali yayar — soğuk başlangıcı çözer.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Yüklü tablolarınızdan heterojen bilgi grafını inşa edin ve temel istatistikleri inceleyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> networkx <span class="kw">as</span> nx

KG = nx.<span class="fn">MultiDiGraph</span>()    <span class="cm"># multi: aynı çift arasında birden fazla kenar (örn. birden fazla sipariş)</span>

<span class="cm"># Müşteri düğümleri ekle</span>
<span class="kw">for</span> _, row <span class="kw">in</span> df_customers.<span class="fn">iterrows</span>():
    KG.<span class="fn">add_node</span>(f<span class="str">"C{row['customer_id']}"</span>, kind=<span class="str">"customer"</span>, country=row.<span class="fn">get</span>(<span class="str">'country'</span>, <span class="str">'N/A'</span>))
<span class="cm"># Ürün düğümleri ekle</span>
<span class="kw">for</span> _, row <span class="kw">in</span> df_products.<span class="fn">iterrows</span>():
    KG.<span class="fn">add_node</span>(f<span class="str">"P{row['product_id']}"</span>, kind=<span class="str">"product"</span>, category=row.<span class="fn">get</span>(<span class="str">'category'</span>, <span class="str">'N/A'</span>))
<span class="cm"># Ürünlerden kategori düğümleri ekle</span>
cats = <span class="fn">set</span>(df_products[<span class="str">'category'</span>].<span class="fn">dropna</span>().<span class="fn">unique</span>())
<span class="kw">for</span> c <span class="kw">in</span> cats:
    KG.<span class="fn">add_node</span>(f<span class="str">"CAT_{c}"</span>, kind=<span class="str">"category"</span>)
    <span class="cm"># Kenar: ürün -> kategoride</span>
    <span class="kw">for</span> pid <span class="kw">in</span> df_products[df_products[<span class="str">'category'</span>] == c][<span class="str">'product_id'</span>]:
        KG.<span class="fn">add_edge</span>(f<span class="str">"P{pid}"</span>, f<span class="str">"CAT_{c}"</span>, kind=<span class="str">"in-category"</span>)
        KG.<span class="fn">add_edge</span>(f<span class="str">"CAT_{c}"</span>, f<span class="str">"P{pid}"</span>, kind=<span class="str">"contains"</span>)
<span class="cm"># Satın alma kenarları ekle</span>
<span class="kw">for</span> _, row <span class="kw">in</span> df_orders.<span class="fn">iterrows</span>():
    KG.<span class="fn">add_edge</span>(f<span class="str">"C{row['customer_id']}"</span>, f<span class="str">"P{row['product_id']}"</span>, kind=<span class="str">"bought"</span>)
    KG.<span class="fn">add_edge</span>(f<span class="str">"P{row['product_id']}"</span>, f<span class="str">"C{row['customer_id']}"</span>, kind=<span class="str">"bought-by"</span>)

<span class="fn">print</span>(f<span class="str">"KG: {KG.number_of_nodes()} düğüm, {KG.number_of_edges()} kenar"</span>)
n_by_kind = {}
<span class="kw">for</span> n, d <span class="kw">in</span> KG.<span class="fn">nodes</span>(data=<span class="kw">True</span>):
    n_by_kind[d[<span class="str">'kind'</span>]] = n_by_kind.<span class="fn">get</span>(d[<span class="str">'kind'</span>], <span class="num">0</span>) + <span class="num">1</span>
<span class="fn">print</span>(<span class="str">"Tipe göre düğümler:"</span>, n_by_kind)

e_by_kind = {}
<span class="kw">for</span> u, v, d <span class="kw">in</span> KG.<span class="fn">edges</span>(data=<span class="kw">True</span>):
    e_by_kind[d[<span class="str">'kind'</span>]] = e_by_kind.<span class="fn">get</span>(d[<span class="str">'kind'</span>], <span class="num">0</span>) + <span class="num">1</span>
<span class="fn">print</span>(<span class="str">"Tipe göre kenarlar:"</span>, e_by_kind)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Örtük Geri Bildirim Öneri Sistemi İçin Eğitim / Test Ayrımı</h2>
<p class="l-text">Standart öneri sistemi ayrımı: müşteri başına <em>en son</em> satın almayı test sorgusu olarak tut, geri kalanı eğitim olarak. Bunu (müşteri, ürün) çiftlerinin %20'sini test kenarları olarak tutarak, eğitim grafından kaldırarak (sızıntı yok) ve sonra onları tahmin etmeye çalışarak taklit ediyoruz.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">80/20 kenar ayrımı. Test kenarları eğitim grafından kaldırıldı — sızıntıyı önlemek için kritik.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
unique_orders = <span class="fn">list</span>(<span class="fn">set</span>((row[<span class="str">'customer_id'</span>], row[<span class="str">'product_id'</span>]) <span class="kw">for</span> _, row <span class="kw">in</span> df_orders.<span class="fn">iterrows</span>()))
<span class="fn">print</span>(<span class="str">"Benzersiz (müşteri, ürün) çiftleri:"</span>, <span class="fn">len</span>(unique_orders))

rng.<span class="fn">shuffle</span>(unique_orders)
n_test = <span class="fn">len</span>(unique_orders) // <span class="num">5</span>
test_pairs = unique_orders[:n_test]
train_pairs = unique_orders[n_test:]
<span class="fn">print</span>(f<span class="str">"Eğitim çiftleri: {len(train_pairs)}  Test çiftleri: {len(test_pairs)}"</span>)

<span class="cm"># Sadece eğitim iki parçalı grafını inşa et</span>
<span class="kw">import</span> networkx <span class="kw">as</span> nx
B_train = nx.<span class="fn">Graph</span>()
<span class="kw">for</span> cid, pid <span class="kw">in</span> train_pairs:
    B_train.<span class="fn">add_edge</span>(f<span class="str">"C{cid}"</span>, f<span class="str">"P{pid}"</span>)
<span class="fn">print</span>(<span class="str">"Eğitim grafı düğümleri:"</span>, B_train.<span class="fn">number_of_nodes</span>(), <span class="str">"kenarlar:"</span>, B_train.<span class="fn">number_of_edges</span>())

<span class="cm"># Sıralı değerlendirme için eşit boyutlu negatif çiftler (kenar olmayanlar) örnekle</span>
products = [f<span class="str">"P{p}"</span> <span class="kw">for</span> p <span class="kw">in</span> df_products[<span class="str">'product_id'</span>].<span class="fn">unique</span>()]
neg_pairs = []
seen = <span class="fn">set</span>((f<span class="str">"C{c}"</span>, f<span class="str">"P{p}"</span>) <span class="kw">for</span> c, p <span class="kw">in</span> unique_orders)
<span class="kw">while</span> <span class="fn">len</span>(neg_pairs) < n_test:
    cid = rng.<span class="fn">choice</span>(df_customers[<span class="str">'customer_id'</span>].values)
    pid = rng.<span class="fn">choice</span>(df_products[<span class="str">'product_id'</span>].values)
    <span class="kw">if</span> (f<span class="str">"C{cid}"</span>, f<span class="str">"P{pid}"</span>) <span class="kw">not</span> <span class="kw">in</span> seen:
        neg_pairs.<span class="fn">append</span>((cid, pid))
<span class="fn">print</span>(<span class="str">"Negatif test çiftleri:"</span>, <span class="fn">len</span>(neg_pairs))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Temel 1 — Saf Popülerlik</h2>
<p class="l-text">İlk temel: herkese küresel olarak en popüler ürünleri öner. Bu, her öneri sisteminin yenmesi gereken zemindir. Süslü GNN'iniz popülerliği yenemiyorsa, bir şey bozuktur.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Popülerlik temeli. Her ürünü skorla = içeri-derecesi. Negatiflere karşı AUC.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score
<span class="kw">from</span> collections <span class="kw">import</span> Counter

<span class="cm"># Sadece eğitim grafından popülerlik</span>
pop = <span class="fn">Counter</span>(pid <span class="kw">for</span> _, pid <span class="kw">in</span> train_pairs)
<span class="kw">def</span> <span class="fn">pop_score</span>(pid): <span class="kw">return</span> pop.<span class="fn">get</span>(pid, <span class="num">0</span>)

pos_scores = [<span class="fn">pop_score</span>(pid) <span class="kw">for</span> _, pid <span class="kw">in</span> test_pairs]
neg_scores = [<span class="fn">pop_score</span>(pid) <span class="kw">for</span> _, pid <span class="kw">in</span> neg_pairs]

y_true = [<span class="num">1</span>]*<span class="fn">len</span>(pos_scores) + [<span class="num">0</span>]*<span class="fn">len</span>(neg_scores)
y_pred = pos_scores + neg_scores
<span class="fn">print</span>(f<span class="str">"Popülerlik AUC: {roc_auc_score(y_true, y_pred):.3f}"</span>)

top5 = pop.<span class="fn">most_common</span>(<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"En popüler 5 ürün:"</span>, top5)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Temel 2 — İki Parçalı Üzerinde Adamic-Adar</h2>
<p class="l-text">Daha güçlü bir temel: her (müşteri, ürün) aday çifti için, uzunluk 2 yolları aracılığıyla kaç "ortak komşu" paylaştıklarını sayın (müşteri → diğer-ürün → satın-alan-diğer-müşteri). Bu, Adamic-Adar / ortak komşuların iki parçalı versiyonudur. Yenmesi şaşırtıcı derecede zordur.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">2-adımlı komşu çakışması ile iki parçalı Adamic-Adar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">aa_bipartite</span>(G, c, p):
    <span class="kw">if</span> <span class="kw">not</span> G.<span class="fn">has_node</span>(c) <span class="kw">or</span> <span class="kw">not</span> G.<span class="fn">has_node</span>(p): <span class="kw">return</span> <span class="num">0.0</span>
    c_neighbors = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(c))    <span class="cm"># müşteri c'nin satın aldığı ürünler</span>
    p_neighbors = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(p))    <span class="cm"># ürün p'yi satın alan müşteriler</span>
    score = <span class="num">0.0</span>
    <span class="kw">for</span> other_p <span class="kw">in</span> c_neighbors:
        <span class="cm"># other_p'yi de satın alan müşteriler — kaç tanesi p'yi de satın aldı?</span>
        co_buyers = <span class="fn">set</span>(G.<span class="fn">neighbors</span>(other_p)) & p_neighbors
        <span class="kw">if</span> co_buyers:
            score += <span class="fn">len</span>(co_buyers) / np.<span class="fn">log</span>(G.<span class="fn">degree</span>(other_p) + <span class="num">2</span>)
    <span class="kw">return</span> score

pos_scores = [<span class="fn">aa_bipartite</span>(B_train, f<span class="str">"C{c}"</span>, f<span class="str">"P{p}"</span>) <span class="kw">for</span> c, p <span class="kw">in</span> test_pairs[:<span class="num">200</span>]]
neg_scores = [<span class="fn">aa_bipartite</span>(B_train, f<span class="str">"C{c}"</span>, f<span class="str">"P{p}"</span>) <span class="kw">for</span> c, p <span class="kw">in</span> neg_pairs[:<span class="num">200</span>]]

y_true = [<span class="num">1</span>]*<span class="fn">len</span>(pos_scores) + [<span class="num">0</span>]*<span class="fn">len</span>(neg_scores)
y_pred = pos_scores + neg_scores
<span class="fn">print</span>(f<span class="str">"Adamic-Adar iki parçalı AUC (200 örnek): {roc_auc_score(y_true, y_pred):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"  pozitif ortalama skor: {np.mean(pos_scores):.3f}  negatif: {np.mean(neg_scores):.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Temel 3 — Matris Faktörizasyonu (Truncated SVD)</h2>
<p class="l-text">Klasik CF: müşteri × ürün etkileşim matrisi $R \\in \\{0, 1\\}^{N_C \\times N_P}$ inşa edin, SVD aracılığıyla $R \\approx U V^\\top$ olarak faktörize edin, $(c, p) = u_c^\\top v_p$ olarak skorlayın. 2009'da Netflix bunu kullandı ve her "derin öğrenme öneri sistemi" makalesinin yenmek zorunda olduğu (ve nadiren yendiği, içinde olduğumuz seyrek-ve-küçük rejimde) şeydir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">(müşteri, ürün) matrisini inşa edin, 16 gizli faktörle TruncatedSVD çalıştırın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> TruncatedSVD

cust_ids = <span class="fn">sorted</span>(df_customers[<span class="str">'customer_id'</span>].<span class="fn">unique</span>())
prod_ids = <span class="fn">sorted</span>(df_products[<span class="str">'product_id'</span>].<span class="fn">unique</span>())
c_idx = {c:i <span class="kw">for</span> i,c <span class="kw">in</span> <span class="fn">enumerate</span>(cust_ids)}
p_idx = {p:i <span class="kw">for</span> i,p <span class="kw">in</span> <span class="fn">enumerate</span>(prod_ids)}

R = np.<span class="fn">zeros</span>((<span class="fn">len</span>(cust_ids), <span class="fn">len</span>(prod_ids)))
<span class="kw">for</span> c, p <span class="kw">in</span> train_pairs:
    R[c_idx[c], p_idx[p]] = <span class="num">1.0</span>
<span class="fn">print</span>(f<span class="str">"Etkileşim matrisi: {R.shape}, yoğunluk={R.mean():.3f}"</span>)

K = <span class="num">16</span>
svd = <span class="fn">TruncatedSVD</span>(n_components=K, random_state=<span class="num">0</span>)
U = svd.<span class="fn">fit_transform</span>(R)              <span class="cm"># (N_c, K)</span>
V = svd.components_.T                  <span class="cm"># (N_p, K)</span>

<span class="kw">def</span> <span class="fn">mf_score</span>(c, p):
    <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> c_idx <span class="kw">or</span> p <span class="kw">not</span> <span class="kw">in</span> p_idx: <span class="kw">return</span> <span class="num">0.0</span>
    <span class="kw">return</span> <span class="fn">float</span>(U[c_idx[c]] @ V[p_idx[p]])

pos_scores = [<span class="fn">mf_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> test_pairs]
neg_scores = [<span class="fn">mf_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> neg_pairs]
<span class="fn">print</span>(f<span class="str">"SVD-MF AUC: {roc_auc_score([1]*len(pos_scores)+[0]*len(neg_scores), pos_scores+neg_scores):.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. GNN: Yinelenen Ortalama Birleştirme (LightGCN-tarzı)</h2>
<p class="l-text">Şimdi gerçek GNN. SVD gömme vektörlerini başlatma olarak alıyoruz ve iki parçalı graf üzerinde $K$ tur ortalama-birleştirme uyguluyoruz — tam olarak LightGCN (He vd. 2020, en güçlü "basit GNN" öneri sistemi temeli). Bir tur: her düğüm için, gömme vektörünü komşularının gömme vektörlerinin ortalaması ile değiştirin. $K$ turdan sonra, tüm turlar arasında ortalama alın (çok katmanlı havuzlama).</p>

<div class="katex-block">$$e_u^{(k+1)} = \\sum_{i \\in N(u)} \\frac{1}{\\sqrt{|N(u)||N(i)|}} e_i^{(k)}, \\qquad e_u = \\frac{1}{K+1}\\sum_{k=0}^K e_u^{(k)}$$</div>

<p class="l-text">Katman başına öğrenilebilir parametre yok — sadece yayılım. Başlangıç gömme vektörleri öğrenilir (veya burada SVD'den alınır). LightGCN, katman başına dönüşümleri kaldırarak 2020'de tüm "derin" öneri sistemi temellerini yendi.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy'da LightGCN-tarzı yayılım. SVD ile başlat, 3 tur yay, ortalama. AUC karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># train_pairs'tan simetrik iki parçalı normalize edilmiş komşuluk inşa et</span>
N_c, N_p = <span class="fn">len</span>(cust_ids), <span class="fn">len</span>(prod_ids)
N = N_c + N_p
<span class="cm"># Düğüm sıralaması: müşteriler 0..N_c-1, ürünler N_c..N</span>
A = np.<span class="fn">zeros</span>((N, N))
<span class="kw">for</span> c, p <span class="kw">in</span> train_pairs:
    i, j = c_idx[c], N_c + p_idx[p]
    A[i, j] = <span class="num">1.0</span>; A[j, i] = <span class="num">1.0</span>

deg = A.<span class="fn">sum</span>(axis=<span class="num">1</span>)
deg_sqrt = np.<span class="fn">where</span>(deg > <span class="num">0</span>, <span class="num">1.0</span>/np.<span class="fn">sqrt</span>(deg), <span class="num">0.0</span>)
A_hat = (deg_sqrt[:, <span class="kw">None</span>] * A) * deg_sqrt[<span class="kw">None</span>, :]   <span class="cm"># simetrik norm</span>

<span class="cm"># Başlangıç gömme vektörleri: SVD U (müşteriler) ve V (ürünler)'i yığınla</span>
E0 = np.<span class="fn">vstack</span>([U, V])
<span class="fn">print</span>(<span class="str">"Başlangıç gömme vektörü şekli:"</span>, E0.shape)

K_layers = <span class="num">3</span>
E_layers = [E0]
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K_layers):
    E_layers.<span class="fn">append</span>(A_hat @ E_layers[-<span class="num">1</span>])

<span class="cm"># Tüm katmanlar arasında ortalama</span>
E = np.<span class="fn">mean</span>(E_layers, axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">"Son gömme vektörü şekli:"</span>, E.shape)

<span class="kw">def</span> <span class="fn">gnn_score</span>(c, p):
    <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> c_idx <span class="kw">or</span> p <span class="kw">not</span> <span class="kw">in</span> p_idx: <span class="kw">return</span> <span class="num">0.0</span>
    <span class="kw">return</span> <span class="fn">float</span>(E[c_idx[c]] @ E[N_c + p_idx[p]])

pos_scores = [<span class="fn">gnn_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> test_pairs]
neg_scores = [<span class="fn">gnn_score</span>(c, p) <span class="kw">for</span> c, p <span class="kw">in</span> neg_pairs]
<span class="fn">print</span>(f<span class="str">"LightGCN-tarzı AUC: {roc_auc_score([1]*len(pos_scores)+[0]*len(neg_scores), pos_scores+neg_scores):.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Gerçek Müşteriler İçin Top-K Önerileri</h2>
<p class="l-text">Şimdi öneri üretmek için eğitilmiş gömme vektörlerini kullanın. Her müşteri için, her ürünü skorla, zaten satın alınmış ürünleri hariç tut, skoru en yüksek top-K'yı döndür.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Üç müşteri kimliği seçin ve GNN skorlarını kullanarak top-5 ürün önerileri üretin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Zaten satın alınanlar haritası</span>
bought = {}
<span class="kw">for</span> c, p <span class="kw">in</span> train_pairs:
    bought.<span class="fn">setdefault</span>(c, <span class="fn">set</span>()).<span class="fn">add</span>(p)

<span class="kw">def</span> <span class="fn">recommend</span>(cid, K=<span class="num">5</span>):
    <span class="kw">if</span> cid <span class="kw">not</span> <span class="kw">in</span> c_idx: <span class="kw">return</span> []
    cu = E[c_idx[cid]]
    scores = E[N_c:] @ cu     <span class="cm"># (N_p,) her ürüne karşı skor</span>
    already = bought.<span class="fn">get</span>(cid, <span class="fn">set</span>())
    <span class="cm"># Zaten satın alınanları maskele</span>
    <span class="kw">for</span> p <span class="kw">in</span> already:
        scores[p_idx[p]] = -<span class="num">1e9</span>
    top = np.<span class="fn">argsort</span>(-scores)[:K]
    <span class="kw">return</span> [(prod_ids[i], <span class="fn">float</span>(scores[i])) <span class="kw">for</span> i <span class="kw">in</span> top]

<span class="cm"># 3 örnek müşteri seç ve öner</span>
sample = <span class="fn">list</span>(df_customers[<span class="str">'customer_id'</span>].<span class="fn">head</span>(<span class="num">3</span>))
<span class="kw">for</span> cid <span class="kw">in</span> sample:
    recs = <span class="fn">recommend</span>(cid, K=<span class="num">5</span>)
    <span class="fn">print</span>(f<span class="str">"\\nMüşteri {cid} zaten satın aldı: {sorted(bought.get(cid, []))[:5]}{'...' if len(bought.get(cid, []))>5 else ''}"</span>)
    <span class="fn">print</span>(f<span class="str">"  Top-5 öneri:"</span>)
    <span class="kw">for</span> pid, s <span class="kw">in</span> recs:
        cat_row = df_products[df_products[<span class="str">'product_id'</span>]==pid]
        cat = cat_row[<span class="str">'category'</span>].values[<span class="num">0</span>] <span class="kw">if</span> <span class="fn">len</span>(cat_row) <span class="kw">else</span> <span class="str">'?'</span>
        <span class="fn">print</span>(f<span class="str">"    P{pid} ({cat}): skor={s:.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Soğuk Başlangıç, Popülerlik Önyargısı, Çeşitlilik</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Soğuk başlangıç (yeni kullanıcılar)</div><div class="card-body">Hiç satın alma olmayan yepyeni bir müşterinin boş komşuluğu vardır — GNN onları gömleyemez. Düzeltme: bir içerik tabanlı kodlayıcı (HeterogeneousGNN) aracılığıyla müşteri özelliklerini (ülke, kayıt_tarihi) kullanın, böylece modelin başlamak için bir şeyi olur.</div></div>
<div class="calc-card"><div class="card-title">Soğuk başlangıç (yeni ürünler)</div><div class="card-body">Aynı sorun tersine. Düzeltme: ürünleri kategorilerinden ve metin açıklamalarından bir içerik kodlayıcı (örn. küçük bir NLP modeli) aracılığıyla göm ve özellikler olarak GNN grafına birleştir.</div></div>
<div class="calc-card"><div class="card-title">Popülerlik önyargısı</div><div class="card-body">Popüler ürünler grafın merkezinde oturur ve sinyal toplar — çok sık önerilirler. Düzeltme: bir çeşitlilik terimi (MMR, determinantal nokta süreçleri) ile yeniden sırala veya popülerlik ile aşağı ağırlıklandır.</div></div>
<div class="calc-card"><div class="card-title">Filtre balonu</div><div class="card-body">Her zaman benzer öğeler önermek keşfi öldürür. Üretim sistemleri top-K-skor ile epsilon-rastgele keşfi karıştırır (çok kollu haydutlar gibi — RL ile bağlanır).</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Prototipten Üretime (PinSage mimarisi)</h2>
<p class="l-text">İnşa ettiğimiz şey tek bir CPU'da belki 100k düğüme ölçeklenir. Üretim öneri sistemleri milyar kenarlı ölçekte yaşar. Mimari tarif (Ying vd. 2018, PinSage):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Rastgele yürüyüş komşuluğu</div><div class="card-body">Her düğüm için, önem-ağırlıklı rastgele yürüyüşler aracılığıyla komşular örnekleyin. Düğüm başına ~50 komşuda sınırlayın — tam yayılımdan çok daha ucuz.</div></div>
<div class="calc-card"><div class="card-title">2. Önem havuzlama</div><div class="card-body">Komşuları rastgele yürüyüşlerden ziyaret sayıları = ağırlıklarla birleştirin. Daha sık ziyaretler = daha güçlü sinyal.</div></div>
<div class="calc-card"><div class="card-title">3. Zor negatif madenciliği</div><div class="card-body">Her pozitif çift için, "karıştırması kolay" negatifler örnekle — aynı kategori, benzer özellikler. Modeli ince ayrımları öğrenmeye zorlar.</div></div>
<div class="calc-card"><div class="card-title">4. MapReduce çıkarımı</div><div class="card-body">GNN ileri geçişini günde bir kez tüm düğümler üzerinde MapReduce'ta gruplandırın. Gömme vektörlerini bir anahtar-değer deposunda önbelleğe alın. Çevrimiçi öneri = önbelleğe alınmış gömme vektörleri üzerinde ANN araması.</div></div>
<div class="calc-card"><div class="card-title">5. ANN erişimi</div><div class="card-body">Her kullanıcı sorgu gömme vektörü için, FAISS / ScaNN / HNSW aracılığıyla en yakın K öğe gömme vektörünü bulun. Milyar öğe ölçeğinde sorgu başına ~10ms.</div></div>
</div>

<div class="calc-highlight"><strong>Yığın ipucu:</strong> 2026'da modern açık kaynaklı üretim yığını eğitim için <strong>PyTorch Geometric</strong> + sunum için <strong>FAISS</strong> veya <strong>Vespa</strong> + özellik deposu için <strong>Feast</strong> + günlük çıkarım işi için <strong>Argo Workflows</strong>'tür. Pinterest, Spotify, Snap hepsi bunun varyantlarını çalıştırır.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Buradan Nereye</h2>
<p class="l-text">Gerçek bir GNN tabanlı öneri sistemini uçtan uca inşa ettiniz: ham tablolardan, heterojen bir bilgi grafından geçerek, LightGCN-tarzı yayılıma, gerçek müşteriler için top-K önerilere, akıl sağlığı için üç temele kadar. Aynı desen — kodlayıcı + iç çarpım + negatif örnekleme — bilgi-grafı tamamlamaya (Wikidata), ilaç-hedef etkileşimine (BindingDB) ve arkadaş önermeye (Facebook) genelleşir.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Gerçek öneri sistemi = örtük geri bildirimle iki parçalı bağlantı tahmini.</li>
<li>Her zaman önce popülerlik, MF (SVD) ve Adamic-Adar temellerini çalıştır.</li>
<li>LightGCN: parametre-içermeyen yayılım + öğrenilmiş başlangıç gömme vektörleri — en güçlü "basit GNN" temeli.</li>
<li>Hetero KG (müşteri+ürün+kategori+ülke) içerik yayılımı aracılığıyla soğuk-başlangıç çözümlerini etkinleştirir.</li>
<li>Üretim yığını: PyG + FAISS + anahtar-değer deposu + günlük MapReduce işi; PinSage klasik referanstır.</li>
<li>Dağıtımda popülerlik önyargısı, filtre balonları ve aşırı-kişiselleştirmeye dikkat edin.</li>
</ul>
</div>

<p class="l-text">Buradan, GNN alanı keşfetmeye değer birçok yöne ayrılır: zaman-evrimli graflar için <strong>zamansal GNN'ler</strong> (TGN, TGAT) (dolandırıcılık tespiti ve trafik için harika), <strong>geometrik GNN'ler</strong> (moleküller için E(3)-eşdeğer ağlar — AlphaFold2'nin değişmez nokta dikkatine bakın), <strong>graf transformerleri</strong> (Graphormer, GPS) tüm graf üzerinde dikkati ölçeklendirir ve <em>de novo</em> molekül tasarımı için difüzyon aracılığıyla <strong>graf üretimi</strong> (GeoDiff, EDM). L1-L7'de inşa ettiğiniz matematiksel temeller her birine aktarılır — alanın yüzeyi geniştir, ancak temel fikirler şimdi bildiğiniz birkaç tanedir.</p>
</div>`
};
