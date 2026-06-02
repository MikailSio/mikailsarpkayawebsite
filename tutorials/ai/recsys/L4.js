window.RECSYS_L4 = {

en: `<p class="l-text"><strong>YouTube serves recommendations to two billion users from a catalog of billions of videos. They cannot dot-product every (user, video) pair at request time — that would be a quadrillion operations per second. Their answer, since 2019, is the Two-Tower model: separate user and item encoders that produce embeddings whose dot product approximates relevance, and an approximate-nearest-neighbor index that retrieves top-1000 candidates in milliseconds.</strong></p>
<p class="l-text">Two-Tower (also called dual encoder) is the dominant retrieval architecture across YouTube, TikTok, Pinterest, Spotify, and most LLM-era recommenders. Today you build the model, learn the in-batch negatives trick that keeps training efficient, and run a numpy/sklearn version on df_orders to retrieve products for a query user.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Draw the Two-Tower architecture and its retrieval-at-scale workflow</li>
<li>Explain in-batch negatives and why they make training cheap</li>
<li>Use sampled softmax loss with logQ correction for popularity bias</li>
<li>Connect Two-Tower to dual encoders in NLP (DPR, ColBERT, sentence-BERT)</li>
<li>Implement a sklearn version using two MLPs and dot-product scoring</li>
<li>Pre-compute item embeddings and serve retrieval with a cosine-similarity index</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Retrieval Problem</h2>
<p class="l-text">Modern recsys is split into two stages: <em>retrieval</em> picks 100–1000 candidates from millions of items in &lt;50ms; <em>ranking</em> reorders those candidates with a heavier model. Two-Tower owns the retrieval stage because its scoring function (a dot product) maps perfectly onto approximate nearest neighbor (ANN) indexes like FAISS or ScaNN.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Catalog</div><div class="card-body">10^7 to 10^9 items.</div></div>
<div class="calc-card"><div class="card-title">QPS</div><div class="card-body">Tens of thousands of requests per second.</div></div>
<div class="calc-card"><div class="card-title">Latency budget</div><div class="card-body">Single-digit milliseconds for retrieval.</div></div>
<div class="calc-card"><div class="card-title">Trick</div><div class="card-body">Pre-compute item embeddings offline; user embedding online; ANN search.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Architecture: Two Independent Towers</h2>
<p class="l-text">A user tower \\(f_U(\\text{user features}) \\to \\mathbb{R}^d\\) and an item tower \\(f_I(\\text{item features}) \\to \\mathbb{R}^d\\) produce embeddings of the same dimension. The score is a dot product:</p>
<div class="katex-block">$$s(u, i) = f_U(u)^T f_I(i)$$</div>
<p class="l-text">The <em>independence</em> is the key constraint. There is no cross-tower attention because then you would have to evaluate every item online. With independence, item embeddings are static and can be indexed once.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">User tower input</div><div class="card-body">user_id, demographic, recent watch history, search query.</div></div>
<div class="calc-card"><div class="card-title">Item tower input</div><div class="card-body">item_id, category, title text, image, audio.</div></div>
<div class="calc-card"><div class="card-title">Output dimension</div><div class="card-body">Typically 64 to 512.</div></div>
<div class="calc-card"><div class="card-title">Pooling</div><div class="card-body">Sum / mean of feature embeddings, or transformer over history.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. In-Batch Negatives</h2>
<p class="l-text">Sampling negatives one at a time is wasteful. The famous Two-Tower trick is to use <em>other items in the same batch</em> as negatives. With batch size B, every step contributes one positive and B-1 free negatives — so 256 batch effectively means 256 positives × 255 negatives = 65k contrastive comparisons per step.</p>
<div class="katex-block">$$\\mathcal{L} = -\\frac{1}{B} \\sum_{b=1}^{B} \\log \\frac{\\exp(s(u_b, i_b))}{\\sum_{j=1}^{B} \\exp(s(u_b, i_j))}$$</div>
<p class="l-text">This is exactly sampled softmax with the in-batch items as the sample. It is the same loss SimCLR / contrastive vision learning uses; recsys reinvented it in parallel.</p>
<div class="calc-highlight">In-batch negatives turn batch size into a quality knob: bigger batches = harder negatives = better retrieval. Production systems run batch sizes in the thousands.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. logQ Correction for Popularity Bias</h2>
<p class="l-text">Sampling negatives in-batch gives popular items a higher chance of being a negative — which would unfairly push them down. Yi et al. (2019) proposed a correction: subtract \\(\\log Q(i)\\) from each logit, where \\(Q(i)\\) is the empirical sampling probability of item i.</p>
<div class="katex-block">$$s_{\\text{corrected}}(u, i) = s(u, i) - \\log Q(i)$$</div>
<p class="l-text">This is the canonical fix used by YouTube, TikTok, Spotify. Without it the model under-recommends popular items at inference time.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Build the Towers in sklearn</h2>
<p class="l-text">Real production towers are TensorFlow / PyTorch MLPs (or transformers). For a runnable demo we use two sklearn MLPRegressors that map one-hot user / item ids to a 16-dim space, then score by dot product.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPRegressor

<span class="cm"># Encode ids and merge in a few user features (age band, income band)</span>
ints = df_orders.<span class="fn">merge</span>(df_customers, on=<span class="str">"customer_id"</span>, how=<span class="str">"left"</span>).<span class="fn">merge</span>(df_products, on=<span class="str">"product_id"</span>, how=<span class="str">"left"</span>)
ints = ints.<span class="fn">drop_duplicates</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
n_u, n_i, d = <span class="fn">len</span>(users), <span class="fn">len</span>(items), <span class="num">16</span>

<span class="cm"># Build feature matrices: each user -&gt; one-hot id vector, similarly for items</span>
X_u = np.<span class="fn">eye</span>(n_u)
X_i = np.<span class="fn">eye</span>(n_i)

<span class="cm"># Stand-in target: pre-train towers to roughly produce normalized embeddings</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
Yu = rng.<span class="fn">standard_normal</span>((n_u, d)); Yi = rng.<span class="fn">standard_normal</span>((n_i, d))
user_tower = <span class="fn">MLPRegressor</span>(hidden_layer_sizes=(<span class="num">32</span>,), max_iter=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_u, Yu)
item_tower = <span class="fn">MLPRegressor</span>(hidden_layer_sizes=(<span class="num">32</span>,), max_iter=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_i, Yi)
<span class="fn">print</span>(<span class="str">"user emb shape:"</span>, user_tower.<span class="fn">predict</span>(X_u).shape)
<span class="fn">print</span>(<span class="str">"item emb shape:"</span>, item_tower.<span class="fn">predict</span>(X_i).shape)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build encoded user and item id sets with one-hot input matrices. 2) Use random target embeddings to pre-fit two MLPs (in real life the targets come from contrastive loss). 3) Print shapes — both towers output (N, 16). The point is structural: two encoders that share an output space.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Train with Contrastive Loss</h2>
<p class="l-text">Now we replace the random targets with a real contrastive loop. We sample positive (u, i) pairs and use the rest of the batch as negatives, exactly like the in-batch trick.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2); ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)

n_u, n_i, d = <span class="fn">len</span>(users), <span class="fn">len</span>(items), <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
U_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_u, d))
I_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_i, d))
arr = ints[[<span class="str">"u"</span>, <span class="str">"i"</span>]].values
B = <span class="num">32</span>; lr = <span class="num">0.05</span>
losses = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">300</span>):
    idx = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(arr), size=B)
    batch = arr[idx]
    Ub = U_emb[batch[:, <span class="num">0</span>]]                <span class="cm"># (B, d)</span>
    Ib = I_emb[batch[:, <span class="num">1</span>]]                <span class="cm"># (B, d)</span>
    logits = Ub @ Ib.T                  <span class="cm"># (B, B)</span>
    logits -= logits.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    P = np.<span class="fn">exp</span>(logits); P /= P.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    target = np.<span class="fn">eye</span>(B)
    grad_logits = (P - target) / B
    grad_U = grad_logits @ Ib
    grad_I = grad_logits.T @ Ub
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(B):
        U_emb[batch[k, <span class="num">0</span>]] -= lr * grad_U[k]
        I_emb[batch[k, <span class="num">1</span>]] -= lr * grad_I[k]
    <span class="kw">if</span> step % <span class="num">50</span> == <span class="num">0</span>:
        loss = -np.<span class="fn">log</span>(np.<span class="fn">diag</span>(P) + <span class="num">1e-9</span>).<span class="fn">mean</span>()
        losses.<span class="fn">append</span>(loss)
        <span class="fn">print</span>(f<span class="str">"step {step:4d}  in-batch loss = {loss:.3f}"</span>)
<span class="fn">print</span>(<span class="str">"final loss:"</span>, losses[-<span class="num">1</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Look up user and item embeddings for the batch. 2) Compute the BxB logit matrix and apply softmax row-wise. 3) The diagonal entries are the positives; gradient pushes diagonal up and off-diagonal down. 4) Apply per-row updates manually (since we are not using a framework). 5) Loss should drop from log(B) ≈ 3.46 toward 1 or below.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Retrieval at Inference</h2>
<p class="l-text">Once the towers are trained, the inference protocol is brutally simple: pre-compute every item embedding, build an ANN index, and at query time encode the user and look up top-K nearest items.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># Assume U_emb and I_emb come from the previous cell.</span>
<span class="cm"># In production you would push I_emb into FAISS once.</span>
products = df_orders[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
user_idx = <span class="num">0</span>
q = U_emb[user_idx][<span class="kw">None</span>, :]
sims = <span class="fn">cosine_similarity</span>(q, I_emb)[<span class="num">0</span>]
top10 = np.<span class="fn">argsort</span>(-sims)[:<span class="num">10</span>]
<span class="fn">print</span>(<span class="str">"top-10 retrieved product idx:"</span>, top10)
<span class="fn">print</span>(<span class="str">"top-10 product ids:"</span>, [products[i] <span class="kw">for</span> i <span class="kw">in</span> top10])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Pull the trained user vector. 2) Compute cosine similarity to every item vector. 3) argsort and slice top 10. In production this becomes a FAISS index lookup. The whole pipeline collapses into one matrix multiply at retrieval time.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Two-Tower Beyond Recsys</h2>
<p class="l-text">The same architecture appears everywhere. DPR (Dense Passage Retrieval) for open-domain QA is two BERTs, one for queries and one for passages — same dot-product scoring, same in-batch negatives. CLIP is an image tower and a text tower with contrastive loss. Sentence-BERT for semantic search. The pattern is universal: when you need to retrieve from a huge index, separate the encoders.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">YouTube / TikTok</div><div class="card-body">Two-Tower for video retrieval, Wide&amp;Deep / DLRM for ranking.</div></div>
<div class="calc-card"><div class="card-title">DPR (Karpukhin 2020)</div><div class="card-body">Dense passage retrieval for QA. Same architecture, BERT encoders.</div></div>
<div class="calc-card"><div class="card-title">CLIP (Radford 2021)</div><div class="card-body">Image and text dual encoder, contrastive loss on 400M pairs.</div></div>
<div class="calc-card"><div class="card-title">Sentence-BERT</div><div class="card-body">Same idea for sentence similarity. Used in vector DB search.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Batch Size vs Recall@K</h2>
<p class="l-text">Empirically, doubling batch size gives ~5–10% lift in recall@K up to a few thousand. The curve plateaus when in-batch negatives become trivially separable.</p>
<div id="recsys4-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Two-Tower = independent user and item encoders sharing a dot-product output space.<br><strong>2.</strong> Independence is what makes ANN-based retrieval at scale possible.<br><strong>3.</strong> In-batch negatives turn batch size into a quality knob.<br><strong>4.</strong> logQ correction prevents popularity bias from sampled negatives.<br><strong>5.</strong> The same architecture powers DPR, CLIP, sentence-BERT — all dual encoders.<br><strong>6.</strong> Pre-compute item vectors offline; encode the user online; FAISS does the rest.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var batches = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
  var recall = batches.map(function(b){ return Math.min(0.62, 0.18 + 0.085 * Math.log2(b/16) + 0.005 * (Math.random()-0.5)); });
  var data = [{x:batches, y:recall, type:'scatter', mode:'lines+markers', line:{color:T.accent}, name:'recall@10'}];
  var layout = {title:'Two-Tower recall@10 vs batch size (in-batch negatives)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'batch size', type:'log', gridcolor:T.grid}, yaxis:{title:'recall@10', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  ['recsys4-plot-en','recsys4-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>YouTube, milyarlarca videodan oluşan bir katalogtan iki milyar kullanıcıya öneri sunar. İstek anında her (kullanıcı, video) çiftinin iç çarpımını alamazlar — bu saniyede katrilyon işlem olur. 2019'dan beri cevapları Two-Tower modelidir: ayrı kullanıcı ve madde kodlayıcılar, iç çarpımı alaka düzeyini yaklaşık olarak veren gömmeler üretir ve bir yaklaşık-en-yakın-komşu indeksi top-1000 adayı milisaniye içinde geri çağırır.</strong></p>
<p class="l-text">Two-Tower (dual encoder olarak da bilinir) YouTube, TikTok, Pinterest, Spotify ve LLM çağı öneri sistemlerinin çoğunda baskın retrieval mimarisidir. Bugün modeli kuracak, eğitimi verimli tutan in-batch negatives numarasını öğrenecek ve sorgu kullanıcısı için ürünleri çıkarmak üzere df_orders üzerinde bir numpy/sklearn sürümü çalıştıracaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Two-Tower mimarisini ve ölçekte retrieval iş akışını çiz</li>
<li>In-batch negatives'ı ve eğitimi neden ucuzlattığını açıkla</li>
<li>Popülerlik biası için logQ düzeltmeli sampled softmax kayıbını kullan</li>
<li>Two-Tower'ı NLP'deki dual encoder'larla bağla (DPR, ColBERT, sentence-BERT)</li>
<li>İki MLP ve iç çarpım skorlama kullanan sklearn sürümü uygula</li>
<li>Madde gömmelerini önceden hesapla ve retrieval'ı kosinüs benzerliği indeksiyle sun</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Retrieval Problemi</h2>
<p class="l-text">Modern recsys iki aşamaya bölünür: <em>retrieval</em>, milyonlarca maddeden 100-1000 aday seçer, &lt;50ms; <em>ranking</em>, bu adayları daha ağır bir modelle yeniden sıralar. Two-Tower, retrieval aşamasının sahibidir çünkü skorlama fonksiyonu (bir iç çarpım) FAISS veya ScaNN gibi yaklaşık en yakın komşu (ANN) indekslerine mükemmel şekilde eşlenir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katalog</div><div class="card-body">10^7 ila 10^9 madde.</div></div>
<div class="calc-card"><div class="card-title">QPS</div><div class="card-body">Saniyede on binlerce istek.</div></div>
<div class="calc-card"><div class="card-title">Gecikme bütçesi</div><div class="card-body">Retrieval için tek haneli milisaniyeler.</div></div>
<div class="calc-card"><div class="card-title">Numara</div><div class="card-body">Madde gömmelerini çevrimdışı önceden hesapla; kullanıcı gömmesi çevrimiçi; ANN araması.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Mimari: İki Bağımsız Kule</h2>
<p class="l-text">Bir kullanıcı kulesi \\(f_U(\\text{user features}) \\to \\mathbb{R}^d\\) ve bir madde kulesi \\(f_I(\\text{item features}) \\to \\mathbb{R}^d\\) aynı boyutta gömmeler üretir. Skor bir iç çarpımdır:</p>
<div class="katex-block">$$s(u, i) = f_U(u)^T f_I(i)$$</div>
<p class="l-text"><em>Bağımsızlık</em> kilit kısıttır. Çapraz-kule attention yoktur çünkü olsaydı her maddeyi çevrimiçi değerlendirmen gerekirdi. Bağımsızlıkla, madde gömmeleri statiktir ve bir kez indekslenebilir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kullanıcı kulesi girdisi</div><div class="card-body">user_id, demografik, son izleme geçmişi, arama sorgusu.</div></div>
<div class="calc-card"><div class="card-title">Madde kulesi girdisi</div><div class="card-body">item_id, kategori, başlık metni, görsel, ses.</div></div>
<div class="calc-card"><div class="card-title">Çıktı boyutu</div><div class="card-body">Genellikle 64 ila 512.</div></div>
<div class="calc-card"><div class="card-title">Pooling</div><div class="card-body">Özellik gömmelerinin toplamı / ortalaması veya geçmiş üzerinde transformer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. In-Batch Negatives</h2>
<p class="l-text">Her seferinde bir negatif örneklemek savurgandır. Ünlü Two-Tower numarası, <em>aynı batch'teki diğer maddeleri</em> negatif olarak kullanmaktır. B batch boyutuyla, her adım bir pozitif ve B-1 ücretsiz negatif katar — yani 256 batch etkin olarak adım başına 256 pozitif × 255 negatif = 65k karşılaştırmalı kıyaslama anlamına gelir.</p>
<div class="katex-block">$$\\mathcal{L} = -\\frac{1}{B} \\sum_{b=1}^{B} \\log \\frac{\\exp(s(u_b, i_b))}{\\sum_{j=1}^{B} \\exp(s(u_b, i_j))}$$</div>
<p class="l-text">Bu tam olarak in-batch maddelerini örnek olarak kullanan sampled softmax'tır. SimCLR / karşılaştırmalı görsel öğrenmenin kullandığı kayıp ile aynıdır; recsys bunu paralel olarak yeniden icat etti.</p>
<div class="calc-highlight">In-batch negatives, batch boyutunu bir kalite düğmesine çevirir: daha büyük batch'ler = daha zor negatifler = daha iyi retrieval. Üretim sistemleri binlerce batch boyutunda çalışır.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Popülerlik Biası için logQ Düzeltmesi</h2>
<p class="l-text">Negatifleri in-batch örneklemek popüler maddelere negatif olma şansını yüksek verir — bu da onları haksız yere aşağı iter. Yi vd. (2019) bir düzeltme önerdi: her logit'ten \\(\\log Q(i)\\)'yi çıkar, burada \\(Q(i)\\) i maddesinin ampirik örnekleme olasılığıdır.</p>
<div class="katex-block">$$s_{\\text{corrected}}(u, i) = s(u, i) - \\log Q(i)$$</div>
<p class="l-text">Bu YouTube, TikTok, Spotify tarafından kullanılan kanonik düzeltmedir. Onsuz model, çıkarım zamanında popüler maddeleri yetersiz önerir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. sklearn'de Kuleleri Kur</h2>
<p class="l-text">Gerçek üretim kuleleri TensorFlow / PyTorch MLP'leridir (veya transformer'lar). Çalışan bir demo için, one-hot kullanıcı / madde kimliklerini 16 boyutlu uzaya eşleyen iki sklearn MLPRegressor kullanırız, sonra iç çarpımla skorlarız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPRegressor

<span class="cm"># Kimlikleri kodla ve birkaç kullanıcı özelliğini birleştir (yaş bandı, gelir bandı)</span>
ints = df_orders.<span class="fn">merge</span>(df_customers, on=<span class="str">"customer_id"</span>, how=<span class="str">"left"</span>).<span class="fn">merge</span>(df_products, on=<span class="str">"product_id"</span>, how=<span class="str">"left"</span>)
ints = ints.<span class="fn">drop_duplicates</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
n_u, n_i, d = <span class="fn">len</span>(users), <span class="fn">len</span>(items), <span class="num">16</span>

<span class="cm"># Özellik matrislerini kur: her kullanıcı -&gt; one-hot kimlik vektörü, maddeler için aynısı</span>
X_u = np.<span class="fn">eye</span>(n_u)
X_i = np.<span class="fn">eye</span>(n_i)

<span class="cm"># Yer tutucu hedef: kuleleri kabaca normalize gömmeler üretecek şekilde önceden eğit</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
Yu = rng.<span class="fn">standard_normal</span>((n_u, d)); Yi = rng.<span class="fn">standard_normal</span>((n_i, d))
user_tower = <span class="fn">MLPRegressor</span>(hidden_layer_sizes=(<span class="num">32</span>,), max_iter=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_u, Yu)
item_tower = <span class="fn">MLPRegressor</span>(hidden_layer_sizes=(<span class="num">32</span>,), max_iter=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_i, Yi)
<span class="fn">print</span>(<span class="str">"user emb shape:"</span>, user_tower.<span class="fn">predict</span>(X_u).shape)
<span class="fn">print</span>(<span class="str">"item emb shape:"</span>, item_tower.<span class="fn">predict</span>(X_i).shape)</code></pre></div>
<p class="l-text"><strong>Burada neler oluyor:</strong> 1) One-hot girdi matrisleriyle kodlanmış kullanıcı ve madde kimlik kümelerini kur. 2) İki MLP'yi önceden uydurmak için rastgele hedef gömmeler kullan (gerçek hayatta hedefler karşılaştırmalı kayıptan gelir). 3) Şekilleri yazdır — her iki kule de (N, 16) çıktı verir. Asıl nokta yapısaldır: bir çıktı uzayını paylaşan iki kodlayıcı.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Karşılaştırmalı Kayıpla Eğit</h2>
<p class="l-text">Şimdi rastgele hedefleri gerçek bir karşılaştırmalı döngüyle değiştiriyoruz. Pozitif (u, i) çiftleri örnekliyoruz ve in-batch numarası gibi batch'in geri kalanını negatif olarak kullanıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

ints = df_orders[[<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]].<span class="fn">drop_duplicates</span>().<span class="fn">reset_index</span>(drop=<span class="kw">True</span>)
users = ints[<span class="str">"customer_id"</span>].<span class="fn">unique</span>(); items = ints[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
u2 = {u:k <span class="kw">for</span> k,u <span class="kw">in</span> <span class="fn">enumerate</span>(users)}; i2 = {i:k <span class="kw">for</span> k,i <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
ints[<span class="str">"u"</span>] = ints[<span class="str">"customer_id"</span>].<span class="fn">map</span>(u2); ints[<span class="str">"i"</span>] = ints[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)

n_u, n_i, d = <span class="fn">len</span>(users), <span class="fn">len</span>(items), <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
U_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_u, d))
I_emb = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_i, d))
arr = ints[[<span class="str">"u"</span>, <span class="str">"i"</span>]].values
B = <span class="num">32</span>; lr = <span class="num">0.05</span>
losses = []
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">300</span>):
    idx = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(arr), size=B)
    batch = arr[idx]
    Ub = U_emb[batch[:, <span class="num">0</span>]]                <span class="cm"># (B, d)</span>
    Ib = I_emb[batch[:, <span class="num">1</span>]]                <span class="cm"># (B, d)</span>
    logits = Ub @ Ib.T                  <span class="cm"># (B, B)</span>
    logits -= logits.<span class="fn">max</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    P = np.<span class="fn">exp</span>(logits); P /= P.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    target = np.<span class="fn">eye</span>(B)
    grad_logits = (P - target) / B
    grad_U = grad_logits @ Ib
    grad_I = grad_logits.T @ Ub
    <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(B):
        U_emb[batch[k, <span class="num">0</span>]] -= lr * grad_U[k]
        I_emb[batch[k, <span class="num">1</span>]] -= lr * grad_I[k]
    <span class="kw">if</span> step % <span class="num">50</span> == <span class="num">0</span>:
        loss = -np.<span class="fn">log</span>(np.<span class="fn">diag</span>(P) + <span class="num">1e-9</span>).<span class="fn">mean</span>()
        losses.<span class="fn">append</span>(loss)
        <span class="fn">print</span>(f<span class="str">"step {step:4d}  in-batch loss = {loss:.3f}"</span>)
<span class="fn">print</span>(<span class="str">"final loss:"</span>, losses[-<span class="num">1</span>])</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Batch için kullanıcı ve madde gömmelerini ara. 2) BxB logit matrisini hesapla ve satır-bazında softmax uygula. 3) Köşegen girdiler pozitiflerdir; gradient köşegeni yukarı, köşegen-dışını aşağı iter. 4) Satır başına güncellemeleri manuel olarak uygula (framework kullanmadığımız için). 5) Kayıp log(B) ≈ 3,46'dan 1 veya altına düşmelidir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Çıkarımda Retrieval</h2>
<p class="l-text">Kuleler eğitildikten sonra, çıkarım protokolü acımasızca basittir: her madde gömmesini önceden hesapla, bir ANN indeksi kur ve sorgu zamanında kullanıcıyı kodla ve top-K en yakın maddeleri ara.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># U_emb ve I_emb'in önceki hücreden geldiğini varsay.</span>
<span class="cm"># Üretimde I_emb'i FAISS'e bir kez iterirdin.</span>
products = df_orders[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
user_idx = <span class="num">0</span>
q = U_emb[user_idx][<span class="kw">None</span>, :]
sims = <span class="fn">cosine_similarity</span>(q, I_emb)[<span class="num">0</span>]
top10 = np.<span class="fn">argsort</span>(-sims)[:<span class="num">10</span>]
<span class="fn">print</span>(<span class="str">"top-10 retrieved product idx:"</span>, top10)
<span class="fn">print</span>(<span class="str">"top-10 product ids:"</span>, [products[i] <span class="kw">for</span> i <span class="kw">in</span> top10])</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Eğitilmiş kullanıcı vektörünü çek. 2) Her madde vektörüne kosinüs benzerliğini hesapla. 3) argsort yap ve top 10'u dilimle. Üretimde bu bir FAISS indeks aramasına dönüşür. Tüm pipeline retrieval zamanında tek bir matris çarpımına çöker.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recsys'in Ötesinde Two-Tower</h2>
<p class="l-text">Aynı mimari her yerde görünür. Açık alan QA için DPR (Dense Passage Retrieval), biri sorgular biri pasajlar için iki BERT'tir — aynı iç çarpım skorlama, aynı in-batch negatives. CLIP, karşılaştırmalı kayıpla bir görsel kulesi ve bir metin kulesidir. Anlamsal arama için Sentence-BERT. Desen evrenseldir: dev bir indeksten geri çağırma yapman gerektiğinde, kodlayıcıları ayır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">YouTube / TikTok</div><div class="card-body">Video retrieval için Two-Tower, ranking için Wide&amp;Deep / DLRM.</div></div>
<div class="calc-card"><div class="card-title">DPR (Karpukhin 2020)</div><div class="card-body">QA için yoğun pasaj retrieval. Aynı mimari, BERT kodlayıcılar.</div></div>
<div class="calc-card"><div class="card-title">CLIP (Radford 2021)</div><div class="card-body">Görsel ve metin dual encoder, 400M çift üzerinde karşılaştırmalı kayıp.</div></div>
<div class="calc-card"><div class="card-title">Sentence-BERT</div><div class="card-body">Cümle benzerliği için aynı fikir. Vector DB aramasında kullanılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Batch Boyutu vs Recall@K</h2>
<p class="l-text">Ampirik olarak, batch boyutunu ikiye katlamak birkaç bine kadar recall@K'da ~%5-10 artış verir. Eğri, in-batch negatives önemsiz şekilde ayrılabilir hale geldiğinde duraksar.</p>
<div id="recsys4-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ana Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANA ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Two-Tower = bir iç çarpım çıktı uzayını paylaşan bağımsız kullanıcı ve madde kodlayıcıları.<br><strong>2.</strong> Bağımsızlık, ölçekte ANN tabanlı retrieval'ı mümkün kılan şeydir.<br><strong>3.</strong> In-batch negatives, batch boyutunu bir kalite düğmesine çevirir.<br><strong>4.</strong> logQ düzeltmesi, örneklenen negatiflerden gelen popülerlik biasını önler.<br><strong>5.</strong> Aynı mimari DPR, CLIP, sentence-BERT'e güç verir — hepsi dual encoder.<br><strong>6.</strong> Madde vektörlerini çevrimdışı önceden hesapla; kullanıcıyı çevrimiçi kodla; FAISS gerisini halleder.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
