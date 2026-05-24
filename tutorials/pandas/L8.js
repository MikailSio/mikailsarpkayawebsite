window.PANDAS_L8 = {

en: `<p class="l-text"><strong>Text data is the heart of NLP, and Pandas is where you clean it.</strong> Tweets, reviews, log messages, support tickets, chat transcripts -- they all start as messy strings in a column. Before any model can learn from them, the strings have to be lowercased, stripped of URLs, freed of accents, tokenized, and filtered. That entire pipeline lives in the <code>.str</code> accessor.</p>

<p class="l-text">In this lesson you will learn to do every common text-cleaning operation in a fully vectorized way -- no Python <code>for</code> loops, no <code>.apply(lambda x: ...)</code>, just chained <code>.str</code> calls that scale to millions of rows. By the end, you will be able to take a raw tweet column and turn it into a clean token list ready for a TF-IDF or transformer model in under 20 lines.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Use the .str accessor to clean, slice, replace and split text columns</li><li>Match and extract patterns with regular expressions in pandas</li><li>Convert text columns to Categorical to save memory and order categories</li><li>Create ordered categoricals for sortable labels (e.g. low/medium/high)</li><li>Tokenize text into words and bag-of-words style frequency tables</li><li>Combine text features with numeric features for downstream ML</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why .str?</h2>

<p class="l-text">Imagine you have a CSV with one million tweets and you want to keep only the ones that contain "great" or "amazing", lowercased, with URLs removed. Doing it with a Python loop:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

clean = []
<span class="kw">for</span> row <span class="kw">in</span> df_tweets['text'].tolist():               <span class="cm"># &lt;-- explicit Python loop, slow!</span>
    t = row.<span class="fn">lower</span>()
    t = re.<span class="fn">sub</span>(r<span class="str">"http\\S+"</span>, <span class="str">""</span>, t)
    <span class="kw">if</span> <span class="str">"great"</span> <span class="kw">in</span> t <span class="kw">or</span> <span class="str">"amazing"</span> <span class="kw">in</span> t:
        clean.<span class="fn">append</span>(t)
<span class="cm"># 1M rows: ~5 minutes</span></code></pre></div>

<p class="l-text">Doing it with the <code>.str</code> accessor:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>cleaned = (df[<span class="str">"text"</span>]
           .<span class="ty">str</span>.<span class="fn">lower</span>()
           .<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"http\\S+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>))
mask = cleaned.<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"great|amazing"</span>, regex=<span class="kw">True</span>)
result = cleaned[mask]
<span class="cm"># 1M rows: ~2 seconds</span></code></pre></div>

<div class="calc-highlight"><strong>The difference is 100-200x.</strong> The <code>.str</code> accessor pushes the string operations down into Pandas/NumPy/C code, so you avoid the Python interpreter overhead per row. For NLP datasets with millions of texts, this is the difference between a coffee break and overnight.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vectorized</div><div class="card-body">Operates on the whole column in one call. No <code>for</code> loop, no <code>apply</code>. Most operations are 10-100x faster than the Python equivalent.</div></div>
<div class="calc-card"><div class="card-title">Chainable</div><div class="card-body">Each <code>.str</code> method returns a new Series, so you can chain: <code>s.str.lower().str.strip().str.replace("a","b")</code>. Reads top-down like a recipe.</div></div>
<div class="calc-card"><div class="card-title">NaN-safe</div><div class="card-body">By default, NaN values stay NaN through the chain instead of crashing. Compare to <code>str.lower()</code> on a Python None, which raises AttributeError.</div></div>
<div class="calc-card"><div class="card-title">Regex-aware</div><div class="card-body">Most methods accept <code>regex=True</code>. Pandas uses Python's <code>re</code> module under the hood, so any pattern that works in <code>re.sub</code> works in <code>.str.replace</code>.</div></div>
<div class="calc-card"><div class="card-title">Returns Series</div><div class="card-body">Results plug back into Pandas seamlessly: filter, groupby, merge, etc. No need to convert back from lists.</div></div>
<div class="calc-card"><div class="card-title">Discoverable</div><div class="card-body">Type <code>df["text"].str.</code> in IPython/Jupyter and tab-complete to see all methods. There are about 50 of them.</div></div>
</div>

<div class="l-note"><strong>How does it work?</strong> When you write <code>s.str</code>, Pandas returns a special <code>StringMethods</code> object. Method calls on it (<code>.lower()</code>, <code>.contains()</code>, etc.) iterate the underlying NumPy array in C, calling the appropriate string operation per element. The Python overhead is paid once, not per row.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Basic .str Methods</h2>

<p class="l-text">Start with the simple stuff. These are the <code>.str</code> versions of the methods you already know on Python strings, but now vectorized.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

s = pd.<span class="fn">Series</span>([
    <span class="str">"  Hello World  "</span>,
    <span class="str">"NLP is GREAT"</span>,
    <span class="str">"Deep Learning"</span>,
    <span class="str">"  pandas IS awesome  "</span>,
    <span class="kw">None</span>,                  <span class="cm"># NaN</span>
    <span class="str">"Transformers"</span>
])

<span class="cm"># Case operations</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">lower</span>())
<span class="cm"># 0       hello world</span>
<span class="cm"># 1      nlp is great</span>
<span class="cm"># 2     deep learning</span>
<span class="cm"># 3    pandas is awesome</span>
<span class="cm"># 4              NaN     &lt;-- NaN propagates safely</span>
<span class="cm"># 5      transformers</span>

<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">upper</span>())          <span class="cm"># ALL UPPERCASE</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">title</span>())          <span class="cm"># Title Case Of Each Word</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">capitalize</span>())     <span class="cm"># Only first letter uppercase</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">swapcase</span>())       <span class="cm"># Flip every letter's case</span>

<span class="cm"># Whitespace</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">strip</span>())          <span class="cm"># remove leading/trailing whitespace</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">lstrip</span>())         <span class="cm"># left only</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">rstrip</span>())         <span class="cm"># right only</span>

<span class="cm"># Length and counting</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">len</span>())
<span class="cm"># 0    15.0</span>
<span class="cm"># 1    12.0</span>
<span class="cm"># 2    13.0</span>
<span class="cm"># 3    21.0</span>
<span class="cm"># 4     NaN</span>
<span class="cm"># 5    12.0</span>

<span class="cm"># Boolean checks (return bool Series, NaN-safe)</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">isupper</span>())        <span class="cm"># True for "NLP IS GREAT" only? No -- "is" is lowercase</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">islower</span>())        <span class="cm"># True if every alpha char is lowercase</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">isdigit</span>())        <span class="cm"># True only if all chars are digits</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">isalpha</span>())        <span class="cm"># True if all chars are letters</span>

<span class="cm"># Padding</span>
nums = pd.<span class="fn">Series</span>([<span class="str">"1"</span>, <span class="str">"12"</span>, <span class="str">"123"</span>])
<span class="fn">print</span>(nums.<span class="ty">str</span>.<span class="fn">zfill</span>(<span class="num">5</span>))       <span class="cm"># 00001, 00012, 00123 -- left-pad with zeros</span>
<span class="fn">print</span>(nums.<span class="ty">str</span>.<span class="fn">pad</span>(<span class="num">5</span>, side=<span class="str">"right"</span>, fillchar=<span class="str">"-"</span>))   <span class="cm"># 1----, 12---, 123--</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a Series with mixed cases, leading/trailing spaces, and one NaN value -- representative of real CSV text. 2) <code>.str.lower()</code> lowercases every value; the NaN row stays NaN instead of erroring. 3) <code>.str.title()</code> capitalizes the first letter of each word, useful for cleaning name columns. 4) <code>.str.strip()</code> removes whitespace from both ends -- always do this first, raw CSV columns frequently have hidden spaces. 5) <code>.str.len()</code> returns the character count as a float Series (float because NaN cannot be in an int Series). 6) Boolean checks like <code>.isupper()</code>, <code>.isdigit()</code> return a boolean Series perfect for filtering. 7) Padding methods <code>.zfill</code> and <code>.pad</code> are useful for cleaning IDs that should be fixed-width (e.g. zip codes that lost their leading zero).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.str.lower() / .upper()</div><div class="card-body">Standard case conversion. <code>.lower()</code> is essential for NLP -- "GREAT" and "great" should match.</div></div>
<div class="calc-card"><div class="card-title">.str.strip()</div><div class="card-body">Removes leading and trailing whitespace. <code>strip(chars)</code> removes any of the listed characters from the ends.</div></div>
<div class="calc-card"><div class="card-title">.str.len()</div><div class="card-body">Number of characters per cell. Returns a float Series so NaN is preserved as NaN.</div></div>
<div class="calc-card"><div class="card-title">.str.title()</div><div class="card-body">Capitalize Each Word. Useful for cleaning names, product titles.</div></div>
<div class="calc-card"><div class="card-title">.str.zfill(n)</div><div class="card-body">Left-pad with zeros to length n. Common for fixing IDs and codes that lost leading zeros in CSV.</div></div>
<div class="calc-card"><div class="card-title">.str.repeat(n)</div><div class="card-body">Repeat each string n times. Rarely needed but exists -- think of it as the vectorized <code>"-" * 5</code>.</div></div>
</div>

<div id="plot-l9-tweetlen-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A histogram of tweet character lengths from a synthetic 5000-tweet dataset, computed with <code>df["text"].str.len()</code>. The peak around 80-120 characters is typical of social-media short-form text; the tail to the right represents users who pack near the 280-character limit. This kind of length distribution is your first sanity check before tokenization -- abnormally short tweets are often spam or empty after cleaning.</div>

<div class="l-note"><strong>NaN behavior:</strong> Most <code>.str</code> methods propagate NaN automatically. If you specifically want to treat NaN as an empty string before operating, do <code>s.fillna("")</code> first. This matters for <code>.str.contains</code> -- by default, <code>.contains</code> returns NaN for NaN inputs, which is neither True nor False, and will break boolean indexing.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Searching and Filtering</h2>

<p class="l-text">The most common NLP task: keep rows where the text matches some pattern. This is what <code>.str.contains</code>, <code>.str.startswith</code>, and friends are for. They return a boolean Series that you use as a row mask.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"text"</span>: [
        <span class="str">"This movie was amazing!"</span>,
        <span class="str">"Terrible film, would not recommend"</span>,
        <span class="str">"AMAZING acting and great story"</span>,
        <span class="str">"Boring and predictable plot"</span>,
        <span class="kw">None</span>,
        <span class="str">"Loved every minute of it"</span>,
        <span class="str">"Watch this AMAZING masterpiece"</span>,
    ],
    <span class="str">"rating"</span>: [<span class="num">5</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]
})

<span class="cm"># Simple substring -- case-sensitive by default</span>
mask1 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"amazing"</span>)
<span class="cm"># Returns: [F, F, F, F, NaN, F, F]  -- only matches "amazing" exactly</span>

<span class="cm"># Case-insensitive</span>
mask2 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"amazing"</span>, <span class="kw">case</span>=<span class="kw">False</span>)
<span class="cm"># Returns: [T, F, T, F, NaN, F, T]  -- catches "AMAZING" too</span>

<span class="cm"># NaN-safe filtering: na=False treats NaN as False, never True</span>
mask3 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"amazing"</span>, <span class="kw">case</span>=<span class="kw">False</span>, na=<span class="kw">False</span>)
filtered = reviews[mask3]
<span class="fn">print</span>(filtered)
<span class="cm">#                              text  rating</span>
<span class="cm"># 0          This movie was amazing!       5</span>
<span class="cm"># 2  AMAZING acting and great story       5</span>
<span class="cm"># 6  Watch this AMAZING masterpiece       5</span>

<span class="cm"># Multiple patterns with regex OR</span>
mask4 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(r<span class="str">"amazing|loved|masterpiece"</span>,
                                     <span class="kw">case</span>=<span class="kw">False</span>, regex=<span class="kw">True</span>, na=<span class="kw">False</span>)

<span class="cm"># startswith / endswith</span>
mask5 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">startswith</span>(<span class="str">"This"</span>, na=<span class="kw">False</span>)
mask6 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">endswith</span>(<span class="str">"!"</span>, na=<span class="kw">False</span>)

<span class="cm"># match (must match from the START -- like re.match)</span>
mask7 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="kw">match</span>(r<span class="str">"\\w+ movie"</span>, <span class="kw">case</span>=<span class="kw">False</span>, na=<span class="kw">False</span>)

<span class="cm"># fullmatch (must match the entire string)</span>
mask8 = reviews[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">fullmatch</span>(r<span class="str">"AMAZING.*"</span>, na=<span class="kw">False</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a small reviews DataFrame with mixed-case text, one NaN row, and a numeric rating. 2) Plain <code>.str.contains("amazing")</code> is case-sensitive and returns NaN for the NaN cell -- that NaN becomes a problem when you try to use the mask for filtering. 3) <code>case=False</code> makes the search case-insensitive, catching "AMAZING" as well. 4) <code>na=False</code> replaces the NaN result with False, making the mask safe for boolean indexing. 5) Using regex <code>amazing|loved|masterpiece</code> matches any of multiple keywords in one pass -- much faster than chaining multiple <code>.contains</code> calls. 6) <code>startswith</code> and <code>endswith</code> are anchored versions, useful for prefix/suffix filters (URLs, file extensions). 7) <code>.match</code> requires the pattern to match from the start, and <code>.fullmatch</code> requires it to match the entire string -- the difference matters for validation.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">.contains</div><div class="compare-item">Pattern can be anywhere in the string</div><div class="compare-item">Default: regex=True (treats . [ ] etc. specially)</div><div class="compare-item">Most common for keyword filtering</div><div class="compare-item">Use case=False for case-insensitive</div><div class="compare-item">Use na=False for safe filtering</div></div>
<div class="compare-col"><div class="compare-title">.match / .fullmatch</div><div class="compare-item">.match: anchored at start only</div><div class="compare-item">.fullmatch: must match entire string</div><div class="compare-item">Used for validation (is this an email?)</div><div class="compare-item">More restrictive than .contains</div><div class="compare-item">Same flags work (case, na, flags=re.I)</div></div>
</div>

<div class="l-warn"><strong>Pitfall: NaN in masks.</strong> If <code>str.contains</code> returns a NaN, using the mask raises <code>ValueError: cannot mask with non-boolean array</code>. Always pass <code>na=False</code> (or <code>na=True</code> if you want to keep them) when filtering. Forgetting this is the #1 cause of "my Pandas filter mysteriously crashes."</div>

<p class="l-text"><strong>Quick summary:</strong> use <code>.str.contains(pattern, case=False, na=False)</code> as your daily filter; switch to <code>.match</code> or <code>.fullmatch</code> when you need anchoring; use regex alternation (<code>|</code>) to combine multiple patterns in one pass.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Extracting with Regex</h2>

<p class="l-text">Filtering is just "keep or drop". The next step is <em>extraction</em>: pull specific substrings out of every row -- emails out of message bodies, hashtags out of tweets, prices out of ad text, IPs out of log lines. This is where <code>.str.extract</code>, <code>.str.extractall</code>, and <code>.str.findall</code> shine.</p>

<div class="calc-highlight"><strong>Regex 60-second refresher:</strong> a <strong>character class</strong> like <code>[a-z]</code> matches any one lowercase letter; <code>\\w</code> means any word character; <code>\\d</code> any digit. <strong>Quantifiers:</strong> <code>+</code> = one or more, <code>*</code> = zero or more, <code>{2,5}</code> = between 2 and 5. <strong>Anchors:</strong> <code>^</code> = start, <code>$</code> = end. <strong>Capture groups:</strong> parentheses around a part of the pattern collect the matched substring. The <code>.extract</code> method returns one column per capture group.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

tweets = pd.<span class="fn">Series</span>([
    <span class="str">"Loving the new release! #python #pandas @pandas_dev"</span>,
    <span class="str">"@elonmusk what do you think? #ai #ml"</span>,
    <span class="str">"Just a normal tweet with no tags"</span>,
    <span class="str">"Multiple #hashtags #everywhere #yes #yes #yes"</span>,
    <span class="str">"Visit https://example.com for more #info"</span>,
])

<span class="cm"># extract -- ONE match per row, returns a DataFrame (one column per group)</span>
<span class="cm"># Pattern: capture the first hashtag</span>
first_hashtag = tweets.<span class="ty">str</span>.<span class="fn">extract</span>(r<span class="str">"#(\\w+)"</span>)
<span class="fn">print</span>(first_hashtag)
<span class="cm">#         0</span>
<span class="cm"># 0  python</span>
<span class="cm"># 1      ai</span>
<span class="cm"># 2     NaN</span>
<span class="cm"># 3  hashtags</span>
<span class="cm"># 4    info</span>

<span class="cm"># Multiple capture groups -- multiple columns</span>
mention_and_tag = tweets.<span class="ty">str</span>.<span class="fn">extract</span>(r<span class="str">"@(\\w+).*#(\\w+)"</span>)
<span class="fn">print</span>(mention_and_tag)
<span class="cm">#               0       1</span>
<span class="cm"># 0   pandas_dev  python   (no -- "@pandas_dev" comes after #python)</span>
<span class="cm"># 1     elonmusk      ai</span>
<span class="cm"># ...</span>

<span class="cm"># extractall -- ALL matches per row, returns long-form DataFrame</span>
all_hashtags = tweets.<span class="ty">str</span>.<span class="fn">extractall</span>(r<span class="str">"#(\\w+)"</span>)
<span class="fn">print</span>(all_hashtags)
<span class="cm">#           0</span>
<span class="cm">#   match</span>
<span class="cm"># 0 0      python</span>
<span class="cm">#   1      pandas</span>
<span class="cm"># 1 0      ai</span>
<span class="cm">#   1      ml</span>
<span class="cm"># 3 0      hashtags</span>
<span class="cm">#   1      everywhere</span>
<span class="cm">#   ...</span>

<span class="cm"># findall -- list of matches per row (no capture group needed)</span>
tag_lists = tweets.<span class="ty">str</span>.<span class="fn">findall</span>(r<span class="str">"#\\w+"</span>)
<span class="fn">print</span>(tag_lists)
<span class="cm"># 0          [#python, #pandas]</span>
<span class="cm"># 1                  [#ai, #ml]</span>
<span class="cm"># 2                          []</span>
<span class="cm"># 3    [#hashtags, #everywhere, ...]</span>
<span class="cm"># 4                     [#info]</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates 5 sample tweets with hashtags, mentions, and a URL. 2) <code>extract(r"#(\\w+)")</code> matches the first hashtag in each tweet, returning a DataFrame with one column per capture group (here, one). The row with no hashtag becomes NaN. 3) Multiple capture groups become multiple columns -- one row of the output for each input row, even if the input has multiple matches (only the first match wins). 4) <code>extractall</code> returns ALL matches per row in long form: a hierarchical index where the first level is the original row and the second level is the match number within that row. 5) <code>findall</code> returns a Series of <em>lists</em> -- each cell holds all matches for that row. Use this when you want to keep the per-row groupings as Python objects (e.g., before exploding to long form).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.extract</div><div class="card-body">First match per row. Returns DataFrame with one column per capture group. NaN when no match.</div></div>
<div class="calc-card"><div class="card-title">.extractall</div><div class="card-body">All matches per row. Long-form DataFrame with MultiIndex (row, match number). Use <code>.explode()</code> for similar effect.</div></div>
<div class="calc-card"><div class="card-title">.findall</div><div class="card-body">All matches as Python lists per row. Returns Series of lists. Convenient for further per-row processing.</div></div>
<div class="calc-card"><div class="card-title">.count(pat)</div><div class="card-body">Count occurrences of pattern per row. Useful: number of hashtags per tweet, exclamation marks, etc.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP feature engineering from raw tweets</div><div class="example-body"><strong>Goal:</strong> add hashtag count, mention count, URL count as features for a sentiment model.<br>
<code>df["n_hashtags"] = df["text"].str.count(r"#\\w+")</code><br>
<code>df["n_mentions"] = df["text"].str.count(r"@\\w+")</code><br>
<code>df["n_urls"] = df["text"].str.count(r"https?://\\S+")</code><br>
<code>df["first_hashtag"] = df["text"].str.extract(r"#(\\w+)")</code><br>
Each is one line, runs vectorized over millions of rows in seconds. These engagement features often beat a simple bag-of-words on social-media classification.</div></div>

<div id="plot-l9-tophash-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The top 10 hashtags by frequency, extracted from a synthetic 1000-tweet dataset using <code>str.extractall</code> and <code>value_counts</code>. The first three (#python, #ai, #data) dominate -- this is the typical "long tail" structure of social-media tags. For modeling, the top 100 hashtags as binary features often capture most of the topic signal at near-zero cost.</div>

<div class="l-warn"><strong>Pitfall: greedy vs lazy quantifiers.</strong> <code>.*</code> is greedy (matches as much as possible). To match the shortest string between two delimiters, use <code>.*?</code> (lazy). For example, <code>&lt;.*&gt;</code> on <code>"&lt;a&gt;hi&lt;/a&gt;"</code> matches the entire string; <code>&lt;.*?&gt;</code> matches only <code>"&lt;a&gt;"</code>. This trips up beginners constantly when extracting from HTML or markup.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Splitting and Joining</h2>

<p class="l-text">When you want to break a single text column into multiple columns or rows -- one per token, one per delimiter -- <code>.str.split</code> is the workhorse. The reverse, gluing token columns back together, is <code>.str.cat</code> or <code>.str.join</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

s = pd.<span class="fn">Series</span>([
    <span class="str">"Mikail Sarpkaya"</span>,
    <span class="str">"Alice Cooper"</span>,
    <span class="str">"Bob"</span>,
    <span class="str">"Carol Anne Smith"</span>,
])

<span class="cm"># split -- returns Series of lists by default</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">split</span>(<span class="str">" "</span>))
<span class="cm"># 0    [Mikail, Sarpkaya]</span>
<span class="cm"># 1       [Alice, Cooper]</span>
<span class="cm"># 2                 [Bob]</span>
<span class="cm"># 3   [Carol, Anne, Smith]</span>

<span class="cm"># expand=True -- spread tokens into separate columns</span>
parts = s.<span class="ty">str</span>.<span class="fn">split</span>(<span class="str">" "</span>, expand=<span class="kw">True</span>)
<span class="fn">print</span>(parts)
<span class="cm">#         0       1      2</span>
<span class="cm"># 0  Mikail  Sarpkaya   None</span>
<span class="cm"># 1   Alice   Cooper    None</span>
<span class="cm"># 2     Bob      None   None</span>
<span class="cm"># 3   Carol     Anne   Smith</span>

<span class="cm"># Limit number of splits</span>
two_parts = s.<span class="ty">str</span>.<span class="fn">split</span>(<span class="str">" "</span>, n=<span class="num">1</span>, expand=<span class="kw">True</span>)   <span class="cm"># at most 1 split</span>
<span class="fn">print</span>(two_parts)
<span class="cm">#         0           1</span>
<span class="cm"># 0  Mikail    Sarpkaya</span>
<span class="cm"># 1   Alice      Cooper</span>
<span class="cm"># 2     Bob        None</span>
<span class="cm"># 3   Carol  Anne Smith   &lt;-- everything after first space</span>

<span class="cm"># Split on regex</span>
sentences = pd.<span class="fn">Series</span>([<span class="str">"Hello! How are you? Great, thanks."</span>])
<span class="fn">print</span>(sentences.<span class="ty">str</span>.<span class="fn">split</span>(r<span class="str">"[!?.]\\s*"</span>))
<span class="cm"># 0    [Hello, How are you, Great, thanks, ]</span>

<span class="cm"># rsplit -- split from the RIGHT (useful for filenames)</span>
files = pd.<span class="fn">Series</span>([<span class="str">"report.final.pdf"</span>, <span class="str">"doc.docx"</span>, <span class="str">"image.png"</span>])
<span class="fn">print</span>(files.<span class="ty">str</span>.<span class="fn">rsplit</span>(<span class="str">"."</span>, n=<span class="num">1</span>, expand=<span class="kw">True</span>))
<span class="cm">#                0     1</span>
<span class="cm"># 0   report.final   pdf</span>
<span class="cm"># 1            doc  docx</span>
<span class="cm"># 2          image   png</span>

<span class="cm"># Tokenize a tweet column for NLP</span>
tweets = pd.<span class="fn">Series</span>([
    <span class="str">"i love pandas"</span>,
    <span class="str">"deep learning is fun"</span>,
    <span class="str">"transformers rock"</span>,
])
tokens = tweets.<span class="ty">str</span>.<span class="fn">split</span>()                      <span class="cm"># default = whitespace</span>
<span class="fn">print</span>(tokens)
<span class="cm"># 0       [i, love, pandas]</span>
<span class="cm"># 1  [deep, learning, is, fun]</span>
<span class="cm"># 2  [transformers, rock]</span>

<span class="cm"># Explode tokens into long form (one row per token)</span>
long_form = tweets.<span class="ty">str</span>.<span class="fn">split</span>().<span class="fn">explode</span>().<span class="fn">reset_index</span>(name=<span class="str">"token"</span>)
<span class="fn">print</span>(long_form.<span class="fn">head</span>())
<span class="cm">#    index   token</span>
<span class="cm"># 0      0       i</span>
<span class="cm"># 1      0    love</span>
<span class="cm"># 2      0  pandas</span>
<span class="cm"># 3      1    deep</span>
<span class="cm"># 4      1  learning</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>str.split(" ")</code> splits each string by a literal space; the default is whitespace, which also handles tabs and multiple spaces. 2) <code>expand=True</code> spreads the resulting tokens into separate DataFrame columns -- great for parsing fixed-format strings like names, addresses. 3) <code>n=1</code> stops after the first split, keeping the rest of the string in the second column -- useful for "first word" + "rest of sentence" patterns. 4) Splitting on a regex like <code>[!?.]\\s*</code> handles multiple sentence terminators in one pass. 5) <code>rsplit</code> splits from the right; combined with <code>n=1</code>, this is the canonical way to separate file extensions. 6) For NLP tokenization, <code>str.split()</code> with no argument tokenizes on whitespace, returning a Series of token lists. 7) <code>.explode()</code> turns that list-Series into a long-format Series with one row per token -- the foundation for token-level analytics like word frequencies, co-occurrence, and inverted indexes.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.str.split(pat)</div><div class="card-body">Returns Series of token lists. Default pat=None splits on any whitespace.</div></div>
<div class="calc-card"><div class="card-title">.str.split(expand=True)</div><div class="card-body">Returns DataFrame with one column per token. Use n= to limit splits.</div></div>
<div class="calc-card"><div class="card-title">.str.rsplit</div><div class="card-body">Same but splits from the right. Pair with n=1 for filename parsing.</div></div>
<div class="calc-card"><div class="card-title">.explode()</div><div class="card-body">Turn a list-column into long form -- one row per list element. Essential for token-level NLP.</div></div>
<div class="calc-card"><div class="card-title">.str.cat(others, sep)</div><div class="card-body">Concatenate two or more string Series element-wise with a separator. The reverse of split.</div></div>
<div class="calc-card"><div class="card-title">.str.join(sep)</div><div class="card-body">Glue list elements with a separator. <code>tokens.str.join(" ")</code> reconstructs the sentence.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Joining two columns</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">"first"</span>: [<span class="str">"Mikail"</span>, <span class="str">"Alice"</span>, <span class="str">"Bob"</span>],
    <span class="str">"last"</span>:  [<span class="str">"Sarpkaya"</span>, <span class="str">"Cooper"</span>, <span class="str">"Smith"</span>],
})
df[<span class="str">"full"</span>] = df[<span class="str">"first"</span>].<span class="ty">str</span>.<span class="fn">cat</span>(df[<span class="str">"last"</span>], sep=<span class="str">" "</span>)
<span class="cm"># "Mikail Sarpkaya", "Alice Cooper", "Bob Smith"</span>

<span class="cm"># Glue tokens back to sentence</span>
tokens = pd.<span class="fn">Series</span>([[<span class="str">"i"</span>, <span class="str">"love"</span>, <span class="str">"pandas"</span>], [<span class="str">"deep"</span>, <span class="str">"learning"</span>]])
sentences = tokens.<span class="ty">str</span>.<span class="fn">join</span>(<span class="str">" "</span>)
<span class="cm"># "i love pandas", "deep learning"</span></code></pre></div>

<p class="l-text"><strong>Quick summary:</strong> <code>split + explode</code> is the classical Pandas idiom for token-level analysis; <code>cat</code> and <code>join</code> are how you put things back together for display or storage.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Replacement and Cleanup</h2>

<p class="l-text"><code>.str.replace</code> is your scalpel. It replaces matched substrings (literal or regex) with whatever you choose, including the empty string -- which is how you clean URLs, mentions, punctuation, and emojis from raw text.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

tweets = pd.<span class="fn">Series</span>([
    <span class="str">"Loving https://t.co/abc123 the new release!! @python_dev"</span>,
    <span class="str">"Visit www.example.com for more info :):):)"</span>,
    <span class="str">"Email me: hi@example.com or call 555-1234"</span>,
    <span class="str">"Multiple    spaces    here"</span>,
    <span class="str">"Hashtags #are #great"</span>,
])

<span class="cm"># Literal replacement -- regex=False is fast and predictable</span>
<span class="fn">print</span>(tweets.<span class="ty">str</span>.<span class="fn">replace</span>(<span class="str">"!!"</span>, <span class="str">"!"</span>, regex=<span class="kw">False</span>))

<span class="cm"># Regex replacement</span>
url_clean = tweets.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"https?://\\S+|www\\.\\S+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)
mention_clean = url_clean.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"@\\w+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)
hashtag_clean = mention_clean.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"#\\w+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)

<span class="cm"># Email scrubbing -- replace with a token</span>
emails_replaced = tweets.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\S+@\\S+\\.\\S+"</span>, <span class="str">"[EMAIL]"</span>, regex=<span class="kw">True</span>)

<span class="cm"># Phone scrubbing</span>
phones_replaced = tweets.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\d{3}-\\d{4}"</span>, <span class="str">"[PHONE]"</span>, regex=<span class="kw">True</span>)

<span class="cm"># Collapse multiple whitespace into one</span>
spaced = pd.<span class="fn">Series</span>([<span class="str">"Multiple    spaces"</span>, <span class="str">"Tabs\\there"</span>])
collapsed = spaced.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\s+"</span>, <span class="str">" "</span>, regex=<span class="kw">True</span>).<span class="ty">str</span>.<span class="fn">strip</span>()

<span class="cm"># Remove all punctuation in one shot</span>
punct = pd.<span class="fn">Series</span>([<span class="str">"Hello, world!"</span>, <span class="str">"What's up? Cool!"</span>])
no_punct = punct.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"[^\\w\\s]"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)
<span class="cm"># "Hello world", "Whats up Cool"</span>

<span class="cm"># Replace using a callback function (advanced)</span>
<span class="kw">def</span> <span class="fn">emphasize</span>(<span class="kw">match</span>):
    <span class="kw">return</span> <span class="kw">match</span>.<span class="fn">group</span>(<span class="num">0</span>).<span class="fn">upper</span>()

s = pd.<span class="fn">Series</span>([<span class="str">"I love pandas"</span>, <span class="str">"I love python"</span>])
emphasized = s.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"love"</span>, emphasize, regex=<span class="kw">True</span>)
<span class="cm"># "I LOVE pandas", "I LOVE python"</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Literal replacement with <code>regex=False</code> is the safest default when you do not need patterns -- it treats the search string as plain text. 2) URL removal regex <code>https?://\\S+|www\\.\\S+</code> captures both <code>http://</code>, <code>https://</code>, and <code>www.</code> URLs in one pass. 3) Mention removal <code>@\\w+</code> matches @ followed by word chars -- it strips Twitter mentions cleanly. 4) Hashtag stripping is similar; some pipelines keep hashtags as tokens, others remove them, depending on the task. 5) Email scrubbing replaces email-shaped strings with a constant placeholder <code>[EMAIL]</code> -- useful for privacy-preserving NLP and ensuring rare-token noise does not blow up vocabulary. 6) <code>\\s+</code> matches one or more whitespace characters; replacing with a single space and then stripping yields a normalized text. 7) <code>[^\\w\\s]</code> means "anything that is NOT a word char or whitespace" -- a brutal but effective punctuation remover. 8) The callback form lets you compute the replacement dynamically; <code>match.group(0)</code> gives the full match, and any return value becomes the substitution.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: end-to-end tweet cleanup chain</div><div class="example-body">A common one-shot cleaning chain:<br>
<code>cleaned = (df["text"]<br>
.str.lower()<br>
.str.replace(r"https?://\\S+", "", regex=True)<br>
.str.replace(r"@\\w+", "", regex=True)<br>
.str.replace(r"#(\\w+)", r"\\1", regex=True)  # keep tag word, drop #<br>
.str.replace(r"[^\\w\\s]", " ", regex=True)<br>
.str.replace(r"\\s+", " ", regex=True)<br>
.str.strip())</code><br>
This 7-line chain takes raw tweets and returns lowercase, URL-free, mention-free, punctuation-free, single-spaced text. Run on 1M rows in under 5 seconds.</div></div>

<div class="l-note"><strong>About accents and Unicode:</strong> Pandas does not have a built-in accent stripper. The standard pattern is <code>df["text"].str.normalize("NFKD").str.encode("ascii", "ignore").str.decode("ascii")</code> -- decompose characters, drop non-ASCII, decode back. For Turkish data, this kills <code>ç ğ ı ö ş ü</code> too, so you may want to do a targeted replace (<code>"ı" -&gt; "i"</code>) instead.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NLP Preprocessing Pipeline (Vectorized)</h2>

<p class="l-text">Now we put everything together into a real, vectorized NLP cleaning pipeline -- the kind you would put in front of a TF-IDF or transformer model.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

raw = pd.<span class="fn">DataFrame</span>({<span class="str">"text"</span>: [
    <span class="str">"Loving the new release!! https://t.co/abc @python_dev #python"</span>,
    <span class="str">"  This is JUST OK, nothing special  "</span>,
    <span class="str">"Worst movie EVER. Avoid at all costs!!!"</span>,
    <span class="str">"Beautiful cinematography, https://imdb.com #film #review"</span>,
    <span class="kw">None</span>,
    <span class="str">"lol idk man, kinda meh tbh"</span>,
    <span class="str">"AMAZING acting and great story"</span>,
]})

STOPWORDS = {<span class="str">"the"</span>, <span class="str">"a"</span>, <span class="str">"an"</span>, <span class="str">"is"</span>, <span class="str">"and"</span>, <span class="str">"or"</span>, <span class="str">"but"</span>, <span class="str">"of"</span>, <span class="str">"to"</span>, <span class="str">"in"</span>,
             <span class="str">"for"</span>, <span class="str">"on"</span>, <span class="str">"at"</span>, <span class="str">"this"</span>, <span class="str">"that"</span>, <span class="str">"it"</span>, <span class="str">"i"</span>, <span class="str">"we"</span>, <span class="str">"you"</span>}

clean = (
    raw.<span class="fn">assign</span>(text=raw[<span class="str">"text"</span>].<span class="fn">fillna</span>(<span class="str">""</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">lower</span>())
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"https?://\\S+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"@\\w+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"#(\\w+)"</span>, r<span class="str">"\\1"</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"[^\\w\\s]"</span>, <span class="str">" "</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\s+"</span>, <span class="str">" "</span>, regex=<span class="kw">True</span>).<span class="ty">str</span>.<span class="fn">strip</span>())
       .<span class="fn">assign</span>(tokens=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">split</span>())
       .<span class="fn">assign</span>(tokens=<span class="kw">lambda</span> d: d[<span class="str">"tokens"</span>].<span class="fn">apply</span>(
           <span class="kw">lambda</span> lst: [t <span class="kw">for</span> t <span class="kw">in</span> lst <span class="kw">if</span> t <span class="kw">not</span> <span class="kw">in</span> STOPWORDS <span class="kw">and</span> <span class="fn">len</span>(t) &gt; <span class="num">2</span>]))
       .<span class="fn">assign</span>(text_clean=<span class="kw">lambda</span> d: d[<span class="str">"tokens"</span>].<span class="ty">str</span>.<span class="fn">join</span>(<span class="str">" "</span>))
       .<span class="fn">assign</span>(n_tokens=<span class="kw">lambda</span> d: d[<span class="str">"tokens"</span>].<span class="ty">str</span>.<span class="fn">len</span>())
       .<span class="fn">query</span>(<span class="str">"n_tokens &gt;= 2"</span>)
)

<span class="fn">print</span>(clean[[<span class="str">"text_clean"</span>, <span class="str">"n_tokens"</span>]])</code></pre></div>

<p class="l-text"><strong>What this pipeline does, step by step:</strong> 1) <strong>fillna("")</strong> turns NaN cells into empty strings so the chain never breaks. 2) <strong>lower()</strong> normalizes case so "AMAZING" and "amazing" become the same token. 3) <strong>URL stripping</strong> removes any http/https URLs in one regex pass. 4) <strong>Mention stripping</strong> kills <code>@username</code> tokens that are not topical content. 5) <strong>Hashtag handling</strong> -- keeps the <em>word</em> part of hashtags (<code>#python -&gt; python</code>) so it contributes to topic signal. 6) <strong>Punctuation removal</strong> with <code>[^\\w\\s]</code> turns commas, exclamation marks, emojis into spaces, then <strong>whitespace collapse</strong> normalizes the gaps. 7) <strong>Tokenization</strong> via <code>str.split()</code> turns the cleaned string into a list of words. 8) <strong>Stopword + short-token filter</strong> drops words shorter than 3 chars and known stopwords -- the only step that uses Python (a list comprehension), since stopword lookup is faster as a Python set than as a regex. 9) <strong>Reconstruction</strong> with <code>str.join(" ")</code> rebuilds a clean sentence string for downstream tools. 10) <strong>n_tokens</strong> counts surviving tokens, used by the next step. 11) <strong>query</strong> filters out rows with fewer than 2 tokens -- after cleaning, very short rows are usually noise.</p>

<div id="plot-l9-zipf-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Token frequency rank vs frequency on log-log axes -- the classic Zipf law shape, computed by tokenizing a synthetic corpus of 5000 reviews. The straight line on log-log axes shows that the k-th most frequent word appears about 1/k times as often as the most frequent word -- a near-universal property of natural language. This is why TF-IDF works (downweight common words) and why subword tokenization is necessary (the long tail is huge).</div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Lowercase</div><div class="step-detail">Universal first step. Skip only if your model is case-sensitive (rare in classical NLP).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Remove URLs / mentions</div><div class="step-detail">Domain-specific noise that adds nothing to topical or sentiment signal.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Handle hashtags</div><div class="step-detail">Keep the word, drop the #. Some research keeps the # as a marker.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Strip punctuation</div><div class="step-detail">Replace with space then collapse whitespace. Avoid creating glued tokens.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Tokenize</div><div class="step-detail">str.split() for whitespace tokenization. Use a real tokenizer (spaCy, NLTK) for Turkish/agglutinative languages.</div></div></div>
<div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Stopword + length filter</div><div class="step-detail">Set lookup is fastest. Drop tokens shorter than 2-3 chars to remove noise.</div></div></div>
<div class="calc-step"><div class="step-num">7</div><div class="step-content"><div class="step-title">Length filter on rows</div><div class="step-detail">Drop rows with too few surviving tokens -- they will not learn anything anyway.</div></div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Performance and Encoding Pitfalls</h2>

<p class="l-text">A few subtle traps that surprise even experienced users.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.str.len() vs len()</div><div class="card-body"><code>df["text"].str.len()</code> is the vectorized length, NaN-safe, returns float Series. <code>df["text"].apply(len)</code> works but is 5-10x slower and crashes on NaN.</div></div>
<div class="calc-card"><div class="card-title">Encoding</div><div class="card-body">Read CSVs with <code>encoding="utf-8"</code>. Some Excel exports are <code>latin-1</code> or <code>cp1254</code> for Turkish. Check the byte-level dump if characters look like <code>ÅŸ</code> instead of <code>ş</code> -- that is utf-8 read as latin-1.</div></div>
<div class="calc-card"><div class="card-title">Unicode normalization</div><div class="card-body">"é" can be one codepoint (NFC) or two (NFD: "e" + combining accent). Compare and dedupe will fail if you mix them. Use <code>str.normalize("NFC")</code> to standardize.</div></div>
<div class="calc-card"><div class="card-title">Regex compile cost</div><div class="card-body">Pandas compiles your regex once per call. If you reuse the same pattern across many calls, compile once with <code>re.compile</code> and pass the compiled object.</div></div>
<div class="calc-card"><div class="card-title">Memory for large strings</div><div class="card-body">A column of long strings in object dtype copies on every operation. For very large NLP corpora, look at the <code>"string"</code> dtype (<code>astype("string")</code>) -- it uses Arrow internally and is more memory-efficient.</div></div>
<div class="calc-card"><div class="card-title">Parallelism</div><div class="card-body">Vectorized .str is single-threaded. For embarrassingly parallel cleanups on huge corpora, use <code>swifter</code> (drop-in <code>.swifter.apply</code>) or <code>dask.dataframe</code>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> re

<span class="cm"># Encoding pitfall demo</span>
<span class="cm"># If your CSV looks like "AÅŸk" instead of "Aşk":</span>
df = pd.<span class="fn">read_csv</span>(<span class="str">"turkish.csv"</span>, encoding=<span class="str">"utf-8"</span>)  <span class="cm"># try utf-8 first</span>
<span class="cm"># If broken, try:</span>
<span class="cm"># df = pd.read_csv("turkish.csv", encoding="cp1254")</span>
<span class="cm"># df = pd.read_csv("turkish.csv", encoding="latin-1")</span>

<span class="cm"># Unicode normalization</span>
s = pd.<span class="fn">Series</span>([<span class="str">"café"</span>, <span class="str">"cafe\\u0301"</span>])   <span class="cm"># second one is "cafe" + combining accent</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">len</span>())                       <span class="cm"># 4, 5 -- different lengths!</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">normalize</span>(<span class="str">"NFC"</span>).<span class="ty">str</span>.<span class="fn">len</span>())  <span class="cm"># 4, 4 -- normalized</span>

<span class="cm"># Reuse a compiled regex for hot loops</span>
url_pat = re.<span class="fn">compile</span>(r<span class="str">"https?://\\S+"</span>)
clean = df[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(url_pat, <span class="str">""</span>, regex=<span class="kw">True</span>)

<span class="cm"># Memory-efficient string dtype (Arrow-backed)</span>
df[<span class="str">"text"</span>] = df[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="str">"string"</span>)    <span class="cm"># vs object dtype</span>
<span class="cm"># Same .str API but uses less RAM and supports masked NA</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Demonstrates the Turkish-encoding gotcha: <code>Aşk</code> read with the wrong codec shows up as <code>AÅŸk</code>; switching to <code>cp1254</code> or <code>latin-1</code> fixes it. 2) Shows that visually identical strings can have different lengths if one uses precomposed accents (NFC) and the other uses combining marks (NFD). 3) <code>str.normalize("NFC")</code> forces a canonical form so deduplication and equality checks work. 4) Pre-compiling a regex with <code>re.compile</code> avoids repeated compilation costs when the same pattern is used many times. 5) <code>astype("string")</code> opts into the Arrow-backed string dtype that is more memory-efficient and supports proper missing-value semantics, while keeping the same <code>.str</code> API.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> The <code>.str</code> accessor is your default tool for any text column. Avoid <code>.apply(lambda)</code> when a <code>.str</code> alternative exists -- it is 10-100x faster.<br><strong>2.</strong> Always pass <code>na=False</code> to <code>str.contains</code> when filtering, otherwise NaN values raise during boolean masking.<br><strong>3.</strong> Use <code>.str.extract</code> for first-match-per-row, <code>.str.extractall</code> for all matches, <code>.str.findall</code> for list-per-row.<br><strong>4.</strong> <code>str.split + .explode()</code> is the canonical token-level idiom: tokenize, explode, group, count.<br><strong>5.</strong> A real cleanup chain is six lines: lower -&gt; URL/mention strip -&gt; hashtag normalize -&gt; punct strip -&gt; whitespace collapse -&gt; strip.<br><strong>6.</strong> Watch encoding (<code>utf-8</code> default, <code>cp1254</code>/<code>latin-1</code> for Turkish Excel) and Unicode normalization (NFC) before doing any equality or dedupe.<br><strong>7.</strong> For huge corpora, consider Arrow-backed <code>"string"</code> dtype, pre-compiled regex patterns, and <code>swifter</code> or <code>dask</code> for parallelism.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};

  // 1. tweet length distribution
  var lens = (function(){
    var seed=3; function r(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var out=[];
    for (var i=0;i<5000;i++){
      // mixture: short + medium + long peak
      var u=r();
      var L;
      if (u<0.15) L = 20 + r()*40;
      else if (u<0.85) L = 60 + r()*80;
      else L = 180 + r()*100;
      out.push(Math.floor(L));
    }
    return out;
  })();

  var el1 = document.getElementById('plot-l9-tweetlen-en');
  if (el1) {
    var trace = {x:lens,type:'histogram',xbins:{start:0,end:300,size:10},marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Tweet Length Distribution (chars)',font:{color:T.text,size:14}},xaxis:{title:'Characters',gridcolor:T.grid},yaxis:{title:'Count',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l9-tweetlen-en',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el1tr = document.getElementById('plot-l9-tweetlen-tr');
  if (el1tr) {
    var trace = {x:lens,type:'histogram',xbins:{start:0,end:300,size:10},marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Tweet Uzunluk Dagilimi (karakter)',font:{color:T.text,size:14}},xaxis:{title:'Karakter',gridcolor:T.grid},yaxis:{title:'Sayim',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l9-tweetlen-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 2. top hashtags bar
  var tags = ["#python","#ai","#data","#ml","#code","#dev","#nlp","#tech","#learn","#opensource"];
  var counts = [310,265,238,210,182,160,140,118,95,80];
  var el2 = document.getElementById('plot-l9-tophash-en');
  if (el2) {
    var trace = {x:counts,y:tags,type:'bar',orientation:'h',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}},text:counts.map(function(v){return String(v);}),textposition:'auto'};
    var layout = Object.assign({}, common, {title:{text:'Top 10 Hashtags by Frequency',font:{color:T.text,size:14}},xaxis:{title:'Count',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:120}});
    Plotly.newPlot('plot-l9-tophash-en',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el2tr = document.getElementById('plot-l9-tophash-tr');
  if (el2tr) {
    var trace = {x:counts,y:tags,type:'bar',orientation:'h',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}},text:counts.map(function(v){return String(v);}),textposition:'auto'};
    var layout = Object.assign({}, common, {title:{text:'En Yuksek 10 Hashtag (Sikliga Gore)',font:{color:T.text,size:14}},xaxis:{title:'Sayim',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:120}});
    Plotly.newPlot('plot-l9-tophash-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 3. Zipf-like distribution
  var ranks=[]; var freqs=[];
  for (var k=1;k<=500;k++){ranks.push(k); freqs.push(Math.round(20000 / Math.pow(k,1.05)));}
  var el3 = document.getElementById('plot-l9-zipf-en');
  if (el3) {
    var trace = {x:ranks,y:freqs,mode:'markers',type:'scatter',marker:{color:T.accent,size:5,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Token Frequency vs Rank (Zipf law, log-log)',font:{color:T.text,size:14}},xaxis:{title:'Rank',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'},yaxis:{title:'Frequency',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'}});
    Plotly.newPlot('plot-l9-zipf-en',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el3tr = document.getElementById('plot-l9-zipf-tr');
  if (el3tr) {
    var trace = {x:ranks,y:freqs,mode:'markers',type:'scatter',marker:{color:T.accent,size:5,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Token Sikligi vs Sira (Zipf yasasi, log-log)',font:{color:T.text,size:14}},xaxis:{title:'Sira',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'},yaxis:{title:'Siklik',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'}});
    Plotly.newPlot('plot-l9-zipf-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Metin verileri NLP'nin kalbi, ve Pandas onu temizlediğiniz yer.</strong> Tweetler, yorumlar, log mesajları, destek biletleri, sohbet transkriptleri -- hepsi bir sütundaki dağınık stringler olarak başlar. Herhangi bir model onlardan öğrenmeden önce, stringler küçük harfe çevrilmeli, URL'lerden temizlenmeli, aksanlardan arındırılmalı, tokenize edilmeli ve filtrelenmelidir. Bu pipeline'ın tamamı <code>.str</code> erişimcisinde yaşar.</p>

<p class="l-text">Bu derste, her yaygın metin temizleme işlemini tamamen vektörize bir şekilde yapmayı öğreneceksiniz -- Python <code>for</code> döngüsü yok, <code>.apply(lambda x: ...)</code> yok, sadece milyonlarca satıra ölçeklenebilen zincirleme <code>.str</code> çağrıları. Ders sonunda ham bir tweet sütununu alıp 20 satırın altında TF-IDF veya transformer model için hazır temiz bir token listesine dönüştürebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Metin sütunlarını temizlemek, dilimlemek ve bölmek için .str erişimcisini kullan</li><li>Pandas içinde düzenli ifadelerle desen eşleştir ve çıkar</li><li>Bellek tasarrufu ve kategori sıralaması için metinleri Categorical'a çevir</li><li>Sıralanabilir etiketler için sıralı categorical oluştur (örn. düşük/orta/yüksek)</li><li>Metni kelimelere ayır ve bag-of-words frekans tabloları üret</li><li>Aşağı akış ML için metin özelliklerini sayısal özelliklerle birleştir</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden .str?</h2>

<p class="l-text">Bir milyon tweet içeren bir CSV'niz var ve yalnızca "harika" veya "muhteşem" içerenleri tutmak, küçük harfe çevirmek, URL'leri kaldırmak istiyorsunuz. Bunu Python döngüsüyle yapmak:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

temiz = []
<span class="kw">for</span> satir <span class="kw">in</span> df_tweets['text'].tolist():           <span class="cm"># &lt;-- açık Python döngüsü, yavaş!</span>
    t = satir.<span class="fn">lower</span>()
    t = re.<span class="fn">sub</span>(r<span class="str">"http\\S+"</span>, <span class="str">""</span>, t)
    <span class="kw">if</span> <span class="str">"harika"</span> <span class="kw">in</span> t <span class="kw">or</span> <span class="str">"muhtesem"</span> <span class="kw">in</span> t:
        temiz.<span class="fn">append</span>(t)
<span class="cm"># 1M satır: ~5 dakika</span></code></pre></div>

<p class="l-text"><code>.str</code> erişimcisiyle yapmak:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>temizlenen = (df[<span class="str">"text"</span>]
              .<span class="ty">str</span>.<span class="fn">lower</span>()
              .<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"http\\S+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>))
maske = temizlenen.<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"harika|muhtesem"</span>, regex=<span class="kw">True</span>)
sonuc = temizlenen[maske]
<span class="cm"># 1M satır: ~2 saniye</span></code></pre></div>

<div class="calc-highlight"><strong>Fark 100-200 kat.</strong> <code>.str</code> erişimcisi string işlemlerini Pandas/NumPy/C koduna gönderir, böylece satır başına Python yorumlayıcı yükünden kaçınırsınız. Milyonlarca metni olan NLP veri setleri için, bu kahve molası ile bir gece arasındaki farktır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vektörize</div><div class="card-body">Tüm sütun üzerinde tek çağrıda çalışır. <code>for</code> yok, <code>apply</code> yok. Çoğu işlem Python eşdeğerinden 10-100 kat daha hızlıdır.</div></div>
<div class="calc-card"><div class="card-title">Zincirlenebilir</div><div class="card-body">Her <code>.str</code> metodu yeni bir Series döndürür, böylece zincir kurabilirsiniz: <code>s.str.lower().str.strip().str.replace("a","b")</code>. Yukarıdan aşağıya tarif gibi okunur.</div></div>
<div class="calc-card"><div class="card-title">NaN-güvenli</div><div class="card-body">Varsayılan olarak NaN değerler zincirde NaN kalır, çökmek yerine. Python None üzerinde <code>str.lower()</code> ile karşılaştırın -- AttributeError verir.</div></div>
<div class="calc-card"><div class="card-title">Regex-farkında</div><div class="card-body">Çoğu metod <code>regex=True</code> kabul eder. Pandas Python'un <code>re</code> modülünü kullanır, böylece <code>re.sub</code>'da çalışan herhangi bir desen <code>.str.replace</code>'te de çalışır.</div></div>
<div class="calc-card"><div class="card-title">Series döner</div><div class="card-body">Sonuçlar Pandas'a sorunsuz geri takılır: filtre, groupby, merge vb. Listelerden geri dönüştürmeye gerek yok.</div></div>
<div class="calc-card"><div class="card-title">Keşfedilebilir</div><div class="card-body">IPython/Jupyter'de <code>df["text"].str.</code> yazıp tab-tamamlama ile tüm metotları görün. Yaklaşık 50 tane var.</div></div>
</div>

<div class="l-note"><strong>Nasıl çalışır?</strong> <code>s.str</code> yazdığınızda, Pandas özel bir <code>StringMethods</code> nesnesi döndürür. Üzerindeki metot çağrıları (<code>.lower()</code>, <code>.contains()</code>, vb.) altta yatan NumPy dizisini C'de gezer ve eleman başına uygun string işlemini çağırır. Python yükü satır başına değil, tek seferde ödenir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Temel .str Metotları</h2>

<p class="l-text">Basit şeylerle başlayın. Bunlar Python stringleri üzerinde zaten bildiğiniz metotların <code>.str</code> versiyonlarıdır, ama şimdi vektörize.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

s = pd.<span class="fn">Series</span>([
    <span class="str">"  Merhaba Dunya  "</span>,
    <span class="str">"NLP HARIKA"</span>,
    <span class="str">"Derin Öğrenme"</span>,
    <span class="str">"  pandas COK guzel  "</span>,
    <span class="kw">None</span>,
    <span class="str">"Transformerlar"</span>
])

<span class="cm"># Büyük/küçük harf işlemleri</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">lower</span>())          <span class="cm"># tüm küçük</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">upper</span>())          <span class="cm"># TÜM BÜYÜK</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">title</span>())          <span class="cm"># Her Kelimenin İlk Harfi Büyük</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">capitalize</span>())     <span class="cm"># Sadece ilk harf büyük</span>

<span class="cm"># Boşluk</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">strip</span>())          <span class="cm"># baştaki/sondaki boşluğu kaldır</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">lstrip</span>())         <span class="cm"># sadece soldan</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">rstrip</span>())         <span class="cm"># sadece sağdan</span>

<span class="cm"># Uzunluk</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">len</span>())
<span class="cm"># 0    16.0</span>
<span class="cm"># 1    10.0</span>
<span class="cm"># 2    13.0</span>
<span class="cm"># 3    20.0</span>
<span class="cm"># 4     NaN</span>
<span class="cm"># 5    14.0</span>

<span class="cm"># Boolean kontroller (NaN-güvenli bool Series döner)</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">isupper</span>())
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">islower</span>())
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">isdigit</span>())
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">isalpha</span>())

<span class="cm"># Doldurma</span>
nums = pd.<span class="fn">Series</span>([<span class="str">"1"</span>, <span class="str">"12"</span>, <span class="str">"123"</span>])
<span class="fn">print</span>(nums.<span class="ty">str</span>.<span class="fn">zfill</span>(<span class="num">5</span>))       <span class="cm"># 00001, 00012, 00123 -- soldan sıfır doldur</span>
<span class="fn">print</span>(nums.<span class="ty">str</span>.<span class="fn">pad</span>(<span class="num">5</span>, side=<span class="str">"right"</span>, fillchar=<span class="str">"-"</span>))</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Karışık büyük/küçük harf, baş/son boşluklar ve bir NaN değeri olan bir Series oluşturur -- gerçek CSV metnini temsil eder. 2) <code>.str.lower()</code> her değeri küçük harfe çevirir; NaN satır hata vermek yerine NaN kalır. 3) <code>.str.title()</code> her kelimenin ilk harfini büyük yapar, isim sütunlarını temizlemek için faydalı. 4) <code>.str.strip()</code> her iki uçtan boşluğu kaldırır -- önce her zaman bunu yapın, ham CSV sütunları sıklıkla gizli boşluklara sahiptir. 5) <code>.str.len()</code> karakter sayısını float Series olarak döndürür (NaN int Series'te olamayacağından float). 6) <code>.isupper()</code>, <code>.isdigit()</code> gibi boolean kontroller filtreleme için mükemmel bir boolean Series döndürür. 7) <code>.zfill</code> ve <code>.pad</code> doldurma metotları sabit genişlikli olması gereken ID'leri (ör. baş sıfırını kaybetmiş posta kodları) temizlemek için faydalıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.str.lower() / .upper()</div><div class="card-body">Standart büyük/küçük harf dönüşümü. <code>.lower()</code> NLP için temeldir -- "HARİKA" ve "harika" eşleşmeli.</div></div>
<div class="calc-card"><div class="card-title">.str.strip()</div><div class="card-body">Baştaki ve sondaki boşluğu kaldırır. <code>strip(chars)</code> uçlardan listelenen herhangi bir karakteri kaldırır.</div></div>
<div class="calc-card"><div class="card-title">.str.len()</div><div class="card-body">Hücre başına karakter sayısı. NaN'ı NaN olarak korumak için float Series döner.</div></div>
<div class="calc-card"><div class="card-title">.str.title()</div><div class="card-body">Her Kelimenin İlk Harfi Büyük. İsimleri, ürün başlıklarını temizlemek için faydalı.</div></div>
<div class="calc-card"><div class="card-title">.str.zfill(n)</div><div class="card-body">n uzunluğa kadar soldan sıfır doldur. CSV'de baş sıfırlarını kaybetmiş ID ve kodları düzeltmek için yaygın.</div></div>
<div class="calc-card"><div class="card-title">.str.repeat(n)</div><div class="card-body">Her stringi n kez tekrarla. Nadiren gerekir ama vardır -- vektörize <code>"-" * 5</code> olarak düşünün.</div></div>
</div>

<div id="plot-l9-tweetlen-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin verdiği mesaj:</strong> <code>df["text"].str.len()</code> ile hesaplanan, sentetik bir 5000 tweet veri setinden tweet karakter uzunluklarının histogramı. 80-120 karakter civarındaki zirve sosyal medya kısa formatlı metnin tipiğidir; sağdaki kuyruk 280 karakter sınırına yakın paketleyen kullanıcıları temsil eder. Bu tür uzunluk dağılımı tokenizasyondan önce ilk akıl sağlığı kontrolünüzdür -- anormal kısa tweetler genellikle spam veya temizleme sonrası boştur.</div>

<div class="l-note"><strong>NaN davranışı:</strong> Çoğu <code>.str</code> metodu NaN'ı otomatik olarak yayar. İşlem yapmadan önce NaN'ı boş string olarak ele almak isterseniz, önce <code>s.fillna("")</code> yapın. Bu <code>.str.contains</code> için önemlidir -- varsayılan olarak <code>.contains</code> NaN girdiler için NaN döner, ne True ne False, ve boolean indekslemeyi kırar.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Arama ve Filtreleme</h2>

<p class="l-text">En yaygın NLP görevi: bir kalıba uyan metinli satırları tut. <code>.str.contains</code>, <code>.str.startswith</code> ve dostlarının yaptığı budur. Satır maskesi olarak kullandığınız bir boolean Series döndürürler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

yorumlar = pd.<span class="fn">DataFrame</span>({
    <span class="str">"metin"</span>: [
        <span class="str">"Bu film harikaydı!"</span>,
        <span class="str">"Berbat film, asla önermem"</span>,
        <span class="str">"HARIKA oyunculuk ve harika hikaye"</span>,
        <span class="str">"Sıkıcı ve tahmin edilebilir"</span>,
        <span class="kw">None</span>,
        <span class="str">"Her dakikasını sevdim"</span>,
        <span class="str">"Bu HARIKA başyapıtı izleyin"</span>,
    ],
    <span class="str">"puan"</span>: [<span class="num">5</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>]
})

<span class="cm"># Basit alt-string -- varsayılan olarak büyük/küçük duyarlı</span>
maske1 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"harika"</span>)

<span class="cm"># Büyük/küçük duyarsız</span>
maske2 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"harika"</span>, <span class="kw">case</span>=<span class="kw">False</span>)

<span class="cm"># NaN-güvenli filtreleme: na=False NaN'ı False olarak ele alır</span>
maske3 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(<span class="str">"harika"</span>, <span class="kw">case</span>=<span class="kw">False</span>, na=<span class="kw">False</span>)
filtreli = yorumlar[maske3]

<span class="cm"># Birden fazla desen regex OR ile</span>
maske4 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="fn">contains</span>(r<span class="str">"harika|sevdim|basyapit"</span>,
                                        <span class="kw">case</span>=<span class="kw">False</span>, regex=<span class="kw">True</span>, na=<span class="kw">False</span>)

<span class="cm"># startswith / endswith</span>
maske5 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="fn">startswith</span>(<span class="str">"Bu"</span>, na=<span class="kw">False</span>)
maske6 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="fn">endswith</span>(<span class="str">"!"</span>, na=<span class="kw">False</span>)

<span class="cm"># match (BAŞTAN eşleşmeli -- re.match gibi)</span>
maske7 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="kw">match</span>(r<span class="str">"\\w+ film"</span>, <span class="kw">case</span>=<span class="kw">False</span>, na=<span class="kw">False</span>)

<span class="cm"># fullmatch (TÜM stringle eşleşmeli)</span>
maske8 = yorumlar[<span class="str">"metin"</span>].<span class="ty">str</span>.<span class="fn">fullmatch</span>(r<span class="str">"HARIKA.*"</span>, na=<span class="kw">False</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Karışık harf, bir NaN satır ve sayısal puan içeren küçük bir yorum DataFrame'i oluşturur. 2) Düz <code>.str.contains("harika")</code> büyük/küçük duyarlıdır ve NaN hücre için NaN döner -- bu NaN, maskeyi filtreleme için kullanmaya çalıştığınızda sorun olur. 3) <code>case=False</code> aramayı duyarsız yapar ve "HARIKA"yı da yakalar. 4) <code>na=False</code> NaN sonucunu False ile değiştirir, maskeyi boolean indeksleme için güvenli yapar. 5) Regex <code>harika|sevdim|basyapit</code> kullanmak tek geçişte birden fazla anahtar kelimeyi eşleştirir -- birden fazla <code>.contains</code> zincirinden çok daha hızlı. 6) <code>startswith</code> ve <code>endswith</code> öneklenmiş versiyonlardır, önek/sonek filtreleri için faydalı (URL'ler, dosya uzantıları). 7) <code>.match</code> deseni baştan eşleşmeyi gerektirir ve <code>.fullmatch</code> tüm stringi eşleşmeyi gerektirir -- doğrulama için fark önemlidir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">.contains</div><div class="compare-item">Desen string'in herhangi bir yerinde olabilir</div><div class="compare-item">Varsayılan: regex=True (. [ ] vb. özel)</div><div class="compare-item">Anahtar kelime filtreleme için en yaygın</div><div class="compare-item">Duyarsız için case=False</div><div class="compare-item">Güvenli filtreleme için na=False</div></div>
<div class="compare-col"><div class="compare-title">.match / .fullmatch</div><div class="compare-item">.match: yalnızca başta öneklenmiş</div><div class="compare-item">.fullmatch: tüm stringle eşleşmeli</div><div class="compare-item">Doğrulama için (bu bir email mi?)</div><div class="compare-item">.contains'ten daha kısıtlayıcı</div><div class="compare-item">Aynı bayraklar (case, na, flags=re.I)</div></div>
</div>

<div class="l-warn"><strong>Tuzak: Maskelerde NaN.</strong> <code>str.contains</code> NaN dönerse, maskeyi kullanmak <code>ValueError: cannot mask with non-boolean array</code> hatası verir. Filtrelerken her zaman <code>na=False</code> (veya tutmak isterseniz <code>na=True</code>) geçirin. Bunu unutmak "Pandas filtremin gizemli bir şekilde çökmesinin" 1 numaralı sebebidir.</div>

<p class="l-text"><strong>Hızlı özet:</strong> günlük filtre olarak <code>.str.contains(pattern, case=False, na=False)</code> kullanın; bağlama ihtiyacınız olduğunda <code>.match</code> veya <code>.fullmatch</code>'e geçin; tek geçişte birden fazla kalıbı birleştirmek için regex değişimi (<code>|</code>) kullanın.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Regex ile Çıkarma</h2>

<p class="l-text">Filtreleme sadece "tut veya at"tır. Sonraki adım <em>çıkarma</em>: her satırdan belirli alt-stringleri çekin -- mesaj gövdelerinden e-postalar, tweetlerden hashtag'ler, reklam metninden fiyatlar, log satırlarından IP'ler. <code>.str.extract</code>, <code>.str.extractall</code> ve <code>.str.findall</code> burada parlar.</p>

<div class="calc-highlight"><strong>60 saniyelik regex hatırlatıcısı:</strong> <code>[a-z]</code> gibi <strong>karakter sınıfı</strong> herhangi bir küçük harfle eşleşir; <code>\\w</code> herhangi bir kelime karakteri; <code>\\d</code> herhangi bir rakam. <strong>Niceleyiciler:</strong> <code>+</code> = bir veya daha çok, <code>*</code> = sıfır veya daha çok, <code>{2,5}</code> = 2 ile 5 arası. <strong>Çapalar:</strong> <code>^</code> = baş, <code>$</code> = son. <strong>Yakalama grupları:</strong> deseninin bir kısmının etrafındaki parantezler eşleşen alt-stringi toplar. <code>.extract</code> metodu yakalama grubu başına bir sütun döner.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

tweetler = pd.<span class="fn">Series</span>([
    <span class="str">"Yeni surumu sevdim! #python #pandas @pandas_dev"</span>,
    <span class="str">"@elonmusk ne dusunuyorsun? #ai #ml"</span>,
    <span class="str">"Etiketsiz normal bir tweet"</span>,
    <span class="str">"Bircok #etiket #her_yerde #evet #evet"</span>,
    <span class="str">"Daha fazlasi için https://example.com #bilgi"</span>,
])

<span class="cm"># extract -- satır başına TEK eşleşme, DataFrame döner (grup başına bir sütun)</span>
ilk_etiket = tweetler.<span class="ty">str</span>.<span class="fn">extract</span>(r<span class="str">"#(\\w+)"</span>)
<span class="fn">print</span>(ilk_etiket)

<span class="cm"># extractall -- satır başına TÜM eşleşmeler, uzun-form DataFrame döner</span>
tum_etiketler = tweetler.<span class="ty">str</span>.<span class="fn">extractall</span>(r<span class="str">"#(\\w+)"</span>)
<span class="fn">print</span>(tum_etiketler)

<span class="cm"># findall -- satır başına eşleşmelerin listesi (yakalama grubu gerekmez)</span>
etiket_listeleri = tweetler.<span class="ty">str</span>.<span class="fn">findall</span>(r<span class="str">"#\\w+"</span>)</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Hashtag'ler, mention'lar ve URL içeren 5 örnek tweet oluşturur. 2) <code>extract(r"#(\\w+)")</code> her tweetteki ilk hashtag'i eşleşir, yakalama grubu başına bir sütunlu (burada bir) DataFrame döner. Hashtag'i olmayan satır NaN olur. 3) <code>extractall</code> her satır için TÜM eşleşmeleri uzun formda döner: ilk seviye orijinal satır, ikinci seviye o satırdaki eşleşme numarası olan hiyerarşik bir indeks. 4) <code>findall</code> bir <em>liste</em> Series'i döner -- her hücre o satır için tüm eşleşmeleri tutar. Satır başına gruplandırmaları Python nesneleri olarak korumak istediğinizde (ör. uzun forma exploded etmeden önce) bunu kullanın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.extract</div><div class="card-body">Satır başına ilk eşleşme. Yakalama grubu başına bir sütunlu DataFrame döner. Eşleşme yoksa NaN.</div></div>
<div class="calc-card"><div class="card-title">.extractall</div><div class="card-body">Satır başına tüm eşleşmeler. MultiIndex (satır, eşleşme no) ile uzun-form DataFrame. Benzer etki için <code>.explode()</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">.findall</div><div class="card-body">Satır başına Python listesi olarak tüm eşleşmeler. Liste Series'i döner. Satır başına ek işleme için kullanışlı.</div></div>
<div class="calc-card"><div class="card-title">.count(pat)</div><div class="card-body">Satır başına desen örneklerini say. Faydalı: tweet başına hashtag sayısı, ünlem işaretleri vb.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: ham tweetlerden NLP özellik mühendisliği</div><div class="example-body"><strong>Hedef:</strong> duygu modeli için hashtag sayısı, mention sayısı, URL sayısı özelliklerini ekle.<br>
<code>df["hashtag_n"] = df["text"].str.count(r"#\\w+")</code><br>
<code>df["mention_n"] = df["text"].str.count(r"@\\w+")</code><br>
<code>df["url_n"] = df["text"].str.count(r"https?://\\S+")</code><br>
<code>df["ilk_etiket"] = df["text"].str.extract(r"#(\\w+)")</code><br>
Her biri tek satır, milyonlarca satır üzerinde saniyeler içinde vektörize çalışır. Bu etkileşim özellikleri sosyal medya sınıflandırmada genellikle basit bir bag-of-words'ü yener.</div></div>

<div id="plot-l9-tophash-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> <code>str.extractall</code> ve <code>value_counts</code> kullanılarak sentetik bir 1000 tweet veri setinden çıkarılan sıklığa göre en yüksek 10 hashtag. İlk üç (#python, #ai, #data) baskındır -- bu sosyal medya etiketlerinin tipik "uzun kuyruk" yapısıdır. Modelleme için ikili özellik olarak en yüksek 100 hashtag genellikle konu sinyalinin çoğunu sıfıra yakın maliyetle yakalar.</div>

<div class="l-warn"><strong>Tuzak: aç gözlü vs tembel niceleyiciler.</strong> <code>.*</code> aç gözlüdür (mümkün olduğu kadar çok eşleşir). İki ayraç arasındaki en kısa stringle eşleşmek için <code>.*?</code> (tembel) kullanın. Örneğin <code>"&lt;a&gt;hi&lt;/a&gt;"</code> üzerinde <code>&lt;.*&gt;</code> tüm stringle eşleşir; <code>&lt;.*?&gt;</code> yalnızca <code>"&lt;a&gt;"</code> ile eşleşir. HTML veya işaretlemeden çıkarırken yeni başlayanları sürekli düşürür.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Bölme ve Birleştirme</h2>

<p class="l-text">Tek bir metin sütununu birden fazla sütun veya satıra bölmek istediğinizde -- token başına bir, ayraç başına bir -- <code>.str.split</code> iş gücünüzdür. Tersi, token sütunlarını yeniden birbirine yapıştırmak, <code>.str.cat</code> veya <code>.str.join</code>'dur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

s = pd.<span class="fn">Series</span>([
    <span class="str">"Mikail Sarpkaya"</span>,
    <span class="str">"Ayse Yilmaz"</span>,
    <span class="str">"Bob"</span>,
    <span class="str">"Mehmet Ali Demir"</span>,
])

<span class="cm"># split -- varsayılan olarak liste Series döner</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">split</span>(<span class="str">" "</span>))

<span class="cm"># expand=True -- token'ları ayrı sütunlara yay</span>
parcalar = s.<span class="ty">str</span>.<span class="fn">split</span>(<span class="str">" "</span>, expand=<span class="kw">True</span>)
<span class="fn">print</span>(parcalar)

<span class="cm"># Bölme sayısını sınırla</span>
iki_parca = s.<span class="ty">str</span>.<span class="fn">split</span>(<span class="str">" "</span>, n=<span class="num">1</span>, expand=<span class="kw">True</span>)   <span class="cm"># en fazla 1 bölme</span>

<span class="cm"># Regex ile böl</span>
cumleler = pd.<span class="fn">Series</span>([<span class="str">"Merhaba! Nasilsin? Iyi, tesekkurler."</span>])
<span class="fn">print</span>(cumleler.<span class="ty">str</span>.<span class="fn">split</span>(r<span class="str">"[!?.]\\s*"</span>))

<span class="cm"># rsplit -- SAĞDAN böl (dosya adları için faydalı)</span>
dosyalar = pd.<span class="fn">Series</span>([<span class="str">"rapor.son.pdf"</span>, <span class="str">"doc.docx"</span>, <span class="str">"resim.png"</span>])
<span class="fn">print</span>(dosyalar.<span class="ty">str</span>.<span class="fn">rsplit</span>(<span class="str">"."</span>, n=<span class="num">1</span>, expand=<span class="kw">True</span>))

<span class="cm"># NLP için bir tweet sütununu tokenize et</span>
tweetler = pd.<span class="fn">Series</span>([
    <span class="str">"pandas seviyorum"</span>,
    <span class="str">"derin öğrenme eglenceli"</span>,
    <span class="str">"transformerlar harika"</span>,
])
tokenlar = tweetler.<span class="ty">str</span>.<span class="fn">split</span>()
<span class="fn">print</span>(tokenlar)

<span class="cm"># Token'ları uzun forma explode et (token başına bir satır)</span>
uzun_form = tweetler.<span class="ty">str</span>.<span class="fn">split</span>().<span class="fn">explode</span>().<span class="fn">reset_index</span>(name=<span class="str">"token"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>str.split(" ")</code> her stringi literal boşlukla böler; varsayılan boşluktur, sekme ve birden fazla boşluğu da işler. 2) <code>expand=True</code> ortaya çıkan token'ları ayrı DataFrame sütunlarına yayar -- isimler, adresler gibi sabit format stringleri ayrıştırmak için harika. 3) <code>n=1</code> ilk bölmeden sonra durur, kalanı ikinci sütunda tutar -- "ilk kelime" + "cümlenin geri kalanı" örüntüleri için faydalı. 4) <code>[!?.]\\s*</code> gibi bir regex üzerinde bölmek tek geçişte birden fazla cümle sonlandırıcıyı işler. 5) <code>rsplit</code> sağdan böler; <code>n=1</code> ile birleştirilince, dosya uzantılarını ayırmanın kanonik yoludur. 6) NLP tokenizasyonu için, argümansız <code>str.split()</code> boşlukta tokenize eder, token listeleri Series'i döner. 7) <code>.explode()</code> o liste-Series'i token başına bir satırlık uzun-format Series'e çevirir -- kelime sıklıkları, ortak-oluşum ve ters indeksler gibi token seviyesi analitik için temel.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.str.split(pat)</div><div class="card-body">Token listeleri Series'i döner. Varsayılan pat=None herhangi bir boşlukla böler.</div></div>
<div class="calc-card"><div class="card-title">.str.split(expand=True)</div><div class="card-body">Token başına bir sütunlu DataFrame döner. Bölmeleri sınırlamak için n= kullanın.</div></div>
<div class="calc-card"><div class="card-title">.str.rsplit</div><div class="card-body">Aynı ama sağdan böler. Dosya adı ayrıştırma için n=1 ile eşle.</div></div>
<div class="calc-card"><div class="card-title">.explode()</div><div class="card-body">Liste-sütununu uzun forma çevir -- liste elemanı başına bir satır. Token seviyesi NLP için temel.</div></div>
<div class="calc-card"><div class="card-title">.str.cat(others, sep)</div><div class="card-body">İki veya daha fazla string Series'i ayraçla eleman bazında birleştir. Split'in tersi.</div></div>
<div class="calc-card"><div class="card-title">.str.join(sep)</div><div class="card-body">Liste elemanlarını ayraçla yapıştır. <code>tokens.str.join(" ")</code> cümleyi yeniden kurar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># İki sütunu birleştir</span>
df = pd.<span class="fn">DataFrame</span>({
    <span class="str">"ad"</span>: [<span class="str">"Mikail"</span>, <span class="str">"Ayse"</span>, <span class="str">"Bob"</span>],
    <span class="str">"soyad"</span>: [<span class="str">"Sarpkaya"</span>, <span class="str">"Yilmaz"</span>, <span class="str">"Smith"</span>],
})
df[<span class="str">"tam"</span>] = df[<span class="str">"ad"</span>].<span class="ty">str</span>.<span class="fn">cat</span>(df[<span class="str">"soyad"</span>], sep=<span class="str">" "</span>)

<span class="cm"># Token'ları cümleye geri yapıştır</span>
tokenlar = pd.<span class="fn">Series</span>([[<span class="str">"pandas"</span>, <span class="str">"seviyorum"</span>], [<span class="str">"derin"</span>, <span class="str">"öğrenme"</span>]])
cumleler = tokenlar.<span class="ty">str</span>.<span class="fn">join</span>(<span class="str">" "</span>)</code></pre></div>

<p class="l-text"><strong>Hızlı özet:</strong> <code>split + explode</code> token seviyesi analiz için klasik Pandas deyimidir; <code>cat</code> ve <code>join</code> şeyleri görüntü veya saklama için tekrar bir araya getirme yolunuzdur.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Değiştirme ve Temizleme</h2>

<p class="l-text"><code>.str.replace</code> sizin neşterinizdir. Eşleşen alt-stringleri (literal veya regex) seçtiğiniz herhangi bir şeyle değiştirir, boş string dahil -- ham metinden URL'leri, mention'ları, noktalama ve emojileri böyle temizlersiniz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

tweetler = pd.<span class="fn">Series</span>([
    <span class="str">"Yeni surumu sevdim https://t.co/abc123 !! @python_dev"</span>,
    <span class="str">"Ziyaret edin www.example.com :):):)"</span>,
    <span class="str">"Bana yaz: hi@example.com veya 555-1234'u ara"</span>,
    <span class="str">"Cok    bosluk    burada"</span>,
    <span class="str">"Etiketler #harika #cok"</span>,
])

<span class="cm"># Literal değiştirme -- regex=False hızlı ve öngörülebilir</span>
<span class="fn">print</span>(tweetler.<span class="ty">str</span>.<span class="fn">replace</span>(<span class="str">"!!"</span>, <span class="str">"!"</span>, regex=<span class="kw">False</span>))

<span class="cm"># Regex değiştirme</span>
url_temiz = tweetler.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"https?://\\S+|www\\.\\S+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)
mention_temiz = url_temiz.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"@\\w+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)
hashtag_temiz = mention_temiz.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"#\\w+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)

<span class="cm"># Email maskeleme -- token ile değiştir</span>
email_maskeli = tweetler.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\S+@\\S+\\.\\S+"</span>, <span class="str">"[EMAIL]"</span>, regex=<span class="kw">True</span>)

<span class="cm"># Telefon maskeleme</span>
telefon_maskeli = tweetler.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\d{3}-\\d{4}"</span>, <span class="str">"[TELEFON]"</span>, regex=<span class="kw">True</span>)

<span class="cm"># Birden çok boşluğu tek boşluğa indir</span>
bosluklu = pd.<span class="fn">Series</span>([<span class="str">"Cok    bosluk"</span>, <span class="str">"Tab\\therede"</span>])
azaltilmis = bosluklu.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\s+"</span>, <span class="str">" "</span>, regex=<span class="kw">True</span>).<span class="ty">str</span>.<span class="fn">strip</span>()

<span class="cm"># Tüm noktalamayı tek seferde kaldır</span>
noktalama = pd.<span class="fn">Series</span>([<span class="str">"Merhaba, dunya!"</span>, <span class="str">"Naber? Iyiyim!"</span>])
noktalama_yok = noktalama.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"[^\\w\\s]"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>)

<span class="cm"># Callback fonksiyon ile değiştir (ileri seviye)</span>
<span class="kw">def</span> <span class="fn">vurgula</span>(eslesme):
    <span class="kw">return</span> eslesme.<span class="fn">group</span>(<span class="num">0</span>).<span class="fn">upper</span>()

s = pd.<span class="fn">Series</span>([<span class="str">"pandas seviyorum"</span>, <span class="str">"python seviyorum"</span>])
vurgulanmis = s.<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"seviyorum"</span>, vurgula, regex=<span class="kw">True</span>)</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>regex=False</code> ile literal değiştirme, desenler gerekmediğinde en güvenli varsayılandır -- arama stringini düz metin olarak ele alır. 2) URL kaldırma regex'i <code>https?://\\S+|www\\.\\S+</code> hem <code>http://</code>, <code>https://</code> hem de <code>www.</code> URL'lerini tek geçişte yakalar. 3) Mention kaldırma <code>@\\w+</code> kelime karakterleri ile takip eden @ ile eşleşir -- Twitter mention'larını temiz şekilde sıyırır. 4) Hashtag sıyırma benzerdir; bazı pipeline'lar hashtag'leri token olarak tutar, diğerleri kaldırır, göreve bağlıdır. 5) E-posta maskeleme e-posta-şekilli stringleri sabit yer tutucu <code>[EMAIL]</code> ile değiştirir -- gizliliği koruyan NLP ve nadir-token gürültüsünün kelime dağarcığını şişirmemesi için faydalı. 6) <code>\\s+</code> bir veya daha fazla boşluk karakteriyle eşleşir; tek boşlukla değiştirip strip etmek normalleştirilmiş metin verir. 7) <code>[^\\w\\s]</code> "kelime karakteri veya boşluk OLMAYAN herhangi bir şey" anlamına gelir -- acımasız ama etkili bir noktalama temizleyici. 8) Callback formu değişikliği dinamik olarak hesaplamanıza olanak tanır; <code>match.group(0)</code> tam eşleşmeyi verir ve dönen değer ne olursa olsun yedek olur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: uçtan-uca tweet temizleme zinciri</div><div class="example-body">Yaygın tek-seferlik temizleme zinciri:<br>
<code>temiz = (df["text"]<br>
.str.lower()<br>
.str.replace(r"https?://\\S+", "", regex=True)<br>
.str.replace(r"@\\w+", "", regex=True)<br>
.str.replace(r"#(\\w+)", r"\\1", regex=True)  # etiket kelimesini tut, # at<br>
.str.replace(r"[^\\w\\s]", " ", regex=True)<br>
.str.replace(r"\\s+", " ", regex=True)<br>
.str.strip())</code><br>
Bu 7 satırlık zincir ham tweetleri alır ve küçük harfli, URL'siz, mention'sız, noktalamasız, tek boşluklu metin döner. 1M satırı 5 saniyenin altında çalıştır.</div></div>

<div class="l-note"><strong>Aksanlar ve Unicode hakkında:</strong> Pandas'ta yerleşik aksan sıyırıcı yoktur. Standart örüntü <code>df["text"].str.normalize("NFKD").str.encode("ascii", "ignore").str.decode("ascii")</code>'dur -- karakterleri parçala, ASCII olmayanı düşür, geri çöz. Türkçe veride bu <code>ç ğ ı ö ş ü</code>'yü de öldürür, bu yüzden hedefli bir replace (<code>"ı" -&gt; "i"</code>) yapmak isteyebilirsiniz.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NLP Ön İşleme Pipeline'ı (Vektörize)</h2>

<p class="l-text">Şimdi her şeyi gerçek bir vektörize NLP temizleme pipeline'ında bir araya getiriyoruz -- bir TF-IDF veya transformer modelinin önüne koyacağınız türden.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

ham = pd.<span class="fn">DataFrame</span>({<span class="str">"text"</span>: [
    <span class="str">"Yeni surumu sevdim!! https://t.co/abc @python_dev #python"</span>,
    <span class="str">"  Bu sadece IDARE EDER, ozel bir sey değil  "</span>,
    <span class="str">"Tum zamanlarin EN KOTU filmi. Her ne pahasina kacin!!!"</span>,
    <span class="str">"Guzel sinematografi, https://imdb.com #film #yorum"</span>,
    <span class="kw">None</span>,
    <span class="str">"lol bilmiyorum dostum, biraz idare eder gercekten"</span>,
    <span class="str">"HARIKA oyunculuk ve harika hikaye"</span>,
]})

STOPWORDS = {<span class="str">"bir"</span>, <span class="str">"bu"</span>, <span class="str">"ve"</span>, <span class="str">"de"</span>, <span class="str">"da"</span>, <span class="str">"için"</span>, <span class="str">"ile"</span>, <span class="str">"ama"</span>, <span class="str">"ki"</span>,
             <span class="str">"gibi"</span>, <span class="str">"kadar"</span>, <span class="str">"daha"</span>, <span class="str">"cok"</span>, <span class="str">"az"</span>, <span class="str">"her"</span>, <span class="str">"ne"</span>, <span class="str">"mi"</span>}

temiz = (
    ham.<span class="fn">assign</span>(text=ham[<span class="str">"text"</span>].<span class="fn">fillna</span>(<span class="str">""</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">lower</span>())
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"https?://\\S+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"@\\w+"</span>, <span class="str">""</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"#(\\w+)"</span>, r<span class="str">"\\1"</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"[^\\w\\s]"</span>, <span class="str">" "</span>, regex=<span class="kw">True</span>))
       .<span class="fn">assign</span>(text=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(r<span class="str">"\\s+"</span>, <span class="str">" "</span>, regex=<span class="kw">True</span>).<span class="ty">str</span>.<span class="fn">strip</span>())
       .<span class="fn">assign</span>(tokens=<span class="kw">lambda</span> d: d[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">split</span>())
       .<span class="fn">assign</span>(tokens=<span class="kw">lambda</span> d: d[<span class="str">"tokens"</span>].<span class="fn">apply</span>(
           <span class="kw">lambda</span> lst: [t <span class="kw">for</span> t <span class="kw">in</span> lst <span class="kw">if</span> t <span class="kw">not</span> <span class="kw">in</span> STOPWORDS <span class="kw">and</span> <span class="fn">len</span>(t) &gt; <span class="num">2</span>]))
       .<span class="fn">assign</span>(text_temiz=<span class="kw">lambda</span> d: d[<span class="str">"tokens"</span>].<span class="ty">str</span>.<span class="fn">join</span>(<span class="str">" "</span>))
       .<span class="fn">assign</span>(token_n=<span class="kw">lambda</span> d: d[<span class="str">"tokens"</span>].<span class="ty">str</span>.<span class="fn">len</span>())
       .<span class="fn">query</span>(<span class="str">"token_n &gt;= 2"</span>)
)</code></pre></div>

<p class="l-text"><strong>Bu pipeline adım adım ne yapar:</strong> 1) <strong>fillna("")</strong> NaN hücreleri boş stringe çevirir, böylece zincir asla kırılmaz. 2) <strong>lower()</strong> büyük/küçük harfi normalleştirir, "HARIKA" ve "harika" aynı token olur. 3) <strong>URL sıyırma</strong> tek regex geçişinde herhangi bir http/https URL'sini kaldırır. 4) <strong>Mention sıyırma</strong> konu içeriği olmayan <code>@kullaniciadi</code> token'larını öldürür. 5) <strong>Hashtag işleme</strong> -- hashtag'lerin <em>kelime</em> kısmını (<code>#python -&gt; python</code>) tutar, böylece konu sinyaline katkıda bulunur. 6) <strong>Noktalama kaldırma</strong> <code>[^\\w\\s]</code> ile virgülleri, ünlem işaretlerini, emojileri boşluklara çevirir, sonra <strong>boşluk azaltma</strong> aralıkları normalleştirir. 7) <strong>Tokenizasyon</strong> <code>str.split()</code> ile temizlenmiş stringi bir kelime listesine çevirir. 8) <strong>Stopword + kısa-token filtresi</strong> 3 karakterden kısa kelimeleri ve bilinen stopword'leri düşürür -- Python kullanan tek adımdır (liste comprehension), çünkü stopword araması Python set olarak regex'ten daha hızlıdır. 9) <strong>Yeniden inşa</strong> <code>str.join(" ")</code> ile aşağı akış araçları için temiz bir cümle stringi oluşturur. 10) <strong>token_n</strong> hayatta kalan token'ları sayar, sonraki adım tarafından kullanılır. 11) <strong>query</strong> 2'den az token'ı olan satırları filtreler -- temizlemeden sonra çok kısa satırlar genellikle gürültüdür.</p>

<div id="plot-l9-zipf-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> log-log eksenlerde token sıklığı sırası vs sıklık -- klasik Zipf yasası şekli, 5000 yorumlu sentetik bir corpus'u tokenize ederek hesaplandı. Log-log eksenlerdeki düz çizgi, k. en sık kelimenin en sık kelimenin yaklaşık 1/k katı sıklıkta göründüğünü gösterir -- doğal dilin neredeyse evrensel bir özelliği. TF-IDF'in çalışmasının (yaygın kelimeleri ağırlıkla azalt) ve subword tokenizasyonunun gerekli olmasının (uzun kuyruk büyüktür) sebebi budur.</div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Küçük harfe çevir</div><div class="step-detail">Evrensel ilk adım. Yalnızca modeliniz büyük/küçük harf duyarlıysa atlayın (klasik NLP'de nadir).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">URL/mention'ları kaldır</div><div class="step-detail">Konu veya duygu sinyaline hiçbir şey eklemeyen alana özgü gürültü.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Hashtag'leri işle</div><div class="step-detail">Kelimeyi tut, # işaretini at. Bazı araştırmalar # işaretini belirteç olarak tutar.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Noktalamayı sıyır</div><div class="step-detail">Boşlukla değiştir sonra boşluğu azalt. Birleşik token oluşturmaktan kaçın.</div></div></div>
<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Tokenize et</div><div class="step-detail">Boşluk tokenizasyonu için str.split(). Türkçe/eklemeli diller için gerçek bir tokenizer (spaCy, NLTK) kullanın.</div></div></div>
<div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Stopword + uzunluk filtresi</div><div class="step-detail">Set araması en hızlısıdır. Gürültüyü kaldırmak için 2-3 karakterden kısa token'ları düşürün.</div></div></div>
<div class="calc-step"><div class="step-num">7</div><div class="step-content"><div class="step-title">Satırlarda uzunluk filtresi</div><div class="step-detail">Çok az hayatta kalan token'lı satırları düşürün -- zaten hiçbir şey öğrenmeyecekler.</div></div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Performans ve Encoding Tuzakları</h2>

<p class="l-text">Deneyimli kullanıcıları bile şaşırtan birkaç ince tuzak.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.str.len() vs len()</div><div class="card-body"><code>df["text"].str.len()</code> vektörize uzunluktur, NaN-güvenli, float Series döner. <code>df["text"].apply(len)</code> çalışır ama 5-10 kat daha yavaştır ve NaN'da çöker.</div></div>
<div class="calc-card"><div class="card-title">Encoding</div><div class="card-body">CSV'leri <code>encoding="utf-8"</code> ile okuyun. Bazı Excel dışa aktarmaları Türkçe için <code>latin-1</code> veya <code>cp1254</code>'tür. Karakterler <code>ş</code> yerine <code>ÅŸ</code> gibi görünüyorsa byte-seviyesi dökümünü kontrol edin -- bu utf-8'in latin-1 olarak okunmasıdır.</div></div>
<div class="calc-card"><div class="card-title">Unicode normalleştirme</div><div class="card-body">"é" tek codepoint (NFC) veya iki olabilir (NFD: "e" + birleştirici aksan). Karşılaştırma ve dedup karıştırırsanız başarısız olur. Standartlaştırmak için <code>str.normalize("NFC")</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">Regex derleme maliyeti</div><div class="card-body">Pandas regex'inizi çağrı başına bir kez derler. Aynı deseni birçok çağrıda yeniden kullanırsanız, bir kez <code>re.compile</code> ile derleyin ve derlenmiş nesneyi geçirin.</div></div>
<div class="calc-card"><div class="card-title">Büyük string için bellek</div><div class="card-body">Object dtype'taki uzun string sütunu her işlemde kopyalanır. Çok büyük NLP corpus'ları için <code>"string"</code> dtype'a (<code>astype("string")</code>) bakın -- içeride Arrow kullanır ve daha bellek verimlidir.</div></div>
<div class="calc-card"><div class="card-title">Paralellik</div><div class="card-body">Vektörize .str tek iş parçacıklıdır. Devasa corpus'larda utanç verici paralel temizlemeler için <code>swifter</code> (drop-in <code>.swifter.apply</code>) veya <code>dask.dataframe</code> kullanın.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> re

<span class="cm"># Encoding tuzağı demosu</span>
<span class="cm"># CSV'niz "Aşk" yerine "AÅŸk" gösteriyorsa:</span>
df = pd.<span class="fn">read_csv</span>(<span class="str">"turkce.csv"</span>, encoding=<span class="str">"utf-8"</span>)  <span class="cm"># önce utf-8 dene</span>
<span class="cm"># Bozuksa şunları dene:</span>
<span class="cm"># df = pd.read_csv("turkce.csv", encoding="cp1254")</span>
<span class="cm"># df = pd.read_csv("turkce.csv", encoding="latin-1")</span>

<span class="cm"># Unicode normalleştirme</span>
s = pd.<span class="fn">Series</span>([<span class="str">"café"</span>, <span class="str">"cafe\\u0301"</span>])   <span class="cm"># ikincisi "cafe" + birleştirici aksan</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">len</span>())                       <span class="cm"># 4, 5 -- farklı uzunluklar!</span>
<span class="fn">print</span>(s.<span class="ty">str</span>.<span class="fn">normalize</span>(<span class="str">"NFC"</span>).<span class="ty">str</span>.<span class="fn">len</span>())  <span class="cm"># 4, 4 -- normalleştirildi</span>

<span class="cm"># Sıcak döngüler için derlenmiş regex'i yeniden kullan</span>
url_pat = re.<span class="fn">compile</span>(r<span class="str">"https?://\\S+"</span>)
temiz = df[<span class="str">"text"</span>].<span class="ty">str</span>.<span class="fn">replace</span>(url_pat, <span class="str">""</span>, regex=<span class="kw">True</span>)

<span class="cm"># Bellek verimli string dtype (Arrow destekli)</span>
df[<span class="str">"text"</span>] = df[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="str">"string"</span>)    <span class="cm"># vs object dtype</span></code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Türkçe-encoding tuzağını gösterir: <code>Aşk</code> yanlış codec ile okunduğunda <code>AÅŸk</code> olarak görünür; <code>cp1254</code> veya <code>latin-1</code>'e geçmek düzeltir. 2) Görsel olarak özdeş string'lerin biri önceden bestelenmiş aksanlar (NFC) ve diğeri birleştirici işaretler (NFD) kullanırsa farklı uzunluklara sahip olabileceğini gösterir. 3) <code>str.normalize("NFC")</code> kanonik biçimi zorlar, böylece dedup ve eşitlik kontrolleri çalışır. 4) <code>re.compile</code> ile bir regex'i ön derlemek, aynı desenin birçok kez kullanıldığında tekrarlanan derleme maliyetinden kaçınır. 5) <code>astype("string")</code> daha bellek-verimli ve uygun eksik-değer semantiği destekleyen Arrow-destekli string dtype'a geçer, aynı <code>.str</code> API'si korunur.</p>

<div class="think-box"><div class="think-label">TEMEL ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> <code>.str</code> erişimcisi herhangi bir metin sütunu için varsayılan aracınızdır. <code>.str</code> alternatifi varken <code>.apply(lambda)</code>'dan kaçının -- 10-100 kat daha hızlıdır.<br><strong>2.</strong> Filtreleme yaparken her zaman <code>str.contains</code>'a <code>na=False</code> geçirin, aksi takdirde NaN değerler boolean maskeleme sırasında hata verir.<br><strong>3.</strong> Satır başına ilk eşleşme için <code>.str.extract</code>, tüm eşleşmeler için <code>.str.extractall</code>, satır başına liste için <code>.str.findall</code> kullanın.<br><strong>4.</strong> <code>str.split + .explode()</code> kanonik token seviyesi deyimdir: tokenize, explode, grupla, say.<br><strong>5.</strong> Gerçek bir temizleme zinciri altı satırdır: lower -&gt; URL/mention sıyır -&gt; hashtag normalleştir -&gt; noktalama sıyır -&gt; boşluk azalt -&gt; strip.<br><strong>6.</strong> Encoding'e (<code>utf-8</code> varsayılan, Türkçe Excel için <code>cp1254</code>/<code>latin-1</code>) ve Unicode normalleştirmeye (NFC) eşitlik veya dedup yapmadan önce dikkat edin.<br><strong>7.</strong> Devasa corpus'lar için Arrow-destekli <code>"string"</code> dtype, ön derlenmiş regex desenleri ve paralellik için <code>swifter</code> veya <code>dask</code> düşünün.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};

  // 1. tweet length distribution
  var lens = (function(){
    var seed=3; function r(){seed=(seed*9301+49297)%233280;return seed/233280;}
    var out=[];
    for (var i=0;i<5000;i++){
      // mixture: short + medium + long peak
      var u=r();
      var L;
      if (u<0.15) L = 20 + r()*40;
      else if (u<0.85) L = 60 + r()*80;
      else L = 180 + r()*100;
      out.push(Math.floor(L));
    }
    return out;
  })();

  var el1 = document.getElementById('plot-l9-tweetlen-en');
  if (el1) {
    var trace = {x:lens,type:'histogram',xbins:{start:0,end:300,size:10},marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Tweet Length Distribution (chars)',font:{color:T.text,size:14}},xaxis:{title:'Characters',gridcolor:T.grid},yaxis:{title:'Count',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l9-tweetlen-en',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el1tr = document.getElementById('plot-l9-tweetlen-tr');
  if (el1tr) {
    var trace = {x:lens,type:'histogram',xbins:{start:0,end:300,size:10},marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Tweet Uzunluk Dağılımı (karakter)',font:{color:T.text,size:14}},xaxis:{title:'Karakter',gridcolor:T.grid},yaxis:{title:'Sayim',gridcolor:T.grid,zerolinecolor:T.zero}});
    Plotly.newPlot('plot-l9-tweetlen-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 2. top hashtags bar
  var tags = ["#python","#ai","#data","#ml","#code","#dev","#nlp","#tech","#learn","#opensource"];
  var counts = [310,265,238,210,182,160,140,118,95,80];
  var el2 = document.getElementById('plot-l9-tophash-en');
  if (el2) {
    var trace = {x:counts,y:tags,type:'bar',orientation:'h',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}},text:counts.map(function(v){return String(v);}),textposition:'auto'};
    var layout = Object.assign({}, common, {title:{text:'Top 10 Hashtags by Frequency',font:{color:T.text,size:14}},xaxis:{title:'Count',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:120}});
    Plotly.newPlot('plot-l9-tophash-en',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el2tr = document.getElementById('plot-l9-tophash-tr');
  if (el2tr) {
    var trace = {x:counts,y:tags,type:'bar',orientation:'h',marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}},text:counts.map(function(v){return String(v);}),textposition:'auto'};
    var layout = Object.assign({}, common, {title:{text:'En Yüksek 10 Hashtag (Sikliga Gore)',font:{color:T.text,size:14}},xaxis:{title:'Sayim',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{autorange:'reversed',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:120}});
    Plotly.newPlot('plot-l9-tophash-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }

  // 3. Zipf-like distribution
  var ranks=[]; var freqs=[];
  for (var k=1;k<=500;k++){ranks.push(k); freqs.push(Math.round(20000 / Math.pow(k,1.05)));}
  var el3 = document.getElementById('plot-l9-zipf-en');
  if (el3) {
    var trace = {x:ranks,y:freqs,mode:'markers',type:'scatter',marker:{color:T.accent,size:5,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Token Frequency vs Rank (Zipf law, log-log)',font:{color:T.text,size:14}},xaxis:{title:'Rank',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'},yaxis:{title:'Frequency',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'}});
    Plotly.newPlot('plot-l9-zipf-en',[trace],layout,{responsive:true,displayModeBar:false});
  }
  var el3tr = document.getElementById('plot-l9-zipf-tr');
  if (el3tr) {
    var trace = {x:ranks,y:freqs,mode:'markers',type:'scatter',marker:{color:T.accent,size:5,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Token Sıklığı vs Sıra (Zipf yasası, log-log)',font:{color:T.text,size:14}},xaxis:{title:'Sira',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'},yaxis:{title:'Siklik',gridcolor:T.grid,zerolinecolor:T.zero,type:'log'}});
    Plotly.newPlot('plot-l9-zipf-tr',[trace],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
