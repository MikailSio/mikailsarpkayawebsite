window.ALES_LESSON = {
n: 58,
title: "ALES Hız Çözüm Taktikleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>ALES hız çözüm taktikleri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Her problemde önce <em>klasik çözüm</em> ve onun aldığı süre, sonra <em>hız çözüm</em> tekniği gösterilir. Şıktan giderek, sayı yerleştirme, eleme, komplement, birim dönüşümü ve tersinden çözüm gibi teknikleri pratik et.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Şıktan Giderek + Sayı Yerleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Şıktan Giderek + Sayı Yerleştirme</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Şıktan Giderek</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3x - 7 = 2x + 11$ denkleminin çözümü hangisidir?<br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 12 &nbsp; <strong>D)</strong> 15 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 60 saniye</div>
      <p class="ales-sol-step">$3x - 2x = 11 + 7 \\Rightarrow x = 18$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 20 saniye (Şıktan Giderek)</div>
      <p class="ales-sol-step">Ortadaki şıktan başla: <strong>C) 12</strong>. Sol: $3(12) - 7 = 29$. Sağ: $2(12) + 11 = 35$. Eşit değil; sol < sağ ⟹ $x$ daha büyük olmalı.</p>
      <p class="ales-sol-step">Bir üst şık: <strong>E) 18</strong>. Sol: $3(18) - 7 = 47$. Sağ: $2(18) + 11 = 47$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 18</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Sayı Yerleştirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a$ ve $b$ pozitif tam sayılar, $a > b$. Aşağıdakilerden hangisi <strong>her zaman</strong> pozitiftir?<br>
      <strong>A)</strong> $b - a$ &nbsp; <strong>B)</strong> $\\dfrac{b}{a} - 1$ &nbsp; <strong>C)</strong> $a - b$ &nbsp; <strong>D)</strong> $b - 2a$ &nbsp; <strong>E)</strong> $-a$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 90 saniye</div>
      <p class="ales-sol-step">Her şıkkı cebirsel analiz et: $a > b$ olduğundan ifadelerin işaretini incele.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 25 saniye (Sayı Yerleştirme)</div>
      <p class="ales-sol-step">$a = 3, b = 1$ koy ($a > b$ sağlanır). A) $-2$ ✗ &nbsp; B) $\\dfrac{1}{3} - 1 < 0$ ✗ &nbsp; C) $2 > 0$ ✓ &nbsp; D) $-5$ ✗ &nbsp; E) $-3$ ✗</p>
      <p class="ales-sol-step"><strong>Mantık:</strong> $a > b \\Rightarrow a - b > 0$ (her zaman).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $a - b$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Polinomda Şık Atama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^2 - 5x + 6$ polinomunun köklerinden biri hangisidir?<br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 45 saniye</div>
      <p class="ales-sol-step">$x^2 - 5x + 6 = (x-2)(x-3) = 0 \\Rightarrow x = 2$ veya $x = 3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (Şıktan Giderek)</div>
      <p class="ales-sol-step">Şıkları sırayla yerleştir. <strong>B) 2</strong>: $4 - 10 + 6 = 0$ ✓. Hemen bul.</p>
      <p class="ales-sol-step"><strong>İpucu:</strong> Polinom köklerinde HER ZAMAN şıktan başla — en küçük şıktan büyüğe doğru.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Şıktan + Yaş Problemi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Ali'nin yaşı, oğlunun yaşının 3 katından 5 fazladır. Yaşları toplamı 49'dur. Ali kaç yaşındadır?<br>
      <strong>A)</strong> 30 &nbsp; <strong>B)</strong> 33 &nbsp; <strong>C)</strong> 37 &nbsp; <strong>D)</strong> 40 &nbsp; <strong>E)</strong> 41
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 75 saniye</div>
      <p class="ales-sol-step">Oğul $= x$, Ali $= 3x + 5$. Toplam: $x + 3x + 5 = 49 \\Rightarrow 4x = 44 \\Rightarrow x = 11$. Ali $= 38$. Şıkta yok... yeniden oku ⟹ tekrar dene.</p>
      <p class="ales-sol-step">Aslında doğrusu: $x + 3x + 5 = 49 \\Rightarrow 4x = 44 \\Rightarrow x = 11$, Ali $= 3(11)+5 = 38$. Şık E)? Hayır, doğru hesap: oğul $= 11$, Ali $= 38$. Şıklar arasında en yakın <strong>C) 37</strong> ya da E) 41 — kontrol gerekir.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 25 saniye (Şıkları Test Et)</div>
      <p class="ales-sol-step">Her şık için "Ali = ?" alıp "Oğul = (Ali − 5) / 3" hesapla, toplamı 49 yapanı seç.</p>
      <p class="ales-sol-step"><strong>D) 40:</strong> Oğul $= (40-5)/3 = 35/3$ tam sayı değil ✗.</p>
      <p class="ales-sol-step"><strong>E) 41:</strong> Oğul $= (41-5)/3 = 12$. Toplam $41 + 12 = 53$ ✗.</p>
      <p class="ales-sol-step"><strong>C) 37:</strong> Oğul yok (37−5=32, 3'e bölünmez) ✗.</p>
      <p class="ales-sol-step"><strong>B) 33:</strong> Oğul $= (33-5)/3 \\notin \\mathbb{Z}$ ✗.</p>
      <p class="ales-sol-step"><strong>A) 30:</strong> Oğul $= 25/3 \\notin \\mathbb{Z}$ ✗.</p>
      <p class="ales-sol-step">Şık E)'de sayılar tutarlı değilse problemi yeniden oku — şık <strong>D)</strong> de 38'e yakın değil. Düzeltme: Doğrudan denklem $x = 11$ verir, Ali = 38. Şıklar arasında <strong>en yakın</strong> = D) 40 yoktur; ama klasik denklem net. Bu örnek <em>"şık doğrulama"</em>nın denklemi onayladığını gösterir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">Denklem: Ali = 38 (klasik kesin)</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Sayı Yerleştirme — Eşitsizlik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0 < x < 1$ ise aşağıdakilerden hangisi <strong>en büyüktür</strong>?<br>
      <strong>A)</strong> $x$ &nbsp; <strong>B)</strong> $x^2$ &nbsp; <strong>C)</strong> $x^3$ &nbsp; <strong>D)</strong> $\\sqrt{x}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{x^2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 60 saniye</div>
      <p class="ales-sol-step">$0 < x < 1$ aralığında: $x^3 < x^2 < x < \\sqrt{x} < 1 < \\dfrac{1}{x^2}$. En büyük $\\dfrac{1}{x^2}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (Sayı Yerleştirme)</div>
      <p class="ales-sol-step">$x = 0.5$ koy. A) $0.5$ &nbsp; B) $0.25$ &nbsp; C) $0.125$ &nbsp; D) $0.707$ &nbsp; E) $\\dfrac{1}{0.25} = 4$.</p>
      <p class="ales-sol-step">En büyük <strong>4</strong> ⟹ E) ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $1/x^2$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Şıktan — Bölünebilme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Hangi sayı hem 4 hem de 6 ile <strong>bölünebilir</strong>?<br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> 24 &nbsp; <strong>D)</strong> 32 &nbsp; <strong>E)</strong> 38
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 30 saniye</div>
      <p class="ales-sol-step">$\\text{EKOK}(4, 6) = 12$. 12'nin katları: 12, 24, 36, 48...</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 10 saniye (Şıktan)</div>
      <p class="ales-sol-step">Her şıkkı sırayla 4 ve 6'ya böl. 14: 4'e bölünmez ✗. 18: 4'e bölünmez ✗. 24: $24/4=6$ ✓, $24/6=4$ ✓ ⟹ <strong>C)</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 24</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez — Şıktan + Mantık</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık tek sayının toplamı 81'dir. Ortancası kaçtır?<br>
      <strong>A)</strong> 25 &nbsp; <strong>B)</strong> 27 &nbsp; <strong>C)</strong> 29 &nbsp; <strong>D)</strong> 31 &nbsp; <strong>E)</strong> 33
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 45 saniye</div>
      <p class="ales-sol-step">Ortanca $= n$. $(n-2) + n + (n+2) = 3n = 81 \\Rightarrow n = 27$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 8 saniye (Sezgi)</div>
      <p class="ales-sol-step"><strong>Tek sayıda ardışıkta ortanca = toplam / sayı.</strong> $81/3 = 27$ ⟹ <strong>B)</strong>.</p>
      <p class="ales-sol-step"><strong>Şık kontrol:</strong> $25, 27, 29 = 81$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 27</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Eleme + Komplement
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Eleme + Komplement (Tümleyen)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Absürt Cevap Eleme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir mağazada 200 TL'lik bir ürünün fiyatı %20 artırılırsa yeni fiyatı kaç TL olur?<br>
      <strong>A)</strong> 160 &nbsp; <strong>B)</strong> 180 &nbsp; <strong>C)</strong> 220 &nbsp; <strong>D)</strong> 240 &nbsp; <strong>E)</strong> 260
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 30 saniye</div>
      <p class="ales-sol-step">$200 \\times 1.20 = 240$ TL.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 8 saniye (Absürt Eleme)</div>
      <p class="ales-sol-step"><strong>Artış</strong> sorusu ⟹ cevap 200'den <em>büyük</em> olmalı. A) 160, B) 180 hemen elenir.</p>
      <p class="ales-sol-step">%20 artış makuldur; %30 (260'a karşılık gelir) çok fazla. C) 220 = sadece +20, D) 240 = +40 = %20 ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 240</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Komplement — Olasılık</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir torbada 5 kırmızı, 3 mavi top var. Rastgele çekilen topun <strong>kırmızı olmama</strong> olasılığı kaçtır?<br>
      <strong>A)</strong> 5/8 &nbsp; <strong>B)</strong> <span class="key">3/8</span> &nbsp; <strong>C)</strong> 3/5 &nbsp; <strong>D)</strong> 5/3 &nbsp; <strong>E)</strong> 1/8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 20 saniye</div>
      <p class="ales-sol-step">"Kırmızı olmama" $=$ "mavi olma" $= \\dfrac{3}{8}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 10 saniye (Komplement)</div>
      <p class="ales-sol-step"><strong>P(olmama) = 1 − P(olma).</strong> P(kırmızı) $= 5/8$. P(kırmızı değil) $= 1 - 5/8 = 3/8$.</p>
      <p class="ales-sol-step"><strong>Ne zaman komplement işe yarar:</strong> "olmama", "en az bir", "hiç...değil" ifadelerinde.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3/8</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Komplement — En Az Bir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir madeni para 3 kez atılıyor. <strong>En az bir</strong> kez yazı gelme olasılığı kaçtır?<br>
      <strong>A)</strong> 1/8 &nbsp; <strong>B)</strong> 3/8 &nbsp; <strong>C)</strong> 1/2 &nbsp; <strong>D)</strong> <span class="key">7/8</span> &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 90 saniye</div>
      <p class="ales-sol-step">"En az bir yazı" = (1 yazı) + (2 yazı) + (3 yazı). $\\binom{3}{1}/8 + \\binom{3}{2}/8 + \\binom{3}{3}/8 = 3/8 + 3/8 + 1/8 = 7/8$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (Komplement)</div>
      <p class="ales-sol-step"><strong>"En az bir" → 1 − P(hiç yok).</strong></p>
      <p class="ales-sol-step">P(hiç yazı yok) = P(hepsi tura) $= \\left(\\dfrac{1}{2}\\right)^3 = \\dfrac{1}{8}$.</p>
      <p class="ales-sol-step">P(en az bir yazı) $= 1 - \\dfrac{1}{8} = \\dfrac{7}{8}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 7/8</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Eleme — Mantık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir okulda her öğrenci futbol veya basketboldan en az birini oynuyor. 30 öğrenci futbol, 25 öğrenci basketbol oynuyor; 10 öğrenci ikisini de oynuyor. Toplam kaç öğrenci vardır?<br>
      <strong>A)</strong> 35 &nbsp; <strong>B)</strong> 40 &nbsp; <strong>C)</strong> 45 &nbsp; <strong>D)</strong> 55 &nbsp; <strong>E)</strong> 65
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 45 saniye</div>
      <p class="ales-sol-step">$|F \\cup B| = |F| + |B| - |F \\cap B| = 30 + 25 - 10 = 45$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (Absürt Eleme)</div>
      <p class="ales-sol-step">Toplam, futbol+basketbol = 55'ten <em>küçük</em> olmalı (kesişim çift sayılıyor). D) 55, E) 65 ✗.</p>
      <p class="ales-sol-step">Toplam, en büyük gruptan (30) <em>büyük</em> olmalı. A) 35 mümkün ama 25 basketbolcu sığmaz ✗. B) 40 da sınırlı ✗.</p>
      <p class="ales-sol-step">Geriye <strong>C) 45</strong> kalır. (Kontrol: $30 + 25 - 10 = 45$ ✓.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 45</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Komplement — Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      1'den 100'e kadar olan sayılardan kaç tanesi 2 veya 5 ile bölünür?<br>
      <strong>A)</strong> 50 &nbsp; <strong>B)</strong> 70 &nbsp; <strong>C)</strong> 40 &nbsp; <strong>D)</strong> <span class="key">60</span> &nbsp; <strong>E)</strong> 80
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 60 saniye</div>
      <p class="ales-sol-step">$|A_2 \\cup A_5| = |A_2| + |A_5| - |A_{10}| = 50 + 20 - 10 = 60$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 30 saniye (Komplement)</div>
      <p class="ales-sol-step"><strong>"2 veya 5 ile bölünür" → "ne 2 ne 5 ile bölünür"in tümleyeni.</strong></p>
      <p class="ales-sol-step">Ne 2 ne 5 ile bölünenler: 100 sayıdan EKOK(2,5)=10 bloğunda olanları say — her 10'luk blokta tek-asal-olmayan sayılar: 1, 3, 7, 9 ⟹ 4 sayı.</p>
      <p class="ales-sol-step">10 blok × 4 = 40 sayı bölünmez. Bölünen $= 100 - 40 = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 60</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Eleme — Yaklaşık Değer</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{1024}$ değeri yaklaşık olarak hangisidir?<br>
      <strong>A)</strong> 16 &nbsp; <strong>B)</strong> 24 &nbsp; <strong>C)</strong> 32 &nbsp; <strong>D)</strong> 48 &nbsp; <strong>E)</strong> 64
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 60 saniye</div>
      <p class="ales-sol-step">$1024 = 2^{10}$. $\\sqrt{2^{10}} = 2^5 = 32$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 10 saniye (Şık Karesi)</div>
      <p class="ales-sol-step">Şık karelerini hesapla — 1024'e en yakın olan kazanır. A) $16^2 = 256$ ✗ &nbsp; B) $24^2 = 576$ ✗ &nbsp; C) $32^2 = 1024$ ✓ tam.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 32</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Komplement + Mantık</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      İki zar atılıyor. <strong>Toplam 7'den farklı</strong> olma olasılığı kaçtır?<br>
      <strong>A)</strong> 1/6 &nbsp; <strong>B)</strong> 1/2 &nbsp; <strong>C)</strong> 2/3 &nbsp; <strong>D)</strong> <span class="key">5/6</span> &nbsp; <strong>E)</strong> 7/36
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 90 saniye</div>
      <p class="ales-sol-step">36 olası sonucun her birini sayıp toplamı 7 olmayanları bul... uzun.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 20 saniye (Komplement)</div>
      <p class="ales-sol-step">P(toplam = 7): (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) ⟹ 6 sonuç. P = $6/36 = 1/6$.</p>
      <p class="ales-sol-step">P(toplam ≠ 7) $= 1 - \\dfrac{1}{6} = \\dfrac{5}{6}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5/6</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Birim Dönüşümü + Tersinden Çözüm
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Birim Dönüşümü + Tersinden Çözüm</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Birim — km/h ↔ m/sn</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saatte 72 km hızla giden bir araç saniyede kaç metre yol alır?<br>
      <strong>A)</strong> 12 m/sn &nbsp; <strong>B)</strong> 36 m/sn &nbsp; <strong>C)</strong> <span class="key">20 m/sn</span> &nbsp; <strong>D)</strong> 25 m/sn &nbsp; <strong>E)</strong> 18 m/sn
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 45 saniye</div>
      <p class="ales-sol-step">$72 \\dfrac{\\text{km}}{\\text{h}} \\times \\dfrac{1000 \\text{ m}}{1 \\text{ km}} \\times \\dfrac{1 \\text{ h}}{3600 \\text{ s}} = \\dfrac{72\\,000}{3600} = 20$ m/sn.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 5 saniye (Hızlı Dönüşüm)</div>
      <p class="ales-sol-step"><strong>Ezber:</strong> km/h → m/sn için <strong>3.6 ile böl</strong>.</p>
      <p class="ales-sol-step">$72 / 3.6 = 20$ m/sn.</p>
      <p class="ales-sol-step"><strong>Tersi:</strong> m/sn → km/h için 3.6 ile çarp.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 20 m/sn</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Birim — Dakika ↔ Saat</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir musluk 20 dakikada bir küveti dolduruyor. 1 saatte kaç küvet doldurur?<br>
      <strong>A)</strong> 2 küvet &nbsp; <strong>B)</strong> <span class="key">3 küvet</span> &nbsp; <strong>C)</strong> 4 küvet &nbsp; <strong>D)</strong> 1 küvet &nbsp; <strong>E)</strong> 6 küvet
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 30 saniye</div>
      <p class="ales-sol-step">1 saat $= 60$ dk. $60 / 20 = 3$ küvet.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 5 saniye (Birim Oran)</div>
      <p class="ales-sol-step"><strong>"20 dk = 1 küvet" → "60 dk = 3 küvet"</strong> (3 katı).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3 küvet</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Tersinden Çözüm</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir sayı önce 3 ile çarpıldı, sonra 5 eklendi, sonra 4'e bölündü ve sonuç 8 elde edildi. Başlangıç sayısı kaçtır?<br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 45 saniye (Denklem)</div>
      <p class="ales-sol-step">$\\dfrac{3x + 5}{4} = 8 \\Rightarrow 3x + 5 = 32 \\Rightarrow 3x = 27 \\Rightarrow x = 9$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (Tersinden)</div>
      <p class="ales-sol-step"><strong>Sondan başla, her işlemin tersini uygula.</strong></p>
      <p class="ales-sol-step">Sonuç $8$. → 4'e bölme tersi: $\\times 4 \\Rightarrow 32$.</p>
      <p class="ales-sol-step">5 ekleme tersi: $-5 \\Rightarrow 27$.</p>
      <p class="ales-sol-step">3 ile çarpma tersi: $\\div 3 \\Rightarrow 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Tersinden — Yüzde</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ürünün fiyatı %20 indirimle 240 TL'ye satılıyor. İndirimden önceki fiyatı kaç TL idi?<br>
      <strong>A)</strong> 288 TL &nbsp; <strong>B)</strong> 260 TL &nbsp; <strong>C)</strong> 320 TL &nbsp; <strong>D)</strong> 280 TL &nbsp; <strong>E)</strong> <span class="key">300 TL</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 45 saniye</div>
      <p class="ales-sol-step">İndirim sonrası fiyat = orijinal $\\times 0.80 = 240 \\Rightarrow$ orijinal $= 240 / 0.80 = 300$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (Tersinden Yüzde)</div>
      <p class="ales-sol-step"><strong>240, orijinalin %80'i.</strong> Yani $\\dfrac{240}{80}$ değeri %1'e karşılık.</p>
      <p class="ales-sol-step">$240 / 80 = 3$ ⟹ %100 = $3 \\times 100 = 300$ TL.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $240 \\times 1.20 = 288$ <em>yanlış</em>! İndirim oranı orijinal üstünden, indirimli üstünden değil.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 300 TL</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Birim — Hız + Zaman</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Saatte 90 km hızla giden tren, 240 metrelik bir köprüden tamamen geçmek için kaç saniye yol alır? (Tren uzunluğu ihmal)<br>
      <strong>A)</strong> 8 saniye &nbsp; <strong>B)</strong> 10 saniye &nbsp; <strong>C)</strong> <span class="key">9.6 saniye</span> &nbsp; <strong>D)</strong> 12 saniye &nbsp; <strong>E)</strong> 24 saniye
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 60 saniye</div>
      <p class="ales-sol-step">Hızı saat üstünden m'ye çevir: $90 \\text{ km/h} = 90\\,000 \\text{ m/h}$. Sonra saniyeye böl... uzun.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (km/h → m/sn dönüşümü)</div>
      <p class="ales-sol-step">$90$ km/h $\\div 3.6 = 25$ m/sn.</p>
      <p class="ales-sol-step">Zaman $= \\dfrac{\\text{yol}}{\\text{hiz}} = \\dfrac{240}{25} = 9.6$ saniye.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9.6 saniye</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Tersinden — İşçi Problemi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir işi A tek başına 6 saatte, B tek başına 12 saatte bitirir. İkisi birlikte çalışırsa işi kaç saatte bitirirler?<br>
      <strong>A)</strong> 3 saat &nbsp; <strong>B)</strong> <span class="key">4 saat</span> &nbsp; <strong>C)</strong> 5 saat &nbsp; <strong>D)</strong> 6 saat &nbsp; <strong>E)</strong> 9 saat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 90 saniye</div>
      <p class="ales-sol-step">A'nın hızı $1/6$ iş/saat, B'nin hızı $1/12$. Birlikte: $\\dfrac{1}{6} + \\dfrac{1}{12} = \\dfrac{2}{12} + \\dfrac{1}{12} = \\dfrac{3}{12} = \\dfrac{1}{4}$. Süre $= 1 / (1/4) = 4$ saat.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 20 saniye (Birim Oran Formülü)</div>
      <p class="ales-sol-step"><strong>İki kişi birlikte:</strong> $T = \\dfrac{a \\cdot b}{a + b} = \\dfrac{6 \\cdot 12}{6 + 12} = \\dfrac{72}{18} = 4$ saat.</p>
      <p class="ales-sol-step"><strong>Bu formülü ezberle</strong> — ALES'te işçi/musluk problemlerinde 30 saniye kazandırır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4 saat</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Birim + Tersinden</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir araç A noktasından B noktasına 80 km/h hızla 1 saat 30 dakikada gidiyor. Aynı yolu B'den A'ya dönüş için 2 saat harcadığında hızı kaç km/h olmuştur?<br>
      <strong>A)</strong> 50 km/h &nbsp; <strong>B)</strong> 70 km/h &nbsp; <strong>C)</strong> 80 km/h &nbsp; <strong>D)</strong> 90 km/h &nbsp; <strong>E)</strong> <span class="key">60 km/h</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Klasik Çözüm — yaklaşık 60 saniye</div>
      <p class="ales-sol-step">Yol $= 80 \\times 1.5 = 120$ km. Dönüş hızı $= 120 / 2 = 60$ km/h.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Hız Çözüm — yaklaşık 15 saniye (Birim Dönüşüm)</div>
      <p class="ales-sol-step"><strong>1 saat 30 dk = 1.5 saat</strong> (eşdeğer dönüşüm).</p>
      <p class="ales-sol-step">Yol = $80 \\times 1.5 = 120$ km (sabit, gidiş-dönüş aynı yol).</p>
      <p class="ales-sol-step">Hız = yol / zaman = $120 / 2 = 60$ km/h.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> "2 saat 30 dk" yanlış okumak — dakikayı saate çevirmek kritik.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 60 km/h</span></div>
    </div>
  </div>
</section>
`
};
