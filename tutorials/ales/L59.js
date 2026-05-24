window.ALES_LESSON = {
n: 59,
title: "Sınav Stratejisi ve Zaman Yönetimi",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>21 ALES sınav stratejisi senaryosu</strong> üzerinde karar pratiği yapacaksın — 3 alt konu × 7 senaryo. Her senaryoda dakikalı bir durum verilir; sen <em>ne yapardın?</em> sorusuna cevap üretirsin. Cevap kısmında "doğru karar + sebep + sayısal mantık" gösterilir. Bu ders, son hafta tekrarın ve sınav sabahı zihninin haritasıdır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Zaman Yönetimi Senaryoları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Zaman Yönetimi Senaryoları</h2>
  </div>

  <!-- Senaryo 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 1</span>
      <span class="ales-prob-type">Tempo Kontrolü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      <strong>10 dakika geçti, sadece 5 soru çözdün.</strong> 65 dakikan + 45 soru kaldı. Tempon yeterli mi? Ne yapmalısın?<br><br>
      <strong>A)</strong> Sınavı bırak, telafi yok &nbsp; <strong>B)</strong> Panikle, tüm kalanları hızlıca random doldur &nbsp; <strong>C)</strong> Tempon yeterli, mevcut hızda devam et &nbsp; <strong>D)</strong> <span class="key">Devam et + tempoyu sıkılaştır, panik yok</span> &nbsp; <strong>E)</strong> En zor soruları çözmeye başla
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar</div>
      <p class="ales-sol-step"><strong>Hesap:</strong> Mevcut tempo $= \\dfrac{10 \\text{ dk}}{5 \\text{ soru}} = 2$ dk/soru. Hedef tempo $= \\dfrac{75}{50} = 1.5$ dk/soru.</p>
      <p class="ales-sol-step">Yetişmek için kalan tempo: $\\dfrac{65}{45} \\approx 1.44$ dk/soru.</p>
      <p class="ales-sol-step"><strong>Durum:</strong> Hâlâ ortalamaya yakın. Panik yok ama hızlanmak gerek. Sonraki sorularda "30 saniye kuralı" uygula — zorlandığında bırak, işaretle, sonra dön.</p>
      <div class="ales-sol-answer">Strateji: <span class="key">D) Devam et + tempoyu sıkılaştır, panik yok</span></div>
    </div>
  </div>

  <!-- Senaryo 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 2</span>
      <span class="ales-prob-type">Çeyrek Mola Kontrolü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      <strong>İlk çeyrek (≈ 19 dakika) bitti.</strong> İdeal olarak kaç soru çözmüş olmalısın? Hangi durumda iyi, hangisinde tehlike?<br><br>
      <strong>A)</strong> 8 soru = ideal, &lt;5 hızlan &nbsp; <strong>B)</strong> <span class="key">12-13 soru = ideal, &lt;10 = hızlan, &gt;15 = dikkatli oku</span> &nbsp; <strong>C)</strong> 20 soru = ideal, &lt;15 = tehlike &nbsp; <strong>D)</strong> 5 soru = ideal, &gt;10 = çok hızlı &nbsp; <strong>E)</strong> Hız önemli değil, sona kadar bekle
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Zaman Planı Tablosu</div>
      <div class="ales-diagram">
        <table>
          <thead><tr><th>Çeyrek</th><th>Süre</th><th>Hedef Soru</th><th>Toplam</th></tr></thead>
          <tbody>
            <tr><td>1. Çeyrek</td><td>0–19 dk</td><td>12-13</td><td>12-13</td></tr>
            <tr><td>2. Çeyrek</td><td>19–38 dk</td><td>12-13</td><td>24-26</td></tr>
            <tr><td>3. Çeyrek</td><td>38–56 dk</td><td>12-13</td><td>36-39</td></tr>
            <tr><td>4. Çeyrek + İşaretle</td><td>56–75 dk</td><td>11-14 + işaretliler</td><td>50</td></tr>
          </tbody>
        </table>
      </div>
      <p class="ales-sol-step"><strong>İdeal:</strong> 1. çeyrekte 12-13 soru. 10 ve altı = tehlike sinyali (matematiğin uzun sorularına takıldın), 15+ = çok hızlısın (dikkatsizlik riski).</p>
      <div class="ales-sol-answer">Karar noktası: <span class="key">B) 12-13 soru = ideal, &lt;10 = hızlan, &gt;15 = dikkatli oku</span></div>
    </div>
  </div>

  <!-- Senaryo 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 3</span>
      <span class="ales-prob-type">Geride Kalma Yönetimi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      <strong>40 dakika geçti, sadece 18 soru çözdün.</strong> 35 dk + 32 soru kaldı. Yetişebilir misin?<br><br>
      <strong>A)</strong> Yetişemezsin, sınavı bırak &nbsp; <strong>B)</strong> Aynı tempoda devam et &nbsp; <strong>C)</strong> En uzun problemlerden başla &nbsp; <strong>D)</strong> <span class="key">Hızlanma protokolü, uzun soruları geç bırak</span> &nbsp; <strong>E)</strong> Tüm kalanı random tahminle doldur
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar</div>
      <p class="ales-sol-step"><strong>Tempo hesabı:</strong> Kalan $\\dfrac{35}{32} \\approx 1.09$ dk/soru = ~65 saniye/soru. Çok sıkı.</p>
      <p class="ales-sol-step"><strong>Acil önlemler:</strong> (1) Uzun paragraflı sözel soruları sona at. (2) Hesap yoğun problemleri "şıktan giderek" çöz. (3) 30 saniyede formül gelmiyorsa atla.</p>
      <p class="ales-sol-step"><strong>Gerçekçi hedef:</strong> 32 sorudan 25 deneme + 7 işaretle/random tahmin. Bu, panik halinde bile sayısal anlamlı.</p>
      <div class="ales-sol-answer">Strateji: <span class="key">D) Hızlanma protokolü, uzun soruları geç bırak</span></div>
    </div>
  </div>

  <!-- Senaryo 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 4</span>
      <span class="ales-prob-type">Erken Bitirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      <strong>50 dakikada 50 sorunun hepsini bitirdin.</strong> 25 dk kaldı. Ne yapmalısın? Salondan çık mı?<br><br>
      <strong>A)</strong> Hemen salondan çık, iyi performans &nbsp; <strong>B)</strong> Cevap kâğıdını tamamen değiştir &nbsp; <strong>C)</strong> Telefonu kontrol et &nbsp; <strong>D)</strong> 5 dakika dinlen sonra çık &nbsp; <strong>E)</strong> <span class="key">Salonda kal, kontrol et — 25 dk = +3-5 net</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — ASLA salondan erken çıkma</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Erken bitirme = en az 1 dikkatsizlik hatası riski. 25 dakika net kazanç.</p>
      <p class="ales-sol-step"><strong>Yapılacak sırası:</strong></p>
      <p class="ales-sol-step">1) <strong>İşaretli soruları</strong> tekrar bak (en az 5-7 olur).</p>
      <p class="ales-sol-step">2) <strong>Cevap kâğıdını yeniden kontrol</strong> et — kaydırma hatası var mı? (En sık -2/-3 puan kaybı buradan).</p>
      <p class="ales-sol-step">3) <strong>Hesap yoğun soruları</strong> tekrar çöz — sonuç aynı mı?</p>
      <p class="ales-sol-step">4) Boş bırakılan varsa, son 5 dakikada eleme + tahmin yap (bkz. Senaryo 19).</p>
      <div class="ales-sol-answer">Karar: <span class="key">E) Salonda kal, kontrol et — 25 dk = +3-5 net</span></div>
    </div>
  </div>

  <!-- Senaryo 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 5</span>
      <span class="ales-prob-type">Tek Soruda Çakılma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      <strong>3 dakika geçti tek bir sözel mantık sorusunda.</strong> Hâlâ çözemedin. Devam mı, geç mi?<br><br>
      <strong>A)</strong> Tam yarım saate kadar devam et &nbsp; <strong>B)</strong> Hemen random tahmin yap &nbsp; <strong>C)</strong> <span class="key">İşaretle + geç + sonradan dön</span> &nbsp; <strong>D)</strong> Çözene kadar dur &nbsp; <strong>E)</strong> Bu soruyu boş bırak ve unut
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — 90 saniye kuralı</div>
      <p class="ales-sol-step"><strong>Maliyet hesabı:</strong> 3 dakika = ortalama 2 sorunun yerine harcadığın zaman. 1 doğru için 2 fırsat kaybı.</p>
      <p class="ales-sol-step"><strong>Kural:</strong> Bir soruda <strong>90 saniye</strong>'yi geçtiğinde:</p>
      <p class="ales-sol-step">→ Şıkları hızlıca eleme yap (en az 1-2 absürt şık eler).</p>
      <p class="ales-sol-step">→ İşaretle, geç. Sonradan dön.</p>
      <p class="ales-sol-step"><strong>Psikoloji:</strong> "Bunu çözmek zorundayım" düşüncesi tuzaktır. ALES'te 50 sorudan 35-40 doğru çoğu hedefe yetiyor; tek bir soruyu kovalamak <em>ekonomik değil</em>.</p>
      <div class="ales-sol-answer">Karar: <span class="key">C) İşaretle + geç + sonradan dön</span></div>
    </div>
  </div>

  <!-- Senaryo 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 6</span>
      <span class="ales-prob-type">Son 10 Dakika</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      <strong>Son 10 dakikan kaldı.</strong> 8 soru hâlâ boş. Stratejilerden hangisi en yüksek beklenen net'i verir?<br><br>
      <strong>A)</strong> 8 soruya düzgün çözüm dene (~3 doğru beklenir) &nbsp; <strong>B)</strong> <span class="key">4 soruya odaklan + 4 random (~3.6 doğru)</span> &nbsp; <strong>C)</strong> Hepsine random tahmin yap (~1.6 doğru) &nbsp; <strong>D)</strong> Hepsini boş bırak (0 doğru) &nbsp; <strong>E)</strong> 2 soruya odaklan + 6 boş
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Beklenen Net Hesabı</div>
      <p class="ales-sol-step"><strong>ALES yanlış cevap kayıp puanı 0</strong> (yanlış net'i etkilemez, sadece doğru sayısı puan). Bu, "<em>hepsini doldur</em>" stratejisini güvenli kılar.</p>
      <p class="ales-sol-step"><strong>A:</strong> 10 dk / 8 soru = 75 sn/soru, çoğu yanlış olur. Beklenen doğru: ~3.</p>
      <p class="ales-sol-step"><strong>B:</strong> 4 soruya 2 dk/soru (~%70 doğru = 2.8) + 4 random (1/5 = 0.8) = <strong>~3.6 doğru</strong>.</p>
      <p class="ales-sol-step"><strong>C:</strong> 8 random (%20 = 1.6 doğru) ⟹ ~1.6.</p>
      <p class="ales-sol-step"><strong>Optimal:</strong> B — odaklı + sonra random.</p>
      <div class="ales-sol-answer">Karar: <span class="key">B) 4 odak + 4 random tahmin</span></div>
    </div>
  </div>

  <!-- Senaryo 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 7</span>
      <span class="ales-prob-type">Saat Kontrolü Sıklığı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Sınav sırasında saate <strong>ne sıklıkla</strong> bakmalısın?<br><br>
      <strong>A)</strong> Her 2 dakikada bir bak &nbsp; <strong>B)</strong> Sadece sınav sonunda bak &nbsp; <strong>C)</strong> Her soruda bir bak &nbsp; <strong>D)</strong> <span class="key">4 kontrol noktası, başka bakma</span> &nbsp; <strong>E)</strong> Hiç bakma, kapatıldı varsay
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — 4 Kontrol Noktası</div>
      <p class="ales-sol-step"><strong>Çok sık bakmak (her 2 dakikada):</strong> Konsantrasyonu kırar, panik tetikler. Maliyet: -3 net (dikkatsizlik).</p>
      <p class="ales-sol-step"><strong>Çok seyrek (sadece sonda):</strong> Tempo kaybetmiş olabilirsin, son 10 dk tetikte değilsin. Maliyet: -5 net (eksik soru).</p>
      <p class="ales-sol-step"><strong>İdeal: 4 kontrol noktası.</strong></p>
      <div class="ales-diagram">
        <table>
          <thead><tr><th>Nokta</th><th>Zaman</th><th>Beklenen</th><th>Aksiyon</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>~19 dk (1/4)</td><td>12-13 soru</td><td>Tempo OK?</td></tr>
            <tr><td>2</td><td>~38 dk (1/2)</td><td>25 soru</td><td>Yarıdayız mı?</td></tr>
            <tr><td>3</td><td>~56 dk (3/4)</td><td>37 soru</td><td>Son sprint hazırlık</td></tr>
            <tr><td>4</td><td>Son 10 dk</td><td>≥45 soru</td><td>Boşları doldur</td></tr>
          </tbody>
        </table>
      </div>
      <div class="ales-sol-answer">Strateji: <span class="key">D) 4 kontrol noktası, başka bakma</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Konu Önceliği ve Soru Seçimi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Konu Önceliği ve Soru Seçimi</h2>
  </div>

  <!-- Senaryo 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 8</span>
      <span class="ales-prob-type">Konu Önceliği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      ALES Sayısal'da bir konunun sırada ilk gelmesi sana avantaj sağlar mı? Hangi konudan başlamalısın?<br><br>
      <strong>A)</strong> En zor konudan başla, kolaylar sonra &nbsp; <strong>B)</strong> Random sırayla çöz &nbsp; <strong>C)</strong> Sondan başa doğru çöz &nbsp; <strong>D)</strong> Sadece bildiğin konuları çöz &nbsp; <strong>E)</strong> <span class="key">Sırasıyla + zor konuları işaretle</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Konu Önceliği Tablosu</div>
      <div class="ales-diagram">
        <table>
          <thead><tr><th>Öncelik</th><th>Konu</th><th>Hız</th><th>Net Verimi</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Doğal/Tam/Rasyonel sayılar</td><td>Hızlı (40-60 sn)</td><td>Yüksek</td></tr>
            <tr><td>2</td><td>Yüzde, Oran-Orantı</td><td>Hızlı (60 sn)</td><td>Yüksek</td></tr>
            <tr><td>3</td><td>Bölünebilme + EBOB/EKOK</td><td>Orta (75 sn)</td><td>Yüksek</td></tr>
            <tr><td>4</td><td>Denklem + Polinom</td><td>Orta (90 sn)</td><td>Orta</td></tr>
            <tr><td>5</td><td>Geometri (uzunluk/alan)</td><td>Orta (90 sn)</td><td>Orta</td></tr>
            <tr><td>6</td><td>Sözel problem (yaş, hız, işçi)</td><td>Yavaş (2 dk)</td><td>Orta</td></tr>
            <tr><td>7</td><td>Mantık + Tablo yorumu</td><td>Yavaş (2 dk)</td><td>Yüksek (atlanmasın)</td></tr>
            <tr><td>8</td><td>Permütasyon-Olasılık</td><td>Yavaş (2 dk)</td><td>Düşük (zor sorular)</td></tr>
          </tbody>
        </table>
      </div>
      <p class="ales-sol-step"><strong>Strateji:</strong> Sırasıyla git ama "Permütasyon" gibi zor konularda <em>ikinci tura</em> bırak.</p>
      <div class="ales-sol-answer">Karar: <span class="key">E) Sırasıyla + zor konuları işaretle</span></div>
    </div>
  </div>

  <!-- Senaryo 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 9</span>
      <span class="ales-prob-type">Sözel Mantıkta Çakılma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      <strong>Sözel problemde 3 dakika takıldın</strong> ("Ali Berk'ten 5 yaş büyük..."). Geometri sorusu kolay görünüyor. Ne yaparsın?<br><br>
      <strong>A)</strong> Sözel problemi çözene kadar dur &nbsp; <strong>B)</strong> <span class="key">İşaretle + geometriye git + sonra dön</span> &nbsp; <strong>C)</strong> Geometriyi de boş bırak, paniklen &nbsp; <strong>D)</strong> Random tahmin yap iki soruya da &nbsp; <strong>E)</strong> Sözel için 5 dk daha harca
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar</div>
      <p class="ales-sol-step"><strong>Vazgeçme protokolü:</strong> 90 sn kuralından sonra hâlâ takılıysan: işaretle (?), bir sonraki soruya geç.</p>
      <p class="ales-sol-step"><strong>Şüphesiz:</strong> Kolay görünen geometri sorusunu kaçırmak çok daha pahalı. 1 garanti net &gt; 1 ihtimalli net.</p>
      <p class="ales-sol-step"><strong>İkinci tur stratejisi:</strong> Sona doğru tüm soruları bitirdiğinde işaretlilere dön. O zaman beynin "yan yol" da bulabilir.</p>
      <div class="ales-sol-answer">Karar: <span class="key">B) İşaretle + geometriye git + sonra dön</span></div>
    </div>
  </div>

  <!-- Senaryo 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 10</span>
      <span class="ales-prob-type">Tablo Yorumu Atlama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Karşına büyük bir tablo + 3 ardışık soru çıktı. "Vakit alır" diye hemen atlamalı mısın?<br><br>
      <strong>A)</strong> Evet hemen atla, çok vakit alır &nbsp; <strong>B)</strong> Sadece 1 sorusunu çöz, ikisini atla &nbsp; <strong>C)</strong> <span class="key">Tabloyu hep çöz — yatırım amorti</span> &nbsp; <strong>D)</strong> Tabloya hiç bakma, random tahmin &nbsp; <strong>E)</strong> Sona en sonda dön
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — ASLA atlamayın</div>
      <p class="ales-sol-step"><strong>ALES tablosu = okuma testidir.</strong> Matematik basit (toplama, yüzde). Tablo bir kez "okunduğunda" yatırım amorti olur.</p>
      <p class="ales-sol-step"><strong>Yatırım hesabı:</strong> 30 sn tablo okuma + 60 sn × 3 soru = 3.5 dk → <strong>3 net</strong>. Bu çok verimli (<em>1.17 dk/net</em>).</p>
      <p class="ales-sol-step"><strong>Strateji:</strong> Tabloyu gördüğünde hemen başla. Bir cevap çıkmadıkça paniğe kapılma.</p>
      <div class="ales-sol-answer">Karar: <span class="key">C) Tabloyu hep çöz — yatırım amorti</span></div>
    </div>
  </div>

  <!-- Senaryo 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 11</span>
      <span class="ales-prob-type">Şıklarda İki Cevap</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir soruyu çözdün, hesabın <strong>240</strong> verdi. Şıklarda hem 240 hem de 24 var. Tuzak nasıl atılır?<br><br>
      <strong>A)</strong> Her zaman büyük sayıyı seç &nbsp; <strong>B)</strong> Her zaman küçük sayıyı seç &nbsp; <strong>C)</strong> Random olarak birini seç &nbsp; <strong>D)</strong> Yarısını seç (132) &nbsp; <strong>E)</strong> <span class="key">Birim kontrolü + bağlam mantığı</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Birim Kontrolü</div>
      <p class="ales-sol-step"><strong>Tipik tuzak:</strong> Sınav hazırlayıcıları "ondalık nokta" hatasını yakalamak için 10 katı/onda biri sayıları şıka koyar.</p>
      <p class="ales-sol-step"><strong>Çözüm:</strong> Soruyu yeniden hızlı oku. "Kaç metre?" mı "Kaç kilometre?" mi? "TL" mı "milyon TL" mı?</p>
      <p class="ales-sol-step"><strong>Genel sezgi:</strong> Soru bağlamına göre mantıklı olanı seç. Bir aile yıllık 24 TL harcamaz; 240 ya da 240 000 olmalı.</p>
      <div class="ales-sol-answer">Karar: <span class="key">E) Birim kontrolü + bağlam mantığı</span></div>
    </div>
  </div>

  <!-- Senaryo 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 12</span>
      <span class="ales-prob-type">Permütasyonda Çakılma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Permütasyon sorusu: "5 kişiyi 3'lü gruba ayırma yolu sayısı". Formülü hatırlamıyorsun. Ne yaparsın?<br><br>
      <strong>A)</strong> Random tahmin yap hemen &nbsp; <strong>B)</strong> Soruyu tamamen boş bırak &nbsp; <strong>C)</strong> Formülü bulana kadar bekle &nbsp; <strong>D)</strong> <span class="key">Manuel say + şık eleme</span> &nbsp; <strong>E)</strong> En büyük şıkkı işaretle
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Sayma + Eleme</div>
      <p class="ales-sol-step"><strong>Formül unutulduğunda:</strong> Küçük sayılarla manuel sayma → şıkları kontrol.</p>
      <p class="ales-sol-step">Örneğimizde: $\\binom{5}{3} = 10$. Ama hatırlamıyorsan tüm 3'lü kombinasyonları yaz: ABC, ABD, ABE, ACD, ACE, ADE, BCD, BCE, BDE, CDE = 10.</p>
      <p class="ales-sol-step"><strong>Manuel sayma riski:</strong> Yorucu ama güvenli. 90 sn'yi geçerse vazgeç.</p>
      <p class="ales-sol-step"><strong>Alternatif:</strong> Şıklara bak — eğer cevaplar 10, 60, 120, 720 gibiyse 10 (kombinasyon) ile 60 ($5 \\cdot 4 \\cdot 3$ permütasyon) arasında karar ver. "Grup" = sıralama önemsiz = kombinasyon.</p>
      <div class="ales-sol-answer">Karar: <span class="key">D) Manuel say + şık eleme</span></div>
    </div>
  </div>

  <!-- Senaryo 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 13</span>
      <span class="ales-prob-type">Soru Atlama Karışıklığı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Soru 17'yi atladın, 18'i çözdün, sonra cevap kâğıdına 18'in cevabını <strong>17. satıra</strong> işaretledin! 5 soru sonra fark ettin. Ne yaparsın?<br><br>
      <strong>A)</strong> Görmezden gel, devam et &nbsp; <strong>B)</strong> Cevap kâğıdını yırt &nbsp; <strong>C)</strong> Gözetmene başkasını iste &nbsp; <strong>D)</strong> Sınavı bırak &nbsp; <strong>E)</strong> <span class="key">Hemen düzelt + 5 soruda bir kontrol et</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Acil Düzeltme + Önleme</div>
      <p class="ales-sol-step"><strong>Hemen dur.</strong> Bu en sık -5/-10 puan kaybeden hatadır.</p>
      <p class="ales-sol-step"><strong>Düzeltme:</strong> Cevap kâğıdını 5 satır geri kontrol et, kaymış sıralamayı silgiyle düzelt. (Optik okuyucu için temiz silme şart.)</p>
      <p class="ales-sol-step"><strong>Önleme stratejisi (sınav öncesi öğrenilmeli):</strong></p>
      <p class="ales-sol-step">1) <strong>Atlanan soruyu büyük X ile işaretle</strong> kitapçıkta.</p>
      <p class="ales-sol-step">2) <strong>Cevap kâğıdını 5 soruda bir kontrol et</strong> — son şıkkın doğru satıra geldiğini doğrula.</p>
      <p class="ales-sol-step">3) <strong>Önce kitapçığa yaz, sonra blok halinde aktarma yapma</strong> — her soruyu çözdükten sonra cevap kâğıdına da işaretle.</p>
      <div class="ales-sol-answer">Karar: <span class="key">E) Hemen düzelt + 5 soruda bir kontrol et</span></div>
    </div>
  </div>

  <!-- Senaryo 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 14</span>
      <span class="ales-prob-type">Yazımı Belirsiz Soru</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir soru iki şekilde yorumlanabiliyor: "<em>artırılırsa</em>" mı "<em>indirilirse</em>" mi belirsiz. Sen kararsızsın. Ne yaparsın?<br><br>
      <strong>A)</strong> Random şık seç &nbsp; <strong>B)</strong> Soruyu tamamen boş bırak &nbsp; <strong>C)</strong> Sadece "artırılırsa" varsay &nbsp; <strong>D)</strong> <span class="key">İki yorum hesapla + şıklara bak</span> &nbsp; <strong>E)</strong> Gözetmene sor
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Şıklara Sor</div>
      <p class="ales-sol-step"><strong>Şıklar size konuşur.</strong> İki yorum için iki farklı sonuç hesapla — hangisi şıkta varsa o doğrudur.</p>
      <p class="ales-sol-step"><strong>Örnek:</strong> "200 TL %20 değişti" — artırma ⟹ 240, indirme ⟹ 160. Şıkta sadece 240 varsa, "artırılırsa" yorumu doğru.</p>
      <p class="ales-sol-step"><strong>Uyarı:</strong> Eğer her iki sonuç da şıkta varsa (bilerek tuzak), soruyu bir kez daha dikkatlice oku. Türkçe ekler ("-arak", "-ince") yön belirler.</p>
      <div class="ales-sol-answer">Karar: <span class="key">D) İki yorum hesapla + şıklara bak</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Cevap Kâğıdı + Psikoloji
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Cevap Kâğıdı ve Psikoloji</h2>
  </div>

  <!-- Senaryo 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 15</span>
      <span class="ales-prob-type">Boş Bırakma Matematiği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Sınavın sonunda <strong>5 soru boş</strong>. ALES'te yanlış cevap puan kırmıyor. Boş bırakma vs random tahmin — beklenen kazanç farkı?<br><br>
      <strong>A)</strong> Boş bırak, yanlış riski var &nbsp; <strong>B)</strong> Random tahmin = boş bırakma ile aynı &nbsp; <strong>C)</strong> <span class="key">ASLA boş bırakma — son 1 dk hepsini doldur</span> &nbsp; <strong>D)</strong> Sadece yarısını doldur &nbsp; <strong>E)</strong> Gözetmenden zaman uzatma iste
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Beklenen Net</div>
      <p class="ales-sol-step"><strong>Boş:</strong> 5 boş × 0 = 0 net.</p>
      <p class="ales-sol-step"><strong>Random:</strong> Her soru için 1/5 doğru olasılığı (5 şık). Beklenen doğru = $5 \\times \\dfrac{1}{5} = 1$. Bu <strong>+1 net</strong>.</p>
      <p class="ales-sol-step"><strong>Eleme + tahmin:</strong> 1 absürt şıkkı atabilirsen, 1/4 olasılık ⟹ beklenen = 1.25 net. 2 elersen 1/3 ⟹ 1.67 net.</p>
      <div class="ales-diagram">
        <table>
          <thead><tr><th>Strateji</th><th>5 Soruda Beklenen</th></tr></thead>
          <tbody>
            <tr><td>Boş bırak</td><td>0 net</td></tr>
            <tr><td>Random tahmin</td><td>+1.0 net</td></tr>
            <tr><td>1 şık ele + tahmin</td><td>+1.25 net</td></tr>
            <tr><td>2 şık ele + tahmin</td><td>+1.67 net</td></tr>
            <tr><td>3 şık ele + tahmin</td><td>+2.5 net</td></tr>
          </tbody>
        </table>
      </div>
      <div class="ales-sol-answer">Karar: <span class="key">C) ASLA boş bırakma — son 1 dk hepsini doldur</span></div>
    </div>
  </div>

  <!-- Senaryo 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 16</span>
      <span class="ales-prob-type">Panik Atak Müdahalesi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      <strong>20. soruda nefesin daralıyor, kalbin hızlanıyor</strong> — panik geliyor. Ne yaparsın?<br><br>
      <strong>A)</strong> Daha hızlı çözmeye çalış &nbsp; <strong>B)</strong> Sınavı bırak çık &nbsp; <strong>C)</strong> Gözetmenden ilaç iste &nbsp; <strong>D)</strong> <span class="key">30 sn dur + 4-7-8 nefes + kolay sorudan başla</span> &nbsp; <strong>E)</strong> Su iç ve devam et
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — 4-7-8 Nefes Protokolü</div>
      <p class="ales-sol-step"><strong>Kalemini bırak. 30 saniye için.</strong> 30 sn paniğe yatırım, 30 dk dağılma riski olarak geri döner.</p>
      <p class="ales-sol-step"><strong>4-7-8 nefes tekniği:</strong></p>
      <p class="ales-sol-step">1) <strong>4 saniye burundan derin nefes al</strong>.</p>
      <p class="ales-sol-step">2) <strong>7 saniye nefesini tut</strong>.</p>
      <p class="ales-sol-step">3) <strong>8 saniye ağzından yavaşça ver</strong>.</p>
      <p class="ales-sol-step">4) 3 kez tekrarla.</p>
      <p class="ales-sol-step"><strong>Sonra:</strong> Kolay bir konudan (sayılar, yüzde) bir soruya geç. Bir doğru = öz güveni geri yükler.</p>
      <div class="ales-sol-answer">Karar: <span class="key">D) 30 sn dur + 4-7-8 nefes + kolay sorudan başla</span></div>
    </div>
  </div>

  <!-- Senaryo 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 17</span>
      <span class="ales-prob-type">Cevap Kâğıdı Aktarma Şekli</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Cevap kâğıdına <strong>her soru</strong> sonrası mı, <strong>her 5 soru</strong> blok halinde mi, yoksa <strong>sınavın sonunda</strong> hep birden mi aktarmalısın?<br><br>
      <strong>A)</strong> Sınavın sonunda hepsini birden &nbsp; <strong>B)</strong> Her 5 soru blok halinde &nbsp; <strong>C)</strong> Her 10 soru sonra blok &nbsp; <strong>D)</strong> <span class="key">Her soru sonrası tek tek aktar</span> &nbsp; <strong>E)</strong> Bir gözetmenden yardım iste
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Bloksuz Aktarma</div>
      <p class="ales-sol-step"><strong>Sona bırakmak:</strong> En riskli. Süre yetmezse boş kalır + kaydırma hatası riski yüksek. <em>Asla yapma.</em></p>
      <p class="ales-sol-step"><strong>5'er blok:</strong> Verimli görünür ama "atlanan soru karışıklığı" (Senaryo 13) burada başlar.</p>
      <p class="ales-sol-step"><strong>Her soru sonrası:</strong> En güvenli. 2 saniye ek maliyet × 50 soru = 100 sn. Bu yatırım kesin -3/-5 net kaybını önler.</p>
      <p class="ales-sol-step"><strong>Ama:</strong> İşaretli sorularda <em>cevap kâğıdına da bir nokta koy</em> — sonra döndüğünde kolay bul.</p>
      <div class="ales-sol-answer">Karar: <span class="key">D) Her soru sonrası tek tek aktar</span></div>
    </div>
  </div>

  <!-- Senaryo 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 18</span>
      <span class="ales-prob-type">Cevap Değiştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir soruda B şıkkını işaretledin. Sonra dönüp baktığında "Belki D olmalı" diye düşünüyorsun. <strong>Cevabını değiştirmeli misin?</strong><br><br>
      <strong>A)</strong> Her zaman değiştir, ikinci içgüdü doğrudur &nbsp; <strong>B)</strong> Hiçbir zaman değiştirme &nbsp; <strong>C)</strong> <span class="key">Yeni bilgi varsa değiştir, sadece tereddütse değiştirme</span> &nbsp; <strong>D)</strong> Random olarak değiştir &nbsp; <strong>E)</strong> Üçüncü şıkka değiştir
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Yeni Bilgi Kuralı</div>
      <p class="ales-sol-step"><strong>Araştırma:</strong> Cevap değiştirenlerin %50'si daha kötü, %50'si daha iyi olur — sıfır net etki <em>ortalama</em>.</p>
      <p class="ales-sol-step"><strong>Ama bireysel olarak:</strong> Eğer "<em>yeni bir bilgi</em>" fark ettiysen (formül hatası, yanlış okuma), <strong>değiştir</strong>. Sadece "tereddüt" varsa, <strong>değiştirme</strong>.</p>
      <p class="ales-sol-step"><strong>Pratik kural:</strong> İlk içgüdün doğru cevabı bulduğun zamanların %70'inde haklıdır. Sebep yoksa, ilk cevap kalsın.</p>
      <div class="ales-sol-answer">Karar: <span class="key">C) Yeni bilgi varsa değiştir, sadece tereddütse değiştirme</span></div>
    </div>
  </div>

  <!-- Senaryo 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 19</span>
      <span class="ales-prob-type">Random Şık Seçimi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Son 30 saniyede 4 soru random tahmin yapacaksın. Hep aynı şıkkı işaretlemek (örn. hepsi C) mı, yoksa karışık mı? İstatistiksel fark var mı?<br><br>
      <strong>A)</strong> Her zaman A şıkkı &nbsp; <strong>B)</strong> Karışık ABCDE sırasında &nbsp; <strong>C)</strong> <span class="key">Hep C — hızlı + istatistik avantajı</span> &nbsp; <strong>D)</strong> Her zaman E şıkkı &nbsp; <strong>E)</strong> Hepsini boş bırak
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Aynı Şık Stratejisi</div>
      <p class="ales-sol-step"><strong>Matematiksel olarak:</strong> Her sorunun cevabı bağımsız olduğundan, <em>uzun vadede</em> hep aynı şık vs karışık seçim eşit beklenen değer verir (1/5 her biri).</p>
      <p class="ales-sol-step"><strong>Pratik avantaj:</strong> "Hep C" daha hızlı (düşünme yok) ⟹ <strong>30 saniye yerine 10 saniyede biter</strong>.</p>
      <p class="ales-sol-step"><strong>Hangi şık:</strong> Eski sınavlarda istatistik <strong>C ve D</strong> en sık doğru cevap. Hep C işaretle = ~%21 doğru oran (ortalamadan biraz yüksek).</p>
      <p class="ales-sol-step"><strong>Ama:</strong> Eğer zaten birkaç çözdüğün soruda C dedin, dengeleme için B ya da D denebilir.</p>
      <div class="ales-sol-answer">Karar: <span class="key">C) Hep C — hızlı + istatistik avantajı</span></div>
    </div>
  </div>

  <!-- Senaryo 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 20</span>
      <span class="ales-prob-type">Sınav Öncesi Son Hafta</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Sınava <strong>1 hafta</strong> kaldı. Yeni konu öğrenmek mi, eski tekrar mı, deneme çözmek mi öncelik?<br><br>
      <strong>A)</strong> Yeni konuları öğrenmeye odaklan &nbsp; <strong>B)</strong> Sadece denemeler çöz, tekrar yok &nbsp; <strong>C)</strong> <span class="key">Yeni konu yok, deneme + tekrar, son gün dinlen</span> &nbsp; <strong>D)</strong> Son güne kadar 12 saat çalış &nbsp; <strong>E)</strong> Sadece zor konuları çalış
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Son Hafta Planı</div>
      <div class="ales-diagram">
        <table>
          <thead><tr><th>Gün</th><th>Aktivite</th><th>Süre</th></tr></thead>
          <tbody>
            <tr><td>−7</td><td>Tam deneme + analiz</td><td>3 saat</td></tr>
            <tr><td>−6</td><td>Yanlış konuların hızlı tekrarı</td><td>3 saat</td></tr>
            <tr><td>−5</td><td>Tam deneme + analiz</td><td>3 saat</td></tr>
            <tr><td>−4</td><td>Yanlış konu tekrarı + formül kartları</td><td>3 saat</td></tr>
            <tr><td>−3</td><td>Tam deneme (gerçek saatte)</td><td>3 saat</td></tr>
            <tr><td>−2</td><td>Hafif tekrar + erken yatış</td><td>2 saat</td></tr>
            <tr><td>−1</td><td><strong>Çalışma YASAK</strong>, dinlen</td><td>0</td></tr>
          </tbody>
        </table>
      </div>
      <p class="ales-sol-step"><strong>Yeni konu YOK.</strong> Yeni konu kaygıyı artırır, faydası az.</p>
      <p class="ales-sol-step"><strong>Sınav günü öncesi gece:</strong> 7-8 saat uyu, sabah hafif protein-karbonhidrat kahvaltı.</p>
      <div class="ales-sol-answer">Strateji: <span class="key">C) Yeni konu yok, deneme + tekrar, son gün dinlen</span></div>
    </div>
  </div>

  <!-- Senaryo 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Senaryo 21</span>
      <span class="ales-prob-type">Sınav Sabahı Protokolü</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Sınav sabahı 09:00'da başlıyor. <strong>Saat kaçta uyanmalısın? Ne yemelisin? Sınava giderken ne yapmamalısın?</strong><br><br>
      <strong>A)</strong> 08:30 uyan, kahvaltı atla &nbsp; <strong>B)</strong> 06:30 uyan, çok kafein içerek hazırla &nbsp; <strong>C)</strong> Sınav gecesi uyuma &nbsp; <strong>D)</strong> <span class="key">Saatlik plan + kontrol + nefes + güven</span> &nbsp; <strong>E)</strong> Yolda yeni konular tekrar et
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Karar — Sınav Sabahı Saatlik Plan</div>
      <div class="ales-diagram">
        <table>
          <thead><tr><th>Saat</th><th>Aktivite</th></tr></thead>
          <tbody>
            <tr><td>06:30</td><td>Uyan (en az 2.5 saat zihin uyanışı için)</td></tr>
            <tr><td>06:45</td><td>10 dakika hafif egzersiz / esneme</td></tr>
            <tr><td>07:00</td><td>Kahvaltı: yumurta + tam buğday + meyve. <em>Aşırı şeker yok</em> (kan şekeri düşüşü panik tetikler)</td></tr>
            <tr><td>07:30</td><td>Kimlik + kalem + saat kontrolü. Sınav giriş belgesini tekrar bak</td></tr>
            <tr><td>08:00</td><td>Sınav merkezine yola çık. <em>Çalışma yok!</em></td></tr>
            <tr><td>08:30</td><td>Yerinde ol, 5 dk meditasyon ya da kitap (sınav konusu DEĞİL)</td></tr>
            <tr><td>08:55</td><td>Salonda otur, 4-7-8 nefes 3 kez yap</td></tr>
            <tr><td>09:00</td><td>Sınav başla — ilk 2 dakika sayfayı tara, kolaylar nerede gör</td></tr>
          </tbody>
        </table>
      </div>
      <p class="ales-sol-step"><strong>YAPMAMASI GEREKEN:</strong></p>
      <p class="ales-sol-step">1) Sabah <strong>yeni konu</strong> bakma. Hatırlamadığını fark edersen panik patlar.</p>
      <p class="ales-sol-step">2) <strong>Aşırı kafein</strong> içme. 1 fincan yeterli; fazlası tremor + kalp çarpıntısı.</p>
      <p class="ales-sol-step">3) <strong>Sosyal medya/haber</strong> okuma. Beyni gereksiz dolduruyor.</p>
      <p class="ales-sol-step">4) <strong>Diğer adaylarla "ne çalıştın?" sohbeti</strong> yapma. Karşılaştırma kaygıyı artırır.</p>
      <p class="ales-sol-step"><strong>Son söz:</strong> Aylarca hazırlandın. 75 dakika boyunca kendine güven. <em>Bu sınav senin son şansın değil — ama olduğu gibi davran ki tam hazırlıklı git</em>.</p>
      <div class="ales-sol-answer">Karar: <span class="key">D) Saatlik plan + kontrol + nefes + güven</span></div>
    </div>
  </div>
</section>
`
};
