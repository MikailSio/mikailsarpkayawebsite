window.FORENSICS_L6 = {
en: `<p class="l-text"><strong>Network forensics is the art of reading the conversation between machines after the fact.</strong> Every TCP handshake, every DNS query, every TLS ClientHello is — by the laws of physics — observable somewhere on the wire, and full-content packet capture (PCAP) makes that observation permanent. The discipline crystallized in the 1990s with <strong>tcpdump</strong> (Van Jacobson, 1988) and the <strong>libpcap</strong> library, professionalized with <strong>Wireshark</strong> (Gerald Combs, 1998 as Ethereal), and was given an analytical brain by <strong>Zeek</strong> (Vern Paxson, 1996, originally "Bro") — the framework that turns raw packets into rich logs (<code>conn.log</code>, <code>dns.log</code>, <code>http.log</code>, <code>ssl.log</code>, <code>x509.log</code>).</p>

<p class="l-text">In this lesson we cover the full network-forensics stack: Wireshark display filter syntax (the surgical scalpel), <code>tshark</code> for batch processing, Zeek for deriving structured intelligence, NetFlow/IPFIX for high-volume metadata-only telemetry, the encrypted-traffic problem (TLS 1.3 + ECH = "we can't see anything"), and the <strong>JA3/JA4 fingerprinting</strong> revolution that lets you classify TLS clients without decrypting them. Capstone: an IsolationForest detector on synthetic flow features.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Wireshark display filters: <code>tcp.flags.syn==1</code>, <code>http.request.method=="POST"</code>, <code>tls.handshake.extensions_server_name</code></li>
<li>Drive <code>tshark</code> from scripts to extract DNS, HTTP, TLS metadata at scale</li>
<li>Run Zeek and read its tab-separated logs; write a Zeek script for custom detection</li>
<li>Compare full PCAP vs NetFlow/IPFIX/sFlow — when each is the right answer</li>
<li>Compute JA3 and JA4 TLS fingerprints; understand why JA4 fixed JA3's collisions</li>
<li>Train an IsolationForest on flow features to detect beaconing</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Capture Stack — libpcap to Wireshark</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">libpcap / Npcap</div><div class="card-body">User-space capture API. On Linux uses <code>AF_PACKET</code>. On Windows, Npcap (Insecure.com, supersedes WinPcap) ships with Wireshark. PCAP-NG is the modern multi-interface format.</div></div>
<div class="calc-card"><div class="card-title">tcpdump / dumpcap</div><div class="card-body">CLI capture. <code>tcpdump -i eth0 -w out.pcap "host 8.8.8.8 and port 53"</code>. BPF filter language compiled to in-kernel bytecode for line-rate filtering.</div></div>
<div class="calc-card"><div class="card-title">Wireshark</div><div class="card-body">GUI dissector for ~3000 protocols. Display filters (different from BPF capture filters) operate on the parsed tree.</div></div>
<div class="calc-card"><div class="card-title">tshark</div><div class="card-body">Wireshark's CLI sibling. Same dissectors, scriptable. <code>tshark -r in.pcap -Y "tls" -T fields -e ip.src -e tls.handshake.extensions_server_name</code>.</div></div>
</div>

<div class="calc-highlight"><strong>BPF (capture-time)</strong> filters use kernel bytecode — fast, dumb, syntax like <code>tcp port 443 and host 1.2.3.4</code>. <strong>Display filters</strong> (Wireshark) work on the parsed tree — slow, smart, syntax like <code>tcp.flags.syn==1 and tls.handshake.type==1</code>. Different languages, common confusion.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Wireshark Display Filters You'll Use Daily</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SYN floods / scans</div><div class="card-body"><code>tcp.flags.syn==1 and tcp.flags.ack==0</code></div></div>
<div class="calc-card"><div class="card-title">Suspicious DNS</div><div class="card-body"><code>dns.qry.name contains "dyndns" or dns.qry.name matches "[a-z0-9]{20,}\\.com"</code></div></div>
<div class="calc-card"><div class="card-title">HTTP POSTs to weird paths</div><div class="card-body"><code>http.request.method=="POST" and http.request.uri matches "/[a-z]{8}\\.php"</code></div></div>
<div class="calc-card"><div class="card-title">TLS SNI exfil</div><div class="card-body"><code>tls.handshake.extensions_server_name contains "pastebin" or contains ".onion"</code></div></div>
<div class="calc-card"><div class="card-title">Self-signed certs</div><div class="card-body"><code>x509ce.dNSName == x509sat.IA5String</code> &amp; issuer == subject</div></div>
<div class="calc-card"><div class="card-title">Beaconing (Statistics → I/O Graph)</div><div class="card-body">Rhythmic flat-period sends with low jitter — Cobalt Strike default 60s sleep, Sliver 5s.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. tshark for Scripted Triage</h2>
<p class="l-text">Wireshark GUI is for one PCAP. <code>tshark</code> is for 10,000. The pattern: extract structured fields, pipe to Pandas/SQLite, ask analytical questions.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import subprocess, pandas as pd, io

def tshark_extract(pcap, fields, display_filter=""):
    cmd = ["tshark","-r",pcap,"-T","fields","-E","header=y","-E","separator=\\t"]
    for f in fields: cmd += ["-e", f]
    if display_filter: cmd += ["-Y", display_filter]
    out = subprocess.check_output(cmd, text=True)
    return pd.read_csv(io.StringIO(out), sep="\\t")

# All TLS ClientHellos: source, SNI, JA3
tls = tshark_extract("traffic.pcap",
    ["ip.src","tls.handshake.extensions_server_name","tls.handshake.ja3"],
    'tls.handshake.type==1')
print("Top SNIs:")
print(tls['tls.handshake.extensions_server_name'].value_counts().head(10))

# Top 10 noisiest source IPs
flows = tshark_extract("traffic.pcap", ["ip.src","ip.dst","_ws.col.Length"])
top = flows.groupby("ip.src")["_ws.col.Length"].sum().sort_values(ascending=False).head(10)
print("\\nTop talkers (bytes):")
print(top)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>tshark_extract()</code> builds a <code>tshark</code> command with <code>-T fields -E header=y -E separator=\\t</code>, appends one <code>-e &lt;field&gt;</code> per requested column, and optionally a <code>-Y</code> display filter — then pipes the tab-separated output straight into <code>pd.read_csv</code>. 2) First call pulls every TLS ClientHello with <code>tls.handshake.type==1</code> and grabs three columns: source IP, SNI (the cleartext hostname), and JA3 (the client-fingerprint hash). 3) <code>value_counts().head(10)</code> on the SNI column ranks the top destinations — non-corporate or DGA-style hostnames jump out instantly. 4) Second call extracts <code>(src, dst, frame length)</code> for every packet; a Pandas <code>groupby("ip.src").sum()</code> + descending sort exposes the "top talkers" — large outbound byte volumes from a workstation IP are the canonical exfiltration tell.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Zeek — Network as Logs</h2>
<p class="l-text">Where Wireshark dumps packets, <strong>Zeek</strong> emits <em>events</em> and structured logs. A 10-minute PCAP becomes:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">conn.log</div><div class="card-body">One row per flow: 5-tuple, duration, bytes, conn-state (S0=SYN no reply, REJ=rejected, RSTR=server reset).</div></div>
<div class="calc-card"><div class="card-title">dns.log</div><div class="card-body">Every query and answer: query name, type, response, TTL.</div></div>
<div class="calc-card"><div class="card-title">http.log</div><div class="card-body">Method, host, URI, user-agent, status code, response body length.</div></div>
<div class="calc-card"><div class="card-title">ssl.log + x509.log</div><div class="card-body">TLS version, cipher, SNI, JA3/JA3S; full cert chain with subject/issuer/SAN.</div></div>
<div class="calc-card"><div class="card-title">files.log</div><div class="card-body">Every file Zeek extracted from any protocol — with MD5/SHA1/SHA256.</div></div>
<div class="calc-card"><div class="card-title">notice.log</div><div class="card-body">Detections fired by Zeek scripts (port-scan, SSL-blacklist, etc.).</div></div>
</div>

<div class="calc-highlight">Zeek's secret is the scripting language: every protocol event is hookable. A 6-line script can detect "domain generation algorithm beacons" by entropy of DNS labels — production SOCs run hundreds of such scripts.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. NetFlow / IPFIX / sFlow — Metadata at Scale</h2>
<p class="l-text">Full PCAP at 100 Gbps backbone is 12.5 GB/sec — unsustainable. <strong>NetFlow v9</strong> (Cisco, 2003) and the IETF-standardized <strong>IPFIX</strong> (RFC 7011) export per-flow records: src/dst IP, ports, protocol, packets, bytes, TCP flags. <strong>sFlow</strong> (RFC 3176) does packet sampling instead. SOCs run on flow data; PCAP gets captured selectively.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Read a NetFlow CSV exported from nfdump and find scanners
import pandas as pd
flows = pd.read_csv("netflow.csv")  # cols: ts,src,dst,sport,dport,proto,pkts,bytes

# Heuristic 1: source touches &gt; 200 distinct dst IPs in 60s = horizontal scan
scans = flows.groupby("src")["dst"].nunique().sort_values(ascending=False)
print("Suspected scanners:")
print(scans.head(5))

# Heuristic 2: source touches one dst on &gt; 100 distinct dports = vertical scan
vert = flows.groupby(["src","dst"])["dport"].nunique().sort_values(ascending=False)
print("\\nSuspected vertical scans:")
print(vert.head(5))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Reads an <code>nfdump</code>-exported NetFlow CSV into <code>pd.DataFrame</code> with the canonical eight columns — timestamp, src, dst, sport, dport, proto, pkts, bytes. 2) Horizontal-scan heuristic: <code>groupby("src")["dst"].nunique()</code> counts how many distinct destination IPs each source touches; the top-5 sources sorted descending are the classic <em>"one host hits the whole subnet"</em> pattern that Nmap and Masscan leave behind. 3) Vertical-scan heuristic: <code>groupby(["src","dst"])["dport"].nunique()</code> counts distinct destination ports per src-dst pair; high counts mean one source is sweeping all ports on one target — the canonical port-scan fingerprint. 4) Both pipelines fit in 4 lines because flow records already discard payload — exactly why NetFlow/IPFIX scales to backbone speeds where full PCAP cannot.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. JA3, JA3S, JA4 — Fingerprinting TLS Without Decryption</h2>
<p class="l-text">TLS 1.3 hides almost everything that used to be visible (SNI now optional via Encrypted Client Hello), but the <strong>ClientHello</strong> remains in cleartext, and its <em>shape</em> — the ordered list of cipher suites, extensions, supported groups, EC point formats — is unique to a TLS implementation. This is what JA3 (Salesforce, 2017) captures.</p>

<div class="calc-highlight"><strong>JA3</strong>: MD5 of <code>SSLVersion,Ciphers,Extensions,EllipticCurves,EllipticCurvePointFormats</code>. Every value comma-joined, dashes inside lists. Cobalt Strike 4.x had a stable JA3 of <code>72a589da586844d7f0818ce684948eea</code> — instant detection until they added randomization. <strong>JA4</strong> (FoxIO, 2023) fixes JA3's collisions: separates QUIC vs TCP, splits cipher and extension hashes, sorts deterministically.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib

# Simplified JA3 builder for a parsed ClientHello dict
def ja3(ch):
    ciphers = "-".join(str(c) for c in ch["ciphers"])
    exts    = "-".join(str(e) for e in ch["extensions"])
    curves  = "-".join(str(c) for c in ch["curves"])
    pfmts   = "-".join(str(p) for p in ch["point_formats"])
    s = f"{ch['version']},{ciphers},{exts},{curves},{pfmts}"
    return s, hashlib.md5(s.encode()).hexdigest()

# Hypothetical Chrome 124 ClientHello
chrome = {
  "version": 771, "ciphers": [4865,4866,4867,49195,49199,49196],
  "extensions": [0,11,10,35,16,5,13,18,51,45,43,27,17513],
  "curves": [29,23,24], "point_formats": [0],
}
s, h = ja3(chrome)
print("JA3 string:", s)
print("JA3 hash:  ", h)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>ja3(ch)</code> takes a parsed ClientHello dict and dash-joins four ordered lists exactly as the 2017 Salesforce spec demands — <code>ciphers</code>, <code>extensions</code>, supported <code>curves</code>, EC <code>point_formats</code>. 2) Comma-joins those four with the <code>version</code> as the leading field, producing the canonical JA3 string. 3) <code>hashlib.md5(s.encode()).hexdigest()</code> collapses that string into the 32-hex-char fingerprint that ships in every IDS rule and threat-intel feed. 4) The Chrome 124 example uses real cipher IDs (4865 = TLS_AES_128_GCM_SHA256) and TLS 1.3 extensions (51 = key_share, 43 = supported_versions, 17513 = ALPS) — change a single byte in any list and the hash flips, which is exactly why Cobalt Strike's static <code>72a589da...</code> fingerprint was instant-detection until they added randomization.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Encrypted Traffic Analysis — What's Left After TLS 1.3</h2>
<p class="l-text">TLS 1.3 (RFC 8446, 2018) encrypts the certificate, removes static RSA, mandates forward secrecy. ECH (Encrypted Client Hello, RFC 9460+) hides the SNI. So what can we still see? More than you'd think:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">5-tuple + bytes/packets</div><div class="card-body">src, dst, ports, proto, byte counts in each direction. Flow shape alone classifies traffic categories at &gt; 95% accuracy with simple ML.</div></div>
<div class="calc-card"><div class="card-title">JA3/JA4</div><div class="card-body">Client implementation fingerprint stays visible. Catches malware-specific TLS stacks (boringssl-pinned Cobalt Strike, Go default TLS for Sliver).</div></div>
<div class="calc-card"><div class="card-title">QUIC / HTTP/3</div><div class="card-body">UDP-on-443. Less observable, but JA4Q gives QUIC fingerprints.</div></div>
<div class="calc-card"><div class="card-title">Timing &amp; size patterns</div><div class="card-body">Cetus (2018) showed Tor circuits identifiable; "BLINDed"-style attacks recognize HTTP/2 site by burst patterns alone. C2 beaconing is trivial to spot from ISI distribution.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Beacon Detection with sklearn IsolationForest</h2>
<p class="l-text">A C2 beacon shows three statistical fingerprints: small, periodic, low-jitter. Synthesize 800 normal flows + 20 beaconing flows and let IsolationForest find them.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(13)

def normal_flow():
    return dict(
      bytes_out= rng.gamma(2.0, 5000),     # heavy variability
      bytes_in = rng.gamma(2.0, 8000),
      duration = rng.gamma(1.5, 30),
      pkt_count= rng.integers(20, 500),
      isi_std  = rng.gamma(2.0, 0.5),       # high inter-send jitter
    )
def beacon_flow():
    return dict(
      bytes_out= rng.normal(900, 50),       # tiny, near-constant
      bytes_in = rng.normal(120, 20),
      duration = rng.normal(3600, 30),      # long-lived
      pkt_count= rng.integers(58, 62),      # 60-second beacon over 1h
      isi_std  = rng.normal(0.05, 0.01),    # near-zero jitter
    )

rows = [normal_flow() for _ in range(800)] + [beacon_flow() for _ in range(20)]
df = pd.DataFrame(rows)
df["label"] = ["normal"]*800 + ["beacon"]*20

iso = IsolationForest(contamination=0.025, random_state=13).fit(df.drop(columns=["label"]))
df["anom"] = -iso.decision_function(df.drop(columns=["label","anom"], errors="ignore"))
flagged = df.sort_values("anom", ascending=False).head(20)
hit_rate = (flagged["label"]=="beacon").mean()
print(f"Recall in top 20: {hit_rate:.0%}  ({(flagged['label']=='beacon').sum()}/20 beacons)")
print(flagged.head(8).to_string(index=False))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>normal_flow()</code> draws five features per flow from heavy-tailed gamma distributions — variable byte volumes, variable duration, high inter-send jitter <code>isi_std</code> — the messy shape of real user traffic. 2) <code>beacon_flow()</code> swaps gammas for tight Gaussians: ~900 bytes out, ~120 bytes in, ~60 packets in an hour (one ping per minute), and an <code>isi_std</code> of 0.05 — the three statistical fingerprints (small, periodic, low-jitter) that Cobalt Strike default beacons leave behind. 3) Builds 800 normal + 20 beacon rows into a <code>DataFrame</code> and fits <code>IsolationForest(contamination=0.025)</code> — telling the model to expect ~2.5% anomalies. 4) <code>-iso.decision_function</code> flips sign so high scores = more anomalous; sorts and takes top 20, then computes the recall — how many of the 20 planted beacons actually surfaced in the top-20 flags. The number prints, and it should be near 100%.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same beacon-vs-normal flow simulation with IsolationForest in browser-side Pyodide.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest
rng = np.random.default_rng(13)
def normal():  return [rng.gamma(2,5000), rng.gamma(2,8000), rng.gamma(1.5,30), rng.integers(20,500), rng.gamma(2,0.5)]
def beacon():  return [rng.normal(900,50), rng.normal(120,20), rng.normal(3600,30), rng.integers(58,62), rng.normal(0.05,0.01)]
X = np.array([normal() for _ in range(800)] + [beacon() for _ in range(20)])
y = np.array(["n"]*800 + ["B"]*20)
iso = IsolationForest(contamination=0.025, random_state=13).fit(X)
score = -iso.decision_function(X)
order = np.argsort(score)[::-1][:20]
recall = (y[order]=="B").mean()
print(f"Beacon recall in top 20: {recall:.0%}")
print("Top-20 labels:", "".join(y[order]))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BPF capture filters vs Wireshark display filters — different languages.</li>
<li>tshark drives PCAP triage at scale, feed it to Pandas.</li>
<li>Zeek converts packets into structured logs (conn, dns, http, ssl, files, x509).</li>
<li>NetFlow/IPFIX is the only viable telemetry at 100 Gbps; PCAP captured selectively.</li>
<li>JA3/JA4 fingerprint TLS clients without decryption — the encrypted-traffic backbone.</li>
<li>IsolationForest on flow features finds beacons unsupervised.</li>
</ul>
</div>
<p class="l-text">Next, in <strong>forensics-L7</strong>, we ascend to the strategic layer — APT groups, threat intelligence formats, and the Diamond Model.</p>
</div>`,
tr: `<p class="l-text"><strong>Ağ adli bilişimi, makineler arasındaki konuşmayı sonradan okuma sanatıdır.</strong> Her TCP el sıkışması, her DNS sorgusu, her TLS ClientHello — fizik yasaları gereği — telde bir yerde gözlemlenebilirdir ve tam içerik paket yakalama (PCAP) o gözlemi kalıcı kılar. Disiplin, 1990'larda <strong>tcpdump</strong> (Van Jacobson, 1988) ve <strong>libpcap</strong> kütüphanesiyle kristalize oldu, <strong>Wireshark</strong> (Gerald Combs, 1998 Ethereal olarak) ile profesyonelleşti ve <strong>Zeek</strong> (Vern Paxson, 1996, başlangıçta "Bro") tarafından analitik bir beyin verildi — ham paketleri zengin günlüklere (<code>conn.log</code>, <code>dns.log</code>, <code>http.log</code>, <code>ssl.log</code>, <code>x509.log</code>) çeviren çerçeve.</p>

<p class="l-text">Bu derste tam ağ-adli bilişim yığınını ele alıyoruz: Wireshark display filtre sözdizimi (cerrahi neşter), toplu işleme için <code>tshark</code>, yapılandırılmış istihbarat türetmek için Zeek, yüksek hacimli sadece-metaveri telemetri için NetFlow/IPFIX, şifreli trafik sorunu (TLS 1.3 + ECH = "hiçbir şey göremiyoruz") ve TLS istemcilerini şifresini çözmeden sınıflandırmanıza izin veren <strong>JA3/JA4 parmak izi</strong> devrimi. Final: sentetik akış özellikleri üzerinde IsolationForest dedektörü.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Wireshark display filtreleri: <code>tcp.flags.syn==1</code>, <code>http.request.method=="POST"</code>, <code>tls.handshake.extensions_server_name</code></li>
<li>DNS, HTTP, TLS metaverisini ölçekte çıkarmak için <code>tshark</code>'ı betiklerden sürmek</li>
<li>Zeek'i çalıştırmak ve sekmeyle ayrılmış günlüklerini okumak; özel tespit için bir Zeek betiği yazmak</li>
<li>Tam PCAP vs NetFlow/IPFIX/sFlow karşılaştırması — her birinin ne zaman doğru cevap olduğu</li>
<li>JA3 ve JA4 TLS parmak izlerini hesaplamak; JA4'ün JA3'ün çakışmalarını neden düzelttiğini anlamak</li>
<li>Beacon tespiti için akış özellikleri üzerinde IsolationForest eğitmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Yakalama Yığını — libpcap'tan Wireshark'a</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">libpcap / Npcap</div><div class="card-body">Kullanıcı alanı yakalama API'si. Linux'ta <code>AF_PACKET</code> kullanır. Windows'ta, Npcap (Insecure.com, WinPcap'in yerini alır) Wireshark ile gelir. PCAP-NG modern çoklu arabirim formatıdır.</div></div>
<div class="calc-card"><div class="card-title">tcpdump / dumpcap</div><div class="card-body">CLI yakalama. <code>tcpdump -i eth0 -w out.pcap "host 8.8.8.8 and port 53"</code>. Hat hızı filtreleme için çekirdek-içi bytecode'a derlenmiş BPF filtre dili.</div></div>
<div class="calc-card"><div class="card-title">Wireshark</div><div class="card-body">~3000 protokol için GUI dissector. Display filtreleri (BPF yakalama filtrelerinden farklı) ayrıştırılmış ağaç üzerinde çalışır.</div></div>
<div class="calc-card"><div class="card-title">tshark</div><div class="card-body">Wireshark'ın CLI kardeşi. Aynı dissector'lar, betiklenebilir. <code>tshark -r in.pcap -Y "tls" -T fields -e ip.src -e tls.handshake.extensions_server_name</code>.</div></div>
</div>

<div class="calc-highlight"><strong>BPF (yakalama-zamanı)</strong> filtreler çekirdek bytecode'u kullanır — hızlı, basit, sözdizimi <code>tcp port 443 and host 1.2.3.4</code> gibi. <strong>Display filtreleri</strong> (Wireshark) ayrıştırılmış ağaç üzerinde çalışır — yavaş, akıllı, sözdizimi <code>tcp.flags.syn==1 and tls.handshake.type==1</code> gibi. Farklı diller, ortak karışıklık.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Günlük Kullanacağınız Wireshark Display Filtreleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SYN flood'ları / taramalar</div><div class="card-body"><code>tcp.flags.syn==1 and tcp.flags.ack==0</code></div></div>
<div class="calc-card"><div class="card-title">Şüpheli DNS</div><div class="card-body"><code>dns.qry.name contains "dyndns" or dns.qry.name matches "[a-z0-9]{20,}\\.com"</code></div></div>
<div class="calc-card"><div class="card-title">Garip yollara HTTP POST'ları</div><div class="card-body"><code>http.request.method=="POST" and http.request.uri matches "/[a-z]{8}\\.php"</code></div></div>
<div class="calc-card"><div class="card-title">TLS SNI sızdırma</div><div class="card-body"><code>tls.handshake.extensions_server_name contains "pastebin" or contains ".onion"</code></div></div>
<div class="calc-card"><div class="card-title">Kendi imzalı sertifikalar</div><div class="card-body"><code>x509ce.dNSName == x509sat.IA5String</code> &amp; issuer == subject</div></div>
<div class="calc-card"><div class="card-title">Beacon (Statistics → I/O Graph)</div><div class="card-body">Düşük titremeli ritmik düz-periyot gönderimleri — Cobalt Strike varsayılan 60s sleep, Sliver 5s.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Betiklenmiş Triyaj İçin tshark</h2>
<p class="l-text">Wireshark GUI'si bir PCAP içindir. <code>tshark</code> 10.000 içindir. Örüntü: yapılandırılmış alanları çıkar, Pandas/SQLite'a borula, analitik sorular sor.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import subprocess, pandas as pd, io

def tshark_extract(pcap, fields, display_filter=""):
    cmd = ["tshark","-r",pcap,"-T","fields","-E","header=y","-E","separator=\\t"]
    for f in fields: cmd += ["-e", f]
    if display_filter: cmd += ["-Y", display_filter]
    out = subprocess.check_output(cmd, text=True)
    return pd.read_csv(io.StringIO(out), sep="\\t")

# Tüm TLS ClientHello'lar: kaynak, SNI, JA3
tls = tshark_extract("traffic.pcap",
    ["ip.src","tls.handshake.extensions_server_name","tls.handshake.ja3"],
    'tls.handshake.type==1')
print("Top SNIs:")
print(tls['tls.handshake.extensions_server_name'].value_counts().head(10))

# En gürültülü 10 kaynak IP
flows = tshark_extract("traffic.pcap", ["ip.src","ip.dst","_ws.col.Length"])
top = flows.groupby("ip.src")["_ws.col.Length"].sum().sort_values(ascending=False).head(10)
print("\\nTop talkers (bytes):")
print(top)
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>tshark_extract()</code> bir <code>tshark</code> komutunu <code>-T fields -E header=y -E separator=\\t</code> ile kurar, istenen her kolon için bir <code>-e &lt;field&gt;</code> ekler ve opsiyonel bir <code>-Y</code> display filter alır — sonra tab-ayraçlı çıktıyı doğrudan <code>pd.read_csv</code>'ye borular. 2) İlk çağrı <code>tls.handshake.type==1</code> ile her TLS ClientHello'yu çeker ve üç kolon alır: kaynak IP, SNI (cleartext hostname) ve JA3 (client-fingerprint hash). 3) SNI kolonunda <code>value_counts().head(10)</code> üst hedefleri sıralar — kurumsal olmayan veya DGA-stili hostname'ler anında göze çarpar. 4) İkinci çağrı her paket için <code>(src, dst, frame uzunluk)</code> çıkarır; Pandas <code>groupby("ip.src").sum()</code> + azalan sıralama "top talker"ları yüzeye çıkarır — bir workstation IP'sinden çıkan büyük outbound bayt hacmi kanonik exfiltration sinyalidir.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Zeek — Günlükler Olarak Ağ</h2>
<p class="l-text">Wireshark paketleri dökerken, <strong>Zeek</strong> <em>olaylar</em> ve yapılandırılmış günlükler yayar. 10 dakikalık bir PCAP şu hâle gelir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">conn.log</div><div class="card-body">Akış başına bir satır: 5'li-grup, süre, baytlar, conn-state (S0=SYN cevapsız, REJ=reddedildi, RSTR=sunucu sıfırladı).</div></div>
<div class="calc-card"><div class="card-title">dns.log</div><div class="card-body">Her sorgu ve yanıt: sorgu adı, tip, yanıt, TTL.</div></div>
<div class="calc-card"><div class="card-title">http.log</div><div class="card-body">Yöntem, host, URI, user-agent, durum kodu, yanıt gövdesi uzunluğu.</div></div>
<div class="calc-card"><div class="card-title">ssl.log + x509.log</div><div class="card-body">TLS sürümü, şifre, SNI, JA3/JA3S; subject/issuer/SAN ile tam sertifika zinciri.</div></div>
<div class="calc-card"><div class="card-title">files.log</div><div class="card-body">Zeek'in herhangi bir protokolden çıkardığı her dosya — MD5/SHA1/SHA256 ile.</div></div>
<div class="calc-card"><div class="card-title">notice.log</div><div class="card-body">Zeek betikleri tarafından tetiklenen tespitler (port-scan, SSL-blacklist vb.).</div></div>
</div>

<div class="calc-highlight">Zeek'in sırrı betikleme dilidir: her protokol olayı hook'lanabilir. 6 satırlık bir betik DNS etiketlerinin entropisiyle "alan adı üretim algoritması beacon'larını" tespit edebilir — üretim SOC'ları yüzlerce böyle betik çalıştırır.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. NetFlow / IPFIX / sFlow — Ölçekte Metaveri</h2>
<p class="l-text">100 Gbps omurgada tam PCAP saniyede 12.5 GB'tır — sürdürülemez. <strong>NetFlow v9</strong> (Cisco, 2003) ve IETF-standartlaştırılmış <strong>IPFIX</strong> (RFC 7011) akış başına kayıtlar dışa aktarır: kaynak/hedef IP, portlar, protokol, paketler, baytlar, TCP bayrakları. <strong>sFlow</strong> (RFC 3176) yerine paket örneklemesi yapar. SOC'lar akış verisi üzerinde çalışır; PCAP seçici olarak yakalanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># nfdump'tan dışa aktarılmış bir NetFlow CSV oku ve tarayıcıları bul
import pandas as pd
flows = pd.read_csv("netflow.csv")  # cols: ts,src,dst,sport,dport,proto,pkts,bytes

# Sezgi 1: kaynak 60s'de &gt; 200 farklı dst IP'ye dokunuyor = yatay tarama
scans = flows.groupby("src")["dst"].nunique().sort_values(ascending=False)
print("Suspected scanners:")
print(scans.head(5))

# Sezgi 2: kaynak bir dst'ye &gt; 100 farklı dport üzerinde dokunuyor = dikey tarama
vert = flows.groupby(["src","dst"])["dport"].nunique().sort_values(ascending=False)
print("\\nSuspected vertical scans:")
print(vert.head(5))
</code></pre></div>
<p class="l-text"><strong>Kodun adım adım işleyişi:</strong> 1) Bir <code>nfdump</code>-export edilmiş NetFlow CSV'yi kanonik sekiz kolonla <code>pd.DataFrame</code>'e okur — timestamp, src, dst, sport, dport, proto, pkts, bytes. 2) Yatay-tarama sezgisi: <code>groupby("src")["dst"].nunique()</code> her kaynağın kaç farklı hedef IP'ye dokunduğunu sayar; azalan sıralı ilk 5, Nmap ve Masscan'in geride bıraktığı klasik <em>"bir host tüm subnet'i tarıyor"</em> örüntüsüdür. 3) Dikey-tarama sezgisi: <code>groupby(["src","dst"])["dport"].nunique()</code> her src-dst çifti için farklı hedef port sayısını sayar; yüksek sayılar bir kaynağın tek hedefte tüm portları taradığını gösterir — kanonik port-scan parmak izi. 4) İki pipeline da 4 satıra sığar çünkü flow kayıtları payload'ı çoktan atmıştır — tam olarak NetFlow/IPFIX'in tam PCAP'in yapamayacağı omurga hızlarına ölçeklenmesinin nedeni budur.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. JA3, JA3S, JA4 — Şifresini Çözmeden TLS Parmak İzi</h2>
<p class="l-text">TLS 1.3 eskiden görünür olan neredeyse her şeyi gizler (SNI artık Encrypted Client Hello üzerinden isteğe bağlı), ama <strong>ClientHello</strong> açık metinde kalır ve <em>şekli</em> — şifre paketlerinin sıralı listesi, uzantılar, desteklenen gruplar, EC nokta formatları — bir TLS uygulamasına özgüdür. JA3'ün (Salesforce, 2017) yakaladığı budur.</p>

<div class="calc-highlight"><strong>JA3</strong>: <code>SSLVersion,Ciphers,Extensions,EllipticCurves,EllipticCurvePointFormats</code>'in MD5'i. Her değer virgülle birleştirilmiş, listeler içinde tireler. Cobalt Strike 4.x'in stabil bir JA3'ü vardı: <code>72a589da586844d7f0818ce684948eea</code> — rastlatma eklenene kadar anında tespit. <strong>JA4</strong> (FoxIO, 2023) JA3'ün çakışmalarını düzeltir: QUIC vs TCP'yi ayırır, şifre ve uzantı hash'lerini böler, deterministik olarak sıralar.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib

# Ayrıştırılmış bir ClientHello dict için basitleştirilmiş JA3 oluşturucu
def ja3(ch):
    ciphers = "-".join(str(c) for c in ch["ciphers"])
    exts    = "-".join(str(e) for e in ch["extensions"])
    curves  = "-".join(str(c) for c in ch["curves"])
    pfmts   = "-".join(str(p) for p in ch["point_formats"])
    s = f"{ch['version']},{ciphers},{exts},{curves},{pfmts}"
    return s, hashlib.md5(s.encode()).hexdigest()

# Varsayımsal Chrome 124 ClientHello
chrome = {
  "version": 771, "ciphers": [4865,4866,4867,49195,49199,49196],
  "extensions": [0,11,10,35,16,5,13,18,51,45,43,27,17513],
  "curves": [29,23,24], "point_formats": [0],
}
s, h = ja3(chrome)
print("JA3 string:", s)
print("JA3 hash:  ", h)
</code></pre></div>
<p class="l-text"><strong>Kuralı satır satır okuyalım:</strong> 1) <code>ja3(ch)</code>, ayrıştırılmış bir ClientHello dict'i alır ve dört sıralı listeyi tam olarak 2017 Salesforce şartnamesinin istediği gibi tirelerle birleştirir — <code>ciphers</code>, <code>extensions</code>, desteklenen <code>curves</code>, EC <code>point_formats</code>. 2) Bu dördünü <code>version</code>'ı baş alana koyup virgülle birleştirir ve kanonik JA3 dizgisini üretir. 3) <code>hashlib.md5(s.encode()).hexdigest()</code> o dizgiyi her IDS kuralı ve tehdit-istihbarat feed'inde dolaşan 32 hex-karakterlik parmak izine çöktürür. 4) Chrome 124 örneği gerçek cipher ID'leri (4865 = TLS_AES_128_GCM_SHA256) ve TLS 1.3 uzantıları (51 = key_share, 43 = supported_versions, 17513 = ALPS) kullanır — herhangi bir listede tek bayt değiştir, hash değişir; tam da Cobalt Strike'ın statik <code>72a589da...</code> parmak izinin rastlatma eklenene kadar anında-tespit olmasının nedeni budur.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Şifreli Trafik Analizi — TLS 1.3'ten Sonra Ne Kaldı</h2>
<p class="l-text">TLS 1.3 (RFC 8446, 2018) sertifikayı şifreler, statik RSA'yı kaldırır, ileri gizliliği zorunlu kılar. ECH (Encrypted Client Hello, RFC 9460+) SNI'yi gizler. Yani hâlâ ne görebiliyoruz? Sandığınızdan fazla:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">5'li-grup + baytlar/paketler</div><div class="card-body">Kaynak, hedef, portlar, protokol, her yöndeki bayt sayıları. Sadece akış şekli, basit ML ile trafik kategorilerini &gt; %95 doğrulukla sınıflandırır.</div></div>
<div class="calc-card"><div class="card-title">JA3/JA4</div><div class="card-body">İstemci uygulama parmak izi görünür kalır. Zararlı yazılım-özel TLS yığınlarını yakalar (boringssl-pinned Cobalt Strike, Sliver için Go varsayılan TLS).</div></div>
<div class="calc-card"><div class="card-title">QUIC / HTTP/3</div><div class="card-body">UDP-on-443. Daha az gözlemlenebilir, ama JA4Q QUIC parmak izi verir.</div></div>
<div class="calc-card"><div class="card-title">Zamanlama &amp; boyut örüntüleri</div><div class="card-body">Cetus (2018) Tor devrelerinin tanımlanabilir olduğunu gösterdi; "BLINDed"-stili saldırılar HTTP/2 sitesini yalnızca patlama örüntülerinden tanır. C2 beacon ISI dağılımından tespit edilmesi önemsizdir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. sklearn IsolationForest ile Beacon Tespiti</h2>
<p class="l-text">Bir C2 beacon üç istatistiksel parmak izi gösterir: küçük, periyodik, düşük titremeli. 800 normal akış + 20 beacon akış sentezle ve IsolationForest'ın bulmasına izin ver.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(13)

def normal_flow():
    return dict(
      bytes_out= rng.gamma(2.0, 5000),     # ağır değişkenlik
      bytes_in = rng.gamma(2.0, 8000),
      duration = rng.gamma(1.5, 30),
      pkt_count= rng.integers(20, 500),
      isi_std  = rng.gamma(2.0, 0.5),       # yüksek gönderim-arası titreme
    )
def beacon_flow():
    return dict(
      bytes_out= rng.normal(900, 50),       # küçük, neredeyse sabit
      bytes_in = rng.normal(120, 20),
      duration = rng.normal(3600, 30),      # uzun ömürlü
      pkt_count= rng.integers(58, 62),      # 1 saatte 60 saniyelik beacon
      isi_std  = rng.normal(0.05, 0.01),    # neredeyse sıfır titreme
    )

rows = [normal_flow() for _ in range(800)] + [beacon_flow() for _ in range(20)]
df = pd.DataFrame(rows)
df["label"] = ["normal"]*800 + ["beacon"]*20

iso = IsolationForest(contamination=0.025, random_state=13).fit(df.drop(columns=["label"]))
df["anom"] = -iso.decision_function(df.drop(columns=["label","anom"], errors="ignore"))
flagged = df.sort_values("anom", ascending=False).head(20)
hit_rate = (flagged["label"]=="beacon").mean()
print(f"Recall in top 20: {hit_rate:.0%}  ({(flagged['label']=='beacon').sum()}/20 beacons)")
print(flagged.head(8).to_string(index=False))
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>normal_flow()</code> flow başına beş özelliği ağır-kuyruklu gamma dağılımlarından çeker — değişken bayt hacimleri, değişken süre, yüksek gönderim-arası titreme <code>isi_std</code> — gerçek kullanıcı trafiğinin dağınık şekli. 2) <code>beacon_flow()</code> gamma'ları sıkı Gaussian'larla değiştirir: ~900 bayt out, ~120 bayt in, bir saatte ~60 paket (dakikada bir ping) ve <code>isi_std</code> 0.05 — Cobalt Strike varsayılan beacon'larının geride bıraktığı üç istatistiksel parmak izi (küçük, periyodik, düşük-titreşim). 3) 800 normal + 20 beacon satırı <code>DataFrame</code>'e koyar ve <code>IsolationForest(contamination=0.025)</code>'i fit'ler — modele ~%2.5 anomali beklemesini söyler. 4) <code>-iso.decision_function</code> işareti çevirir, böylece yüksek puan = daha anormal; sıralar ve ilk 20'yi alır, sonra recall'u hesaplar — yerleştirilen 20 beacon'dan kaçının üst-20 flag'lerinde gerçekten yüzeye çıktığı. Sayı yazdırılır ve %100'e yakın olmalıdır.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tarayıcı tarafı Pyodide'da IsolationForest ile aynı beacon-vs-normal akış simülasyonu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest
rng = np.random.default_rng(13)
def normal():  return [rng.gamma(2,5000), rng.gamma(2,8000), rng.gamma(1.5,30), rng.integers(20,500), rng.gamma(2,0.5)]
def beacon():  return [rng.normal(900,50), rng.normal(120,20), rng.normal(3600,30), rng.integers(58,62), rng.normal(0.05,0.01)]
X = np.array([normal() for _ in range(800)] + [beacon() for _ in range(20)])
y = np.array(["n"]*800 + ["B"]*20)
iso = IsolationForest(contamination=0.025, random_state=13).fit(X)
score = -iso.decision_function(X)
order = np.argsort(score)[::-1][:20]
recall = (y[order]=="B").mean()
print(f"Beacon recall in top 20: {recall:.0%}")
print("Top-20 labels:", "".join(y[order]))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 TEMEL ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BPF yakalama filtreleri vs Wireshark display filtreleri — farklı diller.</li>
<li>tshark PCAP triyajını ölçekte sürer, Pandas'a besle.</li>
<li>Zeek paketleri yapılandırılmış günlüklere (conn, dns, http, ssl, files, x509) çevirir.</li>
<li>NetFlow/IPFIX 100 Gbps'de tek yaşayabilir telemetridir; PCAP seçici olarak yakalanır.</li>
<li>JA3/JA4 TLS istemcilerini şifresini çözmeden parmak izler — şifreli trafik omurgası.</li>
<li>Akış özellikleri üzerinde IsolationForest beacon'ları gözetimsiz bulur.</li>
</ul>
</div>
<p class="l-text">Sırada, <strong>forensics-L7</strong>'de, stratejik katmana yükseliyoruz — APT grupları, tehdit istihbaratı formatları ve Diamond Modeli.</p>
</div>`
};
