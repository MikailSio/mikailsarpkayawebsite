window.CRYPTO_L4 = {
en: `<p class="l-text"><strong>Public-Key Infrastructure (PKI) is the silent referee of the internet.</strong> Every time your browser shows a padlock next to <code>https://</code>, a chain of digital certificates has been validated, a TLS handshake has been completed, and a set of cryptographic primitives — RSA or ECDSA signatures, ECDHE key agreement, AES-GCM or ChaCha20-Poly1305 AEAD — has been negotiated. None of this works without certificates: structured documents that bind a public key to an identity (a domain name, an email address, a code-signing publisher) and are signed by a Certificate Authority (CA) the browser already trusts.</p>

<p class="l-text">In this lesson we walk the X.509 v3 certificate format, follow a TLS 1.3 handshake byte-by-byte, explain why <strong>Certificate Transparency</strong> log monitoring caught Symantec mis-issuing certificates in 2017 (and got Symantec's CA business sold to DigiCert), trace Let's Encrypt's ACME protocol that has issued over 4 billion free certificates since 2015, and unpack OCSP, OCSP stapling, and CRLite — three generations of revocation telling you that "this certificate, while still inside its validity window, must no longer be trusted." We close with PKI failure modes: Comodo 2011, DigiNotar 2011 (the CA that <em>collapsed</em> after Iranian state actors forged Google certs), Symantec 2017.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read an X.509 v3 certificate (Subject, Issuer, SAN, Key Usage, AIA, CT SCTs)</li>
<li>Trace the TLS 1.3 handshake (1-RTT) and explain why TLS 1.2's 2-RTT is gone</li>
<li>Validate a chain to a trusted root and check name-constraints, EKU, path length</li>
<li>Explain Certificate Transparency: Merkle-tree append-only logs, SCTs, monitors</li>
<li>Issue a real cert with Let's Encrypt's ACME (HTTP-01, DNS-01, TLS-ALPN-01)</li>
<li>Pick revocation: CRL (dead), OCSP (privacy leak), OCSP stapling, CRLite (Firefox 2020+)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The X.509 v3 Certificate — A Signed Statement of Identity</h2>
<p class="l-text">An X.509 certificate is a structured document: an ASN.1 DER-encoded blob (or its base64-wrapped PEM form starting with <code>-----BEGIN CERTIFICATE-----</code>) containing a <strong>tbsCertificate</strong> (to-be-signed) section and a <strong>signature</strong> over it by the issuing CA. The tbsCertificate carries the Subject (whose key is this?), Issuer (who signed?), Validity (notBefore / notAfter), Public Key, and a list of <strong>extensions</strong>. The whole thing is hashed with SHA-256 and signed with the CA's RSA-2048+ or ECDSA P-256 private key.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Subject Alternative Name (SAN)</div><div class="card-body">DNS names this cert covers. Modern browsers ignore the legacy CN field. <code>SAN: example.com, www.example.com</code>. Wildcards allowed: <code>*.example.com</code> covers one label.</div></div>
<div class="calc-card"><div class="card-title">Key Usage / Extended Key Usage</div><div class="card-body">KU: digitalSignature, keyEncipherment. EKU: serverAuth (1.3.6.1.5.5.7.3.1) for TLS server, clientAuth, codeSigning, emailProtection. Mismatch = browser rejects.</div></div>
<div class="calc-card"><div class="card-title">Authority Information Access (AIA)</div><div class="card-body">URLs to fetch the issuer's certificate (caIssuers) and OCSP responder. Modern clients chase AIA to repair incomplete chains.</div></div>
<div class="calc-card"><div class="card-title">CT Signed Certificate Timestamps (SCTs)</div><div class="card-body">Embedded proofs that the cert was logged to ≥2 CT logs. Required by Chrome since April 2018 for all public certs. Without SCTs: browser shows error.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">We parse a synthetic X.509-like structure to walk the field layout. (Real ASN.1 parsing needs <code>cryptography</code> which is heavy in Pyodide; we mimic the field shape.)</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, json
<span class="kw">from</span> datetime <span class="kw">import</span> datetime, timedelta

<span class="kw">def</span> <span class="fn">make_cert</span>(subject, issuer, pubkey_hex, days=<span class="num">90</span>, sans=<span class="kw">None</span>, eku=<span class="kw">None</span>):
    tbs = {
        <span class="str">'version'</span>: <span class="str">'v3'</span>,
        <span class="str">'serial'</span>: <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>((subject+issuer).<span class="fn">encode</span>()).<span class="fn">digest</span>()[:<span class="num">8</span>], <span class="str">'big'</span>),
        <span class="str">'sigAlg'</span>: <span class="str">'sha256WithRSAEncryption'</span>,
        <span class="str">'issuer'</span>: issuer,
        <span class="str">'subject'</span>: subject,
        <span class="str">'notBefore'</span>: <span class="fn">datetime</span>(<span class="num">2026</span>, <span class="num">5</span>, <span class="num">4</span>).<span class="fn">isoformat</span>(),
        <span class="str">'notAfter'</span>:  (<span class="fn">datetime</span>(<span class="num">2026</span>, <span class="num">5</span>, <span class="num">4</span>) + <span class="fn">timedelta</span>(days=days)).<span class="fn">isoformat</span>(),
        <span class="str">'pubKey'</span>: pubkey_hex,
        <span class="str">'extensions'</span>: {
            <span class="str">'SAN'</span>: sans <span class="kw">or</span> [subject],
            <span class="str">'EKU'</span>: eku <span class="kw">or</span> [<span class="str">'serverAuth'</span>],
            <span class="str">'KU'</span>:  [<span class="str">'digitalSignature'</span>, <span class="str">'keyEncipherment'</span>],
            <span class="str">'BC'</span>:  <span class="str">'CA:FALSE'</span>,
        }
    }
    <span class="kw">return</span> tbs

cert = <span class="fn">make_cert</span>(<span class="str">'example.com'</span>, <span class="str">"Let's Encrypt R3"</span>,
                 pubkey_hex=<span class="str">'30820122300d06092a...'</span>[:<span class="num">32</span>]+<span class="str">'...'</span>,
                 sans=[<span class="str">'example.com'</span>, <span class="str">'www.example.com'</span>])

<span class="fn">print</span>(json.<span class="fn">dumps</span>(cert, indent=<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'\\nFingerprint (SHA-256):'</span>,
      hashlib.<span class="fn">sha256</span>(json.<span class="fn">dumps</span>(cert, sort_keys=<span class="kw">True</span>).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()[:<span class="num">32</span>], <span class="str">'...'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>make_cert</code> builds the X.509 <em>TBSCertificate</em> (To-Be-Signed) block — the version is <code>v3</code> (the only one used post-1999), and the serial number is derived deterministically from <code>SHA-256(subject||issuer)</code> truncated to 8 bytes, mimicking how real CAs guarantee uniqueness with a CSPRNG-generated 64+ bit serial (RFC 5280 mandates this since 2008). 2) <code>notBefore</code> / <code>notAfter</code> are set to a 90-day validity window — exactly the Let's Encrypt cadence; the CA/Browser Forum baseline caps any public TLS cert at 397 days as of 2020. 3) The <code>extensions</code> dict shows the four extensions every leaf cert carries: <code>SAN</code> (Subject Alternative Names — what hostnames this cert is valid for; modern browsers ignore the CN entirely), <code>EKU=serverAuth</code> (extended key usage restricting the cert to TLS server authentication), <code>KU</code> (key usage: digitalSignature for ECDSA + keyEncipherment for legacy RSA-KEX), and <code>BC=CA:FALSE</code> (Basic Constraints — this leaf must never sign another cert). 4) The final <code>hashlib.sha256(...)</code> over the canonicalized JSON produces the certificate fingerprint — the same SHA-256 that browsers display in the cert viewer and that pinning systems (HPKP, CT log entries, Expect-CT) hash to identify a specific cert binary.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Trust Store — Where Roots Live</h2>
<p class="l-text">Your operating system and browser ship with a list of <strong>root CA certificates</strong> they unconditionally trust. Mozilla's NSS root store (~140 roots in 2026) drives Firefox; Apple, Microsoft, and Google maintain their own. A certificate is valid only if you can build a chain from it, hop by hop, up to one of these roots — every certificate in the chain signed by the next one's private key.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Root CA</div><div class="card-body">Self-signed. Lives offline in an HSM in a literal vault. Validity 20-30 years. Examples: ISRG Root X1 (Let's Encrypt), DigiCert Global Root G2, GlobalSign Root.</div></div>
<div class="calc-card"><div class="card-title">Intermediate CA</div><div class="card-body">Signed by root, issues end-entity certs. Lives online with HSM. Validity 3-5 years. Examples: Let's Encrypt R3 / R10 / R11, DigiCert TLS RSA SHA256 2020 CA1.</div></div>
<div class="calc-card"><div class="card-title">End-entity (leaf)</div><div class="card-body">Your <code>example.com</code>. Validity ≤90 days for Let's Encrypt, ≤397 days max per CA/Browser Forum baseline (2020+).</div></div>
<div class="calc-card"><div class="card-title">Cross-signing</div><div class="card-body">A new root is issued for years before being added to root stores. Trick: have an existing trusted root cross-sign the new root, so the new root immediately works for old clients. Used by ISRG Root X1 (cross-signed by IdenTrust 2015-2024).</div></div>
</div>

<div class="calc-highlight"><strong>Path validation rules (RFC 5280):</strong> for every cert in the chain, verify (a) signature by issuer's public key, (b) current time within validity window, (c) not revoked, (d) basic constraints CA:TRUE for non-leaf, (e) name constraints honored, (f) key usage / EKU match the use, (g) path length ≤ allowed, (h) policy constraints satisfied. Reject anything that fails.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The TLS 1.3 Handshake — 1-RTT to a Secure Channel</h2>
<p class="l-text">TLS 1.3 (RFC 8446, August 2018) is the first TLS revision designed from a clean security analysis rather than incrementally patched. It removes RSA key transport (forward secrecy is mandatory), removes static DH, removes CBC mode, removes RC4, removes renegotiation, removes compression. What remains: ECDHE for key exchange, signatures from the server's cert, AEAD ciphers (AES-GCM / ChaCha20-Poly1305), HKDF for key derivation. The handshake is a single round-trip (1-RTT), down from 2-RTT in TLS 1.2.</p>

<div class="katex-block">$$\\text{shared\\_secret} = \\text{ECDH}(\\text{client\\_priv}, \\text{server\\_pub}) \\xrightarrow{\\text{HKDF}} \\text{handshake\\_keys}, \\text{traffic\\_keys}$$</div>

<p class="l-text">Step by step: ClientHello carries supported cipher suites + an ephemeral ECDH public key in the <code>key_share</code> extension. ServerHello picks a suite and sends its own ECDH public key — both sides can now derive the handshake secret <em>before any other message</em>. Server then sends EncryptedExtensions, Certificate (chain), CertificateVerify (signature over the handshake transcript with the cert's private key), Finished (HMAC of transcript). Client verifies the cert chain, verifies CertificateVerify, sends its Finished. Done — application data flows.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">We model the TLS 1.3 handshake as a small state machine — ECDH over a toy group, HKDF key derivation, AEAD-style sealing.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, hmac, secrets

<span class="cm"># Toy ECDH-like group: integers mod prime p with generator g</span>
p = (<span class="num">1</span> &lt;&lt; <span class="num">255</span>) - <span class="num">19</span>  <span class="cm"># Curve25519's prime field size</span>
g = <span class="num">9</span>                <span class="cm"># not really a curve, just a demo group</span>

<span class="kw">def</span> <span class="fn">kx_keypair</span>():
    priv = secrets.<span class="fn">randbelow</span>(p - <span class="num">2</span>) + <span class="num">1</span>
    pub  = <span class="fn">pow</span>(g, priv, p)
    <span class="kw">return</span> priv, pub

<span class="kw">def</span> <span class="fn">hkdf_extract_expand</span>(salt, ikm, info, length=<span class="num">32</span>):
    prk = hmac.<span class="fn">new</span>(salt, ikm, hashlib.sha256).<span class="fn">digest</span>()
    out, t = b<span class="str">''</span>, b<span class="str">''</span>
    counter = <span class="num">1</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; length:
        t = hmac.<span class="fn">new</span>(prk, t + info + <span class="fn">bytes</span>([counter]), hashlib.sha256).<span class="fn">digest</span>()
        out += t; counter += <span class="num">1</span>
    <span class="kw">return</span> out[:length]

<span class="cm"># Client and server each generate ephemeral key pairs</span>
c_priv, c_pub = <span class="fn">kx_keypair</span>()
s_priv, s_pub = <span class="fn">kx_keypair</span>()

<span class="cm"># Both compute the same shared secret</span>
shared_c = <span class="fn">pow</span>(s_pub, c_priv, p)
shared_s = <span class="fn">pow</span>(c_pub, s_priv, p)
<span class="kw">assert</span> shared_c == shared_s

shared_bytes = shared_c.<span class="fn">to_bytes</span>(<span class="num">32</span>, <span class="str">'big'</span>)
transcript   = b<span class="str">'ClientHello||ServerHello'</span>

handshake_secret = <span class="fn">hkdf_extract_expand</span>(b<span class="str">'\\x00'</span>*<span class="num">32</span>, shared_bytes, b<span class="str">'tls13 handshake'</span>)
client_hs_key    = <span class="fn">hkdf_extract_expand</span>(handshake_secret, transcript, b<span class="str">'tls13 c hs traffic'</span>, <span class="num">16</span>)
server_hs_key    = <span class="fn">hkdf_extract_expand</span>(handshake_secret, transcript, b<span class="str">'tls13 s hs traffic'</span>, <span class="num">16</span>)

<span class="fn">print</span>(<span class="str">'shared secret (first 16 hex bytes):'</span>, shared_bytes[:<span class="num">16</span>].<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'client handshake key:               '</span>, client_hs_key.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'server handshake key:               '</span>, server_hs_key.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'1-RTT achieved: app data can flow after one round-trip.'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>p = (1 &lt;&lt; 255) - 19</code> reuses the prime field size of Curve25519 (2^255 − 19) — real X25519 operates on the Montgomery-form curve, not the multiplicative group, but the field is the same and the demo shows the data flow without the curve arithmetic. 2) <code>kx_keypair</code> draws an ephemeral scalar with <code>secrets.randbelow</code> (CSPRNG-backed; never <code>random.random</code> in crypto code) and publishes <code>g^priv mod p</code> — TLS 1.3 forbids static DH so this happens fresh on every handshake to give forward secrecy. 3) Both sides compute <code>pow(peer_pub, my_priv, p)</code> and arrive at the same shared integer — the standard Diffie-Hellman commutativity, encoded as 32 raw bytes (<code>to_bytes(32, 'big')</code>) the way RFC 7748 specifies for X25519. 4) <code>hkdf_extract_expand</code> implements the HKDF (RFC 5869) <em>Extract-then-Expand</em> structure exactly: HMAC-SHA256 first compresses the shared secret to a uniform PRK, then iterated HMAC blocks with a counter byte produce as many keys as needed — handshake transcript binds the label <code>tls13 c/s hs traffic</code>, yielding the same client/server handshake keys the TLS 1.3 specification calls <code>client_handshake_traffic_secret</code> and <code>server_handshake_traffic_secret</code>.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Certificate Transparency — Append-Only Logs of Every Cert</h2>
<p class="l-text">In 2011 the Dutch CA <strong>DigiNotar</strong> was breached; attackers issued *.google.com and the certificate was used to MITM Iranian Gmail users for weeks before anyone noticed. The lesson: a CA can issue a perfectly valid cert that no one outside the attack target ever sees. The fix, proposed by Google's Ben Laurie, Adam Langley, and Emilia Käsper (RFC 6962, 2013): require every CA to publish every certificate it issues to <strong>public, append-only, Merkle-tree-backed logs</strong>. Anyone can monitor the logs for unexpected issuance; the cryptography (Merkle inclusion + consistency proofs) prevents the log from removing or back-dating entries.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SCT (Signed Certificate Timestamp)</div><div class="card-body">A log's promise to include a cert within the Maximum Merge Delay (24h). Embedded in the cert itself (X.509 extension), in OCSP, or in the TLS handshake. Chrome requires ≥2 SCTs since 2018.</div></div>
<div class="calc-card"><div class="card-title">CT log</div><div class="card-body">Append-only Merkle tree. Examples: Google Argon, Cloudflare Nimbus, Let's Encrypt Oak. Logs are sharded by year. Chrome's CT log policy lists ~20 trusted logs.</div></div>
<div class="calc-card"><div class="card-title">CT monitor</div><div class="card-body">Service that watches all logs for certs matching your domain. Examples: crt.sh (Sectigo), Cert Spotter (SSLMate), Facebook Certificate Transparency Monitoring. Free for any domain owner.</div></div>
<div class="calc-card"><div class="card-title">Real impact</div><div class="card-body">In 2017 Google's CT monitoring proved Symantec had mis-issued thousands of certs without proper validation. Outcome: Chrome distrusted Symantec's CA business; Symantec sold it to DigiCert.</div></div>
</div>

<p class="l-text">If you run any production domain, sign up for a CT monitor today. <code>https://crt.sh/?q=yourdomain.com</code> shows every cert ever issued for it. New, unexpected certs = breach signal.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Let's Encrypt and ACME — Free, Automated TLS at Scale</h2>
<p class="l-text">Until 2015, getting a TLS cert meant paying $50-500/year, emailing a CA, and hand-installing the result. <strong>Let's Encrypt</strong> (Internet Security Research Group, founded 2015) offered free certs and an automation protocol — <strong>ACME (Automatic Certificate Management Environment, RFC 8555)</strong>. By 2026 Let's Encrypt has issued over 4 billion certificates and roughly 60% of all public web certs are theirs.</p>

<p class="l-text">The ACME flow: your client (certbot, acme.sh, Caddy, Traefik, lego, ...) creates an account keypair, requests a cert for a list of names, the server returns a list of <strong>challenges</strong> proving you control each name. You complete a challenge, the server validates, then issues the cert. Three challenge types:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">HTTP-01</div><div class="card-body">Place a token at <code>http://example.com/.well-known/acme-challenge/&lt;token&gt;</code>. Server fetches it. Default for Caddy. Cannot do wildcards.</div></div>
<div class="calc-card"><div class="card-title">DNS-01</div><div class="card-body">Add a TXT record <code>_acme-challenge.example.com</code> with the token. Slower (DNS propagation). Required for wildcards. Needs DNS API access from cert client.</div></div>
<div class="calc-card"><div class="card-title">TLS-ALPN-01</div><div class="card-body">Serve a special cert during a TLS connection on port 443 with ALPN <code>acme-tls/1</code>. Useful when you cannot serve HTTP at port 80 (mailservers, IoT).</div></div>
<div class="calc-card"><div class="card-title">EAB (External Account Binding)</div><div class="card-body">Required for paid CAs (ZeroSSL, Google Public CA) so they can link your ACME account to their billing/quota system. Not used by Let's Encrypt.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — uses 'acme' library which is not in Pyodide.</span>
<span class="cm"># Run locally: pip install acme certbot</span>
<span class="kw">from</span> acme <span class="kw">import</span> client, messages, challenges, crypto_util
<span class="kw">from</span> cryptography.hazmat.primitives.asymmetric <span class="kw">import</span> rsa

ACCOUNT_KEY = rsa.<span class="fn">generate_private_key</span>(public_exponent=<span class="num">65537</span>, key_size=<span class="num">2048</span>)
DIRECTORY   = <span class="str">'https://acme-v02.api.letsencrypt.org/directory'</span>

net   = client.<span class="fn">ClientNetwork</span>(ACCOUNT_KEY, user_agent=<span class="str">'example-acme/1.0'</span>)
dirs  = messages.Directory.<span class="fn">from_json</span>(net.<span class="fn">get</span>(DIRECTORY).<span class="fn">json</span>())
acme  = client.<span class="fn">ClientV2</span>(dirs, net)

<span class="cm"># Register account</span>
account = acme.<span class="fn">new_account</span>(messages.NewRegistration.<span class="fn">from_data</span>(
    email=<span class="str">'admin@example.com'</span>, terms_of_service_agreed=<span class="kw">True</span>))

<span class="cm"># Order a cert for example.com + www.example.com</span>
csr_pem, key_pem = crypto_util.<span class="fn">make_csr</span>(<span class="kw">None</span>, [<span class="str">'example.com'</span>, <span class="str">'www.example.com'</span>])
order = acme.<span class="fn">new_order</span>(csr_pem)

<span class="kw">for</span> authz <span class="kw">in</span> order.authorizations:
    http01 = <span class="fn">next</span>(c <span class="kw">for</span> c <span class="kw">in</span> authz.body.challenges
                  <span class="kw">if</span> <span class="fn">isinstance</span>(c.chall, challenges.HTTP01))
    <span class="cm"># Place token at /.well-known/acme-challenge/&lt;http01.chall.token&gt;</span>
    <span class="cm"># Then notify the server we are ready:</span>
    acme.<span class="fn">answer_challenge</span>(http01, http01.<span class="fn">response</span>(ACCOUNT_KEY))

finalized = acme.<span class="fn">finalize_order</span>(order, deadline=<span class="kw">None</span>)
<span class="fn">print</span>(<span class="str">'Got cert PEM, length ='</span>, <span class="fn">len</span>(finalized.fullchain_pem))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates an asymmetric keypair — for RSA pick 3072+ bits (2048 deprecated by NIST after 2030); for ECDSA prefer P-256 / Ed25519 (faster, smaller, side-channel safer). 2) Public key is shareable (publish it, certify it, pin it in TLS); private key NEVER leaves the secure enclave / HSM / KMS in production. 3) sign(message_hash) produces a signature using the private key; verify(message, signature, public_key) returns boolean — never roll your own ECDSA without deterministic-k (RFC 6979) or k reuse leaks the private key (PlayStation 3 disaster, 2010). 4) For X25519 / ECDH key exchange, both parties combine their private key with the other's public key to derive a shared secret, then run it through HKDF before using as a symmetric key.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Revocation — CRL, OCSP, OCSP Stapling, CRLite</h2>
<p class="l-text">Certificates have validity windows up to 397 days, but a key compromise demands immediate revocation. The history of revocation in the web PKI is a slow-motion catastrophe of broken assumptions, leaked privacy, and finally the realization that "browsers ignore revocation, so don't depend on it" was the operational reality for years.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CRL (Certificate Revocation List)</div><div class="card-body">CA publishes a giant signed list of revoked serial numbers, refreshed daily/weekly. Browsers must download it. CloudFlare's CRL is ~10 MB. Doesn't scale. Mostly abandoned for browsers.</div></div>
<div class="calc-card"><div class="card-title">OCSP</div><div class="card-body">Browser asks CA "is serial X revoked?" over HTTP. Privacy disaster: CA learns every site you visit. Soft-fail (browser accepts cert if OCSP unreachable) means an attacker who blocks OCSP wins. Apple started removing OCSP for non-EV in 2022.</div></div>
<div class="calc-card"><div class="card-title">OCSP stapling</div><div class="card-body">Server fetches its own OCSP response (signed, time-stamped, ~7 days valid) and includes it in the TLS handshake. Privacy-preserving, fast. Must-Staple X.509 extension forces the client to require it.</div></div>
<div class="calc-card"><div class="card-title">CRLite (Firefox 2020+)</div><div class="card-body">Mozilla aggregates all CRLs daily, compresses with cascading Bloom filters, ships ~1 MB delta to Firefox. O(1) lookup, zero leakage, no soft-fail. Chrome's CRLSets are similar but smaller (only "important" revocations).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Mutual TLS (mTLS) and Client Certificates</h2>
<p class="l-text">In ordinary TLS, only the server presents a certificate; the client authenticates with a password or token over the encrypted channel. In <strong>mTLS</strong>, the client also has a certificate (signed by an internal CA), and the server validates it at handshake time. mTLS is the de-facto standard for service-to-service authentication inside Kubernetes meshes (Istio, Linkerd), for IoT (every Tesla, Apple TV, Sonos device has a unique client cert burned at the factory), and for high-assurance APIs (Cloudflare Access, AWS API Gateway with private CAs).</p>

<div class="calc-highlight"><strong>Why mTLS beats bearer tokens:</strong> private key never leaves the client, so a stolen log file (with bearer tokens) is useless. Combined with hardware-bound keys (TPM, Secure Enclave), even a fully compromised host cannot exfiltrate the credential. SPIFFE / SPIRE codify this for clouds.</div>

<p class="l-text">SPIFFE IDs (Secure Production Identity Framework For Everyone) are URIs of the form <code>spiffe://example.org/ns/prod/sa/checkout</code>, embedded as a SAN URI in the workload's certificate. Service A trusts service B based on its SPIFFE ID, not its IP. Cert rotation every 1-24 hours via SPIRE.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PKI Failures — DigiNotar, Comodo, Symantec, ANSSI</h2>
<p class="l-text">The web PKI's core flaw is that <strong>any of ~140 roots can issue any cert for any domain</strong>. One compromised CA = the entire system breaks for every site. The history is sobering.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Comodo (March 2011)</div><div class="card-body">Reseller account in Italy compromised. 9 fraudulent certs issued, including login.yahoo.com, mail.google.com, addons.mozilla.org. Iranian state actor suspected. Caught by Comodo's own monitoring within hours.</div></div>
<div class="calc-card"><div class="card-title">DigiNotar (June-Aug 2011)</div><div class="card-body">Dutch CA fully compromised. 531 fraudulent certs issued, including *.google.com, used for ~weeks of MITM against ~300k Iranian Gmail users. DigiNotar went bankrupt within 2 months. Triggered the development of CT.</div></div>
<div class="calc-card"><div class="card-title">ANSSI (Dec 2013)</div><div class="card-body">French government CA's intermediate was used by a French-government MITM proxy to intercept Google traffic on a private network. Detected by Chrome's pinning. Trust constrained to *.fr only.</div></div>
<div class="calc-card"><div class="card-title">Symantec (2017-2018)</div><div class="card-body">Years of issuing certs without proper domain validation. CT monitoring exposed the pattern. Chrome distrusted in two phases (2018-2019). Symantec sold its CA to DigiCert.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Pitfalls and Best Practices</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting renewal</div><div class="card-body">Even with Let's Encrypt's 90-day certs, sites still expire. Use ACME automation (certbot --renew, Caddy auto-https), monitor with uptime/expiry checks (Datadog SSL monitor, ssl-checker.io).</div></div>
<div class="calc-card"><div class="card-title">Mixed-cert scope</div><div class="card-body">A wildcard cert covers <code>*.example.com</code> but not <code>example.com</code> itself or <code>foo.bar.example.com</code>. List all SANs explicitly when in doubt.</div></div>
<div class="calc-card"><div class="card-title">Self-signing in prod</div><div class="card-body">Browsers reject. For internal services, run your own private CA (smallstep CA, HashiCorp Vault PKI) and distribute the root via MDM/Ansible.</div></div>
<div class="calc-card"><div class="card-title">CT-less certs in 2026</div><div class="card-body">Chrome and Safari hard-fail. If your CA does not provide SCTs, switch CAs. Let's Encrypt has done this since 2018.</div></div>
<div class="calc-card"><div class="card-title">Pinning beyond HPKP</div><div class="card-body">HTTP Public Key Pinning (HPKP) was deprecated in 2018 — too many self-DoS incidents. Use Expect-CT (also deprecated 2024 since CT is now mandatory) or app-level pinning with multiple backup pins.</div></div>
<div class="calc-card"><div class="card-title">Storing private keys</div><div class="card-body">Mode 0600, never in Git. Use HSM, AWS KMS, GCP Cloud HSM, or a sealed-secrets workflow. Cert keys leak constantly via .git/ exposures and S3 misconfigurations.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">PKI is the trust fabric of the modern internet: X.509 certificates bind keys to identities; CAs sign them; browsers ship a list of trusted roots; TLS 1.3 negotiates a forward-secret channel in 1-RTT; Certificate Transparency makes mis-issuance publicly observable; ACME automates the whole lifecycle for free. The system has failed (DigiNotar, Symantec) and survived because of redundancy and CT.</p>

<p class="l-text">Lesson 5 takes a sharp left into a different family of crypto: <strong>Zero-Knowledge Proofs</strong>. Instead of "here is my secret, please verify it," ZK lets you prove you know a secret <em>without revealing anything about it</em>. From Schnorr's identification scheme (1989) to zk-SNARKs powering Tornado Cash and zkSync, this is the cryptography of privacy-preserving computation.</p>
</div>`,
tr: `<p class="l-text"><strong>Public-Key Infrastructure (PKI), internetin sessiz hakemidir.</strong> Tarayıcınız <code>https://</code>'in yanında bir asma kilit gösterdiğinde, dijital sertifikaların bir zinciri doğrulanmış, bir TLS el sıkışması tamamlanmış ve bir dizi kriptografik primitif — RSA veya ECDSA imzaları, ECDHE anahtar anlaşması, AES-GCM veya ChaCha20-Poly1305 AEAD — müzakere edilmiştir. Bunların hiçbiri sertifikalar olmadan çalışmaz: bir genel anahtarı bir kimliğe (bir alan adı, bir e-posta adresi, bir kod-imzalama yayıncısı) bağlayan ve tarayıcının zaten güvendiği bir Sertifika Otoritesi (CA) tarafından imzalanan yapılandırılmış belgeler.</p>

<p class="l-text">Bu derste X.509 v3 sertifika formatını yürüyoruz, bir TLS 1.3 el sıkışmasını bayt bayt takip ediyoruz, <strong>Sertifika Şeffaflığı</strong> kayıt izlemenin 2017'de Symantec'in sertifika yanlış-vermesini neden yakaladığını açıklıyoruz (ve Symantec'in CA işinin DigiCert'e satılmasına neden oldu), 2015'ten beri 4 milyardan fazla ücretsiz sertifika veren Let's Encrypt'in ACME protokolünü izliyoruz ve OCSP, OCSP stapling ve CRLite'ı paketten çıkarıyoruz — size "bu sertifika, geçerlilik penceresi içinde olsa da artık güvenilmemelidir" diyen üç kuşak iptal. PKI başarısızlık modlarıyla kapatıyoruz: Comodo 2011, DigiNotar 2011 (İran devlet aktörlerinin Google sertifikalarını sahteleştirmesinden sonra <em>çöken</em> CA), Symantec 2017.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir X.509 v3 sertifikasını okuyun (Subject, Issuer, SAN, Key Usage, AIA, CT SCT'leri)</li>
<li>TLS 1.3 el sıkışmasını (1-RTT) izleyin ve TLS 1.2'nin 2-RTT'sinin neden gittiğini açıklayın</li>
<li>Bir zinciri güvenilir bir köke doğrulayın ve isim kısıtlamaları, EKU, yol uzunluğunu kontrol edin</li>
<li>Sertifika Şeffaflığını açıklayın: Merkle-ağacı sadece-ekleme kayıtları, SCT'ler, monitörler</li>
<li>Let's Encrypt'in ACME'si ile gerçek bir sertifika verin (HTTP-01, DNS-01, TLS-ALPN-01)</li>
<li>İptal seçin: CRL (ölü), OCSP (gizlilik sızıntısı), OCSP stapling, CRLite (Firefox 2020+)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. X.509 v3 Sertifikası — Kimliğin İmzalı Bir Beyanı</h2>
<p class="l-text">Bir X.509 sertifikası yapılandırılmış bir belgedir: <code>-----BEGIN CERTIFICATE-----</code> ile başlayan ASN.1 DER kodlanmış bir blob (veya base64 sarmalanmış PEM formu), bir <strong>tbsCertificate</strong> (imzalanacak) bölümünü ve onun üzerinde veren CA'nın bir <strong>imzasını</strong> içerir. tbsCertificate; Subject (bu kim için anahtar?), Issuer (kim imzaladı?), Validity (notBefore / notAfter), Public Key ve <strong>uzantılar</strong> listesi taşır. Tüm şey SHA-256 ile hash'lenir ve CA'nın RSA-2048+ veya ECDSA P-256 özel anahtarı ile imzalanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Subject Alternative Name (SAN)</div><div class="card-body">Bu sertifikanın kapsadığı DNS adları. Modern tarayıcılar eski CN alanını yok sayar. <code>SAN: example.com, www.example.com</code>. Joker karakterlere izin verilir: <code>*.example.com</code> bir etiketi kapsar.</div></div>
<div class="calc-card"><div class="card-title">Key Usage / Extended Key Usage</div><div class="card-body">KU: digitalSignature, keyEncipherment. EKU: TLS sunucusu için serverAuth (1.3.6.1.5.5.7.3.1), clientAuth, codeSigning, emailProtection. Uyumsuzluk = tarayıcı reddeder.</div></div>
<div class="calc-card"><div class="card-title">Authority Information Access (AIA)</div><div class="card-body">Veren sertifikasını (caIssuers) ve OCSP yanıtlayıcıyı almak için URL'ler. Modern istemciler eksik zincirleri onarmak için AIA'yı takip eder.</div></div>
<div class="calc-card"><div class="card-title">CT İmzalı Sertifika Zaman Damgaları (SCT'ler)</div><div class="card-body">Sertifikanın ≥2 CT kaydına kaydedildiğine dair gömülü kanıtlar. Tüm genel sertifikalar için Nisan 2018'den beri Chrome tarafından gerekli. SCT olmadan: tarayıcı hata gösterir.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Alan düzenini yürümek için sentetik bir X.509 benzeri yapıyı ayrıştırıyoruz. (Gerçek ASN.1 ayrıştırma Pyodide'de ağır olan <code>cryptography</code>'ye ihtiyaç duyar; alan şeklini taklit ediyoruz.)</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, json
<span class="kw">from</span> datetime <span class="kw">import</span> datetime, timedelta

<span class="kw">def</span> <span class="fn">make_cert</span>(subject, issuer, pubkey_hex, days=<span class="num">90</span>, sans=<span class="kw">None</span>, eku=<span class="kw">None</span>):
    tbs = {
        <span class="str">'version'</span>: <span class="str">'v3'</span>,
        <span class="str">'serial'</span>: <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>((subject+issuer).<span class="fn">encode</span>()).<span class="fn">digest</span>()[:<span class="num">8</span>], <span class="str">'big'</span>),
        <span class="str">'sigAlg'</span>: <span class="str">'sha256WithRSAEncryption'</span>,
        <span class="str">'issuer'</span>: issuer,
        <span class="str">'subject'</span>: subject,
        <span class="str">'notBefore'</span>: <span class="fn">datetime</span>(<span class="num">2026</span>, <span class="num">5</span>, <span class="num">4</span>).<span class="fn">isoformat</span>(),
        <span class="str">'notAfter'</span>:  (<span class="fn">datetime</span>(<span class="num">2026</span>, <span class="num">5</span>, <span class="num">4</span>) + <span class="fn">timedelta</span>(days=days)).<span class="fn">isoformat</span>(),
        <span class="str">'pubKey'</span>: pubkey_hex,
        <span class="str">'extensions'</span>: {
            <span class="str">'SAN'</span>: sans <span class="kw">or</span> [subject],
            <span class="str">'EKU'</span>: eku <span class="kw">or</span> [<span class="str">'serverAuth'</span>],
            <span class="str">'KU'</span>:  [<span class="str">'digitalSignature'</span>, <span class="str">'keyEncipherment'</span>],
            <span class="str">'BC'</span>:  <span class="str">'CA:FALSE'</span>,
        }
    }
    <span class="kw">return</span> tbs

cert = <span class="fn">make_cert</span>(<span class="str">'example.com'</span>, <span class="str">"Let's Encrypt R3"</span>,
                 pubkey_hex=<span class="str">'30820122300d06092a...'</span>[:<span class="num">32</span>]+<span class="str">'...'</span>,
                 sans=[<span class="str">'example.com'</span>, <span class="str">'www.example.com'</span>])

<span class="fn">print</span>(json.<span class="fn">dumps</span>(cert, indent=<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">'\\nFingerprint (SHA-256):'</span>,
      hashlib.<span class="fn">sha256</span>(json.<span class="fn">dumps</span>(cert, sort_keys=<span class="kw">True</span>).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()[:<span class="num">32</span>], <span class="str">'...'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>make_cert</code> X.509 <em>TBSCertificate</em> (To-Be-Signed) bloğunu inşa eder — sürüm <code>v3</code> (1999 sonrası tek kullanılan), seri numarası <code>SHA-256(subject||issuer)</code>'in ilk 8 byte'ından deterministik olarak türetilir, gerçek CA'ların CSPRNG ile ürettiği 64+ bit serial'a benzer (RFC 5280 2008'den beri zorunlu kılar). 2) <code>notBefore</code> / <code>notAfter</code> 90 günlük geçerlilik penceresi olarak ayarlanır — tam olarak Let's Encrypt kadansı; CA/Browser Forum baseline 2020'den beri herhangi bir public TLS cert'i 397 günle sınırlar. 3) <code>extensions</code> sözlüğü her leaf cert'in taşıdığı dört uzantıyı gösterir: <code>SAN</code> (Subject Alternative Names — bu cert'in hangi hostname'ler için geçerli olduğu; modern tarayıcılar CN'i tamamen yok sayar), <code>EKU=serverAuth</code> (extended key usage cert'i TLS sunucu kimlik doğrulamasıyla sınırlar), <code>KU</code> (key usage: ECDSA için digitalSignature + eski RSA-KEX için keyEncipherment) ve <code>BC=CA:FALSE</code> (Basic Constraints — bu leaf başka bir cert imzalamamalı). 4) Son <code>hashlib.sha256(...)</code> kanonik JSON üzerinde sertifika parmak izini üretir — tarayıcıların cert viewer'da gösterdiği ve pinning sistemlerinin (HPKP, CT log girişleri, Expect-CT) belirli bir cert binary'sini tanımlamak için hash'lediği aynı SHA-256.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Güven Deposu — Köklerin Yaşadığı Yer</h2>
<p class="l-text">İşletim sisteminiz ve tarayıcınız, koşulsuz olarak güvendikleri bir <strong>kök CA sertifikaları</strong> listesi ile gelir. Mozilla'nın NSS kök deposu (2026'da ~140 kök) Firefox'u sürer; Apple, Microsoft ve Google kendilerininkini tutar. Bir sertifika ancak, ondan adım adım, bu köklerden birine kadar bir zincir oluşturabiliyorsanız geçerlidir — zincirdeki her sertifika bir sonrakinin özel anahtarı tarafından imzalanmıştır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kök CA</div><div class="card-body">Kendi-imzalı. Gerçek bir kasada bir HSM'de çevrimdışı yaşar. Geçerlilik 20-30 yıl. Örnekler: ISRG Root X1 (Let's Encrypt), DigiCert Global Root G2, GlobalSign Root.</div></div>
<div class="calc-card"><div class="card-title">Ara CA</div><div class="card-body">Kök tarafından imzalı, son varlık sertifikalarını verir. HSM ile çevrimiçi yaşar. Geçerlilik 3-5 yıl. Örnekler: Let's Encrypt R3 / R10 / R11, DigiCert TLS RSA SHA256 2020 CA1.</div></div>
<div class="calc-card"><div class="card-title">Son varlık (yaprak)</div><div class="card-body">Sizin <code>example.com</code>'unuz. Geçerlilik Let's Encrypt için ≤90 gün, CA/Browser Forum tabanı (2020+) başına maks. ≤397 gün.</div></div>
<div class="calc-card"><div class="card-title">Çapraz imzalama</div><div class="card-body">Yeni bir kök, kök depolarına eklenmeden önce yıllarca verilir. Hile: mevcut güvenilir bir kökü yeni kökü çapraz imzalatın, böylece yeni kök eski istemciler için hemen çalışır. ISRG Root X1 tarafından kullanıldı (IdenTrust 2015-2024 tarafından çapraz imzalı).</div></div>
</div>

<div class="calc-highlight"><strong>Yol doğrulama kuralları (RFC 5280):</strong> zincirdeki her sertifika için (a) verenin genel anahtarı tarafından imza, (b) geçerlilik penceresi içinde mevcut zaman, (c) iptal edilmemiş, (d) yaprak olmayan için temel kısıtlamalar CA:TRUE, (e) isim kısıtlamalarına uyulmuş, (f) anahtar kullanımı / EKU kullanımla eşleşmiş, (g) yol uzunluğu ≤ izin verilen, (h) politika kısıtlamaları karşılanmış. Başarısız olan her şeyi reddedin.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. TLS 1.3 El Sıkışması — Güvenli Bir Kanala 1-RTT</h2>
<p class="l-text">TLS 1.3 (RFC 8446, Ağustos 2018), aşamalı olarak yamanmak yerine temiz bir güvenlik analizinden tasarlanan ilk TLS revizyonudur. RSA anahtar taşımayı kaldırır (ileri gizlilik zorunludur), statik DH'yi kaldırır, CBC modunu kaldırır, RC4'ü kaldırır, yeniden müzakereyi kaldırır, sıkıştırmayı kaldırır. Geriye kalan: anahtar değişimi için ECDHE, sunucunun sertifikasından imzalar, AEAD şifreleri (AES-GCM / ChaCha20-Poly1305), anahtar türetme için HKDF. El sıkışma, TLS 1.2'deki 2-RTT'den indirilmiş tek bir gidiş-geliştir (1-RTT).</p>

<div class="katex-block">$$\\text{shared\\_secret} = \\text{ECDH}(\\text{client\\_priv}, \\text{server\\_pub}) \\xrightarrow{\\text{HKDF}} \\text{handshake\\_keys}, \\text{traffic\\_keys}$$</div>

<p class="l-text">Adım adım: ClientHello desteklenen şifre paketleri + <code>key_share</code> uzantısında geçici bir ECDH genel anahtarı taşır. ServerHello bir paket seçer ve kendi ECDH genel anahtarını gönderir — her iki taraf da artık <em>başka herhangi bir mesajdan önce</em> el sıkışma sırrını türetebilir. Sunucu daha sonra EncryptedExtensions, Certificate (zincir), CertificateVerify (sertifikanın özel anahtarı ile el sıkışma transkriptinin imzası), Finished (transkriptin HMAC'i) gönderir. İstemci sertifika zincirini doğrular, CertificateVerify'ı doğrular, kendi Finished'ini gönderir. Bitti — uygulama verisi akar.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TLS 1.3 el sıkışmasını küçük bir durum makinesi olarak modelliyoruz — oyuncak grup üzerinde ECDH, HKDF anahtar türetme, AEAD tarzı mühürleme.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, hmac, secrets

<span class="cm"># Oyuncak ECDH benzeri grup: g üreteci ile p mod tam sayılar</span>
p = (<span class="num">1</span> &lt;&lt; <span class="num">255</span>) - <span class="num">19</span>  <span class="cm"># Curve25519'un asal alan boyutu</span>
g = <span class="num">9</span>                <span class="cm"># gerçekten bir eğri değil, sadece demo grup</span>

<span class="kw">def</span> <span class="fn">kx_keypair</span>():
    priv = secrets.<span class="fn">randbelow</span>(p - <span class="num">2</span>) + <span class="num">1</span>
    pub  = <span class="fn">pow</span>(g, priv, p)
    <span class="kw">return</span> priv, pub

<span class="kw">def</span> <span class="fn">hkdf_extract_expand</span>(salt, ikm, info, length=<span class="num">32</span>):
    prk = hmac.<span class="fn">new</span>(salt, ikm, hashlib.sha256).<span class="fn">digest</span>()
    out, t = b<span class="str">''</span>, b<span class="str">''</span>
    counter = <span class="num">1</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; length:
        t = hmac.<span class="fn">new</span>(prk, t + info + <span class="fn">bytes</span>([counter]), hashlib.sha256).<span class="fn">digest</span>()
        out += t; counter += <span class="num">1</span>
    <span class="kw">return</span> out[:length]

<span class="cm"># İstemci ve sunucu her biri geçici anahtar çiftleri üretir</span>
c_priv, c_pub = <span class="fn">kx_keypair</span>()
s_priv, s_pub = <span class="fn">kx_keypair</span>()

<span class="cm"># Her ikisi de aynı paylaşılan sırrı hesaplar</span>
shared_c = <span class="fn">pow</span>(s_pub, c_priv, p)
shared_s = <span class="fn">pow</span>(c_pub, s_priv, p)
<span class="kw">assert</span> shared_c == shared_s

shared_bytes = shared_c.<span class="fn">to_bytes</span>(<span class="num">32</span>, <span class="str">'big'</span>)
transcript   = b<span class="str">'ClientHello||ServerHello'</span>

handshake_secret = <span class="fn">hkdf_extract_expand</span>(b<span class="str">'\\x00'</span>*<span class="num">32</span>, shared_bytes, b<span class="str">'tls13 handshake'</span>)
client_hs_key    = <span class="fn">hkdf_extract_expand</span>(handshake_secret, transcript, b<span class="str">'tls13 c hs traffic'</span>, <span class="num">16</span>)
server_hs_key    = <span class="fn">hkdf_extract_expand</span>(handshake_secret, transcript, b<span class="str">'tls13 s hs traffic'</span>, <span class="num">16</span>)

<span class="fn">print</span>(<span class="str">'shared secret (first 16 hex bytes):'</span>, shared_bytes[:<span class="num">16</span>].<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'client handshake key:               '</span>, client_hs_key.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'server handshake key:               '</span>, server_hs_key.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'1-RTT achieved: app data can flow after one round-trip.'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>p = (1 &lt;&lt; 255) - 19</code> Curve25519'un asal alan boyutunu (2^255 − 19) yeniden kullanir — gerçek X25519 çarpımsal grup üzerinde değil Montgomery-formu eğri üzerinde çalışır, ama alan aynıdır ve demo veri akışını eğri aritmetiği olmadan gösterir. 2) <code>kx_keypair</code> <code>secrets.randbelow</code> (CSPRNG-destekli; crypto kodunda asla <code>random.random</code> değil) ile geçici skaler çeker ve <code>g^priv mod p</code> yayınlar — TLS 1.3 statik DH'yi yasaklar, bu yüzden bu her el sıkışmada taze gerçekleşir ve forward secrecy verir. 3) Her iki taraf <code>pow(peer_pub, my_priv, p)</code> hesaplar ve aynı paylaşılan tamsayıya ulaşır — standart Diffie-Hellman değişme özelliği, RFC 7748'in X25519 için belirttiği gibi 32 ham byte olarak (<code>to_bytes(32, 'big')</code>) kodlanır. 4) <code>hkdf_extract_expand</code> HKDF'nin (RFC 5869) <em>Extract-then-Expand</em> yapısını tam olarak uygular: HMAC-SHA256 önce paylaşılan secret'i tek tip bir PRK'ya sıkıştırır, sonra counter byte'i ile yinelenen HMAC blokları gerektiği kadar anahtar üretir — handshake transcript <code>tls13 c/s hs traffic</code> etiketini bağlar ve TLS 1.3 spesifikasyonunun <code>client_handshake_traffic_secret</code> ve <code>server_handshake_traffic_secret</code> dediği aynı client/server handshake key'lerini verir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Sertifika Şeffaflığı — Her Sertifikanın Sadece-Ekleme Kayıtları</h2>
<p class="l-text">2011'de Hollandalı CA <strong>DigiNotar</strong> ihlal edildi; saldırganlar *.google.com çıkardı ve sertifika, kimse fark etmeden önce haftalarca İranlı Gmail kullanıcılarını MITM'lemek için kullanıldı. Ders: bir CA, saldırı hedefi dışında kimsenin görmediği mükemmel geçerli bir sertifika çıkarabilir. Google'dan Ben Laurie, Adam Langley ve Emilia Käsper tarafından önerilen düzeltme (RFC 6962, 2013): her CA'nın çıkardığı her sertifikayı <strong>genel, sadece-ekleme, Merkle-ağacı destekli kayıtlara</strong> yayımlamasını gerektirin. Herkes kayıtları beklenmedik verim için izleyebilir; kriptografi (Merkle kapsanma + tutarlılık kanıtları) kaydın girişleri kaldırmasını veya geriye tarihlemesini önler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SCT (İmzalı Sertifika Zaman Damgası)</div><div class="card-body">Bir kaydın bir sertifikayı Maximum Merge Delay (24s) içinde dahil etme sözü. Sertifikanın kendisinde (X.509 uzantısı), OCSP'de veya TLS el sıkışmasında gömülü. Chrome 2018'den beri ≥2 SCT gerektiriyor.</div></div>
<div class="calc-card"><div class="card-title">CT kaydı</div><div class="card-body">Sadece-ekleme Merkle ağacı. Örnekler: Google Argon, Cloudflare Nimbus, Let's Encrypt Oak. Kayıtlar yıla göre parçalanır. Chrome'un CT kayıt politikası ~20 güvenilir kaydı listeler.</div></div>
<div class="calc-card"><div class="card-title">CT monitörü</div><div class="card-body">Tüm kayıtları alanınızla eşleşen sertifikalar için izleyen hizmet. Örnekler: crt.sh (Sectigo), Cert Spotter (SSLMate), Facebook Certificate Transparency Monitoring. Herhangi bir alan sahibi için ücretsiz.</div></div>
<div class="calc-card"><div class="card-title">Gerçek etki</div><div class="card-body">2017'de Google'ın CT izlemesi Symantec'in uygun doğrulama olmadan binlerce sertifika çıkardığını kanıtladı. Sonuç: Chrome, Symantec'in CA işine güvensizleşti; Symantec onu DigiCert'e sattı.</div></div>
</div>

<p class="l-text">Herhangi bir üretim alanı çalıştırıyorsanız, bugün bir CT monitörüne kaydolun. <code>https://crt.sh/?q=yourdomain.com</code> onun için verilmiş her sertifikayı gösterir. Yeni, beklenmedik sertifikalar = ihlal sinyali.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Let's Encrypt ve ACME — Ölçekte Ücretsiz, Otomatik TLS</h2>
<p class="l-text">2015'e kadar bir TLS sertifikası almak yılda 50-500 dolar ödemek, bir CA'ya e-posta göndermek ve sonucu elle kurmak demekti. <strong>Let's Encrypt</strong> (Internet Security Research Group, 2015'te kuruldu) ücretsiz sertifikalar ve bir otomasyon protokolü sundu — <strong>ACME (Automatic Certificate Management Environment, RFC 8555)</strong>. 2026'ya kadar Let's Encrypt 4 milyardan fazla sertifika verdi ve tüm genel web sertifikalarının yaklaşık %60'ı onlarındır.</p>

<p class="l-text">ACME akışı: istemciniz (certbot, acme.sh, Caddy, Traefik, lego, ...) bir hesap anahtar çifti oluşturur, bir isim listesi için sertifika ister, sunucu her ismi kontrol ettiğinizi kanıtlayan bir <strong>meydan okuma</strong> listesi döndürür. Bir meydan okumayı tamamlarsınız, sunucu doğrular, sonra sertifikayı çıkarır. Üç meydan okuma türü:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">HTTP-01</div><div class="card-body"><code>http://example.com/.well-known/acme-challenge/&lt;token&gt;</code> adresine bir token yerleştirin. Sunucu onu alır. Caddy için varsayılan. Joker karakter yapamaz.</div></div>
<div class="calc-card"><div class="card-title">DNS-01</div><div class="card-body">Token ile bir TXT kaydı <code>_acme-challenge.example.com</code> ekleyin. Daha yavaş (DNS yayılması). Joker karakterler için gereklidir. Sertifika istemcisinden DNS API erişimi gerekir.</div></div>
<div class="calc-card"><div class="card-title">TLS-ALPN-01</div><div class="card-body">443 portunda ALPN <code>acme-tls/1</code> ile bir TLS bağlantısı sırasında özel bir sertifika sunun. 80 portunda HTTP sunamadığınızda yararlı (mail sunucuları, IoT).</div></div>
<div class="calc-card"><div class="card-title">EAB (Harici Hesap Bağlama)</div><div class="card-body">Ücretli CA'lar (ZeroSSL, Google Public CA) için gereklidir, böylece ACME hesabınızı faturalandırma/kota sistemlerine bağlayabilirler. Let's Encrypt tarafından kullanılmaz.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — Pyodide'de olmayan 'acme' kütüphanesini kullanır.</span>
<span class="cm"># Yerel olarak çalıştırın: pip install acme certbot</span>
<span class="kw">from</span> acme <span class="kw">import</span> client, messages, challenges, crypto_util
<span class="kw">from</span> cryptography.hazmat.primitives.asymmetric <span class="kw">import</span> rsa

ACCOUNT_KEY = rsa.<span class="fn">generate_private_key</span>(public_exponent=<span class="num">65537</span>, key_size=<span class="num">2048</span>)
DIRECTORY   = <span class="str">'https://acme-v02.api.letsencrypt.org/directory'</span>

net   = client.<span class="fn">ClientNetwork</span>(ACCOUNT_KEY, user_agent=<span class="str">'example-acme/1.0'</span>)
dirs  = messages.Directory.<span class="fn">from_json</span>(net.<span class="fn">get</span>(DIRECTORY).<span class="fn">json</span>())
acme  = client.<span class="fn">ClientV2</span>(dirs, net)

<span class="cm"># Hesap kaydı</span>
account = acme.<span class="fn">new_account</span>(messages.NewRegistration.<span class="fn">from_data</span>(
    email=<span class="str">'admin@example.com'</span>, terms_of_service_agreed=<span class="kw">True</span>))

<span class="cm"># example.com + www.example.com için sertifika sipariş et</span>
csr_pem, key_pem = crypto_util.<span class="fn">make_csr</span>(<span class="kw">None</span>, [<span class="str">'example.com'</span>, <span class="str">'www.example.com'</span>])
order = acme.<span class="fn">new_order</span>(csr_pem)

<span class="kw">for</span> authz <span class="kw">in</span> order.authorizations:
    http01 = <span class="fn">next</span>(c <span class="kw">for</span> c <span class="kw">in</span> authz.body.challenges
                  <span class="kw">if</span> <span class="fn">isinstance</span>(c.chall, challenges.HTTP01))
    <span class="cm"># Token'ı /.well-known/acme-challenge/&lt;http01.chall.token&gt; konumuna yerleştir</span>
    <span class="cm"># Sonra sunucuya hazır olduğumuzu bildir:</span>
    acme.<span class="fn">answer_challenge</span>(http01, http01.<span class="fn">response</span>(ACCOUNT_KEY))

finalized = acme.<span class="fn">finalize_order</span>(order, deadline=<span class="kw">None</span>)
<span class="fn">print</span>(<span class="str">'Got cert PEM, length ='</span>, <span class="fn">len</span>(finalized.fullchain_pem))
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Asimetrik anahtar çifti üretir — RSA için 3072+ bit seç (NIST 2030 sonrası 2048'i deprecated); ECDSA için P-256 / Ed25519 tercih et (daha hızlı, daha küçük, side-channel direnci yüksek). 2) Public key paylaşılabilir (yayınla, sertifika et, TLS'te pinle); private key üretimde HSM / secure enclave / KMS dışına ASLA çıkmamalı. 3) sign(message_hash) private key ile imza üretir; verify(message, signature, public_key) bool döner — deterministic-k (RFC 6979) olmadan kendi ECDSA'nı yazma, k tekrar kullanımı private key'i sızdırır (PlayStation 3 felaketi, 2010). 4) X25519 / ECDH anahtar değişiminde her iki taraf kendi private key'ini diğerinin public key'iyle birleştirip shared secret türetir, sonra HKDF'den geçirip simetrik anahtar olarak kullanır.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. İptal — CRL, OCSP, OCSP Stapling, CRLite</h2>
<p class="l-text">Sertifikalar 397 güne kadar geçerlilik penceresine sahiptir, ancak bir anahtar ele geçirilmesi anında iptal gerektirir. Web PKI'sındaki iptal tarihi, kırılmış varsayımların, sızdırılmış gizliliğin ve sonunda "tarayıcılar iptali yok sayar, bu yüzden ona güvenmeyin"in yıllarca operasyonel gerçeklik olduğunun farkına varmanın bir yavaş hareket felaketidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CRL (Sertifika İptal Listesi)</div><div class="card-body">CA, günlük/haftalık yenilenen iptal edilmiş seri numaralarının dev imzalı bir listesini yayımlar. Tarayıcılar onu indirmelidir. CloudFlare'in CRL'i ~10 MB. Ölçeklenmez. Tarayıcılar için çoğunlukla terk edildi.</div></div>
<div class="calc-card"><div class="card-title">OCSP</div><div class="card-body">Tarayıcı CA'ya HTTP üzerinden "X seri numarası iptal edildi mi?" diye sorar. Gizlilik felaketi: CA ziyaret ettiğiniz her siteyi öğrenir. Yumuşak başarısızlık (OCSP erişilemez ise tarayıcı sertifikayı kabul eder), OCSP'yi engelleyen bir saldırganın kazandığı anlamına gelir. Apple 2022'de EV olmayanlar için OCSP'yi kaldırmaya başladı.</div></div>
<div class="calc-card"><div class="card-title">OCSP stapling</div><div class="card-body">Sunucu kendi OCSP yanıtını alır (imzalı, zaman damgalı, ~7 gün geçerli) ve TLS el sıkışmasına dahil eder. Gizliliği koruyan, hızlı. Must-Staple X.509 uzantısı istemciyi onu gerektirmeye zorlar.</div></div>
<div class="calc-card"><div class="card-title">CRLite (Firefox 2020+)</div><div class="card-body">Mozilla tüm CRL'leri günlük olarak toplar, basamaklı Bloom filtreleri ile sıkıştırır, Firefox'a ~1 MB delta gönderir. O(1) arama, sıfır sızıntı, yumuşak başarısızlık yok. Chrome'un CRLSet'leri benzerdir ancak daha küçüktür (yalnızca "önemli" iptaller).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Karşılıklı TLS (mTLS) ve İstemci Sertifikaları</h2>
<p class="l-text">Sıradan TLS'de yalnızca sunucu bir sertifika sunar; istemci, şifrelenmiş kanal üzerinden bir parola veya token ile kimlik doğrular. <strong>mTLS</strong>'de istemcinin de bir sertifikası vardır (dahili bir CA tarafından imzalı) ve sunucu el sıkışma zamanında onu doğrular. mTLS, Kubernetes meshleri (Istio, Linkerd) içinde hizmetten hizmete kimlik doğrulama, IoT (her Tesla, Apple TV, Sonos cihazı fabrikada yakılmış benzersiz bir istemci sertifikasına sahiptir) ve yüksek güvenceli API'ler (Cloudflare Access, özel CA'larla AWS API Gateway) için fiili standarttır.</p>

<div class="calc-highlight"><strong>mTLS bearer token'larını neden yener:</strong> özel anahtar istemciden asla ayrılmaz, dolayısıyla çalınmış bir log dosyası (bearer token'larla) işe yaramaz. Donanıma bağlı anahtarlarla (TPM, Secure Enclave) birleştiğinde, tamamen ele geçirilmiş bir host bile kimlik bilgisini sızdıramaz. SPIFFE / SPIRE bunu bulutlar için kodifiye eder.</div>

<p class="l-text">SPIFFE ID'leri (Secure Production Identity Framework For Everyone), iş yükünün sertifikasında SAN URI olarak gömülü <code>spiffe://example.org/ns/prod/sa/checkout</code> formundaki URI'lerdir. Hizmet A, hizmet B'ye IP'sine değil SPIFFE ID'sine dayanarak güvenir. SPIRE aracılığıyla 1-24 saatte bir sertifika rotasyonu.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PKI Başarısızlıkları — DigiNotar, Comodo, Symantec, ANSSI</h2>
<p class="l-text">Web PKI'sının temel kusuru, <strong>~140 kökten herhangi birinin herhangi bir alan adı için herhangi bir sertifika çıkarabilmesidir</strong>. Bir tane ele geçirilmiş CA = tüm sistem her site için kırılır. Tarih ayık tutucudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Comodo (Mart 2011)</div><div class="card-body">İtalya'daki bayi hesabı ele geçirildi. login.yahoo.com, mail.google.com, addons.mozilla.org dahil 9 sahte sertifika çıkarıldı. İran devlet aktöründen şüpheleniliyor. Comodo'nun kendi izlemesi tarafından saatler içinde yakalandı.</div></div>
<div class="calc-card"><div class="card-title">DigiNotar (Haziran-Ağu 2011)</div><div class="card-body">Hollandalı CA tamamen ele geçirildi. *.google.com dahil 531 sahte sertifika çıkarıldı, ~300 bin İranlı Gmail kullanıcısına karşı ~haftalarca MITM için kullanıldı. DigiNotar 2 ay içinde iflas etti. CT'nin geliştirilmesini tetikledi.</div></div>
<div class="calc-card"><div class="card-title">ANSSI (Ara 2013)</div><div class="card-body">Fransız hükümeti CA'sının ara sertifikası, özel bir ağda Google trafiğini kesmek için bir Fransız hükümeti MITM proxy'si tarafından kullanıldı. Chrome'un sabitlemesi tarafından tespit edildi. Güven yalnızca *.fr ile kısıtlandı.</div></div>
<div class="calc-card"><div class="card-title">Symantec (2017-2018)</div><div class="card-body">Yıllarca uygun alan doğrulaması olmadan sertifikalar çıkarmak. CT izleme deseni ortaya çıkardı. Chrome iki aşamada güvensizleşti (2018-2019). Symantec CA'sını DigiCert'e sattı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tuzaklar ve En İyi Uygulamalar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yenilemeyi unutma</div><div class="card-body">Let's Encrypt'in 90 günlük sertifikalarıyla bile siteler hâlâ süresi doluyor. ACME otomasyonu (certbot --renew, Caddy auto-https) kullanın, çalışma süresi/süresi dolma kontrolleri ile izleyin (Datadog SSL monitor, ssl-checker.io).</div></div>
<div class="calc-card"><div class="card-title">Karışık sertifika kapsamı</div><div class="card-body">Bir joker sertifika <code>*.example.com</code>'u kapsar ancak <code>example.com</code>'un kendisini veya <code>foo.bar.example.com</code>'u kapsamaz. Şüpheniz olduğunda tüm SAN'ları açıkça listeleyin.</div></div>
<div class="calc-card"><div class="card-title">Üretimde kendi-imzalama</div><div class="card-body">Tarayıcılar reddeder. Dahili hizmetler için kendi özel CA'nızı çalıştırın (smallstep CA, HashiCorp Vault PKI) ve kökü MDM/Ansible aracılığıyla dağıtın.</div></div>
<div class="calc-card"><div class="card-title">2026'da CT'siz sertifikalar</div><div class="card-body">Chrome ve Safari sert başarısız olur. CA'nız SCT sağlamıyorsa, CA değiştirin. Let's Encrypt bunu 2018'den beri yapıyor.</div></div>
<div class="calc-card"><div class="card-title">HPKP ötesinde sabitleme</div><div class="card-body">HTTP Public Key Pinning (HPKP) 2018'de kullanımdan kaldırıldı — çok fazla kendi-DoS olayı. Expect-CT kullanın (CT artık zorunlu olduğundan 2024'te kullanımdan kaldırıldı) veya birden fazla yedek sabit ile uygulama düzeyi sabitleme.</div></div>
<div class="calc-card"><div class="card-title">Özel anahtarları saklama</div><div class="card-body">Mod 0600, asla Git'te değil. HSM, AWS KMS, GCP Cloud HSM veya mühürlü-sırlar iş akışı kullanın. Sertifika anahtarları .git/ ifşaları ve S3 yanlış yapılandırmaları yoluyla sürekli sızar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">PKI modern internetin güven dokusudur: X.509 sertifikaları anahtarları kimliklere bağlar; CA'lar onları imzalar; tarayıcılar güvenilir kökler listesi gönderir; TLS 1.3, 1-RTT'de ileri-gizli bir kanal müzakere eder; Sertifika Şeffaflığı yanlış-vermeyi genel olarak gözlemlenebilir kılar; ACME tüm yaşam döngüsünü ücretsiz olarak otomatikleştirir. Sistem başarısız oldu (DigiNotar, Symantec) ve fazlalık ve CT sayesinde hayatta kaldı.</p>

<p class="l-text">Ders 5, kriptonun farklı bir ailesine keskin bir sola döner: <strong>Sıfır-Bilgi Kanıtları</strong>. "İşte sırrım, lütfen doğrulayın" yerine, ZK bir sırrı bilmenizi <em>onun hakkında hiçbir şey açığa vurmadan</em> kanıtlamanıza izin verir. Schnorr'un kimlik şemasından (1989) Tornado Cash ve zkSync'i çalıştıran zk-SNARK'lara, bu, gizliliği koruyan hesaplamanın kriptografisidir.</p>
</div>`
};
