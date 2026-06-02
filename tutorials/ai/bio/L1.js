window.BIO_L1 = {
en: `<p class="l-text"><strong>Biology is, at its informational core, a sequence problem.</strong> A genome is a string over the alphabet {A, C, G, T}; an mRNA is a string over {A, C, G, U}; a protein is a string over the 20 standard amino acids. Almost every modern computational-biology breakthrough — BLAST in 1990, the Human Genome Project finishing in 2003, AlphaFold 2 in 2021, ESMFold's 600 million predicted structures in 2022, AlphaFold 3 with full ligand support in 2024 — comes from treating these strings the same way an NLP person treats text: tokens, alignments, language models, embeddings.</p>

<p class="l-text">This first lesson lays the alphabet. We walk through the three central biopolymers (DNA, RNA, protein) and the genetic code that maps codons to amino acids. We meet the FASTA file format that every database in the world (UniProt, NCBI, PDB) speaks. We then build the workhorse algorithm of bioinformatics — pairwise sequence alignment via Smith-Waterman dynamic programming — from scratch in numpy, and we sketch BLAST's seed-and-extend heuristic that made alignment scale to billions of sequences. The whole lesson is the on-ramp; from L2 onward we leave 1D strings and start predicting 3D structure.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and parse FASTA files; translate DNA to protein via the genetic code</li>
<li>Compute the Smith-Waterman optimal local alignment in O(mn) with a numpy DP matrix</li>
<li>Score alignments with BLOSUM62 and explain why log-odds matrices beat naive identity</li>
<li>Sketch BLAST's seed-extend-evaluate pipeline and why it is heuristic</li>
<li>Use Biopython for production parsing (and know which calls block in the browser)</li>
<li>Place sequence alignment in the larger ML/NLP picture: it is the n-gram era of biology</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Three Biopolymers and Their Alphabets</h2>
<p class="l-text">DNA is a double helix of nucleotides drawn from a 4-letter alphabet — adenine, cytosine, guanine, thymine — base-paired A-T and C-G. RNA replaces thymine with uracil and is usually single-stranded. Proteins are linear chains of amino acids drawn from a 20-letter alphabet (plus rare selenocysteine and pyrrolysine). The central dogma — DNA is transcribed into mRNA, mRNA is translated into protein — is a sequence of two string-to-string functions.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DNA</div><div class="card-body">Alphabet <code>{A,C,G,T}</code>. Stored in chromosomes (humans: ~3.2 billion bp across 23 pairs). Double-stranded; the two strands are reverse complements.</div></div>
<div class="calc-card"><div class="card-title">RNA</div><div class="card-body">Alphabet <code>{A,C,G,U}</code>. Messenger RNA carries the recipe to ribosomes. Other classes (tRNA, rRNA, miRNA, lncRNA) do regulation and structure.</div></div>
<div class="calc-card"><div class="card-title">Protein</div><div class="card-body">Alphabet of 20 amino acids (A R N D C E Q G H I L K M F P S T W Y V). 3-letter codons → 1 amino acid via the genetic code. Folds into 3D structure that determines function.</div></div>
<div class="calc-card"><div class="card-title">Why a 20-letter alphabet?</div><div class="card-body">Each amino acid has a distinct side chain — hydrophobic, charged, polar, aromatic. The vocabulary is what gives proteins their chemical diversity. NLP analogy: 20 amino acids ≈ a small but expressive token set, like a BPE vocab for biology.</div></div>
</div>

<div class="calc-highlight"><strong>Scale of the data:</strong> UniProt (Sept 2024) has 250 million protein sequences; NCBI Nucleotide has 8+ billion records; the PDB has 220k experimentally-determined 3D structures, while AlphaFold DB hosts 214 million predicted ones. Biology has gone from data-poor to data-rich in 20 years.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Genetic Code and Translation</h2>
<p class="l-text">The genetic code is a many-to-one map from 64 codons (4³) to 20 amino acids plus a stop signal. It is degenerate (multiple codons encode the same amino acid, e.g. <code>GCU GCC GCA GCG</code> all → Alanine) and almost universal across life. Translation reads mRNA in 3-nucleotide windows starting at the AUG start codon and ends at a stop codon (UAA, UAG, UGA).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Hand-rolled translator — pure-Python, runs anywhere</span>
CODON_TABLE = {
    <span class="str">'UUU'</span>:<span class="str">'F'</span>,<span class="str">'UUC'</span>:<span class="str">'F'</span>,<span class="str">'UUA'</span>:<span class="str">'L'</span>,<span class="str">'UUG'</span>:<span class="str">'L'</span>,<span class="str">'CUU'</span>:<span class="str">'L'</span>,<span class="str">'CUC'</span>:<span class="str">'L'</span>,<span class="str">'CUA'</span>:<span class="str">'L'</span>,<span class="str">'CUG'</span>:<span class="str">'L'</span>,
    <span class="str">'AUU'</span>:<span class="str">'I'</span>,<span class="str">'AUC'</span>:<span class="str">'I'</span>,<span class="str">'AUA'</span>:<span class="str">'I'</span>,<span class="str">'AUG'</span>:<span class="str">'M'</span>,<span class="str">'GUU'</span>:<span class="str">'V'</span>,<span class="str">'GUC'</span>:<span class="str">'V'</span>,<span class="str">'GUA'</span>:<span class="str">'V'</span>,<span class="str">'GUG'</span>:<span class="str">'V'</span>,
    <span class="str">'UCU'</span>:<span class="str">'S'</span>,<span class="str">'UCC'</span>:<span class="str">'S'</span>,<span class="str">'UCA'</span>:<span class="str">'S'</span>,<span class="str">'UCG'</span>:<span class="str">'S'</span>,<span class="str">'CCU'</span>:<span class="str">'P'</span>,<span class="str">'CCC'</span>:<span class="str">'P'</span>,<span class="str">'CCA'</span>:<span class="str">'P'</span>,<span class="str">'CCG'</span>:<span class="str">'P'</span>,
    <span class="str">'ACU'</span>:<span class="str">'T'</span>,<span class="str">'ACC'</span>:<span class="str">'T'</span>,<span class="str">'ACA'</span>:<span class="str">'T'</span>,<span class="str">'ACG'</span>:<span class="str">'T'</span>,<span class="str">'GCU'</span>:<span class="str">'A'</span>,<span class="str">'GCC'</span>:<span class="str">'A'</span>,<span class="str">'GCA'</span>:<span class="str">'A'</span>,<span class="str">'GCG'</span>:<span class="str">'A'</span>,
    <span class="str">'UAU'</span>:<span class="str">'Y'</span>,<span class="str">'UAC'</span>:<span class="str">'Y'</span>,<span class="str">'UAA'</span>:<span class="str">'*'</span>,<span class="str">'UAG'</span>:<span class="str">'*'</span>,<span class="str">'CAU'</span>:<span class="str">'H'</span>,<span class="str">'CAC'</span>:<span class="str">'H'</span>,<span class="str">'CAA'</span>:<span class="str">'Q'</span>,<span class="str">'CAG'</span>:<span class="str">'Q'</span>,
    <span class="str">'AAU'</span>:<span class="str">'N'</span>,<span class="str">'AAC'</span>:<span class="str">'N'</span>,<span class="str">'AAA'</span>:<span class="str">'K'</span>,<span class="str">'AAG'</span>:<span class="str">'K'</span>,<span class="str">'GAU'</span>:<span class="str">'D'</span>,<span class="str">'GAC'</span>:<span class="str">'D'</span>,<span class="str">'GAA'</span>:<span class="str">'E'</span>,<span class="str">'GAG'</span>:<span class="str">'E'</span>,
    <span class="str">'UGU'</span>:<span class="str">'C'</span>,<span class="str">'UGC'</span>:<span class="str">'C'</span>,<span class="str">'UGA'</span>:<span class="str">'*'</span>,<span class="str">'UGG'</span>:<span class="str">'W'</span>,<span class="str">'CGU'</span>:<span class="str">'R'</span>,<span class="str">'CGC'</span>:<span class="str">'R'</span>,<span class="str">'CGA'</span>:<span class="str">'R'</span>,<span class="str">'CGG'</span>:<span class="str">'R'</span>,
    <span class="str">'AGU'</span>:<span class="str">'S'</span>,<span class="str">'AGC'</span>:<span class="str">'S'</span>,<span class="str">'AGA'</span>:<span class="str">'R'</span>,<span class="str">'AGG'</span>:<span class="str">'R'</span>,<span class="str">'GGU'</span>:<span class="str">'G'</span>,<span class="str">'GGC'</span>:<span class="str">'G'</span>,<span class="str">'GGA'</span>:<span class="str">'G'</span>,<span class="str">'GGG'</span>:<span class="str">'G'</span>
}

<span class="kw">def</span> <span class="fn">translate</span>(rna):
    out = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(rna) - <span class="num">2</span>, <span class="num">3</span>):
        aa = CODON_TABLE.<span class="fn">get</span>(rna[i:i+<span class="num">3</span>], <span class="str">'X'</span>)
        <span class="kw">if</span> aa == <span class="str">'*'</span>: <span class="kw">break</span>
        out.<span class="fn">append</span>(aa)
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(out)

mrna = <span class="str">"AUGGCCAUUGUAAUGGGCCGCUGAAAGGGUGCCCGAUAG"</span>
<span class="fn">print</span>(<span class="str">"Protein:"</span>, <span class="fn">translate</span>(mrna))   <span class="cm"># MAIVMGR — a small peptide stops at UGA</span>
<span class="fn">print</span>(<span class="str">"Length :"</span>, <span class="fn">len</span>(<span class="fn">translate</span>(mrna)), <span class="str">"amino acids"</span>)
</code></pre></div>

<p class="l-text">This code reads codons left to right, looks each one up in the standard table, and stops at the first stop codon. Notice the stop after position 7: real mRNAs typically have a 5' UTR before the start codon and a 3' UTR after the stop, which we are skipping for clarity.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. FASTA — The Lingua Franca</h2>
<p class="l-text">A FASTA record is a header line beginning with <code>&gt;</code> followed by lines of sequence. Every public database speaks it. Biopython's <code>Bio.SeqIO</code> is the reference parser, but the format is so simple that a 10-line parser is fine for production.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Biopython blocked in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production: Biopython handles compressed files, multi-line sequences, gaps</span>
<span class="kw">from</span> Bio <span class="kw">import</span> SeqIO
<span class="kw">for</span> rec <span class="kw">in</span> SeqIO.<span class="fn">parse</span>(<span class="str">"uniprot_sprot.fasta"</span>, <span class="str">"fasta"</span>):
    <span class="fn">print</span>(rec.id, <span class="fn">len</span>(rec.seq), <span class="fn">str</span>(rec.seq)[:<span class="num">30</span>])
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">FASTA is so simple we can hand-roll the parser. Same output as Biopython for well-formed files.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>fasta_text = <span class="str">"""&gt;sp|P0DTC2|SPIKE_SARS2 Spike glycoprotein
MFVFLVLLPLVSSQCVNLTTRTQLPPAYTNSFTRGVYYPDKVFRSSVLHSTQDLFLPFFSN
VTWFHAIHVSGTNGTKRFDNPVLPFNDGVYFASTEKSNIIRGWIFGTTLDSKTQSLLIVNN
&gt;sp|P12345|TEST Toy sequence
MAGIVAEKGCSCNYSAA"""</span>

<span class="kw">def</span> <span class="fn">parse_fasta</span>(text):
    records, header, seq = [], <span class="kw">None</span>, []
    <span class="kw">for</span> line <span class="kw">in</span> text.<span class="fn">splitlines</span>():
        <span class="kw">if</span> line.<span class="fn">startswith</span>(<span class="str">'&gt;'</span>):
            <span class="kw">if</span> header: records.<span class="fn">append</span>((header, <span class="str">''</span>.<span class="fn">join</span>(seq)))
            header, seq = line[<span class="num">1</span>:].<span class="fn">strip</span>(), []
        <span class="kw">else</span>:
            seq.<span class="fn">append</span>(line.<span class="fn">strip</span>())
    <span class="kw">if</span> header: records.<span class="fn">append</span>((header, <span class="str">''</span>.<span class="fn">join</span>(seq)))
    <span class="kw">return</span> records

<span class="kw">for</span> hdr, s <span class="kw">in</span> <span class="fn">parse_fasta</span>(fasta_text):
    <span class="fn">print</span>(f<span class="str">"{hdr[:40]:40s}  len={len(s):4d}  start={s[:20]}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Sequence Identity — The Naive Score</h2>
<p class="l-text">Before alignment, we need a score. The naive choice is percent identity: fraction of positions where two equal-length strings agree. It is fine for very similar sequences but breaks down for distant homologs because not all substitutions are equally likely. Leucine ↔ Isoleucine (both hydrophobic) is a near-silent change; Leucine ↔ Proline (proline kinks the backbone) is catastrophic.</p>

<div class="katex-block">$$\text{identity}(x, y) = \frac{1}{n} \sum_{i=1}^{n} \mathbb{1}[x_i = y_i]$$</div>

<p class="l-text">The fix is a substitution matrix that gives positive scores to chemically similar pairs and negative scores to disruptive ones. BLOSUM62 (Henikoff &amp; Henikoff 1992) is derived from observed substitutions in conserved blocks of related proteins; the entry is a log-odds ratio:</p>

<div class="katex-block">$$\text{BLOSUM62}(a,b) = \frac{1}{\lambda} \log \frac{p_{ab}}{q_a \, q_b}$$</div>

<p class="l-text">where p_{ab} is the observed joint probability of seeing a aligned with b in trusted alignments, q_a and q_b are background frequencies, and lambda is a scale factor (1/2 bit by convention). Positive on the diagonal, negative for chemically incompatible swaps, large positive for chemically equivalent swaps like L/I.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Smith-Waterman from Scratch</h2>
<p class="l-text">Smith-Waterman (1981) finds the optimal <em>local</em> alignment between two sequences in O(mn) time using dynamic programming. Three rules: match/mismatch from the diagonal, gap from the left or top, and clamp negative scores to 0 (this is what makes it local — bad regions reset). The traceback from the maximal cell yields the alignment.</p>

<div class="katex-block">$$H_{i,j} = \max\!\left\{ 0,\; H_{i-1,j-1} + s(x_i, y_j),\; H_{i-1,j} - g,\; H_{i,j-1} - g \right\}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">smith_waterman</span>(x, y, <span class="kw">match</span>=<span class="num">2</span>, mismatch=-<span class="num">1</span>, gap=-<span class="num">2</span>):
    m, n = <span class="fn">len</span>(x), <span class="fn">len</span>(y)
    H = np.<span class="fn">zeros</span>((m+<span class="num">1</span>, n+<span class="num">1</span>), dtype=<span class="fn">int</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, m+<span class="num">1</span>):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, n+<span class="num">1</span>):
            s = <span class="kw">match</span> <span class="kw">if</span> x[i-<span class="num">1</span>] == y[j-<span class="num">1</span>] <span class="kw">else</span> mismatch
            H[i,j] = <span class="fn">max</span>(<span class="num">0</span>, H[i-<span class="num">1</span>,j-<span class="num">1</span>] + s, H[i-<span class="num">1</span>,j] + gap, H[i,j-<span class="num">1</span>] + gap)
    <span class="cm"># traceback from the maximal cell</span>
    i, j = np.<span class="fn">unravel_index</span>(np.<span class="fn">argmax</span>(H), H.shape)
    score = H[i,j]
    ax, ay = [], []
    <span class="kw">while</span> i &gt; <span class="num">0</span> <span class="kw">and</span> j &gt; <span class="num">0</span> <span class="kw">and</span> H[i,j] != <span class="num">0</span>:
        <span class="kw">if</span> H[i,j] == H[i-<span class="num">1</span>,j-<span class="num">1</span>] + (<span class="kw">match</span> <span class="kw">if</span> x[i-<span class="num">1</span>] == y[j-<span class="num">1</span>] <span class="kw">else</span> mismatch):
            ax.<span class="fn">append</span>(x[i-<span class="num">1</span>]); ay.<span class="fn">append</span>(y[j-<span class="num">1</span>]); i -= <span class="num">1</span>; j -= <span class="num">1</span>
        <span class="kw">elif</span> H[i,j] == H[i-<span class="num">1</span>,j] + gap:
            ax.<span class="fn">append</span>(x[i-<span class="num">1</span>]); ay.<span class="fn">append</span>(<span class="str">'-'</span>); i -= <span class="num">1</span>
        <span class="kw">else</span>:
            ax.<span class="fn">append</span>(<span class="str">'-'</span>); ay.<span class="fn">append</span>(y[j-<span class="num">1</span>]); j -= <span class="num">1</span>
    <span class="kw">return</span> score, <span class="str">''</span>.<span class="fn">join</span>(<span class="fn">reversed</span>(ax)), <span class="str">''</span>.<span class="fn">join</span>(<span class="fn">reversed</span>(ay))

x = <span class="str">"ACACACTA"</span>; y = <span class="str">"AGCACACA"</span>
score, ax, ay = <span class="fn">smith_waterman</span>(x, y)
<span class="fn">print</span>(<span class="str">"Score:"</span>, score)
<span class="fn">print</span>(ax)
<span class="fn">print</span>(<span class="str">''</span>.<span class="fn">join</span>(<span class="str">'|'</span> <span class="kw">if</span> a==b <span class="kw">else</span> <span class="str">' '</span> <span class="kw">for</span> a,b <span class="kw">in</span> <span class="fn">zip</span>(ax,ay)))
<span class="fn">print</span>(ay)
</code></pre></div>

<p class="l-text">The DP table fills in O(mn). For two 1000-residue proteins that is one million cells — a few milliseconds. For UniProt-scale searches (250M sequences) you would never do this directly; you would use BLAST.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. BLAST — The Heuristic That Scales</h2>
<p class="l-text">Altschul et al.'s BLAST (1990) gave up optimality for speed: instead of filling a full DP matrix against every database sequence, it (a) finds short exact-match seeds (k-mers, default k=3 for protein), (b) extends seeds left and right while score keeps rising, and (c) keeps only high-scoring pairs whose E-value (expected number of equally-good matches by chance) is below a threshold. The result: 4 orders of magnitude faster than full Smith-Waterman, with negligible loss in recall for biologically meaningful hits.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Toy BLAST seed-and-extend — pure Python on a tiny "database"</span>
<span class="kw">def</span> <span class="fn">kmers</span>(s, k=<span class="num">3</span>):
    <span class="kw">return</span> {s[i:i+k]: i <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>)}

<span class="kw">def</span> <span class="fn">blast_lite</span>(query, db, k=<span class="num">3</span>, threshold=<span class="num">4</span>):
    qk = <span class="fn">kmers</span>(query, k)
    hits = []
    <span class="kw">for</span> name, seq <span class="kw">in</span> db.<span class="fn">items</span>():
        sk = <span class="fn">kmers</span>(seq, k)
        <span class="kw">for</span> kmer, qi <span class="kw">in</span> qk.<span class="fn">items</span>():
            <span class="kw">if</span> kmer <span class="kw">in</span> sk:
                <span class="cm"># extend until score drops</span>
                si = sk[kmer]
                score, l, r = k, <span class="num">0</span>, <span class="num">0</span>
                <span class="kw">while</span> qi-l-<span class="num">1</span> &gt;= <span class="num">0</span> <span class="kw">and</span> si-l-<span class="num">1</span> &gt;= <span class="num">0</span> <span class="kw">and</span> query[qi-l-<span class="num">1</span>] == seq[si-l-<span class="num">1</span>]:
                    l += <span class="num">1</span>; score += <span class="num">1</span>
                <span class="kw">while</span> qi+k+r &lt; <span class="fn">len</span>(query) <span class="kw">and</span> si+k+r &lt; <span class="fn">len</span>(seq) <span class="kw">and</span> query[qi+k+r] == seq[si+k+r]:
                    r += <span class="num">1</span>; score += <span class="num">1</span>
                <span class="kw">if</span> score &gt;= threshold:
                    hits.<span class="fn">append</span>((name, score, query[qi-l:qi+k+r]))
    <span class="kw">return</span> <span class="fn">sorted</span>(<span class="fn">set</span>(hits), key=<span class="kw">lambda</span> h: -h[<span class="num">1</span>])[:<span class="num">5</span>]

db = {<span class="str">"hemoglobin"</span>: <span class="str">"MVLSPADKTNVKAAWGKVGA"</span>, <span class="str">"spike"</span>: <span class="str">"MFVFLVLLPLVSSQCVNLTT"</span>, <span class="str">"test"</span>: <span class="str">"GCCAUUGUAAUGGGCCGC"</span>}
<span class="kw">for</span> name, score, frag <span class="kw">in</span> <span class="fn">blast_lite</span>(<span class="str">"VKAAWGK"</span>, db, k=<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"{name:12s} score={score} fragment={frag}"</span>)
</code></pre></div>

<p class="l-text">Real BLAST uses BLOSUM62 instead of exact matches, ungapped extension first (faster) then gapped, and computes E-values from a Gumbel distribution fit. The 1990 paper has been cited 100,000+ times — it is the most-used algorithm in biology.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Multiple Sequence Alignment in One Picture</h2>
<p class="l-text">Pairwise alignment generalizes to <em>multiple</em> sequence alignment (MSA): align N homologous sequences in a single grid where columns represent evolutionarily-equivalent positions. Tools: ClustalW (1994), MUSCLE (2004), MAFFT (2002), HHblits (2011 — uses HMMs). MSA is the primary input to AlphaFold 2's Evoformer (next lesson) — coevolving column pairs reveal which residues touch in 3D.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># A hand-built MSA — 5 hypothetical homologs of a 12-residue motif</span>
msa = np.<span class="fn">array</span>([
    <span class="fn">list</span>(<span class="str">"MVLSPADKTNVK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLSPADKTNVK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLTPADKSNVK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLSAADKTNIK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLNPGDKTNVK"</span>),
])
<span class="fn">print</span>(<span class="str">"MSA shape:"</span>, msa.shape)

<span class="cm"># Per-column conservation: how many of the 5 sequences agree with the consensus?</span>
<span class="kw">from</span> collections <span class="kw">import</span> Counter
consensus = <span class="str">''</span>.<span class="fn">join</span>(<span class="fn">Counter</span>(col).<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>][<span class="num">0</span>] <span class="kw">for</span> col <span class="kw">in</span> msa.T)
conservation = [(<span class="fn">Counter</span>(col).<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>][<span class="num">1</span>] / <span class="fn">len</span>(col)) <span class="kw">for</span> col <span class="kw">in</span> msa.T]
<span class="fn">print</span>(<span class="str">"Consensus:   "</span>, consensus)
<span class="fn">print</span>(<span class="str">"Conservation:"</span>, [<span class="fn">round</span>(c,<span class="num">2</span>) <span class="kw">for</span> c <span class="kw">in</span> conservation])
</code></pre></div>

<p class="l-text">This matrix is the data structure AlphaFold 2 receives, scaled up to thousands of rows. Columns with high conservation are usually catalytic or structural — you cannot vary them without breaking the protein.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Where We Go From Here</h2>
<p class="l-text">Sequence alignment is the n-gram era of biology — pre-deep-learning, statistical, beautifully effective on the easy 80%. The hard 20% — predicting 3D structure from a 1D sequence, predicting how a mutation changes function, designing a new protein from scratch — needs the deep learning revolution that AlphaFold 2 set off in 2021. The remaining lessons climb that ladder: structure prediction (L2), AlphaFold 2/3 architecture (L3), protein language models that learn from sequences alone (L4), genomics and variant calling (L5), and a capstone drug-target interaction pipeline (L6).</p>

<div class="calc-highlight"><strong>Mental model:</strong> bioinformatics 1990–2020 was alignment + statistics; bioinformatics 2020–2026 is alignment + statistics + transformers + diffusion. The new tools do not replace BLAST and Smith-Waterman; they sit on top of them.</div>
</div>`,
tr: `<p class="l-text"><strong>Biyoloji, bilgisel özünde, bir dizi (sequence) problemidir.</strong> Bir genom {A, C, G, T} alfabesi üzerinde bir dizgedir; bir mRNA {A, C, G, U} alfabesi üzerinde bir dizgedir; bir protein 20 standart amino asit üzerinde bir dizgedir. Modern hesaplamalı biyolojideki neredeyse her atılım — 1990'da BLAST, 2003'te tamamlanan İnsan Genom Projesi, 2021'de AlphaFold 2, 2022'de ESMFold'un 600 milyon tahmin edilmiş yapısı, 2024'te tam ligand desteği ile AlphaFold 3 — bu dizgeleri bir NLP'cinin metni ele aldığı gibi ele almaktan doğdu: token'lar, hizalamalar, dil modelleri, gömmeler.</p>

<p class="l-text">Bu ilk ders alfabeyi ortaya koyuyor. Üç merkezi biyopolimeri (DNA, RNA, protein) ve kodonları amino asitlere haritalayan genetik kodu inceliyoruz. Dünyadaki tüm veritabanlarının (UniProt, NCBI, PDB) konuştuğu FASTA dosya formatıyla tanışıyoruz. Sonra biyoenformatiğin iş atı algoritmasını — Smith-Waterman dinamik programlama ile ikili dizi hizalama — numpy üzerinde sıfırdan kuruyoruz ve hizalamayı milyarlarca diziye ölçeklendiren BLAST'ın seed-and-extend sezgiselini eskizliyoruz. Tüm ders giriş rampasıdır; L2'den itibaren 1B dizgeleri bırakıp 3B yapı tahminine geçiyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>FASTA dosyalarını okumak ve ayrıştırmak; genetik kod ile DNA'yı proteine çevirmek</li>
<li>Smith-Waterman optimal yerel hizalamasını numpy DP matrisi ile O(mn)'de hesaplamak</li>
<li>Hizalamaları BLOSUM62 ile skorlamak ve log-odds matrislerinin saf kimlikten neden daha iyi olduğunu açıklamak</li>
<li>BLAST'ın seed-extend-evaluate hattını eskizlemek ve neden sezgisel olduğunu kavramak</li>
<li>Üretim ayrıştırması için Biopython kullanmak (ve hangi çağrıların tarayıcıda bloke olduğunu bilmek)</li>
<li>Dizi hizalamayı daha geniş ML/NLP resmine yerleştirmek: bu, biyolojinin n-gram dönemidir</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Biyopolimer ve Alfabeleri</h2>
<p class="l-text">DNA, 4 harfli bir alfabeden — adenin, sitozin, guanin, timin — alınan nükleotidlerin çift sarmalıdır; A-T ve C-G baz çiftleri ile eşlenir. RNA, timin yerine urasil kullanır ve genellikle tek iplikçiklidir. Proteinler, 20 harfli bir alfabeden (artı nadir selenosistein ve pirolizin) alınan amino asitlerin doğrusal zincirleridir. Merkezi dogma — DNA mRNA'ya transkripsiyon edilir, mRNA proteine translasyon edilir — iki dizge-dizge fonksiyonunun ardışıklığıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DNA</div><div class="card-body">Alfabe <code>{A,C,G,T}</code>. Kromozomlarda saklanır (insan: 23 çift boyunca ~3,2 milyar bp). Çift iplikçiklidir; iki iplikçik birbirinin ters tümleyenidir.</div></div>
<div class="calc-card"><div class="card-title">RNA</div><div class="card-body">Alfabe <code>{A,C,G,U}</code>. Mesajcı RNA tarifi ribozomlara taşır. Diğer sınıflar (tRNA, rRNA, miRNA, lncRNA) düzenleme ve yapı görevini görür.</div></div>
<div class="calc-card"><div class="card-title">Protein</div><div class="card-body">20 amino asitten oluşan alfabe (A R N D C E Q G H I L K M F P S T W Y V). 3 harfli kodonlar → genetik kod ile 1 amino asit. İşlevi belirleyen 3B yapıya katlanır.</div></div>
<div class="calc-card"><div class="card-title">Neden 20 harfli alfabe?</div><div class="card-body">Her amino asitin farklı bir yan zinciri vardır — hidrofobik, yüklü, polar, aromatik. Sözcük dağarcığı, proteinlere kimyasal çeşitliliklerini veren şeydir. NLP analojisi: 20 amino asit ≈ küçük ama ifade gücü yüksek bir token kümesi, biyoloji için bir BPE sözcük dağarcığı gibi.</div></div>
</div>

<div class="calc-highlight"><strong>Veri ölçeği:</strong> UniProt (Eylül 2024) 250 milyon protein dizisine sahip; NCBI Nucleotide 8+ milyar kayıt içeriyor; PDB'de 220 bin deneysel olarak belirlenmiş 3B yapı, AlphaFold DB'de ise 214 milyon tahmin edilmiş yapı bulunuyor. Biyoloji 20 yılda veri-fakirden veri-zengine dönüştü.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Genetik Kod ve Translasyon</h2>
<p class="l-text">Genetik kod, 64 kodondan (4³) 20 amino asit artı bir durdurma sinyaline çoğa-bir bir haritadır. Dejeneredir (birden çok kodon aynı amino asidi kodlar; örn. <code>GCU GCC GCA GCG</code> → Alanin) ve yaşam genelinde neredeyse evrenseldir. Translasyon, AUG başlangıç kodonundan başlayarak mRNA'yı 3-nükleotidlik pencerelerde okur ve bir durdurma kodonunda (UAA, UAG, UGA) son bulur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Hand-rolled translator — pure-Python, runs anywhere</span>
CODON_TABLE = {
    <span class="str">'UUU'</span>:<span class="str">'F'</span>,<span class="str">'UUC'</span>:<span class="str">'F'</span>,<span class="str">'UUA'</span>:<span class="str">'L'</span>,<span class="str">'UUG'</span>:<span class="str">'L'</span>,<span class="str">'CUU'</span>:<span class="str">'L'</span>,<span class="str">'CUC'</span>:<span class="str">'L'</span>,<span class="str">'CUA'</span>:<span class="str">'L'</span>,<span class="str">'CUG'</span>:<span class="str">'L'</span>,
    <span class="str">'AUU'</span>:<span class="str">'I'</span>,<span class="str">'AUC'</span>:<span class="str">'I'</span>,<span class="str">'AUA'</span>:<span class="str">'I'</span>,<span class="str">'AUG'</span>:<span class="str">'M'</span>,<span class="str">'GUU'</span>:<span class="str">'V'</span>,<span class="str">'GUC'</span>:<span class="str">'V'</span>,<span class="str">'GUA'</span>:<span class="str">'V'</span>,<span class="str">'GUG'</span>:<span class="str">'V'</span>,
    <span class="str">'UCU'</span>:<span class="str">'S'</span>,<span class="str">'UCC'</span>:<span class="str">'S'</span>,<span class="str">'UCA'</span>:<span class="str">'S'</span>,<span class="str">'UCG'</span>:<span class="str">'S'</span>,<span class="str">'CCU'</span>:<span class="str">'P'</span>,<span class="str">'CCC'</span>:<span class="str">'P'</span>,<span class="str">'CCA'</span>:<span class="str">'P'</span>,<span class="str">'CCG'</span>:<span class="str">'P'</span>,
    <span class="str">'ACU'</span>:<span class="str">'T'</span>,<span class="str">'ACC'</span>:<span class="str">'T'</span>,<span class="str">'ACA'</span>:<span class="str">'T'</span>,<span class="str">'ACG'</span>:<span class="str">'T'</span>,<span class="str">'GCU'</span>:<span class="str">'A'</span>,<span class="str">'GCC'</span>:<span class="str">'A'</span>,<span class="str">'GCA'</span>:<span class="str">'A'</span>,<span class="str">'GCG'</span>:<span class="str">'A'</span>,
    <span class="str">'UAU'</span>:<span class="str">'Y'</span>,<span class="str">'UAC'</span>:<span class="str">'Y'</span>,<span class="str">'UAA'</span>:<span class="str">'*'</span>,<span class="str">'UAG'</span>:<span class="str">'*'</span>,<span class="str">'CAU'</span>:<span class="str">'H'</span>,<span class="str">'CAC'</span>:<span class="str">'H'</span>,<span class="str">'CAA'</span>:<span class="str">'Q'</span>,<span class="str">'CAG'</span>:<span class="str">'Q'</span>,
    <span class="str">'AAU'</span>:<span class="str">'N'</span>,<span class="str">'AAC'</span>:<span class="str">'N'</span>,<span class="str">'AAA'</span>:<span class="str">'K'</span>,<span class="str">'AAG'</span>:<span class="str">'K'</span>,<span class="str">'GAU'</span>:<span class="str">'D'</span>,<span class="str">'GAC'</span>:<span class="str">'D'</span>,<span class="str">'GAA'</span>:<span class="str">'E'</span>,<span class="str">'GAG'</span>:<span class="str">'E'</span>,
    <span class="str">'UGU'</span>:<span class="str">'C'</span>,<span class="str">'UGC'</span>:<span class="str">'C'</span>,<span class="str">'UGA'</span>:<span class="str">'*'</span>,<span class="str">'UGG'</span>:<span class="str">'W'</span>,<span class="str">'CGU'</span>:<span class="str">'R'</span>,<span class="str">'CGC'</span>:<span class="str">'R'</span>,<span class="str">'CGA'</span>:<span class="str">'R'</span>,<span class="str">'CGG'</span>:<span class="str">'R'</span>,
    <span class="str">'AGU'</span>:<span class="str">'S'</span>,<span class="str">'AGC'</span>:<span class="str">'S'</span>,<span class="str">'AGA'</span>:<span class="str">'R'</span>,<span class="str">'AGG'</span>:<span class="str">'R'</span>,<span class="str">'GGU'</span>:<span class="str">'G'</span>,<span class="str">'GGC'</span>:<span class="str">'G'</span>,<span class="str">'GGA'</span>:<span class="str">'G'</span>,<span class="str">'GGG'</span>:<span class="str">'G'</span>
}

<span class="kw">def</span> <span class="fn">translate</span>(rna):
    out = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(rna) - <span class="num">2</span>, <span class="num">3</span>):
        aa = CODON_TABLE.<span class="fn">get</span>(rna[i:i+<span class="num">3</span>], <span class="str">'X'</span>)
        <span class="kw">if</span> aa == <span class="str">'*'</span>: <span class="kw">break</span>
        out.<span class="fn">append</span>(aa)
    <span class="kw">return</span> <span class="str">''</span>.<span class="fn">join</span>(out)

mrna = <span class="str">"AUGGCCAUUGUAAUGGGCCGCUGAAAGGGUGCCCGAUAG"</span>
<span class="fn">print</span>(<span class="str">"Protein:"</span>, <span class="fn">translate</span>(mrna))   <span class="cm"># MAIVMGR — a small peptide stops at UGA</span>
<span class="fn">print</span>(<span class="str">"Length :"</span>, <span class="fn">len</span>(<span class="fn">translate</span>(mrna)), <span class="str">"amino acids"</span>)
</code></pre></div>

<p class="l-text">Bu kod kodonları soldan sağa okur, her birini standart tabloda arar ve ilk durdurma kodonunda durur. 7. pozisyondan sonra durmaya dikkat: gerçek mRNA'larda başlangıç kodonundan önce 5' UTR ve durdurma kodonundan sonra 3' UTR vardır; netlik adına bunları atlıyoruz.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. FASTA — Ortak Dil</h2>
<p class="l-text">Bir FASTA kaydı <code>&gt;</code> ile başlayan bir başlık satırı ve onu izleyen dizi satırlarından oluşur. Her halka açık veritabanı bu dili konuşur. Biopython'un <code>Bio.SeqIO</code>'su referans ayrıştırıcıdır, ama format o kadar basittir ki üretim için 10 satırlık bir ayrıştırıcı yeterlidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Biopython Pyodide'de bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production: Biopython handles compressed files, multi-line sequences, gaps</span>
<span class="kw">from</span> Bio <span class="kw">import</span> SeqIO
<span class="kw">for</span> rec <span class="kw">in</span> SeqIO.<span class="fn">parse</span>(<span class="str">"uniprot_sprot.fasta"</span>, <span class="str">"fasta"</span>):
    <span class="fn">print</span>(rec.id, <span class="fn">len</span>(rec.seq), <span class="fn">str</span>(rec.seq)[:<span class="num">30</span>])
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">FASTA o kadar basittir ki ayrıştırıcıyı elle yazabiliriz. İyi-biçimlenmiş dosyalar için Biopython ile aynı çıktıyı verir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>fasta_text = <span class="str">"""&gt;sp|P0DTC2|SPIKE_SARS2 Spike glycoprotein
MFVFLVLLPLVSSQCVNLTTRTQLPPAYTNSFTRGVYYPDKVFRSSVLHSTQDLFLPFFSN
VTWFHAIHVSGTNGTKRFDNPVLPFNDGVYFASTEKSNIIRGWIFGTTLDSKTQSLLIVNN
&gt;sp|P12345|TEST Toy sequence
MAGIVAEKGCSCNYSAA"""</span>

<span class="kw">def</span> <span class="fn">parse_fasta</span>(text):
    records, header, seq = [], <span class="kw">None</span>, []
    <span class="kw">for</span> line <span class="kw">in</span> text.<span class="fn">splitlines</span>():
        <span class="kw">if</span> line.<span class="fn">startswith</span>(<span class="str">'&gt;'</span>):
            <span class="kw">if</span> header: records.<span class="fn">append</span>((header, <span class="str">''</span>.<span class="fn">join</span>(seq)))
            header, seq = line[<span class="num">1</span>:].<span class="fn">strip</span>(), []
        <span class="kw">else</span>:
            seq.<span class="fn">append</span>(line.<span class="fn">strip</span>())
    <span class="kw">if</span> header: records.<span class="fn">append</span>((header, <span class="str">''</span>.<span class="fn">join</span>(seq)))
    <span class="kw">return</span> records

<span class="kw">for</span> hdr, s <span class="kw">in</span> <span class="fn">parse_fasta</span>(fasta_text):
    <span class="fn">print</span>(f<span class="str">"{hdr[:40]:40s}  len={len(s):4d}  start={s[:20]}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Dizi Kimliği — Saf Skor</h2>
<p class="l-text">Hizalamadan önce bir skora ihtiyacımız var. Saf seçim yüzde kimliktir: iki eşit-uzunluklu dizgenin uyuştuğu pozisyonların oranı. Çok benzer diziler için iyidir, ama uzak homologlar için bozulur çünkü tüm sübstitüsyonlar eşit olası değildir. Lösin ↔ İzolösin (ikisi de hidrofobik) neredeyse sessiz bir değişimdir; Lösin ↔ Prolin (prolin omurgayı bükler) yıkıcıdır.</p>

<div class="katex-block">$$\text{identity}(x, y) = \frac{1}{n} \sum_{i=1}^{n} \mathbb{1}[x_i = y_i]$$</div>

<p class="l-text">Çözüm, kimyasal olarak benzer çiftlere pozitif, yıkıcı olanlara negatif skor veren bir sübstitüsyon matrisidir. BLOSUM62 (Henikoff &amp; Henikoff 1992), ilişkili proteinlerin korunmuş bloklarındaki gözlenen sübstitüsyonlardan türetilmiştir; girdi bir log-odds oranıdır:</p>

<div class="katex-block">$$\text{BLOSUM62}(a,b) = \frac{1}{\lambda} \log \frac{p_{ab}}{q_a \, q_b}$$</div>

<p class="l-text">Burada p_{ab} güvenilir hizalamalarda a'nın b ile hizalı olarak görülmesinin gözlenen ortak olasılığı, q_a ve q_b arka plan frekansları, lambda ise bir ölçek faktörüdür (geleneksel olarak 1/2 bit). Köşegende pozitif, kimyasal olarak uyumsuz değişimlerde negatif, L/I gibi kimyasal eşdeğer değişimlerde büyük pozitif değer alır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sıfırdan Smith-Waterman</h2>
<p class="l-text">Smith-Waterman (1981), iki dizi arasındaki optimal <em>yerel</em> hizalamayı dinamik programlama ile O(mn) zamanda bulur. Üç kural: köşegenden eşleşme/uyuşmazlık, soldan veya yukarıdan boşluk ve negatif skorları 0'a kırpma (yerel yapan budur — kötü bölgeler sıfırlanır). Maksimum hücreden geri-iz takibi hizalamayı verir.</p>

<div class="katex-block">$$H_{i,j} = \max\!\left\{ 0,\; H_{i-1,j-1} + s(x_i, y_j),\; H_{i-1,j} - g,\; H_{i,j-1} - g \right\}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">smith_waterman</span>(x, y, <span class="kw">match</span>=<span class="num">2</span>, mismatch=-<span class="num">1</span>, gap=-<span class="num">2</span>):
    m, n = <span class="fn">len</span>(x), <span class="fn">len</span>(y)
    H = np.<span class="fn">zeros</span>((m+<span class="num">1</span>, n+<span class="num">1</span>), dtype=<span class="fn">int</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, m+<span class="num">1</span>):
        <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, n+<span class="num">1</span>):
            s = <span class="kw">match</span> <span class="kw">if</span> x[i-<span class="num">1</span>] == y[j-<span class="num">1</span>] <span class="kw">else</span> mismatch
            H[i,j] = <span class="fn">max</span>(<span class="num">0</span>, H[i-<span class="num">1</span>,j-<span class="num">1</span>] + s, H[i-<span class="num">1</span>,j] + gap, H[i,j-<span class="num">1</span>] + gap)
    <span class="cm"># traceback from the maximal cell</span>
    i, j = np.<span class="fn">unravel_index</span>(np.<span class="fn">argmax</span>(H), H.shape)
    score = H[i,j]
    ax, ay = [], []
    <span class="kw">while</span> i &gt; <span class="num">0</span> <span class="kw">and</span> j &gt; <span class="num">0</span> <span class="kw">and</span> H[i,j] != <span class="num">0</span>:
        <span class="kw">if</span> H[i,j] == H[i-<span class="num">1</span>,j-<span class="num">1</span>] + (<span class="kw">match</span> <span class="kw">if</span> x[i-<span class="num">1</span>] == y[j-<span class="num">1</span>] <span class="kw">else</span> mismatch):
            ax.<span class="fn">append</span>(x[i-<span class="num">1</span>]); ay.<span class="fn">append</span>(y[j-<span class="num">1</span>]); i -= <span class="num">1</span>; j -= <span class="num">1</span>
        <span class="kw">elif</span> H[i,j] == H[i-<span class="num">1</span>,j] + gap:
            ax.<span class="fn">append</span>(x[i-<span class="num">1</span>]); ay.<span class="fn">append</span>(<span class="str">'-'</span>); i -= <span class="num">1</span>
        <span class="kw">else</span>:
            ax.<span class="fn">append</span>(<span class="str">'-'</span>); ay.<span class="fn">append</span>(y[j-<span class="num">1</span>]); j -= <span class="num">1</span>
    <span class="kw">return</span> score, <span class="str">''</span>.<span class="fn">join</span>(<span class="fn">reversed</span>(ax)), <span class="str">''</span>.<span class="fn">join</span>(<span class="fn">reversed</span>(ay))

x = <span class="str">"ACACACTA"</span>; y = <span class="str">"AGCACACA"</span>
score, ax, ay = <span class="fn">smith_waterman</span>(x, y)
<span class="fn">print</span>(<span class="str">"Score:"</span>, score)
<span class="fn">print</span>(ax)
<span class="fn">print</span>(<span class="str">''</span>.<span class="fn">join</span>(<span class="str">'|'</span> <span class="kw">if</span> a==b <span class="kw">else</span> <span class="str">' '</span> <span class="kw">for</span> a,b <span class="kw">in</span> <span class="fn">zip</span>(ax,ay)))
<span class="fn">print</span>(ay)
</code></pre></div>

<p class="l-text">DP tablosu O(mn) zamanda doldurulur. İki 1000-rezidülü protein için bu bir milyon hücredir — birkaç milisaniye. UniProt ölçeğinde aramalarda (250M dizi) bunu doğrudan asla yapmazsınız; BLAST kullanırsınız.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. BLAST — Ölçeklenen Sezgisel</h2>
<p class="l-text">Altschul ve arkadaşlarının BLAST'ı (1990) hız uğruna optimaliteden vazgeçti: her veritabanı dizisine karşı tam DP matrisi doldurmak yerine (a) kısa tam-eşleşme tohumları (k-mer'ler, protein için varsayılan k=3) bulur, (b) skor yükselmeye devam ettikçe tohumları sola ve sağa uzatır ve (c) yalnızca E-değeri (rastgele eşit-iyi eşleşme beklenen sayısı) eşiğin altında olan yüksek-skorlu çiftleri saklar. Sonuç: tam Smith-Waterman'dan 4 büyüklük mertebesi daha hızlı, biyolojik anlamlı isabetlerde geri-çağırma kaybı ihmal edilebilir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Toy BLAST seed-and-extend — pure Python on a tiny "database"</span>
<span class="kw">def</span> <span class="fn">kmers</span>(s, k=<span class="num">3</span>):
    <span class="kw">return</span> {s[i:i+k]: i <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(s)-k+<span class="num">1</span>)}

<span class="kw">def</span> <span class="fn">blast_lite</span>(query, db, k=<span class="num">3</span>, threshold=<span class="num">4</span>):
    qk = <span class="fn">kmers</span>(query, k)
    hits = []
    <span class="kw">for</span> name, seq <span class="kw">in</span> db.<span class="fn">items</span>():
        sk = <span class="fn">kmers</span>(seq, k)
        <span class="kw">for</span> kmer, qi <span class="kw">in</span> qk.<span class="fn">items</span>():
            <span class="kw">if</span> kmer <span class="kw">in</span> sk:
                <span class="cm"># extend until score drops</span>
                si = sk[kmer]
                score, l, r = k, <span class="num">0</span>, <span class="num">0</span>
                <span class="kw">while</span> qi-l-<span class="num">1</span> &gt;= <span class="num">0</span> <span class="kw">and</span> si-l-<span class="num">1</span> &gt;= <span class="num">0</span> <span class="kw">and</span> query[qi-l-<span class="num">1</span>] == seq[si-l-<span class="num">1</span>]:
                    l += <span class="num">1</span>; score += <span class="num">1</span>
                <span class="kw">while</span> qi+k+r &lt; <span class="fn">len</span>(query) <span class="kw">and</span> si+k+r &lt; <span class="fn">len</span>(seq) <span class="kw">and</span> query[qi+k+r] == seq[si+k+r]:
                    r += <span class="num">1</span>; score += <span class="num">1</span>
                <span class="kw">if</span> score &gt;= threshold:
                    hits.<span class="fn">append</span>((name, score, query[qi-l:qi+k+r]))
    <span class="kw">return</span> <span class="fn">sorted</span>(<span class="fn">set</span>(hits), key=<span class="kw">lambda</span> h: -h[<span class="num">1</span>])[:<span class="num">5</span>]

db = {<span class="str">"hemoglobin"</span>: <span class="str">"MVLSPADKTNVKAAWGKVGA"</span>, <span class="str">"spike"</span>: <span class="str">"MFVFLVLLPLVSSQCVNLTT"</span>, <span class="str">"test"</span>: <span class="str">"GCCAUUGUAAUGGGCCGC"</span>}
<span class="kw">for</span> name, score, frag <span class="kw">in</span> <span class="fn">blast_lite</span>(<span class="str">"VKAAWGK"</span>, db, k=<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"{name:12s} score={score} fragment={frag}"</span>)
</code></pre></div>

<p class="l-text">Gerçek BLAST tam eşleşme yerine BLOSUM62 kullanır, önce boşluksuz uzatma (daha hızlı), sonra boşluklu uzatma yapar ve E-değerlerini bir Gumbel dağılımına oturtarak hesaplar. 1990 makalesi 100.000+ kez atıf aldı — biyolojide en çok kullanılan algoritmadır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Çoklu Dizi Hizalama Tek Resimde</h2>
<p class="l-text">İkili hizalama <em>çoklu</em> dizi hizalamaya (MSA) genelleşir: N homolog diziyi tek bir ızgarada hizalayıp sütunların evrimsel-eşdeğer pozisyonları temsil ettiği bir yapı oluşturur. Araçlar: ClustalW (1994), MUSCLE (2004), MAFFT (2002), HHblits (2011 — HMM kullanır). MSA, AlphaFold 2'nin Evoformer'ının (sonraki ders) birincil girdisidir — ko-evrim gösteren sütun çiftleri hangi rezidülerin 3B'de temas ettiğini açığa çıkarır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># A hand-built MSA — 5 hypothetical homologs of a 12-residue motif</span>
msa = np.<span class="fn">array</span>([
    <span class="fn">list</span>(<span class="str">"MVLSPADKTNVK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLSPADKTNVK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLTPADKSNVK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLSAADKTNIK"</span>),
    <span class="fn">list</span>(<span class="str">"MVLNPGDKTNVK"</span>),
])
<span class="fn">print</span>(<span class="str">"MSA shape:"</span>, msa.shape)

<span class="cm"># Per-column conservation: how many of the 5 sequences agree with the consensus?</span>
<span class="kw">from</span> collections <span class="kw">import</span> Counter
consensus = <span class="str">''</span>.<span class="fn">join</span>(<span class="fn">Counter</span>(col).<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>][<span class="num">0</span>] <span class="kw">for</span> col <span class="kw">in</span> msa.T)
conservation = [(<span class="fn">Counter</span>(col).<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>][<span class="num">1</span>] / <span class="fn">len</span>(col)) <span class="kw">for</span> col <span class="kw">in</span> msa.T]
<span class="fn">print</span>(<span class="str">"Consensus:   "</span>, consensus)
<span class="fn">print</span>(<span class="str">"Conservation:"</span>, [<span class="fn">round</span>(c,<span class="num">2</span>) <span class="kw">for</span> c <span class="kw">in</span> conservation])
</code></pre></div>

<p class="l-text">Bu matris, AlphaFold 2'nin aldığı veri yapısıdır; binlerce satıra ölçeklenmiş haldedir. Yüksek korunmaya sahip sütunlar genellikle katalitik veya yapısaldır — proteini bozmadan değiştiremezsiniz.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Buradan Nereye Gidiyoruz</h2>
<p class="l-text">Dizi hizalama, biyolojinin n-gram dönemidir — derin öğrenme öncesi, istatistiksel, kolay %80'de çok etkili. Zor %20 — 1B diziden 3B yapı tahmin etmek, bir mutasyonun işlevi nasıl değiştireceğini tahmin etmek, sıfırdan yeni bir protein tasarlamak — AlphaFold 2'nin 2021'de başlattığı derin öğrenme devrimini gerektirir. Kalan dersler bu merdiveni tırmanır: yapı tahmini (L2), AlphaFold 2/3 mimarisi (L3), tek başına dizilerden öğrenen protein dil modelleri (L4), genomik ve varyant çağırma (L5) ve bir kapanış ilaç-hedef etkileşim hattı (L6).</p>

<div class="calc-highlight"><strong>Zihinsel model:</strong> 1990–2020 arası biyoenformatik hizalama + istatistik idi; 2020–2026 arası biyoenformatik hizalama + istatistik + transformer + difüzyondur. Yeni araçlar BLAST'ı ve Smith-Waterman'ı yerine geçmez; üzerlerinde otururlar.</div>
</div>`
};
