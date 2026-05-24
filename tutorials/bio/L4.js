window.BIO_L4 = {
en: `<p class="l-text"><strong>A protein language model treats amino acid sequences as text.</strong> The same masked-language-model objective that gave us BERT in 2018 — corrupt 15% of tokens, predict them — works astonishingly well on UniRef. The resulting embeddings encode secondary structure, contacts, stability, binding sites, and evolutionary fitness, often without any structural supervision. This is the protein-AI insight: evolution is the dataset, sequence is the language, and a transformer trained to fill in the blanks learns biology by accident.</p>

<p class="l-text">In this lesson we walk the protein-LLM family tree. ProtTrans / ProtBERT (Elnaggar 2021) was the first credible BERT-for-proteins. ESM-1b → ESM-2 → ESM-3 (Meta FAIR / EvolutionaryScale, 2020-2024) scaled to 15 billion parameters and demonstrated zero-shot variant effect prediction better than supervised baselines. ProtGPT2 (Ferruz 2022) is a generative GPT-2-style model that writes plausible novel proteins. We connect everything to NLP — masked language modeling, scaling laws, fitness prediction as a downstream task, and the open question of whether a large enough protein LM eventually learns to fold proteins as a side effect (yes; that is what ESMFold is).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Apply masked language modeling to protein sequences and explain why it transfers to structure</li>
<li>Compare ESM-1b (650M), ESM-2 (15B), ESM-3 (98B) — what each scale unlocked</li>
<li>Use a protein LM for zero-shot variant effect prediction with the masked-marginals trick</li>
<li>Generate novel proteins with a GPT-style model (ProtGPT2) and screen them by perplexity</li>
<li>Understand the fitness-landscape framing: pseudo-likelihood as a proxy for evolutionary fitness</li>
<li>Build a TF-IDF surrogate of protein embeddings in pure sklearn — same downstream behaviors at toy scale</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. From BERT to ProtBERT</h2>
<p class="l-text">The recipe is unchanged: tokenize each amino acid as one token (vocab = 20 + a few specials), corrupt 15% of positions with the BERT mask trick (80% [MASK], 10% random, 10% original), and train a transformer encoder to predict the original residues. The ProtTrans paper (Elnaggar et al. 2021) trained on UniRef100 and BFD; ProtBERT-BFD has 420M parameters. The headline result: linear probes on top of frozen ProtBERT embeddings beat hand-engineered features for secondary structure (DSSP-3) by 5+ points.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers blocked in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel
<span class="kw">import</span> torch

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"Rostlab/prot_bert"</span>, do_lower_case=<span class="kw">False</span>)
model = AutoModel.<span class="fn">from_pretrained</span>(<span class="str">"Rostlab/prot_bert"</span>).<span class="fn">eval</span>()

seq = <span class="str">" "</span>.<span class="fn">join</span>(<span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQ"</span>)   <span class="cm"># space-separated AAs is ProtBERT's tokenization</span>
ids = <span class="fn">tok</span>(seq, return_tensors=<span class="str">"pt"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**ids)
<span class="fn">print</span>(out.last_hidden_state.shape)  <span class="cm"># (1, L+2, 1024) — per-residue embeddings</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ESM Family — Scaling Laws for Proteins</h2>
<p class="l-text">Meta's ESM line is the protein equivalent of GPT-2 → GPT-3 → GPT-4. Each generation kept the architecture and training objective roughly fixed and pushed parameters and data.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ESM-1b (Rives 2019/2021)</div><div class="card-body">650M params, UniRef50, 33 layers. First clean demonstration that scale → emergent structural knowledge. Embeddings predict contact maps via a small linear head.</div></div>
<div class="calc-card"><div class="card-title">ESM-2 (Lin 2022/2023)</div><div class="card-body">From 8M to 15B params. Released as 8M, 35M, 150M, 650M, 3B, 15B checkpoints. The 15B model is the backbone of ESMFold. Trained on UniRef50 + UniRef90 expansion.</div></div>
<div class="calc-card"><div class="card-title">ESM-3 (Hayes 2024, EvolutionaryScale spinout)</div><div class="card-body">98B params, multi-track: sequence + structure (as discrete VQ tokens) + function annotations. First "GPT-4 of proteins" — generative, instruction-followable, designed esmGFP, a fluorescent protein 500M years of simulated evolution from any natural one.</div></div>
<div class="calc-card"><div class="card-title">ESM Cambrian (Apr 2025)</div><div class="card-body">Open release, 600M params, optimized for embedding quality. The default 2026 choice when you want frozen features.</div></div>
</div>

<div class="calc-highlight"><strong>Scaling law (Lin 2022):</strong> as ESM-2 grows from 8M to 15B parameters, the perplexity drops smoothly and the contact-prediction accuracy from a single linear head climbs from ~30% to ~70% Top-L long-range. No architectural change — just more parameters and more data.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Masked-Marginals — Zero-Shot Variant Effect</h2>
<p class="l-text">A protein LM gives you a probability for every amino acid at every position. If a mutation A → B at position i has high pseudo-log-likelihood ratio under the model, evolution would tolerate it; if low, it is likely deleterious. This is the masked-marginals trick (Meier et al., NeurIPS 2021):</p>

<div class="katex-block">$$s_{i, a \to b} = \log p_\theta(x_i = b \mid x_{\setminus i}) - \log p_\theta(x_i = a \mid x_{\setminus i})$$</div>

<p class="l-text">Score &gt; 0 → mutation likely benign / functional; score &lt; 0 → likely disruptive. Without any supervised training on disease data, ESM-1v (Meier 2021) predicts variant pathogenicity competitively with EVE and PolyPhen on ProteinGym benchmarks. AlphaMissense (Cheng et al., Science 2023, DeepMind) extends this to all 71 million possible human single-amino-acid variants — 89% scored, 32% predicted pathogenic, 57% benign, the rest uncertain.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — fairseq esm blocked in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, esm
model, alphabet = esm.pretrained.<span class="fn">esm2_t33_650M_UR50D</span>()
batch_converter = alphabet.<span class="fn">get_batch_converter</span>()
model.<span class="fn">eval</span>()

wt = <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>
i, b = <span class="num">7</span>, <span class="str">'L'</span>   <span class="cm"># mutate position 7 from K (the wt residue) to L</span>
masked = wt[:i] + <span class="str">'&lt;mask&gt;'</span> + wt[i+<span class="num">1</span>:]

_, _, toks = <span class="fn">batch_converter</span>([(<span class="str">"seq"</span>, masked)])
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(toks)[<span class="str">"logits"</span>][<span class="num">0</span>, i+<span class="num">1</span>]  <span class="cm"># +1 for BOS</span>
log_p = torch.<span class="fn">log_softmax</span>(logits, dim=-<span class="num">1</span>)
score = log_p[alphabet.<span class="fn">get_idx</span>(b)] - log_p[alphabet.<span class="fn">get_idx</span>(wt[i])]
<span class="fn">print</span>(f<span class="str">"Variant K{i}{b} masked-marginal score: {score.item():.3f}"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. TF-IDF Surrogate — Protein LMs in 30 Lines</h2>
<p class="l-text">To feel why protein LMs work without GPU access, build a k-mer TF-IDF embedding. It loses the contextual subtleties of a transformer but reproduces the headline behaviors: similar sequences embed close together, classifier on top works for family-classification, and "edit one residue" perturbs the embedding smoothly.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># Toy protein corpus — three families</span>
fam_A = [<span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQ"</span>,
         <span class="str">"MKTAYIAKQRTISFVKSHFSRQLEERLGLIEVQ"</span>,
         <span class="str">"MKTSYIAKQRQISFVKSHFSRQLEERLGLIEVQ"</span>]
fam_B = [<span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAA"</span>,
         <span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWAPSEAA"</span>,
         <span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAS"</span>]
fam_C = [<span class="str">"WWWFFFFEEEEEDDDDDCCCCCAAAAAGGGGG"</span>,
         <span class="str">"WWWFFYFEEEEEDDDDDCCCCCAAAAAGGGGG"</span>]
seqs  = fam_A + fam_B + fam_C
labels = [<span class="str">"A"</span>]*<span class="num">3</span> + [<span class="str">"B"</span>]*<span class="num">3</span> + [<span class="str">"C"</span>]*<span class="num">2</span>

<span class="cm"># 3-mer TF-IDF as a stand-in for ESM embeddings</span>
<span class="kw">def</span> <span class="fn">kmer_tokenize</span>(s, k=<span class="num">3</span>):
    <span class="kw">return</span> <span class="str">' '</span>.<span class="fn">join</span>(s[i:i+k] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>))

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'word'</span>, token_pattern=r<span class="str">'\\S+'</span>, sublinear_tf=<span class="kw">True</span>)
X = vec.<span class="fn">fit_transform</span>([<span class="fn">kmer_tokenize</span>(s) <span class="kw">for</span> s <span class="kw">in</span> seqs])
sim = <span class="fn">cosine_similarity</span>(X)
<span class="fn">print</span>(<span class="str">"Similarity within family A (3 seqs):"</span>, <span class="fn">round</span>(sim[:<span class="num">3</span>, :<span class="num">3</span>][np.<span class="fn">triu_indices</span>(<span class="num">3</span>,k=<span class="num">1</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Similarity A-vs-B (across families):"</span>, <span class="fn">round</span>(sim[:<span class="num">3</span>, <span class="num">3</span>:<span class="num">6</span>].<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Embedding dim:"</span>, X.shape[<span class="num">1</span>])
</code></pre></div>

<p class="l-text">The within-family similarity is high, across-family is low — exactly what you want from a protein representation. Real ESM embeddings do this much better and capture function, but the TF-IDF surrogate is enough to build a working pipeline today.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Family Classification with sklearn</h2>
<p class="l-text">A common downstream task: given a sequence, predict its Pfam family. With ESM embeddings + a logistic regression head, accuracy on Pfam-A is well over 95%. With TF-IDF + LR, you still get a respectable ~80% on small benchmarks — the universal baseline.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Synthesize 60 sequences across 3 "families" by perturbing prototypes</span>
prototypes = {
    <span class="str">"kinase"</span>:  <span class="fn">list</span>(<span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>),
    <span class="str">"globin"</span>:  <span class="fn">list</span>(<span class="str">"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQ"</span>),
    <span class="str">"helicase"</span>:<span class="fn">list</span>(<span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAARYAQEEMSAFLNTLHAYREQK"</span>),
}
seqs, ys = [], []
aa = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)
<span class="kw">for</span> fam, proto <span class="kw">in</span> prototypes.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
        s = proto.<span class="fn">copy</span>()
        <span class="kw">for</span> j <span class="kw">in</span> np.random.<span class="fn">choice</span>(<span class="fn">len</span>(s), size=<span class="num">4</span>, replace=<span class="kw">False</span>):
            s[j] = np.random.<span class="fn">choice</span>(aa)
        seqs.<span class="fn">append</span>(<span class="str">''</span>.<span class="fn">join</span>(s)); ys.<span class="fn">append</span>(fam)

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">3</span>,<span class="num">3</span>))
X = vec.<span class="fn">fit_transform</span>(seqs)
y = np.<span class="fn">array</span>(ys)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"Test accuracy:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Per-class probabilities for first test seq:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(clf.classes_, clf.<span class="fn">predict_proba</span>(Xte[:<span class="num">1</span>])[<span class="num">0</span>].<span class="fn">round</span>(<span class="num">2</span>))))
</code></pre></div>

<p class="l-text">Replace TF-IDF with mean-pooled ESM-2 embeddings and you have a state-of-the-art Pfam classifier, at the cost of a 15B-parameter model.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ProtGPT2 — Generative Proteins</h2>
<p class="l-text">Ferruz et al. (Nature Comms 2022) trained a GPT-2 (738M params) on 50 million UniRef50 sequences. ProtGPT2 generates novel sequences that, when folded by AF2, look like real proteins — well-formed secondary structure, reasonable hydrophobic cores, plausible solvent-exposed surfaces. About 10-30% of generations score "high pLDDT" on AF2 without further filtering. The model also assigns a perplexity to any input sequence — useful as a quick sanity score for designed proteins.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers blocked in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
gen = <span class="fn">pipeline</span>(<span class="str">"text-generation"</span>, model=<span class="str">"nferruz/ProtGPT2"</span>)
out = <span class="fn">gen</span>(<span class="str">"&lt;|endoftext|&gt;"</span>, max_length=<span class="num">120</span>, num_return_sequences=<span class="num">4</span>, do_sample=<span class="kw">True</span>, top_k=<span class="num">950</span>, repetition_penalty=<span class="num">1.2</span>)
<span class="kw">for</span> s <span class="kw">in</span> out:
    <span class="fn">print</span>(s[<span class="str">"generated_text"</span>][:<span class="num">80</span>].<span class="fn">replace</span>(<span class="str">'\\n'</span>,<span class="str">''</span>))
</code></pre></div>

<p class="l-text">Successors: ProGen2 (Salesforce 2023, conditional on family tags), ZymCTRL (Munsamy 2024, conditional on EC enzyme class), and ESM-3's generative track. The pattern: GPT for proteins is real, and it works because the dataset (UniRef) is structured and large.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Fitness Landscapes and Pseudo-Likelihood</h2>
<p class="l-text">A fitness landscape is a map from sequence to functional readout (binding affinity, catalytic rate, stability ΔG). Riesselman et al. 2018 (DeepSequence) and Meier 2021 (ESM-1v) showed that the model's pseudo-likelihood — the sum of conditional log-probs at each position — correlates strongly with experimental fitness, even on out-of-distribution mutants. This is why protein LMs are a default tool in directed evolution today.</p>

<div class="katex-block">$$\text{PLL}(x) = \sum_{i=1}^{L} \log p_\theta(x_i \mid x_{\setminus i})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Toy: PLL approximated by negative log-distance from a "wild-type prototype"</span>
wt = <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>
aa = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)

<span class="kw">def</span> <span class="fn">mutate</span>(s, n):
    s = <span class="fn">list</span>(s)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        i = np.random.<span class="fn">randint</span>(<span class="fn">len</span>(s))
        s[i] = np.random.<span class="fn">choice</span>(aa)
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(s)

variants = [<span class="fn">mutate</span>(wt, n) <span class="kw">for</span> n <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>]]
vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">3</span>,<span class="num">3</span>)).<span class="fn">fit</span>([wt])
wt_v = vec.<span class="fn">transform</span>([wt])
<span class="kw">for</span> v, n <span class="kw">in</span> <span class="fn">zip</span>(variants, [<span class="num">0</span>,<span class="num">1</span>,<span class="num">2</span>,<span class="num">5</span>,<span class="num">10</span>,<span class="num">20</span>]):
    sim = (vec.<span class="fn">transform</span>([v]) @ wt_v.T).<span class="fn">toarray</span>().<span class="fn">item</span>()
    <span class="fn">print</span>(f<span class="str">"  mutations={n:2d}  proxy-fitness (cosine to wt) = {sim:.3f}"</span>)
</code></pre></div>

<p class="l-text">As mutations accumulate, our proxy-fitness drops monotonically — what a good fitness model should do. ESM-1v's pseudo-likelihood does this on real DMS (Deep Mutational Scanning) datasets and matches expert-curated tools like EVE.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. ESM-3 and Multimodal Protein LMs</h2>
<p class="l-text">ESM-3 (Hayes et al., EvolutionaryScale 2024) introduced a multi-track formulation: sequence tokens, structure tokens (from a VQ-VAE on backbone + side-chain torsions), and function tokens (GO terms, keywords). All three tracks are jointly masked during training; at inference you can prompt with any combination. "Generate a protein with this active site that binds this ligand" becomes a structured prompt.</p>

<div class="calc-highlight"><strong>The headline demo:</strong> ESM-3 designed esmGFP, a green fluorescent protein 58% identical to natural GFPs — equivalent to 500 million years of simulated evolution — and it actually fluoresces in the wet lab. Published Hayes et al., Science 2025.</div>

<p class="l-text">The architecture: standard transformer, ~98B params, three input/output heads. The novelty is the discrete structure-token vocabulary (about 4096 tokens that quantize local backbone + side-chain conformation), which lets a single sequence-modeling stack handle both sequence and structure as text. ESM-3-Open (1.4B) is publicly released; the full 98B is API-only.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. NLP Lessons Transfer (Mostly)</h2>
<p class="l-text">Things that work the same in protein LMs and text LMs:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scaling laws</div><div class="card-body">Loss is a smooth power law in parameters and data. Lin 2022 showed ESM-2's curve. Same shape as Kaplan 2020 / Hoffmann 2022 (Chinchilla).</div></div>
<div class="calc-card"><div class="card-title">Pretrain → freeze → linear probe</div><div class="card-body">Frozen ESM features + tiny head wins for most downstream tasks. Same recipe as freezing BERT for NER in NLP.</div></div>
<div class="calc-card"><div class="card-title">Instruction tuning + RLHF</div><div class="card-body">ESM-3's function-conditional generation is roughly an instruction-tuned protein GPT. Watch this space.</div></div>
<div class="calc-card"><div class="card-title">Differences</div><div class="card-body">Vocabulary is tiny (20 vs 50k for text). Sequences are long (2k+ residues common). MSAs add a non-text data modality. Compute per-token is cheaper than text LMs at the same param count.</div></div>
</div>

<p class="l-text">The unique thing about protein LMs is the 3D readout — fold the predicted-by-LM sequence and check whether the structure makes sense. That feedback loop does not exist in text. The next lesson moves to genomics, where the dataset is even larger and the language is even simpler (4 tokens — A, C, G, T).</p>
</div>`,
tr: `<p class="l-text"><strong>Bir protein dil modeli, amino asit dizilerini metin olarak ele alır.</strong> 2018'de bize BERT'i veren aynı maskelenmiş-dil-modeli amacı — token'ların %15'ini boz, tahmin et — UniRef üzerinde şaşırtıcı derecede iyi çalışır. Ortaya çıkan gömmeler genellikle herhangi bir yapısal denetim olmadan ikincil yapıyı, temasları, kararlılığı, bağlanma bölgelerini ve evrimsel uygunluğu kodlar. Bu, protein-AI içgörüsüdür: evrim veri kümesidir, dizi dildir ve boşlukları doldurmak için eğitilmiş bir transformer kazara biyoloji öğrenir.</p>

<p class="l-text">Bu derste protein-LLM aile ağacında yürüyoruz. ProtTrans / ProtBERT (Elnaggar 2021) proteinler için ilk inandırıcı BERT idi. ESM-1b → ESM-2 → ESM-3 (Meta FAIR / EvolutionaryScale, 2020-2024) 15 milyar parametreye ölçeklendi ve denetlenen temellerden daha iyi sıfır-atış varyant etki tahmini gösterdi. ProtGPT2 (Ferruz 2022), inandırıcı yeni proteinler yazan üretken bir GPT-2-tarzı modeldir. Her şeyi NLP'ye bağlıyoruz — maskelenmiş dil modelleme, ölçeklendirme yasaları, alt-akış görevi olarak uygunluk tahmini ve yeterince büyük bir protein LM'inin sonunda yan etki olarak protein katlamayı öğrenip öğrenemeyeceği açık sorusu (evet; ESMFold tam olarak budur).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Maskelenmiş dil modellemeyi protein dizilerine uygulamak ve yapıya neden aktarıldığını açıklamak</li>
<li>ESM-1b (650M), ESM-2 (15B), ESM-3 (98B) karşılaştırması — her ölçeğin neyi açtığı</li>
<li>Maskelenmiş-marjinaller hilesi ile protein LM'i sıfır-atış varyant etki tahmini için kullanmak</li>
<li>GPT-tarzı bir model (ProtGPT2) ile yeni proteinler üretmek ve onları perpleksite ile elemek</li>
<li>Uygunluk-manzarası çerçevelemesini anlamak: evrimsel uygunluk için bir vekil olarak sözde-olabilirlik</li>
<li>Saf sklearn'de protein gömmelerinin TF-IDF vekilini kurmak — oyuncak ölçekte aynı alt-akış davranışları</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. BERT'ten ProtBERT'e</h2>
<p class="l-text">Tarif değişmemiştir: her amino asidi tek bir token olarak tokenleştir (vocab = 20 + birkaç özel), pozisyonların %15'ini BERT mask hilesi ile boz (%80 [MASK], %10 rastgele, %10 orijinal) ve orijinal rezidüleri tahmin etmek için bir transformer encoder eğit. ProtTrans makalesi (Elnaggar ve ark. 2021) UniRef100 ve BFD üzerinde eğitildi; ProtBERT-BFD 420M parametreye sahip. Manşet sonuç: dondurulmuş ProtBERT gömmeleri üzerinde doğrusal probe'lar, ikincil yapı (DSSP-3) için elle mühendislik edilmiş özellikleri 5+ puan ile geçer.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers Pyodide'de bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModel
<span class="kw">import</span> torch

tok = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"Rostlab/prot_bert"</span>, do_lower_case=<span class="kw">False</span>)
model = AutoModel.<span class="fn">from_pretrained</span>(<span class="str">"Rostlab/prot_bert"</span>).<span class="fn">eval</span>()

seq = <span class="str">" "</span>.<span class="fn">join</span>(<span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQ"</span>)   <span class="cm"># space-separated AAs is ProtBERT's tokenization</span>
ids = <span class="fn">tok</span>(seq, return_tensors=<span class="str">"pt"</span>)
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = <span class="fn">model</span>(**ids)
<span class="fn">print</span>(out.last_hidden_state.shape)  <span class="cm"># (1, L+2, 1024) — per-residue embeddings</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ESM Ailesi — Proteinler için Ölçeklendirme Yasaları</h2>
<p class="l-text">Meta'nın ESM serisi proteinlerin GPT-2 → GPT-3 → GPT-4 eşdeğeridir. Her nesil mimariyi ve eğitim amacını kabaca sabit tuttu ve parametreleri ile veriyi yukarı itti.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ESM-1b (Rives 2019/2021)</div><div class="card-body">650M parametre, UniRef50, 33 katman. Ölçeğin → ortaya çıkan yapısal bilgiye yol açtığının ilk temiz gösterimi. Gömmeler küçük bir doğrusal başlık aracılığıyla temas haritalarını tahmin eder.</div></div>
<div class="calc-card"><div class="card-title">ESM-2 (Lin 2022/2023)</div><div class="card-body">8M'den 15B parametreye. 8M, 35M, 150M, 650M, 3B, 15B kontrol noktaları olarak yayımlandı. 15B model ESMFold'un omurgasıdır. UniRef50 + UniRef90 genişletmesi üzerinde eğitildi.</div></div>
<div class="calc-card"><div class="card-title">ESM-3 (Hayes 2024, EvolutionaryScale spinout)</div><div class="card-body">98B parametre, çok-iz: dizi + yapı (ayrık VQ token'ları olarak) + işlev açıklamaları. İlk "proteinlerin GPT-4'ü" — üretken, talimat-takip edebilen, herhangi doğal proteinden 500M yıl simüle edilmiş evrim uzaklıkta floresan bir protein olan esmGFP'yi tasarladı.</div></div>
<div class="calc-card"><div class="card-title">ESM Cambrian (Nis 2025)</div><div class="card-body">Açık yayın, 600M parametre, gömme kalitesi için optimize edilmiş. Dondurulmuş özellikler istediğinizde varsayılan 2026 seçimi.</div></div>
</div>

<div class="calc-highlight"><strong>Ölçeklendirme yasası (Lin 2022):</strong> ESM-2 8M'den 15B parametreye büyürken, perpleksite düzgünce düşer ve tek bir doğrusal başlıktan temas-tahmin doğruluğu ~%30'dan ~%70 Top-L uzun-menzilliye tırmanır. Mimari değişikliği yok — sadece daha fazla parametre ve daha fazla veri.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Maskelenmiş-Marjinaller — Sıfır-Atış Varyant Etkisi</h2>
<p class="l-text">Bir protein LM, her pozisyonda her amino asit için bir olasılık verir. Bir A → B mutasyonu i pozisyonunda model altında yüksek sözde-log-olabilirlik oranına sahipse, evrim onu tolere eder; düşükse, muhtemelen zararlıdır. Bu maskelenmiş-marjinaller hilesidir (Meier ve ark., NeurIPS 2021):</p>

<div class="katex-block">$$s_{i, a \to b} = \log p_\theta(x_i = b \mid x_{\setminus i}) - \log p_\theta(x_i = a \mid x_{\setminus i})$$</div>

<p class="l-text">Skor &gt; 0 → mutasyon muhtemelen zararsız / işlevsel; skor &lt; 0 → muhtemelen yıkıcı. Hastalık verisi üzerinde herhangi bir denetlenmiş eğitim olmadan, ESM-1v (Meier 2021) ProteinGym kıyaslamalarında EVE ve PolyPhen ile rekabetçi şekilde varyant patojenikliğini tahmin eder. AlphaMissense (Cheng ve ark., Science 2023, DeepMind) bunu olası tüm 71 milyon insan tek-amino-asit varyantına genişletir — %89 puanlandı, %32 patojenik tahmin edildi, %57 zararsız, geri kalanı belirsiz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — fairseq esm Pyodide'de bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, esm
model, alphabet = esm.pretrained.<span class="fn">esm2_t33_650M_UR50D</span>()
batch_converter = alphabet.<span class="fn">get_batch_converter</span>()
model.<span class="fn">eval</span>()

wt = <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>
i, b = <span class="num">7</span>, <span class="str">'L'</span>   <span class="cm"># mutate position 7 from K (the wt residue) to L</span>
masked = wt[:i] + <span class="str">'&lt;mask&gt;'</span> + wt[i+<span class="num">1</span>:]

_, _, toks = <span class="fn">batch_converter</span>([(<span class="str">"seq"</span>, masked)])
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    logits = <span class="fn">model</span>(toks)[<span class="str">"logits"</span>][<span class="num">0</span>, i+<span class="num">1</span>]  <span class="cm"># +1 for BOS</span>
log_p = torch.<span class="fn">log_softmax</span>(logits, dim=-<span class="num">1</span>)
score = log_p[alphabet.<span class="fn">get_idx</span>(b)] - log_p[alphabet.<span class="fn">get_idx</span>(wt[i])]
<span class="fn">print</span>(f<span class="str">"Variant K{i}{b} masked-marginal score: {score.item():.3f}"</span>)
</code></pre></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. TF-IDF Vekili — 30 Satırda Protein LM'leri</h2>
<p class="l-text">GPU erişimi olmadan protein LM'lerinin neden çalıştığını hissetmek için, bir k-mer TF-IDF gömmesi inşa edin. Bir transformer'ın bağlamsal inceliklerini kaybeder, ancak manşet davranışları yeniden üretir: benzer diziler birbirine yakın gömülür, üzerinde sınıflandırıcı aile-sınıflandırması için çalışır ve "bir rezidüyü düzenle" gömmeyi yumuşakça tedirgin eder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

<span class="cm"># Toy protein corpus — three families</span>
fam_A = [<span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQ"</span>,
         <span class="str">"MKTAYIAKQRTISFVKSHFSRQLEERLGLIEVQ"</span>,
         <span class="str">"MKTSYIAKQRQISFVKSHFSRQLEERLGLIEVQ"</span>]
fam_B = [<span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAA"</span>,
         <span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWAPSEAA"</span>,
         <span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAS"</span>]
fam_C = [<span class="str">"WWWFFFFEEEEEDDDDDCCCCCAAAAAGGGGG"</span>,
         <span class="str">"WWWFFYFEEEEEDDDDDCCCCCAAAAAGGGGG"</span>]
seqs  = fam_A + fam_B + fam_C
labels = [<span class="str">"A"</span>]*<span class="num">3</span> + [<span class="str">"B"</span>]*<span class="num">3</span> + [<span class="str">"C"</span>]*<span class="num">2</span>

<span class="cm"># 3-mer TF-IDF as a stand-in for ESM embeddings</span>
<span class="kw">def</span> <span class="fn">kmer_tokenize</span>(s, k=<span class="num">3</span>):
    <span class="kw">return</span> <span class="str">' '</span>.<span class="fn">join</span>(s[i:i+k] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>))

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'word'</span>, token_pattern=r<span class="str">'\\S+'</span>, sublinear_tf=<span class="kw">True</span>)
X = vec.<span class="fn">fit_transform</span>([<span class="fn">kmer_tokenize</span>(s) <span class="kw">for</span> s <span class="kw">in</span> seqs])
sim = <span class="fn">cosine_similarity</span>(X)
<span class="fn">print</span>(<span class="str">"Similarity within family A (3 seqs):"</span>, <span class="fn">round</span>(sim[:<span class="num">3</span>, :<span class="num">3</span>][np.<span class="fn">triu_indices</span>(<span class="num">3</span>,k=<span class="num">1</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Similarity A-vs-B (across families):"</span>, <span class="fn">round</span>(sim[:<span class="num">3</span>, <span class="num">3</span>:<span class="num">6</span>].<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Embedding dim:"</span>, X.shape[<span class="num">1</span>])
</code></pre></div>

<p class="l-text">Aile-içi benzerlik yüksek, aileler arası düşük — bir protein temsilinden tam olarak istediğiniz şey. Gerçek ESM gömmeleri bunu çok daha iyi yapar ve işlevi yakalar, ancak TF-IDF vekili bugün çalışan bir hat kurmak için yeterlidir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. sklearn ile Aile Sınıflandırması</h2>
<p class="l-text">Yaygın bir alt-akış görevi: bir dizi verildiğinde, Pfam ailesini tahmin et. ESM gömmeleri + bir lojistik regresyon başlığı ile, Pfam-A'da doğruluk %95'in çok üzerindedir. TF-IDF + LR ile, küçük kıyaslamalarda hala saygılı bir ~%80 elde edersiniz — evrensel temel.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Synthesize 60 sequences across 3 "families" by perturbing prototypes</span>
prototypes = {
    <span class="str">"kinase"</span>:  <span class="fn">list</span>(<span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>),
    <span class="str">"globin"</span>:  <span class="fn">list</span>(<span class="str">"VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQ"</span>),
    <span class="str">"helicase"</span>:<span class="fn">list</span>(<span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAARYAQEEMSAFLNTLHAYREQK"</span>),
}
seqs, ys = [], []
aa = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)
<span class="kw">for</span> fam, proto <span class="kw">in</span> prototypes.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
        s = proto.<span class="fn">copy</span>()
        <span class="kw">for</span> j <span class="kw">in</span> np.random.<span class="fn">choice</span>(<span class="fn">len</span>(s), size=<span class="num">4</span>, replace=<span class="kw">False</span>):
            s[j] = np.random.<span class="fn">choice</span>(aa)
        seqs.<span class="fn">append</span>(<span class="str">''</span>.<span class="fn">join</span>(s)); ys.<span class="fn">append</span>(fam)

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">3</span>,<span class="num">3</span>))
X = vec.<span class="fn">fit_transform</span>(seqs)
y = np.<span class="fn">array</span>(ys)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"Test accuracy:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Per-class probabilities for first test seq:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(clf.classes_, clf.<span class="fn">predict_proba</span>(Xte[:<span class="num">1</span>])[<span class="num">0</span>].<span class="fn">round</span>(<span class="num">2</span>))))
</code></pre></div>

<p class="l-text">TF-IDF'i ortalama-havuzlanmış ESM-2 gömmeleri ile değiştirin ve elinizde son teknoloji bir Pfam sınıflandırıcı olur — 15B-parametreli bir model maliyetiyle.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ProtGPT2 — Üretken Proteinler</h2>
<p class="l-text">Ferruz ve ark. (Nature Comms 2022) 50 milyon UniRef50 dizisi üzerinde bir GPT-2 (738M parametre) eğitti. ProtGPT2, AF2 tarafından katlandığında gerçek proteinler gibi görünen yeni diziler üretir — iyi-biçimlenmiş ikincil yapı, makul hidrofobik çekirdekler, akla yatkın çözücü-maruz yüzeyler. Üretimlerin yaklaşık %10-30'u daha fazla filtreleme olmadan AF2'de "yüksek pLDDT" alır. Model ayrıca herhangi bir girdi dizisine bir perpleksite atar — tasarlanmış proteinler için hızlı bir akıl-sağlığı skoru olarak yararlıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — transformers Pyodide'de bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> pipeline
gen = <span class="fn">pipeline</span>(<span class="str">"text-generation"</span>, model=<span class="str">"nferruz/ProtGPT2"</span>)
out = <span class="fn">gen</span>(<span class="str">"&lt;|endoftext|&gt;"</span>, max_length=<span class="num">120</span>, num_return_sequences=<span class="num">4</span>, do_sample=<span class="kw">True</span>, top_k=<span class="num">950</span>, repetition_penalty=<span class="num">1.2</span>)
<span class="kw">for</span> s <span class="kw">in</span> out:
    <span class="fn">print</span>(s[<span class="str">"generated_text"</span>][:<span class="num">80</span>].<span class="fn">replace</span>(<span class="str">'\\n'</span>,<span class="str">''</span>))
</code></pre></div>

<p class="l-text">Halefler: ProGen2 (Salesforce 2023, aile etiketleri üzerinde koşullu), ZymCTRL (Munsamy 2024, EC enzim sınıfı üzerinde koşullu) ve ESM-3'ün üretken izi. Örüntü: proteinler için GPT gerçektir ve veri kümesi (UniRef) yapılandırılmış ve büyük olduğu için çalışır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Uygunluk Manzaraları ve Sözde-Olabilirlik</h2>
<p class="l-text">Bir uygunluk manzarası, diziden işlevsel okumaya (bağlanma afinitesi, katalitik hız, kararlılık ΔG) bir haritadır. Riesselman ve ark. 2018 (DeepSequence) ve Meier 2021 (ESM-1v), modelin sözde-olabilirliğinin — her pozisyondaki koşullu log-olasılıkların toplamı — dağılım-dışı mutantlarda bile deneysel uygunlukla güçlü bir korelasyon gösterdiğini ortaya koydu. Protein LM'lerinin günümüzde yönlendirilmiş evrimde varsayılan bir araç olmasının nedeni budur.</p>

<div class="katex-block">$$\text{PLL}(x) = \sum_{i=1}^{L} \log p_\theta(x_i \mid x_{\setminus i})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Toy: PLL approximated by negative log-distance from a "wild-type prototype"</span>
wt = <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>
aa = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)

<span class="kw">def</span> <span class="fn">mutate</span>(s, n):
    s = <span class="fn">list</span>(s)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        i = np.random.<span class="fn">randint</span>(<span class="fn">len</span>(s))
        s[i] = np.random.<span class="fn">choice</span>(aa)
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(s)

variants = [<span class="fn">mutate</span>(wt, n) <span class="kw">for</span> n <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>]]
vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">3</span>,<span class="num">3</span>)).<span class="fn">fit</span>([wt])
wt_v = vec.<span class="fn">transform</span>([wt])
<span class="kw">for</span> v, n <span class="kw">in</span> <span class="fn">zip</span>(variants, [<span class="num">0</span>,<span class="num">1</span>,<span class="num">2</span>,<span class="num">5</span>,<span class="num">10</span>,<span class="num">20</span>]):
    sim = (vec.<span class="fn">transform</span>([v]) @ wt_v.T).<span class="fn">toarray</span>().<span class="fn">item</span>()
    <span class="fn">print</span>(f<span class="str">"  mutations={n:2d}  proxy-fitness (cosine to wt) = {sim:.3f}"</span>)
</code></pre></div>

<p class="l-text">Mutasyonlar biriktikçe vekil-uygunluğumuz monoton olarak düşer — iyi bir uygunluk modelinin yapması gereken şey. ESM-1v'in sözde-olabilirliği bunu gerçek DMS (Deep Mutational Scanning) veri kümelerinde yapar ve EVE gibi uzman-küratörlü araçlarla eşleşir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. ESM-3 ve Çok-Modlu Protein LM'leri</h2>
<p class="l-text">ESM-3 (Hayes ve ark., EvolutionaryScale 2024) çok-izli bir formülasyon getirdi: dizi token'ları, yapı token'ları (omurga + yan-zincir burulmaları üzerindeki bir VQ-VAE'den) ve işlev token'ları (GO terimleri, anahtar kelimeler). Üç iz de eğitim sırasında ortak olarak maskelenir; çıkarımda herhangi bir kombinasyonla yönlendirebilirsiniz. "Bu aktif bölgeye sahip ve bu liganda bağlanan bir protein üret" yapılandırılmış bir prompt'a dönüşür.</p>

<div class="calc-highlight"><strong>Manşet demo:</strong> ESM-3, doğal GFP'lere %58 özdeş yeşil floresan bir protein olan esmGFP'yi tasarladı — 500 milyon yıl simüle edilmiş evrime eşdeğer — ve ıslak laboratuvarda gerçekten flüoresan veriyor. Hayes ve ark., Science 2025'te yayımlandı.</div>

<p class="l-text">Mimari: standart transformer, ~98B parametre, üç giriş/çıkış başlığı. Yenilik, tek bir dizi-modelleme yığınının hem diziyi hem yapıyı metin olarak işlemesine izin veren ayrık yapı-token sözcük dağarcığıdır (yerel omurga + yan-zincir konformasyonunu nicelendiren yaklaşık 4096 token). ESM-3-Open (1.4B) halka açık; tam 98B yalnızca API'dir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. NLP Dersleri Aktarılır (Çoğunlukla)</h2>
<p class="l-text">Protein LM'lerinde ve metin LM'lerinde aynı şekilde çalışan şeyler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ölçeklendirme yasaları</div><div class="card-body">Kayıp parametreler ve veride düzgün bir kuvvet yasasıdır. Lin 2022, ESM-2'nin eğrisini gösterdi. Kaplan 2020 / Hoffmann 2022 (Chinchilla) ile aynı şekil.</div></div>
<div class="calc-card"><div class="card-title">Ön-eğit → dondur → doğrusal probe</div><div class="card-body">Dondurulmuş ESM özellikleri + minik başlık, çoğu alt-akış görevi için kazanır. NLP'de NER için BERT'i dondurmakla aynı tarif.</div></div>
<div class="calc-card"><div class="card-title">Talimat ayarlama + RLHF</div><div class="card-body">ESM-3'ün işlev-koşullu üretimi kabaca talimat-ayarlanmış bir protein GPT'sidir. Bu alanı izleyin.</div></div>
<div class="calc-card"><div class="card-title">Farklılıklar</div><div class="card-body">Sözcük dağarcığı küçüktür (metin için 50k yerine 20). Diziler uzundur (2k+ rezidü yaygın). MSA'lar metin-dışı bir veri modalitesi ekler. Token başına hesap, aynı parametre sayısında metin LM'lerinden daha ucuzdur.</div></div>
</div>

<p class="l-text">Protein LM'leri için benzersiz olan şey 3B okumadır — LM tarafından tahmin edilen diziyi katlayın ve yapının anlamlı olup olmadığını kontrol edin. Bu geri besleme döngüsü metinde mevcut değildir. Sonraki ders, veri kümesinin daha da büyük ve dilin daha da basit (4 token — A, C, G, T) olduğu genomiklere geçer.</p>
</div>`
};
