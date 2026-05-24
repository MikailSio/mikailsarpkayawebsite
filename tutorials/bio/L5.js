window.BIO_L5 = {
en: `<p class="l-text"><strong>The genome is the longest, simplest text in biology.</strong> 3.2 billion base pairs, alphabet of size 4, written once per cell, copied trillions of times in your body without you noticing. Genomics asks: where in this string are the genes? Which variants between two people's strings cause disease? Can a transformer trained on whole genomes learn what BLAST and GWAS spent decades hand-engineering? The answers, increasingly, are yes.</p>

<p class="l-text">This lesson covers the 1D-to-clinical pipeline. We start with sequencing technology (short reads, long reads, what comes off an Illumina or Oxford Nanopore machine), variant calling — the inference of where one person's genome differs from a reference (DeepVariant, Google 2018, the first deep-learning genomics tool to ship in clinical pipelines). We cover GWAS (genome-wide association studies — Manhattan plots, p-value thresholds, the 23andMe pipeline), SNPs and polygenic risk scores. We finish with the genome-language-model wave: DNABert (Ji 2021), Nucleotide Transformer (Dalla-Torre, Meta/InstaDeep 2024), Evo (Arc Institute 2024). The pattern from L4 repeats — masked language modeling on biological sequences encodes regulatory and structural features for free.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish reference genome, reads, alignments, and variants — the four objects of computational genomics</li>
<li>Build a logistic-regression variant caller that mimics DeepVariant's top-level architecture on synthetic pileup features</li>
<li>Read a Manhattan plot and explain genome-wide significance (p &lt; 5×10⁻⁸)</li>
<li>Compute a polygenic risk score from SNP weights and explain its limits</li>
<li>Sketch DNABert and Nucleotide Transformer — k-mer tokenization, MLM pretraining, downstream tasks</li>
<li>Place Evo (long-context genome LM) and the broader 2024 genome-foundation-model wave</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Four Objects of Genomics</h2>
<p class="l-text">Computational genomics has surprisingly few primary types. Knowing them removes most of the jargon noise.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reference genome</div><div class="card-body">The "average human" string. Currently GRCh38 (2013) and the new T2T-CHM13 (2022, first telomere-to-telomere). One string per chromosome, ~3.2 billion bp total.</div></div>
<div class="calc-card"><div class="card-title">Reads</div><div class="card-body">Short DNA fragments produced by a sequencer. Illumina: 150 bp pairs, 30-100x coverage. Oxford Nanopore / PacBio: 10-100 kb single reads. Stored as FASTQ — sequence + quality scores.</div></div>
<div class="calc-card"><div class="card-title">Alignments</div><div class="card-body">Reads mapped back to the reference. BWA-MEM (Li 2009) and minimap2 (Li 2018) are the dominant aligners. Output is BAM — a binary indexed format used by every downstream tool.</div></div>
<div class="calc-card"><div class="card-title">Variants</div><div class="card-body">Differences from the reference: single-nucleotide variants (SNVs), small indels, structural variants. Called from BAMs by GATK HaplotypeCaller or DeepVariant; stored as VCF. A typical human carries ~4-5 million variants vs the reference.</div></div>
</div>

<div class="calc-highlight"><strong>The pipeline:</strong> FASTQ (reads) → BAM (alignments) → VCF (variants) → downstream analysis (GWAS, clinical reporting, polygenic scores). Every clinical genomics company ships some version of it.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Variant Calling — The Pileup Problem</h2>
<p class="l-text">At each genomic position, you have ~30 reads aligned, each with its own observed nucleotide and quality score. Question: is this position a variant in this individual or just sequencing noise? Old tools (samtools mpileup, GATK) used hand-tuned probabilistic models. DeepVariant (Poplin et al., Nature Biotechnology 2018) reframed it as image classification — render the pileup as a multi-channel image (read base, quality, mapping quality, strand), feed it to an Inception CNN, output {hom_ref, het, hom_alt}.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why DeepVariant won</div><div class="card-body">Generalizes across sequencing technologies (Illumina, PacBio, ONT) without retuning. Same model state-of-the-art on humans, plants, animals. Fewer false positives in tricky regions like homopolymers.</div></div>
<div class="calc-card"><div class="card-title">Where it ships</div><div class="card-body">Default in Google Cloud's Variant Transforms, Verily clinical pipelines, BabySeq2 newborn-screening trial, the All of Us research program (1M+ genomes).</div></div>
<div class="calc-card"><div class="card-title">Successors</div><div class="card-body">DeepConsensus (PacBio HiFi consensus, 2022), PEPPER-Margin-DeepVariant (long reads, 2021), Clair3 (small CNN, fast 2022).</div></div>
<div class="calc-card"><div class="card-title">2026 baseline</div><div class="card-body">DeepVariant + GATK joint-calling for clinical labs. 99.9%+ SNV recall on Genome in a Bottle benchmark. Indel accuracy 95%+.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — DeepVariant requires Docker + reference genome)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production: DeepVariant runs as a Docker pipeline</span>
<span class="cm"># docker run -v "$DATA":/input google/deepvariant:1.6.0 \\</span>
<span class="cm">#   /opt/deepvariant/bin/run_deepvariant \\</span>
<span class="cm">#   --model_type=WGS \\</span>
<span class="cm">#   --ref=/input/GRCh38.fa \\</span>
<span class="cm">#   --reads=/input/sample.bam \\</span>
<span class="cm">#   --output_vcf=/input/calls.vcf.gz \\</span>
<span class="cm">#   --num_shards=16</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. A Toy DeepVariant in sklearn</h2>
<p class="l-text">The DeepVariant CNN's job reduces to: from per-position pileup features, classify the genotype. We can build the same architecture conceptually with logistic regression on tabular features. The accuracy is much lower than DeepVariant — but the data flow is identical.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Synthesize 3000 candidate variant sites; features per site:</span>
<span class="cm">#   depth  : number of aligned reads (15-50)</span>
<span class="cm">#   alt_frac : fraction of reads showing the alt allele</span>
<span class="cm">#   mean_qual: mean base quality of alt-supporting reads</span>
<span class="cm">#   strand_bias : abs imbalance of forward vs reverse alt reads</span>
<span class="cm">#   mapping_qual: mean mapping quality</span>
N = <span class="num">3000</span>
depth = np.random.<span class="fn">randint</span>(<span class="num">15</span>, <span class="num">51</span>, N)
true_genotype = np.random.<span class="fn">choice</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>], size=N, p=[<span class="num">0.6</span>, <span class="num">0.3</span>, <span class="num">0.1</span>])  <span class="cm"># 0=hom_ref, 1=het, 2=hom_alt</span>
expected_alt = np.<span class="fn">array</span>([<span class="num">0.02</span>, <span class="num">0.5</span>, <span class="num">0.97</span>])[true_genotype]
alt_frac = np.<span class="fn">clip</span>(expected_alt + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.06</span>, N), <span class="num">0</span>, <span class="num">1</span>)
mean_qual = np.random.<span class="fn">normal</span>(<span class="num">35</span>, <span class="num">4</span>, N)
strand_bias = np.<span class="fn">abs</span>(np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.15</span>, N))
mapping_qual = np.random.<span class="fn">normal</span>(<span class="num">55</span>, <span class="num">6</span>, N)

X = np.<span class="fn">column_stack</span>([depth, alt_frac, mean_qual, strand_bias, mapping_qual])
y = true_genotype
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>, multi_class=<span class="str">'multinomial'</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"Test accuracy:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))
<span class="fn">print</span>(<span class="fn">classification_report</span>(yte, clf.<span class="fn">predict</span>(Xte), target_names=[<span class="str">'hom_ref'</span>,<span class="str">'het'</span>,<span class="str">'hom_alt'</span>], digits=<span class="num">3</span>))
</code></pre></div>

<p class="l-text">The model nails hom_ref (the easy case — almost no alt reads), and trades off hets vs hom_alts based on alt_frac. DeepVariant adds two crucial things: convolutional context (signals from neighboring positions) and far more features per pile-up — but the prediction problem is the same shape.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GWAS — Finding Trait-Associated Variants</h2>
<p class="l-text">A genome-wide association study takes ~10⁶ SNPs from 10⁵-10⁶ people, and for each SNP runs a regression of phenotype on genotype. The output is a Manhattan plot — chromosomal position on x, –log₁₀(p-value) on y. Peaks above the genome-wide significance threshold (p &lt; 5×10⁻⁸ — Bonferroni-corrected for ~10⁶ tests) are reported associations.</p>

<div class="katex-block">$$y_i = \alpha + \beta \cdot g_i + \gamma^\top c_i + \epsilon_i, \qquad p = P(|\hat\beta| \ge \text{obs} \mid \beta=0)$$</div>

<p class="l-text">where g_i ∈ {0, 1, 2} is the count of the alt allele for individual i, c_i is covariates (age, sex, principal components for ancestry), and the test is whether β differs significantly from 0. Famous successes: APOE for Alzheimer's, FTO for BMI, HLA for autoimmune disease.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy <span class="kw">import</span> stats
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Simulate 1000 individuals × 200 SNPs; SNP 73 is causal with effect size 0.4</span>
N, M = <span class="num">1000</span>, <span class="num">200</span>
G = np.random.<span class="fn">binomial</span>(<span class="num">2</span>, <span class="num">0.3</span>, size=(N, M))
y = <span class="num">0.4</span> * G[:, <span class="num">73</span>] + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1</span>, N)

logp = np.<span class="fn">zeros</span>(M)
<span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(M):
    r, p = stats.<span class="fn">pearsonr</span>(G[:, j], y)
    logp[j] = -np.<span class="fn">log10</span>(<span class="fn">max</span>(p, <span class="num">1e-300</span>))

threshold = -np.<span class="fn">log10</span>(<span class="num">5e-8</span>)
hits = np.<span class="fn">where</span>(logp &gt; threshold)[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"SNPs above genome-wide threshold (-log10 p &gt; {threshold:.1f}): {hits.tolist()}"</span>)
<span class="fn">print</span>(f<span class="str">"Top 5 SNPs by significance: {np.argsort(logp)[-5:][::-1].tolist()}"</span>)
<span class="fn">print</span>(f<span class="str">"Causal SNP at index 73 has -log10(p) = {logp[73]:.2f}"</span>)
</code></pre></div>

<p class="l-text">Real GWAS catalogs (UK Biobank, FinnGen, BioBank Japan) have found 100,000+ trait-associated SNPs. Most have tiny effect sizes — height is influenced by &gt;10,000 SNPs, each contributing ~0.1mm.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Polygenic Risk Scores</h2>
<p class="l-text">Once GWAS gives you SNP effects β_j, predict an individual's risk by summing genotypes weighted by effects:</p>

<div class="katex-block">$$\text{PRS}_i = \sum_{j=1}^{M} \hat\beta_j \cdot g_{ij}$$</div>

<p class="l-text">Higher PRS → higher trait/disease risk. PRS for coronary artery disease (Khera 2018) identifies the top 8% of individuals at 3x average risk — actionable for clinical screening. Warning: PRS portability across ancestries is poor; most are trained on European data and underperform on African and East Asian cohorts. This is one of the unsolved problems of clinical genomics in 2026.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

N_train, N_test, M = <span class="num">800</span>, <span class="num">200</span>, <span class="num">200</span>
G_train = np.random.<span class="fn">binomial</span>(<span class="num">2</span>, <span class="num">0.3</span>, size=(N_train, M))
G_test  = np.random.<span class="fn">binomial</span>(<span class="num">2</span>, <span class="num">0.3</span>, size=(N_test,  M))

<span class="cm"># 5 causal SNPs</span>
causal = [<span class="num">13</span>, <span class="num">47</span>, <span class="num">73</span>, <span class="num">121</span>, <span class="num">188</span>]
betas = np.<span class="fn">zeros</span>(M); betas[causal] = [<span class="num">0.5</span>, -<span class="num">0.3</span>, <span class="num">0.4</span>, <span class="num">0.25</span>, -<span class="num">0.35</span>]
y_train = G_train @ betas + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1.0</span>, N_train)
y_test  = G_test  @ betas + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1.0</span>, N_test)

<span class="cm"># Ridge regression as a simple PRS learner (real PRS use LD-pruning + clumping or LDpred)</span>
prs = <span class="fn">Ridge</span>(alpha=<span class="num">10.0</span>).<span class="fn">fit</span>(G_train, y_train)
y_pred = prs.<span class="fn">predict</span>(G_test)
<span class="fn">print</span>(<span class="str">"Test correlation:"</span>, <span class="fn">round</span>(np.<span class="fn">corrcoef</span>(y_pred, y_test)[<span class="num">0</span>,<span class="num">1</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Top 20% PRS group mean phenotype:"</span>, <span class="fn">round</span>(y_test[y_pred &gt; np.<span class="fn">quantile</span>(y_pred, <span class="num">0.8</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Bottom 20% PRS group mean phenotype:"</span>, <span class="fn">round</span>(y_test[y_pred &lt; np.<span class="fn">quantile</span>(y_pred, <span class="num">0.2</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. DNABert — Genomes as Language</h2>
<p class="l-text">Ji et al. (Bioinformatics 2021) tokenized DNA into overlapping k-mers (default k=6, vocabulary 4⁶ = 4096) and trained a BERT model on the human reference genome. Result: pretrained DNABert embeddings beat handcrafted features for promoter prediction, splice-site detection, transcription factor binding, and variant effect prediction. The same masked-language-modeling recipe that worked for English and proteins works for DNA.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Toy: classify "promoter-like" vs "random" 200-bp DNA windows</span>
<span class="kw">def</span> <span class="fn">random_dna</span>(L):
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(np.random.<span class="fn">choice</span>(<span class="fn">list</span>(<span class="str">"ACGT"</span>), size=L))

<span class="kw">def</span> <span class="fn">promoter_like</span>(L):
    s = <span class="fn">list</span>(<span class="fn">random_dna</span>(L))
    <span class="cm"># plant a TATA box roughly at -25 from a transcription start</span>
    pos = L // <span class="num">2</span> - <span class="num">25</span>
    s[pos:pos+<span class="num">6</span>] = <span class="fn">list</span>(<span class="str">"TATAAA"</span>)
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(s)

seqs, labs = [], []
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>): seqs.<span class="fn">append</span>(<span class="fn">random_dna</span>(<span class="num">200</span>));    labs.<span class="fn">append</span>(<span class="num">0</span>)
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>): seqs.<span class="fn">append</span>(<span class="fn">promoter_like</span>(<span class="num">200</span>)); labs.<span class="fn">append</span>(<span class="num">1</span>)

<span class="cm"># 6-mer tokenization (DNABert default)</span>
<span class="kw">def</span> <span class="fn">kmerize</span>(s, k=<span class="num">6</span>):
    <span class="kw">return</span> <span class="str">' '</span>.<span class="fn">join</span>(s[i:i+k] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>))

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'word'</span>, token_pattern=r<span class="str">'\\S+'</span>)
X = vec.<span class="fn">fit_transform</span>([<span class="fn">kmerize</span>(s) <span class="kw">for</span> s <span class="kw">in</span> seqs])
y = np.<span class="fn">array</span>(labs)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.25</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"Test accuracy:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Distinct 6-mers in vocab:"</span>, X.shape[<span class="num">1</span>])
</code></pre></div>

<p class="l-text">A real DNABert with masked-language-modeling pretraining and 12 transformer layers does this, plus 50 other tasks, with one model. The TF-IDF + LR baseline is a useful sanity check whenever you bring up a real genome-LM pipeline.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Nucleotide Transformer — Scaling Up</h2>
<p class="l-text">Dalla-Torre et al. (Nature Methods 2024, InstaDeep + Meta) trained a family of Nucleotide Transformer models from 50M to 2.5B parameters on 850 species' genomes. Like ESM-2 for proteins, scaling worked: the 2.5B Multispecies model beats DNABert on 18 of 18 evaluation tasks. They also showed a clean scaling law and zero-shot variant-effect prediction matching expert tools on ClinVar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tokenization</div><div class="card-body">6-mer non-overlapping (4096 vocab + specials). 1000 bp = 167 tokens. Allows 6 kb context for the 1000-token base model, 12 kb for larger variants.</div></div>
<div class="calc-card"><div class="card-title">Multispecies</div><div class="card-body">850 genomes spanning bacteria, plants, animals. The bigger / more diverse pretraining corpus generalizes better to unseen organisms — the genomics equivalent of multilingual NLP models.</div></div>
<div class="calc-card"><div class="card-title">Tasks</div><div class="card-body">Splice-site prediction, promoter detection, regulatory element classification, histone-mark prediction, chromatin accessibility. All linear-probe-on-frozen-embeddings.</div></div>
<div class="calc-card"><div class="card-title">2024 successors</div><div class="card-body">HyenaDNA (Nguyen 2023, 1M-bp context), Caduceus (Schiff 2024, equivariant), Evo (Arc Institute 2024, 7B params, 131k context, generative).</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Evo and Long-Context Genome LMs</h2>
<p class="l-text">Evo (Nguyen, Poli et al., Arc Institute, Science 2024) is a 7B-parameter StripedHyena LM trained on 2.7M prokaryotic genomes at single-nucleotide resolution with 131,072-bp context. It is generative — sample tokens to write new DNA — and it learned biology emergently: predicts gene essentiality, designs functional CRISPR-Cas systems, and generates 1-megabase synthetic genomes that resemble real prokaryotes. This is the GPT-3 moment for DNA.</p>

<div class="calc-highlight"><strong>What changes at long context:</strong> regulatory elements (enhancers) can sit 100,000 bp away from the gene they regulate. A 6-kb-context model cannot learn this; a 131k-context model can. The same way that long-context text LMs learn document-level coherence, Evo learns operon-level genome organization.</div>

<p class="l-text">Successor: Evo 2 (Brixi et al., 2025) extended to 9.3T tokens of eukaryotic genomes including human, with 1M-bp context. The trajectory mirrors text LMs — bigger context, more diverse data, more capabilities emerge.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. AlphaMissense — Variant Effect at Scale</h2>
<p class="l-text">Cheng et al. (DeepMind, Science 2023) fine-tuned AlphaFold 2 with weak labels and produced AlphaMissense, which scores all ~71 million possible missense variants in the human exome. Output: predicted pathogenicity score in [0, 1]. 89% of variants get a confident label; 32% are predicted pathogenic, 57% benign. This is the largest variant-effect dataset ever shipped and is now embedded in clinical pipelines like ClinVar's evidence framework.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Architecture</div><div class="card-body">AF2 backbone, fine-tuned on a population-frequency-derived label (rare variants treated as weakly pathogenic, common ones as benign). The structural context is what makes it work.</div></div>
<div class="calc-card"><div class="card-title">Performance</div><div class="card-body">AUROC 0.94 on ClinVar — beats every prior single-tool predictor. Calibrated against allele frequency; one of the few variant tools that gives well-calibrated probabilities.</div></div>
<div class="calc-card"><div class="card-title">Clinical use</div><div class="card-body">ACMG (American College of Medical Genetics) is in the process of formally including AlphaMissense as an evidence line for variant interpretation. End-to-end deep-learning has reached the genetics clinic.</div></div>
<div class="calc-card"><div class="card-title">Open caveats</div><div class="card-body">Weights closed; results are public. Performance drops for non-European ancestries (training data bias). Does not score insertions, deletions, or splicing variants — those still need separate tools.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. The Stack in 2026</h2>
<p class="l-text">A modern clinical-genomics pipeline:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sequencing</div><div class="card-body">Illumina NovaSeq X (short reads, 30x WGS for ~$200) or PacBio Revio / Oxford Nanopore PromethION (long reads).</div></div>
<div class="calc-card"><div class="card-title">Alignment + variant calling</div><div class="card-body">BWA-MEM2 → DeepVariant + GATK joint genotyping. Output: ~5M variants per individual VCF.</div></div>
<div class="calc-card"><div class="card-title">Annotation</div><div class="card-body">VEP / SnpEff for gene impact, AlphaMissense for missense pathogenicity, SpliceAI for splicing variants, gnomAD for population frequency.</div></div>
<div class="calc-card"><div class="card-title">Interpretation</div><div class="card-body">PRS for common-disease risk, monogenic variant flagging for hereditary conditions, pharmacogenomics for drug response. Increasingly, an LLM (Med-PaLM 2, Claude 4.7 Med) summarizes the report.</div></div>
</div>

<p class="l-text">Most of these steps are now ML-based. The next and final lesson stitches the protein side back in: drug-target interaction with a cross-attention model.</p>
</div>`,
tr: `<p class="l-text"><strong>Genom, biyolojideki en uzun, en basit metindir.</strong> 3,2 milyar baz çifti, 4 boyutlu alfabe, hücre başına bir kez yazılır, vücudunuzda farkına varmadan trilyonlarca kez kopyalanır. Genomik şunu sorar: bu dizgede genler nerede? İki insanın dizgeleri arasındaki hangi varyantlar hastalığa neden oluyor? Tüm genomlar üzerinde eğitilmiş bir transformer, BLAST ve GWAS'ın on yıllarını el-mühendisliği yaparak harcadığı şeyi öğrenebilir mi? Cevaplar artan ölçüde evettir.</p>

<p class="l-text">Bu ders 1B-klinik hattını kapsar. Sıralama teknolojisi (kısa okumalar, uzun okumalar, bir Illumina veya Oxford Nanopore makinesinden ne çıkar) ile başlıyoruz, varyant çağırma — bir kişinin genomunun referansa göre nerede farklılaştığının çıkarımı (DeepVariant, Google 2018, klinik hatlarda hizmete giren ilk derin öğrenme genomik aracı). GWAS (genom-çapı ilişkilendirme çalışmaları — Manhattan grafikleri, p-değeri eşikleri, 23andMe hattı), SNP'ler ve poligenik risk skorlarını ele alıyoruz. Genom-dil-modeli dalgasıyla bitiriyoruz: DNABert (Ji 2021), Nucleotide Transformer (Dalla-Torre, Meta/InstaDeep 2024), Evo (Arc Institute 2024). L4'teki örüntü tekrar eder — biyolojik diziler üzerinde maskelenmiş dil modelleme, düzenleyici ve yapısal özellikleri ücretsiz kodlar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Referans genom, okumalar, hizalamalar ve varyantları ayırt etmek — hesaplamalı genomiğin dört nesnesi</li>
<li>Sentetik pileup özellikleri üzerinde DeepVariant'ın üst seviye mimarisini taklit eden bir lojistik regresyon varyant çağırıcı kurmak</li>
<li>Bir Manhattan grafiği okumak ve genom-çapı anlamlılığı (p &lt; 5×10⁻⁸) açıklamak</li>
<li>SNP ağırlıklarından bir poligenik risk skoru hesaplamak ve sınırlarını açıklamak</li>
<li>DNABert ve Nucleotide Transformer'ı eskizlemek — k-mer tokenleştirme, MLM ön-eğitimi, alt-akış görevleri</li>
<li>Evo'yu (uzun-bağlam genom LM'i) ve daha geniş 2024 genom-temel-model dalgasını yerine koymak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Genomiğin Dört Nesnesi</h2>
<p class="l-text">Hesaplamalı genomik şaşırtıcı derecede az birincil türe sahiptir. Bunları bilmek jargon gürültüsünün çoğunu kaldırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Referans genom</div><div class="card-body">"Ortalama insan" dizgesi. Şu an GRCh38 (2013) ve yeni T2T-CHM13 (2022, ilk telomer-telomer). Kromozom başına bir dizge, toplam ~3,2 milyar bp.</div></div>
<div class="calc-card"><div class="card-title">Okumalar</div><div class="card-body">Bir sıralayıcı tarafından üretilen kısa DNA fragmanları. Illumina: 150 bp çiftleri, 30-100x kapsama. Oxford Nanopore / PacBio: 10-100 kb tek okumalar. FASTQ olarak depolanır — dizi + kalite skorları.</div></div>
<div class="calc-card"><div class="card-title">Hizalamalar</div><div class="card-body">Referansa geri haritalanan okumalar. BWA-MEM (Li 2009) ve minimap2 (Li 2018) baskın hizalayıcılardır. Çıktı BAM'dir — her alt-akış aracı tarafından kullanılan ikili indeksli format.</div></div>
<div class="calc-card"><div class="card-title">Varyantlar</div><div class="card-body">Referanstan farklılıklar: tek-nükleotid varyantları (SNV'ler), küçük indel'ler, yapısal varyantlar. BAM'lerden GATK HaplotypeCaller veya DeepVariant tarafından çağrılır; VCF olarak depolanır. Tipik bir insan referansa göre ~4-5 milyon varyant taşır.</div></div>
</div>

<div class="calc-highlight"><strong>Hat:</strong> FASTQ (okumalar) → BAM (hizalamalar) → VCF (varyantlar) → alt-akış analizi (GWAS, klinik raporlama, poligenik skorlar). Her klinik genomik şirketi bunun bir sürümünü yayımlar.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Varyant Çağırma — Pileup Problemi</h2>
<p class="l-text">Her genomik pozisyonda ~30 hizalı okuma vardır, her biri kendi gözlenen nükleotidi ve kalite skoruyla. Soru: bu pozisyon bu bireyde bir varyant mı yoksa sadece sıralama gürültüsü mü? Eski araçlar (samtools mpileup, GATK) elle ayarlanmış olasılıksal modeller kullandı. DeepVariant (Poplin ve ark., Nature Biotechnology 2018) bunu görüntü sınıflandırması olarak yeniden çerçeveledi — pileup'ı çok kanallı görüntü olarak işle (okuma bazı, kalite, haritalama kalitesi, iplikçik), bir Inception CNN'e besle, {hom_ref, het, hom_alt} çıktı ver.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DeepVariant neden kazandı</div><div class="card-body">Yeniden ayarlama olmadan sıralama teknolojileri arasında genelleşir (Illumina, PacBio, ONT). İnsanlarda, bitkilerde, hayvanlarda aynı model son teknoloji. Homopolimerler gibi zorlu bölgelerde daha az yanlış pozitif.</div></div>
<div class="calc-card"><div class="card-title">Nereye dağıtıldı</div><div class="card-body">Google Cloud'un Variant Transforms'unda, Verily klinik hatlarında, BabySeq2 yenidoğan-tarama denemesinde, All of Us araştırma programında (1M+ genom) varsayılan.</div></div>
<div class="calc-card"><div class="card-title">Halefler</div><div class="card-body">DeepConsensus (PacBio HiFi konsensüs, 2022), PEPPER-Margin-DeepVariant (uzun okumalar, 2021), Clair3 (küçük CNN, hızlı 2022).</div></div>
<div class="calc-card"><div class="card-title">2026 temeli</div><div class="card-body">Klinik laboratuvarlar için DeepVariant + GATK ortak çağırma. Genome in a Bottle kıyaslamasında %99,9+ SNV duyarlılığı. İndel doğruluğu %95+.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — DeepVariant Docker + referans genom gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production: DeepVariant runs as a Docker pipeline</span>
<span class="cm"># docker run -v "$DATA":/input google/deepvariant:1.6.0 \\</span>
<span class="cm">#   /opt/deepvariant/bin/run_deepvariant \\</span>
<span class="cm">#   --model_type=WGS \\</span>
<span class="cm">#   --ref=/input/GRCh38.fa \\</span>
<span class="cm">#   --reads=/input/sample.bam \\</span>
<span class="cm">#   --output_vcf=/input/calls.vcf.gz \\</span>
<span class="cm">#   --num_shards=16</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. sklearn'de Oyuncak DeepVariant</h2>
<p class="l-text">DeepVariant CNN'inin işi şuna indirgenir: pozisyon-başına pileup özelliklerinden genotipi sınıflandır. Aynı mimariyi kavramsal olarak tablosal özellikler üzerinde lojistik regresyon ile kurabiliriz. Doğruluk DeepVariant'tan çok daha düşüktür — ama veri akışı aynıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Synthesize 3000 candidate variant sites; features per site:</span>
<span class="cm">#   depth  : number of aligned reads (15-50)</span>
<span class="cm">#   alt_frac : fraction of reads showing the alt allele</span>
<span class="cm">#   mean_qual: mean base quality of alt-supporting reads</span>
<span class="cm">#   strand_bias : abs imbalance of forward vs reverse alt reads</span>
<span class="cm">#   mapping_qual: mean mapping quality</span>
N = <span class="num">3000</span>
depth = np.random.<span class="fn">randint</span>(<span class="num">15</span>, <span class="num">51</span>, N)
true_genotype = np.random.<span class="fn">choice</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">2</span>], size=N, p=[<span class="num">0.6</span>, <span class="num">0.3</span>, <span class="num">0.1</span>])  <span class="cm"># 0=hom_ref, 1=het, 2=hom_alt</span>
expected_alt = np.<span class="fn">array</span>([<span class="num">0.02</span>, <span class="num">0.5</span>, <span class="num">0.97</span>])[true_genotype]
alt_frac = np.<span class="fn">clip</span>(expected_alt + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.06</span>, N), <span class="num">0</span>, <span class="num">1</span>)
mean_qual = np.random.<span class="fn">normal</span>(<span class="num">35</span>, <span class="num">4</span>, N)
strand_bias = np.<span class="fn">abs</span>(np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.15</span>, N))
mapping_qual = np.random.<span class="fn">normal</span>(<span class="num">55</span>, <span class="num">6</span>, N)

X = np.<span class="fn">column_stack</span>([depth, alt_frac, mean_qual, strand_bias, mapping_qual])
y = true_genotype
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>, multi_class=<span class="str">'multinomial'</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"Test accuracy:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))
<span class="fn">print</span>(<span class="fn">classification_report</span>(yte, clf.<span class="fn">predict</span>(Xte), target_names=[<span class="str">'hom_ref'</span>,<span class="str">'het'</span>,<span class="str">'hom_alt'</span>], digits=<span class="num">3</span>))
</code></pre></div>

<p class="l-text">Model hom_ref'i çiviler (kolay durum — neredeyse hiç alt okuma yok) ve het'leri ile hom_alt'ları alt_frac'a dayalı olarak takas eder. DeepVariant iki kritik şey ekler: konvolüsyonel bağlam (komşu pozisyonlardan sinyaller) ve pileup başına çok daha fazla özellik — ama tahmin problemi aynı şekildedir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GWAS — Özellik-İlişkili Varyantları Bulma</h2>
<p class="l-text">Bir genom-çapı ilişkilendirme çalışması, 10⁵-10⁶ kişiden ~10⁶ SNP alır ve her SNP için fenotipin genotip üzerine bir regresyonunu çalıştırır. Çıktı bir Manhattan grafiğidir — x'te kromozomal pozisyon, y'de –log₁₀(p-değeri). Genom-çapı anlamlılık eşiğinin (p &lt; 5×10⁻⁸ — ~10⁶ test için Bonferroni-düzeltilmiş) üzerindeki tepeler raporlanan ilişkilendirmelerdir.</p>

<div class="katex-block">$$y_i = \alpha + \beta \cdot g_i + \gamma^\top c_i + \epsilon_i, \qquad p = P(|\hat\beta| \ge \text{obs} \mid \beta=0)$$</div>

<p class="l-text">Burada g_i ∈ {0, 1, 2} birey i için alt allelinin sayısıdır, c_i ko-değişkenlerdir (yaş, cinsiyet, etnik köken için temel bileşenler) ve test β'nın 0'dan anlamlı şekilde farklı olup olmadığıdır. Ünlü başarılar: Alzheimer için APOE, BMI için FTO, otoimmün hastalık için HLA.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy <span class="kw">import</span> stats
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Simulate 1000 individuals × 200 SNPs; SNP 73 is causal with effect size 0.4</span>
N, M = <span class="num">1000</span>, <span class="num">200</span>
G = np.random.<span class="fn">binomial</span>(<span class="num">2</span>, <span class="num">0.3</span>, size=(N, M))
y = <span class="num">0.4</span> * G[:, <span class="num">73</span>] + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1</span>, N)

logp = np.<span class="fn">zeros</span>(M)
<span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(M):
    r, p = stats.<span class="fn">pearsonr</span>(G[:, j], y)
    logp[j] = -np.<span class="fn">log10</span>(<span class="fn">max</span>(p, <span class="num">1e-300</span>))

threshold = -np.<span class="fn">log10</span>(<span class="num">5e-8</span>)
hits = np.<span class="fn">where</span>(logp &gt; threshold)[<span class="num">0</span>]
<span class="fn">print</span>(f<span class="str">"SNPs above genome-wide threshold (-log10 p &gt; {threshold:.1f}): {hits.tolist()}"</span>)
<span class="fn">print</span>(f<span class="str">"Top 5 SNPs by significance: {np.argsort(logp)[-5:][::-1].tolist()}"</span>)
<span class="fn">print</span>(f<span class="str">"Causal SNP at index 73 has -log10(p) = {logp[73]:.2f}"</span>)
</code></pre></div>

<p class="l-text">Gerçek GWAS katalogları (UK Biobank, FinnGen, BioBank Japan) 100.000+ özellik-ilişkili SNP buldu. Çoğunun küçücük etki büyüklüğü vardır — boy &gt;10.000 SNP'den etkilenir, her biri ~0,1 mm katkı sağlar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Poligenik Risk Skorları</h2>
<p class="l-text">GWAS size SNP etkileri β_j verdikten sonra, bir bireyin riskini etkilerle ağırlıklandırılmış genotipleri toplayarak tahmin edin:</p>

<div class="katex-block">$$\text{PRS}_i = \sum_{j=1}^{M} \hat\beta_j \cdot g_{ij}$$</div>

<p class="l-text">Daha yüksek PRS → daha yüksek özellik/hastalık riski. Koroner arter hastalığı için PRS (Khera 2018), ortalama riskin 3 katında olan bireylerin üst %8'ini tanımlar — klinik tarama için uygulanabilirdir. Uyarı: PRS'lerin etnik kökenler arası taşınabilirliği zayıftır; çoğu Avrupa verisi üzerinde eğitilmiştir ve Afrika ile Doğu Asya kohortlarında düşük performans gösterir. Bu, 2026'daki klinik genomiğin çözülmemiş sorunlarından biridir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

N_train, N_test, M = <span class="num">800</span>, <span class="num">200</span>, <span class="num">200</span>
G_train = np.random.<span class="fn">binomial</span>(<span class="num">2</span>, <span class="num">0.3</span>, size=(N_train, M))
G_test  = np.random.<span class="fn">binomial</span>(<span class="num">2</span>, <span class="num">0.3</span>, size=(N_test,  M))

<span class="cm"># 5 causal SNPs</span>
causal = [<span class="num">13</span>, <span class="num">47</span>, <span class="num">73</span>, <span class="num">121</span>, <span class="num">188</span>]
betas = np.<span class="fn">zeros</span>(M); betas[causal] = [<span class="num">0.5</span>, -<span class="num">0.3</span>, <span class="num">0.4</span>, <span class="num">0.25</span>, -<span class="num">0.35</span>]
y_train = G_train @ betas + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1.0</span>, N_train)
y_test  = G_test  @ betas + np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">1.0</span>, N_test)

<span class="cm"># Ridge regression as a simple PRS learner (real PRS use LD-pruning + clumping or LDpred)</span>
prs = <span class="fn">Ridge</span>(alpha=<span class="num">10.0</span>).<span class="fn">fit</span>(G_train, y_train)
y_pred = prs.<span class="fn">predict</span>(G_test)
<span class="fn">print</span>(<span class="str">"Test correlation:"</span>, <span class="fn">round</span>(np.<span class="fn">corrcoef</span>(y_pred, y_test)[<span class="num">0</span>,<span class="num">1</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Top 20% PRS group mean phenotype:"</span>, <span class="fn">round</span>(y_test[y_pred &gt; np.<span class="fn">quantile</span>(y_pred, <span class="num">0.8</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Bottom 20% PRS group mean phenotype:"</span>, <span class="fn">round</span>(y_test[y_pred &lt; np.<span class="fn">quantile</span>(y_pred, <span class="num">0.2</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. DNABert — Genomları Dil Olarak</h2>
<p class="l-text">Ji ve ark. (Bioinformatics 2021) DNA'yı örtüşen k-mer'lere (varsayılan k=6, sözcük 4⁶ = 4096) tokenleştirdi ve insan referans genomu üzerinde bir BERT modeli eğitti. Sonuç: ön-eğitimli DNABert gömmeleri promotör tahmini, ekleme bölgesi tespiti, transkripsiyon faktörü bağlanması ve varyant etki tahmini için elle hazırlanmış özellikleri yendi. İngilizce ve proteinler için işe yarayan aynı maskelenmiş-dil-modelleme tarifi DNA için de işe yarar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Toy: classify "promoter-like" vs "random" 200-bp DNA windows</span>
<span class="kw">def</span> <span class="fn">random_dna</span>(L):
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(np.random.<span class="fn">choice</span>(<span class="fn">list</span>(<span class="str">"ACGT"</span>), size=L))

<span class="kw">def</span> <span class="fn">promoter_like</span>(L):
    s = <span class="fn">list</span>(<span class="fn">random_dna</span>(L))
    <span class="cm"># plant a TATA box roughly at -25 from a transcription start</span>
    pos = L // <span class="num">2</span> - <span class="num">25</span>
    s[pos:pos+<span class="num">6</span>] = <span class="fn">list</span>(<span class="str">"TATAAA"</span>)
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(s)

seqs, labs = [], []
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>): seqs.<span class="fn">append</span>(<span class="fn">random_dna</span>(<span class="num">200</span>));    labs.<span class="fn">append</span>(<span class="num">0</span>)
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>): seqs.<span class="fn">append</span>(<span class="fn">promoter_like</span>(<span class="num">200</span>)); labs.<span class="fn">append</span>(<span class="num">1</span>)

<span class="cm"># 6-mer tokenization (DNABert default)</span>
<span class="kw">def</span> <span class="fn">kmerize</span>(s, k=<span class="num">6</span>):
    <span class="kw">return</span> <span class="str">' '</span>.<span class="fn">join</span>(s[i:i+k] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>))

vec = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">'word'</span>, token_pattern=r<span class="str">'\\S+'</span>)
X = vec.<span class="fn">fit_transform</span>([<span class="fn">kmerize</span>(s) <span class="kw">for</span> s <span class="kw">in</span> seqs])
y = np.<span class="fn">array</span>(labs)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.25</span>, random_state=<span class="num">0</span>, stratify=y)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(<span class="str">"Test accuracy:"</span>, <span class="fn">round</span>(clf.<span class="fn">score</span>(Xte, yte), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Distinct 6-mers in vocab:"</span>, X.shape[<span class="num">1</span>])
</code></pre></div>

<p class="l-text">Maskelenmiş-dil-modeli ön-eğitimi ve 12 transformer katmanı ile gerçek bir DNABert bunu yapar, artı tek bir modelle 50 başka görev. TF-IDF + LR temeli, gerçek bir genom-LM hattı kurarken her zaman yararlı bir akıl-sağlığı kontrolüdür.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Nucleotide Transformer — Ölçek Yukarı</h2>
<p class="l-text">Dalla-Torre ve ark. (Nature Methods 2024, InstaDeep + Meta) 50M'den 2,5B parametreye uzanan bir Nucleotide Transformer aile modeli ailesini 850 türün genomu üzerinde eğitti. Proteinler için ESM-2 gibi, ölçeklendirme işe yaradı: 2,5B Multispecies modeli, 18 değerlendirme görevinin 18'inde DNABert'i geçer. Ayrıca temiz bir ölçeklendirme yasası ve ClinVar üzerinde uzman araçlarla eşleşen sıfır-atış varyant-etki tahmini gösterdiler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tokenleştirme</div><div class="card-body">Örtüşmeyen 6-mer (4096 sözcük + özel). 1000 bp = 167 token. 1000-token taban model için 6 kb bağlam, daha büyük varyantlar için 12 kb sağlar.</div></div>
<div class="calc-card"><div class="card-title">Çok-türlü</div><div class="card-body">Bakteri, bitki, hayvan boyunca 850 genom. Daha büyük / daha çeşitli ön-eğitim derlemi görülmemiş organizmalara daha iyi genelleşir — çok dilli NLP modellerinin genomik eşdeğeri.</div></div>
<div class="calc-card"><div class="card-title">Görevler</div><div class="card-body">Ekleme bölgesi tahmini, promotör tespiti, düzenleyici eleman sınıflandırması, histon-işareti tahmini, kromatin erişilebilirliği. Hepsi dondurulmuş-gömmeler-üzerinde-doğrusal-probe.</div></div>
<div class="calc-card"><div class="card-title">2024 halefler</div><div class="card-body">HyenaDNA (Nguyen 2023, 1M-bp bağlam), Caduceus (Schiff 2024, eşvariyant), Evo (Arc Institute 2024, 7B parametre, 131k bağlam, üretken).</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Evo ve Uzun-Bağlam Genom LM'leri</h2>
<p class="l-text">Evo (Nguyen, Poli ve ark., Arc Institute, Science 2024), 2,7M prokaryotik genom üzerinde tek-nükleotid çözünürlüğünde 131.072-bp bağlamla eğitilmiş 7B-parametreli bir StripedHyena LM'idir. Üretkendir — yeni DNA yazmak için token örnekle — ve biyolojiyi ortaya çıkararak öğrendi: gen önemini tahmin eder, işlevsel CRISPR-Cas sistemleri tasarlar ve gerçek prokaryotlara benzer 1 megabaz sentetik genomlar üretir. Bu DNA için GPT-3 anıdır.</p>

<div class="calc-highlight"><strong>Uzun bağlamda ne değişir:</strong> düzenleyici elemanlar (güçlendiriciler) düzenledikleri genden 100.000 bp uzakta oturabilir. 6-kb-bağlamlı bir model bunu öğrenemez; 131k-bağlamlı bir model öğrenebilir. Uzun-bağlamlı metin LM'lerinin belge düzeyinde tutarlılık öğrenmesiyle aynı şekilde, Evo operon-düzeyinde genom organizasyonunu öğrenir.</div>

<p class="l-text">Halef: Evo 2 (Brixi ve ark., 2025), insan dahil ökaryotik genomların 9,3T token'ına ve 1M-bp bağlama genişletildi. Yörünge metin LM'lerini yansıtır — daha büyük bağlam, daha çeşitli veri, daha fazla yetenek ortaya çıkar.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. AlphaMissense — Ölçekte Varyant Etkisi</h2>
<p class="l-text">Cheng ve ark. (DeepMind, Science 2023) AlphaFold 2'yi zayıf etiketlerle ince ayar yaptı ve insan exome'undaki olası tüm ~71 milyon missense varyantı puanlayan AlphaMissense'i üretti. Çıktı: [0, 1] aralığında tahmini patojeniklik skoru. Varyantların %89'u güvenli bir etiket alır; %32'si patojenik tahmin edilir, %57'si zararsız. Bu, şimdiye kadar yayımlanan en büyük varyant-etki veri kümesidir ve şimdi ClinVar'ın kanıt çerçevesi gibi klinik hatlara gömülüdür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mimari</div><div class="card-body">AF2 omurgası, popülasyon-frekansından türetilmiş bir etiket üzerinde ince ayarlanmış (nadir varyantlar zayıf patojenik, yaygın olanlar zararsız olarak ele alındı). Yapısal bağlam, çalışmasını sağlayan şeydir.</div></div>
<div class="calc-card"><div class="card-title">Performans</div><div class="card-body">ClinVar'da AUROC 0,94 — her önceki tek-araç tahminciyi geçer. Allel frekansına karşı kalibre edilmiş; iyi kalibre olasılıklar veren birkaç varyant aracından biridir.</div></div>
<div class="calc-card"><div class="card-title">Klinik kullanım</div><div class="card-body">ACMG (American College of Medical Genetics), AlphaMissense'i varyant yorumlaması için bir kanıt hattı olarak resmi olarak dahil etme sürecindedir. Uçtan uca derin-öğrenme genetik kliniğine ulaştı.</div></div>
<div class="calc-card"><div class="card-title">Açık çekinceler</div><div class="card-body">Ağırlıklar kapalı; sonuçlar halka açık. Avrupalı olmayan etnik kökenler için performans düşer (eğitim verisi önyargısı). Eklemeleri, silinmeleri veya ekleme varyantlarını puanlamaz — bunlar hala ayrı araç gerektirir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. 2026'da Yığın</h2>
<p class="l-text">Modern bir klinik-genomik hattı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıralama</div><div class="card-body">Illumina NovaSeq X (kısa okumalar, ~200$ için 30x WGS) veya PacBio Revio / Oxford Nanopore PromethION (uzun okumalar).</div></div>
<div class="calc-card"><div class="card-title">Hizalama + varyant çağırma</div><div class="card-body">BWA-MEM2 → DeepVariant + GATK ortak genotipleme. Çıktı: birey VCF başına ~5M varyant.</div></div>
<div class="calc-card"><div class="card-title">Açıklama</div><div class="card-body">Gen etkisi için VEP / SnpEff, missense patojenikliği için AlphaMissense, ekleme varyantları için SpliceAI, popülasyon frekansı için gnomAD.</div></div>
<div class="calc-card"><div class="card-title">Yorum</div><div class="card-body">Yaygın hastalık riski için PRS, kalıtsal koşullar için monogenik varyant işaretleme, ilaç tepkisi için farmakogenomik. Giderek bir LLM (Med-PaLM 2, Claude 4.7 Med) raporu özetliyor.</div></div>
</div>

<p class="l-text">Bu adımların çoğu artık ML-tabanlıdır. Sonraki ve son ders protein tarafını yeniden bir araya getirir: çapraz-dikkat modeli ile ilaç-hedef etkileşimi.</p>
</div>`
};
