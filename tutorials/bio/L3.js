window.BIO_L3 = {
en: `<p class="l-text"><strong>On 30 November 2020, John Jumper presented AlphaFold 2's CASP14 results.</strong> The median GDT_TS on the hard "Free Modeling" targets was 87 — the previous record was 58. The structural biology community's reaction was, broadly, that the 50-year protein folding problem had been solved well enough that the remaining 5% of cases were not worth a Nobel-prize-magnitude follow-up. Eight months later the Jumper et al. Nature paper appeared, the code was open-sourced, and within a year DeepMind had released predicted structures for all 214 million sequences in UniProt. AlphaFold-EBI ships those today; people were downloading PDBs of human proteins for breakfast.</p>

<p class="l-text">This lesson dissects AF2's architecture (the Evoformer + structure module two-headed beast), then walks forward through ESMFold (Lin 2022) which dropped the MSA dependency, OmegaFold (2022, similar idea), and AlphaFold 3 (Abramson, Adler, Dunger et al., Nature May 2024) which replaced the structure module with a diffusion model and added arbitrary chemistry — small molecules, nucleic acids, ions, and full complexes. By the end you can read an AF2 paper figure and explain every box in it.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Walk the AlphaFold 2 pipeline end-to-end: MSA → Evoformer (48 blocks) → Structure Module (8 blocks) → coords + pLDDT</li>
<li>Explain triangle attention and triangle multiplicative update — the Evoformer's geometry-aware operators</li>
<li>Read pLDDT and PAE plots and decide whether to trust a region of an AF2 prediction</li>
<li>Compare AF2 vs ESMFold: when MSAs help vs when a 15B-parameter language model is enough</li>
<li>Sketch AlphaFold 3's diffusion module and why it generalizes to ligands, DNA/RNA, and ions</li>
<li>Place AlphaProteo (DeepMind 2024) and Boltz-1 (MIT 2024) in the open vs closed AF3-alternative landscape</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The AlphaFold 2 Pipeline at 30,000 Feet</h2>
<p class="l-text">AF2 takes a single sequence as input and produces 3D coordinates for every heavy atom plus a per-residue confidence score. Internally it runs five stages.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. MSA construction</div><div class="card-body">Search UniRef, BFD, MGnify with HHblits and JackHMMER. Output: an MSA of typically thousands of homologs aligned to the query. Slower than the network itself.</div></div>
<div class="calc-card"><div class="card-title">2. Template search</div><div class="card-body">Hits from PDB70 — up to 4 structural templates, used as soft hints. Optional; AF2 works without them.</div></div>
<div class="calc-card"><div class="card-title">3. Evoformer</div><div class="card-body">48 stacked blocks, each updates two tensors: an MSA representation (N_seq × L × c) and a pair representation (L × L × c). This is where coevolution becomes geometry.</div></div>
<div class="calc-card"><div class="card-title">4. Structure Module</div><div class="card-body">8 blocks, each takes the pair representation + first row of the MSA and outputs SE(3)-equivariant updates to per-residue frames (translations + rotations). 3D coordinates appear here.</div></div>
<div class="calc-card"><div class="card-title">5. Recycling + heads</div><div class="card-body">The whole network runs 3 times by default, feeding the previous output back as input. Auxiliary heads predict pLDDT, PAE, distogram, and TM-score.</div></div>
</div>

<div class="calc-highlight"><strong>The two innovations:</strong> (a) the dual MSA + pair representation that flows through 48 blocks of geometry-aware attention, and (b) the structure module's representation of each residue as an SE(3) frame instead of raw coordinates — this is what gives AF2 its rotation/translation equivariance for free.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Evoformer — MSA and Pair, Talking</h2>
<p class="l-text">Inside one Evoformer block, four things happen in sequence: row-wise attention on the MSA (residues attending to each other within one sequence, gated by the pair representation), column-wise attention on the MSA (sequences attending to each other within one column), an outer-product mean that updates the pair representation from the MSA, and finally triangle attention/multiplicative update on the pair representation. The pair representation is the workhorse — it is L × L × 128, basically a learnable contact map.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — official alphafold blocked in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Skeletal forward of one Evoformer block</span>
<span class="kw">import</span> jax.numpy <span class="kw">as</span> jnp
<span class="kw">def</span> <span class="fn">evoformer_block</span>(msa, pair):
    msa  = <span class="fn">row_attn_with_pair_bias</span>(msa, pair) + msa
    msa  = <span class="fn">column_attn</span>(msa) + msa
    pair = <span class="fn">outer_product_mean</span>(msa) + pair
    pair = <span class="fn">triangle_attn_starting</span>(pair) + pair
    pair = <span class="fn">triangle_attn_ending</span>(pair) + pair
    pair = <span class="fn">triangle_mul_outgoing</span>(pair) + pair
    pair = <span class="fn">triangle_mul_incoming</span>(pair) + pair
    <span class="kw">return</span> msa, pair
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy single-block Evoformer: row attention biased by the pair representation, then a triangle-style pair update. Same shapes, scalar attention, no learnable weights — to feel the data flow.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

N, L, c = <span class="num">8</span>, <span class="num">12</span>, <span class="num">4</span>   <span class="cm"># 8 sequences, length 12, 4 channels</span>
msa  = np.random.<span class="fn">randn</span>(N, L, c)
pair = np.random.<span class="fn">randn</span>(L, L, c)

<span class="kw">def</span> <span class="fn">softmax</span>(x, axis=-<span class="num">1</span>):
    x = x - x.<span class="fn">max</span>(axis=axis, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(x); <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=axis, keepdims=<span class="kw">True</span>)

<span class="cm"># Row attention with pair bias (simplified — no heads, no learned QKV)</span>
<span class="kw">def</span> <span class="fn">row_attn_with_pair_bias</span>(msa, pair):
    <span class="cm"># logits[s, i, j] = msa[s,i] . msa[s,j] + pair[i,j].mean()</span>
    logits = np.<span class="fn">einsum</span>(<span class="str">'sic,sjc->sij'</span>, msa, msa) + pair.<span class="fn">mean</span>(-<span class="num">1</span>)[<span class="kw">None</span>]
    A = <span class="fn">softmax</span>(logits, axis=-<span class="num">1</span>)
    <span class="kw">return</span> np.<span class="fn">einsum</span>(<span class="str">'sij,sjc->sic'</span>, A, msa)

<span class="cm"># Triangle multiplicative update (outgoing): pair[i,j] += sum_k pair[i,k] * pair[j,k]</span>
<span class="kw">def</span> <span class="fn">triangle_mul</span>(pair):
    <span class="kw">return</span> np.<span class="fn">einsum</span>(<span class="str">'ikc,jkc->ijc'</span>, pair, pair) / pair.shape[<span class="num">0</span>]

msa  = msa + <span class="fn">row_attn_with_pair_bias</span>(msa, pair)
pair = pair + <span class="fn">triangle_mul</span>(pair)
<span class="fn">print</span>(<span class="str">"MSA shape :"</span>, msa.shape, <span class="str">" stats:"</span>, <span class="fn">round</span>(msa.<span class="fn">mean</span>(),<span class="num">3</span>), <span class="fn">round</span>(msa.<span class="fn">std</span>(),<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Pair shape:"</span>, pair.shape, <span class="str">" stats:"</span>, <span class="fn">round</span>(pair.<span class="fn">mean</span>(),<span class="num">3</span>), <span class="fn">round</span>(pair.<span class="fn">std</span>(),<span class="num">3</span>))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Why "Triangle" Attention?</h2>
<p class="l-text">For three residues i, j, k, the triangle inequality on distances must hold: d(i,j) ≤ d(i,k) + d(k,j). The pair representation should respect this constraint — if i is close to k and k is close to j, then i should be close-ish to j. Triangle attention enforces this by making the update at (i, j) depend on (i, k) and (k, j) for all k, gated by attention. It is geometry baked into the network's inductive bias.</p>

<div class="katex-block">$$\text{pair}_{ij} \mathrel{+}= \sum_k \text{softmax}_k\!\left(q_{ij} \cdot k_{ik} + b_{kj}\right) v_{kj}$$</div>

<p class="l-text">Two flavors: "starting node" attention sums over k holding i fixed; "ending node" sums holding j fixed. Together with two flavors of triangle multiplicative update (outgoing and incoming) they form the four geometry operators that distinguish Evoformer from a vanilla transformer.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Structure Module — From Pair to 3D</h2>
<p class="l-text">After 48 Evoformer blocks, the structure module turns the pair representation into actual coordinates. Each residue is represented as a rigid frame — a 3×3 rotation R_i plus a translation t_i — defined by its N, Cα, C atoms. Eight blocks of "Invariant Point Attention" (IPA) update these frames. IPA is attention where the queries, keys, and values include 3D points expressed in each residue's local frame; this makes the operation SE(3)-equivariant — rotate the input, the output rotates the same way.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
L = <span class="num">16</span>

<span class="cm"># Initialize all frames at the origin with identity rotation ("black hole init")</span>
frames_R = np.<span class="fn">tile</span>(np.<span class="fn">eye</span>(<span class="num">3</span>), (L, <span class="num">1</span>, <span class="num">1</span>))     <span class="cm"># (L, 3, 3)</span>
frames_t = np.<span class="fn">zeros</span>((L, <span class="num">3</span>))                  <span class="cm"># (L, 3)</span>

<span class="cm"># Toy IPA-like update: each residue's translation is pulled toward an attention-weighted mean</span>
pair = np.random.<span class="fn">randn</span>(L, L) * <span class="num">0.5</span>
<span class="kw">for</span> block <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    <span class="cm"># attention from pair representation (softmax over j for each i)</span>
    A = np.<span class="fn">exp</span>(pair - pair.<span class="fn">max</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>))
    A = A / A.<span class="fn">sum</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    <span class="cm"># update translation = previous + small step toward sum_j A[i,j] * t_j</span>
    target = A @ frames_t
    frames_t = frames_t + <span class="num">0.3</span> * (target - frames_t) + <span class="num">0.1</span> * np.random.<span class="fn">randn</span>(L, <span class="num">3</span>)

<span class="fn">print</span>(<span class="str">"Final translations stats:"</span>)
<span class="fn">print</span>(<span class="str">"  mean radius from origin:"</span>, <span class="fn">round</span>(np.linalg.<span class="fn">norm</span>(frames_t, axis=<span class="num">1</span>).<span class="fn">mean</span>(), <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"  pairwise dist [3..6]   :"</span>, <span class="fn">round</span>(np.linalg.<span class="fn">norm</span>(frames_t[<span class="num">3</span>] - frames_t[<span class="num">6</span>]), <span class="num">2</span>))
</code></pre></div>

<p class="l-text">The real IPA also rotates frames and predicts side-chain torsions, and uses a violation loss that penalizes bond-length and clash errors. The end-to-end output is per-atom coordinates plus pLDDT.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Reading pLDDT and PAE</h2>
<p class="l-text">Every AF2 prediction comes with two confidence outputs you must read before trusting it:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">pLDDT (per-residue, 0-100)</div><div class="card-body">Predicted local distance-difference test. &gt;90 very high — backbone correct, side chains usually correct. 70-90 confident backbone. 50-70 low — flexible loops, often disordered. &lt;50 — often <em>predicted</em> disordered, treat as no structure.</div></div>
<div class="calc-card"><div class="card-title">PAE (pairwise, in Å)</div><div class="card-body">Predicted aligned error — for residue pair (i, j), the expected position error of j when i is correctly aligned. Used for "is the relative orientation of these two domains reliable?" Bands of low PAE = a rigid unit; high PAE between domains = unknown relative orientation.</div></div>
<div class="calc-card"><div class="card-title">Confidence in practice</div><div class="card-body">A typical 300-residue protein gets ~80% high-pLDDT residues. The flexible 20% is real biology — disordered tails, flexible linkers — not a model failure. AlphaFold DB color-codes everything blue (high) → orange (low).</div></div>
</div>

<div class="katex-block">$$\text{pLDDT}_i = \mathbb{E}[\text{lDDT}\text{-}C\alpha_i] \in [0, 100]$$</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ESMFold — When You Drop the MSA</h2>
<p class="l-text">AF2's slowest step is MSA construction — minutes per sequence. Lin et al. (Meta FAIR, Science 2023) trained ESM-2, a 15-billion-parameter masked language model on 65 million UniRef50 sequences, then plugged its embeddings into a folding head called <em>ESMFold</em>. Result: structure prediction in seconds (no MSA), accuracy ~5 GDT_TS below AF2 on average but much better on orphan proteins where MSAs are tiny. Meta then ran ESMFold on 617 million metagenomic sequences and released the ESM Atlas — orders of magnitude beyond AF2's original UniRef coverage.</p>

<div class="calc-highlight"><strong>The trade:</strong> AF2 needs the MSA — coevolution is its primary signal. ESMFold internalized coevolution into the language model's attention weights during pretraining, so at inference it needs only the sequence. For metagenomics — where most sequences have no homologs — ESMFold is the only option that works at all.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — esm package blocked, requires torch)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, esm
model = esm.pretrained.<span class="fn">esmfold_v1</span>().<span class="fn">eval</span>().<span class="fn">cuda</span>()
seq = <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = model.<span class="fn">infer_pdb</span>(seq)
<span class="kw">with</span> <span class="fn">open</span>(<span class="str">"pred.pdb"</span>, <span class="str">"w"</span>) <span class="kw">as</span> f: f.<span class="fn">write</span>(out)
</code></pre></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. AlphaFold 3 — Diffusion + Everything</h2>
<p class="l-text">AlphaFold 3 (Abramson, Adler, Dunger, Jumper et al., Nature 11 May 2024) replaced the structure module with a <em>diffusion module</em> that denoises 3D coordinates directly, and replaced the rigid "protein only" input with a generic input format that accepts proteins, DNA, RNA, ions, and small molecules — all in one model. AF3 predicts complexes: a kinase + ATP + Mg²⁺, an antibody + antigen, a transcription factor + DNA. This is the breakthrough that turned AlphaFold from a single-protein tool into a structural-biology platform.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pairformer</div><div class="card-body">Lighter cousin of Evoformer — 48 blocks, but no MSA stack (replaced with a single MSA pass and a focus on the pair representation). Same triangle operators.</div></div>
<div class="calc-card"><div class="card-title">Diffusion Module</div><div class="card-body">Predicts atom coordinates by denoising over ~20 steps. Conditioned on Pairformer's pair representation. Replaces the SE(3) structure module entirely. Loss is simply the L2 distance between predicted and true atom coords plus a small smoothness term.</div></div>
<div class="calc-card"><div class="card-title">Token-level inputs</div><div class="card-body">Standard amino acids and nucleotides become 1 token each; small-molecule atoms become 1 token per atom. The same Pairformer + diffusion handles all of them.</div></div>
<div class="calc-card"><div class="card-title">Reported gains</div><div class="card-body">~50% relative improvement on protein–ligand benchmarks (PoseBusters) over previous docking tools. State-of-the-art on protein–protein and protein–nucleic-acid complexes.</div></div>
</div>

<p class="l-text">Catch: AF3 weights are not open-sourced. AlphaFold Server (DeepMind, free for academic use) gives you predictions but not the model. This gap is what motivated Boltz-1 and others.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Toy Diffusion on 3D Coordinates</h2>
<p class="l-text">To feel how a coordinate diffusion model works, here is the simplest possible version: forward process adds Gaussian noise to ground-truth coordinates; reverse process learns to denoise toward them. AF3's full version uses an EDM-style schedule with self-conditioning, but the spine is identical.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Ground-truth: a 20-residue helix in 3D</span>
L = <span class="num">20</span>
t = np.<span class="fn">arange</span>(L)
truth = np.<span class="fn">stack</span>([<span class="num">2.3</span>*np.<span class="fn">cos</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span>*t)), <span class="num">2.3</span>*np.<span class="fn">sin</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span>*t)), <span class="num">1.5</span>*t], axis=<span class="num">1</span>)

<span class="cm"># Forward diffusion: noisy = truth + sigma * eps</span>
T = <span class="num">20</span>
sigmas = np.<span class="fn">linspace</span>(<span class="num">5.0</span>, <span class="num">0.05</span>, T)
x = truth + sigmas[<span class="num">0</span>] * np.random.<span class="fn">randn</span>(*truth.shape)

<span class="cm"># "Denoising" in this toy: blend toward the truth at each step (a perfect oracle denoiser)</span>
<span class="kw">for</span> t_step, sigma <span class="kw">in</span> <span class="fn">enumerate</span>(sigmas):
    pred_clean = truth      <span class="cm"># in real AF3 this is a learned network</span>
    blend = (sigma**<span class="num">2</span>) / (sigma**<span class="num">2</span> + <span class="num">0.5</span>**<span class="num">2</span>)
    x = (<span class="num">1</span> - blend) * x + blend * pred_clean + <span class="num">0.1</span> * np.random.<span class="fn">randn</span>(*x.shape)

err = np.linalg.<span class="fn">norm</span>(x - truth, axis=<span class="num">1</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Final mean atom error: {err:.3f} Å (should be small — oracle denoising)"</span>)
</code></pre></div>

<p class="l-text">In the real AF3, <code>pred_clean</code> is the output of a transformer conditioned on the Pairformer pair representation, and the schedule is the EDM (Karras 2022) one. The diffusion replaces the structure module's IPA stack and unlocks generic chemistry — atoms are atoms.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. The 2024 Open Landscape</h2>
<p class="l-text">AF3 closed weights set off a wave of open replicas in 2024.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boltz-1 (MIT, Nov 2024)</div><div class="card-body">First open-weights AlphaFold-3-class model. Trained on PDB + cofactors, similar Pairformer + diffusion architecture, MIT license. Within ~5% of AF3 on standard benchmarks. Wohlwend et al.</div></div>
<div class="calc-card"><div class="card-title">Chai-1 (Chai Discovery, Sept 2024)</div><div class="card-body">Multi-modal complex prediction — proteins, ligands, nucleic acids. Open weights for non-commercial use. Slightly behind AF3 on PoseBusters.</div></div>
<div class="calc-card"><div class="card-title">RoseTTAFold All-Atom (Baker lab, Krishna 2024 Science)</div><div class="card-body">Baker lab's all-atom version. Less accurate than AF3 on average but tight integration with RFdiffusion (next lesson) for design.</div></div>
<div class="calc-card"><div class="card-title">OmegaFold (2022)</div><div class="card-body">Earlier MSA-free model, similar to ESMFold but with a fold-specific head. Useful for orphan proteins.</div></div>
</div>

<p class="l-text">Practical 2026 advice: use AF2 (open) for routine single-chain predictions; ESMFold for high-throughput or metagenomics; AlphaFold Server (closed AF3) or Boltz-1 (open) for complexes with ligands. The next lesson zooms into the language-model side — ESM-2/3 and the broader protein LLM ecosystem.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. AlphaProteo and the Design Direction</h2>
<p class="l-text">DeepMind's AlphaProteo (Sep 2024) is the inverse problem: given a target protein surface, design a novel binder from scratch. It generates protein sequences that, when folded by AF2, produce a 3D structure complementary to the target. Reported success rates 3-300× higher than physics-based design tools. This closes the loop — AlphaFold solves "sequence → structure", AlphaProteo solves "structure → sequence", and together they enable de novo therapeutic and enzyme design. RFdiffusion (Watson 2023, Baker lab — covered in L6) is the open analog.</p>

<div class="calc-highlight"><strong>Where the field is heading in 2026:</strong> structure prediction is solved enough that the action has moved upstream (to generative protein design — RFdiffusion, AlphaProteo, ProteinMPNN) and downstream (to functional prediction — given a structure, what does it do, where does it bind, how does a mutation change activity). The next lessons cover both branches.</div>
</div>`,
tr: `<p class="l-text"><strong>30 Kasım 2020'de John Jumper, AlphaFold 2'nin CASP14 sonuçlarını sundu.</strong> Zor "Free Modeling" hedeflerinde ortanca GDT_TS 87 idi — önceki rekor 58'di. Yapısal biyoloji topluluğunun tepkisi, geniş çapta, 50 yıllık protein katlanma probleminin geri kalan %5'in Nobel ödülü büyüklüğünde bir takip çalışmasına değmeyecek kadar yeterince çözüldüğü yönündeydi. Sekiz ay sonra Jumper ve arkadaşlarının Nature makalesi çıktı, kod açık kaynak haline getirildi ve bir yıl içinde DeepMind, UniProt'taki tüm 214 milyon dizi için tahmin edilmiş yapıları yayımladı. AlphaFold-EBI bunları bugün sunuyor; insanlar kahvaltıda insan proteinlerinin PDB'lerini indiriyordu.</p>

<p class="l-text">Bu ders AF2'nin mimarisini (Evoformer + structure module çift başlı canavar) inceler, sonra MSA bağımlılığını ortadan kaldıran ESMFold (Lin 2022), OmegaFold (2022, benzer fikir) ve structure module'ü bir difüzyon modeliyle değiştirip rastgele kimya — küçük moleküller, nükleik asitler, iyonlar ve tam kompleksler — ekleyen AlphaFold 3 (Abramson, Adler, Dunger ve ark., Nature Mayıs 2024) üzerinden ileri yürür. Sonuna geldiğinizde bir AF2 makale şeklini okuyup içindeki her kutuyu açıklayabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>AlphaFold 2 hattını uçtan uca yürümek: MSA → Evoformer (48 blok) → Structure Module (8 blok) → koordinatlar + pLDDT</li>
<li>Triangle attention ve triangle multiplicative update'i — Evoformer'ın geometri-bilinçli operatörleri — açıklamak</li>
<li>pLDDT ve PAE grafiklerini okumak ve bir AF2 tahmininin bir bölgesine güvenip güvenilmeyeceğine karar vermek</li>
<li>AF2 ve ESMFold'u karşılaştırmak: MSA'lar ne zaman yardım eder, 15B-parametreli bir dil modeli ne zaman yeterlidir</li>
<li>AlphaFold 3'ün difüzyon modülünü eskizlemek ve neden ligandlara, DNA/RNA'ya ve iyonlara genelleştiğini açıklamak</li>
<li>AlphaProteo'yu (DeepMind 2024) ve Boltz-1'i (MIT 2024) açık ve kapalı AF3-alternatif manzarasında konumlandırmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. AlphaFold 2 Hattı 9000 Metreden</h2>
<p class="l-text">AF2 girdi olarak tek bir dizi alır ve her ağır atom için 3B koordinatlar artı rezidü-başına bir güven skoru üretir. Dahili olarak beş aşamada çalışır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. MSA inşası</div><div class="card-body">UniRef, BFD, MGnify'da HHblits ve JackHMMER ile arama. Çıktı: sorguya hizalanmış genellikle binlerce homolog içeren bir MSA. Ağın kendisinden daha yavaştır.</div></div>
<div class="calc-card"><div class="card-title">2. Şablon araması</div><div class="card-body">PDB70'ten isabetler — 4'e kadar yapısal şablon, yumuşak ipuçları olarak kullanılır. İsteğe bağlıdır; AF2 onlarsız da çalışır.</div></div>
<div class="calc-card"><div class="card-title">3. Evoformer</div><div class="card-body">48 yığılmış blok, her biri iki tensoru günceller: bir MSA temsili (N_seq × L × c) ve bir çift temsili (L × L × c). Ko-evrimin geometriye dönüştüğü yerdir.</div></div>
<div class="calc-card"><div class="card-title">4. Structure Module</div><div class="card-body">8 blok, her biri çift temsili + MSA'nın ilk satırını alır ve rezidü-başına çerçevelere SE(3)-eşvariyant güncellemeler (öteleme + döndürme) çıktılar. 3B koordinatlar burada ortaya çıkar.</div></div>
<div class="calc-card"><div class="card-title">5. Geri-dönüştürme + başlıklar</div><div class="card-body">Tüm ağ varsayılan olarak 3 kez çalışır; önceki çıktıyı girdi olarak geri besler. Yardımcı başlıklar pLDDT, PAE, distogram ve TM-score tahmin eder.</div></div>
</div>

<div class="calc-highlight"><strong>İki yenilik:</strong> (a) 48 blok geometri-bilinçli dikkatten geçen ikili MSA + çift temsili ve (b) structure module'un her rezidüyü ham koordinatlar yerine SE(3) çerçevesi olarak temsil etmesi — AF2'ye döndürme/öteleme eşvariyantını bedavaya veren şey budur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Evoformer — MSA ve Çift, Konuşuyor</h2>
<p class="l-text">Bir Evoformer bloğunun içinde dört şey sırayla olur: MSA üzerinde satır-bazlı dikkat (rezidülerin tek bir dizi içinde birbirine dikkat etmesi, çift temsiliyle modüle edilmiş), MSA üzerinde sütun-bazlı dikkat (dizilerin tek bir sütun içinde birbirine dikkat etmesi), çift temsilini MSA'dan güncelleyen bir outer-product mean ve son olarak çift temsili üzerinde triangle attention/multiplicative update. Çift temsili iş atıdır — L × L × 128, temelde öğrenilebilir bir temas haritası.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — resmi alphafold Pyodide'de bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Skeletal forward of one Evoformer block</span>
<span class="kw">import</span> jax.numpy <span class="kw">as</span> jnp
<span class="kw">def</span> <span class="fn">evoformer_block</span>(msa, pair):
    msa  = <span class="fn">row_attn_with_pair_bias</span>(msa, pair) + msa
    msa  = <span class="fn">column_attn</span>(msa) + msa
    pair = <span class="fn">outer_product_mean</span>(msa) + pair
    pair = <span class="fn">triangle_attn_starting</span>(pair) + pair
    pair = <span class="fn">triangle_attn_ending</span>(pair) + pair
    pair = <span class="fn">triangle_mul_outgoing</span>(pair) + pair
    pair = <span class="fn">triangle_mul_incoming</span>(pair) + pair
    <span class="kw">return</span> msa, pair
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak tek-blok Evoformer: çift temsili tarafından modüle edilen satır dikkati, ardından bir triangle-tarzı çift güncellemesi. Aynı şekiller, skaler dikkat, öğrenilebilir ağırlık yok — veri akışını hissetmek için.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

N, L, c = <span class="num">8</span>, <span class="num">12</span>, <span class="num">4</span>   <span class="cm"># 8 sequences, length 12, 4 channels</span>
msa  = np.random.<span class="fn">randn</span>(N, L, c)
pair = np.random.<span class="fn">randn</span>(L, L, c)

<span class="kw">def</span> <span class="fn">softmax</span>(x, axis=-<span class="num">1</span>):
    x = x - x.<span class="fn">max</span>(axis=axis, keepdims=<span class="kw">True</span>)
    e = np.<span class="fn">exp</span>(x); <span class="kw">return</span> e / e.<span class="fn">sum</span>(axis=axis, keepdims=<span class="kw">True</span>)

<span class="cm"># Row attention with pair bias (simplified — no heads, no learned QKV)</span>
<span class="kw">def</span> <span class="fn">row_attn_with_pair_bias</span>(msa, pair):
    <span class="cm"># logits[s, i, j] = msa[s,i] . msa[s,j] + pair[i,j].mean()</span>
    logits = np.<span class="fn">einsum</span>(<span class="str">'sic,sjc->sij'</span>, msa, msa) + pair.<span class="fn">mean</span>(-<span class="num">1</span>)[<span class="kw">None</span>]
    A = <span class="fn">softmax</span>(logits, axis=-<span class="num">1</span>)
    <span class="kw">return</span> np.<span class="fn">einsum</span>(<span class="str">'sij,sjc->sic'</span>, A, msa)

<span class="cm"># Triangle multiplicative update (outgoing): pair[i,j] += sum_k pair[i,k] * pair[j,k]</span>
<span class="kw">def</span> <span class="fn">triangle_mul</span>(pair):
    <span class="kw">return</span> np.<span class="fn">einsum</span>(<span class="str">'ikc,jkc->ijc'</span>, pair, pair) / pair.shape[<span class="num">0</span>]

msa  = msa + <span class="fn">row_attn_with_pair_bias</span>(msa, pair)
pair = pair + <span class="fn">triangle_mul</span>(pair)
<span class="fn">print</span>(<span class="str">"MSA shape :"</span>, msa.shape, <span class="str">" stats:"</span>, <span class="fn">round</span>(msa.<span class="fn">mean</span>(),<span class="num">3</span>), <span class="fn">round</span>(msa.<span class="fn">std</span>(),<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Pair shape:"</span>, pair.shape, <span class="str">" stats:"</span>, <span class="fn">round</span>(pair.<span class="fn">mean</span>(),<span class="num">3</span>), <span class="fn">round</span>(pair.<span class="fn">std</span>(),<span class="num">3</span>))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Neden "Triangle" Attention?</h2>
<p class="l-text">Üç rezidü i, j, k için mesafelerde üçgen eşitsizliği tutmalıdır: d(i,j) ≤ d(i,k) + d(k,j). Çift temsili bu kısıtı karşılamalıdır — i, k'ye yakınsa ve k, j'ye yakınsa, i de j'ye yakın olmalıdır. Triangle attention, (i, j) güncellemesini her k için (i, k) ve (k, j)'ye bağımlı yaparak ve dikkatle modüle ederek bunu zorunlu kılar. Geometri, ağın tümevarımsal önyargısının içine pişirilmiştir.</p>

<div class="katex-block">$$\text{pair}_{ij} \mathrel{+}= \sum_k \text{softmax}_k\!\left(q_{ij} \cdot k_{ik} + b_{kj}\right) v_{kj}$$</div>

<p class="l-text">İki tat: "starting node" dikkati i'yi sabit tutarak k üzerinden toplar; "ending node" j'yi sabit tutarak toplar. İki tat triangle multiplicative update (outgoing ve incoming) ile birlikte, Evoformer'ı vanilya transformer'dan ayıran dört geometri operatörünü oluşturur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Structure Module — Çiftten 3B'ye</h2>
<p class="l-text">48 Evoformer bloğundan sonra structure module çift temsilini gerçek koordinatlara dönüştürür. Her rezidü, N, Cα, C atomları tarafından tanımlanan bir rijit çerçeve olarak — bir 3×3 dönme R_i artı bir öteleme t_i — temsil edilir. Sekiz "Invariant Point Attention" (IPA) bloğu bu çerçeveleri günceller. IPA, sorguların, anahtarların ve değerlerin her rezidünün yerel çerçevesinde ifade edilen 3B noktaları içerdiği bir dikkattir; bu işlem SE(3)-eşvariyantlıdır — girdiyi döndürün, çıktı aynı şekilde döner.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
L = <span class="num">16</span>

<span class="cm"># Initialize all frames at the origin with identity rotation ("black hole init")</span>
frames_R = np.<span class="fn">tile</span>(np.<span class="fn">eye</span>(<span class="num">3</span>), (L, <span class="num">1</span>, <span class="num">1</span>))     <span class="cm"># (L, 3, 3)</span>
frames_t = np.<span class="fn">zeros</span>((L, <span class="num">3</span>))                  <span class="cm"># (L, 3)</span>

<span class="cm"># Toy IPA-like update: each residue's translation is pulled toward an attention-weighted mean</span>
pair = np.random.<span class="fn">randn</span>(L, L) * <span class="num">0.5</span>
<span class="kw">for</span> block <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    <span class="cm"># attention from pair representation (softmax over j for each i)</span>
    A = np.<span class="fn">exp</span>(pair - pair.<span class="fn">max</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>))
    A = A / A.<span class="fn">sum</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    <span class="cm"># update translation = previous + small step toward sum_j A[i,j] * t_j</span>
    target = A @ frames_t
    frames_t = frames_t + <span class="num">0.3</span> * (target - frames_t) + <span class="num">0.1</span> * np.random.<span class="fn">randn</span>(L, <span class="num">3</span>)

<span class="fn">print</span>(<span class="str">"Final translations stats:"</span>)
<span class="fn">print</span>(<span class="str">"  mean radius from origin:"</span>, <span class="fn">round</span>(np.linalg.<span class="fn">norm</span>(frames_t, axis=<span class="num">1</span>).<span class="fn">mean</span>(), <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"  pairwise dist [3..6]   :"</span>, <span class="fn">round</span>(np.linalg.<span class="fn">norm</span>(frames_t[<span class="num">3</span>] - frames_t[<span class="num">6</span>]), <span class="num">2</span>))
</code></pre></div>

<p class="l-text">Gerçek IPA ayrıca çerçeveleri döndürür ve yan-zincir burulmalarını tahmin eder ve bağ-uzunluğu ile çakışma hatalarını cezalandıran bir ihlal kaybı kullanır. Uçtan uca çıktı atom-başına koordinatlar artı pLDDT'dir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. pLDDT ve PAE Okuma</h2>
<p class="l-text">Her AF2 tahmini, ona güvenmeden önce okumanız gereken iki güven çıktısı ile gelir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">pLDDT (rezidü-başına, 0-100)</div><div class="card-body">Tahmini yerel mesafe-fark testi. &gt;90 çok yüksek — omurga doğrudur, yan zincirler genellikle doğrudur. 70-90 güvenli omurga. 50-70 düşük — esnek halkalar, sıklıkla düzensiz. &lt;50 — sıklıkla <em>tahmini</em> düzensiz, yapı yokmuş gibi davranın.</div></div>
<div class="calc-card"><div class="card-title">PAE (ikili, Å cinsinden)</div><div class="card-body">Tahmini hizalı hata — (i, j) rezidü çifti için, i doğru hizalandığında j'nin beklenen pozisyon hatası. "Bu iki alanın bağıl yönelimi güvenilir mi?" için kullanılır. Düşük PAE bantları = bir rijit birim; alanlar arasında yüksek PAE = bilinmeyen bağıl yönelim.</div></div>
<div class="calc-card"><div class="card-title">Pratikte güven</div><div class="card-body">Tipik 300 rezidülü bir protein ~%80 yüksek-pLDDT rezidü alır. Esnek %20, gerçek biyolojidir — düzensiz kuyruklar, esnek bağlayıcılar — model başarısızlığı değildir. AlphaFold DB her şeyi mavi (yüksek) → turuncu (düşük) renk-kodlar.</div></div>
</div>

<div class="katex-block">$$\text{pLDDT}_i = \mathbb{E}[\text{lDDT}\text{-}C\alpha_i] \in [0, 100]$$</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ESMFold — MSA'yı Bıraktığınızda</h2>
<p class="l-text">AF2'nin en yavaş adımı MSA inşasıdır — dizi başına dakikalar. Lin ve ark. (Meta FAIR, Science 2023), 65 milyon UniRef50 dizisi üzerinde 15-milyar-parametreli maskelenmiş bir dil modeli olan ESM-2'yi eğitti, ardından gömmelerini <em>ESMFold</em> adı verilen bir katlama başlığına bağladı. Sonuç: saniyeler içinde yapı tahmini (MSA yok), ortalama AF2'nin altında ~5 GDT_TS doğruluk, ancak MSA'ların küçük olduğu yetim proteinlerde çok daha iyi. Meta sonra ESMFold'u 617 milyon metagenomik dizide çalıştırdı ve ESM Atlas'ı yayımladı — AF2'nin orijinal UniRef kapsamının çok ötesinde.</p>

<div class="calc-highlight"><strong>Takas:</strong> AF2'ye MSA gerekir — ko-evrim onun birincil sinyalidir. ESMFold, ko-evrimi ön eğitim sırasında dil modelinin dikkat ağırlıklarına dahili olarak almıştır, bu yüzden çıkarımda yalnızca diziye ihtiyacı vardır. Çoğu dizinin homologu olmayan metagenomikler için, ESMFold çalışan tek seçenektir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — esm paketi bloke, torch gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, esm
model = esm.pretrained.<span class="fn">esmfold_v1</span>().<span class="fn">eval</span>().<span class="fn">cuda</span>()
seq = <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>
<span class="kw">with</span> torch.<span class="fn">no_grad</span>():
    out = model.<span class="fn">infer_pdb</span>(seq)
<span class="kw">with</span> <span class="fn">open</span>(<span class="str">"pred.pdb"</span>, <span class="str">"w"</span>) <span class="kw">as</span> f: f.<span class="fn">write</span>(out)
</code></pre></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. AlphaFold 3 — Difüzyon + Her Şey</h2>
<p class="l-text">AlphaFold 3 (Abramson, Adler, Dunger, Jumper ve ark., Nature 11 Mayıs 2024) structure module'u doğrudan 3B koordinatları gürültüden arındıran bir <em>difüzyon modülü</em> ile değiştirdi ve rijit "yalnızca protein" girdisini, proteinleri, DNA'yı, RNA'yı, iyonları ve küçük molekülleri kabul eden genel bir girdi formatı ile değiştirdi — hepsi tek modelde. AF3 kompleksleri tahmin eder: bir kinaz + ATP + Mg²⁺, bir antikor + antijen, bir transkripsiyon faktörü + DNA. Bu, AlphaFold'u tek protein aracından bir yapısal-biyoloji platformuna dönüştüren atılımdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pairformer</div><div class="card-body">Evoformer'ın daha hafif kuzeni — 48 blok, ancak MSA yığını yok (tek bir MSA geçişi ile değiştirilmiş ve çift temsiline odaklanılmış). Aynı triangle operatörler.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon Modülü</div><div class="card-body">Atom koordinatlarını ~20 adımda gürültüden arındırarak tahmin eder. Pairformer'ın çift temsili ile koşullandırılır. SE(3) structure module'u tamamen değiştirir. Kayıp yalnızca tahmin edilen ve gerçek atom koordinatları arasındaki L2 mesafesi artı küçük bir düzgünlük terimidir.</div></div>
<div class="calc-card"><div class="card-title">Token-seviyesinde girdiler</div><div class="card-body">Standart amino asitler ve nükleotidler 1 token olur; küçük-molekül atomları atom başına 1 token olur. Aynı Pairformer + difüzyon hepsini işler.</div></div>
<div class="calc-card"><div class="card-title">Raporlanan kazanımlar</div><div class="card-body">Önceki yerleştirme araçlarına göre protein–ligand kıyaslamalarında (PoseBusters) ~%50 göreceli iyileşme. Protein–protein ve protein–nükleik-asit komplekslerinde son teknoloji.</div></div>
</div>

<p class="l-text">Yakalama: AF3 ağırlıkları açık kaynak değil. AlphaFold Server (DeepMind, akademik kullanım için ücretsiz) size tahmin verir ama modeli vermez. Bu boşluk, Boltz-1 ve diğerlerini motive eden şeydir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 3B Koordinatlar Üzerinde Oyuncak Difüzyon</h2>
<p class="l-text">Bir koordinat difüzyon modelinin nasıl çalıştığını hissetmek için, en basit olası sürüm: ileri süreç gerçek koordinatlara Gauss gürültüsü ekler; geri süreç onlara doğru gürültüden arındırmayı öğrenir. AF3'ün tam sürümü kendi-koşullandırma ile EDM-tarzı bir program kullanır, ancak omurga aynıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Ground-truth: a 20-residue helix in 3D</span>
L = <span class="num">20</span>
t = np.<span class="fn">arange</span>(L)
truth = np.<span class="fn">stack</span>([<span class="num">2.3</span>*np.<span class="fn">cos</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span>*t)), <span class="num">2.3</span>*np.<span class="fn">sin</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span>*t)), <span class="num">1.5</span>*t], axis=<span class="num">1</span>)

<span class="cm"># Forward diffusion: noisy = truth + sigma * eps</span>
T = <span class="num">20</span>
sigmas = np.<span class="fn">linspace</span>(<span class="num">5.0</span>, <span class="num">0.05</span>, T)
x = truth + sigmas[<span class="num">0</span>] * np.random.<span class="fn">randn</span>(*truth.shape)

<span class="cm"># "Denoising" in this toy: blend toward the truth at each step (a perfect oracle denoiser)</span>
<span class="kw">for</span> t_step, sigma <span class="kw">in</span> <span class="fn">enumerate</span>(sigmas):
    pred_clean = truth      <span class="cm"># in real AF3 this is a learned network</span>
    blend = (sigma**<span class="num">2</span>) / (sigma**<span class="num">2</span> + <span class="num">0.5</span>**<span class="num">2</span>)
    x = (<span class="num">1</span> - blend) * x + blend * pred_clean + <span class="num">0.1</span> * np.random.<span class="fn">randn</span>(*x.shape)

err = np.linalg.<span class="fn">norm</span>(x - truth, axis=<span class="num">1</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Final mean atom error: {err:.3f} Å (should be small — oracle denoising)"</span>)
</code></pre></div>

<p class="l-text">Gerçek AF3'te <code>pred_clean</code>, Pairformer'ın çift temsili ile koşullandırılan bir transformer'ın çıktısıdır ve program EDM (Karras 2022) programıdır. Difüzyon, structure module'un IPA yığınını yerine geçer ve genel kimyayı açar — atomlar atomdur.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. 2024 Açık Manzara</h2>
<p class="l-text">AF3'ün kapalı ağırlıkları 2024'te bir açık replika dalgası başlattı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boltz-1 (MIT, Kasım 2024)</div><div class="card-body">İlk açık-ağırlıklı AlphaFold-3-sınıfı model. PDB + kofaktörler üzerinde eğitildi, benzer Pairformer + difüzyon mimarisi, MIT lisansı. Standart kıyaslamalarda AF3'ün ~%5 içinde. Wohlwend ve ark.</div></div>
<div class="calc-card"><div class="card-title">Chai-1 (Chai Discovery, Eylül 2024)</div><div class="card-body">Çok-modlu kompleks tahmini — proteinler, ligandlar, nükleik asitler. Ticari olmayan kullanım için açık ağırlıklar. PoseBusters'da AF3'ün biraz gerisinde.</div></div>
<div class="calc-card"><div class="card-title">RoseTTAFold All-Atom (Baker laboratuvarı, Krishna 2024 Science)</div><div class="card-body">Baker laboratuvarının tüm-atom sürümü. Ortalama olarak AF3'ten daha az doğru ama tasarım için RFdiffusion (sonraki ders) ile sıkı entegrasyon.</div></div>
<div class="calc-card"><div class="card-title">OmegaFold (2022)</div><div class="card-body">Daha önceki MSA-bağımsız model, ESMFold'a benzer ama katlanmaya özgü bir başlık ile. Yetim proteinler için yararlı.</div></div>
</div>

<p class="l-text">Pratik 2026 tavsiyesi: rutin tek-zincirli tahminler için AF2 (açık) kullanın; yüksek hızlı veya metagenomikler için ESMFold; ligand içeren kompleksler için AlphaFold Server (kapalı AF3) veya Boltz-1 (açık) kullanın. Sonraki ders dil-modeli tarafına yakınlaşır — ESM-2/3 ve daha geniş protein LLM ekosistemi.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. AlphaProteo ve Tasarım Yönü</h2>
<p class="l-text">DeepMind'ın AlphaProteo'su (Eylül 2024) ters problemi çözer: bir hedef protein yüzeyi verildiğinde, sıfırdan yeni bir bağlayıcı tasarla. AF2 tarafından katlandığında hedefe tamamlayıcı bir 3B yapı üreten protein dizileri oluşturur. Fizik-tabanlı tasarım araçlarına göre 3-300× daha yüksek başarı oranları rapor edilir. Bu döngüyü kapatır — AlphaFold "dizi → yapı" çözer, AlphaProteo "yapı → dizi" çözer ve birlikte de novo terapötik ve enzim tasarımına olanak tanırlar. RFdiffusion (Watson 2023, Baker laboratuvarı — L6'da ele alınıyor) açık analoğudur.</p>

<div class="calc-highlight"><strong>Alanın 2026'da gittiği yer:</strong> yapı tahmini yeterince çözüldü, eylem yukarı tarafa (üretken protein tasarımına — RFdiffusion, AlphaProteo, ProteinMPNN) ve aşağı tarafa (işlevsel tahmine — bir yapı verildiğinde ne yapar, nereye bağlanır, bir mutasyon aktiviteyi nasıl değiştirir) kaydı. Sonraki dersler her iki dalı da kapsar.</div>
</div>`
};
