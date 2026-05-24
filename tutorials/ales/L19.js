window.ALES_LESSON = {
n: 19,
title: "Ondalık Sayılar ve Devirli Açılım",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>ondalık sayılar ve devirli ondalıklar</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. "9'lar tekniği" ile devirli ondalıkları kesre çevirmeyi refleks haline getireceksin.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Ondalık ↔ Kesir Dönüşümü
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Ondalık ↔ Kesir Dönüşümü</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Ondalık → Kesir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $0.75$ ondalık sayısını en sade kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{75}{100}$ &nbsp; <strong>B)</strong> $\\dfrac{7}{5}$ &nbsp; <strong>C)</strong> $\\dfrac{15}{20}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{3}{4}$</span> &nbsp; <strong>E)</strong> $\\dfrac{4}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Virgülden sonra 2 basamak ⟹ payda $100$. $0.75 = \\dfrac{75}{100}$.</p>
      <p class="ales-sol-step">EBOB$(75,100) = 25$ ile sadeleştir: $\\dfrac{75 \\div 25}{100 \\div 25} = \\dfrac{3}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{3}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Kesir → Ondalık</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{7}{8}$ kesrini ondalık biçimde yazınız.<br><br>
      <strong>A)</strong> 0.4375 &nbsp; <strong>B)</strong> 1.875 &nbsp; <strong>C)</strong> <span class="key">0.875</span> &nbsp; <strong>D)</strong> 1.075 &nbsp; <strong>E)</strong> 0.975
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Paydayı 10'un kuvvetine çevir</div>
      <p class="ales-sol-step">$8 \\cdot 125 = 1000$ ⟹ $\\dfrac{7}{8} = \\dfrac{7 \\cdot 125}{1000} = \\dfrac{875}{1000} = 0.875$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Bölme</div>
      <p class="ales-sol-step">$7 \\div 8 = 0.875$ (sonlu).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 0.875</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Ondalık → Kesir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $1.25$ ondalık sayısını bileşik kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{25}{4}$ &nbsp; <strong>B)</strong> $\\dfrac{4}{5}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{5}{4}$</span> &nbsp; <strong>D)</strong> $\\dfrac{125}{4}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1.25 = \\dfrac{125}{100}$. EBOB $= 25$ ⟹ $\\dfrac{5}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{5}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Sıralama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.6, \\; \\dfrac{2}{3}, \\; 0.65$ sayılarını küçükten büyüğe sıralayın.<br><br>
      <strong>A)</strong> $\\dfrac{2}{3} < 0.6 < 0.65$ &nbsp; <strong>B)</strong> $0.65 < 0.6 < \\dfrac{2}{3}$ &nbsp; <strong>C)</strong> <span class="key">$0.6 < 0.65 < \\dfrac{2}{3}$</span> &nbsp; <strong>D)</strong> $0.6 < \\dfrac{2}{3} < 0.65$ &nbsp; <strong>E)</strong> $\\dfrac{2}{3} < 0.65 < 0.6$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hepsini Ondalığa Çevir</div>
      <p class="ales-sol-step">$\\dfrac{2}{3} = 0.666\\dots$</p>
      <p class="ales-sol-step">Karşılaştır: $0.6 < 0.65 < 0.666\\dots$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $0.6 < 0.65 < \\dfrac{2}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Toplama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.4 + 0.25 + \\dfrac{1}{5}$ kaçtır?<br><br>
      <strong>A)</strong> 1.35 &nbsp; <strong>B)</strong> 0.425 &nbsp; <strong>C)</strong> 1.05 &nbsp; <strong>D)</strong> 0.75 &nbsp; <strong>E)</strong> <span class="key">0.85</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hepsini Ondalığa Çevir</div>
      <p class="ales-sol-step">$\\dfrac{1}{5} = 0.2$.</p>
      <p class="ales-sol-step">$0.4 + 0.25 + 0.2 = 0.85$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hepsini Kesre Çevir</div>
      <p class="ales-sol-step">$0.4 = \\dfrac{2}{5}, \\; 0.25 = \\dfrac{1}{4}, \\; \\dfrac{1}{5}$. EKOK $= 20$. $\\dfrac{8 + 5 + 4}{20} = \\dfrac{17}{20} = 0.85$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 0.85</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Çarpma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.4 \\cdot 1.5$ kaçtır?<br><br>
      <strong>A)</strong> 0.4 &nbsp; <strong>B)</strong> 1.6 &nbsp; <strong>C)</strong> 0.3 &nbsp; <strong>D)</strong> 1.2 &nbsp; <strong>E)</strong> <span class="key">0.6</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Virgülleri yok say: $4 \\cdot 15 = 60$.</p>
      <p class="ales-sol-step">Toplam virgülden sonra basamak sayısı: $1 + 1 = 2$. ⟹ $0.60 = 0.6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 0.6</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Bölme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{0.36}{0.4}$ kaçtır?<br><br>
      <strong>A)</strong> 0.4 &nbsp; <strong>B)</strong> 0.7 &nbsp; <strong>C)</strong> <span class="key">0.9</span> &nbsp; <strong>D)</strong> 1.9 &nbsp; <strong>E)</strong> 1.1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pay-Payda 100 ile Çarpma</div>
      <p class="ales-sol-step">Pay ve paydayı $100$ ile çarp ⟹ $\\dfrac{36}{40} = \\dfrac{9}{10} = 0.9$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Kesirle</div>
      <p class="ales-sol-step">$0.36 = \\dfrac{36}{100} = \\dfrac{9}{25}$ ve $0.4 = \\dfrac{2}{5}$. $\\dfrac{9}{25} \\div \\dfrac{2}{5} = \\dfrac{9}{25} \\cdot \\dfrac{5}{2} = \\dfrac{9}{10}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 0.9</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Devirli Ondalık → Kesir (9'lar Tekniği)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Devirli Ondalık → Kesir (9'lar Tekniği)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Tek Basamak Devir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $0.\\overline{3} = 0.3333\\dots$ sayısını kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{3}{10}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{30}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{3}{100}$ &nbsp; <strong>E)</strong> $\\dfrac{2}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — 9'lar Tekniği</div>
      <p class="ales-sol-step">Tek basamak devir ⟹ payda $9$. $0.\\overline{3} = \\dfrac{3}{9} = \\dfrac{1}{3}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Cebirsel İspat</div>
      <p class="ales-sol-step">$x = 0.333\\dots$ ⟹ $10x = 3.333\\dots$. Çıkar: $9x = 3 \\Rightarrow x = \\dfrac{1}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">İki Basamak Devir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $0.\\overline{12} = 0.121212\\dots$ sayısını kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{12}{100}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{4}{33}$</span> &nbsp; <strong>C)</strong> $\\dfrac{12}{9}$ &nbsp; <strong>D)</strong> $\\dfrac{1}{12}$ &nbsp; <strong>E)</strong> $\\dfrac{6}{99}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — 9'lar Tekniği</div>
      <p class="ales-sol-step">İki basamak devir ⟹ payda iki tane $9$ yani $99$. $0.\\overline{12} = \\dfrac{12}{99} = \\dfrac{4}{33}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Cebirsel İspat</div>
      <p class="ales-sol-step">$x = 0.121212\\dots$ ⟹ $100x = 12.121212\\dots$. Çıkar: $99x = 12 \\Rightarrow x = \\dfrac{12}{99} = \\dfrac{4}{33}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{4}{33}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üç Basamak Devir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $0.\\overline{135}$ sayısını kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{135}{1000}$ &nbsp; <strong>B)</strong> $\\dfrac{27}{200}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{5}{37}$</span> &nbsp; <strong>D)</strong> $\\dfrac{135}{99}$ &nbsp; <strong>E)</strong> $\\dfrac{15}{37}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üç basamak devir ⟹ payda $999$. $0.\\overline{135} = \\dfrac{135}{999}$.</p>
      <p class="ales-sol-step">EBOB$(135, 999) = 27$. $\\dfrac{135 \\div 27}{999 \\div 27} = \\dfrac{5}{37}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{5}{37}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Tam Kısımlı Devir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2.\\overline{6} = 2.6666\\dots$ sayısını kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{26}{9}$ &nbsp; <strong>B)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>C)</strong> $\\dfrac{7}{3}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{8}{3}$</span> &nbsp; <strong>E)</strong> $\\dfrac{13}{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2.\\overline{6} = 2 + 0.\\overline{6} = 2 + \\dfrac{6}{9} = 2 + \\dfrac{2}{3}$.</p>
      <p class="ales-sol-step">$\\dfrac{6}{3} + \\dfrac{2}{3} = \\dfrac{8}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{8}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Toplama (Devirli)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.\\overline{3} + 0.\\overline{6}$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1</span> &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0.\\overline{3} = \\dfrac{1}{3}$ ve $0.\\overline{6} = \\dfrac{6}{9} = \\dfrac{2}{3}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{3} + \\dfrac{2}{3} = \\dfrac{3}{3} = 1$.</p>
      <p class="ales-sol-step">İlginç gözlem: $0.\\overline{9} = 1$ olduğunu da gösteriyor.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Çarpma (Devirli)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.\\overline{2} \\cdot 0.\\overline{27}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{5}{99}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{33}$ &nbsp; <strong>C)</strong> $\\dfrac{29}{99}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{2}{33}$</span> &nbsp; <strong>E)</strong> $\\dfrac{4}{33}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0.\\overline{2} = \\dfrac{2}{9}$ ve $0.\\overline{27} = \\dfrac{27}{99} = \\dfrac{3}{11}$.</p>
      <p class="ales-sol-step">$\\dfrac{2}{9} \\cdot \\dfrac{3}{11}$. $3$ ile $9 \\to 1, 3$. $\\dfrac{2 \\cdot 1}{3 \\cdot 11} = \\dfrac{2}{33}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{2}{33}$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Devir Eşitliği</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $0.\\overline{a} = \\dfrac{4}{9}$ ise $a$ kaçtır?<br><br>
      <strong>A)</strong> $9$ &nbsp; <strong>B)</strong> $5$ &nbsp; <strong>C)</strong> <span class="key">$4$</span> &nbsp; <strong>D)</strong> $36$ &nbsp; <strong>E)</strong> $2$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tek basamak devir formülü: $0.\\overline{a} = \\dfrac{a}{9}$.</p>
      <p class="ales-sol-step">$\\dfrac{a}{9} = \\dfrac{4}{9} \\Rightarrow a = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $a = 4$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Karışık Devirli ve Ondalık İşlemler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karışık Devirli ve Ondalık İşlemler</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Karışık Devirli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $0.1\\overline{6} = 0.16666\\dots$ sayısını kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{1}{16}$ &nbsp; <strong>B)</strong> $\\dfrac{16}{99}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{6}$</span> &nbsp; <strong>D)</strong> $\\dfrac{16}{90}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{60}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Karışık Devirli Formülü</div>
      <p class="ales-sol-step">Formül: $\\dfrac{\\overline{(\\text{tum basamaklar})} - \\overline{(\\text{devre girmeyen basamaklar})}}{\\underbrace{99\\dots9}_{\\text{devirli basamak sayisi}}\\underbrace{00\\dots0}_{\\text{devre girmeyen basamak sayisi}}}$.</p>
      <p class="ales-sol-step">Burada tüm basamaklar $16$, devre girmeyen $1$. Devir 1 basamak (6), devre girmeyen 1 basamak (1).</p>
      <p class="ales-sol-step">$\\dfrac{16 - 1}{90} = \\dfrac{15}{90} = \\dfrac{1}{6}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Cebirsel</div>
      <p class="ales-sol-step">$x = 0.1666\\dots$ ⟹ $10x = 1.666\\dots$ ve $100x = 16.666\\dots$. $100x - 10x = 90x = 15 \\Rightarrow x = \\dfrac{15}{90} = \\dfrac{1}{6}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{6}$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Karışık Devirli</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.2\\overline{3} = 0.2333\\dots$ sayısını kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{23}{99}$ &nbsp; <strong>B)</strong> $\\dfrac{23}{90}$ &nbsp; <strong>C)</strong> $\\dfrac{2}{30}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{7}{30}$</span> &nbsp; <strong>E)</strong> $\\dfrac{21}{99}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tüm basamaklar: $23$. Devre girmeyen: $2$. Payda: $1$ tane $9$ ve $1$ tane $0$ ⟹ $90$.</p>
      <p class="ales-sol-step">$0.2\\overline{3} = \\dfrac{23 - 2}{90} = \\dfrac{21}{90} = \\dfrac{7}{30}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{7}{30}$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Karışık Devirli — İki Devre Girmeyen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.12\\overline{45} = 0.124545\\dots$ sayısını kesir olarak yazınız.<br><br>
      <strong>A)</strong> $\\dfrac{1245}{9999}$ &nbsp; <strong>B)</strong> $\\dfrac{1245}{9900}$ &nbsp; <strong>C)</strong> $\\dfrac{1245}{1000}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{137}{1100}$</span> &nbsp; <strong>E)</strong> $\\dfrac{137}{999}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tüm basamaklar: $1245$. Devre girmeyen: $12$. Devirli 2 basamak (45), devre girmeyen 2 basamak (12). Payda: $9900$.</p>
      <p class="ales-sol-step">$0.12\\overline{45} = \\dfrac{1245 - 12}{9900} = \\dfrac{1233}{9900}$.</p>
      <p class="ales-sol-step">EBOB$(1233, 9900) = 9$ ⟹ $\\dfrac{137}{1100}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{137}{1100}$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = 0.\\overline{6}, \\; b = 0.6\\overline{6}, \\; c = 0.66$ sayılarını sıralayın.<br><br>
      <strong>A)</strong> $a < b < c$ &nbsp; <strong>B)</strong> $a = b = c$ &nbsp; <strong>C)</strong> $b < a < c$ &nbsp; <strong>D)</strong> $c < a < b$ &nbsp; <strong>E)</strong> <span class="key">$c < a = b$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = 0.6666\\dots = \\dfrac{2}{3} \\approx 0.6667$.</p>
      <p class="ales-sol-step">$b = 0.6666\\dots$ — aslında $a$ ile aynı! ($0.6\\overline{6}$ = ilk 6'dan sonra 6'lar tekrarlıyor = sürekli 6.)</p>
      <p class="ales-sol-step">$c = 0.66 = 0.6600$ (sonlu).</p>
      <p class="ales-sol-step">$c < a = b$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $c < a = b$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İşlem — Kesir + Devirli</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{6} + 0.\\overline{3}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{2}{9}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{2}$</span> &nbsp; <strong>D)</strong> $\\dfrac{5}{6}$ &nbsp; <strong>E)</strong> $\\dfrac{2}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0.\\overline{3} = \\dfrac{1}{3} = \\dfrac{2}{6}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{6} + \\dfrac{2}{6} = \\dfrac{3}{6} = \\dfrac{1}{2} = 0.5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Devirli Çıkarma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $0.\\overline{45} - 0.\\overline{27}$ kaçtır? Sonucu kesir olarak verin.<br><br>
      <strong>A)</strong> $\\dfrac{18}{11}$ &nbsp; <strong>B)</strong> $\\dfrac{8}{11}$ &nbsp; <strong>C)</strong> $\\dfrac{2}{9}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{2}{11}$</span> &nbsp; <strong>E)</strong> $\\dfrac{1}{11}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0.\\overline{45} = \\dfrac{45}{99} = \\dfrac{5}{11}$ ve $0.\\overline{27} = \\dfrac{27}{99} = \\dfrac{3}{11}$.</p>
      <p class="ales-sol-step">$\\dfrac{5}{11} - \\dfrac{3}{11} = \\dfrac{2}{11}$.</p>
      <p class="ales-sol-step">Kontrol: $\\dfrac{2}{11} = 0.181818\\dots = 0.\\overline{18}$ ✓ ($0.\\overline{45} - 0.\\overline{27}$ basamak basamak da $0.\\overline{18}$ verir).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{2}{11}$</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{0.\\overline{6}}{0.\\overline{3}}$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 0
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0.\\overline{6} = \\dfrac{2}{3}$ ve $0.\\overline{3} = \\dfrac{1}{3}$.</p>
      <p class="ales-sol-step">$\\dfrac{2/3}{1/3} = \\dfrac{2}{3} \\cdot 3 = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>
</section>
`
};
