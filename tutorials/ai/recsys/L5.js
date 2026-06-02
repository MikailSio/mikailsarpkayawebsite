window.RECSYS_L5 = {

en: `<p class="l-text"><strong>The dot product is a 60-year-old similarity function. Why should it be the only way to score (user, item)?</strong> In 2016 Cheng et al. at Google released Wide &amp; Deep, the first paper to seriously argue that linear cross-features and a deep MLP belong together. A year later He et al. introduced NCF, replacing the dot product with a neural network that learns its own scoring function. Combined with DeepFM, these models still drive most ad-tech and ranking systems today.</p>
<p class="l-text">In this lesson you will learn the architectural choices that turn matrix factorization into a deep recommender, why <em>memorization (wide)</em> and <em>generalization (deep)</em> need each other, and how DeepFM unifies them with explicit feature interactions. You will then train a small NCF in sklearn on df_orders and a Wide&amp;Deep-style hybrid that combines a popularity feature with learned embeddings.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Replace the dot product with a learned scoring MLP (NCF, He 2017)</li>
<li>Combine wide linear cross-features with a deep MLP (Cheng 2016)</li>
<li>Add factorization machines on top of the wide tower (DeepFM, Guo 2017)</li>
<li>Build embedding tables for sparse categorical features</li>
<li>Train an NCF-style model in sklearn on (user_emb, item_emb) -&gt; click</li>
<li>Read DLRM (Naumov 2019) and recognize how Meta scales these ideas</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. NCF: Replacing the Dot Product</h2>
<p class="l-text">In MF the score is \\(\\hat{r}_{ui} = u^T v_i\\). NCF says: why fix the function? Concatenate the two embeddings and feed them to an MLP that learns its own combination.</p>
<div class="katex-block">$$\\hat{r}_{ui} = \\sigma\\big( h^T \\phi(W_L \\phi(\\cdots W_1 [u; v_i] \\cdots)) \\big)$$</div>
<p class="l-text">where \\([u; v_i]\\) is concatenation, \\(\\phi\\) is ReLU, and \\(\\sigma\\) is sigmoid. NCF can in principle approximate any score function, including the dot product itself. He et al. showed it beats MF on MovieLens and Pinterest.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GMF</div><div class="card-body">Generalized MF: element-wise product u * v_i fed through one linear layer.</div></div>
<div class="calc-card"><div class="card-title">MLP</div><div class="card-body">Concat then deep MLP. Captures non-linear interactions.</div></div>
<div class="calc-card"><div class="card-title">NeuMF</div><div class="card-body">GMF + MLP towers concatenated then projected. The full NCF model.</div></div>
<div class="calc-card"><div class="card-title">Loss</div><div class="card-body">BCE over (user, item, label) — label = 1 for positives, 0 for sampled negatives.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Wide &amp; Deep (Cheng 2016)</h2>
<p class="l-text">Google's app store team noticed that two failure modes hurt conversion: <em>under-memorization</em> (model forgets that users who installed Netflix tend to install Hulu) and <em>over-generalization</em> (model recommends weird interpolations no one asked for). Wide &amp; Deep splits the work:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wide tower</div><div class="card-body">Linear model on raw cross-features (user_country x item_category). Memorizes co-occurrences.</div></div>
<div class="calc-card"><div class="card-title">Deep tower</div><div class="card-body">MLP on dense embeddings. Generalizes to unseen feature combinations.</div></div>
<div class="calc-card"><div class="card-title">Joint training</div><div class="card-body">Both towers' outputs are summed and passed through one sigmoid. Backprop updates both.</div></div>
<div class="calc-card"><div class="card-title">Production fact</div><div class="card-body">Adding the wide tower lifted Google Play install rate by 3.9% online.</div></div>
</div>
<div class="calc-highlight">"Memorize what you have seen, generalize to what you have not." This is the slogan worth tattooing on a recsys engineer.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DeepFM (Guo 2017)</h2>
<p class="l-text">Wide &amp; Deep needs hand-engineered cross features. DeepFM replaces the wide tower with a Factorization Machine, which automatically learns all pairwise interactions:</p>
<div class="katex-block">$$y_{FM} = w_0 + \\sum_i w_i x_i + \\sum_{i&lt;j} \\langle v_i, v_j \\rangle x_i x_j$$</div>
<p class="l-text">The same embeddings \\(v_i\\) feed both the FM (for explicit pairwise terms) and the deep MLP (for higher-order terms). One model, two heads, summed and trained jointly.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Embedding Tables for Sparse Features</h2>
<p class="l-text">Real ad systems have hundreds of categorical features (user_country, item_brand, day_of_week, query_intent, ...). Each maps to an embedding table: a (vocab_size, dim) matrix where row i is the dense vector for category i. The sum of all features' embeddings is the model's input.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vocab size</div><div class="card-body">Tens of thousands to billions (item ids).</div></div>
<div class="calc-card"><div class="card-title">Embedding dim</div><div class="card-body">8 (rare features) to 256 (item ids). Memory dominates.</div></div>
<div class="calc-card"><div class="card-title">Hashing trick</div><div class="card-body">Hash high-cardinality features into k buckets to bound memory.</div></div>
<div class="calc-card"><div class="card-title">DLRM (Meta 2019)</div><div class="card-body">Embedding tables for categoricals + bottom MLP for densenets + top MLP for prediction. Trained on TBs of data.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Generate Training Triples (positive + sampled negative)</h2>
<p class="l-text">For NCF we need (user, item, label). Positives are real purchases; negatives are randomly drawn unobserved items.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2); ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)
pos_set = ints.<span class="fn">groupby</span>(<span class="str">"u"</span>)[<span class="str">"i"</span>].<span class="fn">apply</span>(<span class="fn">set</span>).to_dict()

n_u, n_i = <span class="fn">len</span>(users), <span class="fn">len</span>(items)
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
pos = ints[[<span class="str">"u"</span>, <span class="str">"i"</span>]].values
neg = []
<span class="kw">for</span> u, _ <span class="kw">in</span> pos:
    j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    <span class="kw">while</span> j <span class="kw">in</span> pos_set[<span class="fn">int</span>(u)]:
        j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    neg.<span class="fn">append</span>([u, j])
neg = np.<span class="fn">array</span>(neg)

X_idx = np.<span class="fn">vstack</span>([pos, neg])
y = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(<span class="fn">len</span>(pos)), np.<span class="fn">zeros</span>(<span class="fn">len</span>(neg))])
<span class="fn">print</span>(<span class="str">"total training rows:"</span>, <span class="fn">len</span>(X_idx), <span class="str">"positives:"</span>, <span class="fn">int</span>(y.<span class="fn">sum</span>()))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Encode user / item ids. 2) Build a positives-set lookup. 3) For each positive, draw one random negative that the user has not interacted with. 4) Stack positives and negatives into a single dataset with binary labels. NCF training will see equal classes.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. NCF in sklearn (concat + MLP)</h2>
<p class="l-text">We approximate NCF with two embedding tables (random init then learned via SGD via the MLP) and an MLPRegressor that consumes the concatenated user + item embeddings.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

<span class="cm"># Reuse X_idx and y from previous cell. Pretend embeddings are already learned;</span>
<span class="cm"># in real NCF they are jointly trained.</span>
n_u = <span class="fn">int</span>(X_idx[:, <span class="num">0</span>].<span class="fn">max</span>()) + <span class="num">1</span>
n_i = <span class="fn">int</span>(X_idx[:, <span class="num">1</span>].<span class="fn">max</span>()) + <span class="num">1</span>
d = <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
U_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_u, d))
I_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_i, d))

X = np.<span class="fn">hstack</span>([U_emb[X_idx[:, <span class="num">0</span>].<span class="fn">astype</span>(<span class="fn">int</span>)],
               I_emb[X_idx[:, <span class="num">1</span>].<span class="fn">astype</span>(<span class="fn">int</span>)]])
<span class="fn">print</span>(<span class="str">"feature matrix:"</span>, X.shape)

clf = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">64</span>, <span class="num">32</span>), max_iter=<span class="num">50</span>, random_state=<span class="num">0</span>)
clf.<span class="fn">fit</span>(X, y)
proba = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]
auc = <span class="fn">roc_auc_score</span>(y, proba)
<span class="fn">print</span>(f<span class="str">"Train AUC = {auc:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Initialize random embeddings for users and items. 2) Look up and concatenate them per training row. 3) Fit MLPClassifier with two hidden layers — this is the NCF "MLP" branch. 4) Compute AUC. Expect AUC well above 0.5 because positives have user-specific patterns. In real NCF the embeddings would be trainable too, jointly learned with backprop.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Wide &amp; Deep: Add a Popularity Cross-Feature</h2>
<p class="l-text">The wide tower's job is to memorize. We bolt on a single hand-crafted feature — global item popularity — and concatenate it with the deep features. In production you would add many crosses (user_country x item_brand etc).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

pop = df_orders[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>()
pop_norm = (pop / pop.<span class="fn">max</span>()).to_dict()
items_unique = df_orders[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items_unique)}
pop_vec = np.<span class="fn">array</span>([pop_norm[items_unique[k]] <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(items_unique))])

<span class="cm"># Wide feature for each row = popularity of the item</span>
wide = pop_vec[X_idx[:, <span class="num">1</span>].<span class="fn">astype</span>(<span class="fn">int</span>)][:, <span class="kw">None</span>]
X_wd = np.<span class="fn">hstack</span>([X, wide])
<span class="fn">print</span>(<span class="str">"wide+deep feature matrix:"</span>, X_wd.shape)

clf = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">64</span>, <span class="num">32</span>), max_iter=<span class="num">60</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_wd, y)
auc = <span class="fn">roc_auc_score</span>(y, clf.<span class="fn">predict_proba</span>(X_wd)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"Wide+Deep AUC = {auc:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Compute item popularity normalized to [0,1]. 2) Look up the popularity for each training row. 3) Append popularity as a single extra feature to the deep input. 4) Re-train and compare AUC. Expect a small but real lift — the wide signal helps the model fall back on popularity when it has no personalization signal.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PyTorch DeepFM (Demo Only in Pyodide)</h2>
<p class="l-text">In production you would write DeepFM in PyTorch with proper sparse embedding tables. Below is the structural sketch.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">DeepFM</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, field_dims, embed_dim=<span class="num">16</span>, mlp_dims=(<span class="num">64</span>, <span class="num">32</span>)):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embeddings = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Embedding</span>(d, embed_dim) <span class="kw">for</span> d <span class="kw">in</span> field_dims])
        self.linear     = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Embedding</span>(d, <span class="num">1</span>)        <span class="kw">for</span> d <span class="kw">in</span> field_dims])
        self.bias = nn.<span class="fn">Parameter</span>(torch.<span class="fn">zeros</span>(<span class="num">1</span>))
        layers = []; prev = embed_dim * <span class="fn">len</span>(field_dims)
        <span class="kw">for</span> h <span class="kw">in</span> mlp_dims:
            layers += [nn.<span class="fn">Linear</span>(prev, h), nn.<span class="fn">ReLU</span>()]; prev = h
        layers += [nn.<span class="fn">Linear</span>(prev, <span class="num">1</span>)]
        self.deep = nn.<span class="fn">Sequential</span>(*layers)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        embs = [e(x[:, k]) <span class="kw">for</span> k, e <span class="kw">in</span> <span class="fn">enumerate</span>(self.embeddings)]
        E = torch.<span class="fn">stack</span>(embs, dim=<span class="num">1</span>)             <span class="cm"># (B, F, d)</span>
        sum_sq  = (E.<span class="fn">sum</span>(dim=<span class="num">1</span>)) ** <span class="num">2</span>
        sq_sum  = (E ** <span class="num">2</span>).<span class="fn">sum</span>(dim=<span class="num">1</span>)
        fm_term = <span class="num">0.5</span> * (sum_sq - sq_sum).<span class="fn">sum</span>(dim=<span class="num">1</span>, keepdim=<span class="kw">True</span>)
        lin = <span class="fn">sum</span>(l(x[:, k]) <span class="kw">for</span> k, l <span class="kw">in</span> <span class="fn">enumerate</span>(self.linear))
        deep = self.<span class="fn">deep</span>(E.<span class="fn">flatten</span>(start_dim=<span class="num">1</span>))
        <span class="kw">return</span> torch.<span class="fn">sigmoid</span>(self.bias + lin + fm_term + deep)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternative (browser-runnable)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">torch is blocked. We compute the FM second-order term in numpy on the same embeddings and combine it with a sklearn MLP — same math, different framework.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import roc_auc_score

# Reuse U_emb, I_emb, X_idx, y from earlier cells.
ue = U_emb[X_idx[:, 0].astype(int)]
ie = I_emb[X_idx[:, 1].astype(int)]

# FM second-order term over two fields (user, item):
sum_sq = (ue + ie) ** 2
sq_sum = ue ** 2 + ie ** 2
fm_term = 0.5 * (sum_sq - sq_sum).sum(axis=1, keepdims=True)

X_fm = np.hstack([ue, ie, fm_term])
clf = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=60, random_state=0).fit(X_fm, y)
auc = roc_auc_score(y, clf.predict_proba(X_fm)[:, 1])
print(f"DeepFM-style AUC = {auc:.3f}")</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Model Family Comparison</h2>
<div id="recsys5-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> NCF (He 2017) replaces the dot product with a learned MLP scoring function.<br><strong>2.</strong> Wide &amp; Deep (Cheng 2016) joins memorization (linear cross-features) and generalization (MLP).<br><strong>3.</strong> DeepFM (Guo 2017) auto-learns pairwise crosses via FM, sharing embeddings with the MLP.<br><strong>4.</strong> Embedding tables are the storage core of every modern recsys.<br><strong>5.</strong> DLRM (Meta 2019) scales these patterns to TB-scale sparse data.<br><strong>6.</strong> "Memorize what you have seen, generalize to what you have not" — the recsys mantra.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var models = ['Popularity', 'MF', 'NCF', 'Wide+Deep', 'DeepFM', 'DLRM'];
  var auc = [0.61, 0.71, 0.74, 0.76, 0.77, 0.79];
  var data = [{x:models, y:auc, type:'bar', marker:{color:T.accent}, name:'AUC'}];
  var layout = {title:'Typical CTR-prediction AUC (illustrative)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'model', gridcolor:T.grid}, yaxis:{title:'AUC', range:[0.55, 0.82], gridcolor:T.grid}, margin:{t:50,r:30,b:60,l:60}};
  ['recsys5-plot-en','recsys5-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>İç çarpım 60 yıllık bir benzerlik fonksiyonudur. (kullanıcı, madde) skorlamanın tek yolu neden o olsun ki?</strong> 2016'da Google'da Cheng vd. Wide &amp; Deep'i yayınladı, lineer çapraz özelliklerin ve derin bir MLP'nin birlikte yer alması gerektiğini ciddi şekilde savunan ilk makale. Bir yıl sonra He vd. NCF'yi tanıttı, iç çarpımı kendi skorlama fonksiyonunu öğrenen bir sinir ağıyla değiştirdi. DeepFM ile birleştirildiğinde, bu modeller bugün hala ad-tech ve ranking sistemlerinin çoğunu yönetir.</p>
<p class="l-text">Bu derste matris çarpanlamayı derin öneri sistemine çeviren mimari seçimleri, <em>ezberleme (wide)</em> ve <em>genelleme (deep)</em>'nin birbirine neden ihtiyaç duyduğunu ve DeepFM'nin bunları açık özellik etkileşimleriyle nasıl birleştirdiğini öğreneceksin. Sonra df_orders üzerinde sklearn'de küçük bir NCF eğiteceksin ve popülerlik özelliğini öğrenilmiş gömmelerle birleştiren Wide&amp;Deep tarzı bir hibrit kuracaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İç çarpımı öğrenilmiş bir skorlama MLP'siyle değiştir (NCF, He 2017)</li>
<li>Lineer wide çapraz özellikleri derin bir MLP ile birleştir (Cheng 2016)</li>
<li>Wide kulesinin üstüne factorization machines ekle (DeepFM, Guo 2017)</li>
<li>Seyrek kategorik özellikler için gömme tabloları kur</li>
<li>(user_emb, item_emb) -&gt; click üzerinde NCF tarzı bir model sklearn'de eğit</li>
<li>DLRM'yi (Naumov 2019) oku ve Meta'nın bu fikirleri nasıl ölçeklediğini tanı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. NCF: İç Çarpımı Değiştirmek</h2>
<p class="l-text">MF'de skor \\(\\hat{r}_{ui} = u^T v_i\\)'dir. NCF der ki: fonksiyonu neden sabitleyelim? İki gömmeyi birleştir ve kendi kombinasyonunu öğrenen bir MLP'ye besle.</p>
<div class="katex-block">$$\\hat{r}_{ui} = \\sigma\\big( h^T \\phi(W_L \\phi(\\cdots W_1 [u; v_i] \\cdots)) \\big)$$</div>
<p class="l-text">burada \\([u; v_i]\\) birleştirme, \\(\\phi\\) ReLU ve \\(\\sigma\\) sigmoid'dir. NCF prensipte iç çarpımın kendisi de dahil olmak üzere herhangi bir skor fonksiyonunu yaklaştırabilir. He vd. MovieLens ve Pinterest'te MF'yi yendiğini gösterdi.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GMF</div><div class="card-body">Generalized MF: u * v_i eleman bazlı çarpım, bir lineer katmandan beslenir.</div></div>
<div class="calc-card"><div class="card-title">MLP</div><div class="card-body">Birleştir sonra derin MLP. Doğrusal olmayan etkileşimleri yakalar.</div></div>
<div class="calc-card"><div class="card-title">NeuMF</div><div class="card-body">GMF + MLP kuleleri birleştirilir sonra projekte edilir. Tam NCF modeli.</div></div>
<div class="calc-card"><div class="card-title">Kayıp</div><div class="card-body">(kullanıcı, madde, etiket) üzerinde BCE — pozitif için 1, örneklenmiş negatif için 0 etiket.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Wide &amp; Deep (Cheng 2016)</h2>
<p class="l-text">Google'ın uygulama mağazası ekibi, dönüşüme zarar veren iki başarısızlık modunu fark etti: <em>yetersiz ezberleme</em> (model Netflix yükleyen kullanıcıların Hulu da yüklediğini unutur) ve <em>aşırı genelleme</em> (model kimsenin istemediği garip enterpolasyonlar önerir). Wide &amp; Deep işi böler:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wide kulesi</div><div class="card-body">Ham çapraz özelliklerde lineer model (user_country x item_category). Birlikte oluşumları ezberler.</div></div>
<div class="calc-card"><div class="card-title">Deep kulesi</div><div class="card-body">Yoğun gömmeler üzerinde MLP. Görülmemiş özellik kombinasyonlarına genelleştirir.</div></div>
<div class="calc-card"><div class="card-title">Birlikte eğitim</div><div class="card-body">Her iki kulenin çıktıları toplanır ve bir sigmoid'den geçirilir. Backprop her ikisini de günceller.</div></div>
<div class="calc-card"><div class="card-title">Üretim gerçeği</div><div class="card-body">Wide kulesini eklemek Google Play yükleme oranını çevrimiçi olarak %3,9 artırdı.</div></div>
</div>
<div class="calc-highlight">"Gördüğünü ezberle, görmediğine genelleştir." Bu, bir recsys mühendisinin akılda tutmaya değer sloganı.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DeepFM (Guo 2017)</h2>
<p class="l-text">Wide &amp; Deep elle tasarlanmış çapraz özelliklere ihtiyaç duyar. DeepFM wide kulesini, tüm ikili etkileşimleri otomatik olarak öğrenen bir Factorization Machine ile değiştirir:</p>
<div class="katex-block">$$y_{FM} = w_0 + \\sum_i w_i x_i + \\sum_{i&lt;j} \\langle v_i, v_j \\rangle x_i x_j$$</div>
<p class="l-text">Aynı gömmeler \\(v_i\\) hem FM'i (açık ikili terimler için) hem de derin MLP'yi (yüksek dereceli terimler için) besler. Bir model, iki kafa, toplanır ve birlikte eğitilir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Seyrek Özellikler için Gömme Tabloları</h2>
<p class="l-text">Gerçek reklam sistemlerinde yüzlerce kategorik özellik vardır (user_country, item_brand, day_of_week, query_intent, ...). Her biri bir gömme tablosuna eşlenir: i. satırı i kategorisi için yoğun vektör olan bir (vocab_size, dim) matris. Tüm özelliklerin gömmelerinin toplamı modelin girdisidir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vocab boyutu</div><div class="card-body">On binlerden milyarlara (madde kimlikleri).</div></div>
<div class="calc-card"><div class="card-title">Gömme boyutu</div><div class="card-body">8 (nadir özellikler) ile 256 (madde kimlikleri) arası. Bellek baskındır.</div></div>
<div class="calc-card"><div class="card-title">Hashing trick</div><div class="card-body">Yüksek kardinaliteli özellikleri belleği sınırlamak için k kovaya hashle.</div></div>
<div class="calc-card"><div class="card-title">DLRM (Meta 2019)</div><div class="card-body">Kategorikler için gömme tabloları + yoğunlar için bottom MLP + tahmin için top MLP. TB ölçeğinde veriyle eğitilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Eğitim Üçlülerini Üret (pozitif + örneklenmiş negatif)</h2>
<p class="l-text">NCF için (kullanıcı, madde, etiket) gerekir. Pozitifler gerçek satın alımlardır; negatifler rastgele çekilen gözlemlenmemiş maddelerdir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2); ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)
pos_set = ints.<span class="fn">groupby</span>(<span class="str">"u"</span>)[<span class="str">"i"</span>].<span class="fn">apply</span>(<span class="fn">set</span>).to_dict()

n_u, n_i = <span class="fn">len</span>(users), <span class="fn">len</span>(items)
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
pos = ints[[<span class="str">"u"</span>, <span class="str">"i"</span>]].values
neg = []
<span class="kw">for</span> u, _ <span class="kw">in</span> pos:
    j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    <span class="kw">while</span> j <span class="kw">in</span> pos_set[<span class="fn">int</span>(u)]:
        j = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_i)
    neg.<span class="fn">append</span>([u, j])
neg = np.<span class="fn">array</span>(neg)

X_idx = np.<span class="fn">vstack</span>([pos, neg])
y = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(<span class="fn">len</span>(pos)), np.<span class="fn">zeros</span>(<span class="fn">len</span>(neg))])
<span class="fn">print</span>(<span class="str">"total training rows:"</span>, <span class="fn">len</span>(X_idx), <span class="str">"positives:"</span>, <span class="fn">int</span>(y.<span class="fn">sum</span>()))</code></pre></div>
<p class="l-text"><strong>Mantık şöyle:</strong> 1) Kullanıcı / madde kimliklerini kodla. 2) Pozitifler-küme aramasını kur. 3) Her pozitif için, kullanıcının etkileşim kurmadığı bir rastgele negatif çek. 4) Pozitifleri ve negatifleri ikili etiketli tek bir veri setine yığ. NCF eğitimi eşit sınıflar görecek.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. sklearn'de NCF (concat + MLP)</h2>
<p class="l-text">NCF'yi iki gömme tablosu (rastgele başlat sonra MLP üzerinden SGD ile öğren) ve birleştirilmiş kullanıcı + madde gömmelerini tüketen bir MLPRegressor ile yaklaşıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

<span class="cm"># Önceki hücreden X_idx ve y'yi yeniden kullan. Gömmelerin zaten öğrenildiğini varsay;</span>
<span class="cm"># gerçek NCF'de birlikte eğitilirler.</span>
n_u = <span class="fn">int</span>(X_idx[:, <span class="num">0</span>].<span class="fn">max</span>()) + <span class="num">1</span>
n_i = <span class="fn">int</span>(X_idx[:, <span class="num">1</span>].<span class="fn">max</span>()) + <span class="num">1</span>
d = <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
U_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_u, d))
I_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_i, d))

X = np.<span class="fn">hstack</span>([U_emb[X_idx[:, <span class="num">0</span>].<span class="fn">astype</span>(<span class="fn">int</span>)],
               I_emb[X_idx[:, <span class="num">1</span>].<span class="fn">astype</span>(<span class="fn">int</span>)]])
<span class="fn">print</span>(<span class="str">"feature matrix:"</span>, X.shape)

clf = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">64</span>, <span class="num">32</span>), max_iter=<span class="num">50</span>, random_state=<span class="num">0</span>)
clf.<span class="fn">fit</span>(X, y)
proba = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]
auc = <span class="fn">roc_auc_score</span>(y, proba)
<span class="fn">print</span>(f<span class="str">"Train AUC = {auc:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kodda:</strong> 1) Kullanıcılar ve maddeler için rastgele gömmeleri başlat. 2) Eğitim satırı başına ara ve birleştir. 3) İki gizli katmanla MLPClassifier uydur — bu NCF'nin "MLP" kolu. 4) AUC hesapla. Pozitiflerin kullanıcıya özel desenleri olduğu için 0,5'in çok üstünde AUC bekle. Gerçek NCF'de gömmeler de eğitilebilir olurdu, backprop ile birlikte öğrenilirdi.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Wide &amp; Deep: Popülerlik Çapraz Özelliği Ekle</h2>
<p class="l-text">Wide kulenin işi ezberlemektir. Tek bir el yapımı özellik ekliyoruz — global madde popülerliği — ve onu derin özelliklerle birleştiriyoruz. Üretimde birçok çapraz eklerdin (user_country x item_brand vs).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

pop = df_orders[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>()
pop_norm = (pop / pop.<span class="fn">max</span>()).to_dict()
items_unique = df_orders[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items_unique)}
pop_vec = np.<span class="fn">array</span>([pop_norm[items_unique[k]] <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(items_unique))])

<span class="cm"># Her satır için wide özelliği = maddenin popülerliği</span>
wide = pop_vec[X_idx[:, <span class="num">1</span>].<span class="fn">astype</span>(<span class="fn">int</span>)][:, <span class="kw">None</span>]
X_wd = np.<span class="fn">hstack</span>([X, wide])
<span class="fn">print</span>(<span class="str">"wide+deep feature matrix:"</span>, X_wd.shape)

clf = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">64</span>, <span class="num">32</span>), max_iter=<span class="num">60</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_wd, y)
auc = <span class="fn">roc_auc_score</span>(y, clf.<span class="fn">predict_proba</span>(X_wd)[:, <span class="num">1</span>])
<span class="fn">print</span>(f<span class="str">"Wide+Deep AUC = {auc:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>Kodun akışı:</strong> 1) [0,1]'e normalize edilmiş madde popülerliğini hesapla. 2) Her eğitim satırı için popülerliği ara. 3) Popülerliği derin girdiye tek bir ekstra özellik olarak ekle. 4) Yeniden eğit ve AUC karşılaştır. Küçük ama gerçek bir artış bekle — wide sinyal, modelin kişiselleştirme sinyali olmadığında popülerliğe geri düşmesine yardım eder.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PyTorch DeepFM (Sadece Pyodide Demosu)</h2>
<p class="l-text">Üretimde DeepFM'yi PyTorch'ta uygun seyrek gömme tablolarıyla yazardın. Aşağıdaki yapısal taslaktır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">DeepFM</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, field_dims, embed_dim=<span class="num">16</span>, mlp_dims=(<span class="num">64</span>, <span class="num">32</span>)):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.embeddings = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Embedding</span>(d, embed_dim) <span class="kw">for</span> d <span class="kw">in</span> field_dims])
        self.linear     = nn.<span class="fn">ModuleList</span>([nn.<span class="fn">Embedding</span>(d, <span class="num">1</span>)        <span class="kw">for</span> d <span class="kw">in</span> field_dims])
        self.bias = nn.<span class="fn">Parameter</span>(torch.<span class="fn">zeros</span>(<span class="num">1</span>))
        layers = []; prev = embed_dim * <span class="fn">len</span>(field_dims)
        <span class="kw">for</span> h <span class="kw">in</span> mlp_dims:
            layers += [nn.<span class="fn">Linear</span>(prev, h), nn.<span class="fn">ReLU</span>()]; prev = h
        layers += [nn.<span class="fn">Linear</span>(prev, <span class="num">1</span>)]
        self.deep = nn.<span class="fn">Sequential</span>(*layers)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        embs = [e(x[:, k]) <span class="kw">for</span> k, e <span class="kw">in</span> <span class="fn">enumerate</span>(self.embeddings)]
        E = torch.<span class="fn">stack</span>(embs, dim=<span class="num">1</span>)             <span class="cm"># (B, F, d)</span>
        sum_sq  = (E.<span class="fn">sum</span>(dim=<span class="num">1</span>)) ** <span class="num">2</span>
        sq_sum  = (E ** <span class="num">2</span>).<span class="fn">sum</span>(dim=<span class="num">1</span>)
        fm_term = <span class="num">0.5</span> * (sum_sq - sq_sum).<span class="fn">sum</span>(dim=<span class="num">1</span>, keepdim=<span class="kw">True</span>)
        lin = <span class="fn">sum</span>(l(x[:, k]) <span class="kw">for</span> k, l <span class="kw">in</span> <span class="fn">enumerate</span>(self.linear))
        deep = self.<span class="fn">deep</span>(E.<span class="fn">flatten</span>(start_dim=<span class="num">1</span>))
        <span class="kw">return</span> torch.<span class="fn">sigmoid</span>(self.bias + lin + fm_term + deep)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternatifi (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">torch engellenmiş. FM ikinci dereceden terimi numpy'da aynı gömmeler üzerinde hesaplıyoruz ve bunu sklearn MLP ile birleştiriyoruz — aynı matematik, farklı framework.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import roc_auc_score

# U_emb, I_emb, X_idx, y'yi önceki hücrelerden yeniden kullan.
ue = U_emb[X_idx[:, 0].astype(int)]
ie = I_emb[X_idx[:, 1].astype(int)]

# İki alan üzerinde FM ikinci dereceden terim (kullanıcı, madde):
sum_sq = (ue + ie) ** 2
sq_sum = ue ** 2 + ie ** 2
fm_term = 0.5 * (sum_sq - sq_sum).sum(axis=1, keepdims=True)

X_fm = np.hstack([ue, ie, fm_term])
clf = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=60, random_state=0).fit(X_fm, y)
auc = roc_auc_score(y, clf.predict_proba(X_fm)[:, 1])
print(f"DeepFM-style AUC = {auc:.3f}")</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Model Ailesi Karşılaştırması</h2>
<div id="recsys5-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ana Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANA ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> NCF (He 2017) iç çarpımı öğrenilmiş bir MLP skorlama fonksiyonuyla değiştirir.<br><strong>2.</strong> Wide &amp; Deep (Cheng 2016) ezberleme (lineer çapraz özellikler) ve genelleme (MLP) bağlar.<br><strong>3.</strong> DeepFM (Guo 2017) FM yoluyla ikili çaprazları otomatik öğrenir, gömmeleri MLP ile paylaşır.<br><strong>4.</strong> Gömme tabloları her modern recsys'in depolama çekirdeğidir.<br><strong>5.</strong> DLRM (Meta 2019) bu desenleri TB ölçeğinde seyrek veriye ölçekler.<br><strong>6.</strong> "Gördüğünü ezberle, görmediğine genelleştir" — recsys mantrası.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
