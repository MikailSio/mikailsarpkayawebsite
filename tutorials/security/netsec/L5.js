window.NETSEC_L5 = {
en: `<p class="l-text">In 1988 Digital Equipment Corporation deployed the first commercial packet filter — a stateless gateway that allowed or denied packets based on header tuples. Six years later, Check Point shipped FireWall-1 with <em>stateful inspection</em>: tracking TCP connection state so a return packet from an outbound request was automatically permitted while unsolicited inbound packets were dropped. Stateful firewalls remain the perimeter workhorse, but the perimeter has dissolved. Today's defenses layer Web Application Firewalls (WAFs) at L7, microsegmentation policies inside east-west traffic, software-defined network (SDN) controllers reconfiguring policy per-flow, and eBPF/XDP programs filtering at line rate inside the kernel before the packet ever reaches userspace.</p>
<p class="l-text">This lesson maps the modern stack: stateful inspection on top of <em>conntrack</em> tables; ModSecurity and the OWASP Core Rule Set (CRS) for WAFs; microsegmentation with VMware NSX, Illumio, and Cilium; SDN security with OpenFlow ACLs; and BPF/XDP for sub-microsecond packet decisions. We build a runnable WAF rule engine in Python — regex-based pattern matching plus an sklearn-trained anomaly score — that you can extend at the bench.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Stateless vs stateful packet filtering and how conntrack works</li>
<li>Web Application Firewalls — ModSecurity and the OWASP Core Rule Set</li>
<li>Microsegmentation: NSX, Illumio, Cilium network policies</li>
<li>SDN security and OpenFlow ACLs</li>
<li>BPF / XDP / eBPF for line-rate packet filtering</li>
<li>Building a regex + ML hybrid WAF in scikit-learn</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Stateful Inspection — The Conntrack Table</h2>
<p class="l-text">A stateful firewall maintains a hash table keyed on the 5-tuple (src IP, dst IP, src port, dst port, protocol). When an outbound TCP SYN goes out, an entry is created with state NEW; on the SYN-ACK reply the state advances to ESTABLISHED. Linux netfilter's <code>nf_conntrack</code> is the canonical implementation: kernel module, ~16 GB tables on busy load balancers, exposed to userspace via <code>/proc/net/nf_conntrack</code>.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stateless</div><div class="card-body">Decision per packet. Cisco ACLs, AWS NACLs. Fast, simple, blind to flow context.</div></div>
<div class="calc-card"><div class="card-title">Stateful</div><div class="card-body">Decision per flow. iptables, pf, AWS Security Groups. Tracks TCP state, ICMP pairs, NAT mappings.</div></div>
<div class="calc-card"><div class="card-title">Application-aware</div><div class="card-body">L7 inspection — HTTP, DNS, TLS SNI. Palo Alto Networks, Suricata. Heavy CPU but malware-aware.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>BASH — IPTABLES STATEFUL RULES</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Allow established/related, drop everything else inbound
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -j DROP

# Inspect live conntrack
cat /proc/net/nf_conntrack | head -5
conntrack -L -p tcp --dport 443
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a firewall / packet-filter rule — iptables, nftables, pf, or Windows Firewall syntax; modern Linux uses nftables (replaced iptables in RHEL 8 / Debian 11). 2) Default policy must be DROP for INPUT and FORWARD chains — explicit-allow is the only safe posture; default-allow leaks every new service you spin up. 3) Rules match on src/dst IP, port, protocol, connection state — stateful tracking (conntrack) lets you allow ESTABLISHED,RELATED while dropping new inbound. 4) For zero-trust microsegmentation, replace network ACLs with identity-based policies (SPIFFE / SPIRE workload identity) — IP addresses are not identity in the cloud where pods churn every minute.</p>

</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Web Application Firewalls — ModSecurity + OWASP CRS</h2>
<p class="l-text">A WAF inspects HTTP at L7. ModSecurity (originally Ivan Ristic 2002, now maintained by Trustwave SpiderLabs and OWASP) is the open-source standard, deployed inside Apache, nginx, and IIS. The <em>OWASP Core Rule Set</em> ships ~250 rules covering the OWASP Top 10: SQL injection, XSS, path traversal, RCE, scanner detection. Each rule has an anomaly score; cumulative score over a threshold triggers blocking.</p>
<div class="code-wrap"><div class="code-label"><span>MODSECURITY RULE SYNTAX</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Block obvious SQL injection in query string
SecRule ARGS "@detectSQLi" \\
  "id:942100, phase:2, t:none, t:lowercase, \\
   msg:'SQL Injection Attack Detected', \\
   severity:'CRITICAL', \\
   setvar:'tx.sql_injection_score=+%{tx.critical_anomaly_score}', \\
   setvar:'tx.anomaly_score=+%{tx.critical_anomaly_score}'"

# Block if cumulative anomaly score &gt;= 5
SecRule TX:ANOMALY_SCORE "@ge 5" \\
  "id:949110, phase:2, deny, status:403, \\
   msg:'Inbound Anomaly Score Exceeded'"
</code></pre></div>
<p class="l-text"><strong>What this code does, rule by rule:</strong> 1) The first <code>SecRule ARGS "@detectSQLi"</code> runs ModSecurity's built-in libinjection SQL parser over every request argument; <code>phase:2</code> means "after the request body is read but before the app sees it" and the transforms <code>t:none, t:lowercase</code> normalize case before matching. 2) On a hit it accumulates two counters via <code>setvar:'tx.sql_injection_score=+%{tx.critical_anomaly_score}'</code> and the global <code>tx.anomaly_score</code> — the CRS uses scoring rather than per-rule blocking so one false positive does not deny a request. 3) The second rule <code>SecRule TX:ANOMALY_SCORE "@ge 5"</code> is the final gate: only when the cumulative score crosses the threshold (typically 5 for CRITICAL, 4 for paranoia level 2) does it <code>deny, status:403</code>. 4) The unique <code>id:</code> and <code>severity:</code> fields let your SIEM correlate which underlying signatures fired together, so post-incident review can tune the paranoia level per route.</p>

</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Building a Hybrid WAF in Python</h2>
<p class="l-text">Real WAFs combine signatures with anomaly detection. We build a tiny one: regex patterns for known attacks plus an sklearn-trained anomaly score on character n-grams.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Hybrid WAF — regex signatures + IsolationForest anomaly score on URL n-grams</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re, numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import IsolationForest

SIGNATURES = {
    'sqli':     re.compile(r"(?i)(union\\s+select|or\\s+1=1|--|;\\s*drop)"),
    'xss':      re.compile(r"(?i)(&lt;script|onerror=|javascript:)"),
    'traversal':re.compile(r"\\.\\./|\\.\\.%2f", re.I),
    'rce':      re.compile(r"(?i)(\\bcat\\s+/etc|;\\s*cat\\s|\\|\\s*nc\\s)"),
}

# Train an IsolationForest on benign URLs
benign = [
    "/index.html","/api/v1/users","/products?id=42","/login",
    "/static/css/main.css","/api/orders/2024-05-04","/blog/post-123",
] * 20

vec = TfidfVectorizer(analyzer='char', ngram_range=(2,4), max_features=200)
Xb = vec.fit_transform(benign).toarray()
iso = IsolationForest(contamination=0.05, random_state=0).fit(Xb)

def waf(url):
    hits = [k for k, p in SIGNATURES.items() if p.search(url)]
    x = vec.transform([url]).toarray()
    score = -iso.score_samples(x)[0]      # higher = more anomalous
    block = bool(hits) or score &gt; 0.65
    return {'url': url, 'hits': hits, 'anomaly_score': round(score,3), 'block': block}

for u in [
    "/products?id=42",
    "/products?id=1' OR 1=1 --",
    "/api/users?name=&lt;script&gt;alert(1)&lt;/script&gt;",
    "/files?path=../../../etc/passwd",
    "/api/run?cmd=;cat /etc/passwd",
    "/index.html",
]:
    print(waf(u))
</code></pre></div>
</div>
<p class="l-text">Signatures catch known-bad; the IsolationForest catches novel anomalous patterns. Production WAFs (Cloudflare, Akamai Kona, AWS WAF) use far more elaborate ensembles but the architecture is the same.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Microsegmentation — Beyond the Perimeter</h2>
<p class="l-text">Traditional firewalls protect <em>north-south</em> traffic (data center boundary). Once an attacker is inside, lateral <em>east-west</em> traffic is unrestricted — exactly the path Target's 2013 breach took (HVAC vendor → POS network). Microsegmentation enforces per-workload policies: each VM, container, or pod has an identity-aware firewall around it.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">VMware NSX</div><div class="card-body">Distributed firewall in the hypervisor. Policy by VM tag, not IP. Enterprise standard.</div></div>
<div class="calc-card"><div class="card-title">Illumio</div><div class="card-body">Agent-based, OS-native (iptables / Windows Filtering Platform). Continuous policy compute.</div></div>
<div class="calc-card"><div class="card-title">Cilium</div><div class="card-body">eBPF in the Kubernetes data plane. Identity-based L3-L7 policies. Hubble for observability.</div></div>
<div class="calc-card"><div class="card-title">Calico</div><div class="card-body">Kubernetes NetworkPolicy enforcement, BGP fabric. Open-source, by Tigera.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>YAML — KUBERNETES NETWORKPOLICY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-access
  namespace: prod
spec:
  podSelector:
    matchLabels: { app: postgres }
  policyTypes: [Ingress]
  ingress:
  - from:
    - podSelector:
        matchLabels: { tier: api }
    ports:
    - protocol: TCP
      port: 5432
</code></pre></div>
<p class="l-text">Only pods labeled <code>tier=api</code> may reach Postgres on 5432. Anything else is dropped at the eBPF level — no kernel context switch, line rate.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. SDN Security and OpenFlow</h2>
<p class="l-text">In Software-Defined Networking the data plane (switches) is dumb; a centralized controller programs flow rules via OpenFlow. Security implications: a compromised controller is total network compromise — but per-flow ACLs become trivial to deploy. ONOS, OpenDaylight, Open vSwitch are the open-source pillars.</p>
<div class="code-wrap"><div class="code-label"><span>BASH — OPEN VSWITCH FLOW</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Drop traffic from compromised host on port br0
ovs-ofctl add-flow br0 \\
  "priority=1000, ip, nw_src=10.0.5.42, actions=drop"

# Mirror suspicious tenant traffic to IDS
ovs-ofctl add-flow br0 \\
  "priority=900, in_port=12, actions=output:24,output:99"  # 99 = IDS span
</code></pre></div>
<p class="l-text"><strong>What this code does, flow by flow:</strong> 1) <code>ovs-ofctl add-flow br0</code> pushes an OpenFlow rule into the Open vSwitch bridge <code>br0</code> — the SDN controller would normally program this, but the CLI lets ops staff intervene during an incident. 2) The first flow matches <code>ip, nw_src=10.0.5.42</code> at <code>priority=1000</code> with <code>actions=drop</code> — a surgical null-route of one compromised host that survives without touching the rest of the policy table. 3) The second flow matches <code>in_port=12</code> at <code>priority=900</code> with <code>actions=output:24,output:99</code> — a tap that forwards normal traffic to port 24 while mirroring a copy to port 99 where the IDS (Zeek, Suricata) listens. 4) Priorities resolve overlaps deterministically: lower-priority rules only fire when no higher-priority rule matches, so you can layer guard rails without rewriting the whole table.</p>

</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. eBPF and XDP — Filtering at Line Rate</h2>
<p class="l-text">eBPF is a verified bytecode VM in the Linux kernel. XDP (eXpress Data Path, Hoiland-Jorgensen 2018) hooks the eBPF program at the NIC driver, before <code>skb</code> allocation — drop decisions take ~50ns. Cloudflare uses XDP to absorb 100M+ pps DDoS, Meta uses Katran (XDP-based L4 LB). Cilium's entire data plane is eBPF.</p>
<div class="code-wrap"><div class="code-label"><span>C — XDP DROP UDP/53 SOURCE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// Compile with: clang -O2 -target bpf -c xdp_drop.c -o xdp_drop.o
SEC("xdp")
int xdp_drop(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx-&gt;data;
    void *data_end = (void *)(long)ctx-&gt;data_end;
    struct ethhdr *eth = data;
    if ((void*)(eth+1) &gt; data_end) return XDP_PASS;
    if (eth-&gt;h_proto != bpf_htons(ETH_P_IP)) return XDP_PASS;
    struct iphdr *ip = (void*)(eth+1);
    if ((void*)(ip+1) &gt; data_end) return XDP_PASS;
    if (ip-&gt;protocol != IPPROTO_UDP) return XDP_PASS;
    struct udphdr *udp = (void*)(ip+1);
    if ((void*)(udp+1) &gt; data_end) return XDP_PASS;
    if (udp-&gt;source == bpf_htons(53)) return XDP_DROP;  // amplification source
    return XDP_PASS;
}
</code></pre></div>
<p class="l-text">Simulate the same logic from Python on a synthetic packet trace:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
N = 100_000
src_ports = rng.integers(0, 65535, N)
proto     = rng.choice(['tcp','udp','icmp'], N, p=[0.7,0.25,0.05])

def xdp_drop(p, src):
    return p == 'udp' and src == 53

dropped = sum(xdp_drop(p, s) for p, s in zip(proto, src_ports))
print(f"Dropped {dropped} of {N} packets ({dropped/N*100:.2f}%)")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The C snippet above runs as eBPF bytecode hooked at the NIC driver via <code>SEC("xdp")</code> — every incoming frame hits <code>xdp_drop()</code> before the kernel allocates an <code>sk_buff</code>, so the decision is taken in ~50 ns. 2) Pointer-arithmetic bounds checks (<code>(void*)(eth+1) &gt; data_end</code>) satisfy the in-kernel verifier — without them the program is rejected at load time, because eBPF refuses to run anything that might read past packet boundaries. 3) The Python simulator generates 100 000 synthetic flows and applies the same predicate <code>p == 'udp' and src == 53</code> in userspace so you can watch the drop rate without a kernel. 4) In production this is how Cloudflare absorbs 100+ Mpps DDoS and Meta runs Katran L4 LB — XDP_DROP / XDP_TX / XDP_REDIRECT actions cover filtering, in-place TX, and CPU/queue steering at line rate.</p>

</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Defense-in-Depth Layering</h2>
<p class="l-text">No single layer suffices. A modern data center stacks: (a) perimeter stateful firewall (north-south); (b) WAF on every public ingress; (c) microsegmentation policies between every workload pair; (d) eBPF/XDP for DDoS absorption; (e) IDS/IPS visibility on east-west; (f) zero-trust identity at the application layer (lesson 10). Each layer assumes the others may fail. Defense-in-depth is the operating philosophy.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">The Equifax 2017 breach (Apache Struts CVE-2017-5638) bypassed the WAF because the vulnerability lived inside Content-Type parsing — exactly where ModSecurity's pre-processing was disabled. Layered defense is necessary, but each layer must also be configured correctly. Audit every layer.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Production Tooling Recap</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Open source</div><div class="card-body">iptables, nftables, pf, ModSecurity, OWASP CRS, Cilium, Calico, Open vSwitch.</div></div>
<div class="calc-card"><div class="card-title">Commercial</div><div class="card-body">Palo Alto NGFW, Cisco Firepower, Check Point, Fortinet, F5 BIG-IP, VMware NSX, Illumio.</div></div>
<div class="calc-card"><div class="card-title">Cloud-native</div><div class="card-body">AWS WAF, Cloudflare WAF, Azure Firewall, GCP Cloud Armor. Managed rule sets + custom rules.</div></div>
</div>
</div>`,
tr: `<p class="l-text">1988'de Digital Equipment Corporation ilk ticari paket filtresini dağıttı — başlık tüplerine dayanarak paketlere izin veren veya reddeden durumsuz bir gateway. Altı yıl sonra, Check Point <em>stateful inspection</em> ile FireWall-1'i gönderdi: TCP bağlantı durumunu izleyerek bir giden istekten dönen paket otomatik olarak izin verilirken istenmeyen gelen paketler düşürüldü. Stateful firewall'lar perimeter'in iş atı olarak kalır, ama perimeter çözüldü. Bugünün savunmaları L7'de Web Application Firewall'ları (WAF), doğu-batı trafiği içinde microsegmentation politikaları, akış başına politikayı yeniden yapılandıran software-defined network (SDN) controller'ları ve paket userspace'e ulaşmadan önce kernel içinde line-rate'te filtreleyen eBPF/XDP programları katmanlar.</p>
<p class="l-text">Bu ders modern yığını haritalar: <em>conntrack</em> tabloları üzerinde stateful inspection; WAF'lar için ModSecurity ve OWASP Core Rule Set (CRS); VMware NSX, Illumio ve Cilium ile microsegmentation; OpenFlow ACL'leriyle SDN güvenliği; ve sub-mikrosaniye paket kararları için BPF/XDP. Python'da çalıştırılabilir bir WAF kural motoru inşa ediyoruz — regex tabanlı kalıp eşleştirme artı sklearn-eğitimli anomali skoru — bench'te genişletebileceğin.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Durumsuz vs stateful paket filtreleme ve conntrack'in nasıl çalıştığı</li>
<li>Web Application Firewall'lar — ModSecurity ve OWASP Core Rule Set</li>
<li>Microsegmentation: NSX, Illumio, Cilium ağ politikaları</li>
<li>SDN güvenliği ve OpenFlow ACL'leri</li>
<li>Line-rate paket filtreleme için BPF / XDP / eBPF</li>
<li>scikit-learn'de regex + ML hibrit WAF inşa etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Stateful Inspection — Conntrack Tablosu</h2>
<p class="l-text">Bir stateful firewall 5-tüp (src IP, dst IP, src port, dst port, protokol) üzerinde anahtarlanmış bir hash tablosu tutar. Bir giden TCP SYN dışarı çıktığında, NEW durumlu bir kayıt oluşturulur; SYN-ACK yanıtında durum ESTABLISHED'e ilerler. Linux netfilter'ın <code>nf_conntrack</code>'i klasik uygulamadır: kernel modülü, meşgul yük dengeleyicilerde ~16 GB tablolar, <code>/proc/net/nf_conntrack</code> yoluyla userspace'e açılır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durumsuz</div><div class="card-body">Paket başına karar. Cisco ACL'leri, AWS NACL'leri. Hızlı, basit, akış bağlamına kör.</div></div>
<div class="calc-card"><div class="card-title">Stateful</div><div class="card-body">Akış başına karar. iptables, pf, AWS Security Group'ları. TCP durumunu, ICMP çiftlerini, NAT eşlemelerini izler.</div></div>
<div class="calc-card"><div class="card-title">Uygulama-farkında</div><div class="card-body">L7 inceleme — HTTP, DNS, TLS SNI. Palo Alto Networks, Suricata. Ağır CPU ama malware-farkında.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>BASH — IPTABLES STATEFUL RULES</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Established/related izin ver, gelen her şeyi düşür
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -j ACCEPT
iptables -A INPUT -j DROP

# Canlı conntrack incele
cat /proc/net/nf_conntrack | head -5
conntrack -L -p tcp --dport 443
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Bir firewall / packet-filter kuralı tanımlar — iptables, nftables, pf veya Windows Firewall sözdizimi; modern Linux nftables kullanır (RHEL 8 / Debian 11'de iptables'ı değiştirdi). 2) INPUT ve FORWARD zincirlerinde default policy DROP olmalı — explicit-allow tek güvenli duruş; default-allow açtığın her yeni servisi sızdırır. 3) Kurallar src/dst IP, port, protokol, bağlantı durumuna göre eşleşir — stateful tracking (conntrack) ESTABLISHED,RELATED'a izin verirken yeni gelen bağlantıları düşürmenizi sağlar. 4) Zero-trust microsegmentation için network ACL'leri identity-based policy'lerle değiştir (SPIFFE / SPIRE workload identity) — pod'ların dakikada bir değiştiği bulutta IP adresi kimlik değildir.</p>

</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Web Application Firewall'ları — ModSecurity + OWASP CRS</h2>
<p class="l-text">Bir WAF L7'de HTTP'yi inceler. ModSecurity (orijinali Ivan Ristic 2002, şimdi Trustwave SpiderLabs ve OWASP tarafından bakımlı) açık kaynak standardıdır, Apache, nginx ve IIS içinde dağıtılır. <em>OWASP Core Rule Set</em> OWASP Top 10'u kapsayan ~250 kural gönderir: SQL injection, XSS, path traversal, RCE, scanner tespiti. Her kuralın anomali skoru vardır; eşik üzerinde kümülatif skor engellemeyi tetikler.</p>
<div class="code-wrap"><div class="code-label"><span>MODSECURITY RULE SYNTAX</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Sorgu dizesinde belirgin SQL injection'ı engelle
SecRule ARGS "@detectSQLi" \\
  "id:942100, phase:2, t:none, t:lowercase, \\
   msg:'SQL Injection Attack Detected', \\
   severity:'CRITICAL', \\
   setvar:'tx.sql_injection_score=+%{tx.critical_anomaly_score}', \\
   setvar:'tx.anomaly_score=+%{tx.critical_anomaly_score}'"

# Kümülatif anomali skoru &gt;= 5 ise engelle
SecRule TX:ANOMALY_SCORE "@ge 5" \\
  "id:949110, phase:2, deny, status:403, \\
   msg:'Inbound Anomaly Score Exceeded'"
</code></pre></div>
<p class="l-text"><strong>Kuralları sırayla okuyalım:</strong> 1) İlk <code>SecRule ARGS "@detectSQLi"</code> ModSecurity'nin yerleşik libinjection SQL parser'ını her istek argümanı üzerinde çalıştırır; <code>phase:2</code> "istek gövdesi okunduktan ama uygulama görmeden önce" anlamına gelir ve <code>t:none, t:lowercase</code> dönüşümleri eşleştirmeden önce büyük-küçük harf normalizasyonu yapar. 2) Eşleşmede <code>setvar:'tx.sql_injection_score=+%{tx.critical_anomaly_score}'</code> ile iki sayacı ve global <code>tx.anomaly_score</code>'u biriktirir — CRS, tek bir false-positive'in isteği reddetmemesi için kural-başı engelleme yerine skorlama kullanır. 3) İkinci kural <code>SecRule TX:ANOMALY_SCORE "@ge 5"</code> son kapıdır: yalnızca kümülatif skor eşiği aştığında (tipik olarak CRITICAL için 5, paranoia seviyesi 2 için 4) <code>deny, status:403</code> uygular. 4) Benzersiz <code>id:</code> ve <code>severity:</code> alanları SIEM'inizin hangi temel imzaların birlikte tetiklendiğini ilişkilendirmesini sağlar; böylece olay sonrası inceleme paranoia seviyesini route bazında ayarlayabilir.</p>

</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Python'da Hibrit WAF İnşa Etmek</h2>
<p class="l-text">Gerçek WAF'lar imzaları anomali tespitiyle birleştirir. Küçük bir tane inşa ediyoruz: bilinen saldırılar için regex kalıpları artı karakter n-gram'ları üzerinde sklearn-eğitilmiş bir anomali skoru.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Hibrit WAF — regex imzaları + URL n-gramlarında IsolationForest anomali skoru</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re, numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import IsolationForest

SIGNATURES = {
    'sqli':     re.compile(r"(?i)(union\\s+select|or\\s+1=1|--|;\\s*drop)"),
    'xss':      re.compile(r"(?i)(&lt;script|onerror=|javascript:)"),
    'traversal':re.compile(r"\\.\\./|\\.\\.%2f", re.I),
    'rce':      re.compile(r"(?i)(\\bcat\\s+/etc|;\\s*cat\\s|\\|\\s*nc\\s)"),
}

# Zararsız URL'lerde IsolationForest eğit
benign = [
    "/index.html","/api/v1/users","/products?id=42","/login",
    "/static/css/main.css","/api/orders/2024-05-04","/blog/post-123",
] * 20

vec = TfidfVectorizer(analyzer='char', ngram_range=(2,4), max_features=200)
Xb = vec.fit_transform(benign).toarray()
iso = IsolationForest(contamination=0.05, random_state=0).fit(Xb)

def waf(url):
    hits = [k for k, p in SIGNATURES.items() if p.search(url)]
    x = vec.transform([url]).toarray()
    score = -iso.score_samples(x)[0]      # yüksek = daha anormal
    block = bool(hits) or score &gt; 0.65
    return {'url': url, 'hits': hits, 'anomaly_score': round(score,3), 'block': block}

for u in [
    "/products?id=42",
    "/products?id=1' OR 1=1 --",
    "/api/users?name=&lt;script&gt;alert(1)&lt;/script&gt;",
    "/files?path=../../../etc/passwd",
    "/api/run?cmd=;cat /etc/passwd",
    "/index.html",
]:
    print(waf(u))
</code></pre></div>
</div>
<p class="l-text">İmzalar bilinen-kötüyü yakalar; IsolationForest yeni anormal kalıpları yakalar. Üretim WAF'ları (Cloudflare, Akamai Kona, AWS WAF) çok daha karmaşık topluluklar kullanır ama mimari aynıdır.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Microsegmentation — Perimeter'in Ötesinde</h2>
<p class="l-text">Geleneksel firewall'lar <em>kuzey-güney</em> trafiğini korur (veri merkezi sınırı). Bir saldırgan içeride olduğunda, yanal <em>doğu-batı</em> trafiği kısıtlanmamıştır — tam olarak Target'ın 2013 ihlalinin aldığı yol (HVAC satıcısı → POS ağı). Microsegmentation iş yükü-başı politikaları uygular: her VM, container veya pod etrafında kimlik-farkında bir firewall vardır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">VMware NSX</div><div class="card-body">Hipervizörde dağıtık firewall. IP'ye değil VM tag'ine göre politika. Kurumsal standart.</div></div>
<div class="calc-card"><div class="card-title">Illumio</div><div class="card-body">Ajan-tabanlı, OS-yerli (iptables / Windows Filtering Platform). Sürekli politika hesaplama.</div></div>
<div class="calc-card"><div class="card-title">Cilium</div><div class="card-body">Kubernetes veri düzleminde eBPF. Kimlik-tabanlı L3-L7 politikalar. Gözlenebilirlik için Hubble.</div></div>
<div class="calc-card"><div class="card-title">Calico</div><div class="card-body">Kubernetes NetworkPolicy uygulaması, BGP fabric. Açık kaynak, Tigera tarafından.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>YAML — KUBERNETES NETWORKPOLICY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-access
  namespace: prod
spec:
  podSelector:
    matchLabels: { app: postgres }
  policyTypes: [Ingress]
  ingress:
  - from:
    - podSelector:
        matchLabels: { tier: api }
    ports:
    - protocol: TCP
      port: 5432
</code></pre></div>
<p class="l-text">Yalnızca <code>tier=api</code> etiketli pod'lar 5432'de Postgres'e ulaşabilir. Başka her şey eBPF düzeyinde düşürülür — kernel context switch yok, line rate.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. SDN Güvenliği ve OpenFlow</h2>
<p class="l-text">Software-Defined Networking'de veri düzlemi (anahtarlar) aptaldır; merkezi bir controller OpenFlow yoluyla akış kuralları programlar. Güvenlik sonuçları: ele geçirilmiş bir controller toplam ağ ele geçirilmesidir — ama akış-başı ACL'leri dağıtmak önemsiz hale gelir. ONOS, OpenDaylight, Open vSwitch açık kaynak sütunlarıdır.</p>
<div class="code-wrap"><div class="code-label"><span>BASH — OPEN VSWITCH FLOW</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># br0 portunda ele geçirilmiş host'tan trafiği düşür
ovs-ofctl add-flow br0 \\
  "priority=1000, ip, nw_src=10.0.5.42, actions=drop"

# Şüpheli kiracı trafiğini IDS'e yansıt
ovs-ofctl add-flow br0 \\
  "priority=900, in_port=12, actions=output:24,output:99"  # 99 = IDS span
</code></pre></div>
<p class="l-text"><strong>Akış kuralları sırayla:</strong> 1) <code>ovs-ofctl add-flow br0</code> bir OpenFlow kuralını Open vSwitch köprüsü <code>br0</code>'a iter — normalde SDN controller bunu programlar, ama CLI olay anında ops ekibinin doğrudan müdahale etmesine izin verir. 2) İlk akış <code>ip, nw_src=10.0.5.42</code> ile <code>priority=1000</code>'de eşleşir ve <code>actions=drop</code> uygular — ele geçirilmiş tek bir host'un cerrahi null-route'u; politika tablosunun geri kalanına dokunmaz. 3) İkinci akış <code>in_port=12</code>'de <code>priority=900</code> ile eşleşir ve <code>actions=output:24,output:99</code> yapar — normal trafiği port 24'e iletirken bir kopyayı IDS'in (Zeek, Suricata) dinlediği port 99'a yansıtan bir tap. 4) Öncelikler çakışmaları deterministik çözer: düşük öncelikli kurallar yalnızca daha yüksek öncelikli bir kural eşleşmediğinde tetiklenir — böylece tüm tabloyu yeniden yazmadan koruma katmanları ekleyebilirsiniz.</p>

</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. eBPF ve XDP — Line Rate'te Filtreleme</h2>
<p class="l-text">eBPF Linux kernel'inde doğrulanmış bir bytecode VM'dir. XDP (eXpress Data Path, Hoiland-Jorgensen 2018) eBPF programını NIC sürücüsünde, <code>skb</code> ayırmasından önce hooklar — drop kararları ~50ns alır. Cloudflare 100M+ pps DDoS'u absorbe etmek için XDP kullanır, Meta Katran (XDP-tabanlı L4 LB) kullanır. Cilium'un tüm veri düzlemi eBPF'tir.</p>
<div class="code-wrap"><div class="code-label"><span>C — XDP DROP UDP/53 SOURCE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// Derle: clang -O2 -target bpf -c xdp_drop.c -o xdp_drop.o
SEC("xdp")
int xdp_drop(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx-&gt;data;
    void *data_end = (void *)(long)ctx-&gt;data_end;
    struct ethhdr *eth = data;
    if ((void*)(eth+1) &gt; data_end) return XDP_PASS;
    if (eth-&gt;h_proto != bpf_htons(ETH_P_IP)) return XDP_PASS;
    struct iphdr *ip = (void*)(eth+1);
    if ((void*)(ip+1) &gt; data_end) return XDP_PASS;
    if (ip-&gt;protocol != IPPROTO_UDP) return XDP_PASS;
    struct udphdr *udp = (void*)(ip+1);
    if ((void*)(udp+1) &gt; data_end) return XDP_PASS;
    if (udp-&gt;source == bpf_htons(53)) return XDP_DROP;  // amplification kaynağı
    return XDP_PASS;
}
</code></pre></div>
<p class="l-text">Aynı mantığı Python'dan sentetik bir paket izi üzerinde simüle et:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
N = 100_000
src_ports = rng.integers(0, 65535, N)
proto     = rng.choice(['tcp','udp','icmp'], N, p=[0.7,0.25,0.05])

def xdp_drop(p, src):
    return p == 'udp' and src == 53

dropped = sum(xdp_drop(p, s) for p, s in zip(proto, src_ports))
print(f"Dropped {dropped} of {N} packets ({dropped/N*100:.2f}%)")
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Yukarıdaki C kodu <code>SEC("xdp")</code> ile NIC sürücüsüne hook'lanmış eBPF bytecode olarak çalışır — gelen her frame <code>xdp_drop()</code>'a, kernel bir <code>sk_buff</code> tahsis etmeden önce çarpar, böylece karar ~50 ns'de alınır. 2) Pointer aritmetik sınır kontrolleri (<code>(void*)(eth+1) &gt; data_end</code>) kernel-içi verifier'ı tatmin eder — bunlar olmadan program load zamanında reddedilir; eBPF, paket sınırının ötesini okuyabilecek hiçbir programı çalıştırmaz. 3) Python simülatörü 100 000 sentetik akış üretir ve aynı <code>p == 'udp' and src == 53</code> koşulunu kullanıcı alanında uygular; böylece drop oranını kernel olmadan izleyebilirsiniz. 4) Üretimde Cloudflare 100+ Mpps DDoS'u böyle emer ve Meta Katran L4 LB'yi böyle koşturur — XDP_DROP / XDP_TX / XDP_REDIRECT eylemleri filtreleme, yerinde TX ve CPU/kuyruk yönlendirmesini line-rate'te kapsar.</p>

</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Derinlemesine Savunma Katmanlaması</h2>
<p class="l-text">Tek katman yetmez. Modern bir veri merkezi şunları yığar: (a) perimeter stateful firewall (kuzey-güney); (b) her kamu girişinde WAF; (c) her iş yükü çifti arasında microsegmentation politikaları; (d) DDoS absorpsiyonu için eBPF/XDP; (e) doğu-batıda IDS/IPS görünürlüğü; (f) uygulama katmanında sıfır güven kimliği (ders 10). Her katman diğerlerinin başarısız olabileceğini varsayar. Derinlemesine savunma işletim felsefesidir.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Equifax 2017 ihlali (Apache Struts CVE-2017-5638) WAF'ı atlattı çünkü zafiyet Content-Type ayrıştırma içinde yaşıyordu — tam olarak ModSecurity'nin ön-işlemesinin devre dışı bırakıldığı yer. Katmanlı savunma gereklidir, ama her katmanın da doğru yapılandırılması gerekir. Her katmanı denetle.</div>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Üretim Araç Seti Özeti</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Açık kaynak</div><div class="card-body">iptables, nftables, pf, ModSecurity, OWASP CRS, Cilium, Calico, Open vSwitch.</div></div>
<div class="calc-card"><div class="card-title">Ticari</div><div class="card-body">Palo Alto NGFW, Cisco Firepower, Check Point, Fortinet, F5 BIG-IP, VMware NSX, Illumio.</div></div>
<div class="calc-card"><div class="card-title">Bulut-yerli</div><div class="card-body">AWS WAF, Cloudflare WAF, Azure Firewall, GCP Cloud Armor. Yönetilen kural setleri + özel kurallar.</div></div>
</div>
</div>`
};
