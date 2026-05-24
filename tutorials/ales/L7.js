window.ALES_LESSON = {
n: 7,
title: "Bölünebilme Kuralları",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>bölünebilme kuralları</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. 2/4/5/8 son basamak kuralı, 3/9/6 rakamlar toplamı, 11 alterne ve "hem $a$ hem $b$" → EKOK kombinasyonları çözüm içinde uygulanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — 2 / 4 / 5 / 8 ile Bölünebilme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">2, 4, 5, 8 ile Bölünebilme — Son Basamak Kuralları</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">2 ve 5 ile</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{47x}$ üç basamaklı sayısı hem $2$ hem $5$ ile bölünüyor. $x$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 1 &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $2$ ile bölünür ⟺ son basamak çift. $5$ ile bölünür ⟺ son basamak $0$ veya $5$.</p>
      <p class="ales-sol-step">Hem çift hem $\\{0, 5\\}$ ⟹ $x = 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">4 ile Bölünebilme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{12ab}$ dört basamaklı sayısı $4$ ile bölünüyor. $b$'nin alabileceği en büyük değer için $a$ kaç farklı değer alır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $4$ ile bölünür ⟺ <strong>son iki basamak</strong>tan oluşan sayı $4$ ile bölünür.</p>
      <p class="ales-sol-step">$b$ rakam, en büyük $b = 9$. $\\overline{a9}$ formundaki sayı $4$'e bölünmeli. $\\overline{a9}$ tek (son basamak $9$), $4$ ile bölünmez.</p>
      <p class="ales-sol-step">$b = 9$ için çözüm yok. <strong>İkinci en büyük $b$:</strong> $b = 8$. $\\overline{a8}$: $a = 0,1,2,\\dots,9$ deneyelim. $4 | \\overline{a8}$ ⟺ $\\overline{a8}/4$ tam. $08, 18, 28, 38, 48, 58, 68, 78, 88, 98$. $4$'e bölünenler: $08(2), 28(7), 48(12), 68(17), 88(22)$ ⟹ $a \\in \\{0, 2, 4, 6, 8\\}$, <strong>5 değer</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5 değer</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">8 ile Bölünebilme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{75ab}$ dört basamaklı sayısı $8$ ile bölünüyor ve $a + b = 6$ ise $\\overline{ab}$'nin alabileceği değer nedir?<br><br>
      <strong>A)</strong> 24 &nbsp; <strong>B)</strong> 42 &nbsp; <strong>C)</strong> 06 &nbsp; <strong>D)</strong> <span class="key">60</span> &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $8$ ile bölünür ⟺ <strong>son üç basamak</strong>tan oluşan sayı $8$'e bölünür. Burada $\\overline{5ab}$ — ama dikkat: $\\overline{75ab}$ verildi, son üç basamak $\\overline{5ab}$.</p>
      <p class="ales-sol-step">$a + b = 6$, $a \\in \\{0,\\dots,6\\}$ ⟹ $(a, b)$: $(0,6),(1,5),(2,4),(3,3),(4,2),(5,1),(6,0)$.</p>
      <p class="ales-sol-step">$\\overline{5ab}$: $506, 515, 524, 533, 542, 551, 560$. $8$'e bölünenler: $504/8 = 63$, $512/8 = 64$, $520/8=65$, $528/8 = 66$ — listede yok. Tekrar bak: <strong>504</strong> yok ($a=0,b=4$ ise toplam 4, gerek 6). $\\overline{5ab}$ değerleri: $506,515,524,533,542,551,560$. $8$'e böl: $506/8 = 63,25$; $515/8 = 64,375$; $524/8 = 65,5$; $533/8 = 66,625$; $542/8 = 67,75$; $551/8 = 68,875$; $560/8 = 70$ ✓.</p>
      <p class="ales-sol-step">Tek çözüm $\\overline{ab} = 60$, sayı $7560$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) ab = 60 (sayı 7560)</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">2 ile Bölünmeyenler</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $100$'den $200$'e kadar (her ikisi dahil) olan tam sayılardan kaç tanesi $2$ ile bölünmez?<br><br>
      <strong>A)</strong> <span class="key">50</span> &nbsp; <strong>B)</strong> 51 &nbsp; <strong>C)</strong> 40 &nbsp; <strong>D)</strong> 47 &nbsp; <strong>E)</strong> 55
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aralıkta $200 - 100 + 1 = 101$ sayı var. Tek sayıların sayısı: $101, 103, \\dots, 199$.</p>
      <p class="ales-sol-step">Aritmetik dizi: terim sayısı $= \\dfrac{199 - 101}{2} + 1 = 50$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 50</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">5 ile Bölünmeyenler</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1$'den $100$'e kadar olan sayılardan kaç tanesi $5$ ile bölünmez?<br><br>
      <strong>A)</strong> 79 &nbsp; <strong>B)</strong> 85 &nbsp; <strong>C)</strong> <span class="key">80</span> &nbsp; <strong>D)</strong> 75 &nbsp; <strong>E)</strong> 78
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümleyen</div>
      <p class="ales-sol-step">$5$ ile bölünenler: $5, 10, \\dots, 100$ ⟹ $100/5 = 20$ tane.</p>
      <p class="ales-sol-step">Bölünmeyenler: $100 - 20 = 80$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 80</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">4 ile Bölünenler — Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $20$ ile $200$ arasında (her ikisi dahil) $4$ ile bölünen kaç tane sayı vardır?<br><br>
      <strong>A)</strong> 47 &nbsp; <strong>B)</strong> 44 &nbsp; <strong>C)</strong> <span class="key">46</span> &nbsp; <strong>D)</strong> 49 &nbsp; <strong>E)</strong> 56
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk: $20 = 4 \\cdot 5$. Son: $200 = 4 \\cdot 50$.</p>
      <p class="ales-sol-step">$4$'ün katları: $4 \\cdot 5, 4 \\cdot 6, \\dots, 4 \\cdot 50$ ⟹ $50 - 5 + 1 = 46$ tane.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 46</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Karma — 2/4/8</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Üç basamaklı kaç sayı vardır ki hem $4$ hem $5$ ile bölünür? (100-999.)<br><br>
      <strong>A)</strong> 42 &nbsp; <strong>B)</strong> 55 &nbsp; <strong>C)</strong> <span class="key">45</span> &nbsp; <strong>D)</strong> 48 &nbsp; <strong>E)</strong> 40
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hem $4$ hem $5$ ile bölünür ⟺ EKOK$(4, 5) = 20$ ile bölünür.</p>
      <p class="ales-sol-step">İlk: $100$ (zaten $20 \\cdot 5$). Son: $980 = 20 \\cdot 49$.</p>
      <p class="ales-sol-step">Sayı: $49 - 5 + 1 = 45$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 45</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — 3 / 9 / 6 ile Bölünebilme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">3, 9, 6 ile Bölünebilme — Rakamlar Toplamı</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">3 ile Bölünebilme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{2x5y}$ dört basamaklı sayısı $3$ ile bölünüyor. $x + y$ kaç değer alabilir?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $3$ ile bölünür ⟺ rakamlar toplamı $3$'ün katı.</p>
      <p class="ales-sol-step">Toplam: $2 + x + 5 + y = 7 + x + y$ ⟹ $3 | (7 + x + y)$ ⟹ $x + y \\equiv 2 \\pmod{3}$.</p>
      <p class="ales-sol-step">$x + y$ olası değerler: $0, 1, \\dots, 18$. $\\equiv 2 \\pmod{3}$: $\\{2, 5, 8, 11, 14, 17\\}$ ⟹ <strong>6 değer</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6 değer</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">9 ile Bölünebilme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{43a2}$ dört basamaklı sayısı $9$ ile bölünüyor. $a$'nın alabileceği değerler nelerdir?<br><br>
      <strong>A)</strong> Sadece 0 &nbsp; <strong>B)</strong> Sadece 9 &nbsp; <strong>C)</strong> <span class="key">0 veya 9</span> &nbsp; <strong>D)</strong> Sadece 4 &nbsp; <strong>E)</strong> Sadece 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $9$ ile bölünür ⟺ rakamlar toplamı $9$'un katı.</p>
      <p class="ales-sol-step">Toplam: $4 + 3 + a + 2 = 9 + a$ ⟹ $9 | (9 + a) \\Rightarrow 9 | a$.</p>
      <p class="ales-sol-step">$a$ rakam ($0$-$9$) ⟹ $a = 0$ veya $a = 9$.</p>
      <p class="ales-sol-step">İki çözüm var ama tek değer aranıyorsa $a = 0$ (en küçük) veya bağlam $a > 0$ ise $a = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) a = 0 veya 9</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">6 ile Bölünebilme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{27ab}$ dört basamaklı sayısı $6$ ile bölünebilen ve $a + b$ tek bir değer alıyorsa $\\overline{ab}$ kaç farklı değer alır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $6 = 2 \\cdot 3$ ile bölünür ⟺ hem $2$ (son basamak çift) hem $3$ (rakam toplamı $3$'ün katı).</p>
      <p class="ales-sol-step">$b$ çift ⟹ $b \\in \\{0, 2, 4, 6, 8\\}$. Toplam: $2 + 7 + a + b = 9 + a + b$ ⟹ $3 | (a + b)$.</p>
      <p class="ales-sol-step">$a + b$ tek değer aldığından (örnek: $a + b = 9$ olsun, $\\overline{ab} = ab$): $b = 0, a = 9$ ⟹ $\\overline{ab} = 90$. $b = 2, a = 7 \\Rightarrow 72$. $b = 4, a = 5 \\Rightarrow 54$. $b = 6, a = 3 \\Rightarrow 36$. $b = 8, a = 1 \\Rightarrow 18$.</p>
      <p class="ales-sol-step">Olası: $\\{18, 36, 54, 72, 90\\}$ — toplamları $9$ ile sabit (tek değer).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5 değer (18, 36, 54, 72, 90)</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">3 ile Bölünenler — Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $100$ ile $300$ arasında (her ikisi dahil) $3$ ile bölünen kaç sayı vardır?<br><br>
      <strong>A)</strong> 68 &nbsp; <strong>B)</strong> 72 &nbsp; <strong>C)</strong> 62 &nbsp; <strong>D)</strong> 65 &nbsp; <strong>E)</strong> <span class="key">67</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk: $102 = 3 \\cdot 34$. Son: $300 = 3 \\cdot 100$.</p>
      <p class="ales-sol-step">Sayı: $100 - 34 + 1 = 67$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 67</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">9 ile Bölünenler — Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1000$ ile $2000$ arasında $9$ ile bölünen kaç sayı vardır?<br><br>
      <strong>A)</strong> 126 &nbsp; <strong>B)</strong> <span class="key">111</span> &nbsp; <strong>C)</strong> 110 &nbsp; <strong>D)</strong> 116 &nbsp; <strong>E)</strong> 112
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk: $1000 / 9 = 111,1$ ⟹ $9 \\cdot 112 = 1008$. Son: $2000 / 9 = 222,2$ ⟹ $9 \\cdot 222 = 1998$.</p>
      <p class="ales-sol-step">Sayı: $222 - 112 + 1 = 111$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 111</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">3 veya 5 — Birleşim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1$'den $30$'a kadar (her ikisi dahil) $3$ veya $5$ ile bölünen kaç sayı vardır?<br><br>
      <strong>A)</strong> <span class="key">14</span> &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> 24 &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçerme-Dışlama</div>
      <p class="ales-sol-step">$|A \\cup B| = |A| + |B| - |A \\cap B|$.</p>
      <p class="ales-sol-step">$3$ ile: $30/3 = 10$. $5$ ile: $30/5 = 6$. Hem $3$ hem $5$: $\\text{EKOK} = 15 \\Rightarrow 30/15 = 2$.</p>
      <p class="ales-sol-step">Toplam: $10 + 6 - 2 = 14$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 14</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Kalan Bul</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{34a5}$ sayısı $9$ ile bölündüğünde kalan $5$'tir. $a$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Genelleştirilmiş kural:</strong> Sayı $9$'a bölündüğünde kalan = rakamlar toplamı $9$'a bölündüğünde kalan.</p>
      <p class="ales-sol-step">Toplam: $3 + 4 + a + 5 = 12 + a$ ⟹ $(12 + a) \\bmod 9 = 5$.</p>
      <p class="ales-sol-step">$12 + a \\equiv 5 \\pmod{9}$ ⟹ $a \\equiv -7 \\equiv 2 \\pmod{9}$. $a$ rakam ($0$-$9$) ⟹ $a = 2$.</p>
      <p class="ales-sol-step">Doğrula: $3425 / 9 = 380$ kalan $5$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) a = 2</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — 11 ile Bölünme + Kombine EKOK
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">11 ile Bölünme + "Hem a Hem b" Tipi (EKOK)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">11 ile Bölünebilme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\overline{4a35}$ dört basamaklı sayısı $11$ ile bölünüyor. $a$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $11$ ile bölünür ⟺ rakamlar arasında <em>alterne işaretli toplam</em> $11$'in katı (sıfır dahil).</p>
      <p class="ales-sol-step">Sağdan başla: $5 - 3 + a - 4 = a - 2$. $11 | (a - 2)$ ⟹ $a = 2$ (rakam aralığında tek çözüm).</p>
      <p class="ales-sol-step">Doğrula: $4235 / 11 = 385$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) a = 2</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">11 ile — Üç Basamak</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Üç basamaklı $\\overline{abc}$ sayısının $11$ ile bölünmesinin koşulu nedir?<br><br>
      <strong>A)</strong> $11 \\mid (a + b + c)$ &nbsp; <strong>B)</strong> $11 \\mid (a + b - c)$ &nbsp; <strong>C)</strong> <span class="key">$11 \\mid (a - b + c)$</span> &nbsp; <strong>D)</strong> $11 \\mid abc$ &nbsp; <strong>E)</strong> $11 \\mid (a \\cdot c - b)$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sağdan alterne: $c - b + a$. $11 | (a - b + c)$.</p>
      <p class="ales-sol-step">Yani $a + c - b$ değeri $0$ veya $11$ veya $-11$ olmalı (sayının basamak sayıları sınırlı).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 11 | (a − b + c)</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Hem 3 Hem 4</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1$ ile $300$ arasında hem $3$ hem $4$ ile bölünen kaç sayı vardır?<br><br>
      <strong>A)</strong> 35 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> 20 &nbsp; <strong>D)</strong> <span class="key">25</span> &nbsp; <strong>E)</strong> 27
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hem $3$ hem $4$ ⟺ EKOK$(3, 4) = 12$ ile bölünür.</p>
      <p class="ales-sol-step">$\\lfloor 300/12 \\rfloor = 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 25</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Hem 6 Hem 8</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $200$ ile $500$ arasında hem $6$ hem $8$ ile bölünen kaç sayı vardır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> 17 &nbsp; <strong>D)</strong> <span class="key">12</span> &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EKOK$(6, 8) = 24$. ($6 = 2 \\cdot 3$, $8 = 2^{3}$ ⟹ EKOK $= 2^{3} \\cdot 3 = 24$.)</p>
      <p class="ales-sol-step">$200/24 \\approx 8,3$ ⟹ ilk $24 \\cdot 9 = 216$. $500/24 \\approx 20,8$ ⟹ son $24 \\cdot 20 = 480$.</p>
      <p class="ales-sol-step">Sayı: $20 - 9 + 1 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 12</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">3, 4 ve 5</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1$ ile $1000$ arasında $3$, $4$ ve $5$ ile bölünen kaç sayı vardır?<br><br>
      <strong>A)</strong> <span class="key">16</span> &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> 21 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 19
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EKOK$(3, 4, 5) = 60$ ($3, 4, 5$ aralarında asal değil ama $4$ ile $3$ ve $5$ ile $3, 4$ asal).</p>
      <p class="ales-sol-step">$\\lfloor 1000/60 \\rfloor = 16$ (çünkü $60 \\cdot 16 = 960$, $60 \\cdot 17 = 1020$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 16</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Karma — Asal Çarpan</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Üç basamaklı kaç sayı, $9$ ile bölündüğünde kalanı $4$ verir?<br><br>
      <strong>A)</strong> <span class="key">100</span> &nbsp; <strong>B)</strong> 98 &nbsp; <strong>C)</strong> 99 &nbsp; <strong>D)</strong> 110 &nbsp; <strong>E)</strong> 90
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk: $100 / 9 = 11,1$ ⟹ $9 \\cdot 11 = 99$, $99 + 4 = 103$ ✓.</p>
      <p class="ales-sol-step">Son: $999 / 9 = 111$, $9 \\cdot 110 = 990$, $990 + 4 = 994$ ✓.</p>
      <p class="ales-sol-step">Aritmetik dizi: $103, 112, 121, \\dots, 994$. Terim sayısı $= \\dfrac{994 - 103}{9} + 1 = 100$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 100</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Üç Bölen</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $1$ ile $200$ arasında $2$, $3$ veya $5$ ile bölünmeyen kaç sayı vardır?<br><br>
      <strong>A)</strong> 44 &nbsp; <strong>B)</strong> 49 &nbsp; <strong>C)</strong> <span class="key">54</span> &nbsp; <strong>D)</strong> 55 &nbsp; <strong>E)</strong> 56
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçerme-Dışlama</div>
      <p class="ales-sol-step">$|A| = 100$ ($2$), $|B| = 66$ ($3$, $\\lfloor 200/3 \\rfloor$), $|C| = 40$ ($5$).</p>
      <p class="ales-sol-step">$|A \\cap B| = \\lfloor 200/6 \\rfloor = 33$. $|A \\cap C| = \\lfloor 200/10 \\rfloor = 20$. $|B \\cap C| = \\lfloor 200/15 \\rfloor = 13$.</p>
      <p class="ales-sol-step">$|A \\cap B \\cap C| = \\lfloor 200/30 \\rfloor = 6$.</p>
      <p class="ales-sol-step">$|A \\cup B \\cup C| = 100 + 66 + 40 - 33 - 20 - 13 + 6 = 146$.</p>
      <p class="ales-sol-step">Bölünmeyen: $200 - 146 = 54$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 54</span></div>
    </div>
  </div>
</section>
`
};
