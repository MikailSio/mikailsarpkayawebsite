window.FAIRNESS_L7 = {
en: `<p class="l-text"><strong>SHAP, LIME, and counterfactuals all treat the model as a black box.</strong> Mechanistic interpretability does the opposite: it cracks the model open and tries to read what the weights actually compute, neuron by neuron, attention head by attention head, layer by layer. The agenda was set by Chris Olah at Distill in 2017-2020 with the Building Blocks of Interpretability, Activation Atlases, and Zoom In: An Introduction to Circuits — a research program that argued neural networks are not inscrutable but rather specific, knowable algorithms made of small interpretable subgraphs. Anthropic picked up that thread for transformers with the Mathematical Framework for Transformer Circuits (Elhage et al. 2021), induction heads (Olsson et al. 2022), and the breakout 2023-2024 work on sparse autoencoders culminating in Templeton et al.'s Scaling Monosemanticity (May 2024) which extracted millions of interpretable features from Claude 3 Sonnet.</p>

<p class="l-text">This lesson is the inside-the-LLM tour. We start with single-neuron feature visualization (the original 2017 Olah technique), move to attention head analysis (specialization, copying, induction), then to the polysemanticity problem that motivated sparse autoencoders, and finally to dictionary learning at scale. Every concept gets a small toy implementation in numpy or sklearn — we cannot run a real Claude SAE in Pyodide, but we can run a 4-feature SAE on toy data and a 2-head attention pattern visualizer on a hand-crafted sequence to see exactly the same algorithms at miniature scale. By the end you will know what an "interpretable feature" means in a 2026 frontier lab and why this research has become central to AI safety.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Place mechanistic interp in the safety / interp landscape — it answers "what" and "how", not "what mattered"</li>
<li>Compute and read attention patterns; identify induction heads and copying heads in toy transformers</li>
<li>Explain superposition (Elhage 2022) — why one neuron encodes 5 unrelated features in real LLMs</li>
<li>Implement a tiny sparse autoencoder and watch monosemantic features emerge from polysemantic neurons</li>
<li>Connect Olah's circuits, Anthropic's transformer circuits, and Bricken-Templeton's SAE work into one progression</li>
<li>Recognize the open problems of 2026: SAE feature splitting, scaling to GPT-4-class, causal vs. correlational features</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Mechanistic Interp Exists</h2>
<p class="l-text">Post-hoc methods (SHAP, LIME, counterfactuals) tell you which inputs the model cared about — they treat the model as a function. Mechanistic interpretability asks something different: <em>given the weights, what algorithm is the model running?</em> If you can answer that, you can predict behaviors before they happen, edit specific knowledge, detect deception, and audit safety properties — none of which post-hoc explanation supports.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Black-box (SHAP, LIME, CF)</div><div class="card-body">Asks: which features mattered for this prediction? Works on any model, gives statistical attribution. Useful for compliance and debugging.</div></div>
<div class="calc-card"><div class="card-title">Probing</div><div class="card-body">Asks: does this hidden layer encode property P? (Belinkov 2019, Hewitt 2019). Trains a linear classifier on activations. Reveals what is represented but not how it is used.</div></div>
<div class="calc-card"><div class="card-title">Mechanistic</div><div class="card-body">Asks: what algorithm do the weights compute, and which subgraph implements behavior B? (Olah 2017–, Elhage 2021–, Bricken 2023, Templeton 2024). Reveals how the model works internally.</div></div>
</div>

<div class="calc-highlight"><strong>The safety bet:</strong> Anthropic's interp team and the broader field bet that mechanistic understanding is the path to AI safety guarantees that scale with capability. If we can read a model's circuits, we can detect deception, edit harmful behaviors, and verify claims about what a model can or cannot do.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Olah's Circuits Program (2017–2020)</h2>
<p class="l-text">Chris Olah's Distill articles laid the conceptual foundation. In <em>Feature Visualization</em> (2017) he showed that you can find the input image that maximally activates a CNN neuron by gradient ascent on the input — and the resulting images are interpretable. Some neurons fire for "wheel", "ear", "curve at 30 degrees". <em>The Building Blocks of Interpretability</em> (2018) combined feature visualization with attribution to make richer per-prediction explanations. <em>Zoom In: An Introduction to Circuits</em> (2020) introduced the central claim: networks are made of <em>circuits</em> — small computational subgraphs (a few neurons across a few layers) implementing identifiable algorithms.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Curve detectors (InceptionV1)</div><div class="card-body">Cammarata et al. 2020 traced the curve detector circuit explicitly: edge → curve at orientation θ. Hand-verifiable; the receptive fields show curves.</div></div>
<div class="calc-card"><div class="card-title">High-low frequency detectors</div><div class="card-body">Olah 2020 showed neurons that fire on the boundary between high-detail and low-detail image regions — useful for figure-ground separation. Universal across architectures.</div></div>
<div class="calc-card"><div class="card-title">Multimodal neurons</div><div class="card-body">Goh et al. 2021 found CLIP neurons that fire for "Spider-Man" whether shown a photo, a drawing, or the word — evidence that semantic concepts have neuron-level representatives even in vision-language models.</div></div>
</div>

<p class="l-text">The CV-side circuits research established the methodology. The transformer-side work built on it.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Mathematical Framework (Elhage 2021)</h2>
<p class="l-text">Elhage et al.'s <em>A Mathematical Framework for Transformer Circuits</em> (Anthropic, December 2021) re-derived the transformer in a basis that makes its computational structure visible. The key insight: a transformer is a sum of (residual stream) + (attention OV circuits) + (attention QK circuits) + (MLP layers), each of which can be analyzed separately. The residual stream becomes the "communication channel" between layers; attention heads <em>read</em> from and <em>write</em> to it.</p>

<div class="katex-block">$$\\text{out} = x + \\sum_{h} \\text{Attn}_h(x) \\, W_O^h + \\text{MLP}(x + \\sum_h \\text{Attn}_h(x) W_O^h)$$</div>

<p class="l-text">Two derivative results changed the field. (1) <em>Induction heads</em> (Olsson et al., March 2022) — a 2-head circuit that implements in-context copying: head A copies the previous token's representation into the current position; head B uses that to attend back to the previous occurrence and copy what came after. This is the mechanism behind the in-context-learning phase change of small language models. (2) <em>Indirect Object Identification</em> circuit (Wang et al. 2022) — a 26-head circuit in GPT-2 small that solves "When Mary and John went to the store, John gave a drink to ___" by identifying the indirect object. The whole circuit is human-readable.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Toy Attention Pattern Visualization</h2>
<p class="l-text">Attention heads are the easiest part of a transformer to inspect: each head produces a softmax-normalized matrix of weights showing which tokens attend to which others. We can build a tiny 2-head attention layer in numpy and inspect it.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Toy transformer: 2 heads, 8-dim embeddings, 6-token sequence</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
d_model, n_heads, d_head = <span class="num">8</span>, <span class="num">2</span>, <span class="num">4</span>
seq = [<span class="str">'The'</span>, <span class="str">'cat'</span>, <span class="str">'sat'</span>, <span class="str">'on'</span>, <span class="str">'the'</span>, <span class="str">'mat'</span>]
T = <span class="fn">len</span>(seq)

<span class="cm"># Random embeddings (in real life these come from a tokenizer + embedding matrix)</span>
X = np.random.<span class="fn">randn</span>(T, d_model) * <span class="num">0.5</span>

<span class="cm"># Hand-crafted Q, K, V matrices for each head</span>
W_Q = np.random.<span class="fn">randn</span>(n_heads, d_model, d_head) * <span class="num">0.3</span>
W_K = np.random.<span class="fn">randn</span>(n_heads, d_model, d_head) * <span class="num">0.3</span>
W_V = np.random.<span class="fn">randn</span>(n_heads, d_model, d_head) * <span class="num">0.3</span>

<span class="kw">def</span> <span class="fn">softmax</span>(x, axis=-<span class="num">1</span>):
    x = x - x.<span class="fn">max</span>(axis=axis, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(x); <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=axis, keepdims=<span class="kw">True</span>)

attention_patterns = []
<span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(n_heads):
    Q = X @ W_Q[h]; K = X @ W_K[h]; V = X @ W_V[h]
    scores = Q @ K.T / np.<span class="fn">sqrt</span>(d_head)
    <span class="cm"># Causal mask</span>
    mask = np.<span class="fn">triu</span>(np.<span class="fn">ones</span>((T,T)), k=<span class="num">1</span>).<span class="fn">astype</span>(<span class="fn">bool</span>)
    scores[mask] = -<span class="num">1e9</span>
    attn = <span class="fn">softmax</span>(scores, axis=-<span class="num">1</span>)
    attention_patterns.<span class="fn">append</span>(attn)

<span class="kw">for</span> h, attn <span class="kw">in</span> <span class="fn">enumerate</span>(attention_patterns):
    <span class="fn">print</span>(f<span class="str">'\\nHead {h} attention pattern (rows = query token, cols = key token):'</span>)
    <span class="fn">print</span>(<span class="str">'     '</span> + <span class="str">' '</span>.<span class="fn">join</span>(f<span class="str">'{t:&gt;5s}'</span> <span class="kw">for</span> t <span class="kw">in</span> seq))
    <span class="kw">for</span> i, t <span class="kw">in</span> <span class="fn">enumerate</span>(seq):
        row = <span class="str">' '</span>.<span class="fn">join</span>(f<span class="str">'{attn[i,j]:.2f}'</span> <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(T))
        <span class="fn">print</span>(f<span class="str">'{t:&gt;5s}: {row}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) sets up a toy transformer block with 2 heads, 8-dim embeddings, and a 6-token sentence <code>['The','cat','sat','on','the','mat']</code>, then samples random <code>W_Q, W_K, W_V</code> projection matrices per head. 2) for each head <code>h</code> computes <code>Q = X @ W_Q[h]</code>, <code>K = X @ W_K[h]</code>, attention scores <code>Q @ K.T / sqrt(d_head)</code>, applies the causal upper-triangular mask via <code>np.triu(..., k=1)</code> setting masked entries to <code>-1e9</code>, and softmaxes along the key axis. 3) iterates over the resulting attention matrices and prints each one as a row-per-query / column-per-key table so you can read directly which token attends to which.</p>

<p class="l-text">In a real model, head specializations are striking. Vig &amp; Belinkov (BlackboxNLP 2019) and the BERTology survey (Rogers, Kovaleva &amp; Rumshisky 2020) cataloged: positional heads (always attend to position-1), syntactic heads (subject↔verb), coreference heads (pronoun↔antecedent), copying heads (attend strongly to one earlier token and copy its value). All visible from the attention matrix alone.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Superposition: One Neuron, Many Features (Elhage 2022)</h2>
<p class="l-text">Olah's hope in 2017 was that each neuron encoded one human-interpretable feature. Reality, as later work showed, is messier: many neurons are <em>polysemantic</em>, firing on multiple unrelated concepts. Elhage et al.'s <em>Toy Models of Superposition</em> (Anthropic, September 2022) explained why: when the number of features the model wants to represent exceeds its dimensionality, it stores them in <em>superposition</em> — non-orthogonal directions in activation space, like a code that uses overlapping basis vectors.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Monosemantic</div><div class="card-body">One neuron = one human concept. The 2017 Olah ideal. Holds for some early-layer CNN neurons but rare in transformer MLPs.</div></div>
<div class="calc-card"><div class="card-title">Polysemantic</div><div class="card-body">One neuron fires on multiple unrelated concepts. The dominant pattern in real LLMs. Symptom of superposition.</div></div>
<div class="calc-card"><div class="card-title">Superposition</div><div class="card-body">Features are encoded in non-orthogonal directions in activation space. Sparse activation makes interference low. The model fits more concepts than dimensions allow.</div></div>
</div>

<div class="calc-highlight"><strong>The implication:</strong> studying neurons one at a time gives you polysemantic noise. To find monosemantic features, you must search a different basis — specifically, an <em>overcomplete</em> basis with enough directions to disentangle. This is what sparse autoencoders do.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Sparse Autoencoders &amp; Dictionary Learning</h2>
<p class="l-text">A sparse autoencoder (SAE) takes activations from one layer of an LLM and reconstructs them through an overcomplete dictionary with a sparsity penalty. Train: <code>min ||x - W_dec @ f(W_enc @ x)||² + λ||f(W_enc @ x)||₁</code> where <code>f</code> is ReLU and <code>W_enc, W_dec</code> are wider than the input dimension. The sparse latents <code>f(W_enc @ x)</code> turn out to be <em>monosemantic</em> — each one fires on one human-interpretable concept. Bricken et al.'s <em>Towards Monosemanticity</em> (Anthropic, October 2023) demonstrated this on a 1-layer transformer; Templeton et al.'s <em>Scaling Monosemanticity</em> (May 2024) extracted ~30M features from Claude 3 Sonnet.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tiny sparse autoencoder on synthetic polysemantic data</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> DictionaryLearning

<span class="cm"># Synthesize 5 ground-truth features stored in 3-dim activation space (superposition!)</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
n_features = <span class="num">5</span>
true_directions = np.random.<span class="fn">randn</span>(n_features, <span class="num">3</span>); true_directions /= np.linalg.<span class="fn">norm</span>(true_directions, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># Generate sparse activations: each example has 1-2 features active</span>
N = <span class="num">500</span>
sparse_codes = np.<span class="fn">zeros</span>((N, n_features))
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
    k = np.random.<span class="fn">choice</span>([<span class="num">1</span>, <span class="num">2</span>])
    idx = np.random.<span class="fn">choice</span>(n_features, k, replace=<span class="kw">False</span>)
    sparse_codes[i, idx] = np.random.<span class="fn">uniform</span>(<span class="num">0.5</span>, <span class="num">1.5</span>, k)
activations = sparse_codes @ true_directions       <span class="cm"># shape (N, 3)</span>

<span class="cm"># Sklearn dictionary learning (simple SAE proxy: L1-sparse coding)</span>
sae = <span class="fn">DictionaryLearning</span>(n_components=<span class="num">8</span>, alpha=<span class="num">0.5</span>, max_iter=<span class="num">300</span>, random_state=<span class="num">0</span>)
sae.<span class="fn">fit</span>(activations)
recovered = sae.components_                         <span class="cm"># (8, 3)</span>

<span class="cm"># Match recovered directions to ground truth via cosine similarity</span>
<span class="kw">def</span> <span class="fn">cosine_match</span>(A, B):
    A = A / (np.linalg.<span class="fn">norm</span>(A, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)+<span class="num">1e-9</span>)
    B = B / (np.linalg.<span class="fn">norm</span>(B, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)+<span class="num">1e-9</span>)
    <span class="kw">return</span> np.<span class="fn">abs</span>(A @ B.T)

sim = <span class="fn">cosine_match</span>(recovered, true_directions)
best = sim.<span class="fn">max</span>(axis=<span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">'Recovered {n_features} ground-truth features from {recovered.shape[0]} dictionary atoms.'</span>)
<span class="fn">print</span>(f<span class="str">'Per-feature best cosine similarity to ground truth:'</span>)
<span class="kw">for</span> i, b <span class="kw">in</span> <span class="fn">enumerate</span>(best[:n_features]):
    <span class="fn">print</span>(f<span class="str">'  feature {i}: cos = {b:.3f}'</span>)
<span class="fn">print</span>(<span class="str">'In real SAE work this maps to <span class="str">"atom 4 = Golden Gate Bridge feature"</span> etc.'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesises 5 ground-truth feature directions in 3-dim space — fewer dimensions than features, deliberately forcing superposition — and generates 500 examples where 1-2 features are active at a time, so <code>activations = sparse_codes @ true_directions</code> is a polysemantic mix. 2) fits sklearn's <code>DictionaryLearning(n_components=8, alpha=0.5)</code> as a stand-in for a sparse autoencoder; the L1 penalty pushes the learned dictionary atoms toward the original sparse generating directions. 3) defines <code>cosine_match(A, B)</code> to compute pairwise cosine similarities and prints the best-match cosine per ground-truth feature — values near 1 confirm the SAE recovered the monosemantic directions from the polysemantic activations.</p>

<p class="l-text">In Templeton et al. 2024, the same recipe at frontier scale produced features for the Golden Gate Bridge, deception, sycophancy, and dozens of other concepts that could be amplified or suppressed at inference time. The famous "Golden Gate Claude" demo (May 2024) clamped one feature high and the model could not stop talking about the bridge — direct experimental evidence that SAE features are causal, not just correlational.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Reading the Anthropic 2024 Paper</h2>
<p class="l-text">Templeton, Conerly, Marcus, Lindsey et al. <em>Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet</em> (transformer-circuits.pub, May 2024) is the most influential mech interp paper of the decade so far. Three findings stand out:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Features scale</div><div class="card-body">SAE quality keeps improving with width and training compute. The 34M-feature SAE on Sonnet found genuinely fine-grained features — variants of "code injection" specific to particular languages.</div></div>
<div class="calc-card"><div class="card-title">Multimodal &amp; multilingual</div><div class="card-body">Single features fire on the same concept across English, Chinese, Korean, and image inputs. Confirms that internal representations are abstract over surface form.</div></div>
<div class="calc-card"><div class="card-title">Causal interventions</div><div class="card-body">Clamping a feature to high or low value reliably steers the model's output in the direction of that feature's meaning. Golden Gate Claude is the headline demo; "deception" and "sycophancy" features show similar steerability.</div></div>
</div>

<p class="l-text">The 2024 follow-ups (Cunningham et al. <em>Sparse Autoencoders Find Highly Interpretable Features</em> ICLR 2024; Marks et al. <em>Sparse Feature Circuits</em> arxiv 2024) showed that SAE features can be composed into circuits that explain end-to-end behaviors — not just localized features but entire pipelines.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Open Problems of 2026</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Feature splitting</div><div class="card-body">Bigger SAEs split coarse features into finer ones — but is "Golden Gate Bridge" really one feature or fifty? No principled criterion yet for the right granularity.</div></div>
<div class="calc-card"><div class="card-title">Scaling to GPT-4-class</div><div class="card-body">SAE training is compute-heavy. Sonnet-scale SAEs cost millions; for the largest frontier models the price is steep enough that only labs can run the experiments.</div></div>
<div class="calc-card"><div class="card-title">Causal vs. correlational features</div><div class="card-body">SAE features correlate with concepts, but causality requires intervention. Activation patching (Heimersheim &amp; Janiak 2023) is the standard tool but expensive at scale.</div></div>
<div class="calc-card"><div class="card-title">Connection to safety</div><div class="card-body">Can SAE features detect deception in models trained to deceive? Hubinger et al. <em>Sleeper Agents</em> (Anthropic 2024) showed standard fine-tuning does not remove backdoors; whether SAE-based detection works on adversarially-trained models is open.</div></div>
</div>

<div class="calc-highlight"><strong>What you can do today:</strong> the <code>sparse_autoencoder</code> (Anthropic), <code>SAE_Lens</code> (Joseph Bloom), and <code>nnsight</code> (Bau et al.) libraries make small-scale SAE experiments accessible. EleutherAI and Apollo Research host pre-trained SAEs for several open models — you can download them and start exploring features in an afternoon.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; Next</h2>
<p class="l-text">Mechanistic interpretability is the inside-out approach to understanding neural networks — read the weights, identify the circuits, edit specific behaviors. The progression from Olah's vision circuits to Anthropic's transformer circuits to scaling sparse autoencoders is the most important single thread in 2020s interpretability research, and it has become the backbone of empirical AI safety.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Mechanistic interp answers "how does the model compute" — orthogonal to SHAP/LIME/CF.</li>
<li>Olah's circuits program (2017–2020) established methodology on CNNs; Anthropic adapted it to transformers (Elhage 2021, Olsson 2022).</li>
<li>Superposition (Elhage 2022) explains polysemantic neurons: more features than dimensions, stored in non-orthogonal directions.</li>
<li>Sparse autoencoders extract monosemantic features by finding a sparse, overcomplete basis (Bricken 2023, Templeton 2024).</li>
<li>Scaling Monosemanticity (May 2024) on Claude 3 Sonnet showed millions of interpretable, causally steerable features.</li>
<li>Open problems: feature splitting, scaling cost, causality, deception detection. Pre-trained SAEs make hands-on work accessible today.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L8</strong> is the capstone: combine bias mitigation, SHAP, LIME, counterfactuals, and a touch of mechanistic flavor on a single end-to-end fair-and-explainable loan model on df_churn with a synthetic protected attribute.</p>
</div>`,
tr: `<p class="l-text"><strong>SHAP, LIME ve karşı-olguların hepsi modeli bir kara kutu olarak ele alır.</strong> Mekanistik yorumlanabilirlik tam tersini yapar: modeli açar ve ağırlıkların gerçekten ne hesapladığını okumaya çalışır, nöron nöron, dikkat başlığı dikkat başlığına, katman katman. Gündemi Chris Olah, Distill'de 2017-2020 arasında Yorumlanabilirliğin Yapı Taşları, Aktivasyon Atlasları ve Yakınlaştır: Devrelere Giriş ile belirledi — sinir ağlarının anlaşılmaz olmadığını, tersine küçük yorumlanabilir alt grafiklerden yapılmış belirli, bilinebilir algoritmalar olduğunu savunan bir araştırma programı. Anthropic bu ipi transformatörler için Transformatör Devreleri için Matematiksel Çerçeve (Elhage ve ark. 2021), indüksiyon başlıkları (Olsson ve ark. 2022) ve Templeton ve ark.'nın Scaling Monosemanticity (Mayıs 2024) ile zirveye çıkan 2023-2024 seyrek otoencoder atılım çalışmasıyla aldı; Claude 3 Sonnet'ten milyonlarca yorumlanabilir özellik çıkardı.</p>

<p class="l-text">Bu ders LLM'in içine yapılan turdur. Tek-nöron özellik görselleştirmesiyle başlıyoruz (orijinal 2017 Olah tekniği), dikkat başlığı analizine geçiyoruz (uzmanlaşma, kopyalama, indüksiyon), sonra seyrek otoencoderları motive eden polysemantiklik problemine ve son olarak ölçekte sözlük öğrenmeye. Her kavramın numpy veya sklearn'de küçük bir oyuncak uygulaması var — Pyodide'da gerçek bir Claude SAE çalıştıramayız ama oyuncak veri üzerinde 4-özellikli bir SAE ve elle yapılmış bir dizide 2-başlıklı dikkat deseni görselleştiricisi çalıştırabiliriz, miniature ölçekte tam olarak aynı algoritmaları görmek için. Sonunda 2026 sınır laboratuvarında "yorumlanabilir özellik"in ne anlama geldiğini ve bu araştırmanın AI güvenliği için neden merkezi hale geldiğini bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Mekanistik yorumlanabilirliği güvenlik / yorumlanabilirlik manzarasında konumlandır — "ne" ve "nasıl" sorularını yanıtlar, "ne önemliydi"yi değil</li>
<li>Dikkat desenlerini hesapla ve oku; oyuncak transformatörlerde indüksiyon başlıklarını ve kopyalama başlıklarını tanımla</li>
<li>Süperpozisyonu açıkla (Elhage 2022) — gerçek LLM'lerde bir nöronun neden 5 ilişkisiz özelliği kodladığı</li>
<li>Küçücük bir seyrek otoencoder uygula ve polysemantik nöronlardan monosemantik özelliklerin ortaya çıkışını izle</li>
<li>Olah'ın devrelerini, Anthropic'in transformatör devrelerini ve Bricken-Templeton'un SAE çalışmasını tek bir ilerlemeye bağla</li>
<li>2026'nın açık problemlerini tanı: SAE özellik bölünmesi, GPT-4 sınıfına ölçekleme, nedensel vs. korelasyonel özellikler</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Mekanistik Yorum Neden Var</h2>
<p class="l-text">Post-hoc yöntemler (SHAP, LIME, karşı-olgular) modelin hangi girdileri umursadığını söyler — modeli bir fonksiyon olarak ele alır. Mekanistik yorumlanabilirlik farklı bir şey sorar: <em>ağırlıklar verildiğinde, model hangi algoritmayı çalıştırıyor?</em> Bunu yanıtlayabilirsen, davranışları olmadan önce tahmin edebilirsin, belirli bilgiyi düzenleyebilirsin, aldatmayı tespit edebilirsin ve güvenlik özelliklerini denetleyebilirsin — post-hoc açıklama hiçbirini desteklemez.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kara-kutu (SHAP, LIME, KO)</div><div class="card-body">Sorar: bu tahmin için hangi öznitelikler önemliydi? Herhangi bir modelde çalışır, istatistiksel atıf verir. Uyum ve hata ayıklama için yararlıdır.</div></div>
<div class="calc-card"><div class="card-title">Sondalama</div><div class="card-body">Sorar: bu gizli katman P özelliğini kodluyor mu? (Belinkov 2019, Hewitt 2019). Aktivasyonlar üzerinde doğrusal sınıflandırıcı eğitir. Neyin temsil edildiğini ortaya koyar ama nasıl kullanıldığını değil.</div></div>
<div class="calc-card"><div class="card-title">Mekanistik</div><div class="card-body">Sorar: ağırlıklar hangi algoritmayı hesaplıyor ve hangi alt grafik B davranışını uyguluyor? (Olah 2017–, Elhage 2021–, Bricken 2023, Templeton 2024). Modelin içeride nasıl çalıştığını ortaya koyar.</div></div>
</div>

<div class="calc-highlight"><strong>Güvenlik bahsi:</strong> Anthropic'in yorum ekibi ve daha geniş alan, mekanistik anlayışın yetenekle ölçeklenen AI güvenlik garantilerine giden yol olduğuna bahse girer. Bir modelin devrelerini okuyabilirsek, aldatmayı tespit edebilir, zararlı davranışları düzenleyebilir ve bir modelin ne yapabileceği veya yapamayacağına dair iddiaları doğrulayabiliriz.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Olah'ın Devreler Programı (2017–2020)</h2>
<p class="l-text">Chris Olah'ın Distill makaleleri kavramsal temeli attı. <em>Feature Visualization</em>'da (2017), bir CNN nöronunu maksimum aktive eden girdi görüntüsünü, girdide gradyan tırmanışı ile bulabileceğini gösterdi — ve sonuçta ortaya çıkan görüntüler yorumlanabilir. Bazı nöronlar "tekerlek", "kulak", "30 derece açıdaki eğri" için ateşler. <em>The Building Blocks of Interpretability</em> (2018), özellik görselleştirmesini atıfla birleştirerek tahmin başına daha zengin açıklamalar yaptı. <em>Zoom In: An Introduction to Circuits</em> (2020), merkezi iddiayı tanıttı: ağlar <em>devrelerden</em> oluşur — tanımlanabilir algoritmalar uygulayan küçük hesaplama alt grafikleri (birkaç katmandaki birkaç nöron).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eğri detektörleri (InceptionV1)</div><div class="card-body">Cammarata ve ark. 2020 eğri detektörü devresini açıkça izledi: kenar → θ yönelimde eğri. Elle doğrulanabilir; alıcı alanları eğrileri gösterir.</div></div>
<div class="calc-card"><div class="card-title">Yüksek-düşük frekans detektörleri</div><div class="card-body">Olah 2020, yüksek-detay ve düşük-detay görüntü bölgeleri arasındaki sınırda ateşleyen nöronları gösterdi — figür-zemin ayrımı için yararlı. Mimariler arasında evrensel.</div></div>
<div class="calc-card"><div class="card-title">Multimodal nöronlar</div><div class="card-body">Goh ve ark. 2021, "Spider-Man" için bir fotoğraf, çizim veya kelime gösterilse de ateşleyen CLIP nöronlarını buldu — anlamsal kavramların görme-dil modellerinde bile nöron düzeyinde temsillere sahip olduğunun kanıtı.</div></div>
</div>

<p class="l-text">CV tarafı devre araştırması metodolojiyi kurdu. Transformatör tarafı çalışma onun üzerine inşa edildi.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Matematiksel Çerçeve (Elhage 2021)</h2>
<p class="l-text">Elhage ve ark.'nın <em>A Mathematical Framework for Transformer Circuits</em> (Anthropic, Aralık 2021), transformatörü hesaplama yapısını görünür kılan bir tabanda yeniden türetti. Anahtar kavrayış: bir transformatör (artık akış) + (dikkat OV devreleri) + (dikkat QK devreleri) + (MLP katmanları)'nın bir toplamıdır ve her biri ayrı ayrı analiz edilebilir. Artık akış, katmanlar arasındaki "iletişim kanalı" olur; dikkat başlıkları ondan <em>okur</em> ve ona <em>yazar</em>.</p>

<div class="katex-block">$$\\text{out} = x + \\sum_{h} \\text{Attn}_h(x) \\, W_O^h + \\text{MLP}(x + \\sum_h \\text{Attn}_h(x) W_O^h)$$</div>

<p class="l-text">İki türev sonuç alanı değiştirdi. (1) <em>İndüksiyon başlıkları</em> (Olsson ve ark., Mart 2022) — bağlam-içi kopyalamayı uygulayan 2 başlıklı bir devre: A başlığı önceki tokenin temsilini mevcut konuma kopyalar; B başlığı bunu önceki oluşuma geri dönmek ve sonra geleni kopyalamak için kullanır. Bu, küçük dil modellerinin bağlam-içi-öğrenme faz değişikliğinin arkasındaki mekanizmadır. (2) <em>Dolaylı Nesne Tanımlama</em> devresi (Wang ve ark. 2022) — GPT-2 small'da "Mary ve John mağazaya gittiğinde, John ___'ya bir içecek verdi"yi dolaylı nesneyi tanımlayarak çözen 26 başlıklı bir devre. Tüm devre insan-okunabilirdir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Oyuncak Dikkat Deseni Görselleştirmesi</h2>
<p class="l-text">Dikkat başlıkları transformatörün incelemesi en kolay parçasıdır: her başlık, hangi tokenlerin hangilerine baktığını gösteren softmax-normalleştirilmiş bir ağırlık matrisi üretir. Numpy'da küçücük bir 2-başlıklı dikkat katmanı inşa edip onu inceleyebiliriz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Toy transformer: 2 heads, 8-dim embeddings, 6-token sequence</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
d_model, n_heads, d_head = <span class="num">8</span>, <span class="num">2</span>, <span class="num">4</span>
seq = [<span class="str">'The'</span>, <span class="str">'cat'</span>, <span class="str">'sat'</span>, <span class="str">'on'</span>, <span class="str">'the'</span>, <span class="str">'mat'</span>]
T = <span class="fn">len</span>(seq)

<span class="cm"># Random embeddings (in real life these come from a tokenizer + embedding matrix)</span>
X = np.random.<span class="fn">randn</span>(T, d_model) * <span class="num">0.5</span>

<span class="cm"># Hand-crafted Q, K, V matrices for each head</span>
W_Q = np.random.<span class="fn">randn</span>(n_heads, d_model, d_head) * <span class="num">0.3</span>
W_K = np.random.<span class="fn">randn</span>(n_heads, d_model, d_head) * <span class="num">0.3</span>
W_V = np.random.<span class="fn">randn</span>(n_heads, d_model, d_head) * <span class="num">0.3</span>

<span class="kw">def</span> <span class="fn">softmax</span>(x, axis=-<span class="num">1</span>):
    x = x - x.<span class="fn">max</span>(axis=axis, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(x); <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=axis, keepdims=<span class="kw">True</span>)

attention_patterns = []
<span class="kw">for</span> h <span class="kw">in</span> <span class="fn">range</span>(n_heads):
    Q = X @ W_Q[h]; K = X @ W_K[h]; V = X @ W_V[h]
    scores = Q @ K.T / np.<span class="fn">sqrt</span>(d_head)
    <span class="cm"># Causal mask</span>
    mask = np.<span class="fn">triu</span>(np.<span class="fn">ones</span>((T,T)), k=<span class="num">1</span>).<span class="fn">astype</span>(<span class="fn">bool</span>)
    scores[mask] = -<span class="num">1e9</span>
    attn = <span class="fn">softmax</span>(scores, axis=-<span class="num">1</span>)
    attention_patterns.<span class="fn">append</span>(attn)

<span class="kw">for</span> h, attn <span class="kw">in</span> <span class="fn">enumerate</span>(attention_patterns):
    <span class="fn">print</span>(f<span class="str">'\\nHead {h} attention pattern (rows = query token, cols = key token):'</span>)
    <span class="fn">print</span>(<span class="str">'     '</span> + <span class="str">' '</span>.<span class="fn">join</span>(f<span class="str">'{t:&gt;5s}'</span> <span class="kw">for</span> t <span class="kw">in</span> seq))
    <span class="kw">for</span> i, t <span class="kw">in</span> <span class="fn">enumerate</span>(seq):
        row = <span class="str">' '</span>.<span class="fn">join</span>(f<span class="str">'{attn[i,j]:.2f}'</span> <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(T))
        <span class="fn">print</span>(f<span class="str">'{t:&gt;5s}: {row}'</span>)
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) 2 başlık, 8 boyutlu gömme ve 6 tokenlik <code>['The','cat','sat','on','the','mat']</code> cümlesi ile oyuncak bir transformatör bloğu kurar, sonra başlık başına rastgele <code>W_Q, W_K, W_V</code> projeksiyon matrislerini örnekler. 2) Her başlık <code>h</code> için <code>Q = X @ W_Q[h]</code>, <code>K = X @ W_K[h]</code> ve dikkat skoru <code>Q @ K.T / sqrt(d_head)</code>'yı hesaplar; <code>np.triu(..., k=1)</code> ile nedensel üst-üçgen maskeyi uygulayıp maskeli girdileri <code>-1e9</code> yapar ve anahtar ekseni boyunca softmax alır. 3) Elde edilen dikkat matrislerinin her birini sorgu-satırı / anahtar-sütunu tablosu olarak yazdırır; hangi tokenin hangisine baktığını doğrudan okuyabilirsin.</p>

<p class="l-text">Gerçek bir modelde, başlık uzmanlaşmaları çarpıcıdır. Vig &amp; Belinkov (BlackboxNLP 2019) ve BERTology araştırması (Rogers, Kovaleva &amp; Rumshisky 2020) kataloglar: konumsal başlıklar (her zaman pozisyon-1'e bakar), sözdizimsel başlıklar (özne↔fiil), eş-gönderim başlıkları (zamir↔öncül), kopyalama başlıkları (önceki bir tokene güçlü bakar ve değerini kopyalar). Hepsi yalnızca dikkat matrisinden görülebilir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Süperpozisyon: Bir Nöron, Birçok Özellik (Elhage 2022)</h2>
<p class="l-text">Olah'ın 2017'deki umudu, her nöronun bir insan-yorumlanabilir özelliği kodladığıydı. Sonraki çalışmaların gösterdiği gibi gerçek daha karmaşıktır: birçok nöron <em>polysemantiktir</em>, birden fazla ilgisiz kavramda ateşler. Elhage ve ark.'nın <em>Toy Models of Superposition</em>'u (Anthropic, Eylül 2022) nedenini açıkladı: modelin temsil etmek istediği özellik sayısı boyutluluğunu aştığında, onları <em>süperpozisyonda</em> saklar — aktivasyon uzayında ortogonal olmayan yönlerde, üst üste gelen taban vektörleri kullanan bir kod gibi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Monosemantik</div><div class="card-body">Bir nöron = bir insan kavramı. 2017 Olah ideali. Bazı erken katman CNN nöronları için geçerli ama transformatör MLP'lerinde nadir.</div></div>
<div class="calc-card"><div class="card-title">Polysemantik</div><div class="card-body">Bir nöron birden fazla ilgisiz kavramda ateşler. Gerçek LLM'lerdeki baskın desen. Süperpozisyonun belirtisi.</div></div>
<div class="calc-card"><div class="card-title">Süperpozisyon</div><div class="card-body">Özellikler aktivasyon uzayında ortogonal olmayan yönlerde kodlanır. Seyrek aktivasyon girişimi düşürür. Model boyutların izin verdiğinden daha çok kavramı sığdırır.</div></div>
</div>

<div class="calc-highlight"><strong>Sonuç:</strong> nöronları teker teker incelemek polysemantik gürültü verir. Monosemantik özellikleri bulmak için farklı bir taban araman gerekir — özellikle, ayrıştırmak için yeterli yöne sahip <em>aşırı tam</em> bir taban. Seyrek otoencoderlerin yaptığı tam olarak budur.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Seyrek Otoencoderler ve Sözlük Öğrenme</h2>
<p class="l-text">Bir seyrek otoencoder (SAE), bir LLM'in bir katmanından aktivasyonları alır ve onları seyreklik cezasına sahip aşırı tam bir sözlük aracılığıyla yeniden inşa eder. Eğit: <code>min ||x - W_dec @ f(W_enc @ x)||² + λ||f(W_enc @ x)||₁</code>; burada <code>f</code> ReLU'dur ve <code>W_enc, W_dec</code> girdi boyutundan daha geniştir. Seyrek gizli değişkenler <code>f(W_enc @ x)</code> <em>monosemantik</em> çıkar — her biri bir insan-yorumlanabilir kavramda ateşler. Bricken ve ark.'nın <em>Towards Monosemanticity</em>'si (Anthropic, Ekim 2023) bunu 1 katmanlı transformatörde gösterdi; Templeton ve ark.'nın <em>Scaling Monosemanticity</em>'si (Mayıs 2024) Claude 3 Sonnet'ten ~30M özellik çıkardı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tiny sparse autoencoder on synthetic polysemantic data</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> DictionaryLearning

<span class="cm"># Synthesize 5 ground-truth features stored in 3-dim activation space (superposition!)</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
n_features = <span class="num">5</span>
true_directions = np.random.<span class="fn">randn</span>(n_features, <span class="num">3</span>); true_directions /= np.linalg.<span class="fn">norm</span>(true_directions, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># Generate sparse activations: each example has 1-2 features active</span>
N = <span class="num">500</span>
sparse_codes = np.<span class="fn">zeros</span>((N, n_features))
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
    k = np.random.<span class="fn">choice</span>([<span class="num">1</span>, <span class="num">2</span>])
    idx = np.random.<span class="fn">choice</span>(n_features, k, replace=<span class="kw">False</span>)
    sparse_codes[i, idx] = np.random.<span class="fn">uniform</span>(<span class="num">0.5</span>, <span class="num">1.5</span>, k)
activations = sparse_codes @ true_directions       <span class="cm"># shape (N, 3)</span>

<span class="cm"># Sklearn dictionary learning (simple SAE proxy: L1-sparse coding)</span>
sae = <span class="fn">DictionaryLearning</span>(n_components=<span class="num">8</span>, alpha=<span class="num">0.5</span>, max_iter=<span class="num">300</span>, random_state=<span class="num">0</span>)
sae.<span class="fn">fit</span>(activations)
recovered = sae.components_                         <span class="cm"># (8, 3)</span>

<span class="cm"># Match recovered directions to ground truth via cosine similarity</span>
<span class="kw">def</span> <span class="fn">cosine_match</span>(A, B):
    A = A / (np.linalg.<span class="fn">norm</span>(A, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)+<span class="num">1e-9</span>)
    B = B / (np.linalg.<span class="fn">norm</span>(B, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)+<span class="num">1e-9</span>)
    <span class="kw">return</span> np.<span class="fn">abs</span>(A @ B.T)

sim = <span class="fn">cosine_match</span>(recovered, true_directions)
best = sim.<span class="fn">max</span>(axis=<span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">'Recovered {n_features} ground-truth features from {recovered.shape[0]} dictionary atoms.'</span>)
<span class="fn">print</span>(f<span class="str">'Per-feature best cosine similarity to ground truth:'</span>)
<span class="kw">for</span> i, b <span class="kw">in</span> <span class="fn">enumerate</span>(best[:n_features]):
    <span class="fn">print</span>(f<span class="str">'  feature {i}: cos = {b:.3f}'</span>)
<span class="fn">print</span>(<span class="str">'In real SAE work this maps to <span class="str">"atom 4 = Golden Gate Bridge feature"</span> etc.'</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 3-boyutlu uzayda 5 gerçek özellik yönü sentezler — özelliklerden daha az boyut, bilerek süperpozisyona zorlar — ve bir seferde 1-2 özelliğin aktif olduğu 500 örnek üretir, böylece <code>activations = sparse_codes @ true_directions</code> polysemantik bir karışım olur. 2) Seyrek otoencoder yerine sklearn'ün <code>DictionaryLearning(n_components=8, alpha=0.5)</code>'ını oturtur; L1 cezası öğrenilen sözlük atomlarını orijinal seyrek üretici yönlere doğru iter. 3) <code>cosine_match(A, B)</code>'i çiftli kosinüs benzerliklerini hesaplamak için tanımlar ve gerçek özellik başına en iyi eşleşme kosinüsünü yazdırır — 1'e yakın değerler SAE'nin polysemantik aktivasyonlardan monosemantik yönleri kurtardığını doğrular.</p>

<p class="l-text">Templeton ve ark. 2024'te aynı tarif sınır ölçeğinde Golden Gate Bridge, aldatma, yağcılık ve çıkarım sırasında yükseltilebilen veya bastırılabilen düzinelerce başka kavram için özellikler üretti. Ünlü "Golden Gate Claude" gösterimi (Mayıs 2024), bir özelliği yüksek tutarladı ve model köprü hakkında konuşmayı bırakamadı — SAE özelliklerinin yalnızca korelasyonel değil nedensel olduğunun doğrudan deneysel kanıtı.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Anthropic 2024 Makalesini Okuma</h2>
<p class="l-text">Templeton, Conerly, Marcus, Lindsey ve ark. <em>Scaling Monosemanticity: Claude 3 Sonnet'ten Yorumlanabilir Özelliklerin Çıkarılması</em> (transformer-circuits.pub, Mayıs 2024), şu ana kadar on yılın en etkili mekanistik yorum makalesidir. Üç bulgu öne çıkar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özellikler ölçeklenir</div><div class="card-body">SAE kalitesi genişlik ve eğitim hesaplamasıyla iyileşmeye devam eder. Sonnet'teki 34M-özellikli SAE gerçekten ince taneli özellikler buldu — belirli dillere özgü "kod enjeksiyonu" varyantları.</div></div>
<div class="calc-card"><div class="card-title">Multimodal ve çok dilli</div><div class="card-body">Tek özellikler İngilizce, Çince, Korece ve görüntü girdileri arasında aynı kavramda ateşler. Dahili temsillerin yüzey biçimine soyut olduğunu doğrular.</div></div>
<div class="calc-card"><div class="card-title">Nedensel müdahaleler</div><div class="card-body">Bir özelliği yüksek veya düşük değere kelepçelemek, modelin çıktısını o özelliğin anlamı yönünde güvenilir şekilde yönlendirir. Golden Gate Claude manşet gösterisidir; "aldatma" ve "yağcılık" özellikleri benzer yönlendirilebilirlik gösterir.</div></div>
</div>

<p class="l-text">2024 takipleri (Cunningham ve ark. <em>Sparse Autoencoders Find Highly Interpretable Features</em> ICLR 2024; Marks ve ark. <em>Sparse Feature Circuits</em> arxiv 2024), SAE özelliklerinin uçtan uca davranışları açıklayan devrelerde birleştirilebileceğini gösterdi — sadece yerel özellikler değil, tüm hatlar.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 2026'nın Açık Problemleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özellik bölünmesi</div><div class="card-body">Daha büyük SAE'ler kaba özellikleri daha ince olanlara böler — ama "Golden Gate Bridge" gerçekten bir özellik mi yoksa elli mi? Doğru ayrıntı düzeyi için henüz ilkeli bir kriter yok.</div></div>
<div class="calc-card"><div class="card-title">GPT-4 sınıfına ölçekleme</div><div class="card-body">SAE eğitimi hesaplama açısından ağırdır. Sonnet ölçeğindeki SAE'ler milyonlara mal olur; en büyük sınır modelleri için fiyat yalnızca laboratuvarların deneyleri çalıştırabileceği kadar diktir.</div></div>
<div class="calc-card"><div class="card-title">Nedensel vs. korelasyonel özellikler</div><div class="card-body">SAE özellikleri kavramlarla korelasyon gösterir, ancak nedensellik müdahale gerektirir. Aktivasyon yamalama (Heimersheim &amp; Janiak 2023) standart araçtır ama ölçekte pahalıdır.</div></div>
<div class="calc-card"><div class="card-title">Güvenliğe bağlantı</div><div class="card-body">SAE özellikleri aldatmak için eğitilmiş modellerde aldatmayı tespit edebilir mi? Hubinger ve ark. <em>Sleeper Agents</em> (Anthropic 2024), standart ince ayarın arka kapıları kaldırmadığını gösterdi; SAE tabanlı tespitin adversarial olarak eğitilmiş modellerde çalışıp çalışmadığı açık.</div></div>
</div>

<div class="calc-highlight"><strong>Bugün yapabileceklerin:</strong> <code>sparse_autoencoder</code> (Anthropic), <code>SAE_Lens</code> (Joseph Bloom) ve <code>nnsight</code> (Bau ve ark.) kütüphaneleri küçük ölçekli SAE deneylerini erişilebilir kılar. EleutherAI ve Apollo Research, birkaç açık model için önceden eğitilmiş SAE'ler barındırır — onları indirebilir ve özellikleri keşfetmeye bir öğleden sonra başlayabilirsin.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sonraki</h2>
<p class="l-text">Mekanistik yorumlanabilirlik, sinir ağlarını anlamaya içeriden dışarıya yaklaşımdır — ağırlıkları oku, devreleri tanımla, belirli davranışları düzenle. Olah'ın görme devrelerinden Anthropic'in transformatör devrelerine ve seyrek otoencoder'ları ölçeklemeye uzanan ilerleme, 2020'lerin yorumlanabilirlik araştırmasındaki tek en önemli iptir ve ampirik AI güvenliğinin omurgası haline gelmiştir.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Mekanistik yorum "model nasıl hesaplar" sorusunu yanıtlar — SHAP/LIME/KO'ya ortogonal.</li>
<li>Olah'ın devre programı (2017–2020), CNN'lerde metodolojiyi kurdu; Anthropic onu transformatörlere uyarladı (Elhage 2021, Olsson 2022).</li>
<li>Süperpozisyon (Elhage 2022) polysemantik nöronları açıklar: boyutlardan daha çok özellik, ortogonal olmayan yönlerde saklanır.</li>
<li>Seyrek otoencoderler, seyrek, aşırı tam bir taban bularak monosemantik özellikleri çıkarır (Bricken 2023, Templeton 2024).</li>
<li>Scaling Monosemanticity (Mayıs 2024), Claude 3 Sonnet'te milyonlarca yorumlanabilir, nedensel olarak yönlendirilebilir özellik gösterdi.</li>
<li>Açık problemler: özellik bölünmesi, ölçek maliyeti, nedensellik, aldatma tespiti. Önceden eğitilmiş SAE'ler bugün uygulamalı çalışmayı erişilebilir kılar.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L8</strong>, capstone'dur: önyargı azaltma, SHAP, LIME, karşı-olgular ve sentetik korunan öznitelikli df_churn üzerinde uçtan uca adil-ve-açıklanabilir tek bir kredi modelinde mekanistik tat dokunuşunu birleştir.</p>
</div>`
};
