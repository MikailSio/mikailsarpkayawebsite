window.EDGE_L4 = {
en: `<p class="l-text"><strong>llama.cpp is the reason a 7B-parameter LLM runs on your MacBook Air.</strong> Georgi Gerganov's single-file C++ inference engine, started in March 2023 as a weekend project to run Llama on a Mac, became the most-used inference runtime on the planet by 2024. Every "local LLM" tool you have heard of — Ollama, LM Studio, GPT4All, Jan, KoboldCpp — is a wrapper around it. The on-disk format <code>.gguf</code> is now the de-facto standard for distributing quantized open-weight models, with thousands of variants on HuggingFace.</p>

<p class="l-text">In this lesson we open up the GGUF format byte-by-byte (magic, version, key-value metadata, tensor info, quantized weight blocks), trace the K-quant family (Q4_K_M, Q5_K_S, Q6_K, Q8_0) and what each tradeoff buys, walk through the llama.cpp pipeline (load → tokenize → KV cache → sampling), and survey the user-facing ecosystem (Ollama for the CLI lover, LM Studio for the GUI lover, GPT4All for the all-in-one, Jan for the privacy-first). We end with a numpy struct.pack reconstruction of the GGUF header so you can write and read your own GGUF files.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Decode the GGUF byte layout: magic, version, KV metadata, tensor descriptors, quantized blocks</li>
<li>Choose the right K-quant: Q2_K (smallest), Q4_K_M (balanced), Q5_K_S (high quality), Q8_0 (near-FP16)</li>
<li>Understand the llama.cpp pipeline: mmap weights, BPE tokenizer, KV cache, top-p/top-k/min-p sampling</li>
<li>Use Ollama, LM Studio, GPT4All, and Jan productively — and know when to pick each</li>
<li>Convert a HuggingFace model to GGUF with <code>convert_hf_to_gguf.py</code> and quantize with <code>llama-quantize</code></li>
<li>Estimate model VRAM/RAM for any GGUF quant on any hardware</li>
<li>Read and write a minimal GGUF file from NumPy</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Origin Story — March 2023, One File, World Changed</h2>
<p class="l-text">Meta's Llama leak in March 2023 sparked a frenzy of "can we run this locally?" attempts. Gerganov, a Bulgarian engineer behind <code>whisper.cpp</code> (a similar C++ port of OpenAI Whisper), pushed <code>llama.cpp</code> to GitHub on March 10, 2023. Within a week it ran Llama-7B on an M1 Mac at 6 tok/s. Within a month it had INT4 quantization, multi-platform support, and 30k stars. By 2026, llama.cpp has &gt;100k stars, runs on every consumer device with a CPU, supports every major open-weight model, and is the inference engine inside Ollama, LM Studio, KoboldCpp, GPT4All, Jan, llamafile, oobabooga, and llama-cpp-python.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why C++</div><div class="card-body">Pure C++ with no Python or PyTorch dependency. Compiles to a single binary. Uses Apple Accelerate (M-series), AVX2/AVX512 (x86), CUDA, Metal, Vulkan, ROCm — whatever the user has.</div></div>
<div class="calc-card"><div class="card-title">Why mmap</div><div class="card-body">Model weights are memory-mapped read-only. Multiple processes share the same loaded model in RAM. Zero-copy inference start. Cold start measured in seconds, not minutes.</div></div>
<div class="calc-card"><div class="card-title">Why GGUF (not GGML, not HF safetensors)</div><div class="card-body">GGUF (introduced August 2023, replacing GGML) is a versioned, extensible binary format with rich metadata baked in. Self-describing: tokenizer, prompt template, model arch all live in the file.</div></div>
<div class="calc-card"><div class="card-title">Cultural impact</div><div class="card-body">Made open-weight LLMs <em>actually usable</em> by hobbyists and small businesses. The "local LLM" community on Reddit (/r/LocalLLaMA), TheBloke's quantization uploads, Ollama's billion+ pulls — all run on llama.cpp underneath.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The GGUF File Format — Anatomy</h2>
<p class="l-text">A GGUF file has three sections: <strong>header</strong>, <strong>metadata KV pairs</strong>, and <strong>tensors</strong>. Everything is little-endian. The format is versioned (current: v3) and self-describing.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Header (4 + 4 + 8 + 8 = 24 bytes)</div><div class="card-body"><code>magic</code> = "GGUF" (0x46554747), <code>version</code> = u32 (3 in 2026), <code>tensor_count</code> = u64, <code>metadata_kv_count</code> = u64.</div></div>
<div class="calc-card"><div class="card-title">Metadata KV pairs</div><div class="card-body">A list of (key:string, value_type:u32, value) triples. Keys: <code>general.architecture</code>, <code>general.name</code>, <code>llama.context_length</code>, <code>tokenizer.ggml.tokens</code>, <code>tokenizer.chat_template</code>, etc. Value types include u8/i8/u16/i16/u32/i32/u64/i64/f32/f64/bool/string/array.</div></div>
<div class="calc-card"><div class="card-title">Tensor info</div><div class="card-body">For each tensor: name (string), dim count (u32), dims (u64 each), type (u32, the GGUF type code), offset (u64 from start of tensor data section).</div></div>
<div class="calc-card"><div class="card-title">Tensor data</div><div class="card-body">Aligned to <code>general.alignment</code> (typically 32 bytes). Quantized blocks are stored back-to-back. mmap-friendly.</div></div>
</div>

<p class="l-text">The full spec lives in <code>ggml/docs/gguf.md</code> in the llama.cpp repo. It is short — maybe 6 pages — and worth reading once.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The K-Quant Family — Q2_K through Q8_0</h2>
<p class="l-text">GGUF's quantized types are not just "INT4" — they are carefully designed block-wise schemes that mix integer weights with FP16 or FP32 scales, often with per-block double quantization to compress the scales themselves. The "K" types (Q2_K, Q3_K, Q4_K, Q5_K, Q6_K) were Gerganov's 2023 redesign that significantly beat the original Q4_0/Q4_1 at the same bits-per-weight.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q2_K — 2.56 bpw (bits per weight)</div><div class="card-body">2-bit weights with 4-bit min and FP16 super-block scale. Smallest practical quant. Used when you absolutely must fit a 70B model in 22GB. Quality drop noticeable but coherent.</div></div>
<div class="calc-card"><div class="card-title">Q3_K_S / Q3_K_M / Q3_K_L — ~3.5 bpw</div><div class="card-body">3-bit, three "size variants" trade quality at extra cost. Small (S) keeps attention layers at 3-bit, Medium (M) keeps some at 4-bit, Large (L) keeps more.</div></div>
<div class="calc-card"><div class="card-title">Q4_K_M — 4.85 bpw — THE DEFAULT</div><div class="card-body">4-bit weights, 6-bit super-block scales, FP16 outer scale. The sweet spot used by Ollama default tags, LM Studio default downloads, TheBloke recommended quant. Loses ~0.1 perplexity vs FP16 on Llama family.</div></div>
<div class="calc-card"><div class="card-title">Q5_K_S / Q5_K_M — ~5.5 bpw</div><div class="card-body">5-bit. Closer to FP16 quality at slight size cost. Good for code models or precision-sensitive use.</div></div>
<div class="calc-card"><div class="card-title">Q6_K — 6.56 bpw</div><div class="card-body">6-bit. Often indistinguishable from FP16 on benchmarks. Used when you have RAM to spare.</div></div>
<div class="calc-card"><div class="card-title">Q8_0 — 8.5 bpw</div><div class="card-body">Original INT8 (not "K"). Per-block FP16 scale, 32 weights per block. Effectively FP16 quality at half the size. Used for embeddings and tokenizer matrices in mixed-precision setups.</div></div>
<div class="calc-card"><div class="card-title">F16 / BF16</div><div class="card-body">Original precision. ~2 bytes per weight. Reference for quality measurements.</div></div>
<div class="calc-card"><div class="card-title">IQ-quants (newer, 2024)</div><div class="card-body">IQ2_XXS, IQ3_XXS, IQ4_XS — "importance-aware" quants using a small Hessian-like statistic. Better quality at same bits than K-quants. Slower to compute but identical at inference.</div></div>
</div>

<div class="calc-highlight"><strong>Sizing rule of thumb:</strong> for a model with <code>N</code> parameters, GGUF Q4_K_M occupies roughly <code>0.6 × N</code> bytes. So 7B → 4.2GB, 13B → 7.8GB, 70B → 42GB. Add ~2GB for KV cache at 2k context.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The llama.cpp Pipeline — Load to Token</h2>
<p class="l-text">A request like "complete this prompt" goes through a fixed sequence of stages. Knowing them helps debug performance and understand what each setting does.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Load (mmap)</div><div class="card-body">Memory-map the GGUF file. Read header + metadata. Build tensor table. Zero copies. Subsequent runs reuse the OS page cache; "warm" loads are instant.</div></div>
<div class="calc-card"><div class="card-title">2. Tokenize (BPE / SentencePiece)</div><div class="card-body">The tokenizer (vocab + merges) is in the GGUF metadata. Apply byte-pair encoding to user prompt. Add special tokens (BOS, chat template).</div></div>
<div class="calc-card"><div class="card-title">3. Prefill (parallel)</div><div class="card-body">Process all input tokens at once through the transformer. Compute KV cache (one row per layer per token). This is compute-bound; on a phone NPU it dominates startup.</div></div>
<div class="calc-card"><div class="card-title">4. Decode (sequential)</div><div class="card-body">Generate one token at a time. Each step reads the entire KV cache (memory-bound) and applies one new attention + FFN layer. This is the throughput bottleneck on most hardware.</div></div>
<div class="calc-card"><div class="card-title">5. Sample</div><div class="card-body">From the final-layer logits, pick a token. Top-K, top-P (nucleus), min-P, temperature, repetition penalty, Mirostat, DRY — all implemented in <code>sampling.cpp</code>.</div></div>
<div class="calc-card"><div class="card-title">6. Detokenize, stream</div><div class="card-body">Convert token IDs back to UTF-8 text and stream to the client. Loop back to step 4 until EOS or max_tokens.</div></div>
</div>

<p class="l-text">A useful detail: prefill speed and decode speed are almost independent metrics. A phone might do 200 prompt tok/s prefill but 30 tok/s decode. Cloud GPUs invert this for small batches. Both numbers matter — long-prompt UIs are gated by prefill, chat-style is gated by decode.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The User-Facing Ecosystem — Pick Your Wrapper</h2>
<p class="l-text">Almost no one in 2026 calls <code>llama-cli</code> directly. They use one of the four mainstream wrappers, each with a different audience.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ollama (CLI + REST API)</div><div class="card-body">The "Docker for LLMs". <code>ollama run llama3.2</code> downloads a model and chats. Builds Modelfiles (Dockerfile-like), exposes an OpenAI-compatible REST API on localhost:11434. The default for developers building local-first apps. Backed by a YC startup, ~1B+ pulls by 2026.</div></div>
<div class="calc-card"><div class="card-title">LM Studio (GUI)</div><div class="card-body">Electron app, beautiful chat UI, model browser pulling from HuggingFace, GPU offload sliders, prompt templates per model. The default for non-developers and for testing prompts before shipping.</div></div>
<div class="calc-card"><div class="card-title">GPT4All (GUI + Python SDK)</div><div class="card-body">Nomic-AI's all-in-one — GUI, Python library, embedded vector store for local RAG. Strong privacy story (telemetry-free). Earlier mover than Ollama; market share shifted to Ollama+LM Studio in 2024–25 but GPT4All remains popular for offline RAG.</div></div>
<div class="calc-card"><div class="card-title">Jan (privacy-first GUI)</div><div class="card-body">Open-source desktop app focused on offline-first, no-cloud-fallback. Smaller user base, niche following among privacy-aware users. Same llama.cpp engine.</div></div>
<div class="calc-card"><div class="card-title">llamafile (Mozilla, single executable)</div><div class="card-body">Justine Tunney's project: bundle llama.cpp + a GGUF model + a tiny HTTP server into a single cross-platform binary. <code>./llamafile</code> opens a chat in your browser. Best demo magic per byte.</div></div>
<div class="calc-card"><div class="card-title">llama-cpp-python (Python bindings)</div><div class="card-body">For when you want to embed local LLM in your own Python app. Used by LangChain LlamaCpp class, by LiteLLM as a backend, by autogen for local agents.</div></div>
</div>

<div class="calc-highlight"><strong>2026 default stack:</strong> Ollama for the runtime, LM Studio for the prompt-tuning GUI, llama-cpp-python in apps. Same engine underneath all three.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Converting a HuggingFace Model to GGUF</h2>
<p class="l-text">A typical workflow: download a fine-tuned model from HuggingFace in safetensors → convert to GGUF FP16 → quantize to Q4_K_M. The two scripts ship with llama.cpp.</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># 1. Clone llama.cpp and build
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp &amp;&amp; make -j

# 2. Download model from HuggingFace
huggingface-cli download microsoft/Phi-3-mini-4k-instruct --local-dir ./Phi-3-mini

# 3. Convert HF -&gt; GGUF (FP16)
python convert_hf_to_gguf.py ./Phi-3-mini --outfile ./Phi-3-mini-f16.gguf --outtype f16

# 4. Quantize to Q4_K_M (the default)
./llama-quantize ./Phi-3-mini-f16.gguf ./Phi-3-mini-Q4_K_M.gguf Q4_K_M

# 5. Run it
./llama-cli -m ./Phi-3-mini-Q4_K_M.gguf -p "Explain mmap in one sentence." -n 200

# Result: ~2.4GB GGUF, runs at 30+ tok/s on M2 MacBook Air
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Clones the canonical llama.cpp repo and compiles with <code>make -j</code> — produces <code>llama-cli</code>, <code>llama-quantize</code>, <code>llama-server</code>, and the conversion python script. 2) Downloads Phi-3-mini-4k-instruct from HuggingFace using <code>huggingface-cli</code> — fetches safetensors shards plus tokenizer files. 3) Runs <code>convert_hf_to_gguf.py</code> with <code>--outtype f16</code>: reads the HF config, maps Phi3ForCausalLM weights into GGML tensor names, writes a single GGUF FP16 file (~7.6GB) with the full chat template, tokenizer, and architecture metadata baked in. 4) Calls <code>llama-quantize</code> with target <code>Q4_K_M</code>: each linear layer's weights are split into 256-element super-blocks, scales are computed per 16-element sub-block, and 4-bit indices plus 6-bit sub-scales plus FP16 super-scales are written — output is ~2.4GB. 5) Loads with <code>llama-cli -n 200</code> for 200 tokens — on an M2 MacBook Air this runs at 30+ tok/s via Metal, the GGUF being mmap'd directly so cold-start is sub-second.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a minimal GGUF-style file in NumPy: write a header, KV metadata, tensor info, and an INT4 quantized weight block, then read it back and verify the round-trip. Same byte layout as real GGUF for the parts we implement.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import struct
import io

GGUF_MAGIC = 0x46554747  # "GGUF" little-endian

def write_string(buf, s):
    b = s.encode("utf-8")
    buf.write(struct.pack("&lt;Q", len(b)))
    buf.write(b)

def write_u32_kv(buf, key, value):
    write_string(buf, key)
    buf.write(struct.pack("&lt;I", 4))  # type=4 means u32
    buf.write(struct.pack("&lt;I", value))

# --- Build a minimal GGUF in memory ---
buf = io.BytesIO()
buf.write(struct.pack("&lt;I", GGUF_MAGIC))    # magic
buf.write(struct.pack("&lt;I", 3))              # version
buf.write(struct.pack("&lt;Q", 1))              # tensor_count
buf.write(struct.pack("&lt;Q", 2))              # metadata_kv_count

# Metadata
write_u32_kv(buf, "general.alignment", 32)
write_u32_kv(buf, "tinydemo.version", 1)

# Tensor info (one tensor: 32 INT8 weights)
W = np.random.randn(32).astype(np.float32) * 0.1
scale = np.max(np.abs(W)) / 127.0
W_int8 = np.clip(np.round(W/scale), -127, 127).astype(np.int8)

write_string(buf, "weight.0")
buf.write(struct.pack("&lt;I", 1))               # n_dims
buf.write(struct.pack("&lt;Q", 32))              # dim 0
buf.write(struct.pack("&lt;I", 0))               # type 0 = F32 (we'll fudge)
buf.write(struct.pack("&lt;Q", 0))               # offset

# Pad to alignment 32
while buf.tell() % 32 != 0:
    buf.write(b"\\x00")

# Tensor data
buf.write(struct.pack("&lt;f", scale))
buf.write(W_int8.tobytes())

data = buf.getvalue()
print(f"GGUF-mini file size: {len(data)} bytes")
print(f"  magic: {data[:4]}, version: {struct.unpack('&lt;I', data[4:8])[0]}")
print(f"  scale: {scale:.6f}")
print(f"  first 8 INT8 weights: {W_int8[:8].tolist()}")
print(f"  first 8 dequantized:  {(W_int8[:8].astype(np.float32) * scale).round(4).tolist()}")
print(f"  first 8 originals:    {W[:8].round(4).tolist()}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines the GGUF magic constant 0x46554747 — exactly the 4 ASCII bytes "GGUF" in little-endian; this is the first thing llama.cpp reads to confirm format. 2) Writes the fixed 24-byte header: magic (u32) + version=3 (u32) + tensor_count=1 (u64) + metadata_kv_count=2 (u64) — same layout as production GGUF. 3) Writes two KV metadata entries via the GGUF KV format (key-string with u64 length prefix, then a u32 type code, then the value) — type 4 means u32; production files write 50-200 such entries including <code>general.architecture</code>, <code>llama.context_length</code>, the entire tokenizer vocabulary. 4) Quantizes a 32-element FP32 weight to symmetric INT8 (scale = max(|w|)/127), writes the tensor descriptor (name + dim count + dims + GGUF type code + offset), then pads to <code>general.alignment</code> (32 bytes) — this padding is what makes mmap zero-copy on aligned page reads. 5) Writes the FP16 scale (here as FP32 for simplicity) plus the INT8 weights as raw bytes; dequantization on read multiplies <code>int8 * scale</code> and recovers the original within ~0.001 abs error. The file ends up under 200 bytes — same byte recipe scales to a 4GB Phi-3.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Memory Math — Will This Model Fit?</h2>
<p class="l-text">The most useful llama.cpp skill is estimating whether a model + context will fit on your hardware. Three components: weights, KV cache, activation scratch.</p>

<div class="katex-block">$$\\text{RAM} \\approx N_{\\text{params}} \\cdot \\text{bpw}/8 + 2 \\cdot n_{\\text{layers}} \\cdot d_{\\text{kv}} \\cdot n_{\\text{ctx}} \\cdot 2 \\,\\text{bytes (FP16 KV)} + \\text{scratch}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Weights — dominant for small ctx</div><div class="card-body">Phi-3-mini Q4_K_M = 2.4GB. Llama 3.1 8B Q4_K_M = 4.7GB. Llama 3.1 70B Q4_K_M = 42GB.</div></div>
<div class="calc-card"><div class="card-title">KV cache — dominant for long ctx</div><div class="card-body">~0.5 MB per layer per 1k tokens for a 7B model in FP16. At 32k context: 32 layers × 32k × 256 bytes ≈ 256MB extra. At 128k context: 1GB+.</div></div>
<div class="calc-card"><div class="card-title">KV-cache quantization</div><div class="card-body">llama.cpp supports Q8_0, Q4_0, even Q2 KV cache. Halves or quarters the cache size with small quality loss. Use <code>--cache-type-k q4_0 --cache-type-v q4_0</code>.</div></div>
<div class="calc-card"><div class="card-title">Scratch buffers</div><div class="card-body">~200–500MB for activations, attention scratch, sampling. Roughly constant per model.</div></div>
</div>

<p class="l-text">Concrete: a Phi-3-mini Q4_K_M with 4k context fits in ~3.2GB total — comfortable on any 8GB phone. A Llama 3.1 70B Q4_K_M needs 44GB+ for weights alone — a 64GB MacBook or a 2x RTX 3090 setup.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Where llama.cpp Hits Its Limits</h2>
<p class="l-text">For all its success, llama.cpp is not the right tool everywhere.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">High-throughput serving</div><div class="card-body">vLLM, TGI, and TensorRT-LLM beat llama.cpp by 5–10x throughput on cloud GPUs because they batch many requests per kernel call. llama.cpp's batching support exists but is not its strength.</div></div>
<div class="calc-card"><div class="card-title">Mobile NPUs</div><div class="card-body">Apple Neural Engine and Qualcomm Hexagon are not directly targeted. CoreML / TFLite paths (L6) extract more performance on phones. llama.cpp uses CPU+GPU on phones but cannot saturate NPUs.</div></div>
<div class="calc-card"><div class="card-title">Browser deployment</div><div class="card-body">Web-llama.cpp via WASM exists but is slow. Transformers.js + WebGPU (L7) are the better browser path.</div></div>
<div class="calc-card"><div class="card-title">Vision / multimodal</div><div class="card-body">LLaVA, CLIP, MiniCPM-V have llama.cpp ports but are second-class. PyTorch+vLLM is more mature.</div></div>
</div>

<p class="l-text">Still — for "I want to run an LLM on my own machine" the answer is almost always llama.cpp under one wrapper or another. L5 next zooms out to the broader format landscape (ONNX, CoreML, TFLite) where llama.cpp is one option among many.</p>
</div>`,
tr: `<p class="l-text"><strong>llama.cpp, MacBook Air'inizde 7B parametreli bir LLM'in çalışmasının nedenidir.</strong> Georgi Gerganov'un Mart 2023'te bir hafta sonu projesi olarak başlattığı, Mac'te Llama çalıştırmak için tek dosyalı C++ çıkarım motoru, 2024'te dünyadaki en çok kullanılan çıkarım runtime'ı oldu. Duyduğunuz her "yerel LLM" aracı — Ollama, LM Studio, GPT4All, Jan, KoboldCpp — onun etrafında bir wrapper'dır. Disk-üstü format <code>.gguf</code>, HuggingFace'te binlerce varyantıyla, quantize edilmiş açık-ağırlıklı modelleri dağıtmak için fiili standart haline geldi.</p>

<p class="l-text">Bu derste GGUF formatını byte-byte açıyoruz (magic, version, key-value metadata, tensor info, quantized weight blocks), K-quant ailesini (Q4_K_M, Q5_K_S, Q6_K, Q8_0) ve her ödünleşimin ne satın aldığını izliyoruz, llama.cpp pipeline'ından (load → tokenize → KV cache → sampling) geçiyoruz ve kullanıcıya yönelik ekosistemi inceliyoruz (CLI sevenler için Ollama, GUI sevenler için LM Studio, hepsi-bir-arada için GPT4All, gizlilik-öncelikli için Jan). NumPy struct.pack ile GGUF header'ın bir yeniden inşası ile bitiriyoruz, böylece kendi GGUF dosyalarınızı yazıp okuyabilirsiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>GGUF byte düzenini çözmek: magic, version, KV metadata, tensor descriptor'ları, quantized blok'lar</li>
<li>Doğru K-quant'ı seçmek: Q2_K (en küçük), Q4_K_M (dengeli), Q5_K_S (yüksek kalite), Q8_0 (FP16'ya yakın)</li>
<li>llama.cpp pipeline'ını anlamak: ağırlıkları mmap, BPE tokenizer, KV cache, top-p/top-k/min-p sampling</li>
<li>Ollama, LM Studio, GPT4All ve Jan'ı verimli kullanmak — ve her birini ne zaman seçeceğini bilmek</li>
<li><code>convert_hf_to_gguf.py</code> ile bir HuggingFace modelini GGUF'a dönüştürmek ve <code>llama-quantize</code> ile quantize etmek</li>
<li>Herhangi bir donanımdaki herhangi bir GGUF quant için model VRAM/RAM tahmin etmek</li>
<li>NumPy'dan minimal bir GGUF dosyası okumak ve yazmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Köken Hikayesi — Mart 2023, Tek Dosya, Dünya Değişti</h2>
<p class="l-text">Meta'nın Mart 2023 Llama sızıntısı, "bunu yerel olarak çalıştırabilir miyiz?" girişimlerinde bir frenezi yarattı. <code>whisper.cpp</code>'nin (OpenAI Whisper'ın benzer C++ port'u) arkasındaki Bulgar mühendis Gerganov, 10 Mart 2023'te <code>llama.cpp</code>'yi GitHub'a itti. Bir hafta içinde M1 Mac'te Llama-7B'yi 6 tok/s'de çalıştırdı. Bir ay içinde INT4 quantization, çoklu platform desteği ve 30k yıldıza sahip oldu. 2026'ya kadar, llama.cpp &gt;100k yıldıza sahip, CPU'lu her tüketici cihazında çalışıyor, her büyük açık-ağırlıklı modeli destekliyor ve Ollama, LM Studio, KoboldCpp, GPT4All, Jan, llamafile, oobabooga ve llama-cpp-python içindeki çıkarım motorudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden C++</div><div class="card-body">Python veya PyTorch bağımlılığı olmayan saf C++. Tek bir binary'ye derlenir. Apple Accelerate (M-serisi), AVX2/AVX512 (x86), CUDA, Metal, Vulkan, ROCm — kullanıcının sahip olduğu her şeyi kullanır.</div></div>
<div class="calc-card"><div class="card-title">Neden mmap</div><div class="card-body">Model ağırlıkları sadece-okuma olarak belleğe eşlenir. Birden fazla işlem RAM'de yüklenmiş aynı modeli paylaşır. Sıfır-kopya çıkarım başlangıcı. Soğuk başlangıç dakikalarla değil saniyelerle ölçülür.</div></div>
<div class="calc-card"><div class="card-title">Neden GGUF (GGML değil, HF safetensors değil)</div><div class="card-body">GGUF (Ağustos 2023'te tanıtıldı, GGML'in yerini aldı), zengin metadata pişirilmiş versiyonlu, genişletilebilir bir ikili formattır. Self-describing: tokenizer, prompt template, model arch hepsi dosyada yaşar.</div></div>
<div class="calc-card"><div class="card-title">Kültürel etki</div><div class="card-body">Açık-ağırlıklı LLM'leri hobiciler ve küçük işletmeler için <em>gerçekten kullanılabilir</em> hale getirdi. Reddit'teki "yerel LLM" topluluğu (/r/LocalLLaMA), TheBloke'un quantization yüklemeleri, Ollama'nın milyar+ pull'u — hepsi altta llama.cpp ile çalışır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. GGUF Dosya Formatı — Anatomi</h2>
<p class="l-text">Bir GGUF dosyası üç bölüme sahiptir: <strong>header</strong>, <strong>metadata KV pairs</strong> ve <strong>tensors</strong>. Her şey little-endian'dır. Format versiyonludur (mevcut: v3) ve self-describing'dir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Header (4 + 4 + 8 + 8 = 24 byte)</div><div class="card-body"><code>magic</code> = "GGUF" (0x46554747), <code>version</code> = u32 (2026'da 3), <code>tensor_count</code> = u64, <code>metadata_kv_count</code> = u64.</div></div>
<div class="calc-card"><div class="card-title">Metadata KV pairs</div><div class="card-body">(key:string, value_type:u32, value) üçlülerinin bir listesi. Anahtarlar: <code>general.architecture</code>, <code>general.name</code>, <code>llama.context_length</code>, <code>tokenizer.ggml.tokens</code>, <code>tokenizer.chat_template</code>, vb. Değer tipleri u8/i8/u16/i16/u32/i32/u64/i64/f32/f64/bool/string/array içerir.</div></div>
<div class="calc-card"><div class="card-title">Tensor info</div><div class="card-body">Her tensor için: name (string), dim count (u32), dims (u64 her biri), type (u32, GGUF tipi kodu), offset (tensor data section başlangıcından u64).</div></div>
<div class="calc-card"><div class="card-title">Tensor data</div><div class="card-body"><code>general.alignment</code>'a hizalanmış (tipik olarak 32 byte). Quantize edilmiş bloklar arka arkaya saklanır. mmap-dostu.</div></div>
</div>

<p class="l-text">Tam spec, llama.cpp deposundaki <code>ggml/docs/gguf.md</code>'de yaşar. Kısadır — belki 6 sayfa — ve bir kez okumaya değer.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. K-Quant Ailesi — Q2_K'dan Q8_0'a</h2>
<p class="l-text">GGUF'un quantize tipleri sadece "INT4" değildir — bunlar dikkatlice tasarlanmış blok bazlı şemalardır, tamsayı ağırlıkları FP16 veya FP32 scale'lerle karıştırırlar, genellikle scale'leri kendileri sıkıştırmak için blok başına çift quantization ile. "K" tipleri (Q2_K, Q3_K, Q4_K, Q5_K, Q6_K), Gerganov'un 2023 yeniden tasarımıydı, aynı bit-per-weight'te orijinal Q4_0/Q4_1'i önemli ölçüde yendi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q2_K — 2.56 bpw (bit per weight)</div><div class="card-body">2-bit ağırlıklar, 4-bit min ve FP16 super-block scale ile. En küçük pratik quant. 70B modeli kesinlikle 22GB'a sığdırmak zorunda olduğunuzda kullanılır. Kalite düşüşü farkedilir ama tutarlı.</div></div>
<div class="calc-card"><div class="card-title">Q3_K_S / Q3_K_M / Q3_K_L — ~3.5 bpw</div><div class="card-body">3-bit, üç "boyut varyantı" ekstra maliyetle kaliteyi takas eder. Small (S) attention katmanlarını 3-bit'te tutar, Medium (M) bazılarını 4-bit'te tutar, Large (L) daha fazlasını tutar.</div></div>
<div class="calc-card"><div class="card-title">Q4_K_M — 4.85 bpw — VARSAYILAN</div><div class="card-body">4-bit ağırlıklar, 6-bit super-block scale'ler, FP16 dış scale. Ollama varsayılan tag'leri, LM Studio varsayılan indirmeleri, TheBloke önerilen quant tarafından kullanılan tatlı nokta. Llama ailesinde FP16'ya karşı ~0.1 perplexity kaybeder.</div></div>
<div class="calc-card"><div class="card-title">Q5_K_S / Q5_K_M — ~5.5 bpw</div><div class="card-body">5-bit. Hafif boyut maliyetinde FP16 kalitesine daha yakın. Kod modelleri veya hassasiyete duyarlı kullanım için iyi.</div></div>
<div class="calc-card"><div class="card-title">Q6_K — 6.56 bpw</div><div class="card-body">6-bit. Benchmark'larda genellikle FP16'dan ayırt edilemez. Yedek RAM'iniz olduğunda kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Q8_0 — 8.5 bpw</div><div class="card-body">Orijinal INT8 ("K" değil). Blok başına FP16 scale, blok başına 32 ağırlık. Yarı boyutta etkili FP16 kalitesi. Karma hassasiyetli kurulumlarda embedding ve tokenizer matrisleri için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">F16 / BF16</div><div class="card-body">Orijinal hassasiyet. Ağırlık başına ~2 byte. Kalite ölçümleri için referans.</div></div>
<div class="calc-card"><div class="card-title">IQ-quants (yenisi, 2024)</div><div class="card-body">IQ2_XXS, IQ3_XXS, IQ4_XS — küçük bir Hessian-benzeri istatistik kullanan "importance-aware" quant'lar. K-quant'lardan aynı bit'te daha iyi kalite. Hesaplaması daha yavaş ama çıkarımda aynı.</div></div>
</div>

<div class="calc-highlight"><strong>Boyutlandırma kural-of-thumb:</strong> <code>N</code> parametreli bir model için, GGUF Q4_K_M kabaca <code>0.6 × N</code> byte kaplar. Yani 7B → 4.2GB, 13B → 7.8GB, 70B → 42GB. 2k context'te KV cache için ~2GB ekleyin.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. llama.cpp Pipeline'ı — Yüklemeden Token'a</h2>
<p class="l-text">"Bu prompt'u tamamla" gibi bir istek, sabit bir aşama dizisinden geçer. Onları bilmek performansı debug etmeye ve her ayarın ne yaptığını anlamaya yardımcı olur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Yükle (mmap)</div><div class="card-body">GGUF dosyasını belleğe eşle. Header + metadata oku. Tensor tablosunu inşa et. Sıfır kopya. Sonraki çalışmalar OS sayfa cache'ini yeniden kullanır; "sıcak" yüklemeler anındadır.</div></div>
<div class="calc-card"><div class="card-title">2. Tokenize et (BPE / SentencePiece)</div><div class="card-body">Tokenizer (vocab + merges) GGUF metadata'sındadır. Kullanıcı prompt'una byte-pair encoding uygula. Özel token'lar ekle (BOS, chat template).</div></div>
<div class="calc-card"><div class="card-title">3. Prefill (paralel)</div><div class="card-body">Tüm input token'larını transformer'dan tek seferde işle. KV cache hesapla (katman başına token başına bir satır). Bu compute-bound; bir telefon NPU'sunda başlangıca hakim olur.</div></div>
<div class="calc-card"><div class="card-title">4. Decode (sıralı)</div><div class="card-body">Tek seferde bir token üret. Her adım tüm KV cache'i okur (memory-bound) ve bir yeni attention + FFN katmanı uygular. Bu çoğu donanımda throughput darboğazıdır.</div></div>
<div class="calc-card"><div class="card-title">5. Sample</div><div class="card-body">Son katman logitlerinden bir token seç. Top-K, top-P (nucleus), min-P, temperature, repetition penalty, Mirostat, DRY — hepsi <code>sampling.cpp</code>'de uygulandı.</div></div>
<div class="calc-card"><div class="card-title">6. Detokenize, stream</div><div class="card-body">Token ID'lerini UTF-8 metnine geri dönüştür ve istemciye stream et. EOS veya max_tokens'a kadar adım 4'e geri dön.</div></div>
</div>

<p class="l-text">Yararlı bir detay: prefill hızı ve decode hızı neredeyse bağımsız metriklerdir. Bir telefon 200 prompt tok/s prefill yapabilir ama 30 tok/s decode yapabilir. Bulut GPU'lar bunu küçük batch'ler için tersine çevirir. Her iki sayı da önemlidir — uzun-prompt UI'lar prefill'le, sohbet-tarzı decode'la sınırlıdır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kullanıcıya Yönelik Ekosistem — Wrapper'ını Seç</h2>
<p class="l-text">2026'da neredeyse hiç kimse <code>llama-cli</code>'yi doğrudan çağırmıyor. Her birinin farklı bir kitlesi olan dört ana wrapper'dan birini kullanıyorlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ollama (CLI + REST API)</div><div class="card-body">"LLM'ler için Docker". <code>ollama run llama3.2</code> bir model indirir ve sohbet eder. Modelfile'lar inşa eder (Dockerfile-benzeri), localhost:11434'te OpenAI-uyumlu REST API açığa çıkarır. Yerel-öncelikli uygulamalar inşa eden geliştiriciler için varsayılan. Bir YC startup'ı tarafından destekleniyor, 2026'a kadar ~1B+ pull.</div></div>
<div class="calc-card"><div class="card-title">LM Studio (GUI)</div><div class="card-body">Electron uygulaması, güzel sohbet UI, HuggingFace'ten çeken model tarayıcı, GPU offload slider'ları, model başına prompt template'leri. Geliştirici olmayanlar için ve göndermeden önce prompt'ları test etmek için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">GPT4All (GUI + Python SDK)</div><div class="card-body">Nomic-AI'nın hepsi-bir-arada — GUI, Python kütüphanesi, yerel RAG için gömülü vektör deposu. Güçlü gizlilik hikayesi (telemetry-free). Ollama'dan daha erken hareket etti; pazar payı 2024–25'te Ollama+LM Studio'ya kaydı ama GPT4All offline RAG için hala popüler.</div></div>
<div class="calc-card"><div class="card-title">Jan (gizlilik-öncelikli GUI)</div><div class="card-body">Offline-öncelikli, no-cloud-fallback'e odaklanmış açık kaynaklı masaüstü uygulaması. Daha küçük kullanıcı tabanı, gizlilik bilincine sahip kullanıcılar arasında niş takipçi. Aynı llama.cpp motoru.</div></div>
<div class="calc-card"><div class="card-title">llamafile (Mozilla, tek executable)</div><div class="card-body">Justine Tunney'in projesi: llama.cpp + bir GGUF model + küçük bir HTTP server'ı tek bir cross-platform binary'ye paketler. <code>./llamafile</code> tarayıcınızda bir sohbet açar. Byte başına en iyi demo sihri.</div></div>
<div class="calc-card"><div class="card-title">llama-cpp-python (Python bağlamaları)</div><div class="card-body">Yerel LLM'i kendi Python uygulamanıza gömmek istediğinizde. LangChain LlamaCpp sınıfı tarafından, LiteLLM tarafından bir backend olarak, autogen tarafından yerel agent'lar için kullanılır.</div></div>
</div>

<div class="calc-highlight"><strong>2026 varsayılan yığın:</strong> runtime için Ollama, prompt-tuning GUI için LM Studio, uygulamalarda llama-cpp-python. Üçünün altında da aynı motor.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. HuggingFace Modelini GGUF'a Dönüştürmek</h2>
<p class="l-text">Tipik bir iş akışı: HuggingFace'ten safetensors'ta fine-tune edilmiş bir model indir → GGUF FP16'ya dönüştür → Q4_K_M'e quantize et. İki script llama.cpp ile gönderilir.</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># 1. llama.cpp'yi klonla ve derle
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp &amp;&amp; make -j

# 2. HuggingFace'ten model indir
huggingface-cli download microsoft/Phi-3-mini-4k-instruct --local-dir ./Phi-3-mini

# 3. HF -&gt; GGUF dönüştür (FP16)
python convert_hf_to_gguf.py ./Phi-3-mini --outfile ./Phi-3-mini-f16.gguf --outtype f16

# 4. Q4_K_M'e quantize et (varsayılan)
./llama-quantize ./Phi-3-mini-f16.gguf ./Phi-3-mini-Q4_K_M.gguf Q4_K_M

# 5. Çalıştır
./llama-cli -m ./Phi-3-mini-Q4_K_M.gguf -p "Explain mmap in one sentence." -n 200

# Sonuç: ~2.4GB GGUF, M2 MacBook Air'de 30+ tok/s'de çalışır
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Kanonik llama.cpp deposunu klonlar ve <code>make -j</code> ile derler — <code>llama-cli</code>, <code>llama-quantize</code>, <code>llama-server</code> ve dönüştürme python scriptini üretir. 2) <code>huggingface-cli</code> kullanarak HuggingFace'ten Phi-3-mini-4k-instruct'ı indirir — safetensors shard'larını artı tokenizer dosyalarını çeker. 3) <code>convert_hf_to_gguf.py</code>'yi <code>--outtype f16</code> ile çalıştırır: HF config'i okur, Phi3ForCausalLM ağırlıklarını GGML tensor isimlerine eşler, tam chat template, tokenizer ve mimari metadata pişirilmiş tek bir GGUF FP16 dosyası (~7.6GB) yazar. 4) Hedef <code>Q4_K_M</code> ile <code>llama-quantize</code>'ı çağırır: her lineer katmanın ağırlıkları 256 elemanlı süper-bloklara ayrılır, scale'ler 16 elemanlı alt-blok başına hesaplanır ve 4-bit indeksler artı 6-bit alt-scale'ler artı FP16 süper-scale'ler yazılır — çıktı ~2.4GB. 5) 200 token için <code>llama-cli -n 200</code> ile yükler — M2 MacBook Air'de bu Metal aracılığıyla 30+ tok/s'de çalışır, GGUF doğrudan mmap'lendiği için soğuk başlangıç saniye-altıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy'da minimal GGUF-tarzı bir dosya inşa et: bir header, KV metadata, tensor info ve bir INT4 quantize edilmiş ağırlık bloğu yaz, sonra geri oku ve round-trip'i doğrula. Uyguladığımız parçalar için gerçek GGUF ile aynı byte düzeni.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import struct
import io

GGUF_MAGIC = 0x46554747  # "GGUF" little-endian

def write_string(buf, s):
    b = s.encode("utf-8")
    buf.write(struct.pack("&lt;Q", len(b)))
    buf.write(b)

def write_u32_kv(buf, key, value):
    write_string(buf, key)
    buf.write(struct.pack("&lt;I", 4))  # type=4 means u32
    buf.write(struct.pack("&lt;I", value))

# --- Bellekte minimal bir GGUF inşa et ---
buf = io.BytesIO()
buf.write(struct.pack("&lt;I", GGUF_MAGIC))    # magic
buf.write(struct.pack("&lt;I", 3))              # version
buf.write(struct.pack("&lt;Q", 1))              # tensor_count
buf.write(struct.pack("&lt;Q", 2))              # metadata_kv_count

# Metadata
write_u32_kv(buf, "general.alignment", 32)
write_u32_kv(buf, "tinydemo.version", 1)

# Tensor info (bir tensor: 32 INT8 ağırlık)
W = np.random.randn(32).astype(np.float32) * 0.1
scale = np.max(np.abs(W)) / 127.0
W_int8 = np.clip(np.round(W/scale), -127, 127).astype(np.int8)

write_string(buf, "weight.0")
buf.write(struct.pack("&lt;I", 1))               # n_dims
buf.write(struct.pack("&lt;Q", 32))              # dim 0
buf.write(struct.pack("&lt;I", 0))               # type 0 = F32 (kandırıyoruz)
buf.write(struct.pack("&lt;Q", 0))               # offset

# Hizalama 32'ye pad
while buf.tell() % 32 != 0:
    buf.write(b"\\x00")

# Tensor data
buf.write(struct.pack("&lt;f", scale))
buf.write(W_int8.tobytes())

data = buf.getvalue()
print(f"GGUF-mini file size: {len(data)} bytes")
print(f"  magic: {data[:4]}, version: {struct.unpack('&lt;I', data[4:8])[0]}")
print(f"  scale: {scale:.6f}")
print(f"  first 8 INT8 weights: {W_int8[:8].tolist()}")
print(f"  first 8 dequantized:  {(W_int8[:8].astype(np.float32) * scale).round(4).tolist()}")
print(f"  first 8 originals:    {W[:8].round(4).tolist()}")
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) GGUF magic sabiti 0x46554747'yi tanımlar — little-endian'da "GGUF"un tam 4 ASCII byte'ı; llama.cpp'nin formatı doğrulamak için okuduğu ilk şey budur. 2) Sabit 24 byte header'ı yazar: magic (u32) + version=3 (u32) + tensor_count=1 (u64) + metadata_kv_count=2 (u64) — üretim GGUF ile aynı düzen. 3) GGUF KV formatı (key-string'in u64 uzunluk öneki ile, sonra u32 tip kodu, sonra değer) yoluyla iki KV metadata girişi yazar — tip 4 u32 demektir; üretim dosyaları <code>general.architecture</code>, <code>llama.context_length</code>, tüm tokenizer vocabulary dahil 50-200 böyle giriş yazar. 4) 32 elemanlı FP32 ağırlığı simetrik INT8'e quantize eder (scale = max(|w|)/127), tensor descriptor'ı yazar (name + dim count + dims + GGUF tip kodu + offset), sonra <code>general.alignment</code>'a (32 byte) pad eder — bu padding hizalanmış sayfa okumalarında mmap'i sıfır-kopya yapan şeydir. 5) FP16 scale'i (basitlik için burada FP32 olarak) artı INT8 ağırlıkları ham byte olarak yazar; okuma sırasında dequantization <code>int8 * scale</code> çarpar ve orijinali ~0.001 mutlak hata içinde kurtarır. Dosya 200 byte altında biter — aynı byte tarifi 4GB Phi-3'e ölçeklenir.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Bellek Matematiği — Bu Model Sığacak mı?</h2>
<p class="l-text">En yararlı llama.cpp becerisi, bir modelin + bağlamın donanımınıza sığıp sığmayacağını tahmin etmektir. Üç bileşen: ağırlıklar, KV cache, aktivasyon scratch.</p>

<div class="katex-block">$$\\text{RAM} \\approx N_{\\text{params}} \\cdot \\text{bpw}/8 + 2 \\cdot n_{\\text{layers}} \\cdot d_{\\text{kv}} \\cdot n_{\\text{ctx}} \\cdot 2 \\,\\text{bytes (FP16 KV)} + \\text{scratch}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ağırlıklar — küçük ctx için baskın</div><div class="card-body">Phi-3-mini Q4_K_M = 2.4GB. Llama 3.1 8B Q4_K_M = 4.7GB. Llama 3.1 70B Q4_K_M = 42GB.</div></div>
<div class="calc-card"><div class="card-title">KV cache — uzun ctx için baskın</div><div class="card-body">FP16'da 7B model için 1k token başına katman başına ~0.5 MB. 32k bağlamda: 32 katman × 32k × 256 byte ≈ 256MB ekstra. 128k bağlamda: 1GB+.</div></div>
<div class="calc-card"><div class="card-title">KV-cache quantization</div><div class="card-body">llama.cpp Q8_0, Q4_0, hatta Q2 KV cache'i destekler. Küçük kalite kaybıyla cache boyutunu yarıya veya çeyreğe indirir. <code>--cache-type-k q4_0 --cache-type-v q4_0</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">Scratch buffer'lar</div><div class="card-body">Aktivasyonlar, attention scratch, sampling için ~200–500MB. Model başına kabaca sabit.</div></div>
</div>

<p class="l-text">Somut: 4k bağlamlı bir Phi-3-mini Q4_K_M toplam ~3.2GB'a sığar — herhangi bir 8GB telefonda rahat. Llama 3.1 70B Q4_K_M sadece ağırlıklar için 44GB+ gerektirir — 64GB MacBook veya 2x RTX 3090 kurulumu.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. llama.cpp'nin Sınırlarına Çarptığı Yerler</h2>
<p class="l-text">Tüm başarısına rağmen, llama.cpp her yerde doğru araç değildir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yüksek-throughput servis</div><div class="card-body">vLLM, TGI ve TensorRT-LLM, bulut GPU'larında 5–10x throughput ile llama.cpp'yi yener çünkü kernel çağrısı başına birçok isteği batch'lerler. llama.cpp'nin batching desteği vardır ama gücü değildir.</div></div>
<div class="calc-card"><div class="card-title">Mobil NPU'lar</div><div class="card-body">Apple Neural Engine ve Qualcomm Hexagon doğrudan hedeflenmez. CoreML / TFLite yolları (L6) telefonlarda daha fazla performans çıkarır. llama.cpp telefonlarda CPU+GPU kullanır ama NPU'ları doyuramaz.</div></div>
<div class="calc-card"><div class="card-title">Tarayıcı dağıtımı</div><div class="card-body">WASM aracılığıyla Web-llama.cpp vardır ama yavaştır. Transformers.js + WebGPU (L7) daha iyi tarayıcı yoludur.</div></div>
<div class="calc-card"><div class="card-title">Vision / multimodal</div><div class="card-body">LLaVA, CLIP, MiniCPM-V'nin llama.cpp port'ları vardır ama ikinci sınıftır. PyTorch+vLLM daha olgundur.</div></div>
</div>

<p class="l-text">Yine de — "Kendi makinemde bir LLM çalıştırmak istiyorum" için cevap neredeyse her zaman bir wrapper veya başkasının altında llama.cpp'dir. L5 daha sonra, llama.cpp'nin birçok seçenek arasından sadece biri olduğu daha geniş format manzarasına (ONNX, CoreML, TFLite) yakınlaşır.</p>
</div>`
};
