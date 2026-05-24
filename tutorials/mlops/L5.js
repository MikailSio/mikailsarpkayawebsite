window.MLOPS_L5 = {
en: `<p class="l-text"><strong>Hook:</strong> "It works on my machine" was killed by Docker. A container freezes the OS, the libraries, the Python version and your code into a single immutable image — so the model behaves identically on your laptop, on a teammate's WSL, in CI, and on Kubernetes.</p>
<p class="l-text">In this lesson we cover why containers fit ML, the Dockerfile anatomy, multi-stage builds for slim images, GPU base images, and docker-compose for multi-service stacks.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write a Dockerfile with FROM, COPY, RUN, EXPOSE, and CMD instructions</li>
<li>Build a multi-stage image that strips build deps and ships under 200MB</li>
<li>Pick a CUDA base image to enable GPU inference inside containers</li>
<li>Compose a multi-service stack: API + Postgres + MLflow with docker-compose</li>
<li>Apply image hygiene: pin tags, non-root user, .dockerignore, layer caching</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Containers for ML?</h2>
<p class="l-text">ML stacks are heavy and brittle: CUDA, cuDNN, MKL, BLAS, hundreds of pip packages. A bare <code>requirements.txt</code> doesn't lock these. A container does.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Determinism</div><div class="calc-card-body">Same image → same behavior, anywhere.</div></div>
<div class="calc-card"><div class="calc-card-title">Portability</div><div class="calc-card-body">Runs on any host with Docker / containerd / Kubernetes.</div></div>
<div class="calc-card"><div class="calc-card-title">Isolation</div><div class="calc-card-body">No clash with the host's Python or system libs.</div></div>
<div class="calc-card"><div class="calc-card-title">Versioned</div><div class="calc-card-body">Tags + digests give you immutable image identity.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Anatomy of a Dockerfile</h2>
<p class="l-text">A Dockerfile is a recipe of layers. Each line is cached individually — order them from "rarely changes" to "often changes" for fast rebuilds.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile</span>
FROM python:<span class="num">3.11</span>-slim AS runtime

<span class="cm"># 1) system deps (rare changes — cached well)</span>
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \
    build-essential libgomp1 &amp;&amp; rm -rf /var/lib/apt/lists/*

<span class="cm"># 2) Python deps (changes when requirements.lock changes)</span>
WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-<span class="ty">dir</span> -r requirements.lock

<span class="cm"># 3) application code (changes most often — comes last)</span>
COPY src/ ./src/
COPY models/ ./models/

ENV PYTHONUNBUFFERED=<span class="num">1</span>
EXPOSE <span class="num">8000</span>
CMD [<span class="str">"uvicorn"</span>, <span class="str">"src.app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>FROM python:3.11-slim AS runtime</code> picks a minimal Debian image and names the stage <code>runtime</code> for multi-stage references. 2) <code>RUN apt-get install ... build-essential libgomp1</code> installs system deps (libgomp is needed by sklearn for OpenMP). 3) <code>ENV PYTHONUNBUFFERED=1</code> + <code>PIP_NO_CACHE_DIR=1</code> kill log buffering and pip's build cache — smaller image, real-time stdout in Kubernetes. 4) <code>COPY requirements.lock</code> + <code>pip install</code> precede <code>COPY . .</code> so Docker reuses the dependency layer when only code changes. 5) <code>USER 1000</code> runs the process as non-root — required by most production clusters. 6) <code>EXPOSE 8000</code> + <code>CMD ["uvicorn","app:app"]</code> declare the network interface and entrypoint.</p>
<p class="l-text"><strong>Layer-cache rule:</strong> if you put <code>COPY . .</code> before <code>pip install</code>, every code change re-downloads packages. The order above takes seconds on rebuild instead of minutes.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Build &amp; Run</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># Build (tag with semver + git sha for traceability)</span>
docker build -t myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span> -t myorg/churn-api:$(git rev-parse --short HEAD) .

<span class="cm"><span class="cm"># Run interactively</span>
docker run --rm -p <span class="num"><span class="num">8000</span></span>:<span class="num"><span class="num">8000</span></span> myorg/churn-api:<span class="num"><span class="num">1.2.0</span>

<span class="cm"><span class="cm"># Inspect what's inside</span>
docker run --rm -it myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span> /<span class="ty"><span class="ty">bin</span></span>/bash

<span class="cm"><span class="cm"># Push to registry</span>
docker login ghcr.io
docker push myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>docker build -t churn-api:1.0.0-$(git rev-parse --short HEAD) .</code> tags the image with both a semver and the short git SHA — every container in the registry traces back to a commit. 2) <code>docker run -p 8000:8000 -e LOG_LEVEL=info</code> binds the container's 8000 to the host's 8000 and injects an env var into the process. 3) <code>--rm</code> auto-removes the stopped container so your local list stays clean. 4) <code>docker push myreg/churn-api:1.0.0-abc1234</code> uploads to a registry (ECR/GCR/Harbor). 5) The semver + SHA dual tag is what makes rollbacks trivial: ArgoCD/Helm just points back to the old tag.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Multi-Stage Builds for Slim Images</h2>
<p class="l-text">Compilers, build tools and pip cache balloon images to 2-4 GB. A multi-stage build copies <em>only</em> the runtime artifacts to a clean final image — often 5-10× smaller.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Stage 1 — builder (heavy, throwaway)</span>
FROM python:<span class="num">3.11</span> AS builder
WORKDIR /build
COPY requirements.lock .
RUN pip install --user --no-cache-<span class="ty">dir</span> -r requirements.lock

<span class="cm"># Stage 2 — runtime (slim, what ships)</span>
FROM python:<span class="num">3.11</span>-slim
WORKDIR /app
COPY --<span class="kw">from</span>=builder /root/.local /root/.local
COPY src/ ./src/
ENV PATH=/root/.local/<span class="ty">bin</span>:$PATH
CMD [<span class="str">"python"</span>, <span class="str">"-m"</span>, <span class="str">"src.serve"</span>]</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Stage 1 <code>FROM python:3.11 AS builder</code> uses the full image (with gcc/headers) and runs <code>pip install --target=/install</code> to compile wheels into a throwaway dir. 2) Stage 2 <code>FROM python:3.11-slim</code> starts a clean minimal image — none of the toolchain leaks through. 3) <code>COPY --from=builder /install /usr/local/lib/python3.11/site-packages</code> hoists just the installed packages across. 4) Result: a runtime image around 150 MB instead of 900 MB with the same code. 5) This pattern is essential for PyTorch CUDA images where the build deps alone can be 3 GB.</p>
<p class="l-text">The <code>builder</code> stage compiles wheels; the final stage inherits a tiny base and copies <em>only</em> <code>~/.local</code>. A typical sklearn API drops from ~1.4 GB to ~280 MB.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. GPU Base Images</h2>
<p class="l-text">For deep learning use NVIDIA's official CUDA images. They include the right driver-userspace combination.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># PyTorch with CUDA 12.1</span>
FROM nvidia/cuda:<span class="num">12.1.0</span>-cudnn8-runtime-ubuntu22<span class="num">.04</span>
RUN apt-get update &amp;&amp; apt-get install -y python3 python3-pip &amp;&amp; rm -rf /var/lib/apt/lists/*
RUN pip install torch==<span class="num">2.2</span> transformers==<span class="num">4.40</span> fastapi==<span class="num">0.110</span> uvicorn==<span class="num">0.29</span>
COPY src/ /app/src/
WORKDIR /app
CMD [<span class="str">"uvicorn"</span>, <span class="str">"src.app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]

<span class="cm"># Run requires --gpus</span>
docker run --gpus <span class="ty">all</span> -p <span class="num">8000</span>:<span class="num">8000</span> myorg/llm-api:<span class="num">1.0</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>FROM nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04</code> picks the official NVIDIA runtime image — CUDA toolkit + cuDNN preinstalled, no driver shipped (it lives on the host). 2) <code>RUN apt-get install python3-pip</code> adds Python on top. 3) <code>pip install torch --index-url https://download.pytorch.org/whl/cu121</code> grabs the PyTorch build matching CUDA 12.1 — version skew here is the #1 cause of "cuda not available" mysteries. 4) <code>docker run --gpus all churn-train:gpu</code> requires <em>nvidia-container-toolkit</em> on the host to inject the device files. 5) The <code>runtime</code> variant excludes nvcc/headers; switch to <code>devel</code> only if you compile custom CUDA kernels.</p>
<p class="l-text">Alternative: <code>pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime</code> ships PyTorch pre-installed.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. docker-compose for Multi-Service Stacks</h2>
<p class="l-text">A real ML service rarely runs alone. Compose orchestrates the API + Redis cache + Postgres + monitoring sidecar in one declarative file.</p>
<div class="code-wrap"><div class="code-label"><span>YAML</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># docker-compose.yml</span>
version: <span class="str">"3.9"</span>
services:
  api:
    build: .
    image: myorg/churn-api:<span class="num">1.2.0</span>
    ports: [<span class="str">"8000:8000"</span>]
    environment:
      MODEL_VERSION: <span class="str">"1.2.0"</span>
      REDIS_URL: <span class="str">"redis://cache:6379/0"</span>
    depends_on: [cache, db]

  cache:
    image: redis:<span class="num">7</span>-alpine
    ports: [<span class="str">"6379:6379"</span>]

  db:
    image: postgres:<span class="num">16</span>
    environment:
      POSTGRES_PASSWORD: secret
    volumes: [<span class="str">"pgdata:/var/lib/postgresql/data"</span>]

volumes:
  pgdata:</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>services.api.build: .</code> tells compose to build from the local Dockerfile. 2) <code>ports: ["8000:8000"]</code> publishes the container port. 3) <code>environment: MLFLOW_TRACKING_URI=http://mlflow:5000</code> uses Docker's built-in DNS — service name <code>mlflow</code> resolves to the other container's IP. 4) <code>depends_on: [mlflow]</code> orders startup. 5) <code>services.mlflow</code> brings up an MLflow server with a SQLite backend volume. 6) <code>docker compose up</code> wires both together; <code>down</code> tears them down. This is the dev-time stand-in for Kubernetes.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Image Hygiene Checklist</h2>
<div id="mlops-l5-graph-en" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Effect of common optimizations on a sklearn-FastAPI image. Multi-stage and a slim base do most of the heavy lifting.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Pin base tag</div><div class="calc-card-body"><code>python:3.11.9-slim-bookworm</code> not <code>python:3</code>.</div></div>
<div class="calc-card"><div class="calc-card-title">--no-cache-dir</div><div class="calc-card-body">Skip pip cache; smaller layer.</div></div>
<div class="calc-card"><div class="calc-card-title">.dockerignore</div><div class="calc-card-body">Exclude <code>data/</code>, <code>.git</code>, <code>__pycache__</code>.</div></div>
<div class="calc-card"><div class="calc-card-title">Non-root user</div><div class="calc-card-body"><code>RUN useradd app &amp;&amp; USER app</code> for security.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Containers freeze OS + libs + code into a single immutable, portable artifact.</li>
<li>Order Dockerfile lines from "rare changes" to "frequent changes" for cache friendliness.</li>
<li>Multi-stage builds shrink ML images dramatically (1.4 GB → 280 MB is typical).</li>
<li>For GPU, start from <code>nvidia/cuda</code> and run with <code>--gpus all</code>.</li>
<li>docker-compose declares the whole stack — API, cache, DB, monitoring — in one YAML.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l5-graph-en', [{
    x:['Naive','+slim base','+no-cache-dir','+multi-stage','+strip libs'],
    y:[1850, 1100, 950, 320, 240], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Image size (MB) after each optimization step',
    yaxis:{title:'MB'}, margin:{t:60,r:30,b:60,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> "Benim makinemde çalışıyordu" cümlesini Docker öldürdü. Bir konteyner; işletim sistemini, kütüphaneleri, Python sürümünü ve kodunuzu tek bir değişmez imaja dondurur — model dizüstünüzde, ekip arkadaşının WSL'sinde, CI'da ve Kubernetes'te aynı davranır.</p>
<p class="l-text">Bu derste konteynerlerin ML'e neden uyduğunu, Dockerfile anatomisini, ince imajlar için multi-stage build'leri, GPU base imajlarını ve çok-servisli yığınlar için docker-compose'u ele alıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>FROM, COPY, RUN, EXPOSE ve CMD direktifleriyle bir Dockerfile yazacaksın</li>
<li>Build bağımlılıklarını söküp 200MB altına inen multi-stage imaj kuracaksın</li>
<li>Konteyner içinde GPU çıkarımı için CUDA base imajı seçeceksin</li>
<li>docker-compose ile API + Postgres + MLflow çoklu servis yığını kuracaksın</li>
<li>İmaj hijyeni uygulayacaksın: tag pin, non-root user, .dockerignore, layer cache</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ML için Konteynerler Neden?</h2>
<p class="l-text">ML yığınları ağır ve kırılgandır: CUDA, cuDNN, MKL, BLAS, yüzlerce pip paketi. Çıplak bir <code>requirements.txt</code> bunları kilitlemez. Konteyner kilitler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Belirlenmişlik</div><div class="calc-card-body">Aynı imaj → her yerde aynı davranış.</div></div>
<div class="calc-card"><div class="calc-card-title">Taşınabilirlik</div><div class="calc-card-body">Docker / containerd / Kubernetes olan her host'ta çalışır.</div></div>
<div class="calc-card"><div class="calc-card-title">İzolasyon</div><div class="calc-card-body">Host'un Python veya sistem kütüphaneleriyle çakışma yok.</div></div>
<div class="calc-card"><div class="calc-card-title">Sürümlü</div><div class="calc-card-body">Tag + digest, değişmez imaj kimliği verir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bir Dockerfile'ın Anatomisi</h2>
<p class="l-text">Dockerfile katmanlardan oluşan bir tariftir. Her satır ayrı önbelleğe alınır — hızlı yeniden build için "nadiren değişen"den "sık değişen"e doğru sıralayın.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile</span>
FROM python:<span class="num">3.11</span>-slim AS runtime

<span class="cm"># 1) sistem bağımlılıkları (nadir değişir — iyi önbelleklenir)</span>
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \
    build-essential libgomp1 &amp;&amp; rm -rf /var/lib/apt/lists/*

<span class="cm"># 2) Python bağımlılıkları (requirements.lock değişince değişir)</span>
WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-<span class="ty">dir</span> -r requirements.lock

<span class="cm"># 3) uygulama kodu (en sık değişir — sona)</span>
COPY src/ ./src/
COPY models/ ./models/

ENV PYTHONUNBUFFERED=<span class="num">1</span>
EXPOSE <span class="num">8000</span>
CMD [<span class="str">"uvicorn"</span>, <span class="str">"src.app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>FROM python:3.11-slim AS runtime</code> minimal Debian imajını seçer ve aşamayı multi-stage referansı için <code>runtime</code> olarak adlandırır. 2) <code>RUN apt-get install ... build-essential libgomp1</code> sistem bağımlılıklarını kurar (libgomp, sklearn'in OpenMP için ihtiyacıdır). 3) <code>ENV PYTHONUNBUFFERED=1</code> + <code>PIP_NO_CACHE_DIR=1</code> log tamponlamayı ve pip build cache'ini kapatır — daha küçük imaj, Kubernetes'te canlı stdout. 4) <code>COPY requirements.lock</code> + <code>pip install</code>, <code>COPY . .</code>'den önce gelir — kod değiştiğinde Docker bağımlılık katmanını yeniden kullanır. 5) <code>USER 1000</code> süreci root olmayan kullanıcı altında çalıştırır — çoğu üretim cluster'ı bunu zorunlu kılar. 6) <code>EXPOSE 8000</code> + <code>CMD ["uvicorn","app:app"]</code> ağ arayüzünü ve giriş noktasını bildirir.</p>
<p class="l-text"><strong>Katman önbelleği kuralı:</strong> <code>COPY . .</code>'i <code>pip install</code>'ten önce koyarsanız her kod değişikliği paketleri yeniden indirir. Yukarıdaki sıra yeniden build'i dakikalar yerine saniyelere indirir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Build &amp; Run</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># Build (izlenebilirlik için semver + git sha)</span>
docker build -t myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span> -t myorg/churn-api:$(git rev-parse --short HEAD) .

<span class="cm"><span class="cm"># Etkileşimli çalıştır</span>
docker run --rm -p <span class="num"><span class="num">8000</span></span>:<span class="num"><span class="num">8000</span></span> myorg/churn-api:<span class="num"><span class="num">1.2.0</span>

<span class="cm"><span class="cm"># İçeriğini incele</span>
docker run --rm -it myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span> /<span class="ty"><span class="ty">bin</span></span>/bash

<span class="cm"><span class="cm"># Registry'ye gönder</span>
docker login ghcr.io
docker push myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>docker build -t churn-api:1.0.0-$(git rev-parse --short HEAD) .</code> imajı hem semver hem kısa git SHA ile etiketler — registry'deki her konteyner bir commit'e kadar takip edilebilir. 2) <code>docker run -p 8000:8000 -e LOG_LEVEL=info</code>, konteynerin 8000'ini host'un 8000'ine bağlar ve sürece env var enjekte eder. 3) <code>--rm</code>, durmuş konteyneri otomatik siler — yerel liste temiz kalır. 4) <code>docker push myreg/churn-api:1.0.0-abc1234</code> bir registry'e (ECR/GCR/Harbor) yükler. 5) Semver + SHA çift etiketi rollback'i sıradan kılar: ArgoCD/Helm sadece eski etikete döner.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İnce İmajlar İçin Multi-Stage Build</h2>
<p class="l-text">Derleyiciler, build araçları ve pip önbelleği imajları 2-4 GB'a şişirir. Multi-stage build <em>yalnızca</em> runtime artefaktlarını temiz bir final imaja kopyalar — sıkça 5-10× daha küçük.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># 1. aşama — builder (ağır, atılabilir)</span>
FROM python:<span class="num">3.11</span> AS builder
WORKDIR /build
COPY requirements.lock .
RUN pip install --user --no-cache-<span class="ty">dir</span> -r requirements.lock

<span class="cm"># 2. aşama — runtime (ince, sevk edilen)</span>
FROM python:<span class="num">3.11</span>-slim
WORKDIR /app
COPY --<span class="kw">from</span>=builder /root/.local /root/.local
COPY src/ ./src/
ENV PATH=/root/.local/<span class="ty">bin</span>:$PATH
CMD [<span class="str">"python"</span>, <span class="str">"-m"</span>, <span class="str">"src.serve"</span>]</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) 1. aşama <code>FROM python:3.11 AS builder</code>, tam imajı (gcc/headers ile) kullanır ve <code>pip install --target=/install</code> ile wheel'leri atılabilir bir dizine derler. 2) 2. aşama <code>FROM python:3.11-slim</code> temiz minimal imajdan başlar — toolchain hiç sızmaz. 3) <code>COPY --from=builder /install /usr/local/lib/python3.11/site-packages</code> sadece kurulan paketleri taşır. 4) Sonuç: aynı kodla 900 MB yerine ~150 MB runtime imajı. 5) Bu desen, build bağımlılıkları tek başına 3 GB tutabilen PyTorch CUDA imajları için zorunludur.</p>
<p class="l-text"><code>builder</code> aşaması wheel'leri derler; final aşama küçük base'i miras alıp <em>yalnızca</em> <code>~/.local</code>'i kopyalar. Tipik bir sklearn API ~1.4 GB'tan ~280 MB'a düşer.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. GPU Base İmajları</h2>
<p class="l-text">Derin öğrenme için NVIDIA'nın resmi CUDA imajlarını kullanın. Doğru sürücü-userspace kombinasyonunu içerir.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># PyTorch + CUDA 12.1</span>
FROM nvidia/cuda:<span class="num">12.1.0</span>-cudnn8-runtime-ubuntu22<span class="num">.04</span>
RUN apt-get update &amp;&amp; apt-get install -y python3 python3-pip &amp;&amp; rm -rf /var/lib/apt/lists/*
RUN pip install torch==<span class="num">2.2</span> transformers==<span class="num">4.40</span> fastapi==<span class="num">0.110</span> uvicorn==<span class="num">0.29</span>
COPY src/ /app/src/
WORKDIR /app
CMD [<span class="str">"uvicorn"</span>, <span class="str">"src.app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]

<span class="cm"># Çalıştırırken --gpus gerekir</span>
docker run --gpus <span class="ty">all</span> -p <span class="num">8000</span>:<span class="num">8000</span> myorg/llm-api:<span class="num">1.0</span></code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>FROM nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04</code>, resmi NVIDIA runtime imajını seçer — CUDA toolkit + cuDNN önyüklü, sürücü host'tadır. 2) <code>RUN apt-get install python3-pip</code> Python'ı üzerine ekler. 3) <code>pip install torch --index-url https://download.pytorch.org/whl/cu121</code>, CUDA 12.1 ile uyumlu PyTorch build'ini çeker — sürüm uyumsuzluğu "cuda not available" gizemlerinin 1 numaralı sebebidir. 4) <code>docker run --gpus all churn-train:gpu</code> host'ta <em>nvidia-container-toolkit</em> ister — device dosyalarını inject eder. 5) <code>runtime</code> varyantı nvcc/header içermez; özel CUDA çekirdeği derliyorsanız <code>devel</code>'e geçin.</p>
<p class="l-text">Alternatif: <code>pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime</code> PyTorch'u önceden kurulu getirir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Çok-Servisli Yığınlar İçin docker-compose</h2>
<p class="l-text">Gerçek bir ML servisi nadiren tek başına çalışır. Compose API + Redis önbelleği + Postgres + izleme yan-arabasını tek bir bildirimsel dosyada koordine eder.</p>
<div class="code-wrap"><div class="code-label"><span>YAML</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># docker-compose.yml</span>
version: <span class="str">"3.9"</span>
services:
  api:
    build: .
    image: myorg/churn-api:<span class="num">1.2.0</span>
    ports: [<span class="str">"8000:8000"</span>]
    environment:
      MODEL_VERSION: <span class="str">"1.2.0"</span>
      REDIS_URL: <span class="str">"redis://cache:6379/0"</span>
    depends_on: [cache, db]

  cache:
    image: redis:<span class="num">7</span>-alpine
    ports: [<span class="str">"6379:6379"</span>]

  db:
    image: postgres:<span class="num">16</span>
    environment:
      POSTGRES_PASSWORD: secret
    volumes: [<span class="str">"pgdata:/var/lib/postgresql/data"</span>]

volumes:
  pgdata:</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>services.api.build: .</code> compose'a yerel Dockerfile'dan build et der. 2) <code>ports: ["8000:8000"]</code> konteyner portunu yayınlar. 3) <code>environment: MLFLOW_TRACKING_URI=http://mlflow:5000</code>, Docker'ın yerleşik DNS'ini kullanır — servis adı <code>mlflow</code>, diğer konteynerin IP'sine çözülür. 4) <code>depends_on: [mlflow]</code> başlatma sırasını belirler. 5) <code>services.mlflow</code>, SQLite backend volume'u olan bir MLflow sunucusu açar. 6) <code>docker compose up</code> ikisini birbirine bağlar; <code>down</code> yıkar. Bu, Kubernetes'in geliştirme zamanı yedeğidir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. İmaj Hijyen Listesi</h2>
<div id="mlops-l5-graph-tr" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Sklearn-FastAPI imajına yaygın optimizasyonların etkisi. Asıl yükü multi-stage ve slim base taşır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Base tag'ini sabitle</div><div class="calc-card-body"><code>python:3.11.9-slim-bookworm</code>, <code>python:3</code> değil.</div></div>
<div class="calc-card"><div class="calc-card-title">--no-cache-dir</div><div class="calc-card-body">pip önbelleğini atla; daha küçük katman.</div></div>
<div class="calc-card"><div class="calc-card-title">.dockerignore</div><div class="calc-card-body"><code>data/</code>, <code>.git</code>, <code>__pycache__</code> hariç tut.</div></div>
<div class="calc-card"><div class="calc-card-title">Root olmayan kullanıcı</div><div class="calc-card-body">Güvenlik için <code>RUN useradd app &amp;&amp; USER app</code>.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Konteynerler işletim sistemi + kütüphane + kodu değişmez, taşınabilir tek bir artefaktta dondurur.</li>
<li>Dockerfile satırlarını "nadir değişen"den "sık değişen"e sıralayın — önbellek dostu olur.</li>
<li>Multi-stage build ML imajlarını dramatik küçültür (1.4 GB → 280 MB tipik).</li>
<li>GPU için <code>nvidia/cuda</code>'dan başlayın ve <code>--gpus all</code> ile çalıştırın.</li>
<li>docker-compose tüm yığını — API, önbellek, DB, izleme — tek YAML'da bildirir.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l5-graph-tr', [{
    x:['Naive','+slim base','+no-cache-dir','+multi-stage','+strip'],
    y:[1850, 1100, 950, 320, 240], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Her optimizasyon adımı sonrası imaj boyutu (MB)',
    yaxis:{title:'MB'}, margin:{t:60,r:30,b:60,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
