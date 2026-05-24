window.ALES_LESSON = {
n: 25,
title: "Birinci Derece Denklemler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>birinci derece denklemler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Tek bilinmeyenli sade denklemlerden başlayıp kesirli denklemlere, oradan iki bilinmeyenli sistemlere kadar gideceğiz. Çözüm yöntemleri (yerine koyma vs yok etme) problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Tek Bilinmeyenli ax+b=0
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Tek Bilinmeyenli Denklem (ax + b = 0)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Sade Denklem</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3x - 12 = 0$ denklemini sağlayan $x$ değeri kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">4</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$ax + b = 0 \\Rightarrow x = -b/a$. Burada $a = 3,\\; b = -12$.</p>
      <p class="ales-sol-step">$3x = 12 \\Rightarrow x = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Parantez Açma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2(x - 3) + 5 = 3x - 4$ denklemini çöz.<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sol: $2x - 6 + 5 = 2x - 1$.</p>
      <p class="ales-sol-step">$2x - 1 = 3x - 4 \\Rightarrow -1 + 4 = 3x - 2x \\Rightarrow x = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Bilinmeyen İki Tarafta</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5x - 7 = 2x + 11$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">6</span> &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x$'leri sola, sayıları sağa topla: $5x - 2x = 11 + 7$.</p>
      <p class="ales-sol-step">$3x = 18 \\Rightarrow x = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 6</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Parametreli Çözüm</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4x + a = 2x + 18$ denkleminin çözümü $x = 5$ ise $a$ kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">8</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x = 5$ denklemde yerine yaz: $4(5) + a = 2(5) + 18$.</p>
      <p class="ales-sol-step">$20 + a = 28 \\Rightarrow a = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 8</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Sonsuz Çözüm</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(m - 2)x = 3m - 6$ denkleminin <strong>sonsuz çözümü</strong> olması için $m$ kaç olmalıdır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$ax = b$ formunda sonsuz çözüm için $a = 0$ ve $b = 0$ olmalı.</p>
      <p class="ales-sol-step">$m - 2 = 0 \\Rightarrow m = 2$. Kontrol: $3m - 6 = 3(2) - 6 = 0$ ✓.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $m \\neq 2$ ise tek çözüm; $a = 0$ ama $b \\neq 0$ olsa çözüm yok.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Çözümü Yok Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(k^2 - 9)x = k - 3$ denkleminin <strong>çözümü olmaması</strong> için $k$ kaç olmalıdır?<br><br>
      <strong>A)</strong> <span class="key">$-3$</span> &nbsp; <strong>B)</strong> $0$ &nbsp; <strong>C)</strong> $3$ &nbsp; <strong>D)</strong> $-3$ veya $3$ &nbsp; <strong>E)</strong> $9$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çözüm yok koşulu: $a = 0$ ama $b \\neq 0$.</p>
      <p class="ales-sol-step">$k^2 - 9 = 0 \\Rightarrow k = 3$ veya $k = -3$.</p>
      <p class="ales-sol-step">$k = 3$ ise $b = 3 - 3 = 0$ ⟹ sonsuz çözüm (uymaz). $k = -3$ ise $b = -3 - 3 = -6 \\neq 0$ ⟹ çözüm yok ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) $-3$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sözel Problem</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir sayının $3$ katının $7$ fazlası, aynı sayının $5$ katının $11$ eksiğine eşittir. Bu sayı kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayıya $x$ diyelim: $3x + 7 = 5x - 11$.</p>
      <p class="ales-sol-step">$7 + 11 = 5x - 3x \\Rightarrow 18 = 2x \\Rightarrow x = 9$.</p>
      <p class="ales-sol-step">Doğrula: $3(9) + 7 = 34$ ve $5(9) - 11 = 34$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Kesirli Denklemler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Kesirli Denklemler (Paydaları Temizle)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Tek Kesir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x}{3} + 2 = 7$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> 12 &nbsp; <strong>D)</strong> <span class="key">15</span> &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{x}{3} = 5 \\Rightarrow x = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 15</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">İki Kesir Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x}{2} + \\dfrac{x}{3} = 10$ denklemini çöz.<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> <span class="key">12</span> &nbsp; <strong>C)</strong> 16 &nbsp; <strong>D)</strong> 21 &nbsp; <strong>E)</strong> 24
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Paydaları Eşitle</div>
      <p class="ales-sol-step">Paydaların ortak katı $6$. Tüm denklemi $6$ ile çarp: $3x + 2x = 60$.</p>
      <p class="ales-sol-step">$5x = 60 \\Rightarrow x = 12$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Toplama</div>
      <p class="ales-sol-step">$\\dfrac{x}{2} + \\dfrac{x}{3} = \\dfrac{3x + 2x}{6} = \\dfrac{5x}{6} = 10 \\Rightarrow x = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 12</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Bilinmeyen Paydada</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6}{x} - \\dfrac{4}{x} = \\dfrac{1}{3}$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sol taraf: $\\dfrac{6 - 4}{x} = \\dfrac{2}{x}$.</p>
      <p class="ales-sol-step">$\\dfrac{2}{x} = \\dfrac{1}{3} \\Rightarrow$ çapraz çarpım: $x = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Karışık Kesir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x - 1}{4} + \\dfrac{x + 2}{6} = 2$ denklemini çöz.<br><br>
      <strong>A)</strong> 18 /5 &nbsp; <strong>B)</strong> 20 /5 &nbsp; <strong>C)</strong> 22 /5 &nbsp; <strong>D)</strong> <span class="key">23 /5</span> &nbsp; <strong>E)</strong> 24 /5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Paydaların EKOK'u $12$. Tüm denklemi $12$ ile çarp:</p>
      <p class="ales-sol-step">$3(x - 1) + 2(x + 2) = 24$.</p>
      <p class="ales-sol-step">$3x - 3 + 2x + 4 = 24 \\Rightarrow 5x + 1 = 24 \\Rightarrow x = \\dfrac{23}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 23 /5</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Çapraz Çarpım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2x + 1}{x - 3} = 3$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 15 &nbsp; <strong>E)</strong> 19
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çapraz Çarpım</div>
      <p class="ales-sol-step">$2x + 1 = 3(x - 3) \\Rightarrow 2x + 1 = 3x - 9$.</p>
      <p class="ales-sol-step">$1 + 9 = 3x - 2x \\Rightarrow x = 10$.</p>
      <p class="ales-sol-step"><strong>Kontrol:</strong> $x = 3$ olsaydı payda sıfır olurdu (tanımsız). $x = 10 \\neq 3$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">İç Çarpım = Dış Çarpım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x + 2}{x - 1} = \\dfrac{x + 4}{x + 1}$ denklemini çöz.<br><br>
      <strong>A)</strong> $x = -2$ &nbsp; <strong>B)</strong> $x = 0$ &nbsp; <strong>C)</strong> $x = 1$ &nbsp; <strong>D)</strong> $x = 4$ &nbsp; <strong>E)</strong> <span class="key">Çözüm yok</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çapraz çarpım: $(x + 2)(x + 1) = (x - 1)(x + 4)$.</p>
      <p class="ales-sol-step">Sol: $x^2 + 3x + 2$. Sağ: $x^2 + 3x - 4$.</p>
      <p class="ales-sol-step">$x^2 + 3x + 2 = x^2 + 3x - 4 \\Rightarrow 2 = -4$ ⟹ <strong>çelişki</strong>.</p>
      <p class="ales-sol-step">Çözüm yok.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) Çözüm yok</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sözel — Yaş</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Ali'nin yaşının $\\dfrac{1}{3}$'ü ile $\\dfrac{1}{4}$'ünün toplamı $14$'tür. Ali kaç yaşındadır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> 20 &nbsp; <strong>C)</strong> <span class="key">24</span> &nbsp; <strong>D)</strong> 27 &nbsp; <strong>E)</strong> 33
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{x}{3} + \\dfrac{x}{4} = 14$. EKOK $12$, denklemi $12$ ile çarp:</p>
      <p class="ales-sol-step">$4x + 3x = 168 \\Rightarrow 7x = 168 \\Rightarrow x = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 24</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — İki Bilinmeyenli Sistem
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">İki Bilinmeyenli Denklem Sistemi</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Yok Etme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x + y = 10$ ve $x - y = 4$ ise $x \\cdot y$ kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 20 &nbsp; <strong>C)</strong> <span class="key">21</span> &nbsp; <strong>D)</strong> 22 &nbsp; <strong>E)</strong> 25
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yok Etme</div>
      <p class="ales-sol-step">İki denklemi taraf tarafa topla: $2x = 14 \\Rightarrow x = 7$.</p>
      <p class="ales-sol-step">$y = 10 - 7 = 3$. $x \\cdot y = 7 \\cdot 3 = 21$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Yerine Koyma</div>
      <p class="ales-sol-step">$y = 10 - x$. İkincide: $x - (10 - x) = 4 \\Rightarrow 2x = 14 \\Rightarrow x = 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 21</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Yok Etme — Çarpan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2x + 3y = 16$ ve $x + y = 7$ ise $y$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yok Etme</div>
      <p class="ales-sol-step">İkinci denklemi $2$ ile çarp: $2x + 2y = 14$.</p>
      <p class="ales-sol-step">Birinciden çıkar: $(2x + 3y) - (2x + 2y) = 16 - 14 \\Rightarrow y = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Sistem Değeri</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3x - 2y = 5$ ve $x + 4y = 11$ ise $x + y$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yok Etme</div>
      <p class="ales-sol-step">Birinci denklemi $2$ ile çarp: $6x - 4y = 10$.</p>
      <p class="ales-sol-step">İkinci ile topla: $7x = 21 \\Rightarrow x = 3$.</p>
      <p class="ales-sol-step">İkinciden $y$: $3 + 4y = 11 \\Rightarrow y = 2$.</p>
      <p class="ales-sol-step">$x + y = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Hızlı Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x + 2y = 9$ ve $2x + y = 12$ ise $3(x + y)$ kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 20 &nbsp; <strong>C)</strong> <span class="key">21</span> &nbsp; <strong>D)</strong> 22 &nbsp; <strong>E)</strong> 42
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Toplama Trick</div>
      <p class="ales-sol-step">İki denklemi taraf tarafa topla: $3x + 3y = 21 \\Rightarrow x + y = 7$.</p>
      <p class="ales-sol-step">$3(x + y) = 21$. <strong>Tek tek $x, y$ bulmadan</strong> sonuca git.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 21</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Sözel — Kalem Defter</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3$ kalem ve $2$ defter $26$ TL; $5$ kalem ve $3$ defter $41$ TL ise bir kalemin fiyatı kaç TL'dir?<br><br>
      <strong>A)</strong> 1 TL &nbsp; <strong>B)</strong> 3 TL &nbsp; <strong>C)</strong> <span class="key">4 TL</span> &nbsp; <strong>D)</strong> 5 TL &nbsp; <strong>E)</strong> 9 TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kalem $x$, defter $y$: $3x + 2y = 26$, $\\;5x + 3y = 41$.</p>
      <p class="ales-sol-step">Birinciyi $3$, ikinciyi $2$ ile çarp:</p>
      <p class="ales-sol-step">$9x + 6y = 78$, $\\;10x + 6y = 82$. Çıkar: $x = 4$.</p>
      <p class="ales-sol-step">Doğrula: $y = (26 - 12)/2 = 7$. $5(4) + 3(7) = 41$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4 TL</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Sonsuz Çözüm Koşulu</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\begin{cases} 2x + 3y = 7 \\\\ 4x + ky = 14 \\end{cases}$ sisteminin <strong>sonsuz çözümü</strong> olması için $k$ kaç olmalıdır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">6</span> &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sonsuz çözüm koşulu: $\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} = \\dfrac{c_1}{c_2}$.</p>
      <p class="ales-sol-step">$\\dfrac{2}{4} = \\dfrac{3}{k} = \\dfrac{7}{14}$. $\\dfrac{1}{2} = \\dfrac{3}{k} \\Rightarrow k = 6$.</p>
      <p class="ales-sol-step"><strong>Kontrol:</strong> $\\dfrac{7}{14} = \\dfrac{1}{2}$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 6</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sözel — İki Sayı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Toplamı $40$, farkı $12$ olan iki sayının karelerinin farkı kaçtır?<br><br>
      <strong>A)</strong> 475 &nbsp; <strong>B)</strong> 479 &nbsp; <strong>C)</strong> <span class="key">480</span> &nbsp; <strong>D)</strong> 483 &nbsp; <strong>E)</strong> 485
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$x + y = 40$, $\\;x - y = 12$.</p>
      <p class="ales-sol-step">$x^2 - y^2 = (x - y)(x + y) = 12 \\cdot 40 = 480$.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> Tek tek $x, y$ bulmaya gerek yok — özdeşlik kısayol.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Çözerek</div>
      <p class="ales-sol-step">Topla: $2x = 52 \\Rightarrow x = 26$, $\\;y = 14$. $x^2 - y^2 = 676 - 196 = 480$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 480</span></div>
    </div>
  </div>
</section>
`
};
