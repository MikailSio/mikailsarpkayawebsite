window.LANGCHAIN_L12 = {
en: `<p class="l-text"><strong>Hook — capstone.</strong> Imagine you join a SaaS company on Monday and they ask: "Build us a chatbot that answers customer questions using our reviews, orders, and customer profiles. Ship it by Friday." This lesson is the playbook. We stitch <em>everything</em> from L1-L11 into one system: hybrid retrieval over reviews, an SQL agent for orders, a customer-aware memory, reranking, faithfulness eval, observability, and a production checklist. By the end you have the architectural template that ports to any domain — finance, healthcare, legal, e-commerce.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Architect a 5-layer LLM app: frontend, gateway, orchestration, retrieval, model</li>
<li>Build hybrid retrieval combining BM25 keyword and dense embedding search over reviews</li>
<li>Wire a SQL agent that answers order questions with safe parameterized queries</li>
<li>Add customer-aware memory keyed on user_id with Redis-backed sessions</li>
<li>Rerank candidates and run faithfulness evals with RAGAS before shipping</li>
<li>Ship the chain with LangServe, LangSmith tracing, semantic cache, and rate limits</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Architecture overview</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Frontend:</strong> Next.js / Streamlit — streams tokens via SSE.</div>
<div class="calc-step"><strong>Gateway:</strong> FastAPI / LangServe + rate limit + auth.</div>
<div class="calc-step"><strong>Router LLM:</strong> classifies intent → review search / order lookup / general chat.</div>
<div class="calc-step"><strong>Tools:</strong> hybrid retriever over df_reviews, SQL agent over df_orders, customer profile lookup over df_customers.</div>
<div class="calc-step"><strong>Reranker:</strong> Cohere/BGE rerank top-25 → top-4.</div>
<div class="calc-step"><strong>LLM:</strong> gpt-4o-mini default, gpt-4o for complex queries (router decision).</div>
<div class="calc-step"><strong>Memory:</strong> windowed (last 6) + rolling summary + per-customer vector recall.</div>
<div class="calc-step"><strong>Observability:</strong> LangSmith traces; nightly RAGAS eval on a frozen 100-Q set.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Datasets we will speak to (runnable)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">RandomState</span>(<span class="num">42</span>)

df_customers = pd.<span class="fn">DataFrame</span>({
    <span class="str">"customer_id"</span>: [<span class="num">101</span>,<span class="num">102</span>,<span class="num">103</span>,<span class="num">104</span>,<span class="num">105</span>],
    <span class="str">"name"</span>:   [<span class="str">"Ada"</span>,<span class="str">"Berk"</span>,<span class="str">"Cem"</span>,<span class="str">"Deniz"</span>,<span class="str">"Esra"</span>],
    <span class="str">"tier"</span>:   [<span class="str">"gold"</span>,<span class="str">"silver"</span>,<span class="str">"gold"</span>,<span class="str">"bronze"</span>,<span class="str">"silver"</span>],
    <span class="str">"country"</span>:[<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>,<span class="str">"FR"</span>,<span class="str">"TR"</span>]
})

df_orders = pd.<span class="fn">DataFrame</span>({
    <span class="str">"order_id"</span>:   <span class="fn">range</span>(<span class="num">5001</span>, <span class="num">5021</span>),
    <span class="str">"customer_id"</span>:rng.<span class="fn">choice</span>([<span class="num">101</span>,<span class="num">102</span>,<span class="num">103</span>,<span class="num">104</span>,<span class="num">105</span>], <span class="num">20</span>),
    <span class="str">"product"</span>:    rng.<span class="fn">choice</span>([<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>], <span class="num">20</span>),
    <span class="str">"amount"</span>:     np.<span class="fn">round</span>(rng.<span class="fn">gamma</span>(<span class="num">3</span>, <span class="num">60</span>, <span class="num">20</span>), <span class="num">2</span>),
    <span class="str">"status"</span>:     rng.<span class="fn">choice</span>([<span class="str">"delivered"</span>,<span class="str">"returned"</span>,<span class="str">"pending"</span>], <span class="num">20</span>, p=[<span class="num">.7</span>,<span class="num">.2</span>,<span class="num">.1</span>])
})

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"review_id"</span>:  <span class="fn">range</span>(<span class="num">1</span>, <span class="num">11</span>),
    <span class="str">"customer_id"</span>:rng.<span class="fn">choice</span>([<span class="num">101</span>,<span class="num">102</span>,<span class="num">103</span>,<span class="num">104</span>,<span class="num">105</span>], <span class="num">10</span>),
    <span class="str">"product"</span>:    rng.<span class="fn">choice</span>([<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>], <span class="num">10</span>),
    <span class="str">"text"</span>:[
        <span class="str">"X3 firmware update bricked my unit, support unhelpful."</span>,
        <span class="str">"X1 battery is excellent, lasts 12 hours easily."</span>,
        <span class="str">"X2 fan is too loud during gaming sessions."</span>,
        <span class="str">"X3 charges from 0 to 80% in just 30 minutes!"</span>,
        <span class="str">"X1 keyboard flexes, otherwise solid laptop."</span>,
        <span class="str">"Returned X3 — defective on arrival."</span>,
        <span class="str">"X2 OLED screen is gorgeous, deep blacks."</span>,
        <span class="str">"X3 webcam quality is mediocre at best."</span>,
        <span class="str">"X1 customer support resolved my issue in 1 day."</span>,
        <span class="str">"X2 build quality feels premium, worth the price."</span>
    ]
})

<span class="fn">print</span>(<span class="str">"customers:"</span>, df_customers.shape, <span class="str">"| orders:"</span>, df_orders.shape,
      <span class="str">"| reviews:"</span>, df_reviews.shape)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds three DataFrames — <code>df_customers</code>, <code>df_orders</code>, <code>df_reviews</code> — joined by <code>customer_id</code> and <code>product</code> so the agent can cross-reference them. 2) <code>rng = np.random.RandomState(42)</code> seeds every random pick so results are reproducible across reruns. 3) Five customers across three countries and tiers give the profile tool enough variety to test routing. 4) Twenty orders and ten reviews keep the demo small but realistic — same shape (foreign keys, status enums, free-text content) as a real e-commerce slice.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Tool 1 — review retriever (runnable retrieval)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

vec = <span class="fn">TfidfVectorizer</span>(ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">1</span>).<span class="fn">fit</span>(df_reviews[<span class="str">"text"</span>])
X = vec.<span class="fn">transform</span>(df_reviews[<span class="str">"text"</span>])

<span class="kw">def</span> <span class="fn">review_search</span>(query, k=<span class="num">4</span>, product=<span class="kw">None</span>):
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, X).<span class="fn">ravel</span>()
    idx = np.<span class="fn">argsort</span>(-sims)
    out = df_reviews.iloc[idx].<span class="fn">assign</span>(score=sims[idx])
    <span class="kw">if</span> product: out = out[out[<span class="str">"product"</span>] == product]
    <span class="kw">return</span> out.<span class="fn">head</span>(k)[[<span class="str">"review_id"</span>,<span class="str">"product"</span>,<span class="str">"text"</span>,<span class="str">"score"</span>]]

<span class="fn">print</span>(<span class="fn">review_search</span>(<span class="str">"X3 firmware problems"</span>, k=<span class="num">3</span>, product=<span class="str">"X3"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Fits a unigram + bigram <code>TfidfVectorizer</code> over <code>df_reviews["text"]</code> — the same shape as embedding-the-corpus once at index time. 2) <code>review_search(query, k, product)</code> vectorises the query, computes cosine similarity, and sorts the indices in descending order. 3) The optional <code>product</code> filter is applied <em>after</em> ranking — a stand-in for vector-store metadata filters. 4) Returning the four canonical columns (<code>review_id, product, text, score</code>) gives the agent stable fields to cite back as <code>[review N]</code>.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Tool 2 — order lookup (runnable)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">customer_orders</span>(customer_id, status=<span class="kw">None</span>):
    sub = df_orders[df_orders[<span class="str">"customer_id"</span>] == customer_id]
    <span class="kw">if</span> status: sub = sub[sub[<span class="str">"status"</span>] == status]
    <span class="kw">return</span> sub.<span class="fn">sort_values</span>(<span class="str">"order_id"</span>)

<span class="kw">def</span> <span class="fn">total_spent</span>(customer_id):
    <span class="kw">return</span> <span class="fn">float</span>(df_orders.loc[
        (df_orders[<span class="str">"customer_id"</span>] == customer_id) &
        (df_orders[<span class="str">"status"</span>] != <span class="str">"returned"</span>), <span class="str">"amount"</span>].<span class="fn">sum</span>())

<span class="fn">print</span>(<span class="str">"Ada (101) orders:"</span>)
<span class="fn">print</span>(<span class="fn">customer_orders</span>(<span class="num">101</span>))
<span class="fn">print</span>(<span class="str">"Total spent:"</span>, <span class="fn">round</span>(<span class="fn">total_spent</span>(<span class="num">101</span>), <span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>customer_orders(customer_id, status)</code> filters <code>df_orders</code> by id, then optionally by status — a stand-in for the parameterised <code>WHERE</code> clause an SQL agent would emit. 2) <code>.sort_values("order_id")</code> guarantees a stable order so the agent can show "most recent N" deterministically. 3) <code>total_spent(customer_id)</code> excludes <code>returned</code> rows before summing — small detail that matters when the LLM cites lifetime value to the user. 4) Both functions return plain pandas; promote them to <code>@tool</code> and you have the read-only side of a real order toolkit.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Tool 3 — customer profile (runnable)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">customer_profile</span>(customer_id):
    row = df_customers[df_customers[<span class="str">"customer_id"</span>] == customer_id]
    <span class="kw">if</span> row.empty: <span class="kw">return</span> <span class="kw">None</span>
    <span class="kw">return</span> row.iloc[<span class="num">0</span>].<span class="fn">to_dict</span>()

<span class="fn">print</span>(<span class="fn">customer_profile</span>(<span class="num">103</span>))   <span class="cm"># {'customer_id':103,'name':'Cem','tier':'gold','country':'DE'}</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>customer_profile(customer_id)</code> looks the row up in <code>df_customers</code> and returns it as a dict — clean for grounding the system prompt. 2) The empty-row guard returns <code>None</code> so the agent can decide whether to ask for clarification or fall back to a generic greeting. 3) Returning a dict instead of a Series keeps the tool serialisable for LangChain's <code>ToolMessage</code> wire format. 4) The printed output matches what <code>get_profile</code> will hand to the LLM — name, tier, and country, the three fields the system prompt asks the model to personalise on.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. End-to-end orchestration (runnable simulation)</h2>
<p class="l-text">Below is a deterministic stand-in for the LLM-driven agent. Same shape: route → call tools → assemble grounded answer with citations. In production you replace the rule-based router with a small LLM call and the synthesis with a chat-model call.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">route</span>(question):
    q = question.<span class="fn">lower</span>()
    <span class="kw">if</span> <span class="fn">any</span>(w <span class="kw">in</span> q <span class="kw">for</span> w <span class="kw">in</span> [<span class="str">"order"</span>,<span class="str">"spent"</span>,<span class="str">"return"</span>,<span class="str">"delivered"</span>]):
        <span class="kw">return</span> <span class="str">"orders"</span>
    <span class="kw">if</span> <span class="fn">any</span>(w <span class="kw">in</span> q <span class="kw">for</span> w <span class="kw">in</span> [<span class="str">"review"</span>,<span class="str">"complaint"</span>,<span class="str">"feedback"</span>]):
        <span class="kw">return</span> <span class="str">"reviews"</span>
    <span class="kw">return</span> <span class="str">"general"</span>

<span class="kw">def</span> <span class="fn">synthesize</span>(question, profile, context):
    <span class="kw">return</span> (f<span class="str">"For customer {profile['name']} ({profile['tier']} tier, "</span>
            f<span class="str">"{profile['country']}), based on {len(context)} retrieved "</span>
            f<span class="str">"records:\\n  "</span> + <span class="str">"\\n  "</span>.<span class="fn">join</span>(context))

<span class="kw">def</span> <span class="fn">answer</span>(customer_id, question):
    profile = <span class="fn">customer_profile</span>(customer_id)
    <span class="kw">if</span> profile <span class="kw">is</span> <span class="kw">None</span>: <span class="kw">return</span> <span class="str">"Unknown customer."</span>
    intent = <span class="fn">route</span>(question)

    <span class="kw">if</span> intent == <span class="str">"reviews"</span>:
        hits = <span class="fn">review_search</span>(question, k=<span class="num">3</span>)
        ctx  = [f<span class="str">"[review {r.review_id}] {r.text}"</span> <span class="kw">for</span> r <span class="kw">in</span> hits.<span class="fn">itertuples</span>()]
        <span class="kw">return</span> <span class="fn">synthesize</span>(question, profile, ctx)

    <span class="kw">if</span> intent == <span class="str">"orders"</span>:
        spent = <span class="fn">total_spent</span>(customer_id)
        recent = <span class="fn">customer_orders</span>(customer_id).<span class="fn">tail</span>(<span class="num">3</span>)
        ctx = [f<span class="str">"[order {r.order_id}] product={r.product}, amount={r.amount}, status={r.status}"</span>
               <span class="kw">for</span> r <span class="kw">in</span> recent.<span class="fn">itertuples</span>()]
        ctx.<span class="fn">append</span>(f<span class="str">"[total_spent] $ {spent:.2f}"</span>)
        <span class="kw">return</span> <span class="fn">synthesize</span>(question, profile, ctx)

    <span class="kw">return</span> f<span class="str">"Hi {profile['name']}, how can I help?"</span>

<span class="fn">print</span>(<span class="fn">answer</span>(<span class="num">101</span>, <span class="str">"Show me my recent orders and total spent."</span>))
<span class="fn">print</span>()
<span class="fn">print</span>(<span class="fn">answer</span>(<span class="num">103</span>, <span class="str">"What complaints exist about X3 firmware?"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>route(question)</code> classifies intent by keyword — three buckets, default to general — the same job an LLM router would do, just deterministic for testing. 2) <code>synthesize(question, profile, context)</code> formats the final reply with the customer's name/tier so every answer is personalised. 3) <code>answer(customer_id, question)</code> orchestrates profile lookup, routing, the matched tool call, and synthesis — the same control flow an <code>AgentExecutor</code> runs under the hood. 4) The two test calls demonstrate both branches firing on the same customer/question shape — proof the data flow scales to any intent you add later.</p>
<p class="l-text"><strong>What it does:</strong> for any customer, classifies the intent, calls the right tool, and assembles a profile-aware grounded answer. Replace <code>route</code> with an LLM router and <code>synthesize</code> with a ChatPromptTemplate to get the production version — the data flow is identical.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Production-grade version (LangChain demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain.agents <span class="kw">import</span> create_tool_calling_agent, AgentExecutor
<span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate, MessagesPlaceholder

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">search_reviews</span>(query: <span class="ty">str</span>, product: <span class="ty">str</span> = <span class="str">""</span>) -> <span class="ty">list</span>:
    <span class="str">"""Search customer reviews semantically; optional product filter (X1/X2/X3)."""</span>
    df = <span class="fn">review_search</span>(query, k=<span class="num">4</span>, product=product <span class="kw">or</span> <span class="kw">None</span>)
    <span class="kw">return</span> df.<span class="fn">to_dict</span>(<span class="str">"records"</span>)

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">get_orders</span>(customer_id: <span class="ty">int</span>, status: <span class="ty">str</span> = <span class="str">""</span>) -> <span class="ty">list</span>:
    <span class="str">"""Return recent orders for a customer; optional status filter."""</span>
    <span class="kw">return</span> <span class="fn">customer_orders</span>(customer_id, status <span class="kw">or</span> <span class="kw">None</span>).<span class="fn">to_dict</span>(<span class="str">"records"</span>)

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">get_profile</span>(customer_id: <span class="ty">int</span>) -> <span class="ty">dict</span>:
    <span class="str">"""Return customer name, tier, country for grounding."""</span>
    <span class="kw">return</span> <span class="fn">customer_profile</span>(customer_id) <span class="kw">or</span> {}

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"You are the support assistant. ALWAYS call get_profile first, "</span>
               <span class="str">"then use search_reviews / get_orders. Cite [review N] / [order N]."</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"history"</span>),
    (<span class="str">"human"</span>, <span class="str">"Customer {customer_id}: {input}"</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"agent_scratchpad"</span>)
])

agent = <span class="fn">create_tool_calling_agent</span>(llm, [search_reviews, get_orders, get_profile], prompt)
exec_ = <span class="fn">AgentExecutor</span>(agent=agent,
                      tools=[search_reviews, get_orders, get_profile],
                      max_iterations=<span class="num">5</span>, handle_parsing_errors=<span class="kw">True</span>)

<span class="cm"># Wrap with RunnableWithMessageHistory (L8) for multi-turn memory.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`create_tool_calling_agent\` (or \`create_react_agent\`) bundles a model, prompt, and tool list into an agent that can iterate. 2) \`AgentExecutor(agent=..., tools=..., max_iterations=N)\` is the runtime: it runs the loop — model decides → tool runs → observation → model decides — until the agent emits a final answer. 3) \`executor.invoke({'input': '...'})\` returns a dict with the final output and an \`intermediate_steps\` log of every tool call. 4) Set \`max_iterations\` and \`early_stopping_method='generate'\` to bound cost; pair with LangSmith tracing to debug what the model picked at each step.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">The full capstone agent in pure Python: profile lookup -> review retrieval (TF-IDF) -> order lookup -> answer template. Runs against the preamble's df_customers / df_orders / df_reviews — no LLM, just orchestration.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># End-to-end support agent without LLM
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

reviews = df_reviews.head(80).reset_index(drop=True)
vec = TfidfVectorizer(ngram_range=(1,2)).fit(reviews["text"])
X   = vec.transform(reviews["text"])

def get_profile(customer_id):
    row = df_customers[df_customers["customer_id"] == customer_id]
    return row.iloc[0].to_dict() if not row.empty else {}

def get_orders(customer_id):
    return df_orders[df_orders["customer_id"] == customer_id].head(3).to_dict("records")

def search_reviews(query, k=2):
    sims = cosine_similarity(vec.transform([query]), X).ravel()
    top = np.argsort(-sims)[:k]
    return [{"id": int(i), "text": reviews.loc[i, "text"], "score": float(sims[i])} for i in top]

def support_agent(customer_id, question):
    print(f"-> get_profile({customer_id})")
    profile = get_profile(customer_id)
    print(f"-> get_orders({customer_id})")
    orders  = get_orders(customer_id)
    print(f"-> search_reviews('{question[:30]}...')")
    hits    = search_reviews(question, k=2)
    return (f"Hello {profile.get('name','customer')}!\n"
            f"You have {len(orders)} recent orders.\n"
            f"Top relevant feedback: '{hits[0]['text'][:80]}' [review {hits[0]['id']}]")

print(support_agent(customer_id=101, question="Is the battery any good?"))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>support_agent(customer_id, question)</code> hardcodes the production order: always pull the profile first, then the orders for grounding, then the topical reviews. 2) <code>get_profile</code> returns customer metadata; the empty-row branch falls back to a generic <code>"customer"</code> label so the reply never crashes. 3) <code>search_reviews</code> mirrors the production retriever — TF-IDF + cosine — and returns id, text, score for citation. 4) The final string template combines profile name, order count, and the top review's text/id — the same minimal grounded reply the LLM version would produce.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Production checklist</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Rate limit + auth</div><div class="calc-card-desc">JWT or API key per customer. Per-IP and per-customer caps.</div></div>
<div class="calc-card"><div class="calc-card-title">PII filter</div><div class="calc-card-desc">Mask email/phone/credit-card before the LLM ever sees them.</div></div>
<div class="calc-card"><div class="calc-card-title">Prompt injection guard</div><div class="calc-card-desc">Strip or escape user content that contains "ignore previous instructions" patterns; structured tool args help.</div></div>
<div class="calc-card"><div class="calc-card-title">Eval set</div><div class="calc-card-desc">100-200 frozen Q-A pairs. Run RAGAS nightly; fail the build if faithfulness drops 5%+.</div></div>
<div class="calc-card"><div class="calc-card-title">Fallback model</div><div class="calc-card-desc">.with_fallbacks([Claude]) — survive provider outages.</div></div>
<div class="calc-card"><div class="calc-card-title">Cost guardrail</div><div class="calc-card-desc">Hard daily $ cap per customer; alert at 80%.</div></div>
<div class="calc-card"><div class="calc-card-title">Observability</div><div class="calc-card-desc">LangSmith traces with user_id, session_id, prompt_version.</div></div>
<div class="calc-card"><div class="calc-card-title">Safe SQL role</div><div class="calc-card-desc">Read-only DB user for the order tool.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Capstone scoreboard</h2>
<div id="lc-l12-final-en" style="width:100%;height:440px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var cats=['retrieval recall','answer faithfulness','answer relevancy',
            'avg latency 1/x*100','user CSAT'];
  var v=[91, 94, 92, 60, 88];
  var data=[{type:'scatterpolar',r:v.concat([v[0]]),
    theta:cats.concat([cats[0]]),fill:'toself',
    line:{color:T,width:2},marker:{size:8,color:T}}];
  var layout={title:'Customer-support RAG bot — final eval (illustrative)',
    polar:{radialaxis:{visible:true,range:[0,100]}},
    margin:{t:80,b:60,l:80,r:80},
    paper_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color},
    showlegend:false};
  Plotly.newPlot('lc-l12-final-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">10. Where to go next</h2>
<div class="calc-steps">
<div class="calc-step"><strong>LangGraph</strong> — explicit state-machine agents for complex workflows (multi-step research, code generation).</div>
<div class="calc-step"><strong>Fine-tune a small model</strong> for the high-volume cheap path; reserve gpt-4o for hard cases (course HuggingFace track).</div>
<div class="calc-step"><strong>Multi-modal RAG</strong> — index PDF figures, screenshots, audio transcripts.</div>
<div class="calc-step"><strong>Online learning loop</strong> — log thumbs-up/down on responses, feed into a continual eval set, retrain rerankers.</div>
<div class="calc-step"><strong>Read the LangChain blog and DSPy paper</strong> — the field moves quarterly; stay close to the source.</div>
</div>
<p class="l-text"><strong>You finished the LangChain &amp; RAG course.</strong> You can now compose chat models, prompts, retrievers, agents, and memory; build, evaluate, and ship a production RAG system. Pair this with the NLP and Deep Learning tracks and you have the full toolkit a senior NLP / LLM engineer brings to work.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş — capstone.</strong> Pazartesi bir SaaS şirketine girdiğinizi düşünün ve "Bize, yorumlarımız, siparişlerimiz ve müşteri profillerimizi kullanarak müşteri sorularını yanıtlayan bir chatbot kurun. Cuma teslim." dediler. Bu ders o oyun planıdır. L1-L11'deki <em>her şeyi</em> tek sisteme dikiyoruz: yorumlar üzerinde hibrit retrieval, siparişler için SQL agent, müşteri farkındalı memory, reranking, faithfulness eval, gözlemlenebilirlik ve üretim kontrol listesi. Sonunda herhangi bir alana — finans, sağlık, hukuk, e-ticaret — taşıyabileceğiniz mimari şablona sahip olacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>5 katmanlı bir LLM uygulaması mimarisi kurmayı: önyüz, gateway, orkestrasyon, retrieval, model</li>
<li>Yorumlar üzerinde BM25 anahtar kelime ve yoğun embedding aramasını birleştiren hibrit retrieval kurmayı</li>
<li>Sipariş sorularını güvenli parametrelenmiş sorgularla yanıtlayan bir SQL agent bağlamayı</li>
<li>user_id ile anahtarlanan, Redis destekli oturumlu müşteri farkındalı memory eklemeyi</li>
<li>Adayları rerank etmeyi ve dağıtım öncesi RAGAS ile faithfulness eval çalıştırmayı</li>
<li>Chain'i LangServe, LangSmith tracing, semantic cache ve rate limit ile yayınlamayı</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Mimari genel bakış</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Önyüz:</strong> Next.js / Streamlit — token'ları SSE ile akıtır.</div>
<div class="calc-step"><strong>Gateway:</strong> FastAPI / LangServe + rate limit + auth.</div>
<div class="calc-step"><strong>Router LLM:</strong> niyeti sınıflar → yorum arama / sipariş sorgusu / genel sohbet.</div>
<div class="calc-step"><strong>Tool'lar:</strong> df_reviews üzerinde hibrit retriever, df_orders üzerinde SQL agent, df_customers üzerinde profil sorgusu.</div>
<div class="calc-step"><strong>Reranker:</strong> Cohere/BGE rerank top-25 → top-4.</div>
<div class="calc-step"><strong>LLM:</strong> varsayılan gpt-4o-mini, karmaşık sorgular için gpt-4o (router kararı).</div>
<div class="calc-step"><strong>Memory:</strong> pencereli (son 6) + yuvarlanan özet + müşteri başına vektör recall.</div>
<div class="calc-step"><strong>Gözlemlenebilirlik:</strong> LangSmith trace'leri; donmuş 100-soru setinde gece RAGAS eval.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Konuşacağımız veri setleri (çalışan)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">RandomState</span>(<span class="num">42</span>)

df_customers = pd.<span class="fn">DataFrame</span>({
    <span class="str">"customer_id"</span>: [<span class="num">101</span>,<span class="num">102</span>,<span class="num">103</span>,<span class="num">104</span>,<span class="num">105</span>],
    <span class="str">"name"</span>:   [<span class="str">"Ada"</span>,<span class="str">"Berk"</span>,<span class="str">"Cem"</span>,<span class="str">"Deniz"</span>,<span class="str">"Esra"</span>],
    <span class="str">"tier"</span>:   [<span class="str">"gold"</span>,<span class="str">"silver"</span>,<span class="str">"gold"</span>,<span class="str">"bronze"</span>,<span class="str">"silver"</span>],
    <span class="str">"country"</span>:[<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>,<span class="str">"FR"</span>,<span class="str">"TR"</span>]
})

df_orders = pd.<span class="fn">DataFrame</span>({
    <span class="str">"order_id"</span>:   <span class="fn">range</span>(<span class="num">5001</span>, <span class="num">5021</span>),
    <span class="str">"customer_id"</span>:rng.<span class="fn">choice</span>([<span class="num">101</span>,<span class="num">102</span>,<span class="num">103</span>,<span class="num">104</span>,<span class="num">105</span>], <span class="num">20</span>),
    <span class="str">"product"</span>:    rng.<span class="fn">choice</span>([<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>], <span class="num">20</span>),
    <span class="str">"amount"</span>:     np.<span class="fn">round</span>(rng.<span class="fn">gamma</span>(<span class="num">3</span>, <span class="num">60</span>, <span class="num">20</span>), <span class="num">2</span>),
    <span class="str">"status"</span>:     rng.<span class="fn">choice</span>([<span class="str">"delivered"</span>,<span class="str">"returned"</span>,<span class="str">"pending"</span>], <span class="num">20</span>, p=[<span class="num">.7</span>,<span class="num">.2</span>,<span class="num">.1</span>])
})

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"review_id"</span>:  <span class="fn">range</span>(<span class="num">1</span>, <span class="num">11</span>),
    <span class="str">"customer_id"</span>:rng.<span class="fn">choice</span>([<span class="num">101</span>,<span class="num">102</span>,<span class="num">103</span>,<span class="num">104</span>,<span class="num">105</span>], <span class="num">10</span>),
    <span class="str">"product"</span>:    rng.<span class="fn">choice</span>([<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>], <span class="num">10</span>),
    <span class="str">"text"</span>:[
        <span class="str">"X3 firmware güncellemesi cihazı bozdu, destek faydasız."</span>,
        <span class="str">"X1 pili harika, 12 saat rahat dayanıyor."</span>,
        <span class="str">"X2 fanı oyunda çok sesli."</span>,
        <span class="str">"X3 0'dan %80'e sadece 30 dakikada şarj oluyor!"</span>,
        <span class="str">"X1 klavyesi esniyor, gerisi sağlam laptop."</span>,
        <span class="str">"X3'ü iade ettim — kutudan arızalı çıktı."</span>,
        <span class="str">"X2 OLED ekran muhteşem, derin siyahlar."</span>,
        <span class="str">"X3 webcam kalitesi en iyi ihtimalle vasat."</span>,
        <span class="str">"X1 müşteri desteği sorunumu 1 günde çözdü."</span>,
        <span class="str">"X2 yapı kalitesi premium hissettiriyor, fiyatına değer."</span>
    ]
})

<span class="fn">print</span>(<span class="str">"customers:"</span>, df_customers.shape, <span class="str">"| orders:"</span>, df_orders.shape,
      <span class="str">"| reviews:"</span>, df_reviews.shape)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Üç DataFrame kurar — <code>df_customers</code>, <code>df_orders</code>, <code>df_reviews</code> — <code>customer_id</code> ve <code>product</code> ile birleşik; agent çapraz referans verebilir. 2) <code>rng = np.random.RandomState(42)</code> her rastgele seçimi tohumlar, çalıştırmalar arasında sonuçlar tekrarlanabilir kalır. 3) Üç ülke ve kademede beş müşteri, profil aracının yönlendirmesini test etmek için yeterli çeşitlilik verir. 4) Yirmi sipariş ve on yorum demoyu küçük ama gerçekçi tutar — gerçek bir e-ticaret diliminin aynı şekli (yabancı anahtarlar, durum enum'ları, serbest metin).</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Araç 1 — yorum retriever (çalışan retrieval)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

vec = <span class="fn">TfidfVectorizer</span>(ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">1</span>).<span class="fn">fit</span>(df_reviews[<span class="str">"text"</span>])
X = vec.<span class="fn">transform</span>(df_reviews[<span class="str">"text"</span>])

<span class="kw">def</span> <span class="fn">review_search</span>(query, k=<span class="num">4</span>, product=<span class="kw">None</span>):
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, X).<span class="fn">ravel</span>()
    idx = np.<span class="fn">argsort</span>(-sims)
    out = df_reviews.iloc[idx].<span class="fn">assign</span>(score=sims[idx])
    <span class="kw">if</span> product: out = out[out[<span class="str">"product"</span>] == product]
    <span class="kw">return</span> out.<span class="fn">head</span>(k)[[<span class="str">"review_id"</span>,<span class="str">"product"</span>,<span class="str">"text"</span>,<span class="str">"score"</span>]]

<span class="fn">print</span>(<span class="fn">review_search</span>(<span class="str">"X3 firmware sorunları"</span>, k=<span class="num">3</span>, product=<span class="str">"X3"</span>))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>df_reviews["text"]</code> üzerinde unigram + bigram <code>TfidfVectorizer</code> fit eder — indeks zamanında corpus'u bir kez embed etmenin aynı şekli. 2) <code>review_search(query, k, product)</code> sorguyu vektörleştirir, kosinüs benzerliği hesaplar ve indeksleri azalan sırada sıralar. 3) Opsiyonel <code>product</code> filtresi sıralamadan <em>sonra</em> uygulanır — vektör-deposu metadata filtrelerinin yerine geçer. 4) Dört kanonik sütunu (<code>review_id, product, text, score</code>) döndürmek agent'a <code>[review N]</code> olarak atıf yapabileceği sabit alanlar verir.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Araç 2 — sipariş sorgusu (çalışan)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">customer_orders</span>(customer_id, status=<span class="kw">None</span>):
    sub = df_orders[df_orders[<span class="str">"customer_id"</span>] == customer_id]
    <span class="kw">if</span> status: sub = sub[sub[<span class="str">"status"</span>] == status]
    <span class="kw">return</span> sub.<span class="fn">sort_values</span>(<span class="str">"order_id"</span>)

<span class="kw">def</span> <span class="fn">total_spent</span>(customer_id):
    <span class="kw">return</span> <span class="fn">float</span>(df_orders.loc[
        (df_orders[<span class="str">"customer_id"</span>] == customer_id) &
        (df_orders[<span class="str">"status"</span>] != <span class="str">"returned"</span>), <span class="str">"amount"</span>].<span class="fn">sum</span>())

<span class="fn">print</span>(<span class="str">"Ada (101) siparişleri:"</span>)
<span class="fn">print</span>(<span class="fn">customer_orders</span>(<span class="num">101</span>))
<span class="fn">print</span>(<span class="str">"Toplam harcama:"</span>, <span class="fn">round</span>(<span class="fn">total_spent</span>(<span class="num">101</span>), <span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>customer_orders(customer_id, status)</code> <code>df_orders</code>'i önce id'ye, sonra opsiyonel olarak duruma göre filtreler — SQL agent'ın üreteceği parametrelenmiş <code>WHERE</code> cümlesinin yerine geçer. 2) <code>.sort_values("order_id")</code> stabil bir sıralama garanti eder; agent "son N" gösterimini deterministik yapabilir. 3) <code>total_spent(customer_id)</code> toplamadan önce <code>returned</code> satırları hariç tutar — LLM kullanıcıya yaşam boyu değer söylediğinde önemli bir küçük detay. 4) İkisi de düz pandas döndürür; <code>@tool</code> ile süsleyin, gerçek bir sipariş toolkit'inin salt-okunur tarafını elde edersiniz.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Araç 3 — müşteri profili (çalışan)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">customer_profile</span>(customer_id):
    row = df_customers[df_customers[<span class="str">"customer_id"</span>] == customer_id]
    <span class="kw">if</span> row.empty: <span class="kw">return</span> <span class="kw">None</span>
    <span class="kw">return</span> row.iloc[<span class="num">0</span>].<span class="fn">to_dict</span>()

<span class="fn">print</span>(<span class="fn">customer_profile</span>(<span class="num">103</span>))   <span class="cm"># {'customer_id':103,'name':'Cem','tier':'gold','country':'DE'}</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>customer_profile(customer_id)</code> <code>df_customers</code>'ta satırı bulur ve dict olarak döndürür — system prompt'u topraklamak için temiz. 2) Boş-satır koruması <code>None</code> döndürür; agent açıklama isteyip istemeyeceğine veya genel bir karşılamaya düşeceğine karar verebilir. 3) Series yerine dict döndürmek aracı LangChain'in <code>ToolMessage</code> wire formatı için serileştirilebilir tutar. 4) Basılan çıktı <code>get_profile</code>'in LLM'e vereceği şeyin aynısıdır — system prompt'un kişiselleştirme için modelden istediği üç alan: isim, kademe ve ülke.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Uçtan uca orkestrasyon (çalışan simülasyon)</h2>
<p class="l-text">Aşağıda LLM-tahrikli agent için deterministik bir taklit var. Aynı şekil: yönlendir → araçları çağır → atıflarla topraklı cevap kur. Üretimde kural-tabanlı router'ı küçük bir LLM çağrısıyla, sentezi ise sohbet-modeli çağrısıyla değiştirirsiniz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">route</span>(question):
    q = question.<span class="fn">lower</span>()
    <span class="kw">if</span> <span class="fn">any</span>(w <span class="kw">in</span> q <span class="kw">for</span> w <span class="kw">in</span> [<span class="str">"sipariş"</span>,<span class="str">"harcama"</span>,<span class="str">"iade"</span>,<span class="str">"teslim"</span>]):
        <span class="kw">return</span> <span class="str">"orders"</span>
    <span class="kw">if</span> <span class="fn">any</span>(w <span class="kw">in</span> q <span class="kw">for</span> w <span class="kw">in</span> [<span class="str">"yorum"</span>,<span class="str">"şikayet"</span>,<span class="str">"geri bildirim"</span>]):
        <span class="kw">return</span> <span class="str">"reviews"</span>
    <span class="kw">return</span> <span class="str">"general"</span>

<span class="kw">def</span> <span class="fn">synthesize</span>(question, profile, context):
    <span class="kw">return</span> (f<span class="str">"Müşteri {profile['name']} için ({profile['tier']} kademe, "</span>
            f<span class="str">"{profile['country']}), {len(context)} kayıt temelinde:\\n  "</span>
            + <span class="str">"\\n  "</span>.<span class="fn">join</span>(context))

<span class="kw">def</span> <span class="fn">answer</span>(customer_id, question):
    profile = <span class="fn">customer_profile</span>(customer_id)
    <span class="kw">if</span> profile <span class="kw">is</span> <span class="kw">None</span>: <span class="kw">return</span> <span class="str">"Bilinmeyen müşteri."</span>
    intent = <span class="fn">route</span>(question)

    <span class="kw">if</span> intent == <span class="str">"reviews"</span>:
        hits = <span class="fn">review_search</span>(question, k=<span class="num">3</span>)
        ctx  = [f<span class="str">"[review {r.review_id}] {r.text}"</span> <span class="kw">for</span> r <span class="kw">in</span> hits.<span class="fn">itertuples</span>()]
        <span class="kw">return</span> <span class="fn">synthesize</span>(question, profile, ctx)

    <span class="kw">if</span> intent == <span class="str">"orders"</span>:
        spent = <span class="fn">total_spent</span>(customer_id)
        recent = <span class="fn">customer_orders</span>(customer_id).<span class="fn">tail</span>(<span class="num">3</span>)
        ctx = [f<span class="str">"[order {r.order_id}] ürün={r.product}, tutar={r.amount}, durum={r.status}"</span>
               <span class="kw">for</span> r <span class="kw">in</span> recent.<span class="fn">itertuples</span>()]
        ctx.<span class="fn">append</span>(f<span class="str">"[total_spent] ₺ {spent:.2f}"</span>)
        <span class="kw">return</span> <span class="fn">synthesize</span>(question, profile, ctx)

    <span class="kw">return</span> f<span class="str">"Merhaba {profile['name']}, nasıl yardımcı olabilirim?"</span>

<span class="fn">print</span>(<span class="fn">answer</span>(<span class="num">101</span>, <span class="str">"Son siparişlerimi ve toplam harcamamı göster."</span>))
<span class="fn">print</span>()
<span class="fn">print</span>(<span class="fn">answer</span>(<span class="num">103</span>, <span class="str">"X3 firmware hakkında ne şikayetler var?"</span>))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>route(question)</code> niyeti anahtar kelimeyle sınıflandırır — üç kova, varsayılan olarak genel — bir LLM router'ın yapacağı işin aynısı, sadece test için deterministik. 2) <code>synthesize(question, profile, context)</code> final yanıtı müşterinin adı/kademesiyle formatlar; her cevap kişiselleştirilir. 3) <code>answer(customer_id, question)</code> profil bakışını, yönlendirmeyi, eşleşen tool çağrısını ve sentezi orkestre eder — bir <code>AgentExecutor</code>'ün perde arkasında çalıştırdığı aynı kontrol akışı. 4) İki test çağrısı aynı müşteri/soru şekli üzerinde her iki dalın da tetiklendiğini gösterir — veri akışının sonradan ekleyeceğiniz herhangi bir niyete ölçeklendiğinin kanıtı.</p>
<p class="l-text"><strong>Ne yapar:</strong> herhangi bir müşteri için niyeti sınıflar, doğru aracı çağırır ve profil farkındalı topraklı bir cevap kurar. <code>route</code>'u bir LLM router ile, <code>synthesize</code>'ı ChatPromptTemplate ile değiştirin — üretim versiyonunu alırsınız; veri akışı aynıdır.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Üretim seviyesi versiyon (LangChain demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain.agents <span class="kw">import</span> create_tool_calling_agent, AgentExecutor
<span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate, MessagesPlaceholder

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">search_reviews</span>(query: <span class="ty">str</span>, product: <span class="ty">str</span> = <span class="str">""</span>) -> <span class="ty">list</span>:
    <span class="str">"""Müşteri yorumlarını anlamsal olarak ara; opsiyonel ürün filtresi (X1/X2/X3)."""</span>
    df = <span class="fn">review_search</span>(query, k=<span class="num">4</span>, product=product <span class="kw">or</span> <span class="kw">None</span>)
    <span class="kw">return</span> df.<span class="fn">to_dict</span>(<span class="str">"records"</span>)

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">get_orders</span>(customer_id: <span class="ty">int</span>, status: <span class="ty">str</span> = <span class="str">""</span>) -> <span class="ty">list</span>:
    <span class="str">"""Müşterinin son siparişlerini döndür; opsiyonel durum filtresi."""</span>
    <span class="kw">return</span> <span class="fn">customer_orders</span>(customer_id, status <span class="kw">or</span> <span class="kw">None</span>).<span class="fn">to_dict</span>(<span class="str">"records"</span>)

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">get_profile</span>(customer_id: <span class="ty">int</span>) -> <span class="ty">dict</span>:
    <span class="str">"""Topraklamak için müşterinin adı, kademesi, ülkesi."""</span>
    <span class="kw">return</span> <span class="fn">customer_profile</span>(customer_id) <span class="kw">or</span> {}

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Destek asistanısın. ÖNCE her zaman get_profile çağır, "</span>
               <span class="str">"sonra search_reviews / get_orders kullan. [review N] / [order N] atıf yap."</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"history"</span>),
    (<span class="str">"human"</span>, <span class="str">"Müşteri {customer_id}: {input}"</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"agent_scratchpad"</span>)
])

agent = <span class="fn">create_tool_calling_agent</span>(llm, [search_reviews, get_orders, get_profile], prompt)
exec_ = <span class="fn">AgentExecutor</span>(agent=agent,
                      tools=[search_reviews, get_orders, get_profile],
                      max_iterations=<span class="num">5</span>, handle_parsing_errors=<span class="kw">True</span>)

<span class="cm"># Çok turlu memory için RunnableWithMessageHistory (L8) ile sar.</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) \`create_tool_calling_agent\` (veya \`create_react_agent\`) bir model, prompt ve tool listesini iterate edebilen bir agent içine paketler. 2) \`AgentExecutor(agent=..., tools=..., max_iterations=N)\` runtime'dır: döngüyü çalıştırır — model karar verir → tool çalışır → gözlem → model karar verir — agent nihai yanıtı üretene kadar. 3) \`executor.invoke({'input': '...'})\` nihai çıktı ve her tool çağrısının \`intermediate_steps\` log'unu içeren bir dict döndürür. 4) Maliyeti sınırlamak için \`max_iterations\` ve \`early_stopping_method='generate'\` ayarlayın; modelin her adımda ne seçtiğini debug için LangSmith tracing ile eşleştirin.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tam capstone agent saf Python'da: profil bakış -> yorum retrieval (TF-IDF) -> sipariş bakış -> yanıt template. Preamble'daki df_customers / df_orders / df_reviews üzerinde çalışır — LLM yok, sadece orkestrasyon.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># LLM olmadan uçtan uca destek agent'ı
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

reviews = df_reviews.head(80).reset_index(drop=True)
vec = TfidfVectorizer(ngram_range=(1,2)).fit(reviews["text"])
X   = vec.transform(reviews["text"])

def get_profile(customer_id):
    row = df_customers[df_customers["customer_id"] == customer_id]
    return row.iloc[0].to_dict() if not row.empty else {}

def get_orders(customer_id):
    return df_orders[df_orders["customer_id"] == customer_id].head(3).to_dict("records")

def search_reviews(query, k=2):
    sims = cosine_similarity(vec.transform([query]), X).ravel()
    top = np.argsort(-sims)[:k]
    return [{"id": int(i), "text": reviews.loc[i, "text"], "score": float(sims[i])} for i in top]

def support_agent(customer_id, question):
    print(f"-> get_profile({customer_id})")
    profile = get_profile(customer_id)
    print(f"-> get_orders({customer_id})")
    orders  = get_orders(customer_id)
    print(f"-> search_reviews('{question[:30]}...')")
    hits    = search_reviews(question, k=2)
    return (f"Merhaba {profile.get('name','müşteri')}!\n"
            f"{len(orders)} son siparişin var.\n"
            f"En alakalı geri bildirim: '{hits[0]['text'][:80]}' [review {hits[0]['id']}]")

print(support_agent(customer_id=101, question="Pil iyi mi?"))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>support_agent(customer_id, question)</code> üretim sırasını sabitler: önce her zaman profili çek, sonra topraklama için siparişleri, sonra konuyla ilgili yorumları. 2) <code>get_profile</code> müşteri metadata'sını döndürür; boş-satır dalı genel bir <code>"müşteri"</code> etiketine düşer; yanıt asla çökmez. 3) <code>search_reviews</code> üretim retriever'ını yansıtır — TF-IDF + kosinüs — ve atıf için id, text, score döndürür. 4) Final string template profil adını, sipariş sayısını ve en üst yorumun text/id'sini birleştirir — LLM versiyonunun üreteceği aynı minimal topraklı yanıt.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Üretim kontrol listesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Rate limit + auth</div><div class="calc-card-desc">Müşteri başına JWT veya API anahtarı. IP başına ve müşteri başına limit.</div></div>
<div class="calc-card"><div class="calc-card-title">PII filtresi</div><div class="calc-card-desc">LLM görmeden e-posta/telefon/kredi kartını maskele.</div></div>
<div class="calc-card"><div class="calc-card-title">Prompt injection koruması</div><div class="calc-card-desc">"Önceki talimatları yoksay" desenli kullanıcı içeriğini soyup escape et; yapılı tool argümanları yardım eder.</div></div>
<div class="calc-card"><div class="calc-card-title">Eval seti</div><div class="calc-card-desc">100-200 donmuş soru-cevap çifti. RAGAS'ı geceleri çalıştır; faithfulness %5+ düşerse build'i fail et.</div></div>
<div class="calc-card"><div class="calc-card-title">Fallback model</div><div class="calc-card-desc">.with_fallbacks([Claude]) — sağlayıcı kesintilerinden sağ çık.</div></div>
<div class="calc-card"><div class="calc-card-title">Maliyet bandı</div><div class="calc-card-desc">Müşteri başına günlük sert $ üst sınırı; %80'de uyarı.</div></div>
<div class="calc-card"><div class="calc-card-title">Gözlemlenebilirlik</div><div class="calc-card-desc">user_id, session_id, prompt_version'lı LangSmith trace'leri.</div></div>
<div class="calc-card"><div class="calc-card-title">Güvenli SQL rolü</div><div class="calc-card-desc">Sipariş aracı için salt-okunur DB kullanıcısı.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Capstone skor tablosu</h2>
<div id="lc-l12-final-tr" style="width:100%;height:440px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var cats=['retrieval recall','cevap faithfulness','cevap relevancy',
            'ortalama gecikme 1/x*100','kullanıcı CSAT'];
  var v=[91, 94, 92, 60, 88];
  var data=[{type:'scatterpolar',r:v.concat([v[0]]),
    theta:cats.concat([cats[0]]),fill:'toself',
    line:{color:T,width:2},marker:{size:8,color:T}}];
  var layout={title:'Müşteri-destek RAG botu — final eval (örnek)',
    polar:{radialaxis:{visible:true,range:[0,100]}},
    margin:{t:80,b:60,l:80,r:80},
    paper_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color},
    showlegend:false};
  Plotly.newPlot('lc-l12-final-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">10. Buradan nereye</h2>
<div class="calc-steps">
<div class="calc-step"><strong>LangGraph</strong> — karmaşık iş akışları için açık durum-makinesi agent'ları (çok adımlı araştırma, kod üretimi).</div>
<div class="calc-step"><strong>Yüksek hacimli ucuz hat için küçük bir modeli ince ayarlayın</strong>; gpt-4o'yu zor durumlara saklayın (HuggingFace track'i).</div>
<div class="calc-step"><strong>Multi-modal RAG</strong> — PDF figürü, ekran görüntüsü, ses transkriptlerini indeksleyin.</div>
<div class="calc-step"><strong>Online öğrenme döngüsü</strong> — yanıtlara thumbs-up/down logla, sürekli eval setine besle, reranker'ları yeniden eğit.</div>
<div class="calc-step"><strong>LangChain blog ve DSPy makalesini okuyun</strong> — alan üç ayda bir hareket eder; kaynağa yakın durun.</div>
</div>
<p class="l-text"><strong>LangChain &amp; RAG kursunu bitirdiniz.</strong> Artık sohbet modellerini, prompt'ları, retriever'ları, agent'ları ve memory'yi kompoze edebilir; bir üretim RAG sistemi inşa edebilir, değerlendirebilir ve gönderebilirsiniz. Bunu NLP ve Deep Learning track'leriyle eşleştirin — kıdemli bir NLP / LLM mühendisinin işe getirdiği tam alet kutusuna sahip olursunuz.</p>
</div>
`
};
