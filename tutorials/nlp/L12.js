/* nlp-new-L12.js — NLP Course Lesson 12: Uygulamalı NLP — RAG, Ajanlar, Etik, Üretim (TR + EN) */
var NLP_L12 = {

tr:
'<script>(function(){var g=window;g.__nlpChartDrawers=[];g.__nlpChartTheme=function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>Bu derste ne öğreneceksin:</strong> Bu kursun final dersi. 11 dersi gerçek üretim sistemlerinde nasıl birleştirileceğini görüyoruz. <strong>RAG</strong> (modelin bilmediği bilgiyi getirme), <strong>ajanlar</strong> (LLM\'in araç kullanması), <strong>çok dilli NLP</strong> (Türkçe odağıyla), <strong>kapsamlı değerlendirme</strong>, <strong>etik ve sorumluluk</strong>, ve uçtan uca bir <strong>proje şablonu</strong>. Tek tek dersleri öğrendin; bu ders onları sistemler hâline getirir.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>FAISS embedding indeksiyle Retrieval-Augmented Generation (RAG) pipeline\'ı kurmayı</li>'
+ '<li>ReAct ve tool-use ile LLM ajanları tasarlamayı (LangChain veya LlamaIndex)</li>'
+ '<li>BERTurk ve mBERT ile çok dilli ve Türkçe NLP sistemleri kurmayı</li>'
+ '<li>BLEU, ROUGE, perplexity ve LLM-as-judge ile üretim sistemini değerlendirmeyi</li>'
+ '<li>NLP\'de etik, bias ve hallüsinasyon risklerini tanımayı ve azaltma stratejilerini uygulamayı</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. Üretim NLP\'sinin Gerçeği</h2>'

+ '<p class="l-text">11 ders boyunca yöntem öğrendin: sınıflandırma, çeviri, NER, embedding, transformer, LLM. Gerçek bir ürün — Trendyol\'un yorum analizi sistemi, bir sağlık asistanı, bir hukuki asistan — bu yöntemlerin üst üste yığılmış ve birbirine bağlanmış halleridir. Tek bir model yetmez:</p>'

+ '<ul class="l-list">'
+ '<li>Veri toplama ve temizleme (<a href="/tutorials/nlp/1">Ders 1</a>)</li>'
+ '<li>Vektörleştirme veya tokenizasyon (<a href="/tutorials/nlp/2">Ders 2</a>, <a href="/tutorials/nlp/5">Ders 5</a>)</li>'
+ '<li>Birden fazla model (sınıflandırıcı, NER, LM)</li>'
+ '<li>RAG, ajanlar, hata kontrolü, izleme, değerlendirme</li>'
+ '<li>Etik filtreler, gizlilik, kullanıcı geri bildirim döngüsü</li>'
+ '</ul>'

+ '<p class="l-text">Bu ders altı ana temayı işliyor: RAG, ajanlar, çok dilli/Türkçe, değerlendirme, etik, ve proje şablonu.</p>'

+ '<h2 class="l-title">2. RAG — Retrieval-Augmented Generation</h2>'

+ '<p class="l-text">LLM\'ler iki şey bilmez: (1) eğitim kesimlerinden sonraki olaylar, (2) sizin özel verilerinizi (şirket içi belgeler, kullanıcı geçmişi). <strong>RAG (Retrieval-Augmented Generation)</strong> bu boşluğu doldurur. Sezgi: sorgu zamanında ilgili belgeleri bul, prompt\'a ekle, LLM\'e cevapla.</p>'

+ '<div class="katex-block">$$P(y \\mid x) = \\sum_{d \\in \\text{top-}k} P_{\\text{retriever}}(d \\mid x) \\cdot P_{\\text{LM}}(y \\mid x, d)$$</div>'

+ '<p class="l-text">Burada <em>x</em> kullanıcı sorgusu, <em>d</em> getirilen belge, <em>y</em> üretilecek cevap. Retriever ilgili <em>k</em> belgeyi bulur, LM bunlara dayanarak cevaplar.</p>'

+ '<h3 class="l-subtitle">RAG boru hattı</h3>'

+ '<ol class="l-list">'
+ '<li><strong>İndeksleme (offline):</strong> Tüm belgeleri parçalara (chunks) böl, her birini embedding\'e çevir (Sentence-BERT, OpenAI ada gibi), bir vektör veritabanına (FAISS, Pinecone, Qdrant) yaz.</li>'
+ '<li><strong>Sorgu (online):</strong> Kullanıcı sorusunu embedding\'e çevir.</li>'
+ '<li><strong>Getirme:</strong> Vektör veritabanından en yakın <em>k=5</em> belgeyi al.</li>'
+ '<li><strong>Yeniden sıralama (opsiyonel):</strong> Cross-encoder ile bu 5 belgeyi sorgu+belge çiftleri olarak yeniden puanla. Top-3\'e indir.</li>'
+ '<li><strong>Üretim:</strong> Sorguyu + getirilen belgeleri prompt\'a koy, LLM\'e ver. <em>"Aşağıdaki belgelere dayanarak cevap ver: ..."</em></li>'
+ '</ol>'

+ '<div class="calc-example"><div class="example-label">RAG ÖRNEK PROMPT</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7">'
+ 'Aşağıdaki belgelere dayanarak şu soruyu cevapla. Belgelerde olmayan bilgiyi tahmin etme.'
+ '<br><br>'
+ 'BELGELER:'
+ '<br>[1] Trendyol kargo politikası: 50 TL üzeri ücretsiz, 1-3 iş günü teslimat.'
+ '<br>[2] Trendyol iade politikası: 14 gün içinde ücretsiz iade.'
+ '<br><br>'
+ 'SORU: 100 TL\'lik ürünün kargo ücreti nedir?'
+ '<br><br>'
+ 'CEVAP: 100 TL ürünün kargo ücreti yoktur — 50 TL üzerinde olduğu için ücretsiz teslimat geçerlidir.'
+ '</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">RAG\'ın değeri</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Güncel bilgi:</strong> Eğitim kesimlerinin ötesine geçer.</li>'
+ '<li><strong>Halüsinasyon azalır:</strong> Model belgelerden konuşur, uydurmaz.</li>'
+ '<li><strong>Kaynak gösterilebilir:</strong> Hangi belge hangi cümleyi destekliyor görünür.</li>'
+ '<li><strong>Domain uyumu:</strong> Genel bir LLM, özel verilerle özelleşir — fine-tune\'a alternatif.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. RAG\'ın Pratik Detayları</h2>'

+ '<h3 class="l-subtitle">Chunking — belgeleri nasıl bölelim?</h3>'

+ '<p class="l-text">Bir belge 100 sayfa olabilir; tamamını LLM\'e veremezsin. Bölmek lazım — ama nasıl?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Sabit boyut:</strong> Her 500 token bir chunk. Basit ama bağlamı keser.</li>'
+ '<li><strong>Örtüşmeli (overlap):</strong> Her chunk\'ın sonu sonrakinin başıyla %20 örtüşür. Bağlam kaybını azaltır.</li>'
+ '<li><strong>Anlamsal (semantic):</strong> Cümle/paragraf sınırlarına göre böl. Daha doğal ama yavaş.</li>'
+ '<li><strong>Yapısal:</strong> Markdown başlıklarına, kanun maddelerine, tıbbi rapor bölümlerine göre böl. Domain-aware.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Embedding modeli seçimi</h3>'

+ '<p class="l-text">Türkçe için iyi seçenekler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>multilingual-e5-large:</strong> 100+ dilde iyi. Açık kaynak.</li>'
+ '<li><strong>BGE-M3:</strong> Çok dilli, dense + sparse + colbert tek modelde.</li>'
+ '<li><strong>Cohere embed-multilingual-v3:</strong> API tabanlı, kalite çok iyi.</li>'
+ '<li><strong>OpenAI text-embedding-3:</strong> Genelde Türkçede de iyi.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">RAG değerlendirme — RAGAS</h3>'

+ '<p class="l-text">RAG sistemi 3 ayrı boyutta değerlendirilmeli:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Context recall:</strong> Cevap için gereken bilgi getirilen belgelerde var mı?</li>'
+ '<li><strong>Context precision:</strong> Getirilen belgeler gerçekten ilgili mi?</li>'
+ '<li><strong>Faithfulness (sadakat):</strong> Cevap getirilen belgelerle uyumlu mu, halüsinasyon yok mu?</li>'
+ '<li><strong>Answer relevance:</strong> Cevap soruyu gerçekten ele alıyor mu?</li>'
+ '</ul>'

+ '<p class="l-text"><strong>RAGAS</strong> ve <strong>ARES</strong> kütüphaneleri bu metrikleri otomatik hesaplar — kendisi de bir LLM\'i "yargıç" olarak kullanır.</p>'

+ '<h2 class="l-title">4. Ajanlar — Araç Kullanan LLM\'ler</h2>'

+ '<p class="l-text"><strong>Ajan (agent)</strong>, sadece konuşmakla kalmayan, <em>araçlar çağırarak iş yapan</em> LLM\'dir. Modern LLM\'ler "fonksiyon çağrısı" (function calling) yeteneğiyle gelir: cevap olarak metin yerine, JSON formatında bir araç çağrısı verebilir.</p>'

+ '<div class="calc-example"><div class="example-label">AJAN İŞ AKIŞI</div><div class="example-body">'
+ '<p class="l-text"><strong>Kullanıcı:</strong> "Ankara\'da bugün hava nasıl?"</p>'
+ '<p class="l-text"><strong>LLM düşünür:</strong> "Hava bilgisi gerekli. <code>get_weather(city="Ankara")</code> aracını çağırmalıyım."</p>'
+ '<p class="l-text"><strong>Sistem:</strong> Aracı çalıştırır, sonucu LLM\'e döndürür: <code>{"temp": 22, "condition": "güneşli"}</code></p>'
+ '<p class="l-text"><strong>LLM cevap:</strong> "Ankara\'da bugün 22°C, güneşli."</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Ajan mimarileri</h3>'

+ '<ul class="l-list">'
+ '<li><strong>ReAct (Reason + Act):</strong> Düşünce → Eylem → Gözlem döngüsü. En basit ve güçlü pattern.</li>'
+ '<li><strong>Planner-Executor:</strong> Bir LLM planlar (alt görevlere böler), bir başkası uygular. Karmaşık görevlerde temiz ayrım.</li>'
+ '<li><strong>Çok ajanlı (multi-agent):</strong> Yazar, eleştirmen, editör gibi farklı rollerde birden çok LLM birbirine mesaj atar. AutoGen, CrewAI, LangGraph araçları.</li>'
+ '<li><strong>Öz-yansıma (self-refine):</strong> İlk cevabı al, modeline tekrar göster ("bu cevabı eleştir"), iyileştir.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Ajan güvenliği</h3>'

+ '<div class="l-warn"><strong>Önemli:</strong> Araç kullanımı saldırı yüzeyini büyütür. Bir ajan kod yürütüyorsa, dosya siliyorsa, e-posta gönderiyorsa — dikkat! Mutlaka: girdileri sterilize et, çağrıları beyaz listeye al, oran sınırlandır, kod yürütmeyi sandbox\'la, her eylemi günlüğe yaz. Bunlar isteğe bağlı değildir.</div>'

+ '<h2 class="l-title">5. Çok Dilli & Düşük Kaynak — Türkçe Özel</h2>'

+ '<p class="l-text">İngilizce dışındaki diller "low-resource" sayılır — eğitim verisi az, modeller daha az iyi. Türkçe görece şanslıdır ama hâlâ İngilizcenin gerisindedir.</p>'

+ '<h3 class="l-subtitle">Stratejiler</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Çok dilli ön-eğitim:</strong> mBERT, XLM-R, mT5, BLOOM, Llama-3 — onlarca dili destekler. Türkçe görevlerde sıfır-şot iyi sonuç verirler.</li>'
+ '<li><strong>Türkçe-özel modeller:</strong> BERTurk, ConvBERTurk, Trendyol-LLM. Türkçe görevlerde çok dilli generalistleri çoğunlukla yener.</li>'
+ '<li><strong>Geri-çeviri (back-translation):</strong> İngilizce veriyi Türkçeye çevir, Türkçe eğitim verisi gibi kullan. Veri patlaması.</li>'
+ '<li><strong>Çapraz dil aktarım:</strong> İngilizce çok veriyle eğit, Türkçe az veriyle ince ayarla.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Türkçenin morfolojik zorluğu</h3>'

+ '<p class="l-text">Türkçedeki <em>"evlerimizdekilerden"</em> tek kelimedir ama 7 ek taşır. Naif tokenizer\'lar bunu nadir kelime olarak görür ve genelleyemez. Çözümler:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Morfolojik ön-bölme:</strong> Zemberek ile kelimeyi eklerine ayır, sonra modele ver.</li>'
+ '<li><strong>Türkçe-aware BPE/WordPiece:</strong> BERTurk\'ün tokenizer\'ı Türkçe morfolojiyi göz önünde bulundurarak eğitilmiştir.</li>'
+ '<li><strong>FastText alt-kelime embedding\'leri (<a href="/tutorials/nlp/5">Ders 5</a>):</strong> OOV problemini doğal yakalar.</li>'
+ '</ul>'

+ '<h2 class="l-title">6. Kapsamlı Değerlendirme</h2>'

+ '<p class="l-text">Bir NLP sisteminin "ne kadar iyi" olduğunu bir tek metrikle ölçemezsin. Ciddi değerlendirme birkaç ekseni kapsar:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Görev metrikleri:</strong> Sınıflandırma için F1, çeviri için BLEU, özetleme için ROUGE.</li>'
+ '<li><strong>İnsan değerlendirmesi:</strong> 100-200 zor örnek üzerinde manual derecelendirme. En güvenilir, en pahalı.</li>'
+ '<li><strong>LLM-as-judge:</strong> Bir LLM\'i (GPT-4 gibi) yargıç olarak kullanmak. Hızlı ama önyargı taşır — düzenli kalibrasyon gerekir.</li>'
+ '<li><strong>Sağlamlık (robustness):</strong> Yazım hatalı, çevirili, gürültülü girdilerde performans nasıl düşüyor?</li>'
+ '<li><strong>Düşmanca (adversarial):</strong> Modeli kasıtlı kandıran girdilerle test. Güvenlik için kritik.</li>'
+ '<li><strong>Adalet (fairness):</strong> Cinsiyete, etnik kökene, yaşa göre performans dağılımı.</li>'
+ '<li><strong>Verimlilik:</strong> Gecikme (latency), saniyede sorgu (QPS), maliyet (token başı $).</li>'
+ '</ul>'

+ '<p class="l-text">İnceleme-geçer (reviewer-proof) bir değerlendirme bütün bu eksenleri kapsar. Tek skor üzerinden karar vermek tehlikelidir.</p>'

+ '<h2 class="l-title">7. Etik ve Sorumlu NLP</h2>'

+ '<p class="l-text">NLP sistemleri insanları etkileyen kararlar üretir. 2026\'da bu sorumluluğun bir kısmı sistemi inşa eden mühendise düşer.</p>'

+ '<h3 class="l-subtitle">Eğitim verisi önyargısı</h3>'

+ '<p class="l-text">Modeller internet metni üzerinde eğitilir; orada var olan önyargılar (cinsiyet, ırk, sosyo-ekonomik) modele yansır. Bir doktor adayı CV\'sini özetleyen sistem erkek isimleri için olumlu, kadın isimleri için temkinli özetler üretebilir — eğer eğitim verisinde bu bias varsa.</p>'

+ '<p class="l-text">Çare:</p>'

+ '<ul class="l-list">'
+ '<li>Veri setinin demografik dağılımını analiz et.</li>'
+ '<li>Adalet metrikleri ölç (her demografik grupta accuracy/F1).</li>'
+ '<li>Karşı-olgusal artırma (counterfactual augmentation): "doktor erkek" varsa "doktor kadın" da ekle.</li>'
+ '<li>Üretim sonrası bias filtreleri.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Gizlilik (memorization)</h3>'

+ '<p class="l-text">LLM\'ler eğitim verisindeki kişisel bilgileri ezberleyebilir — telefon numarası, e-posta, adres. Eğitim verisinde hassas bilgi varsa, model çıktıda bunları sızdırabilir. Çözüm: <strong>differential privacy</strong> ile eğitim, üyelik çıkarımı saldırılarına karşı test.</p>'

+ '<h3 class="l-subtitle">Çevresel maliyet</h3>'

+ '<p class="l-text">175B parametreli bir modeli eğitmek yüzlerce ton CO2 yayar. Açıkça raporla — eğitim için kullanılan donanım (GPU saatleri), tahmini enerji ve, biliyorsan, CO2 etkisi. Parametre verimli yöntemler (LoRA, distilling) seç — etik olduğu kadar pratik.</p>'

+ '<h3 class="l-subtitle">Çift kullanım (dual use)</h3>'

+ '<p class="l-text">Sentiment analizi kötüye kullanıcı içeriğini tespit etmek için kullanılır — ama aynı modelle muhalifler hedeflenebilir. Açık kaynak yayını yapmadan önce zarar verebilecek senaryoları belgeleyin, gerekirse erişim kontrolleri uygulayın.</p>'

+ '<h3 class="l-subtitle">Onay ve veri hakları</h3>'

+ '<ul class="l-list">'
+ '<li>Eğitim verisi onayla mı toplandı?</li>'
+ '<li>Reşit olmayanların verisi var mı?</li>'
+ '<li>AB Yapay Zeka Yasası, GDPR, Türkiye KVKK uygulanır.</li>'
+ '<li>Hassas veriler için DPIA (Data Protection Impact Assessment) yap.</li>'
+ '</ul>'

+ '<div class="l-note"><strong>Sevk öncesi 5 soru:</strong> (1) Modeli kimin verisi eğitti? Onay verdiler mi? (2) Model yanılırsa kim ödüyor? (3) Kim yarar sağlıyor, bu adil mi? (4) En kötü kötüye kullanım nedir? Önleyebilir misin? (5) Sevkten sonra zararlar nasıl tespit edilecek? Düzeltilecek? Bu 5 soruya net cevabın yoksa sistem henüz hazır değildir.</div>'

+ '<h2 class="l-title">8. Üretim Mimarisi — Tipik Bir NLP Sistemi</h2>'

+ '<p class="l-text">Gerçek bir Trendyol yorum analizi sisteminin mimari görünümü:</p>'

+ '<div class="calc-example"><div class="example-label">SİSTEM AKIŞI</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ '[1] Yorum geliyor (API)'
+ '<br>↓'
+ '<br>[2] Ön işleme: HTML/URL temizliği, normalizasyon (Ders 1)'
+ '<br>↓'
+ '<br>[3] Hızlı dil tespiti (TR/EN/karışık)'
+ '<br>↓'
+ '<br>[4a] Sentiment: BERTurk fine-tune (Ders 4 + 10)'
+ '<br>[4b] Aspect extraction: BiLSTM-CRF (Ders 7) — paralel'
+ '<br>↓'
+ '<br>[5] Sonuçları DB\'ye yaz (asenkron)'
+ '<br>↓'
+ '<br>[6] Anormalliklerde insan denetimine yönlendir'
+ '<br>↓'
+ '<br>[7] İzleme: gecikme, kalite, drift (haftalık)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Bu sisteme dikkat et:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Birden çok model paralel çalışır.</strong> Sentiment ve aspect ayrı modeller.</li>'
+ '<li><strong>Hata yolu var.</strong> Modelin emin olmadığı (probability 0.4-0.6) örnekler insana yönlendirilir.</li>'
+ '<li><strong>Sürekli izleme.</strong> Drift tespiti, kalite metrikleri haftalık raporlar.</li>'
+ '<li><strong>Geri besleme döngüsü.</strong> İnsan etiketleri aylık fine-tune\'a girer.</li>'
+ '</ul>'

+ '<h2 class="l-title">9. Uçtan Uca Proje Şablonu</h2>'

+ '<p class="l-text">Bir portfolyo veya üretim NLP projesinin omurgası şu yapıdır:</p>'

+ '<div class="calc-example"><div class="example-label">PROJE FAZLARI</div><div class="example-body">'
+ '<ol class="l-list" style="font-size:.95rem">'
+ '<li><strong>Problem çerçeveleme (1-2 hafta):</strong> Görev tipi nedir (sınıflandırma <a href="/tutorials/nlp/3">L3</a>, sentiment <a href="/tutorials/nlp/4">L4</a>, NER <a href="/tutorials/nlp/7">L7</a>, üretim <a href="/tutorials/nlp/9">L9</a>+<a href="/tutorials/nlp/11">L11</a>)? Tek paragraflık problem ifadesi + 3 spesifik araştırma sorusu.</li>'
+ '<li><strong>Veri (2-4 hafta):</strong> Veri seti tanımla veya topla. Kaynağını belgele. Ön işleme (<a href="/tutorials/nlp/1">L1</a>). Sınıf dengesi, uzunluk dağılımı, kelime dağarcığı istatistikleri. Train/val/test böl, sızıntı olmadan.</li>'
+ '<li><strong>Baseline (4-6 hafta):</strong> (a) Çoğunluk sınıfı baseline. (b) TF-IDF + lojistik regresyon (<a href="/tutorials/nlp/2">L2</a>+<a href="/tutorials/nlp/3">L3</a>). (c) BERTurk fine-tune (<a href="/tutorials/nlp/10">L10</a>). (d) Llama zero-shot (<a href="/tutorials/nlp/11">L11</a>). Hepsini çalıştır. Sonuçlar genelde proje planını yeniden şekillendirir.</li>'
+ '<li><strong>Önerilen yöntem (6-10 hafta):</strong> Katkını tasarla ve uygula. Yeni bir mimari, veri artırma, RAG boru hattı, ajan sistemi olabilir. Ne olursa olsun, ablasyonla — bir bileşeni çıkar, etkiyi ölç.</li>'
+ '<li><strong>Değerlendirme (10-12 hafta):</strong> Görev metriği, insan değerlendirmesi, LLM-yargıç, sağlamlık, verimlilik, adalet (bu dersin 6. bölümü). 100 başarısızlık üzerinde hata analizi — kategorize, dersler çıkar.</li>'
+ '<li><strong>Yazım (12-16 hafta):</strong> Yapı: Giriş, İlgili Çalışma, Yöntem, Deneyler, Tartışma (etik dahil), Sonuç. Kodu, model ağırlıklarını ve küçük bir test setini yayınla. Tekrarlanabilirlik bir projeyi başkalarının inşa edebileceği bir referansa dönüştürür.</li>'
+ '</ol>'

+ '</div></div>'

+ '<h2 class="l-title">10. Tebrikler — 12 Dersi Bitirdin</h2>'

+ '<p class="l-text">12 derslik NLP kursunu bitirdin. <a href="/tutorials/nlp/1">Ders 1</a>\'deki regex ve stemming\'den, <a href="/tutorials/nlp/12">Ders 12</a>\'deki üretim RAG sistemlerine, ajanlara ve uçtan uca proje şablonuna kadar — modern NLP\'nin uçtan uca zihinsel modeline sahipsin. Bir uygulamacının makaleleri okurken, boru hattı hata ayıklarken, deneyler tasarlarken kullandığı modelin aynısı. Nefes al. Bu gerçek bir kilometre taşı.</p>'

+ '<h3 class="l-subtitle">Bundan sonra ne yapmalı?</h3>'

+ '<ul class="l-list">'
+ '<li>Bu 12 derste atıfta bulunulan başlangıç makalelerini oku (Attention is All You Need, BERT, GPT-3, Chinchilla, LoRA, DPO, RAG, ReAct).</li>'
+ '<li>Açık kaynak bir NLP projesine katkı yap.</li>'
+ '<li>Türkçede veya başka düşük kaynaklı bir dilde gerçek bir problem seç.</li>'
+ '<li>CV\'ne veya portfolyona koyabileceğin bir şey inşa et. Araçlar artık elinde.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>Bu derste neler öğrendin:</strong> Üretim NLP sistemlerinin yapısını, RAG\'ın bilgi getirme + üretim hattını, RAGAS ile değerlendirmesini öğrendin. Ajanların araç kullanımını, ReAct ve planner-executor mimarilerini, ajan güvenliğini gördün. Türkçe-özel zorlukları (morfoloji, az kaynak) ve stratejilerini (mBERT, BERTurk, geri çeviri) tanıdın. Kapsamlı değerlendirmenin 7 eksenini (görev metriği, insan, LLM-yargıç, sağlamlık, düşmanca, adalet, verimlilik) öğrendin. Etik konularda eğitim verisi önyargısı, gizlilik, çevresel maliyet, çift kullanım, onay haklarını gördün. Bir Trendyol-tipi sistem mimarisini takip ettin. Uçtan uca bir NLP projesinin 6 fazını öğrendin. Bu kursun 12 dersini tek bir zihinsel modelde topladın.</div>'

,

en:
'<script>(function(){var g=window;g.__nlpChartDrawers=g.__nlpChartDrawers||[];g.__nlpChartTheme=g.__nlpChartTheme||function(){var cs=getComputedStyle(document.documentElement);return{text:cs.getPropertyValue("--text").trim()||"rgba(235,230,220,.88)",dim:cs.getPropertyValue("--text-dim").trim()||"rgba(235,230,220,.4)",grid:"rgba(128,128,128,0.18)",paper:"rgba(0,0,0,0)",plot:"rgba(0,0,0,0)",accent:cs.getPropertyValue("--accent").trim()||"#4ecdc4"};};g.__nlpRegDraw=g.__nlpRegDraw||function(fn){g.__nlpChartDrawers.push(fn);try{fn();}catch(e){}};if(!g.__nlpThemeObsAttached){g.__nlpThemeObsAttached=true;var redraw=function(){(g.__nlpChartDrawers||[]).forEach(function(fn){try{fn();}catch(e){}});};new MutationObserver(function(muts){if(muts.some(function(m){return m.attributeName==="data-theme"||m.attributeName==="style";})){redraw();}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme","style"]});}})();</script>'

+ '<div class="calc-highlight"><strong>What you will learn:</strong> The final lesson of this course. We see how the 11 prior lessons combine into real production NLP systems. <strong>RAG</strong> (fetching information the model does not know), <strong>agents</strong> (LLMs using tools), <strong>multilingual NLP</strong> with a Turkish focus, <strong>comprehensive evaluation</strong>, <strong>ethics and responsibility</strong>, and an end-to-end <strong>project template</strong>. You learned the methods one by one; this lesson assembles them into systems.</div>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU\'LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Build a Retrieval-Augmented Generation (RAG) pipeline with a FAISS embedding index</li>'
+ '<li>Design LLM agents with ReAct and tool use via LangChain or LlamaIndex</li>'
+ '<li>Build multilingual and Turkish NLP systems with BERTurk and mBERT</li>'
+ '<li>Evaluate production systems with BLEU, ROUGE, perplexity, and LLM-as-judge</li>'
+ '<li>Recognize ethics, bias, and hallucination risks and apply mitigation strategies</li>'
+ '</ul>'
+ '</div>'

+ '<h2 class="l-title">1. The Reality of Production NLP</h2>'

+ '<p class="l-text">Across 11 lessons you learned methods: classification, translation, NER, embeddings, transformers, LLMs. A real product — Trendyol\'s review analysis system, a healthcare assistant, a legal assistant — is these methods stacked and connected. A single model is never enough:</p>'

+ '<ul class="l-list">'
+ '<li>Data collection and cleaning (<a href="/tutorials/nlp/1">Lesson 1</a>)</li>'
+ '<li>Vectorisation or tokenisation (<a href="/tutorials/nlp/2">Lesson 2</a>, <a href="/tutorials/nlp/5">Lesson 5</a>)</li>'
+ '<li>Multiple models (classifier, NER, LM)</li>'
+ '<li>RAG, agents, error handling, monitoring, evaluation</li>'
+ '<li>Ethical filters, privacy, user feedback loop</li>'
+ '</ul>'

+ '<p class="l-text">This lesson covers six themes: RAG, agents, multilingual/Turkish, evaluation, ethics, and the project template.</p>'

+ '<h2 class="l-title">2. RAG — Retrieval-Augmented Generation</h2>'

+ '<p class="l-text">LLMs do not know two things: (1) events after their training cutoff, (2) your private data (internal docs, user history). <strong>RAG (Retrieval-Augmented Generation)</strong> bridges this. Intuition: at query time, retrieve relevant documents, stuff them into the prompt, then answer.</p>'

+ '<div class="katex-block">$$P(y \\mid x) = \\sum_{d \\in \\text{top-}k} P_{\\text{retriever}}(d \\mid x) \\cdot P_{\\text{LM}}(y \\mid x, d)$$</div>'

+ '<p class="l-text">Where <em>x</em> is the user query, <em>d</em> a retrieved document, and <em>y</em> the answer to generate. The retriever finds the relevant <em>k</em> documents and the LM answers based on them.</p>'

+ '<h3 class="l-subtitle">RAG pipeline</h3>'

+ '<ol class="l-list">'
+ '<li><strong>Indexing (offline):</strong> chunk all documents, embed each chunk (Sentence-BERT, OpenAI embeddings, etc.), store in a vector DB (FAISS, Pinecone, Qdrant).</li>'
+ '<li><strong>Query (online):</strong> embed the user question.</li>'
+ '<li><strong>Retrieval:</strong> fetch the nearest <em>k=5</em> chunks from the vector DB.</li>'
+ '<li><strong>Reranking (optional):</strong> rescore those 5 with a cross-encoder. Drop to top-3.</li>'
+ '<li><strong>Generation:</strong> put the query + retrieved chunks into the prompt. <em>"Answer based on the documents below: ..."</em></li>'
+ '</ol>'

+ '<div class="calc-example"><div class="example-label">SAMPLE RAG PROMPT</div><div class="example-body">'
+ '<p class="l-text" style="font-family:var(--mono);font-size:.92rem;line-height:1.7">'
+ 'Answer the question based only on the documents below. Do not invent information not in the documents.'
+ '<br><br>'
+ 'DOCUMENTS:'
+ '<br>[1] Trendyol shipping policy: free over 50 TL, 1-3 business days.'
+ '<br>[2] Trendyol returns: free returns within 14 days.'
+ '<br><br>'
+ 'QUESTION: What is the shipping fee for a 100 TL product?'
+ '<br><br>'
+ 'ANSWER: There is no shipping fee — orders over 50 TL ship for free.'
+ '</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Why RAG matters</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Up-to-date knowledge:</strong> beyond the training cutoff.</li>'
+ '<li><strong>Reduced hallucination:</strong> the model speaks from documents, not invention.</li>'
+ '<li><strong>Cite sources:</strong> you can show which doc supported which claim.</li>'
+ '<li><strong>Domain adaptation:</strong> a generic LLM specialises to your data — an alternative to fine-tuning.</li>'
+ '</ul>'

+ '<h2 class="l-title">3. Practical RAG Details</h2>'

+ '<h3 class="l-subtitle">Chunking — how to split documents</h3>'

+ '<p class="l-text">A document may be 100 pages; you cannot feed it all to the LLM. You must split — but how?</p>'

+ '<ul class="l-list">'
+ '<li><strong>Fixed size:</strong> every 500 tokens a chunk. Simple but cuts context.</li>'
+ '<li><strong>Overlapping:</strong> each chunk overlaps the next by 20%. Reduces information loss.</li>'
+ '<li><strong>Semantic:</strong> split at sentence/paragraph boundaries. Natural but slower.</li>'
+ '<li><strong>Structural:</strong> split by Markdown headings, legal clauses, sections in clinical reports. Domain-aware.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Choosing an embedding model</h3>'

+ '<p class="l-text">Good options for Turkish:</p>'

+ '<ul class="l-list">'
+ '<li><strong>multilingual-e5-large:</strong> good across 100+ languages, open source.</li>'
+ '<li><strong>BGE-M3:</strong> multilingual, dense + sparse + colbert in one model.</li>'
+ '<li><strong>Cohere embed-multilingual-v3:</strong> API-based, very high quality.</li>'
+ '<li><strong>OpenAI text-embedding-3:</strong> generally good in Turkish too.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">RAG evaluation — RAGAS</h3>'

+ '<p class="l-text">Evaluate a RAG system on three dimensions:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Context recall:</strong> is the information needed for the answer in the retrieved chunks?</li>'
+ '<li><strong>Context precision:</strong> are the retrieved chunks really relevant?</li>'
+ '<li><strong>Faithfulness:</strong> is the answer consistent with the retrieved chunks, no hallucination?</li>'
+ '<li><strong>Answer relevance:</strong> does the answer actually address the question?</li>'
+ '</ul>'

+ '<p class="l-text"><strong>RAGAS</strong> and <strong>ARES</strong> libraries compute these automatically — they themselves use an LLM as a "judge".</p>'

+ '<h2 class="l-title">4. Agents — Tool-Using LLMs</h2>'

+ '<p class="l-text">An <strong>agent</strong> is an LLM that does not just talk but also <em>calls tools to get things done</em>. Modern LLMs ship with "function calling": instead of plain text, the model can return a JSON tool call.</p>'

+ '<div class="calc-example"><div class="example-label">AGENT FLOW</div><div class="example-body">'
+ '<p class="l-text"><strong>User:</strong> "What is the weather in Ankara today?"</p>'
+ '<p class="l-text"><strong>LLM thought:</strong> "I need weather. Call <code>get_weather(city="Ankara")</code>."</p>'
+ '<p class="l-text"><strong>System:</strong> runs the tool, returns to the LLM: <code>{"temp": 22, "condition": "sunny"}</code></p>'
+ '<p class="l-text"><strong>LLM answer:</strong> "It is 22°C and sunny in Ankara today."</p>'
+ '</div></div>'

+ '<h3 class="l-subtitle">Agent architectures</h3>'

+ '<ul class="l-list">'
+ '<li><strong>ReAct (Reason + Act):</strong> Thought → Action → Observation loop. Simple and powerful.</li>'
+ '<li><strong>Planner-Executor:</strong> one LLM plans (decomposes), another executes. Cleaner separation for complex tasks.</li>'
+ '<li><strong>Multi-agent:</strong> multiple LLMs in different roles (writer, critic, editor) message each other. Tools: AutoGen, CrewAI, LangGraph.</li>'
+ '<li><strong>Self-refine:</strong> get a first answer, feed it back ("critique this"), improve.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Agent safety</h3>'

+ '<div class="l-warn"><strong>Important:</strong> tool use widens the attack surface. If an agent runs code, deletes files, or sends emails — be careful! You must: sanitise inputs, whitelist outgoing calls, rate-limit, sandbox code execution, log every action. Not optional.</div>'

+ '<h2 class="l-title">5. Multilingual & Low-Resource — Turkish in Particular</h2>'

+ '<p class="l-text">Languages other than English are "low-resource": less training data, weaker models. Turkish is relatively well-served but still trails English.</p>'

+ '<h3 class="l-subtitle">Strategies</h3>'

+ '<ul class="l-list">'
+ '<li><strong>Multilingual pretraining:</strong> mBERT, XLM-R, mT5, BLOOM, Llama-3 — support dozens of languages. Often work zero-shot on Turkish tasks.</li>'
+ '<li><strong>Turkish-specific models:</strong> BERTurk, ConvBERTurk, Trendyol-LLM. Usually beat multilingual generalists on Turkish tasks.</li>'
+ '<li><strong>Back-translation:</strong> translate English data to Turkish, treat as training data. Big data multiplier.</li>'
+ '<li><strong>Cross-lingual transfer:</strong> train heavily on English, fine-tune on a small Turkish set.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Turkish morphology</h3>'

+ '<p class="l-text">Turkish "evlerimizdekilerden" is one word with seven suffixes. Naïve tokenisers see this as a rare word and fail to generalise. Fixes:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Morphological pre-segmentation:</strong> use Zemberek to split the word into suffixes before feeding the model.</li>'
+ '<li><strong>Turkish-aware BPE/WordPiece:</strong> BERTurk\'s tokenizer is trained respecting Turkish morphology.</li>'
+ '<li><strong>FastText subword embeddings (<a href="/tutorials/nlp/5">Lesson 5</a>):</strong> handle OOV naturally.</li>'
+ '</ul>'

+ '<h2 class="l-title">6. Comprehensive Evaluation</h2>'

+ '<p class="l-text">You cannot judge an NLP system "good enough" with a single metric. Serious evaluation covers several axes:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Task metrics:</strong> F1 for classification, BLEU for translation, ROUGE for summarisation.</li>'
+ '<li><strong>Human evaluation:</strong> 100-200 hard examples manually graded. Most reliable, most expensive.</li>'
+ '<li><strong>LLM-as-judge:</strong> use a strong LLM (e.g. GPT-4) to judge. Fast, but biased — needs calibration.</li>'
+ '<li><strong>Robustness:</strong> how does performance drop on typos, mistranslations, noisy inputs?</li>'
+ '<li><strong>Adversarial:</strong> test with inputs designed to trick the model. Critical for security.</li>'
+ '<li><strong>Fairness:</strong> performance distribution across gender, ethnicity, age.</li>'
+ '<li><strong>Efficiency:</strong> latency, queries per second, cost per token.</li>'
+ '</ul>'

+ '<p class="l-text">A reviewer-proof evaluation covers all axes. Deciding from a single score is dangerous.</p>'

+ '<h2 class="l-title">7. Ethics and Responsible NLP</h2>'

+ '<p class="l-text">NLP systems make decisions that affect people. In 2026, part of that responsibility falls on the engineer building the system.</p>'

+ '<h3 class="l-subtitle">Training data bias</h3>'

+ '<p class="l-text">Models are trained on web text; biases there (gender, race, socio-economic) get baked into the model. A system summarising doctor CVs may favour male names and be cautious for female names — if that bias is in the training data.</p>'

+ '<p class="l-text">Mitigation:</p>'

+ '<ul class="l-list">'
+ '<li>Analyse the demographic distribution of the dataset.</li>'
+ '<li>Measure fairness metrics (accuracy/F1 per demographic group).</li>'
+ '<li>Counterfactual augmentation: if "doctor he" is in data, add "doctor she".</li>'
+ '<li>Post-processing bias filters.</li>'
+ '</ul>'

+ '<h3 class="l-subtitle">Privacy (memorisation)</h3>'

+ '<p class="l-text">LLMs can memorise personal information from training data — phone numbers, emails, addresses. If sensitive data is present, the model may leak it. Fixes: train with <strong>differential privacy</strong>, test with membership-inference attacks.</p>'

+ '<h3 class="l-subtitle">Environmental cost</h3>'

+ '<p class="l-text">Training a 175B model emits hundreds of tons of CO2. Report this transparently — hardware (GPU hours), estimated energy, and if you know it, CO2. Prefer parameter-efficient methods (LoRA, distillation) — ethical and practical.</p>'

+ '<h3 class="l-subtitle">Dual use</h3>'

+ '<p class="l-text">Sentiment analysis is used to detect abuse — but the same model could be used to target dissidents. Before public release, document foreseeable harms and add access controls if necessary.</p>'

+ '<h3 class="l-subtitle">Consent and data rights</h3>'

+ '<ul class="l-list">'
+ '<li>Was training data collected with consent?</li>'
+ '<li>Does it include data from minors?</li>'
+ '<li>EU AI Act, GDPR, Turkey KVKK apply.</li>'
+ '<li>Conduct a DPIA (Data Protection Impact Assessment) for sensitive data.</li>'
+ '</ul>'

+ '<div class="l-note"><strong>Five questions before shipping:</strong> (1) Whose data trained the model? Did they consent? (2) If the model is wrong, who pays the cost? (3) Who benefits, and is that distribution fair? (4) What is the worst misuse case, and can you mitigate it? (5) After shipping, how will harms be detected and corrected? If you cannot answer these clearly, the system is not ready yet.</div>'

+ '<h2 class="l-title">8. Production Architecture — A Typical NLP System</h2>'

+ '<p class="l-text">A real Trendyol-style review analysis system architecture:</p>'

+ '<div class="calc-example"><div class="example-label">SYSTEM FLOW</div><div class="example-body">'
+ '<p class="l-text" style="text-align:center;font-family:var(--mono);font-size:.92rem;line-height:1.9">'
+ '[1] Review arrives (API)'
+ '<br>↓'
+ '<br>[2] Preprocessing: HTML/URL strip, normalisation (Lesson 1)'
+ '<br>↓'
+ '<br>[3] Quick language detection (TR/EN/mixed)'
+ '<br>↓'
+ '<br>[4a] Sentiment: BERTurk fine-tune (Lessons 4 + 10)'
+ '<br>[4b] Aspect extraction: BiLSTM-CRF (Lesson 7) — parallel'
+ '<br>↓'
+ '<br>[5] Write results to DB (async)'
+ '<br>↓'
+ '<br>[6] Route low-confidence cases to human review'
+ '<br>↓'
+ '<br>[7] Monitoring: latency, quality, drift (weekly)'
+ '</p>'
+ '</div></div>'

+ '<p class="l-text">Notice:</p>'

+ '<ul class="l-list">'
+ '<li><strong>Multiple models in parallel.</strong> Sentiment and aspect are separate models.</li>'
+ '<li><strong>Error path exists.</strong> Low-confidence (probability 0.4-0.6) examples go to humans.</li>'
+ '<li><strong>Continuous monitoring.</strong> Drift detection, weekly quality reports.</li>'
+ '<li><strong>Feedback loop.</strong> Human labels feed monthly fine-tuning.</li>'
+ '</ul>'

+ '<h2 class="l-title">9. End-to-End Project Template</h2>'

+ '<p class="l-text">The backbone of a portfolio or production NLP project:</p>'

+ '<div class="calc-example"><div class="example-label">PROJECT PHASES</div><div class="example-body">'
+ '<ol class="l-list" style="font-size:.95rem">'
+ '<li><strong>Problem framing (week 1-2):</strong> What task type (classification <a href="/tutorials/nlp/3">L3</a>, sentiment <a href="/tutorials/nlp/4">L4</a>, NER <a href="/tutorials/nlp/7">L7</a>, generation <a href="/tutorials/nlp/9">L9</a>+<a href="/tutorials/nlp/11">L11</a>)? One-paragraph problem statement + 3 specific research questions.</li>'
+ '<li><strong>Data (week 2-4):</strong> Define or collect a dataset. Document its source. Preprocess (<a href="/tutorials/nlp/1">L1</a>). Class balance, length distribution, vocabulary stats. Train/val/test split, no leakage.</li>'
+ '<li><strong>Baselines (week 4-6):</strong> (a) majority class baseline. (b) TF-IDF + LR (<a href="/tutorials/nlp/2">L2</a>+<a href="/tutorials/nlp/3">L3</a>). (c) BERTurk fine-tune (<a href="/tutorials/nlp/10">L10</a>). (d) Llama zero-shot (<a href="/tutorials/nlp/11">L11</a>). Run them all. Surprises here usually reshape your plan.</li>'
+ '<li><strong>Proposed method (week 6-10):</strong> Design and implement your contribution. Could be a new architecture, data augmentation, a RAG pipeline, an agent system. Whatever it is, ablate it — remove one component at a time and measure the impact.</li>'
+ '<li><strong>Evaluation (week 10-12):</strong> Task metric, human evaluation, LLM-as-judge, robustness, efficiency, fairness (Section 6 of this lesson). Error analysis on 100 failures — categorise, draw lessons.</li>'
+ '<li><strong>Writeup (week 12-16):</strong> Structure: Intro, Related Work, Method, Experiments, Discussion (incl. ethics), Conclusion. Release code, model weights, and a small held-out test set. Reproducibility turns a project into a reference others can build on.</li>'
+ '</ol>'

+ '</div></div>'

+ '<h2 class="l-title">10. Congratulations — You Finished the 12 Lessons</h2>'

+ '<p class="l-text">You finished the twelve-lesson NLP course. From regex and stemming in <a href="/tutorials/nlp/1">Lesson 1</a> to production RAG systems, agents, and a complete end-to-end project template in <a href="/tutorials/nlp/12">Lesson 12</a>, you now hold an end-to-end mental model of modern natural language processing — the same model a working practitioner uses to read papers, debug pipelines, and design experiments. Take a breath. This is a real milestone.</p>'

+ '<h3 class="l-subtitle">Where to go next</h3>'

+ '<ul class="l-list">'
+ '<li>Read the seminal papers cited throughout these twelve lessons (Attention is All You Need, BERT, GPT-3, Chinchilla, LoRA, DPO, RAG, ReAct).</li>'
+ '<li>Contribute to an open-source NLP project.</li>'
+ '<li>Pick a real problem in Turkish or another low-resource language.</li>'
+ '<li>Build something you are proud to put on a CV or portfolio. The tools are now in your hands.</li>'
+ '</ul>'

+ '<div class="calc-highlight"><strong>What you learned in this lesson:</strong> The structure of production NLP systems, the RAG retrieve-then-generate pipeline, evaluation with RAGAS. Agents and tool use, ReAct and planner-executor architectures, agent safety. Turkish-specific challenges (morphology, low-resource) and strategies (mBERT, BERTurk, back-translation). The seven axes of comprehensive evaluation (task metric, human, LLM-judge, robustness, adversarial, fairness, efficiency). Ethics: training data bias, privacy, environmental cost, dual use, consent. A Trendyol-style production architecture. The six phases of an end-to-end NLP project. You wove the 12 lessons of this course into a single mental model.</div>'

};
