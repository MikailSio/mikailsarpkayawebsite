var HF_L2 = {

en: '<p class="l-text"><strong>Every modern language model is blind to raw text.</strong> It sees only integers \u2014 token IDs \u2014 arranged in a fixed-length tensor. The component that performs this translation, the <em>tokenizer</em>, is not a simple lookup table. It is a carefully designed pipeline that splits text into subword units, maps them to IDs, handles vocabulary gaps, adds special control tokens, and produces the attention masks that tell the model which positions to ignore. Getting the tokenizer wrong is one of the most common sources of silent, hard-to-debug errors in NLP projects. This lesson dissects every part of that pipeline.</p>'

+ '<p class="l-text">By the end of this lesson you will be able to load any tokenizer from the Hub, understand every field in its output, handle batches and sentence pairs correctly, use dynamic padding for efficient training, and debug character-level alignment for tasks like Named Entity Recognition.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Compare WordPiece (BERT), BPE (GPT-2), and Unigram (T5) subword algorithms</li>'
+ '<li>Load any tokenizer with <code>AutoTokenizer.from_pretrained</code> and inspect <code>vocab</code></li>'
+ '<li>Read every output field: <code>input_ids</code>, <code>attention_mask</code>, <code>token_type_ids</code>, <code>offset_mapping</code></li>'
+ '<li>Tokenize sentence pairs with <code>[CLS]</code> / <code>[SEP]</code> for classification and QA</li>'
+ '<li>Use dynamic padding via <code>DataCollatorWithPadding</code> for efficient batched training</li>'
+ '<li>Align word labels to subword tokens for NER with <code>word_ids()</code></li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: Why Tokenizers Matter
   ============================================================ */
+ '<h3 class="l-section-title">Why Tokenizers Matter</h3>'

+ '<div class="calc-highlight"><strong>The tokenizer is the contract between text and model.</strong> A BERT checkpoint was trained with the WordPiece tokenizer on a specific 30 000-token vocabulary. If you feed it tokens produced by a GPT-2 BPE tokenizer, every embedding lookup hits a different word \u2014 the model\u2019s weights become meaningless. Tokenizer and model checkpoint are always a matched pair; you must never mix them.</div>'

+ '<p class="l-text">Tokenization involves three conceptual steps that happen in sequence:</p>'

+ '<div class="calc-steps"><div class="cs-step"><div class="cs-num">1</div><div class="cs-content"><strong>Normalisation</strong> \u2014 lowercase, strip accents, apply Unicode NFC. Applied differently by each tokenizer family.</div></div><div class="cs-step"><div class="cs-num">2</div><div class="cs-content"><strong>Pre-tokenisation</strong> \u2014 split on whitespace and punctuation to produce a list of word-level chunks before the subword algorithm runs.</div></div><div class="cs-step"><div class="cs-num">3</div><div class="cs-content"><strong>Subword splitting</strong> \u2014 WordPiece (BERT), BPE (GPT-2, RoBERTa), Unigram (ALBERT, T5) break each chunk into vocabulary tokens. Rare words become several pieces; common words stay whole.</div></div></div>'

+ '<p class="l-text">Subword algorithms solve the <strong>open-vocabulary problem</strong>: a fixed vocabulary of 30 000\u2013 50 000 units can represent any English word by splitting it. "unhappiness" becomes ["un", "##happy", "##ness"] under WordPiece. The "##" prefix signals a continuation piece \u2014 it does not start a new word. This design lets the model share statistics across morphologically related words.</p>'

/* ============================================================
   SECTION 2: AutoTokenizer
   ============================================================ */
+ '<h3 class="l-section-title">AutoTokenizer</h3>'

+ '<p class="l-text"><code>AutoTokenizer</code> is the universal entry point. It reads the tokenizer configuration saved alongside a checkpoint and instantiates the exact class \u2014 BertTokenizerFast, RobertaTokenizerFast, T5TokenizerFast, etc. \u2014 automatically. You almost never need to import a concrete tokenizer class directly.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Loading a Tokenizer from the Hub <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer\n' +
'\n' +
'<span class="cm"># Load tokenizer matched to a checkpoint</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n' +
'\n' +
'<span class="fn">print</span>(<span class="fn">type</span>(tokenizer))\n' +
'<span class="cm"># &lt;class \'transformers.models.bert.tokenization_bert_fast.BertTokenizerFast\'&gt;</span>\n' +
'\n' +
'<span class="fn">print</span>(tokenizer.vocab_size)   <span class="cm"># 30522</span>\n' +
'<span class="fn">print</span>(tokenizer.model_max_length)  <span class="cm"># 512</span>\n' +
'</code></pre></div></div>'

+ '<p class="l-text">The first call downloads four small files: <em>tokenizer_config.json</em>, <em>vocab.txt</em> (or <em>merges.txt</em> for BPE), <em>special_tokens_map.json</em>, and <em>tokenizer.json</em> (the fast tokenizer definition). They are cached in <code>~/.cache/huggingface/hub/</code> for future offline use.</p>'

+ '<h4 class="l-subsection-title">Basic Usage</h4>'

+ '<p class="l-text">Calling the tokenizer like a function is the primary interface. It returns a <code>BatchEncoding</code> object \u2014 a dict-like container with tensor-ready fields.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Tokenizing a Single Sentence <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'encoding = <span class="fn">tokenizer</span>(<span class="str">"Hello, how are you?"</span>)\n' +
'<span class="fn">print</span>(encoding)\n' +
'<span class="cm"># {\'input_ids\': [101, 7592, 1010, 2129, 2024, 2017, 1029, 102],</span>\n' +
'<span class="cm">#  \'token_type_ids\': [0, 0, 0, 0, 0, 0, 0, 0],</span>\n' +
'<span class="cm">#  \'attention_mask\': [1, 1, 1, 1, 1, 1, 1, 1]}</span>\n' +
'\n' +
'<span class="cm"># Field breakdown</span>\n' +
'<span class="fn">print</span>(encoding.input_ids)       <span class="cm"># list of token IDs</span>\n' +
'<span class="fn">print</span>(encoding.attention_mask)  <span class="cm"># 1 = real token, 0 = padding</span>\n' +
'<span class="fn">print</span>(encoding.token_type_ids)  <span class="cm"># 0 = sentence A, 1 = sentence B</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>What the encoding call returns:</strong> 1) <code>tokenizer("Hello, how are you?")</code> runs the entire pipeline (normalize, pre-tokenize, model, post-process) and produces a <code>BatchEncoding</code>. 2) The result is a dict-like object with <code>input_ids</code> (8 token IDs framed by <code>[CLS]=101</code> and <code>[SEP]=102</code>), <code>token_type_ids</code> (all zeros for a single sentence) and <code>attention_mask</code> (all ones since nothing was padded). 3) The dotted access (<code>encoding.input_ids</code>, <code>encoding.attention_mask</code>, <code>encoding.token_type_ids</code>) shows that the same fields are reachable as attributes.</p>'

+ '<h4 class="l-subsection-title">Decoding Back to Text</h4>'

+ '<p class="l-text">Decoding reverses the mapping from IDs to strings. Two decode modes cover the common cases:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Decoding Token IDs to Text <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'ids = encoding.input_ids\n' +
'\n' +
'<span class="cm"># Decode includes special tokens by default</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(ids))\n' +
'<span class="cm"># "[CLS] hello, how are you? [SEP]"</span>\n' +
'\n' +
'<span class="cm"># Skip special tokens for clean output</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(ids, skip_special_tokens=<span class="kw">True</span>))\n' +
'<span class="cm"># "hello, how are you?"</span>\n' +
'\n' +
'<span class="cm"># Decode individual tokens (useful for debugging)</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">convert_ids_to_tokens</span>(ids))\n' +
'<span class="cm"># [\'[CLS]\', \'hello\', \',\', \'how\', \'are\', \'you\', \'?\', \'[SEP]\']</span>\n' +
'\n' +
'<span class="cm"># Map a single token string to its ID</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">convert_tokens_to_ids</span>(<span class="str">"[CLS]"</span>))  <span class="cm"># 101</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>How decoding inverts the tokenizer:</strong> 1) <code>tokenizer.decode(ids)</code> reconstructs the string from the IDs, leaving the <code>[CLS]</code> and <code>[SEP]</code> markers visible. 2) Adding <code>skip_special_tokens=True</code> drops the framing tokens so you get clean human-readable output. 3) <code>tokenizer.convert_ids_to_tokens(ids)</code> returns the per-position token strings without merging — perfect for debugging tokenization edge cases. 4) <code>tokenizer.convert_tokens_to_ids("[CLS]")</code> is the inverse lookup that confirms <code>[CLS]</code> maps to ID <code>101</code>.</p>'

/* ============================================================
   SECTION 3: Special Tokens
   ============================================================ */
+ '<h3 class="l-section-title">Special Tokens</h3>'

+ '<p class="l-text">Special tokens are reserved vocabulary entries that communicate structure to the model. They are not natural language \u2014 they carry positional or functional meaning. Each model family defines its own set, and confusing them across families is a common bug.</p>'

+ '<div class="calc-cards"><div class="cc-card"><div class="cc-title">BERT Special Tokens</div><div class="cc-body"><ul><li><strong>[CLS]</strong> (ID 101) \u2014 prepended to every input. Its final hidden state is used as the sequence-level representation for classification tasks.</li><li><strong>[SEP]</strong> (ID 102) \u2014 appended after each sentence. Separates segment A from segment B in sentence-pair tasks.</li><li><strong>[PAD]</strong> (ID 0) \u2014 pads shorter sequences in a batch to equal length. Paired with attention_mask=0.</li><li><strong>[MASK]</strong> (ID 103) \u2014 used during Masked Language Model pre-training to hide tokens for prediction.</li><li><strong>[UNK]</strong> (ID 100) \u2014 replaces any character sequence not in the vocabulary (rare in WordPiece).</li></ul></div></div><div class="cc-card"><div class="cc-title">RoBERTa / GPT-2 Special Tokens</div><div class="cc-body"><ul><li><strong>&lt;s&gt;</strong> \u2014 beginning-of-sequence, analogous to [CLS]. RoBERTa prepends this to every input.</li><li><strong>&lt;/s&gt;</strong> \u2014 end-of-sequence / separator, analogous to [SEP].</li><li><strong>&lt;pad&gt;</strong> \u2014 padding token. GPT-2\u2019s original tokenizer has no pad token; you must add one for batched inference.</li><li><strong>&lt;unk&gt;</strong> \u2014 unknown token (rare in BPE because any byte sequence is representable).</li><li><strong>&lt;mask&gt;</strong> \u2014 used in RoBERTa\u2019s MLM objective.</li></ul></div></div></div>'

+ '<div class="calc-highlight"><strong>Why [CLS] works for classification:</strong> during pre-training, [CLS] is placed where the model must aggregate information from all positions to predict sentence-level properties (next-sentence prediction in BERT). By the time pre-training ends, the [CLS] hidden state has learned to summarise the whole sequence. Adding a linear head on top of it is therefore a principled choice, not an arbitrary one.</div>'

+ '<p class="l-text">You can inspect all special tokens of any loaded tokenizer:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Inspecting Special Tokens <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="fn">print</span>(tokenizer.all_special_tokens)\n' +
'<span class="cm"># [\'[UNK]\', \'[SEP]\', \'[PAD]\', \'[CLS]\', \'[MASK]\']</span>\n' +
'\n' +
'<span class="fn">print</span>(tokenizer.all_special_ids)\n' +
'<span class="cm"># [100, 102, 0, 101, 103]</span>\n' +
'\n' +
'<span class="cm"># Access individual ones</span>\n' +
'<span class="fn">print</span>(tokenizer.cls_token)   <span class="cm"># \'[CLS]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.sep_token)   <span class="cm"># \'[SEP]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.pad_token)   <span class="cm"># \'[PAD]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.mask_token)  <span class="cm"># \'[MASK]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.unk_token)   <span class="cm"># \'[UNK]\'</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>How to enumerate a tokenizer\'s reserved entries:</strong> 1) <code>tokenizer.all_special_tokens</code> lists the human-readable strings (<code>[UNK]</code>, <code>[SEP]</code>, <code>[PAD]</code>, <code>[CLS]</code>, <code>[MASK]</code>) and <code>tokenizer.all_special_ids</code> the matching integer IDs. 2) The named accessors (<code>cls_token</code>, <code>sep_token</code>, <code>pad_token</code>, <code>mask_token</code>, <code>unk_token</code>) give direct lookup without remembering the order. 3) Whenever you adapt code from a BERT example to RoBERTa or GPT-2, these properties let you fetch the correct sentinel without hard-coding bracket-style strings.</p>'

/* ============================================================
   SECTION 4: Padding & Truncation
   ============================================================ */
+ '<h3 class="l-section-title">Padding &amp; Truncation</h3>'

+ '<p class="l-text">Neural networks process fixed-size tensors. A batch of variable-length sentences must be padded to a uniform length before stacking into a 2-D tensor. Truncation handles the opposite problem: inputs that exceed the model\u2019s maximum position embeddings must be shortened.</p>'

+ '<div class="calc-compare"><div class="ccomp-col"><div class="ccomp-title">Padding Strategies</div><div class="ccomp-body"><table style="width:100%;border-collapse:collapse;font-size:0.88rem;"><thead><tr><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Option</th><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Behaviour</th></tr></thead><tbody><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>padding=True</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Pad to the longest sequence in the current batch. Efficient for single batches.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>padding="longest"</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Same as <code>True</code>. Explicit alias.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>padding="max_length"</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Pad every sequence to <code>max_length</code> tokens regardless of actual length. Wastes compute but gives deterministic shapes.</td></tr><tr><td style="padding:6px 8px;"><code>padding=False</code></td><td style="padding:6px 8px;">No padding. Only works for single inputs or if you handle collation yourself.</td></tr></tbody></table></div></div><div class="ccomp-col"><div class="ccomp-title">Truncation Strategies</div><div class="ccomp-body"><table style="width:100%;border-collapse:collapse;font-size:0.88rem;"><thead><tr><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Option</th><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Behaviour</th></tr></thead><tbody><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>truncation=True</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Truncate to <code>model_max_length</code> (e.g. 512 for BERT). Removes from the right.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>max_length=N</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Override the maximum length. Useful when you want shorter sequences for memory efficiency.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>truncation="only_first"</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">For sentence pairs: truncate only the first sentence. Useful to preserve the question in QA tasks.</td></tr><tr><td style="padding:6px 8px;"><code>truncation="only_second"</code></td><td style="padding:6px 8px;">Truncate only the second sentence.</td></tr></tbody></table></div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Padding and Truncation Options <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="cm"># Typical single-sequence call with both options</span>\n' +
'encoding = <span class="fn">tokenizer</span>(\n' +
'    <span class="str">"This is a very long document..."</span>,\n' +
'    padding=<span class="str">"max_length"</span>,\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    max_length=<span class="num">128</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>  <span class="cm"># return PyTorch tensors</span>\n' +
')\n' +
'<span class="fn">print</span>(encoding.input_ids.shape)   <span class="cm"># torch.Size([1, 128])</span>\n' +
'<span class="fn">print</span>(encoding.attention_mask.shape)  <span class="cm"># torch.Size([1, 128])</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>What the padding + truncation call does:</strong> 1) <code>padding="max_length"</code> ensures every output reaches <code>max_length=128</code> tokens, even short inputs. 2) <code>truncation=True</code> guards against the opposite extreme — any text longer than 128 is clipped from the right. 3) <code>return_tensors="pt"</code> returns PyTorch tensors directly rather than Python lists. 4) The <code>encoding.input_ids.shape</code> and <code>encoding.attention_mask.shape</code> prints confirm both tensors are <code>[1, 128]</code> — fixed-size and ready to feed straight into the model.</p>'

+ '<h4 class="l-subsection-title">Dynamic Padding with DataCollatorWithPadding</h4>'

+ '<p class="l-text">Padding every sample to the global <code>max_length</code> wastes GPU cycles on short documents. <strong>Dynamic padding</strong> pads only to the longest sequence <em>within each mini-batch</em>, drastically reducing the number of pad tokens processed per step. The standard tool for this is <code>DataCollatorWithPadding</code>.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Dynamic Padding with DataCollator <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> DataCollatorWithPadding\n' +
'<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader\n' +
'\n' +
'<span class="cm"># 1. Tokenize WITHOUT padding (store variable-length sequences)</span>\n' +
'<span class="kw">def</span> <span class="fn">tokenize_fn</span>(examples):\n' +
'    <span class="kw">return</span> <span class="fn">tokenizer</span>(\n' +
'        examples[<span class="str">"text"</span>],\n' +
'        truncation=<span class="kw">True</span>,\n' +
'        max_length=<span class="num">512</span>\n' +
'        <span class="cm"># no padding here!</span>\n' +
'    )\n' +
'\n' +
'tokenized_ds = raw_dataset.<span class="fn">map</span>(tokenize_fn, batched=<span class="kw">True</span>)\n' +
'\n' +
'<span class="cm"># 2. Collator pads dynamically at batch assembly time</span>\n' +
'collator = <span class="fn">DataCollatorWithPadding</span>(tokenizer=tokenizer)\n' +
'\n' +
'<span class="cm"># 3. DataLoader uses the collator</span>\n' +
'train_loader = <span class="fn">DataLoader</span>(\n' +
'    tokenized_ds[<span class="str">"train"</span>],\n' +
'    batch_size=<span class="num">32</span>,\n' +
'    shuffle=<span class="kw">True</span>,\n' +
'    collate_fn=collator\n' +
')\n' +
'\n' +
'<span class="cm"># Each batch is padded only to its own longest sequence</span>\n' +
'<span class="kw">for</span> batch <span class="kw">in</span> train_loader:\n' +
'    <span class="fn">print</span>(batch[<span class="str">"input_ids"</span>].shape)  <span class="cm"># e.g. [32, 73] not [32, 512]</span>\n' +
'    <span class="kw">break</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>How dynamic padding wires together:</strong> 1) <code>tokenize_fn</code> applies the tokenizer with <code>truncation=True, max_length=512</code> but deliberately omits padding, leaving variable-length sequences stored in the cached dataset. 2) <code>raw_dataset.map(tokenize_fn, batched=True)</code> tokenizes the whole dataset in parallel and writes results to disk. 3) <code>DataCollatorWithPadding(tokenizer=tokenizer)</code> creates a callable that knows how to pad each mini-batch to its own longest sequence at load time. 4) The <code>DataLoader</code> calls <code>collate_fn=collator</code> for every batch, so the printed <code>batch["input_ids"].shape</code> shows something like <code>[32, 73]</code> instead of <code>[32, 512]</code> — slashing wasted compute.</p>'

/* ============================================================
   SECTION 5: Attention Masks
   ============================================================ */
+ '<h3 class="l-section-title">Attention Masks</h3>'

+ '<p class="l-text">When sequences are padded, the model must know which positions are real tokens and which are fill. The <strong>attention mask</strong> encodes this as a binary vector: 1 for every real token, 0 for every pad token.</p>'

+ '<div class="calc-example"><div class="ce-label">Attention Mask Example</div><div class="ce-content"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;text-align:center;"><thead><tr><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">Position</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">0</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">1</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">2</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">3</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">4</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">5</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">6</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">7</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #333;font-weight:600;">Token</td><td style="padding:8px;border-bottom:1px solid #333;">[CLS]</td><td style="padding:8px;border-bottom:1px solid #333;">hello</td><td style="padding:8px;border-bottom:1px solid #333;">world</td><td style="padding:8px;border-bottom:1px solid #333;">[SEP]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td></tr><tr><td style="padding:8px;font-weight:600;">Mask</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#ff4b4b;">0</td><td style="padding:8px;color:#ff4b4b;">0</td><td style="padding:8px;color:#ff4b4b;">0</td><td style="padding:8px;color:#ff4b4b;">0</td></tr></tbody></table></div></div>'

+ '<div class="l-note"><strong>Why the model needs the attention mask:</strong> inside each self-attention layer, every token attends to every other token by computing a dot-product score. Without masking, pad positions would receive non-zero attention weights and inject noise into every token\u2019s representation. The attention mask is added to the raw logit matrix as a large negative number (\u221210 000) before the softmax, driving those positions\u2019 weights to zero. Forgetting to pass the mask is legal Python \u2014 the code will run and produce plausible-looking output, but accuracy will silently degrade, especially for longer documents with many pad tokens.</div>'

/* ============================================================
   SECTION 6: Batch Encoding & Sentence Pairs
   ============================================================ */
+ '<h3 class="l-section-title">Batch Encoding &amp; Sentence Pairs</h3>'

+ '<p class="l-text">Passing a list of strings tokenizes the whole batch in one call, which is substantially faster than looping. The fast (Rust-based) tokenizers parallelise this internally across CPU cores.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Batch Tokenization <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'texts = [\n' +
'    <span class="str">"The cat sat on the mat."</span>,\n' +
'    <span class="str">"Transformers are state-of-the-art models."</span>,\n' +
'    <span class="str">"Fine-tuning adapts a pre-trained model to a new task."</span>\n' +
']\n' +
'\n' +
'batch = <span class="fn">tokenizer</span>(\n' +
'    texts,\n' +
'    padding=<span class="kw">True</span>,       <span class="cm"># pad to longest in batch</span>\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    max_length=<span class="num">64</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>\n' +
')\n' +
'\n' +
'<span class="fn">print</span>(batch.input_ids.shape)       <span class="cm"># torch.Size([3, 64])</span>\n' +
'<span class="fn">print</span>(batch.attention_mask.shape)  <span class="cm"># torch.Size([3, 64])</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>How batched tokenization differs from single calls:</strong> 1) Passing a Python list of strings into <code>tokenizer(texts, ...)</code> triggers the fast Rust backend\'s multi-threaded encoder, which is dramatically faster than looping in Python. 2) <code>padding=True</code> pads every member of the batch up to the longest member, while <code>truncation=True</code> and <code>max_length=64</code> cap any outlier. 3) <code>return_tensors="pt"</code> packs the result into a rank-2 PyTorch tensor — the printed shapes <code>torch.Size([3, 64])</code> for both <code>input_ids</code> and <code>attention_mask</code> confirm the uniform shape.</p>'

+ '<h4 class="l-subsection-title">Sentence Pairs</h4>'

+ '<p class="l-text">Many tasks \u2014 Natural Language Inference, Question Answering, Semantic Textual Similarity \u2014 require feeding two sentences to the model simultaneously. Pass them as two parallel lists (or two strings for a single pair). BERT wraps them as <code>[CLS] A [SEP] B [SEP]</code>.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Sentence Pair Tokenization <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'premise    = <span class="str">"The man is playing guitar."</span>\n' +
'hypothesis = <span class="str">"A person is making music."</span>\n' +
'\n' +
'<span class="cm"># Single pair</span>\n' +
'enc = <span class="fn">tokenizer</span>(premise, hypothesis)\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(enc.input_ids))\n' +
'<span class="cm"># "[CLS] the man is playing guitar. [SEP] a person is making music. [SEP]"</span>\n' +
'\n' +
'<span class="cm"># Batch of pairs</span>\n' +
'premises    = [<span class="str">"The man is playing guitar."</span>, <span class="str">"It is raining outside."</span>]\n' +
'hypotheses  = [<span class="str">"A person is making music."</span>,  <span class="str">"The weather is wet."</span>]\n' +
'\n' +
'batch = <span class="fn">tokenizer</span>(\n' +
'    premises, hypotheses,\n' +
'    padding=<span class="kw">True</span>,\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>\n' +
')\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>How sentence-pair encoding works:</strong> 1) Calling <code>tokenizer(premise, hypothesis)</code> with two arguments encodes them as <code>[CLS] A [SEP] B [SEP]</code> — visible via <code>tokenizer.decode(enc.input_ids)</code>. 2) Two parallel Python lists (<code>premises</code>, <code>hypotheses</code>) trigger batched pair encoding in a single call. 3) <code>padding=True</code> aligns the batch to its longest pair, <code>truncation=True</code> protects against overflow, and <code>return_tensors="pt"</code> packages the output for PyTorch. 4) Behind the scenes, the tokenizer also fills <code>token_type_ids</code> with zeros for tokens in A and ones for tokens in B so the segment embeddings activate correctly.</p>'

+ '<h4 class="l-subsection-title">token_type_ids: Segment Embeddings</h4>'

+ '<div class="calc-example"><div class="ce-label">token_type_ids for a Sentence Pair</div><div class="ce-content"><p style="margin:0 0 10px 0;font-size:0.88rem;">BERT adds a learned <em>segment embedding</em> to each token so the model knows which sentence it belongs to. The tokenizer encodes this as <code>token_type_ids</code>:</p><table style="width:100%;border-collapse:collapse;font-size:0.82rem;text-align:center;"><thead><tr><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">Token</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">[CLS]</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">the</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">man</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">...</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">[SEP]</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">a</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">person</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">...</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">[SEP]</th></tr></thead><tbody><tr><td style="padding:6px;font-weight:600;">type_id</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#c8a96e;">1</td><td style="padding:6px;color:#c8a96e;">1</td><td style="padding:6px;color:#c8a96e;">1</td><td style="padding:6px;color:#c8a96e;">1</td></tr></tbody></table><p style="margin:10px 0 0 0;font-size:0.85rem;color:#aaa;">RoBERTa does not use token_type_ids (always 0). Models that omit segment embeddings simply ignore this field.</p></div></div>'

/* ============================================================
   SECTION 7: Fast vs Slow Tokenizers
   ============================================================ */
+ '<h3 class="l-section-title">Fast vs Slow Tokenizers</h3>'

+ '<p class="l-text">Transformers ships two implementations of every tokenizer. The <strong>slow</strong> tokenizer is pure Python; the <strong>fast</strong> tokenizer wraps the Rust <code>tokenizers</code> library. <code>AutoTokenizer</code> always prefers the fast version when available.</p>'

+ '<div class="calc-compare"><div class="ccomp-col"><div class="ccomp-title">Slow Tokenizer (Python)</div><div class="ccomp-body"><ul style="font-size:0.88rem;line-height:1.8;"><li>Pure Python implementation</li><li>Fully portable, no compiled dependencies</li><li>Single-threaded</li><li>Does <strong>not</strong> support <code>offset_mapping</code> or <code>word_ids()</code></li><li>10\u201320\u00d7 slower on large datasets</li><li>Class name ends in <code>Tokenizer</code> (e.g. <code>BertTokenizer</code>)</li></ul></div></div><div class="ccomp-col"><div class="ccomp-title">Fast Tokenizer (Rust)</div><div class="ccomp-body"><ul style="font-size:0.88rem;line-height:1.8;"><li>Rust core via the <code>tokenizers</code> library</li><li>Multi-threaded batch processing</li><li>Supports <code>offset_mapping</code>: character span of each token</li><li>Supports <code>word_ids()</code>: original word index of each subword token</li><li>Required for NER token alignment</li><li>Class name ends in <code>TokenizerFast</code></li></ul></div></div></div>'

+ '<h4 class="l-subsection-title">offset_mapping: Character-to-Token Alignment</h4>'

+ '<p class="l-text"><code>offset_mapping</code> returns the <em>(start, end)</em> character offsets in the original string for each token. This is essential when you need to map model predictions back to character positions, for example in span extraction or entity recognition.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Character Offset Mapping <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'text = <span class="str">"London is the capital of England."</span>\n' +
'\n' +
'enc = <span class="fn">tokenizer</span>(\n' +
'    text,\n' +
'    return_offsets_mapping=<span class="kw">True</span>\n' +
')\n' +
'\n' +
'<span class="kw">for</span> token_id, offsets <span class="kw">in</span> <span class="fn">zip</span>(enc.input_ids, enc.offset_mapping):\n' +
'    token = tokenizer.<span class="fn">decode</span>([token_id])\n' +
'    char_span = text[offsets[<span class="num">0</span>]:offsets[<span class="num">1</span>]] <span class="kw">if</span> offsets != (<span class="num">0</span>, <span class="num">0</span>) <span class="kw">else</span> <span class="str">"SPECIAL"</span>\n' +
'    <span class="fn">print</span>(<span class="str">f"{token:15s} offsets={offsets}  chars=\'{char_span}\'"</span>)\n' +
'\n' +
'<span class="cm"># [CLS]           offsets=(0, 0)   chars=\'SPECIAL\'</span>\n' +
'<span class="cm"># london          offsets=(0, 6)   chars=\'London\'</span>\n' +
'<span class="cm"># is              offsets=(7, 9)   chars=\'is\'</span>\n' +
'<span class="cm"># the             offsets=(10, 13) chars=\'the\'</span>\n' +
'<span class="cm"># capital         offsets=(14, 21) chars=\'capital\'</span>\n' +
'<span class="cm"># ...</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>What <code>return_offsets_mapping</code> unlocks:</strong> 1) Setting <code>return_offsets_mapping=True</code> tells the fast tokenizer to attach a list of <code>(start, end)</code> character indices, one entry per token. 2) The loop zips <code>enc.input_ids</code> and <code>enc.offset_mapping</code>, decodes each ID and slices the original <code>text</code> with the offsets to recover the source span. 3) Special tokens such as <code>[CLS]</code> get offsets <code>(0, 0)</code>, which the conditional turns into the label <code>"SPECIAL"</code>. 4) The printed table shows <code>london → (0, 6) → "London"</code> — the exact mapping you need to project model predictions back to character positions for QA span extraction or entity highlighting.</p>'

+ '<h4 class="l-subsection-title">word_ids(): Subword-to-Word Mapping (Critical for NER)</h4>'

+ '<p class="l-text">NER datasets label each <em>word</em>, but the tokenizer may split a single word into several subword tokens. You must align labels from word space to token space. <code>word_ids()</code> returns the original word index for each token (or <code>None</code> for special tokens).</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> NER Label Alignment with word_ids() <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'words  = [<span class="str">"London"</span>, <span class="str">"is"</span>, <span class="str">"the"</span>, <span class="str">"capital"</span>]\n' +
'labels = [<span class="num">1</span>,        <span class="num">0</span>,    <span class="num">0</span>,     <span class="num">0</span>       ]  <span class="cm"># 1 = B-LOC, 0 = O</span>\n' +
'\n' +
'enc = <span class="fn">tokenizer</span>(\n' +
'    words,\n' +
'    is_split_into_words=<span class="kw">True</span>,  <span class="cm"># input is pre-tokenized words</span>\n' +
'    return_tensors=<span class="str">"pt"</span>\n' +
')\n' +
'\n' +
'word_ids = enc.<span class="fn">word_ids</span>(batch_index=<span class="num">0</span>)\n' +
'<span class="fn">print</span>(word_ids)\n' +
'<span class="cm"># [None, 0, 1, 2, 3, None]  (None = CLS / SEP)</span>\n' +
'\n' +
'<span class="cm"># Align labels: assign -100 to special tokens (ignored by cross-entropy)</span>\n' +
'aligned_labels = []\n' +
'<span class="kw">for</span> wid <span class="kw">in</span> word_ids:\n' +
'    <span class="kw">if</span> wid <span class="kw">is</span> <span class="kw">None</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(<span class="num">-100</span>)   <span class="cm"># special token, ignored in loss</span>\n' +
'    <span class="kw">else</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(labels[wid])\n' +
'\n' +
'<span class="fn">print</span>(aligned_labels)\n' +
'<span class="cm"># [-100, 1, 0, 0, 0, -100]</span>\n' +
'</code></pre></div></div>'

+ '<p class="l-text">A common NER convention is to label only the <strong>first subword</strong> of each word and assign <code>-100</code> to continuation pieces. This avoids double-counting multi-token words in the loss:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> First-Subword Label Strategy <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'prev_wid = <span class="kw">None</span>\n' +
'aligned_labels = []\n' +
'<span class="kw">for</span> wid <span class="kw">in</span> word_ids:\n' +
'    <span class="kw">if</span> wid <span class="kw">is</span> <span class="kw">None</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(<span class="num">-100</span>)\n' +
'    <span class="kw">elif</span> wid != prev_wid:\n' +
'        aligned_labels.<span class="fn">append</span>(labels[wid])  <span class="cm"># first subword: real label</span>\n' +
'    <span class="kw">else</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(<span class="num">-100</span>)          <span class="cm"># continuation: ignored</span>\n' +
'    prev_wid = wid\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>The first-subword labelling strategy in plain terms:</strong> 1) Iterate over <code>word_ids</code> while tracking <code>prev_wid</code>, the last word index seen. 2) <code>None</code> word IDs correspond to <code>[CLS]</code> / <code>[SEP]</code> — emit <code>-100</code> so PyTorch\'s cross-entropy loss skips them entirely. 3) When the current <code>wid</code> differs from <code>prev_wid</code>, we\'re on the first subword of a new word — emit the real label <code>labels[wid]</code>. 4) Continuation subwords (<code>wid == prev_wid</code>) get <code>-100</code> too, so a multi-piece word like <code>"hugging"</code> + <code>"face"</code> is counted exactly once in the loss.</p>'

/* ============================================================
   SECTION 8: Training a Custom Tokenizer
   ============================================================ */
+ '<h3 class="l-section-title">Training a Custom Tokenizer</h3>'

+ '<p class="l-text">When your domain contains highly specialised vocabulary \u2014 clinical notes, chemical formulae, legal citations, source code \u2014 the standard Hub tokenizer will fragment your terms into many subwords, wasting sequence budget and making it hard for the model to learn domain patterns. Training a tokenizer from scratch on your corpus gives you a vocabulary tuned to your data.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Training a Custom WordPiece Tokenizer <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> tokenizers <span class="kw">import</span> (\n' +
'    Tokenizer,\n' +
'    models,\n' +
'    trainers,\n' +
'    pre_tokenizers,\n' +
'    normalizers,\n' +
'    decoders\n' +
')\n' +
'<span class="kw">from</span> tokenizers.normalizers <span class="kw">import</span> NFD, Lowercase, StripAccents\n' +
'<span class="kw">from</span> tokenizers.pre_tokenizers <span class="kw">import</span> Whitespace\n' +
'\n' +
'<span class="cm"># 1. Define the model (WordPiece here; use BPE for GPT-style)</span>\n' +
'tokenizer = <span class="fn">Tokenizer</span>(models.<span class="fn">WordPiece</span>(unk_token=<span class="str">"[UNK]"</span>))\n' +
'\n' +
'<span class="cm"># 2. Normalisation pipeline</span>\n' +
'tokenizer.normalizer = normalizers.<span class="fn">Sequence</span>([<span class="fn">NFD</span>(), <span class="fn">Lowercase</span>(), <span class="fn">StripAccents</span>()])\n' +
'\n' +
'<span class="cm"># 3. Pre-tokenisation: split on whitespace before subword splitting</span>\n' +
'tokenizer.pre_tokenizer = <span class="fn">Whitespace</span>()\n' +
'\n' +
'<span class="cm"># 4. Trainer with special tokens and target vocab size</span>\n' +
'trainer = trainers.<span class="fn">WordPieceTrainer</span>(\n' +
'    vocab_size=<span class="num">30_000</span>,\n' +
'    special_tokens=[<span class="str">"[UNK]"</span>, <span class="str">"[CLS]"</span>, <span class="str">"[SEP]"</span>, <span class="str">"[PAD]"</span>, <span class="str">"[MASK]"</span>]\n' +
')\n' +
'\n' +
'<span class="cm"># 5. Train on a list of plain-text files</span>\n' +
'tokenizer.<span class="fn">train</span>(files=[<span class="str">"corpus_train.txt"</span>, <span class="str">"corpus_val.txt"</span>], trainer=trainer)\n' +
'\n' +
'<span class="cm"># 6. Set decoder so ##-prefixed pieces join correctly</span>\n' +
'tokenizer.decoder = decoders.<span class="fn">WordPiece</span>()\n' +
'\n' +
'<span class="cm"># 7. Save</span>\n' +
'tokenizer.<span class="fn">save</span>(<span class="str">"my_custom_tokenizer.json"</span>)\n' +
'\n' +
'<span class="cm"># 8. Wrap in a Transformers-compatible fast tokenizer</span>\n' +
'<span class="kw">from</span> transformers <span class="kw">import</span> PreTrainedTokenizerFast\n' +
'fast_tok = <span class="fn">PreTrainedTokenizerFast</span>(tokenizer_file=<span class="str">"my_custom_tokenizer.json"</span>)\n' +
'fast_tok.<span class="fn">save_pretrained</span>(<span class="str">"my_custom_tokenizer/"</span>)\n' +
'</code></pre></div></div>'

+ '<p class="l-text">Training on a few hundred MB of domain text typically takes under a minute on a modern CPU. The resulting tokenizer can be pushed to the Hub and loaded by collaborators with a single <code>AutoTokenizer.from_pretrained()</code> call.</p>'

/* ============================================================
   SECTION 9: Common Pitfalls
   ============================================================ */
+ '<h3 class="l-section-title">Common Pitfalls</h3>'

+ '<div class="l-warn"><strong>Pitfall 1 \u2014 Forgetting attention_mask:</strong> The tokenizer always returns an <code>attention_mask</code>, but if you manually construct <code>input_ids</code> (e.g. from a cache or a custom dataset) you may forget to also provide the mask. Without it, the model treats every position \u2014 including any zeros used as padding \u2014 as a real token. Symptoms: slightly lower accuracy that is difficult to attribute, and worse performance on longer padded sequences. Fix: always build <code>attention_mask</code> alongside <code>input_ids</code>. If padding manually, set mask positions to 0 wherever you placed a pad token ID.</div>'

+ '<div class="l-warn"><strong>Pitfall 2 \u2014 Wrong max_length:</strong> BERT has a hard position-embedding limit of 512. Passing <code>max_length=512</code> is safe, but some practitioners accidentally pass their dataset\u2019s longest document length or a training hyperparameter as <code>max_length</code> without enabling <code>truncation=True</code>. If a document exceeds the model\u2019s limit and truncation is disabled, the tokenizer will silently return an over-length sequence that will crash inside the model\u2019s embedding layer with a shape mismatch. Always pair <code>max_length</code> with <code>truncation=True</code>.</div>'

+ '<div class="l-warn"><strong>Pitfall 3 \u2014 Mixing tokenizers across model checkpoints:</strong> Every model checkpoint is tied to the tokenizer it was pre-trained with. Loading a RoBERTa model and tokenizing with a BERT tokenizer produces subtly different token IDs (different vocabulary, different special token IDs). The model\u2019s embedding matrix will map those IDs to the wrong vectors. There is no error message \u2014 the model will run and produce outputs, but they will be wrong. Always call <code>AutoTokenizer.from_pretrained(model_name)</code> with the <em>same</em> model name you use for <code>AutoModel.from_pretrained(model_name)</code>.</div>'

+ '<div class="l-warn"><strong>Pitfall 4 \u2014 GPT-2 has no pad token by default:</strong> GPT-2\u2019s original tokenizer does not define a padding token because it was designed for single-sequence generation, not batched classification. If you try to pad a batch you will get a <code>ValueError</code>. Fix: set <code>tokenizer.pad_token = tokenizer.eos_token</code> before batching, and make sure to pass the attention mask so the model ignores the padded eos positions.</div>'

+ '<div class="l-warn"><strong>Pitfall 5 \u2014 Using slow tokenizer for NER alignment:</strong> <code>word_ids()</code> and <code>return_offsets_mapping</code> are only available on fast tokenizers. If you load with <code>use_fast=False</code> and then call <code>encoding.word_ids()</code>, you will get an <code>AttributeError</code>. Always use fast tokenizers (the default) for sequence labelling tasks.</div>'

,
tr: '<p class="l-text"><strong>Her modern dil modeli ham metni göremez.</strong> Yalnızca tam boyutlu bir tensörde sıralanmış tamsayıları — token ID\'lerini — görür. Bu çeviriyi gerçekleştiren bileşen, <em>tokenizer</em>, basit bir arama tablosu değildir. Metni alt sözcük birimlerine ayıran, bunları ID\'lere eşleyen, kelime dağarcığı boşluklarını yöneten, özel kontrol token\'ları ekleyen ve modele hangi konumları yok sayacağını söyleyen attention mask\'ları üreten, titizlikle tasarlanmış bir pipeline\'dır. Tokenizer\'ı yanlış kullanmak, NLP projelerindeki sessiz, ayıklaması zor hataların en yaygın kaynaklarından biridir. Bu ders söz konusu pipeline\'ın her parçasını ele almaktadır.</p>'

+ '<p class="l-text">Bu dersin sonunda Hub\'dan herhangi bir tokenizer yükleyebilecek, çıktısındaki her alanı anlayabilecek, grupları ve cümle çiftlerini doğru biçimde işleyebilecek, verimli eğitim için dinamik dolgu uygulayabilecek ve Adlandırılmış Varlık Tanıma gibi görevler için karakter düzeyinde hizalama yapabileceksiniz.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>WordPiece (BERT), BPE (GPT-2) ve Unigram (T5) alt sözcük algoritmalarını karşılaştırmayı</li>'
+ '<li>Herhangi bir tokenizer\'ı <code>AutoTokenizer.from_pretrained</code> ile yüklemeyi ve <code>vocab</code>\'ını incelemeyi</li>'
+ '<li>Her çıktı alanını okumayı: <code>input_ids</code>, <code>attention_mask</code>, <code>token_type_ids</code>, <code>offset_mapping</code></li>'
+ '<li>Sınıflandırma ve QA için cümle çiftlerini <code>[CLS]</code> / <code>[SEP]</code> ile tokenleştirmeyi</li>'
+ '<li>Verimli batch eğitimi için <code>DataCollatorWithPadding</code> ile dinamik padding kullanmayı</li>'
+ '<li>NER için kelime etiketlerini alt sözcük token\'larına <code>word_ids()</code> ile hizalamayı</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: Why Tokenizers Matter
   ============================================================ */
+ '<h3 class="l-section-title">Tokenizer\'lar Neden Önemlidir?</h3>'

+ '<div class="calc-highlight"><strong>Tokenizer, metin ile model arasındaki sözleşmedir.</strong> Bir BERT checkpoint\'i, belirli 30.000 token\'lık bir kelime dağarcığı üzerinde WordPiece tokenizer ile eğitilmiştir. GPT-2 BPE tokenizer tarafından üretilen token\'larla beslerseniz, her gömü araması farklı bir kelimeye denk gelir — modelin ağırlıkları anlamsız hale gelir. Tokenizer ve model checkpoint\'i her zaman eşleştirilmiş bir çifttir; bunları asla karıştırmamalısınız.</div>'

+ '<p class="l-text">Tokenizasyon, sırayla gerçekleşen üç kavramsal adımdan oluşur:</p>'

+ '<div class="calc-steps"><div class="cs-step"><div class="cs-num">1</div><div class="cs-content"><strong>Normalleştirme</strong> — küçük harf dönüşümü, aksanları kaldırma, Unicode NFC uygulama. Her tokenizer ailesi tarafından farklı biçimde uygulanır.</div></div><div class="cs-step"><div class="cs-num">2</div><div class="cs-content"><strong>Ön tokenizasyon</strong> — alt sözcük algoritması çalışmadan önce sözcük düzeyinde parçalar listesi oluşturmak için boşluk ve noktalama işaretlerine göre bölme.</div></div><div class="cs-step"><div class="cs-num">3</div><div class="cs-content"><strong>Alt sözcük bölme</strong> — WordPiece (BERT), BPE (GPT-2, RoBERTa), Unigram (ALBERT, T5) her parçayı kelime dağarcığı token\'larına böler. Nadir kelimeler birkaç parçaya dönüşür; yaygın kelimeler bütün kalır.</div></div></div>'

+ '<p class="l-text">Alt sözcük algoritmaları <strong>açık kelime dağarcığı sorununu</strong> çözer: 30.000–50.000 birimlik sabit bir kelime dağarcığı, her İngilizce kelimeyi bölerek temsil edebilir. "unhappiness" kelimesi WordPiece altında ["un", "##happy", "##ness"] haline gelir. "##" öneki bir devam parçasını belirtir — yeni bir kelime başlamaz. Bu tasarım, modelin morfolojik olarak ilişkili kelimeler arasında istatistikleri paylaşmasına olanak tanır.</p>'

/* ============================================================
   SECTION 2: AutoTokenizer
   ============================================================ */
+ '<h3 class="l-section-title">AutoTokenizer</h3>'

+ '<p class="l-text"><code>AutoTokenizer</code>, evrensel giriş noktasıdır. Bir checkpoint ile birlikte kaydedilen tokenizer yapılandırmasını okur ve tam sınıfı — BertTokenizerFast, RobertaTokenizerFast, T5TokenizerFast vb. — otomatik olarak başlatır. Somut bir tokenizer sınıfını doğrudan içe aktarmanız neredeyse hiçbir zaman gerekmez.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Loading a Tokenizer from the Hub <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer\n' +
'\n' +
'<span class="cm"># Load tokenizer matched to a checkpoint</span>\n' +
'tokenizer = AutoTokenizer.<span class="fn">from_pretrained</span>(<span class="str">"bert-base-uncased"</span>)\n' +
'\n' +
'<span class="fn">print</span>(<span class="fn">type</span>(tokenizer))\n' +
'<span class="cm"># &lt;class \'transformers.models.bert.tokenization_bert_fast.BertTokenizerFast\'&gt;</span>\n' +
'\n' +
'<span class="fn">print</span>(tokenizer.vocab_size)   <span class="cm"># 30522</span>\n' +
'<span class="fn">print</span>(tokenizer.model_max_length)  <span class="cm"># 512</span>\n' +
'</code></pre></div></div>'

+ '<p class="l-text">İlk çağrı dört küçük dosyayı indirir: <em>tokenizer_config.json</em>, <em>vocab.txt</em> (veya BPE için <em>merges.txt</em>), <em>special_tokens_map.json</em> ve <em>tokenizer.json</em> (hızlı tokenizer tanımı). Bu dosyalar, gelecekte çevrimdışı kullanım için <code>~/.cache/huggingface/hub/</code> dizininde önbelleğe alınır.</p>'

+ '<h4 class="l-subsection-title">Temel Kullanım</h4>'

+ '<p class="l-text">Tokenizer\'ı bir fonksiyon gibi çağırmak temel arayüzdür. Tensöre hazır alanları olan sözlük benzeri bir kap olan <code>BatchEncoding</code> nesnesi döndürür.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Tek Cümleyi Tokenize Etme <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'encoding = <span class="fn">tokenizer</span>(<span class="str">"Hello, how are you?"</span>)\n' +
'<span class="fn">print</span>(encoding)\n' +
'<span class="cm"># {\'input_ids\': [101, 7592, 1010, 2129, 2024, 2017, 1029, 102],</span>\n' +
'<span class="cm">#  \'token_type_ids\': [0, 0, 0, 0, 0, 0, 0, 0],</span>\n' +
'<span class="cm">#  \'attention_mask\': [1, 1, 1, 1, 1, 1, 1, 1]}</span>\n' +
'\n' +
'<span class="cm"># Alan ayrıntısı</span>\n' +
'<span class="fn">print</span>(encoding.input_ids)       <span class="cm"># token ID listesi</span>\n' +
'<span class="fn">print</span>(encoding.attention_mask)  <span class="cm"># 1 = gerçek token, 0 = padding</span>\n' +
'<span class="fn">print</span>(encoding.token_type_ids)  <span class="cm"># 0 = cümle A, 1 = cümle B</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>Encoding çağrısı ne döndürür:</strong> 1) <code>tokenizer("Hello, how are you?")</code> tüm pipeline\'ı (normalize, pre-tokenize, model, post-process) çalıştırır ve bir <code>BatchEncoding</code> üretir. 2) Sonuç, <code>input_ids</code> (<code>[CLS]=101</code> ve <code>[SEP]=102</code> ile çerçevelenmiş 8 token ID), <code>token_type_ids</code> (tek bir cümle için hepsi sıfır) ve <code>attention_mask</code> (padding yapılmadığı için hepsi 1) içeren sözlük benzeri bir nesnedir. 3) Nokta erişimi (<code>encoding.input_ids</code>, <code>encoding.attention_mask</code>, <code>encoding.token_type_ids</code>) aynı alanların özniteliği olarak erişilebileceğini gösterir.</p>'

+ '<h4 class="l-subsection-title">Metne Geri Çözme</h4>'

+ '<p class="l-text">Çözme işlemi, ID\'lerden dizeye eşlemeyi tersine çevirir. İki çözme modu yaygın durumları kapsar:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Token ID\'lerini Metne Çözme <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'ids = encoding.input_ids\n' +
'\n' +
'<span class="cm"># decode varsayılan olarak özel token\'ları dahil eder</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(ids))\n' +
'<span class="cm"># "[CLS] hello, how are you? [SEP]"</span>\n' +
'\n' +
'<span class="cm"># Temiz çıktı için özel token\'ları atla</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(ids, skip_special_tokens=<span class="kw">True</span>))\n' +
'<span class="cm"># "hello, how are you?"</span>\n' +
'\n' +
'<span class="cm"># Tek tek token\'ları çöz (hata ayıklama için kullanışlı)</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">convert_ids_to_tokens</span>(ids))\n' +
'<span class="cm"># [\'[CLS]\', \'hello\', \',\', \'how\', \'are\', \'you\', \'?\', \'[SEP]\']</span>\n' +
'\n' +
'<span class="cm"># Tek bir token dizesini ID\'sine eşle</span>\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">convert_tokens_to_ids</span>(<span class="str">"[CLS]"</span>))  <span class="cm"># 101</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>Decode işlemi tokenizer\'ı nasıl tersine çevirir:</strong> 1) <code>tokenizer.decode(ids)</code> ID\'lerden dizeyi yeniden kurar; <code>[CLS]</code> ve <code>[SEP]</code> işaretleri görünür kalır. 2) <code>skip_special_tokens=True</code> eklemek çerçeveleme token\'larını atar ve insan tarafından okunabilir temiz bir çıktı verir. 3) <code>tokenizer.convert_ids_to_tokens(ids)</code> birleştirme yapmadan konum başına token dizelerini döndürür — tokenizasyon uç durumlarında hata ayıklamak için mükemmeldir. 4) <code>tokenizer.convert_tokens_to_ids("[CLS]")</code> ise <code>[CLS]</code>\'in ID <code>101</code>\'e eşlendiğini doğrulayan ters arama işlemidir.</p>'

/* ============================================================
   SECTION 3: Special Tokens
   ============================================================ */
+ '<h3 class="l-section-title">Özel Token\'lar</h3>'

+ '<p class="l-text">Özel token\'lar, modele yapı iletmek için ayrılmış kelime dağarcığı girişleridir. Doğal dil değildir — konumsal veya işlevsel anlam taşırlar. Her model ailesi kendi setini tanımlar; bunları aileler arasında karıştırmak yaygın bir hatadır.</p>'

+ '<div class="calc-cards"><div class="cc-card"><div class="cc-title">BERT Özel Token\'ları</div><div class="cc-body"><ul><li><strong>[CLS]</strong> (ID 101) — her girdiye eklenir. Son gizli durumu, sınıflandırma görevleri için dizi düzeyinde temsil olarak kullanılır.</li><li><strong>[SEP]</strong> (ID 102) — her cümleden sonra eklenir. Cümle çifti görevlerinde A segmentini B segmentinden ayırır.</li><li><strong>[PAD]</strong> (ID 0) — bir gruptaki daha kısa dizileri eşit uzunluğa getirir. attention_mask=0 ile eşleştirilir.</li><li><strong>[MASK]</strong> (ID 103) — Maskeli Dil Modeli ön eğitimi sırasında tahmin için token\'ları gizlemek amacıyla kullanılır.</li><li><strong>[UNK]</strong> (ID 100) — kelime dağarcığında bulunmayan herhangi bir karakter dizisinin yerine geçer (WordPiece\'de nadirdir).</li></ul></div></div><div class="cc-card"><div class="cc-title">RoBERTa / GPT-2 Özel Token\'ları</div><div class="cc-body"><ul><li><strong>&lt;s&gt;</strong> — dizi başlangıcı, [CLS] ile analogtur. RoBERTa bunu her girdiye ekler.</li><li><strong>&lt;/s&gt;</strong> — dizi sonu / ayırıcı, [SEP] ile analogtur.</li><li><strong>&lt;pad&gt;</strong> — dolgu token\'ı. GPT-2\'nin orijinal tokenizer\'ında pad token yoktur; toplu inference için kendiniz eklemeniz gerekir.</li><li><strong>&lt;unk&gt;</strong> — bilinmeyen token (BPE\'de nadirdir çünkü her bayt dizisi temsil edilebilir).</li><li><strong>&lt;mask&gt;</strong> — RoBERTa\'nın MLM hedefinde kullanılır.</li></ul></div></div></div>'

+ '<div class="calc-highlight"><strong>[CLS] neden sınıflandırma için işe yarar:</strong> ön eğitim sırasında [CLS], modelin cümle düzeyindeki özellikleri (BERT\'te bir sonraki cümle tahmini) tahmin etmek için tüm konumlardan bilgi toplaması gereken yere yerleştirilir. Ön eğitim tamamlandığında [CLS] gizli durumu tüm diziyi özetlemeyi öğrenmiştir. Bu nedenle üstüne doğrusal bir kafa eklemek ilkeli bir seçimdir, keyfi değil.</div>'

+ '<p class="l-text">Yüklenen herhangi bir tokenizer\'ın tüm özel token\'larını inceleyebilirsiniz:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Özel Token\'ları İnceleme <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="fn">print</span>(tokenizer.all_special_tokens)\n' +
'<span class="cm"># [\'[UNK]\', \'[SEP]\', \'[PAD]\', \'[CLS]\', \'[MASK]\']</span>\n' +
'\n' +
'<span class="fn">print</span>(tokenizer.all_special_ids)\n' +
'<span class="cm"># [100, 102, 0, 101, 103]</span>\n' +
'\n' +
'<span class="cm"># Tek tek erişim</span>\n' +
'<span class="fn">print</span>(tokenizer.cls_token)   <span class="cm"># \'[CLS]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.sep_token)   <span class="cm"># \'[SEP]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.pad_token)   <span class="cm"># \'[PAD]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.mask_token)  <span class="cm"># \'[MASK]\'</span>\n' +
'<span class="fn">print</span>(tokenizer.unk_token)   <span class="cm"># \'[UNK]\'</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>Bir tokenizer\'ın ayrılmış girişlerini nasıl listeleriz:</strong> 1) <code>tokenizer.all_special_tokens</code> insan tarafından okunabilen dizeleri (<code>[UNK]</code>, <code>[SEP]</code>, <code>[PAD]</code>, <code>[CLS]</code>, <code>[MASK]</code>) ve <code>tokenizer.all_special_ids</code> eşleşen tamsayı ID\'leri listeler. 2) Adlandırılmış erişimciler (<code>cls_token</code>, <code>sep_token</code>, <code>pad_token</code>, <code>mask_token</code>, <code>unk_token</code>) sıralamayı hatırlamadan doğrudan arama sağlar. 3) BERT örneğinden uyarladığınız kodu RoBERTa veya GPT-2\'ye taşırken, bu özellikler köşeli parantezli dizeleri sabit kodlamadan doğru sentinel\'i çekmenize izin verir.</p>'

/* ============================================================
   SECTION 4: Padding & Truncation
   ============================================================ */
+ '<h3 class="l-section-title">Dolgu &amp; Kırpma</h3>'

+ '<p class="l-text">Sinir ağları sabit boyutlu tensörleri işler. Değişken uzunluktaki cümlelerden oluşan bir grubun, 2 boyutlu bir tensöre yığılmadan önce tek tip uzunluğa doldurulması gerekir. Kırpma ise tam tersini ele alır: modelin maksimum konum gömmelerini aşan girdilerin kısaltılması gerekir.</p>'

+ '<div class="calc-compare"><div class="ccomp-col"><div class="ccomp-title">Dolgu Stratejileri</div><div class="ccomp-body"><table style="width:100%;border-collapse:collapse;font-size:0.88rem;"><thead><tr><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Seçenek</th><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Davranış</th></tr></thead><tbody><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>padding=True</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Gruptaki en uzun diziye kadar doldurur. Tek gruplar için verimlidir.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>padding="longest"</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>True</code> ile aynıdır. Açık bir takma addır.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>padding="max_length"</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Gerçek uzunluktan bağımsız olarak her diziyi <code>max_length</code> token\'a kadar doldurur. Hesaplamayı boşa harcar ama belirleyici şekiller verir.</td></tr><tr><td style="padding:6px 8px;"><code>padding=False</code></td><td style="padding:6px 8px;">Dolgu yoktur. Yalnızca tek girdiler için veya harmanlama kendiniz yapılıyorsa çalışır.</td></tr></tbody></table></div></div><div class="ccomp-col"><div class="ccomp-title">Kırpma Stratejileri</div><div class="ccomp-body"><table style="width:100%;border-collapse:collapse;font-size:0.88rem;"><thead><tr><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Seçenek</th><th style="padding:6px 8px;border-bottom:1px solid #444;text-align:left;">Davranış</th></tr></thead><tbody><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>truncation=True</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>model_max_length</code> değerine kırpar (örn. BERT için 512). Sağdan kaldırır.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>max_length=N</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Maksimum uzunluğu geçersiz kılar. Bellek verimliliği için daha kısa diziler istediğinizde kullanışlıdır.</td></tr><tr><td style="padding:6px 8px;border-bottom:1px solid #333;"><code>truncation="only_first"</code></td><td style="padding:6px 8px;border-bottom:1px solid #333;">Cümle çiftleri için: yalnızca ilk cümleyi kırpar. Soru-Cevap görevlerinde soruyu korumak için kullanışlıdır.</td></tr><tr><td style="padding:6px 8px;"><code>truncation="only_second"</code></td><td style="padding:6px 8px;">Yalnızca ikinci cümleyi kırpar.</td></tr></tbody></table></div></div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Dolgu ve Kırpma Seçenekleri <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="cm"># İki seçenekle birlikte tipik tek dizi çağrısı</span>\n' +
'encoding = <span class="fn">tokenizer</span>(\n' +
'    <span class="str">"This is a very long document..."</span>,\n' +
'    padding=<span class="str">"max_length"</span>,\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    max_length=<span class="num">128</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>  <span class="cm"># PyTorch tensörleri döndür</span>\n' +
')\n' +
'<span class="fn">print</span>(encoding.input_ids.shape)   <span class="cm"># torch.Size([1, 128])</span>\n' +
'<span class="fn">print</span>(encoding.attention_mask.shape)  <span class="cm"># torch.Size([1, 128])</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>Padding + truncation çağrısı ne yapıyor:</strong> 1) <code>padding="max_length"</code> her çıktıyı kısa girdilerde bile <code>max_length=128</code> token\'a kadar uzatır. 2) <code>truncation=True</code> tam tersi uca karşı koruma sağlar — 128\'den uzun her metin sağdan kesilir. 3) <code>return_tensors="pt"</code> Python listeleri yerine doğrudan PyTorch tensörleri döndürür. 4) <code>encoding.input_ids.shape</code> ve <code>encoding.attention_mask.shape</code> çıktıları her iki tensörün <code>[1, 128]</code> olduğunu doğrular — sabit boyutlu ve doğrudan modele beslenmeye hazır.</p>'

+ '<h4 class="l-subsection-title">DataCollatorWithPadding ile Dinamik Dolgu</h4>'

+ '<p class="l-text">Her örneği global <code>max_length</code>\'e kadar doldurmak, kısa belgeler için GPU döngülerini boşa harcar. <strong>Dinamik dolgu</strong>, yalnızca her mini-grup içindeki en uzun diziye kadar doldurur; bu da adım başına işlenen pad token sayısını büyük ölçüde azaltır. Bunun için standart araç <code>DataCollatorWithPadding</code>\'dir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> DataCollator ile Dinamik Dolgu <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> transformers <span class="kw">import</span> DataCollatorWithPadding\n' +
'<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader\n' +
'\n' +
'<span class="cm"># 1. Padding OLMADAN tokenize et (değişken uzunlukta dizileri sakla)</span>\n' +
'<span class="kw">def</span> <span class="fn">tokenize_fn</span>(examples):\n' +
'    <span class="kw">return</span> <span class="fn">tokenizer</span>(\n' +
'        examples[<span class="str">"text"</span>],\n' +
'        truncation=<span class="kw">True</span>,\n' +
'        max_length=<span class="num">512</span>\n' +
'        <span class="cm"># burada padding yok!</span>\n' +
'    )\n' +
'\n' +
'tokenized_ds = raw_dataset.<span class="fn">map</span>(tokenize_fn, batched=<span class="kw">True</span>)\n' +
'\n' +
'<span class="cm"># 2. Collator, batch hazırlanırken dinamik olarak padding yapar</span>\n' +
'collator = <span class="fn">DataCollatorWithPadding</span>(tokenizer=tokenizer)\n' +
'\n' +
'<span class="cm"># 3. DataLoader collator\'ı kullanır</span>\n' +
'train_loader = <span class="fn">DataLoader</span>(\n' +
'    tokenized_ds[<span class="str">"train"</span>],\n' +
'    batch_size=<span class="num">32</span>,\n' +
'    shuffle=<span class="kw">True</span>,\n' +
'    collate_fn=collator\n' +
')\n' +
'\n' +
'<span class="cm"># Her batch yalnızca kendi en uzun dizisine kadar padding alır</span>\n' +
'<span class="kw">for</span> batch <span class="kw">in</span> train_loader:\n' +
'    <span class="fn">print</span>(batch[<span class="str">"input_ids"</span>].shape)  <span class="cm"># örn. [32, 73], [32, 512] değil</span>\n' +
'    <span class="kw">break</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>Dinamik padding\'in iç bağlantıları:</strong> 1) <code>tokenize_fn</code>, tokenizer\'ı <code>truncation=True, max_length=512</code> ile uygular ancak kasıtlı olarak padding\'i atlar; bu, önbelleğe alınmış veri setinde değişken uzunluklu diziler bırakır. 2) <code>raw_dataset.map(tokenize_fn, batched=True)</code> tüm veri setini paralel olarak tokenize eder ve sonuçları diske yazar. 3) <code>DataCollatorWithPadding(tokenizer=tokenizer)</code>, her mini-batch\'i yükleme zamanında kendi en uzun dizisine padding etmeyi bilen bir çağrılabilir nesne oluşturur. 4) <code>DataLoader</code> her batch için <code>collate_fn=collator</code> çağrısı yapar, böylece yazdırılan <code>batch["input_ids"].shape</code> <code>[32, 512]</code> yerine <code>[32, 73]</code> gibi bir değer gösterir — boşa giden hesaplamayı keskin biçimde azaltır.</p>'

/* ============================================================
   SECTION 5: Attention Masks
   ============================================================ */
+ '<h3 class="l-section-title">Attention Mask\'lar</h3>'

+ '<p class="l-text">Diziler doldurulduğunda, modelin hangi konumların gerçek token, hangilerinin dolgu olduğunu bilmesi gerekir. <strong>Attention mask</strong>, bunu ikili bir vektör olarak kodlar: her gerçek token için 1, her pad token için 0.</p>'

+ '<div class="calc-example"><div class="ce-label">Attention Mask Örneği</div><div class="ce-content"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;text-align:center;"><thead><tr><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">Konum</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">0</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">1</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">2</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">3</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">4</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">5</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">6</th><th style="padding:8px;border-bottom:2px solid #c8a96e;color:#c8a96e;">7</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #333;font-weight:600;">Token</td><td style="padding:8px;border-bottom:1px solid #333;">[CLS]</td><td style="padding:8px;border-bottom:1px solid #333;">hello</td><td style="padding:8px;border-bottom:1px solid #333;">world</td><td style="padding:8px;border-bottom:1px solid #333;">[SEP]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td><td style="padding:8px;border-bottom:1px solid #333;color:#888;">[PAD]</td></tr><tr><td style="padding:8px;font-weight:600;">Mask</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#4ecdc4;">1</td><td style="padding:8px;color:#ff4b4b;">0</td><td style="padding:8px;color:#ff4b4b;">0</td><td style="padding:8px;color:#ff4b4b;">0</td><td style="padding:8px;color:#ff4b4b;">0</td></tr></tbody></table></div></div>'

+ '<div class="l-note"><strong>Modelin attention mask\'a neden ihtiyacı var:</strong> her öz-dikkat katmanı içinde, her token nokta çarpımı skoru hesaplayarak diğer her token\'a dikkat eder. Maskeleme olmadan, pad konumları sıfır olmayan dikkat ağırlıkları alır ve her token\'ın temsiline gürültü enjekte eder. Attention mask, yumuşatma öncesi ham logit matrisine büyük bir negatif sayı (−10.000) olarak eklenir; bu sayede söz konusu konumların ağırlıkları sıfıra çekilir. Mask\'ı geçmeyi unutmak geçerli Python\'dur — kod çalışır ve makul görünen çıktı üretir, ancak doğruluk sessizce düşer, özellikle çok sayıda pad token içeren uzun belgeler için.</div>'

/* ============================================================
   SECTION 6: Batch Encoding & Sentence Pairs
   ============================================================ */
+ '<h3 class="l-section-title">Toplu Kodlama &amp; Cümle Çiftleri</h3>'

+ '<p class="l-text">Bir dize listesi geçirmek tüm grubu tek bir çağrıda tokenize eder; bu, döngüden çok daha hızlıdır. Hızlı (Rust tabanlı) tokenizer\'lar bunu dahili olarak CPU çekirdekleri arasında paralel işler.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span> Toplu Tokenizasyon <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'texts = [\n' +
'    <span class="str">"The cat sat on the mat."</span>,\n' +
'    <span class="str">"Transformers are state-of-the-art models."</span>,\n' +
'    <span class="str">"Fine-tuning adapts a pre-trained model to a new task."</span>\n' +
']\n' +
'\n' +
'batch = <span class="fn">tokenizer</span>(\n' +
'    texts,\n' +
'    padding=<span class="kw">True</span>,       <span class="cm"># batch içindeki en uzun diziye kadar padding</span>\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    max_length=<span class="num">64</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>\n' +
')\n' +
'\n' +
'<span class="fn">print</span>(batch.input_ids.shape)       <span class="cm"># torch.Size([3, 64])</span>\n' +
'<span class="fn">print</span>(batch.attention_mask.shape)  <span class="cm"># torch.Size([3, 64])</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>Toplu tokenizasyon tek çağrıdan nasıl farklıdır:</strong> 1) <code>tokenizer(texts, ...)</code>\'a bir Python listesi geçirmek hızlı Rust arka ucunun çok iş parçacıklı encoder\'ını tetikler; bu Python\'da döngü kurmaktan dramatik biçimde daha hızlıdır. 2) <code>padding=True</code>, batch\'in her üyesini en uzun üyeye kadar padding yapar; <code>truncation=True</code> ve <code>max_length=64</code> aşırı uzun olanları kırpar. 3) <code>return_tensors="pt"</code> sonucu rank-2 bir PyTorch tensörüne paketler — yazdırılan <code>torch.Size([3, 64])</code> şekilleri hem <code>input_ids</code> hem <code>attention_mask</code> için tek tip şekli doğrular.</p>'

+ '<h4 class="l-subsection-title">Cümle Çiftleri</h4>'

+ '<p class="l-text">Pek çok görev — Doğal Dil Çıkarımı, Soru Cevaplama, Anlamsal Metin Benzerliği — modele aynı anda iki cümle beslemeyi gerektirir. Bunları iki paralel liste (veya tek çift için iki dize) olarak geçirin. BERT onları <code>[CLS] A [SEP] B [SEP]</code> şeklinde sarar.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Cümle Çifti Tokenizasyonu <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'premise    = <span class="str">"The man is playing guitar."</span>\n' +
'hypothesis = <span class="str">"A person is making music."</span>\n' +
'\n' +
'<span class="cm"># Tek çift</span>\n' +
'enc = <span class="fn">tokenizer</span>(premise, hypothesis)\n' +
'<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(enc.input_ids))\n' +
'<span class="cm"># "[CLS] the man is playing guitar. [SEP] a person is making music. [SEP]"</span>\n' +
'\n' +
'<span class="cm"># Çiftlerden oluşan batch</span>\n' +
'premises    = [<span class="str">"The man is playing guitar."</span>, <span class="str">"It is raining outside."</span>]\n' +
'hypotheses  = [<span class="str">"A person is making music."</span>,  <span class="str">"The weather is wet."</span>]\n' +
'\n' +
'batch = <span class="fn">tokenizer</span>(\n' +
'    premises, hypotheses,\n' +
'    padding=<span class="kw">True</span>,\n' +
'    truncation=<span class="kw">True</span>,\n' +
'    return_tensors=<span class="str">"pt"</span>\n' +
')\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>Cümle çifti kodlaması nasıl çalışıyor:</strong> 1) <code>tokenizer(premise, hypothesis)</code>\'ı iki argümanla çağırmak onları <code>[CLS] A [SEP] B [SEP]</code> olarak kodlar — <code>tokenizer.decode(enc.input_ids)</code> ile görülebilir. 2) İki paralel Python listesi (<code>premises</code>, <code>hypotheses</code>) tek bir çağrıda toplu çift kodlamasını tetikler. 3) <code>padding=True</code> batch\'i en uzun çiftine hizalar, <code>truncation=True</code> taşmaya karşı korur ve <code>return_tensors="pt"</code> çıktıyı PyTorch için paketler. 4) Arka planda tokenizer ayrıca <code>token_type_ids</code>\'i A\'daki token\'lar için sıfır, B\'deki token\'lar için bir olarak doldurur; böylece segment gömmeleri doğru biçimde etkinleşir.</p>'

+ '<h4 class="l-subsection-title">token_type_ids: Segment Gömmeleri</h4>'

+ '<div class="calc-example"><div class="ce-label">Bir Cümle Çifti için token_type_ids</div><div class="ce-content"><p style="margin:0 0 10px 0;font-size:0.88rem;">BERT, modelin hangi cümleye ait olduğunu bilmesi için her token\'a öğrenilmiş bir <em>segment gömme</em>si ekler. Tokenizer bunu <code>token_type_ids</code> olarak kodlar:</p><table style="width:100%;border-collapse:collapse;font-size:0.82rem;text-align:center;"><thead><tr><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">Token</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">[CLS]</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">the</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">man</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">...</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">[SEP]</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">a</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">person</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">...</th><th style="padding:6px;border-bottom:2px solid #c8a96e;color:#c8a96e;">[SEP]</th></tr></thead><tbody><tr><td style="padding:6px;font-weight:600;">type_id</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#4ecdc4;">0</td><td style="padding:6px;color:#c8a96e;">1</td><td style="padding:6px;color:#c8a96e;">1</td><td style="padding:6px;color:#c8a96e;">1</td><td style="padding:6px;color:#c8a96e;">1</td></tr></tbody></table><p style="margin:10px 0 0 0;font-size:0.85rem;color:#aaa;">RoBERTa token_type_ids kullanmaz (her zaman 0). Segment gömmelerini atlayan modeller bu alanı yok sayar.</p></div></div>'

/* ============================================================
   SECTION 7: Fast vs Slow Tokenizers
   ============================================================ */
+ '<h3 class="l-section-title">Hızlı ve Yavaş Tokenizer\'lar</h3>'

+ '<p class="l-text">Transformers, her tokenizer\'ın iki uygulamasıyla birlikte gelir. <strong>Yavaş</strong> tokenizer saf Python\'dur; <strong>hızlı</strong> tokenizer ise Rust <code>tokenizers</code> kütüphanesini sarar. <code>AutoTokenizer</code>, mevcut olduğunda her zaman hızlı sürümü tercih eder.</p>'

+ '<div class="calc-compare"><div class="ccomp-col"><div class="ccomp-title">Yavaş Tokenizer (Python)</div><div class="ccomp-body"><ul style="font-size:0.88rem;line-height:1.8;"><li>Saf Python uygulaması</li><li>Tam taşınabilir, derlenmiş bağımlılık yok</li><li>Tek iş parçacıklı</li><li><code>offset_mapping</code> veya <code>word_ids()</code> <strong>desteklemez</strong></li><li>Büyük veri setlerinde 10–20 kat daha yavaş</li><li>Sınıf adı <code>Tokenizer</code> ile biter (örn. <code>BertTokenizer</code>)</li></ul></div></div><div class="ccomp-col"><div class="ccomp-title">Hızlı Tokenizer (Rust)</div><div class="ccomp-body"><ul style="font-size:0.88rem;line-height:1.8;"><li><code>tokenizers</code> kütüphanesi aracılığıyla Rust çekirdeği</li><li>Çok iş parçacıklı toplu işleme</li><li><code>offset_mapping</code> destekler: her token\'ın karakter aralığı</li><li><code>word_ids()</code> destekler: her alt sözcük token\'ının orijinal kelime indeksi</li><li>NER token hizalaması için gereklidir</li><li>Sınıf adı <code>TokenizerFast</code> ile biter</li></ul></div></div></div>'

+ '<h4 class="l-subsection-title">offset_mapping: Karakter-Token Hizalaması</h4>'

+ '<p class="l-text"><code>offset_mapping</code>, her token için orijinal dizedeki <em>(başlangıç, bitiş)</em> karakter uzaklıklarını döndürür. Bu, model tahminlerini karakter konumlarına geri eşlemeniz gerektiğinde, örneğin aralık çıkarma veya varlık tanımada, çok önemlidir.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Karakter Uzaklık Eşlemesi <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'text = <span class="str">"London is the capital of England."</span>\n' +
'\n' +
'enc = <span class="fn">tokenizer</span>(\n' +
'    text,\n' +
'    return_offsets_mapping=<span class="kw">True</span>\n' +
')\n' +
'\n' +
'<span class="kw">for</span> token_id, offsets <span class="kw">in</span> <span class="fn">zip</span>(enc.input_ids, enc.offset_mapping):\n' +
'    token = tokenizer.<span class="fn">decode</span>([token_id])\n' +
'    char_span = text[offsets[<span class="num">0</span>]:offsets[<span class="num">1</span>]] <span class="kw">if</span> offsets != (<span class="num">0</span>, <span class="num">0</span>) <span class="kw">else</span> <span class="str">"SPECIAL"</span>\n' +
'    <span class="fn">print</span>(<span class="str">f"{token:15s} offsets={offsets}  chars=\'{char_span}\'"</span>)\n' +
'\n' +
'<span class="cm"># [CLS]           offsets=(0, 0)   chars=\'SPECIAL\'</span>\n' +
'<span class="cm"># london          offsets=(0, 6)   chars=\'London\'</span>\n' +
'<span class="cm"># is              offsets=(7, 9)   chars=\'is\'</span>\n' +
'<span class="cm"># the             offsets=(10, 13) chars=\'the\'</span>\n' +
'<span class="cm"># capital         offsets=(14, 21) chars=\'capital\'</span>\n' +
'<span class="cm"># ...</span>\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong><code>return_offsets_mapping</code> neyi açar:</strong> 1) <code>return_offsets_mapping=True</code> ayarı, hızlı tokenizer\'a token başına bir adet olmak üzere <code>(başlangıç, bitiş)</code> karakter indeksleri listesi eklemesini söyler. 2) Döngü <code>enc.input_ids</code> ile <code>enc.offset_mapping</code>\'i zip\'ler, her ID\'yi decode eder ve orijinal <code>text</code>\'i offset\'lerle dilimleyerek kaynak aralığı geri kazanır. 3) <code>[CLS]</code> gibi özel token\'lar offset olarak <code>(0, 0)</code> alır; koşullu ifade bunu <code>"SPECIAL"</code> etiketine dönüştürür. 4) Yazdırılan tablo <code>london → (0, 6) → "London"</code> eşlemesini gösterir — QA span çıkarımı veya varlık vurgulama için model tahminlerini karakter konumlarına geri yansıtmak için ihtiyacınız olan tam karşılık budur.</p>'

+ '<h4 class="l-subsection-title">word_ids(): Alt Sözcük-Kelime Eşlemesi (NER için Kritik)</h4>'

+ '<p class="l-text">NER veri setleri her <em>kelimeyi</em> etiketler, ancak tokenizer tek bir kelimeyi birkaç alt sözcük token\'ına bölebilir. Etiketleri kelime uzayından token uzayına hizalamanız gerekir. <code>word_ids()</code>, her token için orijinal kelime indeksini (veya özel token\'lar için <code>None</code>) döndürür.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> word_ids() ile NER Etiket Hizalama <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'words  = [<span class="str">"London"</span>, <span class="str">"is"</span>, <span class="str">"the"</span>, <span class="str">"capital"</span>]\n' +
'labels = [<span class="num">1</span>,        <span class="num">0</span>,    <span class="num">0</span>,     <span class="num">0</span>       ]  <span class="cm"># 1 = B-LOC, 0 = O</span>\n' +
'\n' +
'enc = <span class="fn">tokenizer</span>(\n' +
'    words,\n' +
'    is_split_into_words=<span class="kw">True</span>,  <span class="cm"># girdi önceden token\'lara ayrılmış kelimeler</span>\n' +
'    return_tensors=<span class="str">"pt"</span>\n' +
')\n' +
'\n' +
'word_ids = enc.<span class="fn">word_ids</span>(batch_index=<span class="num">0</span>)\n' +
'<span class="fn">print</span>(word_ids)\n' +
'<span class="cm"># [None, 0, 1, 2, 3, None]  (None = CLS / SEP)</span>\n' +
'\n' +
'<span class="cm"># Etiketleri hizala: özel token\'lara -100 ata (cross-entropy yok sayar)</span>\n' +
'aligned_labels = []\n' +
'<span class="kw">for</span> wid <span class="kw">in</span> word_ids:\n' +
'    <span class="kw">if</span> wid <span class="kw">is</span> <span class="kw">None</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(<span class="num">-100</span>)   <span class="cm"># özel token, kayıpta yok sayılır</span>\n' +
'    <span class="kw">else</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(labels[wid])\n' +
'\n' +
'<span class="fn">print</span>(aligned_labels)\n' +
'<span class="cm"># [-100, 1, 0, 0, 0, -100]</span>\n' +
'</code></pre></div></div>'

+ '<p class="l-text">Yaygın bir NER kuralı, her kelimenin yalnızca <strong>ilk alt sözcüğünü</strong> etiketlemek ve devam parçalarına <code>-100</code> atamaktır. Bu, kayıpta çok token\'lı kelimelerin çift sayılmasını önler:</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> İlk Alt Sözcük Etiketleme Stratejisi <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'prev_wid = <span class="kw">None</span>\n' +
'aligned_labels = []\n' +
'<span class="kw">for</span> wid <span class="kw">in</span> word_ids:\n' +
'    <span class="kw">if</span> wid <span class="kw">is</span> <span class="kw">None</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(<span class="num">-100</span>)\n' +
'    <span class="kw">elif</span> wid != prev_wid:\n' +
'        aligned_labels.<span class="fn">append</span>(labels[wid])  <span class="cm"># ilk alt sözcük: gerçek etiket</span>\n' +
'    <span class="kw">else</span>:\n' +
'        aligned_labels.<span class="fn">append</span>(<span class="num">-100</span>)          <span class="cm"># devam: yok sayılır</span>\n' +
'    prev_wid = wid\n' +
'</code></pre></div></div>'
+ '<p class="l-text"><strong>İlk alt sözcük etiketleme stratejisi sade dille:</strong> 1) <code>word_ids</code> üzerinde döngü kurarken görülen son kelime indeksini <code>prev_wid</code> ile takip et. 2) <code>None</code> word ID\'leri <code>[CLS]</code> / <code>[SEP]</code>\'ye karşılık gelir — PyTorch\'un cross-entropy kaybı bunları tamamen atlasın diye <code>-100</code> yay. 3) Mevcut <code>wid</code>, <code>prev_wid</code>\'den farklıysa yeni bir kelimenin ilk alt sözcüğündeyizdir — gerçek <code>labels[wid]</code> etiketini yay. 4) Devam alt sözcükleri (<code>wid == prev_wid</code>) da <code>-100</code> alır; böylece <code>"hugging"</code> + <code>"face"</code> gibi çok parçalı bir kelime kayıpta tam olarak bir kez sayılır.</p>'

/* ============================================================
   SECTION 8: Training a Custom Tokenizer
   ============================================================ */
+ '<h3 class="l-section-title">Özel Tokenizer Eğitme</h3>'

+ '<p class="l-text">Alanınız son derece özelleşmiş bir kelime dağarcığı içerdiğinde — klinik notlar, kimyasal formüller, hukuki atıflar, kaynak kodu — standart Hub tokenizer\'ı terimlerinizi çok sayıda alt sözcüğe bölerek dizi bütçesini israf eder ve modelin alan örüntülerini öğrenmesini zorlaştırır. Sıfırdan kendi derleminizdeki veriler üzerinde bir tokenizer eğitmek, verilerinize uyarlanmış bir kelime dağarcığı sağlar.</p>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Özel WordPiece Tokenizer Eğitimi <button class="code-copy">COPY</button></div><div class="code-block"><pre><code>' +
'<span class="kw">from</span> tokenizers <span class="kw">import</span> (\n' +
'    Tokenizer,\n' +
'    models,\n' +
'    trainers,\n' +
'    pre_tokenizers,\n' +
'    normalizers,\n' +
'    decoders\n' +
')\n' +
'<span class="kw">from</span> tokenizers.normalizers <span class="kw">import</span> NFD, Lowercase, StripAccents\n' +
'<span class="kw">from</span> tokenizers.pre_tokenizers <span class="kw">import</span> Whitespace\n' +
'\n' +
'<span class="cm"># 1. Modeli tanımla (burada WordPiece; GPT tarzı için BPE kullan)</span>\n' +
'tokenizer = <span class="fn">Tokenizer</span>(models.<span class="fn">WordPiece</span>(unk_token=<span class="str">"[UNK]"</span>))\n' +
'\n' +
'<span class="cm"># 2. Normalleştirme pipeline\'ı</span>\n' +
'tokenizer.normalizer = normalizers.<span class="fn">Sequence</span>([<span class="fn">NFD</span>(), <span class="fn">Lowercase</span>(), <span class="fn">StripAccents</span>()])\n' +
'\n' +
'<span class="cm"># 3. Pre-tokenizasyon: alt sözcüğe ayırmadan önce boşluklardan böl</span>\n' +
'tokenizer.pre_tokenizer = <span class="fn">Whitespace</span>()\n' +
'\n' +
'<span class="cm"># 4. Özel token\'lar ve hedef vocab boyutuyla trainer</span>\n' +
'trainer = trainers.<span class="fn">WordPieceTrainer</span>(\n' +
'    vocab_size=<span class="num">30_000</span>,\n' +
'    special_tokens=[<span class="str">"[UNK]"</span>, <span class="str">"[CLS]"</span>, <span class="str">"[SEP]"</span>, <span class="str">"[PAD]"</span>, <span class="str">"[MASK]"</span>]\n' +
')\n' +
'\n' +
'<span class="cm"># 5. Düz metin dosyalarından oluşan listede eğit</span>\n' +
'tokenizer.<span class="fn">train</span>(files=[<span class="str">"corpus_train.txt"</span>, <span class="str">"corpus_val.txt"</span>], trainer=trainer)\n' +
'\n' +
'<span class="cm"># 6. ## önekli parçaların doğru birleşmesi için decoder ayarla</span>\n' +
'tokenizer.decoder = decoders.<span class="fn">WordPiece</span>()\n' +
'\n' +
'<span class="cm"># 7. Kaydet</span>\n' +
'tokenizer.<span class="fn">save</span>(<span class="str">"my_custom_tokenizer.json"</span>)\n' +
'\n' +
'<span class="cm"># 8. Transformers uyumlu hızlı tokenizer\'a sar</span>\n' +
'<span class="kw">from</span> transformers <span class="kw">import</span> PreTrainedTokenizerFast\n' +
'fast_tok = <span class="fn">PreTrainedTokenizerFast</span>(tokenizer_file=<span class="str">"my_custom_tokenizer.json"</span>)\n' +
'fast_tok.<span class="fn">save_pretrained</span>(<span class="str">"my_custom_tokenizer/"</span>)\n' +
'</code></pre></div></div>'

+ '<p class="l-text">Birkaç yüz MB alan verisi üzerinde eğitim, modern bir CPU\'da genellikle bir dakikadan az sürer. Elde edilen tokenizer Hub\'a gönderilebilir ve tek bir <code>AutoTokenizer.from_pretrained()</code> çağrısıyla iş arkadaşları tarafından yüklenebilir.</p>'

/* ============================================================
   SECTION 9: Common Pitfalls
   ============================================================ */
+ '<h3 class="l-section-title">Yaygın Tuzaklar</h3>'

+ '<div class="l-warn"><strong>Tuzak 1 — attention_mask\'ı unutmak:</strong> Tokenizer her zaman bir <code>attention_mask</code> döndürür, ancak <code>input_ids</code>\'ı manuel olarak oluşturursanız (örn. bir önbellekten veya özel bir veri setinden) mask\'ı da sağlamayı unutabilirsiniz. Mask olmadan model, dolgu için kullanılan sıfırlar dahil her konumu gerçek token olarak değerlendirir. Belirtiler: nitelendirmesi güç, hafif düşük doğruluk ve daha uzun dolgulu dizilerde daha kötü performans. Çözüm: <code>attention_mask</code>\'ı her zaman <code>input_ids</code> ile birlikte oluşturun. Manuel dolgu yapıyorsanız, pad token ID\'si yerleştirdiğiniz her yerde mask konumunu 0 olarak ayarlayın.</div>'

+ '<div class="l-warn"><strong>Tuzak 2 — Yanlış max_length:</strong> BERT\'in 512\'lik sabit bir konum gömme sınırı vardır. <code>max_length=512</code> geçirmek güvenlidir, ancak bazı uygulayıcılar <code>truncation=True</code>\'yu etkinleştirmeden veri setinin en uzun belge uzunluğunu veya bir eğitim hiper parametresini yanlışlıkla <code>max_length</code> olarak geçirir. Bir belge modelin sınırını aşarsa ve kırpma devre dışıysa, tokenizer sessizce aşırı uzun bir dizi döndürür; bu dizi modelin gömme katmanında şekil uyumsuzluğuyla çöker. Her zaman <code>max_length</code>\'i <code>truncation=True</code> ile eşleştirin.</div>'

+ '<div class="l-warn"><strong>Tuzak 3 — Model checkpoint\'leri arasında tokenizer karıştırmak:</strong> Her model checkpoint\'i, ön eğitildiği tokenizer ile bağlantılıdır. Bir RoBERTa modeli yükleyip BERT tokenizer\'ı ile tokenize etmek, ince farklı token ID\'leri üretir (farklı kelime dağarcığı, farklı özel token ID\'leri). Modelin gömme matrisi bu ID\'leri yanlış vektörlere eşler. Herhangi bir hata mesajı olmaz — model çalışır ve çıktı üretir, ancak bunlar yanlış olur. <code>AutoModel.from_pretrained(model_name)</code> için kullandığınız <em>aynı</em> model adıyla her zaman <code>AutoTokenizer.from_pretrained(model_name)</code> çağırın.</div>'

+ '<div class="l-warn"><strong>Tuzak 4 — GPT-2\'nin varsayılan olarak pad token\'ı yoktur:</strong> GPT-2\'nin orijinal tokenizer\'ı bir dolgu token\'ı tanımlamaz çünkü tek sıralı üretim için tasarlanmıştır, toplu sınıflandırma için değil. Bir grubu doldurmaya çalışırsanız <code>ValueError</code> alırsınız. Çözüm: toplu işlemden önce <code>tokenizer.pad_token = tokenizer.eos_token</code> ayarını yapın ve doldurulan eos konumlarını model\'in görmezden gelmesi için attention mask\'ı geçtiğinizden emin olun.</div>'

+ '<div class="l-warn"><strong>Tuzak 5 — NER hizalaması için yavaş tokenizer kullanmak:</strong> <code>word_ids()</code> ve <code>return_offsets_mapping</code> yalnızca hızlı tokenizer\'larda mevcuttur. <code>use_fast=False</code> ile yükleyip ardından <code>encoding.word_ids()</code> çağırırsanız <code>AttributeError</code> alırsınız. Dizi etiketleme görevleri için her zaman hızlı tokenizer\'ları (varsayılan) kullanın.</div>'
};

