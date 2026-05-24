window.ALES_LESSON = {
n: 39,
title: "Sayı Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>sayı problemleri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. ALES'in klasiği: ardışık sayılar ortancaya göre simetrik kurulur ($n-1, n, n+1$); ardışık çift/tek arasındaki fark $2$.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Ardışık Tam Sayılar
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Ardışık Tam Sayılar (Toplam / Çarpım / Fark)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">3 Ardışık · Toplam</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık tam sayının toplamı $48$ ise en büyük sayı kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> <span class="key">17</span> &nbsp; <strong>D)</strong> 20 &nbsp; <strong>E)</strong> 34
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortancaya $n$</div>
      <p class="ales-sol-step">$(n-1) + n + (n+1) = 3n = 48 \\Rightarrow n = 16$.</p>
      <p class="ales-sol-step">Sayılar $15, 16, 17$ ⟹ en büyük $17$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 17</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">5 Ardışık · Ortanca</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Beş ardışık tam sayının toplamı $-15$ ise ortanca terim kaçtır?<br><br>
      <strong>A)</strong> $-5$ &nbsp; <strong>B)</strong> $-4$ &nbsp; <strong>C)</strong> <span class="key">$-3$</span> &nbsp; <strong>D)</strong> $-2$ &nbsp; <strong>E)</strong> $3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ortanca $= -15/5 = -3$. (Tek sayıda ardışıkta ortanca = toplam ÷ adet.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-3$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">2 Ardışık · Çarpım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İki ardışık pozitif tam sayının çarpımı $72$ ise küçük sayı kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">8</span> &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Karekök Tahmini</div>
      <p class="ales-sol-step">$\\sqrt{72} \\approx 8{,}5$ ⟹ deneme: $8 \\cdot 9 = 72$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 8</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">4 Ardışık · Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Dört ardışık pozitif tam sayının toplamı $34$'tür. En küçüğü kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">7</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$n + (n+1) + (n+2) + (n+3) = 4n + 6 = 34 \\Rightarrow n = 7$.</p>
      <p class="ales-sol-step">Sayılar $7, 8, 9, 10$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — İki Ortanca Ortalaması</div>
      <p class="ales-sol-step">Çift terimde "iki ortanca ortalaması" $= 34/4 = 8{,}5$. Ortancalar $8$ ve $9$ ⟹ en küçük $7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Karelerinin Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki ardışık tam sayının karelerinin farkı $25$'tir. Küçüğü kaçtır?<br><br>
      <strong>A)</strong> <span class="key">12</span> &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> 15 &nbsp; <strong>D)</strong> 17 &nbsp; <strong>E)</strong> 24
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(n+1)^{2} - n^{2} = 2n + 1 = 25 \\Rightarrow n = 12$.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> İki ardışık tam sayının karelerinin farkı = bu iki sayının toplamına eşittir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 12</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Toplam ve Çarpım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık tam sayının toplamı $24$, ortancayı bulunuz. Bu üç sayının çarpımı kaçtır?<br><br>
      <strong>A)</strong> 3 (ortanca), 504 (çarpım) &nbsp; <strong>B)</strong> 5 (ortanca), 504 (çarpım) &nbsp; <strong>C)</strong> <span class="key">8 (ortanca), 504 (çarpım)</span> &nbsp; <strong>D)</strong> 10 (ortanca), 504 (çarpım) &nbsp; <strong>E)</strong> 16 (ortanca), 504 (çarpım)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ortanca $= 24/3 = 8$. Sayılar $7, 8, 9$.</p>
      <p class="ales-sol-step">Çarpım $= 7 \\cdot 8 \\cdot 9 = 504$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 8 (ortanca), 504 (çarpım)</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Toplam Aralığı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık tam sayının toplamı $30$ ile $60$ arasındadır. Bu sayıların ortancası en az kaç olabilir?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">11</span> &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 3n$ ⟹ $30 < 3n < 60 \\Rightarrow 10 < n < 20$.</p>
      <p class="ales-sol-step">$n$ tam sayı ⟹ en küçük $n = 11$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 11</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Çift / Tek Sayı Problemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Çift / Tek Sayı Problemleri</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">3 Ardışık Çift</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık çift sayının toplamı $54$ ise en büyüğü kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 17 &nbsp; <strong>C)</strong> 19 &nbsp; <strong>D)</strong> <span class="key">20</span> &nbsp; <strong>E)</strong> 29
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ardışık çiftler arasında fark $2$. Ortanca $n$ ⟹ $n-2, n, n+2$.</p>
      <p class="ales-sol-step">$3n = 54 \\Rightarrow n = 18$. Sayılar $16, 18, 20$ ⟹ en büyük $20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 20</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">3 Ardışık Tek</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Üç ardışık tek sayının toplamı $33$ ise en küçüğü kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ortanca $= 33/3 = 11$. Sayılar $9, 11, 13$ ⟹ en küçük $9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çift × Tek Sentez</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a$ tek, $b$ çift sayı ise aşağıdakilerden hangisi <strong>her zaman çift</strong>tir?<br>
      <strong>I.</strong> $a + b$ &nbsp; <strong>II.</strong> $a \\cdot b$ &nbsp; <strong>III.</strong> $a^{2} + b$ &nbsp; <strong>IV.</strong> $2a + b$<br><br>
      <strong>A)</strong> Yalnız II &nbsp; <strong>B)</strong> Yalnız IV &nbsp; <strong>C)</strong> I ve II &nbsp; <strong>D)</strong> <span class="key">II ve IV</span> &nbsp; <strong>E)</strong> I, II ve IV
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kurallar: tek+çift=tek, tek×çift=çift, çift+çift=çift, tek×tek=tek.</p>
      <p class="ales-sol-step"><strong>I.</strong> tek+çift = tek ✗ &nbsp; <strong>II.</strong> tek×çift = <strong>çift</strong> ✓</p>
      <p class="ales-sol-step"><strong>III.</strong> tek$^2$+çift = tek+çift = tek ✗ &nbsp; <strong>IV.</strong> $2a$ çift, çift+çift = <strong>çift</strong> ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) II ve IV</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">4 Ardışık Tek</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Dört ardışık tek sayının toplamı $48$'dir. En büyüğü ile en küçüğünün toplamı kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> <span class="key">24</span> &nbsp; <strong>C)</strong> 25 &nbsp; <strong>D)</strong> 28 &nbsp; <strong>E)</strong> 48
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar $n, n+2, n+4, n+6$. Toplam $= 4n + 12 = 48 \\Rightarrow n = 9$.</p>
      <p class="ales-sol-step">Sayılar $9, 11, 13, 15$. En küçük + en büyük $= 9 + 15 = 24$.</p>
      <p class="ales-sol-step"><strong>Hızlı:</strong> Bu toplam = ortalama × 2 = $(48/4) \\cdot 2 = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 24</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">İki Çift · Çarpım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki ardışık çift pozitif tam sayının çarpımı $80$'dir. Küçüğü kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> <span class="key">8</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 13
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ardışık çift: $n$ ve $n+2$. $n(n+2) = 80$.</p>
      <p class="ales-sol-step">$\\sqrt{80} \\approx 8{,}9$ ⟹ dene: $8 \\cdot 10 = 80$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 8</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Çift Sayılar Toplamı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1$'den $20$'ye kadar olan çift doğal sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 101 &nbsp; <strong>B)</strong> 109 &nbsp; <strong>C)</strong> <span class="key">110</span> &nbsp; <strong>D)</strong> 113 &nbsp; <strong>E)</strong> 132
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Aritmetik Dizi</div>
      <p class="ales-sol-step">Sayılar $2, 4, \\dots, 20$ (10 terim).</p>
      <p class="ales-sol-step">Toplam $= \\dfrac{(2+20) \\cdot 10}{2} = \\dfrac{220}{2} = 110$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — İlk $n$ Çift Formülü</div>
      <p class="ales-sol-step">$2 + 4 + \\dots + 2n = n(n+1)$. $n = 10 \\Rightarrow 10 \\cdot 11 = 110$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 110</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Çift+Tek Sentez · Sınırlı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a$ ile $b$ tam sayılardır. $a + b$ tek ve $a \\cdot b$ çift olduğuna göre $a$ ve $b$ için aşağıdakilerden hangisi <strong>kesinlikle doğru</strong>dur?<br>
      <strong>I.</strong> Biri tek diğeri çift &nbsp; <strong>II.</strong> İkisi de tek &nbsp; <strong>III.</strong> İkisi de çift<br><br>
      <strong>A)</strong> <span class="key">Yalnız I</span> &nbsp; <strong>B)</strong> Yalnız II &nbsp; <strong>C)</strong> Yalnız III &nbsp; <strong>D)</strong> I ve II &nbsp; <strong>E)</strong> I ve III
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a + b$ tek ⟹ biri tek diğeri çift (tek+tek=çift ve çift+çift=çift olduğundan).</p>
      <p class="ales-sol-step">$a \\cdot b$ çift ⟹ en az biri çift (kontrol: tek×çift=çift ✓, tek×tek=tek ✗).</p>
      <p class="ales-sol-step">Her iki şart birlikte ⟹ <strong>biri tek diğeri çift</strong> kesin.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) Yalnız I</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — İki Sayı Toplam-Fark-Çarpım
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">İki Sayı Toplam-Fark-Çarpım Kombinasyonu</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Toplam ve Fark</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İki sayının toplamı $30$, farkı $6$'dır. Büyük sayı kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 17 &nbsp; <strong>C)</strong> <span class="key">18</span> &nbsp; <strong>D)</strong> 27 &nbsp; <strong>E)</strong> 36
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hızlı Formül</div>
      <p class="ales-sol-step">Büyük $= (T + F)/2 = (30 + 6)/2 = 18$. Küçük $= (T - F)/2 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 18</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Toplam ve Çarpım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İki sayının toplamı $14$, çarpımı $48$'dir. Bu sayılar kaçtır?<br><br>
      <strong>A)</strong> 5 ve 8 &nbsp; <strong>B)</strong> <span class="key">6 ve 8</span> &nbsp; <strong>C)</strong> 7 ve 8 &nbsp; <strong>D)</strong> 8 ve 8 &nbsp; <strong>E)</strong> 9 ve 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İki sayı $14$'ün çarpan ikilileri: $1 \\cdot 13, 2 \\cdot 12, 3 \\cdot 11, 4 \\cdot 10, 5 \\cdot 9, 6 \\cdot 8, 7 \\cdot 7$.</p>
      <p class="ales-sol-step">Çarpım $48$ olan: $6 \\cdot 8 = 48$ ✓.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — İkinci Derece</div>
      <p class="ales-sol-step">$x$ ve $14-x$. $x(14-x) = 48 \\Rightarrow x^{2} - 14x + 48 = 0 \\Rightarrow (x-6)(x-8) = 0$. Sayılar $6$ ve $8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 6 ve 8</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Fark ve Çarpım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki pozitif tam sayının farkı $5$, çarpımı $84$'tür. Büyük sayı kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">12</span> &nbsp; <strong>D)</strong> 16 &nbsp; <strong>E)</strong> 24
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x - y = 5$, $xy = 84$. $x = y + 5 \\Rightarrow y(y+5) = 84$.</p>
      <p class="ales-sol-step">$y^{2} + 5y - 84 = 0 \\Rightarrow (y - 7)(y + 12) = 0 \\Rightarrow y = 7$.</p>
      <p class="ales-sol-step">$x = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Tabir Çevirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir sayının $3$ katından $5$ eksiği, sayının kendisinin $2$ katına eşittir. Sayı kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayı $= x$. $3x - 5 = 2x \\Rightarrow x = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İki Sayı · Oran + Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki sayının oranı $3 : 5$ ve toplamı $48$'dir. Büyük sayı kaçtır?<br><br>
      <strong>A)</strong> 21 &nbsp; <strong>B)</strong> <span class="key">30</span> &nbsp; <strong>C)</strong> 33 &nbsp; <strong>D)</strong> 36 &nbsp; <strong>E)</strong> 40
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar $3k, 5k$. Toplam $= 8k = 48 \\Rightarrow k = 6$. Büyük $= 5 \\cdot 6 = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 30</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Toplam Karesi Açılım</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      İki sayının toplamı $10$, kareleri toplamı $58$ olduğuna göre çarpımları kaçtır?<br><br>
      <strong>A)</strong> 12 &nbsp; <strong>B)</strong> 16 &nbsp; <strong>C)</strong> <span class="key">21</span> &nbsp; <strong>D)</strong> 24 &nbsp; <strong>E)</strong> 28
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$(x + y)^{2} = x^{2} + 2xy + y^{2}$.</p>
      <p class="ales-sol-step">$10^{2} = 58 + 2xy \\Rightarrow 100 = 58 + 2xy \\Rightarrow xy = 21$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 21</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karelerinin Farkı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      İki sayının toplamı $20$, karelerinin farkı $40$'tır. Bu sayıların farkı kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$x^{2} - y^{2} = (x+y)(x-y)$.</p>
      <p class="ales-sol-step">$40 = 20 \\cdot (x-y) \\Rightarrow x - y = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>
</section>
`
};
