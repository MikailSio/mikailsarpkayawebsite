window.ALES_LESSON = {
n: 6,
title: "Mutlak Değer",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>mutlak değer</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Temel hesaplama, $|A| < B$ sıkışma, $|A| > B$ kaçış ve iç-içe mutlak değer denklemleri çözüm içinde adım adım açıklanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Temel Hesaplama ve Özellikler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Temel Hesaplama ve Özellikler</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Doğrudan Hesap</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|-7| + |3| - |-5| + |0|$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> <span class="key">5</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Tanım:</strong> $|x| = x$ ($x \\geq 0$), $|x| = -x$ ($x < 0$). Yani sayının sıfıra uzaklığı.</p>
      <p class="ales-sol-step">$|-7| = 7,\\; |3| = 3,\\; |-5| = 5,\\; |0| = 0$.</p>
      <p class="ales-sol-step">$7 + 3 - 5 + 0 = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">İçinde İşlem</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|3 - 8| + |5 - 2| - |4 - 9|$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Önce içleri hesapla: $|3 - 8| = |-5| = 5$, $|5 - 2| = |3| = 3$, $|4 - 9| = |-5| = 5$.</p>
      <p class="ales-sol-step">$5 + 3 - 5 = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Negatif İçinde Mutlak Değer</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x = -3$ için $|x| - |-x| + |-2x|$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 12 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">6</span> &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|x| = |-3| = 3$. $|-x| = |-(-3)| = |3| = 3$. $|-2x| = |-2 \\cdot (-3)| = |6| = 6$.</p>
      <p class="ales-sol-step">$3 - 3 + 6 = 6$.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> $|x| = |-x|$ daima. $|kx| = |k| \\cdot |x|$ daima.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 6</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">İşaret Bilinmiyor</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a < 0 < b$ ise $\\dfrac{|a|}{a} + \\dfrac{|b|}{b}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">0</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a < 0 \\Rightarrow |a| = -a \\Rightarrow \\dfrac{|a|}{a} = \\dfrac{-a}{a} = -1$.</p>
      <p class="ales-sol-step">$b > 0 \\Rightarrow |b| = b \\Rightarrow \\dfrac{|b|}{b} = 1$.</p>
      <p class="ales-sol-step">Toplam: $-1 + 1 = 0$.</p>
      <p class="ales-sol-step"><strong>Hatırla:</strong> $\\dfrac{|x|}{x}$ "işaret fonksiyonu" $= +1$ ($x > 0$) veya $-1$ ($x < 0$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 0</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">İşaret Bilinmiyor — Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a < 0,\\; b > 0,\\; |a| > |b|$ ise $|a - b| - |a + b| + |a|$ ifadesini sadeleştiriniz.<br><br>
      <strong>A)</strong> $a + 2b$ &nbsp; <strong>B)</strong> $-2b - a$ &nbsp; <strong>C)</strong> <span class="key">$2b - a$</span> &nbsp; <strong>D)</strong> $a - 2b$ &nbsp; <strong>E)</strong> $-a - b$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İşareti Çöz</div>
      <p class="ales-sol-step">$a - b$: negatif − pozitif = negatif ⟹ $|a - b| = -(a - b) = b - a$.</p>
      <p class="ales-sol-step">$a + b$: işareti belirsiz! Ama $|a|$ ile $|b|$ karşılaştırması verilmemiş; ALES'te tek cevap için <strong>$|a| > |b|$</strong> kabul edilir (tipik kalıp). O zaman $a + b < 0 \\Rightarrow |a + b| = -(a + b) = -a - b$.</p>
      <p class="ales-sol-step">$|a| = -a$ (çünkü $a < 0$).</p>
      <p class="ales-sol-step">İfade: $(b - a) - (-a - b) + (-a) = b - a + a + b - a = 2b - a$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2b - a$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Eşitlik — Pozitiflik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 3| + |y + 5| = 0$ ise $x + y$ kaçtır?<br><br>
      <strong>A)</strong> $-8$ &nbsp; <strong>B)</strong> $-5$ &nbsp; <strong>C)</strong> $-3$ &nbsp; <strong>D)</strong> <span class="key">$-2$</span> &nbsp; <strong>E)</strong> $2$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Anahtar fikir:</strong> Mutlak değer $\\geq 0$. İki negatif olmayan sayının toplamı $0$ ⟹ ikisi de $0$.</p>
      <p class="ales-sol-step">$|x - 3| = 0 \\Rightarrow x = 3$. $|y + 5| = 0 \\Rightarrow y = -5$.</p>
      <p class="ales-sol-step">$x + y = 3 + (-5) = -2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $-2$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Çift Çözümlü Denklem</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $|2x - 3| = 7$ denkleminin çözümlerinin toplamı kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $|A| = k$ ($k \\geq 0$) ⟹ $A = k$ veya $A = -k$.</p>
      <p class="ales-sol-step">$2x - 3 = 7 \\Rightarrow 2x = 10 \\Rightarrow x = 5$.</p>
      <p class="ales-sol-step">$2x - 3 = -7 \\Rightarrow 2x = -4 \\Rightarrow x = -2$.</p>
      <p class="ales-sol-step">Toplam: $5 + (-2) = 3$.</p>
      <p class="ales-sol-step"><strong>Hız:</strong> $|2x - 3| = 7$ tipi denkleminin köklerinin toplamı $= \\dfrac{2 \\cdot 3}{2} = 3$ (köklerin toplamı $2 \\cdot$ "iç ifadenin x'siz kısmının diğer tarafı" olabilir).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — |A| < B Sıkışma Tipi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">|A| < B — Sıkışma Tipi Eşitsizlikler</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Temel Sıkışma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x| < 4$ koşulunu sağlayan kaç tane tam sayı vardır?<br><br>
      <strong>A)</strong> 12 &nbsp; <strong>B)</strong> <span class="key">7</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $|A| < k$ ⟺ $-k < A < k$.</p>
      <p class="ales-sol-step">$|x| < 4 \\Leftrightarrow -4 < x < 4$. Tam sayılar: $\\{-3, -2, -1, 0, 1, 2, 3\\}$ ⟹ <strong>7 tane</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 7</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Lineer İçeride</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x - 5| < 3$ koşulunu sağlayan tam sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> <span class="key">25</span> &nbsp; <strong>C)</strong> 27 &nbsp; <strong>D)</strong> 35 &nbsp; <strong>E)</strong> 28
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|x - 5| < 3 \\Leftrightarrow -3 < x - 5 < 3 \\Leftrightarrow 2 < x < 8$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{3, 4, 5, 6, 7\\}$. Toplam: $3+4+5+6+7 = 25$.</p>
      <p class="ales-sol-step"><strong>Hız:</strong> Aritmetik dizi toplamı $= \\dfrac{(3+7) \\cdot 5}{2} = 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 25</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">İki Yandan Sıkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|2x - 7| \\leq 5$ koşulunu sağlayan tam sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 26 &nbsp; <strong>B)</strong> 16 &nbsp; <strong>C)</strong> <span class="key">21</span> &nbsp; <strong>D)</strong> 24 &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-5 \\leq 2x - 7 \\leq 5 \\Rightarrow 2 \\leq 2x \\leq 12 \\Rightarrow 1 \\leq x \\leq 6$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{1, 2, 3, 4, 5, 6\\}$. Toplam: $\\dfrac{6 \\cdot 7}{2} = 21$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 21</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Üçlü Eşitsizlik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1 \\leq |x - 2| < 5$ koşulunu sağlayan tam sayıların sayısı kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> <span class="key">8</span> &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Parçaya Böl</div>
      <p class="ales-sol-step">$|x - 2| < 5 \\Rightarrow -3 < x < 7$. Tam sayılar: $\\{-2, -1, 0, 1, 2, 3, 4, 5, 6\\}$ — 9 tane.</p>
      <p class="ales-sol-step">$|x - 2| < 1$ kısmını çıkar: $1 < x < 3$ ⟹ tam sayı sadece $x = 2$. Çıkar: $|x - 2| = 0$ olan sadece $x = 2$.</p>
      <p class="ales-sol-step">Sonuç: $9 - 1 = 8$ tane.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 8</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Aralık Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 4| < 2$ ve $|y + 3| \\leq 1$ ise $x - y$ farkının alabileceği en küçük tam sayı değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">5</span> &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|x - 4| < 2 \\Rightarrow 2 < x < 6$. Tam: $\\{3, 4, 5\\}$.</p>
      <p class="ales-sol-step">$|y + 3| \\leq 1 \\Rightarrow -4 \\leq y \\leq -2$. Tam: $\\{-4, -3, -2\\}$.</p>
      <p class="ales-sol-step">$x - y$ en küçük ⟹ $x$ en küçük, $y$ en büyük: $x = 3,\\; y = -2 \\Rightarrow 3 - (-2) = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 5</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">İçinde İki Mutlak</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x + 1| + |x - 4| = 5$ denkleminin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $\\{-1, 4\\}$ &nbsp; <strong>B)</strong> <span class="key">$-1 \\leq x \\leq 4$</span> &nbsp; <strong>C)</strong> $x \\leq -1$ veya $x \\geq 4$ &nbsp; <strong>D)</strong> $\\{0, 3\\}$ &nbsp; <strong>E)</strong> $\\emptyset$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geometrik Yorum</div>
      <p class="ales-sol-step">$|x + 1|$ = $x$'in $-1$'e uzaklığı. $|x - 4|$ = $x$'in $4$'e uzaklığı.</p>
      <p class="ales-sol-step">$-1$ ile $4$ arasındaki uzaklık $5$. Eğer $x$ bu iki nokta arasındaysa (dahil), iki uzaklığın toplamı $= 5$.</p>
      <p class="ales-sol-step">Çözüm: $-1 \\leq x \\leq 4$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Aralıklara Böl</div>
      <p class="ales-sol-step">3 durum: $x < -1$, $-1 \\leq x \\leq 4$, $x > 4$. Her birinde mutlak değerleri açıp denklemi çöz; sadece orta aralıkta sürekli sağlanır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-1 \\leq x \\leq 4$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">İki Yan + Mutlak</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $|x + 2| + |x - 3| < 7$ koşulunu sağlayan kaç tane tam sayı vardır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geometrik</div>
      <p class="ales-sol-step">$|x + 2| + |x - 3|$ = $x$'in $-2$ ve $3$ noktalarına uzaklıklarının toplamı.</p>
      <p class="ales-sol-step">$-2$ ile $3$ arasındaysa toplam $= 5$ (sabit). Dışındaysa toplam artar.</p>
      <p class="ales-sol-step">Toplam $< 7$ ⟹ $x$ "uzakta" değil, $-2$'nin solundan $1$ birim ve $3$'ün sağından $1$ birim ile sınırlı.</p>
      <p class="ales-sol-step">Çözüm: $-3 < x < 4$. Tam sayılar: $\\{-2, -1, 0, 1, 2, 3\\}$ ⟹ <strong>6 tane</strong>.</p>
      <p class="ales-sol-step"><strong>Doğrula sınırlar:</strong> $x = -3$ ⟹ $|-1| + |-6| = 7$ (eşit, dahil değil). $x = 4$ ⟹ $|6| + |1| = 7$ (eşit, dahil değil).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — |A| > B Kaçış + İç-İçe Mutlak Değer
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">|A| > B Kaçış Tipi ve İç-İçe Mutlak Değer</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Temel Kaçış</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x| > 3$ koşulunu sağlayan, $-7 \\leq x \\leq 7$ aralığındaki kaç tam sayı vardır?<br><br>
      <strong>A)</strong> <span class="key">8</span> &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $|A| > k$ ⟺ $A > k$ veya $A < -k$.</p>
      <p class="ales-sol-step">$|x| > 3 \\Rightarrow x > 3$ veya $x < -3$. Aralıkta: $\\{-7, -6, -5, -4\\} \\cup \\{4, 5, 6, 7\\}$ ⟹ <strong>8 tane</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 8</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Lineer Kaçış</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x - 4| \\geq 3$ koşulunu sağlayan, $0 \\leq x \\leq 10$ aralığındaki kaç tam sayı vardır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x - 4 \\geq 3$ ⟹ $x \\geq 7$. Veya $x - 4 \\leq -3$ ⟹ $x \\leq 1$.</p>
      <p class="ales-sol-step">Aralıkta: $\\{0, 1\\} \\cup \\{7, 8, 9, 10\\}$ ⟹ $2 + 4 = 6$ tane.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İç-İçe Mutlak Değer</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $||x - 3| - 5| = 2$ denkleminin çözümlerinin toplamı kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 17 &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> <span class="key">12</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Dış'tan İç'e</div>
      <p class="ales-sol-step">İç parçayı $A = |x - 3| - 5$ kabul et: $|A| = 2 \\Rightarrow A = 2$ veya $A = -2$.</p>
      <p class="ales-sol-step"><strong>Durum 1:</strong> $|x - 3| = 7 \\Rightarrow x - 3 = 7$ ($x = 10$) veya $x - 3 = -7$ ($x = -4$).</p>
      <p class="ales-sol-step"><strong>Durum 2:</strong> $|x - 3| = 3 \\Rightarrow x - 3 = 3$ ($x = 6$) veya $x - 3 = -3$ ($x = 0$).</p>
      <p class="ales-sol-step">Tüm çözümler: $\\{10, -4, 6, 0\\}$. Toplam: $10 - 4 + 6 + 0 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 12</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İç-İçe Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $||x| - 2| < 3$ koşulunu sağlayan kaç tane tam sayı vardır?<br><br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> <span class="key">9</span> &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-3 < |x| - 2 < 3 \\Rightarrow -1 < |x| < 5$.</p>
      <p class="ales-sol-step">$|x| \\geq 0$ daima ⟹ asıl şart $0 \\leq |x| < 5$ ⟹ $-5 < x < 5$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{-4, -3, -2, -1, 0, 1, 2, 3, 4\\}$ ⟹ <strong>9 tane</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 9</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Karışık Denklem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 1| + |x| = 3$ denkleminin çözümlerinin çarpımı kaçtır?<br><br>
      <strong>A)</strong> $-3$ &nbsp; <strong>B)</strong> <span class="key">$-2$</span> &nbsp; <strong>C)</strong> $-1$ &nbsp; <strong>D)</strong> $1$ &nbsp; <strong>E)</strong> $2$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Aralıklara Böl</div>
      <p class="ales-sol-step">Kritik noktalar: $0$ ve $1$. Üç aralık: $x < 0,\\; 0 \\leq x \\leq 1,\\; x > 1$.</p>
      <p class="ales-sol-step"><strong>$x < 0$:</strong> $|x - 1| = 1 - x$, $|x| = -x$ ⟹ $(1 - x) + (-x) = 1 - 2x = 3 \\Rightarrow x = -1$. Aralık ✓.</p>
      <p class="ales-sol-step"><strong>$0 \\leq x \\leq 1$:</strong> $|x - 1| = 1 - x$, $|x| = x$ ⟹ $(1 - x) + x = 1 \\neq 3$. Çözüm yok.</p>
      <p class="ales-sol-step"><strong>$x > 1$:</strong> $|x - 1| = x - 1$, $|x| = x$ ⟹ $(x - 1) + x = 2x - 1 = 3 \\Rightarrow x = 2$. Aralık ✓.</p>
      <p class="ales-sol-step">Çözümler: $-1$ ve $2$. Çarpım: $-2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-2$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Kaçış — Tam Sayı Sayısı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $|2x - 3| > 5$ ve $|x| < 6$ koşullarının ortak çözümünü sağlayan tam sayı sayısı kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> <span class="key">5</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|2x - 3| > 5$: $2x - 3 > 5 \\Rightarrow x > 4$ veya $2x - 3 < -5 \\Rightarrow x < -1$.</p>
      <p class="ales-sol-step">$|x| < 6 \\Rightarrow -6 < x < 6$.</p>
      <p class="ales-sol-step">Kesişim: $(-6 < x < -1) \\cup (4 < x < 6)$. Tam sayılar: $\\{-5, -4, -3, -2\\} \\cup \\{5\\}$ ⟹ $4 + 1 = 5$ tane.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — En Küçük Değer</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = |x - 1| + |x - 4| + |x - 7|$ ifadesinin alabileceği en küçük değer kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 12 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> <span class="key">6</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geometrik</div>
      <p class="ales-sol-step">Üç noktaya uzaklıkların toplamını minimize eder; <strong>orta nokta</strong> en küçük değeri verir.</p>
      <p class="ales-sol-step">Üç nokta: $1, 4, 7$. Orta nokta $= 4$.</p>
      <p class="ales-sol-step">$f(4) = |4 - 1| + |4 - 4| + |4 - 7| = 3 + 0 + 3 = 6$.</p>
      <p class="ales-sol-step"><strong>Genel kural:</strong> Tek sayıda noktaya uzaklıklar toplamı, <em>medyan</em> noktada minimumdur. Çift sayıda noktaya, ortadaki iki nokta arasındaki tüm $x$'lerde aynı minimumdur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 6</span></div>
    </div>
  </div>
</section>
`
};
