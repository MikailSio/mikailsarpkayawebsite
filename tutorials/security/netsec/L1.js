window.NETSEC_L1 = {

en: `<p class="l-text"><strong>Every time you log into a banking site, your browser performs a TLS 1.3 handshake in roughly one round-trip — a 50-millisecond ritual that derives a fresh symmetric key, validates an X.509 certificate chain back to a root authority, and resists nation-state passive interception.</strong> The protocol that makes this possible is RFC 8446, finalized in August 2018, and it is the bedrock of HTTPS, modern email, VPNs, and the QUIC transport behind HTTP/3.</p>
<p class="l-text">In this opening lesson of the Network &amp; System Security track, we descend the TCP/IP stack, dissect TLS 1.3's 1-RTT and 0-RTT handshakes, audit certificate validation, and study the privacy upgrades — SNI, ESNI, and the new ECH — that hide which website you are visiting from a network observer.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Map a packet down the OSI / TCP-IP stack from frame to application bytes</li>
<li>Trace a TLS 1.3 handshake message-by-message (ClientHello, KeyShare, Finished)</li>
<li>Compare 1-RTT vs 0-RTT vs the legacy 2-RTT TLS 1.2 handshake</li>
<li>Validate an X.509 certificate chain manually and reason about mTLS</li>
<li>Explain what HTTP/3 + QUIC change about congestion control and head-of-line blocking</li>
<li>Decide whether SNI, ESNI, or ECH belongs in your threat model</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The TCP/IP Stack &amp; Where Security Lives</h2>
<p class="l-text">A web request travels through five conceptual layers. Each layer adds its own header and is owned by a different attacker class — a Wi-Fi sniffer sees layer 2 frames, an ISP sees layer 3 packets, a malicious CDN sees layer 7 bytes. Understanding the stack tells you which threats each defense addresses.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">L2 Link</div><div class="card-body">Ethernet / Wi-Fi frames. Threats: ARP spoofing, rogue APs. Defenses: 802.1X, WPA3.</div></div>
<div class="calc-card"><div class="card-title">L3 Network</div><div class="card-body">IPv4 / IPv6 packets. Threats: BGP hijack, IP spoofing. Defenses: RPKI, IPsec.</div></div>
<div class="calc-card"><div class="card-title">L4 Transport</div><div class="card-body">TCP / UDP / QUIC. Threats: SYN flood, RST injection. Defenses: SYN cookies.</div></div>
<div class="calc-card"><div class="card-title">L5-6 Session</div><div class="card-body">TLS 1.3, DTLS, SSH. Confidentiality + integrity + auth.</div></div>
<div class="calc-card"><div class="card-title">L7 Application</div><div class="card-body">HTTP, DNS, SMTP. Threats: OWASP Top 10. Defenses: WAF, OAuth.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TLS 1.3 in One Round-Trip</h2>
<p class="l-text">TLS 1.2 needed 2 round-trips to start sending application data. TLS 1.3, defined in <strong>RFC 8446</strong>, cut that to <strong>1-RTT</strong> by sending a Diffie-Hellman key share inside the very first ClientHello. The cipher suite list also shrank from dozens of fragile combinations to five AEAD-only suites, eliminating CBC, RC4, and anonymous DH.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TLS 1.2 (legacy)</div><div class="card-body">2-RTT before app data. ~110 ms typical. RSA key exchange common.</div></div>
<div class="calc-card"><div class="card-title">TLS 1.3 1-RTT</div><div class="card-body">~55 ms. ECDHE only. Forward secrecy mandatory.</div></div>
<div class="calc-card"><div class="card-title">TLS 1.3 0-RTT</div><div class="card-body">~0 ms extra. Resumed sessions. Vulnerable to replay — idempotent only.</div></div>
<div class="calc-card"><div class="card-title">Cipher suites</div><div class="card-body">5 AEAD: AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305, AES-128-CCM, AES-128-CCM-8.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Key derivation in TLS 1.3 uses HKDF (RFC 5869). The master secret is expanded into traffic keys for each direction.</div>
<div class="katex-block">$$\\text{HKDF-Expand-Label}(secret, label, context, L) = \\text{HMAC-SHA256}(secret, label \\| context \\| L)$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hands-On: Simulating the Handshake</h2>
<p class="l-text">A real ClientHello is a binary record with extensions, but the logical state machine is small. Let's simulate the message exchange and key derivation in pure Python so you can see the order of operations.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, hmac, secrets

<span class="cm"># Step 1: ClientHello — random + supported groups + key_share (X25519)</span>
client_random = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)
client_priv = secrets.<span class="fn">randbits</span>(<span class="num">256</span>)
client_pub  = <span class="fn">pow</span>(<span class="num">9</span>, client_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)  <span class="cm"># toy X25519</span>

<span class="cm"># Step 2: ServerHello — random + key_share</span>
server_random = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)
server_priv = secrets.<span class="fn">randbits</span>(<span class="num">256</span>)
server_pub  = <span class="fn">pow</span>(<span class="num">9</span>, server_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)

<span class="cm"># Step 3: Both sides compute the same shared secret</span>
shared_c = <span class="fn">pow</span>(server_pub, client_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)
shared_s = <span class="fn">pow</span>(client_pub, server_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)
<span class="kw">assert</span> shared_c == shared_s
<span class="fn">print</span>(<span class="str">"shared secret bytes:"</span>, shared_c.<span class="fn">to_bytes</span>(<span class="num">32</span>, <span class="str">'big'</span>)[:<span class="num">8</span>].<span class="fn">hex</span>())

<span class="cm"># Step 4: HKDF-Extract then Expand → traffic keys</span>
<span class="kw">def</span> <span class="fn">hkdf_extract</span>(salt, ikm):
    <span class="kw">return</span> hmac.<span class="fn">new</span>(salt, ikm, hashlib.sha256).<span class="fn">digest</span>()
<span class="kw">def</span> <span class="fn">hkdf_expand</span>(prk, info, length):
    out, T, i = <span class="fn">b''</span>, <span class="fn">b''</span>, <span class="num">1</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; length:
        T = hmac.<span class="fn">new</span>(prk, T+info+<span class="fn">bytes</span>([i]), hashlib.sha256).<span class="fn">digest</span>()
        out += T; i += <span class="num">1</span>
    <span class="kw">return</span> out[:length]

prk = <span class="fn">hkdf_extract</span>(<span class="fn">b'</span>\\x00<span class="fn">'</span>*<span class="num">32</span>, shared_c.<span class="fn">to_bytes</span>(<span class="num">32</span>,<span class="str">'big'</span>))
client_key = <span class="fn">hkdf_expand</span>(prk, <span class="fn">b'</span>tls13 c hs traffic<span class="fn">'</span>, <span class="num">16</span>)
server_key = <span class="fn">hkdf_expand</span>(prk, <span class="fn">b'</span>tls13 s hs traffic<span class="fn">'</span>, <span class="num">16</span>)
<span class="fn">print</span>(<span class="str">"client traffic key:"</span>, client_key.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">"server traffic key:"</span>, server_key.<span class="fn">hex</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a TLS context — modern stacks default to TLS 1.3 with 1-RTT handshake (down from TLS 1.2's 2-RTT), eliminating downgrade attacks like FREAK / Logjam. 2) Cipher suites are AEAD-only in TLS 1.3 (AES-GCM, ChaCha20-Poly1305) — the bad old CBC + HMAC combinations are gone. 3) Certificate validation chains the server cert to a trusted root via X.509 path validation; OCSP stapling lets the server prove freshness without leaking which sites you visit. 4) For mTLS, the client also presents a cert — used in zero-trust architectures (BeyondCorp), service meshes (Istio, Linkerd), and any API where IP allowlists are not enough.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same code — pyodide ships <code>hashlib</code>, <code>hmac</code>, and <code>secrets</code> in the standard library, so this runs as-is.</p>
</div>
<p class="l-text"><strong>What this code does:</strong> 1) Client and server each generate ephemeral key pairs (toy X25519 modulus). 2) They exchange public keys and derive the same shared secret via Diffie-Hellman. 3) HKDF-Extract turns the raw secret into a uniformly random pseudo-random key. 4) HKDF-Expand-Label derives separate traffic keys for each direction — exactly what RFC 8446 section 7.1 prescribes.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Certificate Validation (X.509 Chain)</h2>
<p class="l-text">The server proves it owns the private key by signing the handshake transcript, but you only trust that signature if you trust the public key. Trust comes from a chain: leaf cert &rarr; intermediate CA &rarr; root CA shipped with your OS. Your browser walks the chain, checks each signature, validates the dates, the SAN matches the hostname, and (optionally) checks revocation via OCSP stapling.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Leaf cert</div><div class="card-body">Issued for example.com. Contains public key, SAN, validity, issuer.</div></div>
<div class="calc-card"><div class="card-title">Intermediate</div><div class="card-body">Signs the leaf. Issued by the root. Lets the root stay offline.</div></div>
<div class="calc-card"><div class="card-title">Root CA</div><div class="card-body">Self-signed. Pre-installed in OS / browser trust store (~150 roots).</div></div>
<div class="calc-card"><div class="card-title">Revocation</div><div class="card-body">CRL (slow), OCSP (privacy leak), OCSP stapling (modern), Must-Staple flag.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="cm"># Toy chain: leaf signed by intermediate, intermediate signed by root</span>
root_pub  = <span class="str">"ROOT_PUB_42"</span>
inter_pub = <span class="str">"INTER_PUB_99"</span>
leaf_pub  = <span class="str">"LEAF_PUB_example.com"</span>

<span class="cm"># A "signature" here = sha256(content || signer_priv). Real world = RSA/ECDSA.</span>
<span class="kw">def</span> <span class="fn">sign</span>(content, signer_priv):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>((content+signer_priv).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()
<span class="kw">def</span> <span class="fn">verify</span>(content, sig, signer_priv):
    <span class="kw">return</span> sig == <span class="fn">sign</span>(content, signer_priv)

inter_sig = <span class="fn">sign</span>(inter_pub, <span class="str">"ROOT_PRIV"</span>)
leaf_sig  = <span class="fn">sign</span>(leaf_pub,  <span class="str">"INTER_PRIV"</span>)

trusted_roots = {root_pub: <span class="str">"ROOT_PRIV"</span>}

<span class="cm"># Walk the chain</span>
chain_ok  = <span class="fn">verify</span>(inter_pub, inter_sig, trusted_roots[root_pub])
chain_ok &amp;= <span class="fn">verify</span>(leaf_pub, leaf_sig, <span class="str">"INTER_PRIV"</span>)
<span class="fn">print</span>(<span class="str">"Chain valid:"</span>, <span class="fn">bool</span>(chain_ok))

<span class="cm"># Hostname check</span>
host = <span class="str">"example.com"</span>
san = [<span class="str">"example.com"</span>, <span class="str">"www.example.com"</span>]
<span class="fn">print</span>(<span class="str">"Hostname OK:"</span>, host <span class="kw">in</span> san)</code></pre></div>
<p class="l-text">In production, libraries like OpenSSL parse ASN.1 DER, walk the chain, enforce path length constraints, key usage, and EKU bits. Get one of these wrong and you ship a CVE — see <strong>CVE-2014-0160 (Heartbleed)</strong> for what happens when memory bounds are off in TLS code.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Mutual TLS (mTLS)</h2>
<p class="l-text">In standard TLS only the server authenticates. In <strong>mTLS</strong>, the server also requires the client to present a certificate. This is how service meshes (Istio, Linkerd), enterprise APIs, and zero-trust networks authenticate workload-to-workload. Instead of bearer tokens that can be stolen, mTLS binds the connection to a private key that ideally lives in a hardware module (TPM, HSM, secure enclave).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Server-only TLS</div><div class="card-body">Browser, public APIs. Client identity = bearer token / cookie.</div></div>
<div class="calc-card"><div class="card-title">mTLS</div><div class="card-body">Both sides certified. Used in service mesh, banking APIs, IoT.</div></div>
<div class="calc-card"><div class="card-title">SPIFFE / SPIRE</div><div class="card-body">Workload-identity standard producing X.509-SVIDs for mTLS.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. HTTP/3 &amp; QUIC</h2>
<p class="l-text">QUIC (RFC 9000) ports TLS 1.3 onto UDP. It removes TCP's head-of-line blocking — when one stream loses a packet, the others keep flowing. Connection migration lets your phone keep an HTTP/3 session alive when it switches from Wi-Fi to LTE without reconnecting. By 2024 over a quarter of top websites support HTTP/3, including Google, Cloudflare, and Meta.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Transport</div><div class="card-body">UDP instead of TCP. Built-in TLS 1.3, no separate handshake.</div></div>
<div class="calc-card"><div class="card-title">Streams</div><div class="card-body">Independent multiplexed streams. No HoL blocking.</div></div>
<div class="calc-card"><div class="card-title">Migration</div><div class="card-body">Connection ID survives IP change (Wi-Fi to cellular).</div></div>
<div class="calc-card"><div class="card-title">Encryption</div><div class="card-body">Even most headers are encrypted. Middleboxes see less.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SNI, ESNI, and ECH (Hostname Privacy)</h2>
<p class="l-text">When TLS starts, the client must tell the server which hostname it wants — many sites share one IP. Plaintext <strong>SNI</strong> leaks that hostname to anyone watching the wire. <strong>ESNI</strong> (drafted, deprecated) tried to encrypt only the SNI field. <strong>ECH</strong> (Encrypted Client Hello, RFC drafts plus Cloudflare/Mozilla deployment) encrypts the entire inner ClientHello using a public key fetched via DNS HTTPS records. The result: a passive observer sees only that you are visiting Cloudflare, not which Cloudflare-hosted site.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SNI (today)</div><div class="card-body">Hostname in plaintext. Censorship and ad-tech love it.</div></div>
<div class="calc-card"><div class="card-title">ESNI (deprecated)</div><div class="card-body">Encrypted SNI only. Replaced by ECH.</div></div>
<div class="calc-card"><div class="card-title">ECH</div><div class="card-body">Full inner ClientHello encrypted. Public key in DNS HTTPS RR.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Handshake Latency Visualization</h2>
<p class="l-text">Round-trip count is the dominant cost of secure connections on long-haul links. Below: TLS 1.2 vs 1.3 1-RTT vs 1.3 0-RTT, measured in extra milliseconds on a 50 ms RTT link.</p>
<div class="plotly-graph" id="netsec1-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Threat Model Summary</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Passive observer</div><div class="card-body">Defeated by TLS 1.3 + ECH. Sees only TCP/UDP metadata.</div></div>
<div class="calc-card"><div class="card-title">Active MITM</div><div class="card-body">Defeated by certificate validation + HSTS + pinning.</div></div>
<div class="calc-card"><div class="card-title">Compromised CA</div><div class="card-body">Mitigated by Certificate Transparency logs (RFC 6962).</div></div>
<div class="calc-card"><div class="card-title">Quantum attacker</div><div class="card-body">Future. Hybrid Kyber + X25519 already deployed by Cloudflare/Chrome.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> TLS 1.3 (RFC 8446) cut handshake latency in half — 1-RTT, AEAD-only, mandatory forward secrecy.<br><strong>2.</strong> 0-RTT is fast but replay-prone; only use it for idempotent requests.<br><strong>3.</strong> Certificate validation = chain signature checks + hostname match + revocation + dates.<br><strong>4.</strong> mTLS authenticates both sides — the basis of service-mesh and zero-trust workload identity.<br><strong>5.</strong> HTTP/3 + QUIC kill head-of-line blocking and survive network changes.<br><strong>6.</strong> ECH closes the last big plaintext leak in the modern web stack.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var labels = ['TLS 1.2 (2-RTT)', 'TLS 1.3 (1-RTT)', 'TLS 1.3 (0-RTT resumed)'];
  var ms = [110, 55, 5];
  var data = [{x:labels, y:ms, type:'bar', marker:{color:[T.grid, T.accent, '#7cc']}}];
  var layout = {title:'Handshake latency on a 50 ms RTT link', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{gridcolor:T.grid}, yaxis:{title:'ms before app data', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  var el = document.getElementById('netsec1-plot-en'); if(el && window.Plotly) Plotly.newPlot('netsec1-plot-en', data, layout, {displayModeBar:false});
},250);
</script>`,

tr: `<p class="l-text"><strong>Bir bankacılık sitesine her giriş yaptığında, tarayıcın kabaca bir round-trip'te bir TLS 1.3 el sıkışması yapar — taze bir simetrik anahtar türeten, bir kök otoriteye geri X.509 sertifika zincirini doğrulayan ve ulus-devlet pasif yakalamasına direnen 50 milisaniyelik bir ritüel.</strong> Bunu mümkün kılan protokol Ağustos 2018'de sonlandırılan RFC 8446'dır ve HTTPS, modern e-posta, VPN'ler ve HTTP/3 arkasındaki QUIC taşımanın temelidir.</p>
<p class="l-text">Network &amp; System Security track'inin bu açılış dersinde, TCP/IP yığınında iniyoruz, TLS 1.3'ün 1-RTT ve 0-RTT el sıkışmalarını ayrıştırıyoruz, sertifika doğrulamayı denetliyoruz ve bir ağ gözlemcisinden hangi web sitesini ziyaret ettiğini gizleyen mahremiyet yükseltmeleri — SNI, ESNI ve yeni ECH — çalışıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir paketi OSI / TCP-IP yığınında çerçeveden uygulama bayt'larına kadar haritalamak</li>
<li>Bir TLS 1.3 el sıkışmasını mesaj-mesaj izlemek (ClientHello, KeyShare, Finished)</li>
<li>1-RTT vs 0-RTT vs eski 2-RTT TLS 1.2 el sıkışmasını karşılaştırmak</li>
<li>Bir X.509 sertifika zincirini manuel olarak doğrulamak ve mTLS hakkında akıl yürütmek</li>
<li>HTTP/3 + QUIC'in tıkanıklık kontrolü ve head-of-line blocking hakkında ne değiştirdiğini açıklamak</li>
<li>SNI, ESNI veya ECH'nin tehdit modeline ait olup olmadığına karar vermek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. TCP/IP Yığını ve Güvenlik Nerede Yaşıyor</h2>
<p class="l-text">Bir web isteği beş kavramsal katmandan geçer. Her katman kendi başlığını ekler ve farklı bir saldırgan sınıfının sahipliğindedir — bir Wi-Fi sniffer'ı katman 2 çerçeveleri görür, bir ISS katman 3 paketleri görür, kötü amaçlı bir CDN katman 7 bayt'ları görür. Yığını anlamak hangi savunmanın hangi tehdidi adreslediğini söyler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">L2 Bağlantı</div><div class="card-body">Ethernet / Wi-Fi çerçeveleri. Tehditler: ARP spoofing, sahte AP'ler. Savunmalar: 802.1X, WPA3.</div></div>
<div class="calc-card"><div class="card-title">L3 Ağ</div><div class="card-body">IPv4 / IPv6 paketleri. Tehditler: BGP hijack, IP spoofing. Savunmalar: RPKI, IPsec.</div></div>
<div class="calc-card"><div class="card-title">L4 Taşıma</div><div class="card-body">TCP / UDP / QUIC. Tehditler: SYN flood, RST injection. Savunmalar: SYN cookies.</div></div>
<div class="calc-card"><div class="card-title">L5-6 Oturum</div><div class="card-body">TLS 1.3, DTLS, SSH. Gizlilik + bütünlük + auth.</div></div>
<div class="calc-card"><div class="card-title">L7 Uygulama</div><div class="card-body">HTTP, DNS, SMTP. Tehditler: OWASP Top 10. Savunmalar: WAF, OAuth.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TLS 1.3 Tek Round-Trip'te</h2>
<p class="l-text">TLS 1.2 uygulama verisi göndermeye başlamak için 2 round-trip'e ihtiyaç duydu. <strong>RFC 8446</strong>'da tanımlanan TLS 1.3, ilk ClientHello içinde bir Diffie-Hellman key share göndererek bunu <strong>1-RTT</strong>'ye düşürdü. Cipher suite listesi de düzinelerce kırılgan kombinasyondan beş AEAD-yalnız suite'e küçüldü, CBC, RC4 ve anonim DH'yi ortadan kaldırdı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TLS 1.2 (eski)</div><div class="card-body">Uygulama verisinden önce 2-RTT. ~110 ms tipik. RSA anahtar değişimi yaygın.</div></div>
<div class="calc-card"><div class="card-title">TLS 1.3 1-RTT</div><div class="card-body">~55 ms. Yalnızca ECDHE. İleri gizlilik zorunlu.</div></div>
<div class="calc-card"><div class="card-title">TLS 1.3 0-RTT</div><div class="card-body">~0 ms ekstra. Devam ettirilen oturumlar. Replay'e karşı kırılgan — yalnızca idempotent.</div></div>
<div class="calc-card"><div class="card-title">Cipher suite'ler</div><div class="card-body">5 AEAD: AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305, AES-128-CCM, AES-128-CCM-8.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">TLS 1.3'te anahtar türetme HKDF (RFC 5869) kullanır. Master secret her yön için trafik anahtarlarına genişletilir.</div>
<div class="katex-block">$$\\text{HKDF-Expand-Label}(secret, label, context, L) = \\text{HMAC-SHA256}(secret, label \\| context \\| L)$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Uygulamalı: El Sıkışmayı Simüle Etmek</h2>
<p class="l-text">Gerçek bir ClientHello uzantılarla ikili bir kayıttır, ama mantıksal durum makinesi küçüktür. İşlem sırasını görebilmen için mesaj alışverişini ve anahtar türetmeyi saf Python'da simüle edelim.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, hmac, secrets

<span class="cm"># Adım 1: ClientHello — random + supported groups + key_share (X25519)</span>
client_random = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)
client_priv = secrets.<span class="fn">randbits</span>(<span class="num">256</span>)
client_pub  = <span class="fn">pow</span>(<span class="num">9</span>, client_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)  <span class="cm"># oyuncak X25519</span>

<span class="cm"># Adım 2: ServerHello — random + key_share</span>
server_random = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)
server_priv = secrets.<span class="fn">randbits</span>(<span class="num">256</span>)
server_pub  = <span class="fn">pow</span>(<span class="num">9</span>, server_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)

<span class="cm"># Adım 3: Her iki taraf aynı paylaşılan sırrı hesaplar</span>
shared_c = <span class="fn">pow</span>(server_pub, client_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)
shared_s = <span class="fn">pow</span>(client_pub, server_priv, <span class="num">2</span>**<span class="num">255</span>-<span class="num">19</span>)
<span class="kw">assert</span> shared_c == shared_s
<span class="fn">print</span>(<span class="str">"shared secret bytes:"</span>, shared_c.<span class="fn">to_bytes</span>(<span class="num">32</span>, <span class="str">'big'</span>)[:<span class="num">8</span>].<span class="fn">hex</span>())

<span class="cm"># Adım 4: HKDF-Extract sonra Expand → trafik anahtarları</span>
<span class="kw">def</span> <span class="fn">hkdf_extract</span>(salt, ikm):
    <span class="kw">return</span> hmac.<span class="fn">new</span>(salt, ikm, hashlib.sha256).<span class="fn">digest</span>()
<span class="kw">def</span> <span class="fn">hkdf_expand</span>(prk, info, length):
    out, T, i = <span class="fn">b''</span>, <span class="fn">b''</span>, <span class="num">1</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; length:
        T = hmac.<span class="fn">new</span>(prk, T+info+<span class="fn">bytes</span>([i]), hashlib.sha256).<span class="fn">digest</span>()
        out += T; i += <span class="num">1</span>
    <span class="kw">return</span> out[:length]

prk = <span class="fn">hkdf_extract</span>(<span class="fn">b'</span>\\x00<span class="fn">'</span>*<span class="num">32</span>, shared_c.<span class="fn">to_bytes</span>(<span class="num">32</span>,<span class="str">'big'</span>))
client_key = <span class="fn">hkdf_expand</span>(prk, <span class="fn">b'</span>tls13 c hs traffic<span class="fn">'</span>, <span class="num">16</span>)
server_key = <span class="fn">hkdf_expand</span>(prk, <span class="fn">b'</span>tls13 s hs traffic<span class="fn">'</span>, <span class="num">16</span>)
<span class="fn">print</span>(<span class="str">"client traffic key:"</span>, client_key.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">"server traffic key:"</span>, server_key.<span class="fn">hex</span>())</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Bir TLS context kurar — modern stack'ler 1-RTT handshake'le TLS 1.3'ü default kullanır (TLS 1.2'nin 2-RTT'sinden düşürerek), FREAK / Logjam gibi downgrade saldırılarını ortadan kaldırır. 2) TLS 1.3'te cipher suite'ler sadece AEAD'dir (AES-GCM, ChaCha20-Poly1305) — eski kötü CBC + HMAC kombinasyonları çıkartıldı. 3) Sertifika doğrulaması sunucu sertifikasını güvenilir köke X.509 path validation ile zincirler; OCSP stapling sunucunun hangi siteleri ziyaret ettiğinizi sızdırmadan tazelik kanıtlamasını sağlar. 4) mTLS'de istemci de sertifika sunar — zero-trust mimarilerde (BeyondCorp), service mesh'lerde (Istio, Linkerd) ve IP allowlist'in yetmediği her API'de kullanılır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcında çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı kod — pyodide standart kütüphanede <code>hashlib</code>, <code>hmac</code> ve <code>secrets</code> ile gelir, bu yüzden olduğu gibi çalışır.</p>
</div>
<p class="l-text"><strong>Akış:</strong> 1) İstemci ve sunucu her biri geçici anahtar çiftleri üretir (oyuncak X25519 modulus). 2) Genel anahtarları değişirler ve Diffie-Hellman ile aynı paylaşılan sırrı türetirler. 3) HKDF-Extract ham sırrı düzgün rastgele bir sözde-rastgele anahtara dönüştürür. 4) HKDF-Expand-Label her yön için ayrı trafik anahtarları türetir — tam olarak RFC 8446 bölüm 7.1'in öngördüğü gibi.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Sertifika Doğrulama (X.509 Zinciri)</h2>
<p class="l-text">Sunucu el sıkışma transcript'ini imzalayarak özel anahtara sahip olduğunu kanıtlar, ama o imzaya yalnızca genel anahtara güvenirsen güvenirsin. Güven bir zincirden gelir: leaf cert &rarr; ara CA &rarr; OS'inle gelen kök CA. Tarayıcın zinciri yürür, her imzayı kontrol eder, tarihleri doğrular, SAN'in ana bilgisayar adıyla eşleştiğini ve (isteğe bağlı olarak) OCSP stapling yoluyla iptali kontrol eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Leaf cert</div><div class="card-body">example.com için verildi. Genel anahtar, SAN, geçerlilik, veren içerir.</div></div>
<div class="calc-card"><div class="card-title">Ara</div><div class="card-body">Leaf'i imzalar. Kök tarafından verilir. Kökün çevrimdışı kalmasına izin verir.</div></div>
<div class="calc-card"><div class="card-title">Kök CA</div><div class="card-body">Kendi-imzalı. OS / tarayıcı güven deposunda önceden kuruludur (~150 kök).</div></div>
<div class="calc-card"><div class="card-title">İptal</div><div class="card-body">CRL (yavaş), OCSP (mahremiyet sızıntısı), OCSP stapling (modern), Must-Staple bayrağı.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="cm"># Oyuncak zincir: leaf ara tarafından imzalandı, ara kök tarafından imzalandı</span>
root_pub  = <span class="str">"ROOT_PUB_42"</span>
inter_pub = <span class="str">"INTER_PUB_99"</span>
leaf_pub  = <span class="str">"LEAF_PUB_example.com"</span>

<span class="cm"># Buradaki "imza" = sha256(content || signer_priv). Gerçek dünya = RSA/ECDSA.</span>
<span class="kw">def</span> <span class="fn">sign</span>(content, signer_priv):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>((content+signer_priv).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()
<span class="kw">def</span> <span class="fn">verify</span>(content, sig, signer_priv):
    <span class="kw">return</span> sig == <span class="fn">sign</span>(content, signer_priv)

inter_sig = <span class="fn">sign</span>(inter_pub, <span class="str">"ROOT_PRIV"</span>)
leaf_sig  = <span class="fn">sign</span>(leaf_pub,  <span class="str">"INTER_PRIV"</span>)

trusted_roots = {root_pub: <span class="str">"ROOT_PRIV"</span>}

<span class="cm"># Zinciri yürü</span>
chain_ok  = <span class="fn">verify</span>(inter_pub, inter_sig, trusted_roots[root_pub])
chain_ok &amp;= <span class="fn">verify</span>(leaf_pub, leaf_sig, <span class="str">"INTER_PRIV"</span>)
<span class="fn">print</span>(<span class="str">"Chain valid:"</span>, <span class="fn">bool</span>(chain_ok))

<span class="cm"># Ana bilgisayar adı kontrolü</span>
host = <span class="str">"example.com"</span>
san = [<span class="str">"example.com"</span>, <span class="str">"www.example.com"</span>]
<span class="fn">print</span>(<span class="str">"Hostname OK:"</span>, host <span class="kw">in</span> san)</code></pre></div>
<p class="l-text">Üretimde, OpenSSL gibi kütüphaneler ASN.1 DER'i ayrıştırır, zinciri yürür, yol uzunluğu kısıtlarını, anahtar kullanımını ve EKU bit'lerini uygular. Bunlardan birini yanlış yap ve bir CVE gönder — TLS kodunda bellek sınırları kapalıyken ne olduğunu görmek için <strong>CVE-2014-0160 (Heartbleed)</strong>'e bak.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Karşılıklı TLS (mTLS)</h2>
<p class="l-text">Standart TLS'te yalnızca sunucu kimliği doğrulanır. <strong>mTLS</strong>'te sunucu istemcinin de bir sertifika sunmasını gerektirir. Servis ağları (Istio, Linkerd), kurumsal API'ler ve sıfır güven ağları workload-to-workload kimlik doğrulamasını böyle yapar. Çalınabilen taşıyıcı token'lar yerine, mTLS bağlantıyı ideal olarak donanım modülünde (TPM, HSM, secure enclave) yaşayan bir özel anahtara bağlar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yalnızca-sunucu TLS</div><div class="card-body">Tarayıcı, kamu API'leri. İstemci kimliği = taşıyıcı token / cookie.</div></div>
<div class="calc-card"><div class="card-title">mTLS</div><div class="card-body">Her iki taraf sertifikalı. Servis ağında, bankacılık API'lerinde, IoT'de kullanılır.</div></div>
<div class="calc-card"><div class="card-title">SPIFFE / SPIRE</div><div class="card-body">mTLS için X.509-SVID üreten workload-kimlik standardı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. HTTP/3 ve QUIC</h2>
<p class="l-text">QUIC (RFC 9000) TLS 1.3'ü UDP üzerine taşır. TCP'nin head-of-line blocking'ini ortadan kaldırır — bir akış bir paket kaybettiğinde, diğerleri akmaya devam eder. Bağlantı geçişi telefonun Wi-Fi'dan LTE'ye geçtiğinde yeniden bağlanmadan bir HTTP/3 oturumunu canlı tutmasına izin verir. 2024'e kadar üst web sitelerinin dörtte birinden fazlası HTTP/3'ü destekliyor, Google, Cloudflare ve Meta dahil.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Taşıma</div><div class="card-body">TCP yerine UDP. Yerleşik TLS 1.3, ayrı el sıkışma yok.</div></div>
<div class="calc-card"><div class="card-title">Akışlar</div><div class="card-body">Bağımsız çoklanmış akışlar. HoL blocking yok.</div></div>
<div class="calc-card"><div class="card-title">Geçiş</div><div class="card-body">Bağlantı kimliği IP değişimine dayanır (Wi-Fi'dan hücreseli).</div></div>
<div class="calc-card"><div class="card-title">Şifreleme</div><div class="card-body">Çoğu başlık bile şifrelenir. Middlebox'lar daha az görür.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SNI, ESNI ve ECH (Ana Bilgisayar Adı Mahremiyeti)</h2>
<p class="l-text">TLS başladığında, istemci sunucuya hangi ana bilgisayar adını istediğini söylemelidir — birçok site bir IP paylaşır. Düz metin <strong>SNI</strong> o ana bilgisayar adını teli izleyen herkese sızdırır. <strong>ESNI</strong> (taslaklandı, kullanımdan kaldırıldı) yalnızca SNI alanını şifrelemeye çalıştı. <strong>ECH</strong> (Encrypted Client Hello, RFC taslakları artı Cloudflare/Mozilla dağıtımı) DNS HTTPS kayıtları yoluyla alınan bir genel anahtar kullanarak tüm iç ClientHello'yu şifreler. Sonuç: pasif bir gözlemci yalnızca Cloudflare'i ziyaret ettiğini görür, hangi Cloudflare-host'lu siteyi değil.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SNI (bugün)</div><div class="card-body">Düz metinde ana bilgisayar adı. Sansür ve ad-tech ona bayılır.</div></div>
<div class="calc-card"><div class="card-title">ESNI (kullanımdan kaldırıldı)</div><div class="card-body">Yalnızca şifreli SNI. ECH ile değiştirildi.</div></div>
<div class="calc-card"><div class="card-title">ECH</div><div class="card-body">Tam iç ClientHello şifreli. DNS HTTPS RR'da genel anahtar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. El Sıkışma Gecikme Görselleştirmesi</h2>
<p class="l-text">Round-trip sayısı uzun-mesafeli bağlantılarda güvenli bağlantıların baskın maliyetidir. Aşağıda: TLS 1.2 vs 1.3 1-RTT vs 1.3 0-RTT, 50 ms RTT bağlantısında ekstra milisaniye olarak ölçülmüş.</p>
<div class="plotly-graph" id="netsec1-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tehdit Modeli Özeti</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pasif gözlemci</div><div class="card-body">TLS 1.3 + ECH ile yenilir. Yalnızca TCP/UDP metaverisini görür.</div></div>
<div class="calc-card"><div class="card-title">Aktif MITM</div><div class="card-body">Sertifika doğrulama + HSTS + pinning ile yenilir.</div></div>
<div class="calc-card"><div class="card-title">Ele geçirilmiş CA</div><div class="card-body">Certificate Transparency log'ları (RFC 6962) ile hafifletilir.</div></div>
<div class="calc-card"><div class="card-title">Kuantum saldırgan</div><div class="card-body">Gelecek. Hibrit Kyber + X25519 zaten Cloudflare/Chrome tarafından dağıtıldı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Kilit Çıkarımlar</h2>
<div class="think-box"><div class="think-label">KİLİT ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> TLS 1.3 (RFC 8446) el sıkışma gecikmesini yarıya indirdi — 1-RTT, yalnızca AEAD, zorunlu ileri gizlilik.<br><strong>2.</strong> 0-RTT hızlıdır ama replay'e eğilimlidir; yalnızca idempotent istekler için kullan.<br><strong>3.</strong> Sertifika doğrulama = zincir imza kontrolleri + ana bilgisayar adı eşleşmesi + iptal + tarihler.<br><strong>4.</strong> mTLS her iki tarafı doğrular — servis-ağı ve sıfır güven workload kimliğinin temeli.<br><strong>5.</strong> HTTP/3 + QUIC head-of-line blocking'i öldürür ve ağ değişikliklerinden sağ çıkar.<br><strong>6.</strong> ECH modern web yığınındaki son büyük düz metin sızıntısını kapatır.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var labels = ['TLS 1.2 (2-RTT)', 'TLS 1.3 (1-RTT)', 'TLS 1.3 (0-RTT devam)'];
  var ms = [110, 55, 5];
  var data = [{x:labels, y:ms, type:'bar', marker:{color:[T.grid, T.accent, '#7cc']}}];
  var layout = {title:'50 ms RTT bağlantısında el sıkışma gecikmesi', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{gridcolor:T.grid}, yaxis:{title:'app verisinden önce ms', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  var el = document.getElementById('netsec1-plot-tr'); if(el && window.Plotly) Plotly.newPlot('netsec1-plot-tr', data, layout, {displayModeBar:false});
},250);
</script>`
};
