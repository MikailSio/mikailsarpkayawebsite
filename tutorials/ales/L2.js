window.ALES_LESSON = {
n: 2,
title: "Tam Sayılar (ℤ) ve Sayı Doğrusu",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>tam sayılar</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. İşaret kuralları, sayı doğrusunda sıralama, mutlak büyüklük ve ardışık tam sayılar problem içinde adım adım uygulanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Negatif/Pozitif/Sıfır ve Sıralama
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Negatif/Pozitif/Sıfır ve Sayı Doğrusunda Sıralama</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Doğru/Yanlış</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden kaç tanesi <strong>doğru</strong>dur?<br>
      <strong>I.</strong> $0$, tam sayıdır.<br>
      <strong>II.</strong> Her doğal sayı bir tam sayıdır.<br>
      <strong>III.</strong> Her tam sayı bir doğal sayıdır.<br>
      <strong>IV.</strong> $-7$, negatif tam sayıdır.<br>
      <strong>V.</strong> $0$, pozitif tam sayıdır.<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Hatırla:</strong> $\\mathbb{Z} = \\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$ &nbsp;·&nbsp; $\\mathbb{Z}^{+} = \\{1,2,\\dots\\}$ &nbsp;·&nbsp; $\\mathbb{Z}^{-} = \\{-1,-2,\\dots\\}$ &nbsp;·&nbsp; $0$ ne pozitif ne negatif.</p>
      <p class="ales-sol-step"><strong>I.</strong> $0 \\in \\mathbb{Z}$ ✓ &nbsp; <strong>II.</strong> $\\mathbb{N} \\subset \\mathbb{Z}$ ✓ &nbsp; <strong>III.</strong> $-3 \\in \\mathbb{Z}$ ama $\\notin \\mathbb{N}$ ✗</p>
      <p class="ales-sol-step"><strong>IV.</strong> $-7 < 0$ ⟹ negatif ✓ &nbsp; <strong>V.</strong> $0$ pozitif değil ✗</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span> (I, II, IV)</div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Sayı Doğrusu — Sıralama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki sayıları <strong>küçükten büyüğe</strong> sıralarsak hangisi doğrudur? Sayılar: $-5,\\; 3,\\; -8,\\; 0,\\; 4,\\; -1$.<br><br>
      <strong>A)</strong> −1, −5, −8, 0, 3, 4 &nbsp; <strong>B)</strong> <span class="key">−8, −5, −1, 0, 3, 4</span> &nbsp; <strong>C)</strong> −8, −5, 0, −1, 3, 4 &nbsp; <strong>D)</strong> 0, −1, −5, −8, 3, 4 &nbsp; <strong>E)</strong> 4, 3, 0, −1, −5, −8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayı doğrusunda <strong>sola gittikçe küçülür</strong>. Negatifler arasında mutlak değeri büyük olan daha küçüktür: $-8 < -5 < -1$.</p>
      <p class="ales-sol-step">Tüm sıralama: $-8 < -5 < -1 < 0 < 3 < 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −8, −5, −1, 0, 3, 4</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">En Büyük / En Küçük</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İki basamaklı en küçük negatif tam sayı ile üç basamaklı en büyük negatif tam sayının toplamı kaçtır?<br><br>
      <strong>A)</strong> −1099 &nbsp; <strong>B)</strong> −200 &nbsp; <strong>C)</strong> <span class="key">−199</span> &nbsp; <strong>D)</strong> −198 &nbsp; <strong>E)</strong> −189
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Negatifte <strong>"en küçük"</strong> = mutlak değeri en büyük olandır. İki basamaklı en küçük negatif: $-99$.</p>
      <p class="ales-sol-step">Üç basamaklı en büyük negatif: mutlak değeri en küçük olan $\\Rightarrow -100$.</p>
      <p class="ales-sol-step">Toplam: $-99 + (-100) = -199$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) −199</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Aralıkta Tam Sayı Sayısı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $-5 \\leq x < 7$ aralığında kaç tane tam sayı vardır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> <span class="key">12</span> &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Klasik</div>
      <p class="ales-sol-step">$x \\in \\{-5, -4, -3, \\dots, 6\\}$. Sayma: $-5$'ten $6$'ya kadar ⟹ <strong>son − ilk + 1</strong> $= 6 - (-5) + 1 = 12$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Negatif/Pozitif Ayır</div>
      <p class="ales-sol-step">Negatifler $\\{-5,-4,-3,-2,-1\\}$ = 5 tane. Sıfır = 1. Pozitifler $\\{1,2,3,4,5,6\\}$ = 6. Toplam $5+1+6 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Eşitsizlik Sınırları</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-3 < x \\leq 5$ ve $0 \\leq y < 8$ ise $x - y$ farkının alabileceği en büyük ve en küçük tam sayı değerleri toplamı kaçtır?<br><br>
      <strong>A)</strong> −10 &nbsp; <strong>B)</strong> −6 &nbsp; <strong>C)</strong> <span class="key">−4</span> &nbsp; <strong>D)</strong> −2 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x - y$ <strong>en büyük</strong> ⟹ $x$ en büyük, $y$ en küçük: $x = 5,\\; y = 0 \\Rightarrow 5 - 0 = 5$.</p>
      <p class="ales-sol-step">$x - y$ <strong>en küçük</strong> ⟹ $x$ en küçük, $y$ en büyük. $x$ tam sayı ve $-3 < x$ ⟹ en küçük $x = -2$. $y$ tam sayı ve $y < 8$ ⟹ en büyük $y = 7$. $-2 - 7 = -9$.</p>
      <p class="ales-sol-step">Toplam: $5 + (-9) = -4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) −4</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Sayı Doğrusu — Uzaklık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Sayı doğrusu üzerinde $A = -7$ ve $B = 11$ noktaları veriliyor. $|AB|$ uzaklığı ile $A$-$B$ orta noktasının koordinatının toplamı kaçtır?<br><br>
      <strong>A)</strong> 16 &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> 19 &nbsp; <strong>D)</strong> <span class="key">20</span> &nbsp; <strong>E)</strong> 22
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayı doğrusunda iki nokta arası uzaklık $= |B - A|$.</p>
      <p class="ales-sol-step">$|AB| = |11 - (-7)| = |18| = 18$.</p>
      <p class="ales-sol-step">Orta nokta $= \\dfrac{A + B}{2} = \\dfrac{-7 + 11}{2} = \\dfrac{4}{2} = 2$.</p>
      <p class="ales-sol-step">Toplam: $18 + 2 = 20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 20</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Karşılaştırma — Negatif Kesir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki sayıları <strong>küçükten büyüğe</strong> sıralarsak hangisi doğrudur? Sayılar: $-\\dfrac{3}{4},\\; -\\dfrac{2}{3},\\; -\\dfrac{5}{6}$.<br><br>
      <strong>A)</strong> $-\\dfrac{2}{3} < -\\dfrac{3}{4} < -\\dfrac{5}{6}$ &nbsp; <strong>B)</strong> $-\\dfrac{3}{4} < -\\dfrac{5}{6} < -\\dfrac{2}{3}$ &nbsp; <strong>C)</strong> <span class="key">$-\\dfrac{5}{6} < -\\dfrac{3}{4} < -\\dfrac{2}{3}$</span> &nbsp; <strong>D)</strong> $-\\dfrac{5}{6} < -\\dfrac{2}{3} < -\\dfrac{3}{4}$ &nbsp; <strong>E)</strong> $-\\dfrac{2}{3} < -\\dfrac{5}{6} < -\\dfrac{3}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Negatif kesirlerde:</strong> mutlak değeri büyük olan daha küçüktür. Önce mutlak değerleri sırala.</p>
      <p class="ales-sol-step">Pozitif hâlleri ortak paydaya getir: $\\dfrac{3}{4} = \\dfrac{9}{12},\\; \\dfrac{2}{3} = \\dfrac{8}{12},\\; \\dfrac{5}{6} = \\dfrac{10}{12}$.</p>
      <p class="ales-sol-step">Sıralama (büyükten küçüğe pozitif): $\\dfrac{10}{12} > \\dfrac{9}{12} > \\dfrac{8}{12}$.</p>
      <p class="ales-sol-step">Negatife çevir, işaret döner: $-\\dfrac{5}{6} < -\\dfrac{3}{4} < -\\dfrac{2}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-\\dfrac{5}{6} < -\\dfrac{3}{4} < -\\dfrac{2}{3}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Tam Sayılarla İşlemler ve İşaret Kuralları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Tam Sayılarla İşlem ve İşaret Kuralları</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Toplama/Çıkarma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(-7) + (+3) - (-5) - (+9)$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> −18 &nbsp; <strong>B)</strong> −10 &nbsp; <strong>C)</strong> <span class="key">−8</span> &nbsp; <strong>D)</strong> −4 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Çift parantez kuralı:</strong> $-(-a) = +a$ ve $-(+a) = -a$. Önce parantezleri aç:</p>
      <p class="ales-sol-step">$-7 + 3 + 5 - 9$.</p>
      <p class="ales-sol-step">Pozitifleri ve negatifleri grupla: $(3 + 5) - (7 + 9) = 8 - 16 = -8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) −8</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Çarpma — İşaret</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(-2) \\cdot (-3) \\cdot (-4) \\cdot (-5)$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> −120 &nbsp; <strong>B)</strong> −24 &nbsp; <strong>C)</strong> 14 &nbsp; <strong>D)</strong> 24 &nbsp; <strong>E)</strong> <span class="key">120</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İşaret Sayma</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Çarpımdaki negatif sayısı çift ise sonuç +, tek ise −.</p>
      <p class="ales-sol-step">Burada 4 tane negatif (çift) ⟹ sonuç +.</p>
      <p class="ales-sol-step">Mutlak değer: $2 \\cdot 3 \\cdot 4 \\cdot 5 = 120$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 120</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üs — Negatif Taban</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(-2)^{4} + (-3)^{3} - (-1)^{100}$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> −44 &nbsp; <strong>B)</strong> <span class="key">−12</span> &nbsp; <strong>C)</strong> −10 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 44
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Negatif tabanın üssü çift ise sonuç +, tek ise −.</p>
      <p class="ales-sol-step">$(-2)^{4} = +16$ &nbsp;·&nbsp; $(-3)^{3} = -27$ &nbsp;·&nbsp; $(-1)^{100} = +1$.</p>
      <p class="ales-sol-step">$16 + (-27) - 1 = 16 - 27 - 1 = -12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −12</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">İşlem Önceliği</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-3^{2} + (-3)^{2} + (-2)^{3} - 2^{3}$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> −34 &nbsp; <strong>B)</strong> <span class="key">−16</span> &nbsp; <strong>C)</strong> 0 &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tuzak Tabanı</div>
      <p class="ales-sol-step"><strong>Önemli ayrım:</strong> $-3^{2}$ ile $(-3)^{2}$ farklıdır. $-3^{2} = -(3^{2}) = -9$, $(-3)^{2} = +9$.</p>
      <p class="ales-sol-step">$(-2)^{3} = -8$ (üs tek). $2^{3} = 8$.</p>
      <p class="ales-sol-step">Toplam: $-9 + 9 + (-8) - 8 = 0 - 16 = -16$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −16</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Dağılma Özelliği</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-7 \\cdot 38 + (-7) \\cdot 62$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> −7000 &nbsp; <strong>B)</strong> <span class="key">−700</span> &nbsp; <strong>C)</strong> −168 &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 700
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Çarpan</div>
      <p class="ales-sol-step"><strong>Dağılma:</strong> $a \\cdot b + a \\cdot c = a \\cdot (b + c)$. $-7$'yi paranteze al.</p>
      <p class="ales-sol-step">$-7 \\cdot (38 + 62) = -7 \\cdot 100 = -700$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Direkt Hesap</div>
      <p class="ales-sol-step">$-7 \\cdot 38 = -266$, $-7 \\cdot 62 = -434$. $-266 + (-434) = -700$. (Daha yavaş.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −700</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Bölme — Negatif Bölen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{(-12) \\cdot (-15) \\cdot 4}{(-9) \\cdot 2}$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> −80 &nbsp; <strong>B)</strong> <span class="key">−40</span> &nbsp; <strong>C)</strong> −20 &nbsp; <strong>D)</strong> 20 &nbsp; <strong>E)</strong> 40
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>İşaret önce:</strong> Pay'da iki negatif (çift) ⟹ +. Payda'da bir negatif (tek) ⟹ −. Sonuç işareti: $\\dfrac{+}{-} = -$.</p>
      <p class="ales-sol-step">Mutlak değer: $\\dfrac{12 \\cdot 15 \\cdot 4}{9 \\cdot 2} = \\dfrac{720}{18} = 40$.</p>
      <p class="ales-sol-step">Sonuç: $-40$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −40</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Karma — Üs ve İşlem</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = (-1)^{2025} + (-1)^{2026} + (-1)^{2027} + (-1)^{2028}$ ise $A$ kaçtır?<br><br>
      <strong>A)</strong> −4 &nbsp; <strong>B)</strong> −2 &nbsp; <strong>C)</strong> <span class="key">0</span> &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Parite</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $(-1)^{n} = +1$ (n çift) veya $-1$ (n tek).</p>
      <p class="ales-sol-step">$2025$ tek $\\Rightarrow -1$. &nbsp; $2026$ çift $\\Rightarrow +1$. &nbsp; $2027$ tek $\\Rightarrow -1$. &nbsp; $2028$ çift $\\Rightarrow +1$.</p>
      <p class="ales-sol-step">$A = -1 + 1 - 1 + 1 = 0$.</p>
      <p class="ales-sol-step"><strong>Hız:</strong> Ardışık tek-çift çiftleri sıfırlar (her çift $-1+1 = 0$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 0</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Mutlak Büyüklük Karşılaştırma + Ardışık Tam Sayılar
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Mutlak Büyüklük Karşılaştırma ve Ardışık Tam Sayılar</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Mutlak Değer İçinde Büyüklük</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a = -8,\\; b = 5,\\; c = -3$ veriliyor. $|a|,\\; |b|,\\; |c|$ değerlerinin büyükten küçüğe doğru doğru sıralanışı hangisidir?<br><br>
      <strong>A)</strong> $|c| > |b| > |a|$ &nbsp; <strong>B)</strong> $|b| > |a| > |c|$ &nbsp; <strong>C)</strong> <span class="key">$|a| > |b| > |c|$</span> &nbsp; <strong>D)</strong> $|a| > |c| > |b|$ &nbsp; <strong>E)</strong> $|b| > |c| > |a|$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Mutlak değer = sayının sıfıra uzaklığı. $|-8| = 8,\\; |5| = 5,\\; |-3| = 3$.</p>
      <p class="ales-sol-step">Sıralama: $|a| > |b| > |c|$ &nbsp;⟹&nbsp; $8 > 5 > 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $|a| > |b| > |c|$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">3 Ardışık Tam Sayı Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık tam sayının toplamı $-15$ ise, en küçüğü kaçtır?<br><br>
      <strong>A)</strong> −7 &nbsp; <strong>B)</strong> <span class="key">−6</span> &nbsp; <strong>C)</strong> −5 &nbsp; <strong>D)</strong> −4 &nbsp; <strong>E)</strong> −3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortanca Yöntemi</div>
      <p class="ales-sol-step">Ortancaya $n$: $(n-1) + n + (n+1) = 3n = -15 \\Rightarrow n = -5$.</p>
      <p class="ales-sol-step">Sayılar: $-6, -5, -4$. En küçüğü <strong>$-6$</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −6</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Ardışık Çift Tam Sayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Dört ardışık çift tam sayının toplamı $-12$ ise, en büyüğü kaçtır?<br><br>
      <strong>A)</strong> −6 &nbsp; <strong>B)</strong> −4 &nbsp; <strong>C)</strong> −2 &nbsp; <strong>D)</strong> <span class="key">0</span> &nbsp; <strong>E)</strong> 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ardışık çift tam sayılar: $n,\\; n+2,\\; n+4,\\; n+6$ ($n$ çift).</p>
      <p class="ales-sol-step">Toplam: $4n + 12 = -12 \\Rightarrow 4n = -24 \\Rightarrow n = -6$.</p>
      <p class="ales-sol-step">Sayılar: $-6, -4, -2, 0$. En büyüğü <strong>$0$</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 0</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Mutlak Değer Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a < 0 < b$ ve $|a| > |b|$ olduğuna göre, aşağıdakilerden hangisi <strong>kesinlikle</strong> negatiftir?<br>
      <strong>I.</strong> $a + b$ &nbsp; <strong>II.</strong> $a \\cdot b$ &nbsp; <strong>III.</strong> $a - b$ &nbsp; <strong>IV.</strong> $b - a$<br><br>
      <strong>A)</strong> Yalnız I &nbsp; <strong>B)</strong> I ve II &nbsp; <strong>C)</strong> II ve III &nbsp; <strong>D)</strong> <span class="key">I, II ve III</span> &nbsp; <strong>E)</strong> Hepsi
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sayı Doğrusu</div>
      <p class="ales-sol-step">Örnek: $a = -5,\\; b = 3$. $|a| = 5 > 3 = |b|$ ✓.</p>
      <p class="ales-sol-step"><strong>I.</strong> $a + b = -5 + 3 = -2 < 0$ &nbsp; <strong>her zaman negatif</strong> (çünkü $|a| > |b|$).</p>
      <p class="ales-sol-step"><strong>II.</strong> $a \\cdot b = -15 < 0$ &nbsp; (negatif × pozitif = negatif) ⟹ <strong>her zaman negatif</strong>.</p>
      <p class="ales-sol-step"><strong>III.</strong> $a - b = -5 - 3 = -8 < 0$ &nbsp; (negatiften pozitif çıkarılınca daha küçük) ⟹ <strong>her zaman negatif</strong>.</p>
      <p class="ales-sol-step"><strong>IV.</strong> $b - a = 3 - (-5) = 8 > 0$ &nbsp; pozitif.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) I, II ve III</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Ardışık Tam Sayı — Karelerin Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki ardışık tam sayının karelerinin farkı $-21$'dir. Bu sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> −21 &nbsp; <strong>B)</strong> −10 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 20 &nbsp; <strong>E)</strong> <span class="key">21</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar $n$ ve $n+1$. Sıra önemli: $n^{2} - (n+1)^{2} = -2n - 1$.</p>
      <p class="ales-sol-step">$-2n - 1 = -21 \\Rightarrow -2n = -20 \\Rightarrow n = 10$.</p>
      <p class="ales-sol-step">Sayılar: $10$ ve $11$. Toplam: $21$.</p>
      <p class="ales-sol-step"><strong>Genel kural:</strong> İki ardışık tam sayının karelerinin farkı = bu iki sayının toplamına eşittir (büyükten küçüğü çıkarınca).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 21</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Mutlak Değer — Eşitsizlik</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $|x| < 5$ koşulunu sağlayan tam sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> −20 &nbsp; <strong>B)</strong> −9 &nbsp; <strong>C)</strong> <span class="key">0</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Açılım:</strong> $|x| < 5 \\Leftrightarrow -5 < x < 5$. Tam sayılar: $\\{-4, -3, -2, -1, 0, 1, 2, 3, 4\\}$.</p>
      <p class="ales-sol-step"><strong>Simetri:</strong> Her pozitifin negatifi de var ⟹ pozitifler ve negatifler birbirini götürür.</p>
      <p class="ales-sol-step">Toplam $= 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 0</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Ardışık + Mutlak</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Beş ardışık tam sayının toplamı $-10$'dur. Bu sayıların mutlak değerleri toplamı kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tek sayıda ardışıkta ortanca = toplam ÷ terim sayısı = $-10/5 = -2$.</p>
      <p class="ales-sol-step">Sayılar: $-4, -3, -2, -1, 0$.</p>
      <p class="ales-sol-step">Mutlak değerler: $4, 3, 2, 1, 0$. Toplam: $4 + 3 + 2 + 1 + 0 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>
</section>
`
};
