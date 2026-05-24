window.MLOPS_L7 = {
en: `<p class="l-text"><strong>Hook:</strong> "deploy to the cloud" hides a dozen choices. EC2 vs Fargate vs Lambda vs SageMaker vs Cloud Run vs Vertex AI — pick wrong and you'll either burn 10× the budget or hit a wall at scale.</p>
<p class="l-text">In this lesson we map the compute taxonomy across AWS, GCP and Azure, give a decision rule, walk through IAM basics, and demo two deployment shells (S3 upload + Cloud Run deploy).</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Map VM, container, serverless, and managed-ML across AWS, GCP, and Azure</li>
<li>Pick the right compute tier from a decision tree based on QPS and latency</li>
<li>Apply least-privilege IAM roles for an inference service touching S3</li>
<li>Deploy a containerized model to AWS ECR + Fargate using shell commands</li>
<li>Ship a FastAPI image to GCP Cloud Run in three commands</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Compute Taxonomy</h2>
<p class="l-text">Three orthogonal axes: how much you manage, how it scales, how you're billed.</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>VM</strong><br/>EC2, GCE, Azure VM. You manage OS. Billed per second of uptime.</div><div class="calc-compare-cell"><strong>Container, scale-to-zero</strong><br/>Cloud Run, App Runner, Container Apps. You ship a container; cloud autoscales 0→N.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Container, always-on</strong><br/>ECS Fargate, GKE, AKS. Always ≥1 replica. Predictable latency.</div><div class="calc-compare-cell"><strong>Serverless function</strong><br/>Lambda, Cloud Functions, Azure Functions. ZIP/container, &lt;15 min, cold starts.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Managed ML</strong><br/>SageMaker, Vertex AI, Azure ML. Endpoints, training jobs, registry built-in.</div><div class="calc-compare-cell"><strong>Batch</strong><br/>AWS Batch, Dataproc, Databricks. Long-running training / scoring jobs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Decision Tree</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Traffic spiky, latency tolerant?</strong> → Cloud Run / App Runner. Scales to zero, you pay only for requests.</div>
<div class="calc-step"><strong>Traffic steady, low latency?</strong> → ECS Fargate / GKE / AKS with 2-3 always-on replicas.</div>
<div class="calc-step"><strong>GPU inference, real-time?</strong> → SageMaker Real-Time / Vertex AI Endpoint / managed Triton.</div>
<div class="calc-step"><strong>Need full control / custom CUDA?</strong> → EC2 / GCE with NVIDIA driver image.</div>
<div class="calc-step"><strong>Tiny request volume, cheap is everything?</strong> → Lambda container image (with Mountpoint S3 for the model).</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. IAM in One Page</h2>
<p class="l-text">Cloud security is least-privilege. Three actors: <em>user</em> (you), <em>service account</em> (the workload), <em>role</em> (a bag of permissions).</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">User</div><div class="calc-card-body">Human; assume roles for tasks. MFA always on.</div></div>
<div class="calc-card"><div class="calc-card-title">Service account</div><div class="calc-card-body">Identity for the running container; no human password.</div></div>
<div class="calc-card"><div class="calc-card-title">Role / policy</div><div class="calc-card-body">Resource × action × condition. Attach to user or SA.</div></div>
<div class="calc-card"><div class="calc-card-title">Boundary</div><div class="calc-card-body">Cap that limits even admins; great for shared accounts.</div></div>
</div>
<p class="l-text">For an ML service you typically grant: read access to the model bucket, write access to a logs bucket, decrypt on a KMS key, and nothing else.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. AWS: Push Model + Deploy</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># 1) upload artifact to S3</span>
aws s3 cp models/churn.joblib s3://my-models/churn/<span class="num"><span class="num">1.2.0</span></span>/churn.joblib

<span class="cm"><span class="cm"># 2) push container to ECR</span>
aws ecr get-login-password | docker login --username AWS --password-stdin <span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com
docker tag myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span> <span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com/churn-api:<span class="num"><span class="num">1.2.0</span>
docker push <span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com/churn-api:<span class="num"><span class="num">1.2.0</span>

<span class="cm"><span class="cm"># 3) deploy to ECS Fargate (task def already created)</span>
aws ecs update-service --cluster prod --service churn-api \
  --force-new-deployment

<span class="cm"><span class="cm"># 4) or SageMaker real-time endpoint</span>
aws sagemaker create-model --model-name churn-<span class="num"><span class="num">1</span></span>-<span class="num"><span class="num">2</span></span>-<span class="num"><span class="num">0</span></span> \
  --primary-container Image=<span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com/churn-api:<span class="num"><span class="num">1.2.0</span>
aws sagemaker create-endpoint-config --endpoint-config-name churn-cfg \
  --production-variants VariantName=v1,ModelName=churn-<span class="num"><span class="num">1</span></span>-<span class="num"><span class="num">2</span></span>-<span class="num"><span class="num">0</span></span>,InitialInstanceCount=<span class="num"><span class="num">2</span></span>,InstanceType=ml.m5.large
aws sagemaker create-endpoint --endpoint-name churn --endpoint-config-name churn-cfg</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>aws s3 cp models/churn.joblib s3://...</code> uploads the artifact to an S3 bucket — the URI becomes the <em>model URL</em>. 2) <code>aws ecr get-login-password | docker login</code> authenticates the local Docker daemon against AWS Elastic Container Registry. 3) <code>docker build</code> + <code>docker push</code> ship the image to ECR. 4) <code>aws ecs update-service --force-new-deployment</code> triggers a rolling deploy on the Fargate task — old tasks drain, new tasks start. 5) The combination (S3 artifact + ECR image + ECS task definition referencing both) is the standard AWS recipe for stateless ML inference at scale.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. GCP: Cloud Run in Three Lines</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># Build &amp; push to Artifact Registry</span>
gcloud builds submit --tag europe-west1-docker.pkg.dev/my-project/ml/churn-api:<span class="num"><span class="num">1.2.0</span>

<span class="cm"><span class="cm"># Deploy serverless container — autoscale 0..N</span>
gcloud run deploy churn-api \
  --image europe-west1-docker.pkg.dev/my-project/ml/churn-api:<span class="num"><span class="num">1.2.0</span></span> \
  --region europe-west1 \
  --memory <span class="num"><span class="num">1</span></span>Gi --cpu <span class="num"><span class="num">1</span></span> \
  --concurrency <span class="num"><span class="num">40</span></span> --<span class="ty"><span class="ty">max</span></span>-instances <span class="num"><span class="num">20</span></span> \
  --<span class="ty"><span class="ty">set</span></span>-env-<span class="ty"><span class="ty">vars</span></span> MODEL_VERSION=<span class="num"><span class="num">1.2.0</span></span> \
  --service-account churn-api<span class="at"><span class="at">@my</span></span>-project.iam.gserviceaccount.com</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>gcloud builds submit --tag gcr.io/PROJECT/churn-api:1.2.0</code> uses Cloud Build to compile your Dockerfile remotely and push the image to Artifact Registry — no local Docker daemon required. 2) <code>gcloud run deploy churn-api --image ... --region europe-west1 --allow-unauthenticated</code> creates (or updates) a Cloud Run service. 3) Cloud Run scales the container <em>to zero</em> when idle and bills per request — perfect for spiky inference. 4) <code>--memory 2Gi --cpu 2</code> sets resource limits. 5) The output URL <code>https://churn-api-xyz.run.app</code> is immediately HTTPS-served with auto-renewing certificates — three commands, prod-ready endpoint.</p>
<p class="l-text">Vertex AI counterpart: <code>gcloud ai endpoints deploy-model</code> for managed monitoring + traffic splitting.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Azure: Container Apps</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>az acr build --registry myreg --image churn-api:<span class="num"><span class="num">1.2.0</span></span> .

az containerapp create -n churn-api -g rg-ml \
  --image myreg.azurecr.io/churn-api:<span class="num"><span class="num">1.2.0</span></span> \
  --target-port <span class="num"><span class="num">8000</span></span> --ingress external \
  --<span class="ty"><span class="ty">min</span></span>-replicas <span class="num"><span class="num">1</span></span> --<span class="ty"><span class="ty">max</span></span>-replicas <span class="num"><span class="num">10</span></span> \
  --env-<span class="ty"><span class="ty">vars</span></span> MODEL_VERSION=<span class="num"><span class="num">1.2.0</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>az acr build --registry myreg --image churn-api:1.2.0 .</code> uses Azure Container Registry tasks to build remotely (no local Docker needed). 2) <code>az containerapp create --image myreg.azurecr.io/...</code> provisions an Azure Container App backed by your image. 3) <code>--min-replicas 0 --max-replicas 10</code> enables scale-to-zero and autoscaling — same economics as Cloud Run. 4) <code>--ingress external</code> exposes a public HTTPS endpoint with an auto-issued certificate. 5) Azure Container Apps run on Kubernetes underneath but hide the YAML — same operational model as Cloud Run / Fargate, different vendor.</p>
<p class="l-text">For full ML platform features (training, registry, endpoints) use Azure ML Studio; the SDK looks similar to SageMaker.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Cost Reality Check</h2>
<div id="mlops-l7-graph-en" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Approximate monthly cost ($) for 100 RPS sustained over a month, comparing serverless vs always-on vs managed ML endpoint. Numbers are rough orders of magnitude.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>Three families: VMs, container platforms, managed ML endpoints — pick by traffic shape and team skills.</li>
<li>Use serverless containers (Cloud Run / App Runner) for spiky traffic; always-on Fargate/GKE for steady.</li>
<li>Managed ML (SageMaker / Vertex / Azure ML) trades flexibility for built-in registry + monitoring.</li>
<li>Lock IAM to least privilege: a service account that can only read the model bucket and write logs.</li>
<li>Estimate cost with realistic RPS — managed endpoints cost 3-5× containers at the same throughput.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l7-graph-en', [{
    x:['Cloud Run','App Runner','ECS Fargate','GKE always-on','SageMaker RT'],
    y:[160, 210, 380, 420, 1100], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'Approx monthly $ at ~100 RPS (illustrative)',
    yaxis:{title:'USD / month'}, margin:{t:60,r:30,b:60,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> "buluta dağıt" cümlesi onlarca seçimi gizler. EC2 vs Fargate vs Lambda vs SageMaker vs Cloud Run vs Vertex AI — yanlış seçin, ya bütçenin 10 katını yakar ya da ölçekte duvara çarparsınız.</p>
<p class="l-text">Bu derste AWS, GCP ve Azure'daki hesaplama taksonomisini haritalıyor, bir karar kuralı veriyor, IAM temellerinde geziyor ve iki dağıtım kabuğunu (S3 yükleme + Cloud Run deploy) demoluyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>VM, konteyner, serverless ve yönetilen ML'i AWS, GCP, Azure'da haritalayacaksın</li>
<li>QPS ve gecikmeye göre karar ağacıyla doğru hesaplama katmanını seçeceksin</li>
<li>S3'e dokunan çıkarım servisi için en az yetkili IAM rolleri uygulayacaksın</li>
<li>Konteynerli modeli shell komutlarıyla AWS ECR + Fargate'e dağıtacaksın</li>
<li>FastAPI imajını üç komutla GCP Cloud Run'a göndereceksin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Hesaplama Taksonomisi</h2>
<p class="l-text">Üç dik eksen: ne kadar yönetiyorsunuz, nasıl ölçekliyor, nasıl faturalanıyor.</p>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>VM</strong><br/>EC2, GCE, Azure VM. İşletim sistemini siz yönetirsiniz. Çalışma süresine göre saniye bazlı.</div><div class="calc-compare-cell"><strong>Konteyner, sıfıra ölçeklenen</strong><br/>Cloud Run, App Runner, Container Apps. Konteyneri verirsiniz; bulut 0→N otomatik ölçekler.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Konteyner, daima açık</strong><br/>ECS Fargate, GKE, AKS. Daima ≥1 replika. Öngörülebilir gecikme.</div><div class="calc-compare-cell"><strong>Sunucusuz fonksiyon</strong><br/>Lambda, Cloud Functions, Azure Functions. ZIP/konteyner, &lt;15 dk, soğuk başlangıç.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Yönetilen ML</strong><br/>SageMaker, Vertex AI, Azure ML. Endpoint, eğitim işi, registry yerleşik.</div><div class="calc-compare-cell"><strong>Batch</strong><br/>AWS Batch, Dataproc, Databricks. Uzun süreli eğitim / skor işleri.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Karar Ağacı</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Trafik dalgalı, gecikmeye toleranslı?</strong> → Cloud Run / App Runner. Sıfıra ölçeklenir, sadece istek başına ödersiniz.</div>
<div class="calc-step"><strong>Trafik düz, gecikme düşük olmalı?</strong> → ECS Fargate / GKE / AKS, 2-3 daima açık replika.</div>
<div class="calc-step"><strong>GPU çıkarımı, gerçek zamanlı?</strong> → SageMaker Real-Time / Vertex AI Endpoint / yönetilen Triton.</div>
<div class="calc-step"><strong>Tam kontrol / özel CUDA gerek?</strong> → EC2 / GCE, NVIDIA sürücü imajıyla.</div>
<div class="calc-step"><strong>Çok küçük istek hacmi, ucuz öncelikli?</strong> → Lambda konteyner imajı (model için Mountpoint S3 ile).</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tek Sayfada IAM</h2>
<p class="l-text">Bulut güvenliği en az ayrıcalıktır. Üç aktör: <em>kullanıcı</em> (siz), <em>servis hesabı</em> (yük), <em>rol</em> (izin torbası).</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Kullanıcı</div><div class="calc-card-body">İnsan; iş için rol üstlenir. MFA daima açık.</div></div>
<div class="calc-card"><div class="calc-card-title">Servis hesabı</div><div class="calc-card-body">Çalışan konteyner kimliği; insan parolası yok.</div></div>
<div class="calc-card"><div class="calc-card-title">Rol / politika</div><div class="calc-card-body">Kaynak × eylem × koşul. Kullanıcı veya SA'ya bağlanır.</div></div>
<div class="calc-card"><div class="calc-card-title">Sınır</div><div class="calc-card-body">Adminleri bile sınırlayan tavan; paylaşımlı hesaplar için.</div></div>
</div>
<p class="l-text">Bir ML servisi tipik olarak: model bucket okuma, log bucket yazma, KMS anahtarıyla decrypt — başka hiçbir şey alır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. AWS: Modeli Gönder + Dağıt</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># 1) artefaktı S3'e yükle</span>
aws s3 cp models/churn.joblib s3://my-models/churn/<span class="num"><span class="num">1.2.0</span></span>/churn.joblib

<span class="cm"><span class="cm"># 2) konteyneri ECR'a gönder</span>
aws ecr get-login-password | docker login --username AWS --password-stdin <span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com
docker tag myorg/churn-api:<span class="num"><span class="num">1.2.0</span></span> <span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com/churn-api:<span class="num"><span class="num">1.2.0</span>
docker push <span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com/churn-api:<span class="num"><span class="num">1.2.0</span>

<span class="cm"><span class="cm"># 3) ECS Fargate'e dağıt (task def hazır)</span>
aws ecs update-service --cluster prod --service churn-api \
  --force-new-deployment

<span class="cm"><span class="cm"># 4) ya da SageMaker gerçek zamanlı endpoint</span>
aws sagemaker create-model --model-name churn-<span class="num"><span class="num">1</span></span>-<span class="num"><span class="num">2</span></span>-<span class="num"><span class="num">0</span></span> \
  --primary-container Image=<span class="num"><span class="num">1234.</span></span>dkr.ecr.us-east-<span class="num"><span class="num">1.</span></span>amazonaws.com/churn-api:<span class="num"><span class="num">1.2.0</span>
aws sagemaker create-endpoint-config --endpoint-config-name churn-cfg \
  --production-variants VariantName=v1,ModelName=churn-<span class="num"><span class="num">1</span></span>-<span class="num"><span class="num">2</span></span>-<span class="num"><span class="num">0</span></span>,InitialInstanceCount=<span class="num"><span class="num">2</span></span>,InstanceType=ml.m5.large
aws sagemaker create-endpoint --endpoint-name churn --endpoint-config-name churn-cfg</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>aws s3 cp models/churn.joblib s3://...</code>, artefaktı bir S3 bucket'a yükler — URI <em>model URL</em> olur. 2) <code>aws ecr get-login-password | docker login</code>, yerel Docker daemon'ı AWS Elastic Container Registry'ye yetkilendirir. 3) <code>docker build</code> + <code>docker push</code> imajı ECR'a gönderir. 4) <code>aws ecs update-service --force-new-deployment</code>, Fargate görevi üzerinde rolling deploy başlatır — eski görevler boşaltılır, yenileri açılır. 5) Bu kombinasyon (S3 artefakt + ECR imaj + ikisini referans eden ECS task definition), ölçeklenebilir stateless ML çıkarımı için standart AWS reçetesidir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. GCP: Üç Satırda Cloud Run</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># Artifact Registry'ye build &amp; push</span>
gcloud builds submit --tag europe-west1-docker.pkg.dev/my-project/ml/churn-api:<span class="num"><span class="num">1.2.0</span>

<span class="cm"><span class="cm"># Sunucusuz konteyner dağıt — 0..N otomatik ölçek</span>
gcloud run deploy churn-api \
  --image europe-west1-docker.pkg.dev/my-project/ml/churn-api:<span class="num"><span class="num">1.2.0</span></span> \
  --region europe-west1 \
  --memory <span class="num"><span class="num">1</span></span>Gi --cpu <span class="num"><span class="num">1</span></span> \
  --concurrency <span class="num"><span class="num">40</span></span> --<span class="ty"><span class="ty">max</span></span>-instances <span class="num"><span class="num">20</span></span> \
  --<span class="ty"><span class="ty">set</span></span>-env-<span class="ty"><span class="ty">vars</span></span> MODEL_VERSION=<span class="num"><span class="num">1.2.0</span></span> \
  --service-account churn-api<span class="at"><span class="at">@my</span></span>-project.iam.gserviceaccount.com</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>gcloud builds submit --tag gcr.io/PROJECT/churn-api:1.2.0</code>, Cloud Build kullanarak Dockerfile'ınızı uzaktan derler ve Artifact Registry'ye iter — yerel Docker daemon gerekmez. 2) <code>gcloud run deploy churn-api --image ... --region europe-west1 --allow-unauthenticated</code>, bir Cloud Run servisi oluşturur (ya da günceller). 3) Cloud Run, boş kaldığında konteyneri <em>sıfıra</em> indirir ve istek başına ücretlendirir — ani trafik için ideal. 4) <code>--memory 2Gi --cpu 2</code> kaynak limitlerini belirler. 5) Çıktıdaki <code>https://churn-api-xyz.run.app</code> URL'i otomatik yenilenen sertifikalarla anında HTTPS servisi verir — üç komut, üretime hazır uç.</p>
<p class="l-text">Vertex AI muadili: yönetilen izleme + trafik bölme için <code>gcloud ai endpoints deploy-model</code>.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Azure: Container Apps</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>az acr build --registry myreg --image churn-api:<span class="num"><span class="num">1.2.0</span></span> .

az containerapp create -n churn-api -g rg-ml \
  --image myreg.azurecr.io/churn-api:<span class="num"><span class="num">1.2.0</span></span> \
  --target-port <span class="num"><span class="num">8000</span></span> --ingress external \
  --<span class="ty"><span class="ty">min</span></span>-replicas <span class="num"><span class="num">1</span></span> --<span class="ty"><span class="ty">max</span></span>-replicas <span class="num"><span class="num">10</span></span> \
  --env-<span class="ty"><span class="ty">vars</span></span> MODEL_VERSION=<span class="num"><span class="num">1.2.0</span></span></code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>az acr build --registry myreg --image churn-api:1.2.0 .</code>, Azure Container Registry görevleriyle uzakta build eder (yerel Docker gerekmez). 2) <code>az containerapp create --image myreg.azurecr.io/...</code>, imajınızla bir Azure Container App provision eder. 3) <code>--min-replicas 0 --max-replicas 10</code> scale-to-zero ve otomatik ölçeklemeyi açar — Cloud Run ile aynı ekonomi. 4) <code>--ingress external</code>, otomatik sertifika ile public HTTPS uç açar. 5) Azure Container Apps altta Kubernetes'te koşar ama YAML'i gizler — Cloud Run / Fargate ile aynı operasyonel model, farklı sağlayıcı.</p>
<p class="l-text">Tam ML platformu (eğitim, registry, endpoint) için Azure ML Studio; SDK SageMaker'a benzer.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Maliyet Gerçeği</h2>
<div id="mlops-l7-graph-tr" style="height:380px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Bir ay boyunca sürekli 100 RPS için yaklaşık aylık maliyet ($) — sunucusuz vs daima açık vs yönetilen ML endpoint. Sayılar büyüklük mertebesi.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>Üç aile: VM'ler, konteyner platformları, yönetilen ML endpoint'leri — trafiğe ve takım yetkinliğine göre seçin.</li>
<li>Dalgalı trafik için sunucusuz konteyner (Cloud Run / App Runner); sabit trafik için daima açık Fargate/GKE.</li>
<li>Yönetilen ML (SageMaker / Vertex / Azure ML) esneklikten ödün verir, registry + izlemeyi hediye eder.</li>
<li>IAM'i en az ayrıcalığa kilitleyin: yalnızca model bucket'ı okuyup log yazabilen servis hesabı.</li>
<li>Maliyeti gerçekçi RPS ile tahmin edin — yönetilen endpoint'ler aynı verimde konteynerlere kıyasla 3-5× pahalı.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l7-graph-tr', [{
    x:['Cloud Run','App Runner','ECS Fargate','GKE daima','SageMaker RT'],
    y:[160, 210, 380, 420, 1100], type:'bar', marker:{color:accent}
  }], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text},
    title:'~100 RPS\\'te yaklaşık aylık $ (örnek)',
    yaxis:{title:'USD / ay'}, margin:{t:60,r:30,b:60,l:60}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
