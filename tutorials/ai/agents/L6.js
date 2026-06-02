window.AGENTS_L6 = {
en: `<p class="l-text"><strong>Memory is what turns a chatbot into an agent that grows with the user.</strong> Without memory, every turn is a stranger meeting a stranger. With memory, the agent remembers the user's preferences across weeks, recalls a fact mentioned three months ago, and stops asking the same clarifying question. The hard part is not "store messages" — it is choosing the right shape of memory for each retrieval pattern, then keeping the context window from drowning under its own history.</p>

<p class="l-text">Four memory archetypes cover 95% of production needs: <strong>scratchpad</strong> (the current turn's reasoning), <strong>vector store</strong> (semantic recall over a long history), <strong>summary</strong> (compression of old turns into prose), and <strong>episodic</strong> (a structured event log you can filter and replay). On top, the new generation of 1M-token models (Claude Sonnet 4.6 in 1M-context mode) shifts the cost calculus: many memory tricks invented for 8K windows are no longer needed — but the ones that remain matter more than ever for cost, latency, and recall accuracy.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The four archetypes: scratchpad, vector, summary, episodic — and when each wins</li>
<li>Build a TF-IDF + cosine vector memory in 30 lines (<code>mem0</code> / Zep / LangMem under the hood)</li>
<li>Summary compression heuristics: token-budget triggers, recursive summarization</li>
<li>Episodic event logs: filterable by type/time/entity, with re-injection on retrieval</li>
<li>1M-context strategies (Sonnet 4.6): prompt caching, position bias, when to NOT use 1M</li>
<li>Memory in production: write/read paths, eviction, multi-tenant isolation, privacy</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Four Archetypes</h2>
<p class="l-text">Memory looks like one thing from the outside ("the agent remembers me") but breaks into four very different mechanisms. They differ along three axes: <em>scope</em> (turn / session / lifetime), <em>structure</em> (free text / vectors / structured records), and <em>retrieval</em> (always-on / semantic / filtered).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scratchpad</div><div class="card-body">Lives inside a single turn. Holds intermediate thoughts and tool observations. Wiped at the end of the call. Every ReAct agent has one.</div></div>
<div class="calc-card"><div class="card-title">Vector store</div><div class="card-body">Lifetime. Stores embeddings of past messages or facts. Retrieved by semantic similarity to the current query. Best for "what did the user say about X months ago".</div></div>
<div class="calc-card"><div class="card-title">Summary</div><div class="card-body">Session or lifetime. A rolling prose summary of older turns, regenerated when the raw history exceeds a budget. Lossy but cheap.</div></div>
<div class="calc-card"><div class="card-title">Episodic</div><div class="card-body">Lifetime. Structured records of discrete events ("user upgraded plan", "session crashed at step 4"). Filterable by type, time, entity. The agent's audit log.</div></div>
</div>

<div class="calc-highlight">Production agents combine all four. A typical Claude-Code-shaped agent: scratchpad for the current task, episodic log of past runs, vector store of resolved issues, and a rolling summary of the long conversation when context is tight. The art is the read/write policy — when to write, when to read, when to compress.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Scratchpad — The Easy One</h2>
<p class="l-text">The scratchpad is just the message list inside the agent loop. Every <code>Thought:</code>/<code>Action:</code>/<code>Observation:</code> triple grows it. The only design decisions are: (a) keep the full trace or strip stale observations, and (b) format thoughts as natural prose vs. structured JSON.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Scratchpad with stale-observation trimming</span>
<span class="kw">def</span> <span class="fn">trim_scratchpad</span>(steps, keep_last_n_observations=<span class="num">3</span>):
    <span class="str">"""Keep all thoughts/actions; drop observations older than the last N tool calls."""</span>
    out, kept_obs = [], <span class="num">0</span>
    <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">reversed</span>(steps):
        <span class="kw">if</span> s[<span class="str">"kind"</span>] == <span class="str">"observation"</span>:
            <span class="kw">if</span> kept_obs &lt; keep_last_n_observations:
                out.<span class="fn">append</span>(s); kept_obs += <span class="num">1</span>
            <span class="kw">else</span>:
                out.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"observation"</span>,<span class="str">"content"</span>:<span class="str">"&lt;trimmed&gt;"</span>})
        <span class="kw">else</span>:
            out.<span class="fn">append</span>(s)
    <span class="kw">return</span> <span class="fn">list</span>(<span class="fn">reversed</span>(out))

steps = []
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">6</span>):
    steps.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"thought"</span>,<span class="str">"content"</span>:f<span class="str">"step {i} thinking..."</span>})
    steps.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"action"</span>,<span class="str">"content"</span>:f<span class="str">"call_tool_{i}"</span>})
    steps.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"observation"</span>,<span class="str">"content"</span>:f<span class="str">"result {i}: "</span> + <span class="str">"x"</span>*<span class="num">40</span>})

trimmed = <span class="fn">trim_scratchpad</span>(steps, keep_last_n_observations=<span class="num">2</span>)
<span class="kw">for</span> s <span class="kw">in</span> trimmed[-<span class="num">9</span>:]:
    <span class="fn">print</span>(s[<span class="str">"kind"</span>][:<span class="num">5</span>], <span class="str">"::"</span>, s[<span class="str">"content"</span>][:<span class="num">55</span>])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>trim_scratchpad(steps, keep_last_n_observations)</code> walks the scratchpad backwards (<code>reversed(steps)</code>) so the most recent items are decided first. 2) For every <code>observation</code> entry it keeps the actual content as long as <code>kept_obs &lt; keep_last_n_observations</code>, otherwise replaces it with a tiny <code>&lt;trimmed&gt;</code> placeholder — thoughts and actions are always preserved. 3) The reversed-then-reversed pattern gives O(n) trimming while preserving the original step order in the output. 4) The driver builds 18 fake steps and trims to keep only the last 2 observations, so the printed tail shows several <code>obser :: &lt;trimmed&gt;</code> entries interleaved with the surviving thoughts and actions — the exact context shape you would feed back into the next LLM call.</p>

<p class="l-text">A subtle but important point: trimming observations costs less reasoning quality than trimming thoughts. The model's own thoughts encode where it has been; observations can often be re-derived. When in doubt, trim observations first.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Vector Memory — Semantic Recall</h2>
<p class="l-text">Vector memory stores past content as embeddings; at query time, the current input is embedded and the top-k most similar past entries are pulled back into context. This is what <code>mem0</code>, Zep, and LangMem do — wrapped in nicer APIs but mathematically the same: cosine similarity over a corpus.</p>

<div class="katex-block">$$\\text{sim}(q, m_i) = \\frac{q \\cdot m_i}{\\lVert q \\rVert \\, \\lVert m_i \\rVert}, \\qquad \\text{retrieved} = \\text{top-}k\\bigl\\{\\text{sim}(q, m_i)\\bigr\\}_{i=1}^{N}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Write path</div><div class="card-body">Decide what to remember. Naive: every user turn. Smart: only "memorable" turns (LLM-classified facts, preferences, named entities).</div></div>
<div class="calc-card"><div class="card-title">Read path</div><div class="card-body">Embed the current query. Retrieve top-k by cosine. Optionally re-rank with a cross-encoder. Inject into the system prompt as "Relevant memories: ...".</div></div>
<div class="calc-card"><div class="card-title">Eviction</div><div class="card-body">Time-decay (older = less weight), reference-count (rarely retrieved = stale), or LLM-judged ("is this still true?").</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># mem0-style vector memory with OpenAI embeddings</span>
<span class="kw">from</span> mem0 <span class="kw">import</span> Memory

m = <span class="fn">Memory</span>()
m.<span class="fn">add</span>(<span class="str">"User prefers vegetarian Thai food."</span>, user_id=<span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User is allergic to peanuts."</span>,       user_id=<span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User travels to Tokyo in May."</span>,      user_id=<span class="str">"alice"</span>)

related = m.<span class="fn">search</span>(<span class="str">"planning dinner for alice"</span>, user_id=<span class="str">"alice"</span>, limit=<span class="num">2</span>)
<span class="fn">print</span>(related)
<span class="cm"># -&gt; [{"memory":"vegetarian Thai", "score":0.84}, {"memory":"allergic to peanuts", "score":0.81}]</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Instantiates a <code>mem0.Memory()</code> client — under the hood mem0 picks an embedding provider (OpenAI by default), a vector store (Chroma/Qdrant), and an LLM-as-judge for write decisions. 2) <code>m.add(text, user_id="alice")</code> embeds the text and writes the vector into the per-user namespace; mem0 deduplicates against existing memories so saying the same fact twice does not double-store. 3) <code>m.search("planning dinner for alice", user_id="alice", limit=2)</code> embeds the query, runs a cosine top-k against alice's namespace only, and returns ordered <code>{memory, score}</code> dicts. 4) The printed result is what you would inject into the system prompt as "Relevant memories:" — semantic recall over arbitrary past facts without any keyword overlap (note "dinner" retrieved both "vegetarian Thai" and the peanut allergy).</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A 30-line vector memory using TF-IDF embeddings + cosine similarity. Same architecture as mem0/LangMem; runs entirely in the browser.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> VectorMemory:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.docs, <span class="kw">self</span>.users = [], []
        <span class="kw">self</span>.vec = <span class="fn">TfidfVectorizer</span>()
        <span class="kw">self</span>._mat = <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">add</span>(<span class="kw">self</span>, text, user_id):
        <span class="kw">self</span>.docs.<span class="fn">append</span>(text); <span class="kw">self</span>.users.<span class="fn">append</span>(user_id)
        <span class="kw">self</span>._mat = <span class="kw">self</span>.vec.<span class="fn">fit_transform</span>(<span class="kw">self</span>.docs)
    <span class="kw">def</span> <span class="fn">search</span>(<span class="kw">self</span>, query, user_id, k=<span class="num">2</span>):
        <span class="kw">if</span> <span class="kw">not</span> <span class="kw">self</span>.docs: <span class="kw">return</span> []
        q = <span class="kw">self</span>.vec.<span class="fn">transform</span>([query])
        sims = <span class="fn">cosine_similarity</span>(q, <span class="kw">self</span>._mat)[<span class="num">0</span>]
        <span class="cm"># filter by user</span>
        mask = np.<span class="fn">array</span>([u == user_id <span class="kw">for</span> u <span class="kw">in</span> <span class="kw">self</span>.users])
        sims = np.<span class="fn">where</span>(mask, sims, -<span class="num">1</span>)
        idx = sims.<span class="fn">argsort</span>()[::-<span class="num">1</span>][:k]
        <span class="kw">return</span> [{<span class="str">"memory"</span>: <span class="kw">self</span>.docs[i], <span class="str">"score"</span>: <span class="fn">round</span>(<span class="fn">float</span>(sims[i]),<span class="num">3</span>)}
                <span class="kw">for</span> i <span class="kw">in</span> idx <span class="kw">if</span> sims[i] &gt; <span class="num">0</span>]

m = <span class="fn">VectorMemory</span>()
m.<span class="fn">add</span>(<span class="str">"User prefers vegetarian Thai food."</span>, <span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User is allergic to peanuts."</span>,       <span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User travels to Tokyo in May."</span>,      <span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User likes spicy ramen."</span>,            <span class="str">"bob"</span>)

<span class="fn">print</span>(<span class="str">"alice dinner :"</span>, m.<span class="fn">search</span>(<span class="str">"planning a dinner with alice"</span>, <span class="str">"alice"</span>, k=<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"alice trip   :"</span>, m.<span class="fn">search</span>(<span class="str">"flight to japan"</span>, <span class="str">"alice"</span>, k=<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"bob isolation:"</span>, m.<span class="fn">search</span>(<span class="str">"food for alice"</span>, <span class="str">"bob"</span>, k=<span class="num">2</span>))   <span class="cm"># bob sees only his own</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>VectorMemory</code> keeps parallel <code>docs</code> and <code>users</code> lists plus a single shared <code>TfidfVectorizer</code> — same shape as a pgvector or Chroma table with one column per fact and one column per owner. 2) <code>add(text, user_id)</code> appends the new text and refits the vectorizer over the whole corpus (cheap for demo size; in production you keep an incremental index). 3) <code>search(query, user_id, k=2)</code> embeds the query, runs <code>cosine_similarity</code> against the matrix, then uses <code>np.where(mask, sims, -1)</code> to zero out scores for other users — this is per-user namespace isolation in one line. 4) The three demo queries prove the contract: alice's dinner query retrieves the Thai + peanut facts; her trip query surfaces the Tokyo fact; the bob-scoped query for "food for alice" returns nothing because cross-user retrieval is blocked at the mask.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Summary Memory — Compression</h2>
<p class="l-text">When the raw conversation grows past a budget, summarize the older half into prose and replace it. Two flavors: <strong>moving-window</strong> summary (always summarize messages older than N) and <strong>recursive</strong> summary (summarize the summary when even that exceeds budget).</p>

<div class="katex-block">$$\\text{tokens}(c_{t+1}) = \\text{tokens}(\\text{summary}(c_t^{old})) + \\text{tokens}(c_t^{recent}) + \\text{tokens}(\\text{new turn})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Token-budget triggered summary memory</span>
<span class="kw">def</span> <span class="fn">approx_tokens</span>(text): <span class="kw">return</span> <span class="fn">max</span>(<span class="num">1</span>, <span class="fn">len</span>(text) // <span class="num">4</span>)

<span class="kw">def</span> <span class="fn">fake_llm_summarize</span>(messages):
    <span class="str">"""Real impl: call Claude with 'Summarize the conversation so far.'"""</span>
    bullets = []
    <span class="kw">for</span> m <span class="kw">in</span> messages:
        role = m[<span class="str">"role"</span>][<span class="num">0</span>].<span class="fn">upper</span>()
        bullets.<span class="fn">append</span>(f<span class="str">"{role}: {m['content'][:60]}"</span>)
    <span class="kw">return</span> <span class="str">"Summary so far:\\n- "</span> + <span class="str">"\\n- "</span>.<span class="fn">join</span>(bullets[-<span class="num">6</span>:])

<span class="kw">class</span> SummaryMemory:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, max_tokens=<span class="num">300</span>, keep_recent=<span class="num">4</span>):
        <span class="kw">self</span>.summary = <span class="str">""</span>
        <span class="kw">self</span>.recent = []         <span class="cm"># untouched recent messages</span>
        <span class="kw">self</span>.max_tokens = max_tokens
        <span class="kw">self</span>.keep_recent = keep_recent
    <span class="kw">def</span> <span class="fn">add</span>(<span class="kw">self</span>, role, content):
        <span class="kw">self</span>.recent.<span class="fn">append</span>({<span class="str">"role"</span>: role, <span class="str">"content"</span>: content})
        <span class="kw">if</span> <span class="kw">self</span>.<span class="fn">_tokens</span>() &gt; <span class="kw">self</span>.max_tokens:
            <span class="kw">self</span>.<span class="fn">_compress</span>()
    <span class="kw">def</span> <span class="fn">_tokens</span>(<span class="kw">self</span>):
        <span class="kw">return</span> <span class="fn">approx_tokens</span>(<span class="kw">self</span>.summary) + <span class="fn">sum</span>(<span class="fn">approx_tokens</span>(m[<span class="str">"content"</span>]) <span class="kw">for</span> m <span class="kw">in</span> <span class="kw">self</span>.recent)
    <span class="kw">def</span> <span class="fn">_compress</span>(<span class="kw">self</span>):
        <span class="cm"># everything except the last keep_recent gets summarized</span>
        old = <span class="kw">self</span>.recent[:-<span class="kw">self</span>.keep_recent]
        <span class="kw">self</span>.recent = <span class="kw">self</span>.recent[-<span class="kw">self</span>.keep_recent:]
        <span class="kw">self</span>.summary = <span class="fn">fake_llm_summarize</span>(
            [{<span class="str">"role"</span>:<span class="str">"system"</span>,<span class="str">"content"</span>:<span class="kw">self</span>.summary}] + old) <span class="kw">if</span> <span class="kw">self</span>.summary <span class="kw">or</span> old <span class="kw">else</span> <span class="kw">self</span>.summary
    <span class="kw">def</span> <span class="fn">context</span>(<span class="kw">self</span>):
        out = []
        <span class="kw">if</span> <span class="kw">self</span>.summary: out.<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"system"</span>,<span class="str">"content"</span>:<span class="kw">self</span>.summary})
        out.<span class="fn">extend</span>(<span class="kw">self</span>.recent)
        <span class="kw">return</span> out

mem = <span class="fn">SummaryMemory</span>(max_tokens=<span class="num">120</span>, keep_recent=<span class="num">3</span>)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    mem.<span class="fn">add</span>(<span class="str">"user"</span>,      f<span class="str">"Turn {i} from user — discussing topic {i % 3}."</span>)
    mem.<span class="fn">add</span>(<span class="str">"assistant"</span>, f<span class="str">"Turn {i} reply with some details about topic {i % 3}, more text here."</span>)

ctx = mem.<span class="fn">context</span>()
<span class="fn">print</span>(<span class="str">"messages in context:"</span>, <span class="fn">len</span>(ctx))
<span class="fn">print</span>(<span class="str">"first item:"</span>, ctx[<span class="num">0</span>][<span class="str">"content"</span>][:<span class="num">120</span>], <span class="str">"..."</span>)
<span class="fn">print</span>(<span class="str">"last item :"</span>, ctx[-<span class="num">1</span>][<span class="str">"content"</span>][:<span class="num">80</span>])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>SummaryMemory(max_tokens=300, keep_recent=4)</code> tracks two pieces of state: a single <code>summary</code> string for the compressed history and a <code>recent</code> list for the untouched newest messages. 2) Every <code>add(role, content)</code> appends to <code>recent</code>, then calls <code>_tokens()</code> (a 4-chars-per-token approximation over both <code>summary</code> and <code>recent</code>); if the total exceeds <code>max_tokens</code> it triggers <code>_compress</code>. 3) <code>_compress()</code> peels off everything older than the <code>keep_recent</code> tail, hands it to <code>fake_llm_summarize</code> alongside the existing summary, and overwrites <code>self.summary</code> — recursive summarization in one line. 4) <code>context()</code> returns the LLM-ready message list: a single <code>system</code> message carrying the rolling summary followed by the verbatim recent turns — the printed sizes show the budget cap is respected even after 16 messages.</p>

<div class="calc-highlight">Summary memory loses fidelity. Use it as a <em>fallback</em> for context-overflow, not as the primary recall mechanism. If you need to remember a specific fact ("user is vegetarian"), put it in vector or episodic memory; do not trust the summary to keep it.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Episodic Memory — The Event Log</h2>
<p class="l-text">An episode is a structured record: <code>{type, ts, entity, payload}</code>. Episodic memory is a list of these you can <code>filter</code> by any field. It is what gives the agent its long-term life: "every time the user upgraded their plan", "every time this customer's deploys failed", "every conversation we had about pricing".</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Episodic memory with filterable retrieval</span>
<span class="kw">import</span> time, json

<span class="kw">class</span> EpisodicMemory:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>): <span class="kw">self</span>.events = []
    <span class="kw">def</span> <span class="fn">write</span>(<span class="kw">self</span>, ev_type, entity, payload):
        <span class="kw">self</span>.events.<span class="fn">append</span>({<span class="str">"ts"</span>: time.<span class="fn">time</span>(), <span class="str">"type"</span>: ev_type,
                            <span class="str">"entity"</span>: entity, <span class="str">"payload"</span>: payload})
    <span class="kw">def</span> <span class="fn">query</span>(<span class="kw">self</span>, *, <span class="fn">type</span>=<span class="kw">None</span>, entity=<span class="kw">None</span>, since=<span class="kw">None</span>, limit=<span class="num">10</span>):
        out = <span class="kw">self</span>.events
        <span class="kw">if</span> <span class="fn">type</span>:   out = [e <span class="kw">for</span> e <span class="kw">in</span> out <span class="kw">if</span> e[<span class="str">"type"</span>]   == <span class="fn">type</span>]
        <span class="kw">if</span> entity: out = [e <span class="kw">for</span> e <span class="kw">in</span> out <span class="kw">if</span> e[<span class="str">"entity"</span>] == entity]
        <span class="kw">if</span> since:  out = [e <span class="kw">for</span> e <span class="kw">in</span> out <span class="kw">if</span> e[<span class="str">"ts"</span>]    &gt;= since]
        <span class="kw">return</span> out[-limit:]
    <span class="kw">def</span> <span class="fn">render_for_prompt</span>(<span class="kw">self</span>, events):
        lines = []
        <span class="kw">for</span> e <span class="kw">in</span> events:
            lines.<span class="fn">append</span>(f<span class="str">"- [{e['type']}] {e['entity']}: "</span> +
                         json.<span class="fn">dumps</span>(e[<span class="str">'payload'</span>], separators=(<span class="str">','</span>,<span class="str">':'</span>)))
        <span class="kw">return</span> <span class="str">"Relevant past events:\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(lines) <span class="kw">if</span> lines <span class="kw">else</span> <span class="str">""</span>

em = <span class="fn">EpisodicMemory</span>()
em.<span class="fn">write</span>(<span class="str">"plan_upgrade"</span>, <span class="str">"alice"</span>, {<span class="str">"from"</span>:<span class="str">"free"</span>,<span class="str">"to"</span>:<span class="str">"pro"</span>})
em.<span class="fn">write</span>(<span class="str">"deploy_failed"</span>, <span class="str">"alice-app-1"</span>, {<span class="str">"step"</span>:<span class="num">4</span>,<span class="str">"err"</span>:<span class="str">"timeout"</span>})
em.<span class="fn">write</span>(<span class="str">"plan_upgrade"</span>, <span class="str">"bob"</span>,   {<span class="str">"from"</span>:<span class="str">"pro"</span>,<span class="str">"to"</span>:<span class="str">"team"</span>})
em.<span class="fn">write</span>(<span class="str">"deploy_failed"</span>, <span class="str">"alice-app-1"</span>, {<span class="str">"step"</span>:<span class="num">2</span>,<span class="str">"err"</span>:<span class="str">"oom"</span>})
em.<span class="fn">write</span>(<span class="str">"support_chat"</span>, <span class="str">"alice"</span>, {<span class="str">"topic"</span>:<span class="str">"refund"</span>})

<span class="cm"># what has alice done lately?</span>
alice_events = em.<span class="fn">query</span>(entity=<span class="str">"alice"</span>, limit=<span class="num">5</span>)
<span class="fn">print</span>(em.<span class="fn">render_for_prompt</span>(alice_events))

<span class="cm"># all deploy failures for alice's app</span>
fails = em.<span class="fn">query</span>(<span class="fn">type</span>=<span class="str">"deploy_failed"</span>, entity=<span class="str">"alice-app-1"</span>)
<span class="fn">print</span>(<span class="str">"\\nfailures:"</span>, <span class="fn">len</span>(fails))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>EpisodicMemory</code> stores events as <code>{ts, type, entity, payload}</code> dicts — the canonical shape an event-log table uses in Postgres or Kafka. 2) <code>write(ev_type, entity, payload)</code> stamps the current time and appends; payload is free-form so any structured fact about an entity fits. 3) <code>query(*, type=None, entity=None, since=None, limit=10)</code> chains three optional filters — type, entity, time — and returns the most recent <code>limit</code> matching events; the keyword-only signature prevents positional-arg bugs. 4) <code>render_for_prompt(events)</code> formats the results as compact bullets the LLM can read directly; the two demo queries show "everything alice did" (entity filter) and "every deploy failure for alice-app-1" (type + entity filter) — exactly the calls an agent's <code>query_events</code> tool would issue.</p>

<p class="l-text">In production, this lives in Postgres or a time-series DB; the agent has a tool <code>query_events(entity, type, since)</code> that returns matching records. The retrieval is <em>filtered</em>, not <em>semantic</em> — which is exactly right when the agent already knows what it is looking for ("recent deploys for X").</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The 1M-Context Era — Sonnet 4.6</h2>
<p class="l-text">Claude Sonnet 4.6 in 1M-context mode (released 2026) holds roughly 750,000 words of input. That is a 100x increase over the 8K era when LangChain's memory abstractions were designed. The cost calculus has shifted: <strong>fitting the entire history in raw form is now feasible for many sessions</strong>. But three caveats keep the four archetypes alive:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">1M input tokens at premium pricing per call adds up. Prompt caching makes repeated reads of the same prefix cheap, but writes still pay full freight.</div></div>
<div class="calc-card"><div class="card-title">Latency</div><div class="card-body">Time-to-first-token scales with input. A 1M-token prompt is noticeably slower than 32K. For interactive UIs, you want a tight working set.</div></div>
<div class="calc-card"><div class="card-title">Position bias</div><div class="card-body">Even at 1M, attention is not uniform. Facts in the middle are recalled less reliably than facts near the start or end. Salient facts should be re-stated near the query.</div></div>
</div>

<div class="calc-highlight">The 1M-era playbook: <strong>raw history up to ~32K tokens, then start summarizing</strong>; <strong>vector + episodic memory always on</strong> for the long tail; <strong>retrieve top-k facts and re-inject near the user's question</strong> to beat position bias; <strong>aggressive prompt caching</strong> for the static system prompt and tool schemas.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production memory wiring for Claude Sonnet 4.6 (1M context)</span>
<span class="kw">import</span> anthropic
client = anthropic.<span class="fn">Anthropic</span>()

SYSTEM = <span class="str">"""You are an engineering assistant. Be concise."""</span>
TOOLS  = [...]   <span class="cm"># static tool schemas — cached</span>

<span class="kw">def</span> <span class="fn">chat</span>(user_msg, scratchpad, vector_mem, episodic_mem, summary_mem, user_id):
    facts = vector_mem.<span class="fn">search</span>(user_msg, user_id=user_id, limit=<span class="num">5</span>)
    events = episodic_mem.<span class="fn">query</span>(entity=user_id, limit=<span class="num">5</span>)

    <span class="cm"># Build messages: cached prefix + dynamic recall + recent + user</span>
    messages = [
        {<span class="str">"role"</span>:<span class="str">"system"</span>,<span class="str">"content"</span>:[
            {<span class="str">"type"</span>:<span class="str">"text"</span>,<span class="str">"text"</span>:SYSTEM,
             <span class="str">"cache_control"</span>:{<span class="str">"type"</span>:<span class="str">"ephemeral"</span>}},          <span class="cm"># cache 1</span>
            {<span class="str">"type"</span>:<span class="str">"text"</span>,<span class="str">"text"</span>:summary_mem.summary <span class="kw">or</span> <span class="str">""</span>,
             <span class="str">"cache_control"</span>:{<span class="str">"type"</span>:<span class="str">"ephemeral"</span>}},          <span class="cm"># cache 2</span>
        ]},
        *summary_mem.recent,                                <span class="cm"># uncached recent turns</span>
        {<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:
            f<span class="str">"Relevant memories:\\n{facts}\\n\\nRecent events:\\n{events}\\n\\n{user_msg}"</span>}
    ]
    <span class="kw">return</span> client.messages.<span class="fn">create</span>(
        model=<span class="str">"claude-sonnet-4-6"</span>,
        max_tokens=<span class="num">2048</span>,
        tools=TOOLS,
        extra_headers={<span class="str">"anthropic-beta"</span>:<span class="str">"context-1m-2025-08-07"</span>},
        messages=messages,
    )
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Reads from all four memory subsystems in parallel: <code>vector_mem.search(...)</code> returns the top-5 semantic facts and <code>episodic_mem.query(...)</code> returns the latest 5 structured events for this user. 2) Constructs a layered <code>system</code> message — first the static <code>SYSTEM</code> prompt, then the rolling <code>summary</code> — both tagged with <code>cache_control: ephemeral</code> so Anthropic prompt caching reuses the embedding cost across turns. 3) Appends the uncached <code>summary_mem.recent</code> turns verbatim, then a final <code>user</code> message that re-injects the recalled facts and events <em>next to</em> the question — defeats the middle-of-context recall sag in long-context models. 4) Calls <code>messages.create</code> with <code>anthropic-beta: context-1m-2025-08-07</code> to unlock the 1M-token window, plus the static <code>TOOLS</code> list which is also prefix-cached.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A working "context builder" that combines all four memory types into a single LLM-ready message list — the heart of every production agent.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">import</span> numpy <span class="kw">as</span> np, time, json

<span class="cm"># Reuse simple versions of the four memories</span>
SCRATCH = []                            <span class="cm"># current turn</span>
VEC_DOCS, VEC_USERS = [], []
EP = []                                 <span class="cm"># episodes</span>
SUMMARY = <span class="str">""</span>

vec = <span class="fn">TfidfVectorizer</span>()

<span class="kw">def</span> <span class="fn">remember_fact</span>(text, user):
    VEC_DOCS.<span class="fn">append</span>(text); VEC_USERS.<span class="fn">append</span>(user)

<span class="kw">def</span> <span class="fn">log_event</span>(type_, entity, payload):
    EP.<span class="fn">append</span>({<span class="str">"ts"</span>:time.<span class="fn">time</span>(),<span class="str">"type"</span>:type_,<span class="str">"entity"</span>:entity,<span class="str">"payload"</span>:payload})

<span class="kw">def</span> <span class="fn">recall_facts</span>(query, user, k=<span class="num">3</span>):
    <span class="kw">if</span> <span class="kw">not</span> VEC_DOCS: <span class="kw">return</span> []
    M = vec.<span class="fn">fit_transform</span>(VEC_DOCS)
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, M)[<span class="num">0</span>]
    sims = np.<span class="fn">where</span>(np.<span class="fn">array</span>(VEC_USERS) == user, sims, -<span class="num">1</span>)
    idx = sims.<span class="fn">argsort</span>()[::-<span class="num">1</span>][:k]
    <span class="kw">return</span> [VEC_DOCS[i] <span class="kw">for</span> i <span class="kw">in</span> idx <span class="kw">if</span> sims[i] &gt; <span class="num">0</span>]

<span class="kw">def</span> <span class="fn">recall_events</span>(entity, k=<span class="num">3</span>):
    <span class="kw">return</span> [e <span class="kw">for</span> e <span class="kw">in</span> EP <span class="kw">if</span> e[<span class="str">"entity"</span>]==entity][-k:]

<span class="kw">def</span> <span class="fn">build_context</span>(user_msg, user, summary, recent_msgs):
    facts  = <span class="fn">recall_facts</span>(user_msg, user)
    events = <span class="fn">recall_events</span>(user)
    blocks = [<span class="str">"[SYSTEM] You are an engineering assistant."</span>,
              f<span class="str">"[SUMMARY] {summary}"</span> <span class="kw">if</span> summary <span class="kw">else</span> <span class="kw">None</span>,
              <span class="str">"[RECENT]\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"- {m}"</span> <span class="kw">for</span> m <span class="kw">in</span> recent_msgs),
              <span class="str">"[FACTS]\\n"</span>  + <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"- {f}"</span> <span class="kw">for</span> f <span class="kw">in</span> facts) <span class="kw">if</span> facts <span class="kw">else</span> <span class="kw">None</span>,
              <span class="str">"[EVENTS]\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"- {json.dumps(e,default=str)}"</span> <span class="kw">for</span> e <span class="kw">in</span> events) <span class="kw">if</span> events <span class="kw">else</span> <span class="kw">None</span>,
              f<span class="str">"[USER] {user_msg}"</span>]
    <span class="kw">return</span> <span class="str">"\\n\\n"</span>.<span class="fn">join</span>(b <span class="kw">for</span> b <span class="kw">in</span> blocks <span class="kw">if</span> b)

<span class="cm"># seed memories</span>
<span class="fn">remember_fact</span>(<span class="str">"Alice is allergic to peanuts."</span>, <span class="str">"alice"</span>)
<span class="fn">remember_fact</span>(<span class="str">"Alice prefers vegetarian Thai."</span>, <span class="str">"alice"</span>)
<span class="fn">log_event</span>(<span class="str">"plan_upgrade"</span>, <span class="str">"alice"</span>, {<span class="str">"from"</span>:<span class="str">"free"</span>,<span class="str">"to"</span>:<span class="str">"pro"</span>})

prompt = <span class="fn">build_context</span>(<span class="str">"plan a dinner with alice tonight"</span>, <span class="str">"alice"</span>,
                       SUMMARY, [<span class="str">"Alice asked about restaurants nearby."</span>])
<span class="fn">print</span>(prompt)
<span class="fn">print</span>(<span class="str">"\\n\\n--- prompt size approx tokens:"</span>, <span class="fn">len</span>(prompt)//<span class="num">4</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Stands up minimal versions of all four memory types side-by-side: global lists for scratchpad / vector docs / episodic events plus a <code>SUMMARY</code> string — the same logical layout as the Anthropic SDK example above, just simplified for Pyodide. 2) <code>recall_facts</code> rebuilds the TF-IDF matrix and runs per-user filtered cosine top-k (mirroring the section-3 <code>VectorMemory</code>); <code>recall_events</code> filters the episodic list by entity. 3) <code>build_context(user_msg, user, summary, recent_msgs)</code> stitches every layer into one prompt with explicit <code>[SYSTEM]</code> / <code>[SUMMARY]</code> / <code>[RECENT]</code> / <code>[FACTS]</code> / <code>[EVENTS]</code> / <code>[USER]</code> blocks and drops any block that is empty. 4) Seeding two facts and one event then asking "plan a dinner with alice tonight" produces a complete prompt — printing it plus the token estimate is the exact thing you would hand to <code>messages.create</code> in production.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Read/Write Policies in Production</h2>
<p class="l-text">Every memory system has two policies. <strong>Write policy</strong>: when does a turn become a memory? <strong>Read policy</strong>: when do we recall, and how many entries do we inject?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naive write</div><div class="card-body">Every user turn → vector store. Cheap, but pollutes recall with greetings and small talk.</div></div>
<div class="calc-card"><div class="card-title">Smart write</div><div class="card-body">A small classifier ("is this a fact, preference, or named entity?") gates writes. <code>mem0</code> uses an LLM call; you can use a fast classifier if cost matters.</div></div>
<div class="calc-card"><div class="card-title">Always-on read</div><div class="card-body">Every turn pulls top-k. Simple, predictable. Best for chat assistants.</div></div>
<div class="calc-card"><div class="card-title">Tool-triggered read</div><div class="card-body">The model has a <code>recall(query)</code> tool. Reads only when it asks. Saves tokens, requires the model to know it should ask.</div></div>
</div>

<div class="calc-highlight">A solid default: <strong>smart write + always-on read with k=3-5</strong>, plus an explicit <code>recall</code> tool the model can use to dig deeper. Multi-tenant apps must scope all reads/writes by <code>user_id</code> (or <code>workspace_id</code>) — the most common production memory bug is leaking one user's memories to another.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Privacy, PII, &amp; the Right to Forget</h2>
<p class="l-text">Memory systems are GDPR/CCPA-relevant data stores. Three concrete requirements:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PII redaction on write</div><div class="card-body">Strip credit-card numbers, SSNs, government IDs before embedding. Use a regex or a dedicated NER model. Never store raw tokens.</div></div>
<div class="calc-card"><div class="card-title">Per-user namespacing</div><div class="card-body">Vector and episodic stores keyed by <code>user_id</code>. Filters at query time, enforced at the DB layer (row-level security in Postgres).</div></div>
<div class="calc-card"><div class="card-title">Forget API</div><div class="card-body"><code>DELETE /memories?user_id=X</code> must hard-delete embeddings, summaries, and event logs. Soft-delete is not enough for "right to be forgotten" requests.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># PII redaction before write</span>
<span class="kw">import</span> re

PATTERNS = {
    <span class="str">"EMAIL"</span>:  re.<span class="fn">compile</span>(r<span class="str">"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}"</span>),
    <span class="str">"PHONE"</span>:  re.<span class="fn">compile</span>(r<span class="str">"\\+?\\d[\\d\\s\\-()]{8,}\\d"</span>),
    <span class="str">"CARD"</span>:   re.<span class="fn">compile</span>(r<span class="str">"\\b(?:\\d[ -]*?){13,19}\\b"</span>),
    <span class="str">"SSN"</span>:    re.<span class="fn">compile</span>(r<span class="str">"\\b\\d{3}-\\d{2}-\\d{4}\\b"</span>),
}

<span class="kw">def</span> <span class="fn">redact</span>(text):
    <span class="kw">for</span> tag, pat <span class="kw">in</span> PATTERNS.<span class="fn">items</span>():
        text = pat.<span class="fn">sub</span>(f<span class="str">"[{tag}]"</span>, text)
    <span class="kw">return</span> text

samples = [
    <span class="str">"Email me at alice@example.com or call +1 415-555-0199."</span>,
    <span class="str">"My card is 4111 1111 1111 1111, ssn 123-45-6789."</span>,
    <span class="str">"Just a normal sentence about lunch."</span>,
]
<span class="kw">for</span> s <span class="kw">in</span> samples: <span class="fn">print</span>(<span class="fn">redact</span>(s))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>PATTERNS</code> is a dict mapping a PII tag (<code>EMAIL</code>, <code>PHONE</code>, <code>CARD</code>, <code>SSN</code>) to a compiled regex covering the canonical formats — built once and reused for every redaction call. 2) <code>redact(text)</code> walks the dict and runs <code>pat.sub(f"[{tag}]", text)</code> for each pattern, so every match is replaced with a stable placeholder like <code>[EMAIL]</code> that the embedding model can safely consume. 3) Replacement happens before the text reaches the vector store — the original PII never gets embedded, never gets indexed and therefore cannot leak back through similarity search. 4) The three demo lines exercise each pattern type so you can verify the substitutions; in production you would also add NER for names and locations and run the redactor on tool inputs and outputs, not just on memorised text.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. The Production Memory Stack</h2>
<p class="l-text">Putting it all together — a reference architecture that powers a real customer-facing agent (think: a shopping assistant, an engineering copilot, a study tutor):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hot path (per turn)</div><div class="card-body">Scratchpad: in-process list. Recent N raw messages: kept verbatim. Summary: last compressed block. Total ~8-32K tokens.</div></div>
<div class="calc-card"><div class="card-title">Warm path (semantic)</div><div class="card-body">Vector store: pgvector or Pinecone. Embeddings of memorable facts. Top-k=3-5 per turn, re-injected near user message.</div></div>
<div class="calc-card"><div class="card-title">Cold path (filtered)</div><div class="card-body">Episodic events: Postgres table. Queried by tool call when the model asks for history of a specific entity.</div></div>
<div class="calc-card"><div class="card-title">Compression</div><div class="card-body">Background job: when raw history &gt; budget, summarize the older half. Recursive when even the summary grows.</div></div>
<div class="calc-card"><div class="card-title">Caching</div><div class="card-body">Anthropic prompt caching on the static system prompt + tool schemas + (when long) the rolling summary block.</div></div>
<div class="calc-card"><div class="card-title">Privacy</div><div class="card-body">PII redaction at write. Per-user row-level security. Forget API. Audit log of all reads/writes.</div></div>
</div>

<div class="calc-highlight">In the next lesson we shift from <em>what the agent remembers</em> to <em>what the agent decides to do</em>: <strong>planning &amp; task decomposition</strong> — Plan-and-Execute, Tree of Thoughts, ReWOO, hierarchical agents, and self-reflection. Memory is the substrate; planning is the engine that pushes work through it.</div>
</div>`,
tr: `<p class="l-text"><strong>Hafıza, bir chatbot'u kullanıcıyla birlikte büyüyen bir agent'a dönüştüren şeydir.</strong> Hafıza olmadan her tur, yabancının yabancıyla buluşmasıdır. Hafızayla agent, kullanıcının haftalar boyunca tercihlerini hatırlar, üç ay önce belirtilen bir gerçeği anımsar ve aynı açıklayıcı soruyu sormayı bırakır. Zor kısım "mesajları sakla" değildir — her geri çağırma kalıbı için doğru hafıza şeklini seçmek ve sonra context penceresini kendi geçmişi altında boğulmaktan korumaktır.</p>

<p class="l-text">Dört hafıza arketipi production ihtiyaçlarının %95'ini kaplar: <strong>scratchpad</strong> (mevcut turun muhakemesi), <strong>vektör deposu</strong> (uzun bir geçmiş üzerinde semantik geri çağırma), <strong>özet</strong> (eski turların serbest metne sıkıştırılması) ve <strong>episodik</strong> (filtreleyebileceğin ve yeniden çalıştırabileceğin yapılandırılmış olay logu). Bunların üstüne, yeni nesil 1M-token modelleri (1M-context modunda Claude Sonnet 4.6) maliyet hesabını değiştiriyor: 8K pencereler için icat edilen pek çok hafıza hilesine artık ihtiyaç kalmadı — ama kalanları maliyet, gecikme ve geri çağırma doğruluğu için her zamankinden daha önemli.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dört arketip: scratchpad, vektör, özet, episodik — ve her birinin ne zaman kazandığı</li>
<li>30 satırda TF-IDF + kosinüs vektör hafızası (kaputun altında <code>mem0</code> / Zep / LangMem)</li>
<li>Özet sıkıştırma sezgileri: token-bütçesi tetikleyicileri, özyinelemeli özetleme</li>
<li>Episodik olay logları: tip/zaman/varlık ile filtrelenebilir, geri çağırmada yeniden enjeksiyon</li>
<li>1M-context stratejileri (Sonnet 4.6): prompt caching, pozisyon yanlılığı, 1M'i ne zaman KULLANMAMAK gerekir</li>
<li>Production'da hafıza: yazma/okuma yolları, eviction, çok-kiracı izolasyonu, gizlilik</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Dört Arketip</h2>
<p class="l-text">Hafıza dışarıdan tek bir şey gibi görünür ("agent beni hatırlıyor") ama dört çok farklı mekanizmaya bölünür. Üç eksen boyunca ayrılırlar: <em>kapsam</em> (tur / oturum / yaşam boyu), <em>yapı</em> (serbest metin / vektörler / yapılandırılmış kayıtlar) ve <em>geri çağırma</em> (her zaman açık / semantik / filtrelenmiş).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scratchpad</div><div class="card-body">Tek bir turun içinde yaşar. Ara düşünceleri ve araç gözlemlerini tutar. Çağrının sonunda silinir. Her ReAct agent'ı bunu içerir.</div></div>
<div class="calc-card"><div class="card-title">Vektör deposu</div><div class="card-body">Yaşam boyu. Geçmiş mesajların veya gerçeklerin embedding'lerini saklar. Mevcut sorguyla semantik benzerliğe göre alınır. "Kullanıcı X aylar önce ne demişti" için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Özet</div><div class="card-body">Oturum veya yaşam boyu. Eski turların kayan bir serbest metin özeti, ham geçmiş bütçeyi aştığında yeniden üretilir. Kayıplı ama ucuz.</div></div>
<div class="calc-card"><div class="card-title">Episodik</div><div class="card-body">Yaşam boyu. Ayrık olayların yapılandırılmış kayıtları ("kullanıcı planı yükseltti", "oturum 4. adımda çöktü"). Tip, zaman, varlık ile filtrelenebilir. Agent'ın denetim kayıtları.</div></div>
</div>

<div class="calc-highlight">Production agent'lar dördünü de birleştirir. Tipik bir Claude-Code şekilli agent: mevcut görev için scratchpad, geçmiş çalıştırmaların episodik logu, çözülen issue'ların vektör deposu ve context dar olduğunda uzun konuşmanın kayan özeti. Sanat, okuma/yazma politikasıdır — ne zaman yazılır, ne zaman okunur, ne zaman sıkıştırılır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Scratchpad — Kolay Olanı</h2>
<p class="l-text">Scratchpad, agent döngüsündeki mesaj listesinden başka bir şey değildir. Her <code>Thought:</code>/<code>Action:</code>/<code>Observation:</code> üçlüsü onu büyütür. Tek tasarım kararları: (a) tüm izi tut veya bayatlamış gözlemleri ayıkla ve (b) düşünceleri doğal serbest metin olarak mı yapılandırılmış JSON olarak mı biçimlendir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Scratchpad with stale-observation trimming</span>
<span class="kw">def</span> <span class="fn">trim_scratchpad</span>(steps, keep_last_n_observations=<span class="num">3</span>):
    <span class="str">"""Keep all thoughts/actions; drop observations older than the last N tool calls."""</span>
    out, kept_obs = [], <span class="num">0</span>
    <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">reversed</span>(steps):
        <span class="kw">if</span> s[<span class="str">"kind"</span>] == <span class="str">"observation"</span>:
            <span class="kw">if</span> kept_obs &lt; keep_last_n_observations:
                out.<span class="fn">append</span>(s); kept_obs += <span class="num">1</span>
            <span class="kw">else</span>:
                out.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"observation"</span>,<span class="str">"content"</span>:<span class="str">"&lt;trimmed&gt;"</span>})
        <span class="kw">else</span>:
            out.<span class="fn">append</span>(s)
    <span class="kw">return</span> <span class="fn">list</span>(<span class="fn">reversed</span>(out))

steps = []
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">6</span>):
    steps.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"thought"</span>,<span class="str">"content"</span>:f<span class="str">"step {i} thinking..."</span>})
    steps.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"action"</span>,<span class="str">"content"</span>:f<span class="str">"call_tool_{i}"</span>})
    steps.<span class="fn">append</span>({<span class="str">"kind"</span>:<span class="str">"observation"</span>,<span class="str">"content"</span>:f<span class="str">"result {i}: "</span> + <span class="str">"x"</span>*<span class="num">40</span>})

trimmed = <span class="fn">trim_scratchpad</span>(steps, keep_last_n_observations=<span class="num">2</span>)
<span class="kw">for</span> s <span class="kw">in</span> trimmed[-<span class="num">9</span>:]:
    <span class="fn">print</span>(s[<span class="str">"kind"</span>][:<span class="num">5</span>], <span class="str">"::"</span>, s[<span class="str">"content"</span>][:<span class="num">55</span>])
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>trim_scratchpad(steps, keep_last_n_observations)</code> scratchpad'i geriye doğru yürür (<code>reversed(steps)</code>); böylece en yeni öğeler önce karar alınır. 2) Her <code>observation</code> girdisi için <code>kept_obs &lt; keep_last_n_observations</code> olduğu sürece gerçek içeriği korur, aksi halde küçük bir <code>&lt;trimmed&gt;</code> placeholder'la değiştirir — düşünceler ve eylemler her zaman korunur. 3) Reversed-then-reversed deseni çıktıda orijinal adım sırasını korurken O(n) trim sağlar. 4) Sürücü 18 sahte adım kurar ve yalnızca son 2 gözlemi tutacak şekilde kırpar; yazdırılan kuyrukta hayatta kalan düşünce/eylemlerin arasında birkaç <code>obser :: &lt;trimmed&gt;</code> girdisi görünür — bir sonraki LLM çağrısına geri besleyeceğiniz tam context şekli.</p>

<p class="l-text">İnce ama önemli bir nokta: gözlemleri ayıklamak, düşünceleri ayıklamaktan daha az muhakeme kalitesine mal olur. Modelin kendi düşünceleri nereye gittiğini kodlar; gözlemler genellikle yeniden türetilebilir. Şüphe varsa önce gözlemleri ayıkla.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Vektör Hafızası — Semantik Geri Çağırma</h2>
<p class="l-text">Vektör hafızası geçmiş içeriği embedding olarak saklar; sorgu zamanında mevcut girdi embed edilir ve en benzer top-k geçmiş giriş context'e geri çekilir. <code>mem0</code>, Zep ve LangMem'in yaptığı tam olarak budur — daha güzel API'lerle sarılmış ama matematiksel olarak aynı: bir korpus üzerinde kosinüs benzerliği.</p>

<div class="katex-block">$$\\text{sim}(q, m_i) = \\frac{q \\cdot m_i}{\\lVert q \\rVert \\, \\lVert m_i \\rVert}, \\qquad \\text{retrieved} = \\text{top-}k\\bigl\\{\\text{sim}(q, m_i)\\bigr\\}_{i=1}^{N}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yazma yolu</div><div class="card-body">Neyi hatırlayacağına karar ver. Naif: her kullanıcı turu. Akıllı: yalnızca "hatırlanmaya değer" turlar (LLM-sınıflandırılmış gerçekler, tercihler, isimli varlıklar).</div></div>
<div class="calc-card"><div class="card-title">Okuma yolu</div><div class="card-body">Mevcut sorguyu embed et. Kosinüsle top-k al. İsteğe bağlı bir cross-encoder ile yeniden sırala. Sistem prompt'una "İlgili anılar: ..." olarak enjekte et.</div></div>
<div class="calc-card"><div class="card-title">Eviction</div><div class="card-body">Zaman çürümesi (eski = az ağırlık), referans-sayısı (nadiren çağrılan = bayat) veya LLM-yargılı ("hâlâ doğru mu?").</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># mem0-style vector memory with OpenAI embeddings</span>
<span class="kw">from</span> mem0 <span class="kw">import</span> Memory

m = <span class="fn">Memory</span>()
m.<span class="fn">add</span>(<span class="str">"User prefers vegetarian Thai food."</span>, user_id=<span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User is allergic to peanuts."</span>,       user_id=<span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User travels to Tokyo in May."</span>,      user_id=<span class="str">"alice"</span>)

related = m.<span class="fn">search</span>(<span class="str">"planning dinner for alice"</span>, user_id=<span class="str">"alice"</span>, limit=<span class="num">2</span>)
<span class="fn">print</span>(related)
<span class="cm"># -&gt; [{"memory":"vegetarian Thai", "score":0.84}, {"memory":"allergic to peanuts", "score":0.81}]</span>
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Bir <code>mem0.Memory()</code> istemcisi örnekler — kaputun altında mem0 bir embedding sağlayıcısı (varsayılan OpenAI), bir vektör deposu (Chroma/Qdrant) ve yazma kararları için LLM-as-judge seçer. 2) <code>m.add(text, user_id="alice")</code> metni embed eder ve vektörü kullanıcı-başına namespace'e yazar; mem0 mevcut anılara karşı dedup yapar, aynı gerçeği iki kez söylemek çift-saklamaya yol açmaz. 3) <code>m.search("planning dinner for alice", user_id="alice", limit=2)</code> sorguyu embed eder, yalnızca alice'in namespace'ine karşı kosinüs top-k çalıştırır ve sıralı <code>{memory, score}</code> sözlükleri döndürür. 4) Yazdırılan sonuç sistem prompt'una "Relevant memories:" olarak enjekte edeceğiniz şeydir — anahtar-kelime örtüşmesi olmadan keyfi geçmiş gerçekler üzerinde semantik geri çağırma ("dinner" hem "vegetarian Thai"i hem de fıstık alerjisini getirdi).</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TF-IDF embedding'ler + kosinüs benzerliği kullanan 30-satırlık vektör hafızası. mem0/LangMem ile aynı mimari; tamamen tarayıcıda çalışır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> VectorMemory:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.docs, <span class="kw">self</span>.users = [], []
        <span class="kw">self</span>.vec = <span class="fn">TfidfVectorizer</span>()
        <span class="kw">self</span>._mat = <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">add</span>(<span class="kw">self</span>, text, user_id):
        <span class="kw">self</span>.docs.<span class="fn">append</span>(text); <span class="kw">self</span>.users.<span class="fn">append</span>(user_id)
        <span class="kw">self</span>._mat = <span class="kw">self</span>.vec.<span class="fn">fit_transform</span>(<span class="kw">self</span>.docs)
    <span class="kw">def</span> <span class="fn">search</span>(<span class="kw">self</span>, query, user_id, k=<span class="num">2</span>):
        <span class="kw">if</span> <span class="kw">not</span> <span class="kw">self</span>.docs: <span class="kw">return</span> []
        q = <span class="kw">self</span>.vec.<span class="fn">transform</span>([query])
        sims = <span class="fn">cosine_similarity</span>(q, <span class="kw">self</span>._mat)[<span class="num">0</span>]
        <span class="cm"># filter by user</span>
        mask = np.<span class="fn">array</span>([u == user_id <span class="kw">for</span> u <span class="kw">in</span> <span class="kw">self</span>.users])
        sims = np.<span class="fn">where</span>(mask, sims, -<span class="num">1</span>)
        idx = sims.<span class="fn">argsort</span>()[::-<span class="num">1</span>][:k]
        <span class="kw">return</span> [{<span class="str">"memory"</span>: <span class="kw">self</span>.docs[i], <span class="str">"score"</span>: <span class="fn">round</span>(<span class="fn">float</span>(sims[i]),<span class="num">3</span>)}
                <span class="kw">for</span> i <span class="kw">in</span> idx <span class="kw">if</span> sims[i] &gt; <span class="num">0</span>]

m = <span class="fn">VectorMemory</span>()
m.<span class="fn">add</span>(<span class="str">"User prefers vegetarian Thai food."</span>, <span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User is allergic to peanuts."</span>,       <span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User travels to Tokyo in May."</span>,      <span class="str">"alice"</span>)
m.<span class="fn">add</span>(<span class="str">"User likes spicy ramen."</span>,            <span class="str">"bob"</span>)

<span class="fn">print</span>(<span class="str">"alice dinner :"</span>, m.<span class="fn">search</span>(<span class="str">"planning a dinner with alice"</span>, <span class="str">"alice"</span>, k=<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"alice trip   :"</span>, m.<span class="fn">search</span>(<span class="str">"flight to japan"</span>, <span class="str">"alice"</span>, k=<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"bob isolation:"</span>, m.<span class="fn">search</span>(<span class="str">"food for alice"</span>, <span class="str">"bob"</span>, k=<span class="num">2</span>))   <span class="cm"># bob sees only his own</span>
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>VectorMemory</code> paralel <code>docs</code> ve <code>users</code> listelerini artı tek paylaşılan bir <code>TfidfVectorizer</code>'ı tutar — gerçek başına bir sütun ve sahip başına bir sütunlu pgvector veya Chroma tablosuyla aynı şekil. 2) <code>add(text, user_id)</code> yeni metni ekler ve vectorizer'ı tüm corpus üzerinde yeniden fit eder (demo boyutunda ucuz; production'da artımlı index tutarsınız). 3) <code>search(query, user_id, k=2)</code> sorguyu embed eder, matris üzerinde <code>cosine_similarity</code> çalıştırır, sonra <code>np.where(mask, sims, -1)</code> ile diğer kullanıcıların skorlarını sıfırlar — bu, tek satırda kullanıcı-başına namespace izolasyonudur. 4) Üç demo sorgusu sözleşmeyi kanıtlar: alice'in dinner sorgusu Thai + fıstık gerçeklerini getirir; trip sorgusu Tokyo gerçeğini yüzeye çıkarır; bob-kapsamlı "food for alice" sorgusu hiçbir şey döndürmez çünkü cross-user geri çağırma maskede bloklanır.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Özet Hafızası — Sıkıştırma</h2>
<p class="l-text">Ham konuşma bütçeyi aştığında, eski yarısını serbest metne özetle ve değiştir. İki tat: <strong>kayan-pencere</strong> özeti (her zaman N'den eski mesajları özetle) ve <strong>özyinelemeli</strong> özet (özet de bütçeyi aştığında özeti özetle).</p>

<div class="katex-block">$$\\text{tokens}(c_{t+1}) = \\text{tokens}(\\text{summary}(c_t^{old})) + \\text{tokens}(c_t^{recent}) + \\text{tokens}(\\text{new turn})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Token-budget triggered summary memory</span>
<span class="kw">def</span> <span class="fn">approx_tokens</span>(text): <span class="kw">return</span> <span class="fn">max</span>(<span class="num">1</span>, <span class="fn">len</span>(text) // <span class="num">4</span>)

<span class="kw">def</span> <span class="fn">fake_llm_summarize</span>(messages):
    <span class="str">"""Real impl: call Claude with 'Summarize the conversation so far.'"""</span>
    bullets = []
    <span class="kw">for</span> m <span class="kw">in</span> messages:
        role = m[<span class="str">"role"</span>][<span class="num">0</span>].<span class="fn">upper</span>()
        bullets.<span class="fn">append</span>(f<span class="str">"{role}: {m['content'][:60]}"</span>)
    <span class="kw">return</span> <span class="str">"Summary so far:\\n- "</span> + <span class="str">"\\n- "</span>.<span class="fn">join</span>(bullets[-<span class="num">6</span>:])

<span class="kw">class</span> SummaryMemory:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, max_tokens=<span class="num">300</span>, keep_recent=<span class="num">4</span>):
        <span class="kw">self</span>.summary = <span class="str">""</span>
        <span class="kw">self</span>.recent = []         <span class="cm"># untouched recent messages</span>
        <span class="kw">self</span>.max_tokens = max_tokens
        <span class="kw">self</span>.keep_recent = keep_recent
    <span class="kw">def</span> <span class="fn">add</span>(<span class="kw">self</span>, role, content):
        <span class="kw">self</span>.recent.<span class="fn">append</span>({<span class="str">"role"</span>: role, <span class="str">"content"</span>: content})
        <span class="kw">if</span> <span class="kw">self</span>.<span class="fn">_tokens</span>() &gt; <span class="kw">self</span>.max_tokens:
            <span class="kw">self</span>.<span class="fn">_compress</span>()
    <span class="kw">def</span> <span class="fn">_tokens</span>(<span class="kw">self</span>):
        <span class="kw">return</span> <span class="fn">approx_tokens</span>(<span class="kw">self</span>.summary) + <span class="fn">sum</span>(<span class="fn">approx_tokens</span>(m[<span class="str">"content"</span>]) <span class="kw">for</span> m <span class="kw">in</span> <span class="kw">self</span>.recent)
    <span class="kw">def</span> <span class="fn">_compress</span>(<span class="kw">self</span>):
        <span class="cm"># everything except the last keep_recent gets summarized</span>
        old = <span class="kw">self</span>.recent[:-<span class="kw">self</span>.keep_recent]
        <span class="kw">self</span>.recent = <span class="kw">self</span>.recent[-<span class="kw">self</span>.keep_recent:]
        <span class="kw">self</span>.summary = <span class="fn">fake_llm_summarize</span>(
            [{<span class="str">"role"</span>:<span class="str">"system"</span>,<span class="str">"content"</span>:<span class="kw">self</span>.summary}] + old) <span class="kw">if</span> <span class="kw">self</span>.summary <span class="kw">or</span> old <span class="kw">else</span> <span class="kw">self</span>.summary
    <span class="kw">def</span> <span class="fn">context</span>(<span class="kw">self</span>):
        out = []
        <span class="kw">if</span> <span class="kw">self</span>.summary: out.<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"system"</span>,<span class="str">"content"</span>:<span class="kw">self</span>.summary})
        out.<span class="fn">extend</span>(<span class="kw">self</span>.recent)
        <span class="kw">return</span> out

mem = <span class="fn">SummaryMemory</span>(max_tokens=<span class="num">120</span>, keep_recent=<span class="num">3</span>)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    mem.<span class="fn">add</span>(<span class="str">"user"</span>,      f<span class="str">"Turn {i} from user — discussing topic {i % 3}."</span>)
    mem.<span class="fn">add</span>(<span class="str">"assistant"</span>, f<span class="str">"Turn {i} reply with some details about topic {i % 3}, more text here."</span>)

ctx = mem.<span class="fn">context</span>()
<span class="fn">print</span>(<span class="str">"messages in context:"</span>, <span class="fn">len</span>(ctx))
<span class="fn">print</span>(<span class="str">"first item:"</span>, ctx[<span class="num">0</span>][<span class="str">"content"</span>][:<span class="num">120</span>], <span class="str">"..."</span>)
<span class="fn">print</span>(<span class="str">"last item :"</span>, ctx[-<span class="num">1</span>][<span class="str">"content"</span>][:<span class="num">80</span>])
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>SummaryMemory(max_tokens=300, keep_recent=4)</code> iki state parçasını izler: sıkıştırılmış geçmiş için tek bir <code>summary</code> string'i ve dokunulmamış en yeni mesajlar için bir <code>recent</code> listesi. 2) Her <code>add(role, content)</code> <code>recent</code>'e ekler, sonra <code>_tokens()</code>'i çağırır (hem <code>summary</code> hem de <code>recent</code> üzerinde 4-char-per-token yaklaşımı); toplam <code>max_tokens</code>'ı aşarsa <code>_compress</code> tetiklenir. 3) <code>_compress()</code> <code>keep_recent</code> kuyruğundan eski olan her şeyi soyar, mevcut özetle birlikte <code>fake_llm_summarize</code>'a verir ve <code>self.summary</code>'yi üzerine yazar — tek satırda özyinelemeli özetleme. 4) <code>context()</code> LLM'e hazır mesaj listesini döndürür: kayan özeti taşıyan tek bir <code>system</code> mesajı ve onu izleyen aynen recent turları — yazdırılan boyutlar, 16 mesajdan sonra bile bütçe kapağına uyulduğunu gösterir.</p>

<div class="calc-highlight">Özet hafızası sadakatini kaybeder. Onu birincil geri çağırma mekanizması olarak değil, context-taşması için bir <em>geri dönüş</em> olarak kullan. Belirli bir gerçeği hatırlaman gerekiyorsa ("kullanıcı vejetaryen"), onu vektör veya episodik hafızaya koy; özet'in onu tutmasına güvenme.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Episodik Hafıza — Olay Logu</h2>
<p class="l-text">Bir episode, yapılandırılmış bir kayıttır: <code>{type, ts, entity, payload}</code>. Episodik hafıza, herhangi bir alana göre <code>filter</code>'layabileceğin bunların bir listesidir. Agent'a uzun-süreli yaşamını veren şey budur: "kullanıcının planı her yükselttiğinde", "bu müşterinin deploy'ları her başarısız olduğunda", "fiyatlandırma hakkında her yaptığımız konuşma".</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Episodic memory with filterable retrieval</span>
<span class="kw">import</span> time, json

<span class="kw">class</span> EpisodicMemory:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>): <span class="kw">self</span>.events = []
    <span class="kw">def</span> <span class="fn">write</span>(<span class="kw">self</span>, ev_type, entity, payload):
        <span class="kw">self</span>.events.<span class="fn">append</span>({<span class="str">"ts"</span>: time.<span class="fn">time</span>(), <span class="str">"type"</span>: ev_type,
                            <span class="str">"entity"</span>: entity, <span class="str">"payload"</span>: payload})
    <span class="kw">def</span> <span class="fn">query</span>(<span class="kw">self</span>, *, <span class="fn">type</span>=<span class="kw">None</span>, entity=<span class="kw">None</span>, since=<span class="kw">None</span>, limit=<span class="num">10</span>):
        out = <span class="kw">self</span>.events
        <span class="kw">if</span> <span class="fn">type</span>:   out = [e <span class="kw">for</span> e <span class="kw">in</span> out <span class="kw">if</span> e[<span class="str">"type"</span>]   == <span class="fn">type</span>]
        <span class="kw">if</span> entity: out = [e <span class="kw">for</span> e <span class="kw">in</span> out <span class="kw">if</span> e[<span class="str">"entity"</span>] == entity]
        <span class="kw">if</span> since:  out = [e <span class="kw">for</span> e <span class="kw">in</span> out <span class="kw">if</span> e[<span class="str">"ts"</span>]    &gt;= since]
        <span class="kw">return</span> out[-limit:]
    <span class="kw">def</span> <span class="fn">render_for_prompt</span>(<span class="kw">self</span>, events):
        lines = []
        <span class="kw">for</span> e <span class="kw">in</span> events:
            lines.<span class="fn">append</span>(f<span class="str">"- [{e['type']}] {e['entity']}: "</span> +
                         json.<span class="fn">dumps</span>(e[<span class="str">'payload'</span>], separators=(<span class="str">','</span>,<span class="str">':'</span>)))
        <span class="kw">return</span> <span class="str">"Relevant past events:\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(lines) <span class="kw">if</span> lines <span class="kw">else</span> <span class="str">""</span>

em = <span class="fn">EpisodicMemory</span>()
em.<span class="fn">write</span>(<span class="str">"plan_upgrade"</span>, <span class="str">"alice"</span>, {<span class="str">"from"</span>:<span class="str">"free"</span>,<span class="str">"to"</span>:<span class="str">"pro"</span>})
em.<span class="fn">write</span>(<span class="str">"deploy_failed"</span>, <span class="str">"alice-app-1"</span>, {<span class="str">"step"</span>:<span class="num">4</span>,<span class="str">"err"</span>:<span class="str">"timeout"</span>})
em.<span class="fn">write</span>(<span class="str">"plan_upgrade"</span>, <span class="str">"bob"</span>,   {<span class="str">"from"</span>:<span class="str">"pro"</span>,<span class="str">"to"</span>:<span class="str">"team"</span>})
em.<span class="fn">write</span>(<span class="str">"deploy_failed"</span>, <span class="str">"alice-app-1"</span>, {<span class="str">"step"</span>:<span class="num">2</span>,<span class="str">"err"</span>:<span class="str">"oom"</span>})
em.<span class="fn">write</span>(<span class="str">"support_chat"</span>, <span class="str">"alice"</span>, {<span class="str">"topic"</span>:<span class="str">"refund"</span>})

<span class="cm"># what has alice done lately?</span>
alice_events = em.<span class="fn">query</span>(entity=<span class="str">"alice"</span>, limit=<span class="num">5</span>)
<span class="fn">print</span>(em.<span class="fn">render_for_prompt</span>(alice_events))

<span class="cm"># all deploy failures for alice's app</span>
fails = em.<span class="fn">query</span>(<span class="fn">type</span>=<span class="str">"deploy_failed"</span>, entity=<span class="str">"alice-app-1"</span>)
<span class="fn">print</span>(<span class="str">"\\nfailures:"</span>, <span class="fn">len</span>(fails))
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>EpisodicMemory</code> olayları <code>{ts, type, entity, payload}</code> sözlükleri olarak saklar — Postgres veya Kafka'daki bir olay-log tablosunun kullandığı kanonik şekil. 2) <code>write(ev_type, entity, payload)</code> mevcut zamanı damgalar ve ekler; payload serbest-biçimlidir, bir varlık hakkında her yapılandırılmış gerçek sığar. 3) <code>query(*, type=None, entity=None, since=None, limit=10)</code> üç opsiyonel filtreyi zincirler — tür, varlık, zaman — ve en yeni <code>limit</code> eşleşen olayı döndürür; keyword-only imza positional-arg bug'larını engeller. 4) <code>render_for_prompt(events)</code> sonuçları LLM'in doğrudan okuyabileceği kompakt bullet'lar olarak biçimler; iki demo sorgusu "alice'in yaptığı her şey"i (entity filtresi) ve "alice-app-1 için her deploy başarısızlığı"nı (type + entity filtresi) gösterir — bir agent'ın <code>query_events</code> tool'unun yapacağı çağrıların tam karşılığı.</p>

<p class="l-text">Production'da bu Postgres veya bir time-series DB'de yaşar; agent eşleşen kayıtları döndüren bir <code>query_events(entity, type, since)</code> aracına sahiptir. Geri çağırma <em>filtreli</em>dir, <em>semantik</em> değil — bu da agent zaten ne aradığını bildiğinde tam olarak doğrudur ("X için son deploy'lar").</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. 1M-Context Çağı — Sonnet 4.6</h2>
<p class="l-text">1M-context modunda Claude Sonnet 4.6 (2026'da yayınlandı) yaklaşık 750.000 sözcüklük girdi tutar. Bu, LangChain'in hafıza soyutlamalarının tasarlandığı 8K çağına göre 100x bir artıştır. Maliyet hesabı değişti: <strong>tüm geçmişi ham biçimde sığdırmak artık birçok oturum için uygulanabilir</strong>. Ama üç uyarı dört arketipi hayatta tutar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Çağrı başına premium fiyatlandırmalı 1M girdi token'ı toplanır. Prompt caching aynı önekin tekrar okumalarını ucuzlatır, ama yazmalar hâlâ tam ücret öder.</div></div>
<div class="calc-card"><div class="card-title">Gecikme</div><div class="card-body">İlk-token-süresi girdiyle ölçeklenir. 1M-token bir prompt 32K'dan belirgin biçimde yavaştır. Etkileşimli UI'lar için sıkı bir çalışma seti istersin.</div></div>
<div class="calc-card"><div class="card-title">Pozisyon yanlılığı</div><div class="card-body">1M'de bile attention düzgün dağılmaz. Ortadaki gerçekler, başa veya sona yakın gerçeklerden daha az güvenilir biçimde geri çağrılır. Belirgin gerçekler sorgunun yanında yeniden ifade edilmelidir.</div></div>
</div>

<div class="calc-highlight">1M-çağı oyun kitabı: <strong>~32K token'a kadar ham geçmiş, sonra özetlemeye başla</strong>; uzun kuyruk için <strong>vektör + episodik hafıza her zaman açık</strong>; pozisyon yanlılığını yenmek için <strong>top-k gerçekleri al ve kullanıcının sorusunun yanına yeniden enjekte et</strong>; statik sistem prompt'u ve araç şemaları için <strong>agresif prompt caching</strong>.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Production memory wiring for Claude Sonnet 4.6 (1M context)</span>
<span class="kw">import</span> anthropic
client = anthropic.<span class="fn">Anthropic</span>()

SYSTEM = <span class="str">"""You are an engineering assistant. Be concise."""</span>
TOOLS  = [...]   <span class="cm"># static tool schemas — cached</span>

<span class="kw">def</span> <span class="fn">chat</span>(user_msg, scratchpad, vector_mem, episodic_mem, summary_mem, user_id):
    facts = vector_mem.<span class="fn">search</span>(user_msg, user_id=user_id, limit=<span class="num">5</span>)
    events = episodic_mem.<span class="fn">query</span>(entity=user_id, limit=<span class="num">5</span>)

    <span class="cm"># Build messages: cached prefix + dynamic recall + recent + user</span>
    messages = [
        {<span class="str">"role"</span>:<span class="str">"system"</span>,<span class="str">"content"</span>:[
            {<span class="str">"type"</span>:<span class="str">"text"</span>,<span class="str">"text"</span>:SYSTEM,
             <span class="str">"cache_control"</span>:{<span class="str">"type"</span>:<span class="str">"ephemeral"</span>}},          <span class="cm"># cache 1</span>
            {<span class="str">"type"</span>:<span class="str">"text"</span>,<span class="str">"text"</span>:summary_mem.summary <span class="kw">or</span> <span class="str">""</span>,
             <span class="str">"cache_control"</span>:{<span class="str">"type"</span>:<span class="str">"ephemeral"</span>}},          <span class="cm"># cache 2</span>
        ]},
        *summary_mem.recent,                                <span class="cm"># uncached recent turns</span>
        {<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:
            f<span class="str">"Relevant memories:\\n{facts}\\n\\nRecent events:\\n{events}\\n\\n{user_msg}"</span>}
    ]
    <span class="kw">return</span> client.messages.<span class="fn">create</span>(
        model=<span class="str">"claude-sonnet-4-6"</span>,
        max_tokens=<span class="num">2048</span>,
        tools=TOOLS,
        extra_headers={<span class="str">"anthropic-beta"</span>:<span class="str">"context-1m-2025-08-07"</span>},
        messages=messages,
    )
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Dört hafıza alt-sisteminden paralel okur: <code>vector_mem.search(...)</code> ilk 5 semantik gerçeği döndürür ve <code>episodic_mem.query(...)</code> bu kullanıcı için en son 5 yapılandırılmış olayı döndürür. 2) Katmanlı bir <code>system</code> mesajı kurar — önce statik <code>SYSTEM</code> prompt'u, sonra kayan <code>summary</code> — ikisi de <code>cache_control: ephemeral</code> ile etiketlenir, böylece Anthropic prompt caching embedding maliyetini turlar arası yeniden kullanır. 3) Cache'lenmemiş <code>summary_mem.recent</code> turlarını aynen ekler, sonra son bir <code>user</code> mesajı geri çağrılan gerçekleri ve olayları sorunun <em>yanına</em> yeniden enjekte eder — uzun-context modellerindeki orta-context recall sapmasını yener. 4) <code>anthropic-beta: context-1m-2025-08-07</code> ile <code>messages.create</code> çağrısı 1M-token penceresini açar; statik <code>TOOLS</code> listesi de prefix-cache'lenir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Dört hafıza türünü tek bir LLM'e hazır mesaj listesinde birleştiren çalışan bir "context inşacısı" — her production agent'ının kalbi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">import</span> numpy <span class="kw">as</span> np, time, json

<span class="cm"># Reuse simple versions of the four memories</span>
SCRATCH = []                            <span class="cm"># current turn</span>
VEC_DOCS, VEC_USERS = [], []
EP = []                                 <span class="cm"># episodes</span>
SUMMARY = <span class="str">""</span>

vec = <span class="fn">TfidfVectorizer</span>()

<span class="kw">def</span> <span class="fn">remember_fact</span>(text, user):
    VEC_DOCS.<span class="fn">append</span>(text); VEC_USERS.<span class="fn">append</span>(user)

<span class="kw">def</span> <span class="fn">log_event</span>(type_, entity, payload):
    EP.<span class="fn">append</span>({<span class="str">"ts"</span>:time.<span class="fn">time</span>(),<span class="str">"type"</span>:type_,<span class="str">"entity"</span>:entity,<span class="str">"payload"</span>:payload})

<span class="kw">def</span> <span class="fn">recall_facts</span>(query, user, k=<span class="num">3</span>):
    <span class="kw">if</span> <span class="kw">not</span> VEC_DOCS: <span class="kw">return</span> []
    M = vec.<span class="fn">fit_transform</span>(VEC_DOCS)
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, M)[<span class="num">0</span>]
    sims = np.<span class="fn">where</span>(np.<span class="fn">array</span>(VEC_USERS) == user, sims, -<span class="num">1</span>)
    idx = sims.<span class="fn">argsort</span>()[::-<span class="num">1</span>][:k]
    <span class="kw">return</span> [VEC_DOCS[i] <span class="kw">for</span> i <span class="kw">in</span> idx <span class="kw">if</span> sims[i] &gt; <span class="num">0</span>]

<span class="kw">def</span> <span class="fn">recall_events</span>(entity, k=<span class="num">3</span>):
    <span class="kw">return</span> [e <span class="kw">for</span> e <span class="kw">in</span> EP <span class="kw">if</span> e[<span class="str">"entity"</span>]==entity][-k:]

<span class="kw">def</span> <span class="fn">build_context</span>(user_msg, user, summary, recent_msgs):
    facts  = <span class="fn">recall_facts</span>(user_msg, user)
    events = <span class="fn">recall_events</span>(user)
    blocks = [<span class="str">"[SYSTEM] You are an engineering assistant."</span>,
              f<span class="str">"[SUMMARY] {summary}"</span> <span class="kw">if</span> summary <span class="kw">else</span> <span class="kw">None</span>,
              <span class="str">"[RECENT]\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"- {m}"</span> <span class="kw">for</span> m <span class="kw">in</span> recent_msgs),
              <span class="str">"[FACTS]\\n"</span>  + <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"- {f}"</span> <span class="kw">for</span> f <span class="kw">in</span> facts) <span class="kw">if</span> facts <span class="kw">else</span> <span class="kw">None</span>,
              <span class="str">"[EVENTS]\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"- {json.dumps(e,default=str)}"</span> <span class="kw">for</span> e <span class="kw">in</span> events) <span class="kw">if</span> events <span class="kw">else</span> <span class="kw">None</span>,
              f<span class="str">"[USER] {user_msg}"</span>]
    <span class="kw">return</span> <span class="str">"\\n\\n"</span>.<span class="fn">join</span>(b <span class="kw">for</span> b <span class="kw">in</span> blocks <span class="kw">if</span> b)

<span class="cm"># seed memories</span>
<span class="fn">remember_fact</span>(<span class="str">"Alice is allergic to peanuts."</span>, <span class="str">"alice"</span>)
<span class="fn">remember_fact</span>(<span class="str">"Alice prefers vegetarian Thai."</span>, <span class="str">"alice"</span>)
<span class="fn">log_event</span>(<span class="str">"plan_upgrade"</span>, <span class="str">"alice"</span>, {<span class="str">"from"</span>:<span class="str">"free"</span>,<span class="str">"to"</span>:<span class="str">"pro"</span>})

prompt = <span class="fn">build_context</span>(<span class="str">"plan a dinner with alice tonight"</span>, <span class="str">"alice"</span>,
                       SUMMARY, [<span class="str">"Alice asked about restaurants nearby."</span>])
<span class="fn">print</span>(prompt)
<span class="fn">print</span>(<span class="str">"\\n\\n--- prompt size approx tokens:"</span>, <span class="fn">len</span>(prompt)//<span class="num">4</span>)
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Dört hafıza türünün minimum versiyonlarını yan yana kurar: scratchpad / vektör dokümanları / episodik olaylar için global listeler artı bir <code>SUMMARY</code> string'i — yukarıdaki Anthropic SDK örneğiyle aynı mantıksal düzen, sadece Pyodide için basitleştirilmiş. 2) <code>recall_facts</code> TF-IDF matrisini yeniden inşa eder ve kullanıcı-filtreli kosinüs top-k çalıştırır (bölüm-3'teki <code>VectorMemory</code>'nin aynası); <code>recall_events</code> episodik listeyi varlığa göre filtreler. 3) <code>build_context(user_msg, user, summary, recent_msgs)</code> her katmanı açık <code>[SYSTEM]</code> / <code>[SUMMARY]</code> / <code>[RECENT]</code> / <code>[FACTS]</code> / <code>[EVENTS]</code> / <code>[USER]</code> blokları olan tek bir prompt'a örer ve boş olan blokları atar. 4) İki gerçek ve bir olay tohumlayıp "plan a dinner with alice tonight" sormak tam bir prompt üretir — onu yazdırmak artı token tahmini, production'da <code>messages.create</code>'e vereceğiniz tam şeydir.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Production'da Okuma/Yazma Politikaları</h2>
<p class="l-text">Her hafıza sisteminin iki politikası vardır. <strong>Yazma politikası</strong>: bir tur ne zaman bir hafızaya dönüşür? <strong>Okuma politikası</strong>: ne zaman geri çağırırız ve kaç giriş enjekte ederiz?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naif yazma</div><div class="card-body">Her kullanıcı turu → vektör deposu. Ucuz, ama selamlamalar ve havadan sudan konuşmalarla geri çağırmayı kirletir.</div></div>
<div class="calc-card"><div class="card-title">Akıllı yazma</div><div class="card-body">Küçük bir sınıflandırıcı ("bu bir gerçek mi, tercih mi, isimli varlık mı?") yazmaları kontrol eder. <code>mem0</code> bir LLM çağrısı kullanır; maliyet önemliyse hızlı bir sınıflandırıcı kullanabilirsin.</div></div>
<div class="calc-card"><div class="card-title">Her zaman açık okuma</div><div class="card-body">Her tur top-k çeker. Basit, öngörülebilir. Sohbet asistanları için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Araç-tetikli okuma</div><div class="card-body">Modelin bir <code>recall(query)</code> aracı vardır. Yalnızca istediğinde okur. Token tasarrufu sağlar, modelin sorması gerektiğini bilmesini gerektirir.</div></div>
</div>

<div class="calc-highlight">Sağlam bir varsayılan: <strong>akıllı yazma + k=3-5 ile her zaman açık okuma</strong>, artı modelin daha derine inebilmek için kullanabileceği açık bir <code>recall</code> aracı. Çok-kiracılı uygulamalar tüm okuma/yazmaları <code>user_id</code> (veya <code>workspace_id</code>) ile kapsamalandırmalıdır — en yaygın production hafıza hatası bir kullanıcının hafızalarını başkasına sızdırmaktır.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gizlilik, PII &amp; Unutulma Hakkı</h2>
<p class="l-text">Hafıza sistemleri GDPR/CCPA-ile-ilgili veri depolarıdır. Üç somut gereklilik:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yazmada PII redaksiyonu</div><div class="card-body">Embed etmeden önce kredi kartı numaralarını, SSN'leri, devlet kimliklerini ayıkla. Bir regex veya özel bir NER modeli kullan. Ham token'ları asla saklama.</div></div>
<div class="calc-card"><div class="card-title">Kullanıcı başına namespacing</div><div class="card-body">Vektör ve episodik depolar <code>user_id</code> ile anahtarlanır. Sorgu zamanında filtreler, DB katmanında zorlanır (Postgres'te satır-seviyesi güvenlik).</div></div>
<div class="calc-card"><div class="card-title">Forget API</div><div class="card-body"><code>DELETE /memories?user_id=X</code> embedding'leri, özetleri ve olay loglarını gerçekten silmelidir. "Unutulma hakkı" istekleri için soft-delete yeterli değildir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># PII redaction before write</span>
<span class="kw">import</span> re

PATTERNS = {
    <span class="str">"EMAIL"</span>:  re.<span class="fn">compile</span>(r<span class="str">"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}"</span>),
    <span class="str">"PHONE"</span>:  re.<span class="fn">compile</span>(r<span class="str">"\\+?\\d[\\d\\s\\-()]{8,}\\d"</span>),
    <span class="str">"CARD"</span>:   re.<span class="fn">compile</span>(r<span class="str">"\\b(?:\\d[ -]*?){13,19}\\b"</span>),
    <span class="str">"SSN"</span>:    re.<span class="fn">compile</span>(r<span class="str">"\\b\\d{3}-\\d{2}-\\d{4}\\b"</span>),
}

<span class="kw">def</span> <span class="fn">redact</span>(text):
    <span class="kw">for</span> tag, pat <span class="kw">in</span> PATTERNS.<span class="fn">items</span>():
        text = pat.<span class="fn">sub</span>(f<span class="str">"[{tag}]"</span>, text)
    <span class="kw">return</span> text

samples = [
    <span class="str">"Email me at alice@example.com or call +1 415-555-0199."</span>,
    <span class="str">"My card is 4111 1111 1111 1111, ssn 123-45-6789."</span>,
    <span class="str">"Just a normal sentence about lunch."</span>,
]
<span class="kw">for</span> s <span class="kw">in</span> samples: <span class="fn">print</span>(<span class="fn">redact</span>(s))
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>PATTERNS</code>, bir PII etiketini (<code>EMAIL</code>, <code>PHONE</code>, <code>CARD</code>, <code>SSN</code>) kanonik biçimleri kapsayan derlenmiş regex'lere eşleyen bir sözlüktür — bir kez kurulur ve her redaksiyon çağrısında yeniden kullanılır. 2) <code>redact(text)</code> sözlüğü dolaşır ve her pattern için <code>pat.sub(f"[{tag}]", text)</code> çalıştırır; böylece her eşleşme embedding modelinin güvenle tüketebileceği <code>[EMAIL]</code> gibi sabit bir placeholder'la değişir. 3) Değiştirme metin vektör deposuna ulaşmadan önce gerçekleşir — orijinal PII asla embed edilmez, asla index'lenmez ve dolayısıyla benzerlik araması yoluyla geri sızamaz. 4) Üç demo satırı her pattern türünü test eder; production'da isimler ve konumlar için NER de eklersiniz ve redactor'ı sadece hatırlanmış metne değil, tool girdi ve çıktılarına da çalıştırırsınız.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Production Hafıza Yığını</h2>
<p class="l-text">Hepsini birleştirmek — gerçek bir müşteri-yüzlü agent'ı (bir alışveriş asistanı, bir mühendislik copilot'u, bir çalışma öğretmeni) güçlendiren bir referans mimarisi:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıcak yol (tur başına)</div><div class="card-body">Scratchpad: süreç-içi liste. Son N ham mesaj: kelimesi kelimesine tutulur. Özet: son sıkıştırılmış blok. Toplam ~8-32K token.</div></div>
<div class="calc-card"><div class="card-title">Ilık yol (semantik)</div><div class="card-body">Vektör deposu: pgvector veya Pinecone. Hatırlanmaya değer gerçeklerin embedding'leri. Tur başına Top-k=3-5, kullanıcı mesajının yanına yeniden enjekte edilir.</div></div>
<div class="calc-card"><div class="card-title">Soğuk yol (filtreli)</div><div class="card-body">Episodik olaylar: Postgres tablosu. Model belirli bir varlığın geçmişini istediğinde araç çağrısıyla sorgulanır.</div></div>
<div class="calc-card"><div class="card-title">Sıkıştırma</div><div class="card-body">Arka plan işi: ham geçmiş &gt; bütçe olduğunda eski yarısını özetle. Özet bile büyürse özyinelemeli.</div></div>
<div class="calc-card"><div class="card-title">Caching</div><div class="card-body">Statik sistem prompt'u + araç şemaları + (uzunsa) kayan özet bloğu üzerinde Anthropic prompt caching.</div></div>
<div class="calc-card"><div class="card-title">Gizlilik</div><div class="card-body">Yazmada PII redaksiyonu. Kullanıcı başına satır-seviyesi güvenlik. Forget API. Tüm okuma/yazmaların denetim logu.</div></div>
</div>

<div class="calc-highlight">Sonraki derste <em>agent'ın ne hatırladığından</em> <em>agent'ın ne yapmaya karar verdiğine</em> geçiyoruz: <strong>planlama &amp; görev ayrıştırma</strong> — Plan-and-Execute, Tree of Thoughts, ReWOO, hiyerarşik agent'lar ve öz-yansıma. Hafıza alt katmandır; planlama, içinden iş geçiren motordur.</div>
</div>`
};
