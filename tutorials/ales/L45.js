window.ALES_LESSON = {
n: 45,
title: "Olasılık",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>olasılık</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Klasik olasılık $P(A) = \\dfrac{|A|}{|S|}$, bağımsız ve koşullu olaylar, komplement (tümleyen) hız tekniği problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Klasik Olasılık
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Klasik Olasılık (İstenen / Tüm)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Zar Atma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir zar atıldığında üst yüze çift sayı gelme olasılığı kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 2/2 &nbsp; <strong>C)</strong> <span class="key">1/2</span> &nbsp; <strong>D)</strong> 1/3 &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Örnek uzay $S = \\{1, 2, 3, 4, 5, 6\\}$, $|S| = 6$.</p>
      <p class="ales-sol-step">İstenen: $\\{2, 4, 6\\}$, $|A| = 3$.</p>
      <p class="ales-sol-step">$P(A) = \\dfrac{3}{6} = \\dfrac{1}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 1/2</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Top Çekme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir torbada $4$ kırmızı, $5$ mavi, $3$ yeşil top vardır. Rastgele çekilen bir topun mavi olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> 12/5 &nbsp; <strong>B)</strong> 6/12 &nbsp; <strong>C)</strong> 4/12 &nbsp; <strong>D)</strong> 5/13 &nbsp; <strong>E)</strong> <span class="key">5/12</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tüm top sayısı $= 4 + 5 + 3 = 12$. Mavi $= 5$.</p>
      <p class="ales-sol-step">$P(\\text{mavi}) = \\dfrac{5}{12}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5/12</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">İki Zar Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İki zar atıldığında üst yüzlerin <strong>toplamının $7$</strong> olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1/6</span> &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 2/6 &nbsp; <strong>D)</strong> 1/7 &nbsp; <strong>E)</strong> 1/5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Örnek uzay: $6 \\cdot 6 = 36$.</p>
      <p class="ales-sol-step">Toplam $7$ olan: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) \\Rightarrow 6$ durum.</p>
      <p class="ales-sol-step">$P = \\dfrac{6}{36} = \\dfrac{1}{6}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1/6</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Kart Çekme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $52$ kartlık standart desteden çekilen bir kartın <strong>papaz veya kupa</strong> olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> 13/4 &nbsp; <strong>B)</strong> 5/13 &nbsp; <strong>C)</strong> 3/13 &nbsp; <strong>D)</strong> 4/14 &nbsp; <strong>E)</strong> <span class="key">4/13</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Birleşim Formülü</div>
      <p class="ales-sol-step">$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.</p>
      <p class="ales-sol-step">Papaz: $4$ adet, $P(P) = 4/52$. Kupa: $13$ adet, $P(K) = 13/52$.</p>
      <p class="ales-sol-step">Hem papaz hem kupa: $1$ adet (kupa papazı), $P(P \\cap K) = 1/52$.</p>
      <p class="ales-sol-step">$P = \\dfrac{4 + 13 - 1}{52} = \\dfrac{16}{52} = \\dfrac{4}{13}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 4/13</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Kombinasyonla Olasılık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5$ kırmızı ve $4$ mavi top içeren torbadan rastgele $3$ top çekiliyor. Üçünün de kırmızı olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> 42/5 &nbsp; <strong>B)</strong> 6/42 &nbsp; <strong>C)</strong> 4/42 &nbsp; <strong>D)</strong> 5/43 &nbsp; <strong>E)</strong> <span class="key">5/42</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tüm yol: $C(9, 3) = 84$. Üçünün kırmızı: $C(5, 3) = 10$.</p>
      <p class="ales-sol-step">$P = \\dfrac{10}{84} = \\dfrac{5}{42}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5/42</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Sıralı Çekiliş</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $6$ kız ve $4$ erkek arasından rastgele bir öğrenci seçildi. Bu öğrencinin kız <strong>olma</strong> olasılığı $\\dfrac{6}{10}$. Bir kız seçildikten sonra (yerine konmadan) ikinci bir öğrenci de kız çıkma olasılığı kaçtır?<br><br>
      <strong>A)</strong> 9/5 &nbsp; <strong>B)</strong> <span class="key">5/9</span> &nbsp; <strong>C)</strong> 6/9 &nbsp; <strong>D)</strong> 4/9 &nbsp; <strong>E)</strong> 5/10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Koşullu</div>
      <p class="ales-sol-step">İlk kız çekildikten sonra geriye $9$ öğrenci, $5$ kız.</p>
      <p class="ales-sol-step">$P = \\dfrac{5}{9}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5/9</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Karma — Kombinasyon</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $4$ kırmızı, $3$ mavi, $5$ yeşil top içeren torbadan rastgele $3$ top çekiliyor. Çekilenlerin <strong>her renkten birer tane</strong> olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> 11/3 &nbsp; <strong>B)</strong> <span class="key">3/11</span> &nbsp; <strong>C)</strong> 4/11 &nbsp; <strong>D)</strong> 2/11 &nbsp; <strong>E)</strong> 3/12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tüm yol: $C(12, 3) = 220$.</p>
      <p class="ales-sol-step">Her renkten birer: $C(4,1) C(3,1) C(5,1) = 4 \\cdot 3 \\cdot 5 = 60$.</p>
      <p class="ales-sol-step">$P = \\dfrac{60}{220} = \\dfrac{3}{11}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3/11</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Bağımsız ve Koşullu Olaylar
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Bağımsız ve Koşullu Olaylar</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Bağımsız — Çarpma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Para üst üste $3$ kez atılıyor. Üçünde de tura gelme olasılığı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1/8</span> &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> 2/8 &nbsp; <strong>D)</strong> 1/9 &nbsp; <strong>E)</strong> 1/7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bağımsız olaylar: $P(A \\cap B) = P(A) \\cdot P(B)$.</p>
      <p class="ales-sol-step">$P = \\dfrac{1}{2} \\cdot \\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{8}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1/8</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Yerine Koymadan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5$ kırmızı, $3$ mavi top içeren torbadan ardışık $2$ top yerine koymadan çekiliyor. Her ikisinin de kırmızı olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">5/14</span> &nbsp; <strong>B)</strong> 14/5 &nbsp; <strong>C)</strong> 6/14 &nbsp; <strong>D)</strong> 4/14 &nbsp; <strong>E)</strong> 5/15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpma</div>
      <p class="ales-sol-step">İlk top kırmızı: $5/8$. İkinci top kırmızı (geriye $4$ kırmızı, $7$ toplam): $4/7$.</p>
      <p class="ales-sol-step">$P = \\dfrac{5}{8} \\cdot \\dfrac{4}{7} = \\dfrac{20}{56} = \\dfrac{5}{14}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Kombinasyon</div>
      <p class="ales-sol-step">$\\dfrac{C(5,2)}{C(8,2)} = \\dfrac{10}{28} = \\dfrac{5}{14}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 5/14</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Yerine Koyarak</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5$ kırmızı, $3$ mavi top içeren torbadan ardışık $2$ top <strong>yerine koyarak</strong> çekiliyor. Her ikisi de kırmızı olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">25/64</span> &nbsp; <strong>B)</strong> 64/25 &nbsp; <strong>C)</strong> 26/64 &nbsp; <strong>D)</strong> 24/64 &nbsp; <strong>E)</strong> 25/65
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yerine koyarak $\\Rightarrow$ olaylar bağımsız, her seferinde aynı oran.</p>
      <p class="ales-sol-step">$P = \\dfrac{5}{8} \\cdot \\dfrac{5}{8} = \\dfrac{25}{64}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 25/64</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Koşullu Olasılık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir zar atıldığında üst yüze gelen sayının çift olduğu bilinmektedir. Bu sayının $4$'ten büyük olma olasılığı kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 2/3 &nbsp; <strong>C)</strong> 1/4 &nbsp; <strong>D)</strong> <span class="key">1/3</span> &nbsp; <strong>E)</strong> 1/2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Koşullu Formül</div>
      <p class="ales-sol-step">$P(A | B) = \\dfrac{P(A \\cap B)}{P(B)}$.</p>
      <p class="ales-sol-step">B: çift $= \\{2, 4, 6\\}$, $|B| = 3$. $A \\cap B$: $4$'ten büyük çift $= \\{6\\}$, $|A \\cap B| = 1$.</p>
      <p class="ales-sol-step">$P(A | B) = \\dfrac{1}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 1/3</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Sırasıyla Renk</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4$ kırmızı, $5$ mavi top içeren torbadan ardışık $3$ top yerine konmadan çekiliyor. Sırasıyla <strong>kırmızı, mavi, kırmızı</strong> gelme olasılığı kaçtır?<br><br>
      <strong>A)</strong> 42/5 &nbsp; <strong>B)</strong> 6/42 &nbsp; <strong>C)</strong> 4/42 &nbsp; <strong>D)</strong> 5/43 &nbsp; <strong>E)</strong> <span class="key">5/42</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P = \\dfrac{4}{9} \\cdot \\dfrac{5}{8} \\cdot \\dfrac{3}{7} = \\dfrac{60}{504} = \\dfrac{5}{42}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5/42</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Bağımsız Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Ali'nin bir sınavı geçme olasılığı $\\dfrac{2}{3}$, Veli'nin geçme olasılığı $\\dfrac{3}{4}$'tür. <strong>İkisinin de geçmesi</strong> olasılığı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1/2</span> &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 2/2 &nbsp; <strong>D)</strong> 1/3 &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bağımsız: $P(A \\cap V) = P(A) \\cdot P(V) = \\dfrac{2}{3} \\cdot \\dfrac{3}{4} = \\dfrac{6}{12} = \\dfrac{1}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1/2</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Birleşim</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Ali'nin bir sınavı geçme olasılığı $\\dfrac{2}{3}$, Veli'nin $\\dfrac{3}{4}$'tür. <strong>En az birinin</strong> geçme olasılığı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">11/12</span> &nbsp; <strong>B)</strong> 12/11 &nbsp; <strong>C)</strong> 10/12 &nbsp; <strong>D)</strong> 11/13 &nbsp; <strong>E)</strong> 1/12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümleyen</div>
      <p class="ales-sol-step">"En az biri geçer" $=$ "ikisi de kalır" değil.</p>
      <p class="ales-sol-step">Ali kalır: $1 - 2/3 = 1/3$. Veli kalır: $1 - 3/4 = 1/4$.</p>
      <p class="ales-sol-step">İkisi de kalır: $\\dfrac{1}{3} \\cdot \\dfrac{1}{4} = \\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">En az biri geçer: $1 - \\dfrac{1}{12} = \\dfrac{11}{12}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Birleşim</div>
      <p class="ales-sol-step">$P(A \\cup V) = P(A) + P(V) - P(A) P(V) = \\dfrac{2}{3} + \\dfrac{3}{4} - \\dfrac{1}{2} = \\dfrac{8 + 9 - 6}{12} = \\dfrac{11}{12}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 11/12</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Komplement (Tümleyen) Hız Tekniği + Dahil-Hariç
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Komplement Hız Tekniği</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">"En Az Bir" Komplement</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Para $4$ kez atılıyor. <strong>En az bir kez</strong> tura gelme olasılığı kaçtır?<br><br>
      <strong>A)</strong> 16/15 &nbsp; <strong>B)</strong> 14/16 &nbsp; <strong>C)</strong> 15/17 &nbsp; <strong>D)</strong> 1/16 &nbsp; <strong>E)</strong> <span class="key">15/16</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Komplement</div>
      <p class="ales-sol-step">"En az 1 tura"nın tümleyeni: "hiç tura yok" $=$ "hepsi yazı".</p>
      <p class="ales-sol-step">$P(\\text{all heads}) = (1/2)^4 = 1/16$.</p>
      <p class="ales-sol-step">$P(\\text{en az 1 tura}) = 1 - \\dfrac{1}{16} = \\dfrac{15}{16}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 15/16</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">"Hepsi" Komplement</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $4$ kız ve $6$ erkek arasından rastgele $3$ kişi seçiliyor. <strong>Üçünün de erkek olmaması</strong> olasılığı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">5/6</span> &nbsp; <strong>B)</strong> 6/5 &nbsp; <strong>C)</strong> 4/6 &nbsp; <strong>D)</strong> 5/7 &nbsp; <strong>E)</strong> 1/6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Komplement</div>
      <p class="ales-sol-step">"Üçü de erkek olmaması" $=$ $1 -$ "üçü de erkek".</p>
      <p class="ales-sol-step">$P(\\text{three boys}) = \\dfrac{C(6,3)}{C(10,3)} = \\dfrac{20}{120} = \\dfrac{1}{6}$.</p>
      <p class="ales-sol-step">İstenen $= 1 - \\dfrac{1}{6} = \\dfrac{5}{6}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 5/6</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Doğum Günü Klasiği (Mini)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3$ kişiden oluşan grupta, en az ikisinin aynı ayda doğmuş olma olasılığı kaçtır? (Aylar eşit kabul edilir.)<br><br>
      <strong>A)</strong> 72/17 &nbsp; <strong>B)</strong> <span class="key">17/72</span> &nbsp; <strong>C)</strong> 18/72 &nbsp; <strong>D)</strong> 16/72 &nbsp; <strong>E)</strong> 17/73
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Komplement</div>
      <p class="ales-sol-step">"En az iki kişi aynı ay" $=$ $1 -$ "üçünün de farklı ay".</p>
      <p class="ales-sol-step">"Üçü farklı ay": $\\dfrac{12 \\cdot 11 \\cdot 10}{12^3} = \\dfrac{1320}{1728} = \\dfrac{55}{72}$.</p>
      <p class="ales-sol-step">İstenen $= 1 - \\dfrac{55}{72} = \\dfrac{17}{72}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 17/72</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İki Zar — En Az</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki zar atıldığında, <strong>en az birinin $6$</strong> gelme olasılığı kaçtır?<br><br>
      <strong>A)</strong> 36/11 &nbsp; <strong>B)</strong> <span class="key">11/36</span> &nbsp; <strong>C)</strong> 12/36 &nbsp; <strong>D)</strong> 10/36 &nbsp; <strong>E)</strong> 11/37
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Komplement</div>
      <p class="ales-sol-step">"Hiçbiri 6 değil": her zar 5 seçenek (1-5) $\\Rightarrow$ $\\dfrac{5 \\cdot 5}{36} = \\dfrac{25}{36}$.</p>
      <p class="ales-sol-step">"En az biri 6" $= 1 - \\dfrac{25}{36} = \\dfrac{11}{36}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Birleşim</div>
      <p class="ales-sol-step">$P(\\text{birinci 6}) + P(\\text{ikinci 6}) - P(\\text{ikisi 6}) = \\dfrac{6}{36} + \\dfrac{6}{36} - \\dfrac{1}{36} = \\dfrac{11}{36}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 11/36</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Dahil-Hariç İlkesi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir sınıftaki öğrencilerin $\\%60$'ı matematiği, $\\%50$'si fiziği seviyor. $\\%30$'u her ikisini de seviyor. Rastgele seçilen bir öğrencinin <strong>en az birini sevme</strong> olasılığı kaçtır?<br><br>
      <strong>A)</strong> $0{,}3$ &nbsp; <strong>B)</strong> $0{,}5$ &nbsp; <strong>C)</strong> $0{,}7$ &nbsp; <strong>D)</strong> <span class="key">$0{,}8$</span> &nbsp; <strong>E)</strong> $1{,}1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P(M \\cup F) = P(M) + P(F) - P(M \\cap F) = 0{,}6 + 0{,}5 - 0{,}3 = 0{,}8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $0{,}8$ (%80)</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Hiçbirini Sevmeme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Önceki soru verileriyle, rastgele seçilen bir öğrencinin <strong>hiçbirini sevmeme</strong> olasılığı kaçtır?<br><br>
      <strong>A)</strong> $0{,}1$ &nbsp; <strong>B)</strong> <span class="key">$0{,}2$</span> &nbsp; <strong>C)</strong> $0{,}3$ &nbsp; <strong>D)</strong> $0{,}4$ &nbsp; <strong>E)</strong> $0{,}5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P(\\text{none}) = 1 - P(M \\cup F) = 1 - 0{,}8 = 0{,}2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $0{,}2$ (%20)</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — En Az 2</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Para $5$ kez atılıyor. <strong>En az $2$ tura</strong> gelme olasılığı kaçtır?<br><br>
      <strong>A)</strong> 16/13 &nbsp; <strong>B)</strong> <span class="key">13/16</span> &nbsp; <strong>C)</strong> 14/16 &nbsp; <strong>D)</strong> 12/16 &nbsp; <strong>E)</strong> 13/17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Komplement</div>
      <p class="ales-sol-step">"En az 2 tura" $= 1 -$ "0 tura" $-$ "1 tura".</p>
      <p class="ales-sol-step">Toplam diziliş $= 2^5 = 32$.</p>
      <p class="ales-sol-step">$0$ tura: $1$ adet (hepsi yazı). $1$ tura: $C(5,1) = 5$ adet.</p>
      <p class="ales-sol-step">$P = 1 - \\dfrac{1}{32} - \\dfrac{5}{32} = \\dfrac{26}{32} = \\dfrac{13}{16}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 13/16</span></div>
    </div>
  </div>
</section>
`
};
