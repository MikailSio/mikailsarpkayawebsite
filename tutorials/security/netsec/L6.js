window.NETSEC_L6 = {
en: `<p class="l-text">On 21 October 2016 a malware called Mirai turned 600,000 compromised IP cameras into a botnet that hit Dyn DNS with ~1.2 Tbps of traffic, taking Twitter, GitHub, Netflix, and Reddit offline for hours. Mirai exploited default credentials on consumer IoT — credentials still in use a decade later — and demonstrated that volumetric DDoS at terabit scale was now within reach of teenagers, not nation-states. Three years later, GitHub absorbed a 1.35 Tbps memcached-amplified attack (Cloudflare 2018), and AWS Shield reported a 2.3 Tbps attack in February 2020. By 2024, Cloudflare reported a 5.6 Tbps attack from a Mirai-variant botnet of 13,000 devices.</p>
<p class="l-text">DDoS comes in three flavors: <em>volumetric</em> (saturate the pipe — UDP floods, amplification), <em>protocol</em> (exhaust state tables — SYN flood, fragmentation), and <em>application-layer</em> (low-rate, high-cost requests — Slowloris, HTTP GET floods). Defenses layer accordingly: BGP RTBH/Flowspec for upstream filtering, eBPF/XDP for stateless drop at line rate, anycast scrubbing centers (Cloudflare Magic Transit, AWS Shield Advanced), and ML-based behavioral detection for app-layer. This lesson maps the attack surface, walks the defense stack, and builds a runnable rate-anomaly detector in NumPy that mimics what cloud scrubbing centers do at the front door.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The three DDoS attack classes — volumetric, protocol, application</li>
<li>Amplification vectors: DNS, NTP, memcached, CLDAP, SSDP</li>
<li>Mirai (2016), GitHub memcached (2018), and the modern record-setters</li>
<li>Cloud scrubbing: Cloudflare Magic Transit, AWS Shield Advanced, Akamai Prolexic</li>
<li>BGP RTBH and Flowspec for upstream filtering</li>
<li>Building a moving-average rate-anomaly detector in NumPy</li>
<li>ML-based app-layer DDoS detection — when signatures fail</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Three Attack Classes</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Volumetric (L3/L4)</div><div class="card-body">Saturate bandwidth. UDP floods, amplification. Measured in Gbps/Tbps. Mitigation: cloud scrubbing.</div></div>
<div class="calc-card"><div class="card-title">Protocol (L3/L4)</div><div class="card-body">Exhaust state tables. SYN flood, ACK flood, Smurf, ping of death. Mitigation: SYN cookies, conntrack tuning.</div></div>
<div class="calc-card"><div class="card-title">Application (L7)</div><div class="card-body">Slow / costly HTTP. Slowloris, HashDoS, GET floods, login API hammer. Mitigation: WAF + behavioral ML.</div></div>
</div>
<p class="l-text">The same target may face all three simultaneously — the standard "kitchen sink" attack pattern. Defenders need layered tooling.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Amplification — The Force Multiplier</h2>
<p class="l-text">An amplifier is a public service that returns a much larger response than its query. The attacker spoofs the victim's IP in the source field of small queries; the amplifier blasts large responses at the victim. Bandwidth amplification factor (BAF):</p>
<div class="katex-block">$$\\text{BAF} = \\frac{\\text{response size}}{\\text{query size}}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DNS ANY</div><div class="card-body">BAF 28x-54x. Open recursive resolvers. Mitigation: DNS RRL, source validation.</div></div>
<div class="calc-card"><div class="card-title">NTP monlist</div><div class="card-body">BAF up to 556x. CVE-2013-5211. Largely patched out, but unpatched legacy persists.</div></div>
<div class="calc-card"><div class="card-title">memcached</div><div class="card-body">BAF up to 51,000x. UDP open by default in 1.5.x. GitHub Feb 2018: 1.35 Tbps.</div></div>
<div class="calc-card"><div class="card-title">CLDAP</div><div class="card-body">BAF ~50x. Used heavily 2017-2020 against gaming/financial.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (calculation, no real spoofing)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Theoretical attack capacity given attacker uplink and amplifier set
attacker_uplink_gbps = 1
amplifiers = {'DNS': 50, 'NTP': 556, 'memcached': 50000, 'CLDAP': 50}
for name, baf in amplifiers.items():
    print(f"{name:10s}  BAF={baf:6d}x  -&gt; theoretical victim flood = "
          f"{attacker_uplink_gbps * baf:6.0f} Gbps")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>attacker_uplink_gbps = 1</code> models a modest attacker with 1 Gbps of egress (a single VPS, or a few residential gigabit lines) — most real attackers control even less individually but recruit thousands of bots. 2) The <code>amplifiers</code> dict maps protocol names to their measured BAF (Bandwidth Amplification Factor): the ratio of <em>response size</em> to <em>query size</em> when the attacker spoofs the victim's IP in the source field of small queries to public UDP services. 3) The loop multiplies <code>attacker_uplink_gbps * baf</code> — with memcached's 50 000x factor, a single 1 Gbps source can theoretically saturate a 50 Tbps victim pipe, which is why GitHub's 1.35 Tbps memcached attack (Feb 2018) was so cheap to mount. 4) The defense lives at the amplifier owner: disable UDP on memcached, rate-limit DNS responses (RRL), patch NTP CVE-2013-5211, and deploy BCP 38 source-address validation on transit so spoofed packets never leave the originating AS.</p>

</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Building a Rate-Anomaly Detector</h2>
<p class="l-text">The most basic DDoS signal: traffic rate jumps far above baseline. We compute an exponentially-weighted moving average (EWMA) of packets/second per source IP, flag any source whose instantaneous rate exceeds μ + 4σ.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Moving-average rate anomaly detection on synthetic traffic</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

# Simulate 600 seconds of traffic. After t=400s a botnet activates.
T = 600
baseline = rng.poisson(lam=200, size=T)            # normal pps
attack   = np.where(np.arange(T) &gt; 400,
                    rng.poisson(lam=2000, size=T), 0)
traffic = baseline + attack

# EWMA with alpha=0.1
alpha = 0.1
mu = np.zeros(T); sigma2 = np.zeros(T)
mu[0], sigma2[0] = traffic[0], 1.0
for t in range(1, T):
    mu[t] = alpha*traffic[t] + (1-alpha)*mu[t-1]
    sigma2[t] = alpha*(traffic[t]-mu[t-1])**2 + (1-alpha)*sigma2[t-1]
sigma = np.sqrt(sigma2)
threshold = mu + 4*sigma
alerts = traffic &gt; threshold
print(f"Total alerts: {alerts.sum()}")
print(f"First alert at t={int(np.argmax(alerts))}s "
      f"(attack started at t=401s, traffic={traffic[int(np.argmax(alerts))]} pps)")
</code></pre></div>
</div>
<p class="l-text">EWMA reacts in seconds, not minutes — production scrubbers run thousands of these per source/dest tuple.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Cloud Scrubbing Centers</h2>
<p class="l-text">When attack volume exceeds your edge capacity, you need someone bigger between you and the internet. Anycast scrubbing centers absorb traffic, filter at scale, forward clean traffic via GRE or direct connect.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cloudflare Magic Transit</div><div class="card-body">Anycast across 300+ POPs. Always-on or on-demand. Mitigates 100+ Tbps capacity claimed.</div></div>
<div class="calc-card"><div class="card-title">AWS Shield Advanced</div><div class="card-body">Bundled with Route 53 / CloudFront. WAF + L3/4 filtering. SOC 24/7.</div></div>
<div class="calc-card"><div class="card-title">Akamai Prolexic</div><div class="card-body">Veteran (since 2003). Strong financial/government track record.</div></div>
<div class="calc-card"><div class="card-title">Imperva</div><div class="card-body">DDoS + WAF combined. Heavy in EU/APAC.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. BGP RTBH and Flowspec</h2>
<p class="l-text">When the attack is too large for your scrubber, push filtering upstream. <em>Remotely Triggered Black Hole</em> (RTBH, RFC 5635): announce the victim's /32 with a community that tells transit providers to drop. <em>BGP Flowspec</em> (RFC 5575) is more precise — announce a {src, dst, port, proto} 5-tuple with action drop, and ISPs apply ACLs at their borders.</p>
<div class="code-wrap"><div class="code-label"><span>BASH — JUNOS BGP FLOWSPEC RULE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>set routing-options flow route block-memcached match \\
    protocol udp source-port 11211 destination 198.51.100.0/24
set routing-options flow route block-memcached then discard
</code></pre></div>
<p class="l-text"><strong>What this code does, line by line:</strong> 1) <code>set routing-options flow route block-memcached match ...</code> defines a Junos BGP Flowspec rule (RFC 5575) that matches UDP traffic where <code>source-port 11211</code> (memcached) is heading to the victim prefix <code>198.51.100.0/24</code> — a four-component filter encoded into a BGP NLRI. 2) <code>then discard</code> sets the action: the receiving router drops on match instead of forwarding. 3) Once advertised over BGP, every upstream router that accepts your Flowspec feed applies the filter at its <em>own</em> ingress — pushing the drop hundreds of milliseconds closer to the source and freeing your link before traffic even arrives. 4) RTBH (RFC 5635) is the cruder cousin: announce the victim's /32 with a special community and transit providers blackhole all traffic to it — saves your link but completes the DoS for you; Flowspec is preferred for targeted protocol-level filtering.</p>

</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Application-Layer Attacks</h2>
<p class="l-text">L7 attacks bypass volumetric defenses entirely. Slowloris (Hansen 2009) holds thousands of HTTP connections open with one byte/sec; the target's worker pool fills and legitimate users see 503. HashDoS (Klink-Wäldchen 2011) sends collisions in language hashtable implementations to drive O(n²) processing. Modern login-flooders use real browsers via headless Chrome — bypass any signature.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

# Simulate per-IP request features: total req, unique URLs, mean inter-req-time
rng = np.random.default_rng(0)
N_normal, N_attack = 200, 30
normal = pd.DataFrame({
    'req_count':    rng.poisson(40,  N_normal),
    'unique_urls':  rng.poisson(15,  N_normal),
    'mean_iat_ms':  rng.normal(3000, 500, N_normal),
})
attack = pd.DataFrame({
    'req_count':    rng.poisson(600, N_attack),    # very high req
    'unique_urls':  rng.poisson(2,   N_attack),    # one endpoint
    'mean_iat_ms':  rng.normal(20,   5,  N_attack),# very fast
})
df = pd.concat([normal, attack], ignore_index=True)

iso = IsolationForest(contamination=0.13, random_state=0).fit(df.values)
df['flag'] = (iso.predict(df.values) == -1).astype(int)
caught = df['flag'].iloc[N_normal:].sum()
fp     = df['flag'].iloc[:N_normal].sum()
print(f"Caught {caught}/{N_attack} attackers, false positives: {fp}/{N_normal}")
</code></pre></div>
<p class="l-text">IsolationForest separates the high-rate, low-diversity attack pattern from organic browsing. Cloudflare's "Bot Management" (2020 acquisition of S2 Systems) is built on this principle plus device fingerprinting and behavioral biometrics.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. ML-Based Mitigation in Production</h2>
<p class="l-text">Cloudflare's Gatebot, AWS Shield's automated detection, and Google's reCAPTCHA Enterprise all rely on ML behind the scenes. Common features: TCP fingerprint (p0f, JA3 for TLS), HTTP header order, request timing distributions, mouse/touch entropy, IP reputation, ASN history. The classifier outputs a per-request risk score; rate limiting, JS challenges, and full blocks chain off the score.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Adversarial DDoS — attackers use GANs to craft request distributions that mimic benign traffic statistics. Defenders respond with active learning loops that retrain hourly on flagged traffic. The arms race accelerated 2022-2025 as cheap GPU inference let attackers iterate as fast as defenders.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Mirai Decade — Lessons Learned</h2>
<p class="l-text">Three lessons from a decade of Mirai variants. (1) <em>IoT supply chain is the breach surface</em>: default creds in 100M+ devices remain unpatchable. (2) <em>Source-address validation (BCP 38, RFC 2827)</em> on transit ISPs would eliminate amplification — only ~70% of ASes deploy it (CAIDA Spoofer 2024). (3) <em>Anycast + scrubbing has won at the high end</em>: any attack under 5 Tbps is now routinely absorbed; the question is whether your operational team can withstand the ops fire (DNS resolution failures, BGP flap, monitoring overload) during the event.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Run-Book — What to Do During an Active Attack</h2>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Identify attack vector — netflow, packet capture (volumetric vs L7).</li>
<li>Engage scrubbing partner — flip DNS to scrubbing IPs, or activate always-on tunnel.</li>
<li>Tune WAF — raise CRS sensitivity, add custom geo / ASN block rules.</li>
<li>Push BGP Flowspec to upstream if scrubbing capacity exceeded.</li>
<li>Coordinate with ISP NOC — request RTBH or filtering at their borders.</li>
<li>Communicate with users — status page, transparency on cause and ETA.</li>
<li>Post-incident: forensic packet capture, attribution, customer notification, patch any exploited weakness.</li>
</ol>
</div>`,
tr: `<p class="l-text">21 Ekim 2016'da Mirai adlı bir kötü amaçlı yazılım 600.000 ele geçirilmiş IP kamerasını Dyn DNS'e ~1.2 Tbps trafikle vuran bir botnet'e dönüştürdü, Twitter, GitHub, Netflix ve Reddit'i saatlerce çevrimdışı bıraktı. Mirai tüketici IoT'deki varsayılan kimlik bilgilerini sömürdü — bir on yıl sonra hâlâ kullanılan kimlik bilgileri — ve terabit ölçekli volumetrik DDoS'un artık ulus-devletlerin değil, gençlerin erişiminde olduğunu gösterdi. Üç yıl sonra, GitHub 1.35 Tbps memcached-amplified saldırıyı emdi (Cloudflare 2018) ve AWS Shield Şubat 2020'de 2.3 Tbps saldırı raporladı. 2024'e gelindiğinde, Cloudflare 13.000 cihazlık bir Mirai-varyant botnet'inden 5.6 Tbps saldırı raporladı.</p>
<p class="l-text">DDoS üç çeşit gelir: <em>volumetrik</em> (boruyu doyur — UDP flood, amplification), <em>protokol</em> (durum tablolarını tüket — SYN flood, fragmentation) ve <em>uygulama-katmanı</em> (düşük-oran, yüksek-maliyet istekler — Slowloris, HTTP GET flood). Savunmalar buna göre katmanlanır: yukarı akış filtreleme için BGP RTBH/Flowspec, line-rate'te durumsuz drop için eBPF/XDP, anycast scrubbing merkezleri (Cloudflare Magic Transit, AWS Shield Advanced) ve uygulama katmanı için ML-tabanlı davranışsal tespit. Bu ders saldırı yüzeyini haritalar, savunma yığınını gezer ve bulut scrubbing merkezlerinin ön kapıda yaptığını taklit eden NumPy'da çalıştırılabilir bir oran-anomali dedektörü inşa eder.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Üç DDoS saldırı sınıfı — volumetrik, protokol, uygulama</li>
<li>Amplification vektörleri: DNS, NTP, memcached, CLDAP, SSDP</li>
<li>Mirai (2016), GitHub memcached (2018) ve modern rekor kıranlar</li>
<li>Bulut scrubbing: Cloudflare Magic Transit, AWS Shield Advanced, Akamai Prolexic</li>
<li>Yukarı akış filtreleme için BGP RTBH ve Flowspec</li>
<li>NumPy'da bir kayan-ortalama oran-anomali dedektörü inşa etmek</li>
<li>ML-tabanlı uygulama katmanı DDoS tespiti — imzalar başarısız olduğunda</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Üç Saldırı Sınıfı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Volumetrik (L3/L4)</div><div class="card-body">Bant genişliğini doyur. UDP flood, amplification. Gbps/Tbps olarak ölçülür. Hafifletme: bulut scrubbing.</div></div>
<div class="calc-card"><div class="card-title">Protokol (L3/L4)</div><div class="card-body">Durum tablolarını tüket. SYN flood, ACK flood, Smurf, ping of death. Hafifletme: SYN cookie, conntrack ayarı.</div></div>
<div class="calc-card"><div class="card-title">Uygulama (L7)</div><div class="card-body">Yavaş / pahalı HTTP. Slowloris, HashDoS, GET flood, login API çekiç. Hafifletme: WAF + davranışsal ML.</div></div>
</div>
<p class="l-text">Aynı hedef üçünü de eşzamanlı yaşayabilir — standart "mutfak lavabosu" saldırı kalıbı. Savunmacılar katmanlı araç setine ihtiyaç duyar.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Amplification — Güç Çarpanı</h2>
<p class="l-text">Amplifier, sorgusundan çok daha büyük bir yanıt döndüren kamuya açık bir servistir. Saldırgan küçük sorguların kaynak alanında kurbanın IP'sini sahteler; amplifier kurbana büyük yanıtları patlatır. Bandwidth amplification factor (BAF):</p>
<div class="katex-block">$$\\text{BAF} = \\frac{\\text{response size}}{\\text{query size}}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DNS ANY</div><div class="card-body">BAF 28x-54x. Açık özyinelemeli resolver'lar. Hafifletme: DNS RRL, kaynak doğrulama.</div></div>
<div class="calc-card"><div class="card-title">NTP monlist</div><div class="card-body">BAF 556x'a kadar. CVE-2013-5211. Büyük ölçüde yamandı, ama yamanmamış eskiler kalır.</div></div>
<div class="calc-card"><div class="card-title">memcached</div><div class="card-body">BAF 51.000x'a kadar. 1.5.x'te varsayılan UDP açık. GitHub Şubat 2018: 1.35 Tbps.</div></div>
<div class="calc-card"><div class="card-title">CLDAP</div><div class="card-body">BAF ~50x. 2017-2020'de oyun/finansal'a karşı yoğun kullanıldı.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (hesaplama, gerçek spoofing yok)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Saldırgan uplink ve amplifier seti verildiğinde teorik saldırı kapasitesi
attacker_uplink_gbps = 1
amplifiers = {'DNS': 50, 'NTP': 556, 'memcached': 50000, 'CLDAP': 50}
for name, baf in amplifiers.items():
    print(f"{name:10s}  BAF={baf:6d}x  -&gt; theoretical victim flood = "
          f"{attacker_uplink_gbps * baf:6.0f} Gbps")
</code></pre></div>
<p class="l-text"><strong>Kodun adım adım okuması:</strong> 1) <code>attacker_uplink_gbps = 1</code> mütevazı bir saldırganı modeller — 1 Gbps çıkış (tek bir VPS veya birkaç gigabit ev hattı); gerçek saldırganlar bireysel olarak daha azına sahiptir ama binlerce bot toplarlar. 2) <code>amplifiers</code> sözlüğü protokol adlarını ölçülmüş BAF (Bandwidth Amplification Factor) değerlerine eşler: saldırgan küçük sorgulara kurbanın IP'sini source alanına spoof ettiğinde, kamuya açık UDP servislerinin döndürdüğü <em>yanıt boyutu</em> / <em>sorgu boyutu</em> oranı. 3) Döngü <code>attacker_uplink_gbps * baf</code> çarpımı yapar — memcached'in 50 000x faktörüyle, tek 1 Gbps'lık bir kaynak teorik olarak 50 Tbps'lık bir kurban borusunu doyurabilir; GitHub'ın 1.35 Tbps memcached saldırısının (Şubat 2018) bu kadar ucuza yapılabilmesinin sebebi budur. 4) Savunma amplifier sahibinde başlar: memcached'de UDP'yi kapat, DNS yanıtlarını rate-limit'le (RRL), NTP CVE-2013-5211'i yamala ve transit üzerinde BCP 38 source-address validation dağıt — böylece spoof'lanmış paketler kaynak AS'den hiç çıkamaz.</p>

</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Bir Oran-Anomali Dedektörü İnşa Etmek</h2>
<p class="l-text">En temel DDoS sinyali: trafik oranı tabanın çok üstüne sıçrar. Kaynak IP başına paket/saniye'nin üssel-ağırlıklı kayan ortalamasını (EWMA) hesaplıyoruz, anlık oranı μ + 4σ'yı aşan herhangi bir kaynağı işaretliyoruz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Sentetik trafikte kayan-ortalama oran anomali tespiti</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)

# 600 saniyelik trafik simüle et. t=400s sonrasında bir botnet aktive olur.
T = 600
baseline = rng.poisson(lam=200, size=T)            # normal pps
attack   = np.where(np.arange(T) &gt; 400,
                    rng.poisson(lam=2000, size=T), 0)
traffic = baseline + attack

# alpha=0.1 ile EWMA
alpha = 0.1
mu = np.zeros(T); sigma2 = np.zeros(T)
mu[0], sigma2[0] = traffic[0], 1.0
for t in range(1, T):
    mu[t] = alpha*traffic[t] + (1-alpha)*mu[t-1]
    sigma2[t] = alpha*(traffic[t]-mu[t-1])**2 + (1-alpha)*sigma2[t-1]
sigma = np.sqrt(sigma2)
threshold = mu + 4*sigma
alerts = traffic &gt; threshold
print(f"Total alerts: {alerts.sum()}")
print(f"First alert at t={int(np.argmax(alerts))}s "
      f"(attack started at t=401s, traffic={traffic[int(np.argmax(alerts))]} pps)")
</code></pre></div>
</div>
<p class="l-text">EWMA dakikalar değil saniyeler içinde tepki verir — üretim scrubber'ları kaynak/hedef tüpü başına binlerce çalıştırır.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Bulut Scrubbing Merkezleri</h2>
<p class="l-text">Saldırı hacmi edge kapasitenizi aştığında, kendiniz ile internet arasında daha büyük birine ihtiyacınız var. Anycast scrubbing merkezleri trafiği emer, ölçekte filtreler, temiz trafiği GRE veya doğrudan bağlantı yoluyla iletir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cloudflare Magic Transit</div><div class="card-body">300+ POP'ta anycast. Her zaman açık veya talep üzerine. 100+ Tbps kapasite iddia edilen şekilde hafifletir.</div></div>
<div class="calc-card"><div class="card-title">AWS Shield Advanced</div><div class="card-body">Route 53 / CloudFront ile paketlenmiş. WAF + L3/4 filtreleme. 7/24 SOC.</div></div>
<div class="calc-card"><div class="card-title">Akamai Prolexic</div><div class="card-body">Veteran (2003'ten beri). Güçlü finansal/devlet sicili.</div></div>
<div class="calc-card"><div class="card-title">Imperva</div><div class="card-body">DDoS + WAF birleşik. EU/APAC'te ağır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. BGP RTBH ve Flowspec</h2>
<p class="l-text">Saldırı scrubber'ın için çok büyükse, filtremeyi yukarı akışa it. <em>Remotely Triggered Black Hole</em> (RTBH, RFC 5635): kurbanın /32'sini transit sağlayıcılara düşürmesini söyleyen bir community ile duyur. <em>BGP Flowspec</em> (RFC 5575) daha kesindir — drop eylemli bir {src, dst, port, proto} 5-tüplü duyur ve ISS'ler sınırlarında ACL uygular.</p>
<div class="code-wrap"><div class="code-label"><span>BASH — JUNOS BGP FLOWSPEC RULE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>set routing-options flow route block-memcached match \\
    protocol udp source-port 11211 destination 198.51.100.0/24
set routing-options flow route block-memcached then discard
</code></pre></div>
<p class="l-text"><strong>Satır satır okuyalım:</strong> 1) <code>set routing-options flow route block-memcached match ...</code> bir Junos BGP Flowspec kuralı (RFC 5575) tanımlar — UDP trafiğini <code>source-port 11211</code> (memcached) ile kurban prefix'i <code>198.51.100.0/24</code>'e gittiğinde eşleştirir; dört bileşenli bir filtre BGP NLRI içine kodlanır. 2) <code>then discard</code> eylemi belirler: alıcı router eşleşmede iletmek yerine düşürür. 3) BGP üzerinden duyurulduğunda, Flowspec feed'ini kabul eden her yukarı akış router filtreyi kendi <em>ingress</em>'inde uygular — drop'u kaynağa yüzlerce milisaniye yaklaştırır ve trafik daha gelmeden hattınızı serbest bırakır. 4) RTBH (RFC 5635) daha kaba kuzenidir: kurbanın /32'sini özel bir community ile duyurursunuz, transit sağlayıcılar tüm trafiği blackhole'lar — hattınızı kurtarır ama DoS'u tamamlar; Flowspec hedeflenmiş protokol-düzeyi filtreleme için tercih edilir.</p>

</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Uygulama Katmanı Saldırıları</h2>
<p class="l-text">L7 saldırılar volumetrik savunmaları tamamen atlatır. Slowloris (Hansen 2009) binlerce HTTP bağlantısını saniyede bir bayt ile açık tutar; hedefin worker havuzu dolar ve meşru kullanıcılar 503 görür. HashDoS (Klink-Wäldchen 2011) O(n²) işlemeyi yönlendirmek için dil hashtable uygulamalarında çakışmalar gönderir. Modern login-flooder'lar headless Chrome yoluyla gerçek tarayıcılar kullanır — herhangi imzayı atlatır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

# IP başına istek özellikleri simüle et: toplam req, benzersiz URL, ortalama istek-arası süre
rng = np.random.default_rng(0)
N_normal, N_attack = 200, 30
normal = pd.DataFrame({
    'req_count':    rng.poisson(40,  N_normal),
    'unique_urls':  rng.poisson(15,  N_normal),
    'mean_iat_ms':  rng.normal(3000, 500, N_normal),
})
attack = pd.DataFrame({
    'req_count':    rng.poisson(600, N_attack),    # çok yüksek req
    'unique_urls':  rng.poisson(2,   N_attack),    # tek endpoint
    'mean_iat_ms':  rng.normal(20,   5,  N_attack),# çok hızlı
})
df = pd.concat([normal, attack], ignore_index=True)

iso = IsolationForest(contamination=0.13, random_state=0).fit(df.values)
df['flag'] = (iso.predict(df.values) == -1).astype(int)
caught = df['flag'].iloc[N_normal:].sum()
fp     = df['flag'].iloc[:N_normal].sum()
print(f"Caught {caught}/{N_attack} attackers, false positives: {fp}/{N_normal}")
</code></pre></div>
<p class="l-text">IsolationForest yüksek-oranlı, düşük-çeşitlilik saldırı kalıbını organik gezinme'den ayırır. Cloudflare'in "Bot Management"i (2020 S2 Systems satın alımı) bu ilke artı cihaz parmak izi ve davranışsal biyometri üzerine kurulu.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Üretimde ML-Tabanlı Hafifletme</h2>
<p class="l-text">Cloudflare'in Gatebot'u, AWS Shield'in otomatik tespiti ve Google'ın reCAPTCHA Enterprise'ı hepsi perde arkasında ML'e güvenir. Ortak özellikler: TCP parmak izi (p0f, TLS için JA3), HTTP başlık sırası, istek zamanlama dağılımları, fare/dokunmatik entropi, IP itibarı, ASN geçmişi. Sınıflandırıcı istek başına risk skoru çıkarır; rate limiting, JS challenge'lar ve tam engellemeler skordan zincirlenir.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Düşmanca DDoS — saldırganlar zararsız trafik istatistiklerini taklit eden istek dağılımları üretmek için GAN'lar kullanır. Savunmacılar saatlik olarak işaretli trafikte yeniden eğitilen aktif öğrenme döngüleriyle yanıt verir. Ucuz GPU çıkarımı saldırganların savunmacılar kadar hızlı yinelemesine izin verdikçe silah yarışı 2022-2025'te hızlandı.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Mirai On Yılı — Öğrenilen Dersler</h2>
<p class="l-text">Bir on yıllık Mirai varyantlarından üç ders. (1) <em>IoT tedarik zinciri ihlal yüzeyidir</em>: 100M+ cihazda varsayılan kimlik bilgileri yamanamaz olarak kalır. (2) <em>Transit ISS'lerinde kaynak-adres doğrulaması (BCP 38, RFC 2827)</em> amplification'ı ortadan kaldırır — yalnızca AS'lerin ~%70'i bunu dağıtır (CAIDA Spoofer 2024). (3) <em>Anycast + scrubbing yüksek uçta kazandı</em>: 5 Tbps altındaki herhangi bir saldırı artık rutin olarak emilir; soru, operasyon ekibinin etkinlik sırasında ops yangınına (DNS çözümleme başarısızlıkları, BGP flap, izleme aşırı yükü) dayanıp dayanamayacağıdır.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Run-Book — Aktif Saldırı Sırasında Ne Yapmalı</h2>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Saldırı vektörünü tanımla — netflow, paket yakalama (volumetrik vs L7).</li>
<li>Scrubbing partneri devreye al — DNS'i scrubbing IP'lerine çevir veya her zaman açık tüneli aktive et.</li>
<li>WAF'ı ayarla — CRS hassasiyetini yükselt, özel coğrafya / ASN engelleme kuralları ekle.</li>
<li>Scrubbing kapasitesi aşıldıysa BGP Flowspec'i yukarı akışa it.</li>
<li>ISS NOC ile koordine et — sınırlarında RTBH veya filtreleme iste.</li>
<li>Kullanıcılarla iletişim kur — durum sayfası, neden ve ETA üzerinde şeffaflık.</li>
<li>Olay sonrası: adli paket yakalama, atıf, müşteri bildirimi, sömürülen herhangi bir zayıflığı yamala.</li>
</ol>
</div>`
};
