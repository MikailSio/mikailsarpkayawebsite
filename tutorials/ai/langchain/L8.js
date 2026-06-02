window.LANGCHAIN_L8 = {
en: `<p class="l-text"><strong>Hook.</strong> "What did I just say?" — every chatbot's recurring nightmare. LLMs are stateless: each call starts from zero. <strong>Memory</strong> is the engineering work that makes a model <em>feel</em> stateful — by deciding which past turns to re-send, summarize, or recall. The right memory strategy keeps context relevant <em>and</em> tokens cheap.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compare four memory strategies: buffer, window, summary, and vector-store recall</li>
<li>Implement <code>ChatMessageHistory</code> and persist sessions in Redis or SQLite</li>
<li>Wrap any chain with <code>RunnableWithMessageHistory</code> for per-session state</li>
<li>Build a token-budgeted summarizer with <code>ConversationSummaryBufferMemory</code></li>
<li>Recall long-term facts via vector-store memory with semantic lookup</li>
<li>Pick the strategy that balances recall fidelity against per-turn token cost</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. The four memory strategies</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Buffer</div><div class="calc-card-desc">Re-send the entire history every turn. Simple, exact, but cost grows linearly.</div></div>
<div class="calc-card"><div class="calc-card-title">Window (last K)</div><div class="calc-card-desc">Keep only the last K messages. Cheap, loses long-term memory.</div></div>
<div class="calc-card"><div class="calc-card-title">Summary</div><div class="calc-card-desc">An LLM compresses old turns into a running summary. Best balance.</div></div>
<div class="calc-card"><div class="calc-card-title">Vector recall</div><div class="calc-card-desc">Embed every turn; retrieve the most relevant ones for the current question.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. ConversationBufferMemory (modern equivalent)</h2>
<p class="l-text">Modern LangChain has moved memory into <strong>RunnableWithMessageHistory</strong>. The legacy <code>ConversationBufferMemory</code> still appears in tutorials but the new pattern is cleaner.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate, MessagesPlaceholder
<span class="kw">from</span> langchain_core.runnables.history <span class="kw">import</span> RunnableWithMessageHistory
<span class="kw">from</span> langchain_community.chat_message_histories <span class="kw">import</span> ChatMessageHistory

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"You are a friendly NLP tutor."</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"history"</span>),
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>)
])
chain = prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>)

stores = {}
<span class="kw">def</span> <span class="fn">get_history</span>(session_id):
    <span class="kw">if</span> session_id <span class="kw">not</span> <span class="kw">in</span> stores: stores[session_id] = <span class="fn">ChatMessageHistory</span>()
    <span class="kw">return</span> stores[session_id]

with_mem = <span class="fn">RunnableWithMessageHistory</span>(
    chain, get_history,
    input_messages_key=<span class="str">"input"</span>,
    history_messages_key=<span class="str">"history"</span>
)

cfg = {<span class="str">"configurable"</span>: {<span class="str">"session_id"</span>: <span class="str">"alice"</span>}}
<span class="fn">print</span>(with_mem.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"My name is Alice."</span>}, cfg).content)
<span class="fn">print</span>(with_mem.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"What did I tell you my name was?"</span>}, cfg).content)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a <code>ChatPromptTemplate</code> whose middle slot is a <code>MessagesPlaceholder("history")</code> — the chain will splice past messages in there at invoke time. 2) <code>get_history(session_id)</code> lazily creates a <code>ChatMessageHistory</code> in a per-process <code>stores</code> dict; swap this for Redis or SQL in production. 3) <code>RunnableWithMessageHistory(chain, get_history, input_messages_key, history_messages_key)</code> wraps the chain so every <code>invoke</code> reads history before the call and appends the new user/AI turn after. 4) The <code>{"configurable": {"session_id": "alice"}}</code> config selects which session bucket to use — so two users do not see each other's memory. 5) The second call recalls "Alice" because the history was carried across invocations transparently.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RunnableWithMessageHistory just maintains {session_id: messages_list}. Build the same per-session memory by hand and watch the bot recall the user's name across two turns.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Session-keyed memory by hand
import re
SESSIONS = {}

def get_history(session_id):
    return SESSIONS.setdefault(session_id, [])

def fake_chat(messages):
    # Find the most recent "My name is X" claim
    for m in reversed(messages):
        m_match = re.search(r"my name is (\w+)", m["content"], re.I)
        if m_match:
            name = m_match.group(1)
            break
    else:
        name = None
    last = messages[-1]["content"].lower()
    if "what did i tell you my name" in last and name:
        return f"You told me your name is {name}."
    return "Got it!"

def chat_with_memory(session_id, user_input):
    h = get_history(session_id)
    h.append({"role": "user", "content": user_input})
    reply = fake_chat(h)
    h.append({"role": "ai", "content": reply})
    return reply

print(chat_with_memory("alice", "My name is Alice."))
print(chat_with_memory("alice", "What did I tell you my name was?"))
print(f"alice history: {len(SESSIONS['alice'])} msgs")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>SESSIONS</code> is a dict of <code>{session_id: messages_list}</code> — the in-browser stand-in for the storage backend <code>RunnableWithMessageHistory</code> consults. 2) <code>fake_chat(messages)</code> scans <em>all</em> past messages with a regex to find any "My name is X" claim — that is the bit a real model would learn from history. 3) <code>chat_with_memory(session_id, user_input)</code> appends the user turn, calls <code>fake_chat</code>, appends the AI reply, and returns it — the same read-then-write cycle the LangChain wrapper does. 4) The second call recovers "Alice" because the history list survived across calls — proof that per-session memory is just a keyed list under the hood.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Window memory — bound the cost</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Custom history that only keeps the last K messages</span>
<span class="kw">class</span> <span class="fn">WindowedHistory</span>(ChatMessageHistory):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, k=<span class="num">6</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>(); self.k = k
    <span class="kw">def</span> <span class="fn">add_message</span>(self, msg):
        <span class="fn">super</span>().<span class="fn">add_message</span>(msg)
        <span class="cm"># keep last k user+ai pairs</span>
        <span class="kw">if</span> <span class="fn">len</span>(self.messages) > <span class="num">2</span> * self.k:
            self.messages = self.messages[-<span class="num">2</span>*self.k:]</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Subclasses <code>ChatMessageHistory</code> and overrides <code>add_message</code> — every append triggers a trim. 2) <code>self.k</code> is the desired number of <em>turn pairs</em> to retain (one user + one AI message each). 3) <code>self.messages[-2*self.k:]</code> slices to the last <code>2k</code> entries, dropping anything older — constant memory size, predictable token cost. 4) Plug this subclass into <code>RunnableWithMessageHistory</code> in place of <code>ChatMessageHistory</code>; no other chain code changes — the windowing is transparent to the model.</p>
<p class="l-text"><strong>Use case:</strong> high-traffic support bot where users only need the last few turns. Old context disappears, no surprises in token bill.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Summary memory — best balance</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

llm_summarizer = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">summarize</span>(history_msgs):
    convo = <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"{m.type.upper()}: {m.content}"</span> <span class="kw">for</span> m <span class="kw">in</span> history_msgs)
    prompt = (f<span class="str">"Summarize the conversation below in 3 short bullet points "</span>
              f<span class="str">"that preserve names, preferences, and open questions.\\n\\n{convo}"</span>)
    <span class="kw">return</span> llm_summarizer.<span class="fn">invoke</span>(prompt).content

<span class="cm"># Strategy: every N turns, replace history with [SystemMessage(summary)]</span>
<span class="cm"># This is the core of ConversationSummaryMemory.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a small <code>ChatOpenAI</code> dedicated to summarisation — a cheap model with <code>temperature=0</code> keeps summaries stable across reruns. 2) <code>summarize(history_msgs)</code> serialises the conversation into <code>ROLE: content</code> lines and asks for a tight 3-bullet recap that preserves names, preferences, and open questions. 3) The summariser call is short, so the cost is dominated by the much smaller running summary instead of the full history. 4) The comment shows the strategy: every N turns, replace the message list with a single <code>SystemMessage(summary)</code> — the core of <code>ConversationSummaryMemory</code>.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A "summary" is just compression. Use a heuristic summarizer: take the first N words of every old turn. Same lifecycle (fill buffer -> summarize -> reset) without an LLM.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Summary memory pattern (heuristic summarizer)
def heuristic_summarize(history_msgs, max_words_per_turn=6):
    bullets = []
    for m in history_msgs:
        words = m["content"].split()[:max_words_per_turn]
        bullets.append(f"- {m['role'].upper()}: {' '.join(words)}...")
    return "Conversation so far:\n" + "\n".join(bullets)

class SummaryMemory:
    def __init__(self, summarize_every=4):
        self.history = []
        self.summary = ""
        self.summarize_every = summarize_every
    def add(self, role, content):
        self.history.append({"role": role, "content": content})
        if len(self.history) >= self.summarize_every:
            self.summary = heuristic_summarize(self.history)
            self.history = []   # flush; summary now carries the gist

mem = SummaryMemory(summarize_every=4)
turns = [("user","I want to learn NLP."),
         ("ai","Great, start with TF-IDF."),
         ("user","I prefer Python over R."),
         ("ai","Noted: Python preference.")]
for r, c in turns:
    mem.add(r, c)

print(mem.summary)
print("\nbuffered turns left:", len(mem.history))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>heuristic_summarize</code> stands in for the summariser LLM: it just takes the first 6 words of each turn and emits a bullet list — same input/output shape as a real summary call. 2) <code>SummaryMemory</code> holds a live <code>history</code> buffer plus a running <code>summary</code> string; <code>summarize_every</code> sets when the flush fires. 3) <code>add(role, content)</code> appends to <code>history</code> and, once the threshold is hit, calls the summariser and resets the buffer — the same fill-then-compress cycle <code>ConversationSummaryBufferMemory</code> uses. 4) The final print shows the compressed summary plus an empty buffer, confirming the trade: lose verbatim turns, keep the gist for cheap.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Vector store memory — semantic recall</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.vectorstores <span class="kw">import</span> FAISS
<span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings

emb = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)
mem_store = FAISS.<span class="fn">from_texts</span>([<span class="str">"__init__"</span>], emb)

<span class="kw">def</span> <span class="fn">remember</span>(turn_text):
    mem_store.<span class="fn">add_texts</span>([turn_text])

<span class="kw">def</span> <span class="fn">recall</span>(query, k=<span class="num">4</span>):
    <span class="kw">return</span> [d.page_content <span class="kw">for</span> d <span class="kw">in</span> mem_store.<span class="fn">similarity_search</span>(query, k=k)]

<span class="cm"># In the chain, build the prompt with: recent N turns + recall(query)</span>
<span class="cm"># Useful when sessions span days and the user references something from a week ago.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Stands up a FAISS vector store seeded with a placeholder document so the index exists before the first real turn is written. 2) <code>remember(turn_text)</code> calls <code>add_texts</code> to embed and index every new turn — the write path is one line. 3) <code>recall(query, k=4)</code> runs <code>similarity_search</code> against the index and returns the most relevant past turns — the read path is one line too. 4) Compose this with a window or summary memory: the prompt then carries <em>recent verbatim + semantic recall</em> — the right shape for assistants that span days of conversation.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Vector memory = TF-IDF over past turns. Append every turn to the corpus, refit on remember(), retrieve top-k on recall(). Same shape as FAISS-backed memory.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># TF-IDF based "vector memory"
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class VectorMemory:
    def __init__(self):
        self.turns = []
    def remember(self, text):
        self.turns.append(text)
    def recall(self, query, k=2):
        if not self.turns:
            return []
        vec = TfidfVectorizer().fit(self.turns + [query])
        M = vec.transform(self.turns)
        q = vec.transform([query])
        sims = cosine_similarity(q, M).ravel()
        top = np.argsort(-sims)[:k]
        return [(round(sims[i], 3), self.turns[i]) for i in top]

mem = VectorMemory()
for t in ["We decided X3 launch on May 15.",
          "Marketing asked for blue color scheme.",
          "Bug in payment flow needs fix.",
          "X3 pricing tier is $499."]:
    mem.remember(t)

print("recall 'X3 launch date':")
for s, t in mem.recall("X3 launch date", k=2):
    print(f"  {s} -> {t}")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>VectorMemory</code> stores past turns as raw strings in <code>self.turns</code> — append-only, no index until queried. 2) <code>remember(text)</code> just appends; the index is rebuilt lazily on <code>recall</code> so the demo is small enough to read at a glance. 3) <code>recall(query, k)</code> fits a TF-IDF over <em>turns + query together</em> (so the query shares the vocabulary), then cosine-ranks the turns. 4) Calling <code>recall("X3 launch date")</code> returns the launch-date turn first — exactly the behaviour <code>FAISS.similarity_search</code> would deliver with real embeddings.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Hybrid: recent window + summary + vector</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Recent window:</strong> last 6 turns verbatim — keeps fresh context perfect.</div>
<div class="calc-step"><strong>2. Rolling summary:</strong> compress everything older than 6 turns into 3-5 bullets.</div>
<div class="calc-step"><strong>3. Vector recall:</strong> additionally fetch top-3 semantically related historical turns.</div>
<div class="calc-step"><strong>Result:</strong> coherent short-term memory + cheap long-term gist + targeted retrieval — the recipe behind production assistants.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Token budget management</h2>
<p class="l-text">A common bug: memory grows until you hit context length and the call fails. Always estimate.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> tiktoken
enc = tiktoken.<span class="fn">encoding_for_model</span>(<span class="str">"gpt-4o-mini"</span>)

<span class="kw">def</span> <span class="fn">tokens</span>(s): <span class="kw">return</span> <span class="fn">len</span>(enc.<span class="fn">encode</span>(s))

CTX_LIMIT = <span class="num">128_000</span>          <span class="cm"># gpt-4o-mini</span>
ROOM_FOR_OUTPUT = <span class="num">1024</span>
budget = CTX_LIMIT - ROOM_FOR_OUTPUT

<span class="cm"># Strategy: while sum of tokens > budget * 0.5, summarize older turns</span>
<span class="cm"># 50% safety margin protects against retrieval blowing past the limit.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>tiktoken.encoding_for_model("gpt-4o-mini")</code> returns the exact BPE encoder OpenAI bills against — anything else is an approximation. 2) <code>tokens(s)</code> wraps <code>enc.encode</code> so any place you build a prompt fragment can ask "how big is this?" before sending. 3) <code>CTX_LIMIT - ROOM_FOR_OUTPUT</code> reserves headroom for the model's reply — if you skip this, long answers get cut off mid-sentence. 4) The strategy comment fixes the budget at half the limit; once memory crosses that line, the summariser kicks in to keep room for retrieval and the user turn.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Memory strategy cost vs fidelity</h2>
<div id="lc-l8-mem-en" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'scatter',mode:'markers+text',
    x:[100,15,40,30],
    y:[100,45,80,90],
    text:['Buffer (full)','Window (K=6)','Summary','Vector Recall'],
    textposition:'top center',
    marker:{size:[28,18,22,24],color:T,line:{color:'#fff',width:1}}}];
  var layout={title:'Memory strategy — relative token cost vs context fidelity',
    xaxis:{title:'relative token cost (per turn)'},
    yaxis:{title:'context fidelity (%)',range:[30,105]},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l8-mem-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L9 lets the LLM <strong>act</strong>, not just answer — agents, ReAct, tool use, function calling.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> "Az önce ne dedim?" — her chatbot'un tekrarlayan kabusu. LLM'ler durumsuzdur: her çağrı sıfırdan başlar. <strong>Memory</strong>, modeli durumlu <em>hissettiren</em> mühendislik işidir — geçmiş turlardan hangilerinin yeniden gönderileceğine, özetleneceğine veya geri çağrılacağına karar vererek. Doğru memory stratejisi bağlamı alakalı <em>ve</em> token'ı ucuz tutar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dört memory stratejisini karşılaştırmayı: buffer, window, summary ve vector-store recall</li>
<li><code>ChatMessageHistory</code>'yi uygulamayı ve oturumları Redis veya SQLite'ta kalıcılaştırmayı</li>
<li>Herhangi bir chain'i <code>RunnableWithMessageHistory</code> ile sarıp oturum başına durum eklemeyi</li>
<li><code>ConversationSummaryBufferMemory</code> ile token-bütçeli özetleyici kurmayı</li>
<li>Vector-store memory ile uzun vadeli gerçekleri anlamsal aramayla geri çağırmayı</li>
<li>Recall sadakatini tur başına token maliyetine karşı dengeleyen stratejiyi seçmeyi</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Dört memory stratejisi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Buffer</div><div class="calc-card-desc">Tüm geçmişi her turda yeniden gönder. Basit, kesin, ama maliyet doğrusal büyür.</div></div>
<div class="calc-card"><div class="calc-card-title">Pencere (son K)</div><div class="calc-card-desc">Sadece son K mesajı tut. Ucuz, uzun vadeli hafıza kaybı.</div></div>
<div class="calc-card"><div class="calc-card-title">Özet</div><div class="calc-card-desc">Bir LLM eski turları sürekli özete sıkıştırır. En iyi denge.</div></div>
<div class="calc-card"><div class="calc-card-title">Vektör recall</div><div class="calc-card-desc">Her turu embed et; mevcut soruya en alakalı olanları çek.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. ConversationBufferMemory (modern karşılığı)</h2>
<p class="l-text">Modern LangChain memory'yi <strong>RunnableWithMessageHistory</strong>'ye taşıdı. Eski <code>ConversationBufferMemory</code> hâlâ rehberlerde görünür ama yeni desen daha temiz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate, MessagesPlaceholder
<span class="kw">from</span> langchain_core.runnables.history <span class="kw">import</span> RunnableWithMessageHistory
<span class="kw">from</span> langchain_community.chat_message_histories <span class="kw">import</span> ChatMessageHistory

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Dost canlısı bir NLP eğitmenisin."</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"history"</span>),
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>)
])
chain = prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>)

stores = {}
<span class="kw">def</span> <span class="fn">get_history</span>(session_id):
    <span class="kw">if</span> session_id <span class="kw">not</span> <span class="kw">in</span> stores: stores[session_id] = <span class="fn">ChatMessageHistory</span>()
    <span class="kw">return</span> stores[session_id]

with_mem = <span class="fn">RunnableWithMessageHistory</span>(
    chain, get_history,
    input_messages_key=<span class="str">"input"</span>,
    history_messages_key=<span class="str">"history"</span>
)

cfg = {<span class="str">"configurable"</span>: {<span class="str">"session_id"</span>: <span class="str">"alice"</span>}}
<span class="fn">print</span>(with_mem.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"Adım Alice."</span>}, cfg).content)
<span class="fn">print</span>(with_mem.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"Adımın ne olduğunu söylemiştim?"</span>}, cfg).content)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Orta slotu <code>MessagesPlaceholder("history")</code> olan bir <code>ChatPromptTemplate</code> kurar — chain invoke anında geçmiş mesajları oraya yerleştirir. 2) <code>get_history(session_id)</code>, süreç içi <code>stores</code> dict'inde tembelce bir <code>ChatMessageHistory</code> oluşturur; üretimde Redis veya SQL ile değiştirin. 3) <code>RunnableWithMessageHistory(chain, get_history, input_messages_key, history_messages_key)</code> chain'i sarar; her <code>invoke</code> önce geçmişi okur, sonra yeni user/AI turunu ekler. 4) <code>{"configurable": {"session_id": "alice"}}</code> config'i hangi oturum kovasının kullanılacağını seçer — iki kullanıcı birbirinin hafızasını görmez. 5) İkinci çağrı "Alice"i hatırlar çünkü geçmiş çağrılar arasında şeffaf biçimde taşınmıştır.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RunnableWithMessageHistory aslında {session_id: messages_list} tutar. Aynı session-başına hafızayı kendi elinle kur ve botun iki tur arasında kullanıcının ismini hatırladığını izle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Session anahtarlı memory, el yapımı
import re
SESSIONS = {}

def get_history(session_id):
    return SESSIONS.setdefault(session_id, [])

def fake_chat(messages):
    # En son "Adım X" iddiasını bul
    name = None
    for m in reversed(messages):
        m_match = re.search(r"adım\s+(\w+)", m["content"], re.I)
        if m_match:
            name = m_match.group(1); break
    last = messages[-1]["content"].lower()
    if "adımın ne" in last and name:
        return f"Adının {name} olduğunu söyledin."
    return "Anladım!"

def chat_with_memory(session_id, user_input):
    h = get_history(session_id)
    h.append({"role": "user", "content": user_input})
    reply = fake_chat(h)
    h.append({"role": "ai", "content": reply})
    return reply

print(chat_with_memory("alice", "Adım Alice."))
print(chat_with_memory("alice", "Adımın ne olduğunu söylemiştim?"))
print(f"alice geçmişi: {len(SESSIONS['alice'])} mesaj")</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>SESSIONS</code> <code>{session_id: messages_list}</code> dict'idir — <code>RunnableWithMessageHistory</code>'nin başvurduğu depo arka ucunun tarayıcı içi karşılığı. 2) <code>fake_chat(messages)</code> <em>tüm</em> geçmiş mesajları regex ile tarayıp herhangi bir "Adım X" iddiasını bulur — gerçek bir modelin geçmişten öğreneceği şeyin aynısı. 3) <code>chat_with_memory(session_id, user_input)</code> kullanıcı turunu ekler, <code>fake_chat</code>'i çağırır, AI yanıtını ekler ve döndürür — LangChain sarmalayıcısının yaptığı oku-sonra-yaz döngüsü. 4) İkinci çağrı "Alice"i kurtarır çünkü geçmiş listesi çağrılar arasında ayakta kalmıştır — oturum başına hafızanın perde arkasında anahtarlı bir listeden ibaret olduğunun kanıtı.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Pencere memory — maliyeti sınırla</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Sadece son K mesajı tutan özel history</span>
<span class="kw">class</span> <span class="fn">WindowedHistory</span>(ChatMessageHistory):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, k=<span class="num">6</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>(); self.k = k
    <span class="kw">def</span> <span class="fn">add_message</span>(self, msg):
        <span class="fn">super</span>().<span class="fn">add_message</span>(msg)
        <span class="cm"># son k user+ai çifti</span>
        <span class="kw">if</span> <span class="fn">len</span>(self.messages) > <span class="num">2</span> * self.k:
            self.messages = self.messages[-<span class="num">2</span>*self.k:]</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>ChatMessageHistory</code>'yi subclass eder ve <code>add_message</code>'ı override eder — her ekleme bir budama tetikler. 2) <code>self.k</code> korumak istediğiniz <em>tur çiftlerinin</em> sayısıdır (her biri bir kullanıcı + bir AI mesajı). 3) <code>self.messages[-2*self.k:]</code> son <code>2k</code> girdiye dilimler ve daha eskileri atar — sabit hafıza boyutu, öngörülebilir token maliyeti. 4) Bu subclass'ı <code>RunnableWithMessageHistory</code>'ye <code>ChatMessageHistory</code> yerine takın; başka chain kodu değişmez — pencereleme model için şeffaftır.</p>
<p class="l-text"><strong>Kullanım:</strong> kullanıcıların yalnızca son birkaç tura ihtiyacı olan yoğun trafikli destek botu. Eski bağlam kaybolur, token faturasında sürpriz olmaz.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Özet memory — en iyi denge</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

llm_summarizer = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">summarize</span>(history_msgs):
    convo = <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"{m.type.upper()}: {m.content}"</span> <span class="kw">for</span> m <span class="kw">in</span> history_msgs)
    prompt = (f<span class="str">"Aşağıdaki konuşmayı isimleri, tercihleri ve açık soruları "</span>
              f<span class="str">"koruyacak 3 kısa madde halinde özetle.\\n\\n{convo}"</span>)
    <span class="kw">return</span> llm_summarizer.<span class="fn">invoke</span>(prompt).content

<span class="cm"># Strateji: her N turda bir geçmişi [SystemMessage(summary)] ile değiştir.</span>
<span class="cm"># Bu, ConversationSummaryMemory'nin özüdür.</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Özetleme için ayrılmış küçük bir <code>ChatOpenAI</code> kurar — ucuz bir model + <code>temperature=0</code> özetleri çalıştırmalar arasında stabil tutar. 2) <code>summarize(history_msgs)</code> konuşmayı <code>ROL: içerik</code> satırlarına serileştirir ve isimleri, tercihleri ve açık soruları koruyan 3 maddelik sıkı bir özet ister. 3) Özetleyici çağrısı kısadır; bu yüzden maliyet tüm geçmiş yerine çok daha küçük olan akan özetin üzerinde yoğunlaşır. 4) Yorum stratejiyi gösterir: her N turda bir mesaj listesini tek bir <code>SystemMessage(summary)</code> ile değiştir — <code>ConversationSummaryMemory</code>'nin özü budur.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">"Özet" sıkıştırmadır. Heuristik bir özetleyici kullan: her eski turun ilk N kelimesini al. LLM olmadan aynı yaşam döngüsü (buffer doldur -> özetle -> sıfırla).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Özet memory deseni (heuristik özetleyici)
def heuristic_summarize(history_msgs, max_words_per_turn=6):
    bullets = []
    for m in history_msgs:
        words = m["content"].split()[:max_words_per_turn]
        bullets.append(f"- {m['role'].upper()}: {' '.join(words)}...")
    return "Şimdiye kadarki konuşma:\n" + "\n".join(bullets)

class SummaryMemory:
    def __init__(self, summarize_every=4):
        self.history = []
        self.summary = ""
        self.summarize_every = summarize_every
    def add(self, role, content):
        self.history.append({"role": role, "content": content})
        if len(self.history) >= self.summarize_every:
            self.summary = heuristic_summarize(self.history)
            self.history = []   # boşalt; özet artık özünü taşıyor

mem = SummaryMemory(summarize_every=4)
turns = [("user","NLP öğrenmek istiyorum."),
         ("ai","Harika, TF-IDF ile başla."),
         ("user","Python'u R'a tercih ediyorum."),
         ("ai","Not: Python tercihi.")]
for r, c in turns:
    mem.add(r, c)

print(mem.summary)
print("\nbuffer'da kalan tur:", len(mem.history))</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>heuristic_summarize</code> özetleyici LLM yerine geçer: her turun ilk 6 kelimesini alır ve bir madde listesi üretir — gerçek bir özet çağrısıyla aynı girdi/çıktı şekli. 2) <code>SummaryMemory</code> canlı bir <code>history</code> buffer'ı ile akan bir <code>summary</code> string'i tutar; <code>summarize_every</code> flush'ın ne zaman çalışacağını belirler. 3) <code>add(role, content)</code> <code>history</code>'ye ekler ve eşiğe ulaşıldığında özetleyiciyi çağırıp buffer'ı sıfırlar — <code>ConversationSummaryBufferMemory</code>'nin kullandığı doldur-sonra-sıkıştır döngüsü. 4) Son print sıkıştırılmış özeti ve boş bir buffer'ı gösterir; takası doğrular: birebir turları kaybet, ucuz fiyata özünü tut.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Vektör deposu memory — anlamsal recall</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.vectorstores <span class="kw">import</span> FAISS
<span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings

emb = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)
mem_store = FAISS.<span class="fn">from_texts</span>([<span class="str">"__init__"</span>], emb)

<span class="kw">def</span> <span class="fn">remember</span>(turn_text):
    mem_store.<span class="fn">add_texts</span>([turn_text])

<span class="kw">def</span> <span class="fn">recall</span>(query, k=<span class="num">4</span>):
    <span class="kw">return</span> [d.page_content <span class="kw">for</span> d <span class="kw">in</span> mem_store.<span class="fn">similarity_search</span>(query, k=k)]

<span class="cm"># Chain'de prompt'u şöyle kur: son N tur + recall(query)</span>
<span class="cm"># Oturumlar günleri kapsadığında ve kullanıcı bir hafta önceki şeye atıf yaptığında faydalı.</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) İlk gerçek tur yazılmadan önce indeksin var olması için placeholder bir belgeyle tohumlanmış bir FAISS vektör deposu kurar. 2) <code>remember(turn_text)</code> her yeni turu embed edip indekslemek için <code>add_texts</code> çağırır — yazma yolu tek satır. 3) <code>recall(query, k=4)</code> indekse karşı <code>similarity_search</code> çalıştırır ve en alakalı geçmiş turları döndürür — okuma yolu da tek satır. 4) Bunu bir pencere veya özet hafızasıyla kompoze edin: prompt o zaman <em>yakın birebir + anlamsal recall</em> taşır — günlerce süren sohbetler için doğru şekil.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Vektör memory = geçmiş turlar üzerinde TF-IDF. remember()'da corpus'a ekle, recall()'da top-k çek. FAISS-destekli memory ile aynı şekil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># TF-IDF tabanlı "vektör memory"
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class VectorMemory:
    def __init__(self):
        self.turns = []
    def remember(self, text):
        self.turns.append(text)
    def recall(self, query, k=2):
        if not self.turns:
            return []
        vec = TfidfVectorizer().fit(self.turns + [query])
        M = vec.transform(self.turns)
        q = vec.transform([query])
        sims = cosine_similarity(q, M).ravel()
        top = np.argsort(-sims)[:k]
        return [(round(sims[i], 3), self.turns[i]) for i in top]

mem = VectorMemory()
for t in ["X3 lansmanını 15 Mayıs'a aldık.",
          "Pazarlama mavi renk şeması istedi.",
          "Ödeme akışındaki bug düzeltilmeli.",
          "X3 fiyat seviyesi $499."]:
    mem.remember(t)

print("'X3 lansman tarihi' recall:")
for s, t in mem.recall("X3 lansman tarihi", k=2):
    print(f"  {s} -> {t}")</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>VectorMemory</code> geçmiş turları <code>self.turns</code>'te ham string olarak saklar — sadece ekleme yapılır, sorgulanmadan indeks oluşturulmaz. 2) <code>remember(text)</code> sadece ekler; indeks bir bakışta okunabilecek kadar küçük kalsın diye <code>recall</code>'da tembelce yeniden kurulur. 3) <code>recall(query, k)</code> TF-IDF'i <em>turlar + sorgu birlikte</em> fit eder (sorgu kelime hazinesini paylaşsın diye), sonra turları kosinüsle sıralar. 4) <code>recall("X3 lansman tarihi")</code> çağrısı lansman-tarihi turunu en başa getirir — <code>FAISS.similarity_search</code>'in gerçek embedding'lerle vereceği davranışın aynısı.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Hibrit: yakın pencere + özet + vektör</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Yakın pencere:</strong> son 6 tur birebir — taze bağlamı mükemmel tutar.</div>
<div class="calc-step"><strong>2. Yuvarlanan özet:</strong> 6 turdan eski her şeyi 3-5 maddeye sıkıştır.</div>
<div class="calc-step"><strong>3. Vektör recall:</strong> ek olarak anlamsal en alakalı 3 tarihi turu çek.</div>
<div class="calc-step"><strong>Sonuç:</strong> tutarlı kısa vadeli hafıza + ucuz uzun vadeli özet + hedefli retrieval — üretim asistanlarının arkasındaki tarif.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Token bütçe yönetimi</h2>
<p class="l-text">Yaygın bug: memory büyür, bağlam uzunluğuna çarpar, çağrı patlar. Her zaman tahmin edin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> tiktoken
enc = tiktoken.<span class="fn">encoding_for_model</span>(<span class="str">"gpt-4o-mini"</span>)

<span class="kw">def</span> <span class="fn">tokens</span>(s): <span class="kw">return</span> <span class="fn">len</span>(enc.<span class="fn">encode</span>(s))

CTX_LIMIT = <span class="num">128_000</span>          <span class="cm"># gpt-4o-mini</span>
ROOM_FOR_OUTPUT = <span class="num">1024</span>
budget = CTX_LIMIT - ROOM_FOR_OUTPUT

<span class="cm"># Strateji: token toplamı budget * 0.5'i aşarsa eski turları özetle</span>
<span class="cm"># %50 güvenlik marjı, retrieval'ın limiti aşmasına karşı korur.</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>tiktoken.encoding_for_model("gpt-4o-mini")</code> OpenAI'nin fatura kestiği tam BPE encoder'ı döndürür — başka her şey tahmindir. 2) <code>tokens(s)</code> <code>enc.encode</code>'u sarar; prompt parçası kurduğunuz her yerde "bu ne kadar büyük?" diye sorabilirsiniz. 3) <code>CTX_LIMIT - ROOM_FOR_OUTPUT</code> modelin yanıtı için yer ayırır — bunu atlarsanız uzun cevaplar cümlenin ortasında kesilir. 4) Strateji yorumu bütçeyi limitin yarısında sabitler; hafıza o çizgiyi geçince özetleyici devreye girer ve retrieval ile kullanıcı turu için yer açar.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Memory stratejisi maliyet vs sadakat</h2>
<div id="lc-l8-mem-tr" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'scatter',mode:'markers+text',
    x:[100,15,40,30],
    y:[100,45,80,90],
    text:['Buffer (tam)','Pencere (K=6)','Özet','Vektör Recall'],
    textposition:'top center',
    marker:{size:[28,18,22,24],color:T,line:{color:'#fff',width:1}}}];
  var layout={title:'Memory stratejisi — göreli token maliyeti vs bağlam sadakati',
    xaxis:{title:'göreli token maliyeti (tur başına)'},
    yaxis:{title:'bağlam sadakati (%)',range:[30,105]},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l8-mem-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L9 LLM'in sadece cevap vermesini değil <strong>eylem yapmasını</strong> sağlıyor — agent'lar, ReAct, tool kullanımı, function calling.</p>
</div>
`
};
