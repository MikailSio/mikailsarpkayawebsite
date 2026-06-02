window.NETSEC_L4 = {

en: `<p class="l-text"><strong>Snort fired its first alert in 1998. Twenty-six years later, defenders still rely on the same two paradigms: signature matching ("I have seen this byte pattern before") and anomaly detection ("this traffic looks weird").</strong> Modern intrusion detection systems blend both with machine learning models trained on packet captures, NetFlow records, and host telemetry — and the attackers respond with GAN-augmented evasion.</p>
<p class="l-text">In this lesson we cover Snort/Suricata rule syntax, the canonical IDS datasets (KDD99, NSL-KDD, CICIDS2017), and build a working ML-based IDS in your browser using <code>IsolationForest</code> on synthesized flow features. We also discuss why false-positive rate is the make-or-break metric.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compare signature, anomaly, and stateful protocol IDS approaches</li>
<li>Read and write Snort / Suricata rules</li>
<li>Recall the strengths and biases of KDD99, NSL-KDD, and CICIDS2017</li>
<li>Train an IsolationForest anomaly detector on synthesized flow features</li>
<li>Reason about false-positive rate, base-rate fallacy, and analyst fatigue</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Three Detection Philosophies</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Signature</div><div class="card-body">Match known attack patterns. Snort, Suricata, YARA. Fast, zero false positives on known threats — blind to zero-days.</div></div>
<div class="calc-card"><div class="card-title">Anomaly</div><div class="card-body">Learn "normal", flag deviations. Catches novel attacks but high FP. ML lives here.</div></div>
<div class="calc-card"><div class="card-title">Stateful protocol</div><div class="card-body">Validate against protocol RFCs (HTTP, DNS, SMB). Catches malformed packets.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Snort / Suricata Rules</h2>
<p class="l-text">A rule is "action protocol src dst ( options )". Suricata extends Snort syntax with multi-threading, EVE JSON output, and Lua scripting. Communities (Emerging Threats, Talos) ship daily rule updates.</p>
<div class="code-wrap"><div class="code-label"><span>SURICATA RULES</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Detect SMB exploit attempt (EternalBlue, MS17-010)</span>
alert smb any any -&gt; $HOME_NET 445 (msg:<span class="str">"ETPRO EXPLOIT MS17-010 echo response"</span>; \
 flow:established,to_client; content:<span class="str">"|00 00 00 31 ff 53 4d 42 2b|"</span>; \
 sid:<span class="num">2024218</span>; rev:<span class="num">2</span>;)

<span class="cm"># Log4Shell JNDI lookup in any HTTP header (CVE-2021-44228)</span>
alert http any any -&gt; any any (msg:<span class="str">"ET EXPLOIT Log4j RCE Attempt"</span>; \
 flow:to_server,established; content:<span class="str">"\${jndi:"</span>; nocase; http_header; \
 sid:<span class="num">2034647</span>; rev:<span class="num">3</span>;)

<span class="cm"># Suspicious DNS query — too long, possible exfiltration</span>
alert dns any any -&gt; any any (msg:<span class="str">"DNS query length &gt; 100 chars"</span>; \
 dns.query; content:<span class="str">""</span>; pcre:<span class="str">"/^.{100,}$/"</span>; \
 sid:<span class="num">9000001</span>;)</code></pre></div>
<p class="l-text"><strong>What this code does, rule by rule:</strong> 1) The first rule fires on the SMB protocol heading into <code>$HOME_NET:445</code> — the <code>content:"|00 00 00 31 ff 53 4d 42 2b|"</code> hex pattern matches the EternalBlue echo response (MS17-010), the same primitive WannaCry used in 2017. 2) The second rule scans every HTTP header for the literal substring <code>\${jndi:</code> with <code>nocase</code> — this catches the Log4Shell (CVE-2021-44228) JNDI lookup regardless of case games like <code>\${JnDi:</code>. 3) The third rule applies a PCRE <code>/^.{100,}$/</code> on the <code>dns.query</code> buffer, flagging suspiciously long subdomain labels — the classic DNS-tunnel / DNSCat / Cobalt Strike exfiltration shape. 4) Each rule carries a unique <code>sid:</code> (rule ID) and <code>rev:</code> (revision), which lets the SIEM correlate alerts and lets you upgrade rule sets without losing alert history.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Canonical Datasets</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">KDD Cup 99</div><div class="card-body">5M connections, DARPA 1998. Heavily biased, redundant, but historically dominant.</div></div>
<div class="calc-card"><div class="card-title">NSL-KDD</div><div class="card-body">Cleaned KDD99. Removes duplicates. Still uses 1998 traffic.</div></div>
<div class="calc-card"><div class="card-title">CICIDS2017</div><div class="card-body">UNB Canada. Real attacks (Heartbleed, Botnet, DDoS, SQLi). 80 features.</div></div>
<div class="calc-card"><div class="card-title">UNSW-NB15</div><div class="card-body">Australia 2015. 49 features, 9 attack families.</div></div>
<div class="calc-card"><div class="card-title">CTU-13</div><div class="card-body">Botnet captures. Useful for behavioral analytics.</div></div>
<div class="calc-card"><div class="card-title">CICIDS2018</div><div class="card-body">AWS-hosted. More diverse than 2017.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ML-IDS — IsolationForest on Flow Features</h2>
<p class="l-text">IsolationForest learns to separate points by random partitioning — anomalies need fewer splits to isolate. We will fabricate normal flows (HTTP, DNS) and slip in some scan / DoS flows, then watch the model surface them.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> IsolationForest

rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)

<span class="cm"># Normal flows: small bytes, modest packet count, port 80/443</span>
n = <span class="num">2000</span>
normal = np.<span class="fn">column_stack</span>([
    rng.<span class="fn">lognormal</span>(<span class="num">7</span>, <span class="num">1</span>, n),                  <span class="cm"># bytes</span>
    rng.<span class="fn">poisson</span>(<span class="num">15</span>, n),                       <span class="cm"># packets</span>
    rng.<span class="fn">choice</span>([<span class="num">80</span>, <span class="num">443</span>], n, p=[<span class="num">.4</span>,<span class="num">.6</span>]),     <span class="cm"># dst port</span>
    rng.<span class="fn">uniform</span>(<span class="num">0.05</span>, <span class="num">3</span>, n),                  <span class="cm"># duration s</span>
])

<span class="cm"># Anomalies: port scan (tiny bytes, many ports) + DoS (huge packets)</span>
scans = np.<span class="fn">column_stack</span>([rng.<span class="fn">uniform</span>(<span class="num">40</span>,<span class="num">80</span>,<span class="num">40</span>), rng.<span class="fn">poisson</span>(<span class="num">2</span>,<span class="num">40</span>),
                        rng.<span class="fn">integers</span>(<span class="num">1</span>,<span class="num">65535</span>,<span class="num">40</span>), rng.<span class="fn">uniform</span>(<span class="num">.001</span>,<span class="num">.05</span>,<span class="num">40</span>)])
dos   = np.<span class="fn">column_stack</span>([rng.<span class="fn">uniform</span>(<span class="num">5e6</span>,<span class="num">1e7</span>,<span class="num">10</span>), rng.<span class="fn">poisson</span>(<span class="num">8000</span>,<span class="num">10</span>),
                        np.<span class="fn">full</span>(<span class="num">10</span>,<span class="num">80</span>), rng.<span class="fn">uniform</span>(<span class="num">5</span>,<span class="num">10</span>,<span class="num">10</span>)])

X = np.<span class="fn">vstack</span>([normal, scans, dos])
y_true = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(n), -np.<span class="fn">ones</span>(<span class="fn">len</span>(scans)+<span class="fn">len</span>(dos))])

clf = <span class="fn">IsolationForest</span>(contamination=<span class="num">0.025</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X)
y_pred = clf.<span class="fn">predict</span>(X)

tp = ((y_pred==-<span class="num">1</span>) &amp; (y_true==-<span class="num">1</span>)).<span class="fn">sum</span>()
fp = ((y_pred==-<span class="num">1</span>) &amp; (y_true== <span class="num">1</span>)).<span class="fn">sum</span>()
fn = ((y_pred== <span class="num">1</span>) &amp; (y_true==-<span class="num">1</span>)).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"TP={tp} FP={fp} FN={fn} | precision={tp/(tp+fp):.2f} recall={tp/(tp+fn):.2f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a synthetic feature matrix <code>X</code> of four flow features per row — bytes (lognormal), packet count (Poisson), destination port (mostly 80/443) and duration — stacking 2000 normal flows with 40 port-scan and 10 DoS rows. 2) Calls <code>IsolationForest(contamination=0.025).fit(X)</code> — the model builds 100 random-partition trees and learns that anomalies isolate with shorter average path length than the normal cluster. 3) <code>clf.predict(X)</code> returns <code>+1</code> for inliers and <code>-1</code> for anomalies; <code>clf.score_samples(X)</code> gives the continuous anomaly score you can threshold yourself. 4) The print line computes <code>precision = TP/(TP+FP)</code> and <code>recall = TP/(TP+FN)</code> — these are the only metrics that matter for IDS, because raw accuracy is dominated by the trivially-classified normal majority.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy and scikit-learn are pre-loaded by the runner. The whole pipeline runs in under a second on a laptop.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Statistical Anomaly Score</h2>
<p class="l-text">Z-score is the simplest possible IDS feature. Flag any flow whose feature exceeds k standard deviations from the rolling mean.</p>
<div class="katex-block">$$Z = \\frac{x - \\mu}{\\sigma}$$</div>
<p class="l-text">Modern systems combine many such scores via Mahalanobis distance, autoencoder reconstruction error, or LSTM next-step prediction loss. The principle is the same: define a baseline, measure deviation, threshold.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Base-Rate Fallacy</h2>
<p class="l-text">An IDS with 99% accuracy on a network where 1 in 10 000 connections is malicious produces 100 false positives for every true positive. Analysts drown. This is why precision matters more than accuracy in security ML.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">A SOC analyst can review ~20 alerts per shift. Optimize for FP rate, not pure recall.</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Precision</div><div class="card-body">TP / (TP + FP). What % of alerts are real?</div></div>
<div class="calc-card"><div class="card-title">Recall</div><div class="card-body">TP / (TP + FN). What % of attacks did we catch?</div></div>
<div class="calc-card"><div class="card-title">FPR</div><div class="card-body">FP / (FP + TN). What fraction of normal traffic do we annoy?</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Adversarial &amp; GAN-Augmented Detection</h2>
<p class="l-text">Attackers train GANs to generate flows that mimic normal distributions while still carrying out the attack. Defense: ensemble multiple detectors, use robust features (TLS JA3 fingerprints, JA4), and feed labeled red-team data back into training. Research like <em>IDSGAN</em> (Lin et al. 2018) showed 99% evasion of black-box ML-IDS — robust IDS must assume an adaptive attacker.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Pipeline Visualization</h2>
<p class="l-text">Anomaly score histogram for our synthesized flows — normal traffic clusters near 0, attacks land in the long left tail.</p>
<div class="plotly-graph" id="netsec4-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Production Architectures</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sensor</div><div class="card-body">Span port, TAP, or eBPF on host. Suricata or Zeek.</div></div>
<div class="calc-card"><div class="card-title">Aggregator</div><div class="card-body">Kafka, Elastic. Ships JSON events.</div></div>
<div class="calc-card"><div class="card-title">SIEM</div><div class="card-body">Splunk, Elastic SIEM, Sentinel. Correlation + dashboards.</div></div>
<div class="calc-card"><div class="card-title">SOAR</div><div class="card-body">Auto-quarantine, ticket creation. Closes the loop.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Signature catches knowns; anomaly catches unknowns; combine them.<br><strong>2.</strong> Snort/Suricata rules are still the daily-bread of every blue team.<br><strong>3.</strong> Train ML-IDS on CICIDS2017 / UNSW-NB15 — KDD99 is too biased.<br><strong>4.</strong> IsolationForest is a strong, low-cost first ML detector.<br><strong>5.</strong> Base-rate fallacy: optimize precision &amp; FPR, not raw accuracy.<br><strong>6.</strong> Adaptive attackers force ensembles and continual retraining.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var normal = []; for(var i=0;i<2000;i++) normal.push(Math.random()*0.4 - 0.05);
  var attack = []; for(var i=0;i<60;i++) attack.push(-0.1 - Math.random()*0.5);
  var data = [
    {x:normal, type:'histogram', name:'Normal', opacity:0.65, marker:{color:T.accent}},
    {x:attack, type:'histogram', name:'Attack', opacity:0.65, marker:{color:'#e07b7b'}},
  ];
  var layout = {title:'IsolationForest anomaly score distribution', barmode:'overlay', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'score (lower = more anomalous)', gridcolor:T.grid}, yaxis:{title:'count', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  var el=document.getElementById('netsec4-plot-en'); if(el && window.Plotly) Plotly.newPlot('netsec4-plot-en', data, layout, {displayModeBar:false});
},250);
</script>`,

tr: `<p class="l-text"><strong>Snort ilk uyarısını 1998'de gönderdi. Yirmi altı yıl sonra, savunmacılar hâlâ aynı iki paradigmaya güveniyor: imza eşleştirme ("bu bayt kalıbını daha önce gördüm") ve anomali tespiti ("bu trafik garip görünüyor").</strong> Modern saldırı tespit sistemleri her ikisini paket yakalamaları, NetFlow kayıtları ve host telemetrisinde eğitilmiş makine öğrenmesi modelleriyle harmanlar — ve saldırganlar GAN-artırılmış kaçınmayla yanıt verir.</p>
<p class="l-text">Bu derste Snort/Suricata kural sözdizimini, klasik IDS veri setlerini (KDD99, NSL-KDD, CICIDS2017) kapsıyoruz ve sentezlenmiş akış özellikleri üzerinde <code>IsolationForest</code> kullanarak tarayıcında çalışan ML-tabanlı bir IDS inşa ediyoruz. Yanlış-pozitif oranının neden başarı-veya-başarısızlık metriği olduğunu da tartışıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İmza, anomali ve durum bilgisi olan protokol IDS yaklaşımlarını karşılaştırmak</li>
<li>Snort / Suricata kuralları okumak ve yazmak</li>
<li>KDD99, NSL-KDD ve CICIDS2017'nin güçlü yanlarını ve önyargılarını hatırlamak</li>
<li>Sentezlenmiş akış özelliklerinde bir IsolationForest anomali dedektörü eğitmek</li>
<li>Yanlış-pozitif oranı, base-rate yanılgısı ve analist yorgunluğu hakkında akıl yürütmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Tespit Felsefesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">İmza</div><div class="card-body">Bilinen saldırı kalıplarını eşleştir. Snort, Suricata, YARA. Hızlı, bilinen tehditlerde sıfır yanlış pozitif — sıfır günlere kör.</div></div>
<div class="calc-card"><div class="card-title">Anomali</div><div class="card-body">"Normal"i öğren, sapmaları işaretle. Yeni saldırıları yakalar ama yüksek FP. ML burada yaşar.</div></div>
<div class="calc-card"><div class="card-title">Durum bilgili protokol</div><div class="card-body">Protokol RFC'lerine (HTTP, DNS, SMB) karşı doğrula. Bozuk paketleri yakalar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Snort / Suricata Kuralları</h2>
<p class="l-text">Bir kural "action protocol src dst ( options )" şeklindedir. Suricata Snort sözdizimini multi-threading, EVE JSON çıktı ve Lua scripting ile genişletir. Topluluklar (Emerging Threats, Talos) günlük kural güncellemeleri yayar.</p>
<div class="code-wrap"><div class="code-label"><span>SURICATA RULES</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># SMB exploit denemesini tespit et (EternalBlue, MS17-010)</span>
alert smb any any -&gt; $HOME_NET 445 (msg:<span class="str">"ETPRO EXPLOIT MS17-010 echo response"</span>; \
 flow:established,to_client; content:<span class="str">"|00 00 00 31 ff 53 4d 42 2b|"</span>; \
 sid:<span class="num">2024218</span>; rev:<span class="num">2</span>;)

<span class="cm"># Herhangi HTTP başlığında Log4Shell JNDI lookup (CVE-2021-44228)</span>
alert http any any -&gt; any any (msg:<span class="str">"ET EXPLOIT Log4j RCE Attempt"</span>; \
 flow:to_server,established; content:<span class="str">"\${jndi:"</span>; nocase; http_header; \
 sid:<span class="num">2034647</span>; rev:<span class="num">3</span>;)

<span class="cm"># Şüpheli DNS sorgusu — çok uzun, olası sızdırma</span>
alert dns any any -&gt; any any (msg:<span class="str">"DNS query length &gt; 100 chars"</span>; \
 dns.query; content:<span class="str">""</span>; pcre:<span class="str">"/^.{100,}$/"</span>; \
 sid:<span class="num">9000001</span>;)</code></pre></div>
<p class="l-text"><strong>Kuralları sırayla okuyalım:</strong> 1) İlk kural <code>$HOME_NET:445</code>'e gelen SMB trafiğinde tetiklenir — <code>content:"|00 00 00 31 ff 53 4d 42 2b|"</code> hex kalıbı EternalBlue echo yanıtını (MS17-010) yakalar; bu, 2017'de WannaCry'ın da kullandığı aynı primitiftir. 2) İkinci kural her HTTP başlığında <code>\${jndi:</code> alt-dizesini <code>nocase</code> ile tarar — Log4Shell (CVE-2021-44228) JNDI lookup'ını <code>\${JnDi:</code> gibi büyük-küçük harf oyunlarına rağmen yakalar. 3) Üçüncü kural <code>dns.query</code> buffer'ına <code>/^.{100,}$/</code> PCRE uygular ve şüphesiz uzun alt-alan etiketlerini işaretler — klasik DNS-tünel / DNSCat / Cobalt Strike exfiltration biçimi. 4) Her kural benzersiz bir <code>sid:</code> (rule ID) ve <code>rev:</code> (revizyon) taşır — bu, SIEM'in alarmları ilişkilendirmesine ve kural setlerini alarm geçmişini kaybetmeden yükseltmenize olanak tanır.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Klasik Veri Setleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">KDD Cup 99</div><div class="card-body">5M bağlantı, DARPA 1998. Ağır önyargılı, fazlalık ama tarihsel olarak baskın.</div></div>
<div class="calc-card"><div class="card-title">NSL-KDD</div><div class="card-body">Temizlenmiş KDD99. Tekrarları kaldırır. Hâlâ 1998 trafiğini kullanır.</div></div>
<div class="calc-card"><div class="card-title">CICIDS2017</div><div class="card-body">UNB Kanada. Gerçek saldırılar (Heartbleed, Botnet, DDoS, SQLi). 80 özellik.</div></div>
<div class="calc-card"><div class="card-title">UNSW-NB15</div><div class="card-body">Avustralya 2015. 49 özellik, 9 saldırı ailesi.</div></div>
<div class="calc-card"><div class="card-title">CTU-13</div><div class="card-body">Botnet yakalamaları. Davranışsal analitik için yararlı.</div></div>
<div class="calc-card"><div class="card-title">CICIDS2018</div><div class="card-body">AWS-host'lu. 2017'den daha çeşitli.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ML-IDS — Akış Özelliklerinde IsolationForest</h2>
<p class="l-text">IsolationForest noktaları rastgele bölmeyle ayırmayı öğrenir — anomalilerin izole edilmesi için daha az bölünme gerekir. Normal akışları (HTTP, DNS) üreteceğiz ve bazı tarama / DoS akışlarını içine sokacağız, sonra modelin onları yüzeye çıkardığını izleyeceğiz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> IsolationForest

rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)

<span class="cm"># Normal akışlar: küçük bayt'lar, mütevazı paket sayısı, port 80/443</span>
n = <span class="num">2000</span>
normal = np.<span class="fn">column_stack</span>([
    rng.<span class="fn">lognormal</span>(<span class="num">7</span>, <span class="num">1</span>, n),                  <span class="cm"># bayt</span>
    rng.<span class="fn">poisson</span>(<span class="num">15</span>, n),                       <span class="cm"># paket</span>
    rng.<span class="fn">choice</span>([<span class="num">80</span>, <span class="num">443</span>], n, p=[<span class="num">.4</span>,<span class="num">.6</span>]),     <span class="cm"># dst port</span>
    rng.<span class="fn">uniform</span>(<span class="num">0.05</span>, <span class="num">3</span>, n),                  <span class="cm"># süre s</span>
])

<span class="cm"># Anomaliler: port tarama (küçük bayt, çok port) + DoS (büyük paket)</span>
scans = np.<span class="fn">column_stack</span>([rng.<span class="fn">uniform</span>(<span class="num">40</span>,<span class="num">80</span>,<span class="num">40</span>), rng.<span class="fn">poisson</span>(<span class="num">2</span>,<span class="num">40</span>),
                        rng.<span class="fn">integers</span>(<span class="num">1</span>,<span class="num">65535</span>,<span class="num">40</span>), rng.<span class="fn">uniform</span>(<span class="num">.001</span>,<span class="num">.05</span>,<span class="num">40</span>)])
dos   = np.<span class="fn">column_stack</span>([rng.<span class="fn">uniform</span>(<span class="num">5e6</span>,<span class="num">1e7</span>,<span class="num">10</span>), rng.<span class="fn">poisson</span>(<span class="num">8000</span>,<span class="num">10</span>),
                        np.<span class="fn">full</span>(<span class="num">10</span>,<span class="num">80</span>), rng.<span class="fn">uniform</span>(<span class="num">5</span>,<span class="num">10</span>,<span class="num">10</span>)])

X = np.<span class="fn">vstack</span>([normal, scans, dos])
y_true = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(n), -np.<span class="fn">ones</span>(<span class="fn">len</span>(scans)+<span class="fn">len</span>(dos))])

clf = <span class="fn">IsolationForest</span>(contamination=<span class="num">0.025</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X)
y_pred = clf.<span class="fn">predict</span>(X)

tp = ((y_pred==-<span class="num">1</span>) &amp; (y_true==-<span class="num">1</span>)).<span class="fn">sum</span>()
fp = ((y_pred==-<span class="num">1</span>) &amp; (y_true== <span class="num">1</span>)).<span class="fn">sum</span>()
fn = ((y_pred== <span class="num">1</span>) &amp; (y_true==-<span class="num">1</span>)).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"TP={tp} FP={fp} FN={fn} | precision={tp/(tp+fp):.2f} recall={tp/(tp+fn):.2f}"</span>)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Satır başına dört akış özelliği içeren sentetik bir <code>X</code> matrisi kurar — bayt sayısı (lognormal), paket sayısı (Poisson), hedef port (çoğunlukla 80/443) ve süre — 2000 normal akışı 40 port-tarama ve 10 DoS satırıyla üst üste yığar. 2) <code>IsolationForest(contamination=0.025).fit(X)</code> çağrısı 100 rastgele-bölme ağacı kurar; model, anomalilerin normal kümeden daha kısa ortalama yol uzunluğuyla izole edildiğini öğrenir. 3) <code>clf.predict(X)</code> inlier'lar için <code>+1</code>, anomaliler için <code>-1</code> döner; <code>clf.score_samples(X)</code> ise kendi eşiğinizi koyabileceğiniz sürekli anomali skorunu verir. 4) Print satırı <code>precision = TP/(TP+FP)</code> ve <code>recall = TP/(TP+FN)</code> hesaplar — IDS için tek anlamlı metrikler bunlardır; ham accuracy, kolayca sınıflandırılan normal çoğunluk tarafından domine edilir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcında çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy ve scikit-learn runner tarafından önyüklenir. Tüm hat bir laptop'ta bir saniyenin altında çalışır.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. İstatistiksel Anomali Skoru</h2>
<p class="l-text">Z-skoru mümkün olan en basit IDS özelliğidir. Özelliği kayan ortalamadan k standart sapma aşan herhangi bir akışı işaretle.</p>
<div class="katex-block">$$Z = \\frac{x - \\mu}{\\sigma}$$</div>
<p class="l-text">Modern sistemler Mahalanobis mesafesi, autoencoder yeniden yapılandırma hatası veya LSTM sonraki-adım tahmin kaybı yoluyla birçok böyle skoru birleştirir. İlke aynıdır: bir taban tanımla, sapmayı ölç, eşikle.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Base-Rate Yanılgısı</h2>
<p class="l-text">10.000 bağlantıdan birinin kötü amaçlı olduğu bir ağda %99 doğruluk olan bir IDS her gerçek pozitif için 100 yanlış pozitif üretir. Analistler boğulur. Bu yüzden güvenlik ML'inde precision doğruluktan daha önemlidir.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1rem 0;border-radius:0 8px 8px 0;font-size:0.93rem">Bir SOC analisti vardiya başına ~20 uyarı inceleyebilir. FP oranı için optimize et, salt recall için değil.</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Precision</div><div class="card-body">TP / (TP + FP). Uyarıların %'si gerçek?</div></div>
<div class="calc-card"><div class="card-title">Recall</div><div class="card-body">TP / (TP + FN). Saldırıların %'sini yakaladık?</div></div>
<div class="calc-card"><div class="card-title">FPR</div><div class="card-body">FP / (FP + TN). Normal trafiğin hangi kesirini rahatsız ediyoruz?</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Düşmanca ve GAN-Artırılmış Tespit</h2>
<p class="l-text">Saldırganlar, saldırıyı yürütmeye devam ederken normal dağılımları taklit eden akışlar üretmek için GAN'ları eğitir. Savunma: birden çok dedektörü topla, dayanıklı özellikler kullan (TLS JA3 fingerprint'leri, JA4) ve etiketli kırmızı-takım verisini eğitime geri besle. <em>IDSGAN</em> (Lin vd. 2018) gibi araştırmalar kara kutu ML-IDS'in %99 kaçınmasını gösterdi — dayanıklı IDS uyarlamalı bir saldırgan varsaymalıdır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hat Görselleştirmesi</h2>
<p class="l-text">Sentezlenmiş akışlarımız için anomali skoru histogramı — normal trafik 0'a yakın kümelenir, saldırılar uzun sol kuyrukta düşer.</p>
<div class="plotly-graph" id="netsec4-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Üretim Mimarileri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sensör</div><div class="card-body">Span port, TAP veya host'ta eBPF. Suricata veya Zeek.</div></div>
<div class="calc-card"><div class="card-title">Toplayıcı</div><div class="card-body">Kafka, Elastic. JSON olayları gönderir.</div></div>
<div class="calc-card"><div class="card-title">SIEM</div><div class="card-body">Splunk, Elastic SIEM, Sentinel. Korelasyon + dashboard'lar.</div></div>
<div class="calc-card"><div class="card-title">SOAR</div><div class="card-body">Otomatik karantina, ticket oluşturma. Döngüyü kapatır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Kilit Çıkarımlar</h2>
<div class="think-box"><div class="think-label">KİLİT ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> İmza bilinenleri yakalar; anomali bilinmeyenleri yakalar; ikisini birleştir.<br><strong>2.</strong> Snort/Suricata kuralları hâlâ her mavi takımın günlük ekmeği.<br><strong>3.</strong> ML-IDS'i CICIDS2017 / UNSW-NB15'te eğit — KDD99 çok önyargılı.<br><strong>4.</strong> IsolationForest güçlü, düşük-maliyetli ilk ML dedektörüdür.<br><strong>5.</strong> Base-rate yanılgısı: precision ve FPR'yi optimize et, salt doğruluğu değil.<br><strong>6.</strong> Uyarlamalı saldırganlar topluluklar ve sürekli yeniden eğitim zorlar.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var normal = []; for(var i=0;i<2000;i++) normal.push(Math.random()*0.4 - 0.05);
  var attack = []; for(var i=0;i<60;i++) attack.push(-0.1 - Math.random()*0.5);
  var data = [
    {x:normal, type:'histogram', name:'Normal', opacity:0.65, marker:{color:T.accent}},
    {x:attack, type:'histogram', name:'Saldırı', opacity:0.65, marker:{color:'#e07b7b'}},
  ];
  var layout = {title:'IsolationForest anomali skoru dağılımı', barmode:'overlay', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'skor (düşük = daha anormal)', gridcolor:T.grid}, yaxis:{title:'sayım', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  var el=document.getElementById('netsec4-plot-tr'); if(el && window.Plotly) Plotly.newPlot('netsec4-plot-tr', data, layout, {displayModeBar:false});
},250);
</script>`
};
