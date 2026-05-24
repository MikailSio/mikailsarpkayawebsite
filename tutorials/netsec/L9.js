window.NETSEC_L9 = {
en: `<p class="l-text">In 2018 a bug bounty researcher named Wei Dai found that a malicious Docker container could escape its namespace via a TOCTOU race in <code>runc</code> (CVE-2019-5736), overwriting the host's runc binary and gaining full host root. Every CI/CD pipeline running untrusted Dockerfiles became a one-shot RCE on the build host. The patch took 30 days to propagate; the lesson — that container isolation is OS feature reuse, not virtualization — became foundational. In 2021 SolarWinds taught the same lesson at the build-pipeline layer: a compromised CI inserted a backdoor into trusted binaries shipped to 18,000 customers including U.S. Treasury, DHS, and Microsoft. Container security now spans image hygiene, runtime monitoring, admission control, and supply-chain integrity end to end.</p>
<p class="l-text">This lesson maps the modern container/Kubernetes security stack. <em>Image scanning</em>: Trivy, Grype, Snyk, Docker Scout. <em>Runtime detection</em>: Falco (CNCF graduated, Sysdig 2016), Tracee, Tetragon. <em>Pod Security</em>: PSA (replaced PSP in K8s 1.25), Restricted profile. <em>Admission control</em>: OPA/Gatekeeper, Kyverno. <em>Supply chain</em>: SBOM (CycloneDX, SPDX), sigstore (cosign, Rekor, Fulcio), SLSA framework. <em>Secrets</em>: External Secrets Operator, sealed secrets, Vault. We close with a runnable container-image scanner in Python (regex on installed package list + sklearn-trained CVE predictor) and a Pod Security Policy validator.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Container threat model — why namespaces are not VMs</li>
<li>Image scanning with Trivy / Grype and CVSS prioritization</li>
<li>Runtime detection with Falco eBPF rules</li>
<li>Pod Security Admission (PSA) in Kubernetes 1.25+</li>
<li>OPA / Gatekeeper / Kyverno admission controllers</li>
<li>Supply chain: SBOM, sigstore, SLSA framework</li>
<li>Building a container scanner in Python with regex + ML</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Container Threat Model</h2>
<p class="l-text">A container is a process group with namespaces (PID, network, mount, IPC, user, UTS, cgroup) and a seccomp/AppArmor profile. The kernel is shared. Any kernel vulnerability is a container escape primitive. Threats: (a) escape via runtime CVE (runc, containerd); (b) lateral movement via host network or mounted Docker socket; (c) cryptominer drop into a misconfigured container; (d) image supply-chain compromise.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Image-time</div><div class="card-body">Build pipeline, base image, dependencies. SBOM + signature defends here.</div></div>
<div class="calc-card"><div class="card-title">Deploy-time</div><div class="card-body">Admission controllers gate what runs. PSA, OPA, Kyverno.</div></div>
<div class="calc-card"><div class="card-title">Runtime</div><div class="card-body">Falco, Tracee watch syscalls. Anomaly = compromise.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Image Scanning — Trivy and Grype</h2>
<p class="l-text">Both scanners parse the image's package manifest (apk, dpkg, rpm, npm, pip, gomod), match against CVE feeds (NVD, GHSA, OS-specific vendors), and emit findings ranked by CVSS. Trivy (Aqua) is the de facto CI standard; Grype (Anchore) the runner-up. Both run offline-capable, both produce SARIF for GitHub code scanning.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Trivy: scan an image for OS + lang vulns and misconfigs
trivy image --severity HIGH,CRITICAL --ignore-unfixed nginx:1.21
trivy fs --scanners vuln,secret,config ./
trivy config ./manifests/    # IaC scan: Dockerfile, K8s YAML, Terraform

# Grype: scan from a Syft SBOM
syft nginx:1.21 -o cyclonedx-json &gt; sbom.json
grype sbom:./sbom.json --fail-on high
</code></pre></div>
<p class="l-text"><strong>What this code does, command by command:</strong> 1) <code>trivy image --severity HIGH,CRITICAL --ignore-unfixed nginx:1.21</code> pulls the image manifest, walks every layer's package database (apk/dpkg/rpm), matches against the NVD + GHSA feeds and prints only HIGH/CRITICAL CVEs that already have a fix — perfect as a CI gate. 2) <code>trivy fs --scanners vuln,secret,config ./</code> scans the working tree for vulnerable dependencies, leaked secrets (AWS keys, Slack tokens), and misconfigured Dockerfile/K8s YAML in one pass. 3) <code>syft nginx:1.21 -o cyclonedx-json &gt; sbom.json</code> generates a CycloneDX SBOM — the same JSON the supply-chain team needs for SLSA attestation and license review. 4) <code>grype sbom:./sbom.json --fail-on high</code> reads the SBOM offline and returns non-zero on HIGH+ findings — chain this into <code>kubectl apply</code> or your release pipeline to block known-vulnerable releases before they ship.</p>

</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Building a Mini Container Scanner</h2>
<p class="l-text">Image scanning is regex on the package list + a CVE database lookup. We build a simplified version with a pretend CVE database and an anomaly classifier on package counts.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Container scan — regex match installed packages against fake CVE DB</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

# Synthetic dpkg -l output (typical Debian image)
dpkg = """
ii  bash             5.1-2+deb11u1
ii  libssl1.1        1.1.1n-0+deb11u3
ii  openssl          1.1.1n-0+deb11u3
ii  libxml2          2.9.10-2.5
ii  log4j-core       2.14.1
ii  curl             7.74.0-1.3+deb11u3
ii  python3          3.9.2-3
ii  python3-yaml     5.4.1-1
"""

# Mock CVE database
CVES = [
    {'pkg':'log4j-core', 'cve':'CVE-2021-44228','vrange':r'^2\\.([0-9]|1[0-4])\\.', 'severity':'CRITICAL'},
    {'pkg':'libssl1.1',  'cve':'CVE-2022-0778', 'vrange':r'^1\\.1\\.1[a-m]',         'severity':'HIGH'},
    {'pkg':'curl',       'cve':'CVE-2022-27774','vrange':r'^7\\.([0-9]|[0-7][0-9])', 'severity':'MEDIUM'},
]

installed = [tuple(line.split()[1:3]) for line in dpkg.strip().splitlines() if line.startswith('ii')]
findings = []
for pkg, ver in installed:
    for c in CVES:
        if pkg == c['pkg'] and re.match(c['vrange'], ver):
            findings.append((c['severity'], c['cve'], pkg, ver))

print(f"Image has {len(installed)} packages, {len(findings)} CVEs:")
for f in sorted(findings, key=lambda x: ['CRITICAL','HIGH','MEDIUM','LOW'].index(x[0])):
    print(f"  [{f[0]:8s}] {f[1]}  in  {f[2]} {f[3]}")
</code></pre></div>
</div>
<p class="l-text">Production scanners apply this with millions of CVE entries, range parsing for semver, and CVSS exploitability scoring (EPSS) to prioritize.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Falco — Runtime Detection</h2>
<p class="l-text">Falco (Sysdig 2016, CNCF graduated 2024) hooks into Linux syscalls via eBPF and evaluates rule expressions in real time. Default rule sets cover ~50 detection patterns: shell in container, write to /etc, mount of host path, sudoers modification, crypto miner indicators.</p>
<div class="code-wrap"><div class="code-label"><span>YAML — FALCO RULE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>- rule: Terminal Shell in Container
  desc: Detect interactive shell spawned in a container
  condition: &gt;
    spawned_process and container and shell_procs
    and proc.tty != 0 and not user_known_shell_in_container
  output: &gt;
    Shell in container (user=%user.name container=%container.name
    parent=%proc.pname cmd=%proc.cmdline)
  priority: WARNING
  tags: [container, shell, mitre_execution]
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a security monitor — eBPF probe (Falco, Tetragon), syscall audit (auditd), or network flow capture (Zeek, Suricata); production deployments stream into a SIEM (Splunk, Elastic Security, Wazuh). 2) Defines detection rules in a domain language — Falco YAML, Sigma signatures, or YARA — matched against the live event stream. 3) Triggers an alert path on match: Slack / PagerDuty / SOAR playbook (Tines, Splunk SOAR) for auto-containment. 4) The hard part is signal-to-noise: tune for low false-positive rate, baseline normal behavior, and apply MITRE ATT&CK mapping so each alert links to a known adversary technique.</p>

</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Pod Security Admission (PSA)</h2>
<p class="l-text">PodSecurityPolicy was deprecated in K8s 1.21 and removed in 1.25. The replacement, PSA, enforces three preset profiles at the namespace level: <em>privileged</em> (no restrictions), <em>baseline</em> (sane minimum), <em>restricted</em> (hard hardening). Enforcement modes: enforce (deny), audit (log), warn (kubectl warning).</p>
<div class="code-wrap"><div class="code-label"><span>YAML — NAMESPACE WITH PSA</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>apiVersion: v1
kind: Namespace
metadata:
  name: prod
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
</code></pre></div>
<p class="l-text">Restricted profile bans: privileged containers, hostPath mounts, hostNetwork, hostPID, hostIPC, capabilities other than NET_BIND_SERVICE, runAsRoot, allowPrivilegeEscalation. Forces seccompProfile=RuntimeDefault.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Pod Security Validator in Python</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
def validate_pod_restricted(pod):
    spec = pod['spec']
    issues = []
    if spec.get('hostNetwork'): issues.append('hostNetwork=true')
    if spec.get('hostPID'):     issues.append('hostPID=true')
    if spec.get('hostIPC'):     issues.append('hostIPC=true')
    for v in spec.get('volumes', []):
        if 'hostPath' in v: issues.append(f"hostPath volume: {v.get('name')}")
    for c in spec.get('containers', []):
        sec = c.get('securityContext', {})
        if sec.get('privileged'):       issues.append(f"{c['name']}: privileged")
        if sec.get('runAsUser') == 0:   issues.append(f"{c['name']}: runAsUser=0")
        if sec.get('allowPrivilegeEscalation', True): issues.append(f"{c['name']}: allowPrivEsc")
        caps = sec.get('capabilities', {}).get('add', [])
        bad = set(caps) - {'NET_BIND_SERVICE'}
        if bad: issues.append(f"{c['name']}: bad caps {bad}")
    return issues

pod = {
  'spec': {
    'hostNetwork': True,
    'volumes': [{'name':'host-root','hostPath':{'path':'/'}}],
    'containers': [{'name':'app','securityContext':{
        'privileged': True, 'runAsUser': 0,
        'capabilities': {'add': ['SYS_ADMIN','NET_ADMIN']},
    }}]
  }
}
print("Restricted profile violations:")
for v in validate_pod_restricted(pod): print(" -", v)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>validate_pod_restricted(pod)</code> walks a Pod spec and enforces the K8s 1.25+ <em>restricted</em> profile — flagging <code>hostNetwork</code>, <code>hostPID</code>, <code>hostIPC</code> at the spec level, since each breaks the kernel-namespace isolation the container relies on. 2) The volumes loop rejects any <code>hostPath</code> mount — that single bind opens the entire node filesystem, including the kubelet credentials and other tenants' secrets. 3) For each container the <code>securityContext</code> check rejects <code>privileged: true</code> (full root), <code>runAsUser: 0</code> (UID 0 inside the container), <code>allowPrivilegeEscalation: true</code> (lets <code>setuid</code> binaries escape the seccomp profile), and any added capability beyond <code>NET_BIND_SERVICE</code>. 4) The same logic runs server-side as the Pod Security Admission webhook — your validator mirrors the upstream rules so CI rejects bad manifests <em>before</em> they hit the cluster, shortening the feedback loop from minutes (kubectl rollout) to seconds.</p>

</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. OPA / Gatekeeper and Kyverno</h2>
<p class="l-text">PSA covers built-in profiles. For custom rules — "all images must come from registry.corp.example", "every namespace must have an owner label" — you need an admission controller. Two engines:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">OPA Gatekeeper</div><div class="card-body">Rego policy language. CNCF graduated. ConstraintTemplate + Constraint CRDs. Powerful but Rego learning curve.</div></div>
<div class="calc-card"><div class="card-title">Kyverno</div><div class="card-body">YAML-native, K8s-style policies. CNCF graduated 2024. Pattern-match based. Easier on-ramp than Rego.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>YAML — KYVERNO POLICY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata: { name: require-signed-images }
spec:
  validationFailureAction: Enforce
  rules:
  - name: verify-cosign
    match: { any: [{ resources: { kinds: [Pod] }}]}
    verifyImages:
    - imageReferences: ["registry.corp.example/*"]
      attestors:
      - entries:
        - keys: { publicKeys: "-----BEGIN PUBLIC KEY-----\\nMFk..." }
</code></pre></div>
<p class="l-text"><strong>What this code does, block by block:</strong> 1) <code>kind: ClusterPolicy</code> with <code>validationFailureAction: Enforce</code> tells Kyverno to <em>block</em> non-compliant requests at admission time rather than just audit — pods that fail verification never make it into the API server, full stop. 2) <code>match: { any: [{ resources: { kinds: [Pod] }}]}</code> scopes the rule to every Pod create/update across all namespaces, including those spawned by Deployments and Jobs through the owner-reference cascade. 3) <code>verifyImages</code> with <code>imageReferences: ["registry.corp.example/*"]</code> applies the rule only to your trusted registry — public images can still pull (or you add a separate deny rule) but anything signed in-house is verified. 4) The <code>attestors.keys.publicKeys</code> field carries the cosign verification key; only images signed with the matching cosign private key (typically in the build pipeline) pass — every other image is rejected, defending against the SolarWinds-style supply-chain compromise.</p>

</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Supply Chain — SBOM, sigstore, SLSA</h2>
<p class="l-text">Three pillars of modern supply-chain security.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SBOM</div><div class="card-body">Software Bill of Materials. CycloneDX (OWASP) or SPDX (Linux Foundation). Lists every package + version.</div></div>
<div class="calc-card"><div class="card-title">sigstore</div><div class="card-body">cosign signs images, Rekor logs signatures, Fulcio issues short-lived certs from OIDC. Keyless signing via GitHub OIDC.</div></div>
<div class="calc-card"><div class="card-title">SLSA</div><div class="card-body">Supply-chain Levels for Software Artifacts. L1 docs build; L4 hermetic+reproducible+two-person review.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>BASH — COSIGN SIGN AND VERIFY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Sign with keyless OIDC (GitHub Actions identity)
cosign sign --yes registry.corp.example/app:v1.2.3

# Verify in admission controller / CI
cosign verify --certificate-identity-regexp 'https://github.com/corp/.*' \\
              --certificate-oidc-issuer https://token.actions.githubusercontent.com \\
              registry.corp.example/app:v1.2.3
</code></pre></div>
<p class="l-text"><strong>What this code does, command by command:</strong> 1) <code>cosign sign --yes registry.corp.example/app:v1.2.3</code> uses sigstore's <em>keyless</em> flow: cosign asks Fulcio for a short-lived (10-min) cert tied to the GitHub Actions OIDC identity, signs the image digest, and writes the signature plus a Rekor transparency-log entry — no private key ever lives on disk. 2) Because the OIDC claim contains the repository and workflow, the resulting cert <em>proves</em> the build ran in the expected GitHub workflow, satisfying SLSA Level 3 provenance. 3) <code>cosign verify</code> with <code>--certificate-identity-regexp</code> and <code>--certificate-oidc-issuer</code> enforces the verifier-side policy: only signatures whose embedded OIDC identity matches the regex (e.g. your org's GitHub) and whose issuer is GitHub Actions pass. 4) Wire <code>cosign verify</code> into the Kyverno policy from section 7 and the admission controller rejects any image that was not signed by an approved build pipeline — closing the supply-chain loop end to end.</p>

</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Secrets Management</h2>
<p class="l-text">Three patterns. (1) <em>External Secrets Operator</em> pulls from Vault/AWS Secrets Manager into K8s Secret resources. (2) <em>Sealed Secrets</em> (Bitnami) lets you commit encrypted secrets to Git, decrypted only by the cluster controller. (3) <em>SPIFFE/SPIRE</em> for workload identity — short-lived SVIDs replace static API keys. Never bake secrets into images; never commit unencrypted secrets to Git.</p>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Audit Checklist</h2>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Image registry: signed images only, Trivy scan in CI blocks HIGH/CRITICAL.</li>
<li>Cluster: PSA restricted on all production namespaces; Kyverno or Gatekeeper enforcing org policies.</li>
<li>Runtime: Falco deployed cluster-wide, alerts to SIEM, on-call runbook for "shell in container".</li>
<li>Secrets: External Secrets Operator + Vault; no <code>data:</code> field in committed Secret YAML.</li>
<li>Network: NetworkPolicy default-deny in every namespace (lesson 5).</li>
<li>Audit: kube-bench (CIS K8s) clean, kube-hunter pen test passing.</li>
</ol>
</div>`,
tr: `<p class="l-text">2018'de Wei Dai adlı bir bug bounty araştırmacısı kötü amaçlı bir Docker container'ının <code>runc</code>'taki bir TOCTOU race yoluyla namespace'inden kaçabileceğini (CVE-2019-5736), host'un runc binary'sinin üzerine yazıp tam host root kazanabileceğini buldu. Güvenilmeyen Dockerfile'lar çalıştıran her CI/CD hattı build host'unda tek-atış RCE oldu. Yamanın yayılması 30 gün aldı; ders — container izolasyonunun OS özelliği yeniden kullanımı olduğu, sanallaştırma değil — temel oldu. 2021'de SolarWinds aynı dersi build hattı katmanında öğretti: ele geçirilmiş bir CI, ABD Hazine, DHS ve Microsoft dahil 18.000 müşteriye gönderilen güvenilen binary'lere arka kapı yerleştirdi. Container güvenliği artık image hijyeni, çalışma zamanı izleme, admission control ve uçtan uca tedarik zinciri bütünlüğünü kapsar.</p>
<p class="l-text">Bu ders modern container/Kubernetes güvenlik yığınını haritalar. <em>Image tarama</em>: Trivy, Grype, Snyk, Docker Scout. <em>Çalışma zamanı tespiti</em>: Falco (CNCF mezun, Sysdig 2016), Tracee, Tetragon. <em>Pod Security</em>: PSA (K8s 1.25'te PSP'yi değiştirdi), Restricted profili. <em>Admission control</em>: OPA/Gatekeeper, Kyverno. <em>Tedarik zinciri</em>: SBOM (CycloneDX, SPDX), sigstore (cosign, Rekor, Fulcio), SLSA çerçevesi. <em>Sırlar</em>: External Secrets Operator, sealed secret, Vault. Python'da çalıştırılabilir bir container-image tarayıcı (yüklü paket listesinde regex + sklearn-eğitilmiş CVE tahmin edici) ve bir Pod Security Policy doğrulayıcı ile kapatıyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Container tehdit modeli — namespace'ler neden VM değil</li>
<li>Trivy / Grype ile image tarama ve CVSS önceliklendirme</li>
<li>Falco eBPF kurallarıyla çalışma zamanı tespiti</li>
<li>Kubernetes 1.25+'ta Pod Security Admission (PSA)</li>
<li>OPA / Gatekeeper / Kyverno admission controller'lar</li>
<li>Tedarik zinciri: SBOM, sigstore, SLSA çerçevesi</li>
<li>Python'da regex + ML ile bir container tarayıcı inşa etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Container Tehdit Modeli</h2>
<p class="l-text">Container, namespace'ler (PID, network, mount, IPC, user, UTS, cgroup) ve bir seccomp/AppArmor profili olan bir süreç grubudur. Kernel paylaşılır. Herhangi kernel zafiyeti bir container kaçış primitifidir. Tehditler: (a) çalışma zamanı CVE yoluyla kaçış (runc, containerd); (b) host ağı veya mount edilmiş Docker socket yoluyla yanal hareket; (c) yanlış yapılandırılmış bir container'a cryptominer düşürme; (d) image tedarik zinciri ele geçirilmesi.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Image-zamanı</div><div class="card-body">Build hattı, base image, bağımlılıklar. SBOM + imza burada savunur.</div></div>
<div class="calc-card"><div class="card-title">Deploy-zamanı</div><div class="card-body">Admission controller'lar neyin çalıştığını kapılar. PSA, OPA, Kyverno.</div></div>
<div class="calc-card"><div class="card-title">Çalışma zamanı</div><div class="card-body">Falco, Tracee syscall'ları izler. Anomali = ele geçirilme.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Image Tarama — Trivy ve Grype</h2>
<p class="l-text">Her iki tarayıcı image'ın paket manifestini (apk, dpkg, rpm, npm, pip, gomod) ayrıştırır, CVE feed'lerine karşı eşleştirir (NVD, GHSA, OS-spesifik satıcılar) ve CVSS'e göre sıralanmış bulgular yayar. Trivy (Aqua) fiili CI standardıdır; Grype (Anchore) ikincisidir. Her ikisi de offline-yetenekli çalışır, her ikisi de GitHub code scanning için SARIF üretir.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Trivy: image'ı OS + dil zafiyetleri ve yanlış yapılandırmalar için tara
trivy image --severity HIGH,CRITICAL --ignore-unfixed nginx:1.21
trivy fs --scanners vuln,secret,config ./
trivy config ./manifests/    # IaC tara: Dockerfile, K8s YAML, Terraform

# Grype: Syft SBOM'dan tara
syft nginx:1.21 -o cyclonedx-json &gt; sbom.json
grype sbom:./sbom.json --fail-on high
</code></pre></div>
<p class="l-text"><strong>Komut komut okuyalım:</strong> 1) <code>trivy image --severity HIGH,CRITICAL --ignore-unfixed nginx:1.21</code> image manifestini çeker, her katmanın paket veritabanını (apk/dpkg/rpm) gezer, NVD + GHSA feed'leriyle eşleştirir ve yalnızca zaten yaması olan HIGH/CRITICAL CVE'leri basar — CI gate olarak mükemmel. 2) <code>trivy fs --scanners vuln,secret,config ./</code> çalışma ağacını tek geçişte zafiyetli bağımlılıklar, sızdırılmış sırlar (AWS anahtarları, Slack token'ları) ve yanlış yapılandırılmış Dockerfile/K8s YAML için tarar. 3) <code>syft nginx:1.21 -o cyclonedx-json &gt; sbom.json</code> bir CycloneDX SBOM üretir — tedarik-zinciri ekibinin SLSA attestation ve lisans incelemesi için ihtiyaç duyduğu aynı JSON. 4) <code>grype sbom:./sbom.json --fail-on high</code> SBOM'u offline okur ve HIGH+ bulgularda non-zero döner — bunu <code>kubectl apply</code>'a veya release hattınıza zincirleyin; bilinen zafiyetli release'ler ship olmadan engellenir.</p>

</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Mini Bir Container Tarayıcı İnşa Etmek</h2>
<p class="l-text">Image tarama paket listesinde regex + bir CVE veritabanı sorgusudur. Sahte bir CVE veritabanı ve paket sayımlarında anomali sınıflandırıcısıyla basitleştirilmiş bir sürüm inşa ediyoruz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Container taraması — yüklü paketleri sahte CVE DB'ye karşı regex eşleştir</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

# Sentetik dpkg -l çıktısı (tipik Debian image)
dpkg = """
ii  bash             5.1-2+deb11u1
ii  libssl1.1        1.1.1n-0+deb11u3
ii  openssl          1.1.1n-0+deb11u3
ii  libxml2          2.9.10-2.5
ii  log4j-core       2.14.1
ii  curl             7.74.0-1.3+deb11u3
ii  python3          3.9.2-3
ii  python3-yaml     5.4.1-1
"""

# Sahte CVE veritabanı
CVES = [
    {'pkg':'log4j-core', 'cve':'CVE-2021-44228','vrange':r'^2\\.([0-9]|1[0-4])\\.', 'severity':'CRITICAL'},
    {'pkg':'libssl1.1',  'cve':'CVE-2022-0778', 'vrange':r'^1\\.1\\.1[a-m]',         'severity':'HIGH'},
    {'pkg':'curl',       'cve':'CVE-2022-27774','vrange':r'^7\\.([0-9]|[0-7][0-9])', 'severity':'MEDIUM'},
]

installed = [tuple(line.split()[1:3]) for line in dpkg.strip().splitlines() if line.startswith('ii')]
findings = []
for pkg, ver in installed:
    for c in CVES:
        if pkg == c['pkg'] and re.match(c['vrange'], ver):
            findings.append((c['severity'], c['cve'], pkg, ver))

print(f"Image has {len(installed)} packages, {len(findings)} CVEs:")
for f in sorted(findings, key=lambda x: ['CRITICAL','HIGH','MEDIUM','LOW'].index(x[0])):
    print(f"  [{f[0]:8s}] {f[1]}  in  {f[2]} {f[3]}")
</code></pre></div>
</div>
<p class="l-text">Üretim tarayıcıları bunu milyonlarca CVE girişi, semver için range ayrıştırma ve önceliklendirmek için CVSS sömürülebilirlik skoru (EPSS) ile uygular.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Falco — Çalışma Zamanı Tespiti</h2>
<p class="l-text">Falco (Sysdig 2016, CNCF 2024'te mezun) eBPF yoluyla Linux syscall'larına bağlanır ve gerçek zamanlı olarak kural ifadelerini değerlendirir. Varsayılan kural setleri ~50 tespit kalıbını kapsar: container'da shell, /etc'e yazma, host yolunun mount'u, sudoers değişikliği, crypto miner göstergeleri.</p>
<div class="code-wrap"><div class="code-label"><span>YAML — FALCO RULE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>- rule: Terminal Shell in Container
  desc: Detect interactive shell spawned in a container
  condition: &gt;
    spawned_process and container and shell_procs
    and proc.tty != 0 and not user_known_shell_in_container
  output: &gt;
    Shell in container (user=%user.name container=%container.name
    parent=%proc.pname cmd=%proc.cmdline)
  priority: WARNING
  tags: [container, shell, mitre_execution]
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Bir güvenlik monitörü kurar — eBPF probe (Falco, Tetragon), syscall audit (auditd) veya network flow capture (Zeek, Suricata); üretim deployment'ları SIEM'e (Splunk, Elastic Security, Wazuh) akıtır. 2) Tespit kurallarını domain dilinde tanımlar — Falco YAML, Sigma imzaları veya YARA — canlı olay akışına karşı eşleştirilir. 3) Eşleşmede alarm yolunu tetikler: Slack / PagerDuty / SOAR playbook (Tines, Splunk SOAR) otomatik containment için. 4) Zor kısım sinyal-gürültü oranı: düşük false-positive ayarla, normal davranışı baseline'la ve MITRE ATT&CK eşlemesi uygula — böylece her alarm bilinen bir saldırgan tekniğine link olur.</p>

</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Pod Security Admission (PSA)</h2>
<p class="l-text">PodSecurityPolicy K8s 1.21'de kullanımdan kaldırıldı ve 1.25'te kaldırıldı. Değişimi, PSA, namespace düzeyinde üç ön ayar profili uygular: <em>privileged</em> (kısıtlama yok), <em>baseline</em> (akla yatkın minimum), <em>restricted</em> (sert sertleştirme). Uygulama modları: enforce (reddet), audit (logla), warn (kubectl uyarısı).</p>
<div class="code-wrap"><div class="code-label"><span>YAML — NAMESPACE WITH PSA</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>apiVersion: v1
kind: Namespace
metadata:
  name: prod
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
</code></pre></div>
<p class="l-text">Restricted profili yasaklar: privileged container'lar, hostPath mount'ları, hostNetwork, hostPID, hostIPC, NET_BIND_SERVICE dışındaki yetenekler, runAsRoot, allowPrivilegeEscalation. seccompProfile=RuntimeDefault zorlar.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Python'da Pod Security Doğrulayıcı</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
def validate_pod_restricted(pod):
    spec = pod['spec']
    issues = []
    if spec.get('hostNetwork'): issues.append('hostNetwork=true')
    if spec.get('hostPID'):     issues.append('hostPID=true')
    if spec.get('hostIPC'):     issues.append('hostIPC=true')
    for v in spec.get('volumes', []):
        if 'hostPath' in v: issues.append(f"hostPath volume: {v.get('name')}")
    for c in spec.get('containers', []):
        sec = c.get('securityContext', {})
        if sec.get('privileged'):       issues.append(f"{c['name']}: privileged")
        if sec.get('runAsUser') == 0:   issues.append(f"{c['name']}: runAsUser=0")
        if sec.get('allowPrivilegeEscalation', True): issues.append(f"{c['name']}: allowPrivEsc")
        caps = sec.get('capabilities', {}).get('add', [])
        bad = set(caps) - {'NET_BIND_SERVICE'}
        if bad: issues.append(f"{c['name']}: bad caps {bad}")
    return issues

pod = {
  'spec': {
    'hostNetwork': True,
    'volumes': [{'name':'host-root','hostPath':{'path':'/'}}],
    'containers': [{'name':'app','securityContext':{
        'privileged': True, 'runAsUser': 0,
        'capabilities': {'add': ['SYS_ADMIN','NET_ADMIN']},
    }}]
  }
}
print("Restricted profile violations:")
for v in validate_pod_restricted(pod): print(" -", v)
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>validate_pod_restricted(pod)</code> bir Pod spec'ini gezer ve K8s 1.25+ <em>restricted</em> profilini uygular — spec düzeyinde <code>hostNetwork</code>, <code>hostPID</code>, <code>hostIPC</code>'yi işaretler; her biri container'ın dayandığı kernel-namespace izolasyonunu kırar. 2) Volume döngüsü herhangi bir <code>hostPath</code> mount'unu reddeder — tek bir bind tüm node dosya sistemini, kubelet credential'larını ve diğer kiracıların sırlarını açar. 3) Her container için <code>securityContext</code> kontrolü <code>privileged: true</code> (tam root), <code>runAsUser: 0</code> (container içinde UID 0), <code>allowPrivilegeEscalation: true</code> (<code>setuid</code> binary'lerin seccomp profilinden kaçmasına izin verir) ve <code>NET_BIND_SERVICE</code> dışındaki herhangi bir eklenen capability'i reddeder. 4) Aynı mantık sunucu tarafında Pod Security Admission webhook olarak çalışır — sizin doğrulayıcınız upstream kuralları aynalar ki CI kötü manifest'leri cluster'a çarpmadan <em>önce</em> reddetsin; feedback döngüsü dakikalardan (kubectl rollout) saniyelere iner.</p>

</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. OPA / Gatekeeper ve Kyverno</h2>
<p class="l-text">PSA yerleşik profilleri kapsar. Özel kurallar için — "tüm image'lar registry.corp.example'den gelmeli", "her namespace bir owner etiketine sahip olmalı" — bir admission controller'a ihtiyacın var. İki motor:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">OPA Gatekeeper</div><div class="card-body">Rego politika dili. CNCF mezun. ConstraintTemplate + Constraint CRD'leri. Güçlü ama Rego öğrenme eğrisi.</div></div>
<div class="calc-card"><div class="card-title">Kyverno</div><div class="card-body">YAML-yerli, K8s-tarzı politikalar. CNCF 2024'te mezun. Kalıp-eşleşmesi tabanlı. Rego'dan daha kolay başlangıç.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>YAML — KYVERNO POLICY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata: { name: require-signed-images }
spec:
  validationFailureAction: Enforce
  rules:
  - name: verify-cosign
    match: { any: [{ resources: { kinds: [Pod] }}]}
    verifyImages:
    - imageReferences: ["registry.corp.example/*"]
      attestors:
      - entries:
        - keys: { publicKeys: "-----BEGIN PUBLIC KEY-----\\nMFk..." }
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>kind: ClusterPolicy</code> ve <code>validationFailureAction: Enforce</code> Kyverno'ya admission anında uyumsuz istekleri yalnızca denetlemek yerine <em>engellemesini</em> söyler — doğrulamayı geçemeyen pod'lar API sunucusuna asla ulaşmaz. 2) <code>match: { any: [{ resources: { kinds: [Pod] }}]}</code> kuralın kapsamını tüm namespace'lerdeki her Pod create/update'e genişletir; owner-reference zinciri yoluyla Deployment ve Job tarafından doğanlar da dahil. 3) <code>verifyImages</code> ve <code>imageReferences: ["registry.corp.example/*"]</code> kuralı yalnızca güvenilen registry'nize uygular — public image'lar yine pull edilebilir (veya ayrı bir deny kuralı eklersiniz) ama kurum içinde imzalananlar mutlaka doğrulanır. 4) <code>attestors.keys.publicKeys</code> alanı cosign doğrulama anahtarını taşır; yalnızca eşleşen cosign özel anahtarıyla (tipik olarak build hattında) imzalanmış image'lar geçer — diğerleri reddedilir; SolarWinds tarzı tedarik-zinciri ele geçirilmesine karşı savunma sağlanır.</p>

</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Tedarik Zinciri — SBOM, sigstore, SLSA</h2>
<p class="l-text">Modern tedarik-zinciri güvenliğinin üç sütunu.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SBOM</div><div class="card-body">Software Bill of Materials. CycloneDX (OWASP) veya SPDX (Linux Foundation). Her paket + versiyonu listeler.</div></div>
<div class="calc-card"><div class="card-title">sigstore</div><div class="card-body">cosign image'ları imzalar, Rekor imzaları loglar, Fulcio OIDC'den kısa-ömürlü sertifikalar verir. GitHub OIDC yoluyla anahtarsız imzalama.</div></div>
<div class="calc-card"><div class="card-title">SLSA</div><div class="card-body">Supply-chain Levels for Software Artifacts. L1 build belgeler; L4 hermetik+yeniden üretilebilir+iki-kişi inceleme.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>BASH — COSIGN SIGN AND VERIFY</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Anahtarsız OIDC ile imzala (GitHub Actions kimliği)
cosign sign --yes registry.corp.example/app:v1.2.3

# Admission controller / CI'da doğrula
cosign verify --certificate-identity-regexp 'https://github.com/corp/.*' \\
              --certificate-oidc-issuer https://token.actions.githubusercontent.com \\
              registry.corp.example/app:v1.2.3
</code></pre></div>
<p class="l-text"><strong>Komut komut okuyalım:</strong> 1) <code>cosign sign --yes registry.corp.example/app:v1.2.3</code> sigstore'un <em>anahtarsız</em> akışını kullanır: cosign Fulcio'dan GitHub Actions OIDC kimliğine bağlı kısa-ömürlü (10 dk) bir sertifika ister, image digest'ini imzalar ve hem imzayı hem de bir Rekor transparency-log girdisini yazar — disk'te asla özel anahtar tutulmaz. 2) OIDC iddiası repo ve workflow'u içerdiğinden, üretilen sertifika build'in beklenen GitHub workflow'unda çalıştığını <em>kanıtlar</em>; bu SLSA Level 3 provenance şartını karşılar. 3) <code>cosign verify</code> ile <code>--certificate-identity-regexp</code> ve <code>--certificate-oidc-issuer</code> doğrulayıcı tarafı politikayı zorlar: yalnızca gömülü OIDC kimliği regex'le eşleşen (örn. organizasyonunuzun GitHub'ı) ve issuer'ı GitHub Actions olan imzalar geçer. 4) <code>cosign verify</code>'yi bölüm 7'deki Kyverno politikasına bağlayın — admission controller onaylı bir build hattıyla imzalanmamış her image'ı reddeder; tedarik-zinciri döngüsü uçtan uca kapanır.</p>

</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Sırlar Yönetimi</h2>
<p class="l-text">Üç kalıp. (1) <em>External Secrets Operator</em> Vault/AWS Secrets Manager'dan K8s Secret kaynaklarına çeker. (2) <em>Sealed Secrets</em> (Bitnami) şifrelenmiş sırları Git'e commit etmene izin verir, yalnızca cluster controller tarafından çözülür. (3) İş yükü kimliği için <em>SPIFFE/SPIRE</em> — kısa-ömürlü SVID'ler statik API anahtarlarının yerini alır. Sırları image'lara asla pişirme; şifrelenmemiş sırları asla Git'e commit etme.</p>
</div>

<div class="lesson-block" id="section-10"><h2 class="lesson-title">10. Denetim Checklist'i</h2>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Image registry: yalnızca imzalı image'lar, CI'da Trivy tarama HIGH/CRITICAL'i engeller.</li>
<li>Cluster: tüm üretim namespace'lerinde PSA restricted; Kyverno veya Gatekeeper org politikalarını uyguluyor.</li>
<li>Çalışma zamanı: Falco cluster çapında dağıtık, SIEM'e uyarılar, "container'da shell" için on-call runbook.</li>
<li>Sırlar: External Secrets Operator + Vault; commit edilmiş Secret YAML'de <code>data:</code> alanı yok.</li>
<li>Ağ: her namespace'de NetworkPolicy varsayılan-reddet (ders 5).</li>
<li>Denetim: kube-bench (CIS K8s) temiz, kube-hunter pen test geçer.</li>
</ol>
</div>`
};
