/* nlp-new-L11.js — NLP Course Lesson 11: Büyük Dil Modelleri — Ölçek, RLHF, LoRA (TR + EN) */
var NLP_L11 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> <a href="/tutorials/ai/nlp/transformers-bert">Ders 10</a>\'da Transformer mimarisini ve BERT/GPT temel modellerini öğrendik. Şimdi <strong>büyük dil modelleri (Large Language Models, LLM)</strong>\'a geçiyoruz: GPT-3, GPT-4, Claude, Llama gibi yüz milyarlarca parametreli modeller. Ölçek nasıl kalite yarattı (scaling laws), instruction-tuning ile RLHF nasıl insan tercihlerine hizalama getirdi, LoRA ile az kaynakla nasıl fine-tune yapılır, prompt engineering nedir ve emergent yeteneklerin sınırı nedir — hepsi.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>GPT-3, GPT-4, Claude, Llama gibi LLM\'lerin parametre/veri/hesap ölçeklerini karşılaştırmayı</li>'
+ '<li>Chinchilla scaling law\'ı ile optimal veri/parametre dengesini akıl yürütmeyi</li>'
+ '<li>Instruction tuning ve RLHF\'in nasıl insan tercihlerine hizalama getirdiğini anlamayı</li>'
+ '<li>LoRA ve QLoRA ile küçük kaynakla parametrik-verimli fine-tuning yapmayı</li>'
+ '<li>Few-shot, chain-of-thought ve ReAct gibi prompt engineering tekniklerini uygulamayı</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. LLM Nedir?</h2>'

+ '<p class="l-text"><strong>Büyük dil modeli (LLM)</strong>, devasa metin külliyatları üzerinde önceden eğitilmiş, milyarlarca parametreli Transformer\'lardır. Mimari olarak <a href="/tutorials/ai/nlp/transformers-bert">Ders 10</a>\'da gördüğümüz GPT\'nin aynısı — sadece çok daha büyük, çok daha çeşitli veri üzerinde, çok daha uzun süre eğitilmiş.</p>'

+ '<div class="calc-example"><div class="example-label">PARAMETRE ÖLÇEKLERİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Model</th><th style="padding:.5rem">Parametre</th><th style="padding:.5rem">Yıl</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">BERT-base</td><td style="text-align:center">110 M</td><td style="text-align:center">2018</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">GPT-2</td><td style="text-align:center">1.5 B</td><td style="text-align:center">2019</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">GPT-3</td><td style="text-align:center">175 B</td><td style="text-align:center">2020</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">PaLM, GPT-4</td><td style="text-align:center">~500 B-1.7 T</td><td style="text-align:center">2022-2023</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.1 (405B)</td><td style="text-align:center">405 B (açık)</td><td style="text-align:center">2024</td></tr>'
+ '<tr><td style="padding:.5rem">Modern frontier (2026)</td><td style="text-align:center">2 T+</td><td style="text-align:center">2025-2026</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<p class="l-text">B = milyar, T = trilyon. BERT\'ten GPT-4\'e altı yılda 10000x büyüme. Model boyutu kadar <strong>eğitim verisi</strong> ve <strong>hesap maliyeti</strong> de patlama yaşadı.</p>'

+ '<h2 class="l-title">2. Scaling Laws — Ölçek Niye Önemli</h2>'

+ '<p class="l-text">Kaplan ve ekibi (2020), sonra Hoffmann ve ekibi (Chinchilla, 2022) <strong>ölçek yasalarını</strong> formülize etti: model performansı (test loss\'u), parametre sayısı, eğitim verisi miktarı ve hesap miktarı arasında <em>güç yasası</em> (power law) ilişkileri var.</p>'

+ '<div class="katex-block">$$L(N, D) \\approx \\Bigl( \\frac{N_c}{N} \\Bigr)^{\\alpha_N} + \\Bigl( \\frac{D_c}{D} \\Bigr)^{\\alpha_D}$$</div>'

+ '<p class="l-text">Burada <em>L</em> kayıp, <em>N</em> parametre, <em>D</em> token sayısı. Pratik sonuç:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Daha çok parametre = daha iyi model</strong> — ama yalnız eğer veri ve hesap da yeterse.</li>'
+ '<li><strong>Chinchilla bulgusu:</strong> GPT-3 aslında "az eğitilmişti". Aynı parametreyle 4x veri kullanılsa daha iyi olurdu.</li>'
+ '<li>Modern modeller (Llama 3, GPT-4) parametre/veri/hesap üçlüsünü dengeli ölçeklendirir.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Emergent yetenekler</h3>'

+ '<p class="l-text">Ölçek belirli eşikleri geçince <strong>beklenmeyen yetenekler</strong> ortaya çıkar — küçük modellerde olmayan, büyük modellerde aniden beliren beceriler.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Few-shot learning:</strong> 2-3 örnek görerek yeni göreve uyum sağlama.</li>'
+ '<li><strong>Chain-of-thought:</strong> Adım adım akıl yürütme.</li>'
+ '<li><strong>Kod yazma:</strong> Doğal dilden Python/SQL üretme.</li>'
+ '<li><strong>Çok dilli akıcılık:</strong> İngilizce eğitilmiş modelin Türkçeye yeterli düzeyde transfer etmesi.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Üç Aşamalı Eğitim — Pretrain, SFT, RLHF</h2>'

+ '<p class="l-text">Modern LLM\'ler genelde üç aşamada eğitilir:</p>'

+ '<h3 class="l-subtitle">Aşama 1: Pre-training</h3>'

+ '<p class="l-text">Büyük internet metni üzerinde sonraki kelimeyi tahmin etme görevi (<a href="/tutorials/ai/nlp/language-models">Ders 8</a>). Trilyonlarca token görür, dilin yapısını ve dünya bilgisinin önemli bir kısmını öğrenir. Ama henüz "talimat takip etmeyi" bilmiyor — sadece metin tamamlamayı yapıyor.</p>'

+ '<h3 class="l-subtitle">Aşama 2: Supervised Fine-Tuning (SFT)</h3>'

+ '<p class="l-text">Önceden eğitilmiş model, <strong>(talimat, ideal cevap)</strong> çiftlerinden oluşan bir veri seti üzerinde fine-tune edilir. Veri kalitesi kritiktir — InstructGPT için OpenAI yüksek kaliteli on binlerce örnek topladı (insanlar yazdı). Model artık "talimat takip eden" bir asistana benzer.</p>'

+ '<h3 class="l-subtitle">Aşama 3: RLHF (Reinforcement Learning from Human Feedback)</h3>'

+ '<p class="l-text">SFT modeli iyi cevaplar verir ama "iyi" ne demek? Bunu insan tercihinden öğrenmek için RLHF kullanılır:</p>'

+ '<ol class="l-list">'
+ '<li>Aynı talimat için modelden iki cevap üret.</li>'
+ '<li>İnsan değerlendiriciye sor: hangisi daha iyi?</li>'
+ '<li>Bu çiftlerden bir <strong>ödül modeli (reward model)</strong> eğit — cevapları puanlayan ayrı bir Transformer.</li>'
+ '<li>Ana modeli, ödül modelini maksimize edecek şekilde RL ile güncelle (PPO algoritması).</li>'
+ '</ol>'

+ '<p class="l-text">Sonuç: model sadece "doğru" değil, <em>insanların tercih ettiği</em> cevaplar üretir. ChatGPT\'nin başarısının arkasında bu var.</p>'

+ '<h3 class="l-subtitle">RLHF\'in alternatifi: DPO</h3>'

+ '<p class="l-text"><strong>Direct Preference Optimization (DPO, 2023)</strong>, ödül modelini açıkça eğitmeden tercihleri doğrudan kullanır. Hesapsal olarak daha basit, sıkça benzer kalitede sonuç verir. Llama 3 ve sonraki açık-kaynak modellerin çoğu DPO veya türevini kullanır.</p>'

+ '<h2 class="l-title">4. Prompt Engineering — Modeli Doğru Konuşturmak</h2>'

+ '<p class="l-text">LLM\'ler talimat takip eder, ama talimatın yazılış şekli sonucu büyük ölçüde etkiler. <strong>Prompt engineering</strong> = doğru talimatı yazma sanatı.</p>'

+ '<h3 class="l-subtitle">Zero-shot, few-shot, chain-of-thought</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Zero-shot:</strong> sadece talimat ver. <em>"Bu yorumun duygusunu söyle: Film harikaydı."</em></li>'
+ '<li><strong>Few-shot:</strong> talimat + birkaç örnek. Model örüntüyü görerek yenisini çözer.</li>'
+ '<li><strong>Chain-of-thought (CoT):</strong> "Adım adım düşün" demek. Karmaşık problemlerde başarıyı çok artırır.</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">CHAIN-OF-THOUGHT ÖRNEĞI</div><div class="example-body">'
+ '<p class="l-text"><strong>Talimat:</strong> "Bir kafede 6 sandalye, her masada 4 sandalye var. 18 sandalye varsa kaç masa? <em>Adım adım düşün.</em>"</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7"><strong>Model çıktısı:</strong>'
+ '<br>1. Kafedeki 6 sandalye masada değil (lobi/bekleme).'
+ '<br>2. Masalardaki sandalye = 18 - 6 = 12.'
+ '<br>3. Her masada 4 sandalye → 12 / 4 = 3 masa.</p>'
+ '<p class="l-text">CoT olmadan model muhtemelen "18/4 = 4.5" der, yanlış. CoT ile akıl yürütme açıkça görünür ve sonuç düzelir.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. LoRA — Az Kaynakla Fine-Tune</h2>'

+ '<p class="l-text">175B parametreli bir modeli tam fine-tune etmek 100+ GPU ister, çoğumuz için imkânsız. <strong>LoRA (Low-Rank Adaptation, 2021)</strong> bu sorunu zarif şekilde çözer.</p>'

+ '<p class="l-text">Sezgi: Fine-tune sırasında ağırlık matrisleri çok değişmez — değişimler genelde <em>düşük ranklıdır</em>. Yani <em>W → W + ΔW</em> yerine <em>ΔW</em>\'yi iki küçük matrisin çarpımıyla parametreleştir:</p>'

+ '<div class="katex-block">$$\\Delta W = B A, \\quad B \\in \\mathbb{R}^{d \\times r}, \\quad A \\in \\mathbb{R}^{r \\times k}, \\quad r \\ll d$$</div>'

+ '<p class="l-text">Tipik <em>r = 8</em> veya <em>16</em>. Eğitilen parametre sayısı orijinaline kıyasla 1000x daha az olabilir. Bu sayede:</p>'

+ '<ul class="l-list">'
+ '<li>Tek GPU\'da 7B parametreli bir modeli fine-tune edebilirsin.</li>'
+ '<li>Birden çok görev için ayrı LoRA ağırlıkları sakla — ana model değişmiyor, sadece küçük "yamalar" değişiyor.</li>'
+ '<li>Görevler arası kayma yok — orijinal modeli bozmadan adapte ediyorsun.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>QLoRA (2023)</strong> bunun üstüne 4-bit quantization ekler — modelin kendisini bile sıkıştırarak daha az bellek kullanır. 70B parametreli bir modeli tek 24GB GPU\'da fine-tune etmek mümkün.</p>'

+ '<h2 class="l-title">6. Türkçe LLM Manzarası</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Çok dilli temel modeller:</strong> GPT-4, Claude, Llama-3, Gemini — Türkçeyi de içeren büyük corpus\'larda eğitilmişlerdir. Pratikte iyi sonuç verir, özellikle son nesil.</li>'
+ '<li><strong>Türkçe özelleştirilmiş açık modeller:</strong> Trendyol-LLM (Llama tabanlı), KanarYa, TurkishLLama gibi modeller Türkçe metinlerle ince ayarlanmıştır.</li>'
+ '<li><strong>Anadil olarak Türkçe modeller:</strong> Tamamen Türkçe corpus\'ta sıfırdan eğitilmiş modeller hâlâ az; veri ve hesap kaynağı kıt.</li>'
+ '<li><strong>Pratik öneri:</strong> Çoğu görev için en kısa yol — bir genel-amaçlı LLM (GPT-4, Claude) + iyi prompt + gerektiğinde RAG (<a href="/tutorials/ai/nlp/applied-nlp">Ders 12</a>). Tam yerel kontrol gerekiyorsa Llama-3 veya Mistral fine-tune edilir.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Açık-Ağırlık Cephesi — Llama, DeepSeek, Qwen</h2>'

+ '<p class="l-text">2024-2025 dönemi, kapalı API\'ların (GPT-4, Claude, Gemini) tek hakim olduğu manzarayı kökten değiştirdi. <strong>Açık ağırlıklı (open-weight) modeller</strong> — model dosyalarını indirip kendi sunucunda çalıştırabildiğin modeller — frontier kaliteye ulaştı. Bu, NLP\'de yeni bir dönem demek: özelleştirilebilir, mahremiyetli ve devletten bağımsız yapay zekâ.</p>'

+ '<h3 class="l-subtitle">Llama Soyağacı — Meta\'nın açık çizgisi</h3>'

+ '<p class="l-text">Llama, açık-ağırlık LLM\'lerin omurgası. Her sürüm önceki nesli ezdi:</p>'

+ '<div class="calc-example"><div class="example-label">LLAMA SÜRÜM TARİHÇESİ</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Sürüm</th><th style="padding:.5rem">Tarih</th><th style="padding:.5rem">Boyutlar</th><th style="text-align:left;padding:.5rem">Öne çıkan</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 1</td><td style="text-align:center">Şub 2023</td><td style="text-align:center">7B-65B</td><td style="padding:.5rem">Araştırma lisansı; sızdı, ekosistemi tetikledi</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 2</td><td style="text-align:center">Tem 2023</td><td style="text-align:center">7B-70B</td><td style="padding:.5rem">İlk gerçek ticari lisans, RLHF\'li chat varyantı</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3</td><td style="text-align:center">Nis 2024</td><td style="text-align:center">8B, 70B</td><td style="padding:.5rem">15T token eğitim, GPT-3.5\'i geçen ilk küçük model</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.1</td><td style="text-align:center">Tem 2024</td><td style="text-align:center">8B, 70B, <strong>405B</strong></td><td style="padding:.5rem">İlk açık-ağırlık frontier model; çok dilli, 128K bağlam</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.2</td><td style="text-align:center">Eyl 2024</td><td style="text-align:center">1B, 3B, 11B, 90B</td><td style="padding:.5rem">Görüntü-metin (11B/90B) + cep telefonu için kenar modelleri (1B/3B)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.3</td><td style="text-align:center">Ara 2024</td><td style="text-align:center">70B</td><td style="padding:.5rem">405B kalitesine 70B parametreyle ulaştı — verimlilik atlama noktası</td></tr>'
+ '<tr><td style="padding:.5rem">Llama 4</td><td style="text-align:center">2025</td><td style="text-align:center">MoE</td><td style="padding:.5rem">Doğuştan çok modlu (görüntü+ses+metin), Mixture-of-Experts mimari</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<p class="l-text">Llama 3.3 70B özellikle dikkat çekici: <em>yedi katı küçük</em> bir modelle 405B versiyon kalitesi aşağı yukarı yakalandı. Bu, mimari ve eğitim verisi iyileştirmelerinin ne kadar büyük etki yaptığını gösteriyor — sadece "daha büyük yap" yetmiyor, "daha akıllı eğit" lazım.</p>'

+ '<h3 class="l-subtitle">DeepSeek-V3 — Çin\'in efendisiz ezme darbesi</h3>'

+ '<p class="l-text">Aralık 2024\'te DeepSeek (Hong Kong tabanlı bir hedge fonun AI laboratuvarı) öyle bir model yayımladı ki tüm sektör sallandı: <strong>DeepSeek-V3</strong>. Bu sürpriz sürümün neden bu kadar ses getirdiğine bakalım:</p>'

+ '<ul class="l-list">'
+ '<li><strong>671B toplam, 37B aktif parametre:</strong> Mixture-of-Experts (MoE) mimarisi. Her token için sadece "uzman" alt modellerin küçük bir kısmı çalıştırılır. Toplam kapasite devasa, çalışma maliyeti küçük.</li>'
+ '<li><strong>~$5.5M eğitim maliyeti:</strong> OpenAI\'ın GPT-4 için harcadığı tahmini $100M+ rakamının yanında ~20x ucuz. H800 GPU\'larla, ABD ihracat kısıtlamalarına rağmen.</li>'
+ '<li><strong>Multi-Token Prediction (MTP) hedefi:</strong> Her adımda tek token yerine birden çok ileri token tahmin etmesi öğretildi — eğitim sırasında öğrenme sinyalini güçlendirir.</li>'
+ '<li><strong>MIT lisansı:</strong> Tamamen serbest — ticari kullanım, modifikasyon, hatta yeniden satış serbest. GPT-4\'le çok yakın, bazı benchmark\'larda eşit veya üzerinde.</li>'
+ '<li><strong>DeepSeek-R1:</strong> V3 üzerine inşa edilen muhakeme varyantı (Ocak 2025) — <a href="/tutorials/ai/nlp/reasoning-models">Ders 14</a>\'te o ele alınacak.</li>'
+ '</ul>'

+ '<p class="l-text">DeepSeek-V3\'ün asıl mesajı şuydu: <em>frontier AI artık on milyarlarca dolarlık kapalı laboratuvarların tekelinde değil</em>. Doğru mimari + akıllı eğitim ile çok daha azına yakın kalite mümkün. Bu, 2025 boyunca verimlilik araştırmalarını ateşledi.</p>'

+ '<h3 class="l-subtitle">Diğer önemli açık modeller</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Qwen 2.5 / Qwen 3 (Alibaba):</strong> 0.5B\'den 72B\'ye geniş yelpaze; çok güçlü kodlama ve matematik. Çince ve İngilizcede dengeli; Türkçede Llama\'ya yakın.</li>'
+ '<li><strong>Mistral Large 2 (Fransa):</strong> 123B parametre, Avrupa merkezli geliştirme. Çok dilli odak (Fransızca, Almanca, İspanyolca üst düzey). Mistral 7B ve Mixtral 8x7B hâlâ küçük model standartlarından.</li>'
+ '<li><strong>Gemma 2 / 3 (Google):</strong> 2B, 9B, 27B boyutları. Gemini\'nin "küçük açık kardeşi"; verimlilik odaklı.</li>'
+ '<li><strong>Phi-3 / Phi-4 (Microsoft):</strong> Küçük (3-14B) ama "ders kitabı kalitesinde" sentetik veri ile eğitilmiş. Boyutuna göre çok güçlü muhakeme.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Açık ağırlık niye önemli?</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Mahremiyet:</strong> Hassas veri (sağlık, hukuk, kurum içi) API\'lara gönderilmez. Model kendi sunucunda çalışır.</li>'
+ '<li><strong>Maliyet:</strong> Token başına ücret yok. Yüksek hacimde self-host fiyatı uçar.</li>'
+ '<li><strong>Özelleştirme:</strong> Fine-tune ve distill serbest. Domain-specific küçük model üretebilirsin.</li>'
+ '<li><strong>Egemenlik:</strong> Ulusal/bölgesel modeller için temel. Türkiye, Hindistan, AB kendi modellerini açık temelden inşa ediyor.</li>'
+ '<li><strong>Araştırma:</strong> Tekrarlanabilirlik. Kapalı modellerle bilim yapılamaz — ağırlıklara bakamazsın.</li>'
+ '<li><strong>Saydamlık:</strong> Bias denetimi, güvenlik araştırması ve red-teaming yapılabilmesi için ağırlıkların görünür olması şart.</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-nlp11-openllm-tr" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var names=["Llama 3.1 8B","Llama 3.3 70B","Llama 3.1 405B","DeepSeek-V3 (37B aktif)","Qwen 2.5 72B","Mistral Large 2 (123B)","GPT-4o (kapalı)","Claude Sonnet 4 (kapalı)"];'
+ 'var active=[8,70,405,37,72,123,200,200];'
+ 'var mmlu=[68,82,87,88,84,84,88,89];'
+ 'var colors=["#4ecdc4","#4ecdc4","#4ecdc4","#ff9966","#c8a96e","#9b87ff","#888","#888"];'
+ 'var trace={x:active,y:mmlu,mode:"markers+text",type:"scatter",text:names,textposition:"top center",marker:{size:14,color:colors,line:{color:T.text,width:1}},textfont:{size:11,color:T.text}};'
+ 'var layout={xaxis:{type:"log",title:"Aktif parametre (B, log ölçek)",color:T.text,gridcolor:T.grid},yaxis:{title:"MMLU (%)",color:T.text,gridcolor:T.grid,range:[60,95]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},showlegend:false};'
+ 'if(document.getElementById("plot-nlp11-openllm-tr"))Plotly.newPlot("plot-nlp11-openllm-tr",[trace],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Aktif parametre sayısı (log ölçek) ve MMLU benchmark skoru. Mavi noktalar Llama ailesi, turuncu DeepSeek-V3 (MoE — sadece 37B aktif), altın Qwen, mor Mistral, gri kapalı modeller (GPT-4o, Claude). <em>DeepSeek-V3 çok az aktif parametre ile kapalı frontier seviyesine ulaşıyor — MoE\'nin gücü burada.</em> Llama 3.3 70B, 405B versiyona neredeyse eşit puan; "küçük ama akıllı eğitilmiş" stratejisinin zaferi.</div>'

+ '<h3 class="l-subtitle">Pratik: Llama 3.3 70B yerel kullanım</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Llama 3.3 70B Hugging Face üzerinden</div><div class="code-block"><pre><code><span class="cm"># Tam precision için ~140GB VRAM gerekir (4xH100). Quantize edilirse</span>'
+ '\n<span class="cm"># 4-bit ile ~40GB\'a iner; tek A100 80GB veya 2xRTX 4090\'da çalışır.</span>'
+ '\n<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM'
+ '\n'
+ '\nmodel_id = <span class="str">"meta-llama/Llama-3.3-70B-Instruct"</span>'
+ '\ntok = <span class="fn">AutoTokenizer</span>.<span class="fn">from_pretrained</span>(model_id)'
+ '\nmodel = <span class="fn">AutoModelForCausalLM</span>.<span class="fn">from_pretrained</span>('
+ '\n    model_id,'
+ '\n    device_map=<span class="str">"auto"</span>,'
+ '\n    torch_dtype=<span class="str">"auto"</span>,        <span class="cm"># bfloat16 otomatik</span>'
+ '\n    <span class="cm"># load_in_4bit=True,        # BitsAndBytes ile 4-bit quantize</span>'
+ '\n)'
+ '\n'
+ '\nmsgs = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"Türkçe yaz: Yapay zeka için açık ağırlık niye önemli?"</span>}]'
+ '\nprompt = tok.<span class="fn">apply_chat_template</span>(msgs, tokenize=<span class="kw">False</span>, add_generation_prompt=<span class="kw">True</span>)'
+ '\ninputs = <span class="fn">tok</span>(prompt, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(model.device)'
+ '\nout = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">300</span>, temperature=<span class="num">0.7</span>)'
+ '\n<span class="fn">print</span>(tok.<span class="fn">decode</span>(out[<span class="num">0</span>][inputs.input_ids.<span class="fn">shape</span>[<span class="num">1</span>]:], skip_special_tokens=<span class="kw">True</span>))</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Llama 3.3 70B Instruct modelini Hugging Face\'ten indirir ve yerel olarak başlatır. <code>device_map="auto"</code> ile çoklu GPU varsa parametreler otomatik dağıtılır. <code>load_in_4bit</code> satırını açarsan modeli 4-bit quantize ederek bellek ihtiyacı yaklaşık 4 kat azalır — kalite kaybı genelde %1-2. Sohbet formatlı promptla Türkçe cevap alınır. Aynı API DeepSeek-V3 ve Qwen 2.5 için de <code>model_id</code> değiştirerek çalışır.</p>'

+ '<h2 class="l-title">8. Python\'da LLM Kullanımı</h2>'

+ '<h3 class="l-subtitle">API tabanlı (OpenAI, Anthropic)</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Anthropic Claude API ile sentiment analizi</div><div class="code-block"><pre><code><span class="kw">import</span> anthropic'
+ '\n'
+ '\nclient = anthropic.<span class="fn">Anthropic</span>()'
+ '\n'
+ '\nyorum = <span class="str">"Ürün gerçekten harika, kargo da hızlıydı"</span>'
+ '\n'
+ '\nresponse = client.messages.<span class="fn">create</span>('
+ '\n    model=<span class="str">"claude-sonnet-4-6"</span>,'
+ '\n    max_tokens=<span class="num">100</span>,'
+ '\n    messages=[{'
+ '\n        <span class="str">"role"</span>: <span class="str">"user"</span>,'
+ '\n        <span class="str">"content"</span>: <span class="str">f"Bu Türkçe yorumun duygusunu (olumlu/olumsuz/nötr) tek kelimeyle söyle:\\n{yorum}"</span>'
+ '\n    }]'
+ '\n)'
+ '\n<span class="fn">print</span>(response.content[<span class="num">0</span>].text)'
+ '\n<span class="cm"># olumlu</span></code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Anthropic\'in Claude modelini bir prompt\'la çağırır. Talimat: "Bu yorumun duygusunu söyle". Model talimatı takip ederek tek kelimelik bir cevap verir. Hiç eğitim verisi etiketlenmedi, sıfır model eğitildi — sadece doğru bir prompt yazıldı. Klasik ML tarafından %85\'lik sonuç saatler sürerken, LLM saniyeler içinde benzer kalite verir.</p>'

+ '<h3 class="l-subtitle">Açık model — Llama (yerel)</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> transformers ile Llama generate</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM'
+ '\n<span class="kw">import</span> torch'
+ '\n'
+ '\nmodel_id = <span class="str">"meta-llama/Llama-3.1-8B-Instruct"</span>'
+ '\ntokenizer = <span class="fn">AutoTokenizer</span>.<span class="fn">from_pretrained</span>(model_id)'
+ '\nmodel = <span class="fn">AutoModelForCausalLM</span>.<span class="fn">from_pretrained</span>(model_id, torch_dtype=torch.bfloat16, device_map=<span class="str">"auto"</span>)'
+ '\n'
+ '\nmessages = [{'
+ '\n    <span class="str">"role"</span>: <span class="str">"user"</span>,'
+ '\n    <span class="str">"content"</span>: <span class="str">"Bu yorum olumlu mu olumsuz mu? Sadece tek kelime: \'Ürün harika, çok beğendim\'"</span>'
+ '\n}]'
+ '\nprompt = tokenizer.<span class="fn">apply_chat_template</span>(messages, tokenize=<span class="kw">False</span>, add_generation_prompt=<span class="kw">True</span>)'
+ '\ninputs = <span class="fn">tokenizer</span>(prompt, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)'
+ '\n'
+ '\noutput = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">10</span>)'
+ '\n<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(output[<span class="num">0</span>][inputs.input_ids.<span class="fn">shape</span>[<span class="num">1</span>]:], skip_special_tokens=<span class="kw">True</span>))</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BERT/transformers yerine `df_reviews` üzerinde TF-IDF + LogisticRegression — aynı son görev: metin → etiket.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Llama 3.1 8B modelini yerel olarak yükler (HuggingFace üzerinden). Sohbet formatına uygun bir prompt hazırlar, generate çağrısıyla cevap üretir. <code>bfloat16</code> bellek kullanımını yarıya indirir, <code>device_map="auto"</code> GPU varsa otomatik kullanır. Çıktı sadece yeni üretilen token\'larla sınırlandırılır.</p>'

+ '<h3 class="l-subtitle">LoRA fine-tune — peft kütüphanesi</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> peft ile LoRA fine-tune iskeleti</div><div class="code-block"><pre><code><span class="kw">from</span> peft <span class="kw">import</span> LoraConfig, get_peft_model'
+ '\n<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM'
+ '\n'
+ '\nbase = <span class="fn">AutoModelForCausalLM</span>.<span class="fn">from_pretrained</span>(<span class="str">"meta-llama/Llama-3.1-8B"</span>)'
+ '\n'
+ '\nlora_cfg = <span class="fn">LoraConfig</span>('
+ '\n    r=<span class="num">16</span>,                          <span class="cm"># LoRA rank</span>'
+ '\n    lora_alpha=<span class="num">32</span>,'
+ '\n    target_modules=[<span class="str">"q_proj"</span>, <span class="str">"v_proj"</span>],  <span class="cm"># attention\'ın Q ve V projeksiyonları</span>'
+ '\n    lora_dropout=<span class="num">0.05</span>,'
+ '\n    task_type=<span class="str">"CAUSAL_LM"</span>,'
+ '\n)'
+ '\n'
+ '\nmodel = <span class="fn">get_peft_model</span>(base, lora_cfg)'
+ '\nmodel.<span class="fn">print_trainable_parameters</span>()'
+ '\n<span class="cm"># trainable params: 8,388,608 || all params: 8,038,049,792 || trainable%: 0.10</span>'
+ '\n<span class="cm"># Sadece %0.1\'i eğitiliyor — bu yüzden tek GPU\'da çalışıyor</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser\'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">BERT/transformers yerine `df_reviews` üzerinde TF-IDF + LogisticRegression — aynı son görev: metin → etiket.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>Bu kod ne yapar:</strong> Tam Llama 8B modelini alıp üzerine LoRA "yamalarını" yerleştirir. Sadece attention\'daki Q ve V projeksiyon ağırlıklarına LoRA eklenir (deneysel olarak en etkili yer). Eğitilebilir parametre sayısı orijinalinden 1000x az — toplam 8.4M parametre. Sıradan bir GPU\'da bile birkaç saatte fine-tune edebilirsin.</p>'

+ '<h2 class="l-title">9. LLM\'lerin Sınırları</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Halüsinasyon:</strong> Bilmediği şeyi "biliyorum" gibi söyleyebilir. Önemli kararlar için doğrulama gerekli.</li>'
+ '<li><strong>Eski bilgi:</strong> Eğitim kesimi vardır. 2026 olayları 2024 modelinde olmaz. RAG (<a href="/tutorials/ai/nlp/applied-nlp">Ders 12</a>) bunu çözer.</li>'
+ '<li><strong>Akıl yürütme sınırlı:</strong> Çok adımlı matematik veya planlamada hatalar.</li>'
+ '<li><strong>Maliyet:</strong> API çağrısı başına ücret + gecikme. Yüksek hacimde fine-tune\'lu küçük model daha ucuz olur.</li>'
+ '<li><strong>Bias ve güvenlik:</strong> Eğitim verisindeki önyargılar yansır. Üretim sistemlerinde içerik filtreleri ve değerlendirme kritik.</li>'
+ '<li><strong>Dil eşitsizliği:</strong> İngilizce diğer dillerden çok daha iyi. Türkçe için iyi ama best-in-class değil.</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-llm-tr" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Naive Bayes (klasik)","BERTurk fine-tune","Llama-3 8B zero-shot","GPT-4 zero-shot","BERTurk + LoRA + 1k örnek"];'
+ 'var f1=[0.84,0.93,0.86,0.92,0.95];'
+ 'var t1={x:k,y:f1,type:"bar",marker:{color:T.accent},text:f1.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"F1",range:[0.7,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-llm-tr"))Plotly.newPlot("plot-llm-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>Bu grafik ne anlatıyor:</strong> Aynı Türkçe sentiment görevi farklı yöntemlerle. Klasik Naive Bayes %84\'e ulaşır. BERTurk fine-tune %93. Llama-3 8B zero-shot (hiç eğitim verisi göstermeden, sadece prompt) %86. GPT-4 zero-shot %92. En iyi sonuç: az veriyle (1000 örnek) BERTurk + LoRA fine-tune — %95. <em>Daha büyük model her zaman en iyi değildir; doğru veri ile fine-tune edilmiş orta boy model genelde kazanır.</em></div>'

+ '<h2 class="l-title">10. Pratik Mimari Kararları</h2>'

+ '<p class="l-text">Bir LLM projesinde mimari karar şu sırayı takip eder:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Önce zero-shot dene.</strong> Doğru prompt + GPT-4/Claude → işe yarıyorsa dur. Hiç eğitim yok.</li>'
+ '<li><strong>Few-shot ekle.</strong> Promptta 3-5 örnek göster. Genelde +%5-10 kazanım.</li>'
+ '<li><strong>RAG (Ders 12).</strong> Modelin bilmediği iç verilere ihtiyaç varsa.</li>'
+ '<li><strong>Fine-tune.</strong> Hâlâ kalite eksikse 1000-5000 örnekle LoRA fine-tune. BERTurk klasik görevler için, Llama üretim için.</li>'
+ '<li><strong>Sıfırdan eğitim.</strong> Çok özel bir alan ve milyonlarca etiketli veri varsa. Çoğu zaman gereksiz.</li>'
+ '</ol>'

+ '<h2 class="l-title">11. Bir Sonraki Adım</h2>'

+ '<p class="l-text">LLM\'in mimari ve eğitim hikayesini öğrendin. Şimdi bunlar gerçek üretim sistemlerinde nasıl kullanılıyor — tek bir prompt çağrısının çok ötesinde — onu göreceksin. <a href="/tutorials/ai/nlp/applied-nlp">Ders 12</a>: <strong>RAG, ajanlar, çok dilli NLP, etik ve uçtan uca proje şablonu</strong>. Bu kursun final dersi, öğrendiğin her şeyi gerçek uygulamada birleştirir.</p>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> LLM\'in ne olduğunu, parametre ölçeklerinin nasıl patladığını öğrendin. Scaling laws ve emergent yetenekleri (few-shot, chain-of-thought) gördün. Üç aşamalı LLM eğitim hattını (pretrain → SFT → RLHF/DPO) anladın. Prompt engineering temellerini (zero-shot, few-shot, CoT) tanıdın. LoRA\'nın az kaynakla fine-tune\'u nasıl mümkün kıldığını öğrendin. Türkçe LLM manzarasını ve pratik öneri sıralamasını gördün. Anthropic API, Llama yerel ve peft LoRA için gerçek kod yazdın. LLM\'lerin sınırlarını ve mimari karar sıralamasını kavradın.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> In <a href="/tutorials/ai/nlp/transformers-bert">Lesson 10</a> we covered the Transformer and the BERT/GPT base models. Now we move to <strong>large language models (LLMs)</strong>: GPT-3, GPT-4, Claude, Llama — models with hundreds of billions of parameters. How scale produced quality (scaling laws), how instruction-tuning and RLHF aligned them with human preferences, how LoRA enables low-resource fine-tuning, what prompt engineering is, and where emergent capabilities hit their limits.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Compare GPT-3, GPT-4, Claude, and Llama by parameter count, data, and compute</li>'
+ '<li>Reason about the optimal data/parameter ratio with the Chinchilla scaling law</li>'
+ '<li>Understand how instruction tuning and RLHF align LLMs with human preferences</li>'
+ '<li>Apply parameter-efficient fine-tuning with LoRA and QLoRA on a single GPU</li>'
+ '<li>Use few-shot, chain-of-thought, and ReAct prompt engineering techniques</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. What is an LLM?</h2>'

+ '<p class="l-text">A <strong>large language model (LLM)</strong> is a Transformer with billions of parameters, pretrained on enormous text corpora. Architecturally identical to the GPT we saw in <a href="/tutorials/ai/nlp/transformers-bert">Lesson 10</a> — just much bigger, trained on much more diverse data, for much longer.</p>'

+ '<div class="calc-example"><div class="example-label">PARAMETER SCALES</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Model</th><th style="padding:.5rem">Parameters</th><th style="padding:.5rem">Year</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">BERT-base</td><td style="text-align:center">110 M</td><td style="text-align:center">2018</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">GPT-2</td><td style="text-align:center">1.5 B</td><td style="text-align:center">2019</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">GPT-3</td><td style="text-align:center">175 B</td><td style="text-align:center">2020</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">PaLM, GPT-4</td><td style="text-align:center">~500 B-1.7 T</td><td style="text-align:center">2022-2023</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.1 (405B)</td><td style="text-align:center">405 B (open)</td><td style="text-align:center">2024</td></tr>'
+ '<tr><td style="padding:.5rem">Modern frontier (2026)</td><td style="text-align:center">2 T+</td><td style="text-align:center">2025-2026</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<p class="l-text">B = billion, T = trillion. From BERT to GPT-4, a 10000x increase over six years. Training data and compute exploded together with model size.</p>'

+ '<h2 class="l-title">2. Scaling Laws — Why Scale Matters</h2>'

+ '<p class="l-text">Kaplan et al. (2020), then Hoffmann et al. (Chinchilla, 2022) formalised <strong>scaling laws</strong>: model performance (test loss) follows <em>power-law</em> relationships with parameter count, training data, and compute.</p>'

+ '<div class="katex-block">$$L(N, D) \\approx \\Bigl( \\frac{N_c}{N} \\Bigr)^{\\alpha_N} + \\Bigl( \\frac{D_c}{D} \\Bigr)^{\\alpha_D}$$</div>'

+ '<p class="l-text">Where <em>L</em> is loss, <em>N</em> is parameters, <em>D</em> is tokens. Practical takeaways:</p>'

+ '<ul class="l-list">'
+ '<li><strong>More parameters = better model</strong> — only if data and compute scale too.</li>'
+ '<li><strong>Chinchilla finding:</strong> GPT-3 was actually "undertrained". With the same parameters and 4x more data it would have been better.</li>'
+ '<li>Modern models (Llama 3, GPT-4) balance parameters/data/compute.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Emergent abilities</h3>'

+ '<p class="l-text">Once scale crosses certain thresholds, <strong>unexpected abilities</strong> appear — capabilities absent in small models that suddenly emerge in large ones.</p>'

+ '<ul class="l-list">'
+ '<li><strong>Few-shot learning:</strong> adapting to a new task from 2-3 examples.</li>'
+ '<li><strong>Chain-of-thought:</strong> step-by-step reasoning.</li>'
+ '<li><strong>Code generation:</strong> turning natural language into Python/SQL.</li>'
+ '<li><strong>Multilingual transfer:</strong> models trained mainly on English working reasonably for Turkish.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Three-Stage Training — Pretrain, SFT, RLHF</h2>'

+ '<p class="l-text">Modern LLMs typically train in three stages:</p>'

+ '<h3 class="l-subtitle">Stage 1: Pre-training</h3>'

+ '<p class="l-text">Next-token prediction on huge web text (<a href="/tutorials/ai/nlp/language-models">Lesson 8</a>). Trillions of tokens; the model learns language structure and a large slice of world knowledge. But it does not yet "follow instructions" — it just continues text.</p>'

+ '<h3 class="l-subtitle">Stage 2: Supervised Fine-Tuning (SFT)</h3>'

+ '<p class="l-text">The pretrained model is fine-tuned on a dataset of <strong>(instruction, ideal answer)</strong> pairs. Data quality is critical — for InstructGPT, OpenAI collected tens of thousands of high-quality human-written examples. The model now resembles an "instruction-following assistant".</p>'

+ '<h3 class="l-subtitle">Stage 3: RLHF (Reinforcement Learning from Human Feedback)</h3>'

+ '<p class="l-text">SFT models give good answers, but what does "good" mean? RLHF learns this from human preference:</p>'

+ '<ol class="l-list">'
+ '<li>Generate two answers from the model for the same prompt.</li>'
+ '<li>Ask a human evaluator: which is better?</li>'
+ '<li>Train a <strong>reward model</strong> from those pairs — a separate Transformer that scores answers.</li>'
+ '<li>Update the main model with RL (PPO algorithm) to maximise the reward model.</li>'
+ '</ol>'

+ '<p class="l-text">Result: the model produces not just "correct" but <em>human-preferred</em> answers. ChatGPT\'s success rests on this.</p>'

+ '<h3 class="l-subtitle">Alternative: DPO</h3>'

+ '<p class="l-text"><strong>Direct Preference Optimization (DPO, 2023)</strong> uses preferences directly without explicitly training a reward model. Computationally simpler, often comparable quality. Llama 3 and most subsequent open-source models use DPO or variants.</p>'

+ '<h2 class="l-title">4. Prompt Engineering — Getting the Model to Speak</h2>'

+ '<p class="l-text">LLMs follow instructions, but how the instruction is phrased dramatically affects the result. <strong>Prompt engineering</strong> is the craft of writing the right instruction.</p>'

+ '<h3 class="l-subtitle">Zero-shot, few-shot, chain-of-thought</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Zero-shot:</strong> just an instruction. <em>"Classify the sentiment of this review: Movie was amazing."</em></li>'
+ '<li><strong>Few-shot:</strong> instruction + a few examples. The model picks up the pattern from the examples.</li>'
+ '<li><strong>Chain-of-thought (CoT):</strong> "Think step by step." Big improvement on complex problems.</li>'
+ '</ul>'

+ '<div class="calc-example"><div class="example-label">CHAIN-OF-THOUGHT EXAMPLE</div><div class="example-body">'
+ '<p class="l-text"><strong>Prompt:</strong> "A café has 6 chairs in the lobby and 4 chairs per table. If there are 18 chairs total, how many tables? <em>Think step by step.</em>"</p>'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7"><strong>Model output:</strong>'
+ '<br>1. The 6 lobby chairs are not at tables.'
+ '<br>2. Chairs at tables = 18 - 6 = 12.'
+ '<br>3. 4 per table → 12 / 4 = 3 tables.</p>'
+ '<p class="l-text">Without CoT the model probably says "18/4 = 4.5", wrong. With CoT the reasoning is explicit and the answer is correct.</p>'
+ '</div></div>'

+ '<h2 class="l-title">5. LoRA — Fine-Tuning with Few Resources</h2>'

+ '<p class="l-text">Full fine-tuning a 175B parameter model needs 100+ GPUs — out of reach for most. <strong>LoRA (Low-Rank Adaptation, 2021)</strong> elegantly solves this.</p>'

+ '<p class="l-text">Intuition: during fine-tuning, weight matrices change very little — the changes are mostly <em>low-rank</em>. So instead of <em>W → W + ΔW</em>, parameterise <em>ΔW</em> as the product of two small matrices:</p>'

+ '<div class="katex-block">$$\\Delta W = B A, \\quad B \\in \\mathbb{R}^{d \\times r}, \\quad A \\in \\mathbb{R}^{r \\times k}, \\quad r \\ll d$$</div>'

+ '<p class="l-text">Typical <em>r = 8</em> or <em>16</em>. The number of trainable parameters drops 1000x. As a result:</p>'

+ '<ul class="l-list">'
+ '<li>Fine-tune a 7B model on a single GPU.</li>'
+ '<li>Keep separate LoRA weights for different tasks — the base model is frozen, only small "patches" change.</li>'
+ '<li>No catastrophic forgetting — adapt without breaking the base.</li>'
+ '</ul>'

+ '<p class="l-text"><strong>QLoRA (2023)</strong> adds 4-bit quantisation on top — even the base model is compressed. Fine-tuning a 70B model on a single 24GB GPU becomes feasible.</p>'

+ '<h2 class="l-title">6. Turkish LLM Landscape</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Multilingual frontier models:</strong> GPT-4, Claude, Llama-3, Gemini — trained on huge multilingual corpora that include Turkish. Latest generations work well in practice.</li>'
+ '<li><strong>Turkish-specialised open models:</strong> Trendyol-LLM (Llama-based), KanarYa, TurkishLLama — fine-tuned on Turkish text.</li>'
+ '<li><strong>From-scratch Turkish-only models:</strong> still rare; data and compute are scarce.</li>'
+ '<li><strong>Practical recommendation:</strong> for most tasks, the shortest path is a general LLM (GPT-4, Claude) + good prompts + RAG when needed (<a href="/tutorials/ai/nlp/applied-nlp">Lesson 12</a>). For full local control, fine-tune Llama-3 or Mistral.</li>'
+ '</ul>'

+ '<h2 class="l-title">7. Open-Weight Frontier — Llama, DeepSeek, Qwen</h2>'

+ '<p class="l-text">The 2024-2025 stretch radically reshaped the landscape that closed APIs (GPT-4, Claude, Gemini) had dominated. <strong>Open-weight models</strong> — models whose weights you can download and run on your own hardware — caught up to frontier quality. This marks a new era for NLP: customisable, private, and sovereignty-friendly AI.</p>'

+ '<h3 class="l-subtitle">The Llama family — Meta\'s open line</h3>'

+ '<p class="l-text">Llama is the backbone of the open-weight ecosystem. Each release outpaced the previous:</p>'

+ '<div class="calc-example"><div class="example-label">LLAMA RELEASE TIMELINE</div><div class="example-body">'
+ '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.92rem">'
+ '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:.5rem;color:var(--accent)">Version</th><th style="padding:.5rem">Date</th><th style="padding:.5rem">Sizes</th><th style="text-align:left;padding:.5rem">Highlights</th></tr></thead>'
+ '<tbody>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 1</td><td style="text-align:center">Feb 2023</td><td style="text-align:center">7B-65B</td><td style="padding:.5rem">Research-only license; leaked, triggered the ecosystem</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 2</td><td style="text-align:center">Jul 2023</td><td style="text-align:center">7B-70B</td><td style="padding:.5rem">First real commercial license, RLHF chat variant</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3</td><td style="text-align:center">Apr 2024</td><td style="text-align:center">8B, 70B</td><td style="padding:.5rem">15T-token training; first small model to beat GPT-3.5</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.1</td><td style="text-align:center">Jul 2024</td><td style="text-align:center">8B, 70B, <strong>405B</strong></td><td style="padding:.5rem">First open-weight frontier model; multilingual, 128K context</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.2</td><td style="text-align:center">Sep 2024</td><td style="text-align:center">1B, 3B, 11B, 90B</td><td style="padding:.5rem">Vision (11B/90B) + edge models for phones (1B/3B)</td></tr>'
+ '<tr style="border-bottom:1px solid var(--border)"><td style="padding:.5rem">Llama 3.3</td><td style="text-align:center">Dec 2024</td><td style="text-align:center">70B</td><td style="padding:.5rem">70B reaches 405B quality — efficiency leap</td></tr>'
+ '<tr><td style="padding:.5rem">Llama 4</td><td style="text-align:center">2025</td><td style="text-align:center">MoE</td><td style="padding:.5rem">Natively multimodal (image+audio+text), Mixture-of-Experts</td></tr>'
+ '</tbody></table></div>'
+ '</div></div>'

+ '<p class="l-text">Llama 3.3 70B is especially striking: a <em>seven times smaller</em> model roughly matches the 405B version. This shows how much of the gain came from architecture and training-data improvements — not just "make it bigger". You also need "train it smarter".</p>'

+ '<h3 class="l-subtitle">DeepSeek-V3 — the disruptive blow from China</h3>'

+ '<p class="l-text">In December 2024 DeepSeek (the AI lab of a Hong Kong hedge fund) released a model that shook the industry: <strong>DeepSeek-V3</strong>. Why the surprise release made such an impact:</p>'

+ '<ul class="l-list">'
+ '<li><strong>671B total, 37B active parameters:</strong> Mixture-of-Experts (MoE). Only a small fraction of "expert" sub-models runs per token. Total capacity is huge, inference cost is small.</li>'
+ '<li><strong>~$5.5M training cost:</strong> roughly 20x cheaper than OpenAI\'s estimated $100M+ for GPT-4. Trained on H800 GPUs despite US export restrictions.</li>'
+ '<li><strong>Multi-Token Prediction (MTP) objective:</strong> the model predicts multiple future tokens at each step rather than just one — strengthens the learning signal during training.</li>'
+ '<li><strong>MIT licence:</strong> fully free — commercial use, modification, even resale allowed. Matches GPT-4 closely, ties or exceeds on several benchmarks.</li>'
+ '<li><strong>DeepSeek-R1:</strong> reasoning variant built on V3 (Jan 2025) — covered in <a href="/tutorials/ai/nlp/reasoning-models">Lesson 14</a>.</li>'
+ '</ul>'

+ '<p class="l-text">The real message of DeepSeek-V3: <em>frontier AI is no longer the exclusive turf of multi-billion-dollar closed labs</em>. The right architecture and smart training can get close to frontier with far less. This sparked the efficiency-research wave that defined 2025.</p>'

+ '<h3 class="l-subtitle">Other notable open models</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Qwen 2.5 / Qwen 3 (Alibaba):</strong> 0.5B to 72B, very strong on code and math. Balanced in Chinese and English; in Turkish performs close to Llama.</li>'
+ '<li><strong>Mistral Large 2 (France):</strong> 123B parameters, Europe-based development. Multilingual focus (French, German, Spanish top-tier). Mistral 7B and Mixtral 8x7B remain small-model standards.</li>'
+ '<li><strong>Gemma 2 / 3 (Google):</strong> 2B, 9B, 27B. The "small open sibling" of Gemini; efficiency-focused.</li>'
+ '<li><strong>Phi-3 / Phi-4 (Microsoft):</strong> small (3-14B) but trained on "textbook-quality" synthetic data. Very strong reasoning for their size.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Why open weights matter</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Privacy:</strong> sensitive data (medical, legal, internal) never leaves your servers. The model runs in your VPC.</li>'
+ '<li><strong>Cost:</strong> no per-token fees. At high volume self-hosting wins decisively.</li>'
+ '<li><strong>Customisation:</strong> fine-tune and distil freely. Build small domain-specific variants.</li>'
+ '<li><strong>Sovereignty:</strong> the foundation for national/regional models. Turkey, India, the EU build their own from open bases.</li>'
+ '<li><strong>Research:</strong> reproducibility. You can\'t do real science with closed models — you can\'t inspect the weights.</li>'
+ '<li><strong>Transparency:</strong> bias auditing, safety research, and red-teaming all require visible weights.</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-nlp11-openllm-en" style="width:100%;height:400px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var names=["Llama 3.1 8B","Llama 3.3 70B","Llama 3.1 405B","DeepSeek-V3 (37B active)","Qwen 2.5 72B","Mistral Large 2 (123B)","GPT-4o (closed)","Claude Sonnet 4 (closed)"];'
+ 'var active=[8,70,405,37,72,123,200,200];'
+ 'var mmlu=[68,82,87,88,84,84,88,89];'
+ 'var colors=["#4ecdc4","#4ecdc4","#4ecdc4","#ff9966","#c8a96e","#9b87ff","#888","#888"];'
+ 'var trace={x:active,y:mmlu,mode:"markers+text",type:"scatter",text:names,textposition:"top center",marker:{size:14,color:colors,line:{color:T.text,width:1}},textfont:{size:11,color:T.text}};'
+ 'var layout={xaxis:{type:"log",title:"Active parameters (B, log scale)",color:T.text,gridcolor:T.grid},yaxis:{title:"MMLU (%)",color:T.text,gridcolor:T.grid,range:[60,95]},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:60,l:60},showlegend:false};'
+ 'if(document.getElementById("plot-nlp11-openllm-en"))Plotly.newPlot("plot-nlp11-openllm-en",[trace],layout,{responsive:true,displayModeBar:false});'
+ '});},250)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Active parameter count (log scale) versus MMLU benchmark score. Cyan points are the Llama family, orange is DeepSeek-V3 (MoE — only 37B active), gold Qwen, purple Mistral, grey the closed frontier (GPT-4o, Claude). <em>DeepSeek-V3 reaches closed-frontier quality with very few active parameters — the power of MoE.</em> Llama 3.3 70B nearly matches 405B; the win of "smaller but trained smarter".</div>'

+ '<h3 class="l-subtitle">Practical: running Llama 3.3 70B locally</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Llama 3.3 70B via Hugging Face</div><div class="code-block"><pre><code><span class="cm"># Full precision needs ~140GB VRAM (4xH100). Quantised to 4-bit it drops</span>'
+ '\n<span class="cm"># to ~40GB and runs on a single A100 80GB or 2xRTX 4090.</span>'
+ '\n<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM'
+ '\n'
+ '\nmodel_id = <span class="str">"meta-llama/Llama-3.3-70B-Instruct"</span>'
+ '\ntok = <span class="fn">AutoTokenizer</span>.<span class="fn">from_pretrained</span>(model_id)'
+ '\nmodel = <span class="fn">AutoModelForCausalLM</span>.<span class="fn">from_pretrained</span>('
+ '\n    model_id,'
+ '\n    device_map=<span class="str">"auto"</span>,'
+ '\n    torch_dtype=<span class="str">"auto"</span>,        <span class="cm"># bfloat16 auto-selected</span>'
+ '\n    <span class="cm"># load_in_4bit=True,        # 4-bit quantisation via BitsAndBytes</span>'
+ '\n)'
+ '\n'
+ '\nmsgs = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"In one paragraph: why do open-weight models matter for AI?"</span>}]'
+ '\nprompt = tok.<span class="fn">apply_chat_template</span>(msgs, tokenize=<span class="kw">False</span>, add_generation_prompt=<span class="kw">True</span>)'
+ '\ninputs = <span class="fn">tok</span>(prompt, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(model.device)'
+ '\nout = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">300</span>, temperature=<span class="num">0.7</span>)'
+ '\n<span class="fn">print</span>(tok.<span class="fn">decode</span>(out[<span class="num">0</span>][inputs.input_ids.<span class="fn">shape</span>[<span class="num">1</span>]:], skip_special_tokens=<span class="kw">True</span>))</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Downloads Llama 3.3 70B Instruct from Hugging Face and starts it locally. <code>device_map="auto"</code> shards parameters across multiple GPUs if available. Enabling <code>load_in_4bit</code> quantises the model to 4 bits — memory needs drop roughly 4x with typically only 1-2% quality loss. The chat-formatted prompt yields a generated reply. The same API works for DeepSeek-V3 or Qwen 2.5 just by swapping <code>model_id</code>.</p>'

+ '<h2 class="l-title">8. Using LLMs in Python</h2>'

+ '<h3 class="l-subtitle">API-based (OpenAI, Anthropic)</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Sentiment with the Anthropic Claude API</div><div class="code-block"><pre><code><span class="kw">import</span> anthropic'
+ '\n'
+ '\nclient = anthropic.<span class="fn">Anthropic</span>()'
+ '\n'
+ '\nreview = <span class="str">"The product is great, shipping was fast"</span>'
+ '\n'
+ '\nresponse = client.messages.<span class="fn">create</span>('
+ '\n    model=<span class="str">"claude-sonnet-4-6"</span>,'
+ '\n    max_tokens=<span class="num">100</span>,'
+ '\n    messages=[{'
+ '\n        <span class="str">"role"</span>: <span class="str">"user"</span>,'
+ '\n        <span class="str">"content"</span>: <span class="str">f"Classify the sentiment of this review (positive/negative/neutral) in one word:\\n{review}"</span>'
+ '\n    }]'
+ '\n)'
+ '\n<span class="fn">print</span>(response.content[<span class="num">0</span>].text)'
+ '\n<span class="cm"># positive</span></code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Calls Anthropic\'s Claude with a prompt. Instruction: "classify the sentiment". The model follows the instruction and returns a one-word answer. Zero training data labelled, zero models trained — only a well-written prompt. Where classical ML would take hours to reach 85%, an LLM gets similar quality in seconds.</p>'

+ '<h3 class="l-subtitle">Open model — Llama (local)</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> Llama generation with transformers</div><div class="code-block"><pre><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM'
+ '\n<span class="kw">import</span> torch'
+ '\n'
+ '\nmodel_id = <span class="str">"meta-llama/Llama-3.1-8B-Instruct"</span>'
+ '\ntokenizer = <span class="fn">AutoTokenizer</span>.<span class="fn">from_pretrained</span>(model_id)'
+ '\nmodel = <span class="fn">AutoModelForCausalLM</span>.<span class="fn">from_pretrained</span>(model_id, torch_dtype=torch.bfloat16, device_map=<span class="str">"auto"</span>)'
+ '\n'
+ '\nmessages = [{'
+ '\n    <span class="str">"role"</span>: <span class="str">"user"</span>,'
+ '\n    <span class="str">"content"</span>: <span class="str">"Is this review positive or negative? One word: \'Product is great, loved it\'"</span>'
+ '\n}]'
+ '\nprompt = tokenizer.<span class="fn">apply_chat_template</span>(messages, tokenize=<span class="kw">False</span>, add_generation_prompt=<span class="kw">True</span>)'
+ '\ninputs = <span class="fn">tokenizer</span>(prompt, return_tensors=<span class="str">"pt"</span>).<span class="fn">to</span>(<span class="str">"cuda"</span>)'
+ '\n'
+ '\noutput = model.<span class="fn">generate</span>(**inputs, max_new_tokens=<span class="num">10</span>)'
+ '\n<span class="fn">print</span>(tokenizer.<span class="fn">decode</span>(output[<span class="num">0</span>][inputs.input_ids.<span class="fn">shape</span>[<span class="num">1</span>]:], skip_special_tokens=<span class="kw">True</span>))</code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Replace BERT/transformers with TF-IDF + LogisticRegression on `df_reviews` — same end-task: text → label.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Loads Llama 3.1 8B locally (via HuggingFace). Builds a chat-format prompt and calls generate. <code>bfloat16</code> halves memory; <code>device_map="auto"</code> uses GPU if available. The output slice keeps only the newly generated tokens.</p>'

+ '<h3 class="l-subtitle">LoRA fine-tuning — peft</h3>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span> LoRA fine-tune skeleton with peft</div><div class="code-block"><pre><code><span class="kw">from</span> peft <span class="kw">import</span> LoraConfig, get_peft_model'
+ '\n<span class="kw">from</span> transformers <span class="kw">import</span> AutoModelForCausalLM'
+ '\n'
+ '\nbase = <span class="fn">AutoModelForCausalLM</span>.<span class="fn">from_pretrained</span>(<span class="str">"meta-llama/Llama-3.1-8B"</span>)'
+ '\n'
+ '\nlora_cfg = <span class="fn">LoraConfig</span>('
+ '\n    r=<span class="num">16</span>,                          <span class="cm"># LoRA rank</span>'
+ '\n    lora_alpha=<span class="num">32</span>,'
+ '\n    target_modules=[<span class="str">"q_proj"</span>, <span class="str">"v_proj"</span>],  <span class="cm"># attention Q and V projections</span>'
+ '\n    lora_dropout=<span class="num">0.05</span>,'
+ '\n    task_type=<span class="str">"CAUSAL_LM"</span>,'
+ '\n)'
+ '\n'
+ '\nmodel = <span class="fn">get_peft_model</span>(base, lora_cfg)'
+ '\nmodel.<span class="fn">print_trainable_parameters</span>()'
+ '\n<span class="cm"># trainable params: 8,388,608 || all params: 8,038,049,792 || trainable%: 0.10</span>'
+ '\n<span class="cm"># Only 0.1% is trained — that is why it fits on one GPU</span></code></pre></div></div>'
+ '<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Replace BERT/transformers with TF-IDF + LogisticRegression on `df_reviews` — same end-task: text → label.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code>from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX_text = df_reviews[\'text\'].astype(str).values\ny      = df_reviews[\'sentiment\'].values\n\nXtr, Xte, ytr, yte = train_test_split(X_text, y, test_size=0.3, random_state=0, stratify=y)\n\nvec = TfidfVectorizer(max_features=2000, ngram_range=(1,2)).fit(Xtr)\nclf = LogisticRegression(max_iter=400).fit(vec.transform(Xtr), ytr)\n\nprint(\'train acc:\', round(clf.score(vec.transform(Xtr), ytr), 3))\nprint(\'test  acc:\', round(clf.score(vec.transform(Xte), yte), 3))\nprint(\'sample :\', clf.predict(vec.transform([\'this movie was amazing\']))[0])</code></pre></div></div>'

+ '<p class="l-text"><strong>What this code does:</strong> Wraps a full Llama 8B with LoRA "patches". LoRA is added only to the Q and V projection weights inside attention (empirically the most effective places). Trainable parameter count drops 1000x — total 8.4M. Fine-tunable in a few hours even on a regular GPU.</p>'

+ '<h2 class="l-title">9. Limits of LLMs</h2>'

+ '<ul class="l-list">'
+ '<li><strong>Hallucinations:</strong> can confidently say things that are wrong. Critical decisions need verification.</li>'
+ '<li><strong>Stale knowledge:</strong> training has a cutoff. Events after 2024 do not exist for a 2024-trained model. RAG (<a href="/tutorials/ai/nlp/applied-nlp">Lesson 12</a>) fixes this.</li>'
+ '<li><strong>Limited reasoning:</strong> errors on multi-step math or planning.</li>'
+ '<li><strong>Cost:</strong> API calls have per-token pricing and latency. At high volume, a small fine-tuned model is cheaper.</li>'
+ '<li><strong>Bias and safety:</strong> training data biases reflect into output. Production systems need content filters and evaluation.</li>'
+ '<li><strong>Language gap:</strong> English is much better served than other languages. Turkish is good but not best-in-class.</li>'
+ '</ul>'

+ '<div class="plotly-graph"><div id="plot-llm-en" style="width:100%;height:380px;"></div></div>'
+ '<script>setTimeout(function(){window.__nlpRegDraw(function(){'
+ 'var T=window.__nlpChartTheme();'
+ 'var k=["Naive Bayes (classical)","BERTurk fine-tune","Llama-3 8B zero-shot","GPT-4 zero-shot","BERTurk + LoRA + 1k examples"];'
+ 'var f1=[0.84,0.93,0.86,0.92,0.95];'
+ 'var t1={x:k,y:f1,type:"bar",marker:{color:T.accent},text:f1.map(function(v){return (v*100).toFixed(0)+"%";}),textposition:"outside"};'
+ 'var layout={xaxis:{color:T.text,gridcolor:T.grid,tickangle:-15},yaxis:{color:T.text,gridcolor:T.grid,title:"F1",range:[0.7,1.0],tickformat:".0%"},paper_bgcolor:T.paper,plot_bgcolor:T.plot,font:{color:T.text,size:11},margin:{t:60,r:30,b:90,l:60}};'
+ 'if(document.getElementById("plot-llm-en"))Plotly.newPlot("plot-llm-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '});},200)</script>'
+ '<div class="graph-caption" style="text-align:center;color:var(--text-dim);font-size:.92rem;margin-top:.5rem"><strong>What this graph shows:</strong> Same Turkish sentiment task across methods. Classical Naive Bayes reaches 84%. BERTurk fine-tune 93%. Llama-3 8B zero-shot (no examples, only prompt) 86%. GPT-4 zero-shot 92%. The best: small data (1k examples) + BERTurk LoRA fine-tune at 95%. <em>Bigger model is not always best; the right data plus fine-tuning a mid-size model often wins.</em></div>'

+ '<h2 class="l-title">10. Practical Architecture Decisions</h2>'

+ '<p class="l-text">In an LLM project, the decision order is typically:</p>'

+ '<ol class="l-list">'
+ '<li><strong>Try zero-shot first.</strong> Good prompt + GPT-4/Claude → if it works, stop. No training.</li>'
+ '<li><strong>Add few-shot.</strong> 3-5 examples in the prompt. Usually +5-10%.</li>'
+ '<li><strong>RAG (Lesson 12).</strong> If the model needs internal data it does not know.</li>'
+ '<li><strong>Fine-tune.</strong> If quality is still short, LoRA fine-tune with 1-5k examples. BERTurk for classical tasks, Llama for generation.</li>'
+ '<li><strong>Train from scratch.</strong> Only for very specialised domains with millions of labelled examples. Rarely necessary.</li>'
+ '</ol>'

+ '<h2 class="l-title">11. What\'s Next</h2>'

+ '<p class="l-text">You now know the LLM architecture and training story. Next we look at how they are used in real production systems — far beyond a single prompt call. <a href="/tutorials/ai/nlp/applied-nlp">Lesson 12</a>: <strong>RAG, agents, multilingual NLP, ethics, and an end-to-end project template</strong>. The final lesson of this course brings everything together for real applications.</p>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> What an LLM is and how parameter scales exploded. Scaling laws and emergent abilities (few-shot, chain-of-thought). The three-stage LLM pipeline (pretrain → SFT → RLHF/DPO). Prompt engineering basics (zero-shot, few-shot, CoT). How LoRA enables low-resource fine-tuning. The Turkish LLM landscape and a practical decision order. Real code with the Anthropic API, local Llama, and peft LoRA. The limits of LLMs and the architecture decision sequence.</div>'

};
