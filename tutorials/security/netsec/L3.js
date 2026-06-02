window.NETSEC_L3 = {

en: `<p class="l-text"><strong>Identity is the new perimeter.</strong> The 2022 Twilio breach started with a phishing SMS to employees. The 2020 Twitter Bitcoin scam — Obama, Musk, and Biden tweeting in unison — was an OAuth-token theft from internal admin tools. Authentication and authorization sit between the attacker and every interesting asset, and getting them right is harder than it looks.</p>
<p class="l-text">In this lesson we cover OAuth 2.0 (RFC 6749) and OpenID Connect, the Authorization Code flow with PKCE that mobile and SPA apps must use, JWT pitfalls including the infamous <code>alg=none</code> attack, and the move to passwordless via FIDO2 / WebAuthn passkeys. You will sign and verify a JWT by hand and watch the alg=none bypass succeed against a careless verifier.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Trace the OAuth 2.0 Authorization Code flow with PKCE step by step</li>
<li>Distinguish OIDC ID tokens from OAuth access tokens and refresh tokens</li>
<li>Sign and verify JWTs manually and detect <code>alg=none</code> / weak HS256 attacks</li>
<li>Explain how WebAuthn replaces passwords with origin-bound public keys</li>
<li>Pick MFA factors by NIST AAL level (AAL1 / AAL2 / AAL3)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. AuthN vs AuthZ</h2>
<p class="l-text">Authentication answers "who are you?", authorization answers "what may you do?". Confusing them produces 94% of access-control bugs. A valid login is necessary but not sufficient — every sensitive operation needs an explicit policy check.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Authentication</div><div class="card-body">Password, passkey, certificate. Establishes identity.</div></div>
<div class="calc-card"><div class="card-title">Authorization</div><div class="card-body">RBAC, ABAC, ReBAC. Decides actions on resources.</div></div>
<div class="calc-card"><div class="card-title">Session</div><div class="card-body">Cookie, opaque token, JWT. Persists identity across requests.</div></div>
<div class="calc-card"><div class="card-title">Federation</div><div class="card-body">SAML, OIDC. One identity provider for many apps.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. OAuth 2.0 (RFC 6749) Roles &amp; Flows</h2>
<p class="l-text">OAuth 2.0 is a delegation protocol — you let an app act on your behalf without sharing your password. Four roles, four core grants. The Authorization Code grant with PKCE is the only one you should use for new apps.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Resource Owner</div><div class="card-body">The user.</div></div>
<div class="calc-card"><div class="card-title">Client</div><div class="card-body">The app requesting access.</div></div>
<div class="calc-card"><div class="card-title">Authorization Server</div><div class="card-body">Issues tokens (Auth0, Okta, Keycloak).</div></div>
<div class="calc-card"><div class="card-title">Resource Server</div><div class="card-body">The API holding user data.</div></div>
</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Authorization Code + PKCE</div><div class="card-body">Web, mobile, SPA. The only modern choice.</div></div>
<div class="calc-card"><div class="card-title">Client Credentials</div><div class="card-body">Machine-to-machine, no user.</div></div>
<div class="calc-card"><div class="card-title">Device Code</div><div class="card-body">TVs, CLIs without browsers.</div></div>
<div class="calc-card"><div class="card-title">Implicit / ROPC</div><div class="card-body">Deprecated. Do not use.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PKCE Step-by-Step</h2>
<p class="l-text">PKCE (Proof Key for Code Exchange, RFC 7636) closes the authorization-code-interception attack on mobile. The client picks a random verifier, sends its hash up front, then proves it knew the verifier when redeeming the code.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets, base64, hmac

<span class="cm"># Step 1: client picks a random verifier</span>
verifier = base64.<span class="fn">urlsafe_b64encode</span>(secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>).<span class="fn">decode</span>()
<span class="cm"># Step 2: send SHA-256 of the verifier as code_challenge</span>
challenge = base64.<span class="fn">urlsafe_b64encode</span>(hashlib.<span class="fn">sha256</span>(verifier.<span class="fn">encode</span>()).<span class="fn">digest</span>()).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>).<span class="fn">decode</span>()
<span class="fn">print</span>(<span class="str">"verifier:"</span>, verifier)
<span class="fn">print</span>(<span class="str">"challenge:"</span>, challenge)

<span class="cm"># Auth server stores the challenge with the issued code</span>
auth_server_state = {<span class="str">"abc123_code"</span>: {<span class="str">"challenge"</span>: challenge, <span class="str">"method"</span>: <span class="str">"S256"</span>}}

<span class="cm"># Step 3: client redeems code with original verifier</span>
<span class="kw">def</span> <span class="fn">exchange_code</span>(code, supplied_verifier):
    rec = auth_server_state.<span class="fn">get</span>(code)
    <span class="kw">if</span> <span class="kw">not</span> rec: <span class="kw">return</span> <span class="kw">None</span>
    expected = base64.<span class="fn">urlsafe_b64encode</span>(hashlib.<span class="fn">sha256</span>(supplied_verifier.<span class="fn">encode</span>()).<span class="fn">digest</span>()).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>).<span class="fn">decode</span>()
    <span class="kw">if</span> hmac.<span class="fn">compare_digest</span>(expected, rec[<span class="str">"challenge"</span>]):
        <span class="kw">return</span> {<span class="str">"access_token"</span>: <span class="str">"AT_eyJ..."</span>, <span class="str">"id_token"</span>: <span class="str">"IDT_..."</span>}
    <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"invalid_grant"</span>}

<span class="fn">print</span>(<span class="str">"Legit:"</span>, <span class="fn">exchange_code</span>(<span class="str">"abc123_code"</span>, verifier))
<span class="fn">print</span>(<span class="str">"Stolen code, no verifier:"</span>, <span class="fn">exchange_code</span>(<span class="str">"abc123_code"</span>, <span class="str">"guess"</span>))</code></pre></div>
<p class="l-text"><strong>Why PKCE works:</strong> the authorization code by itself is useless without the verifier. An attacker who steals the code on the redirect URI cannot redeem it.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. OpenID Connect (OIDC) on top of OAuth</h2>
<p class="l-text">OAuth 2.0 gives access tokens for APIs. It does <em>not</em> tell you who the user is — that is a frequent misuse. <strong>OIDC</strong> adds an <code>id_token</code> (a signed JWT) with standard claims (<code>sub</code>, <code>email</code>, <code>aud</code>, <code>iss</code>, <code>exp</code>) so the client app actually learns the user's identity.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">access_token</div><div class="card-body">Bearer credential for the API. Opaque or JWT.</div></div>
<div class="calc-card"><div class="card-title">id_token (OIDC)</div><div class="card-body">Always JWT. About the user. Consumed by the client.</div></div>
<div class="calc-card"><div class="card-title">refresh_token</div><div class="card-body">Long-lived. Trade for new access tokens. Rotate on use.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. JWT — Sign &amp; Verify by Hand</h2>
<p class="l-text">A JWT is three base64url segments: header, payload, signature. The signature covers <code>header.payload</code>. Tampering changes the signature. We'll build one with HS256 and break two careless verifiers.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> base64, json, hmac, hashlib

<span class="kw">def</span> <span class="fn">b64u</span>(b): <span class="kw">return</span> base64.<span class="fn">urlsafe_b64encode</span>(b).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>)

SECRET = <span class="fn">b'</span>change-me-32-byte-server-secret-xyz<span class="fn">'</span>

<span class="kw">def</span> <span class="fn">jwt_sign</span>(payload, alg=<span class="str">"HS256"</span>):
    h = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>({<span class="str">"alg"</span>: alg, <span class="str">"typ"</span>: <span class="str">"JWT"</span>}, separators=(<span class="str">","</span>,<span class="str">":"</span>)).<span class="fn">encode</span>())
    p = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>(payload, separators=(<span class="str">","</span>,<span class="str">":"</span>)).<span class="fn">encode</span>())
    sig = hmac.<span class="fn">new</span>(SECRET, h+<span class="fn">b'</span>.<span class="fn">'</span>+p, hashlib.sha256).<span class="fn">digest</span>() <span class="kw">if</span> alg==<span class="str">"HS256"</span> <span class="kw">else</span> <span class="fn">b''</span>
    <span class="kw">return</span> (h+<span class="fn">b'</span>.<span class="fn">'</span>+p+<span class="fn">b'</span>.<span class="fn">'</span>+<span class="fn">b64u</span>(sig)).<span class="fn">decode</span>()

<span class="cm"># Insecure verifier — trusts the alg field!</span>
<span class="kw">def</span> <span class="fn">verify_bad</span>(token):
    h_b64, p_b64, s_b64 = token.<span class="fn">encode</span>().<span class="fn">split</span>(<span class="fn">b'</span>.<span class="fn">'</span>)
    header = json.<span class="fn">loads</span>(base64.<span class="fn">urlsafe_b64decode</span>(h_b64+<span class="fn">b'</span>===<span class="fn">'</span>))
    <span class="kw">if</span> header[<span class="str">"alg"</span>] == <span class="str">"none"</span>: <span class="kw">return</span> json.<span class="fn">loads</span>(base64.<span class="fn">urlsafe_b64decode</span>(p_b64+<span class="fn">b'</span>===<span class="fn">'</span>))
    expected = hmac.<span class="fn">new</span>(SECRET, h_b64+<span class="fn">b'</span>.<span class="fn">'</span>+p_b64, hashlib.sha256).<span class="fn">digest</span>()
    <span class="kw">if</span> hmac.<span class="fn">compare_digest</span>(expected, base64.<span class="fn">urlsafe_b64decode</span>(s_b64+<span class="fn">b'</span>===<span class="fn">'</span>)):
        <span class="kw">return</span> json.<span class="fn">loads</span>(base64.<span class="fn">urlsafe_b64decode</span>(p_b64+<span class="fn">b'</span>===<span class="fn">'</span>))
    <span class="kw">return</span> <span class="kw">None</span>

legit = <span class="fn">jwt_sign</span>({<span class="str">"sub"</span>:<span class="str">"alice"</span>,<span class="str">"role"</span>:<span class="str">"user"</span>})
<span class="fn">print</span>(<span class="str">"legit  :"</span>, <span class="fn">verify_bad</span>(legit))

<span class="cm"># alg=none attack — set role to admin without knowing secret</span>
h = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>({<span class="str">"alg"</span>:<span class="str">"none"</span>,<span class="str">"typ"</span>:<span class="str">"JWT"</span>}).<span class="fn">encode</span>())
p = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>({<span class="str">"sub"</span>:<span class="str">"alice"</span>,<span class="str">"role"</span>:<span class="str">"admin"</span>}).<span class="fn">encode</span>())
forged = (h+<span class="fn">b'</span>.<span class="fn">'</span>+p+<span class="fn">b'</span>.<span class="fn">'</span>).<span class="fn">decode</span>()
<span class="fn">print</span>(<span class="str">"forged :"</span>, <span class="fn">verify_bad</span>(forged))   <span class="cm"># role escalates to admin!</span></code></pre></div>
<p class="l-text"><strong>Fix:</strong> the verifier must pin the algorithm (<code>require_alg="HS256"</code> or check via <code>kid</code> against a key set). Also reject tokens where <code>alg</code> in the header disagrees with the issuer's published JWKS.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Common JWT Pitfalls</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">alg=none</div><div class="card-body">Verifier accepts unsigned tokens. Reject the literal string "none".</div></div>
<div class="calc-card"><div class="card-title">RS256 to HS256 confusion</div><div class="card-body">Use public RSA key as HMAC secret. Pin algorithm.</div></div>
<div class="calc-card"><div class="card-title">Weak HS256 secret</div><div class="card-body">Brute-force "secret123". Use 256+ bits of entropy.</div></div>
<div class="calc-card"><div class="card-title">No expiry</div><div class="card-body">JWT lives forever. Always set <code>exp</code> and verify it.</div></div>
<div class="calc-card"><div class="card-title">No revocation</div><div class="card-body">JWTs are stateless. Use short TTL + refresh tokens.</div></div>
<div class="calc-card"><div class="card-title">jwks fetch SSRF</div><div class="card-body">Verifier fetches attacker URL from <code>jku</code> header. Allowlist.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. FIDO2 / WebAuthn Passkeys</h2>
<p class="l-text">Passwords leak, get reused, and get phished. <strong>WebAuthn</strong> (W3C, FIDO2) replaces them with public-key credentials bound to the origin in the browser. The private key never leaves the authenticator (TPM, Secure Enclave, security key). Phishing fails because evil.com cannot get a signature for bank.com — the origin is part of the signed challenge.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Registration</div><div class="card-body">Browser generates keypair, sends pub key + attestation.</div></div>
<div class="calc-card"><div class="card-title">Login</div><div class="card-body">Server sends challenge, authenticator signs (origin, challenge, counter).</div></div>
<div class="calc-card"><div class="card-title">Passkeys</div><div class="card-body">Synced across devices via iCloud / Google. UX-friendly.</div></div>
<div class="calc-card"><div class="card-title">Phishing-proof</div><div class="card-body">Signature includes origin. evil.com cannot forge bank.com signatures.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. MFA &amp; NIST AAL</h2>
<p class="l-text">NIST SP 800-63B defines three Authenticator Assurance Levels. Pick the one that matches your data sensitivity.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AAL1</div><div class="card-body">Single factor. Password OK. Low-value accounts.</div></div>
<div class="calc-card"><div class="card-title">AAL2</div><div class="card-body">Two factors. Password + TOTP. Most apps.</div></div>
<div class="calc-card"><div class="card-title">AAL3</div><div class="card-body">Hardware-bound + verifier impersonation resistance. WebAuthn / smart card.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">SMS OTP is no longer recommended above AAL1 — SS7 hijacks and SIM-swap fraud are common. Prefer TOTP apps or passkeys.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Session Management</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cookie</div><div class="card-body">Secure, HttpOnly, SameSite=Lax/Strict, __Host- prefix.</div></div>
<div class="calc-card"><div class="card-title">JWT in storage</div><div class="card-body">localStorage = XSS theft. Prefer HttpOnly cookies.</div></div>
<div class="calc-card"><div class="card-title">Refresh rotation</div><div class="card-body">Each refresh issues a new token, invalidates the old.</div></div>
<div class="calc-card"><div class="card-title">Idle &amp; absolute timeout</div><div class="card-body">Idle 15 min, absolute 8 h for sensitive apps.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Auth Failure Visualization</h2>
<p class="l-text">Verizon DBIR 2024 attributes the share of breaches to credential-related causes. Stolen / brute-forced credentials remain the dominant attack vector — passkeys exist precisely to break this curve.</p>
<div class="plotly-graph" id="netsec3-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> AuthN says who, AuthZ says what. Check both.<br><strong>2.</strong> Use OAuth 2.0 Authorization Code with PKCE for everything user-facing.<br><strong>3.</strong> OIDC adds the id_token — that is the only OAuth artifact that names the user.<br><strong>4.</strong> Verify JWTs by pinning the algorithm; reject alg=none, rotate keys, set exp.<br><strong>5.</strong> WebAuthn passkeys are phishing-proof because origin is signed.<br><strong>6.</strong> SMS OTP is dead above AAL1; use TOTP or hardware authenticators.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var labels = ['Stolen creds','Phishing','Brute force','Default pwd','Misconfig MFA'];
  var pct = [49,22,12,9,8];
  var data = [{values:pct, labels:labels, type:'pie', marker:{colors:[T.accent,'#7cc','#888','#c66','#aa9']}}];
  var layout = {title:'Credential-related share of breaches (DBIR 2024 style)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, margin:{t:50,r:30,b:30,l:30}};
  var el=document.getElementById('netsec3-plot-en'); if(el && window.Plotly) Plotly.newPlot('netsec3-plot-en', data, layout, {displayModeBar:false});
},250);
</script>`,

tr: `<p class="l-text"><strong>Kimlik yeni perimeter'dir.</strong> 2022 Twilio ihlali çalışanlara phishing SMS ile başladı. 2020 Twitter Bitcoin dolandırıcılığı — Obama, Musk ve Biden eşzamanlı tweet atıyor — iç admin araçlarından OAuth-token hırsızlığıydı. Kimlik doğrulama ve yetkilendirme saldırgan ile her ilginç varlık arasında oturur ve bunları doğru yapmak göründüğünden daha zordur.</p>
<p class="l-text">Bu derste OAuth 2.0 (RFC 6749) ve OpenID Connect, mobile ve SPA uygulamaların kullanması gereken PKCE'li Authorization Code akışı, kötü şöhretli <code>alg=none</code> saldırısı dahil JWT tuzakları ve FIDO2 / WebAuthn passkey'leri yoluyla parolasıza geçişi kapsıyoruz. Bir JWT'yi elle imzalayıp doğrulayacaksın ve dikkatsiz bir doğrulayıcıya karşı alg=none atlatmasının başardığını izleyeceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>OAuth 2.0 Authorization Code akışını PKCE ile adım adım izlemek</li>
<li>OIDC ID token'larını OAuth access token'ları ve refresh token'lardan ayırt etmek</li>
<li>JWT'leri manuel olarak imzalayıp doğrulamak ve <code>alg=none</code> / zayıf HS256 saldırılarını tespit etmek</li>
<li>WebAuthn'in parolaları köken-bağlı genel anahtarlarla nasıl değiştirdiğini açıklamak</li>
<li>NIST AAL düzeyine göre MFA faktörleri seçmek (AAL1 / AAL2 / AAL3)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. AuthN vs AuthZ</h2>
<p class="l-text">Kimlik doğrulama "kimsin?", yetkilendirme "ne yapabilirsin?" diye cevap verir. Bunları karıştırmak erişim-kontrol bug'larının %94'ünü üretir. Geçerli bir giriş gerekli ama yeterli değil — her hassas işlem açık politika kontrolü gerektirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kimlik doğrulama</div><div class="card-body">Parola, passkey, sertifika. Kimliği oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Yetkilendirme</div><div class="card-body">RBAC, ABAC, ReBAC. Kaynaklar üzerindeki eylemleri belirler.</div></div>
<div class="calc-card"><div class="card-title">Oturum</div><div class="card-body">Cookie, opak token, JWT. İstekler arası kimliği korur.</div></div>
<div class="calc-card"><div class="card-title">Federasyon</div><div class="card-body">SAML, OIDC. Birçok uygulama için tek bir kimlik sağlayıcı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. OAuth 2.0 (RFC 6749) Rolleri ve Akışları</h2>
<p class="l-text">OAuth 2.0 bir delegasyon protokolüdür — bir uygulamanın parolanı paylaşmadan senin adına hareket etmesine izin verirsin. Dört rol, dört temel grant. PKCE'li Authorization Code grant yeni uygulamalar için kullanman gereken tek olandır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Resource Owner</div><div class="card-body">Kullanıcı.</div></div>
<div class="calc-card"><div class="card-title">Client</div><div class="card-body">Erişim isteyen uygulama.</div></div>
<div class="calc-card"><div class="card-title">Authorization Server</div><div class="card-body">Token verir (Auth0, Okta, Keycloak).</div></div>
<div class="calc-card"><div class="card-title">Resource Server</div><div class="card-body">Kullanıcı verisini tutan API.</div></div>
</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Authorization Code + PKCE</div><div class="card-body">Web, mobile, SPA. Tek modern seçim.</div></div>
<div class="calc-card"><div class="card-title">Client Credentials</div><div class="card-body">Makineden makineye, kullanıcı yok.</div></div>
<div class="calc-card"><div class="card-title">Device Code</div><div class="card-body">Tarayıcısı olmayan TV'ler, CLI'lar.</div></div>
<div class="calc-card"><div class="card-title">Implicit / ROPC</div><div class="card-body">Kullanımdan kaldırıldı. Kullanma.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PKCE Adım Adım</h2>
<p class="l-text">PKCE (Proof Key for Code Exchange, RFC 7636) mobil üzerinde authorization-code-yakalama saldırısını kapatır. İstemci rastgele bir verifier seçer, hash'ini önden gönderir, sonra kodu alırken verifier'ı bildiğini kanıtlar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets, base64, hmac

<span class="cm"># Adım 1: istemci rastgele bir verifier seçer</span>
verifier = base64.<span class="fn">urlsafe_b64encode</span>(secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>).<span class="fn">decode</span>()
<span class="cm"># Adım 2: verifier'ın SHA-256'sını code_challenge olarak gönder</span>
challenge = base64.<span class="fn">urlsafe_b64encode</span>(hashlib.<span class="fn">sha256</span>(verifier.<span class="fn">encode</span>()).<span class="fn">digest</span>()).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>).<span class="fn">decode</span>()
<span class="fn">print</span>(<span class="str">"verifier:"</span>, verifier)
<span class="fn">print</span>(<span class="str">"challenge:"</span>, challenge)

<span class="cm"># Auth sunucusu challenge'ı verilen kodla saklar</span>
auth_server_state = {<span class="str">"abc123_code"</span>: {<span class="str">"challenge"</span>: challenge, <span class="str">"method"</span>: <span class="str">"S256"</span>}}

<span class="cm"># Adım 3: istemci kodu orijinal verifier ile takas eder</span>
<span class="kw">def</span> <span class="fn">exchange_code</span>(code, supplied_verifier):
    rec = auth_server_state.<span class="fn">get</span>(code)
    <span class="kw">if</span> <span class="kw">not</span> rec: <span class="kw">return</span> <span class="kw">None</span>
    expected = base64.<span class="fn">urlsafe_b64encode</span>(hashlib.<span class="fn">sha256</span>(supplied_verifier.<span class="fn">encode</span>()).<span class="fn">digest</span>()).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>).<span class="fn">decode</span>()
    <span class="kw">if</span> hmac.<span class="fn">compare_digest</span>(expected, rec[<span class="str">"challenge"</span>]):
        <span class="kw">return</span> {<span class="str">"access_token"</span>: <span class="str">"AT_eyJ..."</span>, <span class="str">"id_token"</span>: <span class="str">"IDT_..."</span>}
    <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"invalid_grant"</span>}

<span class="fn">print</span>(<span class="str">"Legit:"</span>, <span class="fn">exchange_code</span>(<span class="str">"abc123_code"</span>, verifier))
<span class="fn">print</span>(<span class="str">"Stolen code, no verifier:"</span>, <span class="fn">exchange_code</span>(<span class="str">"abc123_code"</span>, <span class="str">"guess"</span>))</code></pre></div>
<p class="l-text"><strong>PKCE neden çalışır:</strong> authorization kodu tek başına verifier olmadan işe yaramaz. Yönlendirme URI'sinde kodu çalan bir saldırgan onu alamaz.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. OpenID Connect (OIDC) OAuth Üzerinde</h2>
<p class="l-text">OAuth 2.0 API'ler için access token verir. Sana kullanıcının kim olduğunu söylemez <em>değil</em> — bu sıkça yanlış kullanılır. <strong>OIDC</strong> standart claim'lerle (<code>sub</code>, <code>email</code>, <code>aud</code>, <code>iss</code>, <code>exp</code>) bir <code>id_token</code> (imzalı bir JWT) ekler ki istemci uygulama gerçekten kullanıcının kimliğini öğrensin.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">access_token</div><div class="card-body">API için taşıyıcı kimlik bilgisi. Opak veya JWT.</div></div>
<div class="calc-card"><div class="card-title">id_token (OIDC)</div><div class="card-body">Her zaman JWT. Kullanıcı hakkında. İstemci tarafından tüketilir.</div></div>
<div class="calc-card"><div class="card-title">refresh_token</div><div class="card-body">Uzun ömürlü. Yeni access token'lar için takas et. Kullanımda döndür.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. JWT — Elle İmzala ve Doğrula</h2>
<p class="l-text">JWT üç base64url segmentidir: header, payload, signature. İmza <code>header.payload</code>'ı kapsar. Tahrif imzayı değiştirir. HS256 ile bir tane inşa edeceğiz ve iki dikkatsiz doğrulayıcıyı kıracağız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> base64, json, hmac, hashlib

<span class="kw">def</span> <span class="fn">b64u</span>(b): <span class="kw">return</span> base64.<span class="fn">urlsafe_b64encode</span>(b).<span class="fn">rstrip</span>(<span class="fn">b'</span>=<span class="fn">'</span>)

SECRET = <span class="fn">b'</span>change-me-32-byte-server-secret-xyz<span class="fn">'</span>

<span class="kw">def</span> <span class="fn">jwt_sign</span>(payload, alg=<span class="str">"HS256"</span>):
    h = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>({<span class="str">"alg"</span>: alg, <span class="str">"typ"</span>: <span class="str">"JWT"</span>}, separators=(<span class="str">","</span>,<span class="str">":"</span>)).<span class="fn">encode</span>())
    p = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>(payload, separators=(<span class="str">","</span>,<span class="str">":"</span>)).<span class="fn">encode</span>())
    sig = hmac.<span class="fn">new</span>(SECRET, h+<span class="fn">b'</span>.<span class="fn">'</span>+p, hashlib.sha256).<span class="fn">digest</span>() <span class="kw">if</span> alg==<span class="str">"HS256"</span> <span class="kw">else</span> <span class="fn">b''</span>
    <span class="kw">return</span> (h+<span class="fn">b'</span>.<span class="fn">'</span>+p+<span class="fn">b'</span>.<span class="fn">'</span>+<span class="fn">b64u</span>(sig)).<span class="fn">decode</span>()

<span class="cm"># Güvensiz doğrulayıcı — alg alanına güvenir!</span>
<span class="kw">def</span> <span class="fn">verify_bad</span>(token):
    h_b64, p_b64, s_b64 = token.<span class="fn">encode</span>().<span class="fn">split</span>(<span class="fn">b'</span>.<span class="fn">'</span>)
    header = json.<span class="fn">loads</span>(base64.<span class="fn">urlsafe_b64decode</span>(h_b64+<span class="fn">b'</span>===<span class="fn">'</span>))
    <span class="kw">if</span> header[<span class="str">"alg"</span>] == <span class="str">"none"</span>: <span class="kw">return</span> json.<span class="fn">loads</span>(base64.<span class="fn">urlsafe_b64decode</span>(p_b64+<span class="fn">b'</span>===<span class="fn">'</span>))
    expected = hmac.<span class="fn">new</span>(SECRET, h_b64+<span class="fn">b'</span>.<span class="fn">'</span>+p_b64, hashlib.sha256).<span class="fn">digest</span>()
    <span class="kw">if</span> hmac.<span class="fn">compare_digest</span>(expected, base64.<span class="fn">urlsafe_b64decode</span>(s_b64+<span class="fn">b'</span>===<span class="fn">'</span>)):
        <span class="kw">return</span> json.<span class="fn">loads</span>(base64.<span class="fn">urlsafe_b64decode</span>(p_b64+<span class="fn">b'</span>===<span class="fn">'</span>))
    <span class="kw">return</span> <span class="kw">None</span>

legit = <span class="fn">jwt_sign</span>({<span class="str">"sub"</span>:<span class="str">"alice"</span>,<span class="str">"role"</span>:<span class="str">"user"</span>})
<span class="fn">print</span>(<span class="str">"legit  :"</span>, <span class="fn">verify_bad</span>(legit))

<span class="cm"># alg=none saldırısı — sırrı bilmeden role'ü admin'e ayarla</span>
h = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>({<span class="str">"alg"</span>:<span class="str">"none"</span>,<span class="str">"typ"</span>:<span class="str">"JWT"</span>}).<span class="fn">encode</span>())
p = <span class="fn">b64u</span>(json.<span class="fn">dumps</span>({<span class="str">"sub"</span>:<span class="str">"alice"</span>,<span class="str">"role"</span>:<span class="str">"admin"</span>}).<span class="fn">encode</span>())
forged = (h+<span class="fn">b'</span>.<span class="fn">'</span>+p+<span class="fn">b'</span>.<span class="fn">'</span>).<span class="fn">decode</span>()
<span class="fn">print</span>(<span class="str">"forged :"</span>, <span class="fn">verify_bad</span>(forged))   <span class="cm"># role admin'e yükselir!</span></code></pre></div>
<p class="l-text"><strong>Düzeltme:</strong> doğrulayıcı algoritmayı sabitlemelidir (<code>require_alg="HS256"</code> veya bir anahtar setine karşı <code>kid</code> üzerinden kontrol et). Ayrıca header'daki <code>alg</code>'in verenin yayımlanmış JWKS'iyle uyuşmadığı token'ları reddet.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Yaygın JWT Tuzakları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">alg=none</div><div class="card-body">Doğrulayıcı imzasız token'ları kabul eder. Düz "none" dizesini reddet.</div></div>
<div class="calc-card"><div class="card-title">RS256'tan HS256 karışıklığı</div><div class="card-body">Genel RSA anahtarını HMAC sırrı olarak kullan. Algoritmayı sabitle.</div></div>
<div class="calc-card"><div class="card-title">Zayıf HS256 sırrı</div><div class="card-body">"secret123"'ü brute-force et. 256+ bit entropi kullan.</div></div>
<div class="calc-card"><div class="card-title">Süresi dolma yok</div><div class="card-body">JWT sonsuza kadar yaşar. Her zaman <code>exp</code> ayarla ve doğrula.</div></div>
<div class="calc-card"><div class="card-title">İptal yok</div><div class="card-body">JWT'ler durumsuz. Kısa TTL + refresh token kullan.</div></div>
<div class="calc-card"><div class="card-title">jwks fetch SSRF</div><div class="card-body">Doğrulayıcı saldırgan URL'sini <code>jku</code> header'dan getirir. İzin listele.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. FIDO2 / WebAuthn Passkey'ler</h2>
<p class="l-text">Parolalar sızar, yeniden kullanılır ve phishing'e maruz kalır. <strong>WebAuthn</strong> (W3C, FIDO2) onları tarayıcıdaki kökene bağlı genel-anahtar kimlik bilgileriyle değiştirir. Özel anahtar authenticator'dan (TPM, Secure Enclave, security key) asla ayrılmaz. Phishing başarısız olur çünkü evil.com bank.com için bir imza alamaz — köken imzalı challenge'ın bir parçasıdır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kayıt</div><div class="card-body">Tarayıcı keypair üretir, pub key + attestation gönderir.</div></div>
<div class="calc-card"><div class="card-title">Giriş</div><div class="card-body">Sunucu challenge gönderir, authenticator (köken, challenge, sayaç) imzalar.</div></div>
<div class="calc-card"><div class="card-title">Passkey'ler</div><div class="card-body">iCloud / Google yoluyla cihazlar arası eşitlenir. UX-dostu.</div></div>
<div class="calc-card"><div class="card-title">Phishing-geçirmez</div><div class="card-body">İmza kökeni içerir. evil.com bank.com imzalarını sahteleyemez.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. MFA ve NIST AAL</h2>
<p class="l-text">NIST SP 800-63B üç Authenticator Assurance Level tanımlar. Veri hassasiyetine uyanı seç.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AAL1</div><div class="card-body">Tek faktör. Parola tamam. Düşük-değerli hesaplar.</div></div>
<div class="calc-card"><div class="card-title">AAL2</div><div class="card-body">İki faktör. Parola + TOTP. Çoğu uygulama.</div></div>
<div class="calc-card"><div class="card-title">AAL3</div><div class="card-body">Donanım-bağlı + doğrulayıcı taklit direnci. WebAuthn / akıllı kart.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">SMS OTP artık AAL1 üzerinde önerilmiyor — SS7 hijack'leri ve SIM-swap dolandırıcılığı yaygın. TOTP uygulamaları veya passkey'ler tercih et.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Oturum Yönetimi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cookie</div><div class="card-body">Secure, HttpOnly, SameSite=Lax/Strict, __Host- öneki.</div></div>
<div class="calc-card"><div class="card-title">Storage'daki JWT</div><div class="card-body">localStorage = XSS hırsızlığı. HttpOnly cookie'leri tercih et.</div></div>
<div class="calc-card"><div class="card-title">Refresh rotasyonu</div><div class="card-body">Her refresh yeni token verir, eskisini geçersiz kılar.</div></div>
<div class="calc-card"><div class="card-title">Boşta ve mutlak zaman aşımı</div><div class="card-body">Hassas uygulamalar için boşta 15 dk, mutlak 8 sa.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Auth Başarısızlığı Görselleştirmesi</h2>
<p class="l-text">Verizon DBIR 2024 ihlallerin payını kimlik bilgisi ile ilgili nedenlere atfeder. Çalınmış / brute-force edilmiş kimlik bilgileri baskın saldırı vektörü olarak kalır — passkey'ler tam da bu eğriyi kırmak için var.</p>
<div class="plotly-graph" id="netsec3-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Kilit Çıkarımlar</h2>
<div class="think-box"><div class="think-label">KİLİT ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> AuthN kim der, AuthZ ne der. İkisini de kontrol et.<br><strong>2.</strong> Her kullanıcıya yönelik şey için PKCE'li OAuth 2.0 Authorization Code kullan.<br><strong>3.</strong> OIDC id_token'ı ekler — kullanıcıyı adlandıran tek OAuth artefaktı odur.<br><strong>4.</strong> JWT'leri algoritmayı sabitleyerek doğrula; alg=none'u reddet, anahtarları döndür, exp ayarla.<br><strong>5.</strong> WebAuthn passkey'leri köken imzalandığı için phishing-geçirmezdir.<br><strong>6.</strong> SMS OTP AAL1'in üzerinde ölü; TOTP veya donanım authenticator'lar kullan.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var labels = ['Çalınan kimlik','Phishing','Brute force','Varsayılan parola','Hatalı MFA'];
  var pct = [49,22,12,9,8];
  var data = [{values:pct, labels:labels, type:'pie', marker:{colors:[T.accent,'#7cc','#888','#c66','#aa9']}}];
  var layout = {title:'İhlallerin kimlik-ile ilgili payı (DBIR 2024 tarzı)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, margin:{t:50,r:30,b:30,l:30}};
  var el=document.getElementById('netsec3-plot-tr'); if(el && window.Plotly) Plotly.newPlot('netsec3-plot-tr', data, layout, {displayModeBar:false});
},250);
</script>`
};
