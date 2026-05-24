window.ALES_LESSON = {
n: 11,
title: "Üslü Sayılar — Tanım ve Temel Kurallar",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>üslü sayıların temel kuralları</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $a^{m} \\cdot a^{n} = a^{m+n}$, $\\dfrac{a^{m}}{a^{n}} = a^{m-n}$, $(a^{m})^{n} = a^{mn}$ gibi temel kuralları çözüm içinde uygulamalı görüyoruz. Her problemi önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Üs Özellikleri (Çarpma, Bölme, Üssün Üssü)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Üs Özellikleri: Çarpma, Bölme, Üssün Üssü</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Aynı Tabanda Çarpım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{5} \\cdot 2^{3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 220 &nbsp; <strong>B)</strong> 255 &nbsp; <strong>C)</strong> <span class="key">256</span> &nbsp; <strong>D)</strong> 292 &nbsp; <strong>E)</strong> 268
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $a^{m} \\cdot a^{n} = a^{m+n}$ — taban aynıysa üsler toplanır.</p>
      <p class="ales-sol-step">$2^{5} \\cdot 2^{3} = 2^{5+3} = 2^{8} = 256$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 256</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Aynı Tabanda Bölüm</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{3^{10}}{3^{7}}$ değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">27</span> &nbsp; <strong>B)</strong> 24 &nbsp; <strong>C)</strong> 30 &nbsp; <strong>D)</strong> 17 &nbsp; <strong>E)</strong> 22
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\dfrac{a^{m}}{a^{n}} = a^{m-n}$.</p>
      <p class="ales-sol-step">$\\dfrac{3^{10}}{3^{7}} = 3^{10-7} = 3^{3} = 27$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 27</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Üssün Üssü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(2^{3})^{4}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 4708 &nbsp; <strong>B)</strong> 4106 &nbsp; <strong>C)</strong> 3688 &nbsp; <strong>D)</strong> <span class="key">4096</span> &nbsp; <strong>E)</strong> 3484
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $(a^{m})^{n} = a^{m \\cdot n}$ — üsler çarpılır.</p>
      <p class="ales-sol-step">$(2^{3})^{4} = 2^{12} = 4096$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 4096</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Aynı Tabanda Toplam Tuzağı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2^{8} + 2^{8}$ ifadesinin değeri aşağıdakilerden hangisidir?<br><br>
      <strong>A)</strong> $2^{16}$ &nbsp; <strong>B)</strong> $4^{8}$ &nbsp; <strong>C)</strong> <span class="key">$2^{9}$</span> &nbsp; <strong>D)</strong> $2^{64}$ &nbsp; <strong>E)</strong> $2^{8}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Tuzak:</strong> Üsler <em>toplanmaz</em>; sadece çarpımda toplanır. Toplamda <strong>ortak çarpan</strong> alınır.</p>
      <p class="ales-sol-step">$2^{8} + 2^{8} = 2 \\cdot 2^{8} = 2^{1+8} = 2^{9} = 512$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2^{9} = 512$</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Karma Çarpım/Bölüm</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2^{6} \\cdot 2^{4}}{2^{7}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 13 &nbsp; <strong>B)</strong> <span class="key">8</span> &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $2^{6} \\cdot 2^{4} = 2^{10}$.</p>
      <p class="ales-sol-step">Bölüm: $\\dfrac{2^{10}}{2^{7}} = 2^{3} = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 8</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Üssün Üssü Sentezi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{(3^{2})^{5}}{3^{8}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> <span class="key">9</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $(3^{2})^{5} = 3^{10}$.</p>
      <p class="ales-sol-step">$\\dfrac{3^{10}}{3^{8}} = 3^{2} = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 9</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Üs Denklemi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $2^{x} \\cdot 2^{x+1} = 2^{11}$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sol taraf: $2^{x} \\cdot 2^{x+1} = 2^{x + (x+1)} = 2^{2x+1}$.</p>
      <p class="ales-sol-step">Tabanlar eşit ⟹ üsler eşit: $2x + 1 = 11 \\Rightarrow x = 5$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrula</div>
      <p class="ales-sol-step">$x = 5$: $2^{5} \\cdot 2^{6} = 32 \\cdot 64 = 2048 = 2^{11}$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Çarpım ve Bölüm Üsleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Çarpım ve Bölüm Üsleri: $(ab)^{n}$ ve $(a/b)^{n}$</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Çarpımın Üssü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(2 \\cdot 3)^{4}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 1297 &nbsp; <strong>B)</strong> 1168 &nbsp; <strong>C)</strong> 1424 &nbsp; <strong>D)</strong> <span class="key">1296</span> &nbsp; <strong>E)</strong> 1104
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $(ab)^{n} = a^{n} b^{n}$.</p>
      <p class="ales-sol-step">$(2 \\cdot 3)^{4} = 2^{4} \\cdot 3^{4} = 16 \\cdot 81 = 1296$.</p>
      <p class="ales-sol-step">Veya doğrudan: $6^{4} = 1296$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 1296</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Bölümün Üssü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\left(\\dfrac{2}{5}\\right)^{3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{6}{15}$ &nbsp; <strong>B)</strong> $\\dfrac{6}{125}$ &nbsp; <strong>C)</strong> $\\dfrac{8}{15}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{8}{125}$</span> &nbsp; <strong>E)</strong> $\\dfrac{2}{125}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\left(\\dfrac{a}{b}\\right)^{n} = \\dfrac{a^{n}}{b^{n}}$.</p>
      <p class="ales-sol-step">$\\left(\\dfrac{2}{5}\\right)^{3} = \\dfrac{2^{3}}{5^{3}} = \\dfrac{8}{125}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{8}{125}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çarpımın Üssü Açma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $6^{5}$ ifadesi $2$ ve $3$ tabanları cinsinden nasıl yazılır?<br><br>
      <strong>A)</strong> $2^{5} + 3^{5}$ &nbsp; <strong>B)</strong> $2^{6} \\cdot 3^{6}$ &nbsp; <strong>C)</strong> <span class="key">$2^{5} \\cdot 3^{5}$</span> &nbsp; <strong>D)</strong> $2^{10} \\cdot 3^{10}$ &nbsp; <strong>E)</strong> $2 \\cdot 3^{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$6 = 2 \\cdot 3$ ⟹ $6^{5} = (2 \\cdot 3)^{5} = 2^{5} \\cdot 3^{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2^{5} \\cdot 3^{5}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Çarpım Üssü ile Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{12^{4}}{4^{4}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">81</span> &nbsp; <strong>B)</strong> 78 &nbsp; <strong>C)</strong> 82 &nbsp; <strong>D)</strong> 79 &nbsp; <strong>E)</strong> 91
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üsler eşit ⟹ <strong>tabanları bölebiliriz</strong>: $\\dfrac{a^{n}}{b^{n}} = \\left(\\dfrac{a}{b}\\right)^{n}$.</p>
      <p class="ales-sol-step">$\\dfrac{12^{4}}{4^{4}} = \\left(\\dfrac{12}{4}\\right)^{4} = 3^{4} = 81$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 81</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Karma Çarpım Üssü</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{15^{3} \\cdot 2^{6}}{6^{3}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1000</span> &nbsp; <strong>B)</strong> 1250 &nbsp; <strong>C)</strong> 1100 &nbsp; <strong>D)</strong> 1001 &nbsp; <strong>E)</strong> 1010
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$15 = 3 \\cdot 5$ ve $6 = 2 \\cdot 3$ ⟹ $15^{3} = 3^{3} \\cdot 5^{3}$, $6^{3} = 2^{3} \\cdot 3^{3}$.</p>
      <p class="ales-sol-step">$\\dfrac{3^{3} \\cdot 5^{3} \\cdot 2^{6}}{2^{3} \\cdot 3^{3}} = \\dfrac{5^{3} \\cdot 2^{6}}{2^{3}} = 5^{3} \\cdot 2^{3} = 125 \\cdot 8 = 1000$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — $10^{3}$ Tanıma</div>
      <p class="ales-sol-step">$5^{3} \\cdot 2^{3} = (5 \\cdot 2)^{3} = 10^{3} = 1000$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1000</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Bölüm Üssü Denklemi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\left(\\dfrac{x}{2}\\right)^{4} = 81$ ise pozitif $x$ kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 12 &nbsp; <strong>D)</strong> <span class="key">6</span> &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{x^{4}}{16} = 81 \\Rightarrow x^{4} = 1296$.</p>
      <p class="ales-sol-step">$1296 = 6^{4}$ (çünkü $6^{2} = 36$, $36^{2} = 1296$). ⟹ $x = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 6</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Çarpım Üssü Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{18^{5}}{2^{5} \\cdot 3^{8}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> 12 &nbsp; <strong>D)</strong> <span class="key">9</span> &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$18 = 2 \\cdot 3^{2}$ ⟹ $18^{5} = 2^{5} \\cdot 3^{10}$.</p>
      <p class="ales-sol-step">$\\dfrac{2^{5} \\cdot 3^{10}}{2^{5} \\cdot 3^{8}} = 3^{10-8} = 3^{2} = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 9</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Karma Sadeleştirme + Üsle Çarpan Ayırma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karma Sadeleştirme ve Üsle Çarpan Ayırma</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Ortak Çarpan Ayırma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3^{10} + 3^{10} + 3^{10}$ ifadesinin değeri aşağıdakilerden hangisidir?<br><br>
      <strong>A)</strong> $3^{30}$ &nbsp; <strong>B)</strong> $9^{10}$ &nbsp; <strong>C)</strong> $3^{13}$ &nbsp; <strong>D)</strong> <span class="key">$3^{11}$</span> &nbsp; <strong>E)</strong> $3^{10}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aynı terimden 3 tane: $3 \\cdot 3^{10} = 3^{1+10} = 3^{11}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $3^{11}$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Toplam — Ortak Üs</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{8} + 2^{8} + 2^{8} + 2^{8}$ ifadesi aşağıdakilerden hangisine eşittir?<br><br>
      <strong>A)</strong> $2^{32}$ &nbsp; <strong>B)</strong> $8^{8}$ &nbsp; <strong>C)</strong> $2^{12}$ &nbsp; <strong>D)</strong> $2^{11}$ &nbsp; <strong>E)</strong> <span class="key">$2^{10}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$4 \\cdot 2^{8} = 2^{2} \\cdot 2^{8} = 2^{10}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $2^{10} = 1024$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Farklı Üslerde Ortak Çarpan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2^{12} + 2^{10}$ ifadesi aşağıdakilerden hangisine eşittir?<br><br>
      <strong>A)</strong> $2^{22}$ &nbsp; <strong>B)</strong> $3 \\cdot 2^{10}$ &nbsp; <strong>C)</strong> <span class="key">$5 \\cdot 2^{10}$</span> &nbsp; <strong>D)</strong> $5 \\cdot 2^{12}$ &nbsp; <strong>E)</strong> $2^{11}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Küçük üssü ortak çarpan al: $2^{10}(2^{2} + 1) = 2^{10} \\cdot 5$.</p>
      <p class="ales-sol-step">Sayısal: $1024 \\cdot 5 = 5120$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $5 \\cdot 2^{10} = 5120$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Sadeleştirme — Ortak Çarpan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2^{15} + 2^{14}}{2^{13}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> <span class="key">6</span> &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Çarpan</div>
      <p class="ales-sol-step">Pay: $2^{14}(2 + 1) = 3 \\cdot 2^{14}$.</p>
      <p class="ales-sol-step">$\\dfrac{3 \\cdot 2^{14}}{2^{13}} = 3 \\cdot 2 = 6$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Terim Terim Bölme</div>
      <p class="ales-sol-step">$\\dfrac{2^{15}}{2^{13}} + \\dfrac{2^{14}}{2^{13}} = 2^{2} + 2^{1} = 4 + 2 = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 6</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Karma Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6^{6}}{2^{6} \\cdot 3^{4}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> <span class="key">9</span> &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$6^{6} = (2 \\cdot 3)^{6} = 2^{6} \\cdot 3^{6}$.</p>
      <p class="ales-sol-step">$\\dfrac{2^{6} \\cdot 3^{6}}{2^{6} \\cdot 3^{4}} = 3^{2} = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 9</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">İki Farklı Tabanın Toplamı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{3^{10} + 3^{9}}{3^{9} - 3^{8}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">6</span> &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pay ve Paydada Ortak Çarpan</div>
      <p class="ales-sol-step">Pay: $3^{9}(3 + 1) = 4 \\cdot 3^{9}$.</p>
      <p class="ales-sol-step">Payda: $3^{8}(3 - 1) = 2 \\cdot 3^{8}$.</p>
      <p class="ales-sol-step">$\\dfrac{4 \\cdot 3^{9}}{2 \\cdot 3^{8}} = \\dfrac{4}{2} \\cdot 3^{9-8} = 2 \\cdot 3 = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 6</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Çarpan Ayırma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $5^{x+2} - 5^{x} = 600$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> <span class="key">2</span> &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ortak çarpan $5^{x}$: $5^{x}(5^{2} - 1) = 5^{x} \\cdot 24 = 600$.</p>
      <p class="ales-sol-step">$5^{x} = \\dfrac{600}{24} = 25 = 5^{2} \\Rightarrow x = 2$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrula</div>
      <p class="ales-sol-step">$x = 2$: $5^{4} - 5^{2} = 625 - 25 = 600$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 2</span></div>
    </div>
  </div>
</section>
`
};
