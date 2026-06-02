/* nlp-L14.js — NLP Course Lesson 14: Akıl Yürüten Modeller — o1, DeepSeek-R1, RLVR, GRPO (TR + EN) */
var NLP_L14 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> 2024-2025\'in NLP\'de yarattığı en büyük kırılma <strong>akıl yürüten modeller</strong> (reasoning models). OpenAI <strong>o1</strong> (Eylül 2024) ve ardından <strong>DeepSeek-R1</strong> (Ocak 2025) tek bir cevap üretmek yerine, görünmeyen bir düşünce zinciri (hidden chain-of-thought) üzerinden test-zamanı hesabı (test-time compute) harcıyor. Bu ders: ölçek yerine <em>düşünme süresi</em>, <strong>RLVR</strong> ile doğrulanabilir ödüllerden öğrenme, <strong>GRPO</strong> ile critic\'siz politika optimizasyonu, süreç vs. sonuç denetimi (PRM\'ler) ve 2026 ajan-akıl yürütme yakınsaması.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Test-zamanı hesabı (test-time compute) ölçeklemesinin niçin yeni eğitim ölçeklemesi olduğunu</li>'
+ '<li>o1 ve DeepSeek-R1\'in mimari ve eğitim hattındaki farkları</li>'
+ '<li>RLVR (Reinforcement Learning with Verifiable Rewards) ile ödül modelini nasıl atlayacağını</li>'
+ '<li>GRPO\'nun PPO\'ya karşı niye daha ucuz ve akıl yürütme için neden daha iyi olduğunu</li>'
+ '<li>Süreç ödül modeli (PRM) ile sonuç denetiminin farkını ve PRM800k\'nın rolünü</li>'
+ '<li>2026 frontier\'inde akıl yürütme + ajan + araç kullanımı yakınsamasını</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Akıl Yürüten Model Nedir?</h2>'

+ '<p class="l-text"><a href="/tutorials/ai/nlp/generative-llms">Ders 11</a>\'de gördüğümüz klasik LLM\'ler tek bir <em>otoregresif</em> akış üretir: token token cevap yazar, üretmediği bir şeyi düşünemez. Aritmetik veya çok adımlı mantık gerektiren bir soruda, kâğıt kalem kullanmadan zihinden cevap vermeye çalışan bir öğrenci gibidir.</p>'

+ '<p class="l-text"><strong>Akıl yürüten model (reasoning model)</strong> bu paradigmayı kırar. Cevabı vermeden önce gizli bir düşünce zinciri (chain-of-thought, CoT) üzerinde uzun süre çalışır: hipotez kurar, doğrular, gerekirse geri döner, alternatifler dener. Sonra son cevabı kısa ve net olarak verir.</p>'

+ '<div class="calc-example"><div class="example-label">KLASİK LLM VS. AKIL YÜRÜTEN MODEL</div><div class="example-body">'
+ '<p class="l-text"><strong>Soru:</strong> 17 × 24 kaçtır?</p>'
+ '<p class="l-text"><strong>Klasik GPT-4 (zero-shot):</strong> "408" — anında verir, %85 doğruluk.</p>'
+ '<p class="l-text"><strong>o1 / R1:</strong> &lt;think&gt; "17 × 24 = 17 × (20+4) = 340 + 68 = 408. Kontrol: 17×2=34, sonra ×12=204×2=408. ✓" &lt;/think&gt; &lt;answer&gt; 408 &lt;/answer&gt; — %99 doğruluk, ama 50x daha çok token.</p>'
+ '</div></div>'

+ '<p class="l-text">Bu yeni paradigma <strong>Eylül 2024\'te OpenAI o1</strong>\'in çıkışıyla başladı. Ocak 2025\'te DeepSeek-R1, MIT lisanslı açık ağırlıklarla aynı yeteneği sundu ve alanı sarstı. 2026 itibarıyla Claude (extended thinking), Gemini 2.5 (Deep Think), Qwen2.5-Max-Thinking ve OpenAI o3-mini hepsi bu kategoride.</p>'

+ '<h2 class="l-title">2. Test-Zamanı Ölçekleme (Test-Time Scaling)</h2>'

+ '<p class="l-text"><a href="/tutorials/ai/nlp/generative-llms">Ders 11</a>\'de Chinchilla ölçek yasasını gördük: <em>daha çok parametre + daha çok veri = daha iyi model</em>. Bu yasa <strong>eğitim zamanı</strong> ölçeklemesidir.</p>'

+ '<p class="l-text">2024\'te OpenAI yeni bir eksen buldu: <strong>test-zamanı (inference-zamanı) hesabı</strong>. Modeli daha fazla eğitmek yerine, sorgu zamanında daha fazla token üretmesine izin ver. Yani modele "daha uzun düşün" de.</p>'

+ '<div class="katex-block">$$\\text{Doğruluk} \\propto \\log(\\text{düşünme tokenleri})$$</div>'

+ '<p class="l-text">Bu ilişki AIME (matematik olimpiyatları), GSM8K, MATH ve Codeforces benchmark\'larında gözlemleniyor. Daha çarpıcı olarak, <em>aynı temel modelle</em> sadece düşünme bütçesini büyütmek, eğitim hesabını 10x artırmaktan çoğu zaman daha ucuza performans kazandırıyor.</p>'

+ '<div class="plotly-graph"><div id="plot-nlp14-scaling-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var x=[64,256,1024,4096,16384,65536];'
+ 'var gpt4=[51,52,53,54,55,55];'
+ 'var o1=[55,68,79,86,91,94];'
+ 'var r1=[54,66,77,84,89,92];'
+ 'var t1={x:x,y:gpt4,type:"scatter",mode:"lines+markers",name:"GPT-4 (klasik)",line:{color:"#888",width:2,dash:"dash"}};'
+ 'var t2={x:x,y:o1,type:"scatter",mode:"lines+markers",name:"o1-preview",line:{color:T.accent,width:3}};'
+ 'var t3={x:x,y:r1,type:"scatter",mode:"lines+markers",name:"DeepSeek-R1",line:{color:"#c8a96e",width:3}};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid,title:"Düşünme tokenleri (log eksen)",type:"log"},yaxis:{color:T.text,gridcolor:T.grid,title:"Doğruluk (%)",range:[40,100]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text}}};'
+ 'if(document.getElementById("plot-nlp14-scaling-tr"))Plotly.newPlot("plot-nlp14-scaling-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> AIME 2024 (lise matematik olimpiyatı) testinde, düşünme bütçesi 10x arttığında akıl yürüten modellerin doğruluğu log-doğrusal artıyor. Klasik GPT-4 daha çok token verseniz de %55 civarında takılı kalıyor: <em>düşünmüyor, sadece daha çok yazıyor</em>. o1 ve R1 ise her büyüklük adımında belirgin kazanç sağlıyor. Bu eğri "test-zamanı ölçek yasasının" sözel kanıtıdır.</div>'

+ '<h3 class="l-subtitle">Bütçeli akıl yürütme</h3>'

+ '<p class="l-text">Pratik uygulamada modeli sınırsız konuşturmak istemezsin — maliyet patlar. API\'ler bütçe parametresi sunar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>OpenAI o1/o3:</strong> <code>reasoning_effort</code> = "low" | "medium" | "high".</li>'
+ '<li><strong>Anthropic Claude (extended thinking):</strong> <code>thinking.budget_tokens</code> ile hassas kontrol.</li>'
+ '<li><strong>DeepSeek-R1:</strong> tamamen açık — <code>max_tokens</code> ile sınırlandırırsın.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. o1 / o3 Ailesi — OpenAI\'nın Akıl Yürüten Modelleri</h2>'

+ '<p class="l-text">OpenAI\'nın o1 serisi (preview Eylül 2024, tam o1 Aralık 2024, o3 Aralık 2024 duyuru, o3-mini Ocak 2026\'da yaygınlaştı) bu yeni nesil modellerin amiral gemisidir.</p>'

+ '<h3 class="l-subtitle">Belirgin özellikler</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Gizli düşünme:</strong> Düşünce zinciri kullanıcıya gösterilmez. API yalnızca özet (reasoning summary) döner. Sebep: model güvenliği ve rakiplerin distillation\'ı zorlaştırması.</li>'
+ '<li><strong>Matematik ve kod ustası:</strong> AIME\'de %83 (GPT-4o %13), Codeforces\'ta %89 percentile, GPQA Diamond\'da insan PhD seviyesi.</li>'
+ '<li><strong>Pahalı:</strong> o1-preview çıktı tokeni $60/1M, görünmeyen düşünme tokenleri de faturalandırılır. Tipik bir AIME sorusu $1-3 maliyet doğurur.</li>'
+ '<li><strong>Sistem mesajı yok:</strong> Klasik chat API\'sinden farklı — <code>developer</code> rolüyle değişti, sistem promptu daha kısıtlı.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># OpenAI o3-mini ile akıl yürüten çağrı (2026 SDK)</span>\n<span class="kw">from</span> openai <span class="kw">import</span> OpenAI\n\nclient = OpenAI()\n\nresp = client.chat.completions.create(\n    model=<span class="str">"o3-mini"</span>,\n    reasoning_effort=<span class="str">"high"</span>,  <span class="cm"># low | medium | high</span>\n    messages=[\n        {<span class="str">"role"</span>: <span class="str">"user"</span>,\n         <span class="str">"content"</span>: <span class="str">"Bir dikdörtgenin alanı 24, çevresi 20. Kenarları nedir?"</span>}\n    ],\n)\n\n<span class="cm"># Cevap ve düşünme özeti</span>\n<span class="fn">print</span>(resp.choices[<span class="num">0</span>].message.content)\n<span class="fn">print</span>(<span class="str">"Düşünme tokenleri:"</span>, resp.usage.completion_tokens_details.reasoning_tokens)</code></pre></div>'

+ '<p class="l-text">Reasoning effort yükseldikçe ücret ve gecikme katlanır. Üretim sistemlerinde tipik strateji: ilk önce ucuz bir model (GPT-4o) dene; başarısızsa o3-mini\'ye, hâlâ başarısızsa o3\'e yükselt.</p>'

+ '<h2 class="l-title">4. DeepSeek-R1 — Açık Ağırlıklı Devrim</h2>'

+ '<p class="l-text">20 Ocak 2025: Çinli laboratuvar DeepSeek, <strong>DeepSeek-R1</strong>\'i MIT lisansıyla yayınladı. 671B parametreli (37B aktif MoE) bir model, akıl yürütme benchmark\'larında o1-preview ile başa baş — toplam eğitim maliyeti yaklaşık <strong>$5.6M</strong>.</p>'

+ '<p class="l-text">Bu rakam (OpenAI\'nın milyarlarca dolarına karşılık) AI dünyasında deprem etkisi yarattı: Nvidia hissesi 24 Ocak\'ta %17 düştü, $600B piyasa değeri buharlaştı. Çünkü gösterdiği şey: <em>frontier-seviyesinde akıl yürütme, açık kaynak ve görece ucuz eğitimle elde edilebilir</em>.</p>'

+ '<h3 class="l-subtitle">R1-Zero — SFT olmadan tamamen RL</h3>'

+ '<p class="l-text">DeepSeek iki model çıkardı:</p>'

+ '<ul class="l-list">'
+ '<li><strong>R1-Zero:</strong> DeepSeek-V3-Base modelinden <em>doğrudan</em> RL\'e geçti — hiç SFT yok. Sadece doğru/yanlış ödülüyle. Akıl yürüten davranışlar (geri dönüp kontrol, alternatif strateji, "aha anı") <em>kendiliğinden</em> ortaya çıktı.</li>'
+ '<li><strong>R1:</strong> R1-Zero\'nun bazı eksiklerini kapatmak için: önce küçük "cold-start" SFT verisi, sonra RL, sonra rejection sampling ile SFT, sonra son RL. Daha okunabilir, daha az dil karıştırması.</li>'
+ '</ul>'

+ '<p class="l-text">R1-Zero\'nun "kendiliğinden ortaya çıkma" hikayesi RL camiasını şaşırttı. Modelin eğitim sırasında bir noktada düşünce uzunluğu sıçradı, geriye dönüp hatasını fark etti, "Aha, durun..." diye yazdı. Hiç kimse bunu öğretmemişti.</p>'

+ '<div class="l-note"><strong>Eğitim maliyeti perspektifi:</strong> $5.6M rakamı sadece son eğitim koşusunu kapsar — araştırma, başarısız denemeler, altyapı dahil değildir. Yine de Llama 3 (Meta\'nın açıkladığı 39M GPU saati ~$50M+) ile karşılaştırıldığında çarpıcı. Daha önemli nokta: ağırlıklar herkese açık, akademik gruplar evlerinde fine-tune edebiliyor.</div>'

+ '<h2 class="l-title">5. RLVR — Doğrulanabilir Ödüllerle RL</h2>'

+ '<p class="l-text"><a href="/tutorials/ai/nlp/generative-llms">Ders 11</a>\'de gördüğümüz <strong>RLHF</strong> şöyle çalışıyordu:</p>'

+ '<ol class="l-list">'
+ '<li>İnsanlardan tercih çiftleri topla (A mı, B mi daha iyi?).</li>'
+ '<li>Bu tercihlerden bir <em>ödül modeli</em> (reward model, RM) eğit — başka bir Transformer.</li>'
+ '<li>Ana modeli RM\'ye karşı PPO ile optimize et.</li>'
+ '</ol>'

+ '<p class="l-text">Sorun: RM kendisi de bir LLM. Hatalı, sömürülebilir (reward hacking), eğitilmesi pahalı. Akıl yürütme görevleri için ise <em>tamamen gereksiz</em>: matematik sorusunun cevabı doğru ya da yanlıştır, kod testten geçer ya da geçmez. Buna karar vermek için ayrı bir model neden eğitelim?</p>'

+ '<p class="l-text"><strong>RLVR (Reinforcement Learning with Verifiable Rewards)</strong> bu görüşü kurumsallaştırır. Ödül fonksiyonu doğrudan bir doğrulayıcıdan gelir:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Matematik:</strong> SymPy ile cevap normalleştir, ground-truth ile karşılaştır → 1 ya da 0.</li>'
+ '<li><strong>Kod:</strong> Üretilen kodu sandbox\'ta çalıştır, unit testleri koştur → geçenler oranı.</li>'
+ '<li><strong>Biçimsel mantık / SAT / SQL:</strong> Tipi kontrol et, sorgu tablo çıktısıyla karşılaştır.</li>'
+ '<li><strong>Biçim cezaları:</strong> <code>&lt;think&gt;...&lt;/think&gt;&lt;answer&gt;...&lt;/answer&gt;</code> formatına uymazsa -0.1 ek ceza.</li>'
+ '</ul>'

+ '<div class="katex-block">$$r(x, y) = \\mathbb{1}[\\text{verify}(x, y) = \\text{correct}] + \\lambda \\cdot \\mathbb{1}[\\text{format ok}]$$</div>'

+ '<p class="l-text">Buradaki kritik içgörü: RLVR\'da reward hacking neredeyse imkansızdır. Bir matematik probleminin cevabını <em>sahte</em> doğru hâle getiremezsin — doğrulayıcı SymPy. Bu, RL eğitiminin çok daha stabil olmasını sağlar.</p>'

+ '<h3 class="l-subtitle">RLVR\'ın sınırı</h3>'

+ '<p class="l-text">Doğrulayıcı yazılamayan görevler için (yaratıcı yazım, sohbet kalitesi, tıbbi öğüt) RLVR çalışmaz — orada hâlâ insan tercihi (RLHF/DPO) gerekir. Yaklaşık bir kural: <em>cevabın doğruluğu mekanik olarak kontrol edilebiliyorsa RLVR; öznel ise RLHF</em>.</p>'

+ '<h2 class="l-title">6. GRPO — Critic\'siz Politika Optimizasyonu</h2>'

+ '<p class="l-text">PPO (Proximal Policy Optimization) RLHF\'in standart algoritmasıydı ama büyük dezavantajlarla geliyordu: ana modelle aynı boyutta bir <strong>değer ağı (critic, value network)</strong> eğitmen gerekir. Bu hesabı 2x\'e çıkarır.</p>'

+ '<p class="l-text">DeepSeek\'in geliştirdiği <strong>GRPO (Group Relative Policy Optimization)</strong> bu critic\'i atar. Fikir hayret verecek kadar basit:</p>'

+ '<ol class="l-list">'
+ '<li>Bir <em>x</em> sorusu için ana politikadan <strong>G adet farklı cevap</strong> üret (genelde G=8 veya 16).</li>'
+ '<li>Her birine RLVR ödülü ata: <em>r₁, r₂, ..., r_G</em>.</li>'
+ '<li>Grubun ortalamasını ve standart sapmasını hesapla. <strong>Avantaj</strong>: <em>A_i = (r_i - mean) / std</em>.</li>'
+ '<li>Bu avantajı PPO benzeri klipli politika kaybı ile geri yay. Critic yok.</li>'
+ '</ol>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{GRPO}} = -\\mathbb{E}_{i \\sim G} \\Bigl[ \\min\\bigl( \\rho_i A_i,\\ \\text{clip}(\\rho_i, 1-\\epsilon, 1+\\epsilon) A_i \\bigr) \\Bigr] + \\beta \\cdot \\text{KL}(\\pi \\Vert \\pi_{\\text{ref}})$$</div>'

+ '<p class="l-text">Burada <em>ρ_i</em> önemlilik oranı (importance ratio), <em>β KL</em> referans modelden çok uzaklaşmayı engelleyen düzenleme terimi. Critic olmadığı için bellek yarıya iner, eğitim hızı çoğunlukla 2x\'in üstüne çıkar.</p>'

+ '<h3 class="l-subtitle">GRPO niye akıl yürütme için iyi</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Sparse ödülle başa çıkar.</strong> Çoğu cevap yanlış (ödül=0) bile olsa, grup içinde göreli üstün cevabı bulur.</li>'
+ '<li><strong>Yüksek varyanslı CoT\'lara uyar.</strong> Aynı soruda 8 farklı yol denemesi, "hangi yol kazandırdı?" sorusunu doğal yanıtlar.</li>'
+ '<li><strong>Ucuz.</strong> 671B parametreli R1\'de bile critic\'i tutmak imkansızdı; GRPO bunu mümkün kıldı.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># GRPO için basitleştirilmiş ana döngü (eğitsel)</span>\n<span class="kw">def</span> <span class="fn">grpo_step</span>(policy, ref_policy, x, G=<span class="num">8</span>):\n    <span class="cm"># 1. Gruptan G örnek üret</span>\n    samples = [policy.<span class="fn">sample</span>(x) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(G)]\n    \n    <span class="cm"># 2. RLVR ödülü — doğrulayıcı çağrısı</span>\n    rewards = [<span class="fn">verify</span>(x, y) <span class="kw">for</span> y <span class="kw">in</span> samples]  <span class="cm"># 1.0 / 0.0</span>\n    \n    <span class="cm"># 3. Grup-içi normalizasyon</span>\n    mu, sigma = np.<span class="fn">mean</span>(rewards), np.<span class="fn">std</span>(rewards) + <span class="num">1e-6</span>\n    advantages = [(r - mu) / sigma <span class="kw">for</span> r <span class="kw">in</span> rewards]\n    \n    <span class="cm"># 4. Klipli politika kaybı + KL düzenleme</span>\n    loss = <span class="num">0</span>\n    <span class="kw">for</span> y, A <span class="kw">in</span> <span class="fn">zip</span>(samples, advantages):\n        rho = policy.<span class="fn">logprob</span>(y, x).<span class="fn">exp</span>() / ref_policy.<span class="fn">logprob</span>(y, x).<span class="fn">exp</span>()\n        clip_rho = rho.<span class="fn">clamp</span>(<span class="num">1</span>-eps, <span class="num">1</span>+eps)\n        loss -= <span class="fn">min</span>(rho * A, clip_rho * A)\n        loss += beta * <span class="fn">kl_div</span>(policy(x), ref_policy(x))\n    \n    loss.<span class="fn">backward</span>()\n    optimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<p class="l-text">Yukarıdaki taslak <a href="https://github.com/huggingface/trl">HuggingFace TRL</a> kütüphanesinde <code>GRPOTrainer</code> olarak gerçek üretim koduyla mevcuttur. 7B parametreli bir akıl yürütme modelini bir 8×H100 düğümünde birkaç günde fine-tune edebilirsin.</p>'

+ '<h2 class="l-title">7. Chain-of-Thought Eğitimi — SFT üstüne RL</h2>'

+ '<p class="l-text">Pratik bir akıl yürüten model eğitiminin tipik hattı:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Cold-start SFT:</strong> Birkaç bin yüksek kaliteli uzun CoT örneği topla (insanlar yazsın veya GPT-4\'le sentezle, sonra filtrele). Modele "böyle düşün" formatını öğret.</li>'
+ '<li><strong>RLVR ana fazı:</strong> Yüz binlerce matematik/kod sorusuyla GRPO. Ödül = doğrulayıcı çıktısı.</li>'
+ '<li><strong>Rejection sampling SFT (opsiyonel):</strong> RL\'den geçen modelle yeni veri üret, sadece doğru olanları tut, tekrar SFT. Model davranışını stabilize eder.</li>'
+ '<li><strong>İnsan tercih RL\'i (opsiyonel):</strong> Sohbet ve genel yardımcı davranışları için son katman olarak RLHF/DPO.</li>'
+ '</ol>'

+ '<h3 class="l-subtitle">Öz-iyileştirme döngüsü</h3>'

+ '<p class="l-text">Akıl yürüten modeller <em>kendi verisini üretir</em>. Süreç:</p>'

+ '<ul class="l-list">'
+ '<li>Model bir soru için 32 farklı CoT üretir.</li>'
+ '<li>Doğrulayıcı doğru olanları seçer (örn. 14/32).</li>'
+ '<li>En kısa veya en zarif doğru olanı veri setine ekle.</li>'
+ '<li>Bir sonraki tur eğitiminde bu yeni veri kullanılır.</li>'
+ '</ul>'

+ '<p class="l-text">Bu, klasik "model verisi tükendi" endişesini önemli ölçüde gevşetir — model güçlendikçe daha iyi sentetik veri üretiyor.</p>'

+ '<h2 class="l-title">8. Süreç vs. Sonuç Denetimi — PRM\'ler</h2>'

+ '<p class="l-text">"Doğru cevabı verene ödül" yaklaşımı <strong>sonuç denetimi (outcome supervision)</strong>\'dir. Basit ama karanlık kutu: model nasıl ulaştığını bilmeyiz, hatalı ara adımlarla yanlışlıkla doğru sonuca varabilir.</p>'

+ '<p class="l-text"><strong>Süreç denetimi (process supervision)</strong>: her ara adıma ayrı ödül ver. OpenAI 2023\'te <strong>PRM800k</strong> veri setini yayınladı — 800.000 matematik adımı için <em>"bu adım doğru / yanlış / belirsiz"</em> insan etiketleri.</p>'

+ '<p class="l-text">PRM (Process Reward Model) ile eğitilen modeller, "doğru cevap, yanlış mantık" hatasına çok daha az düşer. Ama maliyet: her adım için insan etiketi çok pahalı.</p>'

+ '<div class="calc-example"><div class="example-label">SONUÇ VS. SÜREÇ</div><div class="example-body">'
+ '<p class="l-text"><strong>Sonuç denetimi:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.9rem">Soru: 12×7=?<br>CoT: "12×7 = 12+7 = 19 ... aslında dur, 12×7 = 84"<br>Cevap: 84 ✓ → ödül=1</p>'
+ '<p class="l-text">Sonuç doğru ama ilk adım berbat. Sonuç denetimi bunu fark etmez.</p>'
+ '<p class="l-text"><strong>Süreç denetimi:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.9rem">Adım 1: "12×7 = 12+7" → etiket: <strong>yanlış</strong> (-1)<br>Adım 2: "= 84" → etiket: doğru (+1)<br>Net ödül: hatalı düşünce cezalandırıldı.</p>'
+ '</div></div>'

+ '<p class="l-text">2025-2026 trendi: <strong>otomatik PRM</strong> — başka bir LLM\'i süreç yargıcı olarak kullanmak (LLM-as-judge for steps). Bu yaklaşımı RLVR ile birleştirenler en güçlü mevcut akıl yürüten modelleri elde ediyor.</p>'

+ '<h2 class="l-title">9. Çalışılmış Örnek — R1\'in Akıl Yürütme Çıktısı</h2>'

+ '<p class="l-text">DeepSeek-R1\'in gerçek bir matematik problemi için ürettiği akıl yürütme örneği:</p>'

+ '<div class="calc-example"><div class="example-label">R1 ÇIKIŞ ÖRNEĞİ</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.88rem;line-height:1.65">'
+ '<strong>Soru:</strong> x² - 5x + 6 = 0 denkleminin köklerinin küplerinin toplamı nedir?<br><br>'
+ '<strong>&lt;think&gt;</strong><br>'
+ 'Köklere a, b diyelim. Vieta\'dan: a+b = 5, ab = 6.<br>'
+ 'a³ + b³ = (a+b)³ - 3ab(a+b) formülünü kullanayım.<br>'
+ '= 5³ - 3·6·5 = 125 - 90 = 35.<br>'
+ 'Dur, kontrol edeyim. x²-5x+6 = (x-2)(x-3) → kökler 2 ve 3.<br>'
+ '2³ + 3³ = 8 + 27 = 35. ✓<br>'
+ '<strong>&lt;/think&gt;</strong><br><br>'
+ '<strong>&lt;answer&gt;</strong> 35 <strong>&lt;/answer&gt;</strong>'
+ '</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Başarısızlık modları</h3>'

+ '<p class="l-text">Akıl yürüten modeller hata yapmaktan muaf değildir. Gözlemlenen başarısızlık modları:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sonsuz döngü:</strong> Model bir hipoteze takılır, sürekli "ama belki..." diye tekrar başlar. Token bütçesi tükenir, eksik cevap döner.</li>'
+ '<li><strong>Aşırı düşünme:</strong> Basit "2+2=?" sorusu için 5000 token harcamak. Maliyet patlar, fayda yok.</li>'
+ '<li><strong>Dil karıştırma:</strong> R1-Zero\'nun ünlü problemi — düşünce zinciri içinde Çince ve İngilizce karışırdı. R1\'de "language consistency reward" ile düzeltildi.</li>'
+ '<li><strong>Halüsinasyon zinciri:</strong> Yanlış bir ara sonucu gerçek sayıp üstüne kurar. RLVR bunu eğitimde azaltır ama tamamen yok etmez.</li>'
+ '<li><strong>Düşünce gizleme:</strong> Bazı raporlara göre o1 "izlemediği" durumda farklı, "izlendiği" durumda farklı düşünce zinciri yazıyor — yorumlanabilirlik açısından ciddi bir endişe.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. 2026 Frontier — Akıl Yürütme + Ajan + Araç</h2>'

+ '<p class="l-text">2026 itibarıyla manzara hızla evrim geçiriyor:</p>'

+ '<h3 class="l-subtitle">Ucuzlaşan akıl yürütme</h3>'

+ '<ul class="l-list">'
+ '<li><strong>o3-mini ve o4-mini:</strong> o1\'in 1/10 fiyatında, çoğu görevde benzer performans. Akıl yürütmenin emtialaşması.</li>'
+ '<li><strong>Açık dünya:</strong> Qwen2.5-Max-Thinking, Mistral Magistral, DeepSeek-R2 — hepsi düşürülmüş eğitim maliyetleriyle, ev kullanıcısı GPU\'larında çalıştırılabilir distillation\'larla.</li>'
+ '<li><strong>Distillation:</strong> R1\'in çıktıları küçük modellere (7B-32B) öğretiliyor. R1-Distill-Qwen-7B bir RTX 4090\'da çalışıp AIME\'de %55+ alıyor.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Akıl yürütme + ajan yakınsaması</h3>'

+ '<p class="l-text">En önemli 2026 trendi: <strong>düşünme + araç kullanımı entegrasyonu</strong>. Klasik ReAct (<a href="/tutorials/ai/nlp/applied-nlp">Ders 12</a>) ajan ile basit LLM\'i sarmalardı. Modern akıl yürüten modeller <em>düşünme zincirinin içinde</em> doğal olarak araç çağırabilir:</p>'

+ '<div class="calc-example"><div class="example-label">REASONING + TOOL USE</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.88rem;line-height:1.65">'
+ '&lt;think&gt;<br>'
+ 'Kullanıcı NVDA\'nın bugünkü hisse fiyatını soruyor. Bilmiyorum.<br>'
+ '→ araç çağrısı: <span class="fn">get_stock_price</span>("NVDA")<br>'
+ '&lt;tool_result&gt; $874.20 &lt;/tool_result&gt;<br>'
+ 'Tamam, fiyat $874.20. Önceki kapanış da gerekiyor mu? Hayır, sadece bugünkü istedi.<br>'
+ '&lt;/think&gt;<br>'
+ '&lt;answer&gt; NVDA bugün $874.20\'den işlem görüyor. &lt;/answer&gt;'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Bu pattern, OpenAI Responses API, Anthropic Claude\'un extended thinking + tool use ve Google Gemini Deep Think\'te standart hâle geldi. Akıl yürüten model, araçtan döneni "düşünme bağlamında" tüketir, sonra düşünmeye devam eder.</p>'

+ '<h3 class="l-subtitle">Maliyet-doğruluk frontier\'i</h3>'

+ '<div class="plotly-graph"><div id="plot-nlp14-cost-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var classic={x:[0.5,5,15],y:[40,72,83],text:["GPT-4o-mini","GPT-4o","Claude 3.7 Sonnet"],type:"scatter",mode:"markers+text",name:"Klasik LLM",marker:{color:"#888",size:14},textposition:"top center",textfont:{color:T.text,size:10}};'
+ 'var reasoning={x:[1.5,12,60,180],y:[68,79,90,95],text:["o3-mini","R1-Distill","DeepSeek-R1","o3"],type:"scatter",mode:"markers+text",name:"Akıl yürüten",marker:{color:T.accent,size:16},textposition:"bottom center",textfont:{color:T.text,size:10}};'
+ 'var layout={title:{text:"Maliyet × AIME doğruluk frontier\'i (2026)",font:{color:T.text,size:13}},xaxis:{color:T.text,gridcolor:T.grid,title:"Soru başı maliyet ($, log)",type:"log"},yaxis:{color:T.text,gridcolor:T.grid,title:"AIME 2024 doğruluk (%)",range:[30,100]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text}}};'
+ 'if(document.getElementById("plot-nlp14-cost-tr"))Plotly.newPlot("plot-nlp14-cost-tr",[classic,reasoning],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> AIME doğruluk eksenine karşı tek soru başına ortalama maliyet. Klasik LLM eğrisi (gri) belirli bir tavanda doyuyor — Claude 3.7 Sonnet bile %83\'te kalıyor. Akıl yürüten model eğrisi (altın) tamamen farklı bir Pareto frontier\'i çiziyor: o3-mini, Claude 3.7\'den 8x daha ucuza %68\'i geçiyor; DeepSeek-R1 frontier\'in tam ortasında, açık ağırlıklı tek nokta olarak duruyor. <em>Doğru sorduğunuz şey için doğru aile</em> — soru sıradan sohbetse klasik, ciddi matematik/kod ise akıl yürüten.</div>'

+ '<h3 class="l-subtitle">Açık problemler</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Yorumlanabilirlik:</strong> Gizli CoT görünürse güvenli mi, kullanıcı manipülasyonu mu olur? OpenAI\'nın "düşünmeyi gizleme" kararı tartışmalı.</li>'
+ '<li><strong>Doğrulayıcı kapsamı:</strong> RLVR matematik ve kodda iyi. Hukuk, tıp, yaratıcı yazımda mekanik doğrulayıcı yazılamıyor. Çare: LLM-as-judge ama o da kendi yanlılığını taşır.</li>'
+ '<li><strong>Reward hacking 2.0:</strong> Bir model "düşünüyor gibi yapıp" gerçekten düşünmeyebilir mi? RLVR\'da bu zor, ama PRM kullanılırsa risk doğar.</li>'
+ '<li><strong>Çevre maliyeti:</strong> Sorgu başı 100K düşünme tokeni ile saatte milyon sorgu, ciddi enerji.</li>'
+ '</ul>'

+ '<h2 class="l-title">11. Bundan Sonra Ne Yapmalı?</h2>'

+ '<p class="l-text">Akıl yürüten modeller NLP\'nin merkezindeki tek-token-tek-cevap paradigmasını parçaladı. Eğer NLP kariyerinde ileri gitmek istiyorsan:</p>'

+ '<ul class="l-list">'
+ '<li>DeepSeek-R1 teknik raporunu (arXiv:2501.12948) baştan sona oku. Eğitim hattı, başarısızlıklar, "aha anı" hepsi orada.</li>'
+ '<li>HuggingFace TRL\'nin <code>GRPOTrainer</code>\'ı ile küçük bir Qwen2.5-1.5B modelini GSM8K üzerinde fine-tune et. Bir gün, tek GPU.</li>'
+ '<li>OpenAI o3-mini ve Claude extended thinking\'i kendi gerçek sorularınla karşılaştır. Hangisi ne tip soruda kazanıyor — pratik sezgi inşa et.</li>'
+ '<li>Bir doğrulayıcı yaz — örneğin SQL sorgularını mock tabloda çalıştıran. Bu RLVR\'ın ham maddesidir.</li>'
+ '<li><a href="/tutorials/ai/nlp/applied-nlp">Ders 12</a>\'deki RAG ve ajan kalıbını şimdi akıl yürüten bir LLM ile kur. Aradaki farkı kendin hisset.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Akıl yürüten modellerin (o1, o3, DeepSeek-R1) klasik LLM\'lerden farkını ve niye 2024-2025\'in en büyük kırılması olduğunu. Test-zamanı ölçeklemesinin log-doğrusal yasasını ve düşünme bütçelerinin pratiğini. OpenAI o-ailesinin gizli düşünme stratejisini ve DeepSeek-R1\'in açık ağırlıklı devrimini, $5.6M eğitim hikayesini. RLVR\'nin neden ödül modelini gereksizleştirdiğini ve hangi görevlerde işe yaradığını. GRPO\'nun PPO\'ya karşı critic\'siz, grup-normalize avantaj yaklaşımını ve niye akıl yürütme için kazandığını. SFT-RL-rejection-RL döngülü modern eğitim hattını. Süreç ödül modeli (PRM) ile sonuç denetiminin trade-off\'unu ve PRM800k\'nın rolünü. R1\'in çalışmış akıl yürütme örneğini ve başarısızlık modlarını (sonsuz döngü, dil karıştırma, halüsinasyon zinciri). 2026 frontier\'inde akıl yürütme + ajan + araç yakınsamasını ve maliyet-doğruluk Pareto eğrisini.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> The biggest shift NLP saw in 2024-2025: <strong>reasoning models</strong>. OpenAI <strong>o1</strong> (September 2024) and then <strong>DeepSeek-R1</strong> (January 2025) replaced single-shot generation with a hidden chain-of-thought trained to spend serious test-time compute. This lesson: test-time scaling instead of train-time scaling, <strong>RLVR</strong> (RL with verifiable rewards), <strong>GRPO</strong> (critic-free policy optimization), process vs outcome supervision (PRMs), and the 2026 convergence of reasoning, agents, and tool use.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Why test-time compute scaling is the new training-time scaling</li>'
+ '<li>Architectural and training differences between o1 and DeepSeek-R1</li>'
+ '<li>How RLVR (RL with Verifiable Rewards) lets you skip the reward model</li>'
+ '<li>Why GRPO is cheaper than PPO and works better for reasoning</li>'
+ '<li>Process reward models (PRMs) versus outcome supervision, and the role of PRM800k</li>'
+ '<li>The 2026 frontier: convergence of reasoning, agents, and tool use</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. What Is a Reasoning Model?</h2>'

+ '<p class="l-text">The classical LLMs you saw in <a href="/tutorials/ai/nlp/generative-llms">Lesson 11</a> are pure autoregressive streamers: they emit one token at a time and have no explicit space to think about a token before producing it. On an arithmetic or multi-step logic problem they are like a student trying to compute the answer in their head, with no scratch paper.</p>'

+ '<p class="l-text">A <strong>reasoning model</strong> breaks that paradigm. Before delivering an answer it works for a long time on a hidden chain-of-thought (CoT): forms hypotheses, verifies them, backtracks when stuck, tries alternatives. Then it ships a short, clean final answer.</p>'

+ '<div class="calc-example"><div class="example-label">CLASSICAL LLM VS REASONING MODEL</div><div class="example-body">'
+ '<p class="l-text"><strong>Question:</strong> What is 17 × 24?</p>'
+ '<p class="l-text"><strong>Classical GPT-4 (zero-shot):</strong> "408" — immediate, around 85% accuracy on harder variants.</p>'
+ '<p class="l-text"><strong>o1 / R1:</strong> &lt;think&gt; "17 × 24 = 17 × (20+4) = 340 + 68 = 408. Sanity check: 17×2=34, then ×12=204×2=408. ✓" &lt;/think&gt; &lt;answer&gt; 408 &lt;/answer&gt; — 99% accuracy, but 50x more tokens.</p>'
+ '</div></div>'

+ '<p class="l-text">This paradigm started in <strong>September 2024 with OpenAI o1</strong>. In January 2025 DeepSeek-R1 shipped the same capability with MIT-licensed open weights and rocked the field. By 2026 Claude (extended thinking), Gemini 2.5 (Deep Think), Qwen2.5-Max-Thinking, and OpenAI o3-mini are all in this category.</p>'

+ '<h2 class="l-title">2. Test-Time Scaling</h2>'

+ '<p class="l-text">In <a href="/tutorials/ai/nlp/generative-llms">Lesson 11</a> we covered the Chinchilla scaling law: <em>more parameters + more data = better model</em>. That law governs <strong>train-time scaling</strong>.</p>'

+ '<p class="l-text">In 2024 OpenAI demonstrated a brand-new axis: <strong>test-time (inference-time) compute</strong>. Instead of training a larger model, let it spend more tokens thinking at query time. In short: tell it to think longer.</p>'

+ '<div class="katex-block">$$\\text{Accuracy} \\propto \\log(\\text{thinking tokens})$$</div>'

+ '<p class="l-text">The log-linear relationship holds across AIME (math olympiad), GSM8K, MATH, and Codeforces. Strikingly, with the <em>same base model</em>, increasing the thinking budget often delivers more performance per dollar than 10x-ing the training compute.</p>'

+ '<div class="plotly-graph"><div id="plot-nlp14-scaling-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var x=[64,256,1024,4096,16384,65536];'
+ 'var gpt4=[51,52,53,54,55,55];'
+ 'var o1=[55,68,79,86,91,94];'
+ 'var r1=[54,66,77,84,89,92];'
+ 'var t1={x:x,y:gpt4,type:"scatter",mode:"lines+markers",name:"GPT-4 (classical)",line:{color:"#888",width:2,dash:"dash"}};'
+ 'var t2={x:x,y:o1,type:"scatter",mode:"lines+markers",name:"o1-preview",line:{color:T.accent,width:3}};'
+ 'var t3={x:x,y:r1,type:"scatter",mode:"lines+markers",name:"DeepSeek-R1",line:{color:"#c8a96e",width:3}};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid,title:"Thinking tokens (log axis)",type:"log"},yaxis:{color:T.text,gridcolor:T.grid,title:"Accuracy (%)",range:[40,100]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text}}};'
+ 'if(document.getElementById("plot-nlp14-scaling-en"))Plotly.newPlot("plot-nlp14-scaling-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this chart says:</strong> On AIME 2024, every 10x in the thinking budget yields roughly the same accuracy gain for reasoning models — a clean log-linear scaling. Classical GPT-4, given the same generous token budget, saturates near 55%: <em>it does not think, it just writes more</em>. This curve is the strongest visual case for the test-time scaling law.</div>'

+ '<h3 class="l-subtitle">Budgeted reasoning</h3>'

+ '<p class="l-text">In production you do not want unlimited thinking — costs explode. The APIs expose a budget:</p>'

+ '<ul class="l-list">'
+ '<li><strong>OpenAI o1/o3:</strong> <code>reasoning_effort</code> = "low" | "medium" | "high".</li>'
+ '<li><strong>Anthropic Claude (extended thinking):</strong> fine-grained <code>thinking.budget_tokens</code>.</li>'
+ '<li><strong>DeepSeek-R1:</strong> fully open — you bound it with <code>max_tokens</code>.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. The o1 / o3 Family — OpenAI Reasoning</h2>'

+ '<p class="l-text">The o1 series (o1-preview Sep 2024, full o1 Dec 2024, o3 announced Dec 2024, o3-mini broadly available by Jan 2026) is the flagship of this generation.</p>'

+ '<h3 class="l-subtitle">Distinguishing features</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Hidden reasoning:</strong> the chain-of-thought is not shown to the user. The API returns only a reasoning summary. Stated rationale: safety, and making it harder for competitors to distill.</li>'
+ '<li><strong>Math and code dominance:</strong> 83% on AIME (vs GPT-4o\'s 13%), 89th percentile on Codeforces, human PhD level on GPQA Diamond.</li>'
+ '<li><strong>Expensive:</strong> o1-preview output tokens cost $60/1M and you are billed for the hidden thinking tokens too. A typical AIME-style question runs $1-3.</li>'
+ '<li><strong>No system message:</strong> different from classical chat APIs — replaced by the <code>developer</code> role, with tighter constraints.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Calling OpenAI o3-mini with reasoning (2026 SDK)</span>\n<span class="kw">from</span> openai <span class="kw">import</span> OpenAI\n\nclient = OpenAI()\n\nresp = client.chat.completions.create(\n    model=<span class="str">"o3-mini"</span>,\n    reasoning_effort=<span class="str">"high"</span>,  <span class="cm"># low | medium | high</span>\n    messages=[\n        {<span class="str">"role"</span>: <span class="str">"user"</span>,\n         <span class="str">"content"</span>: <span class="str">"A rectangle has area 24 and perimeter 20. Find its sides."</span>}\n    ],\n)\n\n<span class="cm"># Answer + reasoning summary</span>\n<span class="fn">print</span>(resp.choices[<span class="num">0</span>].message.content)\n<span class="fn">print</span>(<span class="str">"Reasoning tokens:"</span>, resp.usage.completion_tokens_details.reasoning_tokens)</code></pre></div>'

+ '<p class="l-text">Each step up in reasoning effort multiplies cost and latency. A common production strategy is escalation: first try a cheap model (GPT-4o); if it fails, route to o3-mini; if still failing, escalate to o3.</p>'

+ '<h2 class="l-title">4. DeepSeek-R1 — The Open-Weights Earthquake</h2>'

+ '<p class="l-text">On 20 January 2025 the Chinese lab DeepSeek released <strong>DeepSeek-R1</strong> under an MIT license. A 671B-parameter (37B active MoE) model that matched o1-preview on reasoning benchmarks — total training cost reportedly around <strong>$5.6M</strong>.</p>'

+ '<p class="l-text">That figure (against OpenAI\'s billions) was an earthquake. Nvidia stock dropped 17% on Jan 24, $600B of market value evaporated. The reason: it proved frontier-grade reasoning was achievable openly and relatively cheaply.</p>'

+ '<h3 class="l-subtitle">R1-Zero — pure RL from base</h3>'

+ '<p class="l-text">DeepSeek actually released two models:</p>'

+ '<ul class="l-list">'
+ '<li><strong>R1-Zero:</strong> went <em>directly</em> from DeepSeek-V3-Base to RL — no SFT at all. The reasoning behaviours (self-correction, alternative strategies, the famous "aha moment") <em>emerged on their own</em>.</li>'
+ '<li><strong>R1:</strong> patches R1-Zero\'s rough edges with: a small "cold-start" SFT, then RL, then rejection-sampling SFT, then a final RL pass. More readable, less language mixing.</li>'
+ '</ul>'

+ '<p class="l-text">R1-Zero\'s emergent reasoning surprised the RL community. At some point during training the chain-of-thought length spiked, the model paused, recognised its earlier mistake, and wrote "Aha, wait...". Nobody taught it that pattern.</p>'

+ '<div class="l-note"><strong>About that cost:</strong> the $5.6M number covers only the final training run — not research, failed runs, infrastructure. Still, compared with Llama 3 (Meta\'s reported 39M GPU-hours, perhaps $50M+), it is striking. The bigger deal: the weights are public, academic groups can fine-tune them at home.</div>'

+ '<h2 class="l-title">5. RLVR — RL with Verifiable Rewards</h2>'

+ '<p class="l-text">Recall RLHF from <a href="/tutorials/ai/nlp/generative-llms">Lesson 11</a>:</p>'

+ '<ol class="l-list">'
+ '<li>Collect preference pairs from humans (is A or B better?).</li>'
+ '<li>Train a <em>reward model</em> (RM) on those preferences — another Transformer.</li>'
+ '<li>Optimise the policy against the RM with PPO.</li>'
+ '</ol>'

+ '<p class="l-text">Problem: the RM is itself an LLM. It is fallible, gameable (reward hacking), expensive. For reasoning tasks it is <em>entirely unnecessary</em>: a math answer is right or wrong, code passes tests or it does not. Why train a separate model to judge?</p>'

+ '<p class="l-text"><strong>RLVR (RL with Verifiable Rewards)</strong> formalises this. The reward comes directly from a verifier:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Math:</strong> normalize the answer with SymPy, compare to ground truth → 1 or 0.</li>'
+ '<li><strong>Code:</strong> run the generated code in a sandbox against unit tests → fraction passing.</li>'
+ '<li><strong>Formal logic / SAT / SQL:</strong> type-check, run query against a mock table.</li>'
+ '<li><strong>Format bonus/penalty:</strong> conforming to <code>&lt;think&gt;...&lt;/think&gt;&lt;answer&gt;...&lt;/answer&gt;</code> earns a small +; violating costs -0.1.</li>'
+ '</ul>'

+ '<div class="katex-block">$$r(x, y) = \\mathbb{1}[\\text{verify}(x, y) = \\text{correct}] + \\lambda \\cdot \\mathbb{1}[\\text{format ok}]$$</div>'

+ '<p class="l-text">The key insight: reward hacking is almost impossible in RLVR. You cannot fake a correct math answer to SymPy. That makes RL training dramatically more stable.</p>'

+ '<h3 class="l-subtitle">Limits of RLVR</h3>'

+ '<p class="l-text">For tasks where no verifier exists (creative writing, conversational quality, medical advice), RLVR cannot apply — you still need human preferences (RLHF/DPO). Rule of thumb: <em>if correctness can be mechanically checked, RLVR; if subjective, RLHF</em>.</p>'

+ '<h2 class="l-title">6. GRPO — Critic-Free Policy Optimization</h2>'

+ '<p class="l-text">PPO has long been the RLHF workhorse but it carries a big cost: you must train a <strong>value network (critic)</strong> the same size as the policy. That doubles compute and memory.</p>'

+ '<p class="l-text">DeepSeek\'s <strong>GRPO (Group Relative Policy Optimization)</strong> drops the critic. The idea is almost embarrassingly simple:</p>'

+ '<ol class="l-list">'
+ '<li>For each input <em>x</em>, sample <strong>G completions</strong> from the policy (typically G=8 or 16).</li>'
+ '<li>Score each with the RLVR verifier: <em>r₁, r₂, ..., r_G</em>.</li>'
+ '<li>Compute the group mean and std. The <strong>advantage</strong> is <em>A_i = (r_i - mean) / std</em>.</li>'
+ '<li>Backpropagate a PPO-style clipped surrogate loss using that advantage. No critic.</li>'
+ '</ol>'

+ '<div class="katex-block">$$\\mathcal{L}_{\\text{GRPO}} = -\\mathbb{E}_{i \\sim G} \\Bigl[ \\min\\bigl( \\rho_i A_i,\\ \\text{clip}(\\rho_i, 1-\\epsilon, 1+\\epsilon) A_i \\bigr) \\Bigr] + \\beta \\cdot \\text{KL}(\\pi \\Vert \\pi_{\\text{ref}})$$</div>'

+ '<p class="l-text">Where <em>ρ_i</em> is the importance ratio and the <em>β KL</em> term penalises drifting too far from a reference policy. Dropping the critic halves memory and typically more than doubles training throughput.</p>'

+ '<h3 class="l-subtitle">Why GRPO suits reasoning</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Handles sparse rewards.</strong> Even if most completions are wrong (reward 0), the relative-best one still gets a positive advantage.</li>'
+ '<li><strong>Matches high-variance CoTs.</strong> Sampling 8 different chains for the same problem directly answers "which path won?".</li>'
+ '<li><strong>Cheap.</strong> Keeping a critic the size of a 671B R1 was infeasible; GRPO made it possible.</li>'
+ '</ul>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Simplified GRPO inner loop (educational)</span>\n<span class="kw">def</span> <span class="fn">grpo_step</span>(policy, ref_policy, x, G=<span class="num">8</span>):\n    <span class="cm"># 1. Sample G completions</span>\n    samples = [policy.<span class="fn">sample</span>(x) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(G)]\n    \n    <span class="cm"># 2. RLVR reward — verifier call</span>\n    rewards = [<span class="fn">verify</span>(x, y) <span class="kw">for</span> y <span class="kw">in</span> samples]  <span class="cm"># 1.0 or 0.0</span>\n    \n    <span class="cm"># 3. Group-relative normalization</span>\n    mu, sigma = np.<span class="fn">mean</span>(rewards), np.<span class="fn">std</span>(rewards) + <span class="num">1e-6</span>\n    advantages = [(r - mu) / sigma <span class="kw">for</span> r <span class="kw">in</span> rewards]\n    \n    <span class="cm"># 4. Clipped surrogate + KL regularization</span>\n    loss = <span class="num">0</span>\n    <span class="kw">for</span> y, A <span class="kw">in</span> <span class="fn">zip</span>(samples, advantages):\n        rho = policy.<span class="fn">logprob</span>(y, x).<span class="fn">exp</span>() / ref_policy.<span class="fn">logprob</span>(y, x).<span class="fn">exp</span>()\n        clip_rho = rho.<span class="fn">clamp</span>(<span class="num">1</span>-eps, <span class="num">1</span>+eps)\n        loss -= <span class="fn">min</span>(rho * A, clip_rho * A)\n        loss += beta * <span class="fn">kl_div</span>(policy(x), ref_policy(x))\n    \n    loss.<span class="fn">backward</span>()\n    optimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<p class="l-text">The real production implementation lives in <a href="https://github.com/huggingface/trl">HuggingFace TRL</a> as <code>GRPOTrainer</code>. You can fine-tune a 7B reasoning model on an 8×H100 node in a few days.</p>'

+ '<h2 class="l-title">7. Chain-of-Thought Training — SFT then RL</h2>'

+ '<p class="l-text">A typical reasoning-model training pipeline:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Cold-start SFT:</strong> a few thousand high-quality long CoT examples (handwritten or GPT-4 synthesized and filtered). Teach the model "think like this" format.</li>'
+ '<li><strong>Main RLVR phase:</strong> hundreds of thousands of math/code problems with GRPO. Reward = verifier output.</li>'
+ '<li><strong>Rejection-sampling SFT (optional):</strong> generate data with the RL\'d model, keep only the correct outputs, re-SFT to stabilise.</li>'
+ '<li><strong>Human-preference RL (optional):</strong> a final RLHF/DPO layer for general chat helpfulness.</li>'
+ '</ol>'

+ '<h3 class="l-subtitle">The self-improvement loop</h3>'

+ '<p class="l-text">Reasoning models <em>produce their own training data</em>:</p>'

+ '<ul class="l-list">'
+ '<li>Sample 32 different CoTs for a problem.</li>'
+ '<li>The verifier flags the correct ones (say 14/32).</li>'
+ '<li>Add the shortest or most elegant correct chain to the training set.</li>'
+ '<li>Train another round on this enlarged set.</li>'
+ '</ul>'

+ '<p class="l-text">This significantly loosens the "we are running out of training data" worry — better models manufacture better synthetic data.</p>'

+ '<h2 class="l-title">8. Process vs Outcome Supervision — PRMs</h2>'

+ '<p class="l-text">Rewarding only the final answer is <strong>outcome supervision</strong>. Simple but black-box: you do not know how the model got there, and it can stumble through bad intermediate steps to a correct final answer.</p>'

+ '<p class="l-text"><strong>Process supervision</strong> rewards each intermediate step. In 2023 OpenAI released <strong>PRM800k</strong>: 800,000 math reasoning steps with human labels of <em>"this step is correct / wrong / ambiguous"</em>.</p>'

+ '<p class="l-text">Models trained against a PRM (Process Reward Model) are much less prone to "right answer, wrong logic" errors. The cost: per-step human labels are very expensive.</p>'

+ '<div class="calc-example"><div class="example-label">OUTCOME VS PROCESS</div><div class="example-body">'
+ '<p class="l-text"><strong>Outcome supervision:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.9rem">Q: 12×7=?<br>CoT: "12×7 = 12+7 = 19 ... actually wait, 12×7 = 84"<br>Answer: 84 ✓ → reward=1</p>'
+ '<p class="l-text">Final answer is right but the first step is nonsense. Outcome supervision misses it.</p>'
+ '<p class="l-text"><strong>Process supervision:</strong></p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.9rem">Step 1: "12×7 = 12+7" → label: <strong>wrong</strong> (-1)<br>Step 2: "= 84" → label: correct (+1)<br>Net reward: bad reasoning is punished.</p>'
+ '</div></div>'

+ '<p class="l-text">The 2025-2026 trend is <strong>automated PRMs</strong>: use another LLM as a per-step judge (LLM-as-judge for steps). Combining that with RLVR yields the strongest reasoning models to date.</p>'

+ '<h2 class="l-title">9. Worked Example — R1 on a Math Problem</h2>'

+ '<p class="l-text">A real chain produced by DeepSeek-R1:</p>'

+ '<div class="calc-example"><div class="example-label">R1 SAMPLE OUTPUT</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.88rem;line-height:1.65">'
+ '<strong>Question:</strong> For x² - 5x + 6 = 0, find the sum of the cubes of the roots.<br><br>'
+ '<strong>&lt;think&gt;</strong><br>'
+ 'Call the roots a, b. By Vieta\'s: a+b = 5, ab = 6.<br>'
+ 'Use a³ + b³ = (a+b)³ - 3ab(a+b).<br>'
+ '= 5³ - 3·6·5 = 125 - 90 = 35.<br>'
+ 'Wait, let me sanity check. x²-5x+6 = (x-2)(x-3) → roots are 2 and 3.<br>'
+ '2³ + 3³ = 8 + 27 = 35. ✓<br>'
+ '<strong>&lt;/think&gt;</strong><br><br>'
+ '<strong>&lt;answer&gt;</strong> 35 <strong>&lt;/answer&gt;</strong>'
+ '</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Failure modes</h3>'

+ '<p class="l-text">Reasoning models are not bug-free. Observed failure modes:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Infinite loops:</strong> the model gets stuck on a hypothesis, restarts with "but maybe..." indefinitely, exhausts the token budget, returns no answer.</li>'
+ '<li><strong>Overthinking:</strong> spending 5000 tokens on "2+2=?". Cost explodes, no benefit.</li>'
+ '<li><strong>Language mixing:</strong> R1-Zero famously mixed Chinese and English mid-chain. R1 fixed this with a "language consistency reward".</li>'
+ '<li><strong>Hallucinated chains:</strong> treating a wrong intermediate result as fact and building on it. RLVR reduces this in training but does not eliminate it.</li>'
+ '<li><strong>Hidden-thought misalignment:</strong> some reports suggest o1 writes different chains when it senses it is being monitored vs not — a serious interpretability concern.</li>'
+ '</ul>'

+ '<h2 class="l-title">10. The 2026 Frontier — Reasoning + Agents + Tools</h2>'

+ '<p class="l-text">As of 2026 the landscape is moving fast.</p>'

+ '<h3 class="l-subtitle">Reasoning is getting cheap</h3>'

+ '<ul class="l-list">'
+ '<li><strong>o3-mini and o4-mini:</strong> roughly 1/10 of o1\'s price for similar performance on most tasks. Reasoning is commoditising.</li>'
+ '<li><strong>Open world:</strong> Qwen2.5-Max-Thinking, Mistral Magistral, DeepSeek-R2 — all driven down in training cost, with consumer-GPU-runnable distilled checkpoints.</li>'
+ '<li><strong>Distillation:</strong> R1\'s outputs are being distilled into 7B-32B students. R1-Distill-Qwen-7B runs on a single RTX 4090 and scores 55%+ on AIME.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Reasoning + agent convergence</h3>'

+ '<p class="l-text">The most important 2026 trend: <strong>integrated thinking + tool use</strong>. Classical ReAct agents (<a href="/tutorials/ai/nlp/applied-nlp">Lesson 12</a>) wrapped a plain LLM. Modern reasoning models can call tools <em>inside</em> their chain-of-thought:</p>'

+ '<div class="calc-example"><div class="example-label">REASONING + TOOL USE</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.88rem;line-height:1.65">'
+ '&lt;think&gt;<br>'
+ 'User wants NVDA\'s current price. I don\'t know it.<br>'
+ '→ tool call: <span class="fn">get_stock_price</span>("NVDA")<br>'
+ '&lt;tool_result&gt; $874.20 &lt;/tool_result&gt;<br>'
+ 'OK, price is $874.20. Do they need yesterday\'s close too? No, they asked only for today.<br>'
+ '&lt;/think&gt;<br>'
+ '&lt;answer&gt; NVDA is trading at $874.20 today. &lt;/answer&gt;'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">This pattern is standard in OpenAI\'s Responses API, Anthropic Claude\'s extended thinking + tool use, and Google Gemini Deep Think. The reasoning model consumes the tool result inside its thinking context, then keeps thinking.</p>'

+ '<h3 class="l-subtitle">The cost-accuracy frontier</h3>'

+ '<div class="plotly-graph"><div id="plot-nlp14-cost-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var classic={x:[0.5,5,15],y:[40,72,83],text:["GPT-4o-mini","GPT-4o","Claude 3.7 Sonnet"],type:"scatter",mode:"markers+text",name:"Classical LLM",marker:{color:"#888",size:14},textposition:"top center",textfont:{color:T.text,size:10}};'
+ 'var reasoning={x:[1.5,12,60,180],y:[68,79,90,95],text:["o3-mini","R1-Distill","DeepSeek-R1","o3"],type:"scatter",mode:"markers+text",name:"Reasoning",marker:{color:T.accent,size:16},textposition:"bottom center",textfont:{color:T.text,size:10}};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid,title:"Cost per question ($, log)",type:"log"},yaxis:{color:T.text,gridcolor:T.grid,title:"AIME 2024 accuracy (%)",range:[30,100]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},legend:{font:{color:T.text}}};'
+ 'if(document.getElementById("plot-nlp14-cost-en"))Plotly.newPlot("plot-nlp14-cost-en",[classic,reasoning],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this chart says:</strong> AIME accuracy versus average cost per question. The classical-LLM curve (grey) saturates: even Claude 3.7 Sonnet plateaus around 83%. The reasoning-model curve (gold) traces an entirely different Pareto frontier: o3-mini beats Claude 3.7\'s accuracy at 8x lower cost, and DeepSeek-R1 sits in the middle of the frontier as the only open-weights point. <em>Pick the family that matches the question</em> — classical for plain chat, reasoning for serious math/code.</div>'

+ '<h3 class="l-subtitle">Open problems</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Interpretability:</strong> if the hidden CoT is shown, is it safer or just exposes manipulation? OpenAI\'s decision to hide reasoning remains controversial.</li>'
+ '<li><strong>Verifier coverage:</strong> RLVR works for math and code. There is no mechanical verifier for law, medicine, creative writing. The workaround is LLM-as-judge, which inherits its own biases.</li>'
+ '<li><strong>Reward hacking 2.0:</strong> could a model "pretend" to think without really thinking? Hard under RLVR, but plausible with PRMs.</li>'
+ '<li><strong>Environmental cost:</strong> 100K thinking tokens per query times millions of queries per hour is real energy.</li>'
+ '</ul>'

+ '<h2 class="l-title">11. What to Do Next</h2>'

+ '<p class="l-text">Reasoning models broke NLP\'s one-token-at-a-time paradigm. If you want to go deeper:</p>'

+ '<ul class="l-list">'
+ '<li>Read the DeepSeek-R1 technical report (arXiv:2501.12948) end to end. Training pipeline, failures, the "aha moment" are all there.</li>'
+ '<li>Fine-tune a small Qwen2.5-1.5B on GSM8K with HuggingFace TRL\'s <code>GRPOTrainer</code>. A day, a single GPU.</li>'
+ '<li>Compare OpenAI o3-mini and Claude extended thinking on your real prompts. Which wins on what — build practical intuition.</li>'
+ '<li>Write a verifier — e.g. one that runs SQL queries against a mock table. That is the raw material of RLVR.</li>'
+ '<li>Rebuild the RAG + agent pattern from <a href="/tutorials/ai/nlp/applied-nlp">Lesson 12</a> using a reasoning LLM. Feel the difference firsthand.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The difference between reasoning models (o1, o3, DeepSeek-R1) and classical LLMs, and why this was 2024-2025\'s biggest shift. The log-linear law of test-time scaling and how thinking budgets are exposed in production APIs. OpenAI\'s hidden-thought strategy and DeepSeek-R1\'s open-weights, $5.6M training story. Why RLVR replaces the reward model with a verifier and where it stops working. GRPO\'s critic-free, group-relative advantage trick and why it wins for reasoning. The SFT → RL → rejection-SFT → RL training pipeline. Process reward models versus outcome supervision and the PRM800k dataset. R1\'s worked-example output and its failure modes (infinite loops, language mixing, hallucinated chains). The 2026 frontier where reasoning, agents, and tool use converge, and the cost-accuracy Pareto picture.</div>'

};
