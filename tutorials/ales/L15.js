window.ALES_LESSON = {
n: 15,
title: "Köklü Sayılar — n. Dereceden Kök",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>n. dereceden kök</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $\\sqrt[n]{a}$ tanımı, üslü-köklü geçiş $a^{m/n} = \\sqrt[n]{a^{m}}$, çift/tek dereceli kök ayrımı ve iç içe kökler çözüm içinde gösteriliyor. Önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — n. Derece Kök Tanımı + Üslü-Köklü Geçiş
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">$\\sqrt[n]{a}$ Tanımı ve Üslü-Köklü Geçiş</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Kübik Kök</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt[3]{27}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Tanım:</strong> $\\sqrt[n]{a} = b \\Leftrightarrow b^{n} = a$.</p>
      <p class="ales-sol-step">$3^{3} = 27$ ⟹ $\\sqrt[3]{27} = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">4. Derece Kök</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt[4]{16}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> <span class="key">2</span> &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2^{4} = 16$ ⟹ $\\sqrt[4]{16} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 2</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Üslü-Köklü Geçiş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $8^{2/3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> <span class="key">4</span> &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geçiş Kuralı</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $a^{m/n} = \\sqrt[n]{a^{m}} = (\\sqrt[n]{a})^{m}$.</p>
      <p class="ales-sol-step">$8^{2/3} = (\\sqrt[3]{8})^{2} = 2^{2} = 4$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif</div>
      <p class="ales-sol-step">$8^{2/3} = (8^{2})^{1/3} = 64^{1/3} = \\sqrt[3]{64} = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 4</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Kesirli Üs Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $16^{3/4}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> <span class="key">8</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$16 = 2^{4}$ ⟹ $16^{3/4} = (2^{4})^{3/4} = 2^{3} = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 8</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Kök İçindeki Kök Üs</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt[3]{2^{6}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt[n]{a^{m}} = a^{m/n}$ ⟹ $\\sqrt[3]{2^{6}} = 2^{6/3} = 2^{2} = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Negatif Kesirli Üs</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $32^{-2/5}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $4$ &nbsp; <strong>B)</strong> $-4$ &nbsp; <strong>C)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{1}{4}$</span> &nbsp; <strong>E)</strong> $-\\dfrac{1}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$32 = 2^{5}$ ⟹ $32^{-2/5} = (2^{5})^{-2/5} = 2^{-2} = \\dfrac{1}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{1}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Bilinmeyen Üslü Denklem</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $x^{3/4} = 8$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 17 &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> <span class="key">16</span> &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 21
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tersi al</div>
      <p class="ales-sol-step">Her iki tarafın $\\dfrac{4}{3}$ kuvvetini al: $\\left(x^{3/4}\\right)^{4/3} = 8^{4/3}$.</p>
      <p class="ales-sol-step">$x^{1} = 8^{4/3} = (\\sqrt[3]{8})^{4} = 2^{4} = 16$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 16</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Çift/Tek Dereceli Kök Farkı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Çift/Tek Dereceli Kök: $n$ Çiftse $a \\geq 0$</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Tek Derecede Negatif</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt[3]{-27}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> -7 &nbsp; <strong>C)</strong> -4 &nbsp; <strong>D)</strong> -5 &nbsp; <strong>E)</strong> <span class="key">-3</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Tek dereceli kök her reel sayı için tanımlı; negatifin tek kökü negatiftir.</p>
      <p class="ales-sol-step">$(-3)^{3} = -27$ ⟹ $\\sqrt[3]{-27} = -3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) -3</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Çift Derecede Negatif</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden hangileri reel sayılarda <strong>tanımsız</strong>dır?<br>
      <strong>I.</strong> $\\sqrt[4]{-16}$ &nbsp; <strong>II.</strong> $\\sqrt[5]{-32}$ &nbsp; <strong>III.</strong> $\\sqrt{-9}$ &nbsp; <strong>IV.</strong> $\\sqrt[3]{-8}$<br><br>
      <strong>A)</strong> Yalnız I &nbsp; <strong>B)</strong> Yalnız III &nbsp; <strong>C)</strong> <span class="key">I ve III</span> &nbsp; <strong>D)</strong> II ve IV &nbsp; <strong>E)</strong> I, II, III ve IV
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Çift dereceli kök içine negatif konamaz (reel sayılarda).</p>
      <p class="ales-sol-step"><strong>I.</strong> $\\sqrt[4]{-16}$: kök derecesi 4 (çift), içi negatif ⟹ <strong>tanımsız</strong>.</p>
      <p class="ales-sol-step"><strong>II.</strong> $\\sqrt[5]{-32} = -2$ (tek derece, tanımlı).</p>
      <p class="ales-sol-step"><strong>III.</strong> $\\sqrt{-9}$: derece 2 (çift), içi negatif ⟹ <strong>tanımsız</strong>.</p>
      <p class="ales-sol-step"><strong>IV.</strong> $\\sqrt[3]{-8} = -2$ (tek derece, tanımlı).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) I ve III</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Mutlak Değer (Çift Derece)</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt[4]{(-2)^{4}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sqrt[n]{a^{n}} = |a|$ (n çift) &nbsp; / &nbsp; $\\sqrt[n]{a^{n}} = a$ (n tek).</p>
      <p class="ales-sol-step">$\\sqrt[4]{(-2)^{4}} = |-2| = 2$.</p>
      <p class="ales-sol-step">Veya doğrudan: $(-2)^{4} = 16$, $\\sqrt[4]{16} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Tanım Aralığı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{x - 3}$ ifadesinin reel sayılarda tanımlı olabilmesi için $x$ hangi koşulu sağlamalıdır?<br><br>
      <strong>A)</strong> $x \\leq 3$ &nbsp; <strong>B)</strong> $x > 3$ &nbsp; <strong>C)</strong> <span class="key">$x \\geq 3$</span> &nbsp; <strong>D)</strong> $x \\neq 3$ &nbsp; <strong>E)</strong> $x \\geq -3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çift dereceli kökün içi $\\geq 0$ olmalı: $x - 3 \\geq 0 \\Rightarrow x \\geq 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x \\geq 3$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Mutlak Değer Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a < 0$ için $\\sqrt[6]{a^{6}}$ ifadesi nedir?<br><br>
      <strong>A)</strong> $a$ &nbsp; <strong>B)</strong> <span class="key">$-a$</span> &nbsp; <strong>C)</strong> $a^{6}$ &nbsp; <strong>D)</strong> $|a^{6}|$ &nbsp; <strong>E)</strong> $0$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$n = 6$ çift ⟹ $\\sqrt[6]{a^{6}} = |a|$.</p>
      <p class="ales-sol-step">$a < 0$ ⟹ $|a| = -a$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-a$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Karma Çift/Tek</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt[3]{-64} + \\sqrt[4]{81}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> -3 &nbsp; <strong>B)</strong> <span class="key">-1</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> -2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt[3]{-64}$: tek derece ⟹ $(-4)^{3} = -64$ ⟹ $-4$.</p>
      <p class="ales-sol-step">$\\sqrt[4]{81}$: $3^{4} = 81$ ⟹ $3$.</p>
      <p class="ales-sol-step">$-4 + 3 = -1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) -1</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — İki Köşeli Kontrol</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{x + 5} + \\sqrt[3]{x - 2}$ ifadesinin reel olarak tanımlı olduğu en küçük tam sayı $x$ değeri kaçtır?<br><br>
      <strong>A)</strong> -8 &nbsp; <strong>B)</strong> -1 &nbsp; <strong>C)</strong> -6 &nbsp; <strong>D)</strong> -4 &nbsp; <strong>E)</strong> <span class="key">-5</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{x+5}$: derece 2 (çift), içi $\\geq 0$: $x + 5 \\geq 0 \\Rightarrow x \\geq -5$.</p>
      <p class="ales-sol-step">$\\sqrt[3]{x-2}$: derece 3 (tek), her reel sayıda tanımlı ⟹ koşul yok.</p>
      <p class="ales-sol-step">Birleşik koşul: $x \\geq -5$. En küçük tam sayı $x = -5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) -5</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — İç İçe Kökler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">İç İçe Kökler: $\\sqrt{a + \\sqrt{b}}$ Tipi</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Basit İç İçe</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{\\sqrt{16}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçten Dışa</div>
      <p class="ales-sol-step">İçteki kök: $\\sqrt{16} = 4$.</p>
      <p class="ales-sol-step">Dıştaki: $\\sqrt{4} = 2$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Üs Çarpımı</div>
      <p class="ales-sol-step">$\\sqrt{\\sqrt{16}} = (16^{1/2})^{1/2} = 16^{1/4} = \\sqrt[4]{16} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Karma Derece</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{\\sqrt[3]{64}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> <span class="key">2</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İçteki: $\\sqrt[3]{64} = 4$.</p>
      <p class="ales-sol-step">Dıştaki: $\\sqrt{4} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 2</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İç İçe Tam Kareye Çevirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{3 + 2\\sqrt{2}}$ ifadesinin değeri aşağıdakilerden hangisidir?<br><br>
      <strong>A)</strong> $\\sqrt{2} - 1$ &nbsp; <strong>B)</strong> $\\sqrt{3} + 1$ &nbsp; <strong>C)</strong> <span class="key">$\\sqrt{2} + 1$</span> &nbsp; <strong>D)</strong> $2 + \\sqrt{2}$ &nbsp; <strong>E)</strong> $\\sqrt{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tam Kare Açılımı Tersine</div>
      <p class="ales-sol-step">$3 + 2\\sqrt{2}$ ifadesini $(a + b)^{2}$ formuna sok: $a^{2} + b^{2} = 3$ ve $2ab = 2\\sqrt{2}$.</p>
      <p class="ales-sol-step">Dene $a = \\sqrt{2}$, $b = 1$: $a^{2} + b^{2} = 2 + 1 = 3$ ✓ &nbsp; $2ab = 2\\sqrt{2}$ ✓.</p>
      <p class="ales-sol-step">$\\sqrt{3 + 2\\sqrt{2}} = \\sqrt{(\\sqrt{2} + 1)^{2}} = \\sqrt{2} + 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\sqrt{2} + 1$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Sentez İç İçe</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{5 + 2\\sqrt{6}}$ ifadesinin sadeleşmiş hali hangisidir?<br><br>
      <strong>A)</strong> $\\sqrt{5} + \\sqrt{6}$ &nbsp; <strong>B)</strong> $\\sqrt{6} - \\sqrt{2}$ &nbsp; <strong>C)</strong> $5 + \\sqrt{6}$ &nbsp; <strong>D)</strong> <span class="key">$\\sqrt{3} + \\sqrt{2}$</span> &nbsp; <strong>E)</strong> $\\sqrt{3} - \\sqrt{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(a + b)^{2}$: $a^{2} + b^{2} = 5$ ve $2ab = 2\\sqrt{6}$ ⟹ $ab = \\sqrt{6}$.</p>
      <p class="ales-sol-step">$a = \\sqrt{3}$, $b = \\sqrt{2}$ dene: $a^{2} + b^{2} = 3 + 2 = 5$ ✓ &nbsp; $ab = \\sqrt{6}$ ✓.</p>
      <p class="ales-sol-step">$\\sqrt{5 + 2\\sqrt{6}} = \\sqrt{3} + \\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\sqrt{3} + \\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Eksili İç İçe</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{7 - 2\\sqrt{12}}$ ifadesinin sadeleşmiş hali hangisidir?<br><br>
      <strong>A)</strong> $\\sqrt{3} - 2$ &nbsp; <strong>B)</strong> <span class="key">$2 - \\sqrt{3}$</span> &nbsp; <strong>C)</strong> $2 + \\sqrt{3}$ &nbsp; <strong>D)</strong> $\\sqrt{7} - \\sqrt{12}$ &nbsp; <strong>E)</strong> $\\sqrt{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(a - b)^{2}$: $a^{2} + b^{2} = 7$ ve $2ab = 2\\sqrt{12}$ ⟹ $ab = \\sqrt{12} = 2\\sqrt{3}$.</p>
      <p class="ales-sol-step">$a = 2, b = \\sqrt{3}$ dene: $4 + 3 = 7$ ✓ &nbsp; $ab = 2\\sqrt{3}$ ✓.</p>
      <p class="ales-sol-step">$\\sqrt{7 - 2\\sqrt{12}} = |2 - \\sqrt{3}| = 2 - \\sqrt{3}$ ($2 > \\sqrt{3}$ olduğu için pozitif).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2 - \\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Üç Katlı Kök</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{\\sqrt{\\sqrt{256}}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçten Dışa</div>
      <p class="ales-sol-step">$\\sqrt{256} = 16$ (çünkü $16^{2} = 256$).</p>
      <p class="ales-sol-step">$\\sqrt{16} = 4$.</p>
      <p class="ales-sol-step">$\\sqrt{4} = 2$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Üs Olarak</div>
      <p class="ales-sol-step">$256^{1/2 \\cdot 1/2 \\cdot 1/2} = 256^{1/8}$. $256 = 2^{8}$ ⟹ $(2^{8})^{1/8} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 2</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez İç İçe Çarpım</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{6 + 2\\sqrt{5}} \\cdot \\sqrt{6 - 2\\sqrt{5}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> <span class="key">4</span> &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpım Köke Sok</div>
      <p class="ales-sol-step">$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$.</p>
      <p class="ales-sol-step">$\\sqrt{(6 + 2\\sqrt{5})(6 - 2\\sqrt{5})} = \\sqrt{6^{2} - (2\\sqrt{5})^{2}} = \\sqrt{36 - 20} = \\sqrt{16} = 4$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Önce Açma</div>
      <p class="ales-sol-step">$\\sqrt{6 + 2\\sqrt{5}} = \\sqrt{5} + 1$ (çünkü $5 + 1 = 6$, $2\\sqrt{5} \\cdot 1 = 2\\sqrt{5}$).</p>
      <p class="ales-sol-step">$\\sqrt{6 - 2\\sqrt{5}} = \\sqrt{5} - 1$.</p>
      <p class="ales-sol-step">Çarpım: $(\\sqrt{5}+1)(\\sqrt{5}-1) = 5 - 1 = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 4</span></div>
    </div>
  </div>
</section>
`
};
