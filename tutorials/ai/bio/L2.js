window.BIO_L2 = {
en: `<p class="l-text"><strong>Anfinsen's dogma (Nobel 1972) says the amino acid sequence determines the 3D structure.</strong> The sequence is what evolution writes; the structure is what does the work — catalyzes reactions, transports oxygen, binds DNA, makes the spike of a virus. For 50 years between Anfinsen's hypothesis and AlphaFold 2, the protein folding problem was the most embarrassing open problem in computational biology: we knew the answer was in the sequence, we just could not extract it. Hundreds of millions of dollars and Rosetta@home volunteer-CPU-years got predictions that were sometimes good, often wrong, and never fast.</p>

<p class="l-text">This lesson is the pre-deep-learning chapter — what the field knew before AlphaFold 2 dropped in CASP14 (November 2020). We define the four levels of protein structure (primary, secondary, tertiary, quaternary), explain why secondary structure (alpha helices, beta sheets) is the easy part and tertiary the hard part, introduce contact maps as a 2D representation that bridges 1D sequence and 3D coordinates, and walk through the classical methods: fragment assembly (Rosetta, David Baker's lab, mid-2000s), homology modeling, and physics-based simulation (Folding@home with OpenMM). Knowing what came before is what makes AlphaFold 2 in L3 feel like the miracle it actually was.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish primary, secondary, tertiary, and quaternary structure with concrete examples</li>
<li>Read a Ramachandran plot and explain why phi/psi angles cluster into helix and sheet regions</li>
<li>Build a contact map from 3D coordinates and explain its role as the AF2 prediction target</li>
<li>Sketch fragment assembly (Rosetta) and homology modeling (MODELLER, SWISS-MODEL)</li>
<li>Read CASP scores: GDT_TS, lDDT, TM-score, and what "near-experimental accuracy" means</li>
<li>Place the field as it was in 2019 — the bar AlphaFold 2 was about to clear by 30 GDT points</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Four Levels of Protein Structure</h2>
<p class="l-text">A protein's organization is described at four levels, each emerging from the one below. The problem of protein folding is exactly the problem of going from level 1 to level 3 (and sometimes 4) without doing the wet-lab experiment.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Primary</div><div class="card-body">The amino acid sequence itself — a string. Determined by the gene. This is what UniProt stores as FASTA. Example: hemoglobin alpha chain has 141 residues.</div></div>
<div class="calc-card"><div class="card-title">Secondary</div><div class="card-body">Local backbone patterns: alpha helices (3.6 residues per turn, hydrogen-bonded i to i+4) and beta sheets (parallel or antiparallel strands H-bonded laterally). Reliably predictable from sequence — DSSP, PSIPRED ~80% accuracy since the 1990s.</div></div>
<div class="calc-card"><div class="card-title">Tertiary</div><div class="card-body">The full 3D fold of one chain — coordinates (x, y, z) for every atom. This is what AlphaFold 2 predicts. Hard because non-local: residue 30 may touch residue 120 in space.</div></div>
<div class="calc-card"><div class="card-title">Quaternary</div><div class="card-body">Multiple chains assembled into a complex. Hemoglobin = 4 chains (2 alpha + 2 beta). Antibodies = heavy + light. AlphaFold-Multimer (2021) and AlphaFold 3 (2024) handle this; AF2 alone did not.</div></div>
</div>

<div class="calc-highlight"><strong>Why is tertiary hard?</strong> Two residues 200 positions apart in sequence can be 5 ångströms apart in 3D. A purely local model cannot see that. You need a long-range mechanism — coevolution from MSAs, or attention over the entire chain. AF2 uses both.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Phi/Psi Angles and the Ramachandran Plot</h2>
<p class="l-text">The protein backbone has three torsion angles per residue: phi, psi, and omega (the peptide bond, ~180° always). Phi and psi are free to rotate. Plotting (phi, psi) for every residue in the PDB gives the Ramachandran plot — and only two regions are populated: alpha-helix territory near (-60°, -45°) and beta-sheet territory near (-120°, +120°). Every other phi/psi combination causes steric clash.</p>

<div class="katex-block">$$\phi_i = \text{dihedral}(C_{i-1},\, N_i,\, C\alpha_i,\, C_i), \qquad \psi_i = \text{dihedral}(N_i,\, C\alpha_i,\, C_i,\, N_{i+1})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Synthesize 200 residues clustered in helix vs sheet basins</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
helix = np.random.<span class="fn">normal</span>([-<span class="num">60</span>, -<span class="num">45</span>], <span class="num">10</span>, size=(<span class="num">120</span>, <span class="num">2</span>))
sheet = np.random.<span class="fn">normal</span>([-<span class="num">120</span>, <span class="num">120</span>], <span class="num">12</span>, size=(<span class="num">80</span>, <span class="num">2</span>))
phipsi = np.<span class="fn">vstack</span>([helix, sheet])

<span class="cm"># A simple classifier: which basin is each (phi, psi) closer to?</span>
centers = np.<span class="fn">array</span>([[-<span class="num">60</span>, -<span class="num">45</span>], [-<span class="num">120</span>, <span class="num">120</span>]])
dist = np.linalg.<span class="fn">norm</span>(phipsi[:, <span class="kw">None</span>, :] - centers[<span class="kw">None</span>, :, :], axis=-<span class="num">1</span>)
labels = dist.<span class="fn">argmin</span>(axis=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"Helix residues:"</span>, (labels == <span class="num">0</span>).<span class="fn">sum</span>(), <span class="str">"/ Sheet residues:"</span>, (labels == <span class="num">1</span>).<span class="fn">sum</span>())
<span class="fn">print</span>(<span class="str">"Mean phi/psi for helix cluster:"</span>, phipsi[labels==<span class="num">0</span>].<span class="fn">mean</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">1</span>))
<span class="fn">print</span>(<span class="str">"Mean phi/psi for sheet cluster:"</span>, phipsi[labels==<span class="num">1</span>].<span class="fn">mean</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">1</span>))
</code></pre></div>

<p class="l-text">This 2-line clustering reproduces what DSSP does in 1976 with explicit hydrogen-bond geometry rules. The lesson: secondary structure is locally determined and computationally cheap; tertiary is not.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Multiple Sequence Alignment as Coevolution</h2>
<p class="l-text">If two residues are in physical contact, mutation at one usually destabilizes the protein unless the other compensates. Over millions of years of evolution, contact pairs co-vary. Statistically: in an MSA of 1000 homologs, columns 30 and 120 will have correlated identities if and only if their residues touch in 3D. This is the central signal AlphaFold 2 exploits.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Synthetic MSA: 200 sequences, 12 columns, with cols 2 and 9 forced to coevolve</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
N, L = <span class="num">200</span>, <span class="num">12</span>
alphabet = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)
msa = np.random.<span class="fn">choice</span>(alphabet, size=(N, L))
<span class="cm"># Force coevolution: where col 2 is 'A', col 9 is 'V'; where col 2 is 'K', col 9 is 'D'</span>
mask = np.random.<span class="fn">rand</span>(N) &lt; <span class="num">0.7</span>
msa[mask, <span class="num">2</span>] = <span class="str">'A'</span>; msa[mask, <span class="num">9</span>] = <span class="str">'V'</span>
msa[~mask, <span class="num">2</span>] = <span class="str">'K'</span>; msa[~mask, <span class="num">9</span>] = <span class="str">'D'</span>

<span class="cm"># Mutual information per column pair: I(X,Y) = sum p(x,y) log p(x,y)/(p(x)p(y))</span>
<span class="kw">def</span> <span class="fn">mutual_info</span>(c1, c2):
    <span class="kw">from</span> collections <span class="kw">import</span> Counter
    n = <span class="fn">len</span>(c1)
    pxy = <span class="fn">Counter</span>(<span class="fn">zip</span>(c1, c2)); px = <span class="fn">Counter</span>(c1); py = <span class="fn">Counter</span>(c2)
    mi = <span class="num">0.0</span>
    <span class="kw">for</span> (x,y), nxy <span class="kw">in</span> pxy.<span class="fn">items</span>():
        mi += (nxy/n) * np.<span class="fn">log</span>((nxy/n) / ((px[x]/n) * (py[y]/n)))
    <span class="kw">return</span> mi

mi_matrix = np.<span class="fn">zeros</span>((L, L))
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(L):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(L):
        <span class="kw">if</span> i != j: mi_matrix[i,j] = <span class="fn">mutual_info</span>(msa[:,i], msa[:,j])
top = np.<span class="fn">unravel_index</span>(np.<span class="fn">argmax</span>(mi_matrix), mi_matrix.shape)
<span class="fn">print</span>(<span class="str">"Strongest coevolving column pair:"</span>, top, <span class="str">"MI ="</span>, <span class="fn">round</span>(mi_matrix[top], <span class="num">2</span>))
</code></pre></div>

<p class="l-text">The naive MI signal we just computed is what tools like DCA (Direct Coupling Analysis, Morcos 2011) and PSICOV refined into contact predictors that worked, partially, before deep learning. AF2 swallowed all of this into the Evoformer.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Contact Maps — The 2D Bridge</h2>
<p class="l-text">A contact map is an L×L binary matrix where entry (i, j) = 1 if residues i and j are within 8 Å of each other (typically C-beta to C-beta). It is the natural intermediate target between 1D sequence and 3D coordinates: lower-dimensional than coordinates, but enough information to reconstruct the fold up to mirror image. The 2018 generation of folders (RaptorX-Contact, trRosetta) predicted contact maps with deep CNNs, then handed them to Rosetta for 3D realization.</p>

<div class="katex-block">$$C_{ij} = \mathbb{1}\big[\, \|r_i - r_j\| \le 8 \text{ Å} \,\big]$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Synthesize 3D coordinates for a 40-residue alpha-helical bundle</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
L = <span class="num">40</span>
t = np.<span class="fn">arange</span>(L)
<span class="cm"># 1.5 Å rise, 100° turn per residue (alpha helix geometry)</span>
x = <span class="num">2.3</span> * np.<span class="fn">cos</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span> * t))
y = <span class="num">2.3</span> * np.<span class="fn">sin</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span> * t))
z = <span class="num">1.5</span> * t
coords = np.<span class="fn">stack</span>([x, y, z], axis=<span class="num">1</span>)

<span class="cm"># Pairwise distance matrix and contact map</span>
diffs = coords[:, <span class="kw">None</span>, :] - coords[<span class="kw">None</span>, :, :]
dist = np.linalg.<span class="fn">norm</span>(diffs, axis=-<span class="num">1</span>)
contact = (dist &lt; <span class="num">8.0</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="fn">print</span>(<span class="str">"Distance matrix shape:"</span>, dist.shape, <span class="str">"  min off-diagonal:"</span>, <span class="fn">round</span>(dist[np.<span class="fn">triu_indices</span>(L,k=<span class="num">1</span>)].<span class="fn">min</span>(), <span class="num">2</span>), <span class="str">"Å"</span>)
<span class="fn">print</span>(<span class="str">"Contacts within 8 Å (off-diagonal):"</span>, contact[np.<span class="fn">triu_indices</span>(L, k=<span class="num">1</span>)].<span class="fn">sum</span>())
<span class="fn">print</span>(<span class="str">"Contact density:"</span>, <span class="fn">round</span>(contact[np.<span class="fn">triu_indices</span>(L,k=<span class="num">1</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>

<p class="l-text">In a real PDB structure the diagonal band of contacts is the helix's i-to-i+3 hydrogen bonds; off-diagonal stripes are inter-helical packing or beta-strand pairing. AF2 internally maintains a "pair representation" that is essentially this matrix, refined by attention.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Fragment Assembly — Baker Lab's Rosetta</h2>
<p class="l-text">Rosetta (David Baker, late 1990s) was the dominant ab initio folder for two decades. Idea: every 9-residue window of the target sequence is matched against a library of fragments from solved PDB structures with similar local sequence. A Monte Carlo procedure swaps fragments in and out, scoring conformations with an energy function that combines van der Waals, electrostatics, hydrogen bonds, and a knowledge-based term. Tens of thousands of decoys are generated; the lowest-energy cluster is the prediction.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — pyrosetta blocked, requires native libs)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pyrosetta <span class="kw">import</span> init, pose_from_sequence, get_score_function
<span class="kw">from</span> pyrosetta.rosetta.protocols.abinitio <span class="kw">import</span> ClassicAbinitio
<span class="fn">init</span>()
pose = <span class="fn">pose_from_sequence</span>(<span class="str">"MAGIVAEKGCSCNYSAA"</span>)
abinitio = <span class="fn">ClassicAbinitio</span>(frag9, frag3, mm)
abinitio.<span class="fn">apply</span>(pose)
<span class="fn">print</span>(<span class="str">"Final energy:"</span>, <span class="fn">get_score_function</span>()(pose))
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy fragment-assembly Monte Carlo: random phi/psi perturbations on a synthetic backbone, accept moves that lower a stub energy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

L = <span class="num">30</span>
phi_psi = np.random.<span class="fn">uniform</span>(-<span class="num">180</span>, <span class="num">180</span>, size=(L, <span class="num">2</span>))

<span class="kw">def</span> <span class="fn">energy</span>(angles):
    <span class="cm"># toy: penalize departure from helix basin</span>
    target = np.<span class="fn">array</span>([-<span class="num">60</span>, -<span class="num">45</span>])
    <span class="kw">return</span> np.linalg.<span class="fn">norm</span>(angles - target, axis=<span class="num">1</span>).<span class="fn">sum</span>()

current_E = <span class="fn">energy</span>(phi_psi)
best = phi_psi.<span class="fn">copy</span>(); best_E = current_E
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    i = np.random.<span class="fn">randint</span>(L)
    proposal = phi_psi.<span class="fn">copy</span>()
    proposal[i] += np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">20</span>, size=<span class="num">2</span>)
    new_E = <span class="fn">energy</span>(proposal)
    <span class="kw">if</span> new_E &lt; current_E <span class="kw">or</span> np.random.<span class="fn">rand</span>() &lt; np.<span class="fn">exp</span>(-(new_E - current_E) / <span class="num">5</span>):
        phi_psi = proposal; current_E = new_E
        <span class="kw">if</span> new_E &lt; best_E: best = proposal.<span class="fn">copy</span>(); best_E = new_E

<span class="fn">print</span>(f<span class="str">"Start energy: {energy(np.random.uniform(-180,180,(L,2))):.1f}"</span>)
<span class="fn">print</span>(f<span class="str">"Final  energy: {best_E:.1f}  (target = 0 = perfect helix)"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Homology Modeling — When You Have a Cousin</h2>
<p class="l-text">If the target sequence has a close relative (&gt;30% identity) with a known structure, you can copy that structure and tweak. MODELLER (Sali 1993) and SWISS-MODEL (1995) automate this: align target to template, copy the backbone, model loops where the alignment has gaps, optimize side chains. This works extremely well when a template exists — it is how most "structural genomics" coverage was achieved before AF2.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When it works</div><div class="card-body">Targets with ≥30% sequence identity to a PDB entry. ~50% of human proteins had a usable template by 2020. SWISS-MODEL ran 100,000+ jobs/year.</div></div>
<div class="calc-card"><div class="card-title">When it fails</div><div class="card-body">"Twilight zone" 15-25% identity, novel folds, and orphan proteins. The other ~50% of human proteins. This is exactly the gap AF2 closed.</div></div>
<div class="calc-card"><div class="card-title">After AF2</div><div class="card-body">Homology modeling is mostly subsumed — AF2 outperforms it even when a template exists, because it learned to use templates internally as one signal among many.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Physics-Based Simulation — Folding@home</h2>
<p class="l-text">The third classical approach is to run molecular dynamics: integrate Newton's equations for every atom in the protein plus surrounding water, with a force field (AMBER, CHARMM) that approximates quantum-mechanical interactions classically. Vijay Pande's Folding@home harnessed millions of volunteer GPUs from 2000 onward; D. E. Shaw's Anton supercomputer (2008) reached millisecond simulations for small proteins.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — OpenMM blocked in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> openmm.app <span class="kw">import</span> *
<span class="kw">from</span> openmm <span class="kw">import</span> *
<span class="kw">from</span> openmm.unit <span class="kw">import</span> *

pdb = <span class="fn">PDBFile</span>(<span class="str">'input.pdb'</span>)
forcefield = <span class="fn">ForceField</span>(<span class="str">'amber14-all.xml'</span>, <span class="str">'amber14/tip3pfb.xml'</span>)
system = forcefield.<span class="fn">createSystem</span>(pdb.topology, nonbondedMethod=PME, nonbondedCutoff=<span class="num">1</span>*nanometer)
integrator = <span class="fn">LangevinIntegrator</span>(<span class="num">300</span>*kelvin, <span class="num">1</span>/picosecond, <span class="num">0.002</span>*picoseconds)
sim = <span class="fn">Simulation</span>(pdb.topology, system, integrator)
sim.context.<span class="fn">setPositions</span>(pdb.positions)
sim.<span class="fn">minimizeEnergy</span>()
sim.<span class="fn">step</span>(<span class="num">50000</span>)   <span class="cm"># 100 ps of dynamics</span>
</code></pre></div>

<p class="l-text">The fundamental problem: timesteps are femtoseconds (10⁻¹⁵ s) and folding takes microseconds to milliseconds. That is 10⁹ to 10¹² steps per simulated fold — beyond reach for everything but the smallest proteins. Physics-based folding never solved the general problem; it remains useful for small targeted questions like binding-site dynamics.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. CASP — The Olympics of Folding</h2>
<p class="l-text">Critical Assessment of Structure Prediction (CASP), held biennially since 1994, is the field's blind benchmark. Organizers gather a few dozen unreleased experimental structures; teams predict from sequence; predictions are scored against ground truth after the fact. The headline metric:</p>

<div class="katex-block">$$\text{GDT\_TS} = \frac{1}{4}(P_1 + P_2 + P_4 + P_8)$$</div>

<p class="l-text">where P_d is the percentage of residues within distance d ångströms of the truth after best superposition. 100 = perfect, 50 ≈ correct topology, &lt;30 = wrong fold. CASP13 (2018) winner AlphaFold 1 averaged ~58 GDT_TS on hard targets. CASP14 (2020) winner AlphaFold 2 averaged ~92 GDT_TS — within experimental uncertainty.</p>

<div class="calc-highlight"><strong>The gap before AF2:</strong> the best non-DeepMind method at CASP14 averaged ~71 GDT_TS. AF2 was 21 points ahead — equivalent to two CASPs of progress in one cycle. Most of the field went home and rewrote everything around it. The next lesson is what was inside that black box.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Other Metrics You Will See</h2>
<p class="l-text">CASP scores AF2 outputs with a family of metrics — useful to recognize:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">lDDT-Cα</div><div class="card-body">Local Distance Difference Test: superposition-free score on Cα atoms. Asks "are local atomic distances preserved?" Range 0–100, robust to domain motion. AF2's pLDDT is per-residue lDDT prediction.</div></div>
<div class="calc-card"><div class="card-title">TM-score</div><div class="card-body">Topology-aware score, length-independent. 0–1; &gt;0.5 = same fold, &gt;0.8 = essentially correct.</div></div>
<div class="calc-card"><div class="card-title">RMSD</div><div class="card-body">Root mean squared deviation in Å after superposition. Intuitive but length-dependent and sensitive to outliers — a single floppy loop ruins the number.</div></div>
<div class="calc-card"><div class="card-title">pLDDT (AF2 only)</div><div class="card-body">AF2's predicted lDDT, per-residue. &gt;90 = very confident, 70-90 = confident backbone, 50-70 = low confidence, &lt;50 = often disordered. Color-coded blue→orange in every AF2 PyMOL view you have ever seen.</div></div>
</div>

<p class="l-text">Knowing which metric is being reported matters: GDT_TS ≈ 92 sounds amazing, RMSD ≈ 1.5 Å on the same target sounds perfect — they describe the same prediction with different lenses.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">10. pLDDT confidence per residue (visual)</h2>
<p class="l-text">A typical AlphaFold 2 output: a per-residue pLDDT trace for a 200-residue protein. Helices and beta strands score high; flexible loops and disordered N/C termini dip into the low-confidence band. Coloured zones match the canonical AF2 PyMOL palette.</p>
<div id="plot-bio-l2-plddt-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var grid = 'rgba(255,255,255,0.06)';
  var n = 200, x = [], y = [];
  for (var i=0; i<n; i++){
    x.push(i+1);
    var base;
    if (i < 15)         base = 45 + Math.random()*12;          // disordered N-term
    else if (i < 60)    base = 92 + Math.random()*5;           // alpha helix
    else if (i < 80)    base = 65 + Math.random()*10;          // loop
    else if (i < 120)   base = 88 + Math.random()*7;           // beta sheet
    else if (i < 140)   base = 58 + Math.random()*8;           // flexible loop
    else if (i < 185)   base = 90 + Math.random()*6;           // alpha helix
    else                base = 42 + Math.random()*15;          // disordered C-term
    y.push(Math.max(0, Math.min(100, base)));
  }
  function band(yLo, yHi, color){ return { type:'rect', x0:0, x1:n+1, y0:yLo, y1:yHi, fillcolor:color, opacity:0.18, line:{width:0} }; }
  var data = [{ x:x, y:y, type:'scatter', mode:'markers',
    marker:{ size:5, color:y,
      colorscale:[[0,'#ff7043'],[0.5,'#ffd166'],[0.7,'#6aa9ff'],[1,'#2962ff']],
      cmin:0, cmax:100, colorbar:{title:'pLDDT'} },
    hovertemplate:'residue %{x}<br>pLDDT %{y:.1f}<extra></extra>' }];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'residue index', gridcolor:grid},
    yaxis:{title:'pLDDT', gridcolor:grid, range:[0,100]},
    margin:{t:50,r:80,b:60,l:60}, title:{text:'pLDDT confidence per residue (simulated AF2-style trace)', font:{color:text, size:14}}, height:380,
    shapes: [band(90,100,'#2962ff'), band(70,90,'#6aa9ff'), band(50,70,'#ffd166'), band(0,50,'#ff7043')] };
  Plotly.newPlot('plot-bio-l2-plddt-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-bio-l2-plddt-tr');
  if (trDiv) Plotly.newPlot('plot-bio-l2-plddt-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> AlphaFold 2 is honest about uncertainty: structured cores score &gt;90, hinges and short loops drop to 70-80, intrinsically disordered termini fall below 50. When biology depends on a low-pLDDT region (binding loops, IDRs), AF2's own confidence tells you to verify with experiment or AF-Multimer.</div></div>
</div>`,
tr: `<p class="l-text"><strong>Anfinsen dogması (Nobel 1972), amino asit dizisinin 3B yapıyı belirlediğini söyler.</strong> Dizi, evrimin yazdığıdır; yapı, işi yapandır — reaksiyonları katalize eder, oksijen taşır, DNA'ya bağlanır, bir virüsün uç sivrisini oluşturur. Anfinsen'in hipotezi ile AlphaFold 2 arasındaki 50 yıl boyunca, protein katlanma problemi hesaplamalı biyolojinin en utanç verici açık problemiydi: cevabın dizide olduğunu biliyorduk ama çıkaramıyorduk. Yüz milyonlarca dolar ve Rosetta@home gönüllü-CPU-yılları, bazen iyi, sıkça yanlış ve asla hızlı olmayan tahminler verdi.</p>

<p class="l-text">Bu ders, derin öğrenme öncesi bölümdür — AlphaFold 2'nin CASP14'te (Kasım 2020) inmeden önce alanın bildiği şey. Protein yapısının dört seviyesini (birincil, ikincil, üçüncül, dördüncül) tanımlıyoruz, ikincil yapının (alfa heliksleri, beta tabakaları) neden kolay, üçüncülün neden zor olduğunu açıklıyoruz, 1B dizi ile 3B koordinatlar arasında köprü kuran 2B temsil olarak temas haritalarını tanıtıyoruz ve klasik yöntemlerden geçiyoruz: parça birleştirme (Rosetta, David Baker laboratuvarı, 2000'lerin ortası), homoloji modelleme ve fizik-tabanlı simülasyon (OpenMM ile Folding@home). Önce ne olduğunu bilmek, L3'teki AlphaFold 2'yi gerçekten olduğu mucize gibi hissettirir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Birincil, ikincil, üçüncül ve dördüncül yapıyı somut örneklerle ayırt etmek</li>
<li>Bir Ramachandran grafiğini okumak ve phi/psi açılarının neden helix ve sheet bölgelerine kümelendiğini açıklamak</li>
<li>3B koordinatlardan bir temas haritası kurmak ve bunun AF2 tahmin hedefi olarak rolünü açıklamak</li>
<li>Parça birleştirmeyi (Rosetta) ve homoloji modellemeyi (MODELLER, SWISS-MODEL) eskizlemek</li>
<li>CASP skorlarını okumak: GDT_TS, lDDT, TM-score ve "deneysel doğruluğa yakın"ın ne demek olduğu</li>
<li>Alanı 2019'daki haliyle yerine koymak — AlphaFold 2'nin 30 GDT puanı ile aşmak üzere olduğu çıta</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Protein Yapısının Dört Seviyesi</h2>
<p class="l-text">Bir proteinin organizasyonu dört seviyede tanımlanır; her seviye altındaki seviyeden ortaya çıkar. Protein katlanma problemi, tam olarak ıslak-laboratuvar deneyini yapmadan 1. seviyeden 3. seviyeye (ve bazen 4'e) gitme problemidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birincil</div><div class="card-body">Amino asit dizisinin kendisi — bir dizge. Gen tarafından belirlenir. UniProt'un FASTA olarak sakladığı şey budur. Örnek: hemoglobin alfa zinciri 141 rezidüye sahiptir.</div></div>
<div class="calc-card"><div class="card-title">İkincil</div><div class="card-body">Yerel omurga örüntüleri: alfa heliksleri (her dönüşte 3,6 rezidü, i ile i+4 arası hidrojen bağlı) ve beta tabakaları (paralel veya antiparalel iplikçikler yanal H-bağlı). Diziden güvenilir bir şekilde tahmin edilir — DSSP, PSIPRED 1990'lardan beri ~%80 doğruluk.</div></div>
<div class="calc-card"><div class="card-title">Üçüncül</div><div class="card-body">Tek zincirin tam 3B katlanması — her atom için (x, y, z) koordinatları. AlphaFold 2'nin tahmin ettiği şey budur. Yerel olmayan bir özelliği vardır, dolayısıyla zordur: rezidü 30, uzayda rezidü 120'ye temas edebilir.</div></div>
<div class="calc-card"><div class="card-title">Dördüncül</div><div class="card-body">Birden çok zincirin bir komplekse birleşmesi. Hemoglobin = 4 zincir (2 alfa + 2 beta). Antikorlar = ağır + hafif. AlphaFold-Multimer (2021) ve AlphaFold 3 (2024) bunu işler; AF2 tek başına yapamadı.</div></div>
</div>

<div class="calc-highlight"><strong>Üçüncül neden zor?</strong> Dizide 200 pozisyon arayla bulunan iki rezidü, 3B'de 5 ångström uzakta olabilir. Tamamen yerel bir model bunu göremez. Uzun-menzilli bir mekanizmaya ihtiyacınız var — MSA'lardan ko-evrim veya tüm zincir üzerinden dikkat. AF2 her ikisini de kullanır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Phi/Psi Açıları ve Ramachandran Grafiği</h2>
<p class="l-text">Protein omurgasının her rezidü başına üç burulma açısı vardır: phi, psi ve omega (peptit bağı, ~her zaman 180°). Phi ve psi serbestçe dönebilir. PDB'deki her rezidü için (phi, psi) çizimi Ramachandran grafiğini verir — ve sadece iki bölge yerleşiktir: (-60°, -45°) civarındaki alfa-helix bölgesi ve (-120°, +120°) civarındaki beta-sheet bölgesi. Diğer her phi/psi kombinasyonu sterik çakışmaya yol açar.</p>

<div class="katex-block">$$\phi_i = \text{dihedral}(C_{i-1},\, N_i,\, C\alpha_i,\, C_i), \qquad \psi_i = \text{dihedral}(N_i,\, C\alpha_i,\, C_i,\, N_{i+1})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Synthesize 200 residues clustered in helix vs sheet basins</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
helix = np.random.<span class="fn">normal</span>([-<span class="num">60</span>, -<span class="num">45</span>], <span class="num">10</span>, size=(<span class="num">120</span>, <span class="num">2</span>))
sheet = np.random.<span class="fn">normal</span>([-<span class="num">120</span>, <span class="num">120</span>], <span class="num">12</span>, size=(<span class="num">80</span>, <span class="num">2</span>))
phipsi = np.<span class="fn">vstack</span>([helix, sheet])

<span class="cm"># A simple classifier: which basin is each (phi, psi) closer to?</span>
centers = np.<span class="fn">array</span>([[-<span class="num">60</span>, -<span class="num">45</span>], [-<span class="num">120</span>, <span class="num">120</span>]])
dist = np.linalg.<span class="fn">norm</span>(phipsi[:, <span class="kw">None</span>, :] - centers[<span class="kw">None</span>, :, :], axis=-<span class="num">1</span>)
labels = dist.<span class="fn">argmin</span>(axis=<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">"Helix residues:"</span>, (labels == <span class="num">0</span>).<span class="fn">sum</span>(), <span class="str">"/ Sheet residues:"</span>, (labels == <span class="num">1</span>).<span class="fn">sum</span>())
<span class="fn">print</span>(<span class="str">"Mean phi/psi for helix cluster:"</span>, phipsi[labels==<span class="num">0</span>].<span class="fn">mean</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">1</span>))
<span class="fn">print</span>(<span class="str">"Mean phi/psi for sheet cluster:"</span>, phipsi[labels==<span class="num">1</span>].<span class="fn">mean</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">1</span>))
</code></pre></div>

<p class="l-text">Bu 2-satırlık kümeleme, DSSP'nin 1976'da açık hidrojen-bağı geometrisi kurallarıyla yaptığını yeniden üretir. Ders: ikincil yapı yerel olarak belirlenir ve hesaplama açısından ucuzdur; üçüncül değildir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Ko-evrim Olarak Çoklu Dizi Hizalama</h2>
<p class="l-text">İki rezidü fiziksel temasta ise, birinde mutasyon genellikle proteini stabil olmaktan çıkarır — diğeri telafi etmediği sürece. Milyonlarca yıl evrim boyunca, temas çiftleri birlikte değişir. İstatistiksel olarak: 1000 homologdan oluşan bir MSA'da, 30 ve 120 numaralı sütunların özdeşlikleri ancak ve ancak rezidüleri 3B'de temas ediyorsa korelasyonlu olur. AlphaFold 2'nin sömürdüğü merkezi sinyal budur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Synthetic MSA: 200 sequences, 12 columns, with cols 2 and 9 forced to coevolve</span>
np.random.<span class="fn">seed</span>(<span class="num">42</span>)
N, L = <span class="num">200</span>, <span class="num">12</span>
alphabet = <span class="fn">list</span>(<span class="str">"ACDEFGHIKLMNPQRSTVWY"</span>)
msa = np.random.<span class="fn">choice</span>(alphabet, size=(N, L))
<span class="cm"># Force coevolution: where col 2 is 'A', col 9 is 'V'; where col 2 is 'K', col 9 is 'D'</span>
mask = np.random.<span class="fn">rand</span>(N) &lt; <span class="num">0.7</span>
msa[mask, <span class="num">2</span>] = <span class="str">'A'</span>; msa[mask, <span class="num">9</span>] = <span class="str">'V'</span>
msa[~mask, <span class="num">2</span>] = <span class="str">'K'</span>; msa[~mask, <span class="num">9</span>] = <span class="str">'D'</span>

<span class="cm"># Mutual information per column pair: I(X,Y) = sum p(x,y) log p(x,y)/(p(x)p(y))</span>
<span class="kw">def</span> <span class="fn">mutual_info</span>(c1, c2):
    <span class="kw">from</span> collections <span class="kw">import</span> Counter
    n = <span class="fn">len</span>(c1)
    pxy = <span class="fn">Counter</span>(<span class="fn">zip</span>(c1, c2)); px = <span class="fn">Counter</span>(c1); py = <span class="fn">Counter</span>(c2)
    mi = <span class="num">0.0</span>
    <span class="kw">for</span> (x,y), nxy <span class="kw">in</span> pxy.<span class="fn">items</span>():
        mi += (nxy/n) * np.<span class="fn">log</span>((nxy/n) / ((px[x]/n) * (py[y]/n)))
    <span class="kw">return</span> mi

mi_matrix = np.<span class="fn">zeros</span>((L, L))
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(L):
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(L):
        <span class="kw">if</span> i != j: mi_matrix[i,j] = <span class="fn">mutual_info</span>(msa[:,i], msa[:,j])
top = np.<span class="fn">unravel_index</span>(np.<span class="fn">argmax</span>(mi_matrix), mi_matrix.shape)
<span class="fn">print</span>(<span class="str">"Strongest coevolving column pair:"</span>, top, <span class="str">"MI ="</span>, <span class="fn">round</span>(mi_matrix[top], <span class="num">2</span>))
</code></pre></div>

<p class="l-text">Az önce hesapladığımız saf MI sinyali, derin öğrenmeden önce kısmen çalışan temas tahmin edicilere DCA (Direct Coupling Analysis, Morcos 2011) ve PSICOV gibi araçlar, bu sinyali çalışan temas tahmin edicilerine dönüştürmek için inceltmiştir. AF2 tüm bunları Evoformer'ın içine entegre etmiştir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Temas Haritaları — 2B Köprü</h2>
<p class="l-text">Temas haritası, (i, j) girdisinin i ve j rezidüleri 8 Å yakınında ise (genellikle C-beta'dan C-beta'ya) 1 olduğu L×L bir ikili matristir. 1B dizi ile 3B koordinatlar arasındaki doğal ara hedeftir: koordinatlardan daha düşük boyutludur, ancak ayna görüntüsüne kadar katlanmayı yeniden inşa edecek kadar bilgi içerir. 2018 nesil katlayıcılar (RaptorX-Contact, trRosetta) derin CNN'lerle temas haritaları tahmin etti, sonra 3B gerçekleştirme için Rosetta'ya devretti.</p>

<div class="katex-block">$$C_{ij} = \mathbb{1}\big[\, \|r_i - r_j\| \le 8 \text{ Å} \,\big]$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Synthesize 3D coordinates for a 40-residue alpha-helical bundle</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
L = <span class="num">40</span>
t = np.<span class="fn">arange</span>(L)
<span class="cm"># 1.5 Å rise, 100° turn per residue (alpha helix geometry)</span>
x = <span class="num">2.3</span> * np.<span class="fn">cos</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span> * t))
y = <span class="num">2.3</span> * np.<span class="fn">sin</span>(np.<span class="fn">deg2rad</span>(<span class="num">100</span> * t))
z = <span class="num">1.5</span> * t
coords = np.<span class="fn">stack</span>([x, y, z], axis=<span class="num">1</span>)

<span class="cm"># Pairwise distance matrix and contact map</span>
diffs = coords[:, <span class="kw">None</span>, :] - coords[<span class="kw">None</span>, :, :]
dist = np.linalg.<span class="fn">norm</span>(diffs, axis=-<span class="num">1</span>)
contact = (dist &lt; <span class="num">8.0</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="fn">print</span>(<span class="str">"Distance matrix shape:"</span>, dist.shape, <span class="str">"  min off-diagonal:"</span>, <span class="fn">round</span>(dist[np.<span class="fn">triu_indices</span>(L,k=<span class="num">1</span>)].<span class="fn">min</span>(), <span class="num">2</span>), <span class="str">"Å"</span>)
<span class="fn">print</span>(<span class="str">"Contacts within 8 Å (off-diagonal):"</span>, contact[np.<span class="fn">triu_indices</span>(L, k=<span class="num">1</span>)].<span class="fn">sum</span>())
<span class="fn">print</span>(<span class="str">"Contact density:"</span>, <span class="fn">round</span>(contact[np.<span class="fn">triu_indices</span>(L,k=<span class="num">1</span>)].<span class="fn">mean</span>(), <span class="num">3</span>))
</code></pre></div>

<p class="l-text">Gerçek bir PDB yapısında köşegen temas bandı, helix'in i'den i+3'e hidrojen bağlarıdır; köşegen-dışı şeritler, helikslerarası paketleme veya beta-iplikçik eşleşmesidir. AF2 dahili olarak, dikkat ile incelenen temelde bu matrise eşdeğer bir "çift temsili" tutar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Parça Birleştirme — Baker Lab'ın Rosetta'sı</h2>
<p class="l-text">Rosetta (David Baker, 1990'ların sonu) iki on yıl boyunca baskın ab initio katlayıcı oldu. Fikir: hedef dizinin her 9-rezidülü penceresi, benzer yerel diziye sahip çözülmüş PDB yapılarından bir parça kütüphanesine karşı eşleştirilir. Bir Monte Carlo prosedürü parçaları takıp çıkarır ve van der Waals, elektrostatikler, hidrojen bağları ve bilgi-tabanlı bir terim birleştiren bir enerji fonksiyonu ile konformasyonları skorlar. On binlerce decoy üretilir; en düşük enerjili küme tahmindir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — pyrosetta bloke, yerel kütüphane gerekir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pyrosetta <span class="kw">import</span> init, pose_from_sequence, get_score_function
<span class="kw">from</span> pyrosetta.rosetta.protocols.abinitio <span class="kw">import</span> ClassicAbinitio
<span class="fn">init</span>()
pose = <span class="fn">pose_from_sequence</span>(<span class="str">"MAGIVAEKGCSCNYSAA"</span>)
abinitio = <span class="fn">ClassicAbinitio</span>(frag9, frag3, mm)
abinitio.<span class="fn">apply</span>(pose)
<span class="fn">print</span>(<span class="str">"Final energy:"</span>, <span class="fn">get_score_function</span>()(pose))
</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak parça-birleştirme Monte Carlo: sentetik bir omurga üzerinde rastgele phi/psi tedirginlikleri, taslak bir enerjiyi düşüren hareketleri kabul eder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

L = <span class="num">30</span>
phi_psi = np.random.<span class="fn">uniform</span>(-<span class="num">180</span>, <span class="num">180</span>, size=(L, <span class="num">2</span>))

<span class="kw">def</span> <span class="fn">energy</span>(angles):
    <span class="cm"># toy: penalize departure from helix basin</span>
    target = np.<span class="fn">array</span>([-<span class="num">60</span>, -<span class="num">45</span>])
    <span class="kw">return</span> np.linalg.<span class="fn">norm</span>(angles - target, axis=<span class="num">1</span>).<span class="fn">sum</span>()

current_E = <span class="fn">energy</span>(phi_psi)
best = phi_psi.<span class="fn">copy</span>(); best_E = current_E
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    i = np.random.<span class="fn">randint</span>(L)
    proposal = phi_psi.<span class="fn">copy</span>()
    proposal[i] += np.random.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">20</span>, size=<span class="num">2</span>)
    new_E = <span class="fn">energy</span>(proposal)
    <span class="kw">if</span> new_E &lt; current_E <span class="kw">or</span> np.random.<span class="fn">rand</span>() &lt; np.<span class="fn">exp</span>(-(new_E - current_E) / <span class="num">5</span>):
        phi_psi = proposal; current_E = new_E
        <span class="kw">if</span> new_E &lt; best_E: best = proposal.<span class="fn">copy</span>(); best_E = new_E

<span class="fn">print</span>(f<span class="str">"Start energy: {energy(np.random.uniform(-180,180,(L,2))):.1f}"</span>)
<span class="fn">print</span>(f<span class="str">"Final  energy: {best_E:.1f}  (target = 0 = perfect helix)"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Homoloji Modelleme — Yakın Akrabanız Olduğunda</h2>
<p class="l-text">Hedef dizinin yapısı bilinen yakın bir akrabası varsa (&gt;%30 kimlik), o yapıyı kopyalayıp ince ayar yapabilirsiniz. MODELLER (Sali 1993) ve SWISS-MODEL (1995) bunu otomatikleştirir: hedefi şablona hizala, omurgayı kopyala, hizalamada boşluk olan halkaları modelle, yan zincirleri optimize et. Bir şablon mevcutsa son derece iyi çalışır — AF2 öncesi çoğu "yapısal genomik" kapsamı bu şekilde elde edildi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ne zaman çalışır</div><div class="card-body">Bir PDB girdisine ≥%30 dizi kimliği olan hedefler. 2020'ye kadar insan proteinlerinin ~%50'sinin kullanılabilir bir şablonu vardı. SWISS-MODEL yılda 100.000+ iş çalıştırdı.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman başarısız olur</div><div class="card-body">"Alaca karanlık bölgesi" %15-25 kimlik, yeni katlanmalar ve yetim proteinler. İnsan proteinlerinin diğer ~%50'si. AF2'nin tam olarak kapattığı boşluk budur.</div></div>
<div class="calc-card"><div class="card-title">AF2 sonrası</div><div class="card-body">Homoloji modelleme büyük ölçüde devre dışı kalmıştır — AF2, şablon olsa bile onu geçer; çünkü şablonları dahili olarak birçok sinyalden biri olarak kullanmayı öğrenmiştir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Fizik-Tabanlı Simülasyon — Folding@home</h2>
<p class="l-text">Üçüncü klasik yaklaşım moleküler dinamik çalıştırmaktır: protein içindeki her atom artı çevresindeki suya, kuantum-mekanik etkileşimlerini klasik olarak yaklaşık eden bir kuvvet alanı (AMBER, CHARMM) ile Newton denklemlerini entegre etmek. Vijay Pande'nin Folding@home projesi 2000'den itibaren milyonlarca gönüllü GPU'yu birleştirdi; D. E. Shaw'un Anton süper bilgisayarı (2008) küçük proteinler için milisaniye simülasyonlarına ulaştı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — OpenMM Pyodide'de bloke)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> openmm.app <span class="kw">import</span> *
<span class="kw">from</span> openmm <span class="kw">import</span> *
<span class="kw">from</span> openmm.unit <span class="kw">import</span> *

pdb = <span class="fn">PDBFile</span>(<span class="str">'input.pdb'</span>)
forcefield = <span class="fn">ForceField</span>(<span class="str">'amber14-all.xml'</span>, <span class="str">'amber14/tip3pfb.xml'</span>)
system = forcefield.<span class="fn">createSystem</span>(pdb.topology, nonbondedMethod=PME, nonbondedCutoff=<span class="num">1</span>*nanometer)
integrator = <span class="fn">LangevinIntegrator</span>(<span class="num">300</span>*kelvin, <span class="num">1</span>/picosecond, <span class="num">0.002</span>*picoseconds)
sim = <span class="fn">Simulation</span>(pdb.topology, system, integrator)
sim.context.<span class="fn">setPositions</span>(pdb.positions)
sim.<span class="fn">minimizeEnergy</span>()
sim.<span class="fn">step</span>(<span class="num">50000</span>)   <span class="cm"># 100 ps of dynamics</span>
</code></pre></div>

<p class="l-text">Temel sorun: zaman adımları femtosaniyedir (10⁻¹⁵ s) ve katlanma mikrosaniyelerden milisaniyelere kadar sürer. Bu, simüle edilmiş bir katlanma başına 10⁹ ile 10¹² adım — en küçük proteinler dışında her şey için ulaşılamaz. Fizik-tabanlı katlanma genel problemi asla çözmedi; bağlanma-bölgesi dinamikleri gibi küçük hedefli sorular için hala faydalıdır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. CASP — Katlanmanın Olimpiyatları</h2>
<p class="l-text">Critical Assessment of Structure Prediction (CASP), 1994'ten bu yana iki yılda bir düzenlenen alanın kör kıyas testidir. Organizatörler birkaç düzine yayımlanmamış deneysel yapı toplar; takımlar diziden tahmin yapar; tahminler sonradan gerçeğe karşı puanlanır. Manşet metrik:</p>

<div class="katex-block">$$\text{GDT\_TS} = \frac{1}{4}(P_1 + P_2 + P_4 + P_8)$$</div>

<p class="l-text">Burada P_d, en iyi üst üste bindirmeden sonra gerçekten d ångström mesafesindeki rezidü yüzdesidir. 100 = mükemmel, 50 ≈ doğru topoloji, &lt;30 = yanlış katlanma. CASP13 (2018) galibi AlphaFold 1 zor hedeflerde ortalama ~58 GDT_TS aldı. CASP14 (2020) galibi AlphaFold 2 ortalama ~92 GDT_TS aldı — deneysel belirsizlik içinde.</p>

<div class="calc-highlight"><strong>AF2 öncesi fark:</strong> CASP14'teki en iyi DeepMind-dışı yöntem ortalama ~71 GDT_TS aldı. AF2, 21 puan öndeydi — bir döngüde iki CASP'lık ilerlemeye eşdeğer. Alanın çoğu eve gidip her şeyi onun etrafında yeniden yazdı. Sonraki ders, o kara kutunun içinde ne olduğudur.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Karşılaşacağınız Diğer Metrikler</h2>
<p class="l-text">CASP, AF2 çıktılarını bir metrik ailesi ile puanlar — tanımak yararlıdır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">lDDT-Cα</div><div class="card-body">Local Distance Difference Test: Cα atomları üzerinde üst üste bindirme-bağımsız skor. "Yerel atomik mesafeler korunuyor mu?" diye sorar. 0–100 aralığı, alan hareketine karşı dayanıklı. AF2'nin pLDDT'si rezidü-başına lDDT tahminidir.</div></div>
<div class="calc-card"><div class="card-title">TM-score</div><div class="card-body">Topoloji-farkında skor, uzunluk-bağımsız. 0–1 arası; &gt;0,5 = aynı katlanma, &gt;0,8 = esasen doğru.</div></div>
<div class="calc-card"><div class="card-title">RMSD</div><div class="card-body">Üst üste bindirme sonrası Å cinsinden ortalama karekök sapma. Sezgiseldir ama uzunluk-bağımlıdır ve aykırı değerlere duyarlıdır — tek bir gevşek halka sayıyı mahveder.</div></div>
<div class="calc-card"><div class="card-title">pLDDT (yalnızca AF2)</div><div class="card-body">AF2'nin tahmini lDDT'si, rezidü başına. &gt;90 = çok güvenli, 70-90 = güvenli omurga, 50-70 = düşük güven, &lt;50 = sıklıkla düzensiz. Gördüğünüz her AF2 PyMOL görünümünde mavi→turuncu renk kodlu.</div></div>
</div>

<p class="l-text">Hangi metriğin raporlandığını bilmek önemlidir: GDT_TS ≈ 92 inanılmaz görünür, aynı hedefte RMSD ≈ 1,5 Å mükemmel görünür — aynı tahmini farklı merceklerden tanımlarlar.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">10. Rezidü-başına pLDDT güveni (görsel)</h2>
<p class="l-text">Tipik bir AlphaFold 2 çıktısı: 200-rezidülü bir protein için rezidü-başına pLDDT izi. Helisler ve beta şeritleri yüksek puan alır; esnek halkalar ve düzensiz N/C uçları düşük-güven bandına düşer. Renkli bölgeler kanonik AF2 PyMOL paletini eşler.</p>
<div id="plot-bio-l2-plddt-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> AlphaFold 2 belirsizlik konusunda dürüsttür: yapılandırılmış çekirdekler &gt;90 puan alır, menteşeler ve kısa halkalar 70-80'e düşer, doğal düzensiz uçlar 50'nin altına iner. Biyoloji düşük-pLDDT bir bölgeye bağlıysa (bağlanma halkaları, IDR'ler), AF2'nin kendi güveni size deneyle veya AF-Multimer ile doğrulamanızı söyler.</div></div>
</div>`
};
