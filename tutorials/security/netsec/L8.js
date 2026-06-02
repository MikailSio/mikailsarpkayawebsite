window.NETSEC_L8 = {
en: `<p class="l-text">On 19 July 2019 a former AWS engineer named Paige Thompson exfiltrated 106 million Capital One customer records — names, addresses, credit scores, ~140k Social Security numbers — from an S3 bucket. The breach exploited a Server-Side Request Forgery (SSRF) vulnerability in a misconfigured AWS WAF that let her query the EC2 instance metadata service (IMDSv1) for the role's temporary credentials, then use those credentials to read S3. Capital One paid $190M in settlements. The post-mortem became a syllabus item: it was not a single bug but a chain — IAM role with too-broad <code>S3:ListBucket</code>, IMDSv1 enabled, WAF SSRF unfiltered, S3 logging incomplete. Cloud security in one sentence: <em>most breaches are configuration, not code</em>.</p>
<p class="l-text">This lesson maps the modern cloud security stack. <em>Identity</em>: AWS IAM, Azure Entra ID, GCP IAM, role-based and attribute-based policies, the principle of least privilege. <em>Encryption</em>: KMS, envelope encryption, customer-managed keys (CMEK), HSM-backed keys. <em>Detection</em>: GuardDuty, Defender for Cloud, Chronicle. <em>Posture</em>: CSPM tools (Wiz, Prisma Cloud, Orca) that continuously scan for misconfigurations. <em>Workload protection</em>: CWPP scanning containers and VMs at runtime. <em>Shared responsibility</em>: knowing exactly what the provider secures and what you secure. We close with a runnable IAM policy parser + sklearn-trained anomaly detector on policy actions.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The shared responsibility model and what each cloud actually secures</li>
<li>AWS / Azure / GCP IAM — RBAC vs ABAC, policy structure, common pitfalls</li>
<li>KMS and envelope encryption — how cloud encryption actually works</li>
<li>The Capital One 2019 breach in detail and the IMDSv2 mitigation</li>
<li>CSPM and CWPP — continuous posture and workload protection</li>
<li>Building an IAM policy anomaly detector in scikit-learn</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Shared Responsibility Model</h2>
<p class="l-text">Cloud providers secure the cloud; customers secure what runs in it. The line moves with service abstraction.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IaaS (EC2, GCE)</div><div class="card-body">Provider: hypervisor, network, hardware. You: OS, runtime, app, data, IAM. Most surface area.</div></div>
<div class="calc-card"><div class="card-title">PaaS (App Engine)</div><div class="card-body">Provider: runtime + OS. You: app code, data, IAM. Smaller surface.</div></div>
<div class="calc-card"><div class="card-title">SaaS (Workspace)</div><div class="card-body">Provider: full stack. You: identities, data classification, sharing controls.</div></div>
<div class="calc-card"><div class="card-title">Serverless (Lambda)</div><div class="card-body">Provider: runtime. You: code, IAM role permissions, secrets.</div></div>
</div>
<p class="l-text">The IAM layer — identities, roles, policies — is <em>always</em> your responsibility. Most breaches live there.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. AWS IAM — RBAC and ABAC</h2>
<p class="l-text">AWS IAM expresses authorization as JSON policies attached to identities or resources. The policy evaluates a request via four-tuple {Principal, Action, Resource, Condition} and returns Allow / Deny / NoMatch. RBAC = roles. ABAC = roles parameterized by tags (e.g. <code>Project=alpha</code> on identity matches <code>Project=alpha</code> on resource).</p>
<div class="code-wrap"><div class="code-label"><span>JSON — IAM POLICY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject","s3:PutObject"],
    "Resource": "arn:aws:s3:::reports/\${aws:username}/*",
    "Condition": {
      "StringEquals": {"aws:RequestedRegion": "eu-west-1"},
      "Bool": {"aws:MultiFactorAuthPresent": "true"}
    }
  }]
}
</code></pre></div>
<p class="l-text">Best practices: deny by default, use SCPs at the org level, prefer Roles over Users, never use wildcard <code>"Action":"*"</code> on production accounts, enable IAM Access Analyzer.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Building an IAM Policy Anomaly Detector</h2>
<p class="l-text">CloudTrail logs every API call. We build an sklearn-trained classifier that learns each principal's normal action distribution and flags rare combinations.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">CloudTrail-style IAM action anomaly detection — JSON parser + IsolationForest</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, numpy as np, pandas as pd
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.ensemble import IsolationForest

# Synthetic CloudTrail log
events = [
    {"user":"alice","action":"s3:GetObject",      "region":"us-east-1","mfa":True},
    {"user":"alice","action":"s3:GetObject",      "region":"us-east-1","mfa":True},
    {"user":"alice","action":"s3:ListBucket",     "region":"us-east-1","mfa":True},
    {"user":"bob",  "action":"ec2:DescribeInstances","region":"us-east-1","mfa":True},
    {"user":"bob",  "action":"ec2:RunInstances",  "region":"us-east-1","mfa":True},
    {"user":"bob",  "action":"iam:CreateUser",    "region":"us-east-1","mfa":False},   # rare!
    {"user":"alice","action":"s3:GetObject",      "region":"us-east-1","mfa":True},
    {"user":"alice","action":"iam:AttachRolePolicy","region":"eu-west-1","mfa":False}, # rare!
] * 10

df = pd.DataFrame(events)
df['feat'] = df['user'] + '|' + df['action'] + '|' + df['region'] + '|' + df['mfa'].astype(str)
vec = HashingVectorizer(n_features=64, alternate_sign=False)
X = vec.transform(df['feat']).toarray()

iso = IsolationForest(contamination=0.08, random_state=0).fit(X)
df['anomaly'] = (iso.predict(X) == -1).astype(int)
print(df[df['anomaly']==1].drop_duplicates('feat')[['user','action','region','mfa']].to_string())
</code></pre></div>
</div>
<p class="l-text">The model flags Bob creating IAM users without MFA and Alice attaching role policies in a new region — exactly the breach precursors.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. KMS and Envelope Encryption</h2>
<p class="l-text">Cloud KMS (AWS, GCP, Azure Key Vault) holds master keys (CMKs) inside FIPS 140-2 Level 3 HSMs. Apps don't get the master key — they get a Data Encryption Key (DEK) wrapped by the master. Envelope encryption: encrypt large data with DEK, encrypt DEK with CMK, store wrapped DEK alongside ciphertext. To decrypt: KMS unwraps DEK; app uses DEK locally. Crypto-shredding deletes data by deleting the wrap key.</p>
<div class="katex-block">$$\\text{ciphertext} = \\text{AES-GCM}(\\text{DEK}, \\text{plaintext}); \\quad \\text{wrapped} = \\text{KMS-Encrypt}(\\text{CMK}, \\text{DEK})$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (boto3 not in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import boto3, json
kms = boto3.client('kms', region_name='eu-west-1')
resp = kms.generate_data_key(KeyId='alias/customer-data', KeySpec='AES_256')
plain_dek = resp['Plaintext']                # used locally to encrypt
wrapped_dek = resp['CiphertextBlob']         # store with ciphertext
# ... encrypt data with plain_dek, then zero plain_dek from memory ...
unwrapped = kms.decrypt(CiphertextBlob=wrapped_dek)['Plaintext']
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>boto3.client('kms')</code> opens an authenticated channel to AWS KMS — every API call is logged in CloudTrail with the caller identity and the CMK ARN, giving you a complete audit trail of who unwrapped what and when. 2) <code>kms.generate_data_key(KeyId='alias/customer-data', KeySpec='AES_256')</code> returns the DEK in two forms: <code>Plaintext</code> for local <code>AES-GCM</code> encryption and <code>CiphertextBlob</code> (the DEK wrapped under the CMK) for persistence next to the ciphertext. 3) The application encrypts the payload with <code>plain_dek</code>, writes both <code>ciphertext</code> and <code>wrapped_dek</code> to storage, then zeroes <code>plain_dek</code> from memory — the CMK never leaves the HSM (FIPS 140-2 Level 3). 4) To read, the reverse: <code>kms.decrypt(CiphertextBlob=wrapped_dek)</code> returns the DEK, the app decrypts the payload, and crypto-shredding becomes trivial — delete the CMK and every <code>wrapped_dek</code> in the world is permanently unreadable.</p>

</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. The Capital One Breach Anatomy</h2>
<p class="l-text">Step by step. (1) Capital One ran a custom WAF on EC2. (2) WAF was vulnerable to SSRF — attacker requests forced the WAF to make outbound HTTP calls to arbitrary URLs. (3) Attacker pointed it at <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> — the EC2 instance metadata service (IMDSv1). (4) IMDSv1 returned the role's temporary AWS credentials over plain HTTP, no token required. (5) Attacker assumed those credentials and ran <code>s3:ListBucket</code>, <code>s3:GetObject</code> — they were over-permissioned. (6) ~30 GB exfiltrated.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">AWS responded with IMDSv2 (token-based, requires PUT first), made it default in November 2023. Now retrofitting any pre-2020 EC2 estate. The "shift left" lesson: attack one weak component, chain to the next, exfiltrate via standard APIs. Defense requires layered IAM least privilege and IMDSv2 + VPC endpoints + S3 access logging.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. CSPM — Cloud Security Posture Management</h2>
<p class="l-text">CSPM continuously scans cloud configuration for misconfigurations. Examples: public S3 bucket, security group 0.0.0.0/0 on port 22, RDS without encryption, IAM role with <code>iam:*</code>. Vendors: Wiz (acquired by Google 2025 for $32B), Palo Alto Prisma Cloud, Orca, Lacework. Open source: Prowler, ScoutSuite, CloudSploit, Steampipe + Powerpipe.</p>
<div class="code-wrap"><div class="code-label"><span>BASH — PROWLER SCAN</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Prowler — open source AWS / Azure / GCP CSPM
prowler aws --checks s3_bucket_public_access ec2_securitygroup_default_restrict_traffic
prowler aws --compliance cis_2.0_aws --output-formats html json
</code></pre></div>
<p class="l-text"><strong>What this code does, command by command:</strong> 1) <code>prowler aws --checks s3_bucket_public_access ec2_securitygroup_default_restrict_traffic</code> runs two targeted Prowler checks against your AWS account: it iterates all S3 buckets to detect public ACLs / policies and walks every default security group to confirm it blocks ingress and egress — both are CIS Foundations findings that have caused dozens of breaches. 2) Prowler uses your local AWS credentials (shared with the CLI) and calls read-only describe/list APIs — no resource is modified, but expect ~5 000 API calls for a mid-sized account. 3) <code>prowler aws --compliance cis_2.0_aws --output-formats html json</code> runs the full CIS AWS Foundations 2.0 benchmark (~70 controls) and emits both a human HTML report and a machine-parsable JSON for the SIEM. 4) In CI you wire the JSON output into a ticket creator (Jira, GitHub Issues) so every new failure becomes a ticket — CSPM is only useful when findings hit the dev backlog within hours, not quarters.</p>

</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. CWPP — Cloud Workload Protection</h2>
<p class="l-text">Where CSPM watches configuration, CWPP watches running workloads — VMs, containers, serverless functions. Vulnerability scanning, runtime behavioral detection, file integrity monitoring, anti-malware. Vendors: CrowdStrike Falcon, SentinelOne Singularity, Microsoft Defender for Cloud, Aqua, Sysdig. The container-specific runtime tooling (Falco, Tracee) is covered in lesson 9.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. S3 / Storage Misconfigurations</h2>
<p class="l-text">The most common cloud-leak vector. From Accenture (2017), Verizon (2017), Pentagon (2017), Pegasus Airlines (2022) — all leaked via public S3. AWS now blocks public access by default at the account level, but legacy buckets and IAM bypass paths remain. Three checklist items every audit must run: (1) Block Public Access enabled; (2) Default encryption (SSE-S3 or SSE-KMS); (3) Server access logging enabled to a separate audit account.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
# JSON schema validation: a minimal "secure S3 bucket" check
def audit_bucket(b):
    failures = []
    if not b.get('BlockPublicAccess'):
        failures.append('Public access not blocked')
    if not b.get('Encryption'):
        failures.append('No default encryption')
    if not b.get('Logging'):
        failures.append('No access logging')
    pol = b.get('Policy', {}).get('Statement', [])
    for s in pol:
        if s.get('Principal') == '*' and s.get('Effect') == 'Allow':
            failures.append(f"Public allow on {s.get('Action')}")
    return failures

bucket = {
    'Name': 'reports-prod',
    'BlockPublicAccess': False,
    'Encryption': True,
    'Logging': False,
    'Policy': {'Statement':[{'Principal':'*','Effect':'Allow','Action':'s3:GetObject'}]},
}
print("Failures:", audit_bucket(bucket))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>audit_bucket(b)</code> checks four hardening flags on a single S3 bucket dictionary: <code>BlockPublicAccess</code> (account-level setting introduced 2018), <code>Encryption</code> (SSE-S3 or SSE-KMS at-rest crypto), <code>Logging</code> (server access logs shipped to a separate audit account), and bucket Policy statements. 2) The policy loop walks every <code>Statement</code> and flags any <code>Principal: "*"</code> combined with <code>Effect: "Allow"</code> — that wildcard is the single configuration that turned Accenture, Verizon, and Pegasus Airlines into public-leak headlines. 3) In production you fetch the real values from <code>boto3.client('s3').get_public_access_block()</code>, <code>get_bucket_encryption()</code>, <code>get_bucket_logging()</code>, and <code>get_bucket_policy()</code> — the same shape, only the data source changes. 4) Add IAM bypass checks (cross-account roles with <code>s3:GetObject</code>), VPC endpoint enforcement, and Object Lock to make the bucket fully tamper-evident.</p>

</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Multi-Cloud and Compliance</h2>
<p class="l-text">Most enterprises now run on 2-3 clouds. Identity federation via OIDC/SAML; KMS bridging via HYOK (Hold Your Own Key); cross-cloud monitoring via SIEM (Splunk, Elastic, Sentinel) ingesting CloudTrail + Activity Logs + Audit Logs. Compliance frameworks: ISO 27017 (cloud-specific), SOC 2 Type II, FedRAMP (US Gov), C5 (Germany), ENS (Spain). Mapping CSPM findings to control IDs is now table stakes for any audit.</p>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. The Five-Question Cloud Security Audit</h2>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Are all admin actions MFA-required and audited to an immutable log in a separate account?</li>
<li>Is every encryption key customer-managed (CMK) with key rotation enabled?</li>
<li>Is IMDSv2 enforced and IAM roles scoped to least privilege via Access Analyzer?</li>
<li>Is CSPM running daily and feeding tickets into the dev backlog?</li>
<li>Is there a tested incident-response runbook for "credentials leaked on GitHub"?</li>
</ol>
<p class="l-text">If the answer is "no" to any of these in production, that is your top-priority remediation. Most cloud breaches map back to these five questions.</p>
</div>`,
tr: `<p class="l-text">19 Temmuz 2019'da Paige Thompson adlı eski bir AWS mühendisi 106 milyon Capital One müşteri kaydını — isimler, adresler, kredi skorları, ~140k Sosyal Güvenlik numarası — bir S3 kovasından sızdırdı. İhlal, yanlış yapılandırılmış bir AWS WAF'taki Server-Side Request Forgery (SSRF) zafiyetini sömürdü, bu onu rolün geçici kimlik bilgileri için EC2 instance metadata servisini (IMDSv1) sorgulamasına ve sonra o kimlik bilgilerini S3'ü okumak için kullanmasına izin verdi. Capital One uzlaşmalarda 190M$ ödedi. Ölüm-sonrası bir müfredat öğesi oldu: tek bir bug değil bir zincirdi — çok geniş <code>S3:ListBucket</code>'lı IAM rol, IMDSv1 etkin, WAF SSRF filtrelenmemiş, S3 logging eksik. Tek cümlede bulut güvenliği: <em>çoğu ihlal yapılandırmadır, kod değil</em>.</p>
<p class="l-text">Bu ders modern bulut güvenlik yığınını haritalar. <em>Kimlik</em>: AWS IAM, Azure Entra ID, GCP IAM, rol-tabanlı ve özellik-tabanlı politikalar, en az ayrıcalık ilkesi. <em>Şifreleme</em>: KMS, envelope encryption, müşteri-yönetimli anahtarlar (CMEK), HSM-destekli anahtarlar. <em>Tespit</em>: GuardDuty, Defender for Cloud, Chronicle. <em>Duruş</em>: yanlış yapılandırmalar için sürekli tarayan CSPM araçları (Wiz, Prisma Cloud, Orca). <em>İş yükü koruması</em>: çalışma zamanında container'lar ve VM'leri tarayan CWPP. <em>Paylaşılan sorumluluk</em>: sağlayıcının neyi koruduğunu ve senin neyi koruduğunu tam olarak bilmek. Politika eylemlerinde sklearn-eğitilmiş anomali dedektörü olan çalıştırılabilir bir IAM politika ayrıştırıcısıyla kapatıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Paylaşılan sorumluluk modeli ve her bulutun gerçekte neyi koruduğu</li>
<li>AWS / Azure / GCP IAM — RBAC vs ABAC, politika yapısı, yaygın tuzaklar</li>
<li>KMS ve envelope encryption — bulut şifrelemesinin gerçekte nasıl çalıştığı</li>
<li>Detayda Capital One 2019 ihlali ve IMDSv2 hafifletmesi</li>
<li>CSPM ve CWPP — sürekli duruş ve iş yükü koruması</li>
<li>scikit-learn'de bir IAM politika anomali dedektörü inşa etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Paylaşılan Sorumluluk Modeli</h2>
<p class="l-text">Bulut sağlayıcılar bulutu korur; müşteriler içinde çalışanı korur. Çizgi servis soyutlamasıyla hareket eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IaaS (EC2, GCE)</div><div class="card-body">Sağlayıcı: hipervizör, ağ, donanım. Sen: OS, runtime, app, veri, IAM. En çok yüzey alanı.</div></div>
<div class="calc-card"><div class="card-title">PaaS (App Engine)</div><div class="card-body">Sağlayıcı: runtime + OS. Sen: app kodu, veri, IAM. Daha küçük yüzey.</div></div>
<div class="calc-card"><div class="card-title">SaaS (Workspace)</div><div class="card-body">Sağlayıcı: tam yığın. Sen: kimlikler, veri sınıflandırması, paylaşım kontrolleri.</div></div>
<div class="calc-card"><div class="card-title">Serverless (Lambda)</div><div class="card-body">Sağlayıcı: runtime. Sen: kod, IAM rol izinleri, sırlar.</div></div>
</div>
<p class="l-text">IAM katmanı — kimlikler, roller, politikalar — <em>her zaman</em> senin sorumluluğundur. Çoğu ihlal orada yaşar.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. AWS IAM — RBAC ve ABAC</h2>
<p class="l-text">AWS IAM yetkilendirmeyi kimliklere veya kaynaklara eklenen JSON politikaları olarak ifade eder. Politika bir isteği dört-tüp {Principal, Action, Resource, Condition} ile değerlendirir ve Allow / Deny / NoMatch döner. RBAC = roller. ABAC = tag'lerle parametrize edilmiş roller (örn. kimlikteki <code>Project=alpha</code> kaynaktaki <code>Project=alpha</code> ile eşleşir).</p>
<div class="code-wrap"><div class="code-label"><span>JSON — IAM POLICY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject","s3:PutObject"],
    "Resource": "arn:aws:s3:::reports/\${aws:username}/*",
    "Condition": {
      "StringEquals": {"aws:RequestedRegion": "eu-west-1"},
      "Bool": {"aws:MultiFactorAuthPresent": "true"}
    }
  }]
}
</code></pre></div>
<p class="l-text">En iyi uygulamalar: varsayılan reddet, org düzeyinde SCP'leri kullan, User'lar yerine Role'leri tercih et, üretim hesaplarında asla wildcard <code>"Action":"*"</code> kullanma, IAM Access Analyzer'ı etkinleştir.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Bir IAM Politika Anomali Dedektörü İnşa Etmek</h2>
<p class="l-text">CloudTrail her API çağrısını loglar. Her principal'ın normal eylem dağılımını öğrenen ve nadir kombinasyonları işaretleyen bir sklearn-eğitilmiş sınıflandırıcı inşa ediyoruz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">CloudTrail-tarzı IAM eylem anomali tespiti — JSON ayrıştırıcı + IsolationForest</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, numpy as np, pandas as pd
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.ensemble import IsolationForest

# Sentetik CloudTrail logu
events = [
    {"user":"alice","action":"s3:GetObject",      "region":"us-east-1","mfa":True},
    {"user":"alice","action":"s3:GetObject",      "region":"us-east-1","mfa":True},
    {"user":"alice","action":"s3:ListBucket",     "region":"us-east-1","mfa":True},
    {"user":"bob",  "action":"ec2:DescribeInstances","region":"us-east-1","mfa":True},
    {"user":"bob",  "action":"ec2:RunInstances",  "region":"us-east-1","mfa":True},
    {"user":"bob",  "action":"iam:CreateUser",    "region":"us-east-1","mfa":False},   # nadir!
    {"user":"alice","action":"s3:GetObject",      "region":"us-east-1","mfa":True},
    {"user":"alice","action":"iam:AttachRolePolicy","region":"eu-west-1","mfa":False}, # nadir!
] * 10

df = pd.DataFrame(events)
df['feat'] = df['user'] + '|' + df['action'] + '|' + df['region'] + '|' + df['mfa'].astype(str)
vec = HashingVectorizer(n_features=64, alternate_sign=False)
X = vec.transform(df['feat']).toarray()

iso = IsolationForest(contamination=0.08, random_state=0).fit(X)
df['anomaly'] = (iso.predict(X) == -1).astype(int)
print(df[df['anomaly']==1].drop_duplicates('feat')[['user','action','region','mfa']].to_string())
</code></pre></div>
</div>
<p class="l-text">Model Bob'un MFA olmadan IAM kullanıcı oluşturmasını ve Alice'in yeni bir bölgede rol politikaları eklemesini işaretler — tam olarak ihlal öncülleri.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. KMS ve Envelope Encryption</h2>
<p class="l-text">Bulut KMS (AWS, GCP, Azure Key Vault) FIPS 140-2 Level 3 HSM içinde master anahtarlar (CMK) tutar. Uygulamalar master anahtarı almaz — master tarafından sarılmış bir Data Encryption Key (DEK) alır. Envelope encryption: DEK ile büyük veriyi şifrele, CMK ile DEK'i şifrele, sarılmış DEK'i ciphertext yanında sakla. Çözmek için: KMS DEK'i çözer; uygulama DEK'i yerel olarak kullanır. Crypto-shredding wrap anahtarını silerek veriyi siler.</p>
<div class="katex-block">$$\\text{ciphertext} = \\text{AES-GCM}(\\text{DEK}, \\text{plaintext}); \\quad \\text{wrapped} = \\text{KMS-Encrypt}(\\text{CMK}, \\text{DEK})$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (boto3 Pyodide'de yok)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import boto3, json
kms = boto3.client('kms', region_name='eu-west-1')
resp = kms.generate_data_key(KeyId='alias/customer-data', KeySpec='AES_256')
plain_dek = resp['Plaintext']                # şifrelemek için yerel kullanılır
wrapped_dek = resp['CiphertextBlob']         # ciphertext ile sakla
# ... veriyi plain_dek ile şifrele, sonra plain_dek'i bellekten sıfırla ...
unwrapped = kms.decrypt(CiphertextBlob=wrapped_dek)['Plaintext']
</code></pre></div>
<p class="l-text"><strong>Akış adım adım:</strong> 1) <code>boto3.client('kms')</code> AWS KMS'ye kimlik doğrulamalı bir kanal açar — her API çağrısı CloudTrail'e çağrıyı yapan kimlik ve CMK ARN'si ile loglanır; kimin neyi ne zaman açtığının tam bir denetim izi oluşur. 2) <code>kms.generate_data_key(KeyId='alias/customer-data', KeySpec='AES_256')</code> DEK'i iki formda döner: yerel <code>AES-GCM</code> şifrelemesi için <code>Plaintext</code> ve ciphertext yanında saklanacak <code>CiphertextBlob</code> (CMK altında sarılmış DEK). 3) Uygulama yükü <code>plain_dek</code> ile şifreler, hem <code>ciphertext</code> hem de <code>wrapped_dek</code>'i depoya yazar, sonra <code>plain_dek</code>'i bellekten sıfırlar — CMK HSM'i (FIPS 140-2 Level 3) hiç terk etmez. 4) Okuma için tersi: <code>kms.decrypt(CiphertextBlob=wrapped_dek)</code> DEK'i döner, uygulama yükü çözer ve crypto-shredding önemsiz hale gelir — CMK'yi sil, dünyadaki her <code>wrapped_dek</code> kalıcı olarak okunamaz olur.</p>

</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Capital One İhlal Anatomisi</h2>
<p class="l-text">Adım adım. (1) Capital One EC2'de özel bir WAF çalıştırdı. (2) WAF SSRF'ye karşı kırılgandı — saldırgan istekleri WAF'ı keyfi URL'lere giden HTTP çağrıları yapmaya zorladı. (3) Saldırgan onu <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code>'e yöneltti — EC2 instance metadata servisi (IMDSv1). (4) IMDSv1 rolün geçici AWS kimlik bilgilerini düz HTTP üzerinden, token gerekmeden döndürdü. (5) Saldırgan o kimlik bilgilerini varsaydı ve <code>s3:ListBucket</code>, <code>s3:GetObject</code> çalıştırdı — aşırı izinliydiler. (6) ~30 GB sızdırıldı.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">AWS IMDSv2 ile yanıt verdi (token-tabanlı, önce PUT gerektirir), Kasım 2023'te varsayılan yaptı. Şimdi 2020 öncesi herhangi bir EC2 mülkünü retrofit ediyor. "Shift left" dersi: bir zayıf bileşene saldır, sonrakine zincirle, standart API'ler yoluyla sızdır. Savunma katmanlı IAM en az ayrıcalık ve IMDSv2 + VPC endpoint'leri + S3 erişim logging gerektirir.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. CSPM — Bulut Güvenlik Duruşu Yönetimi</h2>
<p class="l-text">CSPM bulut yapılandırmasını sürekli yanlış yapılandırmalar için tarar. Örnekler: kamuya açık S3 kovası, port 22'de 0.0.0.0/0 security group, şifresiz RDS, <code>iam:*</code> ile IAM rol. Satıcılar: Wiz (Google tarafından 2025'te 32B$'a satın alındı), Palo Alto Prisma Cloud, Orca, Lacework. Açık kaynak: Prowler, ScoutSuite, CloudSploit, Steampipe + Powerpipe.</p>
<div class="code-wrap"><div class="code-label"><span>BASH — PROWLER SCAN</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Prowler — açık kaynak AWS / Azure / GCP CSPM
prowler aws --checks s3_bucket_public_access ec2_securitygroup_default_restrict_traffic
prowler aws --compliance cis_2.0_aws --output-formats html json
</code></pre></div>
<p class="l-text"><strong>Komut komut okuyalım:</strong> 1) <code>prowler aws --checks s3_bucket_public_access ec2_securitygroup_default_restrict_traffic</code> AWS hesabınıza karşı iki hedefli Prowler kontrolü çalıştırır: tüm S3 kovalarını gezerek public ACL/policy'leri tespit eder ve her default security group'un ingress/egress'i engellediğini doğrular — her ikisi de düzinelerce ihlale yol açmış CIS Foundations bulgularıdır. 2) Prowler yerel AWS credential'larınızı (CLI ile paylaşılan) kullanır ve yalnızca okuma yapan describe/list API'larını çağırır — hiçbir kaynak değişmez ama orta ölçekli bir hesap için ~5 000 API çağrısı bekleyin. 3) <code>prowler aws --compliance cis_2.0_aws --output-formats html json</code> tam CIS AWS Foundations 2.0 benchmark'ı (~70 kontrol) çalıştırır ve hem insan-okur HTML raporu hem de SIEM için makine-parse'lı JSON üretir. 4) CI'da JSON çıktısını bir ticket oluşturucuya (Jira, GitHub Issues) bağlarsınız — her yeni bulgu otomatik ticket olur; CSPM ancak bulgular saatler içinde (çeyrekler değil) dev backlog'a düştüğünde kullanışlıdır.</p>

</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. CWPP — Bulut İş Yükü Koruması</h2>
<p class="l-text">CSPM yapılandırmayı izlerken, CWPP çalışan iş yüklerini izler — VM'ler, container'lar, serverless fonksiyonlar. Zafiyet tarama, çalışma zamanı davranışsal tespit, dosya bütünlüğü izleme, anti-malware. Satıcılar: CrowdStrike Falcon, SentinelOne Singularity, Microsoft Defender for Cloud, Aqua, Sysdig. Container-spesifik çalışma zamanı araç seti (Falco, Tracee) ders 9'da kapsanır.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. S3 / Depolama Yanlış Yapılandırmaları</h2>
<p class="l-text">En yaygın bulut-sızıntı vektörü. Accenture (2017), Verizon (2017), Pentagon (2017), Pegasus Airlines (2022) — hepsi kamuya açık S3 yoluyla sızdı. AWS artık varsayılan olarak hesap düzeyinde kamu erişimini engeller, ama eski kovalar ve IAM atlatma yolları kalır. Her denetimin çalıştırması gereken üç checklist öğesi: (1) Block Public Access etkin; (2) Varsayılan şifreleme (SSE-S3 veya SSE-KMS); (3) Sunucu erişim logging ayrı bir denetim hesabına etkin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
# JSON şema doğrulama: minimal bir "güvenli S3 kovası" kontrolü
def audit_bucket(b):
    failures = []
    if not b.get('BlockPublicAccess'):
        failures.append('Public access not blocked')
    if not b.get('Encryption'):
        failures.append('No default encryption')
    if not b.get('Logging'):
        failures.append('No access logging')
    pol = b.get('Policy', {}).get('Statement', [])
    for s in pol:
        if s.get('Principal') == '*' and s.get('Effect') == 'Allow':
            failures.append(f"Public allow on {s.get('Action')}")
    return failures

bucket = {
    'Name': 'reports-prod',
    'BlockPublicAccess': False,
    'Encryption': True,
    'Logging': False,
    'Policy': {'Statement':[{'Principal':'*','Effect':'Allow','Action':'s3:GetObject'}]},
}
print("Failures:", audit_bucket(bucket))
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>audit_bucket(b)</code> tek bir S3 kovası sözlüğünde dört sertleştirme bayrağını kontrol eder: <code>BlockPublicAccess</code> (2018'de tanıtılan hesap düzeyi ayar), <code>Encryption</code> (SSE-S3 veya SSE-KMS at-rest şifreleme), <code>Logging</code> (ayrı bir denetim hesabına gönderilen server access log'ları) ve bucket Policy ifadeleri. 2) Policy döngüsü her <code>Statement</code>'ı gezer ve <code>Effect: "Allow"</code> ile birlikte gelen herhangi bir <code>Principal: "*"</code> bayraklar — bu wildcard, Accenture, Verizon ve Pegasus Airlines'ı public-sızıntı manşetlerine çeviren tek konfigürasyondur. 3) Üretimde gerçek değerleri <code>boto3.client('s3').get_public_access_block()</code>, <code>get_bucket_encryption()</code>, <code>get_bucket_logging()</code> ve <code>get_bucket_policy()</code> ile alırsınız — aynı şekil, yalnızca veri kaynağı değişir. 4) IAM bypass kontrolleri (<code>s3:GetObject</code>'li cross-account roller), VPC endpoint zorunluluğu ve Object Lock ekleyin — kova tamamen tamper-evident olsun.</p>

</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Çoklu-Bulut ve Uyumluluk</h2>
<p class="l-text">Çoğu kurum artık 2-3 bulutta çalışır. OIDC/SAML yoluyla kimlik federasyonu; HYOK (Hold Your Own Key) yoluyla KMS köprüleme; CloudTrail + Activity Log + Audit Log alan SIEM (Splunk, Elastic, Sentinel) yoluyla bulutlar arası izleme. Uyumluluk çerçeveleri: ISO 27017 (bulut-spesifik), SOC 2 Type II, FedRAMP (US Gov), C5 (Almanya), ENS (İspanya). CSPM bulgularını kontrol ID'lerine eşlemek artık herhangi denetim için masa parasıdır.</p>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Beş-Soru Bulut Güvenlik Denetimi</h2>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Tüm admin eylemleri MFA-gerekli ve ayrı bir hesapta değiştirilemez bir loga denetlenmiş mi?</li>
<li>Her şifreleme anahtarı anahtar rotasyonu etkin müşteri-yönetimli (CMK) mi?</li>
<li>IMDSv2 zorunlu mu ve IAM rolleri Access Analyzer yoluyla en az ayrıcalığa kapsamlı mı?</li>
<li>CSPM günlük çalışıyor ve dev backlog'una ticket besliyor mu?</li>
<li>"GitHub'da kimlik bilgileri sızdırıldı" için test edilmiş bir olay-yanıt runbook'u var mı?</li>
</ol>
<p class="l-text">Üretimde bunlardan herhangi birine cevap "hayır" ise, bu en yüksek-öncelikli iyileştirmendir. Çoğu bulut ihlali bu beş soruya geri eşlenir.</p>
</div>`
};
