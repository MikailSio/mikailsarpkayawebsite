window.RECSYS_L2 = {

en: `<p class="l-text"><strong>In 2006 Netflix offered a million dollars to anyone who could improve their rating predictor by 10%. The winning team's secret weapon was a quiet idea called Matrix Factorization — find latent dimensions ("animation vs live action", "talky vs explosive") so each user and each movie become short numeric vectors whose dot product is a rating.</strong></p>
<p class="l-text">Matrix factorization (MF) is the bridge between hand-crafted recommenders and modern deep models. Today you will derive the model, see why <em>biases</em> matter as much as latent factors, compare <em>SGD</em> and <em>ALS</em> training, and run a runnable SVD on the orders matrix to find products that are mathematically "near" each other.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Express the rating matrix R as a low-rank product U V^T and read its dimensions</li>
<li>Add user, item, and global biases — and explain why they often dominate the score</li>
<li>Compare SGD vs ALS optimization and pick the right one for your data</li>
<li>Apply L2 regularization to prevent overfitting on sparse matrices</li>
<li>Run scipy's truncated SVD on the user x product purchase matrix</li>
<li>Recover product neighbors by cosine similarity in the latent space</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Low-Rank Hypothesis</h2>
<p class="l-text">The rating matrix R has shape (#users, #items) and is mostly empty — typical sparsity is 99.5% missing. The MF hypothesis is that this giant matrix is approximately the product of two skinny matrices:</p>
<div class="katex-block">$$R \\approx U V^T, \\quad U \\in \\mathbb{R}^{m \\times k}, \\quad V \\in \\mathbb{R}^{n \\times k}, \\quad k \\ll \\min(m, n)$$</div>
<p class="l-text">Each row \\(u_i\\) of U is a user vector and each row \\(v_j\\) of V is an item vector. The predicted rating is just a dot product: \\(\\hat{r}_{ij} = u_i^T v_j\\). The latent dimension k is small — often 8 to 200. This compression is what forces the model to <em>generalize</em>.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">m users</div><div class="card-body">Rows of R, rows of U.</div></div>
<div class="calc-card"><div class="card-title">n items</div><div class="card-body">Columns of R, rows of V.</div></div>
<div class="calc-card"><div class="card-title">k factors</div><div class="card-body">Latent dimension. Typical: 16, 32, 64, 128.</div></div>
<div class="calc-card"><div class="card-title">U V^T</div><div class="card-body">Reconstructed full matrix — fills in the missing cells.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Funk SVD and the Netflix Prize</h2>
<p class="l-text">"Truncated SVD" works only on a fully observed matrix. Real ratings are mostly missing, so Simon Funk's 2006 blog post showed how to learn U and V by gradient descent only over <em>observed</em> entries. This was the breakthrough that powered the Netflix Prize.</p>
<div class="katex-block">$$\\min_{U, V} \\sum_{(i,j) \\in \\Omega} (r_{ij} - u_i^T v_j)^2 + \\lambda (\\|u_i\\|^2 + \\|v_j\\|^2)$$</div>
<p class="l-text">The sum is restricted to the index set \\(\\Omega\\) of observed ratings, and \\(\\lambda\\) is L2 regularization. This is now the canonical MF objective.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Biases: User, Item, Global</h2>
<p class="l-text">Some users always rate high; some items are universally loved. Modeling those baselines explicitly stops the latent factors from wasting capacity on them.</p>
<div class="katex-block">$$\\hat{r}_{ij} = \\mu + b_i + b_j + u_i^T v_j$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">μ (global mean)</div><div class="card-body">Average rating across the whole dataset. Centers everything.</div></div>
<div class="calc-card"><div class="card-title">b_i (user bias)</div><div class="card-body">How much user i tends to rate above or below average.</div></div>
<div class="calc-card"><div class="card-title">b_j (item bias)</div><div class="card-body">How much item j is loved relative to average.</div></div>
<div class="calc-card"><div class="card-title">u_i · v_j</div><div class="card-body">The interesting personalization — taste meets content.</div></div>
</div>
<div class="calc-highlight">In the Netflix Prize the bias-only model already beat raw SVD. Always add biases first; latent factors second.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. SGD vs ALS</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SGD</div><div class="card-body">For each observed (i, j), update u_i and v_j with one gradient step. Cheap per step, scales to billions of ratings, but tuning learning rate is fiddly.</div></div>
<div class="calc-card"><div class="card-title">ALS</div><div class="card-body">Hold V fixed, solve for every U row as a ridge regression in closed form. Then hold U fixed and solve for V. Trivially parallel, no learning rate.</div></div>
<div class="calc-card"><div class="card-title">When SGD wins</div><div class="card-body">Massive datasets, online updates, custom loss functions.</div></div>
<div class="calc-card"><div class="card-title">When ALS wins</div><div class="card-body">Implicit feedback (next lesson), Spark / parallel clusters, no hyperparameter babysitting.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Build the User x Item Matrix</h2>
<p class="l-text">Our orders dataset gives us implicit ratings: <em>did this user buy this product, and how often</em>. We will pivot it into a user x product count matrix, the input to SVD.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Aggregate purchase counts per (user, product)</span>
mat = (df_orders
       .<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>])
       .size()
       .<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
<span class="fn">print</span>(<span class="str">"matrix shape:"</span>, mat.shape)
<span class="fn">print</span>(<span class="str">"sparsity:"</span>, <span class="fn">round</span>((mat == <span class="num">0</span>).<span class="fn">mean</span>().<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"non-zero entries:"</span>, (mat &gt; <span class="num">0</span>).<span class="fn">sum</span>().<span class="fn">sum</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Group orders by customer and product, count rows. 2) <code>unstack</code> turns this into a wide matrix with users as rows, products as columns, and 0 for cells with no purchase. 3) Sparsity = fraction of zero cells. With 500 users and 39 products you should see a relatively dense matrix compared to a typical e-commerce site.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Truncated SVD with scipy.sparse.linalg</h2>
<p class="l-text">Now we factorize the matrix. <code>svds</code> returns U, singular values \\(\\Sigma\\), and V^T. The product \\(U \\Sigma V^T\\) reconstructs the matrix; truncating to the top k components gives the best rank-k approximation in Frobenius norm (Eckart-Young theorem).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds

mat = (df_orders
       .<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>])
       .size()
       .<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
R = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))

k = <span class="num">8</span>
U, s, Vt = <span class="fn">svds</span>(R, k=k)
<span class="fn">print</span>(<span class="str">"U shape:"</span>, U.shape, <span class="str">"V shape:"</span>, Vt.T.shape, <span class="str">"singular values:"</span>, np.<span class="fn">round</span>(s, <span class="num">2</span>))

<span class="cm"># Reconstruct full matrix (rank-k approximation of purchase counts)</span>
R_hat = U @ np.<span class="fn">diag</span>(s) @ Vt
<span class="fn">print</span>(<span class="str">"reconstruction error:"</span>, <span class="fn">round</span>(np.<span class="fn">linalg</span>.norm(R.toarray() - R_hat) / np.<span class="fn">linalg</span>.norm(R.toarray()), <span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build a sparse CSR version of the user-item matrix. 2) Run SVD with k=8 latent factors. 3) Print shapes — U is (users, 8), V is (products, 8). 4) Reconstruct \\(U \\Sigma V^T\\) and compute relative reconstruction error. With k=8 you should retain most of the signal.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Find Product Neighbors in Latent Space</h2>
<p class="l-text">Once products live in an 8-dimensional latent space, "similar products" is just cosine similarity between V rows. This is exactly the trick behind Amazon's "customers also bought" recommendations.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

mat = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).size().<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
products = mat.columns.<span class="fn">tolist</span>()
R = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))

U, s, Vt = <span class="fn">svds</span>(R, k=<span class="num">8</span>)
V = Vt.T  <span class="cm"># shape (n_products, k)</span>

sim = <span class="fn">cosine_similarity</span>(V)
target = products[<span class="num">0</span>]
order = np.<span class="fn">argsort</span>(-sim[<span class="num">0</span>])[<span class="num">1</span>:<span class="num">6</span>]   <span class="cm"># skip self at idx 0</span>
neighbors = [products[i] <span class="kw">for</span> i <span class="kw">in</span> order]
<span class="fn">print</span>(f<span class="str">"Products most similar to {target}:"</span>)
<span class="kw">for</span> i, p <span class="kw">in</span> <span class="fn">zip</span>(order, neighbors):
    <span class="fn">print</span>(f<span class="str">"  {p}  (cos = {sim[0, i]:.3f})"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Same SVD as before, then keep V (products x k). 2) Compute pairwise cosine similarity between product vectors. 3) Pick the first product as a query. 4) argsort negative similarities to get most-similar-first; drop index 0 (self) and take 5 neighbors. The output reveals products that share customer co-purchase patterns even if their names look unrelated.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Choosing k and Regularization</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">k too small</div><div class="card-body">Underfits: model cannot capture taste nuances. RMSE stays flat.</div></div>
<div class="calc-card"><div class="card-title">k too large</div><div class="card-body">Overfits: memorizes noise on sparse rows. Regularize harder or shrink k.</div></div>
<div class="calc-card"><div class="card-title">λ small</div><div class="card-body">Lets factors grow large. Train RMSE drops, val RMSE eventually rises.</div></div>
<div class="calc-card"><div class="card-title">λ large</div><div class="card-body">Pulls factors to zero. The model collapses toward biases-only.</div></div>
</div>
<div class="calc-highlight">In production you grid-search k in {16, 32, 64, 128} and λ in {0.01, 0.1, 1.0} on a held-out fold. Validation NDCG@10 tells you the answer.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Singular Value Spectrum</h2>
<p class="l-text">The decay of singular values tells you the effective rank of your data. A steep cliff means a few factors capture most variance; a gentle slope means you need many factors.</p>
<div id="recsys2-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> R ≈ U V^T compresses the rating matrix into latent user and item vectors.<br><strong>2.</strong> Funk SVD (2006) trains MF on observed entries only — the Netflix Prize trick.<br><strong>3.</strong> Always add user, item, and global biases. They explain a lot of variance.<br><strong>4.</strong> SGD scales; ALS parallelizes and avoids learning-rate tuning.<br><strong>5.</strong> Item neighbors via cosine similarity in V are the basis of "people also bought".<br><strong>6.</strong> Tune k and λ together on a validation fold using NDCG, not training RMSE.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var k = 20;
  var s = [];
  for (var i=1; i&lt;=k; i++) s.push(100 / Math.pow(i, 0.85));
  var x = s.map(function(_,i){return i+1;});
  var data = [{x:x, y:s, type:'scatter', mode:'lines+markers', line:{color:T.accent}, name:'singular values'}];
  var layout = {title:'Singular value decay (typical recsys data)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'index k', gridcolor:T.grid}, yaxis:{title:'sigma_k', type:'log', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  ['recsys2-plot-en','recsys2-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>2006'da Netflix, puan tahmincisini %10 iyileştirebilen herkese bir milyon dolar teklif etti. Kazanan ekibin gizli silahı Matris Çarpanlama (Matrix Factorization) adında sessiz bir fikirdi — gizli boyutlar bul ("animasyon vs gerçek çekim", "diyaloglu vs patlamalı") öyle ki her kullanıcı ve her film, iç çarpımı bir puana eşit olan kısa sayısal vektörler haline gelsin.</strong></p>
<p class="l-text">Matris çarpanlama (MF), el yapımı öneri sistemleri ile modern derin modeller arasındaki köprüdür. Bugün modeli türeteceksin, <em>bias</em>'ların gizli faktörler kadar önemli olduğunu göreceksin, <em>SGD</em> ve <em>ALS</em> eğitimini karşılaştıracaksın ve sipariş matrisi üzerinde çalışan bir SVD koşturarak matematiksel olarak birbirine "yakın" ürünleri bulacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>R puan matrisini düşük ranklı U V^T çarpımı olarak ifade et ve boyutlarını oku</li>
<li>Kullanıcı, madde ve global bias'ları ekle — ve neden sıklıkla skora hakim olduklarını açıkla</li>
<li>SGD ile ALS optimizasyonunu karşılaştır ve veriler için doğru olanı seç</li>
<li>Seyrek matrislerde aşırı uydurmayı önlemek için L2 düzenlileştirme uygula</li>
<li>scipy'ın truncated SVD'sini kullanıcı x ürün satın alma matrisine uygula</li>
<li>Gizli uzayda kosinüs benzerliği ile ürün komşularını çıkar</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Düşük Ranklılık Hipotezi</h2>
<p class="l-text">R puan matrisinin şekli (#kullanıcı, #madde) ve büyük çoğunluğu boştur — tipik seyreklik %99,5 eksiktir. MF hipotezi, bu dev matrisin yaklaşık olarak iki ince matrisin çarpımı olduğudur:</p>
<div class="katex-block">$$R \\approx U V^T, \\quad U \\in \\mathbb{R}^{m \\times k}, \\quad V \\in \\mathbb{R}^{n \\times k}, \\quad k \\ll \\min(m, n)$$</div>
<p class="l-text">U'nun her satırı \\(u_i\\) bir kullanıcı vektörüdür ve V'nin her satırı \\(v_j\\) bir madde vektörüdür. Tahmin edilen puan sadece bir iç çarpımdır: \\(\\hat{r}_{ij} = u_i^T v_j\\). Gizli boyut k küçüktür — genellikle 8 ile 200 arası. Bu sıkıştırma modeli <em>genellemeye</em> zorlayan şeydir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">m kullanıcı</div><div class="card-body">R'nin satırları, U'nun satırları.</div></div>
<div class="calc-card"><div class="card-title">n madde</div><div class="card-body">R'nin sütunları, V'nin satırları.</div></div>
<div class="calc-card"><div class="card-title">k faktör</div><div class="card-body">Gizli boyut. Tipik: 16, 32, 64, 128.</div></div>
<div class="calc-card"><div class="card-title">U V^T</div><div class="card-body">Yeniden inşa edilmiş tam matris — eksik hücreleri doldurur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Funk SVD ve Netflix Prize</h2>
<p class="l-text">"Truncated SVD" yalnızca tamamen gözlemlenmiş bir matriste çalışır. Gerçek puanların çoğu eksiktir, bu yüzden Simon Funk'un 2006 blog yazısı U ve V'nin yalnızca <em>gözlemlenen</em> girdiler üzerinde gradient descent ile öğrenilebileceğini gösterdi. Bu, Netflix Prize'a güç veren atılımdı.</p>
<div class="katex-block">$$\\min_{U, V} \\sum_{(i,j) \\in \\Omega} (r_{ij} - u_i^T v_j)^2 + \\lambda (\\|u_i\\|^2 + \\|v_j\\|^2)$$</div>
<p class="l-text">Toplam, gözlemlenen puanların \\(\\Omega\\) indeks kümesiyle sınırlıdır ve \\(\\lambda\\) L2 düzenlileştirmedir. Bu artık kanonik MF amacıdır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bias'lar: Kullanıcı, Madde, Global</h2>
<p class="l-text">Bazı kullanıcılar her zaman yüksek puan verir; bazı maddeler evrensel olarak sevilir. Bu temelleri açıkça modellemek, gizli faktörlerin kapasitesini onlara harcamasını engeller.</p>
<div class="katex-block">$$\\hat{r}_{ij} = \\mu + b_i + b_j + u_i^T v_j$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">μ (global ortalama)</div><div class="card-body">Tüm veri seti boyunca ortalama puan. Her şeyi merkezler.</div></div>
<div class="calc-card"><div class="card-title">b_i (kullanıcı bias)</div><div class="card-body">i kullanıcısının ortalamadan ne kadar yüksek veya düşük puan verme eğilimi olduğu.</div></div>
<div class="calc-card"><div class="card-title">b_j (madde bias)</div><div class="card-body">j maddesinin ortalamaya göre ne kadar sevildiği.</div></div>
<div class="calc-card"><div class="card-title">u_i · v_j</div><div class="card-body">İlginç olan kişiselleştirme — zevk içerikle buluşur.</div></div>
</div>
<div class="calc-highlight">Netflix Prize'da yalnızca bias modeli zaten ham SVD'yi yendi. Önce bias ekle; sonra gizli faktörler.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. SGD vs ALS</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SGD</div><div class="card-body">Her gözlemlenen (i, j) için u_i ve v_j'yi tek bir gradient adımıyla güncelle. Adım başına ucuz, milyarlarca puana ölçeklenir, ama öğrenme oranı ayarlamak meşakkatlidir.</div></div>
<div class="calc-card"><div class="card-title">ALS</div><div class="card-body">V'yi sabit tut, her U satırını kapalı formda ridge regresyon olarak çöz. Sonra U'yu sabit tut ve V'yi çöz. Önemsiz biçimde paralel, öğrenme oranı yok.</div></div>
<div class="calc-card"><div class="card-title">SGD ne zaman kazanır</div><div class="card-body">Devasa veri setleri, çevrimiçi güncellemeler, özel kayıp fonksiyonları.</div></div>
<div class="calc-card"><div class="card-title">ALS ne zaman kazanır</div><div class="card-body">Örtük geri bildirim (sonraki ders), Spark / paralel kümeler, hiperparametre dadılığı yok.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kullanıcı x Madde Matrisini Kur</h2>
<p class="l-text">Sipariş veri setimiz bize örtük puan verir: <em>bu kullanıcı bu ürünü aldı mı ve ne sıklıkla</em>. Bunu kullanıcı x ürün sayım matrisine pivot edeceğiz, SVD'nin girdisi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># (kullanıcı, ürün) başına satın alma sayılarını topla</span>
mat = (df_orders
       .<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>])
       .size()
       .<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
<span class="fn">print</span>(<span class="str">"matrix shape:"</span>, mat.shape)
<span class="fn">print</span>(<span class="str">"sparsity:"</span>, <span class="fn">round</span>((mat == <span class="num">0</span>).<span class="fn">mean</span>().<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"non-zero entries:"</span>, (mat &gt; <span class="num">0</span>).<span class="fn">sum</span>().<span class="fn">sum</span>())</code></pre></div>
<p class="l-text"><strong>Kodun akışı:</strong> 1) Siparişleri müşteri ve ürüne göre grupla, satırları say. 2) <code>unstack</code> bunu kullanıcılar satır, ürünler sütun ve satın alımı olmayan hücreler için 0 olan geniş bir matrise dönüştürür. 3) Seyreklik = sıfır hücre oranı. 500 kullanıcı ve 39 ürünle, tipik bir e-ticaret sitesine kıyasla nispeten yoğun bir matris görmelisin.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. scipy.sparse.linalg ile Truncated SVD</h2>
<p class="l-text">Şimdi matrisi çarpanlarına ayıracağız. <code>svds</code>, U'yu, tekil değerler \\(\\Sigma\\)'yı ve V^T'yi döndürür. \\(U \\Sigma V^T\\) çarpımı matrisi yeniden inşa eder; en üst k bileşene kısaltmak Frobenius normunda en iyi rank-k yaklaşımını verir (Eckart-Young teoremi).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds

mat = (df_orders
       .<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>])
       .size()
       .<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
R = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))

k = <span class="num">8</span>
U, s, Vt = <span class="fn">svds</span>(R, k=k)
<span class="fn">print</span>(<span class="str">"U shape:"</span>, U.shape, <span class="str">"V shape:"</span>, Vt.T.shape, <span class="str">"singular values:"</span>, np.<span class="fn">round</span>(s, <span class="num">2</span>))

<span class="cm"># Tam matrisi yeniden inşa et (satın alma sayılarının rank-k yaklaşımı)</span>
R_hat = U @ np.<span class="fn">diag</span>(s) @ Vt
<span class="fn">print</span>(<span class="str">"reconstruction error:"</span>, <span class="fn">round</span>(np.<span class="fn">linalg</span>.norm(R.toarray() - R_hat) / np.<span class="fn">linalg</span>.norm(R.toarray()), <span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>Bu kodda:</strong> 1) Kullanıcı-madde matrisinin seyrek CSR sürümünü kur. 2) k=8 gizli faktörle SVD koştur. 3) Şekilleri yazdır — U (kullanıcı, 8), V (ürün, 8). 4) \\(U \\Sigma V^T\\)'yi yeniden inşa et ve göreli yeniden inşa hatasını hesapla. k=8 ile sinyalin çoğunu korumalısın.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Gizli Uzayda Ürün Komşuları Bul</h2>
<p class="l-text">Ürünler 8 boyutlu gizli uzayda yaşadığında, "benzer ürünler" sadece V satırları arasındaki kosinüs benzerliğidir. Bu, Amazon'un "müşteriler bunu da aldı" önerilerinin arkasındaki numaranın ta kendisidir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> svds
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

mat = (df_orders.<span class="fn">groupby</span>([<span class="str">"customer_id"</span>, <span class="str">"product_id"</span>]).size().<span class="fn">unstack</span>(fill_value=<span class="num">0</span>))
products = mat.columns.<span class="fn">tolist</span>()
R = csr_matrix(mat.values.<span class="fn">astype</span>(<span class="fn">float</span>))

U, s, Vt = <span class="fn">svds</span>(R, k=<span class="num">8</span>)
V = Vt.T  <span class="cm"># şekil (n_products, k)</span>

sim = <span class="fn">cosine_similarity</span>(V)
target = products[<span class="num">0</span>]
order = np.<span class="fn">argsort</span>(-sim[<span class="num">0</span>])[<span class="num">1</span>:<span class="num">6</span>]   <span class="cm"># 0 indeksindeki kendisini atla</span>
neighbors = [products[i] <span class="kw">for</span> i <span class="kw">in</span> order]
<span class="fn">print</span>(f<span class="str">"Products most similar to {target}:"</span>)
<span class="kw">for</span> i, p <span class="kw">in</span> <span class="fn">zip</span>(order, neighbors):
    <span class="fn">print</span>(f<span class="str">"  {p}  (cos = {sim[0, i]:.3f})"</span>)</code></pre></div>
<p class="l-text"><strong>Bu kodda:</strong> 1) Önceki gibi aynı SVD, sonra V'yi tut (ürün x k). 2) Ürün vektörleri arasında ikili kosinüs benzerliğini hesapla. 3) İlk ürünü sorgu olarak seç. 4) En benzeri önce gelecek şekilde negatif benzerlikleri argsort yap; 0 indeksini (kendisi) düşür ve 5 komşu al. Çıktı, isimleri alakasız görünse bile müşteri birlikte-satın-alma desenlerini paylaşan ürünleri ortaya çıkarır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. k ve Düzenlileştirmeyi Seçmek</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">k çok küçük</div><div class="card-body">Yetersiz uydurur: model zevk nüanslarını yakalayamaz. RMSE düz kalır.</div></div>
<div class="calc-card"><div class="card-title">k çok büyük</div><div class="card-body">Aşırı uydurur: seyrek satırlardaki gürültüyü ezberler. Daha sert düzenlileştir veya k'yı küçült.</div></div>
<div class="calc-card"><div class="card-title">λ küçük</div><div class="card-body">Faktörlerin büyümesine izin verir. Train RMSE düşer, val RMSE eninde sonunda yükselir.</div></div>
<div class="calc-card"><div class="card-title">λ büyük</div><div class="card-body">Faktörleri sıfıra çeker. Model yalnızca-bias'a doğru çöker.</div></div>
</div>
<div class="calc-highlight">Üretimde tutulmuş bir fold üzerinde k'yı {16, 32, 64, 128}'de ve λ'yı {0.01, 0.1, 1.0}'da grid search yaparsın. Doğrulama NDCG@10 sana cevabı söyler.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tekil Değer Spektrumu</h2>
<p class="l-text">Tekil değerlerin azalması, verinin etkili rankını söyler. Sarp bir uçurum, birkaç faktörün varyansın çoğunu yakaladığı anlamına gelir; yumuşak bir eğim çok faktöre ihtiyacın olduğu anlamına gelir.</p>
<div id="recsys2-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ana Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANA ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> R ≈ U V^T puan matrisini gizli kullanıcı ve madde vektörlerine sıkıştırır.<br><strong>2.</strong> Funk SVD (2006), MF'yi yalnızca gözlemlenen girdiler üzerinde eğitir — Netflix Prize numarası.<br><strong>3.</strong> Her zaman kullanıcı, madde ve global bias ekle. Çok varyans açıklarlar.<br><strong>4.</strong> SGD ölçeklenir; ALS paralelleşir ve öğrenme oranı ayarlamasından kaçınır.<br><strong>5.</strong> V'de kosinüs benzerliği yoluyla madde komşuları "insanlar bunu da aldı"nın temelidir.<br><strong>6.</strong> k ve λ'yı eğitim RMSE değil, NDCG kullanarak doğrulama fold'unda birlikte ayarla.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
