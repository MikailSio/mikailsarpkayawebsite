window.BIO_L6 = {
en: `<p class="l-text"><strong>Drug discovery is, at its core, a matchmaking problem.</strong> A target protein has a binding pocket. A drug is a small molecule that fits into the pocket, with the right hydrogen bonds, hydrophobic contacts, and shape. Find the right molecule and you have a candidate drug; the wrong one and you have a side effect. The traditional pipeline takes 10-15 years and ~$2 billion per approved drug. AlphaFold-Multimer (2021), RFdiffusion (Watson et al., Nature 2023), AlphaProteo (DeepMind 2024), and Boltz-1 (MIT 2024) are collectively the moment AI started compressing that timeline — by predicting structure, by generating novel binders, and by scoring drug-target interactions end-to-end.</p>

<p class="l-text">This capstone lesson assembles the full stack. We define drug-target interaction (DTI) prediction and small-molecule representation (SMILES strings, molecular fingerprints, graph neural nets). We build a working DTI model: protein TF-IDF embeddings (proxy for ESM) plus SMILES character-level TF-IDF embeddings, joined by cross-attention, trained on synthetic affinity labels — the architecture is the same as DeepDTA (Öztürk 2018), MolTrans (Huang 2021), and modern transformer-based predictors. We then survey the design side: AlphaFold-Multimer for complex prediction, RFdiffusion for de novo binder design, AlphaProteo for protein-protein interfaces, and Boltz-1 as the open AlphaFold-3 alternative. Eight tracks of bioinformatics + AI close into one pipeline.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Represent small molecules with SMILES, ECFP fingerprints, and molecular graphs</li>
<li>Build a working DTI model — protein-side TF-IDF + ligand-side TF-IDF + cross-attention head — in pure sklearn</li>
<li>Read PoseBusters and DAVIS benchmarks: what state-of-the-art means for drug-target prediction in 2026</li>
<li>Sketch RFdiffusion (Baker lab 2023) and explain why coordinate diffusion enables protein design</li>
<li>Compare AlphaFold-Multimer, AlphaProteo, AlphaFold 3, Boltz-1, Chai-1 — the protein-complex landscape</li>
<li>Wire all six lessons into a single end-to-end pipeline: sequence → structure → embedding → drug-target → designed molecule</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Drug Discovery Pipeline (and Where AI Slots In)</h2>
<p class="l-text">The classical drug-discovery pipeline has six stages. Each used to take years; AI is collapsing the early ones first.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Target identification</div><div class="card-body">"Which protein, if drugged, would treat the disease?" Genomics + transcriptomics + literature mining. AI: pathway analysis, knowledge graphs (BioBERT, GenomeLLM).</div></div>
<div class="calc-card"><div class="card-title">2. Target validation + structure</div><div class="card-body">Solve the target's structure. Used to need crystallography. Now: AlphaFold 2/3 in seconds.</div></div>
<div class="calc-card"><div class="card-title">3. Hit discovery</div><div class="card-body">Find molecules that bind. Used to be high-throughput screening of 10⁶ compounds. Now: virtual screening of 10¹⁰ via DTI models, generative models (REINVENT, MolGPT), and active-learning loops.</div></div>
<div class="calc-card"><div class="card-title">4. Lead optimization</div><div class="card-body">Tune potency, ADMET (absorption, distribution, metabolism, excretion, toxicity). AI: ChemProp, free-energy perturbation with ML potentials (Equinor's NequIP, MACE), generative chemistry.</div></div>
<div class="calc-card"><div class="card-title">5. Preclinical</div><div class="card-body">Animal trials. AI helps with toxicity prediction (DeepTox, AnimalGPT) but the wet-lab core is unchanged.</div></div>
<div class="calc-card"><div class="card-title">6. Clinical trials</div><div class="card-body">Phase I/II/III. AI: patient stratification, synthetic control arms, trial design optimization.</div></div>
</div>

<div class="calc-highlight"><strong>The 2026 reality:</strong> stages 2 and 3 are largely AI-driven now. Insilico Medicine's INS018_055 entered Phase II as the first end-to-end-AI-designed drug (2024). Isomorphic Labs (DeepMind spinout) signed multi-billion-dollar deals with Novartis and Eli Lilly. The bottleneck has moved from "find a candidate" to "validate it in living systems".</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Representing Small Molecules</h2>
<p class="l-text">A small molecule (typical drug-like, &lt;500 Daltons, ~30 heavy atoms) needs a machine-readable form. Three standards.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SMILES (Weininger 1988)</div><div class="card-body">Strings: aspirin = <code>CC(=O)Oc1ccccc1C(=O)O</code>. Atoms as letters, bonds implicit, branches in parentheses, rings via numbered closures, aromaticity in lowercase. Used by every cheminformatics tool — ChEMBL, PubChem, RDKit.</div></div>
<div class="calc-card"><div class="card-title">ECFP fingerprints (Rogers 2010)</div><div class="card-body">Bit vector (typically 1024 or 2048 bits) where each bit represents the presence of a circular substructure of radius 2. Computed by RDKit's <code>Chem.GetMorganFingerprintAsBitVect</code>. Cheap, robust, the universal cheminformatics baseline.</div></div>
<div class="calc-card"><div class="card-title">Molecular graphs</div><div class="card-body">Atoms as nodes, bonds as edges. Featurized for graph neural networks. ChemProp (Yang 2019), MEGNet, DimeNet++ all use this. State-of-the-art for property prediction.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — RDKit blocked in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> rdkit <span class="kw">import</span> Chem
<span class="kw">from</span> rdkit.Chem <span class="kw">import</span> AllChem
mol = Chem.<span class="fn">MolFromSmiles</span>(<span class="str">"CC(=O)Oc1ccccc1C(=O)O"</span>)  <span class="cm"># aspirin</span>
fp = AllChem.<span class="fn">GetMorganFingerprintAsBitVect</span>(mol, radius=<span class="num">2</span>, nBits=<span class="num">1024</span>)
<span class="fn">print</span>(<span class="str">"Aspirin: 1024-bit ECFP4 fingerprint, on-bits ="</span>, <span class="fn">sum</span>(fp))
<span class="fn">print</span>(<span class="str">"Heavy atoms:"</span>, mol.<span class="fn">GetNumHeavyAtoms</span>())
</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SMILES TF-IDF — A Cheminformatics Surrogate</h2>
<p class="l-text">Without RDKit we can still get a usable molecular representation: character-level n-grams over SMILES strings, vectorized with TF-IDF. This recovers most of the structural similarity signal that ECFP captures, at the cost of being a bit fuzzier on stereochemistry.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

drugs = {
    <span class="str">"aspirin"</span>     : <span class="str">"CC(=O)Oc1ccccc1C(=O)O"</span>,
    <span class="str">"ibuprofen"</span>   : <span class="str">"CC(C)Cc1ccc(C(C)C(=O)O)cc1"</span>,
    <span class="str">"paracetamol"</span> : <span class="str">"CC(=O)Nc1ccc(O)cc1"</span>,
    <span class="str">"caffeine"</span>    : <span class="str">"Cn1cnc2c1c(=O)n(C)c(=O)n2C"</span>,
    <span class="str">"morphine"</span>    : <span class="str">"CN1CCC23C4Oc5c(O)ccc(C4)c25CCC3C1"</span>,
    <span class="str">"salicylic"</span>   : <span class="str">"OC(=O)c1ccccc1O"</span>,         <span class="cm"># close cousin of aspirin</span>
}
names, smiles = <span class="fn">list</span>(drugs.<span class="fn">keys</span>()), <span class="fn">list</span>(drugs.<span class="fn">values</span>())

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">2</span>, <span class="num">4</span>))
X = vec.<span class="fn">fit_transform</span>(smiles)
sim = <span class="fn">cosine_similarity</span>(X)
<span class="fn">print</span>(f<span class="str">"Aspirin vs salicylic acid: {sim[0,5]:.3f}  (chemical cousins, should be high)"</span>)
<span class="fn">print</span>(f<span class="str">"Aspirin vs caffeine      : {sim[0,3]:.3f}  (unrelated, should be low)"</span>)
<span class="fn">print</span>(f<span class="str">"Embedding dimension: {X.shape[1]} char-n-grams"</span>)
</code></pre></div>

<p class="l-text">Aspirin and salicylic acid (its hydrolysis product) score high; aspirin and caffeine score low. ECFP would do this slightly better, but the TF-IDF baseline is enough to build a working DTI pipeline.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Drug-Target Interaction — The Architecture</h2>
<p class="l-text">A modern DTI model has three parts: a protein encoder (ESM-2, ProtBERT, or just k-mer TF-IDF), a ligand encoder (ChemBERTa, MolFormer, or SMILES TF-IDF), and a cross-attention head that produces an affinity prediction (regression) or a binding probability (classification). Datasets: DAVIS (kinase inhibitors, 442 proteins × 68 ligands), KIBA (Kinase Inhibitor BioActivity, 229k pairs), BindingDB (2M+ pairs).</p>

<div class="katex-block">$$\hat y = \sigma\!\left( W_o \cdot \text{CrossAttn}\big(h_{\text{prot}},\, h_{\text{lig}}\big) \right)$$</div>

<p class="l-text">Cross-attention here means queries from the protein attend to keys/values from the ligand and vice versa, producing a fused representation. DeepDTA (Öztürk 2018) used 1D convolutions; MolTrans (Huang 2021) used full transformer cross-attention; the 2024 frontier (BiomedGPT, BioMedLM) uses an LLM backbone.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Building a DTI Model in sklearn</h2>
<p class="l-text">Here is the same architecture in 50 lines: TF-IDF on protein 3-mers, TF-IDF on SMILES char-n-grams, fused by element-wise product (a stand-in for cross-attention), and a logistic regression on top. Trained on synthetic affinity labels where we know the right answer.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> hstack
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Synthetic universe: 30 proteins × 40 ligands = 1200 pairs</span>
proteins = []
prototypes = {
    <span class="str">"kinase"</span>:   <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>,
    <span class="str">"gpcr"</span>:     <span class="str">"MKLILLAAFCLLSAAQLPLDPVAGGAYANRTMNFGAVPVSAYNQTRRWEEAA"</span>,
    <span class="str">"protease"</span>: <span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAARYAQEEMSAFLNTLHAYREQK"</span>,
}
fam_labels_p = []
aa = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)
<span class="kw">for</span> fam, proto <span class="kw">in</span> prototypes.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
        s = <span class="fn">list</span>(proto)
        <span class="kw">for</span> j <span class="kw">in</span> np.random.<span class="fn">choice</span>(<span class="fn">len</span>(s), size=<span class="num">4</span>, replace=<span class="kw">False</span>):
            s[j] = np.random.<span class="fn">choice</span>(aa)
        proteins.<span class="fn">append</span>(<span class="str">''</span>.<span class="fn">join</span>(s)); fam_labels_p.<span class="fn">append</span>(fam)

ligands = []
lig_protos = {
    <span class="str">"kinase"</span>:   <span class="str">"Cc1ccc(Nc2ncc(F)c(Nc3ccc(N4CCN(C)CC4)cc3)n2)cc1"</span>,
    <span class="str">"gpcr"</span>:     <span class="str">"CC(C)NCC(O)c1ccc(O)c(O)c1"</span>,
    <span class="str">"protease"</span>: <span class="str">"CC(=O)NC(Cc1ccc(O)cc1)C(=O)NC(CO)C(=O)O"</span>,
}
fam_labels_l = []
chars = <span class="fn">list</span>(<span class="str">"CcNnOoSsPpFlBr()[]=#1234567890"</span>)
<span class="kw">for</span> fam, proto <span class="kw">in</span> lig_protos.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">13</span>):
        s = <span class="fn">list</span>(proto)
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
            j = np.random.<span class="fn">randint</span>(<span class="fn">len</span>(s))
            s[j] = np.random.<span class="fn">choice</span>(chars)
        ligands.<span class="fn">append</span>(<span class="str">''</span>.<span class="fn">join</span>(s)); fam_labels_l.<span class="fn">append</span>(fam)
ligands.<span class="fn">append</span>(lig_protos[<span class="str">"kinase"</span>]); fam_labels_l.<span class="fn">append</span>(<span class="str">"kinase"</span>)  <span class="cm"># round to 40</span>

<span class="cm"># Encode</span>
<span class="kw">def</span> <span class="fn">kmer</span>(s, k): <span class="kw">return</span> <span class="str">' '</span>.<span class="fn">join</span>(s[i:i+k] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>))
prot_vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'word'</span>, token_pattern=r<span class="str">'\\S+'</span>).<span class="fn">fit</span>([<span class="fn">kmer</span>(p,<span class="num">3</span>) <span class="kw">for</span> p <span class="kw">in</span> proteins])
lig_vec  = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">2</span>,<span class="num">4</span>)).<span class="fn">fit</span>(ligands)
P = prot_vec.<span class="fn">transform</span>([<span class="fn">kmer</span>(p,<span class="num">3</span>) <span class="kw">for</span> p <span class="kw">in</span> proteins])
L = lig_vec.<span class="fn">transform</span>(ligands)

<span class="cm"># Build all (protein, ligand) pairs and label them: positive if protein family == ligand family</span>
N_p, N_l = <span class="fn">len</span>(proteins), <span class="fn">len</span>(ligands)
pairs_X, pairs_y = [], []
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N_p):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(N_l):
        feat = <span class="fn">hstack</span>([P[i], L[j]])
        pairs_X.<span class="fn">append</span>(feat)
        pairs_y.<span class="fn">append</span>(<span class="fn">int</span>(fam_labels_p[i] == fam_labels_l[j]))
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> vstack
X = <span class="fn">vstack</span>(pairs_X)
y = np.<span class="fn">array</span>(pairs_y)

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.25</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">3000</span>, class_weight=<span class="str">'balanced'</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(f<span class="str">"Pairs: {len(y)} (positives = {y.sum()})"</span>)
<span class="fn">print</span>(f<span class="str">"Test accuracy: {clf.score(Xte, yte):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Test ROC-AUC : {np.corrcoef(clf.predict_proba(Xte)[:,1], yte)[0,1]:.3f}  (proxy)"</span>)
</code></pre></div>

<p class="l-text">Replace the two TF-IDF encoders with ESM-2 + ChemBERTa, and the concatenation with multi-head cross-attention, and you have the architecture of every modern DTI paper. The data flow does not change.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. AlphaFold-Multimer and Complex Prediction</h2>
<p class="l-text">AlphaFold-Multimer (Evans et al., bioRxiv 2021) extended AF2 to protein-protein complexes by concatenating chains with a special inter-chain marker, building a paired MSA from species-matched orthologs, and adding an auxiliary loss for inter-chain interfaces. Reported 67% success rate on the heterodimer benchmark — orders of magnitude beyond docking tools. The first practical application: predict that this protein binds that protein, with this geometry.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Headline use cases</div><div class="card-body">Antibody-antigen interface prediction. Receptor-ligand interfaces. Multi-subunit machines (the proteasome, the spliceosome).</div></div>
<div class="calc-card"><div class="card-title">Limits</div><div class="card-body">Fails when paired-MSA signal is weak (transient interactions, designed binders). Cannot handle non-protein partners (DNA, ligands) — for that you need AF3 / Boltz-1.</div></div>
<div class="calc-card"><div class="card-title">Quality metric</div><div class="card-body">ipTM (interface predicted TM-score) — AF2's auxiliary head, scored against ground-truth interface RMSD. ipTM &gt; 0.85 = trustworthy interface.</div></div>
<div class="calc-card"><div class="card-title">Open analogs</div><div class="card-body">RoseTTAFold All-Atom (Krishna 2024), Boltz-1, OpenFold-Multimer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. RFdiffusion — Designing New Proteins</h2>
<p class="l-text">RFdiffusion (Watson et al., Nature July 2023, Baker lab) is a diffusion model trained on protein structures. It generates novel backbones by denoising — start from random Gaussian coordinates, iteratively denoise, end with a protein-like 3D structure. Conditioning lets you specify constraints: "design a binder for this surface", "design a scaffold around this active site", "design a symmetric homodimer". Sequences are then assigned by ProteinMPNN (Dauparas 2022) and validated by AF2.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — RFdiffusion requires GPU + PyTorch)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production: clone github.com/RosettaCommons/RFdiffusion, then:</span>
<span class="cm"># python scripts/run_inference.py \\</span>
<span class="cm">#   inference.output_prefix=outputs/binder \\</span>
<span class="cm">#   inference.input_pdb=target.pdb \\</span>
<span class="cm">#   contigmap.contigs=[A1-100/0 50-100] \\</span>
<span class="cm">#   ppi.hotspot_res=[A30,A45,A89] \\</span>
<span class="cm">#   inference.num_designs=100</span>
</code></pre></div>

<div class="calc-highlight"><strong>What RFdiffusion proved (2023):</strong> protein design is now a generative-modeling problem, not a search-and-energy-minimize problem. Watson et al. designed binders for IL-7Rα, PD-L1, TrkA, and influenza hemagglutinin from scratch — wet-lab-validated, single-digit-nanomolar affinity in some cases. The Baker lab and several startups (Cradle, Generate, Profluent) ship variations of this.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. AlphaProteo and Boltz-1</h2>
<p class="l-text">Two complementary 2024 milestones close the protein-design loop:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AlphaProteo (DeepMind, Sep 2024)</div><div class="card-body">Closed-source. Generates de novo protein binders. Reported 3-300x experimental success-rate improvement over previous design tools on 7 targets including SARS-CoV-2 spike, IL-7Rα, VEGF-A. Single-digit picomolar affinity in best cases.</div></div>
<div class="calc-card"><div class="card-title">Boltz-1 (MIT, Nov 2024)</div><div class="card-body">First fully open-source AlphaFold-3-class model. Wohlwend, Adler et al. MIT license, trained on PDB + cofactors, similar Pairformer + diffusion architecture. Within ~5% of AF3 on protein-ligand benchmarks. Followed by Boltz-2 (May 2025) with improved affinity prediction.</div></div>
<div class="calc-card"><div class="card-title">Chai-1 (Chai Discovery, Sep 2024)</div><div class="card-body">Multi-modal complex prediction matching AF3 on most benchmarks. Open weights for non-commercial use.</div></div>
<div class="calc-card"><div class="card-title">Profluent ProGen3 (2024)</div><div class="card-body">Generative protein LM trained on 130B tokens, ~17B params. Used to design functional Cas9 variants and antibody libraries.</div></div>
</div>

<p class="l-text">The 2026 working assumption: closed AF3 / AlphaProteo are state-of-the-art; Boltz / Chai-1 / RFdiffusion + ProteinMPNN are within striking distance and you can use them in your own pipeline today.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. End-to-End Pipeline — All Six Lessons in One</h2>
<p class="l-text">Putting it all together. A 2026 drug-discovery startup's stack, end to end:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (architecture sketch — many components blocked)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Stage 1 (L1): get the target protein sequence from UniProt</span>
target_seq = <span class="fn">fetch_uniprot</span>(<span class="str">"P00533"</span>)  <span class="cm"># EGFR</span>

<span class="cm"># Stage 2 (L3): predict structure</span>
structure = <span class="fn">alphafold3</span>(target_seq)    <span class="cm"># or ESMFold for fast / Boltz-1 for complexes</span>

<span class="cm"># Stage 3 (L4): embed for downstream ML</span>
prot_emb = <span class="fn">esm2_15B</span>(target_seq)

<span class="cm"># Stage 4 (L5): annotate variants in the patient population</span>
variants = <span class="fn">alphamissense</span>(target_seq)  <span class="cm"># 71M-variant table for EGFR</span>

<span class="cm"># Stage 5 (L6 — DTI screen): score 10^9 ChEMBL ligands</span>
hits = []
<span class="kw">for</span> lig <span class="kw">in</span> chembl_library:
    score = <span class="fn">dti_model</span>(prot_emb, <span class="fn">smiles_to_emb</span>(lig))
    <span class="kw">if</span> score &gt; <span class="num">0.9</span>: hits.<span class="fn">append</span>(lig)

<span class="cm"># Stage 6 (L6 — design): generate novel binders for the same pocket</span>
binders = <span class="fn">rfdiffusion</span>(target_pdb=structure, hotspots=[<span class="num">745</span>, <span class="num">790</span>, <span class="num">858</span>])
sequences = <span class="fn">protein_mpnn</span>(binders)
folded = <span class="fn">alphafold2</span>(sequences)
validated = [s <span class="kw">for</span> s, f <span class="kw">in</span> <span class="fn">zip</span>(sequences, folded) <span class="kw">if</span> <span class="fn">iptm</span>(f) &gt; <span class="num">0.85</span>]

<span class="cm"># Stage 7: experimental validation in the wet lab</span>
<span class="fn">print</span>(f<span class="str">"AI shortlist: {len(hits)} small-molecule hits + {len(validated)} de novo binders"</span>)
</code></pre></div>

<p class="l-text">Every step uses a lesson from this track. L1's BLAST/Smith-Waterman finds the target's homologs. L2's structure concepts read AF2's pLDDT/PAE plots. L3's AlphaFold predicts structure. L4's ESM embeds the sequence. L5's AlphaMissense annotates variants. L6's DTI + RFdiffusion does the screening and design. The whole pipeline runs on a single GPU + cloud API and produces, in 2025-2026 reports, candidates that succeed in the wet lab at rates 10-100x above pre-AI baselines.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Where Bioinformatics Goes Next</h2>
<p class="l-text">Six lessons in, here is the map of where the field is heading.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Multimodal foundation models</div><div class="card-body">A single model that takes sequence, structure, function, and small molecules. ESM-3 is the early version. Expect "GPT-4 of biology" by 2027.</div></div>
<div class="calc-card"><div class="card-title">Cellular simulation</div><div class="card-body">Whole-cell models. AlphaCell (rumored DeepMind, 2026), Recursion's Phenom, the Chan Zuckerberg "AI Virtual Cell" project. The next AlphaFold-scale problem.</div></div>
<div class="calc-card"><div class="card-title">Lab automation + closed-loop AI</div><div class="card-body">Kebotix, Strateos, Insitro, Generate Biomedicines. AI proposes molecules, robots make them, instruments measure them, the data trains the next round. Already running in the kilo-experiments-per-day regime.</div></div>
<div class="calc-card"><div class="card-title">Gene therapy + Cas9 design</div><div class="card-body">Profluent designed OpenCRISPR-1, the first AI-designed editor with comparable activity to natural Cas9. Evo 2 designed functional CRISPR systems generatively. The next decade of medicine writes itself in nucleotide LMs.</div></div>
<div class="calc-card"><div class="card-title">AI safety in bio</div><div class="card-body">Dual-use risk: the same models that design therapeutics could design pathogens. Anthropic's Constitutional AI for biology, the BWC dual-use frameworks, NIH's responsible-use guidelines all sit here. A real concern, an active conversation.</div></div>
<div class="calc-card"><div class="card-title">Personalized medicine</div><div class="card-body">Sequence + structure + variant effect + pharmacogenomics + clinical history → personalized treatment. Med-PaLM-style LLMs orchestrate the reasoning. Already deployed in oncology (Tempus AI, Foundation Medicine). General medicine within five years.</div></div>
</div>

<div class="calc-highlight"><strong>Closing thought:</strong> bioinformatics in 2020 was a small subfield of computer science used by some labs. Bioinformatics in 2026 is the operating layer of pharma, agriculture, and personalized medicine. AlphaFold 2 was the inflection point; AlphaFold 3, RFdiffusion, ESM-3, AlphaMissense, Evo, and AlphaProteo are the curves rising on top of it. The goal of this 6-lesson track was to give you the vocabulary and the working pipelines to participate. Good luck on whatever target you go after.</div>
</div>`,
tr: `<p class="l-text"><strong>İlaç keşfi, özünde, bir eşleştirme problemidir.</strong> Bir hedef proteinin bağlanma cebi vardır. İlaç, doğru hidrojen bağları, hidrofobik temaslar ve şekille cebe oturan küçük bir moleküldür. Doğru molekülü bulun, bir aday ilaçınız olur; yanlışını bulun, bir yan etkiniz olur. Geleneksel hat, onaylanan ilaç başına 10-15 yıl ve ~2 milyar dolar alır. AlphaFold-Multimer (2021), RFdiffusion (Watson ve ark., Nature 2023), AlphaProteo (DeepMind 2024) ve Boltz-1 (MIT 2024) toplu olarak AI'nın bu zaman çizelgesini sıkıştırmaya başladığı andır — yapı tahmin ederek, yeni bağlayıcılar üreterek ve ilaç-hedef etkileşimlerini uçtan uca puanlayarak.</p>

<p class="l-text">Bu kapanış dersi tüm yığını birleştiriyor. İlaç-hedef etkileşim (DTI) tahminini ve küçük-molekül temsilini (SMILES dizgeleri, moleküler parmak izleri, graf sinir ağları) tanımlıyoruz. Çalışan bir DTI modeli kuruyoruz: protein TF-IDF gömmeleri (ESM için vekil) artı SMILES karakter-seviyesi TF-IDF gömmeleri, çapraz-dikkatle birleştirilmiş, sentetik afinite etiketleri üzerinde eğitilmiş — mimari DeepDTA (Öztürk 2018), MolTrans (Huang 2021) ve modern transformer-tabanlı tahmincilerle aynıdır. Sonra tasarım tarafını inceliyoruz: kompleks tahmini için AlphaFold-Multimer, de novo bağlayıcı tasarımı için RFdiffusion, protein-protein arayüzleri için AlphaProteo ve açık AlphaFold-3 alternatifi olarak Boltz-1. Sekiz biyoenformatik + AI iz tek bir hatta kapanır.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Küçük molekülleri SMILES, ECFP parmak izleri ve moleküler graflar ile temsil etmek</li>
<li>Çalışan bir DTI modeli kurmak — protein-tarafı TF-IDF + ligand-tarafı TF-IDF + çapraz-dikkat başlığı — saf sklearn'de</li>
<li>PoseBusters ve DAVIS kıyaslamalarını okumak: 2026'da ilaç-hedef tahmini için son teknoloji ne demek</li>
<li>RFdiffusion'u (Baker laboratuvarı 2023) eskizlemek ve neden koordinat difüzyonunun protein tasarımını mümkün kıldığını açıklamak</li>
<li>AlphaFold-Multimer, AlphaProteo, AlphaFold 3, Boltz-1, Chai-1'i karşılaştırmak — protein-kompleks manzarası</li>
<li>Tüm altı dersi tek bir uçtan uca hatta kablolamak: dizi → yapı → gömme → ilaç-hedef → tasarlanmış molekül</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İlaç Keşfi Hattı (ve AI Nereye Sığar)</h2>
<p class="l-text">Klasik ilaç-keşfi hattının altı aşaması vardır. Her biri eskiden yıllar alıyordu; AI önce erken olanları çökertiyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Hedef tanımlama</div><div class="card-body">"Hangi protein, ilaçlanırsa hastalığı tedavi eder?" Genomik + transkriptomik + literatür madenciliği. AI: yol analizi, bilgi grafları (BioBERT, GenomeLLM).</div></div>
<div class="calc-card"><div class="card-title">2. Hedef doğrulama + yapı</div><div class="card-body">Hedefin yapısını çöz. Kristalografi gerekirdi. Şimdi: saniyeler içinde AlphaFold 2/3.</div></div>
<div class="calc-card"><div class="card-title">3. İsabet keşfi</div><div class="card-body">Bağlanan molekülleri bul. 10⁶ bileşiğin yüksek-verimli taraması olurdu. Şimdi: DTI modelleri, üretken modeller (REINVENT, MolGPT) ve aktif-öğrenme döngüleri ile 10¹⁰ sanal tarama.</div></div>
<div class="calc-card"><div class="card-title">4. Lider optimizasyonu</div><div class="card-body">Etkinliği, ADMET'yi (emilim, dağılım, metabolizma, atılım, toksisite) ayarla. AI: ChemProp, ML potansiyelleri ile serbest-enerji bozukluğu (Equinor'un NequIP'i, MACE), üretken kimya.</div></div>
<div class="calc-card"><div class="card-title">5. Klinik öncesi</div><div class="card-body">Hayvan denemeleri. AI toksisite tahmininde yardım eder (DeepTox, AnimalGPT) ama ıslak-laboratuvar çekirdeği değişmemiştir.</div></div>
<div class="calc-card"><div class="card-title">6. Klinik denemeler</div><div class="card-body">Faz I/II/III. AI: hasta katmanlaması, sentetik kontrol kolları, deneme tasarımı optimizasyonu.</div></div>
</div>

<div class="calc-highlight"><strong>2026 gerçekliği:</strong> 2 ve 3 numaralı aşamalar artık büyük ölçüde AI-yönlüdür. Insilico Medicine'in INS018_055'i, ilk uçtan-uca-AI-tasarlanmış ilaç olarak Faz II'ye girdi (2024). Isomorphic Labs (DeepMind spinout), Novartis ve Eli Lilly ile çok-milyar dolarlık anlaşmalar imzaladı. Darboğaz "bir aday bul"dan "yaşayan sistemlerde doğrula"ya kaydı.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Küçük Molekülleri Temsil Etme</h2>
<p class="l-text">Küçük bir molekülün (tipik ilaç-benzeri, &lt;500 Dalton, ~30 ağır atom) makine-okunabilir bir formuna ihtiyacı vardır. Üç standart.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SMILES (Weininger 1988)</div><div class="card-body">Dizgeler: aspirin = <code>CC(=O)Oc1ccccc1C(=O)O</code>. Atomlar harfler olarak, bağlar üstü kapalı, dallar parantez içinde, halkalar numaralı kapanışlarla, aromatiklik küçük harfle. Her kemoinformatik aracı tarafından kullanılır — ChEMBL, PubChem, RDKit.</div></div>
<div class="calc-card"><div class="card-title">ECFP parmak izleri (Rogers 2010)</div><div class="card-body">Bit vektörü (genellikle 1024 veya 2048 bit) — her bit, yarıçapı 2 olan dairesel bir alt-yapının varlığını temsil eder. RDKit'in <code>Chem.GetMorganFingerprintAsBitVect</code>'i tarafından hesaplanır. Ucuz, dayanıklı, evrensel kemoinformatik temeli.</div></div>
<div class="calc-card"><div class="card-title">Moleküler graflar</div><div class="card-body">Atomlar düğümler, bağlar kenarlar olarak. Graf sinir ağları için özellikleştirilmiştir. ChemProp (Yang 2019), MEGNet, DimeNet++ hepsi bunu kullanır. Özellik tahmini için son teknoloji.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — RDKit Pyodide'de bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> rdkit <span class="kw">import</span> Chem
<span class="kw">from</span> rdkit.Chem <span class="kw">import</span> AllChem
mol = Chem.<span class="fn">MolFromSmiles</span>(<span class="str">"CC(=O)Oc1ccccc1C(=O)O"</span>)  <span class="cm"># aspirin</span>
fp = AllChem.<span class="fn">GetMorganFingerprintAsBitVect</span>(mol, radius=<span class="num">2</span>, nBits=<span class="num">1024</span>)
<span class="fn">print</span>(<span class="str">"Aspirin: 1024-bit ECFP4 fingerprint, on-bits ="</span>, <span class="fn">sum</span>(fp))
<span class="fn">print</span>(<span class="str">"Heavy atoms:"</span>, mol.<span class="fn">GetNumHeavyAtoms</span>())
</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SMILES TF-IDF — Bir Kemoinformatik Vekili</h2>
<p class="l-text">RDKit olmadan bile kullanılabilir bir moleküler temsil elde edebiliriz: SMILES dizgeleri üzerinde karakter-seviyesi n-gram'lar, TF-IDF ile vektörleştirilmiş. Bu, ECFP'nin yakaladığı yapısal benzerlik sinyalinin çoğunu geri kazandırır, stereo-kimyada biraz daha bulanık olma maliyetiyle.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

drugs = {
    <span class="str">"aspirin"</span>     : <span class="str">"CC(=O)Oc1ccccc1C(=O)O"</span>,
    <span class="str">"ibuprofen"</span>   : <span class="str">"CC(C)Cc1ccc(C(C)C(=O)O)cc1"</span>,
    <span class="str">"paracetamol"</span> : <span class="str">"CC(=O)Nc1ccc(O)cc1"</span>,
    <span class="str">"caffeine"</span>    : <span class="str">"Cn1cnc2c1c(=O)n(C)c(=O)n2C"</span>,
    <span class="str">"morphine"</span>    : <span class="str">"CN1CCC23C4Oc5c(O)ccc(C4)c25CCC3C1"</span>,
    <span class="str">"salicylic"</span>   : <span class="str">"OC(=O)c1ccccc1O"</span>,         <span class="cm"># close cousin of aspirin</span>
}
names, smiles = <span class="fn">list</span>(drugs.<span class="fn">keys</span>()), <span class="fn">list</span>(drugs.<span class="fn">values</span>())

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">2</span>, <span class="num">4</span>))
X = vec.<span class="fn">fit_transform</span>(smiles)
sim = <span class="fn">cosine_similarity</span>(X)
<span class="fn">print</span>(f<span class="str">"Aspirin vs salicylic acid: {sim[0,5]:.3f}  (chemical cousins, should be high)"</span>)
<span class="fn">print</span>(f<span class="str">"Aspirin vs caffeine      : {sim[0,3]:.3f}  (unrelated, should be low)"</span>)
<span class="fn">print</span>(f<span class="str">"Embedding dimension: {X.shape[1]} char-n-grams"</span>)
</code></pre></div>

<p class="l-text">Aspirin ve salisilik asit (hidroliz ürünü) yüksek skor alır; aspirin ve kafein düşük skor alır. ECFP bunu biraz daha iyi yapar, ancak TF-IDF temeli çalışan bir DTI hattı kurmak için yeterlidir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İlaç-Hedef Etkileşimi — Mimari</h2>
<p class="l-text">Modern bir DTI modelinin üç parçası vardır: bir protein kodlayıcı (ESM-2, ProtBERT veya sadece k-mer TF-IDF), bir ligand kodlayıcı (ChemBERTa, MolFormer veya SMILES TF-IDF) ve afinite tahmini (regresyon) veya bağlanma olasılığı (sınıflandırma) üreten bir çapraz-dikkat başlığı. Veri kümeleri: DAVIS (kinaz inhibitörleri, 442 protein × 68 ligand), KIBA (Kinase Inhibitor BioActivity, 229k çift), BindingDB (2M+ çift).</p>

<div class="katex-block">$$\hat y = \sigma\!\left( W_o \cdot \text{CrossAttn}\big(h_{\text{prot}},\, h_{\text{lig}}\big) \right)$$</div>

<p class="l-text">Buradaki çapraz-dikkat, proteinden gelen sorguların liganddan gelen anahtarlara/değerlere ve tersine dikkat etmesi anlamına gelir; birleşik bir temsil üretir. DeepDTA (Öztürk 2018) 1B konvolüsyonlar kullandı; MolTrans (Huang 2021) tam transformer çapraz-dikkati kullandı; 2024 sınırı (BiomedGPT, BioMedLM) bir LLM omurgası kullanır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. sklearn'de Bir DTI Modeli Kurmak</h2>
<p class="l-text">İşte aynı mimari 50 satırda: protein 3-mer'leri üzerinde TF-IDF, SMILES karakter-n-gram'ları üzerinde TF-IDF, eleman-bazlı çarpım ile birleştirilmiş (çapraz-dikkat için bir vekil) ve üzerinde bir lojistik regresyon. Doğru cevabı bildiğimiz sentetik afinite etiketleri üzerinde eğitilmiştir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> hstack
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Synthetic universe: 30 proteins × 40 ligands = 1200 pairs</span>
proteins = []
prototypes = {
    <span class="str">"kinase"</span>:   <span class="str">"MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEK"</span>,
    <span class="str">"gpcr"</span>:     <span class="str">"MKLILLAAFCLLSAAQLPLDPVAGGAYANRTMNFGAVPVSAYNQTRRWEEAA"</span>,
    <span class="str">"protease"</span>: <span class="str">"GVLILNGKDDPNQGGGNDIPGGTITWTPSEAARYAQEEMSAFLNTLHAYREQK"</span>,
}
fam_labels_p = []
aa = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)
<span class="kw">for</span> fam, proto <span class="kw">in</span> prototypes.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>):
        s = <span class="fn">list</span>(proto)
        <span class="kw">for</span> j <span class="kw">in</span> np.random.<span class="fn">choice</span>(<span class="fn">len</span>(s), size=<span class="num">4</span>, replace=<span class="kw">False</span>):
            s[j] = np.random.<span class="fn">choice</span>(aa)
        proteins.<span class="fn">append</span>(<span class="str">''</span>.<span class="fn">join</span>(s)); fam_labels_p.<span class="fn">append</span>(fam)

ligands = []
lig_protos = {
    <span class="str">"kinase"</span>:   <span class="str">"Cc1ccc(Nc2ncc(F)c(Nc3ccc(N4CCN(C)CC4)cc3)n2)cc1"</span>,
    <span class="str">"gpcr"</span>:     <span class="str">"CC(C)NCC(O)c1ccc(O)c(O)c1"</span>,
    <span class="str">"protease"</span>: <span class="str">"CC(=O)NC(Cc1ccc(O)cc1)C(=O)NC(CO)C(=O)O"</span>,
}
fam_labels_l = []
chars = <span class="fn">list</span>(<span class="str">"CcNnOoSsPpFlBr()[]=#1234567890"</span>)
<span class="kw">for</span> fam, proto <span class="kw">in</span> lig_protos.<span class="fn">items</span>():
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">13</span>):
        s = <span class="fn">list</span>(proto)
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
            j = np.random.<span class="fn">randint</span>(<span class="fn">len</span>(s))
            s[j] = np.random.<span class="fn">choice</span>(chars)
        ligands.<span class="fn">append</span>(<span class="str">''</span>.<span class="fn">join</span>(s)); fam_labels_l.<span class="fn">append</span>(fam)
ligands.<span class="fn">append</span>(lig_protos[<span class="str">"kinase"</span>]); fam_labels_l.<span class="fn">append</span>(<span class="str">"kinase"</span>)  <span class="cm"># round to 40</span>

<span class="cm"># Encode</span>
<span class="kw">def</span> <span class="fn">kmer</span>(s, k): <span class="kw">return</span> <span class="str">' '</span>.<span class="fn">join</span>(s[i:i+k] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>))
prot_vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'word'</span>, token_pattern=r<span class="str">'\\S+'</span>).<span class="fn">fit</span>([<span class="fn">kmer</span>(p,<span class="num">3</span>) <span class="kw">for</span> p <span class="kw">in</span> proteins])
lig_vec  = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'char'</span>, ngram_range=(<span class="num">2</span>,<span class="num">4</span>)).<span class="fn">fit</span>(ligands)
P = prot_vec.<span class="fn">transform</span>([<span class="fn">kmer</span>(p,<span class="num">3</span>) <span class="kw">for</span> p <span class="kw">in</span> proteins])
L = lig_vec.<span class="fn">transform</span>(ligands)

<span class="cm"># Build all (protein, ligand) pairs and label them: positive if protein family == ligand family</span>
N_p, N_l = <span class="fn">len</span>(proteins), <span class="fn">len</span>(ligands)
pairs_X, pairs_y = [], []
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N_p):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(N_l):
        feat = <span class="fn">hstack</span>([P[i], L[j]])
        pairs_X.<span class="fn">append</span>(feat)
        pairs_y.<span class="fn">append</span>(<span class="fn">int</span>(fam_labels_p[i] == fam_labels_l[j]))
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> vstack
X = <span class="fn">vstack</span>(pairs_X)
y = np.<span class="fn">array</span>(pairs_y)

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.25</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">3000</span>, class_weight=<span class="str">'balanced'</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(f<span class="str">"Pairs: {len(y)} (positives = {y.sum()})"</span>)
<span class="fn">print</span>(f<span class="str">"Test accuracy: {clf.score(Xte, yte):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Test ROC-AUC : {np.corrcoef(clf.predict_proba(Xte)[:,1], yte)[0,1]:.3f}  (proxy)"</span>)
</code></pre></div>

<p class="l-text">İki TF-IDF kodlayıcısını ESM-2 + ChemBERTa ile değiştirin ve birleştirmeyi çoklu-başlı çapraz-dikkat ile değiştirin, elinizde her modern DTI makalesinin mimarisi olur. Veri akışı değişmez.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. AlphaFold-Multimer ve Kompleks Tahmini</h2>
<p class="l-text">AlphaFold-Multimer (Evans ve ark., bioRxiv 2021), zincirleri özel bir zincirler-arası işaretle birleştirip tür-eşleşmiş ortologlardan eşleştirilmiş bir MSA inşa edip zincirler-arası arayüzler için yardımcı bir kayıp ekleyerek AF2'yi protein-protein komplekslerine genişletti. Heterodimer kıyaslamasında %67 başarı oranı raporladı — yerleştirme araçlarının çok ötesinde. İlk pratik uygulama: bu proteinin şu proteine, şu geometriyle bağlandığını tahmin et.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Manşet kullanım örnekleri</div><div class="card-body">Antikor-antijen arayüz tahmini. Reseptör-ligand arayüzleri. Çoklu-alt birim makineler (proteazom, splicozom).</div></div>
<div class="calc-card"><div class="card-title">Sınırlar</div><div class="card-body">Eşleştirilmiş-MSA sinyali zayıfken (geçici etkileşimler, tasarlanmış bağlayıcılar) başarısız olur. Protein-olmayan ortakları (DNA, ligandlar) işleyemez — bunun için AF3 / Boltz-1 gerekir.</div></div>
<div class="calc-card"><div class="card-title">Kalite metriği</div><div class="card-body">ipTM (interface predicted TM-score) — AF2'nin yardımcı başlığı, gerçek arayüz RMSD'sine karşı puanlanır. ipTM &gt; 0,85 = güvenilir arayüz.</div></div>
<div class="calc-card"><div class="card-title">Açık analoglar</div><div class="card-body">RoseTTAFold All-Atom (Krishna 2024), Boltz-1, OpenFold-Multimer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. RFdiffusion — Yeni Proteinleri Tasarlama</h2>
<p class="l-text">RFdiffusion (Watson ve ark., Nature Temmuz 2023, Baker laboratuvarı), protein yapıları üzerinde eğitilmiş bir difüzyon modelidir. Gürültüden arındırarak yeni omurgalar üretir — rastgele Gauss koordinatlarından başla, yinelemeli olarak gürültüden arındır, protein-benzeri bir 3B yapıyla bitir. Koşullandırma kısıtlamalar belirlemenize izin verir: "bu yüzey için bir bağlayıcı tasarla", "bu aktif bölge etrafında bir iskele tasarla", "simetrik bir homodimer tasarla". Diziler daha sonra ProteinMPNN (Dauparas 2022) tarafından atanır ve AF2 tarafından doğrulanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — RFdiffusion GPU + PyTorch gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production: clone github.com/RosettaCommons/RFdiffusion, then:</span>
<span class="cm"># python scripts/run_inference.py \\</span>
<span class="cm">#   inference.output_prefix=outputs/binder \\</span>
<span class="cm">#   inference.input_pdb=target.pdb \\</span>
<span class="cm">#   contigmap.contigs=[A1-100/0 50-100] \\</span>
<span class="cm">#   ppi.hotspot_res=[A30,A45,A89] \\</span>
<span class="cm">#   inference.num_designs=100</span>
</code></pre></div>

<div class="calc-highlight"><strong>RFdiffusion'un kanıtladığı şey (2023):</strong> protein tasarımı artık bir üretken-modelleme problemidir, bir ara-ve-enerji-minimize problemi değil. Watson ve ark. IL-7Rα, PD-L1, TrkA ve influenza hemaglutinini için sıfırdan bağlayıcılar tasarladı — ıslak-laboratuvarda doğrulandı, bazı durumlarda tek-haneli nanomolar afinite. Baker laboratuvarı ve birkaç girişim (Cradle, Generate, Profluent) bunun varyasyonlarını yayımlar.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. AlphaProteo ve Boltz-1</h2>
<p class="l-text">İki tamamlayıcı 2024 dönüm noktası protein-tasarım döngüsünü kapatır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AlphaProteo (DeepMind, Eylül 2024)</div><div class="card-body">Kapalı kaynak. De novo protein bağlayıcıları üretir. SARS-CoV-2 spike, IL-7Rα, VEGF-A dahil 7 hedefte önceki tasarım araçlarına göre 3-300x deneysel başarı oranı iyileştirmesi raporlandı. En iyi durumlarda tek-haneli pikomolar afinite.</div></div>
<div class="calc-card"><div class="card-title">Boltz-1 (MIT, Kasım 2024)</div><div class="card-body">İlk tamamen açık kaynak AlphaFold-3-sınıfı model. Wohlwend, Adler ve ark. MIT lisansı, PDB + kofaktörler üzerinde eğitildi, benzer Pairformer + difüzyon mimarisi. Protein-ligand kıyaslamalarında AF3'ün ~%5 içinde. Geliştirilmiş afinite tahmini ile Boltz-2 (Mayıs 2025) izledi.</div></div>
<div class="calc-card"><div class="card-title">Chai-1 (Chai Discovery, Eylül 2024)</div><div class="card-body">Çok-modlu kompleks tahmini, çoğu kıyaslamada AF3 ile eşleşiyor. Ticari olmayan kullanım için açık ağırlıklar.</div></div>
<div class="calc-card"><div class="card-title">Profluent ProGen3 (2024)</div><div class="card-body">130B token üzerinde eğitilmiş üretken protein LM, ~17B parametre. İşlevsel Cas9 varyantları ve antikor kütüphanelerini tasarlamak için kullanıldı.</div></div>
</div>

<p class="l-text">2026 çalışma varsayımı: kapalı AF3 / AlphaProteo son teknolojidir; Boltz / Chai-1 / RFdiffusion + ProteinMPNN vurma mesafesinde ve kendi hattınızda bugün kullanabilirsiniz.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Uçtan Uca Hat — Tüm Altı Ders Tek Seferde</h2>
<p class="l-text">Hepsini bir araya getirmek. Bir 2026 ilaç-keşfi girişiminin yığını, uçtan uca:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (mimari eskizi — birçok bileşen bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Stage 1 (L1): get the target protein sequence from UniProt</span>
target_seq = <span class="fn">fetch_uniprot</span>(<span class="str">"P00533"</span>)  <span class="cm"># EGFR</span>

<span class="cm"># Stage 2 (L3): predict structure</span>
structure = <span class="fn">alphafold3</span>(target_seq)    <span class="cm"># or ESMFold for fast / Boltz-1 for complexes</span>

<span class="cm"># Stage 3 (L4): embed for downstream ML</span>
prot_emb = <span class="fn">esm2_15B</span>(target_seq)

<span class="cm"># Stage 4 (L5): annotate variants in the patient population</span>
variants = <span class="fn">alphamissense</span>(target_seq)  <span class="cm"># 71M-variant table for EGFR</span>

<span class="cm"># Stage 5 (L6 — DTI screen): score 10^9 ChEMBL ligands</span>
hits = []
<span class="kw">for</span> lig <span class="kw">in</span> chembl_library:
    score = <span class="fn">dti_model</span>(prot_emb, <span class="fn">smiles_to_emb</span>(lig))
    <span class="kw">if</span> score &gt; <span class="num">0.9</span>: hits.<span class="fn">append</span>(lig)

<span class="cm"># Stage 6 (L6 — design): generate novel binders for the same pocket</span>
binders = <span class="fn">rfdiffusion</span>(target_pdb=structure, hotspots=[<span class="num">745</span>, <span class="num">790</span>, <span class="num">858</span>])
sequences = <span class="fn">protein_mpnn</span>(binders)
folded = <span class="fn">alphafold2</span>(sequences)
validated = [s <span class="kw">for</span> s, f <span class="kw">in</span> <span class="fn">zip</span>(sequences, folded) <span class="kw">if</span> <span class="fn">iptm</span>(f) &gt; <span class="num">0.85</span>]

<span class="cm"># Stage 7: experimental validation in the wet lab</span>
<span class="fn">print</span>(f<span class="str">"AI shortlist: {len(hits)} small-molecule hits + {len(validated)} de novo binders"</span>)
</code></pre></div>

<p class="l-text">Her adım bu izden bir ders kullanır. L1'in BLAST/Smith-Waterman'ı hedefin homologlarını bulur. L2'nin yapı kavramları AF2'nin pLDDT/PAE grafiklerini okur. L3'ün AlphaFold'u yapı tahmin eder. L4'ün ESM'i diziyi gömer. L5'in AlphaMissense'i varyantları açıklar. L6'nın DTI + RFdiffusion'u taramayı ve tasarımı yapar. Tüm hat tek bir GPU + bulut API üzerinde çalışır ve 2025-2026 raporlarında, ıslak laboratuvarda AI öncesi temellerin 10-100 katı oranlarda başarılı olan adaylar üretir.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Biyoenformatik Sonra Nereye Gider</h2>
<p class="l-text">Altı ders sonra, alanın gittiği yerin haritası burada.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çok-modlu temel modeller</div><div class="card-body">Diziyi, yapıyı, işlevi ve küçük molekülleri alan tek bir model. ESM-3 erken sürümdür. 2027'ye kadar "biyolojinin GPT-4'ü" beklenir.</div></div>
<div class="calc-card"><div class="card-title">Hücresel simülasyon</div><div class="card-body">Tam-hücre modelleri. AlphaCell (söylenti DeepMind, 2026), Recursion'un Phenom'u, Chan Zuckerberg "AI Virtual Cell" projesi. Bir sonraki AlphaFold-ölçekli problem.</div></div>
<div class="calc-card"><div class="card-title">Laboratuvar otomasyonu + kapalı-döngü AI</div><div class="card-body">Kebotix, Strateos, Insitro, Generate Biomedicines. AI molekül önerir, robotlar yapar, cihazlar ölçer, veri sonraki turu eğitir. Günde-kilo-deney rejiminde çalışıyor.</div></div>
<div class="calc-card"><div class="card-title">Gen tedavisi + Cas9 tasarımı</div><div class="card-body">Profluent, doğal Cas9 ile karşılaştırılabilir aktiviteye sahip ilk AI-tasarımlı editör olan OpenCRISPR-1'i tasarladı. Evo 2 üretken olarak işlevsel CRISPR sistemleri tasarladı. Tıbbın önümüzdeki on yılı kendini nükleotid LM'lerinde yazıyor.</div></div>
<div class="calc-card"><div class="card-title">Biyoda AI güvenliği</div><div class="card-body">İkili kullanım riski: terapötikler tasarlayan aynı modeller patojenler de tasarlayabilir. Anthropic'in biyoloji için Constitutional AI'sı, BWC ikili-kullanım çerçeveleri, NIH'in sorumlu-kullanım kılavuzları hep buradadır. Gerçek bir endişe, etkin bir konuşma.</div></div>
<div class="calc-card"><div class="card-title">Kişiselleştirilmiş tıp</div><div class="card-body">Dizi + yapı + varyant etkisi + farmakogenomik + klinik geçmiş → kişiselleştirilmiş tedavi. Med-PaLM-tarzı LLM'ler akıl yürütmeyi düzenler. Onkolojide zaten konuşlandırıldı (Tempus AI, Foundation Medicine). Genel tıp beş yıl içinde.</div></div>
</div>

<div class="calc-highlight"><strong>Kapanış düşüncesi:</strong> 2020'de biyoenformatik bazı laboratuvarlarca kullanılan, bilgisayar biliminin küçük bir alt alanıydı. 2026'da biyoenformatik, ilaç sanayi, tarım ve kişiselleştirilmiş tıbbın işletim katmanıdır. AlphaFold 2 dönüm noktasıydı; AlphaFold 3, RFdiffusion, ESM-3, AlphaMissense, Evo ve AlphaProteo onun üstünde yükselen eğrilerdir. Bu 6-derslik izin amacı size sözcük dağarcığını ve katılımcı olmanızı sağlayan çalışan hatları vermekti. Hangi hedefin peşinden giderseniz gidin, iyi şanslar.</div>
</div>`
};
