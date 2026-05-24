var x = '<p class="l-text"><strong>Tekil Değer Ayrışımı (SVD), doğrusal cebirdeki en genel ve geometrik olarak en şeffaf ayrışımdır.</strong> Özayrışım yalnızca kare matrislere uygulanır ve bazı durumlarda başarısız olur (defektif matrisler); SVD ise istisnasız her gerçek (ya da karmaşık) matris için geçerlidir ve daima iki ortogonal döndürme ile bir köşegen germe çarpımına ayrılır. Bir doğrusal dönüşümün geometrik içeriğinin en temiz ifadesidir.</p>'

+ '<p class="l-text">Bu ders SVD\\\'yi saf doğrusal cebirden geliştirir: simetrik / simetrik olmayan matrisler üzerinden motivasyon, $A^T A$\\\'ya spektral teoremin uygulanmasıyla türetim, döndürme-germe-döndürme geometrisi, Eckart–Young düşük rank yaklaşımı, polar ayrışım ve Moore–Penrose sözde tersi. Her teorem ya kanıtlanır ya da ana hatlarıyla verilir; her örnek elle çözülür.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Herhangi bir $m\\times n$ matris için SVD teoremini $A = U\\Sigma V^T$ ifade etmek ve kanıtlamak</li>'
+ '<li>Tekil değerleri ve tekil vektörleri $A^T A$\\\'nın özayrışımından türetmek</li>'
+ '<li>SVD\\\'yi, eksenlere paralel bir germe ile çevrelenmiş iki döndürme olarak geometrik yorumlamak</li>'
+ '<li>Küçük bir matrisin SVD\\\'sini baştan sona elle hesaplamak</li>'
+ '<li>Eckart–Young teoremini en iyi düşük rank yaklaşımı üzerine ifade etmek ve kanıtlamak</li>'
+ '<li>Polar ayrışımı $A = QP$ tanımlamak ve SVD ile bağlantısını kurmak</li>'
+ '<li>Moore–Penrose sözde tersini oluşturmak ve en küçük kareler için kullanmak</li>'
+ '<li>Frobenius ve spektral normları tekil değerlerden hesaplamak</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   BÖLÜM 1: Özdeğerlerden Tekil Değerlere
   ============================================================ */
+ '<h2 class="l-title">1. Özdeğerlerden Tekil Değerlere</h2>'

+ '<div class="calc-highlight"><strong>Motivasyon.</strong> Özayrışım $A = P D P^{-1}$, $A$\\\'nın kare olmasını ve özvektörlerinin tam bir baz oluşturmasını gerektirir. SVD her iki kısıtlamayı da kaldırır: herhangi bir dikdörtgen matris için tanımlıdır ve geometrik olarak daha açıklayıcıdır — her doğrusal dönüşüm iki döndürme ve bir köşegen germe çarpımına ayrılır.</div>'

+ '<p class="l-text">Spektral teoremden (Ders 4) hatırlayın: $S$, gerçek simetrik $n\\times n$ matris ise $\\mathbb{R}^n$\\\'nin bir ortonormal bazı $v_1,\\dots,v_n$ ve gerçek sayılar $\\lambda_1,\\dots,\\lambda_n$ vardır öyle ki</p>'

+ '<div class="calc-formula"><div class="formula-label">SPEKTRAL TEOREM (HATIRLATMA)</div><div class="formula-main">$$S = Q \\Lambda Q^T, \\qquad Q^T Q = I, \\qquad \\Lambda = \\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n).$$</div><div class="formula-sub">Simetrik matrisler için özvektörler ortonormal seçilebilir ve özdeğerler gerçektir.</div></div>'

+ '<p class="l-text">Genel (muhtemelen kare olmayan, muhtemelen simetrik olmayan) bir matris $A\\in\\mathbb{R}^{m\\times n}$ için bu temiz formda özayrışım yoktur. Ancak <em>her zaman</em> iki simetrik matris mevcuttur:</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">$A^T A$</div><div class="card-body">$n\\times n$ simetrik pozitif yarı-tanımlı matris. Özdeğerleri negatif olmayan gerçek sayılardır: $\\lambda_i \\ge 0$.</div></div><div class="calc-card"><div class="card-title">$A A^T$</div><div class="card-body">$m\\times m$ simetrik pozitif yarı-tanımlı matris. Sıfırdan farklı özdeğerleri $A^T A$\\\'nınkilerle çakışır.</div></div><div class="calc-card"><div class="card-title">Tekil değer</div><div class="card-body">$\\sigma_i := \\sqrt{\\lambda_i(A^T A)} \\ge 0.$ Bunlar $A$\\\'nın doğal <em>pozitif</em> germe katsayılarıdır.</div></div></div>'

+ '<p class="l-text"><strong>$A^T A$ neden simetrik pozitif yarı-tanımlıdır.</strong> Her $x\\in\\mathbb{R}^n$ için</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x^T (A^T A) x = (Ax)^T (Ax) = \\|Ax\\|^2 \\ge 0,$$</div><div class="formula-sub">dolayısıyla $A^T A$\\\'nın tüm özdeğerleri negatif değildir. $\\|Ax\\|^2 = 0$ olması ancak ve ancak $x \\in \\ker A$ ise gerçekleşir.</div></div>'

+ '<div class="l-note"><strong>Ana fikir.</strong> Tekil değerler $A$\\\'nın birim vektörleri ne kadar gerdiğini ölçer. $\\|Av\\|^2 = v^T A^T A\\, v$ olduğundan, birim vektörler üzerinde maksimum germe $\\sqrt{\\lambda_{\\max}(A^T A)} = \\sigma_1$\\\'e eşittir — en büyük tekil değer. Buna spektral norm $\\|A\\|_2$ de denir.</div>'

+ '<div class="think-box"><div class="think-label">ALIŞTIRMA</div><div class="think-body">$A^T A$ ve $A A^T$ matrislerinin sıfırdan farklı aynı özdeğerlere sahip olduğunu gösterin. <em>İpucu: $A^T A v = \\lambda v$ ve $\\lambda \\ne 0$ ise, $w = Av$ alın ve $A A^T w$\\\'yi hesaplayın.</em></div></div>'

/* ============================================================
   BÖLÜM 2: SVD Teoremi
   ============================================================ */
+ '<h2 class="l-title">2. SVD Teoremi</h2>'

+ '<div class="calc-highlight"><strong>İfade.</strong> Her gerçek $m\\times n$ matris $A = U\\Sigma V^T$ olarak ayrılır; $U\\in\\mathbb{R}^{m\\times m}$ ve $V\\in\\mathbb{R}^{n\\times n}$ ortogonaldir ve $\\Sigma\\in\\mathbb{R}^{m\\times n}$ negatif olmayan girdileri $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$ olan köşegen bir matristir.</div>'

+ '<div class="calc-formula"><div class="formula-label">SVD — TAM BİÇİM</div><div class="formula-main">$$A = U\\,\\Sigma\\,V^T, \\qquad U^T U = I_m, \\qquad V^T V = I_n.$$</div><div class="formula-sub">$U$\\\'nun sütunları sol tekil vektörler; $V$\\\'nin sütunları sağ tekil vektörler; $\\sigma_i$ tekil değerlerdir.</div></div>'

+ '<p class="l-text"><strong>Varlık kanıtı (taslak).</strong> Simetrik PSD matrisi $A^T A$\\\'ya spektral teoremi uygulayın:</p>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$A^T A$\\\'nın spektral ayrışımı</div><div class="step-detail">$\\mathbb{R}^n$\\\'nin bir ortonormal bazı $v_1,\\dots,v_n$ ve gerçek sayılar $\\lambda_1 \\ge \\dots \\ge \\lambda_n \\ge 0$ vardır öyle ki $A^T A\\,v_i = \\lambda_i v_i$. Sıfır olmayan $\\lambda_i$ sayısı $r$ olsun (yani $r = \\operatorname{rank}(A)$).</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Tekil değerleri ve sol tekil vektörleri tanımla</div><div class="step-detail">$\\sigma_i = \\sqrt{\\lambda_i}$ alın ve $i \\le r$ için $u_i := \\dfrac{1}{\\sigma_i} A v_i \\in \\mathbb{R}^m$ tanımlayın.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\{u_i\\}$ ortonormaldir</div><div class="step-detail">$\\langle u_i, u_j\\rangle = \\dfrac{1}{\\sigma_i\\sigma_j}\\langle Av_i, Av_j\\rangle = \\dfrac{1}{\\sigma_i\\sigma_j} v_i^T A^T A v_j = \\dfrac{\\lambda_j}{\\sigma_i\\sigma_j}\\langle v_i,v_j\\rangle = \\delta_{ij}.$</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$\\{u_i\\}_{i\\le r}$\\\'yi $\\mathbb{R}^m$\\\'nin ortonormal bazına genişlet</div><div class="step-detail">Gram–Schmidt ile $u_{r+1},\\dots,u_m$\\\'yi $(\\operatorname{im} A)^\\perp = \\ker A^T$ içinden seçin. $U=[u_1|\\dots|u_m]$, $V=[v_1|\\dots|v_n]$ oluşturun.</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">$A = U\\Sigma V^T$ olduğunu doğrula</div><div class="step-detail">İnşa gereği $Av_i = \\sigma_i u_i$ ($i\\le r$) ve $Av_i = 0$ ($i>r$). Dolayısıyla $AV = U\\Sigma$ ve sağdan $V^T$ ile çarparsak $A = U\\Sigma V^T$ elde edilir. $\\blacksquare$</div></div></div></div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Teklik</div><div class="card-body">Tekil değerler $\\sigma_i$ <strong>tektir</strong>. Tekil vektörler işaret seçimine kadar (ve $\\sigma_i$\\\'nin katlılığı $>1$ ise özuzaylar içindeki döndürmelere kadar) tektir.</div></div><div class="calc-card"><div class="card-title">İnce (indirgenmiş) SVD</div><div class="card-body">Sadece $r=\\operatorname{rank}(A)$ tane sıfırdan farklı $\\sigma_i$\\\'yi tutun: $A = U_r \\Sigma_r V_r^T$ ile $U_r\\in\\mathbb{R}^{m\\times r}$, $\\Sigma_r\\in\\mathbb{R}^{r\\times r}$, $V_r\\in\\mathbb{R}^{n\\times r}$.</div></div><div class="calc-card"><div class="card-title">Dış çarpım biçimi</div><div class="card-body">$A = \\sum_{i=1}^{r} \\sigma_i\\, u_i v_i^T$ — tekil değerlerle ağırlıklandırılmış rank-1 matrislerin toplamı.</div></div><div class="calc-card"><div class="card-title">Dört temel altuzay</div><div class="card-body">$\\{v_1,\\dots,v_r\\}$ satır uzayının bazı; $\\{v_{r+1},\\dots,v_n\\}$ $\\ker A$\\\'nın bazı; $\\{u_1,\\dots,u_r\\}$ $\\operatorname{im} A$\\\'nın bazı; $\\{u_{r+1},\\dots,u_m\\}$ $\\ker A^T$\\\'nin bazı.</div></div></div>'

+ '<div class="l-note"><strong>Özayrışımla bağlantı.</strong> $A$ simetrik, özdeğerleri $\\lambda_i$ ve ortonormal özvektörleri varsa, SVD\\\'si $A = Q\\,|\\Lambda|\\,(\\operatorname{sgn}(\\Lambda)Q)^T$ olur, yani $\\sigma_i = |\\lambda_i|$. Genel bir $A$ için SVD işaret ve döndürme bilgisini ayrı ayrı temizce sıyırır.</div>'

/* ============================================================
   BÖLÜM 3: Geometrik Yorum
   ============================================================ */
+ '<h2 class="l-title">3. Geometrik Yorum: Döndürme – Germe – Döndürme</h2>'

+ '<div class="calc-highlight"><strong>Her doğrusal dönüşüm üç adımdır:</strong> girdiyi döndür ($V^T$), koordinat eksenleri boyunca ger ($\\Sigma$), sonucu döndür ($U$). SVD budur.</div>'

+ '<p class="l-text">$A = U\\Sigma V^T$\\\'yi sağdan sola okuyunca $x \\mapsto Ax$ dönüşümü şöyle ayrılır:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x \\;\\xrightarrow{V^T}\\; V^T x \\;\\xrightarrow{\\Sigma}\\; \\Sigma V^T x \\;\\xrightarrow{U}\\; U\\Sigma V^T x = Ax.$$</div></div>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$V^T$: girdi döndürmesi</div><div class="step-detail">$V^T$ ortogonal olduğundan $\\mathbb{R}^n$\\\'yi rijit biçimde döndürür (belki yansıtır). Baz vektörler $v_1,\\dots,v_n$ standart baza $e_1,\\dots,e_n$\\\'ye taşınır.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\Sigma$: eksenlere paralel germe</div><div class="step-detail">$\\Sigma$ köşegendir: $i$. koordinatı $\\sigma_i$ ile ölçekler. Her eksen boyunca uzunluklar ilgili tekil değerle çarpılır. Uzunlukları değiştiren tek adım budur.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$U$: çıktı döndürmesi</div><div class="step-detail">$U$ $\\mathbb{R}^m$\\\'yi ortogonal döndürür, $e_1,\\dots,e_r$\\\'yi $u_1,\\dots,u_r$\\\'ye gönderir. Gerilmiş eksenler sol tekil vektörlerin yönlerine yerleştirilir.</div></div></div></div>'

+ '<p class="l-text"><strong>Birim kürenin görüntüsü.</strong> $S^{n-1} = \\{x \\in \\mathbb{R}^n : \\|x\\|=1\\}$ olsun. O zaman $A(S^{n-1})$, $\\operatorname{im} A$ içindeki kapalı elipsoiddir; yarı-eksenleri $\\sigma_1 u_1, \\sigma_2 u_2, \\dots, \\sigma_r u_r$\\\'dir. SVD\\\'nin geometrik resmi budur.</p>'

/* --- Plotly: Geometric SVD — unit circle to ellipse (TR) --- */
+ '<div id="plot-svd-geometry-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var theta=[];for(var i=0;i<=120;i++)theta.push(2*Math.PI*i/120);'
+ 'var cx=theta.map(function(t){return Math.cos(t)});'
+ 'var cy=theta.map(function(t){return Math.sin(t)});'
+ 'var s1=3,s2=1.2,angle=Math.PI/6;'
+ 'var cosA=Math.cos(angle),sinA=Math.sin(angle);'
+ 'var ex=theta.map(function(t){var x=s1*Math.cos(t),y=s2*Math.sin(t);return cosA*x-sinA*y;});'
+ 'var ey=theta.map(function(t){var x=s1*Math.cos(t),y=s2*Math.sin(t);return sinA*x+cosA*y;});'
+ 'var t1={x:cx,y:cy,mode:"lines",name:"Birim kure S^{n-1}",line:{color:"#4ecdc4",width:2}};'
+ 'var t2={x:ex,y:ey,mode:"lines",name:"Goruntu A(S^{n-1}) (elips)",line:{color:"#c8a96e",width:3}};'
+ 'var t3={x:[0,cosA*s1],y:[0,sinA*s1],mode:"lines+markers",name:"sigma_1 u_1",line:{color:"#f87171",width:2,dash:"dash"},marker:{size:[4,8]}};'
+ 'var t4={x:[0,-sinA*s2],y:[0,cosA*s2],mode:"lines+markers",name:"sigma_2 u_2",line:{color:"#a78bfa",width:2,dash:"dash"},marker:{size:[4,8]}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4],title:"x",scaleanchor:"y"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-4,4],title:"y"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{orientation:"h",y:-0.18,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-svd-geometry-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Birim çember (turkuaz) elipse (altın) eşlenir. Yarı-eksenlerin uzunlukları $\\sigma_1$ ve $\\sigma_2$\\\'dir ve sol tekil vektörler $u_1, u_2$ yönündedir. SVD: girdiyi döndür ($V^T$), her eksen boyunca $\\sigma_i$ ile ger ($\\Sigma$), $u_i$ çatısına döndür ($U$).</div></div>'

+ '<div class="think-box"><div class="think-label">ALIŞTIRMA</div><div class="think-body">Tüm $\\sigma_i$ aynı $c>0$ değerine eşit ise $A$\\\'nın geometrik şekli nedir? <em>Cevap: $A = c\\,UV^T$ ve $UV^T$ ortogonaldir, yani $A$ döndürme ile bileşke biçiminde tekdüze $c$ ölçeklemesi gibi davranır. Birim küre yarıçapı $c$ olan bir küreye eşlenir.</em></div></div>'

/* ============================================================
   BÖLÜM 4: A^T A Üzerinden SVD Hesabı
   ============================================================ */
+ '<h2 class="l-title">4. $A^T A$ Üzerinden SVD Hesabı</h2>'

+ '<div class="calc-highlight">SVD\\\'nin kanıtı aynı zamanda bir reçetedir. $A^T A$\\\'yı köşegenleştirerek $V$\\\'yi ve $\\sigma_i^2$\\\'leri elde edin; $\\sigma_i > 0$ için $u_i = \\sigma_i^{-1} A v_i$ ile $u_i$\\\'leri kurtarın; $\\mathbb{R}^m$\\\'nin tam ortonormal bazına genişletin.</div>'

+ '<div class="calc-formula"><div class="formula-label">ÖZAYRIŞIM–SVD KÖPRÜSÜ</div><div class="formula-main">$$A^T A = V \\Sigma^T \\Sigma V^T, \\qquad A A^T = U \\Sigma \\Sigma^T U^T.$$</div><div class="formula-sub">$A^T A$\\\'nın özdeğerleri $\\sigma_i^2$\\\'dir; özvektörleri $V$\\\'nin sütunlarıdır. $AA^T$ ve $U$ için benzer.</div></div>'

+ '<p class="l-text"><strong>Algoritma (elle, küçük matrisler).</strong></p>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$A^T A$\\\'yı oluştur</div><div class="step-detail">$n\\times n$ simetrik PSD matristir.</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\det(A^T A - \\lambda I) = 0$\\\'ı çöz</div><div class="step-detail">Kökler $\\lambda_i \\ge 0$. Sırala $\\lambda_1 \\ge \\dots \\ge \\lambda_n$ ve $\\sigma_i = \\sqrt{\\lambda_i}$ al.</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Ortonormal özvektörleri $v_i$ bul</div><div class="step-detail">Her $\\lambda_i$ için $(A^T A - \\lambda_i I) v = 0$ çöz. Normalize et. Katlı özdeğer durumunda Gram–Schmidt ile ortogonalleştir.</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$\\sigma_i > 0$ için $u_i = \\sigma_i^{-1} A v_i$ hesapla</div><div class="step-detail">Bunlar otomatik olarak ortonormaldir (Bölüm 2\\\'de kanıtlandı). $\\sigma_i = 0$ ise $u_i$ serbesttir; $\\mathbb{R}^m$\\\'nin ortonormal bazını tamamlayacak şekilde seçin.</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Topla ve doğrula</div><div class="step-detail">$U=[u_1|\\dots|u_m]$, $V=[v_1|\\dots|v_n]$, $\\Sigma=\\operatorname{diag}(\\sigma_i)$ $m\\times n$ olacak şekilde sıfırla doldurulmuş. $A \\stackrel{?}{=} U\\Sigma V^T$ kontrol edin.</div></div></div></div>'

+ '<div class="l-note"><strong>Sayısal gerçeklik.</strong> $A^T A$\\\'yı açıkça oluşturmak sayısal olarak zayıf olabilir: koşul sayısı karelenir. Endüstriyel SVD algoritmaları (Golub–Reinsch, tek-yan Jacobi, rastgele SVD) bundan kaçınır. $A^T A$ yolu anlamak ve elle hesaplamak içindir.</div>'

/* ============================================================
   BÖLÜM 5: Çalışılmış Örnek — 3x2 Matris
   ============================================================ */
+ '<h2 class="l-title">5. Çalışılmış Örnek — $3\\times 2$ Matrisin SVD\\\'si</h2>'

+ '<div class="calc-example"><div class="example-label">PROBLEM</div><div class="example-body">$A = \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$ matrisinin SVD\\\'sini hesaplayın. $U\\in\\mathbb{R}^{3\\times 3}$, $\\Sigma\\in\\mathbb{R}^{3\\times 2}$, $V\\in\\mathbb{R}^{2\\times 2}$\\\'yi bulun ve $A = U\\Sigma V^T$ olduğunu doğrulayın.</div></div>'

+ '<div class="calc-steps"><div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">$A^T A$\\\'yı oluştur</div><div class="step-detail">$$A^T A = \\begin{bmatrix}1 & 0 & 1\\\\ 1 & 1 & 0\\end{bmatrix}\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\\\ 1 & 0 \\end{bmatrix} = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}.$$</div></div></div><div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$A^T A$\\\'nın özdeğerleri</div><div class="step-detail">$\\det\\!\\begin{bmatrix} 2-\\lambda & 1 \\\\ 1 & 2-\\lambda \\end{bmatrix} = (2-\\lambda)^2 - 1 = \\lambda^2 - 4\\lambda + 3 = (\\lambda-3)(\\lambda-1) = 0.$ Yani $\\lambda_1 = 3,\\ \\lambda_2 = 1$ ve $\\sigma_1 = \\sqrt{3},\\ \\sigma_2 = 1.$</div></div></div><div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sağ tekil vektörler $v_i$</div><div class="step-detail">$\\lambda=3$ için: $(A^T A - 3I)v = \\begin{bmatrix}-1 & 1\\\\ 1 & -1\\end{bmatrix}v = 0 \\Rightarrow v_1 = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ 1\\end{bmatrix}.$<br>$\\lambda=1$ için: $v_2 = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 \\\\ -1\\end{bmatrix}.$</div></div></div><div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Sol tekil vektörler $u_i = \\sigma_i^{-1} A v_i$</div><div class="step-detail">$u_1 = \\dfrac{1}{\\sqrt{3}}A v_1 = \\dfrac{1}{\\sqrt{6}}\\begin{bmatrix} 2 \\\\ 1 \\\\ 1\\end{bmatrix}, \\qquad u_2 = \\dfrac{1}{1}A v_2 = \\dfrac{1}{\\sqrt{2}}\\begin{bmatrix} 0 \\\\ -1 \\\\ 1\\end{bmatrix}.$<br>Doğrula: $\\|u_1\\| = \\sqrt{(4+1+1)/6} = 1,\\ \\|u_2\\| = 1,\\ \\langle u_1,u_2\\rangle = \\tfrac{1}{\\sqrt{12}}(0-1+1) = 0.$</div></div></div><div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">$u_3$\\\'e genişlet</div><div class="step-detail">$u_3$, $\\mathbb{R}^3$\\\'te $u_1, u_2$\\\'ye dik birim vektördür. Vektörel çarpımdan $u_3 = u_1 \\times u_2 = \\dfrac{1}{\\sqrt{3}}\\begin{bmatrix} 1 \\\\ -1 \\\\ -1\\end{bmatrix}$ (normalize edilmiş).</div></div></div><div class="calc-step"><div class="step-num">6</div><div class="step-content"><div class="step-title">Topla</div><div class="step-detail">$$U = \\begin{bmatrix} 2/\\sqrt{6} & 0 & 1/\\sqrt{3}\\\\ 1/\\sqrt{6} & -1/\\sqrt{2} & -1/\\sqrt{3}\\\\ 1/\\sqrt{6} & 1/\\sqrt{2} & -1/\\sqrt{3} \\end{bmatrix},\\quad \\Sigma = \\begin{bmatrix} \\sqrt{3} & 0\\\\ 0 & 1\\\\ 0 & 0\\end{bmatrix},\\quad V = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1\\\\ 1 & -1\\end{bmatrix}.$$</div></div></div><div class="calc-step"><div class="step-num">7</div><div class="step-content"><div class="step-title">$A = U\\Sigma V^T$\\\'yi doğrula</div><div class="step-detail">$\\Sigma V^T = \\begin{bmatrix} \\sqrt{3}/\\sqrt{2} & \\sqrt{3}/\\sqrt{2}\\\\ 1/\\sqrt{2} & -1/\\sqrt{2}\\\\ 0 & 0\\end{bmatrix}$\\\'yi hesaplayın. Sonra $U\\cdot (\\Sigma V^T)$ satır satır çarpımı $\\begin{bmatrix} 1 & 1\\\\ 0 & 1\\\\ 1 & 0\\end{bmatrix} = A$\\\'yı verir. $\\checkmark$</div></div></div></div>'

+ '<div class="l-note"><strong>Rank kontrolü.</strong> Her iki tekil değer de sıfırdan farklıdır, yani $\\operatorname{rank}(A) = 2$. $U$\\\'nun üçüncü sütunu $\\ker A^T$\\\'tedir ve ince SVD\\\'de görünmez.</div>'

/* ============================================================
   BÖLÜM 6: Tekil Değerler, Rank, Normlar, Koşul Sayısı
   ============================================================ */
+ '<h2 class="l-title">6. Tekil Değerler, Rank, Normlar, Koşul Sayısı</h2>'

+ '<div class="calc-highlight">Tekil değerler $A$\\\'nın hemen her niceliksel değişmezini kodlar: rank, Frobenius normu, spektral norm, koşul sayısı ve $A$ ile daha düşük ranklı matrisler arasındaki uzaklık.</div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Rank</div><div class="card-body">$\\operatorname{rank}(A) = \\#\\{i : \\sigma_i > 0\\}$. Sayısal olarak kararlı tanım budur (bir tolerans üstündeki $\\sigma_i$\\\'leri say).</div></div><div class="calc-card"><div class="card-title">Spektral norm</div><div class="card-body">$\\|A\\|_2 = \\sigma_1$ — en büyük tekil değer. Eşdeğer biçimde operatör normu $\\sup_{\\|x\\|=1}\\|Ax\\|$.</div></div><div class="calc-card"><div class="card-title">Frobenius normu</div><div class="card-body">$\\|A\\|_F = \\sqrt{\\sum_i \\sigma_i^2} = \\sqrt{\\operatorname{tr}(A^T A)}.$ Birim ortogonal değişimler altında değişmez.</div></div><div class="calc-card"><div class="card-title">Koşul sayısı</div><div class="card-body">$\\kappa_2(A) = \\sigma_1/\\sigma_r$ (tam ranklı $A$ için). $A^{-1}b$\\\'nin perturbasyona duyarlılığını ölçer.</div></div></div>'

+ '<p class="l-text"><strong>$\\|A\\|_F^2 = \\sum \\sigma_i^2$\\\'nin kanıtı.</strong> $\\|M\\|_F^2 = \\operatorname{tr}(M^T M)$ ve SVD kullanılarak,</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\|A\\|_F^2 = \\operatorname{tr}(V\\Sigma^T U^T U \\Sigma V^T) = \\operatorname{tr}(V \\Sigma^T \\Sigma V^T) = \\operatorname{tr}(\\Sigma^T \\Sigma) = \\sum_{i=1}^{\\min(m,n)} \\sigma_i^2.$$</div><div class="formula-sub">İz, ortogonal benzerlik altında değişmezdir ve karelenmiş tekil değerlerin toplamıdır.</div></div>'

+ '<p class="l-text"><strong>$\\sigma_1 = \\|A\\|_2$ neden geçerli.</strong> Birim $x$ için $x = \\sum c_i v_i$ yazın, $\\sum c_i^2 = 1$. O zaman $Ax = \\sum c_i \\sigma_i u_i$ ve $\\|Ax\\|^2 = \\sum c_i^2 \\sigma_i^2 \\le \\sigma_1^2$; eşitlik $x = v_1$\\\'de.</p>'

/* --- Plotly: singular value spectrum (TR) --- */
+ '<div id="plot-sv-spectrum-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sv=[10,6,3.5,2,1.2,0.8,0.5,0.3,0.15,0.08,0.04,0.02,0.01,0.005,0.002];'
+ 'var idx=sv.map(function(v,i){return i+1;});'
+ 'var sv2=sv.map(function(v){return v*v;});'
+ 'var total=sv2.reduce(function(a,b){return a+b;},0);'
+ 'var cum=[];var s=0;sv2.forEach(function(v){s+=v;cum.push(100*s/total);});'
+ 'var t1={x:idx,y:sv,type:"bar",name:"sigma_i",marker:{color:"#c8a96e"}};'
+ 'var t2={x:idx,y:cum,type:"scatter",mode:"lines+markers",name:"Birikimli enerji (%)",yaxis:"y2",line:{color:"#4ecdc4",width:2},marker:{size:6}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Indeks i",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"sigma_i",side:"left"},yaxis2:{title:"Birikimli enerji (%)",side:"right",overlaying:"y",range:[0,105],gridcolor:"rgba(255,255,255,0.03)"},margin:{t:30,r:60,b:60,l:60},showlegend:true,legend:{orientation:"h",y:-0.22,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-sv-spectrum-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Tekil değerler tipik olarak azalır (altın bar). $\\sigma_i^2$\\\'lerin birikimli toplamı (turkuaz) yalnızca birkaç terimle $\\|A\\|_F^2$\\\'nin çoğuna ulaşır — düşük rank yaklaşımının niceliksel dayanağı.</div></div>'

/* ============================================================
   BÖLÜM 7: Düşük Rank Yaklaşımı — Eckart–Young
   ============================================================ */
+ '<h2 class="l-title">7. Düşük Rank Yaklaşımı: Eckart–Young Teoremi</h2>'

+ '<div class="calc-highlight"><strong>İfade.</strong> Rankı $\\le k$ olan tüm $B$ matrisleri arasında, kesilmiş SVD $A_k = \\sum_{i=1}^{k} \\sigma_i u_i v_i^T$ hem $\\|A - B\\|_2$\\\'yi hem de $\\|A - B\\|_F$\\\'yi minimize eder.</div>'

+ '<div class="calc-formula"><div class="formula-label">ECKART–YOUNG (–MIRSKY)</div><div class="formula-main">$$\\min_{\\operatorname{rank}(B) \\le k} \\|A - B\\|_2 = \\sigma_{k+1}, \\qquad \\min_{\\operatorname{rank}(B) \\le k} \\|A - B\\|_F = \\sqrt{\\sum_{i=k+1}^{r} \\sigma_i^2}.$$</div><div class="formula-sub">Her iki minimum da kesilmiş SVD $A_k$ tarafından ulaşılır.</div></div>'

+ '<p class="l-text"><strong>Kanıt taslağı (Frobenius normu).</strong> Frobenius normunun birim ortogonal değişimler altında değişmez olduğunu kullanın: $\\|U^T M V\\|_F = \\|M\\|_F$ (ortogonal $U,V$). Dolayısıyla</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\|A - B\\|_F = \\|U^T(A-B)V\\|_F = \\|\\Sigma - \\tilde B\\|_F, \\qquad \\tilde B := U^T B V.$$</div></div>'

+ '<p class="l-text">$\\tilde B$\\\'nin rankı $\\le k$\\\'dir ve $\\Sigma$ köşegen $\\sigma_i$ girdileriyle. $\\|\\Sigma - \\tilde B\\|_F$\\\'yi rank-$k$ matrisler üzerinde minimize etmek, hangi $k$ köşegen girdiyi tam eşleştireceğimizi seçmekle aynıdır; geri kalanlar hataya $\\sigma_i^2$ katar. Minimum, en büyük $k$ değeri tutarak alınır ve hata $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$\\\'dir. $\\blacksquare$</p>'

+ '<p class="l-text"><strong>Kanıt taslağı (spektral norm).</strong> Rank $\\le k$ olan herhangi bir $B$ için $\\ker B$\\\'nin boyutu $\\ge n - k$\\\'dir. $\\operatorname{span}\\{v_1,\\dots,v_{k+1}\\}$ (boyut $k+1$) ile kesişimi alın: boyut argümanıyla kesişim bir birim vektör $x$ içerir. O zaman $Bx = 0$ ve $Ax = \\sum_{i=1}^{k+1} \\langle x,v_i\\rangle \\sigma_i u_i$\\\'nin normu $\\|Ax\\| \\ge \\sigma_{k+1}\\|x\\| = \\sigma_{k+1}$\\\'dir. Dolayısıyla $\\|A - B\\|_2 \\ge \\sigma_{k+1}$, ki $B = A_k$ ile gerçekleşir. $\\blacksquare$</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Kesim hatası</div><div class="card-body">$\\|A - A_k\\|_F^2 = \\sigma_{k+1}^2 + \\dots + \\sigma_r^2.$ İhmal edilen enerji tam olarak kuyruk tekil değerlerin karelerinin toplamıdır.</div></div><div class="calc-card"><div class="card-title">Enerji yakalama</div><div class="card-body">$\\dfrac{\\|A_k\\|_F^2}{\\|A\\|_F^2} = \\dfrac{\\sum_{i=1}^k \\sigma_i^2}{\\sum_{i=1}^r \\sigma_i^2}$ — rank-$k$ yaklaşımının koruduğu $\\|A\\|_F^2$ oranı.</div></div><div class="calc-card"><div class="card-title">Optimallik tamdır</div><div class="card-body">Hiçbir rank-$k$ matris ne Frobenius ne spektral normda daha iyi olamaz. SVD <em>bir</em> düşük rank yaklaşımı değil, <em>en iyi</em> düşük rank yaklaşımıdır.</div></div><div class="calc-card"><div class="card-title">Kısa uygulama notu</div><div class="card-body">Bu teorem boyut indirgemenin (ör. merkezlenmiş veri matrisinin kesilmiş SVD\\\'si olarak okunan temel bileşen analizi) matematiksel temelidir. Bu derste PCA, Eckart–Young\\\'ın yeniden okunmasından ibarettir.</div></div></div>'

/* --- Plotly: reconstruction error vs rank (TR) --- */
+ '<div id="plot-recon-error-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var sv=[10,6,3.5,2,1.2,0.8,0.5,0.3,0.15,0.08,0.04,0.02,0.01,0.005,0.002];'
+ 'var sv2=sv.map(function(v){return v*v;});'
+ 'var err=[];for(var k=1;k<=sv.length;k++){var rem=0;for(var j=k;j<sv.length;j++)rem+=sv2[j];err.push(Math.sqrt(rem));}'
+ 'var idx=sv.map(function(v,i){return i+1;});'
+ 'var t1={x:idx,y:err,mode:"lines+markers",name:"||A - A_k||_F",line:{color:"#f87171",width:2},marker:{size:6}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Rank k",dtick:1},yaxis:{gridcolor:"rgba(255,255,255,0.06)",title:"Frobenius hata"},margin:{t:30,r:30,b:60,l:60},showlegend:true,legend:{orientation:"h",y:-0.22,font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-recon-error-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},150)</script>'

+ '<div class="calc-graph"><div class="graph-caption">Eckart–Young iş başında: $\\|A - A_k\\|_F$ $k$\\\'ye göre monoton azalır ve formülü $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$\\\'dir. Grafik her rankta en küçük ulaşılabilir Frobenius hatasını gösterir.</div></div>'

/* ============================================================
   BÖLÜM 8: Polar Ayrışım
   ============================================================ */
+ '<h2 class="l-title">8. Polar Ayrışım</h2>'

+ '<div class="calc-highlight">Her kare matris <em>ortogonal</em> $\\times$ <em>simetrik PSD</em> olarak ayrılır. Bu, bir karmaşık sayıyı $r e^{i\\theta}$ olarak yazmanın matris karşılığıdır ve doğrudan SVD\\\'den gelir.</div>'

+ '<div class="calc-formula"><div class="formula-label">POLAR AYRIŞIM</div><div class="formula-main">$$A = Q P, \\qquad Q \\text{ ortogonal}, \\quad P = (A^T A)^{1/2} \\text{ simetrik PSD}.$$</div><div class="formula-sub">Tersinir kare $A$ için $Q$ ve $P$ tektir.</div></div>'

+ '<p class="l-text"><strong>SVD\\\'den türetim.</strong> $A = U\\Sigma V^T$ ile $A\\in\\mathbb{R}^{n\\times n}$ olsun. Tanımlayın</p>'

+ '<div class="calc-formula"><div class="formula-main">$$Q := U V^T, \\qquad P := V \\Sigma V^T.$$</div></div>'

+ '<p class="l-text">O zaman $Q$ ortogonal matrislerin çarpımı olduğundan ortogonaldir. $P = V\\Sigma V^T$ simetriktir ve özdeğerleri $\\sigma_i \\ge 0$ olduğundan simetrik PSD\\\'dir. Sonuçta</p>'

+ '<div class="calc-formula"><div class="formula-main">$$Q P = U V^T \\cdot V \\Sigma V^T = U \\Sigma V^T = A.$$</div></div>'

+ '<p class="l-text">Çarpan $P$, $P^2 = V\\Sigma^2 V^T = A^T A$ sağlar, yani $P = (A^T A)^{1/2}$ — tek PSD karekök.</p>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Sol polar biçim</div><div class="card-body">Eşdeğer biçimde $A = P\\,'\\, Q$ ile $P' = U\\Sigma U^T = (A A^T)^{1/2}$. Ortogonal çarpan aynıdır.</div></div><div class="calc-card"><div class="card-title">Geometrik anlam</div><div class="card-body">$A$ önce $V$\\\'nin temel eksenleri boyunca $P$ ile gerer, sonra $Q$ ile döndürür. Simetrik PSD "sadece germe"; ortogonal "sadece döndürme"dir.</div></div><div class="calc-card"><div class="card-title">En yakın ortogonal matris</div><div class="card-body">Tersinir $A$ için $Q = UV^T$, Frobenius normunda $A$\\\'ya en yakın ortogonal matristir — sürekli mekanikte, bilgisayar grafiğinde ve Procrustes hizalamada kullanılır.</div></div></div>'

/* ============================================================
   BÖLÜM 9: Sözde Ters ve En Küçük Kareler
   ============================================================ */
+ '<h2 class="l-title">9. Moore–Penrose Sözde Tersi ve En Küçük Kareler</h2>'

+ '<div class="calc-highlight">Sözde ters $A^+$, matris tersini kare olmayan ve rank-eksik matrislere genişletir. SVD ile tanımlanır ve en küçük kareler / minimum-norm problemini temizce çözer.</div>'

+ '<div class="calc-formula"><div class="formula-label">SVD ÜZERİNDEN SÖZDE TERS</div><div class="formula-main">$$A = U\\Sigma V^T \\quad\\Longrightarrow\\quad A^+ = V\\,\\Sigma^+\\,U^T,$$</div><div class="formula-sub">burada $\\Sigma^+$, $\\Sigma^T$\\\'den her sıfırdan farklı $\\sigma_i$\\\'yi $1/\\sigma_i$ ile değiştirerek elde edilen $n\\times m$ matristir.</div></div>'

+ '<p class="l-text"><strong>Moore–Penrose koşulları.</strong> $A^+$, aşağıdaki dört koşulu sağlayan tek matristir:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$A A^+ A = A, \\quad A^+ A A^+ = A^+, \\quad (A A^+)^T = A A^+, \\quad (A^+ A)^T = A^+ A.$$</div></div>'

+ '<div class="calc-cards"><div class="calc-card"><div class="card-title">Kare tersinir</div><div class="card-body">$A$ tersinirse $A^+ = A^{-1}$.</div></div><div class="calc-card"><div class="card-title">Uzun tam ranklı ($m>n$, rank $n$)</div><div class="card-body">$A^+ = (A^T A)^{-1} A^T$. Klasik en küçük kareler normal denklem çözücüsü.</div></div><div class="calc-card"><div class="card-title">Geniş tam ranklı ($m<n$, rank $m$)</div><div class="card-body">$A^+ = A^T (A A^T)^{-1}$. Minimum-norm çözüm verir.</div></div><div class="calc-card"><div class="card-title">Rank eksik</div><div class="card-body">SVD tanımı yine çalışır; yalnızca sıfırdan farklı $\\sigma_i$ ters çevrilir. Diğer formüller başarısız olabilir.</div></div></div>'

+ '<p class="l-text"><strong>En küçük kareler teoremi.</strong> Her $A\\in\\mathbb{R}^{m\\times n}$ ve $b\\in\\mathbb{R}^m$ için</p>'

+ '<div class="calc-formula"><div class="formula-main">$$x^* := A^+ b$$</div></div>'

+ '<p class="l-text">$\\|Ax - b\\|^2$\\\'nin (tek) en küçük norma sahip minimize edicisidir.</p>'

+ '<p class="l-text"><em>Kanıt taslağı.</em> $b = U c$ yazın. $\\|Ax-b\\|^2 = \\|\\Sigma V^T x - c\\|^2 = \\|\\Sigma y - c\\|^2$ ile $y = V^T x$. Bileşen bazında $\\sum (\\sigma_i y_i - c_i)^2 + \\sum_{i>r} c_i^2$. Minimum için $i\\le r$ ise $y_i = c_i/\\sigma_i$; $i>r$ için $y_i$ serbesttir ama minimum-norm seçim $y_i = 0$. O zaman $x^* = V y = V\\Sigma^+ U^T b = A^+ b$. $\\blacksquare$</p>'

+ '<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK</div><div class="example-body">$A = \\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\\\ 0 & 0\\end{bmatrix},\\ b = \\begin{bmatrix} 2 \\\\ 3 \\\\ 1\\end{bmatrix}$ alın. Burada $\\sigma_1 = 1,\\ \\sigma_2 = 0$, dolayısıyla $\\Sigma^+ = \\begin{bmatrix} 1 & 0 & 0\\\\ 0 & 0 & 0\\end{bmatrix}$. $U=V=I$ (sıraya göre) ile $A^+ = \\Sigma^+$ ve $x^* = A^+ b = \\begin{bmatrix} 2 \\\\ 0\\end{bmatrix}$. Kontrol: $\\|Ax^* - b\\|^2 = \\|(2,0,0)-(2,3,1)\\|^2 = 10$; $\\sigma_2$ ve sonrasına karşılık gelen kalıntı $\\sum_{i>1} c_i^2 = 9 + 1 = 10$.</div></div>'

+ '<div class="l-note"><strong>İleri kullanım çerçevesi.</strong> Aynı cebir merkezlenmiş bir veri matrisine uygulandığında temel bileşen analizi elde edilir. Kovaryans matrisi $\\Sigma = (n-1)^{-1} X^T X$\\\'e uygulandığında, $X$\\\'in sağ tekil vektörleri $\\Sigma$\\\'nın özvektörleriyle çakışır — bunlar temel eksenlerdir. Buradaki matematik tam olarak Bölüm 2 ve 7\\\'nin belirli bir girdiye uygulanmasıdır.</div>'

/* ============================================================
   BÖLÜM 10: Klasik Alıştırmalar
   ============================================================ */
+ '<h2 class="l-title">10. Klasik Alıştırmalar</h2>'

+ '<div class="calc-highlight">Küçük ama temsili bir kâğıt-kalem problem kümesi. Her birini bir hesap olarak ele alın, kodlama görevi olarak değil. Her problemin sonunda $A = U\\Sigma V^T$\\\'yi açıkça doğrulayın.</div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — Elle $2\\times 2$ SVD</div><div class="example-body">$A = \\begin{bmatrix} 3 & 0 \\\\ 4 & 5\\end{bmatrix}$\\\'in SVD\\\'sini hesaplayın. $\\sigma_1, \\sigma_2$\\\'yi, sağ tekil vektörleri $v_1, v_2$\\\'yi ve sol tekil vektörleri $u_1, u_2$\\\'yi bulun. $A = U\\Sigma V^T$\\\'yi doğrulayın.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — Dikdörtgen SVD</div><div class="example-body">$A = \\begin{bmatrix} 1 & 2\\\\ 2 & 4\\\\ 3 & 6\\end{bmatrix}$\\\'in hem tam hem ince SVD\\\'sini hesaplayın. $\\operatorname{rank}(A)=1$ olduğunu not edin. $A$\\\'yı tek bir rank-1 dış çarpım $\\sigma_1 u_1 v_1^T$ olarak yazın.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — En iyi rank-1 yaklaşımı</div><div class="example-body">$A = \\begin{bmatrix} 4 & 0\\\\ 3 & -5\\end{bmatrix}$ olsun. SVD\\\'sini hesaplayın ve en iyi rank-1 yaklaşımı $A_1$\\\'i yazın. $\\|A - A_1\\|_F$ nedir? $\\|A - A_1\\|_2$ nedir?</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — Sözde ters</div><div class="example-body">Bölüm 5\\\'teki $A = \\begin{bmatrix} 1 & 1\\\\ 0 & 1\\\\ 1 & 0\\end{bmatrix}$ için $A^+$\\\'yı hesaplayın. Sonra $b = (1,1,1)^T$ için $\\min_x \\|Ax - b\\|^2$ en küçük kareler problemini çözün ve $x^* = A^+ b$ olduğunu gösterin.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — Tekil değerlerden matris normları</div><div class="example-body">$A$\\\'nın tekil değerleri $\\sigma_1, \\dots, \\sigma_r$ olsun. $\\|A\\|_2$, $\\|A\\|_F$, $\\|A\\|_*$ (çekirdek norm $\\sum \\sigma_i$) ve (eğer kareyse) $\\det(A)$\\\'yi $\\sigma_i$ cinsinden ifade edin. Bunlardan hangileri birim ortogonal değişimlere göre değişmezdir?</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 — Koşul sayısı</div><div class="example-body">Tersinir $A$ için $\\kappa_2(A) = \\sigma_1/\\sigma_n$ olduğunu ve $Ax = b$ çözümünün göreli hatasının $\\dfrac{\\|\\delta x\\|}{\\|x\\|} \\le \\kappa_2(A)\\,\\dfrac{\\|\\delta b\\|}{\\|b\\|}$ sağladığını kanıtlayın. $\\kappa_2 = 10^4$ olan bir matris bulun ve kontrol edin.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 — Eckart–Young doğrulaması</div><div class="example-body">İstediğiniz $3\\times 3$ ortogonal çerçevede $\\Sigma = \\operatorname{diag}(5, 3, 1)$ ile $A = U\\Sigma V^T$ alın. Rank-2 yaklaşım $A_2$\\\'yi oluşturun ve $\\|A - A_2\\|_F = 1$, $\\|A - A_2\\|_2 = 1$ olduğunu doğrudan doğrulayın.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 — Polar ayrışım</div><div class="example-body">$A = \\begin{bmatrix} 2 & -1\\\\ 1 & 2\\end{bmatrix}$ için polar ayrışım $A = QP$\\\'yi hesaplayın. $Q^T Q = I$ ve $P$\\\'nin simetrik PSD olduğunu doğrulayın. $Q$\\\'nun döndürme açısını ve $P$\\\'deki temel germeleri belirleyin.</div></div>'

+ '<div class="l-warn"><strong>Sonraki ders.</strong> Ders 6, yapılı ayrışımlar ve karesel formlarla devam eder — Cholesky ayrışımı, simetrik matrislerin özdeğerleri üzerinden kesinlik kavramı ve $x^T A x$ seviye kümelerinin geometrisi.</div>';