window.ALES_LESSON = {
n: 42,
title: "Geometrik Diziler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>geometrik diziler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Genel terim $a_n = a_1 \\cdot r^{n-1}$, sonlu/sonsuz toplam ve geometrik ortalama (sıçrama topu) klasik kalıpları problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Genel Terim a_n = a_1 · r^(n-1)
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
      $a_1 = 3$ ve ortak çarpan $r = 2$ olan geometrik dizide $a_6$ kaçtır?<br><br>
      <strong>A)</strong> 97 &nbsp; <strong>B)</strong> 95 &nbsp; <strong>C)</strong> <span class="key">96</span> &nbsp; <strong>D)</strong> 98 &nbsp; <strong>E)</strong> 94
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Genel terim: $a_n = a_1 \\cdot r^{n-1}$.</p>
      <p class="ales-sol-step">$a_6 = 3 \\cdot 2^5 = 3 \\cdot 32 = 96$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 96</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">r Bulma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Geometrik dizide $a_2 = 6$ ve $a_5 = 162$ ise ortak çarpan $r$ kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pratik Formül</div>
      <p class="ales-sol-step">İki terim arası: $\\dfrac{a_m}{a_n} = r^{m - n}$.</p>
      <p class="ales-sol-step">$\\dfrac{a_5}{a_2} = r^3 \\Rightarrow \\dfrac{162}{6} = 27 = r^3 \\Rightarrow r = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">İlk Terim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Geometrik dizide $a_4 = 54$ ve $r = 3$ ise $a_1$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_4 = a_1 \\cdot r^3 \\Rightarrow 54 = a_1 \\cdot 27 \\Rightarrow a_1 = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Bakteri Sayısı (Uygulama)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir bakteri kültürü her saatte $2$ katına çıkmaktadır. Başlangıçta $50$ bakteri varsa $5$ saat sonra kaç bakteri olur?<br><br>
      <strong>A)</strong> 1601 &nbsp; <strong>B)</strong> 1599 &nbsp; <strong>C)</strong> <span class="key">1600</span> &nbsp; <strong>D)</strong> 1602 &nbsp; <strong>E)</strong> 1598
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_1 = 50,\\; r = 2$. $5$ saat sonraki sayı $= a_1 \\cdot r^5 = 50 \\cdot 32 = 1600$.</p>
      <p class="ales-sol-step"><strong>Dikkat:</strong> "5 saat sonra" $\\Rightarrow$ üs $5$ (başlangıç sıfırıncı saat).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 1600</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Ardışık Üç Terim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Geometrik bir dizide ardışık üç terim $4,\\; x,\\; 25$'tir. $x$'in pozitif değeri kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geometrik Ortalama</div>
      <p class="ales-sol-step">Geometrik dizide ortanca terim, kenarların geometrik ortalamasıdır: $x^2 = a \\cdot c$.</p>
      <p class="ales-sol-step">$x^2 = 4 \\cdot 25 = 100 \\Rightarrow x = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Negatif r</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a_1 = 8$ ve $r = -\\dfrac{1}{2}$ olan geometrik dizide $a_5$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1/2</span> &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 2/2 &nbsp; <strong>D)</strong> 1/3 &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_5 = 8 \\cdot \\left(-\\dfrac{1}{2}\\right)^4 = 8 \\cdot \\dfrac{1}{16} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step"><strong>Not:</strong> Üs çift olduğundan negatif kaybolur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1/2</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İki Bilinmeyenli Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Geometrik dizide $a_2 + a_4 = 30$ ve $a_3 + a_5 = 60$ ise $a_1$ kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 1 &nbsp; <strong>D)</strong> <span class="key">3</span> &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İkinci toplam birinci toplamın $r$ katıdır: $\\dfrac{a_3 + a_5}{a_2 + a_4} = r$.</p>
      <p class="ales-sol-step">$r = \\dfrac{60}{30} = 2$.</p>
      <p class="ales-sol-step">$a_2 + a_4 = a_1 r + a_1 r^3 = a_1 r (1 + r^2) = 2 a_1 \\cdot 5 = 10 a_1 = 30 \\Rightarrow a_1 = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 3</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Toplam ve Sonsuz Toplam
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Sonlu ve Sonsuz Geometrik Toplam</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Direkt Toplam</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a_1 = 2,\\; r = 3$ olan geometrik dizinin ilk $5$ teriminin toplamı kaçtır?<br><br>
      <strong>A)</strong> 241 &nbsp; <strong>B)</strong> <span class="key">242</span> &nbsp; <strong>C)</strong> 243 &nbsp; <strong>D)</strong> 240 &nbsp; <strong>E)</strong> 244
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S_n = a_1 \\cdot \\dfrac{r^n - 1}{r - 1}$ ($r \\neq 1$).</p>
      <p class="ales-sol-step">$S_5 = 2 \\cdot \\dfrac{3^5 - 1}{3 - 1} = 2 \\cdot \\dfrac{242}{2} = 242$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 242</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Sonsuz Toplam — Doğrudan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $1 + \\dfrac{1}{2} + \\dfrac{1}{4} + \\dfrac{1}{8} + \\dots$ sonsuz toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">2</span> &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|r| < 1$ koşulunda $S_\\infty = \\dfrac{a_1}{1 - r}$.</p>
      <p class="ales-sol-step">$a_1 = 1,\\; r = \\dfrac{1}{2} \\Rightarrow S_\\infty = \\dfrac{1}{1 - 1/2} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 2</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Sonsuz Toplam Bilinen</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir geometrik dizinin sonsuz toplamı $9$ ve $r = \\dfrac{2}{3}$ ise ilk terim $a_1$ kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S_\\infty = \\dfrac{a_1}{1 - r} = 9 \\Rightarrow a_1 = 9 \\cdot (1 - 2/3) = 9 \\cdot \\dfrac{1}{3} = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Devirli Ondalık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0{,}\\overline{3} = 0{,}333\\dots$ devirli ondalığını sonsuz geometrik toplamla kesir olarak ifade edin.<br><br>
      <strong>A)</strong> <span class="key">1/3</span> &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 2/3 &nbsp; <strong>D)</strong> 1/4 &nbsp; <strong>E)</strong> 1/2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0{,}333\\dots = \\dfrac{3}{10} + \\dfrac{3}{100} + \\dfrac{3}{1000} + \\dots$</p>
      <p class="ales-sol-step">$a_1 = \\dfrac{3}{10},\\; r = \\dfrac{1}{10} \\Rightarrow S_\\infty = \\dfrac{3/10}{1 - 1/10} = \\dfrac{3/10}{9/10} = \\dfrac{1}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1/3</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">İki Şartlı Sonsuz</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Sonsuz geometrik dizide $a_1 = 12$ ve $S_\\infty = 16$ ise $r$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1/4</span> &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 2/4 &nbsp; <strong>D)</strong> 1/5 &nbsp; <strong>E)</strong> 1/3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{12}{1 - r} = 16 \\Rightarrow 1 - r = \\dfrac{12}{16} = \\dfrac{3}{4} \\Rightarrow r = \\dfrac{1}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1/4</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">2 Tabanlı Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1 + 2 + 4 + 8 + \\dots + 2^{10}$ toplamı kaçtır?<br><br>
      <strong>A)</strong> 2048 &nbsp; <strong>B)</strong> 2046 &nbsp; <strong>C)</strong> 2049 &nbsp; <strong>D)</strong> 2045 &nbsp; <strong>E)</strong> <span class="key">2047</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geometrik Toplam</div>
      <p class="ales-sol-step">$a_1 = 1,\\; r = 2,\\; n = 11$ (üsler $0$ ile $10$ dahil).</p>
      <p class="ales-sol-step">$S_{11} = 1 \\cdot \\dfrac{2^{11} - 1}{2 - 1} = 2048 - 1 = 2047$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Kural</div>
      <p class="ales-sol-step">$2^0 + 2^1 + \\dots + 2^k = 2^{k+1} - 1$. $k = 10 \\Rightarrow 2^{11} - 1 = 2047$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 2047</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Sonsuz Toplam</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Pozitif terimli sonsuz geometrik dizide $a_1 + a_2 = 12$ ve $S_\\infty = 18$ ise $r$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{\\sqrt{3}}{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>E)</strong> $\\dfrac{\\sqrt{2}}{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_1(1 + r) = 12$ ve $\\dfrac{a_1}{1 - r} = 18 \\Rightarrow a_1 = 18(1 - r)$.</p>
      <p class="ales-sol-step">İlkine yaz: $18(1 - r)(1 + r) = 12 \\Rightarrow 18(1 - r^2) = 12 \\Rightarrow 1 - r^2 = \\dfrac{2}{3} \\Rightarrow r^2 = \\dfrac{1}{3}$.</p>
      <p class="ales-sol-step">Pozitif: $r = \\dfrac{1}{\\sqrt{3}} = \\dfrac{\\sqrt{3}}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{\\sqrt{3}}{3}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Geometrik Ortalama + Sıçrama Topu
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Geometrik Ortalama ve Sıçrama Topu</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Geometrik Ortalama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $9$ ile $36$'nın pozitif geometrik ortalaması kaçtır?<br><br>
      <strong>A)</strong> 17 &nbsp; <strong>B)</strong> 19 &nbsp; <strong>C)</strong> 16 &nbsp; <strong>D)</strong> <span class="key">18</span> &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İki sayının geometrik ortalaması: $\\sqrt{a \\cdot b}$.</p>
      <p class="ales-sol-step">$\\sqrt{9 \\cdot 36} = \\sqrt{324} = 18$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 18</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Sıçrama Topu — Klasik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir top $20$ metre yükseklikten bırakılıyor. Her sıçrayışta önceki yüksekliğin $\\dfrac{1}{2}$'sine ulaşıyor. Sonsuza kadar aldığı <strong>toplam yol</strong> kaç metredir?<br><br>
      <strong>A)</strong> 61 m &nbsp; <strong>B)</strong> <span class="key">60 m</span> &nbsp; <strong>C)</strong> 59 m &nbsp; <strong>D)</strong> 62 m &nbsp; <strong>E)</strong> 58 m
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Klasik Formül</div>
      <p class="ales-sol-step">İlk düşüş: $20$ m. Sonra her sıçrayış için $h_n$ bir kez yukarı, bir kez aşağı.</p>
      <p class="ales-sol-step">Toplam yol $= h + 2(h r + h r^2 + \\dots) = h + 2h \\cdot \\dfrac{r}{1 - r}$.</p>
      <p class="ales-sol-step">Hızlı kalıp (klasik): toplam yol $= h \\cdot \\dfrac{1 + r}{1 - r}$.</p>
      <p class="ales-sol-step">$= 20 \\cdot \\dfrac{1 + 1/2}{1 - 1/2} = 20 \\cdot \\dfrac{3/2}{1/2} = 20 \\cdot 3 = 60$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 60 m</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Üç Terim Geometrik Ortalama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Pozitif terimli geometrik dizide $a_1 \\cdot a_3 = 25$ ise $a_2$ kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a_2^2 = a_1 \\cdot a_3$ (ardışık üç terim, geometrik ortalama).</p>
      <p class="ales-sol-step">$a_2^2 = 25 \\Rightarrow a_2 = 5$ (pozitif).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Simetrik Üçlü Geometrik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Üç terimli geometrik dizinin terimleri çarpımı $216$, toplamı $26$ ise terimler kaçtır?<br><br>
      <strong>A)</strong> $1, 6, 36$ &nbsp; <strong>B)</strong> <span class="key">$2, 6, 18$</span> &nbsp; <strong>C)</strong> $3, 6, 12$ &nbsp; <strong>D)</strong> $4, 6, 16$ &nbsp; <strong>E)</strong> $6, 6, 14$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Simetrik Gösterim</div>
      <p class="ales-sol-step">Terimleri $\\dfrac{a}{r},\\; a,\\; ar$ al.</p>
      <p class="ales-sol-step">Çarpım $= a^3 = 216 \\Rightarrow a = 6$.</p>
      <p class="ales-sol-step">Toplam $= 6\\left(\\dfrac{1}{r} + 1 + r\\right) = 26 \\Rightarrow \\dfrac{1}{r} + 1 + r = \\dfrac{13}{3}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{r} + r = \\dfrac{10}{3} \\Rightarrow 3r^2 - 10r + 3 = 0 \\Rightarrow r = 3$ veya $r = \\dfrac{1}{3}$.</p>
      <p class="ales-sol-step">$r = 3$ için terimler: $2, 6, 18$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2, 6, 18$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Sıçrama — Toplam Sıçrayış</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir top $9$ metreden düşüyor ve her sıçrayışta yüksekliğinin $\\dfrac{1}{3}$'üne ulaşıyor. Top, sıçrayışlarında ulaştığı yüksekliklerin <strong>toplamı</strong> kaç metredir?<br><br>
      <strong>A)</strong> 5.5 m &nbsp; <strong>B)</strong> 3.5 m &nbsp; <strong>C)</strong> 6.5 m &nbsp; <strong>D)</strong> 2.5 m &nbsp; <strong>E)</strong> <span class="key">4.5 m</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sıçrayış yükseklikleri: $9 \\cdot \\dfrac{1}{3} = 3,\\; 1,\\; \\dfrac{1}{3},\\; \\dots$ (geometrik, $r = 1/3$).</p>
      <p class="ales-sol-step">Sonsuz toplam: $\\dfrac{3}{1 - 1/3} = \\dfrac{3}{2/3} = \\dfrac{9}{2} = 4{,}5$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 4,5 m</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Faiz / Üstel Büyüme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir nüfus her yıl $\\%20$ büyüyor. Bugün $1000$ kişi varsa $3$ yıl sonra nüfus kaç olur?<br><br>
      <strong>A)</strong> 1729 &nbsp; <strong>B)</strong> <span class="key">1728</span> &nbsp; <strong>C)</strong> 1727 &nbsp; <strong>D)</strong> 1730 &nbsp; <strong>E)</strong> 1726
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yıllık çarpan $r = 1{,}2$. $3$ yıl sonra: $1000 \\cdot 1{,}2^3 = 1000 \\cdot 1{,}728 = 1728$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1728</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Geometrik + Aritmetik Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Pozitif terimli üç sayı geometrik dizi oluşturmaktadır. Bu sayıların toplamı $14$, ortancası ile en küçüğünün toplamı $6$ ise en büyüğü kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> <span class="key">8</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Terimleri $a,\\; ar,\\; ar^2$ al ($a > 0$, $r > 1$ kabul, çünkü en büyük en sağdaki olmalı).</p>
      <p class="ales-sol-step">Toplam: $a(1 + r + r^2) = 14$. Ortanca + en küçük: $a + ar = a(1 + r) = 6$.</p>
      <p class="ales-sol-step">İlkini ikiniyle böl: $\\dfrac{1 + r + r^2}{1 + r} = \\dfrac{14}{6} = \\dfrac{7}{3}$.</p>
      <p class="ales-sol-step">$3(1 + r + r^2) = 7(1 + r) \\Rightarrow 3r^2 - 4r - 4 = 0 \\Rightarrow (3r + 2)(r - 2) = 0 \\Rightarrow r = 2$.</p>
      <p class="ales-sol-step">$a(1 + 2) = 6 \\Rightarrow a = 2$. En büyük: $ar^2 = 2 \\cdot 4 = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 8</span></div>
    </div>
  </div>
</section>
`
};
