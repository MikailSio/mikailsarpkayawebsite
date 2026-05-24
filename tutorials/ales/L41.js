window.ALES_LESSON = {
n: 41,
title: "Aritmetik Diziler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>aritmetik diziler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Genel terim, ilk $n$ terim toplamı ve simetrik üçlü teknikleri problem içinde uygulanırken anlatılıyor. Önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Genel Terim a_n = a_1 + (n-1)d
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Genel Terim Formülü</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Direkt Genel Terim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a_1 = 5$ ve ortak fark $d = 3$ olan aritmetik dizide $a_{20}$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">62</span> &nbsp; <strong>B)</strong> 61 &nbsp; <strong>C)</strong> 63 &nbsp; <strong>D)</strong> 64 &nbsp; <strong>E)</strong> 60
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Genel terim: $a_n = a_1 + (n-1)d$.</p>
      <p class="ales-sol-step">$a_{20} = 5 + (20-1) \\cdot 3 = 5 + 57 = 62$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 62</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">d Bulma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir aritmetik dizide $a_3 = 11$ ve $a_7 = 27$ ise ortak fark $d$ kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> <span class="key">4</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pratik Formül</div>
      <p class="ales-sol-step">İki terim arası: $a_m - a_n = (m - n) \\cdot d$.</p>
      <p class="ales-sol-step">$a_7 - a_3 = (7 - 3) \\cdot d \\Rightarrow 27 - 11 = 4d \\Rightarrow d = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 4</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">İlk Terim Bulma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik bir dizide $a_5 = 18$ ve $d = 4$ ise $a_1$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 0 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> <span class="key">2</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_5 = a_1 + 4d \\Rightarrow 18 = a_1 + 16 \\Rightarrow a_1 = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 2</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Kaçıncı Terim?</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3, 7, 11, 15, \\dots$ aritmetik dizisinde $99$ sayısı kaçıncı terimdir?<br><br>
      <strong>A)</strong> 24. &nbsp; <strong>B)</strong> <span class="key">25.</span> &nbsp; <strong>C)</strong> 26. &nbsp; <strong>D)</strong> 23. &nbsp; <strong>E)</strong> 27.
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_1 = 3,\\; d = 4$. $a_n = 3 + (n-1) \\cdot 4 = 4n - 1$.</p>
      <p class="ales-sol-step">$4n - 1 = 99 \\Rightarrow n = 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 25.</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Genel Terim Yorumu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Genel terimi $a_n = 5n - 2$ olan dizinin ilk terimi ve ortak farkı sırasıyla nedir?<br><br>
      <strong>A)</strong> $a_1 = -2$, $d = 5$ &nbsp; <strong>B)</strong> $a_1 = 5$, $d = -2$ &nbsp; <strong>C)</strong> <span class="key">$a_1 = 3$, $d = 5$</span> &nbsp; <strong>D)</strong> $a_1 = 3$, $d = 2$ &nbsp; <strong>E)</strong> $a_1 = 8$, $d = 5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Doğrudan</div>
      <p class="ales-sol-step">$a_n = 5n - 2$ formunda $a_n = dn + (a_1 - d)$. Buradan $d = 5$.</p>
      <p class="ales-sol-step">$a_1 = 5 \\cdot 1 - 2 = 3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — İlk İki Terim</div>
      <p class="ales-sol-step">$a_1 = 3,\\; a_2 = 8 \\Rightarrow d = a_2 - a_1 = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $a_1 = 3$, $d = 5$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">İki Terim Verilmiş</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik dizide $a_4 = 13$ ve $a_{10} = 37$ ise $a_{15}$ kaçtır?<br><br>
      <strong>A)</strong> 56 &nbsp; <strong>B)</strong> <span class="key">57</span> &nbsp; <strong>C)</strong> 58 &nbsp; <strong>D)</strong> 55 &nbsp; <strong>E)</strong> 59
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_{10} - a_4 = 6d \\Rightarrow 24 = 6d \\Rightarrow d = 4$.</p>
      <p class="ales-sol-step">$a_{15} = a_{10} + 5d = 37 + 20 = 57$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 57</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İki Denklem Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir aritmetik dizide $a_2 + a_4 = 22$ ve $a_3 + a_5 = 30$ ise $a_1$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">3</span> &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İkinci denklemden ilkini çıkar: $(a_3 - a_2) + (a_5 - a_4) = 30 - 22 = 8 \\Rightarrow 2d = 8 \\Rightarrow d = 4$.</p>
      <p class="ales-sol-step">$a_2 + a_4 = (a_1 + d) + (a_1 + 3d) = 2a_1 + 4d = 22$.</p>
      <p class="ales-sol-step">$2a_1 + 16 = 22 \\Rightarrow a_1 = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 3</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — İlk n Terim Toplamı S_n
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">İlk n Terim Toplamı</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Direkt Toplam</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a_1 = 4,\\; d = 3$ olan aritmetik dizinin ilk $20$ teriminin toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">650</span> &nbsp; <strong>B)</strong> 649 &nbsp; <strong>C)</strong> 651 &nbsp; <strong>D)</strong> 648 &nbsp; <strong>E)</strong> 652
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S_n = \\dfrac{n}{2}\\left[2a_1 + (n-1)d\\right]$.</p>
      <p class="ales-sol-step">$S_{20} = \\dfrac{20}{2}\\left[2 \\cdot 4 + 19 \\cdot 3\\right] = 10 \\cdot (8 + 57) = 10 \\cdot 65 = 650$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 650</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">İlk + Son Yöntemi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İlk terimi $7$, son terimi $97$ olan ve $19$ terimli aritmetik dizinin toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">988</span> &nbsp; <strong>B)</strong> 987 &nbsp; <strong>C)</strong> 989 &nbsp; <strong>D)</strong> 986 &nbsp; <strong>E)</strong> 990
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S_n = \\dfrac{(a_1 + a_n) \\cdot n}{2} = \\dfrac{(7 + 97) \\cdot 19}{2} = \\dfrac{104 \\cdot 19}{2} = 52 \\cdot 19 = 988$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 988</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çift Sayılar Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2 + 4 + 6 + \\dots + 200$ toplamı kaçtır?<br><br>
      <strong>A)</strong> 10099 &nbsp; <strong>B)</strong> 10101 &nbsp; <strong>C)</strong> 10098 &nbsp; <strong>D)</strong> <span class="key">10100</span> &nbsp; <strong>E)</strong> 10102
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_1 = 2,\\; a_n = 200,\\; d = 2$. Terim sayısı: $n = \\dfrac{200 - 2}{2} + 1 = 100$.</p>
      <p class="ales-sol-step">$S = \\dfrac{(2 + 200) \\cdot 100}{2} = 101 \\cdot 100 = 10100$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — İlk $n$ Çift Formülü</div>
      <p class="ales-sol-step">$2 + 4 + \\dots + 2n = n(n+1)$. $n = 100 \\Rightarrow 100 \\cdot 101 = 10100$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 10100</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Aralıkta Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $20$ ile $80$ arasındaki (her ikisi dahil) $5$'in katı olan doğal sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 649 &nbsp; <strong>B)</strong> 651 &nbsp; <strong>C)</strong> 648 &nbsp; <strong>D)</strong> 652 &nbsp; <strong>E)</strong> <span class="key">650</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar: $20, 25, 30, \\dots, 80$. $a_1 = 20,\\; a_n = 80,\\; d = 5$.</p>
      <p class="ales-sol-step">Terim sayısı: $n = \\dfrac{80 - 20}{5} + 1 = 13$.</p>
      <p class="ales-sol-step">$S = \\dfrac{(20 + 80) \\cdot 13}{2} = 50 \\cdot 13 = 650$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 650</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">n Bilinmiyor</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik dizide $a_1 = 3,\\; d = 2$ ve $S_n = 120$ ise $n$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">10</span> &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S_n = \\dfrac{n}{2}\\left[2 \\cdot 3 + (n-1) \\cdot 2\\right] = \\dfrac{n}{2}\\left[6 + 2n - 2\\right] = \\dfrac{n(2n + 4)}{2} = n(n+2)$.</p>
      <p class="ales-sol-step">$n(n+2) = 120 \\Rightarrow n^2 + 2n - 120 = 0 \\Rightarrow (n - 10)(n + 12) = 0$.</p>
      <p class="ales-sol-step">$n > 0 \\Rightarrow n = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 10</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">İki Toplam Verilmiş</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik dizide $S_5 = 35$ ve $S_{10} = 120$ ise $a_1 + d$ kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> <span class="key">5</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S_5 = \\dfrac{5}{2}(2a_1 + 4d) = 5(a_1 + 2d) = 35 \\Rightarrow a_1 + 2d = 7$.</p>
      <p class="ales-sol-step">$S_{10} = \\dfrac{10}{2}(2a_1 + 9d) = 5(2a_1 + 9d) = 120 \\Rightarrow 2a_1 + 9d = 24$.</p>
      <p class="ales-sol-step">İlkinden: $2a_1 + 4d = 14$. Çıkar: $5d = 10 \\Rightarrow d = 2,\\; a_1 = 3$.</p>
      <p class="ales-sol-step">$a_1 + d = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Belirli Aralık Toplamı (Sentez)</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik dizide $a_1 = 4,\\; d = 3$ olduğuna göre, $a_{11} + a_{12} + \\dots + a_{20}$ toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">475</span> &nbsp; <strong>B)</strong> 474 &nbsp; <strong>C)</strong> 476 &nbsp; <strong>D)</strong> 473 &nbsp; <strong>E)</strong> 477
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — S20 − S10</div>
      <p class="ales-sol-step">$S_{20} = \\dfrac{20}{2}(2 \\cdot 4 + 19 \\cdot 3) = 10 \\cdot 65 = 650$.</p>
      <p class="ales-sol-step">$S_{10} = \\dfrac{10}{2}(2 \\cdot 4 + 9 \\cdot 3) = 5 \\cdot 35 = 175$.</p>
      <p class="ales-sol-step">İstenen $= S_{20} - S_{10} = 650 - 175 = 475$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrudan</div>
      <p class="ales-sol-step">$a_{11} = 4 + 10 \\cdot 3 = 34,\\; a_{20} = 4 + 19 \\cdot 3 = 61$. 10 terim.</p>
      <p class="ales-sol-step">$\\dfrac{(34 + 61) \\cdot 10}{2} = 95 \\cdot 5 = 475$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 475</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Aritmetik Ortalama, Simetrik Üç Terim
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Aritmetik Ortalama ve Simetrik Üçlü</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Aritmetik Ortalama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $7$ ile $25$ arasına bir terim eklenerek üç terimli aritmetik dizi oluşturulacaktır. Ortadaki terim kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> <span class="key">16</span> &nbsp; <strong>C)</strong> 17 &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üç terimli aritmetik dizide ortanca = aritmetik ortalama.</p>
      <p class="ales-sol-step">Ortanca $= \\dfrac{7 + 25}{2} = 16$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 16</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Simetrik Üçlü — Toplam ve Çarpım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Üç terimli aritmetik dizinin terimleri toplamı $30$, çarpımı $750$ ise terimler kaçtır?<br><br>
      <strong>A)</strong> $2, 10, 18$ &nbsp; <strong>B)</strong> $3, 10, 17$ &nbsp; <strong>C)</strong> $4, 10, 16$ &nbsp; <strong>D)</strong> <span class="key">$5, 10, 15$</span> &nbsp; <strong>E)</strong> $6, 10, 14$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Simetrik Gösterim</div>
      <p class="ales-sol-step">Terimleri $a - d,\\; a,\\; a + d$ al. Toplam: $3a = 30 \\Rightarrow a = 10$.</p>
      <p class="ales-sol-step">Çarpım: $(10 - d) \\cdot 10 \\cdot (10 + d) = 10(100 - d^2) = 750 \\Rightarrow 100 - d^2 = 75 \\Rightarrow d^2 = 25 \\Rightarrow d = \\pm 5$.</p>
      <p class="ales-sol-step">Terimler: $5, 10, 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $5, 10, 15$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Ortanca Hız Tekniği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik dizide $a_1 + a_3 + a_5 = 27$ ise $a_3$ kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> <span class="key">9</span> &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_1 + a_5 = 2 a_3$ (simetrik). $a_1 + a_3 + a_5 = 3a_3 = 27 \\Rightarrow a_3 = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 9</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Beş Terim Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Beş terimli aritmetik dizinin toplamı $50$, en küçük ile en büyük terimin çarpımı $84$ ise ortak fark $d$'nin pozitif değeri kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Simetrik: $a - 2d,\\; a - d,\\; a,\\; a + d,\\; a + 2d$. Toplam $5a = 50 \\Rightarrow a = 10$.</p>
      <p class="ales-sol-step">$(a - 2d)(a + 2d) = a^2 - 4d^2 = 84 \\Rightarrow 100 - 4d^2 = 84 \\Rightarrow d^2 = 4 \\Rightarrow d = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Ortanca - Toplam Bağı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik dizide ilk $9$ terimin toplamı $90$ ise $a_5$ kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortanca Hız</div>
      <p class="ales-sol-step">Tek sayıda terimde toplam $= n \\cdot$ ortanca. Buradaki ortanca $a_5$.</p>
      <p class="ales-sol-step">$9 \\cdot a_5 = 90 \\Rightarrow a_5 = 10$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Formül</div>
      <p class="ales-sol-step">$S_9 = \\dfrac{9}{2}(2a_1 + 8d) = 9(a_1 + 4d) = 9 a_5 = 90 \\Rightarrow a_5 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Yaş Problemi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Üç kardeşin yaşları aritmetik dizi oluşturuyor. Yaşları toplamı $48$ ise ortancanın yaşı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">16</span> &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> 17 &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yaşları $a - d,\\; a,\\; a + d$ al. Toplam $= 3a = 48 \\Rightarrow a = 16$.</p>
      <p class="ales-sol-step">Ortanca terim, ortak farktan bağımsız olarak $a = 16$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 16</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karma Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Aritmetik dizide $a_3 + a_7 = 32$ ve $a_5 + a_{11} = 50$ ise $a_8$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">25</span> &nbsp; <strong>B)</strong> 24 &nbsp; <strong>C)</strong> 26 &nbsp; <strong>D)</strong> 23 &nbsp; <strong>E)</strong> 27
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_3 + a_7 = 2 a_5$ (simetri, ortanca $5$) $\\Rightarrow a_5 = 16$.</p>
      <p class="ales-sol-step">$a_5 + a_{11} = 50 \\Rightarrow a_{11} = 34$.</p>
      <p class="ales-sol-step">$a_{11} - a_5 = 6d \\Rightarrow 18 = 6d \\Rightarrow d = 3$.</p>
      <p class="ales-sol-step">$a_8 = a_5 + 3d = 16 + 9 = 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 25</span></div>
    </div>
  </div>
</section>
`
};
