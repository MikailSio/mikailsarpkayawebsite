window.ALES_LESSON = {
n: 1,
title: "Doğal Sayılar (ℕ)",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>doğal sayılar</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Çözümler adım adım gösterilmiş; formüller ve teknikler problem içinde uygulanırken anlatılıyor. Her problemi önce kendi başına dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Tanım Tuzakları ve Eleman Sayısı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Tanım Tuzakları ve Eleman Sayısı</h2>
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
      <strong>I.</strong> Her sayma sayısı bir doğal sayıdır.<br>
      <strong>II.</strong> Her doğal sayı bir sayma sayısıdır.<br>
      <strong>III.</strong> 0, doğal sayıdır.<br>
      <strong>IV.</strong> 0, pozitif tam sayıdır.<br>
      <strong>V.</strong> En küçük üç basamaklı doğal sayı 100'dür.<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Hatırla:</strong> $\\mathbb{N} = \\{0, 1, 2, 3, \\dots\\}$ &nbsp; (sıfır <em>dahil</em>) &nbsp;·&nbsp; sayma sayıları $= \\{1, 2, 3, \\dots\\}$ &nbsp; (sıfır <em>hariç</em>).</p>
      <p class="ales-sol-step"><strong>I.</strong> $\\{1,2,3,\\dots\\} \\subset \\{0,1,2,\\dots\\}$ ⟹ ✓</p>
      <p class="ales-sol-step"><strong>II.</strong> $0 \\in \\mathbb{N}$ ama $0$ sayma sayısı değil ⟹ ✗</p>
      <p class="ales-sol-step"><strong>III.</strong> Tanım gereği ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> $0$ ne pozitif ne negatif ⟹ ✗</p>
      <p class="ales-sol-step"><strong>V.</strong> 99 iki basamaklı; 100 üç basamaklı en küçük doğal sayı ⟹ ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span> (I, III, V)</div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">En Küçük / En Büyük</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      <strong>İki</strong> basamaklı en küçük doğal sayı ile <strong>üç</strong> basamaklı en büyük doğal sayının toplamı kaçtır?<br><br>
      <strong>A)</strong> 999 &nbsp; <strong>B)</strong> 1000 &nbsp; <strong>C)</strong> 1008 &nbsp; <strong>D)</strong> <span class="key">1009</span> &nbsp; <strong>E)</strong> 1099
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İki basamaklı sayıda ilk basamak sıfır olamaz. En küçük rakam $1$, ikinci basamak $0$ ⟹ <strong>10</strong>.</p>
      <p class="ales-sol-step">Üç basamaklı en büyük: tüm basamaklar $9$ ⟹ <strong>999</strong>.</p>
      <p class="ales-sol-step">Toplam: $10 + 999 = 1009$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 1009</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Küme — Eleman Sayısı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A = \\{ x : x \\text{ dogal sayi}, \\; x < 5 \\}$ kümesinin eleman sayısı kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x$ doğal (sıfır dahil) ve $x < 5$ ⟹ $x \\in \\{0, 1, 2, 3, 4\\}$ ⟹ <strong>5 eleman</strong>.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> Soru "sayma sayısı" deseydi $\\{1,2,3,4\\}$ olur, cevap 4 olurdu.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Aralık Sayma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $100$ ile $999$ arasında (her ikisi dahil) kaç tane doğal sayı vardır?<br><br>
      <strong>A)</strong> 898 &nbsp; <strong>B)</strong> 899 &nbsp; <strong>C)</strong> <span class="key">900</span> &nbsp; <strong>D)</strong> 901 &nbsp; <strong>E)</strong> 999
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Klasik</div>
      <p class="ales-sol-step">Aralık formülü: <strong>son − ilk + 1</strong> ⟹ $999 - 100 + 1 = \\mathbf{900}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Basamak Sayma</div>
      <p class="ales-sol-step">Üç basamaklı sayılar: ilk basamak 9 seçenek (1-9), orta 10, son 10 ⟹ $9 \\cdot 10 \\cdot 10 = 900$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 900</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Bölen Eleman Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $B = \\left\\{ x : x \\in \\mathbb{N},\\; \\dfrac{12}{x} \\in \\mathbb{N} \\right\\}$ kümesinin eleman sayısı kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{12}{x}$ doğal sayı ⟹ $x$, $12$'nin pozitif böleni. ($x = 0$ olamaz: $12/0$ tanımsız.)</p>
      <p class="ales-sol-step">$12 = 2^{2} \\cdot 3$. Pozitif bölen sayısı = $(2+1)(1+1) = 6$.</p>
      <p class="ales-sol-step">Bölenler: $\\{1, 2, 3, 4, 6, 12\\}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Aralıkta Doğal Sayı Toplamı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-3 \\leq x \\leq 4$ aralığındaki doğal sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Doğal sayı sıfır ve pozitiftir; negatifler dışarıda kalır. Aralıktaki doğal sayılar: $\\{0, 1, 2, 3, 4\\}$.</p>
      <p class="ales-sol-step">Toplam: $0 + 1 + 2 + 3 + 4 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İşlem Kapalılığı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a, b \\in \\mathbb{N}$ verilmiştir. Aşağıdakilerden hangisi <strong>her zaman</strong> doğal sayıdır?<br>
      <strong>I.</strong> $a + b$ &nbsp; <strong>II.</strong> $a - b$ &nbsp; <strong>III.</strong> $a \\cdot b$ &nbsp; <strong>IV.</strong> $a / b$ ($b \\neq 0$)<br><br>
      <strong>A)</strong> Yalnız I &nbsp; <strong>B)</strong> I ve II &nbsp; <strong>C)</strong> <span class="key">I ve III</span> &nbsp; <strong>D)</strong> I, III ve IV &nbsp; <strong>E)</strong> Hepsi
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>I.</strong> Her doğal toplam doğaldır ⟹ ✓</p>
      <p class="ales-sol-step"><strong>II.</strong> Karşı örnek: $3 - 5 = -2 \\notin \\mathbb{N}$ ⟹ ✗</p>
      <p class="ales-sol-step"><strong>III.</strong> Doğal × doğal = doğal ⟹ ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> Karşı örnek: $\\dfrac{2}{3} \\notin \\mathbb{N}$ ⟹ ✗</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) I ve III</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Ardışık Doğal Sayılar
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Ardışık Doğal Sayılar</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">3 Ardışık Toplam</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık doğal sayının toplamı $27$ ise, en büyüğü kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortanca Yöntemi (hızlı)</div>
      <p class="ales-sol-step">Ortancaya $n$ dersek: $(n-1) + n + (n+1) = 3n = 27 \\Rightarrow n = 9$.</p>
      <p class="ales-sol-step">Sayılar $8, 9, 10$. En büyüğü <strong>10</strong>.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — En Küçük $n$</div>
      <p class="ales-sol-step">$n + (n+1) + (n+2) = 3n + 3 = 27 \\Rightarrow n = 8$. En büyük $n+2 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">5 Ardışık · Ortanca</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Beş ardışık doğal sayının toplamı $75$ ise, ortanca terim kaçtır?<br><br>
      <strong>A)</strong> 13 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 16 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tek sayıda ardışıkta <strong>ortanca = toplam ÷ terim sayısı</strong>. $75 / 5 = 15$.</p>
      <p class="ales-sol-step">Doğrula: $13 + 14 + 15 + 16 + 17 = 75$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">4 Ardışık · Çift Terim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Dört ardışık doğal sayının toplamı $38$ ise, en küçüğü kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> <span class="key">8</span> &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$n + (n+1) + (n+2) + (n+3) = 4n + 6 = 38 \\Rightarrow n = 8$.</p>
      <p class="ales-sol-step"><strong>Hız:</strong> Çift terimde "iki ortanca ortalaması" $= 38/4 = 9.5$. Ortancalar $9$ ve $10$ ⟹ en küçük $8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 8</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Ardışık İki Sayı · Çarpım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki ardışık doğal sayının çarpımı $56$'dır. Bu sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 13 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 16 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Karekök Tahmini</div>
      <p class="ales-sol-step">$n(n+1) \\approx n^{2}$. $\\sqrt{56} \\approx 7.5$ ⟹ deneme: $n = 7$. Doğrula: $7 \\cdot 8 = 56$ ✓.</p>
      <p class="ales-sol-step">Toplam: $7 + 8 = 15$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Denklem</div>
      <p class="ales-sol-step">$n(n+1) = 56 \\Rightarrow n^{2} + n - 56 = 0 \\Rightarrow (n-7)(n+8) = 0$. Doğal kök: $n = 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Karelerinin Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki ardışık doğal sayının karelerinin farkı $19$'dur. Küçük olanı kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 19
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(n+1)^{2} - n^{2} = 2n + 1$. $2n + 1 = 19 \\Rightarrow n = 9$.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> İki ardışık doğal sayının karelerinin farkı = bu iki sayının <em>toplamına</em> eşittir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Ardışık Çift Sayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık <strong>çift</strong> doğal sayının toplamı $36$ ise, en büyüğü kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 12 &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> <span class="key">14</span> &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ardışık çift sayılar arasında fark $2$. Ortancaya $n$ dersek: $n-2,\\; n,\\; n+2$.</p>
      <p class="ales-sol-step">Toplam: $3n = 36 \\Rightarrow n = 12$. Sayılar $10, 12, 14$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 14</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Ardışık Tek Sayı · Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Dört ardışık <strong>tek</strong> doğal sayının toplamı $40$'tır. En küçüğü ile en büyüğünün çarpımı kaçtır?<br><br>
      <strong>A)</strong> 77 &nbsp; <strong>B)</strong> 85 &nbsp; <strong>C)</strong> <span class="key">91</span> &nbsp; <strong>D)</strong> 99 &nbsp; <strong>E)</strong> 117
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ardışık tek sayılar: $n,\\; n+2,\\; n+4,\\; n+6$. Toplam: $4n + 12 = 40 \\Rightarrow n = 7$.</p>
      <p class="ales-sol-step">Sayılar $7, 9, 11, 13$. En küçük × en büyük $= 7 \\cdot 13 = 91$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 91</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Çift / Tek Parite ve Gauss Toplam
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Çift/Tek Parite ve Gauss Toplam</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Gauss Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $1 + 2 + 3 + \\dots + 100$ toplamı kaçtır?<br><br>
      <strong>A)</strong> 4950 &nbsp; <strong>B)</strong> 5000 &nbsp; <strong>C)</strong> <span class="key">5050</span> &nbsp; <strong>D)</strong> 5150 &nbsp; <strong>E)</strong> 10100
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk $n$ sayma sayısının toplamı: $\\dfrac{n(n+1)}{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{100 \\cdot 101}{2} = 50 \\cdot 101 = 5050$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5050</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Çift Sayı Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $20$'den küçük çift doğal sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 80 &nbsp; <strong>B)</strong> 88 &nbsp; <strong>C)</strong> <span class="key">90</span> &nbsp; <strong>D)</strong> 100 &nbsp; <strong>E)</strong> 110
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Aritmetik Dizi Toplam</div>
      <p class="ales-sol-step">Sayılar: $0, 2, 4, \\dots, 18$ (10 terim).</p>
      <p class="ales-sol-step">Toplam $= \\dfrac{(\\text{ilk} + \\text{son}) \\cdot \\text{terim sayisi}}{2} = \\dfrac{(0 + 18) \\cdot 10}{2} = 90$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — İlk $n$ Çift Formülü</div>
      <p class="ales-sol-step">$2 + 4 + \\dots + 2n = n(n+1)$. Burada terimler $2$'den $18$'e ⟹ $n = 9 \\Rightarrow 9 \\cdot 10 = 90$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 90</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Tek Sayı Toplamı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İlk $20$ tek sayma sayısının toplamı kaçtır?<br><br>
      <strong>A)</strong> 200 &nbsp; <strong>B)</strong> 361 &nbsp; <strong>C)</strong> 380 &nbsp; <strong>D)</strong> <span class="key">400</span> &nbsp; <strong>E)</strong> 441
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk $n$ tek sayma sayısı toplamı $= n^{2}$.</p>
      <p class="ales-sol-step">$n = 20 \\Rightarrow 20^{2} = 400$.</p>
      <p class="ales-sol-step"><strong>Doğrula:</strong> $1+3 = 4 = 2^{2}$, $\\;1+3+5 = 9 = 3^{2}$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 400</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Aralık Toplamı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $50$'den $100$'e kadar olan (her ikisi dahil) doğal sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 3750 &nbsp; <strong>B)</strong> <span class="key">3825</span> &nbsp; <strong>C)</strong> 3850 &nbsp; <strong>D)</strong> 3875 &nbsp; <strong>E)</strong> 5050
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çıkarma</div>
      <p class="ales-sol-step">$\\sum_{k=50}^{100} k = \\sum_{k=1}^{100} k - \\sum_{k=1}^{49} k = \\dfrac{100 \\cdot 101}{2} - \\dfrac{49 \\cdot 50}{2} = 5050 - 1225 = 3825$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Aritmetik Dizi</div>
      <p class="ales-sol-step">Terim sayısı $= 100 - 50 + 1 = 51$. Toplam $= \\dfrac{(50 + 100) \\cdot 51}{2} = 75 \\cdot 51 = 3825$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3825</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Parite Karması</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a$ tek doğal sayı, $b$ çift doğal sayı ise aşağıdakilerden hangileri <strong>her zaman tek</strong>tir?<br>
      <strong>I.</strong> $a + b$ &nbsp; <strong>II.</strong> $a \\cdot b$ &nbsp; <strong>III.</strong> $a^{2} + b$ &nbsp; <strong>IV.</strong> $2a + b$ &nbsp; <strong>V.</strong> $a + b + 1$<br><br>
      <strong>A)</strong> Yalnız I &nbsp; <strong>B)</strong> I ve II &nbsp; <strong>C)</strong> <span class="key">I ve III</span> &nbsp; <strong>D)</strong> I, III ve V &nbsp; <strong>E)</strong> I, III ve IV
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kurallar:</strong> tek + çift = tek &nbsp;·&nbsp; tek × tek = tek &nbsp;·&nbsp; tek × çift = çift &nbsp;·&nbsp; çift + çift = çift.</p>
      <p class="ales-sol-step"><strong>I.</strong> tek + çift = <strong>tek</strong> ✓</p>
      <p class="ales-sol-step"><strong>II.</strong> tek × çift = çift ✗</p>
      <p class="ales-sol-step"><strong>III.</strong> $a^{2}$: tek × tek = tek. tek + çift = <strong>tek</strong> ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> $2a$ çift, çift + çift = çift ✗</p>
      <p class="ales-sol-step"><strong>V.</strong> tek + çift + 1 = tek + 1 = çift ✗</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) I ve III</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Alternan Toplam · Eşleştirme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $S = 1 - 2 + 3 - 4 + 5 - 6 + \\dots + 99 - 100$ toplamı kaçtır?<br><br>
      <strong>A)</strong> −100 &nbsp; <strong>B)</strong> <span class="key">−50</span> &nbsp; <strong>C)</strong> 0 &nbsp; <strong>D)</strong> 50 &nbsp; <strong>E)</strong> 100
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eşleştirme</div>
      <p class="ales-sol-step">Ardışık iki terimi grupla: $(1-2) + (3-4) + (5-6) + \\dots + (99-100)$.</p>
      <p class="ales-sol-step">Her parantez $-1$. Parantez sayısı $= 100/2 = 50$.</p>
      <p class="ales-sol-step">$S = 50 \\cdot (-1) = -50$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −50</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Komplement (Tümleyen)</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $1$'den $100$'e kadar olan doğal sayılardan, $3$'ün katı <strong>olmayan</strong>ların toplamı kaçtır?<br><br>
      <strong>A)</strong> 1683 &nbsp; <strong>B)</strong> 3300 &nbsp; <strong>C)</strong> <span class="key">3367</span> &nbsp; <strong>D)</strong> 3400 &nbsp; <strong>E)</strong> 5050
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümleyen Yöntemi</div>
      <p class="ales-sol-step">Toplam tüm sayılar: $\\dfrac{100 \\cdot 101}{2} = 5050$.</p>
      <p class="ales-sol-step">$3$'ün katları: $3, 6, 9, \\dots, 99$ (terim sayısı $= 99/3 = 33$).</p>
      <p class="ales-sol-step">$3$'ün katları toplamı: $3(1+2+\\dots+33) = 3 \\cdot \\dfrac{33 \\cdot 34}{2} = 3 \\cdot 561 = 1683$.</p>
      <p class="ales-sol-step">$3$'ün katı olmayanların toplamı: $5050 - 1683 = 3367$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3367</span></div>
    </div>
  </div>
</section>
`
};
