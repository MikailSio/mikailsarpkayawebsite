window.ALES_LESSON = {
n: 14,
title: "Köklü Sayılar — Kare Kök",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>kare kök</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $\\sqrt{ab} = \\sqrt{a}\\cdot\\sqrt{b}$ sadeleştirmesi, $\\sqrt{a^{2}} = |a|$ kuralı ve klasik ALES tuzağı $\\sqrt{a+b} \\neq \\sqrt{a}+\\sqrt{b}$ çözüm içinde gösteriliyor. Önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Kare Kök Sadeleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">$\\sqrt{ab} = \\sqrt{a}\\cdot\\sqrt{b}$ ile Sadeleştirme</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Çarpana Ayırma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{50}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $2\\sqrt{5}$ &nbsp; <strong>B)</strong> $5\\sqrt{5}$ &nbsp; <strong>C)</strong> <span class="key">$5\\sqrt{2}$</span> &nbsp; <strong>D)</strong> $10\\sqrt{5}$ &nbsp; <strong>E)</strong> $25\\sqrt{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}$. Tam kare çarpan ara.</p>
      <p class="ales-sol-step">$50 = 25 \\cdot 2$ ⟹ $\\sqrt{50} = \\sqrt{25} \\cdot \\sqrt{2} = 5\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $5\\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Çarpana Ayırma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{72}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $4\\sqrt{2}$ &nbsp; <strong>B)</strong> $2\\sqrt{6}$ &nbsp; <strong>C)</strong> $3\\sqrt{8}$ &nbsp; <strong>D)</strong> <span class="key">$6\\sqrt{2}$</span> &nbsp; <strong>E)</strong> $8\\sqrt{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$72 = 36 \\cdot 2$ ⟹ $\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $6\\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Sayı × Kök</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3\\sqrt{2} \\cdot 4\\sqrt{8}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 50 &nbsp; <strong>B)</strong> <span class="key">48</span> &nbsp; <strong>C)</strong> 47 &nbsp; <strong>D)</strong> 46 &nbsp; <strong>E)</strong> 49
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar ve kökler ayrı çarpılır: $(3 \\cdot 4) \\cdot \\sqrt{2 \\cdot 8} = 12\\sqrt{16} = 12 \\cdot 4 = 48$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 48</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = 3\\sqrt{5}$ ve $b = 2\\sqrt{11}$ sayılarından hangisi daha büyüktür?<br><br>
      <strong>A)</strong> <span class="key">$a$ daha büyük</span> &nbsp; <strong>B)</strong> $b$ daha büyük &nbsp; <strong>C)</strong> Eşit &nbsp; <strong>D)</strong> Karşılaştırılamaz &nbsp; <strong>E)</strong> İkisi de negatif
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Kare Alma</div>
      <p class="ales-sol-step">İki sayı da pozitif; karelerini karşılaştır.</p>
      <p class="ales-sol-step">$a^{2} = 9 \\cdot 5 = 45$. $\\;b^{2} = 4 \\cdot 11 = 44$.</p>
      <p class="ales-sol-step">$45 > 44$ ⟹ $a > b$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Köke Sokma</div>
      <p class="ales-sol-step">$a = \\sqrt{9 \\cdot 5} = \\sqrt{45}$, $\\;b = \\sqrt{4 \\cdot 11} = \\sqrt{44}$ ⟹ $\\sqrt{45} > \\sqrt{44}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) $a$ daha büyük</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Bölüm Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sqrt{75}}{\\sqrt{3}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> <span class="key">5</span> &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\dfrac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\dfrac{a}{b}}$.</p>
      <p class="ales-sol-step">$\\dfrac{\\sqrt{75}}{\\sqrt{3}} = \\sqrt{\\dfrac{75}{3}} = \\sqrt{25} = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Sentez Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{200} - \\sqrt{18}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $13\\sqrt{2}$ &nbsp; <strong>B)</strong> $\\sqrt{182}$ &nbsp; <strong>C)</strong> <span class="key">$7\\sqrt{2}$</span> &nbsp; <strong>D)</strong> $5\\sqrt{2}$ &nbsp; <strong>E)</strong> $7\\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{200} = \\sqrt{100 \\cdot 2} = 10\\sqrt{2}$.</p>
      <p class="ales-sol-step">$\\sqrt{18} = \\sqrt{9 \\cdot 2} = 3\\sqrt{2}$.</p>
      <p class="ales-sol-step">$10\\sqrt{2} - 3\\sqrt{2} = 7\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $7\\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Köklü İçinde Üs</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{2^{10} \\cdot 3^{6}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 874 &nbsp; <strong>B)</strong> 778 &nbsp; <strong>C)</strong> <span class="key">864</span> &nbsp; <strong>D)</strong> 863 &nbsp; <strong>E)</strong> 950
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{2^{10} \\cdot 3^{6}} = \\sqrt{2^{10}} \\cdot \\sqrt{3^{6}} = 2^{5} \\cdot 3^{3} = 32 \\cdot 27 = 864$.</p>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sqrt{a^{2k}} = a^{k}$ (çift üslerde kök rahat çıkar).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 864</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Mutlak Değer ve Toplam Tuzağı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">$\\sqrt{a^{2}} = |a|$ ve $\\sqrt{a+b} \\neq \\sqrt{a}+\\sqrt{b}$ Tuzağı</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Klasik Toplam Tuzağı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{9 + 16}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — ALES Klasik Tuzağı</div>
      <p class="ales-sol-step"><strong>YANLIŞ:</strong> $\\sqrt{9 + 16} = \\sqrt{9} + \\sqrt{16} = 3 + 4 = 7$. Bu BÜYÜK BİR HATA!</p>
      <p class="ales-sol-step"><strong>DOĞRU:</strong> Önce içi topla, sonra kök al: $\\sqrt{9 + 16} = \\sqrt{25} = 5$.</p>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sqrt{a + b} \\neq \\sqrt{a} + \\sqrt{b}$ (sadece çarpımda dağılır, toplamda dağılmaz).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Mutlak Değer Tanımı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{(-5)^{2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> <span class="key">5</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sqrt{a^{2}} = |a|$ — kare kök <em>her zaman pozitif (veya sıfır)</em> sonuç verir.</p>
      <p class="ales-sol-step">$(-5)^{2} = 25$ ⟹ $\\sqrt{25} = 5$.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $\\sqrt{(-5)^{2}} = -5$ değil; $|-5| = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Toplam Tuzağı 2</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{36 + 64}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Önce içi topla: $36 + 64 = 100$.</p>
      <p class="ales-sol-step">$\\sqrt{100} = 10$.</p>
      <p class="ales-sol-step"><strong>Yanılgı denemesi:</strong> $\\sqrt{36} + \\sqrt{64} = 6 + 8 = 14 \\neq 10$ ⟹ kural <em>çalışmaz</em>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Mutlak Değer Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a < 0$ ise $\\sqrt{a^{2}} + a$ ifadesi nedir?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> <span class="key">0</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{a^{2}} = |a|$. $a < 0$ ⟹ $|a| = -a$.</p>
      <p class="ales-sol-step">$\\sqrt{a^{2}} + a = -a + a = 0$.</p>
      <p class="ales-sol-step"><strong>Doğrula:</strong> $a = -3$ alırsak $\\sqrt{9} + (-3) = 3 - 3 = 0$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 0</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Çıkarma Tuzağı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden hangileri <strong>her zaman</strong> doğrudur ($a, b > 0$)?<br>
      <strong>I.</strong> $\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}$ &nbsp; <strong>II.</strong> $\\sqrt{a + b} = \\sqrt{a} + \\sqrt{b}$ &nbsp; <strong>III.</strong> $\\sqrt{a - b} = \\sqrt{a} - \\sqrt{b}$ &nbsp; <strong>IV.</strong> $\\sqrt{\\dfrac{a}{b}} = \\dfrac{\\sqrt{a}}{\\sqrt{b}}$<br><br>
      <strong>A)</strong> Yalnız I &nbsp; <strong>B)</strong> I ve II &nbsp; <strong>C)</strong> <span class="key">I ve IV</span> &nbsp; <strong>D)</strong> II ve III &nbsp; <strong>E)</strong> Hepsi
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>I.</strong> Çarpımda dağılır ⟹ ✓</p>
      <p class="ales-sol-step"><strong>II.</strong> Karşı örnek: $\\sqrt{9 + 16} = 5$ ama $\\sqrt{9} + \\sqrt{16} = 7$ ⟹ ✗</p>
      <p class="ales-sol-step"><strong>III.</strong> Karşı örnek: $\\sqrt{25 - 9} = 4$ ama $\\sqrt{25} - \\sqrt{9} = 2$ ⟹ ✗</p>
      <p class="ales-sol-step"><strong>IV.</strong> Bölümde dağılır ⟹ ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) I ve IV</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Mutlak Değer İçi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a > 5$ ise $\\sqrt{(a-5)^{2}} + \\sqrt{(5-a)^{2}}$ ifadesi $a$ cinsinden nedir?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $a - 5$ &nbsp; <strong>C)</strong> $10 - 2a$ &nbsp; <strong>D)</strong> <span class="key">$2a - 10$</span> &nbsp; <strong>E)</strong> $2a$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{(a-5)^{2}} = |a-5|$. $a > 5$ ⟹ $a - 5 > 0$ ⟹ $|a-5| = a - 5$.</p>
      <p class="ales-sol-step">$\\sqrt{(5-a)^{2}} = |5-a|$. $5 - a < 0$ ⟹ $|5-a| = -(5-a) = a - 5$.</p>
      <p class="ales-sol-step">Toplam: $(a - 5) + (a - 5) = 2a - 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $2a - 10$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez Tuzak</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{12^{2} + 5^{2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> <span class="key">13</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pisagor Üçlüsü</div>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $12 + 5 = 17$ değil! Önce içi hesapla.</p>
      <p class="ales-sol-step">$12^{2} + 5^{2} = 144 + 25 = 169$.</p>
      <p class="ales-sol-step">$\\sqrt{169} = 13$. ($5, 12, 13$ ünlü Pisagor üçlüsü.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 13</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Köklü İfadelerle Dört İşlem
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Köklü İfadelerle Dört İşlem</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Aynı Köklerin Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3\\sqrt{5} + 7\\sqrt{5} - 2\\sqrt{5}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $12\\sqrt{5}$ &nbsp; <strong>B)</strong> $6\\sqrt{5}$ &nbsp; <strong>C)</strong> <span class="key">$8\\sqrt{5}$</span> &nbsp; <strong>D)</strong> $8\\sqrt{15}$ &nbsp; <strong>E)</strong> $\\sqrt{40}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aynı köklü terimler "benzer terim" gibi toplanır: $(3 + 7 - 2)\\sqrt{5} = 8\\sqrt{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $8\\sqrt{5}$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Sadeleştirip Topla</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{12} + \\sqrt{27}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\sqrt{39}$ &nbsp; <strong>B)</strong> <span class="key">$5\\sqrt{3}$</span> &nbsp; <strong>C)</strong> $6\\sqrt{3}$ &nbsp; <strong>D)</strong> $5\\sqrt{2}$ &nbsp; <strong>E)</strong> $\\sqrt{75}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Önce Sadeleştir</div>
      <p class="ales-sol-step">$\\sqrt{12} = \\sqrt{4 \\cdot 3} = 2\\sqrt{3}$.</p>
      <p class="ales-sol-step">$\\sqrt{27} = \\sqrt{9 \\cdot 3} = 3\\sqrt{3}$.</p>
      <p class="ales-sol-step">$2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $5\\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Çarpım Açma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(\\sqrt{3} + 2)(\\sqrt{3} - 1)$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $3 + \\sqrt{3}$ &nbsp; <strong>B)</strong> $1 - \\sqrt{3}$ &nbsp; <strong>C)</strong> $\\sqrt{3} - 2$ &nbsp; <strong>D)</strong> <span class="key">$1 + \\sqrt{3}$</span> &nbsp; <strong>E)</strong> $5 + \\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Dağılma</div>
      <p class="ales-sol-step">$(\\sqrt{3})^{2} - \\sqrt{3} + 2\\sqrt{3} - 2 = 3 + \\sqrt{3} - 2 = 1 + \\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $1 + \\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İki Kare Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(\\sqrt{7} + \\sqrt{3})(\\sqrt{7} - \\sqrt{3})$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 0 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — $a^{2} - b^{2}$</div>
      <p class="ales-sol-step">$(\\sqrt{7})^{2} - (\\sqrt{3})^{2} = 7 - 3 = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Tam Kare Açılım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(\\sqrt{2} + \\sqrt{3})^{2}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $5 + \\sqrt{6}$ &nbsp; <strong>C)</strong> $2 + \\sqrt{6} + 3$ &nbsp; <strong>D)</strong> $\\sqrt{6}$ &nbsp; <strong>E)</strong> <span class="key">$5 + 2\\sqrt{6}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(a + b)^{2} = a^{2} + 2ab + b^{2}$.</p>
      <p class="ales-sol-step">$(\\sqrt{2})^{2} + 2\\sqrt{2}\\cdot\\sqrt{3} + (\\sqrt{3})^{2} = 2 + 2\\sqrt{6} + 3 = 5 + 2\\sqrt{6}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $5 + 2\\sqrt{6}$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Köklü Bölüm</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sqrt{32} + \\sqrt{50}}{\\sqrt{2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> <span class="key">9</span> &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Önce Pay'ı Sadeleştir</div>
      <p class="ales-sol-step">$\\sqrt{32} = 4\\sqrt{2}$, $\\;\\sqrt{50} = 5\\sqrt{2}$.</p>
      <p class="ales-sol-step">Pay: $4\\sqrt{2} + 5\\sqrt{2} = 9\\sqrt{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{9\\sqrt{2}}{\\sqrt{2}} = 9$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Terim Terim Bölme</div>
      <p class="ales-sol-step">$\\dfrac{\\sqrt{32}}{\\sqrt{2}} + \\dfrac{\\sqrt{50}}{\\sqrt{2}} = \\sqrt{16} + \\sqrt{25} = 4 + 5 = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 9</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Toplam Tuzak Hatırlat</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{50} - \\sqrt{32} + \\sqrt{8}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\sqrt{26}$ &nbsp; <strong>B)</strong> $11\\sqrt{2}$ &nbsp; <strong>C)</strong> $5\\sqrt{2}$ &nbsp; <strong>D)</strong> <span class="key">$3\\sqrt{2}$</span> &nbsp; <strong>E)</strong> $7\\sqrt{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tek Tek Sadeleştir</div>
      <p class="ales-sol-step"><strong>Hatırla:</strong> Köklü <em>toplamı</em> doğrudan açamayız ($\\sqrt{50 - 32 + 8} \\neq$ doğru cevap). Her terimi ayrı sadeleştirip benzer terim olarak topluyoruz.</p>
      <p class="ales-sol-step">$\\sqrt{50} = 5\\sqrt{2}$, $\\;\\sqrt{32} = 4\\sqrt{2}$, $\\;\\sqrt{8} = 2\\sqrt{2}$.</p>
      <p class="ales-sol-step">$5\\sqrt{2} - 4\\sqrt{2} + 2\\sqrt{2} = 3\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $3\\sqrt{2}$</span></div>
    </div>
  </div>
</section>
`
};
