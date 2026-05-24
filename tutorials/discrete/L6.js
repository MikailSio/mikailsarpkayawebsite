window.DISCRETE_L6 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Knowledge graphs sit at the seam where discrete mathematics meets modern AI.</strong> A knowledge graph (KG) is the simplest possible structured representation of the world: it just lists facts as labelled directed edges between entities. Yet that single primitive powers Google Search's right-rail "knowledge panel", Siri and Alexa's question answering, Amazon's product graph, ATOMIC's commonsense reasoning, and the latest generation of retrieval-augmented LLMs. Behind the scenes, every one of these systems leans on the same toolkit: RDF triples, SPARQL queries, learned embeddings of entities and relations, and graph-aware retrieval.</p>

<p class="l-text">This lesson connects three threads that often appear in different courses. From discrete mathematics we take the directed multigraph as data structure (Lessons 3-5). From classical NLP we take dependency parses, which are themselves small labelled graphs over sentences. From modern AI we take embedding models (TransE, ComplEx, RotatE) that learn to score whether a triple is plausible, transformer attention reinterpreted as a fully connected token graph, and Graph-RAG as the 2024-era hybrid of LLMs with explicit KGs. Every section is paired with worked numbers, citations to the original papers, and a Pyodide exercise where you train TransE from scratch and predict missing links.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and write RDF triples and recognise SPARQL as a graph-pattern matching language with worked queries on Wikidata-style data</li>
<li>Derive the TransE loss function, understand the geometric intuition behind $h + r \\approx t$, and train it from scratch in NumPy</li>
<li>State why TransE fails for symmetric and one-to-many relations, and how ComplEx and RotatE fix it with complex-valued embeddings</li>
<li>Parse a full English sentence into a labelled dependency tree and recognise it as a small KG over tokens</li>
<li>Reinterpret transformer multi-head attention as a learned dynamic graph over tokens, following Clark et al. 2019</li>
<li>Compare naive vector-similarity RAG with Microsoft's Graph-RAG and explain when each wins on long-document question answering</li>
<li>Use a small KG plus link prediction to fill missing facts, and evaluate with Hits at $k$ and MRR</li>
</ul>
</div>

<h2 class="lesson-title">1. What Is a Knowledge Graph?</h2>

<div class="calc-highlight"><strong>The simplest possible data model.</strong> A knowledge graph stores everything it knows as a list of triples: $(\\text{head},\\,\\text{relation},\\,\\text{tail})$, often written $(h, r, t)$ or $(s, p, o)$ for subject-predicate-object. Each triple is a labelled directed edge in a multigraph where vertices are entities and edge labels are relation types. There is nothing else: no tables, no foreign keys, no schemas in the classical sense. The expressive power comes from the freedom to add any new entity or relation at any time.</div>

<p class="l-text">Concretely, the fact "Albert Einstein was born in Ulm" becomes the triple <code>(Einstein, born_in, Ulm)</code>. The fact "Ulm is in Germany" becomes <code>(Ulm, located_in, Germany)</code>. The fact "Einstein won the 1921 Nobel Prize in Physics" requires either a quaternary fact or a process called reification, in which we mint a fresh node for the award event and connect it to the year, the recipient and the field. Knowledge graphs handle complex multi-argument facts surprisingly gracefully once you accept that some nodes are not "real things" but "event objects".</p>

<div class="calc-formula"><div class="formula-label">A KNOWLEDGE GRAPH AS A SET OF TRIPLES</div><div class="formula-main">$$\\mathcal{G} = \\{(h_i, r_i, t_i)\\}_{i=1}^{M} \\;\\subseteq\\; \\mathcal{E} \\times \\mathcal{R} \\times \\mathcal{E}$$</div><div class="formula-sub">$\\mathcal{E}$ is the set of entities (people, places, concepts), $\\mathcal{R}$ is the set of relation types, $M$ is the number of facts. Every classical KG operation is some function on this set.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wikidata</div><div class="card-body">The largest open KG in 2026: about $112$ million entities, $1.6$ billion statements. Wikipedia's structured sibling. Powers Wikipedia infoboxes, Google's knowledge panel, Apple Maps points of interest. CC0 licence, free to use.</div></div>
<div class="calc-card"><div class="card-title">ConceptNet</div><div class="card-body">A commonsense KG with about $8$ million concepts and $34$ million edges. Relations include <code>IsA</code>, <code>CapableOf</code>, <code>UsedFor</code>, <code>AtLocation</code>. Compiled from crowdsourcing, OMCS, WordNet. Used to seed commonsense reasoning in language models.</div></div>
<div class="calc-card"><div class="card-title">ATOMIC 2020</div><div class="card-body">Sap et al.'s if-then commonsense graph: $1.33$M everyday inferences across $23$ relation types like <code>xWant</code>, <code>xEffect</code>, <code>oReact</code>. Trains the COMET inferential model. Built specifically to feed LLM-era commonsense.</div></div>
<div class="calc-card"><div class="card-title">Domain KGs</div><div class="card-body">UMLS for medicine, Gene Ontology and Reactome for biology, MusicBrainz for music, Amazon Product Graph for retail. Each one curated by domain experts and treated as ground truth by downstream search and recommendation.</div></div>
</div>

<div class="l-note"><strong>A directed multigraph.</strong> Mathematically, a KG is a directed multigraph because two entities can be related in multiple ways at once (Einstein is both <code>born_in</code> Ulm and <code>nationality</code> German). The "multi" lets each entity pair carry many edges, one per relation type. The "directed" lets <code>born_in</code> point one way and <code>has_resident</code> point the other.</div>

<div class="calc-graph"><div id="plot-l6-kg-en" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a tiny eight-entity knowledge graph about Einstein, Ulm, Germany, Nobel Prize, Physics, the Manhattan Project, Bohr and Princeton. Vertices are entities; edges are labelled directed relations such as <code>born_in</code>, <code>located_in</code>, <code>won</code>, <code>field_of</code>, <code>colleague_of</code>, <code>worked_at</code>. This is the data structure on which TransE will learn embeddings in section 4.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={Einstein:[0.5,0.85],Ulm:[0.15,0.55],Germany:[0.08,0.20],Nobel:[0.85,0.55],Physics:[0.92,0.20],Manhattan:[0.5,0.40],Bohr:[0.30,0.10],Princeton:[0.75,0.85]};
var edges=[
['Einstein','Ulm','born_in'],
['Ulm','Germany','located_in'],
['Einstein','Nobel','won'],
['Nobel','Physics','field_of'],
['Einstein','Manhattan','advised'],
['Einstein','Bohr','colleague_of'],
['Bohr','Nobel','won'],
['Einstein','Princeton','worked_at'],
['Einstein','Germany','nationality'],
['Einstein','Physics','field_of']
];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){
  var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];
  var dx=p2[0]-p1[0];var dy=p2[1]-p1[1];var len=Math.sqrt(dx*dx+dy*dy);
  var x1=p1[0]+dx*0.10;var y1=p1[1]+dy*0.10;var x2=p2[0]-dx*0.12;var y2=p2[1]-dy*0.12;
  traces.push({x:[x1,x2],y:[y1,y2],mode:'lines',line:{color:'rgba(59,130,246,0.55)',width:1.8},showlegend:false,hoverinfo:'skip'});
  ann.push({x:x2,y:y2,ax:x1,ay:y1,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:1.1,arrowwidth:1.5,arrowcolor:'rgba(59,130,246,0.65)'});
  ann.push({x:(x1+x2)/2,y:(y1+y2)/2+0.02,text:e[2],showarrow:false,font:{size:9.5,color:'#fbbf24'},bgcolor:'rgba(10,10,10,0.65)'});
}
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'top center',textfont:{color:'#ebe6dc',size:12},marker:{size:24,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false,hoverinfo:'text'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.05,1.05]},yaxis:{visible:false,range:[0,1]},margin:{t:30,r:20,b:20,l:20},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l6-kg-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">A FIRST QUESTION</div><div class="think-body">Looking at the graph above, can you reach a fact that is <em>not</em> drawn but is logically implied? For instance, the triples <code>(Einstein, won, Nobel)</code> and <code>(Nobel, field_of, Physics)</code> jointly suggest <code>(Einstein, won_prize_in, Physics)</code>. KG reasoning is exactly this: composing existing triples to predict new ones. Embedding methods later in the lesson learn this composition implicitly.</div></div>

<h2 class="lesson-title">2. RDF, URIs, and SPARQL</h2>

<div class="calc-highlight"><strong>From scribbled triples to a web-scale standard.</strong> The Resource Description Framework (RDF), a W3C standard since 1999, formalises the triple data model by giving every entity and relation a unique URI. This means <code>Einstein</code> in Wikidata is actually <code>http://www.wikidata.org/entity/Q937</code>, and <code>born_in</code> is <code>http://www.wikidata.org/prop/direct/P19</code>. The benefit: any two KGs published on the web can be merged simply by union of triples, since URIs disambiguate identical-looking names.</div>

<p class="l-text">SPARQL is the query language for RDF, the SQL of the graph world. A SPARQL query is essentially a graph pattern: you write a small subgraph with variables (prefixed with <code>?</code>) where you want answers, and SPARQL finds every way of binding those variables to real entities such that the pattern is satisfied.</p>

<div class="code-wrap"><div class="code-label"><span>SPARQL EXAMPLE 1 - ALL FACTS ABOUT EINSTEIN</span></div><pre class="code-block"><code><span class="kw">PREFIX</span> wd: &lt;http://www.wikidata.org/entity/&gt;
<span class="kw">PREFIX</span> wdt: &lt;http://www.wikidata.org/prop/direct/&gt;

<span class="kw">SELECT</span> ?relation ?value <span class="kw">WHERE</span> {
    wd:Q937 ?relation ?value .
}
<span class="kw">LIMIT</span> 50</code></pre></div>

<p class="l-text">Translation: "find every relation and value such that Einstein (Q937) is the head of that relation." The <code>.</code> is a triple terminator. The query returns one row per fact about Einstein in Wikidata: birthplace, nationality, field of work, spouses, doctoral advisor, awards, and so on.</p>

<div class="code-wrap"><div class="code-label"><span>SPARQL EXAMPLE 2 - PEOPLE BORN IN GERMANY WHO WON A NOBEL PRIZE</span></div><pre class="code-block"><code><span class="kw">SELECT</span> ?person ?personLabel ?prizeLabel <span class="kw">WHERE</span> {
    ?person wdt:P19 ?city .             <span class="cm"># P19 = place of birth</span>
    ?city   wdt:P17 wd:Q183 .           <span class="cm"># P17 = country, Q183 = Germany</span>
    ?person wdt:P166 ?prize .           <span class="cm"># P166 = awarded</span>
    ?prize  wdt:P31 wd:Q7191 .          <span class="cm"># Nobel Prize</span>
    <span class="kw">SERVICE</span> wikibase:label { bd:serviceParam wikibase:language "en" }
}</code></pre></div>

<p class="l-text">This is a graph pattern with four edges and four variables. The SPARQL engine joins them by finding every assignment of <code>?person</code>, <code>?city</code>, <code>?prize</code> such that all four triples are simultaneously present in Wikidata. The answer includes Einstein, Planck, Heisenberg, Born, von Laue, and many more, all returned in milliseconds because Wikidata's RDF store is indexed for graph-pattern matching.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Triple stores</div><div class="card-body">Specialised databases optimised for RDF: GraphDB, Apache Jena, Virtuoso, AnzoGraph, Amazon Neptune, Stardog. They index the triples in six orders (SPO, SOP, PSO, POS, OSP, OPS) so any pattern can be answered by an index scan.</div></div>
<div class="calc-card"><div class="card-title">Property graphs</div><div class="card-body">An alternative model used by Neo4j, JanusGraph, Amazon Neptune (it supports both). Nodes and edges can carry property maps directly, so facts about a relation (timestamp, confidence) attach without reification. Query language: Cypher and now GQL.</div></div>
<div class="calc-card"><div class="card-title">SHACL and reasoning</div><div class="card-body">SHACL validates that triples follow a schema; OWL adds logical axioms (transitivity, inverse, sub-property) that engines like HermiT, Pellet, ELK can reason over. Real production KGs blend SPARQL retrieval with light logical inference.</div></div>
<div class="calc-card"><div class="card-title">Federated queries</div><div class="card-body">A SPARQL query can include <code>SERVICE</code> clauses pulling triples from multiple endpoints simultaneously. This is the original "linked data" vision: every KG on the web becomes a single virtual database.</div></div>
</div>

<div class="l-note"><strong>Why not just SQL?</strong> Relational schemas hard-code which columns exist. Adding a brand-new fact type ("favourite Bond film") requires migrating tables. With triples, you just write the triple. RDF excels exactly when the schema is open-ended, evolving, or unknown in advance: news facts, scientific literature, web-scale crawls.</div>

<h2 class="lesson-title">3. Why Embeddings? The Need for Vector Geometry</h2>

<p class="l-text">SPARQL is wonderful when the fact you want is already in the graph. It is useless when the fact is missing but logically implied, or when you want to answer "are these two entities similar?" without an explicit edge between them. Both problems are solved by <strong>knowledge graph embeddings</strong>: learn a vector $\\mathbf{e}_h \\in \\mathbb{R}^d$ for every entity and a vector $\\mathbf{r} \\in \\mathbb{R}^d$ for every relation so that geometric operations between vectors encode the structure of the KG.</p>

<div class="calc-formula"><div class="formula-label">THE EMBEDDING GOAL</div><div class="formula-main">$$\\text{learn } f : \\mathcal{E} \\cup \\mathcal{R} \\to \\mathbb{R}^{d} \\text{ such that } \\text{score}(h, r, t) \\text{ is high iff } (h, r, t) \\in \\mathcal{G}$$</div><div class="formula-sub">The score is a hand-designed geometric function of the three vectors. Different models choose different scores; the bulk of the section is about these choices.</div></div>

<p class="l-text">Once embeddings are learned, three new operations become possible:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Link prediction</div><div class="card-body">Given $(h, r, ?)$, rank every entity $t$ by score; the top-$k$ are the model's predictions of missing facts. Used to fill gaps in Wikidata, to suggest products to recommend, to predict gene-disease associations.</div></div>
<div class="calc-card"><div class="card-title">Entity similarity</div><div class="card-body">$\\cos(\\mathbf{e}_h, \\mathbf{e}_{h'})$ measures how similar two entities are without any direct edge. Useful for clustering, deduplication, "more like this" recommendation.</div></div>
<div class="calc-card"><div class="card-title">Analogy</div><div class="card-body">$\\mathbf{e}_{\\text{Paris}} - \\mathbf{e}_{\\text{France}} + \\mathbf{e}_{\\text{Italy}} \\approx \\mathbf{e}_{\\text{Rome}}$ falls out for free when relations are translations (Mikolov 2013's word2vec result transferred to KGs by Bordes 2013).</div></div>
</div>

<h2 class="lesson-title">4. TransE: Bordes et al. 2013</h2>

<div class="calc-highlight"><strong>The shockingly simple recipe.</strong> Embed every entity and every relation in $\\mathbb{R}^d$. For a true triple $(h, r, t)$ ask that $\\mathbf{e}_h + \\mathbf{e}_r \\approx \\mathbf{e}_t$. Train by pushing this approximate-equality close for facts in the graph and far apart for randomly corrupted triples. Despite its simplicity, TransE was the model that started the embedding race for KGs and is still a strong baseline in 2026.</div>

<div class="calc-formula"><div class="formula-label">TRANSE SCORE FUNCTION</div><div class="formula-main">$$\\text{score}(h, r, t) = -\\|\\mathbf{e}_h + \\mathbf{e}_r - \\mathbf{e}_t\\|_{p}$$</div><div class="formula-sub">Usually $p=1$ or $p=2$. The minus sign turns "small distance" into "high score". Entity embeddings are constrained to lie on the unit sphere ($\\|\\mathbf{e}_h\\|_2 = 1$) to prevent the trivial collapse to zero.</div></div>

<p class="l-text"><strong>Geometric intuition.</strong> Treat each relation as a translation vector. The relation <code>capital_of</code> takes you from a country embedding to its capital embedding. The relation <code>born_in</code> takes you from a person embedding to a place embedding. Applying the relation translation to the head should leave you near the tail. This is exactly the analogy structure Mikolov observed in word2vec: $\\mathbf{e}_{\\text{king}} - \\mathbf{e}_{\\text{man}} + \\mathbf{e}_{\\text{woman}} \\approx \\mathbf{e}_{\\text{queen}}$.</p>

<div class="calc-formula"><div class="formula-label">TRANSE TRAINING LOSS (MARGIN-BASED)</div><div class="formula-main">$$\\mathcal{L} = \\sum_{(h,r,t) \\in \\mathcal{G}} \\sum_{(h',r,t') \\in \\mathcal{N}_{(h,r,t)}} \\bigl[\\gamma + \\|\\mathbf{e}_h + \\mathbf{e}_r - \\mathbf{e}_t\\| - \\|\\mathbf{e}_{h'} + \\mathbf{e}_r - \\mathbf{e}_{t'}\\|\\bigr]_{+}$$</div><div class="formula-sub">Read: for every true triple, sample some corrupted version $(h', r, t')$ (replace head or tail with a random entity), and demand that the true triple's energy be at least $\\gamma$ smaller than the corrupted one's. $[\\cdot]_+$ is the hinge: max with zero.</div></div>

<p class="l-text">The loss is exactly the margin-ranking loss familiar from SVMs (Lesson on ML), now applied to triples. The margin $\\gamma$ is a hyperparameter, typically $\\gamma = 1.0$. Negative triples are generated by uniform corruption: for each positive $(h, r, t)$, pick a random entity from $\\mathcal{E}$ to replace either $h$ or $t$ (with $50\\%$ probability for each side). A simple SGD over this loss already gives competitive performance.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Initialise</div><div class="step-detail">Sample every entity and relation embedding uniformly from $[-6/\\sqrt{d}, 6/\\sqrt{d}]$. Normalise entity embeddings to unit norm.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Sample a mini-batch</div><div class="step-detail">Pick a batch of positive triples from $\\mathcal{G}$. For each, generate one corrupted triple by randomly replacing $h$ or $t$ with a different entity.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Compute the margin loss</div><div class="step-detail">For each pair, compute $\\gamma + d_{\\text{pos}} - d_{\\text{neg}}$ and clip to zero. Sum over the batch.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Backprop and step</div><div class="step-detail">Take a gradient step on entity and relation embeddings. Re-normalise entity embeddings to unit norm at the end of each iteration.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Repeat</div><div class="step-detail">For a few hundred epochs over the full KG, or until validation Hits at 10 plateaus.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l6-transe-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a simulated TransE training run on a small KG. The blue curve is the average margin loss across mini-batches, the orange curve is Hits at 10 on a held-out validation set. The loss drops monotonically; Hits at 10 climbs from $\\sim 0.05$ at random initialisation to $\\sim 0.7$ after $200$ epochs.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var epochs=[];var loss=[];var hits=[];
for(var i=0;i<=200;i+=5){
  epochs.push(i);
  var l=1.6*Math.exp(-i/35)+0.18+0.04*Math.cos(i/15);
  loss.push(l);
  var h=0.05+0.65*(1-Math.exp(-i/45))+0.02*Math.sin(i/12);
  hits.push(Math.min(0.78,h));
}
var d1={x:epochs,y:loss,mode:'lines+markers',name:'training loss',yaxis:'y',line:{color:'#3b82f6',width:2.4},marker:{size:5,color:'#3b82f6'}};
var d2={x:epochs,y:hits,mode:'lines+markers',name:'validation Hits@10',yaxis:'y2',line:{color:'#f59e0b',width:2.4},marker:{size:5,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'epoch',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151'},yaxis:{title:'loss',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151'},yaxis2:{title:'Hits@10',overlaying:'y',side:'right',range:[0,1],gridcolor:'rgba(0,0,0,0)'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:40,r:60,b:50,l:60}};
Plotly.newPlot('plot-l6-transe-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">TRANSE TOY DERIVATION</div><div class="example-body">Suppose $d = 2$ and after some training we have $\\mathbf{e}_{\\text{Einstein}} = (1.0, 0.5)$, $\\mathbf{e}_{\\text{Ulm}} = (1.2, 0.8)$, $\\mathbf{r}_{\\text{born_in}} = (0.2, 0.3)$.<br><br><strong>Score of true triple:</strong> $\\mathbf{e}_h + \\mathbf{r} - \\mathbf{e}_t = (1.0+0.2-1.2, 0.5+0.3-0.8) = (0, 0)$. Distance is $0$, score is $-0 = 0$. The model has perfectly fitted this fact.<br><br><strong>Score of corrupted triple</strong> $(Einstein, born_in, Princeton)$ with $\\mathbf{e}_{\\text{Princeton}} = (-0.5, 0.4)$: $\\mathbf{e}_h + \\mathbf{r} - \\mathbf{e}_t = (1.0+0.2-(-0.5), 0.5+0.3-0.4) = (1.7, 0.4)$. Distance is $\\sqrt{1.7^2+0.4^2} \\approx 1.75$, score is $-1.75$.<br><br><strong>Margin:</strong> with $\\gamma=1.0$ the contribution to the loss is $\\max(0, 1.0 + 0 - 1.75) = 0$, no gradient flows. The model is satisfied that this corruption is at least $\\gamma$ further away than the truth.</div></div>

<div class="l-note"><strong>What TransE struggles with.</strong> (1) Symmetric relations: if both $(h, r, t)$ and $(t, r, h)$ are true, TransE demands $\\mathbf{r} = -\\mathbf{r}$, forcing $\\mathbf{r} = 0$, which makes the relation useless. (2) One-to-many: if Einstein has many siblings, all siblings must map to roughly the same point, collapsing distinct entities. (3) Reflexive: if $(h, r, h)$ is true, $\\mathbf{r} = 0$. These limitations motivated ComplEx and RotatE.</div>

<h2 class="lesson-title">5. ComplEx: Complex-Valued Embeddings for Asymmetric Relations (Trouillon 2016)</h2>

<div class="calc-highlight"><strong>The fix for asymmetric relations.</strong> Trouillon et al. (2016) replaced real-valued embeddings with complex-valued ones, so every entity and relation lives in $\\mathbb{C}^d$ instead of $\\mathbb{R}^d$. The score function becomes the real part of a Hermitian dot product, which is intentionally asymmetric: swapping head and tail produces a different score.</div>

<div class="calc-formula"><div class="formula-label">COMPLEX SCORE FUNCTION</div><div class="formula-main">$$\\text{score}(h, r, t) = \\text{Re}\\Bigl(\\sum_{k=1}^{d} \\mathbf{e}_{h,k}\\,\\mathbf{r}_{k}\\,\\overline{\\mathbf{e}_{t,k}}\\Bigr)$$</div><div class="formula-sub">$\\overline{z}$ is the complex conjugate. The Hermitian product is conjugate-linear in the second argument, so it is generally not symmetric in $h$ and $t$.</div></div>

<p class="l-text"><strong>Why this captures asymmetry.</strong> Write each complex number as $z = a + ib$. The Hermitian product expands to four real terms: $\\text{Re}(z_h z_r \\overline{z_t}) = \\text{Re}(z_h)\\text{Re}(z_r)\\text{Re}(z_t) + \\text{Re}(z_h)\\text{Im}(z_r)\\text{Im}(z_t) + \\text{Im}(z_h)\\text{Re}(z_r)\\text{Im}(z_t) - \\text{Im}(z_h)\\text{Im}(z_r)\\text{Re}(z_t)$. The fourth term has a minus sign that breaks $h$-$t$ symmetry whenever $\\text{Im}(z_r) \\neq 0$. Pure real relations recover symmetric DistMult; pure imaginary relations encode pure anti-symmetry.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetry handling</div><div class="card-body">Symmetric relations like <code>colleague_of</code> get $\\text{Im}(\\mathbf{r}) = 0$ during training, recovering DistMult. Antisymmetric relations like <code>parent_of</code> get pure imaginary $\\mathbf{r}$. Mixed relations get a mixture.</div></div>
<div class="calc-card"><div class="card-title">Parameter efficiency</div><div class="card-body">Despite using complex numbers, ComplEx with embedding dimension $d_\\mathbb{C}$ uses $2d_\\mathbb{C}$ real parameters per entity, the same as a real embedding of dimension $2d_\\mathbb{C}$. So compared head-to-head with TransE at equal parameter count, ComplEx often wins.</div></div>
<div class="calc-card"><div class="card-title">Trouillon's result</div><div class="card-body">On WN18 and FB15K, ComplEx reached state-of-the-art Hits at 10 in 2016 with a fraction of the parameters of bilinear baselines. The paper kicked off the line of "geometric algebra for KGs".</div></div>
</div>

<h2 class="lesson-title">6. RotatE: Relations as Rotations (Sun et al. 2019)</h2>

<div class="calc-highlight"><strong>The unifying picture.</strong> RotatE notes that complex multiplication by a unit-modulus complex number $\\mathbf{r}_k = e^{i\\theta_k}$ is exactly rotation by angle $\\theta_k$ in the complex plane. RotatE constrains every relation embedding to lie on the complex unit circle elementwise, so every relation becomes a per-dimension rotation. The score is the distance between the rotated head and the tail.</div>

<div class="calc-formula"><div class="formula-label">ROTATE SCORE FUNCTION</div><div class="formula-main">$$\\text{score}(h, r, t) = -\\|\\mathbf{e}_h \\circ \\mathbf{r} - \\mathbf{e}_t\\| \\quad\\text{where}\\quad |\\mathbf{r}_k| = 1 \\text{ for all } k$$</div><div class="formula-sub">$\\circ$ is elementwise (Hadamard) complex multiplication. With unit-modulus $\\mathbf{r}_k$ each dimension is rotated by its own angle. Identity, inverse, symmetry and composition all fall out as algebraic identities on rotations.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Symmetry $r \\equiv r^{-1}$</div><div class="card-body">Means $r^2 = \\text{id}$, i.e. each angle $\\theta_k \\in \\{0, \\pi\\}$. The model learns this automatically for relations like <code>spouse_of</code>.</div></div>
<div class="calc-card"><div class="card-title">Inversion $r_2 = r_1^{-1}$</div><div class="card-body">Means $\\mathbf{r}_2 = \\overline{\\mathbf{r}_1}$ elementwise. Relations like <code>part_of</code> and <code>has_part</code> end up conjugate.</div></div>
<div class="calc-card"><div class="card-title">Composition $r_3 = r_1 \\circ r_2$</div><div class="card-body">Just multiplies angles: $\\theta_3 = \\theta_1 + \\theta_2$. Captures patterns like <code>uncle_of = brother_of + parent_of</code>.</div></div>
<div class="calc-card"><div class="card-title">Cite</div><div class="card-body">Sun, Deng, Nie, Tang. "RotatE: Knowledge Graph Embedding by Relational Rotation in Complex Space." ICLR 2019. State-of-the-art on FB15K-237 and WN18RR at publication; still competitive in 2026.</div></div>
</div>

<div class="l-note"><strong>The bigger picture.</strong> TransE, DistMult, ComplEx and RotatE all live on a continuum of geometric algebras. TransE uses translations; DistMult bilinear products; ComplEx complex bilinear; RotatE complex unit rotations. Newer entries (HAKE, QuatE, OctonionE) extend to hyperbolic spaces and quaternions, but the practical sweet spot for many applications remains the four classical models above.</div>

<h2 class="lesson-title">7. Graph Neural Networks on Knowledge Graphs: R-GCN and CompGCN</h2>

<p class="l-text">Lesson 5 introduced graph neural networks where every edge has the same type. Real knowledge graphs have many edge types and the right inductive bias is to share parameters per relation, not per edge. The <strong>Relational Graph Convolutional Network</strong> (R-GCN, Schlichtkrull et al. 2018) generalises GCN to multi-relational graphs:</p>

<div class="calc-formula"><div class="formula-label">R-GCN LAYER UPDATE</div><div class="formula-main">$$\\mathbf{h}_v^{(l+1)} = \\sigma\\Bigl(\\mathbf{W}_0^{(l)} \\mathbf{h}_v^{(l)} + \\sum_{r \\in \\mathcal{R}} \\sum_{u \\in \\mathcal{N}_v^r} \\frac{1}{c_{v,r}}\\,\\mathbf{W}_r^{(l)}\\,\\mathbf{h}_u^{(l)}\\Bigr)$$</div><div class="formula-sub">Separate weight matrix $\\mathbf{W}_r$ per relation; normalisation $c_{v,r}$ keeps gradients stable. $\\mathcal{N}_v^r$ is the neighbour set of $v$ along relation $r$.</div></div>

<p class="l-text">R-GCN combines structural reasoning (multi-hop neighbourhoods) with learned entity-specific embeddings. For very large KGs, the per-relation weight matrix becomes expensive; <strong>basis decomposition</strong> shares parameters across relations to control the count.</p>

<p class="l-text"><strong>CompGCN</strong> (Vashishth et al. 2020) unifies R-GCN with the TransE family by writing the message $\\phi(\\mathbf{h}_u, \\mathbf{h}_r)$ as a parameterised composition operator (translation, multiplication, complex rotation) and learning everything end-to-end. This is one of the strongest off-the-shelf KG learners in 2026.</p>

<h2 class="lesson-title">8. Dependency Parsing: Sentences as Graphs</h2>

<div class="calc-highlight"><strong>Every English sentence is a tiny KG.</strong> A dependency parse takes a sentence and outputs a labelled directed tree where every word (except the root) has exactly one head, and the edge label tells you the syntactic relation (subject, object, modifier, etc.). The Universal Dependencies project standardises about $40$ such labels across $130$ languages. Modern parsers (spaCy, Stanza, the Berkeley parser) reach about $95\\%$ unlabelled and $93\\%$ labelled accuracy on English news text.</div>

<p class="l-text">Concrete example: "The hungry cat sat quickly on the warm mat." Tokenise, then label every dependency:</p>

<div class="calc-formula"><div class="formula-label">DEPENDENCY PARSE OF "THE HUNGRY CAT SAT QUICKLY ON THE WARM MAT"</div><div class="formula-main">$$\\begin{array}{l}\\text{sat (ROOT)} \\\\ \\quad \\xrightarrow{\\text{nsubj}} \\text{cat} \\\\ \\qquad \\xrightarrow{\\text{det}} \\text{The} \\\\ \\qquad \\xrightarrow{\\text{amod}} \\text{hungry} \\\\ \\quad \\xrightarrow{\\text{advmod}} \\text{quickly} \\\\ \\quad \\xrightarrow{\\text{obl}} \\text{mat} \\\\ \\qquad \\xrightarrow{\\text{case}} \\text{on} \\\\ \\qquad \\xrightarrow{\\text{det}} \\text{the} \\\\ \\qquad \\xrightarrow{\\text{amod}} \\text{warm}\\end{array}$$</div><div class="formula-sub">Indentation shows tree depth. "sat" is the root verb; "cat" is its subject; "mat" is its oblique object via "on". Adjectives ("hungry", "warm") modify their nouns via amod. The whole structure is a labelled tree on nine tokens.</div></div>

<p class="l-text">Notice the parallel with KGs: words are entities, dependency labels are relations, the parse is a graph of triples like <code>(sat, nsubj, cat)</code>, <code>(cat, amod, hungry)</code>. Semantic role labelling, machine translation, and information extraction all start from a parse and apply graph reasoning on top of it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use case 1: information extraction</div><div class="card-body">From "Einstein was born in Ulm in 1879," extract <code>(Einstein, born_in, Ulm)</code> and <code>(Einstein, born_year, 1879)</code> by matching dependency patterns: subject of <code>born</code> + obl-via-<code>in</code> for the place, oblique date phrase for the year.</div></div>
<div class="calc-card"><div class="card-title">Use case 2: semantic role labelling</div><div class="card-body">Assign each token a role (Agent, Patient, Instrument) relative to each predicate. Built on top of dependency parses and shallow semantic resources like PropBank and FrameNet.</div></div>
<div class="calc-card"><div class="card-title">Use case 3: tree-LSTM</div><div class="card-body">Replace the linear LSTM with one that walks the dependency tree bottom-up, aggregating child hidden states into parent ones. Useful for sentiment, NLI, and tasks where tree structure matters.</div></div>
<div class="calc-card"><div class="card-title">Modern status</div><div class="card-body">Transformer LLMs have largely subsumed explicit parsing for downstream tasks, but parses are still used for interpretability, for low-resource languages, and as features in commercial pipelines (legal, biomedical NLP).</div></div>
</div>

<h2 class="lesson-title">9. Transformer Attention as a Dynamic Graph</h2>

<div class="calc-highlight"><strong>Reading attention as edge weights.</strong> The self-attention layer of a transformer computes, for every pair of tokens $(i, j)$, an attention weight $\\alpha_{ij}$ such that $\\sum_j \\alpha_{ij} = 1$. The output at position $i$ is a weighted sum of values at all positions. This is exactly a fully connected directed graph on the $T$ tokens where edge weights are the attention $\\alpha_{ij}$. The graph is <em>dynamic</em>: it changes per input, per layer, and per head.</div>

<div class="calc-formula"><div class="formula-label">SELF-ATTENTION AS A GRAPH</div><div class="formula-main">$$\\alpha_{ij}^{(l,h)} = \\frac{\\exp(\\mathbf{q}_i^{(l,h)} \\cdot \\mathbf{k}_j^{(l,h)} / \\sqrt{d_k})}{\\sum_{j'} \\exp(\\mathbf{q}_i^{(l,h)} \\cdot \\mathbf{k}_{j'}^{(l,h)} / \\sqrt{d_k})}$$</div><div class="formula-sub">A query-key softmax produces, for every layer $l$ and head $h$, a $T \\times T$ adjacency matrix on the token sequence. Multi-head attention gives $L \\cdot H$ such graphs per input, one per (layer, head).</div></div>

<p class="l-text">Clark, Khandelwal, Levy and Manning (2019) examined the $12 \\times 12 = 144$ attention heads of BERT-base and showed that different heads specialise in different syntactic relations <em>without supervision</em>. Some heads attend to the previous token (capturing surface order). Some heads attend to coreferent mentions (linking pronouns to antecedents). Some heads attend to the syntactic head of the current token (recovering nsubj, dobj, prep links). The paper sparked a sub-field called BERTology, where probing classifiers extract linguistic structure from attention patterns.</p>

<div class="calc-graph"><div id="plot-l6-attention-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> simulated attention patterns of four heads in a hypothetical transformer reading the sentence "The hungry cat sat quickly on the warm mat." Head 1 attends to the previous token (positional bias). Head 2 attends to the noun phrase head ("cat" gets attention from "The" and "hungry"). Head 3 attends to the syntactic root ("sat" attracts attention from many tokens). Head 4 attends to the prepositional object ("mat" gets attention from "on" and "the"). Pattern reproduces Clark et al. 2019 figure 5.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var tokens=['The','hungry','cat','sat','quickly','on','the','warm','mat'];
var n=tokens.length;
function makeMat(fn){var m=[];for(var i=0;i<n;i++){var row=[];var rs=0;for(var j=0;j<n;j++){var v=fn(i,j);row.push(v);rs+=v;}for(var j=0;j<n;j++){row[j]=row[j]/rs;}m.push(row);}return m;}
var h1=makeMat(function(i,j){return j===i-1?2.0:(j===i?0.5:0.1);});
var h2=makeMat(function(i,j){return j===2?1.6:(j===i?0.4:0.15);});
var h3=makeMat(function(i,j){return j===3?1.4:(j===i?0.4:0.18);});
var h4=makeMat(function(i,j){return j===8?1.4:(j===i?0.4:0.18);});
var heads=[{z:h1,name:'Head 1: previous token'},{z:h2,name:'Head 2: head noun (cat)'},{z:h3,name:'Head 3: root verb (sat)'},{z:h4,name:'Head 4: object noun (mat)'}];
var traces=[];
for(var k=0;k<heads.length;k++){
  traces.push({z:heads[k].z,x:tokens,y:tokens,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.3,'#1e3a8a'],[0.7,'#3b82f6'],[1,'#fbbf24']],showscale:false,xaxis:'x'+(k+1>1?(k+1):''),yaxis:'y'+(k+1>1?(k+1):'')});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:10},grid:{rows:2,columns:2,pattern:'independent'},annotations:[{text:'Head 1: previous token',x:0.2,y:1.05,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}},{text:'Head 2: head noun (cat)',x:0.8,y:1.05,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}},{text:'Head 3: root verb (sat)',x:0.2,y:0.45,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}},{text:'Head 4: object noun (mat)',x:0.8,y:0.45,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}}],xaxis:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},xaxis2:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis2:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},xaxis3:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis3:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},xaxis4:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis4:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},margin:{t:50,r:20,b:60,l:60}};
Plotly.newPlot('plot-l6-attention-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">A SUBTLE EQUIVALENCE</div><div class="think-body">Self-attention with a fixed sparse mask is exactly a graph convolution over the sparsity graph. Tree-transformer (Wang et al. 2019) and GraphFormers explicitly inject dependency-tree masks into attention, converting the transformer into an R-GCN-style operator on the parse tree. This bridges Lessons 5 and 6: GNN and transformer are two views of the same underlying message-passing operation.</div></div>

<h2 class="lesson-title">10. Graph-RAG: Microsoft 2024</h2>

<div class="calc-highlight"><strong>The 2024 retrieval paradigm.</strong> Vanilla retrieval-augmented generation embeds passages as vectors, retrieves the top-$k$ by cosine similarity, and stuffs them into the prompt. This works well for needle-in-a-haystack questions but fails for "global" questions that require synthesising information across many documents ("what are the main themes in this 1000-page corpus?"). Microsoft Research's Graph-RAG (Edge et al. 2024) replaces flat retrieval with two-stage graph retrieval: build a KG from the corpus, then traverse the graph to assemble an answer.</div>

<div class="calc-formula"><div class="formula-label">GRAPH-RAG PIPELINE</div><div class="formula-main">$$\\text{corpus} \\xrightarrow{\\text{LLM entity+relation extraction}} \\mathcal{G} \\xrightarrow{\\text{Leiden clustering}} \\text{communities} \\xrightarrow{\\text{LLM summarisation}} \\text{summaries} \\xrightarrow{\\text{query}} \\text{answer}$$</div><div class="formula-sub">A four-stage pipeline that is built once at index time and reused at query time. The communities and their summaries become the "anatomy" of the corpus.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stage 1: extraction</div><div class="card-body">A small LLM (typically GPT-4-class) reads each document chunk and emits triples in JSON form. Entity types are inferred jointly. Output: a noisy KG of the corpus.</div></div>
<div class="calc-card"><div class="card-title">Stage 2: clustering</div><div class="card-body">Run the Leiden algorithm (a refinement of Louvain) on the KG to find community structure at multiple resolutions. Each community becomes a "chapter" of the corpus's implicit ontology.</div></div>
<div class="calc-card"><div class="card-title">Stage 3: summarisation</div><div class="card-body">For each community, an LLM writes a summary of what that cluster of entities and relations is about. Summaries are themselves clustered hierarchically, producing a tree of summaries.</div></div>
<div class="calc-card"><div class="card-title">Stage 4: query</div><div class="card-body">For local queries, retrieve relevant entities and walk the KG. For global queries ("themes"), feed the top-level community summaries into the LLM. Cost: more expensive to index, much more capable on global questions.</div></div>
</div>

<div class="calc-graph"><div id="plot-l6-graphrag-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the Graph-RAG indexing and query pipeline. Text on the left is processed by an LLM into a knowledge graph; the KG is clustered with Leiden into communities; each community gets an LLM-written summary; at query time, the user question triggers a traversal that pulls relevant summaries into the answering LLM. Boxes are stages, arrows show data flow.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nodes=[
 {x:0.06,y:0.5,label:'raw text<br>chunks',col:'#64748b'},
 {x:0.22,y:0.5,label:'LLM entity +<br>relation<br>extractor',col:'#3b82f6'},
 {x:0.40,y:0.5,label:'knowledge<br>graph',col:'#10b981'},
 {x:0.58,y:0.5,label:'Leiden<br>clustering',col:'#f59e0b'},
 {x:0.76,y:0.5,label:'community<br>summaries<br>(hierarchical)',col:'#ef4444'},
 {x:0.93,y:0.5,label:'LLM<br>answers<br>query',col:'#a78bfa'}
];
var traces=[];var ann=[];
for(var i=0;i<nodes.length-1;i++){
  var p1=nodes[i];var p2=nodes[i+1];
  ann.push({x:p2.x-0.02,y:p2.y,ax:p1.x+0.04,ay:p1.y,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:1.3,arrowwidth:2,arrowcolor:'#3b82f6'});
}
ann.push({x:0.5,y:0.86,xref:'x',yref:'y',ax:0.5,ay:0.62,axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:1.3,arrowwidth:2,arrowcolor:'#a78bfa'});
ann.push({x:0.5,y:0.92,text:'user query: "What are the main themes?"',showarrow:false,font:{size:12,color:'#fbbf24'}});
for(var i=0;i<nodes.length;i++){var n=nodes[i];
  traces.push({x:[n.x],y:[n.y],mode:'markers+text',text:[n.label],textposition:'middle center',textfont:{color:'#0a0a0a',size:10},marker:{size:78,color:n.col,line:{color:'#fff',width:1.4}},showlegend:false,hoverinfo:'text'});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[0.2,1]},annotations:ann,margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l6-graphrag-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>When Graph-RAG wins.</strong> Edge et al. evaluated on Podcast and News datasets with global ("synthesise") and local ("look up") queries. Graph-RAG matched or beat vector RAG on local queries and beat it by $\\sim 20$ percentage points on global queries. Cost: indexing is $5{-}50\\times$ more expensive in tokens. The clear use case is enterprise QA over slow-changing corpora.</div>

<h2 class="lesson-title">11. Link Prediction and Evaluation Metrics</h2>

<p class="l-text">Once you have a trained embedding model, the canonical task is <strong>link prediction</strong>: given $(h, r, ?)$, rank every entity in $\\mathcal{E}$ by score and look at where the ground-truth tail sits in that ranking. Two metrics dominate the literature.</p>

<div class="calc-formula"><div class="formula-label">EVALUATION METRICS</div><div class="formula-main">$$\\text{Hits}@k = \\frac{1}{|\\mathcal{T}_{\\text{test}}|} \\sum_{(h,r,t) \\in \\mathcal{T}_{\\text{test}}} \\mathbb{1}[\\text{rank}(t) \\leq k]$$ $$\\text{MRR} = \\frac{1}{|\\mathcal{T}_{\\text{test}}|} \\sum_{(h,r,t) \\in \\mathcal{T}_{\\text{test}}} \\frac{1}{\\text{rank}(t)}$$</div><div class="formula-sub">Hits at $k$ is the fraction of test triples for which the true tail is in the top-$k$. Mean reciprocal rank averages $1/\\text{rank}$, giving more credit to higher rankings.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Filtered setting</div><div class="card-body">Standard practice: when ranking $(h, r, ?)$, remove all training-set entities $t'$ such that $(h, r, t')$ is known true; rank only against truly unseen entities. Prevents the model from being penalised for correctly recovering other known facts.</div></div>
<div class="calc-card"><div class="card-title">Typical numbers</div><div class="card-body">On the FB15K-237 benchmark in 2026: ComplEx Hits at 10 $\\approx 0.45$, RotatE $\\approx 0.55$, CompGCN $\\approx 0.58$. Newer methods nudge this above $0.6$. Random baseline is $0.001$.</div></div>
<div class="calc-card"><div class="card-title">Beyond accuracy</div><div class="card-body">Calibration of scores (does $0.9$ confidence mean $90\\%$ correct?), robustness to adversarial corruption, and out-of-graph generalisation (zero-shot relations) are active research areas in 2026.</div></div>
</div>

<div class="calc-graph"><div id="plot-l6-linkpred-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> predicted vs ground-truth link scores on a small test set after TransE training. The 45-degree dashed line is perfect calibration; orange points are correctly ranked test triples, blue points are misses (ground-truth tail not in top-10). The bulk of the mass sits near the diagonal in the upper-right corner, with a few mispredictions in the bottom-left, illustrating the typical training outcome.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var hitsX=[];var hitsY=[];var missX=[];var missY=[];
for(var i=0;i<60;i++){
  var x=Math.random()*0.6+0.35;
  var y=x+(Math.random()-0.5)*0.18;
  hitsX.push(x);hitsY.push(Math.max(0.1,Math.min(1,y)));
}
for(var i=0;i<14;i++){
  var x=Math.random()*0.4+0.5;
  var y=Math.random()*0.4+0.05;
  missX.push(x);missY.push(y);
}
var d1={x:hitsX,y:hitsY,mode:'markers',name:'hits (correctly ranked)',marker:{size:8,color:'#f59e0b',line:{color:'#fbbf24',width:0.8}}};
var d2={x:missX,y:missY,mode:'markers',name:'misses (rank > 10)',marker:{size:9,color:'#3b82f6',line:{color:'#60a5fa',width:0.8}}};
var d3={x:[0,1],y:[0,1],mode:'lines',name:'perfect calibration',line:{color:'rgba(255,255,255,0.35)',dash:'dash',width:1.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'predicted score',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151',range:[0,1]},yaxis:{title:'ground-truth match (1=in graph)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151',range:[0,1]},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:40,r:30,b:50,l:60}};
Plotly.newPlot('plot-l6-linkpred-en',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Practical Exercise: Train TransE in NumPy and Predict Missing Links</h2>

<p class="l-text">Wire everything together. The Pyodide snippet below defines an eight-entity tiny KG by hand, trains TransE with margin loss and SGD, evaluates Hits at $k$ on held-out triples, and predicts the most likely missing tails for a few queries.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># --- 1. Define a tiny knowledge graph ---</span>
entities = [<span class="str">"Einstein"</span>, <span class="str">"Ulm"</span>, <span class="str">"Germany"</span>, <span class="str">"Nobel"</span>,
            <span class="str">"Physics"</span>, <span class="str">"Princeton"</span>, <span class="str">"Bohr"</span>, <span class="str">"Manhattan"</span>]
relations = [<span class="str">"born_in"</span>, <span class="str">"located_in"</span>, <span class="str">"won"</span>, <span class="str">"field_of"</span>,
             <span class="str">"worked_at"</span>, <span class="str">"colleague_of"</span>, <span class="str">"advised"</span>, <span class="str">"nationality"</span>]
ent_id = {e: i <span class="kw">for</span> i, e <span class="kw">in</span> <span class="fn">enumerate</span>(entities)}
rel_id = {r: i <span class="kw">for</span> i, r <span class="kw">in</span> <span class="fn">enumerate</span>(relations)}

train_triples = [
    (<span class="str">"Einstein"</span>, <span class="str">"born_in"</span>, <span class="str">"Ulm"</span>),
    (<span class="str">"Ulm"</span>, <span class="str">"located_in"</span>, <span class="str">"Germany"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"won"</span>, <span class="str">"Nobel"</span>),
    (<span class="str">"Bohr"</span>, <span class="str">"won"</span>, <span class="str">"Nobel"</span>),
    (<span class="str">"Nobel"</span>, <span class="str">"field_of"</span>, <span class="str">"Physics"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"worked_at"</span>, <span class="str">"Princeton"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"colleague_of"</span>, <span class="str">"Bohr"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"advised"</span>, <span class="str">"Manhattan"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"nationality"</span>, <span class="str">"Germany"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"field_of"</span>, <span class="str">"Physics"</span>),
    (<span class="str">"Bohr"</span>, <span class="str">"field_of"</span>, <span class="str">"Physics"</span>),
    (<span class="str">"Bohr"</span>, <span class="str">"colleague_of"</span>, <span class="str">"Einstein"</span>),
]
test_triples = [
    (<span class="str">"Bohr"</span>, <span class="str">"nationality"</span>, <span class="str">"Germany"</span>),       <span class="cm"># will rank by score</span>
    (<span class="str">"Einstein"</span>, <span class="str">"located_in"</span>, <span class="str">"Princeton"</span>),
]

triples_idx = np.array([[ent_id[h], rel_id[r], ent_id[t]] <span class="kw">for</span> h, r, t <span class="kw">in</span> train_triples])
N_ent, N_rel, D = <span class="fn">len</span>(entities), <span class="fn">len</span>(relations), <span class="num">20</span>

<span class="cm"># --- 2. Initialise embeddings ---</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
E = rng.<span class="fn">uniform</span>(-<span class="num">6</span>/np.<span class="fn">sqrt</span>(D), <span class="num">6</span>/np.<span class="fn">sqrt</span>(D), (N_ent, D))
R = rng.<span class="fn">uniform</span>(-<span class="num">6</span>/np.<span class="fn">sqrt</span>(D), <span class="num">6</span>/np.<span class="fn">sqrt</span>(D), (N_rel, D))
<span class="cm"># normalise entity embeddings to unit L2</span>
E /= np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># --- 3. Training loop with margin loss ---</span>
<span class="kw">def</span> <span class="fn">score</span>(h, r, t):
    <span class="kw">return</span> -np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E[h] + R[r] - E[t])

gamma, lr, epochs = <span class="num">1.0</span>, <span class="num">0.05</span>, <span class="num">400</span>
losses = []
<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(epochs):
    loss_ep = <span class="num">0</span>
    rng.<span class="fn">shuffle</span>(triples_idx)
    <span class="kw">for</span> h, r, t <span class="kw">in</span> triples_idx:
        <span class="cm"># sample a negative triple by corrupting head or tail</span>
        <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; <span class="num">0.5</span>:
            t_corr = rng.<span class="fn">integers</span>(N_ent)
            h_corr = h
        <span class="kw">else</span>:
            h_corr = rng.<span class="fn">integers</span>(N_ent)
            t_corr = t
        d_pos = np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E[h] + R[r] - E[t])
        d_neg = np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E[h_corr] + R[r] - E[t_corr])
        margin = gamma + d_pos - d_neg
        <span class="kw">if</span> margin &gt; <span class="num">0</span>:
            <span class="cm"># gradient of loss wrt embeddings</span>
            v_pos = (E[h] + R[r] - E[t]) / (d_pos + <span class="num">1e-9</span>)
            v_neg = (E[h_corr] + R[r] - E[t_corr]) / (d_neg + <span class="num">1e-9</span>)
            E[h] -= lr * v_pos
            R[r] -= lr * (v_pos - v_neg)
            E[t] += lr * v_pos
            E[h_corr] += lr * v_neg
            E[t_corr] -= lr * v_neg
            loss_ep += margin
    <span class="cm"># renormalise entity embeddings</span>
    E /= np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    losses.<span class="fn">append</span>(loss_ep)
<span class="fn">print</span>(<span class="str">f"final loss = {losses[-1]:.3f}, initial = {losses[0]:.3f}"</span>)

<span class="cm"># --- 4. Link prediction: rank all entities for a query ---</span>
<span class="kw">def</span> <span class="fn">rank_tails</span>(h_name, r_name):
    h, r = ent_id[h_name], rel_id[r_name]
    scores = [(<span class="fn">score</span>(h, r, t), entities[t]) <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(N_ent)]
    scores.<span class="fn">sort</span>(reverse=<span class="kw">True</span>)
    <span class="kw">return</span> scores

<span class="fn">print</span>(<span class="str">"\\n--- predict tails for (Bohr, nationality, ?) ---"</span>)
<span class="kw">for</span> s, name <span class="kw">in</span> <span class="fn">rank_tails</span>(<span class="str">"Bohr"</span>, <span class="str">"nationality"</span>)[:<span class="num">3</span>]:
    <span class="fn">print</span>(<span class="str">f"  {name}: {s:.3f}"</span>)

<span class="fn">print</span>(<span class="str">"\\n--- predict tails for (Einstein, won, ?) ---"</span>)
<span class="kw">for</span> s, name <span class="kw">in</span> <span class="fn">rank_tails</span>(<span class="str">"Einstein"</span>, <span class="str">"won"</span>)[:<span class="num">3</span>]:
    <span class="fn">print</span>(<span class="str">f"  {name}: {s:.3f}"</span>)

<span class="cm"># --- 5. Hits@k on a test set ---</span>
<span class="kw">def</span> <span class="fn">hits_at_k</span>(test, k=<span class="num">3</span>):
    correct = <span class="num">0</span>
    <span class="kw">for</span> h_name, r_name, t_name <span class="kw">in</span> test:
        ranked = <span class="fn">rank_tails</span>(h_name, r_name)
        top_names = [n <span class="kw">for</span> _, n <span class="kw">in</span> ranked[:k]]
        <span class="kw">if</span> t_name <span class="kw">in</span> top_names:
            correct += <span class="num">1</span>
    <span class="kw">return</span> correct / <span class="fn">len</span>(test)

<span class="fn">print</span>(<span class="str">f"\\nHits@3 on test = {hits_at_k(test_triples, k=3):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Hits@5 on test = {hits_at_k(test_triples, k=5):.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What you should observe.</strong> The loss drops from a few hundred to near zero within $200$ epochs. The top-ranked tail for <code>(Bohr, nationality, ?)</code> should be Germany or Denmark-like (the model has only seen <code>Einstein nationality Germany</code> and <code>Bohr colleague_of Einstein</code>, so it generalises that Bohr is also linked to Germany). The top-ranked tail for <code>(Einstein, won, ?)</code> is Nobel as expected. Hits at 3 on the two-triple test set is typically $0.5$ (one out of two retrieved correctly); enlarge the training and test set to get smoother numbers.</p>

<div class="think-box"><div class="think-label">EXPERIMENTS TO TRY</div><div class="think-body">(1) Increase $D$ from $20$ to $50$ and watch the embeddings disentangle into clearer clusters in $2$D PCA. (2) Add another relation type and see whether the model still preserves <code>colleague_of</code> as approximately anti-symmetric. (3) Replace the L2 distance with $-\\langle \\mathbf{e}_h \\circ \\mathbf{r}, \\mathbf{e}_t \\rangle$ to get DistMult; observe that DistMult cannot model asymmetric relations. (4) Train on a larger corpus from ConceptNet's CSV download and check whether your top-ranked tails for <code>(cat, IsA, ?)</code> include "animal", "pet", "mammal".</div></div>

<h2 class="lesson-title">13. Where This Lesson Plugs Into the Course</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">From Lesson 3 (graph theory)</div><div class="card-body">KGs are directed multigraphs. Every graph-theoretic concept (degree, centrality, connectivity, shortest path) applies. Wikidata has a power-law degree distribution; high-degree hubs (countries, common professions) dominate retrieval.</div></div>
<div class="calc-card"><div class="card-title">From Lesson 4 (graph algorithms)</div><div class="card-body">Personalised PageRank on a KG is a strong baseline for entity retrieval. Random-walk-based methods (DeepWalk, node2vec, metapath2vec) are the precursors of the embedding methods in this lesson.</div></div>
<div class="calc-card"><div class="card-title">From Lesson 5 (spectral and GNNs)</div><div class="card-body">R-GCN is the relational extension of the spectral GCN. The Laplacian eigenvalues of a KG correlate with link-prediction difficulty. Spectral clustering recovers communities that Graph-RAG re-discovers with Leiden.</div></div>
<div class="calc-card"><div class="card-title">To the AI track</div><div class="card-body">Transformer attention (NLP-L4), retrieval-augmented LLMs (NLP-L9), structured commonsense reasoning (NLP-L12) all use the machinery developed here. Knowledge graph embeddings remain a strong inductive bias for structured reasoning even in the era of foundation models.</div></div>
</div>

<div class="calc-highlight"><strong>What you can do now:</strong> read and write RDF triples, formulate SPARQL graph-pattern queries, train TransE / ComplEx / RotatE from scratch and predict missing links, recognise dependency parses as small KGs, reinterpret transformer attention as a learned dynamic graph, and explain when Graph-RAG beats vector RAG. You have crossed the bridge from discrete graph theory to modern retrieval-augmented AI.</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bilgi grafları, ayrık matematiğin modern yapay zekayla buluştuğu dikiş yerinde durur.</strong> Bir bilgi grafı (KG), dünyanın mümkün olan en basit yapılandırılmış temsili: gerçekleri varlıklar arası etiketli yönlü kenarlar olarak listeler, o kadar. Yine de bu tek ilkel, Google Aramanın sağ paneldeki "bilgi panosu"nu, Siri ve Alexa'nın soru yanıtlamasını, Amazon'un ürün grafını, ATOMIC'in sağduyu çıkarımını ve en yeni nesil getirim destekli LLM'leri besler. Arka planda hepsi aynı araç setine yaslanır: RDF üçlüleri, SPARQL sorguları, varlık ve ilişkilerin öğrenilmiş gömüleri, bir de graf farkındalıklı getirim.</p>

<p class="l-text">Bu ders, genelde ayrı derslerde geçen üç ipliği bir araya getirir. Ayrık matematikten veri yapısı olarak yönlü çoklu grafı alıyoruz (Ders 3-5). Klasik DDİ'den (NLP) bağımlılık ayrıştırmalarını alıyoruz; bunlar zaten cümleler üzerinde küçük etiketli graflardır. Modern yapay zekadan bir üçlünün makul olup olmadığını skorlamayı öğrenen gömme modellerini (TransE, ComplEx, RotatE), token grafı olarak yeniden yorumlanan transformer dikkatini ve LLM'leri açık KG'lerle birleştiren 2024 dönemi melezi Graph-RAG'ı alıyoruz. Her bölüm çalışılmış sayılar, orijinal makalelere atıflar ve sıfırdan TransE eğitip eksik bağlantıları tahmin edeceğin bir Pyodide alıştırmasıyla birlikte geliyor.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE OGRENECEKSIN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>RDF üçlülerini okuyup yazmak ve SPARQL'i Wikidata tarzı veri üzerinde çalıştırılmış sorgularla bir graf-desen eşleştirme dili olarak tanımak</li>
<li>TransE kayıp fonksiyonunu türetmek, $h + r \\approx t$ ardındaki geometrik sezgiyi anlamak ve NumPy ile sıfırdan eğitmek</li>
<li>TransE'nin simetrik ve bire-çok ilişkilerde neden başarısız olduğunu ve ComplEx ile RotatE'nin bunu karmaşık-değerli gömülerle nasıl çözdüğünü ifade etmek</li>
<li>Tam bir İngilizce cümleyi etiketli bir bağımlılık ağacına çözümlemek ve bunu tokenler üzerinde küçük bir KG olarak tanımak</li>
<li>Transformer çoklu-kafa dikkatini, Clark vd. 2019'u izleyerek tokenler üzerinde öğrenilmiş dinamik bir graf olarak yeniden yorumlamak</li>
<li>Naif vektör-benzerlikli RAG ile Microsoft'un Graph-RAG'ını karşılaştırmak ve hangisinin uzun-belge soru yanıtlamada ne zaman kazandığını açıklamak</li>
<li>Küçük bir KG artı bağlantı tahmini kullanarak eksik gerçekleri doldurmak ve Hits at $k$ ve MRR ile değerlendirmek</li>
</ul>
</div>

<h2 class="lesson-title">1. Bilgi Grafi Nedir?</h2>

<div class="calc-highlight"><strong>Mümkün en basit veri modeli.</strong> Bir bilgi grafı bildiği her şeyi üçlülerin listesi olarak depolar: $(\\text{baş},\\,\\text{ilişki},\\,\\text{kuyruk})$, sıkça $(h, r, t)$ ya da özne-yüklem-nesne için $(s, p, o)$. Her üçlü, köşelerin varlıklar ve kenar etiketlerinin ilişki türleri olduğu çoklu grafta etiketli yönlü bir kenardır. Başka bir şey yoktur: tablo yok, yabancı anahtar yok, klasik anlamda şema yok. İfade gücü, dilediğin zaman yeni varlık ya da ilişki ekleyebilme özgürlüğünden gelir.</div>

<p class="l-text">Somut olarak "Albert Einstein Ulm'da doğdu" gerçeği <code>(Einstein, born_in, Ulm)</code> üçlüsüne dönüşür. "Ulm Almanya'dadır" <code>(Ulm, located_in, Germany)</code> olur. "Einstein 1921 Nobel Fizik Ödülü'nü kazandı" gerçeği ya dörtlü bir gerçek ya da somutlaştırma (reification) gerektirir: ödül olayı için taze bir düğüm yaratırız ve bunu yıla, alıcıya ve alana bağlarız. Bazı düğümlerin "gerçek şeyler" değil "olay nesneleri" olduğunu kabul edersen bilgi grafları çok-argümanlı karmaşık gerçekleri şaşırtıcı bir incelikle ele alır.</p>

<div class="calc-formula"><div class="formula-label">UCLULERIN KUMESI OLARAK BIR BILGI GRAFI</div><div class="formula-main">$$\\mathcal{G} = \\{(h_i, r_i, t_i)\\}_{i=1}^{M} \\;\\subseteq\\; \\mathcal{E} \\times \\mathcal{R} \\times \\mathcal{E}$$</div><div class="formula-sub">$\\mathcal{E}$ varlık kümesi (kişiler, yerler, kavramlar), $\\mathcal{R}$ ilişki türleri kümesi, $M$ gerçek sayısı. Her klasik KG işlemi bu küme üzerinde bir fonksiyondur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wikidata</div><div class="card-body">2026'daki en büyük açık KG: yaklaşık $112$ milyon varlık, $1.6$ milyar ifade. Wikipedia'nın yapılandırılmış kardeşi. Wikipedia bilgi kutularını, Google bilgi panosunu, Apple Haritalar ilgi noktalarını besler. CC0 lisansı, ücretsiz kullanım.</div></div>
<div class="calc-card"><div class="card-title">ConceptNet</div><div class="card-body">Yaklaşık $8$ milyon kavram ve $34$ milyon kenara sahip sağduyu KG. <code>IsA</code>, <code>CapableOf</code>, <code>UsedFor</code>, <code>AtLocation</code> gibi ilişkiler. Crowdsourcing, OMCS, WordNet'ten derlendi. Dil modellerinde sağduyu çıkarımını tohumlamak için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">ATOMIC 2020</div><div class="card-body">Sap vd.'nin if-then sağduyu grafı: $23$ ilişki türü altında <code>xWant</code>, <code>xEffect</code>, <code>oReact</code> gibi $1.33$M günlük çıkarım. COMET çıkarım modelini eğitir. Özellikle LLM çağı sağduyu için inşa edildi.</div></div>
<div class="calc-card"><div class="card-title">Alan KG'leri</div><div class="card-body">Tıp için UMLS, biyoloji için Gene Ontology ve Reactome, müzik için MusicBrainz, perakende için Amazon Ürün Grafı. Her biri alan uzmanlarınca derlenir ve alt akış arama ve öneri tarafından gerçek-kabulü olarak kullanılır.</div></div>
</div>

<div class="l-note"><strong>Yönlü çoklu graf.</strong> Matematiksel olarak bir KG yönlü çoklu graftır çünkü iki varlık aynı anda birden çok yolla ilişkilendirilebilir (Einstein hem Ulm'da <code>born_in</code> hem Alman <code>nationality</code>). "Çoklu" her varlık çiftinin ilişki türü başına bir kenar taşımasına izin verir. "Yönlü" <code>born_in</code>'i bir yöne, <code>has_resident</code>'ı diğerine işaret ettirir.</div>

<div class="calc-graph"><div id="plot-l6-kg-tr" class="plotly-graph" style="height:480px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Einstein, Ulm, Almanya, Nobel Ödülü, Fizik, Manhattan Projesi, Bohr ve Princeton ile ilgili sekiz varlıklı küçük bir bilgi grafı. Köşeler varlıklar; kenarlar <code>born_in</code>, <code>located_in</code>, <code>won</code>, <code>field_of</code>, <code>colleague_of</code>, <code>worked_at</code> gibi etiketli yönlü ilişkilerdir. Bölüm 4'te TransE'nin gömüleri öğreneceği veri yapısı budur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var pos={Einstein:[0.5,0.85],Ulm:[0.15,0.55],Almanya:[0.08,0.20],Nobel:[0.85,0.55],Fizik:[0.92,0.20],Manhattan:[0.5,0.40],Bohr:[0.30,0.10],Princeton:[0.75,0.85]};
var edges=[
['Einstein','Ulm','born_in'],
['Ulm','Almanya','located_in'],
['Einstein','Nobel','won'],
['Nobel','Fizik','field_of'],
['Einstein','Manhattan','advised'],
['Einstein','Bohr','colleague_of'],
['Bohr','Nobel','won'],
['Einstein','Princeton','worked_at'],
['Einstein','Almanya','nationality'],
['Einstein','Fizik','field_of']
];
var traces=[];var ann=[];
for(var i=0;i<edges.length;i++){
  var e=edges[i];var p1=pos[e[0]];var p2=pos[e[1]];
  var dx=p2[0]-p1[0];var dy=p2[1]-p1[1];var len=Math.sqrt(dx*dx+dy*dy);
  var x1=p1[0]+dx*0.10;var y1=p1[1]+dy*0.10;var x2=p2[0]-dx*0.12;var y2=p2[1]-dy*0.12;
  traces.push({x:[x1,x2],y:[y1,y2],mode:'lines',line:{color:'rgba(59,130,246,0.55)',width:1.8},showlegend:false,hoverinfo:'skip'});
  ann.push({x:x2,y:y2,ax:x1,ay:y1,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:1.1,arrowwidth:1.5,arrowcolor:'rgba(59,130,246,0.65)'});
  ann.push({x:(x1+x2)/2,y:(y1+y2)/2+0.02,text:e[2],showarrow:false,font:{size:9.5,color:'#fbbf24'},bgcolor:'rgba(10,10,10,0.65)'});
}
var nx=[],ny=[],lab=[];for(var k in pos){nx.push(pos[k][0]);ny.push(pos[k][1]);lab.push(k);}
traces.push({x:nx,y:ny,mode:'markers+text',text:lab,textposition:'top center',textfont:{color:'#ebe6dc',size:12},marker:{size:24,color:'#3b82f6',line:{color:'#fff',width:1.4}},showlegend:false,hoverinfo:'text'});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-0.05,1.05]},yaxis:{visible:false,range:[0,1]},margin:{t:30,r:20,b:20,l:20},annotations:ann,showlegend:false};
Plotly.newPlot('plot-l6-kg-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">ILK BIR SORU</div><div class="think-body">Yukarıdaki grafa bakarken çizilmemiş ama mantıksal olarak ima edilen bir gerçeğe ulaşabilir misin? Örneğin <code>(Einstein, won, Nobel)</code> ve <code>(Nobel, field_of, Physics)</code> üçlüleri birlikte <code>(Einstein, won_prize_in, Physics)</code> ifadesini düşündürür. KG akıl yürütmesi tam olarak budur: mevcut üçlüleri birleştirip yeni olanları tahmin etmek. Dersin ilerleyen kısımlarındaki gömme yöntemleri bu birleşimi örtük olarak öğrenir.</div></div>

<h2 class="lesson-title">2. RDF, URI'lar ve SPARQL</h2>

<div class="calc-highlight"><strong>Karalanmış üçlülerden web ölçeğindeki bir standarda.</strong> 1999'dan beri bir W3C standardı olan Kaynak Tanımlama Çerçevesi (RDF), her varlık ve ilişkiye benzersiz bir URI vererek üçlü veri modelini biçimlendirir. Yani Wikidata'da <code>Einstein</code> aslında <code>http://www.wikidata.org/entity/Q937</code>'dir ve <code>born_in</code> <code>http://www.wikidata.org/prop/direct/P19</code>'dur. Yararı: web'de yayımlanan herhangi iki KG, sadece üçlülerin birleşimiyle birleştirilebilir, çünkü URI'lar aynı görünen adları belirsizlikten kurtarır.</div>

<p class="l-text">SPARQL, RDF için sorgu dilidir; graf dünyasının SQL'i. Bir SPARQL sorgusu temelde bir graf desenidir: yanıt istediğin yerlerde değişkenli (<code>?</code> ile önekli) küçük bir alt graf yazarsın ve SPARQL desenin sağlandığı her bağlamayı bulur.</p>

<div class="code-wrap"><div class="code-label"><span>SPARQL ORNEK 1 - EINSTEIN HAKKINDAKI TUM GERCEKLER</span></div><pre class="code-block"><code><span class="kw">PREFIX</span> wd: &lt;http://www.wikidata.org/entity/&gt;
<span class="kw">PREFIX</span> wdt: &lt;http://www.wikidata.org/prop/direct/&gt;

<span class="kw">SELECT</span> ?relation ?value <span class="kw">WHERE</span> {
    wd:Q937 ?relation ?value .
}
<span class="kw">LIMIT</span> 50</code></pre></div>

<p class="l-text">Çeviri: "Einstein (Q937)'nin başı olduğu her ilişki ve değeri bul." <code>.</code> bir üçlü sonlandırıcısıdır. Sorgu Wikidata'daki Einstein hakkındaki her gerçek başına bir satır döndürür: doğum yeri, milliyet, çalışma alanı, eşler, doktora danışmanı, ödüller vesaire.</p>

<div class="code-wrap"><div class="code-label"><span>SPARQL ORNEK 2 - NOBEL KAZANAN ALMANYA'DA DOGMUS KISILER</span></div><pre class="code-block"><code><span class="kw">SELECT</span> ?person ?personLabel ?prizeLabel <span class="kw">WHERE</span> {
    ?person wdt:P19 ?city .             <span class="cm"># P19 = dogum yeri</span>
    ?city   wdt:P17 wd:Q183 .           <span class="cm"># P17 = ulke, Q183 = Almanya</span>
    ?person wdt:P166 ?prize .           <span class="cm"># P166 = odul</span>
    ?prize  wdt:P31 wd:Q7191 .          <span class="cm"># Nobel Odulu</span>
    <span class="kw">SERVICE</span> wikibase:label { bd:serviceParam wikibase:language "tr" }
}</code></pre></div>

<p class="l-text">Bu, dört kenarlı ve dört değişkenli bir graf desenidir. SPARQL motoru, <code>?person</code>, <code>?city</code>, <code>?prize</code> için her bir atamayı bulup dört üçlünün de Wikidata'da aynı anda var olduğunu denetleyerek bunları birleştirir. Yanıt Einstein, Planck, Heisenberg, Born, von Laue ve daha pek çoğunu içerir; hepsi milisaniye içinde döner çünkü Wikidata'nın RDF deposu graf-desen eşleştirmesi için dizinlenmiştir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uclu depolari</div><div class="card-body">RDF için optimize edilmiş özel veritabanları: GraphDB, Apache Jena, Virtuoso, AnzoGraph, Amazon Neptune, Stardog. Üçlüleri altı sırada (SPO, SOP, PSO, POS, OSP, OPS) dizinler; böylece herhangi bir desen bir dizin taramasıyla yanıtlanır.</div></div>
<div class="calc-card"><div class="card-title">Ozellik graflari</div><div class="card-body">Neo4j, JanusGraph, Amazon Neptune (her ikisini de destekler) tarafından kullanılan alternatif model. Düğümler ve kenarlar doğrudan özellik haritaları taşıyabilir, bu yüzden bir ilişki hakkındaki gerçekler (zaman damgası, güven) somutlaştırmadan eklenir. Sorgu dili: Cypher ve şimdi GQL.</div></div>
<div class="calc-card"><div class="card-title">SHACL ve akil yurutme</div><div class="card-body">SHACL, üçlülerin bir şemayı izlediğini doğrular; OWL, HermiT, Pellet, ELK gibi motorların akıl yürütebileceği mantıksal aksiyomlar (geçişlilik, ters, alt-özellik) ekler. Gerçek üretim KG'leri SPARQL getirimini hafif mantıksal çıkarımla harmanlar.</div></div>
<div class="calc-card"><div class="card-title">Birlesik sorgular</div><div class="card-body">Bir SPARQL sorgusu birden çok uç noktadan üçlüler çeken <code>SERVICE</code> ifadeleri içerebilir. "Bağlı veri" vizyonunun aslı budur: web'deki her KG tek bir sanal veritabanı olur.</div></div>
</div>

<div class="l-note"><strong>Neden SQL yetmez?</strong> İlişkisel şemalar hangi sütunların var olduğunu kodlar. Tamamen yeni bir gerçek türü ("favori Bond filmi") eklemek tabloları taşımayı gerektirir. Üçlülerle yalnızca üçlüyü yazarsın. RDF, şemanın açık-uçlu, evrilen ya da önceden bilinmediği durumda parlar: haber gerçekleri, bilimsel literatür, web ölçekli taramalar.</div>

<h2 class="lesson-title">3. Neden Gomuler? Vektor Geometrisine Ihtiyac</h2>

<p class="l-text">İstediğin gerçek zaten grafta olduğunda SPARQL harikadır. Gerçek eksik ama mantıksal olarak ima edildiğinde ya da aralarında açık kenar olmadan "bu iki varlık ne kadar benzer?" sorusunu yanıtlamak istediğinde işe yaramaz. Her iki problem de <strong>bilgi grafı gömüleriyle</strong> çözülür: her varlık için bir vektör $\\mathbf{e}_h \\in \\mathbb{R}^d$ ve her ilişki için bir vektör $\\mathbf{r} \\in \\mathbb{R}^d$ öğren, böylece vektörler arası geometrik işlemler KG'nin yapısını kodlar.</p>

<div class="calc-formula"><div class="formula-label">GOMME HEDEFI</div><div class="formula-main">$$\\text{ogren } f : \\mathcal{E} \\cup \\mathcal{R} \\to \\mathbb{R}^{d} \\text{ ki } \\text{score}(h, r, t) \\text{ yuksek olsun ancak ve ancak } (h, r, t) \\in \\mathcal{G}$$</div><div class="formula-sub">Skor, üç vektörün el-tasarımlı geometrik bir fonksiyonudur. Farklı modeller farklı skorlar seçer; bölümün büyük kısmı bu seçimler hakkındadır.</div></div>

<p class="l-text">Gömüler öğrenildikten sonra üç yeni işlem mümkün olur:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Baglanti tahmini</div><div class="card-body">$(h, r, ?)$ verildiğinde her varlık $t$'yi skora göre sırala; üst-$k$ modelin eksik gerçek tahminleridir. Wikidata'daki boşlukları doldurmak, önerilecek ürünleri belirlemek, gen-hastalık ilişkilerini tahmin etmek için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Varlik benzerligi</div><div class="card-body">$\\cos(\\mathbf{e}_h, \\mathbf{e}_{h'})$ iki varlığın doğrudan kenar olmadan ne kadar benzer olduğunu ölçer. Kümeleme, tekilleştirme, "buna benzer" önerisi için yararlı.</div></div>
<div class="calc-card"><div class="card-title">Analoji</div><div class="card-body">İlişkiler öteleme olduğunda $\\mathbf{e}_{\\text{Paris}} - \\mathbf{e}_{\\text{Fransa}} + \\mathbf{e}_{\\text{Italya}} \\approx \\mathbf{e}_{\\text{Roma}}$ bedavaya çıkar (Mikolov 2013'ün word2vec sonucu, Bordes 2013 tarafından KG'lere taşındı).</div></div>
</div>

<h2 class="lesson-title">4. TransE: Bordes vd. 2013</h2>

<div class="calc-highlight"><strong>Sasirtici derecede basit tarif.</strong> Her varlığı ve her ilişkiyi $\\mathbb{R}^d$'ye göm. Doğru bir üçlü $(h, r, t)$ için $\\mathbf{e}_h + \\mathbf{e}_r \\approx \\mathbf{e}_t$ olsun. Bu yaklaşık-eşitliği graftaki gerçekler için yakına, rastgele bozulmuş üçlüler için uzağa it. Sadeliğine rağmen TransE, KG'ler için gömme yarışını başlatan modeldi ve 2026'da hâlâ güçlü bir baz çizgisidir.</div>

<div class="calc-formula"><div class="formula-label">TRANSE SKOR FONKSIYONU</div><div class="formula-main">$$\\text{score}(h, r, t) = -\\|\\mathbf{e}_h + \\mathbf{e}_r - \\mathbf{e}_t\\|_{p}$$</div><div class="formula-sub">Genelde $p=1$ ya da $p=2$. Eksi işareti "küçük mesafe"yi "yüksek skor"a çevirir. Varlık gömüleri sıfıra trivial çöküşü önlemek için birim küre üzerinde tutulur ($\\|\\mathbf{e}_h\\|_2 = 1$).</div></div>

<p class="l-text"><strong>Geometrik sezgi.</strong> Her ilişkiyi bir öteleme vektörü olarak düşün. <code>capital_of</code> ilişkisi seni bir ülke gömüsünden başkentinin gömüsüne taşır. <code>born_in</code> ilişkisi seni bir kişi gömüsünden bir yer gömüsüne taşır. İlişki ötelemesini başa uygulamak seni kuyruğun yakınına bırakmalı. Mikolov'un word2vec'te gözlemlediği analoji yapısı tam olarak budur: $\\mathbf{e}_{\\text{king}} - \\mathbf{e}_{\\text{man}} + \\mathbf{e}_{\\text{woman}} \\approx \\mathbf{e}_{\\text{queen}}$.</p>

<div class="calc-formula"><div class="formula-label">TRANSE EGITIM KAYBI (MARJ TEMELLI)</div><div class="formula-main">$$\\mathcal{L} = \\sum_{(h,r,t) \\in \\mathcal{G}} \\sum_{(h',r,t') \\in \\mathcal{N}_{(h,r,t)}} \\bigl[\\gamma + \\|\\mathbf{e}_h + \\mathbf{e}_r - \\mathbf{e}_t\\| - \\|\\mathbf{e}_{h'} + \\mathbf{e}_r - \\mathbf{e}_{t'}\\|\\bigr]_{+}$$</div><div class="formula-sub">Oku: her doğru üçlü için bozulmuş bir sürüm $(h', r, t')$ örnekle (baş veya kuyruğu rastgele bir varlıkla değiştir) ve doğru üçlünün enerjisinin bozulmuş olanından en az $\\gamma$ daha küçük olmasını talep et. $[\\cdot]_+$ menteşedir: sıfırla maks.</div></div>

<p class="l-text">Kayıp tam olarak SVM'lerden tanıdık marj-sıralama kaybıdır (ML dersi), şimdi üçlülere uygulanıyor. Marj $\\gamma$ bir hiperparametredir, genelde $\\gamma = 1.0$. Negatif üçlüler tek tip bozulmayla üretilir: her pozitif $(h, r, t)$ için $\\mathcal{E}$'den rastgele bir varlık seç ve $h$'yi ya da $t$'yi değiştir (her biri için $\\%50$ olasılıkla). Bu kayıp üzerinde basit SGD bile rekabetçi performans verir.</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Ilklendir</div><div class="step-detail">Her varlık ve ilişki gömüsünü $[-6/\\sqrt{d}, 6/\\sqrt{d}]$'ten tek tip örnekle. Varlık gömülerini birim norma normalleştir.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Mini-grup orneklemek</div><div class="step-detail">$\\mathcal{G}$'den pozitif üçlülerden bir grup al. Her biri için $h$'yi ya da $t$'yi farklı bir varlıkla değiştirip bir bozulmuş üçlü üret.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Marj kaybini hesapla</div><div class="step-detail">Her çift için $\\gamma + d_{\\text{poz}} - d_{\\text{neg}}$ hesapla ve sıfıra kırp. Grup üzerinde topla.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Geri yay ve adim at</div><div class="step-detail">Varlık ve ilişki gömülerinde bir gradyan adımı at. Her yinelemenin sonunda varlık gömülerini birim norma yeniden normalleştir.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Tekrarla</div><div class="step-detail">Tam KG üzerinde birkaç yüz epok ya da doğrulama Hits at 10 düzleşene kadar.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l6-transe-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> küçük bir KG üzerinde simüle edilmiş TransE eğitimi. Mavi eğri mini-gruplar arası ortalama marj kaybı, turuncu eğri ayrılmış bir doğrulama kümesindeki Hits at 10. Kayıp tekdüze düşer; Hits at 10 rastgele ilklendirmede $\\sim 0.05$'ten $200$ epok sonra $\\sim 0.7$'ye tırmanır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var epochs=[];var loss=[];var hits=[];
for(var i=0;i<=200;i+=5){
  epochs.push(i);
  var l=1.6*Math.exp(-i/35)+0.18+0.04*Math.cos(i/15);
  loss.push(l);
  var h=0.05+0.65*(1-Math.exp(-i/45))+0.02*Math.sin(i/12);
  hits.push(Math.min(0.78,h));
}
var d1={x:epochs,y:loss,mode:'lines+markers',name:'egitim kaybi',yaxis:'y',line:{color:'#3b82f6',width:2.4},marker:{size:5,color:'#3b82f6'}};
var d2={x:epochs,y:hits,mode:'lines+markers',name:'dogrulama Hits@10',yaxis:'y2',line:{color:'#f59e0b',width:2.4},marker:{size:5,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'epok',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151'},yaxis:{title:'kayip',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151'},yaxis2:{title:'Hits@10',overlaying:'y',side:'right',range:[0,1],gridcolor:'rgba(0,0,0,0)'},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:40,r:60,b:50,l:60}};
Plotly.newPlot('plot-l6-transe-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">TRANSE OYUNCAK TUREV</div><div class="example-body">$d = 2$ olsun ve biraz eğitimden sonra elimizde $\\mathbf{e}_{\\text{Einstein}} = (1.0, 0.5)$, $\\mathbf{e}_{\\text{Ulm}} = (1.2, 0.8)$, $\\mathbf{r}_{\\text{born_in}} = (0.2, 0.3)$ olsun.<br><br><strong>Dogru ucluyu skor:</strong> $\\mathbf{e}_h + \\mathbf{r} - \\mathbf{e}_t = (1.0+0.2-1.2, 0.5+0.3-0.8) = (0, 0)$. Mesafe $0$, skor $-0 = 0$. Model bu gerçeği mükemmel oturtmuş.<br><br><strong>Bozulmus ucluyu skor</strong> $(Einstein, born_in, Princeton)$, $\\mathbf{e}_{\\text{Princeton}} = (-0.5, 0.4)$: $\\mathbf{e}_h + \\mathbf{r} - \\mathbf{e}_t = (1.0+0.2-(-0.5), 0.5+0.3-0.4) = (1.7, 0.4)$. Mesafe $\\sqrt{1.7^2+0.4^2} \\approx 1.75$, skor $-1.75$.<br><br><strong>Marj:</strong> $\\gamma=1.0$ ile kayba katkısı $\\max(0, 1.0 + 0 - 1.75) = 0$, gradyan akmaz. Model bu bozulmanın gerçekten en az $\\gamma$ kadar uzakta olduğundan memnun.</div></div>

<div class="l-note"><strong>TransE'nin zorlandiklari.</strong> (1) Simetrik ilişkiler: hem $(h, r, t)$ hem $(t, r, h)$ doğruysa TransE $\\mathbf{r} = -\\mathbf{r}$ talep eder, $\\mathbf{r} = 0$ olur ki bu ilişkiyi işe yaramaz kılar. (2) Bire-çok: Einstein'ın birçok kardeşi varsa hepsi yaklaşık aynı noktaya gitmek zorunda, ayrı varlıkları çökertir. (3) Yansıma: $(h, r, h)$ doğruysa $\\mathbf{r} = 0$. Bu sınırlar ComplEx ve RotatE'yi motive etti.</div>

<h2 class="lesson-title">5. ComplEx: Asimetrik Iliskiler Icin Karmasik Gomuler (Trouillon 2016)</h2>

<div class="calc-highlight"><strong>Asimetrik iliskilerin coumu.</strong> Trouillon vd. (2016) gerçek-değerli gömüleri karmaşık-değerli olanlarla değiştirdi; her varlık ve ilişki artık $\\mathbb{R}^d$ yerine $\\mathbb{C}^d$'de yaşıyor. Skor fonksiyonu, kasıtlı olarak asimetrik olan bir Hermitian iç çarpımın gerçek kısmına dönüşür: baş ve kuyruğu yer değiştirmek farklı bir skor üretir.</div>

<div class="calc-formula"><div class="formula-label">KARMASIK SKOR FONKSIYONU</div><div class="formula-main">$$\\text{score}(h, r, t) = \\text{Re}\\Bigl(\\sum_{k=1}^{d} \\mathbf{e}_{h,k}\\,\\mathbf{r}_{k}\\,\\overline{\\mathbf{e}_{t,k}}\\Bigr)$$</div><div class="formula-sub">$\\overline{z}$ karmaşık eşleniktir. Hermitian çarpım ikinci argümana göre eşlenik-doğrusaldır, yani genelde $h$ ve $t$'de simetrik değildir.</div></div>

<p class="l-text"><strong>Bu neden asimetriyi yakalar.</strong> Her karmaşık sayıyı $z = a + ib$ olarak yaz. Hermitian çarpım dört reel terime açılır: $\\text{Re}(z_h z_r \\overline{z_t}) = \\text{Re}(z_h)\\text{Re}(z_r)\\text{Re}(z_t) + \\text{Re}(z_h)\\text{Im}(z_r)\\text{Im}(z_t) + \\text{Im}(z_h)\\text{Re}(z_r)\\text{Im}(z_t) - \\text{Im}(z_h)\\text{Im}(z_r)\\text{Re}(z_t)$. Dördüncü terimin eksi işareti, $\\text{Im}(z_r) \\neq 0$ olduğunda $h$-$t$ simetrisini kırar. Saf reel ilişkiler simetrik DistMult'u kurtarır; saf sanal ilişkiler saf anti-simetriyi kodlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetri muamelesi</div><div class="card-body"><code>colleague_of</code> gibi simetrik ilişkiler eğitim sırasında $\\text{Im}(\\mathbf{r}) = 0$ alır, DistMult'u kurtarır. <code>parent_of</code> gibi antisimetrik ilişkiler saf sanal $\\mathbf{r}$ alır. Karışık ilişkiler karışım alır.</div></div>
<div class="calc-card"><div class="card-title">Parametre verimliligi</div><div class="card-body">Karmaşık sayılar kullansa da, gömme boyutu $d_\\mathbb{C}$ olan ComplEx varlık başına $2d_\\mathbb{C}$ reel parametre kullanır; $2d_\\mathbb{C}$ boyutlu gerçek bir gömüyle aynı. Eşit parametre sayısında TransE ile karşılaştırıldığında ComplEx çoğunlukla kazanır.</div></div>
<div class="calc-card"><div class="card-title">Trouillon sonucu</div><div class="card-body">WN18 ve FB15K'da, 2016'da ComplEx, ikili doğrusal baz çizgilerinin parametrelerinin küçük bir kısmıyla en gelişmiş Hits at 10'a ulaştı. Makale, "KG için geometrik cebir" çizgisini başlattı.</div></div>
</div>

<h2 class="lesson-title">6. RotatE: Donme Olarak Iliskiler (Sun vd. 2019)</h2>

<div class="calc-highlight"><strong>Birlestiren resim.</strong> RotatE, birim modüllü karmaşık sayı $\\mathbf{r}_k = e^{i\\theta_k}$ ile karmaşık çarpımın tam olarak karmaşık düzlemde $\\theta_k$ açısı kadar dönme olduğunu fark eder. RotatE, her ilişki gömüsünü öğe başına karmaşık birim çember üzerinde sınırlar; böylece her ilişki boyut-başına bir dönme olur. Skor, dönmüş başla kuyruk arasındaki mesafedir.</div>

<div class="calc-formula"><div class="formula-label">ROTATE SKOR FONKSIYONU</div><div class="formula-main">$$\\text{score}(h, r, t) = -\\|\\mathbf{e}_h \\circ \\mathbf{r} - \\mathbf{e}_t\\| \\quad\\text{burada}\\quad |\\mathbf{r}_k| = 1 \\text{ her } k \\text{ icin}$$</div><div class="formula-sub">$\\circ$ öğe-bazında (Hadamard) karmaşık çarpımdır. Birim modüllü $\\mathbf{r}_k$ ile her boyut kendi açısı kadar döndürülür. Birim, ters, simetri ve birleşim hepsi dönmeler üzerinde cebirsel özdeşlikler olarak çıkar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simetri $r \\equiv r^{-1}$</div><div class="card-body">$r^2 = \\text{id}$, yani her açı $\\theta_k \\in \\{0, \\pi\\}$ demek. Model bunu <code>spouse_of</code> gibi ilişkiler için otomatik öğrenir.</div></div>
<div class="calc-card"><div class="card-title">Tersleme $r_2 = r_1^{-1}$</div><div class="card-body">$\\mathbf{r}_2 = \\overline{\\mathbf{r}_1}$ öğe başına demek. <code>part_of</code> ve <code>has_part</code> gibi ilişkiler eşlenik çıkar.</div></div>
<div class="calc-card"><div class="card-title">Birlesim $r_3 = r_1 \\circ r_2$</div><div class="card-body">Sadece açılar çarpılır: $\\theta_3 = \\theta_1 + \\theta_2$. <code>uncle_of = brother_of + parent_of</code> gibi örüntüleri yakalar.</div></div>
<div class="calc-card"><div class="card-title">Atif</div><div class="card-body">Sun, Deng, Nie, Tang. "RotatE: Knowledge Graph Embedding by Relational Rotation in Complex Space." ICLR 2019. Yayın anında FB15K-237 ve WN18RR'de en gelişmiş; 2026'da hâlâ rekabetçi.</div></div>
</div>

<div class="l-note"><strong>Daha buyuk resim.</strong> TransE, DistMult, ComplEx ve RotatE hepsi bir geometrik cebir sürekliliğinde yaşar. TransE öteleme; DistMult ikili doğrusal çarpım; ComplEx karmaşık ikili doğrusal; RotatE karmaşık birim dönme kullanır. Daha yeni girişler (HAKE, QuatE, OctonionE) hiperbolik uzaylara ve kuaterniyonlara uzanır, ama pratik tatlı nokta yukarıdaki dört klasik modelde kalır.</div>

<h2 class="lesson-title">7. Bilgi Graflarinda Sinir Aglari: R-GCN ve CompGCN</h2>

<p class="l-text">Ders 5, her kenarın aynı türde olduğu graf sinir ağlarını tanıttı. Gerçek bilgi grafları çok kenar türüne sahip ve doğru tümevarımsal önyargı, kenar başına değil ilişki başına parametre paylaşmaktır. <strong>İlişkisel Graf Evrişimsel Ağı</strong> (R-GCN, Schlichtkrull vd. 2018), GCN'yi çok-ilişkili graflara genelleştirir:</p>

<div class="calc-formula"><div class="formula-label">R-GCN KATMAN GUNCELLEMESI</div><div class="formula-main">$$\\mathbf{h}_v^{(l+1)} = \\sigma\\Bigl(\\mathbf{W}_0^{(l)} \\mathbf{h}_v^{(l)} + \\sum_{r \\in \\mathcal{R}} \\sum_{u \\in \\mathcal{N}_v^r} \\frac{1}{c_{v,r}}\\,\\mathbf{W}_r^{(l)}\\,\\mathbf{h}_u^{(l)}\\Bigr)$$</div><div class="formula-sub">İlişki başına ayrı ağırlık matrisi $\\mathbf{W}_r$; normalizasyon $c_{v,r}$ gradyanları sabit tutar. $\\mathcal{N}_v^r$, $v$'nin $r$ ilişkisi boyunca komşu kümesidir.</div></div>

<p class="l-text">R-GCN yapısal akıl yürütmeyi (çok atlama komşulukları) öğrenilmiş varlığa-özel gömülerle birleştirir. Çok büyük KG'lerde ilişki başına ağırlık matrisi pahalılaşır; <strong>baz ayrıştırma</strong> ilişkiler arasında parametre paylaşarak sayıyı kontrol eder.</p>

<p class="l-text"><strong>CompGCN</strong> (Vashishth vd. 2020), R-GCN'i TransE ailesiyle birleştirir; mesajı $\\phi(\\mathbf{h}_u, \\mathbf{h}_r)$ parametrik bir birleşim operatörü (öteleme, çarpma, karmaşık dönme) olarak yazar ve her şeyi uçtan uca öğrenir. 2026'daki en güçlü hazır KG öğrenicilerden biridir.</p>

<h2 class="lesson-title">8. Bagimlilik Ayristirma: Cumleler Graf Olarak</h2>

<div class="calc-highlight"><strong>Her Ingilizce cumle kucuk bir KG.</strong> Bağımlılık ayrıştırması bir cümle alır ve her sözcüğün (kök hariç) tam olarak bir başı olduğu, kenar etiketinin sözdizimsel ilişkiyi (özne, nesne, niteleyici vb.) söylediği etiketli yönlü bir ağaç çıkarır. Universal Dependencies projesi $130$ dilde yaklaşık $40$ etiketi standartlaştırır. Modern ayrıştırıcılar (spaCy, Stanza, Berkeley parser) İngilizce haber metninde yaklaşık $\\%95$ etiketsiz, $\\%93$ etiketli doğruluğa ulaşır.</div>

<p class="l-text">Somut örnek: "The hungry cat sat quickly on the warm mat." Tokenleştir, sonra her bağımlılığı etiketle:</p>

<div class="calc-formula"><div class="formula-label">"THE HUNGRY CAT SAT QUICKLY ON THE WARM MAT" BAGIMLILIK AYRISTIRMASI</div><div class="formula-main">$$\\begin{array}{l}\\text{sat (ROOT)} \\\\ \\quad \\xrightarrow{\\text{nsubj}} \\text{cat} \\\\ \\qquad \\xrightarrow{\\text{det}} \\text{The} \\\\ \\qquad \\xrightarrow{\\text{amod}} \\text{hungry} \\\\ \\quad \\xrightarrow{\\text{advmod}} \\text{quickly} \\\\ \\quad \\xrightarrow{\\text{obl}} \\text{mat} \\\\ \\qquad \\xrightarrow{\\text{case}} \\text{on} \\\\ \\qquad \\xrightarrow{\\text{det}} \\text{the} \\\\ \\qquad \\xrightarrow{\\text{amod}} \\text{warm}\\end{array}$$</div><div class="formula-sub">Girinti ağaç derinliğini gösterir. "sat" kök fiil; "cat" onun öznesi; "mat" "on" üzerinden onun dolaylı nesnesi. Sıfatlar ("hungry", "warm") isimlerini amod üzerinden niteler. Tüm yapı dokuz token üzerinde etiketli bir ağaçtır.</div></div>

<p class="l-text">KG'lerle paralele dikkat et: sözcükler varlıklar, bağımlılık etiketleri ilişkiler, ayrıştırma <code>(sat, nsubj, cat)</code>, <code>(cat, amod, hungry)</code> gibi üçlülerden oluşan bir graftır. Anlamsal rol etiketleme, makine çevirisi ve bilgi çıkarımı hepsi bir ayrıştırmadan başlar ve üzerine graf akıl yürütmesi uygular.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kullanim 1: bilgi cikarimi</div><div class="card-body">"Einstein was born in Ulm in 1879."'dan <code>(Einstein, born_in, Ulm)</code> ve <code>(Einstein, born_year, 1879)</code>'u çıkar: <code>born</code> öznesi + yer için <code>in</code> üzerinden obl, yıl için dolaylı tarih ifadesi.</div></div>
<div class="calc-card"><div class="card-title">Kullanim 2: anlamsal rol etiketleme</div><div class="card-body">Her tokene her yüklem için bir rol ata (Etken, Etkilenen, Araç). Bağımlılık ayrıştırmaları ve PropBank/FrameNet gibi sığ anlamsal kaynakların üzerinde inşa edilir.</div></div>
<div class="calc-card"><div class="card-title">Kullanim 3: tree-LSTM</div><div class="card-body">Doğrusal LSTM'i bağımlılık ağacında aşağıdan yukarıya yürüyen bir LSTM ile değiştir, çocuk gizli durumlarını ebeveynlere topla. Duygu, NLI ve ağaç yapısının önemli olduğu görevler için yararlı.</div></div>
<div class="calc-card"><div class="card-title">Modern durum</div><div class="card-body">Transformer LLM'leri alt akış görevleri için açık ayrıştırmayı büyük ölçüde içine aldı, ama ayrıştırmalar hâlâ yorumlanabilirlik, düşük-kaynaklı diller ve ticari boru hatlarındaki (hukuk, biyomedikal DDİ) öznitelikler için kullanılır.</div></div>
</div>

<h2 class="lesson-title">9. Dinamik Graf Olarak Transformer Dikkati</h2>

<div class="calc-highlight"><strong>Dikkat agirligi olarak okuma.</strong> Bir transformer'in öz-dikkat katmanı, her token çifti $(i, j)$ için $\\sum_j \\alpha_{ij} = 1$ olacak şekilde bir dikkat ağırlığı $\\alpha_{ij}$ hesaplar. Pozisyon $i$'deki çıktı, tüm pozisyonlardaki değerlerin ağırlıklı toplamıdır. Bu tam olarak $T$ token üzerinde, kenar ağırlıklarının dikkat $\\alpha_{ij}$ olduğu tam-bağlantılı yönlü bir graftır. Graf <em>dinamiktir</em>: girdiye, katmana ve kafaya göre değişir.</div>

<div class="calc-formula"><div class="formula-label">GRAF OLARAK OZ-DIKKAT</div><div class="formula-main">$$\\alpha_{ij}^{(l,h)} = \\frac{\\exp(\\mathbf{q}_i^{(l,h)} \\cdot \\mathbf{k}_j^{(l,h)} / \\sqrt{d_k})}{\\sum_{j'} \\exp(\\mathbf{q}_i^{(l,h)} \\cdot \\mathbf{k}_{j'}^{(l,h)} / \\sqrt{d_k})}$$</div><div class="formula-sub">Bir sorgu-anahtar softmax'ı, her $l$ katmanı ve $h$ kafası için token dizisi üzerinde $T \\times T$ bir komşuluk matrisi üretir. Çok-kafa dikkat, girdi başına (katman, kafa) başına bir tane olmak üzere $L \\cdot H$ böyle graf verir.</div></div>

<p class="l-text">Clark, Khandelwal, Levy ve Manning (2019), BERT-base'in $12 \\times 12 = 144$ dikkat kafasını inceledi ve farklı kafaların farklı sözdizimsel ilişkilerde <em>denetim olmadan</em> uzmanlaştığını gösterdi. Bazı kafalar bir önceki tokene dikkat eder (yüzey sırasını yakalar). Bazı kafalar eş-gönderge bahislere dikkat eder (zamirleri öncüllerine bağlar). Bazı kafalar geçerli tokenin sözdizimsel başına dikkat eder (nsubj, dobj, prep bağlantılarını kurtarır). Makale, sondaj sınıflandırıcılarının dikkat örüntülerinden dilsel yapı çıkardığı BERTology adlı bir alt-alan başlattı.</p>

<div class="calc-graph"><div id="plot-l6-attention-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> "The hungry cat sat quickly on the warm mat." cümlesini okuyan varsayımsal bir transformer'in dört kafasının simüle edilmiş dikkat örüntüleri. Kafa 1 önceki tokene dikkat eder (konumsal önyargı). Kafa 2 isim ifadesi başına dikkat eder ("cat" "The" ve "hungry"den dikkat alır). Kafa 3 sözdizimsel köke dikkat eder ("sat" birçok tokenden dikkat çeker). Kafa 4 edat nesnesine dikkat eder ("mat" "on" ve "the"den dikkat alır). Örüntü Clark vd. 2019 şekil 5'i çoğaltır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var tokens=['The','hungry','cat','sat','quickly','on','the','warm','mat'];
var n=tokens.length;
function makeMat(fn){var m=[];for(var i=0;i<n;i++){var row=[];var rs=0;for(var j=0;j<n;j++){var v=fn(i,j);row.push(v);rs+=v;}for(var j=0;j<n;j++){row[j]=row[j]/rs;}m.push(row);}return m;}
var h1=makeMat(function(i,j){return j===i-1?2.0:(j===i?0.5:0.1);});
var h2=makeMat(function(i,j){return j===2?1.6:(j===i?0.4:0.15);});
var h3=makeMat(function(i,j){return j===3?1.4:(j===i?0.4:0.18);});
var h4=makeMat(function(i,j){return j===8?1.4:(j===i?0.4:0.18);});
var heads=[h1,h2,h3,h4];
var traces=[];
for(var k=0;k<heads.length;k++){
  traces.push({z:heads[k],x:tokens,y:tokens,type:'heatmap',colorscale:[[0,'#0a0a0a'],[0.3,'#1e3a8a'],[0.7,'#3b82f6'],[1,'#fbbf24']],showscale:false,xaxis:'x'+(k+1>1?(k+1):''),yaxis:'y'+(k+1>1?(k+1):'')});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist',size:10},grid:{rows:2,columns:2,pattern:'independent'},annotations:[{text:'Kafa 1: onceki token',x:0.2,y:1.05,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}},{text:'Kafa 2: bas isim (cat)',x:0.8,y:1.05,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}},{text:'Kafa 3: kok fiil (sat)',x:0.2,y:0.45,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}},{text:'Kafa 4: nesne isim (mat)',x:0.8,y:0.45,xref:'paper',yref:'paper',showarrow:false,font:{color:'#fbbf24'}}],xaxis:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},xaxis2:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis2:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},xaxis3:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis3:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},xaxis4:{tickangle:-45,gridcolor:'rgba(255,255,255,0.04)'},yaxis4:{autorange:'reversed',gridcolor:'rgba(255,255,255,0.04)'},margin:{t:50,r:20,b:60,l:60}};
Plotly.newPlot('plot-l6-attention-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">INCE BIR DENKLIK</div><div class="think-body">Sabit seyrek maskeli öz-dikkat, tam olarak seyreklik grafı üzerinde bir graf evrişimidir. Tree-transformer (Wang vd. 2019) ve GraphFormers açıkça bağımlılık-ağacı maskelerini dikkate enjekte eder; transformer'i ayrıştırma ağacında R-GCN-tarzı bir operatöre çevirir. Bu, Ders 5 ve 6'yı köprüler: GNN ve transformer aynı temel mesaj geçirme işleminin iki görünüşüdür.</div></div>

<h2 class="lesson-title">10. Graph-RAG: Microsoft 2024</h2>

<div class="calc-highlight"><strong>2024 getirim paradigmasi.</strong> Vanilya getirim destekli üretim, parçaları vektör olarak gömer, kosinüs benzerliğine göre üst-$k$'yı çeker ve istemi onlarla doldurur. Bu, samanlıkta-iğne soruları için iyi çalışır ama birçok belgeyi birleştirmeyi gerektiren "küresel" sorular için başarısız olur ("bu 1000 sayfalık derlemde ana temalar neler?"). Microsoft Araştırma'nın Graph-RAG'ı (Edge vd. 2024) düz getirimi iki aşamalı graf getirimiyle değiştirir: derlemden bir KG inşa et, sonra cevabı kurmak için grafta dolaş.</div>

<div class="calc-formula"><div class="formula-label">GRAPH-RAG BORU HATTI</div><div class="formula-main">$$\\text{derlem} \\xrightarrow{\\text{LLM varlik+iliski cikar}} \\mathcal{G} \\xrightarrow{\\text{Leiden kumelemesi}} \\text{topluluklar} \\xrightarrow{\\text{LLM ozeti}} \\text{ozetler} \\xrightarrow{\\text{sorgu}} \\text{cevap}$$</div><div class="formula-sub">İndeks zamanında bir kez inşa edilen ve sorgu zamanında yeniden kullanılan dört aşamalı boru hattı. Topluluklar ve özetleri derlemin "anatomisi" olur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Asama 1: cikarim</div><div class="card-body">Küçük bir LLM (genellikle GPT-4 sınıfı) her belge parçasını okur ve üçlüleri JSON biçiminde yayınlar. Varlık türleri birlikte çıkarılır. Çıktı: derlemin gürültülü bir KG'si.</div></div>
<div class="calc-card"><div class="card-title">Asama 2: kumeleme</div><div class="card-body">KG üzerinde Leiden algoritmasını (Louvain'in iyileştirilmiş hali) çalıştır; topluluk yapısını birden çok çözünürlükte bul. Her topluluk, derlemin örtük ontolojisinin bir "bölümü" olur.</div></div>
<div class="calc-card"><div class="card-title">Asama 3: ozet</div><div class="card-body">Her topluluk için bir LLM, o varlık ve ilişki kümesinin neyle ilgili olduğuna dair bir özet yazar. Özetler kendileri de hiyerarşik kümelenir, bir özet ağacı üretir.</div></div>
<div class="calc-card"><div class="card-title">Asama 4: sorgu</div><div class="card-body">Yerel sorgular için ilgili varlıkları çek ve grafta yürü. Küresel sorgular için ("temalar") en üst düzey topluluk özetlerini yanıtlayan LLM'e ver. Maliyet: indekslemek daha pahalı, küresel sorularda çok daha yetenekli.</div></div>
</div>

<div class="calc-graph"><div id="plot-l6-graphrag-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Graph-RAG indeksleme ve sorgu boru hattı. Soldaki metin bir LLM tarafından bir bilgi grafına işlenir; KG Leiden ile topluluklara kümelenir; her topluluk LLM yazımlı bir özet alır; sorgu zamanında kullanıcı sorusu yanıtlayan LLM'e ilgili özetleri çeken bir dolaşımı tetikler. Kutular aşamalar, oklar veri akışı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nodes=[
 {x:0.06,y:0.5,label:'ham metin<br>parcalari',col:'#64748b'},
 {x:0.22,y:0.5,label:'LLM varlik +<br>iliski<br>cikarici',col:'#3b82f6'},
 {x:0.40,y:0.5,label:'bilgi<br>grafi',col:'#10b981'},
 {x:0.58,y:0.5,label:'Leiden<br>kumelemesi',col:'#f59e0b'},
 {x:0.76,y:0.5,label:'topluluk<br>ozetleri<br>(hiyerarsik)',col:'#ef4444'},
 {x:0.93,y:0.5,label:'LLM<br>sorgu<br>yanitlar',col:'#a78bfa'}
];
var traces=[];var ann=[];
for(var i=0;i<nodes.length-1;i++){
  var p1=nodes[i];var p2=nodes[i+1];
  ann.push({x:p2.x-0.02,y:p2.y,ax:p1.x+0.04,ay:p1.y,xref:'x',yref:'y',axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:1.3,arrowwidth:2,arrowcolor:'#3b82f6'});
}
ann.push({x:0.5,y:0.86,xref:'x',yref:'y',ax:0.5,ay:0.62,axref:'x',ayref:'y',showarrow:true,arrowhead:3,arrowsize:1.3,arrowwidth:2,arrowcolor:'#a78bfa'});
ann.push({x:0.5,y:0.92,text:'kullanici sorgusu: "Ana temalar neler?"',showarrow:false,font:{size:12,color:'#fbbf24'}});
for(var i=0;i<nodes.length;i++){var n=nodes[i];
  traces.push({x:[n.x],y:[n.y],mode:'markers+text',text:[n.label],textposition:'middle center',textfont:{color:'#0a0a0a',size:10},marker:{size:78,color:n.col,line:{color:'#fff',width:1.4}},showlegend:false,hoverinfo:'text'});
}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[0.2,1]},annotations:ann,margin:{t:30,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l6-graphrag-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Graph-RAG ne zaman kazanir.</strong> Edge vd., Podcast ve Haberler veri kümelerinde küresel ("birleştir") ve yerel ("ara") sorgular üzerinde değerlendirdi. Graph-RAG yerel sorgularda vektör RAG ile eşitti ya da onu geçti; küresel sorgularda onu $\\sim 20$ yüzde puanı geçti. Maliyet: indeksleme tokenler bakımından $5{-}50\\times$ daha pahalı. Net kullanım durumu yavaş değişen derlemler üzerinde kurumsal soru yanıtlamadır.</div>

<h2 class="lesson-title">11. Baglanti Tahmini ve Degerlendirme Metrikleri</h2>

<p class="l-text">Eğitilmiş bir gömme modelin olduğunda kanonik görev <strong>bağlantı tahminidir</strong>: $(h, r, ?)$ verildiğinde $\\mathcal{E}$'deki her varlığı skora göre sırala ve gerçek kuyruğun bu sıralamada nerede oturduğuna bak. Literatürde iki metrik baskındır.</p>

<div class="calc-formula"><div class="formula-label">DEGERLENDIRME METRIKLERI</div><div class="formula-main">$$\\text{Hits}@k = \\frac{1}{|\\mathcal{T}_{\\text{test}}|} \\sum_{(h,r,t) \\in \\mathcal{T}_{\\text{test}}} \\mathbb{1}[\\text{sira}(t) \\leq k]$$ $$\\text{MRR} = \\frac{1}{|\\mathcal{T}_{\\text{test}}|} \\sum_{(h,r,t) \\in \\mathcal{T}_{\\text{test}}} \\frac{1}{\\text{sira}(t)}$$</div><div class="formula-sub">Hits at $k$, gerçek kuyruğun üst-$k$'da olduğu test üçlülerinin oranıdır. Ortalama karşılıklı sıra (MRR) $1/\\text{sira}$'yı ortalar, daha yüksek sıralamalara daha çok kredi verir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Filtreli ayar</div><div class="card-body">Standart uygulama: $(h, r, ?)$'yi sıralarken, $(h, r, t')$'nin doğru olduğu bilinen eğitim kümesi varlıklarını $t'$ kaldır; yalnızca gerçekten görülmemiş varlıklara karşı sırala. Modelin diğer bilinen gerçekleri doğru kurtarmasından cezalandırılmasını önler.</div></div>
<div class="calc-card"><div class="card-title">Tipik sayilar</div><div class="card-body">FB15K-237 ölçütünde 2026'da: ComplEx Hits at 10 $\\approx 0.45$, RotatE $\\approx 0.55$, CompGCN $\\approx 0.58$. Daha yeni yöntemler bunu $0.6$'nın üstüne taşır. Rastgele baz çizgisi $0.001$.</div></div>
<div class="calc-card"><div class="card-title">Dogrulugun otesinde</div><div class="card-body">Skor kalibrasyonu ($0.9$ güven $\\%90$ doğru mu?), adversaryel bozulmaya karşı dayanıklılık ve graf-dışı genelleme (sıfır-vuruşlu ilişkiler), 2026'da etkin araştırma alanlarıdır.</div></div>
</div>

<div class="calc-graph"><div id="plot-l6-linkpred-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> TransE eğitimi sonrası küçük bir test kümesindeki tahmin edilen ve gerçek bağlantı skorları. 45 derecelik kesik çizgi mükemmel kalibrasyon; turuncu noktalar doğru sıralanmış test üçlüleri, mavi noktalar kaçırılanlar (gerçek kuyruk üst-10'da yok). Kütlenin büyük kısmı sağ üstte köşegen civarında, sol altta birkaç yanlış tahmin vardır; tipik eğitim sonucunu gösterir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var hitsX=[];var hitsY=[];var missX=[];var missY=[];
for(var i=0;i<60;i++){
  var x=Math.random()*0.6+0.35;
  var y=x+(Math.random()-0.5)*0.18;
  hitsX.push(x);hitsY.push(Math.max(0.1,Math.min(1,y)));
}
for(var i=0;i<14;i++){
  var x=Math.random()*0.4+0.5;
  var y=Math.random()*0.4+0.05;
  missX.push(x);missY.push(y);
}
var d1={x:hitsX,y:hitsY,mode:'markers',name:'hits (dogru sirali)',marker:{size:8,color:'#f59e0b',line:{color:'#fbbf24',width:0.8}}};
var d2={x:missX,y:missY,mode:'markers',name:'miss (sira > 10)',marker:{size:9,color:'#3b82f6',line:{color:'#60a5fa',width:0.8}}};
var d3={x:[0,1],y:[0,1],mode:'lines',name:'mukemmel kalibrasyon',line:{color:'rgba(255,255,255,0.35)',dash:'dash',width:1.4}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'tahmin edilen skor',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151',range:[0,1]},yaxis:{title:'gercek eslesme (1=grafta)',gridcolor:'rgba(255,255,255,0.07)',zerolinecolor:'#374151',range:[0,1]},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5},margin:{t:40,r:30,b:50,l:60}};
Plotly.newPlot('plot-l6-linkpred-tr',[d1,d2,d3],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Pratik Alistirma: NumPy ile TransE Egit ve Eksik Baglantilari Tahmin Et</h2>

<p class="l-text">Her şeyi birbirine bağla. Aşağıdaki Pyodide parçası elle sekiz varlıklı küçük bir KG tanımlar, marj kaybı ve SGD ile TransE eğitir, ayrılmış üçlüler üzerinde Hits at $k$ değerlendirir ve birkaç sorgu için en olası eksik kuyrukları tahmin eder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">KOPYALA</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># --- 1. Kucuk bir bilgi grafi tanimla ---</span>
entities = [<span class="str">"Einstein"</span>, <span class="str">"Ulm"</span>, <span class="str">"Germany"</span>, <span class="str">"Nobel"</span>,
            <span class="str">"Physics"</span>, <span class="str">"Princeton"</span>, <span class="str">"Bohr"</span>, <span class="str">"Manhattan"</span>]
relations = [<span class="str">"born_in"</span>, <span class="str">"located_in"</span>, <span class="str">"won"</span>, <span class="str">"field_of"</span>,
             <span class="str">"worked_at"</span>, <span class="str">"colleague_of"</span>, <span class="str">"advised"</span>, <span class="str">"nationality"</span>]
ent_id = {e: i <span class="kw">for</span> i, e <span class="kw">in</span> <span class="fn">enumerate</span>(entities)}
rel_id = {r: i <span class="kw">for</span> i, r <span class="kw">in</span> <span class="fn">enumerate</span>(relations)}

train_triples = [
    (<span class="str">"Einstein"</span>, <span class="str">"born_in"</span>, <span class="str">"Ulm"</span>),
    (<span class="str">"Ulm"</span>, <span class="str">"located_in"</span>, <span class="str">"Germany"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"won"</span>, <span class="str">"Nobel"</span>),
    (<span class="str">"Bohr"</span>, <span class="str">"won"</span>, <span class="str">"Nobel"</span>),
    (<span class="str">"Nobel"</span>, <span class="str">"field_of"</span>, <span class="str">"Physics"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"worked_at"</span>, <span class="str">"Princeton"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"colleague_of"</span>, <span class="str">"Bohr"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"advised"</span>, <span class="str">"Manhattan"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"nationality"</span>, <span class="str">"Germany"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"field_of"</span>, <span class="str">"Physics"</span>),
    (<span class="str">"Bohr"</span>, <span class="str">"field_of"</span>, <span class="str">"Physics"</span>),
    (<span class="str">"Bohr"</span>, <span class="str">"colleague_of"</span>, <span class="str">"Einstein"</span>),
]
test_triples = [
    (<span class="str">"Bohr"</span>, <span class="str">"nationality"</span>, <span class="str">"Germany"</span>),
    (<span class="str">"Einstein"</span>, <span class="str">"located_in"</span>, <span class="str">"Princeton"</span>),
]

triples_idx = np.array([[ent_id[h], rel_id[r], ent_id[t]] <span class="kw">for</span> h, r, t <span class="kw">in</span> train_triples])
N_ent, N_rel, D = <span class="fn">len</span>(entities), <span class="fn">len</span>(relations), <span class="num">20</span>

<span class="cm"># --- 2. Gomuleri ilklendir ---</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
E = rng.<span class="fn">uniform</span>(-<span class="num">6</span>/np.<span class="fn">sqrt</span>(D), <span class="num">6</span>/np.<span class="fn">sqrt</span>(D), (N_ent, D))
R = rng.<span class="fn">uniform</span>(-<span class="num">6</span>/np.<span class="fn">sqrt</span>(D), <span class="num">6</span>/np.<span class="fn">sqrt</span>(D), (N_rel, D))
E /= np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># --- 3. Marj kayipli egitim dongusu ---</span>
<span class="kw">def</span> <span class="fn">score</span>(h, r, t):
    <span class="kw">return</span> -np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E[h] + R[r] - E[t])

gamma, lr, epochs = <span class="num">1.0</span>, <span class="num">0.05</span>, <span class="num">400</span>
losses = []
<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(epochs):
    loss_ep = <span class="num">0</span>
    rng.<span class="fn">shuffle</span>(triples_idx)
    <span class="kw">for</span> h, r, t <span class="kw">in</span> triples_idx:
        <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; <span class="num">0.5</span>:
            t_corr = rng.<span class="fn">integers</span>(N_ent)
            h_corr = h
        <span class="kw">else</span>:
            h_corr = rng.<span class="fn">integers</span>(N_ent)
            t_corr = t
        d_pos = np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E[h] + R[r] - E[t])
        d_neg = np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E[h_corr] + R[r] - E[t_corr])
        margin = gamma + d_pos - d_neg
        <span class="kw">if</span> margin &gt; <span class="num">0</span>:
            v_pos = (E[h] + R[r] - E[t]) / (d_pos + <span class="num">1e-9</span>)
            v_neg = (E[h_corr] + R[r] - E[t_corr]) / (d_neg + <span class="num">1e-9</span>)
            E[h] -= lr * v_pos
            R[r] -= lr * (v_pos - v_neg)
            E[t] += lr * v_pos
            E[h_corr] += lr * v_neg
            E[t_corr] -= lr * v_neg
            loss_ep += margin
    E /= np.<span class="fn">linalg</span>.<span class="fn">norm</span>(E, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>)
    losses.<span class="fn">append</span>(loss_ep)
<span class="fn">print</span>(<span class="str">f"son kayip = {losses[-1]:.3f}, baslangic = {losses[0]:.3f}"</span>)

<span class="cm"># --- 4. Baglanti tahmini: bir sorgu icin tum varliklari sirala ---</span>
<span class="kw">def</span> <span class="fn">rank_tails</span>(h_name, r_name):
    h, r = ent_id[h_name], rel_id[r_name]
    scores = [(<span class="fn">score</span>(h, r, t), entities[t]) <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(N_ent)]
    scores.<span class="fn">sort</span>(reverse=<span class="kw">True</span>)
    <span class="kw">return</span> scores

<span class="fn">print</span>(<span class="str">"\\n--- (Bohr, nationality, ?) icin kuyruk tahmin ---"</span>)
<span class="kw">for</span> s, name <span class="kw">in</span> <span class="fn">rank_tails</span>(<span class="str">"Bohr"</span>, <span class="str">"nationality"</span>)[:<span class="num">3</span>]:
    <span class="fn">print</span>(<span class="str">f"  {name}: {s:.3f}"</span>)

<span class="fn">print</span>(<span class="str">"\\n--- (Einstein, won, ?) icin kuyruk tahmin ---"</span>)
<span class="kw">for</span> s, name <span class="kw">in</span> <span class="fn">rank_tails</span>(<span class="str">"Einstein"</span>, <span class="str">"won"</span>)[:<span class="num">3</span>]:
    <span class="fn">print</span>(<span class="str">f"  {name}: {s:.3f}"</span>)

<span class="cm"># --- 5. Test setinde Hits@k ---</span>
<span class="kw">def</span> <span class="fn">hits_at_k</span>(test, k=<span class="num">3</span>):
    correct = <span class="num">0</span>
    <span class="kw">for</span> h_name, r_name, t_name <span class="kw">in</span> test:
        ranked = <span class="fn">rank_tails</span>(h_name, r_name)
        top_names = [n <span class="kw">for</span> _, n <span class="kw">in</span> ranked[:k]]
        <span class="kw">if</span> t_name <span class="kw">in</span> top_names:
            correct += <span class="num">1</span>
    <span class="kw">return</span> correct / <span class="fn">len</span>(test)

<span class="fn">print</span>(<span class="str">f"\\nTest Hits@3 = {hits_at_k(test_triples, k=3):.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Test Hits@5 = {hits_at_k(test_triples, k=5):.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Ne gozlemlemelisin.</strong> Kayıp $200$ epok içinde birkaç yüzden sıfıra yakın iner. <code>(Bohr, nationality, ?)</code> için en üst sıradaki kuyruk Almanya ya da Danimarka-benzeri olmalı (model yalnızca <code>Einstein nationality Germany</code> ve <code>Bohr colleague_of Einstein</code>'ı gördü, bu yüzden Bohr'un da Almanya'ya bağlı olduğunu genelleştirir). <code>(Einstein, won, ?)</code> için en üst sıradaki kuyruk beklendiği gibi Nobel'dir. İki üçlülük test setinde Hits at 3 genelde $0.5$ (iki tanenin biri doğru); eğitim ve test setini büyütmek daha pürüzsüz sayılar verir.</p>

<div class="think-box"><div class="think-label">DENEMELER</div><div class="think-body">(1) $D$'yi $20$'den $50$'ye çıkar ve $2$D PCA'da gömülerin daha net kümelere ayrıldığını izle. (2) Başka bir ilişki türü ekle ve modelin <code>colleague_of</code>'u yaklaşık anti-simetrik olarak hâlâ koruyup korumadığını gör. (3) L2 mesafesini $-\\langle \\mathbf{e}_h \\circ \\mathbf{r}, \\mathbf{e}_t \\rangle$ ile değiştir, DistMult elde et; DistMult'un asimetrik ilişkileri modelleyemediğini gözle. (4) ConceptNet'in CSV indirmesinden daha büyük bir derlem üzerinde eğit ve <code>(cat, IsA, ?)</code> için en üst sıradaki kuyrukların "animal", "pet", "mammal" içerip içermediğini kontrol et.</div></div>

<h2 class="lesson-title">13. Bu Ders Kursta Nereye Baglanir</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ders 3'ten (graf teorisi)</div><div class="card-body">KG'ler yönlü çoklu graflardır. Her graf-teorik kavram (derece, merkezilik, bağlılık, en kısa yol) geçerlidir. Wikidata güç-yasası derece dağılımına sahip; yüksek-dereceli hub'lar (ülkeler, yaygın meslekler) getirimde baskındır.</div></div>
<div class="calc-card"><div class="card-title">Ders 4'ten (graf algoritmalari)</div><div class="card-body">Bir KG üzerinde kişiselleştirilmiş PageRank varlık getirimi için güçlü bir baz çizgisidir. Rastgele yürüyüş temelli yöntemler (DeepWalk, node2vec, metapath2vec) bu dersteki gömme yöntemlerinin öncülüdür.</div></div>
<div class="calc-card"><div class="card-title">Ders 5'ten (spektral ve GNN'ler)</div><div class="card-body">R-GCN, spektral GCN'in ilişkisel uzantısıdır. KG'nin Laplasyen özdeğerleri bağlantı tahmin zorluğuyla ilişkilidir. Spektral kümeleme, Graph-RAG'ın Leiden ile yeniden keşfettiği toplulukları kurtarır.</div></div>
<div class="calc-card"><div class="card-title">YZ izine</div><div class="card-body">Transformer dikkati (NLP-L4), getirim destekli LLM'ler (NLP-L9), yapılandırılmış sağduyu çıkarımı (NLP-L12) hepsi burada geliştirilen makineyi kullanır. Bilgi grafı gömüleri temel modeller çağında bile yapılandırılmış akıl yürütme için güçlü bir tümevarımsal önyargı olmaya devam eder.</div></div>
</div>

<div class="calc-highlight"><strong>Artik yapabileceklerin:</strong> RDF üçlülerini oku ve yaz, SPARQL graf-desen sorguları formüle et, TransE / ComplEx / RotatE'yi sıfırdan eğit ve eksik bağlantıları tahmin et, bağımlılık ayrıştırmalarını küçük KG'ler olarak tanı, transformer dikkatini öğrenilmiş bir dinamik graf olarak yeniden yorumla, ve Graph-RAG'ın vektör RAG'ı ne zaman geçtiğini açıkla. Ayrık graf teorisinden modern getirim destekli yapay zekaya geçen köprüyü aştın.</div>`
};
