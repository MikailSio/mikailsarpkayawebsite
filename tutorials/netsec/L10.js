window.NETSEC_L10 = {
en: `<p class="l-text">In December 2009 a sophisticated APT (later attributed to China and dubbed "Operation Aurora") breached Google, Adobe, and ~30 other companies via spear-phishing + IE zero-day, then moved laterally inside trusted corporate networks for months. Google's response was unprecedented: rather than rebuild a stronger perimeter, they reorganized internal access on the assumption that the network is already hostile. By 2014 the result was named <em>BeyondCorp</em> (Ward &amp; Beyer, ;login: 2014): every internal request, from any employee anywhere on any network, was authenticated as if it came from the public internet. No VPN. No perimeter trust. Every access decision computed per-request against device posture, user identity, and resource sensitivity. BeyondCorp became the canonical reference for what NIST in 2020 codified as <em>Zero Trust Architecture</em> (SP 800-207).</p>
<p class="l-text">Zero Trust is not a product — it is a paradigm: <em>never trust, always verify, assume breach</em>. This capstone synthesizes everything in the track. Identity (lesson 8 IAM) becomes the new perimeter. Microsegmentation (lesson 5) replaces network zones. Continuous device posture (lesson 9 container hygiene + endpoint MDM) gates access. WAF and DDoS defenses (lessons 5-6) front the identity-aware proxy. Wireless and 5G (lesson 7) become just another untrusted access network. Cloud security (lesson 8) is the substrate. SASE (Secure Access Service Edge, Gartner 2019) is the cloud-delivered Zero Trust stack: ZTNA + SWG + CASB + FWaaS + SD-WAN. We close with a runnable Policy Decision Point in Python: an sklearn-trained risk scorer over identity + device + context features.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The Zero Trust paradigm — never trust, always verify, assume breach</li>
<li>Google BeyondCorp (2014) — the canonical reference architecture</li>
<li>NIST SP 800-207: PEP, PDP, PA, components and data sources</li>
<li>Identity-aware proxies (IAP) — Google IAP, Cloudflare Access, Tailscale</li>
<li>Microsegmentation as Zero Trust enforcement</li>
<li>SASE — convergence of network and security in the cloud</li>
<li>Building a Policy Decision Point with sklearn-trained risk model</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Why Zero Trust?</h2>
<p class="l-text">The perimeter model assumes the inside is trusted. Three forces broke it. (1) <em>Cloud</em>: workloads no longer live behind your firewall. (2) <em>Mobile / remote work</em>: users no longer live behind it either. (3) <em>Lateral movement</em>: every modern breach (Target 2013, Home Depot 2014, Equifax 2017, SolarWinds 2020) used legitimate credentials inside a trusted network. The fix: deny implicit network trust. Every connection authenticated, authorized, encrypted, and logged.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Never trust</div><div class="card-body">No implicit privilege from network location. VPN tunnel = same as public internet.</div></div>
<div class="calc-card"><div class="card-title">Always verify</div><div class="card-body">Per-request authentication. Identity, device posture, context evaluated each time.</div></div>
<div class="calc-card"><div class="card-title">Assume breach</div><div class="card-body">Plan as if attacker is already inside. Microsegment, log, alert, contain.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. NIST SP 800-207 Reference Architecture</h2>
<p class="l-text">Published August 2020 by Rose, Borchert, Mitchell, Connelly. Defines the canonical components.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PEP</div><div class="card-body">Policy Enforcement Point — the gateway in front of every resource. Enforces the decision.</div></div>
<div class="calc-card"><div class="card-title">PDP</div><div class="card-body">Policy Decision Point — evaluates the request against policy. Returns Allow / Deny / Step-up.</div></div>
<div class="calc-card"><div class="card-title">PA / PE</div><div class="card-body">Policy Administrator + Policy Engine. PE computes; PA tells PEP what to do.</div></div>
<div class="calc-card"><div class="card-title">Inputs</div><div class="card-body">Identity store, device posture (MDM), threat intel, SIEM, data classification, ICAM.</div></div>
</div>
<p class="l-text">The PDP is the brain. Every request becomes a question: "should this user, on this device, in this context, access this resource right now?" The runnable PDP in section 6 implements exactly this.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Google BeyondCorp — The Reference Story</h2>
<p class="l-text">BeyondCorp's published architecture (six papers, 2014-2018) details the migration.</p>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li><em>Trust Inferer</em>: continuously computes a tier (low/medium/high) per device from MDM + posture signals.</li>
<li><em>Access Proxy</em>: Google's front door for every internal app — SSO + device cert mTLS.</li>
<li><em>Device Inventory Service</em>: every laptop and phone enrolled, certificate-based identity.</li>
<li><em>Pipeline</em>: nightly recompute of all access tiers; per-request decision in milliseconds at the proxy.</li>
</ul>
<p class="l-text">No corporate VPN. Engineers in coffee shops accessed source repos exactly as engineers in the office did — through Access Proxy with device cert + 2FA.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Identity-Aware Proxies (IAP)</h2>
<p class="l-text">The PEP for HTTP. Sits in front of internal apps, terminates TLS, authenticates the user via OIDC, evaluates device posture, signs a JWT and forwards to the backend. Replaces VPN for web apps.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Google Cloud IAP</div><div class="card-body">GCP-native. Integrates with Workspace identity. App Engine, Compute Engine, on-prem via connector.</div></div>
<div class="calc-card"><div class="card-title">Cloudflare Access</div><div class="card-body">Edge-native. ZTNA on Cloudflare's anycast. Device posture via WARP client.</div></div>
<div class="calc-card"><div class="card-title">Tailscale</div><div class="card-body">WireGuard-based mesh. SSO + ACLs. Popular with startups and dev teams.</div></div>
<div class="calc-card"><div class="card-title">Zscaler ZPA</div><div class="card-body">Enterprise SASE</div><div class="card-body">Enterprise SASE leader. Per-application connectors, no inbound firewall changes.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Microsegmentation as Zero Trust Enforcement</h2>
<p class="l-text">Lesson 5 introduced microsegmentation. In Zero Trust it becomes the default. Every workload-to-workload connection has an explicit identity-based policy. Cilium with mTLS, NSX with tags, AWS Security Groups + VPC Lattice. The metric: <em>blast radius</em> of a compromised workload — ideally one VM, never a subnet.</p>
<div class="katex-block">$$\\text{access decision} = f(\\text{User} \\times \\text{Role} \\times \\text{Device} \\times \\text{Resource} \\times \\text{Context})$$</div>
<p class="l-text">RBAC is just one slice. Modern PDPs evaluate ABAC + risk score + behavioral baseline.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Building a Policy Decision Point</h2>
<p class="l-text">A PDP takes a request context and returns a decision. We train a logistic regression on synthetic access logs to learn what "normal" looks like, then score new requests as risk.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Zero Trust PDP — sklearn-trained risk scorer over identity + device + context</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
N = 2000
df = pd.DataFrame({
    'mfa':              rng.choice([0,1], N, p=[0.1,0.9]),
    'device_managed':   rng.choice([0,1], N, p=[0.2,0.8]),
    'os_patched':       rng.choice([0,1], N, p=[0.1,0.9]),
    'unusual_geo':      rng.choice([0,1], N, p=[0.95,0.05]),
    'sensitive_resource':rng.choice([0,1], N, p=[0.7,0.3]),
    'time_of_day':      rng.integers(0, 24, N),
    'failed_logins_24h':rng.poisson(0.3, N),
})
# Synthetic ground truth: deny if any 2 risk flags
risk = (1 - df['mfa']) + (1 - df['device_managed']) + (1 - df['os_patched']) \\
     + df['unusual_geo'] + (df['failed_logins_24h'] &gt; 2).astype(int)
df['allow'] = (risk &lt; 2).astype(int)

X = StandardScaler().fit_transform(df.drop('allow', axis=1).values)
y = df['allow'].values
clf = LogisticRegression(max_iter=200).fit(X, y)

def pdp_decision(req, threshold=0.4):
    feats = np.array([[req['mfa'], req['device_managed'], req['os_patched'],
                       req['unusual_geo'], req['sensitive_resource'],
                       req['time_of_day'], req['failed_logins_24h']]])
    score = clf.predict_proba(StandardScaler().fit(df.drop('allow',1).values).transform(feats))[0,1]
    decision = 'ALLOW' if score &gt; 0.7 else 'STEP_UP_MFA' if score &gt; threshold else 'DENY'
    return decision, round(float(score), 3)

reqs = [
    {'mfa':1,'device_managed':1,'os_patched':1,'unusual_geo':0,'sensitive_resource':1,'time_of_day':14,'failed_logins_24h':0},
    {'mfa':0,'device_managed':1,'os_patched':1,'unusual_geo':0,'sensitive_resource':0,'time_of_day':14,'failed_logins_24h':0},
    {'mfa':1,'device_managed':0,'os_patched':0,'unusual_geo':1,'sensitive_resource':1,'time_of_day':3, 'failed_logins_24h':5},
]
for r in reqs:
    print(r, '-&gt;', pdp_decision(r))
</code></pre></div>
</div>
<p class="l-text">A managed device with MFA at 2pm reading a sensitive doc: ALLOW. An unmanaged, unpatched device from an unusual geo at 3am with 5 failed logins: DENY. The middle case prompts step-up MFA. This is the Zero Trust decision pattern in 30 lines.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. SASE — Cloud-Delivered Zero Trust</h2>
<p class="l-text">Gartner coined SASE in 2019 (Secure Access Service Edge): merge networking (SD-WAN) with security (SWG, CASB, FWaaS, ZTNA) into a single cloud-delivered stack. Vendors: Zscaler, Palo Alto Prisma SASE, Cisco Umbrella, Cloudflare One, Netskope. SASE is the operational delivery model that makes Zero Trust feasible for an enterprise — no on-prem appliances, policy follows the user, telemetry centralized.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SWG</div><div class="card-body">Secure Web Gateway. Inspects user web traffic, blocks malware, enforces DLP.</div></div>
<div class="calc-card"><div class="card-title">CASB</div><div class="card-body">Cloud Access Security Broker. Visibility + control over SaaS (M365, Salesforce, Drive).</div></div>
<div class="calc-card"><div class="card-title">ZTNA</div><div class="card-body">Zero Trust Network Access. The IAP for all internal apps.</div></div>
<div class="calc-card"><div class="card-title">FWaaS</div><div class="card-body">Firewall as a Service. Cloud-delivered network filtering.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Implementation Playbook</h2>
<p class="l-text">Practical Zero Trust rollout in 6 phases.</p>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li><em>Identity unification</em>: single IdP (Entra ID, Okta, Google Workspace), MFA mandatory, phish-resistant (FIDO2).</li>
<li><em>Device inventory</em>: MDM (Intune, Jamf, Kandji) for every laptop. Posture signals: encryption, patch level, EDR running.</li>
<li><em>Inventory of apps</em>: catalog every internal service, classify by sensitivity. Rank by Zero Trust migration priority.</li>
<li><em>IAP for web apps</em>: front each app with Cloudflare Access / GCP IAP / ZPA. Retire VPN for web tier.</li>
<li><em>Microsegmentation east-west</em>: NetworkPolicy + service mesh mTLS for K8s, host firewalls for VMs.</li>
<li><em>Continuous monitoring</em>: SIEM ingest of all PEP logs; UEBA detects abnormal access; tie back to PDP for adaptive policy.</li>
</ol>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Reality check: full Zero Trust is a 3-5 year journey for any enterprise. Start with the highest-value targets — admin consoles, source repos, customer data stores. Migrate one service at a time. Measure blast radius reduction, not "Zero Trust maturity score". Tools change; the principles (least privilege, per-request auth, microsegmentation, log everything) do not.</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Track Synthesis</h2>
<p class="l-text">Zero Trust ties the whole netsec track together.</p>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Lessons 1-4 on cryptography, TLS, IDS, network protocols give you the verification primitives.</li>
<li>Lesson 5 (firewalls + microsegmentation) is the enforcement plane.</li>
<li>Lesson 6 (DDoS) protects the public-facing PEPs.</li>
<li>Lesson 7 (wireless / 5G) is "yet another untrusted network" under Zero Trust.</li>
<li>Lesson 8 (cloud) and 9 (containers) provide the substrate where most workloads live.</li>
<li>Lesson 10 (this one) is the policy and architecture that integrates them.</li>
</ul>
<p class="l-text">A defender today is not "the firewall person" or "the IAM person" — they are the Zero Trust architect, owning the full stack from identity to runtime to network to cloud. This track gave you that vocabulary.</p>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Further Reading</h2>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>NIST SP 800-207 (2020) — Zero Trust Architecture, free PDF.</li>
<li>Ward &amp; Beyer 2014, "BeyondCorp: A New Approach to Enterprise Security" — ;login: magazine.</li>
<li>Cunningham &amp; Holmes 2017, "The Zero Trust eXtended Ecosystem" — Forrester.</li>
<li>CISA Zero Trust Maturity Model v2.0 (2023).</li>
<li>Gartner SASE Research and the 2024 Magic Quadrant for Single-Vendor SASE.</li>
<li>Books: Garbis &amp; Chapman, "Zero Trust Security" (2021); Gilman &amp; Barth, "Zero Trust Networks" (O'Reilly 2017).</li>
</ul>
</div>`,
tr: `<p class="l-text">Aralık 2009'da sofistike bir APT (sonradan Çin'e atfedildi ve "Operation Aurora" olarak adlandırıldı) Google, Adobe ve ~30 diğer şirketi spear-phishing + IE sıfır günü yoluyla ihlal etti, sonra güvenilen kurumsal ağlar içinde aylarca yanal hareket etti. Google'ın yanıtı görülmemişti: daha güçlü bir perimeter inşa etmek yerine, ağın zaten düşmanca olduğu varsayımıyla iç erişimi yeniden organize ettiler. 2014'e kadar sonuç <em>BeyondCorp</em> olarak adlandırıldı (Ward &amp; Beyer, ;login: 2014): herhangi bir ağdaki herhangi bir çalışandan gelen her iç istek, kamu internetinden geliyormuş gibi doğrulandı. VPN yok. Perimeter güveni yok. Her erişim kararı istek başına cihaz duruşu, kullanıcı kimliği ve kaynak hassasiyeti karşısında hesaplandı. BeyondCorp NIST'in 2020'de <em>Zero Trust Architecture</em> (SP 800-207) olarak kodladığı şey için klasik referans oldu.</p>
<p class="l-text">Sıfır Güven bir ürün değil — bir paradigmadır: <em>asla güvenme, her zaman doğrula, ihlali varsay</em>. Bu capstone track'teki her şeyi sentezler. Kimlik (ders 8 IAM) yeni perimeter olur. Microsegmentation (ders 5) ağ bölgelerinin yerini alır. Sürekli cihaz duruşu (ders 9 container hijyeni + endpoint MDM) erişimi kapılar. WAF ve DDoS savunmaları (ders 5-6) kimlik-farkında proxy'nin önünde durur. Kablosuz ve 5G (ders 7) yalnızca başka bir güvenilmez erişim ağı olur. Bulut güvenliği (ders 8) substrattır. SASE (Secure Access Service Edge, Gartner 2019) bulut-teslim Sıfır Güven yığınıdır: ZTNA + SWG + CASB + FWaaS + SD-WAN. Python'da çalıştırılabilir bir Policy Decision Point ile kapatıyoruz: kimlik + cihaz + bağlam özelliklerinde sklearn-eğitilmiş bir risk skorlayıcı.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sıfır Güven paradigması — asla güvenme, her zaman doğrula, ihlali varsay</li>
<li>Google BeyondCorp (2014) — klasik referans mimarisi</li>
<li>NIST SP 800-207: PEP, PDP, PA, bileşenler ve veri kaynakları</li>
<li>Kimlik-farkında proxy'ler (IAP) — Google IAP, Cloudflare Access, Tailscale</li>
<li>Sıfır Güven uygulaması olarak microsegmentation</li>
<li>SASE — bulutta ağ ve güvenliğin yakınsaması</li>
<li>sklearn-eğitilmiş risk modeliyle bir Policy Decision Point inşa etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Neden Sıfır Güven?</h2>
<p class="l-text">Perimeter modeli içinin güvenilir olduğunu varsayar. Üç güç onu kırdı. (1) <em>Bulut</em>: iş yükleri artık firewall'ının arkasında yaşamıyor. (2) <em>Mobil / uzaktan çalışma</em>: kullanıcılar da artık arkasında yaşamıyor. (3) <em>Yanal hareket</em>: her modern ihlal (Target 2013, Home Depot 2014, Equifax 2017, SolarWinds 2020) güvenilen bir ağ içinde meşru kimlik bilgilerini kullandı. Düzeltme: örtük ağ güvenini reddet. Her bağlantı kimliği doğrulanmış, yetkilendirilmiş, şifrelenmiş ve loglanmış.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Asla güvenme</div><div class="card-body">Ağ konumundan örtük ayrıcalık yok. VPN tüneli = kamu internetiyle aynı.</div></div>
<div class="calc-card"><div class="card-title">Her zaman doğrula</div><div class="card-body">İstek-başı kimlik doğrulama. Kimlik, cihaz duruşu, bağlam her seferinde değerlendirilir.</div></div>
<div class="calc-card"><div class="card-title">İhlali varsay</div><div class="card-body">Saldırgan zaten içerideymiş gibi planla. Microsegment, logla, uyarı ver, sınırla.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. NIST SP 800-207 Referans Mimarisi</h2>
<p class="l-text">Ağustos 2020'de Rose, Borchert, Mitchell, Connelly tarafından yayımlandı. Klasik bileşenleri tanımlar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PEP</div><div class="card-body">Policy Enforcement Point — her kaynağın önündeki gateway. Kararı uygular.</div></div>
<div class="calc-card"><div class="card-title">PDP</div><div class="card-body">Policy Decision Point — isteği politikaya karşı değerlendirir. Allow / Deny / Step-up döner.</div></div>
<div class="calc-card"><div class="card-title">PA / PE</div><div class="card-body">Policy Administrator + Policy Engine. PE hesaplar; PA PEP'e ne yapacağını söyler.</div></div>
<div class="calc-card"><div class="card-title">Girdiler</div><div class="card-body">Kimlik deposu, cihaz duruşu (MDM), threat intel, SIEM, veri sınıflandırması, ICAM.</div></div>
</div>
<p class="l-text">PDP beyindir. Her istek bir soruya dönüşür: "bu kullanıcı, bu cihazda, bu bağlamda, bu kaynağa şu anda erişebilir mi?" Bölüm 6'daki çalıştırılabilir PDP tam olarak bunu uygular.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Google BeyondCorp — Referans Hikaye</h2>
<p class="l-text">BeyondCorp'un yayımlanmış mimarisi (altı makale, 2014-2018) göçü ayrıntılandırır.</p>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li><em>Trust Inferer</em>: MDM + duruş sinyallerinden cihaz başına bir tier (düşük/orta/yüksek) sürekli hesaplar.</li>
<li><em>Access Proxy</em>: her iç uygulama için Google'ın ön kapısı — SSO + cihaz cert mTLS.</li>
<li><em>Device Inventory Service</em>: her laptop ve telefon kaydedilmiş, sertifika-tabanlı kimlik.</li>
<li><em>Pipeline</em>: tüm erişim tier'larının gece yeniden hesaplanması; proxy'de milisaniye'de istek-başı karar.</li>
</ul>
<p class="l-text">Kurumsal VPN yok. Kahve dükkanlarındaki mühendisler kaynak repolarına ofisteki mühendislerle tam olarak aynı şekilde eriştiler — Access Proxy yoluyla cihaz cert + 2FA ile.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Kimlik-Farkında Proxy'ler (IAP)</h2>
<p class="l-text">HTTP için PEP. İç uygulamaların önünde durur, TLS'i sonlandırır, kullanıcıyı OIDC yoluyla doğrular, cihaz duruşunu değerlendirir, bir JWT imzalar ve backend'e iletir. Web uygulamaları için VPN'in yerini alır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Google Cloud IAP</div><div class="card-body">GCP-yerli. Workspace kimliğiyle entegre olur. App Engine, Compute Engine, konnektör yoluyla on-prem.</div></div>
<div class="calc-card"><div class="card-title">Cloudflare Access</div><div class="card-body">Edge-yerli. Cloudflare'in anycast'ında ZTNA. WARP istemcisi yoluyla cihaz duruşu.</div></div>
<div class="calc-card"><div class="card-title">Tailscale</div><div class="card-body">WireGuard-tabanlı mesh. SSO + ACL'ler. Startup'lar ve dev ekipleri arasında popüler.</div></div>
<div class="calc-card"><div class="card-title">Zscaler ZPA</div><div class="card-body">Kurumsal SASE</div><div class="card-body">Kurumsal SASE lideri. Uygulama-başı konnektörler, gelen firewall değişikliği yok.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Sıfır Güven Uygulaması Olarak Microsegmentation</h2>
<p class="l-text">Ders 5 microsegmentation'ı tanıttı. Sıfır Güven'de varsayılan olur. Her iş yükü-iş yükü bağlantısının açık kimlik-tabanlı bir politikası vardır. mTLS ile Cilium, tag'lerle NSX, AWS Security Group + VPC Lattice. Metrik: ele geçirilmiş bir iş yükünün <em>blast yarıçapı</em> — ideal olarak bir VM, asla bir subnet.</p>
<div class="katex-block">$$\\text{access decision} = f(\\text{User} \\times \\text{Role} \\times \\text{Device} \\times \\text{Resource} \\times \\text{Context})$$</div>
<p class="l-text">RBAC yalnızca bir dilimdir. Modern PDP'ler ABAC + risk skoru + davranışsal taban değerlendirir.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Bir Policy Decision Point İnşa Etmek</h2>
<p class="l-text">PDP bir istek bağlamı alır ve bir karar döner. Sentetik erişim loglarında lojistik regresyon eğitiyoruz, "normal"in neye benzediğini öğrenmek için, sonra yeni istekleri risk olarak puanlıyoruz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Sıfır Güven PDP — kimlik + cihaz + bağlam üzerinde sklearn-eğitilmiş risk skorlayıcı</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
N = 2000
df = pd.DataFrame({
    'mfa':              rng.choice([0,1], N, p=[0.1,0.9]),
    'device_managed':   rng.choice([0,1], N, p=[0.2,0.8]),
    'os_patched':       rng.choice([0,1], N, p=[0.1,0.9]),
    'unusual_geo':      rng.choice([0,1], N, p=[0.95,0.05]),
    'sensitive_resource':rng.choice([0,1], N, p=[0.7,0.3]),
    'time_of_day':      rng.integers(0, 24, N),
    'failed_logins_24h':rng.poisson(0.3, N),
})
# Sentetik ground truth: 2'den fazla risk bayrağı varsa reddet
risk = (1 - df['mfa']) + (1 - df['device_managed']) + (1 - df['os_patched']) \\
     + df['unusual_geo'] + (df['failed_logins_24h'] &gt; 2).astype(int)
df['allow'] = (risk &lt; 2).astype(int)

X = StandardScaler().fit_transform(df.drop('allow', axis=1).values)
y = df['allow'].values
clf = LogisticRegression(max_iter=200).fit(X, y)

def pdp_decision(req, threshold=0.4):
    feats = np.array([[req['mfa'], req['device_managed'], req['os_patched'],
                       req['unusual_geo'], req['sensitive_resource'],
                       req['time_of_day'], req['failed_logins_24h']]])
    score = clf.predict_proba(StandardScaler().fit(df.drop('allow',1).values).transform(feats))[0,1]
    decision = 'ALLOW' if score &gt; 0.7 else 'STEP_UP_MFA' if score &gt; threshold else 'DENY'
    return decision, round(float(score), 3)

reqs = [
    {'mfa':1,'device_managed':1,'os_patched':1,'unusual_geo':0,'sensitive_resource':1,'time_of_day':14,'failed_logins_24h':0},
    {'mfa':0,'device_managed':1,'os_patched':1,'unusual_geo':0,'sensitive_resource':0,'time_of_day':14,'failed_logins_24h':0},
    {'mfa':1,'device_managed':0,'os_patched':0,'unusual_geo':1,'sensitive_resource':1,'time_of_day':3, 'failed_logins_24h':5},
]
for r in reqs:
    print(r, '-&gt;', pdp_decision(r))
</code></pre></div>
</div>
<p class="l-text">Saat 14'te MFA'lı yönetilen bir cihaz hassas doküman okuyor: ALLOW. Saat 3'te 5 başarısız giriş olan, olağandışı coğrafyadan yönetilmeyen, yamanmamış bir cihaz: DENY. Ortadaki durum step-up MFA'yı tetikler. Bu 30 satırda Sıfır Güven karar kalıbıdır.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. SASE — Bulut-Teslim Sıfır Güven</h2>
<p class="l-text">Gartner SASE'yi 2019'da icat etti (Secure Access Service Edge): ağı (SD-WAN) güvenlikle (SWG, CASB, FWaaS, ZTNA) tek bir bulut-teslim yığında birleştir. Satıcılar: Zscaler, Palo Alto Prisma SASE, Cisco Umbrella, Cloudflare One, Netskope. SASE, Sıfır Güven'i bir kurum için uygulanabilir kılan operasyonel teslim modelidir — on-prem cihaz yok, politika kullanıcıyı takip eder, telemetri merkezi.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SWG</div><div class="card-body">Secure Web Gateway. Kullanıcı web trafiğini inceler, malware'i engeller, DLP uygular.</div></div>
<div class="calc-card"><div class="card-title">CASB</div><div class="card-body">Cloud Access Security Broker. SaaS üzerinde görünürlük + kontrol (M365, Salesforce, Drive).</div></div>
<div class="calc-card"><div class="card-title">ZTNA</div><div class="card-body">Zero Trust Network Access. Tüm iç uygulamalar için IAP.</div></div>
<div class="calc-card"><div class="card-title">FWaaS</div><div class="card-body">Firewall as a Service. Bulut-teslim ağ filtreleme.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Uygulama Playbook</h2>
<p class="l-text">6 fazda pratik Sıfır Güven yayılımı.</p>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li><em>Kimlik birleştirme</em>: tek IdP (Entra ID, Okta, Google Workspace), MFA zorunlu, phish-dirençli (FIDO2).</li>
<li><em>Cihaz envanteri</em>: her laptop için MDM (Intune, Jamf, Kandji). Duruş sinyalleri: şifreleme, yama düzeyi, EDR çalışıyor.</li>
<li><em>Uygulamaların envanteri</em>: her iç servisi katalogla, hassasiyete göre sınıflandır. Sıfır Güven göç önceliğine göre sırala.</li>
<li><em>Web uygulamaları için IAP</em>: her uygulamayı Cloudflare Access / GCP IAP / ZPA ile öne. Web katmanı için VPN'i emekli et.</li>
<li><em>Doğu-batı microsegmentation</em>: K8s için NetworkPolicy + service mesh mTLS, VM'ler için host firewall'lar.</li>
<li><em>Sürekli izleme</em>: tüm PEP loglarının SIEM alımı; UEBA anormal erişimi tespit eder; uyarlamalı politika için PDP'ye geri bağla.</li>
</ol>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Gerçeklik kontrolü: tam Sıfır Güven herhangi bir kurum için 3-5 yıllık bir yolculuktur. En yüksek-değerli hedeflerden başla — admin konsolları, kaynak repoları, müşteri veri depoları. Her seferinde bir servisi göç ettir. Blast yarıçap azaltmayı ölç, "Sıfır Güven olgunluk skorunu" değil. Araçlar değişir; ilkeler (en az ayrıcalık, istek-başı auth, microsegmentation, her şeyi logla) değişmez.</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Track Sentezi</h2>
<p class="l-text">Sıfır Güven tüm netsec track'ini birbirine bağlar.</p>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Kriptografi, TLS, IDS, ağ protokolleri üzerine ders 1-4 sana doğrulama primitiflerini verir.</li>
<li>Ders 5 (firewall + microsegmentation) uygulama düzlemidir.</li>
<li>Ders 6 (DDoS) kamuya açık PEP'leri korur.</li>
<li>Ders 7 (kablosuz / 5G) Sıfır Güven altında "başka bir güvenilmez ağ"dır.</li>
<li>Ders 8 (bulut) ve 9 (container'lar) çoğu iş yükünün yaşadığı substratı sağlar.</li>
<li>Ders 10 (bu) onları entegre eden politika ve mimaridir.</li>
</ul>
<p class="l-text">Bugün bir savunmacı "firewall kişisi" veya "IAM kişisi" değildir — Sıfır Güven mimarıdır, kimlikten çalışma zamanına ağa buluta tam yığın sahiplenir. Bu track sana o kelime dağarcığını verdi.</p>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Daha Fazla Okuma</h2>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>NIST SP 800-207 (2020) — Zero Trust Architecture, ücretsiz PDF.</li>
<li>Ward &amp; Beyer 2014, "BeyondCorp: A New Approach to Enterprise Security" — ;login: dergisi.</li>
<li>Cunningham &amp; Holmes 2017, "The Zero Trust eXtended Ecosystem" — Forrester.</li>
<li>CISA Zero Trust Maturity Model v2.0 (2023).</li>
<li>Gartner SASE Research ve Tek-Satıcılı SASE için 2024 Magic Quadrant.</li>
<li>Kitaplar: Garbis &amp; Chapman, "Zero Trust Security" (2021); Gilman &amp; Barth, "Zero Trust Networks" (O'Reilly 2017).</li>
</ul>
</div>`
};
