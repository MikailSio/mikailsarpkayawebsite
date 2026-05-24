window.ALES_LESSON = {
n: 4,
title: "İrrasyonel ve Reel Sayılar (ℝ)",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>irrasyonel sayılar ve reel sayı kümesi</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. İrrasyonel tanıma, köklü sayıları sadeleştirme ve karma "kaç tanesi rasyoneldir" tipi sorular adım adım açıklanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — İrrasyonel Tanıma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">İrrasyonel Tanıma — √n, π, e</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Doğru/Yanlış</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden kaç tanesi <strong>doğru</strong>dur?<br>
      <strong>I.</strong> $\\sqrt{2}$ irrasyoneldir.<br>
      <strong>II.</strong> $\\pi$ rasyoneldir.<br>
      <strong>III.</strong> Her irrasyonel sayı reeldir.<br>
      <strong>IV.</strong> Her reel sayı irrasyoneldir.<br>
      <strong>V.</strong> $\\sqrt{4}$ irrasyoneldir.<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Hatırla:</strong> $\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{I}$ (rasyoneller ve irrasyoneller ayrık birleşim).</p>
      <p class="ales-sol-step"><strong>I.</strong> $\\sqrt{2}$ tam kare olmayan asalın kökü ⟹ irrasyonel ✓ &nbsp; <strong>II.</strong> $\\pi$ irrasyoneldir, kanıtlanmıştır ✗</p>
      <p class="ales-sol-step"><strong>III.</strong> $\\mathbb{I} \\subset \\mathbb{R}$ ⟹ ✓ &nbsp; <strong>IV.</strong> $\\dfrac{1}{2}$ reel ama rasyonel ✗ &nbsp; <strong>V.</strong> $\\sqrt{4} = 2 \\in \\mathbb{Q}$ ✗</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span> (I, III)</div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Hangisi İrrasyonel?</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{16},\\; \\sqrt{17},\\; \\sqrt{0,25},\\; \\sqrt{0,2},\\; \\sqrt[3]{27}$ ifadelerinden kaç tanesi irrasyoneldir?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sqrt{n}$ ($n$ pozitif tam sayı), $n$ tam kare ise rasyonel; değilse irrasyonel.</p>
      <p class="ales-sol-step">$\\sqrt{16} = 4$ ⟹ rasyonel. $\\sqrt{17}$: 17 tam kare değil ⟹ <strong>irrasyonel</strong>.</p>
      <p class="ales-sol-step">$\\sqrt{0,25} = \\sqrt{1/4} = 1/2$ ⟹ rasyonel.</p>
      <p class="ales-sol-step">$\\sqrt{0,2} = \\sqrt{1/5} = \\dfrac{1}{\\sqrt{5}}$ ⟹ <strong>irrasyonel</strong>. (5 tam kare değil.)</p>
      <p class="ales-sol-step">$\\sqrt[3]{27} = 3$ ⟹ rasyonel.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 2</span> (√17 ve √0,2)</div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Sıralama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{8},\\; 3,\\; \\sqrt{10}$ sayılarını küçükten büyüğe sıralarsak hangisi doğrudur?<br><br>
      <strong>A)</strong> $3 < \\sqrt{8} < \\sqrt{10}$ &nbsp; <strong>B)</strong> $\\sqrt{10} < 3 < \\sqrt{8}$ &nbsp; <strong>C)</strong> <span class="key">$\\sqrt{8} < 3 < \\sqrt{10}$</span> &nbsp; <strong>D)</strong> $\\sqrt{8} < \\sqrt{10} < 3$ &nbsp; <strong>E)</strong> Üçü eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Karelere Çevir</div>
      <p class="ales-sol-step">Hepsinin karesini al: $(\\sqrt{8})^{2} = 8$, $\\;3^{2} = 9$, $\\;(\\sqrt{10})^{2} = 10$.</p>
      <p class="ales-sol-step">$8 < 9 < 10$ ⟹ $\\sqrt{8} < 3 < \\sqrt{10}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\sqrt{8} < 3 < \\sqrt{10}$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">İrrasyonel ile İşlem</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{2}$ irrasyoneldir. Aşağıdakilerden kaç tanesi <strong>her zaman irrasyonel</strong>dir?<br>
      <strong>I.</strong> $\\sqrt{2} + 1$ &nbsp; <strong>II.</strong> $3 \\sqrt{2}$ &nbsp; <strong>III.</strong> $\\sqrt{2} \\cdot \\sqrt{2}$ &nbsp; <strong>IV.</strong> $\\sqrt{2} - \\sqrt{2}$<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Rasyonel + irrasyonel = irrasyonel. Sıfırdan farklı rasyonel × irrasyonel = irrasyonel.</p>
      <p class="ales-sol-step"><strong>I.</strong> rasyonel + irr = irr ✓ &nbsp; <strong>II.</strong> rasyonel ($\\neq 0$) × irr = irr ✓</p>
      <p class="ales-sol-step"><strong>III.</strong> $\\sqrt{2} \\cdot \\sqrt{2} = 2 \\in \\mathbb{Q}$ ⟹ rasyonel ✗ &nbsp; <strong>IV.</strong> $0 \\in \\mathbb{Q}$ ⟹ rasyonel ✗</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 2</span> (I ve II)</div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Tam Sayı Yaklaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{50}$ sayısı hangi iki ardışık tam sayı arasındadır?<br><br>
      <strong>A)</strong> 5 ile 6 &nbsp; <strong>B)</strong> 6 ile 7 &nbsp; <strong>C)</strong> <span class="key">7 ile 8</span> &nbsp; <strong>D)</strong> 8 ile 9 &nbsp; <strong>E)</strong> 24 ile 26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tam kare aralık ara: $7^{2} = 49$, $8^{2} = 64$.</p>
      <p class="ales-sol-step">$49 < 50 < 64 \\Rightarrow 7 < \\sqrt{50} < 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7 ile 8</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Reel Sayı Hiyerarşisi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $A = \\{0, -3, \\sqrt{2}, \\dfrac{1}{2}, \\sqrt{9}, \\pi, 0,\\overline{3}\\}$ kümesinde kaç tane irrasyonel sayı vardır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0$ rasyonel, $-3$ rasyonel (tam sayı), $\\sqrt{2}$ <strong>irrasyonel</strong>, $\\dfrac{1}{2}$ rasyonel.</p>
      <p class="ales-sol-step">$\\sqrt{9} = 3$ rasyonel. $\\pi$ <strong>irrasyonel</strong>. $0,\\overline{3} = \\dfrac{1}{3}$ rasyonel (devirli ondalık).</p>
      <p class="ales-sol-step">İrrasyonel sayı: <strong>2</strong> ($\\sqrt{2}$ ve $\\pi$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Karma — İki Aralık</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{20}$ ile $\\sqrt{50}$ arasında (her ikisi hariç) kaç tane tam sayı vardır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 30
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$4^{2} = 16,\\; 5^{2} = 25$ ⟹ $\\sqrt{20}$ ile $4$ ile $5$ arası, ama $\\sqrt{20} > 4$.</p>
      <p class="ales-sol-step">$7^{2} = 49,\\; 8^{2} = 64$ ⟹ $\\sqrt{50}$ ile $7$ ile $8$ arası, ama $\\sqrt{50} > 7$.</p>
      <p class="ales-sol-step">Yani $\\sqrt{20} < x < \\sqrt{50}$ koşulunu sağlayan tam sayılar $\\{5, 6, 7\\}$ ⟹ <strong>3 tane</strong>.</p>
      <p class="ales-sol-step"><strong>Doğrula:</strong> $5^{2} = 25 > 20$ ✓, $7^{2} = 49 < 50$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Köklü Sayıları Sadeleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Köklü Sayıları Sadeleştirme</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Tek Köklü Sadeleştirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{50}$ ifadesini $a\\sqrt{b}$ biçiminde ($b$ en küçük) yazarsak hangisi elde edilir?<br><br>
      <strong>A)</strong> $2\\sqrt{5}$ &nbsp; <strong>B)</strong> $5\\sqrt{5}$ &nbsp; <strong>C)</strong> <span class="key">$5\\sqrt{2}$</span> &nbsp; <strong>D)</strong> $25\\sqrt{2}$ &nbsp; <strong>E)</strong> $10\\sqrt{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sqrt{a \\cdot b} = \\sqrt{a} \\cdot \\sqrt{b}$. Tam kare çarpan ayır.</p>
      <p class="ales-sol-step">$50 = 25 \\cdot 2 \\Rightarrow \\sqrt{50} = \\sqrt{25} \\cdot \\sqrt{2} = 5\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $5\\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Toplama — Aynı Köklü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{8} + \\sqrt{18} - \\sqrt{32}$ işleminin sonucu kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">$\\sqrt{2}$</span> &nbsp; <strong>C)</strong> $2\\sqrt{2}$ &nbsp; <strong>D)</strong> $3\\sqrt{2}$ &nbsp; <strong>E)</strong> $\\sqrt{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hepsini $\\sqrt{2}$ cinsinden yaz: $\\sqrt{8} = 2\\sqrt{2}$, $\\sqrt{18} = 3\\sqrt{2}$, $\\sqrt{32} = 4\\sqrt{2}$.</p>
      <p class="ales-sol-step">$2\\sqrt{2} + 3\\sqrt{2} - 4\\sqrt{2} = (2 + 3 - 4)\\sqrt{2} = \\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çarpma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{6} \\cdot \\sqrt{15}$ ifadesini en sade biçimde yazarsak hangisi elde edilir?<br><br>
      <strong>A)</strong> $\\sqrt{21}$ &nbsp; <strong>B)</strong> $\\sqrt{90}$ &nbsp; <strong>C)</strong> <span class="key">$3\\sqrt{10}$</span> &nbsp; <strong>D)</strong> $10\\sqrt{3}$ &nbsp; <strong>E)</strong> $9\\sqrt{10}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{6} \\cdot \\sqrt{15} = \\sqrt{6 \\cdot 15} = \\sqrt{90}$.</p>
      <p class="ales-sol-step">$90 = 9 \\cdot 10 \\Rightarrow \\sqrt{90} = 3\\sqrt{10}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $3\\sqrt{10}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Bölme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sqrt{72}}{\\sqrt{8}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\sqrt{9}$'a eşit fakat irrasyonel &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> $3\\sqrt{8}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Köklü Bölme</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\dfrac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\dfrac{a}{b}}$.</p>
      <p class="ales-sol-step">$\\sqrt{\\dfrac{72}{8}} = \\sqrt{9} = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Payda Rasyonelleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6}{\\sqrt{3}}$ ifadesinde paydayı rasyonelleştirip sadeleştirirsek hangisi elde edilir?<br><br>
      <strong>A)</strong> $\\sqrt{3}$ &nbsp; <strong>B)</strong> $\\sqrt{6}$ &nbsp; <strong>C)</strong> <span class="key">$2\\sqrt{3}$</span> &nbsp; <strong>D)</strong> $3\\sqrt{2}$ &nbsp; <strong>E)</strong> $6\\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay ve paydayı $\\sqrt{3}$ ile çarp: $\\dfrac{6}{\\sqrt{3}} \\cdot \\dfrac{\\sqrt{3}}{\\sqrt{3}} = \\dfrac{6\\sqrt{3}}{3} = 2\\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2\\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Eşlenikle Rasyonelleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{4}{\\sqrt{5} - 1}$ ifadesini sadeleştirirsek hangisi elde edilir?<br><br>
      <strong>A)</strong> $\\sqrt{5} - 1$ &nbsp; <strong>B)</strong> <span class="key">$\\sqrt{5} + 1$</span> &nbsp; <strong>C)</strong> $4\\sqrt{5} + 4$ &nbsp; <strong>D)</strong> $\\sqrt{5}$ &nbsp; <strong>E)</strong> $2\\sqrt{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eşlenik</div>
      <p class="ales-sol-step">Paydanın eşleniği $\\sqrt{5} + 1$. Pay ve paydayı bununla çarp.</p>
      <p class="ales-sol-step">$\\dfrac{4(\\sqrt{5} + 1)}{(\\sqrt{5} - 1)(\\sqrt{5} + 1)} = \\dfrac{4(\\sqrt{5}+1)}{5 - 1} = \\dfrac{4(\\sqrt{5}+1)}{4} = \\sqrt{5} + 1$.</p>
      <p class="ales-sol-step"><strong>Hatırla:</strong> $(a - b)(a + b) = a^{2} - b^{2}$. Köklerde irrasyonel kısmı yok eder.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\sqrt{5} + 1$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Karma Sadeleştirme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = \\sqrt{12} + \\sqrt{27} - \\sqrt{48} + \\sqrt{75}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $4\\sqrt{3}$ &nbsp; <strong>B)</strong> $5\\sqrt{3}$ &nbsp; <strong>C)</strong> <span class="key">$6\\sqrt{3}$</span> &nbsp; <strong>D)</strong> $14\\sqrt{3}$ &nbsp; <strong>E)</strong> $\\sqrt{66}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hepsi $\\sqrt{3}$ cinsinden: $\\sqrt{12} = 2\\sqrt{3}$, $\\sqrt{27} = 3\\sqrt{3}$, $\\sqrt{48} = 4\\sqrt{3}$, $\\sqrt{75} = 5\\sqrt{3}$.</p>
      <p class="ales-sol-step">$A = (2 + 3 - 4 + 5)\\sqrt{3} = 6\\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $6\\sqrt{3}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Karma "Kaç Tanesi Rasyoneldir" Soruları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karma "Kaç Tanesi Rasyoneldir" Tipi Sorular</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Çoklu İfade Analizi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sqrt{3} + 5,\\; \\sqrt{16} + \\sqrt{25},\\; \\sqrt{8} \\cdot \\sqrt{2},\\; \\dfrac{\\sqrt{3}}{\\sqrt{12}}$ ifadelerinden kaç tanesi rasyoneldir?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 0
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tek Tek İncele</div>
      <p class="ales-sol-step"><strong>I.</strong> $\\sqrt{3} + 5$: $\\sqrt{3}$ irr, irr + rat = irr ✗</p>
      <p class="ales-sol-step"><strong>II.</strong> $\\sqrt{16} + \\sqrt{25} = 4 + 5 = 9$ ✓</p>
      <p class="ales-sol-step"><strong>III.</strong> $\\sqrt{8 \\cdot 2} = \\sqrt{16} = 4$ ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> $\\sqrt{3/12} = \\sqrt{1/4} = 1/2$ ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span> (II, III, IV)</div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Şarta Bağlı Rasyonellik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a$ rasyonel, $b$ irrasyonel ise aşağıdakilerden kaç tanesi <strong>her zaman irrasyonel</strong>dir?<br>
      <strong>I.</strong> $a + b$ &nbsp; <strong>II.</strong> $a - b$ &nbsp; <strong>III.</strong> $a \\cdot b$ ($a \\neq 0$) &nbsp; <strong>IV.</strong> $\\dfrac{b}{a}$ ($a \\neq 0$)<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> <span class="key">4</span> &nbsp; <strong>E)</strong> 0
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> rat ± irr = irr. rat ($\\neq 0$) × irr = irr. rat ($\\neq 0$) ÷ irr = irr (paydaya rasyonelleştir, hâlâ irr).</p>
      <p class="ales-sol-step">I, II, III, IV — hepsi <strong>her zaman irrasyonel</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 4</span> (hepsi)</div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İki İrrasyonel İşlem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a$ ve $b$ irrasyonel iseler, aşağıdakilerden hangileri <strong>rasyonel olabilir</strong>?<br>
      <strong>I.</strong> $a + b$ &nbsp; <strong>II.</strong> $a \\cdot b$ &nbsp; <strong>III.</strong> $a / b$<br><br>
      <strong>A)</strong> Yalnız I &nbsp; <strong>B)</strong> Yalnız II &nbsp; <strong>C)</strong> I ve II &nbsp; <strong>D)</strong> II ve III &nbsp; <strong>E)</strong> <span class="key">I, II ve III</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Karşı Örnek Üret</div>
      <p class="ales-sol-step"><strong>I.</strong> $a = \\sqrt{2},\\; b = -\\sqrt{2}$ ⟹ $a + b = 0 \\in \\mathbb{Q}$ ✓ (rasyonel olabilir)</p>
      <p class="ales-sol-step"><strong>II.</strong> $a = \\sqrt{2},\\; b = \\sqrt{2}$ ⟹ $a \\cdot b = 2 \\in \\mathbb{Q}$ ✓</p>
      <p class="ales-sol-step"><strong>III.</strong> $a = \\sqrt{2},\\; b = \\sqrt{2}$ ⟹ $a/b = 1 \\in \\mathbb{Q}$ ✓</p>
      <p class="ales-sol-step"><strong>Sonuç:</strong> Hepsi rasyonel olabilir. (Tabii her zaman değil.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) I, II ve III</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Verilen Kümede Sıralama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $A = \\dfrac{22}{7},\\; B = 3,14,\\; C = \\pi$ sayılarının küçükten büyüğe sıralanışı hangisidir? ($\\pi \\approx 3,14159$)<br><br>
      <strong>A)</strong> $A < B < C$ &nbsp; <strong>B)</strong> $A < C < B$ &nbsp; <strong>C)</strong> <span class="key">$B < C < A$</span> &nbsp; <strong>D)</strong> $C < B < A$ &nbsp; <strong>E)</strong> Üçü eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yaklaşık Değerler</div>
      <p class="ales-sol-step">$A = 22/7 \\approx 3,1428\\dots$ &nbsp; $B = 3,14$ &nbsp; $C = \\pi \\approx 3,14159$</p>
      <p class="ales-sol-step">Sıralama: $3,14 < 3,14159\\dots < 3,1428\\dots$</p>
      <p class="ales-sol-step">Yani $B < C < A$.</p>
      <p class="ales-sol-step"><strong>Tarihsel:</strong> $\\dfrac{22}{7}$ Arşimet'in $\\pi$ üst sınırıdır; gerçek $\\pi$'den biraz büyüktür.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $B < C < A$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Köklü Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = 2\\sqrt{3},\\; b = 3\\sqrt{2},\\; c = \\sqrt{14}$ sayılarını küçükten büyüğe sıralarsak hangisi doğrudur?<br><br>
      <strong>A)</strong> $b < a < c$ &nbsp; <strong>B)</strong> $c < a < b$ &nbsp; <strong>C)</strong> <span class="key">$a < c < b$</span> &nbsp; <strong>D)</strong> $a < b < c$ &nbsp; <strong>E)</strong> Üçü eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Kareleri Karşılaştır</div>
      <p class="ales-sol-step">Hepsi pozitif olduğundan kareleri sıralamak yeterlidir.</p>
      <p class="ales-sol-step">$a^{2} = 4 \\cdot 3 = 12$, $b^{2} = 9 \\cdot 2 = 18$, $c^{2} = 14$.</p>
      <p class="ales-sol-step">$12 < 14 < 18 \\Rightarrow a < c < b$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $a < c < b$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Aralıkta Tam Sayı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = \\sqrt{2} + \\sqrt{8} + \\sqrt{18} + \\sqrt{32}$ değeri hangi iki ardışık tam sayı arasındadır?<br><br>
      <strong>A)</strong> 9 ile 10 &nbsp; <strong>B)</strong> 12 ile 13 &nbsp; <strong>C)</strong> 13 ile 14 &nbsp; <strong>D)</strong> <span class="key">14 ile 15</span> &nbsp; <strong>E)</strong> 19 ile 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sadeleştir: $\\sqrt{2} + 2\\sqrt{2} + 3\\sqrt{2} + 4\\sqrt{2} = 10\\sqrt{2}$.</p>
      <p class="ales-sol-step">$\\sqrt{2} \\approx 1,414$. $10 \\cdot 1,414 = 14,14$.</p>
      <p class="ales-sol-step"><strong>Doğrula:</strong> $(10\\sqrt{2})^{2} = 200$. $14^{2} = 196,\\; 15^{2} = 225$. $196 < 200 < 225 \\Rightarrow 14 < 10\\sqrt{2} < 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 14 ile 15</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Eşlenik + Sıralama</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = \\dfrac{1}{\\sqrt{2}+1},\\; B = \\dfrac{1}{\\sqrt{3}+\\sqrt{2}},\\; C = \\dfrac{1}{2+\\sqrt{3}}$ değerlerinin küçükten büyüğe sıralanışı hangisidir?<br><br>
      <strong>A)</strong> $A < B < C$ &nbsp; <strong>B)</strong> $A < C < B$ &nbsp; <strong>C)</strong> <span class="key">$C < B < A$</span> &nbsp; <strong>D)</strong> $B < C < A$ &nbsp; <strong>E)</strong> Üçü eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eşlenikle Sadeleştir</div>
      <p class="ales-sol-step">$A = \\dfrac{\\sqrt{2}-1}{(\\sqrt{2}+1)(\\sqrt{2}-1)} = \\dfrac{\\sqrt{2}-1}{2-1} = \\sqrt{2}-1 \\approx 0,414$.</p>
      <p class="ales-sol-step">$B = \\dfrac{\\sqrt{3}-\\sqrt{2}}{3-2} = \\sqrt{3}-\\sqrt{2} \\approx 1,732 - 1,414 = 0,318$.</p>
      <p class="ales-sol-step">$C = \\dfrac{2-\\sqrt{3}}{4-3} = 2-\\sqrt{3} \\approx 2 - 1,732 = 0,268$.</p>
      <p class="ales-sol-step">Sıralama: $C < B < A$ &nbsp; ($0,268 < 0,318 < 0,414$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $C < B < A$</span></div>
    </div>
  </div>
</section>
`
};
