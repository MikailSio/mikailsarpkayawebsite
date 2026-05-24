window.RECSYS_L8 = {

en: `<p class="l-text"><strong>This is the capstone. You will combine everything from this track — collaborative filtering via SVD, content similarity via TF-IDF, popularity backoff, and an LLM that explains the recommendation in natural language — into one system that turns df_orders into a working e-commerce recommender.</strong></p>
<p class="l-text">The architecture mirrors what shipped recently at Amazon, Spotify, and Netflix: a fast retrieval layer surfaces candidates, a deep ranker reorders them, and a generative model writes the user-facing copy ("we picked this jacket because you bought hiking boots last week"). You will build all three layers, run them on the customers / products / orders trio, and return a JSON-shaped recommendation card per user.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN (CAPSTONE)</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Wire collaborative filtering, content similarity, and popularity into one hybrid scorer</li>
<li>Implement weighted score fusion with normalized components</li>
<li>Use TF-IDF on product names as a content fallback for cold-start users</li>
<li>Hold out the last purchase per user and measure HitRate@10 of the hybrid</li>
<li>Wrap the top-K with an LLM-style explanation template</li>
<li>Package the whole pipeline as a function the front-end can call</li>
<li>Identify what to swap in for production (FAISS, real LLM, A/B test)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Pipeline Architecture</h2>
<p class="l-text">The system has four stages. Each stage uses a technique you have already met in this track.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Retrieval</div><div class="card-body">Generate ~100 candidates per user using SVD (collaborative) + TF-IDF (content) + popularity (fallback).</div></div>
<div class="calc-card"><div class="card-title">2. Score fusion</div><div class="card-body">Combine the three scores with learned weights. Normalize each component to [0, 1].</div></div>
<div class="calc-card"><div class="card-title">3. Re-rank rules</div><div class="card-body">Filter already-purchased items, enforce per-category diversity, drop out-of-stock.</div></div>
<div class="calc-card"><div class="card-title">4. Explanation</div><div class="card-body">An LLM (or template) writes the user-facing copy: why we picked this item.</div></div>
</div>
<div class="calc-highlight">RAG (Retrieval-Augmented Generation) for recsys = SVD/TF-IDF picks the items, LLM only narrates. The LLM is never asked to pick from a million items — that is the retrieval layer's job.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Why Hybrid Beats Single Method</h2>
<p class="l-text">Each component fails on a specific user segment. A hybrid stitches the strengths together.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SVD only</div><div class="card-body">Strong for active users, useless for new users (cold start).</div></div>
<div class="calc-card"><div class="card-title">Content only</div><div class="card-body">Recommends similar-looking items but ignores collaborative signals.</div></div>
<div class="calc-card"><div class="card-title">Popularity only</div><div class="card-body">Same recommendations for everyone — boring, no personalization.</div></div>
<div class="calc-card"><div class="card-title">Hybrid</div><div class="card-body">Each handles its segment. Score fusion weights tune the trade-off.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Step 1 — Build the Three Building Blocks</h2>
<p class="l-text">SVD on user x product purchase counts, TF-IDF on product names, and a popularity vector — all from df_orders / df_products.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># --- A. Build user x product matrix and SVD it</span>
mat = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).size().<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
users = mat.index.<span class="fn">tolist</span>()
products = mat.columns.<span class="fn">tolist</span>()
R = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))
U, s, Vt = <span class="fn">svds</span>(R, k=<span class="num">8</span>)
user_emb = U * s              <span class="cm"># scale by singular values</span>
item_emb = Vt.T

<span class="cm"># --- B. TF-IDF on product names</span>
prods = df_products.<span class="fn">set_index</span>(<span class="str">"product_id"</span>).<span class="fn">loc</span>[products]   <span class="cm"># align order</span>
tfidf = <span class="fn">TfidfVectorizer</span>(min_df=<span class="num">1</span>)
P_text = tfidf.<span class="fn">fit_transform</span>(prods[<span class="str">"product_name"</span>].<span class="fn">astype</span>(<span class="fn">str</span>))

<span class="cm"># --- C. Popularity vector</span>
pop = df_orders[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>()
pop_vec = np.<span class="fn">array</span>([pop.<span class="fn">get</span>(p, <span class="num">0</span>) <span class="kw">for</span> p <span class="kw">in</span> products], dtype=<span class="fn">float</span>)
pop_vec = pop_vec / pop_vec.<span class="fn">max</span>()

<span class="fn">print</span>(<span class="str">"users:"</span>, <span class="fn">len</span>(users), <span class="str">"products:"</span>, <span class="fn">len</span>(products))
<span class="fn">print</span>(<span class="str">"user_emb:"</span>, user_emb.shape, <span class="str">"item_emb:"</span>, item_emb.shape)
<span class="fn">print</span>(<span class="str">"tfidf shape:"</span>, P_text.shape, <span class="str">"popularity max=1.0 min=:"</span>, <span class="fn">round</span>(pop_vec.<span class="fn">min</span>(), <span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Pivot orders into a user x product matrix and run rank-8 SVD — this gives latent user and item embeddings. 2) Pull product names in the same order and TF-IDF-vectorize them. 3) Build a normalized popularity vector. 4) Print shapes to confirm everything aligns.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Step 2 — Hybrid Score Function</h2>
<p class="l-text">For each user, compute three score vectors over the catalog and combine them with weights.</p>
<div class="katex-block">$$\\text{score}(u, i) = w_{cf} \\cdot \\hat{s}_{cf}(u, i) + w_{ct} \\cdot \\hat{s}_{ct}(u, i) + w_{pop} \\cdot \\hat{s}_{pop}(i)$$</div>
<p class="l-text">All three components are normalized to [0, 1] per user before combining. Weights start at \\(w_{cf}=0.6, w_{ct}=0.3, w_{pop}=0.1\\) and can later be learned from clicks.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="kw">def</span> <span class="fn">norm01</span>(v):
    lo, hi = v.<span class="fn">min</span>(), v.<span class="fn">max</span>()
    <span class="kw">return</span> (v - lo) / (hi - lo + <span class="num">1e-9</span>)

<span class="kw">def</span> <span class="fn">hybrid_scores</span>(user_idx, w_cf=<span class="num">0.6</span>, w_ct=<span class="num">0.3</span>, w_pop=<span class="num">0.1</span>):
    <span class="cm"># Collaborative</span>
    cf = user_emb[user_idx] @ item_emb.T

    <span class="cm"># Content: profile = mean tfidf of items the user already bought</span>
    bought = np.<span class="fn">where</span>(R[user_idx].toarray().flatten() &gt; <span class="num">0</span>)[<span class="num">0</span>]
    <span class="kw">if</span> <span class="fn">len</span>(bought) == <span class="num">0</span>:
        ct = np.<span class="fn">zeros</span>(<span class="fn">len</span>(products))
    <span class="kw">else</span>:
        profile = P_text[bought].<span class="fn">mean</span>(axis=<span class="num">0</span>)
        ct = np.<span class="fn">asarray</span>(<span class="fn">cosine_similarity</span>(profile, P_text)).flatten()

    cf_n = <span class="fn">norm01</span>(cf); ct_n = <span class="fn">norm01</span>(ct); pop_n = pop_vec
    <span class="kw">return</span> w_cf * cf_n + w_ct * ct_n + w_pop * pop_n

scores = <span class="fn">hybrid_scores</span>(<span class="num">0</span>)
top10 = np.<span class="fn">argsort</span>(-scores)[:<span class="num">10</span>]
<span class="fn">print</span>(<span class="str">"user 0 top-10 product idx:"</span>, top10.<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>norm01</code> rescales any vector to [0, 1]. 2) <code>hybrid_scores</code> computes CF score (dot product), content score (cosine similarity to user's TF-IDF profile of already-bought items), and uses popularity as the third component. 3) Combine with the configured weights. 4) Return top-10 product indices for user 0.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Step 3 — Re-Rank Rules</h2>
<p class="l-text">Production systems never serve raw model scores. Business rules sit on top: never recommend an already-purchased item, ensure category diversity, drop out-of-stock products.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">rerank</span>(user_idx, scores, K=<span class="num">5</span>, max_per_category=<span class="num">2</span>):
    bought = <span class="fn">set</span>(np.<span class="fn">where</span>(R[user_idx].toarray().flatten() &gt; <span class="num">0</span>)[<span class="num">0</span>])
    cat_for = prods[<span class="str">"category"</span>].<span class="fn">tolist</span>() <span class="kw">if</span> <span class="str">"category"</span> <span class="kw">in</span> prods.columns <span class="kw">else</span> [<span class="str">"all"</span>] * <span class="fn">len</span>(products)
    cat_count = {}
    chosen = []
    <span class="kw">for</span> idx <span class="kw">in</span> np.<span class="fn">argsort</span>(-scores):
        <span class="kw">if</span> idx <span class="kw">in</span> bought:                        <span class="cm"># skip already-bought</span>
            <span class="kw">continue</span>
        c = cat_for[idx]
        <span class="kw">if</span> cat_count.<span class="fn">get</span>(c, <span class="num">0</span>) &gt;= max_per_category:    <span class="cm"># diversify</span>
            <span class="kw">continue</span>
        chosen.<span class="fn">append</span>(idx)
        cat_count[c] = cat_count.<span class="fn">get</span>(c, <span class="num">0</span>) + <span class="num">1</span>
        <span class="kw">if</span> <span class="fn">len</span>(chosen) == K:
            <span class="kw">break</span>
    <span class="kw">return</span> chosen

scores = <span class="fn">hybrid_scores</span>(<span class="num">0</span>)
final = <span class="fn">rerank</span>(<span class="num">0</span>, scores, K=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"user 0 final 5 picks (idx):"</span>, final)
<span class="fn">print</span>(<span class="str">"user 0 final 5 picks (name):"</span>, prods.iloc[final][<span class="str">"product_name"</span>].<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build the set of items the user has already bought. 2) Walk down the score-sorted list. 3) Skip if already bought; skip if the category quota is filled; otherwise add to the chosen list. 4) Stop at K. The output is a diverse, fresh top-K.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Step 4 — LLM Explanations (Mock)</h2>
<p class="l-text">In production we would call OpenAI / Anthropic / a hosted Llama. In Pyodide we use a template that takes the recommended product, the user's last purchase, and TF-IDF overlap as the "evidence" and produces a natural-sounding explanation.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="kw">def</span> <span class="fn">explain</span>(user_idx, item_idx):
    user_id = users[user_idx]
    item_name = prods.iloc[item_idx][<span class="str">"product_name"</span>]
    last_orders = (df_orders[df_orders[<span class="str">"customer_id"</span>] == user_id]
                   .<span class="fn">sort_values</span>(<span class="str">"order_date"</span>, ascending=<span class="kw">False</span>))
    <span class="kw">if</span> <span class="fn">len</span>(last_orders) == <span class="num">0</span>:
        <span class="kw">return</span> f<span class="str">"Trending now: {item_name} is one of our most popular picks."</span>
    last_pid = last_orders.iloc[<span class="num">0</span>][<span class="str">"product_id"</span>]
    last_idx = products.<span class="fn">index</span>(last_pid)
    sim = <span class="fn">float</span>(<span class="fn">cosine_similarity</span>(P_text[last_idx], P_text[item_idx])[<span class="num">0</span>, <span class="num">0</span>])
    last_name = df_products.<span class="fn">set_index</span>(<span class="str">"product_id"</span>).<span class="fn">loc</span>[last_pid][<span class="str">"product_name"</span>]
    <span class="kw">if</span> sim &gt; <span class="num">0.15</span>:
        <span class="kw">return</span> f<span class="str">"Because you recently bought '{last_name}', you may also like '{item_name}'."</span>
    <span class="kw">return</span> f<span class="str">"Customers similar to you also enjoyed '{item_name}'."</span>

<span class="kw">for</span> idx <span class="kw">in</span> final[:<span class="num">3</span>]:
    <span class="fn">print</span>(<span class="str">"-"</span> * <span class="num">50</span>)
    <span class="fn">print</span>(<span class="fn">explain</span>(<span class="num">0</span>, idx))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) For each picked item, look up the user's most recent purchase. 2) Compute TF-IDF cosine between that recent item and the recommended one. 3) If similar enough, write a content-based explanation; otherwise fall back to a collaborative-flavored one. 4) For brand-new users with no history, output a popularity message. A real LLM call would replace these templates but keep the same input shape.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. End-to-End Recommend Function</h2>
<p class="l-text">Wrap everything in one function that returns a JSON-shaped recommendation card per user — exactly what the front-end would consume.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json

<span class="kw">def</span> <span class="fn">recommend_for_user</span>(user_id, K=<span class="num">5</span>):
    <span class="kw">if</span> user_id <span class="kw">not</span> <span class="kw">in</span> users:
        <span class="kw">return</span> {<span class="str">"user_id"</span>: user_id, <span class="str">"recs"</span>: [], <span class="str">"reason"</span>: <span class="str">"unknown user"</span>}
    user_idx = users.<span class="fn">index</span>(user_id)
    scores = <span class="fn">hybrid_scores</span>(user_idx)
    final = <span class="fn">rerank</span>(user_idx, scores, K=K)
    recs = []
    <span class="kw">for</span> idx <span class="kw">in</span> final:
        recs.<span class="fn">append</span>({
            <span class="str">"product_id"</span>: <span class="fn">int</span>(products[idx]) <span class="kw">if</span> <span class="fn">isinstance</span>(products[idx], (np.<span class="fn">integer</span>,)) <span class="kw">else</span> products[idx],
            <span class="str">"name"</span>: <span class="fn">str</span>(prods.iloc[idx][<span class="str">"product_name"</span>]),
            <span class="str">"score"</span>: <span class="fn">round</span>(<span class="fn">float</span>(scores[idx]), <span class="num">3</span>),
            <span class="str">"reason"</span>: <span class="fn">explain</span>(user_idx, idx),
        })
    <span class="kw">return</span> {<span class="str">"user_id"</span>: user_id, <span class="str">"recs"</span>: recs}

card = <span class="fn">recommend_for_user</span>(users[<span class="num">0</span>], K=<span class="num">5</span>)
<span class="fn">print</span>(json.<span class="fn">dumps</span>(card, indent=<span class="num">2</span>, default=<span class="fn">str</span>)[:<span class="num">1200</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Look up the user's index, run hybrid scoring and rerank. 2) For each picked product, return id, name, score, and explanation. 3) Print as JSON — the exact shape an API endpoint would return. The front-end can render this directly as a recommendation widget.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Evaluation: HitRate@10 of the Hybrid</h2>
<p class="l-text">Time to measure. Hold out the last purchase per user, train the hybrid on the rest, and check whether the held-out item appears in top-10.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
df[<span class="str">"rank"</span>] = df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>).<span class="fn">cumcount</span>(ascending=<span class="kw">False</span>)
train = df[df[<span class="str">"rank"</span>] &gt; <span class="num">0</span>]
test  = df[df[<span class="str">"rank"</span>] == <span class="num">0</span>]

mat = (train.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).size().<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
users_e = mat.index.<span class="fn">tolist</span>(); products_e = mat.columns.<span class="fn">tolist</span>()
R_e = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))
U, s, Vt = <span class="fn">svds</span>(R_e, k=<span class="num">8</span>)
ue = U * s; ie = Vt.T

pop_e = train[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>()
pop_vec_e = np.<span class="fn">array</span>([pop_e.<span class="fn">get</span>(p, <span class="num">0</span>) <span class="kw">for</span> p <span class="kw">in</span> products_e], dtype=<span class="fn">float</span>)
pop_vec_e = pop_vec_e / pop_vec_e.<span class="fn">max</span>()

hits = <span class="num">0</span>; total = <span class="num">0</span>
<span class="kw">for</span> _, row <span class="kw">in</span> test.<span class="fn">iterrows</span>():
    u, true_p = row[<span class="str">"customer_id"</span>], row[<span class="str">"product_id"</span>]
    <span class="kw">if</span> u <span class="kw">not</span> <span class="kw">in</span> users_e <span class="kw">or</span> true_p <span class="kw">not</span> <span class="kw">in</span> products_e:
        <span class="kw">continue</span>
    ui = users_e.<span class="fn">index</span>(u)
    cf = ue[ui] @ ie.T
    cf_n = (cf - cf.<span class="fn">min</span>()) / (cf.<span class="fn">max</span>() - cf.<span class="fn">min</span>() + <span class="num">1e-9</span>)
    score = <span class="num">0.7</span> * cf_n + <span class="num">0.3</span> * pop_vec_e
    top10 = np.<span class="fn">argsort</span>(-score)[:<span class="num">10</span>]
    pi = products_e.<span class="fn">index</span>(true_p)
    <span class="kw">if</span> pi <span class="kw">in</span> top10:
        hits += <span class="num">1</span>
    total += <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">"Hybrid HitRate@10 = {hits / total:.3f}  ({hits} / {total})"</span>)

<span class="cm"># Compare to popularity baseline</span>
top10_pop = np.<span class="fn">argsort</span>(-pop_vec_e)[:<span class="num">10</span>]
prod_set_pop = {products_e[i] <span class="kw">for</span> i <span class="kw">in</span> top10_pop}
hr_pop = test[<span class="str">"product_id"</span>].<span class="fn">isin</span>(prod_set_pop).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Popularity baseline HitRate@10 = {hr_pop:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Leave-last-out split. 2) Re-build SVD and popularity on the train set. 3) For each test row score the catalog with hybrid (CF + popularity) and check if the held-out item is in top-10. 4) Print hybrid hit rate vs popularity baseline. Hybrid should beat popularity by a meaningful margin.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Real LLM Call (Demo Only in Pyodide)</h2>
<p class="l-text">In production the explanation step calls a real LLM. The pattern is RAG — pass the candidate items, the user's recent history, and a system prompt, and let the model write the copy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.chat_models <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain.prompts <span class="kw">import</span> ChatPromptTemplate

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4"</span>, temperature=<span class="num">0.3</span>)
prompt = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"""
You write recommendation explanations for an e-commerce site.
User recently bought: {recent_items}
We are recommending: {rec_item}
Write one short sentence explaining why this fits the user.
Do not invent facts.
"""</span>)
chain = prompt | llm
out = chain.<span class="fn">invoke</span>({<span class="str">"recent_items"</span>: <span class="str">"hiking boots, wool socks"</span>, <span class="str">"rec_item"</span>: <span class="str">"trail jacket"</span>})
<span class="fn">print</span>(out.content)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternative (browser-runnable)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">langchain is blocked. We mock the LLM by formatting the same prompt template with deterministic logic — useful for unit tests too.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def mock_llm(recent_items, rec_item):
    if not recent_items:
        return f"Try {rec_item} — it is one of our most-loved picks this week."
    main = recent_items[0]
    return (f"Since you recently picked {main}, '{rec_item}' is a natural next step "
            "with the same style and quality.")

print(mock_llm(["hiking boots", "wool socks"], "trail jacket"))
print(mock_llm([], "wireless headphones"))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. What Changes in Real Production</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Retrieval</div><div class="card-body">Replace SVD with Two-Tower + FAISS. 10ms latency at billions-of-items scale.</div></div>
<div class="calc-card"><div class="card-title">Ranker</div><div class="card-body">Replace simple weighted sum with DLRM / DeepFM ranker trained on click logs.</div></div>
<div class="calc-card"><div class="card-title">Sequence model</div><div class="card-body">Add SASRec to capture session intent — what did the user just look at?</div></div>
<div class="calc-card"><div class="card-title">Bandit layer</div><div class="card-body">Use Thompson / LinUCB to explore the long tail without sacrificing CTR.</div></div>
<div class="calc-card"><div class="card-title">LLM</div><div class="card-body">Real Claude / GPT-4 call for explanations and on-the-fly copy generation.</div></div>
<div class="calc-card"><div class="card-title">A/B test</div><div class="card-body">Ship the new model to 5% of users; measure CTR / revenue lift over 2 weeks.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Hybrid vs Components</h2>
<div id="recsys8-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Capstone Recap</h2>
<div class="think-box"><div class="think-label">CAPSTONE TAKEAWAYS</div><div class="think-body"><strong>1.</strong> A real recommender is a pipeline: retrieval -&gt; score fusion -&gt; rerank -&gt; explanation.<br><strong>2.</strong> Hybrid (CF + content + popularity) beats any single component because each fails on a different segment.<br><strong>3.</strong> Score normalization is mandatory — never sum un-normalized scores.<br><strong>4.</strong> Business rules (no duplicates, diversity) sit on top of the model, not inside it.<br><strong>5.</strong> RAG-for-recsys means LLM only narrates — retrieval picks the candidates.<br><strong>6.</strong> Always measure HitRate / NDCG vs the popularity baseline. If you cannot beat it, your hybrid is broken.<br><strong>7.</strong> Production swaps SVD for Two-Tower, weighted sum for DLRM, and the mock LLM for a real one. The skeleton stays.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var labels = ['Popularity', 'CF (SVD)', 'Content (TF-IDF)', 'CF + Pop', 'Hybrid (all 3)'];
  var hr = [0.08, 0.14, 0.10, 0.18, 0.22];
  var data = [{x:labels, y:hr, type:'bar', marker:{color:T.accent}, name:'HitRate@10'}];
  var layout = {title:'HitRate@10: hybrid recommender vs components (illustrative)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'method', gridcolor:T.grid}, yaxis:{title:'HitRate@10', gridcolor:T.grid}, margin:{t:50,r:30,b:80,l:60}};
  ['recsys8-plot-en','recsys8-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Bu capstone (zirve) projesidir. Bu pisteki her şeyi — SVD ile işbirlikçi filtreleme, TF-IDF ile içerik benzerliği, popülerlik fallback ve öneriyi doğal dilde açıklayan bir LLM — birleştirip df_orders'ı çalışan bir e-ticaret öneri sistemine dönüştüren tek bir sistem yapacaksın.</strong></p>
<p class="l-text">Mimari, son zamanlarda Amazon, Spotify ve Netflix'te sahaya sürülenle aynıdır: hızlı bir retrieval katmanı adayları yüzeye çıkarır, derin bir ranker bunları yeniden sıralar ve üretici bir model kullanıcıya yönelik metni yazar ("bu ceketi seçtik çünkü geçen hafta yürüyüş botu aldın"). Her üç katmanı da inşa edecek, müşteriler / ürünler / siparişler üçlüsü üzerinde çalıştıracak ve kullanıcı başına JSON şeklinde bir öneri kartı döndüreceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN (CAPSTONE)</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İşbirlikçi filtreleme, içerik benzerliği ve popülerliği tek bir hibrit skorlayıcıda birleştir</li>
<li>Normalize bileşenlerle ağırlıklı skor füzyonu uygula</li>
<li>Soğuk başlangıç kullanıcıları için içerik fallback olarak ürün adlarında TF-IDF kullan</li>
<li>Kullanıcı başına son satın alımı tut ve hibridin HitRate@10'unu ölç</li>
<li>Top-K'yı LLM tarzı bir açıklama şablonuyla sar</li>
<li>Tüm pipeline'ı ön ucun çağırabileceği bir fonksiyon olarak paketle</li>
<li>Üretim için neyin değiştirileceğini belirle (FAISS, gerçek LLM, A/B test)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Pipeline Mimarisi</h2>
<p class="l-text">Sistemde dört aşama var. Her aşama bu pistte zaten karşılaştığın bir tekniği kullanıyor.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Retrieval</div><div class="card-body">SVD (işbirlikçi) + TF-IDF (içerik) + popülerlik (fallback) kullanarak kullanıcı başına ~100 aday üret.</div></div>
<div class="calc-card"><div class="card-title">2. Skor füzyonu</div><div class="card-body">Üç skoru öğrenilmiş ağırlıklarla birleştir. Her bileşeni [0, 1]'e normalize et.</div></div>
<div class="calc-card"><div class="card-title">3. Yeniden sıralama kuralları</div><div class="card-body">Zaten satın alınan maddeleri filtrele, kategori başına çeşitliliği zorla, stokta olmayanları düşür.</div></div>
<div class="calc-card"><div class="card-title">4. Açıklama</div><div class="card-body">Bir LLM (veya şablon) kullanıcıya yönelik metni yazar: bu maddeyi neden seçtik.</div></div>
</div>
<div class="calc-highlight">Recsys için RAG (Retrieval-Augmented Generation) = SVD/TF-IDF maddeleri seçer, LLM yalnızca anlatır. LLM'den asla bir milyon maddeden seçim yapması istenmez — bu retrieval katmanının işidir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Hibrit Neden Tek Yöntemi Yener</h2>
<p class="l-text">Her bileşen belirli bir kullanıcı segmentinde başarısız olur. Bir hibrit güçleri birbirine diker.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yalnızca SVD</div><div class="card-body">Aktif kullanıcılar için güçlü, yeni kullanıcılar için yararsız (soğuk başlangıç).</div></div>
<div class="calc-card"><div class="card-title">Yalnızca içerik</div><div class="card-body">Benzer görünümlü maddeler önerir ama işbirlikçi sinyalleri görmezden gelir.</div></div>
<div class="calc-card"><div class="card-title">Yalnızca popülerlik</div><div class="card-body">Herkese aynı öneriler — sıkıcı, kişiselleştirme yok.</div></div>
<div class="calc-card"><div class="card-title">Hibrit</div><div class="card-body">Her biri kendi segmentini halleder. Skor füzyon ağırlıkları takası ayarlar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Adım 1 — Üç Yapı Bloğunu Kur</h2>
<p class="l-text">Kullanıcı x ürün satın alma sayıları üzerinde SVD, ürün adlarında TF-IDF ve bir popülerlik vektörü — hepsi df_orders / df_products'tan.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># --- A. Kullanıcı x ürün matrisini kur ve SVD'sini al</span>
mat = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).size().<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
users = mat.index.<span class="fn">tolist</span>()
products = mat.columns.<span class="fn">tolist</span>()
R = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))
U, s, Vt = <span class="fn">svds</span>(R, k=<span class="num">8</span>)
user_emb = U * s              <span class="cm"># tekil değerlerle ölçekle</span>
item_emb = Vt.T

<span class="cm"># --- B. Ürün adlarında TF-IDF</span>
prods = df_products.<span class="fn">set_index</span>(<span class="str">"product_id"</span>).<span class="fn">loc</span>[products]   <span class="cm"># sıraya hizala</span>
tfidf = <span class="fn">TfidfVectorizer</span>(min_df=<span class="num">1</span>)
P_text = tfidf.<span class="fn">fit_transform</span>(prods[<span class="str">"product_name"</span>].<span class="fn">astype</span>(<span class="fn">str</span>))

<span class="cm"># --- C. Popülerlik vektörü</span>
pop = df_orders[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>()
pop_vec = np.<span class="fn">array</span>([pop.<span class="fn">get</span>(p, <span class="num">0</span>) <span class="kw">for</span> p <span class="kw">in</span> products], dtype=<span class="fn">float</span>)
pop_vec = pop_vec / pop_vec.<span class="fn">max</span>()

<span class="fn">print</span>(<span class="str">"users:"</span>, <span class="fn">len</span>(users), <span class="str">"products:"</span>, <span class="fn">len</span>(products))
<span class="fn">print</span>(<span class="str">"user_emb:"</span>, user_emb.shape, <span class="str">"item_emb:"</span>, item_emb.shape)
<span class="fn">print</span>(<span class="str">"tfidf shape:"</span>, P_text.shape, <span class="str">"popularity max=1.0 min=:"</span>, <span class="fn">round</span>(pop_vec.<span class="fn">min</span>(), <span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>İşleyiş:</strong> 1) Siparişleri kullanıcı x ürün matrisine pivot et ve rank-8 SVD çalıştır — bu gizli kullanıcı ve madde gömmeleri verir. 2) Ürün adlarını aynı sırada çek ve TF-IDF-vektörle. 3) Normalize bir popülerlik vektörü kur. 4) Her şeyin hizalandığını doğrulamak için şekilleri yazdır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Adım 2 — Hibrit Skor Fonksiyonu</h2>
<p class="l-text">Her kullanıcı için katalog üzerinde üç skor vektörü hesapla ve bunları ağırlıklarla birleştir.</p>
<div class="katex-block">$$\\text{score}(u, i) = w_{cf} \\cdot \\hat{s}_{cf}(u, i) + w_{ct} \\cdot \\hat{s}_{ct}(u, i) + w_{pop} \\cdot \\hat{s}_{pop}(i)$$</div>
<p class="l-text">Üç bileşen birleştirilmeden önce kullanıcı başına [0, 1]'e normalize edilir. Ağırlıklar \\(w_{cf}=0.6, w_{ct}=0.3, w_{pop}=0.1\\) ile başlar ve sonradan tıklamalardan öğrenilebilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="kw">def</span> <span class="fn">norm01</span>(v):
    lo, hi = v.<span class="fn">min</span>(), v.<span class="fn">max</span>()
    <span class="kw">return</span> (v - lo) / (hi - lo + <span class="num">1e-9</span>)

<span class="kw">def</span> <span class="fn">hybrid_scores</span>(user_idx, w_cf=<span class="num">0.6</span>, w_ct=<span class="num">0.3</span>, w_pop=<span class="num">0.1</span>):
    <span class="cm"># İşbirlikçi</span>
    cf = user_emb[user_idx] @ item_emb.T

    <span class="cm"># İçerik: profil = kullanıcının zaten satın aldığı maddelerin ortalama tfidf'i</span>
    bought = np.<span class="fn">where</span>(R[user_idx].toarray().flatten() &gt; <span class="num">0</span>)[<span class="num">0</span>]
    <span class="kw">if</span> <span class="fn">len</span>(bought) == <span class="num">0</span>:
        ct = np.<span class="fn">zeros</span>(<span class="fn">len</span>(products))
    <span class="kw">else</span>:
        profile = P_text[bought].<span class="fn">mean</span>(axis=<span class="num">0</span>)
        ct = np.<span class="fn">asarray</span>(<span class="fn">cosine_similarity</span>(profile, P_text)).flatten()

    cf_n = <span class="fn">norm01</span>(cf); ct_n = <span class="fn">norm01</span>(ct); pop_n = pop_vec
    <span class="kw">return</span> w_cf * cf_n + w_ct * ct_n + w_pop * pop_n

scores = <span class="fn">hybrid_scores</span>(<span class="num">0</span>)
top10 = np.<span class="fn">argsort</span>(-scores)[:<span class="num">10</span>]
<span class="fn">print</span>(<span class="str">"user 0 top-10 product idx:"</span>, top10.<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>İşleyiş:</strong> 1) <code>norm01</code> herhangi bir vektörü [0, 1]'e yeniden ölçekler. 2) <code>hybrid_scores</code> CF skorunu (iç çarpım), içerik skorunu (kullanıcının zaten alınmış maddelerinin TF-IDF profiline kosinüs benzerliği) hesaplar ve popülerliği üçüncü bileşen olarak kullanır. 3) Yapılandırılmış ağırlıklarla birleştir. 4) Kullanıcı 0 için top-10 ürün indekslerini döndür.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Adım 3 — Yeniden Sıralama Kuralları</h2>
<p class="l-text">Üretim sistemleri asla ham model skorları sunmaz. Üstte iş kuralları oturur: zaten satın alınmış maddeyi asla önerme, kategori çeşitliliği sağla, stokta olmayan ürünleri düşür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">rerank</span>(user_idx, scores, K=<span class="num">5</span>, max_per_category=<span class="num">2</span>):
    bought = <span class="fn">set</span>(np.<span class="fn">where</span>(R[user_idx].toarray().flatten() &gt; <span class="num">0</span>)[<span class="num">0</span>])
    cat_for = prods[<span class="str">"category"</span>].<span class="fn">tolist</span>() <span class="kw">if</span> <span class="str">"category"</span> <span class="kw">in</span> prods.columns <span class="kw">else</span> [<span class="str">"all"</span>] * <span class="fn">len</span>(products)
    cat_count = {}
    chosen = []
    <span class="kw">for</span> idx <span class="kw">in</span> np.<span class="fn">argsort</span>(-scores):
        <span class="kw">if</span> idx <span class="kw">in</span> bought:                        <span class="cm"># zaten alınmış olanı atla</span>
            <span class="kw">continue</span>
        c = cat_for[idx]
        <span class="kw">if</span> cat_count.<span class="fn">get</span>(c, <span class="num">0</span>) &gt;= max_per_category:    <span class="cm"># çeşitlendir</span>
            <span class="kw">continue</span>
        chosen.<span class="fn">append</span>(idx)
        cat_count[c] = cat_count.<span class="fn">get</span>(c, <span class="num">0</span>) + <span class="num">1</span>
        <span class="kw">if</span> <span class="fn">len</span>(chosen) == K:
            <span class="kw">break</span>
    <span class="kw">return</span> chosen

scores = <span class="fn">hybrid_scores</span>(<span class="num">0</span>)
final = <span class="fn">rerank</span>(<span class="num">0</span>, scores, K=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"user 0 final 5 picks (idx):"</span>, final)
<span class="fn">print</span>(<span class="str">"user 0 final 5 picks (name):"</span>, prods.iloc[final][<span class="str">"product_name"</span>].<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>İşleyiş:</strong> 1) Kullanıcının zaten aldığı maddelerin kümesini kur. 2) Skor-sıralı listede yürü. 3) Zaten alınmışsa atla; kategori kotası dolduysa atla; aksi halde seçilen listeye ekle. 4) K'da dur. Çıktı çeşitli ve taze bir top-K'dır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Adım 4 — LLM Açıklamaları (Mock)</h2>
<p class="l-text">Üretimde OpenAI / Anthropic / barındırılmış bir Llama'yı çağırırdık. Pyodide'de önerilen ürünü, kullanıcının son satın alımını ve TF-IDF örtüşmesini "kanıt" olarak alıp doğal sesli bir açıklama üreten bir şablon kullanıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="kw">def</span> <span class="fn">explain</span>(user_idx, item_idx):
    user_id = users[user_idx]
    item_name = prods.iloc[item_idx][<span class="str">"product_name"</span>]
    last_orders = (df_orders[df_orders[<span class="str">"customer_id"</span>] == user_id]
                   .<span class="fn">sort_values</span>(<span class="str">"order_date"</span>, ascending=<span class="kw">False</span>))
    <span class="kw">if</span> <span class="fn">len</span>(last_orders) == <span class="num">0</span>:
        <span class="kw">return</span> f<span class="str">"Trending now: {item_name} is one of our most popular picks."</span>
    last_pid = last_orders.iloc[<span class="num">0</span>][<span class="str">"product_id"</span>]
    last_idx = products.<span class="fn">index</span>(last_pid)
    sim = <span class="fn">float</span>(<span class="fn">cosine_similarity</span>(P_text[last_idx], P_text[item_idx])[<span class="num">0</span>, <span class="num">0</span>])
    last_name = df_products.<span class="fn">set_index</span>(<span class="str">"product_id"</span>).<span class="fn">loc</span>[last_pid][<span class="str">"product_name"</span>]
    <span class="kw">if</span> sim &gt; <span class="num">0.15</span>:
        <span class="kw">return</span> f<span class="str">"Because you recently bought '{last_name}', you may also like '{item_name}'."</span>
    <span class="kw">return</span> f<span class="str">"Customers similar to you also enjoyed '{item_name}'."</span>

<span class="kw">for</span> idx <span class="kw">in</span> final[:<span class="num">3</span>]:
    <span class="fn">print</span>(<span class="str">"-"</span> * <span class="num">50</span>)
    <span class="fn">print</span>(<span class="fn">explain</span>(<span class="num">0</span>, idx))</code></pre></div>
<p class="l-text"><strong>Mantık şöyle:</strong> 1) Seçilen her madde için kullanıcının en yeni satın alımını ara. 2) O yeni madde ile önerilen arasında TF-IDF kosinüsü hesapla. 3) Yeterince benzerse içerik tabanlı bir açıklama yaz; aksi halde işbirlikçi tarzda olana geri dön. 4) Geçmişi olmayan yepyeni kullanıcılar için bir popülerlik mesajı çıkar. Gerçek bir LLM çağrısı bu şablonların yerine geçer ama aynı girdi şeklini korur.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Uçtan Uca Öneri Fonksiyonu</h2>
<p class="l-text">Her şeyi, kullanıcı başına JSON şeklinde bir öneri kartı döndüren tek bir fonksiyona sar — ön ucun tam olarak tüketeceği şey.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json

<span class="kw">def</span> <span class="fn">recommend_for_user</span>(user_id, K=<span class="num">5</span>):
    <span class="kw">if</span> user_id <span class="kw">not</span> <span class="kw">in</span> users:
        <span class="kw">return</span> {<span class="str">"user_id"</span>: user_id, <span class="str">"recs"</span>: [], <span class="str">"reason"</span>: <span class="str">"unknown user"</span>}
    user_idx = users.<span class="fn">index</span>(user_id)
    scores = <span class="fn">hybrid_scores</span>(user_idx)
    final = <span class="fn">rerank</span>(user_idx, scores, K=K)
    recs = []
    <span class="kw">for</span> idx <span class="kw">in</span> final:
        recs.<span class="fn">append</span>({
            <span class="str">"product_id"</span>: <span class="fn">int</span>(products[idx]) <span class="kw">if</span> <span class="fn">isinstance</span>(products[idx], (np.<span class="fn">integer</span>,)) <span class="kw">else</span> products[idx],
            <span class="str">"name"</span>: <span class="fn">str</span>(prods.iloc[idx][<span class="str">"product_name"</span>]),
            <span class="str">"score"</span>: <span class="fn">round</span>(<span class="fn">float</span>(scores[idx]), <span class="num">3</span>),
            <span class="str">"reason"</span>: <span class="fn">explain</span>(user_idx, idx),
        })
    <span class="kw">return</span> {<span class="str">"user_id"</span>: user_id, <span class="str">"recs"</span>: recs}

card = <span class="fn">recommend_for_user</span>(users[<span class="num">0</span>], K=<span class="num">5</span>)
<span class="fn">print</span>(json.<span class="fn">dumps</span>(card, indent=<span class="num">2</span>, default=<span class="fn">str</span>)[:<span class="num">1200</span>])</code></pre></div>
<p class="l-text"><strong>Burada neler oluyor:</strong> 1) Kullanıcının indeksini ara, hibrit skorlama ve yeniden sıralama çalıştır. 2) Seçilen her ürün için id, ad, skor ve açıklama döndür. 3) JSON olarak yazdır — bir API endpoint'inin döneceği tam şekil. Ön uç bunu doğrudan bir öneri widget'ı olarak render edebilir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Değerlendirme: Hibridin HitRate@10'u</h2>
<p class="l-text">Ölçme zamanı. Kullanıcı başına son satın alımı tut, hibridi geri kalanı üzerinde eğit ve tutulan maddenin top-10'da görünüp görünmediğini kontrol et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
df[<span class="str">"rank"</span>] = df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>).<span class="fn">cumcount</span>(ascending=<span class="kw">False</span>)
train = df[df[<span class="str">"rank"</span>] &gt; <span class="num">0</span>]
test  = df[df[<span class="str">"rank"</span>] == <span class="num">0</span>]

mat = (train.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).size().<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
users_e = mat.index.<span class="fn">tolist</span>(); products_e = mat.columns.<span class="fn">tolist</span>()
R_e = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))
U, s, Vt = <span class="fn">svds</span>(R_e, k=<span class="num">8</span>)
ue = U * s; ie = Vt.T

pop_e = train[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>()
pop_vec_e = np.<span class="fn">array</span>([pop_e.<span class="fn">get</span>(p, <span class="num">0</span>) <span class="kw">for</span> p <span class="kw">in</span> products_e], dtype=<span class="fn">float</span>)
pop_vec_e = pop_vec_e / pop_vec_e.<span class="fn">max</span>()

hits = <span class="num">0</span>; total = <span class="num">0</span>
<span class="kw">for</span> _, row <span class="kw">in</span> test.<span class="fn">iterrows</span>():
    u, true_p = row[<span class="str">"customer_id"</span>], row[<span class="str">"product_id"</span>]
    <span class="kw">if</span> u <span class="kw">not</span> <span class="kw">in</span> users_e <span class="kw">or</span> true_p <span class="kw">not</span> <span class="kw">in</span> products_e:
        <span class="kw">continue</span>
    ui = users_e.<span class="fn">index</span>(u)
    cf = ue[ui] @ ie.T
    cf_n = (cf - cf.<span class="fn">min</span>()) / (cf.<span class="fn">max</span>() - cf.<span class="fn">min</span>() + <span class="num">1e-9</span>)
    score = <span class="num">0.7</span> * cf_n + <span class="num">0.3</span> * pop_vec_e
    top10 = np.<span class="fn">argsort</span>(-score)[:<span class="num">10</span>]
    pi = products_e.<span class="fn">index</span>(true_p)
    <span class="kw">if</span> pi <span class="kw">in</span> top10:
        hits += <span class="num">1</span>
    total += <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">"Hybrid HitRate@10 = {hits / total:.3f}  ({hits} / {total})"</span>)

<span class="cm"># Popülerlik tabanıyla karşılaştır</span>
top10_pop = np.<span class="fn">argsort</span>(-pop_vec_e)[:<span class="num">10</span>]
prod_set_pop = {products_e[i] <span class="kw">for</span> i <span class="kw">in</span> top10_pop}
hr_pop = test[<span class="str">"product_id"</span>].<span class="fn">isin</span>(prod_set_pop).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Popularity baseline HitRate@10 = {hr_pop:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>İşin özü:</strong> 1) Leave-last-out bölmesi. 2) Train seti üzerinde SVD ve popülerliği yeniden kur. 3) Her test satırı için kataloğu hibritle (CF + popülerlik) skorla ve tutulan maddenin top-10'da olup olmadığını kontrol et. 4) Hibrit hit rate'ini popülerlik tabanına karşı yazdır. Hibrit popülerliği anlamlı bir farkla yenmelidir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Gerçek LLM Çağrısı (Pyodide'de Yalnızca Demo)</h2>
<p class="l-text">Üretimde açıklama adımı gerçek bir LLM'i çağırır. Desen RAG'dir — aday maddeleri, kullanıcının son geçmişini ve bir sistem prompt'unu geçir, modelin metni yazmasına izin ver.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.chat_models <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain.prompts <span class="kw">import</span> ChatPromptTemplate

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4"</span>, temperature=<span class="num">0.3</span>)
prompt = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"""
You write recommendation explanations for an e-commerce site.
User recently bought: {recent_items}
We are recommending: {rec_item}
Write one short sentence explaining why this fits the user.
Do not invent facts.
"""</span>)
chain = prompt | llm
out = chain.<span class="fn">invoke</span>({<span class="str">"recent_items"</span>: <span class="str">"hiking boots, wool socks"</span>, <span class="str">"rec_item"</span>: <span class="str">"trail jacket"</span>})
<span class="fn">print</span>(out.content)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternatifi (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">langchain engellenmiş. LLM'i deterministik mantıkla aynı prompt şablonunu biçimlendirerek mock'luyoruz — birim testleri için de yararlı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def mock_llm(recent_items, rec_item):
    if not recent_items:
        return f"Try {rec_item} — it is one of our most-loved picks this week."
    main = recent_items[0]
    return (f"Since you recently picked {main}, '{rec_item}' is a natural next step "
            "with the same style and quality.")

print(mock_llm(["hiking boots", "wool socks"], "trail jacket"))
print(mock_llm([], "wireless headphones"))</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Gerçek Üretimde Ne Değişir</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Retrieval</div><div class="card-body">SVD'yi Two-Tower + FAISS ile değiştir. Milyarlarca madde ölçeğinde 10ms gecikme.</div></div>
<div class="calc-card"><div class="card-title">Ranker</div><div class="card-body">Basit ağırlıklı toplamı, tıklama günlüklerinde eğitilmiş DLRM / DeepFM ranker ile değiştir.</div></div>
<div class="calc-card"><div class="card-title">Dizi modeli</div><div class="card-body">Oturum niyetini yakalamak için SASRec ekle — kullanıcı az önce neye baktı?</div></div>
<div class="calc-card"><div class="card-title">Bandit katmanı</div><div class="card-body">CTR'yi feda etmeden uzun kuyruğu keşfetmek için Thompson / LinUCB kullan.</div></div>
<div class="calc-card"><div class="card-title">LLM</div><div class="card-body">Açıklamalar ve anında metin üretimi için gerçek Claude / GPT-4 çağrısı.</div></div>
<div class="calc-card"><div class="card-title">A/B test</div><div class="card-body">Yeni modeli kullanıcıların %5'ine sür; 2 hafta boyunca CTR / gelir artışını ölç.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Hibrit vs Bileşenler</h2>
<div id="recsys8-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Capstone Özeti</h2>
<div class="think-box"><div class="think-label">CAPSTONE ÇIKARIMLARI</div><div class="think-body"><strong>1.</strong> Gerçek bir öneri sistemi bir pipeline'dır: retrieval -&gt; skor füzyonu -&gt; rerank -&gt; açıklama.<br><strong>2.</strong> Hibrit (CF + içerik + popülerlik) herhangi tek bir bileşeni yener çünkü her biri farklı bir segmentte başarısız olur.<br><strong>3.</strong> Skor normalizasyonu zorunludur — asla normalize edilmemiş skorları toplama.<br><strong>4.</strong> İş kuralları (tekrar yok, çeşitlilik) modelin üstünde oturur, içinde değil.<br><strong>5.</strong> Recsys-için-RAG, LLM'in yalnızca anlattığı anlamına gelir — retrieval adayları seçer.<br><strong>6.</strong> Her zaman HitRate / NDCG'yi popülerlik tabanına karşı ölç. Eğer onu yenemezsen, hibridin bozuktur.<br><strong>7.</strong> Üretim SVD'yi Two-Tower'a, ağırlıklı toplamı DLRM'e ve mock LLM'i gerçeğine değiştirir. İskelet kalır.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
