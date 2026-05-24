window.ALES_LESSON = {
n: 44,
title: "Kombinasyon",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>kombinasyon</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Anahtar kelime <strong>"sıra önemsiz"</strong>. Tanım ve simetri, "en az/en çok" koşulları (komplement) ve permütasyon-kombinasyon ayrımı problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — C(n,r) Tanım + Simetri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">C(n,r) Tanımı ve Simetri</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Direkt Hesap</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $C(7, 2)$ kaçtır?<br><br>
      <strong>A)</strong> 20 &nbsp; <strong>B)</strong> 22 &nbsp; <strong>C)</strong> 19 &nbsp; <strong>D)</strong> 23 &nbsp; <strong>E)</strong> <span class="key">21</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$C(n, r) = \\dfrac{n!}{r! (n - r)!}$.</p>
      <p class="ales-sol-step">$C(7, 2) = \\dfrac{7!}{2! \\cdot 5!} = \\dfrac{7 \\cdot 6}{2} = 21$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 21</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Komite Seçimi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $10$ kişiden $3$ kişilik bir komite kaç farklı şekilde seçilir?<br><br>
      <strong>A)</strong> 119 &nbsp; <strong>B)</strong> <span class="key">120</span> &nbsp; <strong>C)</strong> 121 &nbsp; <strong>D)</strong> 118 &nbsp; <strong>E)</strong> 122
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Komite üyelerinin sırası önemli değil $\\Rightarrow$ kombinasyon.</p>
      <p class="ales-sol-step">$C(10, 3) = \\dfrac{10 \\cdot 9 \\cdot 8}{3 \\cdot 2 \\cdot 1} = \\dfrac{720}{6} = 120$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 120</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Simetri Özelliği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $C(20, 18)$ değerini en kolay yoldan bulun.<br><br>
      <strong>A)</strong> 189 &nbsp; <strong>B)</strong> 191 &nbsp; <strong>C)</strong> 192 &nbsp; <strong>D)</strong> 188 &nbsp; <strong>E)</strong> <span class="key">190</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Simetri</div>
      <p class="ales-sol-step">$C(n, r) = C(n, n - r)$.</p>
      <p class="ales-sol-step">$C(20, 18) = C(20, 2) = \\dfrac{20 \\cdot 19}{2} = 190$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 190</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Doğru Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir düzlem üzerinde, herhangi üçü doğrusal olmayan $8$ nokta vardır. Bu noktalardan kaç farklı doğru çizilir?<br><br>
      <strong>A)</strong> <span class="key">28</span> &nbsp; <strong>B)</strong> 27 &nbsp; <strong>C)</strong> 29 &nbsp; <strong>D)</strong> 26 &nbsp; <strong>E)</strong> 30
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bir doğru iki noktadan geçer (sıra önemsiz) $\\Rightarrow$ $C(8, 2)$.</p>
      <p class="ales-sol-step">$C(8, 2) = \\dfrac{8 \\cdot 7}{2} = 28$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 28</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Üçgen Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Düzlemde, herhangi üçü doğrusal olmayan $7$ nokta vardır. Bu noktaları köşe kabul eden kaç üçgen çizilir?<br><br>
      <strong>A)</strong> 34 &nbsp; <strong>B)</strong> 36 &nbsp; <strong>C)</strong> <span class="key">35</span> &nbsp; <strong>D)</strong> 33 &nbsp; <strong>E)</strong> 37
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üçgenin köşeleri sırasız $3$ nokta seçimi $\\Rightarrow$ $C(7, 3)$.</p>
      <p class="ales-sol-step">$C(7, 3) = \\dfrac{7 \\cdot 6 \\cdot 5}{6} = 35$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 35</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Denklem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $C(n, 4) = C(n, 6)$ ise $n$ kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> <span class="key">10</span> &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Simetri</div>
      <p class="ales-sol-step">$C(n, r) = C(n, s) \\Rightarrow r = s$ veya $r + s = n$.</p>
      <p class="ales-sol-step">$4 \\neq 6 \\Rightarrow 4 + 6 = n \\Rightarrow n = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 10</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İki Gruptan Karma Seçim</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $5$ erkek ve $4$ kadın arasından $2$ erkek ve $2$ kadın seçilerek kaç farklı $4$ kişilik komite oluşturulur?<br><br>
      <strong>A)</strong> 59 &nbsp; <strong>B)</strong> 61 &nbsp; <strong>C)</strong> <span class="key">60</span> &nbsp; <strong>D)</strong> 58 &nbsp; <strong>E)</strong> 62
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Erkeklerden seçim: $C(5, 2) = 10$.</p>
      <p class="ales-sol-step">Kadınlardan seçim: $C(4, 2) = 6$.</p>
      <p class="ales-sol-step">Bağımsız adımlar çarpılır: $10 \\cdot 6 = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 60</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — En Az / En Çok (Komplement)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">En Az / En Çok Koşulları</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">En Az 1 Koşulu</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $4$ kız ve $5$ erkekten oluşan gruptan $3$ kişilik komite, en az $1$ kız içerecek şekilde kaç farklı seçilebilir?<br><br>
      <strong>A)</strong> 73 &nbsp; <strong>B)</strong> 75 &nbsp; <strong>C)</strong> <span class="key">74</span> &nbsp; <strong>D)</strong> 72 &nbsp; <strong>E)</strong> 76
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümleyen (Komplement)</div>
      <p class="ales-sol-step">Toplam $3$ kişi seçimi: $C(9, 3) = 84$.</p>
      <p class="ales-sol-step">"Hiç kız yok" $=$ tüm seçim erkek: $C(5, 3) = 10$.</p>
      <p class="ales-sol-step">En az $1$ kız $= 84 - 10 = 74$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrudan</div>
      <p class="ales-sol-step">$1$ kız $2$ erkek $+$ $2$ kız $1$ erkek $+$ $3$ kız.</p>
      <p class="ales-sol-step">$C(4,1) C(5,2) + C(4,2) C(5,1) + C(4,3) C(5,0) = 4 \\cdot 10 + 6 \\cdot 5 + 4 \\cdot 1 = 40 + 30 + 4 = 74$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 74</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">En Az 2 Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5$ kız ve $4$ erkek arasından $4$ kişilik komite, en az $2$ kız içerecek şekilde kaç farklı seçilir?<br><br>
      <strong>A)</strong> 104 &nbsp; <strong>B)</strong> <span class="key">105</span> &nbsp; <strong>C)</strong> 106 &nbsp; <strong>D)</strong> 103 &nbsp; <strong>E)</strong> 107
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Doğrudan</div>
      <p class="ales-sol-step">"$2$K-$2$E" $+$ "$3$K-$1$E" $+$ "$4$K-$0$E".</p>
      <p class="ales-sol-step">$C(5,2) C(4,2) + C(5,3) C(4,1) + C(5,4) C(4,0)$.</p>
      <p class="ales-sol-step">$= 10 \\cdot 6 + 10 \\cdot 4 + 5 \\cdot 1 = 60 + 40 + 5 = 105$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 105</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">En Çok Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $6$ erkek ve $4$ kadından $5$ kişilik komite, <strong>en çok $2$ kadın</strong> içerecek şekilde kaç farklı seçilir?<br><br>
      <strong>A)</strong> 185 &nbsp; <strong>B)</strong> 187 &nbsp; <strong>C)</strong> <span class="key">186</span> &nbsp; <strong>D)</strong> 184 &nbsp; <strong>E)</strong> 188
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">"$0$K-$5$E" $+$ "$1$K-$4$E" $+$ "$2$K-$3$E".</p>
      <p class="ales-sol-step">$C(4,0) C(6,5) + C(4,1) C(6,4) + C(4,2) C(6,3) = 1 \\cdot 6 + 4 \\cdot 15 + 6 \\cdot 20 = 6 + 60 + 120 = 186$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 186</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Belirli Eleman Dahil</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $10$ kişiden $4$ kişilik komite, belirli bir A kişisi <strong>komitede olmak üzere</strong> kaç farklı şekilde seçilir?<br><br>
      <strong>A)</strong> 83 &nbsp; <strong>B)</strong> 85 &nbsp; <strong>C)</strong> 82 &nbsp; <strong>D)</strong> <span class="key">84</span> &nbsp; <strong>E)</strong> 86
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A sabit. Geriye kalan $9$ kişiden $3$ kişilik seçim: $C(9, 3) = 84$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 84</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Belirli Eleman Hariç</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $10$ kişiden $4$ kişilik komite, belirli bir B kişisi <strong>komitede olmamak üzere</strong> kaç farklı şekilde seçilir?<br><br>
      <strong>A)</strong> 125 &nbsp; <strong>B)</strong> 127 &nbsp; <strong>C)</strong> <span class="key">126</span> &nbsp; <strong>D)</strong> 128 &nbsp; <strong>E)</strong> 124
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">B'yi çıkar. Geriye kalan $9$ kişiden $4$ kişilik seçim: $C(9, 4) = 126$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 126</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">A Olacak / B Olmayacak</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $10$ kişiden $4$ kişilik komite, A komitede ve B komitede olmamak şartıyla kaç farklı seçilir?<br><br>
      <strong>A)</strong> 55 &nbsp; <strong>B)</strong> 57 &nbsp; <strong>C)</strong> 54 &nbsp; <strong>D)</strong> <span class="key">56</span> &nbsp; <strong>E)</strong> 58
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A sabit (1 alındı), B çıkarılır. Geriye $10 - 2 = 8$ kişiden $3$ kişilik seçim.</p>
      <p class="ales-sol-step">$C(8, 3) = 56$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 56</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">"En Az 3" Tümleyen</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $7$ erkek ve $5$ kadından oluşan grup içinden $5$ kişilik bir kurul, <strong>en az $3$ erkek</strong> içerecek şekilde kaç farklı oluşturulur?<br><br>
      <strong>A)</strong> <span class="key">546</span> &nbsp; <strong>B)</strong> 545 &nbsp; <strong>C)</strong> 547 &nbsp; <strong>D)</strong> 544 &nbsp; <strong>E)</strong> 548
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">"$3$E-$2$K" $+$ "$4$E-$1$K" $+$ "$5$E-$0$K".</p>
      <p class="ales-sol-step">$C(7,3) C(5,2) + C(7,4) C(5,1) + C(7,5) C(5,0)$.</p>
      <p class="ales-sol-step">$= 35 \\cdot 10 + 35 \\cdot 5 + 21 \\cdot 1 = 350 + 175 + 21 = 546$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 546</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Permütasyon vs Kombinasyon Ayrımı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Permütasyon mu Kombinasyon mu? (Sıra Önemli mi?)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Sıralı vs Sırasız Karşılaştırma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $8$ sporcudan oluşan bir takımdan $3$ kişi seçilecek. <br>
      <strong>(a)</strong> Sadece kim olduğu önemliyse kaç şekilde? <br>
      <strong>(b)</strong> Birinci, ikinci, üçüncü olarak sıralanacaksa kaç şekilde?<br><br>
      <strong>A)</strong> (a) $24$ &nbsp; (b) $56$ &nbsp; <strong>B)</strong> (a) $28$ &nbsp; (b) $168$ &nbsp; <strong>C)</strong> <span class="key">(a) $56$ &nbsp; (b) $336$</span> &nbsp; <strong>D)</strong> (a) $56$ &nbsp; (b) $112$ &nbsp; <strong>E)</strong> (a) $336$ &nbsp; (b) $56$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>(a)</strong> Sıra önemsiz $\\Rightarrow$ <strong>kombinasyon</strong>: $C(8, 3) = 56$.</p>
      <p class="ales-sol-step"><strong>(b)</strong> Sıra önemli $\\Rightarrow$ <strong>permütasyon</strong>: $P(8, 3) = 8 \\cdot 7 \\cdot 6 = 336$.</p>
      <p class="ales-sol-step"><strong>İlişki:</strong> $P(n, r) = C(n, r) \\cdot r!$. Burada $336 = 56 \\cdot 6 = 56 \\cdot 3!$. ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (a) 56 &nbsp; (b) 336</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">El Sıkışma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $12$ kişilik bir grup, herkes diğer herkesle bir kez el sıkışıyor. Toplam kaç el sıkışma gerçekleşir?<br><br>
      <strong>A)</strong> 65 &nbsp; <strong>B)</strong> <span class="key">66</span> &nbsp; <strong>C)</strong> 67 &nbsp; <strong>D)</strong> 64 &nbsp; <strong>E)</strong> 68
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">"A B'yle el sıkışma" ile "B A'yla el sıkışma" aynı $\\Rightarrow$ sıra önemsiz, kombinasyon.</p>
      <p class="ales-sol-step">$C(12, 2) = \\dfrac{12 \\cdot 11}{2} = 66$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 66</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Çekiliş — Sıra Önemli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $20$ bilet arasından bir <strong>büyük ikramiye</strong> ve bir <strong>teselli ödülü</strong> çekilecektir. Bu kaç farklı şekilde olabilir?<br><br>
      <strong>A)</strong> <span class="key">380</span> &nbsp; <strong>B)</strong> 379 &nbsp; <strong>C)</strong> 381 &nbsp; <strong>D)</strong> 378 &nbsp; <strong>E)</strong> 382
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ödüller farklı $\\Rightarrow$ "A büyük, B teselli" ile "B büyük, A teselli" farklı $\\Rightarrow$ sıra önemli.</p>
      <p class="ales-sol-step">$P(20, 2) = 20 \\cdot 19 = 380$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 380</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Karşıt Örnek — İki Ödül Eşit</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $20$ bilet arasından <strong>iki tane eşit değerli ödül</strong> çekilecektir. Bu kaç farklı şekilde olabilir?<br><br>
      <strong>A)</strong> 189 &nbsp; <strong>B)</strong> 191 &nbsp; <strong>C)</strong> <span class="key">190</span> &nbsp; <strong>D)</strong> 192 &nbsp; <strong>E)</strong> 188
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ödüller eşit $\\Rightarrow$ kim önce çekildi önemli değil $\\Rightarrow$ kombinasyon.</p>
      <p class="ales-sol-step">$C(20, 2) = \\dfrac{20 \\cdot 19}{2} = 190$.</p>
      <p class="ales-sol-step"><strong>Tip karşılaştırma:</strong> Önceki problemde sıra önemli (380), bu problemde önemsiz (190). Tam yarısı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 190</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Köşegen Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Düzgün $8$gen'in toplam köşegen sayısı kaçtır?<br><br>
      <strong>A)</strong> 19 &nbsp; <strong>B)</strong> <span class="key">20</span> &nbsp; <strong>C)</strong> 21 &nbsp; <strong>D)</strong> 18 &nbsp; <strong>E)</strong> 22
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Köşeleri ikişerli birleştir: $C(8, 2) = 28$. Bunlardan $8$ tanesi kenardır, köşegen değildir.</p>
      <p class="ales-sol-step">Köşegen sayısı $= 28 - 8 = 20$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Formül</div>
      <p class="ales-sol-step">$n$ kenarlı çokgenin köşegen sayısı: $\\dfrac{n(n - 3)}{2} = \\dfrac{8 \\cdot 5}{2} = 20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 20</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Sentez — Komite Sırası</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $8$ kişiden $1$ başkan, $1$ başkan yardımcısı ve $3$ üyeden oluşan kurul kaç farklı şekilde oluşturulur?<br><br>
      <strong>A)</strong> <span class="key">1120</span> &nbsp; <strong>B)</strong> 1121 &nbsp; <strong>C)</strong> 1119 &nbsp; <strong>D)</strong> 1122 &nbsp; <strong>E)</strong> 1118
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Önce başkan ve yardımcı (sıralı): $P(8, 2) = 8 \\cdot 7 = 56$.</p>
      <p class="ales-sol-step">Geriye $6$ kişi var, $3$ üye seçilecek (sırasız): $C(6, 3) = 20$.</p>
      <p class="ales-sol-step">$56 \\cdot 20 = 1120$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1120</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karma Sentez (Kart)</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $52$ iskambil destesinden $5$ kart çekildiğinde, tam $3$'ünün <strong>kupa</strong> olma yolu kaç farklı şekildedir?<br><br>
      <strong>A)</strong> 211925 &nbsp; <strong>B)</strong> 211927 &nbsp; <strong>C)</strong> <span class="key">211926</span> &nbsp; <strong>D)</strong> 211924 &nbsp; <strong>E)</strong> 211928
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Destede $13$ kupa, $39$ kupa olmayan kart vardır. Sıra önemsiz.</p>
      <p class="ales-sol-step">$3$ kupa: $C(13, 3) = 286$. $2$ kupa olmayan: $C(39, 2) = 741$.</p>
      <p class="ales-sol-step">$286 \\cdot 741 = 211926$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 211 926</span></div>
    </div>
  </div>
</section>
`
};
