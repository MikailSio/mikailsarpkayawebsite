window.ALES_LESSON = {
n: 32,
title: "Logaritma",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>logaritma</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $\\log_a N = x \\Leftrightarrow a^x = N$ tanımı oturduğunda gerisi üs özelliklerinin yansıması. <strong>EN BÜYÜK TUZAK:</strong> $\\log(x + y) \\neq \\log x + \\log y$ — bu yanlış kullanım sınavın klasiği.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Tanım Problemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">log_a N = x ⟺ aˣ = N (Tanım)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Tanım Hesabı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_2 16$ kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> <span class="key">4</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\log_2 16 = x \\Leftrightarrow 2^x = 16 = 2^4 \\Rightarrow x = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Negatif Üs</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_3 \\dfrac{1}{27}$ kaçtır?<br><br>
      <strong>A)</strong> $-27$ &nbsp; <strong>B)</strong> $-9$ &nbsp; <strong>C)</strong> <span class="key">$-3$</span> &nbsp; <strong>D)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>E)</strong> $3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$3^x = \\dfrac{1}{27} = 3^{-3} \\Rightarrow x = -3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-3$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Özel Değer log_a 1</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_5 1 + \\log_7 7$ değeri kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Özel Değer</div>
      <p class="ales-sol-step"><strong>$\\log_a 1 = 0$</strong> her zaman ($a^0 = 1$).</p>
      <p class="ales-sol-step"><strong>$\\log_a a = 1$</strong> her zaman ($a^1 = a$).</p>
      <p class="ales-sol-step">Sonuç: $0 + 1 = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Bilinmeyen Taban</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log_a 81 = 4$ ise $a$ kaçtır? ($a > 0, a \\neq 1$)<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a^4 = 81 \\Rightarrow a = 81^{1/4} = 3$ (pozitif kök).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Bilinmeyen N</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log_4 N = \\dfrac{3}{2}$ ise $N$ kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> <span class="key">8</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 13
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$N = 4^{3/2} = (4^{1/2})^3 = 2^3 = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 8</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Karekök İçinde</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log_2 \\sqrt{32}$ kaçtır?<br><br>
      <strong>A)</strong> 0 /2 &nbsp; <strong>B)</strong> 2 /2 &nbsp; <strong>C)</strong> 4 /2 &nbsp; <strong>D)</strong> <span class="key">5 /2</span> &nbsp; <strong>E)</strong> 8 /2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{32} = 32^{1/2} = (2^5)^{1/2} = 2^{5/2}$.</p>
      <p class="ales-sol-step">$\\log_2 2^{5/2} = \\dfrac{5}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5 /2</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez Tanım</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\log_{1/2} 8$ kaçtır?<br><br>
      <strong>A)</strong> $-8$ &nbsp; <strong>B)</strong> $-4$ &nbsp; <strong>C)</strong> <span class="key">$-3$</span> &nbsp; <strong>D)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>E)</strong> $3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\left(\\dfrac{1}{2}\\right)^x = 8 \\Rightarrow 2^{-x} = 2^3 \\Rightarrow -x = 3 \\Rightarrow x = -3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Taban Çevir</div>
      <p class="ales-sol-step">$\\log_{1/a} N = -\\log_a N$. $-\\log_2 8 = -3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-3$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Log Özellikleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Log Özellikleri (log(xy), log(x/y), log(xⁿ))</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Çarpım Özelliği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_2 8 + \\log_2 4$ değeri kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Birleştir</div>
      <p class="ales-sol-step"><strong>Özellik:</strong> $\\log_a x + \\log_a y = \\log_a (xy)$.</p>
      <p class="ales-sol-step">$\\log_2 (8 \\cdot 4) = \\log_2 32 = 5$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Tek Tek</div>
      <p class="ales-sol-step">$\\log_2 8 = 3$ ve $\\log_2 4 = 2$. Toplam $= 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Bölüm Özelliği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_3 81 - \\log_3 9$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\log_a x - \\log_a y = \\log_a (x/y)$.</p>
      <p class="ales-sol-step">$\\log_3 (81/9) = \\log_3 9 = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üs Özelliği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_5 125^3$ kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> <span class="key">9</span> &nbsp; <strong>C)</strong> 12 &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\log_a x^n = n \\log_a x$.</p>
      <p class="ales-sol-step">$3 \\log_5 125 = 3 \\cdot 3 = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 9</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Karma Özellikler</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log_2 6 + \\log_2 4 - \\log_2 3$ kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\log_2 \\dfrac{6 \\cdot 4}{3} = \\log_2 \\dfrac{24}{3} = \\log_2 8 = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Tanım + Özellik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log 2 = a$ ise $\\log 50$ neye eşittir? ($\\log = \\log_{10}$)<br><br>
      <strong>A)</strong> 1 − a &nbsp; <strong>B)</strong> <span class="key">2 − a</span> &nbsp; <strong>C)</strong> 3 − a &nbsp; <strong>D)</strong> 5 − a &nbsp; <strong>E)</strong> 6 − a
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$50 = \\dfrac{100}{2}$ ⟹ $\\log 50 = \\log 100 - \\log 2 = 2 - a$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 − a</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">İki Bilinmeyenli Karma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log 2 = a$ ve $\\log 3 = b$ ise $\\log 12$ neye eşittir?<br><br>
      <strong>A)</strong> <span class="key">2 a + b</span> &nbsp; <strong>B)</strong> 3 a + b &nbsp; <strong>C)</strong> 5 a + b &nbsp; <strong>D)</strong> 6 a + b &nbsp; <strong>E)</strong> 7 a + b
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$12 = 2^2 \\cdot 3$. $\\log 12 = 2 \\log 2 + \\log 3 = 2a + b$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 2 a + b</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Yanlış Kullanım Tuzağı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden hangisi <strong>her zaman</strong> doğrudur? (Tüm değerler tanımlı.)<br>
      <strong>I.</strong> $\\log(xy) = \\log x + \\log y$<br>
      <strong>II.</strong> $\\log(x + y) = \\log x + \\log y$<br>
      <strong>III.</strong> $\\log x^2 = 2 \\log |x|$<br>
      <strong>IV.</strong> $\\dfrac{\\log x}{\\log y} = \\log\\dfrac{x}{y}$<br><br>
      <strong>A)</strong> Yalnız I &nbsp; <strong>B)</strong> Yalnız III &nbsp; <strong>C)</strong> <span class="key">I ve III</span> &nbsp; <strong>D)</strong> II ve IV &nbsp; <strong>E)</strong> I, III ve IV
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>I.</strong> Çarpım özelliği ✓.</p>
      <p class="ales-sol-step"><strong>II.</strong> KLASİK TUZAK — yanlış. $\\log(x+y) \\neq \\log x + \\log y$ ✗.</p>
      <p class="ales-sol-step"><strong>III.</strong> $\\log x^2 = 2 \\log |x|$ doğrudur ($x$ negatif olabilir, $x^2$ pozitif olur, $\\log$ alabilir) ✓.</p>
      <p class="ales-sol-step"><strong>IV.</strong> Yanlış. Doğrusu: $\\log x - \\log y = \\log(x/y)$ ✗.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) I ve III</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Log Denklemleri + Tanım Kümesi Tuzağı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Log Denklemleri + Tanım Kümesi Tuzağı</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Basit Log Denklemi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_2 (x - 3) = 4$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 16 &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> <span class="key">19</span> &nbsp; <strong>D)</strong> 24 &nbsp; <strong>E)</strong> 25
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tanıma çevir: $x - 3 = 2^4 = 16 \\Rightarrow x = 19$.</p>
      <p class="ales-sol-step"><strong>Tanım kontrolü:</strong> $x - 3 > 0$ ⟹ $19 - 3 = 16 > 0$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 19</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">İki Log Eşit</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\log_3 (2x + 1) = \\log_3 (x + 7)$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aynı taban ⟹ argümanlar eşit: $2x + 1 = x + 7 \\Rightarrow x = 6$.</p>
      <p class="ales-sol-step"><strong>Tanım:</strong> $2(6) + 1 = 13 > 0$ ve $6 + 7 = 13 > 0$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Özellik + Denklem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log_2 x + \\log_2 (x - 6) = 4$ denkleminin kökü kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> <span class="key">8</span> &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 13
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Birleştir: $\\log_2 (x(x - 6)) = 4 \\Rightarrow x(x - 6) = 16$.</p>
      <p class="ales-sol-step">$x^2 - 6x - 16 = 0 \\Rightarrow (x - 8)(x + 2) = 0 \\Rightarrow x = 8$ veya $x = -2$.</p>
      <p class="ales-sol-step"><strong>Tanım kontrolü:</strong> $x > 0$ ve $x - 6 > 0$ ⟹ $x > 6$. $x = -2$ EKSİK; $x = 8$ ✓.</p>
      <p class="ales-sol-step"><strong>Klasik TUZAK:</strong> Tanım kontrolünü atla, $x = -2$'yi de cevap say.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 8</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Üs Özelliği ile</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\log_5 x^2 = 4$ ise $x$ değerleri toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x^2 = 5^4 = 625 \\Rightarrow x = \\pm 25$.</p>
      <p class="ales-sol-step"><strong>Tanım:</strong> $x^2 > 0$ ⟹ $x \\neq 0$. Her iki kök geçerli.</p>
      <p class="ales-sol-step">Toplam: $25 + (-25) = 0$.</p>
      <p class="ales-sol-step"><strong>NOT:</strong> $\\log x^2$ ile $2 \\log x$ farklı. İlki $x \\neq 0$ kabul eder, ikincisi $x > 0$ ister.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Üslü Denklem (Log Al)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2^x = 3$ ise $x$ neye eşittir?<br><br>
      <strong>A)</strong> $\\log_3 2$ &nbsp; <strong>B)</strong> <span class="key">$\\log_2 3$</span> &nbsp; <strong>C)</strong> $\\dfrac{3}{2}$ &nbsp; <strong>D)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>E)</strong> $\\log 6$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Log Al</div>
      <p class="ales-sol-step">İki tarafın $\\log_2$ değerini al: $x = \\log_2 3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Taban Değişimi</div>
      <p class="ales-sol-step">$x = \\dfrac{\\log 3}{\\log 2}$ (10 tabanı kullanılırsa).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\log_2 3$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Taban Değişimi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\log_4 x = \\log_2 3$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tanım Yolu</div>
      <p class="ales-sol-step">$\\log_2 3 = y$ dersek $2^y = 3$.</p>
      <p class="ales-sol-step">$\\log_4 x = y \\Rightarrow x = 4^y = (2^2)^y = (2^y)^2 = 3^2 = 9$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Taban Eşitle</div>
      <p class="ales-sol-step">$\\log_4 x = \\log_{2^2} x = \\dfrac{1}{2} \\log_2 x$. $\\dfrac{1}{2} \\log_2 x = \\log_2 3 \\Rightarrow \\log_2 x = 2 \\log_2 3 = \\log_2 9 \\Rightarrow x = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez Tanım Tuzağı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\log_3 (x - 2) + \\log_3 (x - 4) = 1$ denkleminin reel kökü kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Tanım:</strong> $x - 2 > 0$ ve $x - 4 > 0$ ⟹ $x > 4$.</p>
      <p class="ales-sol-step">Birleştir: $\\log_3 ((x - 2)(x - 4)) = 1 \\Rightarrow (x - 2)(x - 4) = 3$.</p>
      <p class="ales-sol-step">$x^2 - 6x + 8 = 3 \\Rightarrow x^2 - 6x + 5 = 0 \\Rightarrow (x - 1)(x - 5) = 0$.</p>
      <p class="ales-sol-step">$x = 1$ veya $x = 5$. <strong>Tanım gereği $x > 4$:</strong> $x = 1$ EKSİK; $x = 5$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>
</section>
`
};
