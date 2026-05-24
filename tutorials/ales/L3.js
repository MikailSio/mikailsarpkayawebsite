window.ALES_LESSON = {
n: 3,
title: "Rasyonel Sayılar (ℚ)",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>rasyonel sayılar</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Kesir tanımı, denk kesirler, sadeleştirme, paydaları eşitleme, çarpazlama ve karmaşık kesirler her problemde ihtiyaç hissedildikçe açıklanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Kesir, Denk Kesir, Sadeleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Kesir Tanımı, Denk Kesirler ve Sadeleştirme</h2>
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
      <strong>I.</strong> Her tam sayı bir rasyonel sayıdır.<br>
      <strong>II.</strong> $0$ rasyoneldir.<br>
      <strong>III.</strong> $\\dfrac{0}{5}$ tanımsızdır.<br>
      <strong>IV.</strong> $\\dfrac{5}{0}$ tanımsızdır.<br>
      <strong>V.</strong> $\\dfrac{2}{3} = \\dfrac{4}{6}$.<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> hepsi
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Tanım:</strong> $\\mathbb{Q} = \\left\\{ \\dfrac{a}{b} : a \\in \\mathbb{Z},\\; b \\in \\mathbb{Z},\\; b \\neq 0 \\right\\}$.</p>
      <p class="ales-sol-step"><strong>I.</strong> $n = \\dfrac{n}{1}$ ⟹ ✓ &nbsp; <strong>II.</strong> $0 = \\dfrac{0}{1}$ ⟹ ✓ &nbsp; <strong>III.</strong> $0/5 = 0$ tanımlı ✗</p>
      <p class="ales-sol-step"><strong>IV.</strong> Sıfıra bölme tanımsız ✓ &nbsp; <strong>V.</strong> Pay ve paydayı 2 ile çarp ⟹ denk ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span> (I, II, IV, V)</div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Sadeleştirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{84}{126}$ kesrini en sade biçime indirgersek hangisi elde edilir?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{3}{5}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{2}{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{4}{7}$ &nbsp; <strong>E)</strong> $\\dfrac{6}{9}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — EBOB ile</div>
      <p class="ales-sol-step">$84 = 2^{2} \\cdot 3 \\cdot 7$, $126 = 2 \\cdot 3^{2} \\cdot 7$. EBOB $= 2 \\cdot 3 \\cdot 7 = 42$.</p>
      <p class="ales-sol-step">$\\dfrac{84}{126} = \\dfrac{84/42}{126/42} = \\dfrac{2}{3}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Ardışık Sadeleştirme</div>
      <p class="ales-sol-step">$\\dfrac{84}{126} \\stackrel{÷2}{=} \\dfrac{42}{63} \\stackrel{÷3}{=} \\dfrac{14}{21} \\stackrel{÷7}{=} \\dfrac{2}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{2}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Denk Kesir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{3}{7} = \\dfrac{x}{42}$ olduğuna göre $x$ kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> <span class="key">18</span> &nbsp; <strong>D)</strong> 21 &nbsp; <strong>E)</strong> 24
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Payda $7$'den $42$'ye gitmek için $\\times 6$. Aynı çarpan paya da uygulanır.</p>
      <p class="ales-sol-step">$x = 3 \\cdot 6 = 18$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 18</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Bileşik → Tam Sayılı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{47}{6}$ bileşik kesrini tam sayılı kesir olarak yazarsak hangisi elde edilir?<br><br>
      <strong>A)</strong> $6\\dfrac{5}{6}$ &nbsp; <strong>B)</strong> $7\\dfrac{1}{6}$ &nbsp; <strong>C)</strong> $7\\dfrac{4}{6}$ &nbsp; <strong>D)</strong> <span class="key">$7\\dfrac{5}{6}$</span> &nbsp; <strong>E)</strong> $8\\dfrac{1}{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$47 \\div 6$: bölüm $7$, kalan $5$ (çünkü $7 \\cdot 6 = 42$, $47 - 42 = 5$).</p>
      <p class="ales-sol-step">$\\dfrac{47}{6} = 7 \\dfrac{5}{6}$ (yedi tam altıda beş).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $7\\dfrac{5}{6}$</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Ortak Çarpan ile Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6 \\cdot 9 \\cdot 14}{12 \\cdot 7 \\cdot 18}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{4}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{2}$</span> &nbsp; <strong>D)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çapraz Sadeleştirme</div>
      <p class="ales-sol-step">$\\dfrac{6}{12} = \\dfrac{1}{2}$, $\\dfrac{14}{7} = 2$, $\\dfrac{9}{18} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">Çarpım: $\\dfrac{1}{2} \\cdot 2 \\cdot \\dfrac{1}{2} = \\dfrac{1}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Sade Biçim — Denklem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{a}{b}$ kesri en sade biçimiyle $\\dfrac{3}{5}$'tir. $a + b = 56$ olduğuna göre $a \\cdot b$ kaçtır?<br><br>
      <strong>A)</strong> 168 &nbsp; <strong>B)</strong> 525 &nbsp; <strong>C)</strong> 700 &nbsp; <strong>D)</strong> <span class="key">735</span> &nbsp; <strong>E)</strong> 1050
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">En sade biçim $\\dfrac{3}{5}$ ⟹ $a = 3k,\\; b = 5k$ (bir $k$ tam sayısı için).</p>
      <p class="ales-sol-step">$a + b = 3k + 5k = 8k = 56 \\Rightarrow k = 7$.</p>
      <p class="ales-sol-step">$a = 21,\\; b = 35$. $a \\cdot b = 21 \\cdot 35 = 735$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 735</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Devirli Ondalık → Kesir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $0,\\overline{27}$ devirli ondalık sayısını en sade kesir olarak yazarsak hangisi elde edilir?<br><br>
      <strong>A)</strong> $\\dfrac{27}{100}$ &nbsp; <strong>B)</strong> $\\dfrac{27}{99}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{3}{11}$</span> &nbsp; <strong>D)</strong> $\\dfrac{27}{1000}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Klasik Yöntem</div>
      <p class="ales-sol-step">$x = 0,272727\\dots$ Devir uzunluğu $2$ ⟹ $100$ ile çarp: $100x = 27,272727\\dots$</p>
      <p class="ales-sol-step">İkisini taraf tarafa çıkar: $99x = 27 \\Rightarrow x = \\dfrac{27}{99}$.</p>
      <p class="ales-sol-step">Sadeleştir (EBOB $= 9$): $\\dfrac{27}{99} = \\dfrac{3}{11}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Pratik Formül</div>
      <p class="ales-sol-step">Tamamen devirli için: pay $=$ devir, payda $=$ devir uzunluğu kadar $9$ ⟹ $\\dfrac{27}{99} = \\dfrac{3}{11}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{3}{11}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Kesir Karşılaştırma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Kesir Karşılaştırma</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Çarpazlama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{5}{8}$ ile $\\dfrac{7}{11}$ kesirlerinin karşılaştırması hangisidir?<br><br>
      <strong>A)</strong> $\\dfrac{5}{8} > \\dfrac{7}{11}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{5}{8} < \\dfrac{7}{11}$</span> &nbsp; <strong>C)</strong> $\\dfrac{5}{8} = \\dfrac{7}{11}$ &nbsp; <strong>D)</strong> İkisi de $\\dfrac{1}{2}$'den küçük &nbsp; <strong>E)</strong> Karşılaştırılamaz
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpazlama</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\dfrac{a}{b}$ ile $\\dfrac{c}{d}$ karşılaştırmasında $a \\cdot d$ ile $b \\cdot c$ karşılaştırılır.</p>
      <p class="ales-sol-step">$5 \\cdot 11 = 55$ &nbsp; vs &nbsp; $8 \\cdot 7 = 56$.</p>
      <p class="ales-sol-step">$55 < 56$ ⟹ $\\dfrac{5}{8} < \\dfrac{7}{11}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{5}{8} < \\dfrac{7}{11}$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Üç Kesir Sıralama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2}{3},\\; \\dfrac{3}{4},\\; \\dfrac{5}{6}$ kesirlerini küçükten büyüğe sıralarsak hangisi doğrudur?<br><br>
      <strong>A)</strong> $\\dfrac{5}{6} < \\dfrac{3}{4} < \\dfrac{2}{3}$ &nbsp; <strong>B)</strong> $\\dfrac{3}{4} < \\dfrac{2}{3} < \\dfrac{5}{6}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{2}{3} < \\dfrac{3}{4} < \\dfrac{5}{6}$</span> &nbsp; <strong>D)</strong> $\\dfrac{2}{3} < \\dfrac{5}{6} < \\dfrac{3}{4}$ &nbsp; <strong>E)</strong> Üçü de eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Payda</div>
      <p class="ales-sol-step">EKOK$(3, 4, 6) = 12$. $\\dfrac{2}{3} = \\dfrac{8}{12},\\; \\dfrac{3}{4} = \\dfrac{9}{12},\\; \\dfrac{5}{6} = \\dfrac{10}{12}$.</p>
      <p class="ales-sol-step">$8 < 9 < 10$ ⟹ $\\dfrac{2}{3} < \\dfrac{3}{4} < \\dfrac{5}{6}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{2}{3} < \\dfrac{3}{4} < \\dfrac{5}{6}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Eşit Pay — Payda Karşılaştırması</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{5},\\; \\dfrac{1}{8},\\; \\dfrac{1}{3},\\; \\dfrac{1}{12}$ sayılarının en büyüğü hangisidir?<br><br>
      <strong>A)</strong> $\\dfrac{1}{12}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{8}$ &nbsp; <strong>C)</strong> $\\dfrac{1}{5}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{1}{3}$</span> &nbsp; <strong>E)</strong> Hepsi eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Birim Kesir Kuralı</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Payı eşit kesirlerde paydası en küçük olan en büyüktür.</p>
      <p class="ales-sol-step">En küçük payda $3$ ⟹ en büyük $\\dfrac{1}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{1}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Eşit Payda — Pay Karşılaştırması</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x}{15} > \\dfrac{2}{3}$ koşulunu sağlayan kaç tane $x$ pozitif tam sayısı vardır? ($x \\leq 20$.)<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sağ tarafı $15$'lik paydaya getir: $\\dfrac{2}{3} = \\dfrac{10}{15}$.</p>
      <p class="ales-sol-step">$\\dfrac{x}{15} > \\dfrac{10}{15} \\Rightarrow x > 10$. Pozitif tam sayı, $x \\leq 20$ ⟹ $x \\in \\{11, 12, \\dots, 20\\}$.</p>
      <p class="ales-sol-step">Sayı: $20 - 11 + 1 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">1'e Tamamlama Tekniği</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{99}{100},\\; \\dfrac{98}{99},\\; \\dfrac{100}{101}$ kesirlerini büyükten küçüğe sıralarsak hangisi doğrudur?<br><br>
      <strong>A)</strong> $\\dfrac{98}{99} > \\dfrac{99}{100} > \\dfrac{100}{101}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{100}{101} > \\dfrac{99}{100} > \\dfrac{98}{99}$</span> &nbsp; <strong>C)</strong> $\\dfrac{99}{100} > \\dfrac{98}{99} > \\dfrac{100}{101}$ &nbsp; <strong>D)</strong> $\\dfrac{100}{101} > \\dfrac{98}{99} > \\dfrac{99}{100}$ &nbsp; <strong>E)</strong> Üçü de eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümleyene Bak</div>
      <p class="ales-sol-step">Her kesri $1$'den çıkar: $1 - \\dfrac{99}{100} = \\dfrac{1}{100}$, $1 - \\dfrac{98}{99} = \\dfrac{1}{99}$, $1 - \\dfrac{100}{101} = \\dfrac{1}{101}$.</p>
      <p class="ales-sol-step">Tümleyenler küçükten büyüğe: $\\dfrac{1}{101} < \\dfrac{1}{100} < \\dfrac{1}{99}$.</p>
      <p class="ales-sol-step"><strong>Tümleyen küçükse asıl büyüktür</strong> ⟹ $\\dfrac{100}{101} > \\dfrac{99}{100} > \\dfrac{98}{99}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{100}{101} > \\dfrac{99}{100} > \\dfrac{98}{99}$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Negatif Kesir Sıralama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-\\dfrac{4}{7},\\; -\\dfrac{3}{5},\\; -\\dfrac{5}{9}$ kesirlerini büyükten küçüğe sıralarsak hangisi doğrudur?<br><br>
      <strong>A)</strong> $-\\dfrac{3}{5} > -\\dfrac{4}{7} > -\\dfrac{5}{9}$ &nbsp; <strong>B)</strong> $-\\dfrac{4}{7} > -\\dfrac{5}{9} > -\\dfrac{3}{5}$ &nbsp; <strong>C)</strong> <span class="key">$-\\dfrac{5}{9} > -\\dfrac{4}{7} > -\\dfrac{3}{5}$</span> &nbsp; <strong>D)</strong> $-\\dfrac{5}{9} > -\\dfrac{3}{5} > -\\dfrac{4}{7}$ &nbsp; <strong>E)</strong> Üçü de eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pozitif hâllerini çarpazla: $\\dfrac{4}{7}$ vs $\\dfrac{3}{5}$ ⟹ $4 \\cdot 5 = 20$, $7 \\cdot 3 = 21$. $20 < 21$ ⟹ $\\dfrac{4}{7} < \\dfrac{3}{5}$.</p>
      <p class="ales-sol-step">$\\dfrac{3}{5}$ vs $\\dfrac{5}{9}$ ⟹ $27$ vs $25$ ⟹ $\\dfrac{3}{5} > \\dfrac{5}{9}$. $\\dfrac{4}{7}$ vs $\\dfrac{5}{9}$ ⟹ $36$ vs $35$ ⟹ $\\dfrac{4}{7} > \\dfrac{5}{9}$.</p>
      <p class="ales-sol-step">Pozitif sıralama: $\\dfrac{5}{9} < \\dfrac{4}{7} < \\dfrac{3}{5}$. Negatife çevir, işaret döner: $-\\dfrac{3}{5} < -\\dfrac{4}{7} < -\\dfrac{5}{9}$.</p>
      <p class="ales-sol-step">Büyükten küçüğe: $-\\dfrac{5}{9} > -\\dfrac{4}{7} > -\\dfrac{3}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-\\dfrac{5}{9} > -\\dfrac{4}{7} > -\\dfrac{3}{5}$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Birim Kesir Toplamı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{2} + \\dfrac{1}{3} + \\dfrac{1}{6}$ toplamı kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{6}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> $\\dfrac{5}{6}$ &nbsp; <strong>D)</strong> <span class="key">1</span> &nbsp; <strong>E)</strong> $\\dfrac{3}{11}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EKOK$(2, 3, 6) = 6$. Her kesri $6$'lık paydaya çevir.</p>
      <p class="ales-sol-step">$\\dfrac{1}{2} = \\dfrac{3}{6},\\; \\dfrac{1}{3} = \\dfrac{2}{6},\\; \\dfrac{1}{6} = \\dfrac{1}{6}$.</p>
      <p class="ales-sol-step">Toplam: $\\dfrac{3 + 2 + 1}{6} = \\dfrac{6}{6} = 1$.</p>
      <p class="ales-sol-step"><strong>Tarihi not:</strong> $\\dfrac{1}{2} + \\dfrac{1}{3} + \\dfrac{1}{6} = 1$ — Mısırlıların "miras paylaştırma" formülü.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 1</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Karmaşık Kesirler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karmaşık Kesirler ve Bileşik Kesir İşlemleri</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Tek Kat Karmaşık</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\;\\dfrac{2}{5}\\;}{\\;\\dfrac{3}{4}\\;}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{6}{20}$ &nbsp; <strong>B)</strong> $\\dfrac{15}{8}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{8}{15}$</span> &nbsp; <strong>D)</strong> $\\dfrac{5}{12}$ &nbsp; <strong>E)</strong> $\\dfrac{8}{20}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\dfrac{a/b}{c/d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c} = \\dfrac{a \\cdot d}{b \\cdot c}$.</p>
      <p class="ales-sol-step">$\\dfrac{2/5}{3/4} = \\dfrac{2}{5} \\cdot \\dfrac{4}{3} = \\dfrac{8}{15}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{8}{15}$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">a/(b/c) Tipi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6}{\\;\\dfrac{2}{5}\\;}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{12}{5}$ &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 12 &nbsp; <strong>D)</strong> <span class="key">15</span> &nbsp; <strong>E)</strong> 30
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$6 \\div \\dfrac{2}{5} = 6 \\cdot \\dfrac{5}{2} = \\dfrac{30}{2} = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 15</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İki Kat Karmaşık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{1 + \\dfrac{1}{2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{2}{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{3}{2}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçten Dışa</div>
      <p class="ales-sol-step">Önce paydadaki toplamı hesapla: $1 + \\dfrac{1}{2} = \\dfrac{2 + 1}{2} = \\dfrac{3}{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{3/2} = 1 \\cdot \\dfrac{2}{3} = \\dfrac{2}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{2}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Üç Kat Karmaşık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{2 - \\dfrac{1}{1 + \\dfrac{1}{2}}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{3}{4}$</span> &nbsp; <strong>D)</strong> $\\dfrac{4}{3}$ &nbsp; <strong>E)</strong> $\\dfrac{3}{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — En İçten Başla</div>
      <p class="ales-sol-step">En içte: $1 + \\dfrac{1}{2} = \\dfrac{3}{2}$.</p>
      <p class="ales-sol-step">Sonra: $\\dfrac{1}{3/2} = \\dfrac{2}{3}$.</p>
      <p class="ales-sol-step">Sonra: $2 - \\dfrac{2}{3} = \\dfrac{6 - 2}{3} = \\dfrac{4}{3}$.</p>
      <p class="ales-sol-step">En dış: $\\dfrac{1}{4/3} = \\dfrac{3}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{3}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Pay/Payda Eşit Çarpan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\dfrac{2}{3} + \\dfrac{3}{4}}{\\dfrac{5}{6} - \\dfrac{1}{2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{4}{17}$ &nbsp; <strong>B)</strong> $\\dfrac{17}{8}$ &nbsp; <strong>C)</strong> $\\dfrac{15}{4}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{17}{4}$</span> &nbsp; <strong>E)</strong> $\\dfrac{19}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hem Pay Hem Paydaya 12 ile Çarp</div>
      <p class="ales-sol-step">Tüm payda ve paylardaki paydaların EKOK'u $= 12$. Pay ve paydayı 12 ile çarp:</p>
      <p class="ales-sol-step">Pay: $12 \\cdot \\dfrac{2}{3} + 12 \\cdot \\dfrac{3}{4} = 8 + 9 = 17$.</p>
      <p class="ales-sol-step">Payda: $12 \\cdot \\dfrac{5}{6} - 12 \\cdot \\dfrac{1}{2} = 10 - 6 = 4$.</p>
      <p class="ales-sol-step">Sonuç: $\\dfrac{17}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{17}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Bilinmeyenli Karmaşık</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{1 + \\dfrac{1}{x}} = \\dfrac{2}{3}$ olduğuna göre $x$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Karşılıklarını al: $1 + \\dfrac{1}{x} = \\dfrac{3}{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{x} = \\dfrac{3}{2} - 1 = \\dfrac{1}{2}$ ⟹ $x = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 2</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sürekli Kesir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = 1 + \\dfrac{1}{1 + \\dfrac{1}{1 + \\dfrac{1}{2}}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{5}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{8}{5}$</span> &nbsp; <strong>D)</strong> $\\dfrac{13}{8}$ &nbsp; <strong>E)</strong> 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — En İçten Dışarıya</div>
      <p class="ales-sol-step">En iç: $1 + \\dfrac{1}{2} = \\dfrac{3}{2}$.</p>
      <p class="ales-sol-step">Bir üst kat: $1 + \\dfrac{1}{3/2} = 1 + \\dfrac{2}{3} = \\dfrac{5}{3}$.</p>
      <p class="ales-sol-step">Bir üst kat: $1 + \\dfrac{1}{5/3} = 1 + \\dfrac{3}{5} = \\dfrac{8}{5}$.</p>
      <p class="ales-sol-step"><strong>Not:</strong> $1, \\dfrac{3}{2}, \\dfrac{5}{3}, \\dfrac{8}{5}$ — bunlar Fibonacci dizisinden gelen ünlü "altın oran yakınsama" kesirleridir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{8}{5}$</span></div>
    </div>
  </div>
</section>
`
};
