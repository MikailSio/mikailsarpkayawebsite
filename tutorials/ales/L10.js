window.ALES_LESSON = {
n: 10,
title: "Modüler Aritmetik ve Kalan Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>modüler aritmetik ve kalan problemleri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Bölme algoritması $A = B \\cdot Q + R$, eksilen kalan tekniği ve üs döngüleri (mod $10$) çözüm içinde uygulanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Bölme Algoritması A = B·Q + R
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Bölme Algoritması — A = B·Q + R</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Temel Bölme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $97$ sayısı $8$'e bölündüğünde bölüm $Q$ ve kalan $R$ kaçtır?<br><br>
      <strong>A)</strong> Q = 11, R = 9 &nbsp; <strong>B)</strong> <span class="key">Q = 12, R = 1</span> &nbsp; <strong>C)</strong> Q = 12, R = 2 &nbsp; <strong>D)</strong> Q = 13, R = 0 &nbsp; <strong>E)</strong> Q = 12, R = 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Algoritma:</strong> $A = B \\cdot Q + R$ ($0 \\leq R < B$).</p>
      <p class="ales-sol-step">$8 \\cdot 12 = 96$. $97 - 96 = 1$ ⟹ $Q = 12,\\; R = 1$.</p>
      <p class="ales-sol-step">Yani $97 = 8 \\cdot 12 + 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) Q = 12, R = 1</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Bölünen Bul</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir doğal sayı $7$'ye bölündüğünde bölüm $13$, kalan $5$'tir. Bu sayı kaçtır?<br><br>
      <strong>A)</strong> 95 &nbsp; <strong>B)</strong> 97 &nbsp; <strong>C)</strong> 106 &nbsp; <strong>D)</strong> <span class="key">96</span> &nbsp; <strong>E)</strong> 94
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A = B \\cdot Q + R = 7 \\cdot 13 + 5 = 91 + 5 = 96$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 96</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Kalan Sınırı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir doğal sayı $9$'a bölündüğünde alabileceği farklı kalan sayısı kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> <span class="key">9</span> &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0 \\leq R < B$ ⟹ $R \\in \\{0, 1, 2, \\dots, 8\\}$.</p>
      <p class="ales-sol-step">$9$ farklı kalan.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 9</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">İki Bölme — Karma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir doğal sayı $5$'e bölündüğünde kalan $3$'tür. Bu sayının $3$ katının $5$'e bölündüğünde kalanı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">4</span> &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayı: $A = 5k + 3$. $3A = 15k + 9 = 15k + 5 + 4 = 5(3k + 1) + 4$.</p>
      <p class="ales-sol-step">$5$'e böl, kalan $= 4$.</p>
      <p class="ales-sol-step"><strong>Hız:</strong> $3 \\cdot 3 = 9 \\equiv 4 \\pmod 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 4</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Toplama Mod</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a$ sayısı $7$'ye bölündüğünde kalan $4$, $b$ sayısı $7$'ye bölündüğünde kalan $5$'tir. $a + b$'nin $7$'ye bölündüğünde kalanı kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Mod toplama:</strong> $a + b \\equiv 4 + 5 = 9 \\equiv 2 \\pmod 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Çarpma Mod</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a \\equiv 5 \\pmod{8}$ ve $b \\equiv 6 \\pmod{8}$ ise $a \\cdot b \\pmod 8$ kaçtır?<br><br>
      <strong>A)</strong> 12 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> <span class="key">6</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Mod çarpma:</strong> $a \\cdot b \\equiv 5 \\cdot 6 = 30 \\equiv 6 \\pmod 8$ ($30 = 8 \\cdot 3 + 6$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 6</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Bölünebilme — Mod</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = 13^{2} + 17^{2}$ sayısı $5$'e bölündüğünde kalan kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$13 \\equiv 3 \\pmod 5$ ⟹ $13^{2} \\equiv 9 \\equiv 4$.</p>
      <p class="ales-sol-step">$17 \\equiv 2 \\pmod 5$ ⟹ $17^{2} \\equiv 4$.</p>
      <p class="ales-sol-step">$A \\equiv 4 + 4 = 8 \\equiv 3 \\pmod 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Eksilen Kalan Tekniği
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Eksilen Kalan Tekniği — Çoklu Bölünme</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Aynı Kalan — EKOK</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $4, 6, 8$ ile bölündüğünde her biri için $1$ kalanı veren en küçük üç basamaklı sayı kaçtır?<br><br>
      <strong>A)</strong> 151 &nbsp; <strong>B)</strong> 109 &nbsp; <strong>C)</strong> <span class="key">121</span> &nbsp; <strong>D)</strong> 120 &nbsp; <strong>E)</strong> 131
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayı $- 1 = $ EKOK$(4, 6, 8) \\cdot k = 24k$. Sayı $= 24k + 1$.</p>
      <p class="ales-sol-step">Üç basamaklı en küçük: $24k + 1 \\geq 100 \\Rightarrow k \\geq 4,12\\dots \\Rightarrow k = 5$, sayı $= 121$.</p>
      <p class="ales-sol-step">Doğrula: $121/4 = 30$ kalan $1$ ✓. $121/6 = 20$ kalan $1$ ✓. $121/8 = 15$ kalan $1$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 121</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Eksilen Kalan — Klasik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5$'e bölünce $3$, $7$'ye bölünce $5$ kalanı veren en küçük doğal sayı kaçtır?<br><br>
      <strong>A)</strong> 36 &nbsp; <strong>B)</strong> <span class="key">33</span> &nbsp; <strong>C)</strong> 32 &nbsp; <strong>D)</strong> 30 &nbsp; <strong>E)</strong> 38
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eksilen</div>
      <p class="ales-sol-step"><strong>Gözlem:</strong> $5 - 3 = 2$ ve $7 - 5 = 2$ — eksilen sabit ($2$).</p>
      <p class="ales-sol-step">Sayı $+ 2 = $ EKOK$(5, 7) \\cdot k = 35k$. Sayı $= 35k - 2$.</p>
      <p class="ales-sol-step">En küçük doğal ($k = 1$): $33$.</p>
      <p class="ales-sol-step">Doğrula: $33/5 = 6$ kalan $3$ ✓. $33/7 = 4$ kalan $5$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 33</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üç Bölmeli Eksilen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4$'e bölünce $1$, $6$'ya bölünce $3$, $9$'a bölünce $6$ kalanı veren en küçük doğal sayı kaçtır?<br><br>
      <strong>A)</strong> 36 &nbsp; <strong>B)</strong> <span class="key">33</span> &nbsp; <strong>C)</strong> 23 &nbsp; <strong>D)</strong> 34 &nbsp; <strong>E)</strong> 30
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eksilen</div>
      <p class="ales-sol-step">Eksilenler: $4-1 = 3$, $6-3 = 3$, $9-6 = 3$ — sabit ($3$).</p>
      <p class="ales-sol-step">Sayı $+ 3 = $ EKOK$(4, 6, 9) \\cdot k = 36k$. Sayı $= 36k - 3$.</p>
      <p class="ales-sol-step">En küçük doğal ($k = 1$): $33$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 33</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Kalanlar Eşit — EKOK Katı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3$'e ve $5$'e bölündüğünde aynı $2$ kalanını veren üç basamaklı kaç sayı vardır?<br><br>
      <strong>A)</strong> 63 &nbsp; <strong>B)</strong> <span class="key">60</span> &nbsp; <strong>C)</strong> 65 &nbsp; <strong>D)</strong> 58 &nbsp; <strong>E)</strong> 57
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayı $= 15k + 2$ (EKOK$(3,5) = 15$).</p>
      <p class="ales-sol-step">Üç basamaklı: $100 \\leq 15k + 2 \\leq 999 \\Rightarrow 6,53\\dots \\leq k \\leq 66,46\\dots \\Rightarrow k \\in \\{7, 8, \\dots, 66\\}$.</p>
      <p class="ales-sol-step">Sayı: $66 - 7 + 1 = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 60</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Kelime Problemi — Kalan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir öğretmen sınıfını $3$'erli sıraya dizerse $2$ kişi açıkta kalıyor; $4$'erli dizerse $3$ açıkta; $5$'erli dizerse $4$ açıkta. Sınıfta en az kaç öğrenci vardır?<br><br>
      <strong>A)</strong> 47 &nbsp; <strong>B)</strong> 53 &nbsp; <strong>C)</strong> <span class="key">59</span> &nbsp; <strong>D)</strong> 60 &nbsp; <strong>E)</strong> 61
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eksilen</div>
      <p class="ales-sol-step">$3-2 = 1$, $4-3 = 1$, $5-4 = 1$ — sabit eksilen ($1$).</p>
      <p class="ales-sol-step">Sayı $+ 1 = $ EKOK$(3, 4, 5) = 60 \\Rightarrow $ sayı $= 59$.</p>
      <p class="ales-sol-step">Doğrula: $59/3 = 19$ kalan $2$ ✓. $59/4 = 14$ kalan $3$ ✓. $59/5 = 11$ kalan $4$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 59</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Tam Bölünme + Kalan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $7$'ye bölündüğünde kalanı $5$ olan ve $11$'e tam bölünen iki basamaklı kaç sayı vardır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$11$'in iki basamaklı katları: $11, 22, 33, 44, 55, 66, 77, 88, 99$.</p>
      <p class="ales-sol-step">$7$'ye böl kalan $5$ olanları seç: $11/7 = 1$ k$4$ ✗. $22/7 = 3$ k$1$ ✗. $33/7 = 4$ k$5$ ✓. $44/7 = 6$ k$2$ ✗. $55/7 = 7$ k$6$ ✗. $66/7 = 9$ k$3$ ✗. $77/7 = 11$ k$0$ ✗. $88/7 = 12$ k$4$ ✗. $99/7 = 14$ k$1$ ✗.</p>
      <p class="ales-sol-step">Tek bir tane: $33$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1 (sayı 33)</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — İki Bölme + Aralık</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $200$ ile $400$ arasında, $9$'a bölündüğünde $4$ kalanı veren ve $11$'e bölündüğünde $7$ kalanı veren bir sayı vardır. Bu sayı kaçtır?<br><br>
      <strong>A)</strong> 211 &nbsp; <strong>B)</strong> 229 &nbsp; <strong>C)</strong> <span class="key">238</span> &nbsp; <strong>D)</strong> 247 &nbsp; <strong>E)</strong> 374
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çin Kalan Teoremi (Pratik)</div>
      <p class="ales-sol-step">Sayı $\\equiv 4 \\pmod 9 \\Rightarrow N = 9k + 4$.</p>
      <p class="ales-sol-step">$N \\equiv 7 \\pmod{11} \\Rightarrow 9k + 4 \\equiv 7 \\Rightarrow 9k \\equiv 3 \\pmod{11}$.</p>
      <p class="ales-sol-step">$9 \\equiv -2 \\pmod{11}$ ⟹ $-2k \\equiv 3 \\Rightarrow 2k \\equiv -3 \\equiv 8 \\pmod{11} \\Rightarrow k \\equiv 4 \\pmod{11}$.</p>
      <p class="ales-sol-step">$k = 11m + 4 \\Rightarrow N = 9(11m + 4) + 4 = 99m + 40$.</p>
      <p class="ales-sol-step">Aralık: $200 \\leq 99m + 40 \\leq 400 \\Rightarrow m \\in \\{2, 3\\}$. $m = 2$: $238$. $m = 3$: $337$.</p>
      <p class="ales-sol-step">Doğrula $238$: $238/9 = 26$ k$4$ ✓; $238/11 = 21$ k$7$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 238</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Üs Döngüleri (mod 10) + Saat Aritmetiği
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Üs Döngüleri (mod 10) ve Saat Aritmetiği</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Birler Basamağı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $7^{100}$ sayısının birler basamağı kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">1</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Döngü</div>
      <p class="ales-sol-step">$7^{1} = 7,\\; 7^{2} = 49,\\; 7^{3} = 343,\\; 7^{4} = 2401$. Birler basamakları: $7, 9, 3, 1$ — döngü $4$.</p>
      <p class="ales-sol-step">$100 / 4 = 25$ kalan $0$ ⟹ döngünün $4$. terimi (yani $7^{4}$ son basamağı $1$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 1</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">2'nin Üssü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{83}$ sayısının birler basamağı kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> <span class="key">8</span> &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2^{1} = 2, 2^{2} = 4, 2^{3} = 8, 2^{4} = 16, 2^{5} = 32$. Birler: $2, 4, 8, 6$ — döngü $4$.</p>
      <p class="ales-sol-step">$83 / 4 = 20$ kalan $3$ ⟹ döngünün $3$. terimi $= 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 8</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Toplam Birler Basamağı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $A = 3^{50} + 4^{50}$ sayısının birler basamağı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">5</span> &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 1 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$3$'ün döngüsü: $3, 9, 7, 1$ — uzunluk $4$. $50/4 = 12$ k$2$ ⟹ $3^{50}$ birler basamağı $= 9$.</p>
      <p class="ales-sol-step">$4$'ün döngüsü: $4, 6$ — uzunluk $2$. $50/2 = 25$ k$0$ ⟹ döngünün $2$. terimi $= 6$.</p>
      <p class="ales-sol-step">$A$'nın birler: $9 + 6 = 15$ ⟹ son basamak $5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 5</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Saat Aritmetiği</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Saat $14:00$'tan $50$ saat sonra saat kaçtır?<br><br>
      <strong>A)</strong> 12:00 &nbsp; <strong>B)</strong> 14:00 &nbsp; <strong>C)</strong> 15:00 &nbsp; <strong>D)</strong> <span class="key">16:00</span> &nbsp; <strong>E)</strong> 18:00
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$24$ saatte bir tam tur. $50 \\bmod 24 = 50 - 24 = 26 - 24 = 2$. Yani $50$ saat = $2$ tam gün $+ 2$ saat.</p>
      <p class="ales-sol-step">$14:00 + 2:00 = 16:00$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 16:00</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Gün Aritmetiği</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bugün Pazartesi ise $100$ gün sonra hangi gün olur?<br><br>
      <strong>A)</strong> Pazartesi &nbsp; <strong>B)</strong> Salı &nbsp; <strong>C)</strong> <span class="key">Çarşamba</span> &nbsp; <strong>D)</strong> Perşembe &nbsp; <strong>E)</strong> Cuma
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hafta $7$ günlük döngü. $100 \\bmod 7 = 100 - 14 \\cdot 7 = 100 - 98 = 2$.</p>
      <p class="ales-sol-step">Pazartesi $+ 2$ gün $=$ Çarşamba.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Çarşamba</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Üs — Mod 7</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $3^{50}$ sayısı $7$'ye bölündüğünde kalanı kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Fermat'ın Küçük Teoremi</div>
      <p class="ales-sol-step"><strong>Fermat:</strong> $p$ asal, $\\gcd(a, p) = 1$ ⟹ $a^{p-1} \\equiv 1 \\pmod p$.</p>
      <p class="ales-sol-step">$3^{6} \\equiv 1 \\pmod 7$. $50 = 6 \\cdot 8 + 2 \\Rightarrow 3^{50} = 3^{48} \\cdot 3^{2} \\equiv 1 \\cdot 9 \\equiv 2 \\pmod 7$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Direkt Döngü</div>
      <p class="ales-sol-step">$3^{1} = 3, 3^{2} = 9 \\equiv 2, 3^{3} \\equiv 6, 3^{4} \\equiv 4, 3^{5} \\equiv 5, 3^{6} \\equiv 1$. Döngü $6$. $50/6 = 8$ k$2$ ⟹ döngünün $2$. terimi $= 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 2</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Üs Toplam Mod</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = 1 + 2 + 2^{2} + 2^{3} + \\dots + 2^{20}$ sayısının $7$'ye bölündüğünde kalanı kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">0</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Geometrik Toplam</div>
      <p class="ales-sol-step">$A = \\dfrac{2^{21} - 1}{2 - 1} = 2^{21} - 1$.</p>
      <p class="ales-sol-step">$2^{3} = 8 \\equiv 1 \\pmod 7$ ⟹ döngü $3$. $21 = 3 \\cdot 7 \\Rightarrow 2^{21} \\equiv 1 \\pmod 7$.</p>
      <p class="ales-sol-step">$A \\equiv 1 - 1 = 0 \\pmod 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 0</span></div>
    </div>
  </div>
</section>
`
};
