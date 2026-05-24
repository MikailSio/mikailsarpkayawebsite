window.ALES_LESSON = {
n: 28,
title: "Mutlak Değerli Denklem ve Eşitsizlik",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>mutlak değer</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. <strong>Refleks geliştir:</strong> $|A| = B$ → A=B veya A=−B; $|A| < B$ → sıkışma (−B&lt;A&lt;B); $|A| > B$ → kaçış (A&lt;−B veya A&gt;B). Bu üç şabla tüm soruları biçeceksin.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — |A| = B Denklemi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">|A| = B → A = B veya A = −B</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">En Basit</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x| = 5$ denkleminin kökleri toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x = 5$ veya $x = -5$.</p>
      <p class="ales-sol-step">Toplam: $5 + (-5) = 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Lineer İçi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|2x - 4| = 6$ denkleminin köklerinin çarpımı kaçtır?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $-1$ &nbsp; <strong>C)</strong> $4$ &nbsp; <strong>D)</strong> <span class="key">$-5$</span> &nbsp; <strong>E)</strong> $-6$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2x - 4 = 6 \\Rightarrow x = 5$ veya $2x - 4 = -6 \\Rightarrow x = -1$.</p>
      <p class="ales-sol-step">Çarpım: $5 \\cdot (-1) = -5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $-5$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Negatif Sağ Taraf</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x + 7| = -3$ denkleminin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $\\{-4, -10\\}$ &nbsp; <strong>B)</strong> $\\{-3\\}$ &nbsp; <strong>C)</strong> <span class="key">$\\emptyset$</span> &nbsp; <strong>D)</strong> $\\{4, 10\\}$ &nbsp; <strong>E)</strong> $\\mathbb{R}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Mutlak değer asla negatif olamaz: $|A| \\geq 0$.</p>
      <p class="ales-sol-step">$|x + 7| = -3$ imkansız ⟹ <strong>çözüm yok</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\emptyset$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Sıfır Eşitlik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|3x - 9| = 0$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|A| = 0 \\Leftrightarrow A = 0$. Tek çözüm.</p>
      <p class="ales-sol-step">$3x - 9 = 0 \\Rightarrow x = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">İki Mutlak Değer</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 1| = |x + 3|$ denkleminin çözümü nedir?<br><br>
      <strong>A)</strong> $1$ &nbsp; <strong>B)</strong> $3$ &nbsp; <strong>C)</strong> $-3$ &nbsp; <strong>D)</strong> <span class="key">$-1$</span> &nbsp; <strong>E)</strong> Çözüm yok
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Durum</div>
      <p class="ales-sol-step"><strong>Durum 1:</strong> $x - 1 = x + 3 \\Rightarrow -1 = 3$ (çelişki) ⟹ çözüm yok.</p>
      <p class="ales-sol-step"><strong>Durum 2:</strong> $x - 1 = -(x + 3) \\Rightarrow x - 1 = -x - 3 \\Rightarrow 2x = -2 \\Rightarrow x = -1$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Karesini Al</div>
      <p class="ales-sol-step">$(x - 1)^2 = (x + 3)^2 \\Rightarrow -2x + 1 = 6x + 9 \\Rightarrow 8x = -8 \\Rightarrow x = -1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $-1$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Karma Cebir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 5| = 2x - 1$ denkleminin reel kökü kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Önce ön koşul:</strong> $2x - 1 \\geq 0 \\Rightarrow x \\geq 1/2$.</p>
      <p class="ales-sol-step"><strong>Durum 1:</strong> $x - 5 = 2x - 1 \\Rightarrow x = -4$ (ön koşulu sağlamaz).</p>
      <p class="ales-sol-step"><strong>Durum 2:</strong> $x - 5 = -(2x - 1) \\Rightarrow x - 5 = -2x + 1 \\Rightarrow 3x = 6 \\Rightarrow x = 2$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Toplam İki Mutlak</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $|x - 2| + |x - 5| = 3$ denkleminin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> <span class="key">2 ≤ x ≤ 5</span> &nbsp; <strong>B)</strong> 3 ≤ x ≤ 5 &nbsp; <strong>C)</strong> 5 ≤ x ≤ 5 &nbsp; <strong>D)</strong> 6 ≤ x ≤ 5 &nbsp; <strong>E)</strong> 7 ≤ x ≤ 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geometrik Yorum</div>
      <p class="ales-sol-step">Sol taraf: $x$ noktasının $2$ ve $5$'ten uzaklıkları toplamı.</p>
      <p class="ales-sol-step">$2$ ile $5$ arası uzaklık $3$. Eğer $x$ bu aralıkta ise toplam tam $3$ olur.</p>
      <p class="ales-sol-step">$2 \\leq x \\leq 5$ tüm değerler çözüm.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Bölgeli Çözüm</div>
      <p class="ales-sol-step">$x < 2$: $-(x-2) - (x-5) = -2x + 7 = 3 \\Rightarrow x = 2$ (sınır, dahil).</p>
      <p class="ales-sol-step">$2 \\leq x \\leq 5$: $(x-2) + (5-x) = 3$ ✓ her $x$ çözüm.</p>
      <p class="ales-sol-step">$x > 5$: $(x-2) + (x-5) = 2x - 7 = 3 \\Rightarrow x = 5$ (sınır, dahil).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 2 ≤ x ≤ 5</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — |A| < B (Sıkışma)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">|A| &lt; B Sıkışma (−B &lt; A &lt; B)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">En Basit Sıkışma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x| < 4$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $x < 4$ &nbsp; <strong>B)</strong> $x > -4$ &nbsp; <strong>C)</strong> <span class="key">$-4 < x < 4$</span> &nbsp; <strong>D)</strong> $x < -4$ veya $x > 4$ &nbsp; <strong>E)</strong> $-4 \\leq x \\leq 4$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|A| < B$ ⟹ $-B < A < B$.</p>
      <p class="ales-sol-step">$-4 < x < 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-4 < x < 4$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Lineer İçi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|2x - 3| \\leq 5$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $-5 \\leq x \\leq 5$ &nbsp; <strong>B)</strong> <span class="key">$-1 \\leq x \\leq 4$</span> &nbsp; <strong>C)</strong> $1 \\leq x \\leq 4$ &nbsp; <strong>D)</strong> $-1 < x < 4$ &nbsp; <strong>E)</strong> $-4 \\leq x \\leq 1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-5 \\leq 2x - 3 \\leq 5$.</p>
      <p class="ales-sol-step">$3$ ekle: $-2 \\leq 2x \\leq 8$. $2$ ile böl: $-1 \\leq x \\leq 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-1 \\leq x \\leq 4$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Tam Sayı Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 7| < 4$ eşitsizliğinin tam sayı çözüm sayısı kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">7</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-4 < x - 7 < 4 \\Rightarrow 3 < x < 11$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{4, 5, 6, 7, 8, 9, 10\\}$ ⟹ $7$ adet.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Negatif Sağ</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x + 5| < -2$ eşitsizliğinin çözümü nedir?<br><br>
      <strong>A)</strong> $-7 < x < -3$ &nbsp; <strong>B)</strong> $x < -7$ &nbsp; <strong>C)</strong> <span class="key">$\\emptyset$</span> &nbsp; <strong>D)</strong> $\\mathbb{R}$ &nbsp; <strong>E)</strong> $x = -5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|A| \\geq 0$ her zaman. $|A| < -2$ imkansız.</p>
      <p class="ales-sol-step">Çözüm yok.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\emptyset$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Bölünmüş Sıkışma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\left|\\dfrac{x - 1}{2}\\right| \\leq 3$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $-3 \\leq x \\leq 3$ &nbsp; <strong>B)</strong> $-6 \\leq x \\leq 6$ &nbsp; <strong>C)</strong> <span class="key">$-5 \\leq x \\leq 7$</span> &nbsp; <strong>D)</strong> $-7 \\leq x \\leq 5$ &nbsp; <strong>E)</strong> $-5 < x < 7$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-3 \\leq \\dfrac{x - 1}{2} \\leq 3$. $2$ ile çarp: $-6 \\leq x - 1 \\leq 6$.</p>
      <p class="ales-sol-step">$1$ ekle: $-5 \\leq x \\leq 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-5 \\leq x \\leq 7$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Üç Tarafa Eklemek</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|3 - x| < 1$ ise $x$'in alabileceği değer aralığı nedir?<br><br>
      <strong>A)</strong> 1 &lt; x &lt; 4 &nbsp; <strong>B)</strong> <span class="key">2 &lt; x &lt; 4</span> &nbsp; <strong>C)</strong> 5 &lt; x &lt; 4 &nbsp; <strong>D)</strong> 6 &lt; x &lt; 4 &nbsp; <strong>E)</strong> 7 &lt; x &lt; 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-1 < 3 - x < 1$. $-3$ ekle: $-4 < -x < -2$.</p>
      <p class="ales-sol-step"><strong>$-1$ ile çarp, yön değişir:</strong> $4 > x > 2 \\Rightarrow 2 < x < 4$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — $|3 - x| = |x - 3|$</div>
      <p class="ales-sol-step">$|x - 3| < 1 \\Rightarrow -1 < x - 3 < 1 \\Rightarrow 2 < x < 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 &lt; x &lt; 4</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — En Büyük Tam Sayı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $|2x + 1| \\leq 9$ eşitsizliğini sağlayan tam sayı $x$'lerin toplamı kaçtır?<br><br>
      <strong>A)</strong> $-10$ &nbsp; <strong>B)</strong> $-9$ &nbsp; <strong>C)</strong> <span class="key">$-5$</span> &nbsp; <strong>D)</strong> $0$ &nbsp; <strong>E)</strong> $5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-9 \\leq 2x + 1 \\leq 9 \\Rightarrow -10 \\leq 2x \\leq 8 \\Rightarrow -5 \\leq x \\leq 4$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{-5, -4, \\dots, 3, 4\\}$. Toplam = ortancanın terim sayısıyla çarpımı.</p>
      <p class="ales-sol-step">Terim sayısı $4 - (-5) + 1 = 10$. Toplam $= \\dfrac{(-5 + 4) \\cdot 10}{2} = -5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-5$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — |A| > B (Kaçış)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">|A| &gt; B Kaçış (A &lt; −B veya A &gt; B)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">En Basit Kaçış</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $|x| > 6$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $-6 < x < 6$ &nbsp; <strong>B)</strong> $x > 6$ &nbsp; <strong>C)</strong> $x < -6$ &nbsp; <strong>D)</strong> <span class="key">$x < -6$ veya $x > 6$</span> &nbsp; <strong>E)</strong> $x \\neq 6$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|A| > B$ ⟹ $A < -B$ veya $A > B$.</p>
      <p class="ales-sol-step">$x < -6$ veya $x > 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x < -6$ veya $x > 6$</span></div>
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
      $|x - 4| \\geq 3$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $1 \\leq x \\leq 7$ &nbsp; <strong>B)</strong> $x \\geq 7$ &nbsp; <strong>C)</strong> <span class="key">$x \\leq 1$ veya $x \\geq 7$</span> &nbsp; <strong>D)</strong> $x < 1$ veya $x > 7$ &nbsp; <strong>E)</strong> $-3 \\leq x \\leq 3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x - 4 \\leq -3$ veya $x - 4 \\geq 3$.</p>
      <p class="ales-sol-step">$x \\leq 1$ veya $x \\geq 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x \\leq 1$ veya $x \\geq 7$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Negatif Sağ Taraf</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|2x + 1| > -3$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $\\emptyset$ &nbsp; <strong>B)</strong> $x > -1/2$ &nbsp; <strong>C)</strong> $x < -2$ veya $x > 1$ &nbsp; <strong>D)</strong> $-2 < x < 1$ &nbsp; <strong>E)</strong> <span class="key">$x \\in \\mathbb{R}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|A| \\geq 0$ her zaman. $|A| > -3$ her $x$ için doğru.</p>
      <p class="ales-sol-step">Çözüm: tüm reel sayılar.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $x \\in \\mathbb{R}$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Sıfırdan Büyük</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 5| > 0$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $x > 5$ &nbsp; <strong>B)</strong> $\\mathbb{R}$ &nbsp; <strong>C)</strong> $\\emptyset$ &nbsp; <strong>D)</strong> <span class="key">$x \\neq 5$</span> &nbsp; <strong>E)</strong> $x < 5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|A| > 0 \\Leftrightarrow A \\neq 0$.</p>
      <p class="ales-sol-step">$x - 5 \\neq 0 \\Rightarrow x \\neq 5$.</p>
      <p class="ales-sol-step">Çözüm: $\\mathbb{R} \\setminus \\{5\\}$ (5 hariç tüm reel).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x \\neq 5$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İki Mutlak Eşitsizlik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $|x - 1| > |x - 4|$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $x < 5/2$ &nbsp; <strong>B)</strong> $x > 4$ &nbsp; <strong>C)</strong> <span class="key">$x > 5/2$</span> &nbsp; <strong>D)</strong> $1 < x < 4$ &nbsp; <strong>E)</strong> $x < 1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Karesini Al</div>
      <p class="ales-sol-step">İki taraf da pozitif (mutlak değer); kareleri karşılaştırılabilir.</p>
      <p class="ales-sol-step">$(x - 1)^2 > (x - 4)^2 \\Rightarrow x^2 - 2x + 1 > x^2 - 8x + 16$.</p>
      <p class="ales-sol-step">$6x > 15 \\Rightarrow x > 5/2$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Geometrik</div>
      <p class="ales-sol-step">$x$'in $1$'e olan uzaklığı $4$'e olan uzaklığından büyük ⟺ $x$, $4$'e daha yakın ⟺ $x > (1+4)/2 = 5/2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x > 5/2$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Karma Sınır</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $1 < |x - 3| \\leq 4$ eşitsizliğini sağlayan tam sayı $x$'lerin sayısı kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Şart</div>
      <p class="ales-sol-step"><strong>Şart 1:</strong> $|x - 3| > 1 \\Rightarrow x < 2$ veya $x > 4$.</p>
      <p class="ales-sol-step"><strong>Şart 2:</strong> $|x - 3| \\leq 4 \\Rightarrow -1 \\leq x \\leq 7$.</p>
      <p class="ales-sol-step"><strong>Kesişim:</strong> $-1 \\leq x < 2$ veya $4 < x \\leq 7$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{-1, 0, 1\\} \\cup \\{5, 6, 7\\}$ ⟹ $6$ adet.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">İki Mutlak Denklemi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $|x - 2| + |x + 4| = 10$ denkleminin köklerinin toplamı kaçtır?<br><br>
      <strong>A)</strong> $-6$ &nbsp; <strong>B)</strong> $4$ &nbsp; <strong>C)</strong> $2$ &nbsp; <strong>D)</strong> <span class="key">$-2$</span> &nbsp; <strong>E)</strong> $10$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Bölgeli</div>
      <p class="ales-sol-step">Kritik: $x = -4, x = 2$. Üç bölge.</p>
      <p class="ales-sol-step"><strong>$x < -4$:</strong> $-(x-2) - (x+4) = -2x - 2 = 10 \\Rightarrow x = -6$ ✓ ($-6 < -4$).</p>
      <p class="ales-sol-step"><strong>$-4 \\leq x \\leq 2$:</strong> $-(x-2) + (x+4) = 6 \\neq 10$ ⟹ çözüm yok.</p>
      <p class="ales-sol-step"><strong>$x > 2$:</strong> $(x-2) + (x+4) = 2x + 2 = 10 \\Rightarrow x = 4$ ✓.</p>
      <p class="ales-sol-step">Kökler: $-6$ ve $4$. Toplam: $-2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $-2$</span></div>
    </div>
  </div>
</section>
`
};
