window.ALES_LESSON = {
n: 18,
title: "Rasyonel Sayılarla İşlemler (Kesirler)",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>rasyonel sayılar (kesirler)</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Önce kendi başına çöz, sonra çözüme bak; teknikler problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Kesir Toplama–Çıkarma (Ortak Payda)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Kesir Toplama–Çıkarma (Ortak Payda)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Ortak Payda</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{2} + \\dfrac{1}{3}$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{2}{5}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{6}$ &nbsp; <strong>C)</strong> $\\dfrac{1}{5}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{5}{6}$</span> &nbsp; <strong>E)</strong> $\\dfrac{3}{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Paydaların EKOK'u: $\\text{ekok}(2,3) = 6$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{2} = \\dfrac{3}{6}, \\;\\; \\dfrac{1}{3} = \\dfrac{2}{6}$.</p>
      <p class="ales-sol-step">Toplam: $\\dfrac{3}{6} + \\dfrac{2}{6} = \\dfrac{5}{6}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{5}{6}$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Üç Kesir Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{2} + \\dfrac{1}{4} + \\dfrac{1}{8}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{14}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{8}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{7}{8}$</span> &nbsp; <strong>D)</strong> $1$ &nbsp; <strong>E)</strong> $\\dfrac{5}{8}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\text{ekok}(2,4,8) = 8$. $\\dfrac{1}{2} = \\dfrac{4}{8}, \\;\\; \\dfrac{1}{4} = \\dfrac{2}{8}, \\;\\; \\dfrac{1}{8} = \\dfrac{1}{8}$.</p>
      <p class="ales-sol-step">Toplam: $\\dfrac{4 + 2 + 1}{8} = \\dfrac{7}{8}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{7}{8}$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Kesir Çıkarma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{5}{6} - \\dfrac{2}{9}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{3}$ &nbsp; <strong>B)</strong> $\\dfrac{3}{15}$ &nbsp; <strong>C)</strong> $\\dfrac{7}{18}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{11}{18}$</span> &nbsp; <strong>E)</strong> $\\dfrac{13}{18}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\text{ekok}(6,9) = 18$. $\\dfrac{5}{6} = \\dfrac{15}{18}, \\;\\; \\dfrac{2}{9} = \\dfrac{4}{18}$.</p>
      <p class="ales-sol-step">$\\dfrac{15}{18} - \\dfrac{4}{18} = \\dfrac{11}{18}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{11}{18}$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Tam Sayılı Kesir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2\\dfrac{1}{3} + 1\\dfrac{3}{4}$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> $3\\dfrac{4}{7}$ &nbsp; <strong>B)</strong> $3\\dfrac{1}{12}$ &nbsp; <strong>C)</strong> <span class="key">$4\\dfrac{1}{12}$</span> &nbsp; <strong>D)</strong> $4\\dfrac{1}{7}$ &nbsp; <strong>E)</strong> $4\\dfrac{1}{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Bileşik Forma Çevirip Topla</div>
      <p class="ales-sol-step">$2\\dfrac{1}{3} = \\dfrac{7}{3}, \\;\\; 1\\dfrac{3}{4} = \\dfrac{7}{4}$.</p>
      <p class="ales-sol-step">$\\text{ekok}(3,4) = 12$. $\\dfrac{7}{3} = \\dfrac{28}{12}, \\;\\; \\dfrac{7}{4} = \\dfrac{21}{12}$.</p>
      <p class="ales-sol-step">Toplam: $\\dfrac{49}{12} = 4\\dfrac{1}{12}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Tam Kısımları Ayrı Topla</div>
      <p class="ales-sol-step">Tamlar: $2 + 1 = 3$. Kesirler: $\\dfrac{1}{3} + \\dfrac{3}{4} = \\dfrac{4 + 9}{12} = \\dfrac{13}{12} = 1\\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">$3 + 1\\dfrac{1}{12} = 4\\dfrac{1}{12}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $4\\dfrac{1}{12}$</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Kesir Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = \\dfrac{3}{5}, \\; b = \\dfrac{5}{8}, \\; c = \\dfrac{7}{12}$ kesirlerini küçükten büyüğe sıralayın.<br><br>
      <strong>A)</strong> $a < b < c$ &nbsp; <strong>B)</strong> <span class="key">$c < a < b$</span> &nbsp; <strong>C)</strong> $a < c < b$ &nbsp; <strong>D)</strong> $b < a < c$ &nbsp; <strong>E)</strong> $c < b < a$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Payda</div>
      <p class="ales-sol-step">$\\text{ekok}(5,8,12) = 120$.</p>
      <p class="ales-sol-step">$a = \\dfrac{3 \\cdot 24}{120} = \\dfrac{72}{120}, \\;\\; b = \\dfrac{5 \\cdot 15}{120} = \\dfrac{75}{120}, \\;\\; c = \\dfrac{7 \\cdot 10}{120} = \\dfrac{70}{120}$.</p>
      <p class="ales-sol-step">Sıralama: $70 < 72 < 75 \\Rightarrow c < a < b$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Çapraz Çarpım</div>
      <p class="ales-sol-step">$\\dfrac{3}{5}$ vs $\\dfrac{5}{8}$: $3 \\cdot 8 = 24, \\; 5 \\cdot 5 = 25$ ⟹ $a < b$. $\\dfrac{3}{5}$ vs $\\dfrac{7}{12}$: $3 \\cdot 12 = 36, \\; 5 \\cdot 7 = 35$ ⟹ $a > c$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $c < a < b$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Karışık İşlem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{3}{4} + \\dfrac{2}{3} - \\dfrac{5}{6}$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{5}{12}$ &nbsp; <strong>B)</strong> $\\dfrac{17}{12}$ &nbsp; <strong>C)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{7}{12}$</span> &nbsp; <strong>E)</strong> $\\dfrac{11}{12}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\text{ekok}(4,3,6) = 12$. $\\dfrac{3}{4} = \\dfrac{9}{12}, \\;\\; \\dfrac{2}{3} = \\dfrac{8}{12}, \\;\\; \\dfrac{5}{6} = \\dfrac{10}{12}$.</p>
      <p class="ales-sol-step">$\\dfrac{9 + 8 - 10}{12} = \\dfrac{7}{12}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{7}{12}$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Bilinmeyen Kesir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{3}{8} + x = \\dfrac{5}{6}$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{2}{14}$ &nbsp; <strong>B)</strong> $\\dfrac{29}{24}$ &nbsp; <strong>C)</strong> $\\dfrac{7}{24}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{11}{24}$</span> &nbsp; <strong>E)</strong> $\\dfrac{1}{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x = \\dfrac{5}{6} - \\dfrac{3}{8}$. $\\text{ekok}(6,8) = 24$.</p>
      <p class="ales-sol-step">$\\dfrac{5}{6} = \\dfrac{20}{24}, \\;\\; \\dfrac{3}{8} = \\dfrac{9}{24}$.</p>
      <p class="ales-sol-step">$x = \\dfrac{20 - 9}{24} = \\dfrac{11}{24}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{11}{24}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Kesir Çarpma–Bölme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Kesir Çarpma–Bölme</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Çarpma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2}{3} \\cdot \\dfrac{9}{10}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{2}{5}$ &nbsp; <strong>B)</strong> $\\dfrac{11}{13}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{3}{5}$</span> &nbsp; <strong>D)</strong> $\\dfrac{18}{13}$ &nbsp; <strong>E)</strong> $\\dfrac{20}{27}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çapraz Sadeleştirme</div>
      <p class="ales-sol-step">$\\dfrac{2}{3} \\cdot \\dfrac{9}{10}$: $2$ ile $10 \\to 1, 5$; $9$ ile $3 \\to 3, 1$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{1} \\cdot \\dfrac{3}{5} = \\dfrac{3}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{3}{5}$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Bölme — Ters Çevir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{4}{5} \\div \\dfrac{2}{3}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{8}{15}$ &nbsp; <strong>B)</strong> $\\dfrac{15}{6}$ &nbsp; <strong>C)</strong> $\\dfrac{2}{5}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{6}{5}$</span> &nbsp; <strong>E)</strong> $\\dfrac{5}{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bölme = ikinciyi ters çevirip çarpma: $\\dfrac{4}{5} \\cdot \\dfrac{3}{2}$.</p>
      <p class="ales-sol-step">$4$ ile $2 \\to 2, 1$. $\\dfrac{2 \\cdot 3}{5 \\cdot 1} = \\dfrac{6}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{6}{5}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Tam Sayılı Çarpma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $1\\dfrac{2}{3} \\cdot 2\\dfrac{1}{4}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{2}{12}$ &nbsp; <strong>B)</strong> $\\dfrac{5}{4}$ &nbsp; <strong>C)</strong> $\\dfrac{45}{4}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{15}{4}$</span> &nbsp; <strong>E)</strong> $\\dfrac{20}{7}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tam sayılıyı bileşik kesre çevir: $1\\dfrac{2}{3} = \\dfrac{5}{3}, \\;\\; 2\\dfrac{1}{4} = \\dfrac{9}{4}$.</p>
      <p class="ales-sol-step">$\\dfrac{5}{3} \\cdot \\dfrac{9}{4}$. $9$ ile $3 \\to 3, 1$. $\\dfrac{5 \\cdot 3}{1 \\cdot 4} = \\dfrac{15}{4} = 3\\dfrac{3}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{15}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Zincirleme Çarpma–Bölme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{3}{8} \\cdot \\dfrac{4}{9} \\div \\dfrac{1}{6}$ kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bölmeyi çarpmaya çevir: $\\dfrac{3}{8} \\cdot \\dfrac{4}{9} \\cdot \\dfrac{6}{1}$.</p>
      <p class="ales-sol-step">Sadeleştir: $3$ ile $9 \\to 1, 3$; $4$ ile $8 \\to 1, 2$. Şimdi: $\\dfrac{1}{2} \\cdot \\dfrac{1}{3} \\cdot 6 = \\dfrac{6}{6} = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Sözel Problem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir tankın $\\dfrac{3}{4}$'ü doludur. Tankın <strong>başlangıçtaki dolu kısmının</strong> $\\dfrac{2}{3}$'ünü boşalttığımızda geriye ne kadar dolu kalır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{4}$</span> &nbsp; <strong>D)</strong> $\\dfrac{1}{12}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Başlangıçta dolu: $\\dfrac{3}{4}$. Boşaltılan: $\\dfrac{2}{3} \\cdot \\dfrac{3}{4} = \\dfrac{2 \\cdot 3}{3 \\cdot 4} = \\dfrac{6}{12} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">Kalan dolu kısım: $\\dfrac{3}{4} - \\dfrac{1}{2} = \\dfrac{3}{4} - \\dfrac{2}{4} = \\dfrac{1}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Kesirli Bölme — Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $6$ litre meyve suyu, $\\dfrac{3}{4}$ litrelik şişelere kaç şişede sığar?<br><br>
      <strong>A)</strong> <span class="key">8</span> &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 14 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Şişe sayısı $= 6 \\div \\dfrac{3}{4} = 6 \\cdot \\dfrac{4}{3} = \\dfrac{24}{3} = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 8</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\left( \\dfrac{2}{3} + \\dfrac{1}{6} \\right) \\div \\left( \\dfrac{5}{6} - \\dfrac{1}{3} \\right)$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{5}$ &nbsp; <strong>B)</strong> $\\dfrac{5}{12}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{5}{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{5}{6}$ &nbsp; <strong>E)</strong> $\\dfrac{10}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $\\dfrac{2}{3} + \\dfrac{1}{6} = \\dfrac{4}{6} + \\dfrac{1}{6} = \\dfrac{5}{6}$.</p>
      <p class="ales-sol-step">Payda: $\\dfrac{5}{6} - \\dfrac{1}{3} = \\dfrac{5}{6} - \\dfrac{2}{6} = \\dfrac{3}{6} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{5}{6} \\div \\dfrac{1}{2} = \\dfrac{5}{6} \\cdot 2 = \\dfrac{10}{6} = \\dfrac{5}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{5}{3}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Bileşik ve Karmaşık Kesirler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Bileşik ve Karmaşık Kesirler</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">a/(b/c) Tipi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{4}{\\;\\dfrac{2}{3}\\;}$ kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 12 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> <span class="key">6</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ana çizginin üstündeki, altındakine bölünür: $4 \\div \\dfrac{2}{3} = 4 \\cdot \\dfrac{3}{2} = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 6</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Pay/Payda Kesirli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\;\\dfrac{3}{4}\\;}{\\;\\dfrac{9}{8}\\;}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{27}{32}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{2}{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{32}{27}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{3}{4} \\div \\dfrac{9}{8} = \\dfrac{3}{4} \\cdot \\dfrac{8}{9}$.</p>
      <p class="ales-sol-step">Sadeleştir: $3$ ile $9 \\to 1, 3$; $8$ ile $4 \\to 2, 1$. $\\dfrac{1 \\cdot 2}{1 \\cdot 3} = \\dfrac{2}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{2}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Karmaşık — İşlem İçeren</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1 + \\dfrac{1}{2}}{1 - \\dfrac{1}{4}}$ kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $1 + \\dfrac{1}{2} = \\dfrac{3}{2}$. &nbsp; Payda: $1 - \\dfrac{1}{4} = \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">$\\dfrac{3}{2} \\div \\dfrac{3}{4} = \\dfrac{3}{2} \\cdot \\dfrac{4}{3} = \\dfrac{12}{6} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İç İçe Kesir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1 + \\dfrac{1}{1 + \\dfrac{1}{2}}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{2}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{5}{3}$</span> &nbsp; <strong>C)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>D)</strong> $\\dfrac{4}{3}$ &nbsp; <strong>E)</strong> $\\dfrac{7}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçten Dışa</div>
      <p class="ales-sol-step">En içteki: $1 + \\dfrac{1}{2} = \\dfrac{3}{2}$.</p>
      <p class="ales-sol-step">Bir üst basamak: $\\dfrac{1}{\\;3/2\\;} = \\dfrac{2}{3}$.</p>
      <p class="ales-sol-step">En dış: $1 + \\dfrac{2}{3} = \\dfrac{5}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{5}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Karmaşık + Çarpma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\;\\dfrac{2}{3} + \\dfrac{1}{6}\\;}{\\;\\dfrac{1}{2} \\cdot \\dfrac{5}{3}\\;}$ kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $\\dfrac{2}{3} + \\dfrac{1}{6} = \\dfrac{4}{6} + \\dfrac{1}{6} = \\dfrac{5}{6}$.</p>
      <p class="ales-sol-step">Payda: $\\dfrac{1}{2} \\cdot \\dfrac{5}{3} = \\dfrac{5}{6}$.</p>
      <p class="ales-sol-step">$\\dfrac{5/6}{5/6} = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Devam Eden Kesir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $2 + \\dfrac{1}{3 + \\dfrac{1}{4}}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{13}{30}$ &nbsp; <strong>B)</strong> $\\dfrac{26}{13}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{30}{13}$</span> &nbsp; <strong>D)</strong> $\\dfrac{7}{3}$ &nbsp; <strong>E)</strong> $\\dfrac{9}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İçteki: $3 + \\dfrac{1}{4} = \\dfrac{13}{4}$.</p>
      <p class="ales-sol-step">Bir üst: $\\dfrac{1}{\\;13/4\\;} = \\dfrac{4}{13}$.</p>
      <p class="ales-sol-step">Dış: $2 + \\dfrac{4}{13} = \\dfrac{26}{13} + \\dfrac{4}{13} = \\dfrac{30}{13}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{30}{13}$</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Bilinmeyenli</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\;\\dfrac{1}{x}\\;}{\\;\\dfrac{1}{2} + \\dfrac{1}{3}\\;} = 1$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{5}{6}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{5}$ &nbsp; <strong>C)</strong> $5$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{6}{5}$</span> &nbsp; <strong>E)</strong> $\\dfrac{1}{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Payda: $\\dfrac{1}{2} + \\dfrac{1}{3} = \\dfrac{5}{6}$.</p>
      <p class="ales-sol-step">$\\dfrac{1/x}{5/6} = 1 \\Rightarrow \\dfrac{1}{x} = \\dfrac{5}{6} \\Rightarrow x = \\dfrac{6}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{6}{5}$</span></div>
    </div>
  </div>
</section>
`
};
