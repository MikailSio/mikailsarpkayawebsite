window.RECSYS_L6 = {

en: `<p class="l-text"><strong>Your Spotify queue does not pick songs based on a static "user vector" — it picks based on what you just played. Your YouTube next-up is conditioned on the last 50 videos. The order matters: skipping three rock songs in a row says something a static rating cannot capture.</strong></p>
<p class="l-text">Sequential recommenders model the user as an evolving sequence of interactions and predict what comes next. The two landmark papers — SASRec (Kang &amp; McAuley 2018) and BERT4Rec (Sun 2019) — are transformers over a user's history. They have largely replaced GRU4Rec in production. Today you build a tiny self-attention sequence model in numpy on user purchase histories from df_orders.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Frame recommendation as next-item prediction over a user's interaction sequence</li>
<li>Compare SASRec (causal) and BERT4Rec (masked) attention patterns</li>
<li>Implement scaled dot-product self-attention from scratch in numpy</li>
<li>Add positional embeddings so order has signal</li>
<li>Build user purchase histories from df_orders sorted by date</li>
<li>Predict the next product from the past sequence and check whether the held-out item is in top-K</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Sequence Matters</h2>
<p class="l-text">Static recommenders treat user history as a bag — the order of past clicks does not affect the score. But sequence is information: a user who just bought camping gear is in a different state than a user whose last purchase was three months ago. Sequential models conditional on the entire history.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bag-of-items</div><div class="card-body">User represented by sum of item embeddings. Loses order, loses recency.</div></div>
<div class="calc-card"><div class="card-title">RNN / GRU4Rec</div><div class="card-body">Hidasi 2016. First sequence-aware recsys. Beat session-based baselines, ran into transformer wave.</div></div>
<div class="calc-card"><div class="card-title">SASRec</div><div class="card-body">Kang &amp; McAuley 2018. Causal self-attention, predict next item. Cleaner, faster, better than RNN.</div></div>
<div class="calc-card"><div class="card-title">BERT4Rec</div><div class="card-body">Sun 2019. Bidirectional masked attention. Often best on dense sequences.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SASRec: Causal Self-Attention</h2>
<p class="l-text">SASRec mirrors GPT: each position attends to itself and the past, never the future. The model takes the user's sequence \\(s_1, s_2, ..., s_t\\) and predicts \\(s_{t+1}\\) using the attended representation at position t.</p>
<div class="katex-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d}} + M \\right) V$$</div>
<p class="l-text">where M is the causal mask (-inf above the diagonal, 0 elsewhere). The training loss is BPR or sampled softmax over (positive next item, negative next item).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. BERT4Rec: Masked Bidirectional Attention</h2>
<p class="l-text">BERT4Rec mirrors BERT: at training time, mask 15% of positions in the sequence and train the model to predict the masked items from both left and right context. At inference, append a [MASK] token at the end and treat the model's prediction as the next item.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SASRec strength</div><div class="card-body">Auto-regressive, matches the inference setting (predict next from past).</div></div>
<div class="calc-card"><div class="card-title">BERT4Rec strength</div><div class="card-body">Bidirectional context — both past and future sides of a masked position. Better on very dense sequences.</div></div>
<div class="calc-card"><div class="card-title">Modern verdict</div><div class="card-body">SASRec usually wins on retrieval datasets; BERT4Rec wins on dense music / video sequences.</div></div>
<div class="calc-card"><div class="card-title">Industry use</div><div class="card-body">TikTok, Spotify, Pinterest all run transformer sequence models for ranking/retrieval.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Positional Embeddings</h2>
<p class="l-text">Self-attention is permutation-invariant: shuffling the input gives the same output. Positional embeddings break that symmetry. SASRec uses learned positional embeddings of length L (the max sequence length) added to item embeddings.</p>
<div class="katex-block">$$x_t = \\text{ItemEmb}(s_t) + \\text{PosEmb}(t)$$</div>
<p class="l-text">More recent work uses RoPE (rotary positional embeddings, also seen in LLaMA) which encode relative position into the attention scores directly.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Build User Sequences from df_orders</h2>
<p class="l-text">For each user we sort by order date and convert their purchases into an integer sequence of product ids. We pad / truncate to a fixed length L for batching.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
items = df[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
i2 = {p: k+<span class="num">1</span> <span class="kw">for</span> k, p <span class="kw">in</span> <span class="fn">enumerate</span>(items)}   <span class="cm"># 0 reserved for PAD</span>
df[<span class="str">"i"</span>] = df[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)

L = <span class="num">8</span>
sequences = (df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>)[<span class="str">"i"</span>]
               .<span class="fn">apply</span>(<span class="kw">lambda</span> s: s.<span class="fn">tolist</span>()[-L:])
               .to_dict())

<span class="kw">def</span> <span class="fn">pad</span>(seq, L=<span class="num">8</span>):
    <span class="kw">return</span> [<span class="num">0</span>] * (L - <span class="fn">len</span>(seq)) + seq

users = <span class="fn">list</span>(sequences.keys())
X = np.<span class="fn">array</span>([<span class="fn">pad</span>(sequences[u], L) <span class="kw">for</span> u <span class="kw">in</span> users])
<span class="cm"># Train target: last item; input: everything before</span>
inp = X[:, :-<span class="num">1</span>]; tgt = X[:, -<span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"input sequences:"</span>, inp.shape, <span class="str">"targets:"</span>, tgt.shape)
<span class="fn">print</span>(<span class="str">"first user input:"</span>, inp[<span class="num">0</span>], <span class="str">"target:"</span>, tgt[<span class="num">0</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sort orders chronologically per user. 2) Map product ids to small integers, reserving 0 as PAD. 3) For each user keep the most recent L purchases. 4) Pad shorter sequences on the left. 5) Split into input (first L-1 positions) and target (last position).</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Self-Attention from Scratch</h2>
<p class="l-text">A single self-attention head over a length-T sequence of d-dim vectors. We compute Q, K, V projections, the scaled dot product, the causal mask, softmax, and the weighted sum.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">softmax</span>(x, axis=-<span class="num">1</span>):
    x = x - x.<span class="fn">max</span>(axis=axis, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(x)
    <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=axis, keepdims=<span class="kw">True</span>)

<span class="kw">def</span> <span class="fn">causal_self_attention</span>(X, Wq, Wk, Wv):
    Q = X @ Wq; K = X @ Wk; V = X @ Wv
    T, d = Q.shape
    scores = (Q @ K.T) / np.<span class="fn">sqrt</span>(d)
    mask = np.<span class="fn">triu</span>(np.<span class="fn">full</span>((T, T), -<span class="num">1e9</span>), k=<span class="num">1</span>)   <span class="cm"># strict upper triangle</span>
    A = <span class="fn">softmax</span>(scores + mask)
    <span class="kw">return</span> A @ V, A

T, d = <span class="num">5</span>, <span class="num">4</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
X = rng.<span class="fn">standard_normal</span>((T, d))
Wq = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wk = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wv = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
out, A = <span class="fn">causal_self_attention</span>(X, Wq, Wk, Wv)
<span class="fn">print</span>(<span class="str">"attention pattern (rows attend to past only):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(A, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"output shape:"</span>, out.shape)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Project the input into Q, K, V matrices. 2) Compute scaled dot-product scores. 3) Add the causal mask (-inf above the diagonal). 4) Softmax row-wise. 5) Multiply by V to get output. The attention matrix should be lower-triangular: each row sums to 1 with zeros above the diagonal — exactly what GPT-style models produce.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SASRec-Lite on Product Sequences</h2>
<p class="l-text">Now we apply self-attention to the user purchase sequences. We use random item embeddings (no training — this is a structural demo), run one attention layer, and rank items by dot product with the last position's output.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
items = df[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
i2 = {p: k+<span class="num">1</span> <span class="kw">for</span> k, p <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
df[<span class="str">"i"</span>] = df[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)

L = <span class="num">8</span>
sequences = (df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>)[<span class="str">"i"</span>]
               .<span class="fn">apply</span>(<span class="kw">lambda</span> s: s.<span class="fn">tolist</span>()[-L:])
               .to_dict())
users = <span class="fn">list</span>(sequences.keys())
<span class="kw">def</span> <span class="fn">pad</span>(seq):
    <span class="kw">return</span> [<span class="num">0</span>] * (L - <span class="fn">len</span>(seq)) + seq
seqs = np.<span class="fn">array</span>([<span class="fn">pad</span>(sequences[u]) <span class="kw">for</span> u <span class="kw">in</span> users])

<span class="cm"># Random item + positional embeddings</span>
n_items = <span class="fn">len</span>(items) + <span class="num">1</span>
d = <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
ItemE = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_items, d))
PosE  = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (L,       d))
Wq = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wk = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wv = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>

<span class="kw">def</span> <span class="fn">predict_next</span>(seq):
    X = ItemE[seq] + PosE
    Q = X @ Wq; K = X @ Wk; V = X @ Wv
    scores = (Q @ K.T) / np.<span class="fn">sqrt</span>(d)
    mask = np.<span class="fn">triu</span>(np.<span class="fn">full</span>((L, L), -<span class="num">1e9</span>), k=<span class="num">1</span>)
    A = np.<span class="fn">exp</span>(scores + mask); A /= A.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    H = A @ V
    last = H[-<span class="num">1</span>]                         <span class="cm"># attended representation at position L-1</span>
    item_scores = ItemE @ last
    <span class="kw">return</span> np.<span class="fn">argsort</span>(-item_scores)[:<span class="num">10</span>]

top10 = <span class="fn">predict_next</span>(seqs[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"user 0 history (item idx):"</span>, seqs[<span class="num">0</span>].<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">"top-10 predicted next item idx:"</span>, top10.<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build user sequences and pad to length L. 2) Initialize random item, positional, and projection matrices. 3) <code>predict_next</code> runs one self-attention layer over the sequence and uses the last-position vector to score every item via dot product. 4) Print top-10 predictions. With trained weights this becomes the SASRec retrieval head.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PyTorch SASRec (Demo Only)</h2>
<p class="l-text">In production you would write SASRec in PyTorch with multi-head attention and BPR loss over the next-item target.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">SASRec</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_items, d=<span class="num">64</span>, L=<span class="num">50</span>, heads=<span class="num">2</span>, layers=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.item = nn.<span class="fn">Embedding</span>(n_items + <span class="num">1</span>, d, padding_idx=<span class="num">0</span>)
        self.pos  = nn.<span class="fn">Embedding</span>(L, d)
        enc_layer = nn.<span class="fn">TransformerEncoderLayer</span>(d, heads, dim_feedforward=<span class="num">4</span>*d, batch_first=<span class="kw">True</span>)
        self.enc = nn.<span class="fn">TransformerEncoder</span>(enc_layer, layers)
        self.L = L
    <span class="kw">def</span> <span class="fn">forward</span>(self, seqs):
        B, L = seqs.shape
        pos = torch.<span class="fn">arange</span>(L, device=seqs.device).<span class="fn">expand</span>(B, L)
        x = self.<span class="fn">item</span>(seqs) + self.<span class="fn">pos</span>(pos)
        mask = torch.<span class="fn">triu</span>(torch.<span class="fn">ones</span>(L, L, device=seqs.device), diagonal=<span class="num">1</span>).<span class="fn">bool</span>()
        h = self.<span class="fn">enc</span>(x, mask=mask)
        <span class="kw">return</span> h @ self.item.weight.T   <span class="cm"># scores over all items</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternative (browser-runnable)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">torch is blocked. The earlier numpy SASRec-Lite cell already covers the exact same forward pass at one head, one layer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>print("See section 7 above: predict_next(seqs[0]) is a numpy-only SASRec-Lite forward pass.")
print("To extend it: add a learned loss over (last position, true next item) and train with SGD.")</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Training Loss Curve</h2>
<div id="recsys6-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Sequential recommenders treat the user as an evolving sequence, not a static vector.<br><strong>2.</strong> SASRec (Kang 2018) is GPT for next-item prediction — causal self-attention.<br><strong>3.</strong> BERT4Rec (Sun 2019) is BERT for masked-position prediction over sequences.<br><strong>4.</strong> Positional embeddings break attention's permutation invariance.<br><strong>5.</strong> The forward pass at one position is the user's "state vector"; dot-product against item embeddings yields scores.<br><strong>6.</strong> Both SASRec and BERT4Rec sit at the front of TikTok / Spotify / Pinterest pipelines today.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var x = []; var loss_sas = []; var loss_bert = [];
  for (var t=0; t&lt;=50; t+=2) {
    x.push(t);
    loss_sas.push(5.5 - 3.5 * (1 - Math.exp(-t/8)) + 0.05*Math.random());
    loss_bert.push(5.5 - 3.7 * (1 - Math.exp(-t/10)) + 0.05*Math.random());
  }
  var data = [
    {x:x, y:loss_sas, name:'SASRec', type:'scatter', mode:'lines', line:{color:T.accent}},
    {x:x, y:loss_bert, name:'BERT4Rec', type:'scatter', mode:'lines', line:{color:'#888'}}
  ];
  var layout = {title:'Sequential recsys training loss (illustrative)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'epoch', gridcolor:T.grid}, yaxis:{title:'cross-entropy loss', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  ['recsys6-plot-en','recsys6-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Spotify kuyruğun, statik bir "kullanıcı vektörüne" göre şarkı seçmez — az önce ne çaldığına göre seçer. YouTube sıradaki videon son 50 videoya bağlıdır. Sıra önemli: arka arkaya üç rock şarkısını atlamak, statik bir puanın yakalayamayacağı bir şey söyler.</strong></p>
<p class="l-text">Sıralı öneri sistemleri, kullanıcıyı evrim geçiren etkileşim dizisi olarak modelleyip sırada ne geleceğini tahmin eder. İki dönüm noktası makale — SASRec (Kang &amp; McAuley 2018) ve BERT4Rec (Sun 2019) — kullanıcı geçmişi üzerindeki transformer'lardır. Üretimde GRU4Rec'in yerini büyük ölçüde aldılar. Bugün df_orders'tan kullanıcı satın alma geçmişleri üzerinde numpy'da küçük bir self-attention dizi modeli kuracaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Öneriyi kullanıcının etkileşim dizisi üzerinde sonraki-madde tahmini olarak çerçevele</li>
<li>SASRec (nedensel) ve BERT4Rec (maskeli) attention desenlerini karşılaştır</li>
<li>Numpy'da sıfırdan ölçekli iç çarpım self-attention uygula</li>
<li>Sıranın sinyal taşıması için konumsal gömmeler ekle</li>
<li>df_orders'tan tarihe göre sıralanmış kullanıcı satın alma geçmişleri kur</li>
<li>Geçmiş diziden bir sonraki ürünü tahmin et ve tutulan maddenin top-K'da olup olmadığını kontrol et</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Sıra Neden Önemli</h2>
<p class="l-text">Statik öneri sistemleri kullanıcı geçmişini bir torba olarak ele alır — geçmiş tıklamaların sırası skoru etkilemez. Ama sıra bilgidir: yeni kamp ekipmanı alan bir kullanıcı, son satın alımı üç ay önce olan bir kullanıcıdan farklı bir durumdadır. Sıralı modeller tüm geçmişe koşullanır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Madde torbası</div><div class="card-body">Kullanıcı, madde gömmelerinin toplamıyla temsil edilir. Sırayı kaybeder, yeniliği kaybeder.</div></div>
<div class="calc-card"><div class="card-title">RNN / GRU4Rec</div><div class="card-body">Hidasi 2016. İlk diziye duyarlı recsys. Oturum tabanlı tabanları yendi, transformer dalgasıyla karşılaştı.</div></div>
<div class="calc-card"><div class="card-title">SASRec</div><div class="card-body">Kang &amp; McAuley 2018. Nedensel self-attention, sonraki maddeyi tahmin et. RNN'den daha temiz, daha hızlı, daha iyi.</div></div>
<div class="calc-card"><div class="card-title">BERT4Rec</div><div class="card-body">Sun 2019. Çift yönlü maskeli attention. Yoğun dizilerde sıklıkla en iyisi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SASRec: Nedensel Self-Attention</h2>
<p class="l-text">SASRec GPT'yi yansıtır: her konum kendine ve geçmişe bakar, asla geleceğe değil. Model kullanıcının dizisini \\(s_1, s_2, ..., s_t\\) alır ve t konumundaki dikkatli temsili kullanarak \\(s_{t+1}\\)'i tahmin eder.</p>
<div class="katex-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d}} + M \\right) V$$</div>
<p class="l-text">burada M nedensel maskedir (köşegenin üstünde -inf, başka yerde 0). Eğitim kaybı, (pozitif sonraki madde, negatif sonraki madde) üzerinde BPR veya sampled softmax'tır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. BERT4Rec: Maskeli Çift Yönlü Attention</h2>
<p class="l-text">BERT4Rec BERT'i yansıtır: eğitim zamanında dizideki konumların %15'ini maskele ve modeli maskelenmiş maddeleri hem sol hem sağ bağlamdan tahmin etmeye eğit. Çıkarımda dizinin sonuna bir [MASK] token ekle ve modelin tahminini sonraki madde olarak ele al.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SASRec gücü</div><div class="card-body">Otoregresif, çıkarım ayarıyla eşleşir (geçmişten sonrakini tahmin et).</div></div>
<div class="calc-card"><div class="card-title">BERT4Rec gücü</div><div class="card-body">Çift yönlü bağlam — maskelenmiş bir konumun hem geçmiş hem gelecek tarafları. Çok yoğun dizilerde daha iyi.</div></div>
<div class="calc-card"><div class="card-title">Modern karar</div><div class="card-body">SASRec genellikle retrieval veri setlerinde kazanır; BERT4Rec yoğun müzik / video dizilerinde kazanır.</div></div>
<div class="calc-card"><div class="card-title">Endüstri kullanımı</div><div class="card-body">TikTok, Spotify, Pinterest hepsi ranking/retrieval için transformer dizi modelleri çalıştırır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Konumsal Gömmeler</h2>
<p class="l-text">Self-attention permütasyona değişmezdir: girdiyi karıştırmak aynı çıktıyı verir. Konumsal gömmeler bu simetriyi kırar. SASRec, madde gömmelerine eklenen L (maksimum dizi uzunluğu) uzunluğunda öğrenilmiş konumsal gömmeler kullanır.</p>
<div class="katex-block">$$x_t = \\text{ItemEmb}(s_t) + \\text{PosEmb}(t)$$</div>
<p class="l-text">Daha yeni çalışmalar RoPE'yi (rotary positional embeddings, LLaMA'da da görülür) kullanır, göreli konumu doğrudan attention skorlarına kodlar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. df_orders'tan Kullanıcı Dizileri Kur</h2>
<p class="l-text">Her kullanıcı için sipariş tarihine göre sıralıyoruz ve satın alımlarını ürün kimliklerinin tamsayı dizisine dönüştürüyoruz. Batching için sabit uzunluk L'ye padding / kesim yapıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
items = df[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
i2 = {p: k+<span class="num">1</span> <span class="kw">for</span> k, p <span class="kw">in</span> <span class="fn">enumerate</span>(items)}   <span class="cm"># 0 PAD için ayrılmış</span>
df[<span class="str">"i"</span>] = df[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)

L = <span class="num">8</span>
sequences = (df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>)[<span class="str">"i"</span>]
               .<span class="fn">apply</span>(<span class="kw">lambda</span> s: s.<span class="fn">tolist</span>()[-L:])
               .to_dict())

<span class="kw">def</span> <span class="fn">pad</span>(seq, L=<span class="num">8</span>):
    <span class="kw">return</span> [<span class="num">0</span>] * (L - <span class="fn">len</span>(seq)) + seq

users = <span class="fn">list</span>(sequences.keys())
X = np.<span class="fn">array</span>([<span class="fn">pad</span>(sequences[u], L) <span class="kw">for</span> u <span class="kw">in</span> users])
<span class="cm"># Eğitim hedefi: son madde; girdi: öncesindeki her şey</span>
inp = X[:, :-<span class="num">1</span>]; tgt = X[:, -<span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"input sequences:"</span>, inp.shape, <span class="str">"targets:"</span>, tgt.shape)
<span class="fn">print</span>(<span class="str">"first user input:"</span>, inp[<span class="num">0</span>], <span class="str">"target:"</span>, tgt[<span class="num">0</span>])</code></pre></div>
<p class="l-text"><strong>Kodun akışı:</strong> 1) Siparişleri kullanıcı başına kronolojik sırala. 2) Ürün kimliklerini küçük tamsayılara eşle, 0'ı PAD olarak ayır. 3) Her kullanıcı için en yeni L satın alımı tut. 4) Daha kısa dizileri sola padding'le. 5) Girdi (ilk L-1 konum) ve hedef (son konum) olarak böl.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Sıfırdan Self-Attention</h2>
<p class="l-text">Uzunluk-T d boyutlu vektör dizisi üzerinde tek bir self-attention başı. Q, K, V projeksiyonlarını, ölçekli iç çarpımı, nedensel maskeyi, softmax'i ve ağırlıklı toplamı hesaplıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">softmax</span>(x, axis=-<span class="num">1</span>):
    x = x - x.<span class="fn">max</span>(axis=axis, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(x)
    <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=axis, keepdims=<span class="kw">True</span>)

<span class="kw">def</span> <span class="fn">causal_self_attention</span>(X, Wq, Wk, Wv):
    Q = X @ Wq; K = X @ Wk; V = X @ Wv
    T, d = Q.shape
    scores = (Q @ K.T) / np.<span class="fn">sqrt</span>(d)
    mask = np.<span class="fn">triu</span>(np.<span class="fn">full</span>((T, T), -<span class="num">1e9</span>), k=<span class="num">1</span>)   <span class="cm"># kesin üst üçgen</span>
    A = <span class="fn">softmax</span>(scores + mask)
    <span class="kw">return</span> A @ V, A

T, d = <span class="num">5</span>, <span class="num">4</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
X = rng.<span class="fn">standard_normal</span>((T, d))
Wq = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wk = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wv = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
out, A = <span class="fn">causal_self_attention</span>(X, Wq, Wk, Wv)
<span class="fn">print</span>(<span class="str">"attention pattern (rows attend to past only):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(A, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"output shape:"</span>, out.shape)</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Girdiyi Q, K, V matrislerine projekte et. 2) Ölçekli iç çarpım skorlarını hesapla. 3) Nedensel maskeyi ekle (köşegenin üstünde -inf). 4) Satır bazında softmax. 5) Çıktıyı almak için V ile çarp. Attention matrisi alt üçgensel olmalıdır: her satır 1'e toplanır, köşegenin üstünde sıfır — tam olarak GPT tarzı modellerin ürettiği şey.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Ürün Dizilerinde SASRec-Lite</h2>
<p class="l-text">Şimdi self-attention'ı kullanıcı satın alma dizilerine uyguluyoruz. Rastgele madde gömmeleri kullanıyoruz (eğitim yok — bu yapısal bir demo), bir attention katmanı çalıştırıyoruz ve maddeleri son konumun çıktısıyla iç çarpım yaparak sıralıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = df_orders.<span class="fn">sort_values</span>([<span class="str">"customer_id"</span>, <span class="str">"order_date"</span>])
items = df[<span class="str">"product_id"</span>].<span class="fn">unique</span>()
i2 = {p: k+<span class="num">1</span> <span class="kw">for</span> k, p <span class="kw">in</span> <span class="fn">enumerate</span>(items)}
df[<span class="str">"i"</span>] = df[<span class="str">"product_id"</span>].<span class="fn">map</span>(i2)

L = <span class="num">8</span>
sequences = (df.<span class="fn">groupby</span>(<span class="str">"customer_id"</span>)[<span class="str">"i"</span>]
               .<span class="fn">apply</span>(<span class="kw">lambda</span> s: s.<span class="fn">tolist</span>()[-L:])
               .to_dict())
users = <span class="fn">list</span>(sequences.keys())
<span class="kw">def</span> <span class="fn">pad</span>(seq):
    <span class="kw">return</span> [<span class="num">0</span>] * (L - <span class="fn">len</span>(seq)) + seq
seqs = np.<span class="fn">array</span>([<span class="fn">pad</span>(sequences[u]) <span class="kw">for</span> u <span class="kw">in</span> users])

<span class="cm"># Rastgele madde + konumsal gömmeler</span>
n_items = <span class="fn">len</span>(items) + <span class="num">1</span>
d = <span class="num">16</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
ItemE = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (n_items, d))
PosE  = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.1</span>, (L,       d))
Wq = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wk = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>
Wv = rng.<span class="fn">standard_normal</span>((d, d)) * <span class="num">0.2</span>

<span class="kw">def</span> <span class="fn">predict_next</span>(seq):
    X = ItemE[seq] + PosE
    Q = X @ Wq; K = X @ Wk; V = X @ Wv
    scores = (Q @ K.T) / np.<span class="fn">sqrt</span>(d)
    mask = np.<span class="fn">triu</span>(np.<span class="fn">full</span>((L, L), -<span class="num">1e9</span>), k=<span class="num">1</span>)
    A = np.<span class="fn">exp</span>(scores + mask); A /= A.<span class="fn">sum</span>(axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    H = A @ V
    last = H[-<span class="num">1</span>]                         <span class="cm"># L-1 konumundaki dikkatli temsil</span>
    item_scores = ItemE @ last
    <span class="kw">return</span> np.<span class="fn">argsort</span>(-item_scores)[:<span class="num">10</span>]

top10 = <span class="fn">predict_next</span>(seqs[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"user 0 history (item idx):"</span>, seqs[<span class="num">0</span>].<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">"top-10 predicted next item idx:"</span>, top10.<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>Mantık şöyle:</strong> 1) Kullanıcı dizilerini kur ve L uzunluğuna padle. 2) Rastgele madde, konumsal ve projeksiyon matrislerini başlat. 3) <code>predict_next</code> dizide bir self-attention katmanı çalıştırır ve son konum vektörünü kullanarak iç çarpımla her maddeyi puanlar. 4) Top-10 tahmin yazdır. Eğitilmiş ağırlıklarla bu SASRec retrieval kafasına dönüşür.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PyTorch SASRec (Yalnızca Demo)</h2>
<p class="l-text">Üretimde SASRec'i PyTorch'ta multi-head attention ve sonraki-madde hedefi üzerinde BPR kayıbıyla yazardın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">SASRec</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_items, d=<span class="num">64</span>, L=<span class="num">50</span>, heads=<span class="num">2</span>, layers=<span class="num">2</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.item = nn.<span class="fn">Embedding</span>(n_items + <span class="num">1</span>, d, padding_idx=<span class="num">0</span>)
        self.pos  = nn.<span class="fn">Embedding</span>(L, d)
        enc_layer = nn.<span class="fn">TransformerEncoderLayer</span>(d, heads, dim_feedforward=<span class="num">4</span>*d, batch_first=<span class="kw">True</span>)
        self.enc = nn.<span class="fn">TransformerEncoder</span>(enc_layer, layers)
        self.L = L
    <span class="kw">def</span> <span class="fn">forward</span>(self, seqs):
        B, L = seqs.shape
        pos = torch.<span class="fn">arange</span>(L, device=seqs.device).<span class="fn">expand</span>(B, L)
        x = self.<span class="fn">item</span>(seqs) + self.<span class="fn">pos</span>(pos)
        mask = torch.<span class="fn">triu</span>(torch.<span class="fn">ones</span>(L, L, device=seqs.device), diagonal=<span class="num">1</span>).<span class="fn">bool</span>()
        h = self.<span class="fn">enc</span>(x, mask=mask)
        <span class="kw">return</span> h @ self.item.weight.T   <span class="cm"># tüm maddeler üzerinde skorlar</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide alternatifi (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">torch engellenmiş. Önceki numpy SASRec-Lite hücresi zaten tek baş, tek katmanda tam aynı forward geçişini kapsıyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>print("Yukarıdaki bölüm 7'ye bak: predict_next(seqs[0]) yalnızca-numpy SASRec-Lite forward geçişidir.")
print("Genişletmek için: (son konum, gerçek sonraki madde) üzerinde öğrenilmiş kayıp ekle ve SGD ile eğit.")</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Eğitim Kayıp Eğrisi</h2>
<div id="recsys6-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ana Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANA ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Sıralı öneri sistemleri kullanıcıyı statik bir vektör değil, evrim geçiren bir dizi olarak ele alır.<br><strong>2.</strong> SASRec (Kang 2018) sonraki-madde tahmini için GPT'dir — nedensel self-attention.<br><strong>3.</strong> BERT4Rec (Sun 2019) diziler üzerinde maskeli-konum tahmini için BERT'tir.<br><strong>4.</strong> Konumsal gömmeler attention'ın permütasyon değişmezliğini kırar.<br><strong>5.</strong> Bir konumdaki forward geçişi kullanıcının "durum vektörü"dür; madde gömmelerine karşı iç çarpım skorlar verir.<br><strong>6.</strong> Hem SASRec hem BERT4Rec bugün TikTok / Spotify / Pinterest pipeline'larının ön cephesindedir.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
