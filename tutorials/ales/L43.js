window.ALES_LESSON = {
n: 43,
title: "Permütasyon",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>permütasyon</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Anahtar kelime <strong>"sıra önemli"</strong>. Sayma temel ilkesi, faktöriyel, daire dizilişi ve tekrarlı permütasyon problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Sayma Temel İlkesi (Çarpma Kuralı)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Sayma Temel İlkesi (Çarpma Kuralı)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Yemek Menüsü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir lokantada $4$ çeşit çorba, $5$ çeşit ana yemek ve $3$ çeşit tatlı vardır. Birer adet seçilerek kaç farklı menü oluşturulabilir?<br><br>
      <strong>A)</strong> <span class="key">60</span> &nbsp; <strong>B)</strong> 59 &nbsp; <strong>C)</strong> 61 &nbsp; <strong>D)</strong> 58 &nbsp; <strong>E)</strong> 62
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpma kuralı: bağımsız adımlar çarpılır.</p>
      <p class="ales-sol-step">$4 \\cdot 5 \\cdot 3 = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 60</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Plaka — Tekrarlı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\{1, 2, 3, 4, 5\\}$ rakamları kullanılarak (tekrara izinli) üç basamaklı kaç farklı sayı yazılabilir?<br><br>
      <strong>A)</strong> 124 &nbsp; <strong>B)</strong> <span class="key">125</span> &nbsp; <strong>C)</strong> 126 &nbsp; <strong>D)</strong> 123 &nbsp; <strong>E)</strong> 127
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üç basamağın her biri $5$ seçenek (tekrar serbest).</p>
      <p class="ales-sol-step">$5 \\cdot 5 \\cdot 5 = 125$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 125</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Tekrarsız</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\{1, 2, 3, 4, 5\\}$ rakamlarından <strong>tekrarsız</strong> olarak üç basamaklı kaç farklı sayı yazılabilir?<br><br>
      <strong>A)</strong> 59 &nbsp; <strong>B)</strong> 61 &nbsp; <strong>C)</strong> 58 &nbsp; <strong>D)</strong> 62 &nbsp; <strong>E)</strong> <span class="key">60</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk basamak $5$, ikinci $4$ (kullanılan hariç), üçüncü $3$.</p>
      <p class="ales-sol-step">$5 \\cdot 4 \\cdot 3 = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 60</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Sıfır Kısıtı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\{0, 1, 2, 3, 4\\}$ rakamlarından <strong>tekrarsız</strong> olarak üç basamaklı kaç farklı sayı yazılabilir?<br><br>
      <strong>A)</strong> 47 &nbsp; <strong>B)</strong> 49 &nbsp; <strong>C)</strong> <span class="key">48</span> &nbsp; <strong>D)</strong> 46 &nbsp; <strong>E)</strong> 50
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk basamak sıfır olamaz: $4$ seçenek (1, 2, 3, 4).</p>
      <p class="ales-sol-step">İkinci basamak: kullanılan hariç $4$ seçenek (artık sıfır da serbest).</p>
      <p class="ales-sol-step">Üçüncü basamak: $3$ seçenek.</p>
      <p class="ales-sol-step">$4 \\cdot 4 \\cdot 3 = 48$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 48</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Çift Sayı Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\{1, 2, 3, 4, 5\\}$ rakamlarından tekrarsız üç basamaklı kaç farklı <strong>çift</strong> sayı yazılabilir?<br><br>
      <strong>A)</strong> 23 &nbsp; <strong>B)</strong> 25 &nbsp; <strong>C)</strong> 22 &nbsp; <strong>D)</strong> 26 &nbsp; <strong>E)</strong> <span class="key">24</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Birler Basamağından Başla</div>
      <p class="ales-sol-step">Sayı çift olmalı $\\Rightarrow$ birler basamağı $\\{2, 4\\}$, $2$ seçenek.</p>
      <p class="ales-sol-step">Yüzler basamağı: kalan $4$ rakamdan biri (sıfır yok), $4$ seçenek.</p>
      <p class="ales-sol-step">Onlar basamağı: kalan $3$ rakam.</p>
      <p class="ales-sol-step">$2 \\cdot 4 \\cdot 3 = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 24</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Yol Sayma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A şehrinden B şehrine $4$ yol, B şehrinden C şehrine $3$ yol vardır. A'dan C'ye gidip aynı yolları kullanmadan geri dönmek kaç farklı şekilde mümkündür?<br><br>
      <strong>A)</strong> 71 &nbsp; <strong>B)</strong> 73 &nbsp; <strong>C)</strong> <span class="key">72</span> &nbsp; <strong>D)</strong> 70 &nbsp; <strong>E)</strong> 74
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A→B→C: $4 \\cdot 3 = 12$.</p>
      <p class="ales-sol-step">C→B (gidişten farklı): $3 - 1 = 2$. B→A (gidişten farklı): $4 - 1 = 3$.</p>
      <p class="ales-sol-step">Toplam: $12 \\cdot 2 \\cdot 3 = 72$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 72</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Aralıkta Sayma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Rakamları farklı, üç basamaklı, $400$'den büyük kaç doğal sayı yazılabilir?<br><br>
      <strong>A)</strong> 431 &nbsp; <strong>B)</strong> 433 &nbsp; <strong>C)</strong> 430 &nbsp; <strong>D)</strong> 434 &nbsp; <strong>E)</strong> <span class="key">432</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yüzler basamağı $\\{4, 5, 6, 7, 8, 9\\}$, $6$ seçenek.</p>
      <p class="ales-sol-step">Onlar: yüzler hariç $9$ seçenek (sıfır dahil).</p>
      <p class="ales-sol-step">Birler: kalan $8$ seçenek.</p>
      <p class="ales-sol-step">$6 \\cdot 9 \\cdot 8 = 432$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 432</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — n!, P(n,r), Daire Dizilişi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Faktöriyel, P(n,r) ve Daire Dizilişi</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">n! Hesabı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5$ farklı kitap bir rafa yan yana kaç farklı şekilde dizilebilir?<br><br>
      <strong>A)</strong> <span class="key">120</span> &nbsp; <strong>B)</strong> 119 &nbsp; <strong>C)</strong> 121 &nbsp; <strong>D)</strong> 118 &nbsp; <strong>E)</strong> 122
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$n$ farklı nesnenin sıralı dizilimi $= n!$.</p>
      <p class="ales-sol-step">$5! = 120$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 120</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">P(n,r) — Sıralı Seçim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $8$ sporcu arasından ilk üç dereceye girenler kaç farklı şekilde belirlenebilir?<br><br>
      <strong>A)</strong> 335 &nbsp; <strong>B)</strong> 337 &nbsp; <strong>C)</strong> 334 &nbsp; <strong>D)</strong> <span class="key">336</span> &nbsp; <strong>E)</strong> 338
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sıra Önemli</div>
      <p class="ales-sol-step">Birinci, ikinci, üçüncü farklı dereceler $\\Rightarrow$ <strong>sıra önemli</strong>.</p>
      <p class="ales-sol-step">$P(8, 3) = \\dfrac{8!}{(8-3)!} = 8 \\cdot 7 \\cdot 6 = 336$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 336</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Daire Dizilişi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $6$ kişi yuvarlak bir masa etrafına kaç farklı şekilde oturabilir?<br><br>
      <strong>A)</strong> <span class="key">120</span> &nbsp; <strong>B)</strong> 119 &nbsp; <strong>C)</strong> 121 &nbsp; <strong>D)</strong> 118 &nbsp; <strong>E)</strong> 122
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Daire dizilişinde formül: $(n-1)!$.</p>
      <p class="ales-sol-step">$(6 - 1)! = 5! = 120$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 120</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Bitişik Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5$ kişi bir banka oturacak. İki belirli kişi <strong>yan yana</strong> oturmak şartıyla kaç farklı oturuş vardır?<br><br>
      <strong>A)</strong> 47 &nbsp; <strong>B)</strong> 49 &nbsp; <strong>C)</strong> 46 &nbsp; <strong>D)</strong> 50 &nbsp; <strong>E)</strong> <span class="key">48</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Blok Tekniği</div>
      <p class="ales-sol-step">Yan yana olacak iki kişiyi tek blok kabul et: artık $4$ "nesne".</p>
      <p class="ales-sol-step">$4! = 24$ şekilde sıralanır. Blok içindeki iki kişi kendi arasında $2! = 2$.</p>
      <p class="ales-sol-step">Toplam: $24 \\cdot 2 = 48$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 48</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Ayrık Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5$ kişi bir banka oturacak. İki belirli kişi <strong>yan yana olmamak</strong> şartıyla kaç farklı oturuş vardır?<br><br>
      <strong>A)</strong> 71 &nbsp; <strong>B)</strong> 73 &nbsp; <strong>C)</strong> 70 &nbsp; <strong>D)</strong> <span class="key">72</span> &nbsp; <strong>E)</strong> 74
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümleyen</div>
      <p class="ales-sol-step">Toplam diziliş $= 5! = 120$.</p>
      <p class="ales-sol-step">Yan yana olanlar (önceki problem) $= 48$.</p>
      <p class="ales-sol-step">Yan yana olmayanlar $= 120 - 48 = 72$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 72</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Daire — Karşılıklı Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3$ erkek ve $3$ kadın yuvarlak bir masaya kadın-erkek dönüşümlü olacak şekilde kaç farklı şekilde oturabilir?<br><br>
      <strong>A)</strong> <span class="key">12</span> &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Önce $3$ erkeği yuvarlağa otur: $(3 - 1)! = 2! = 2$ şekilde.</p>
      <p class="ales-sol-step">Aralarına $3$ kadın yerleşir, kadınlar arasındaki sıra $3! = 6$ şekilde.</p>
      <p class="ales-sol-step">Toplam: $2 \\cdot 6 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 12</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Sıralı Konum</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $7$ harfli ANKARA kelimesindeki harflerle, ilk harf $A$ ve son harf $A$ olacak şekilde kaç farklı dizilim yapılabilir?<br><br>
      <strong>A)</strong> 23 &nbsp; <strong>B)</strong> 25 &nbsp; <strong>C)</strong> <span class="key">24</span> &nbsp; <strong>D)</strong> 22 &nbsp; <strong>E)</strong> 26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">"ANKARA" $6$ harfli (A, N, K, A, R, A); A harfi $3$ kez tekrar.</p>
      <p class="ales-sol-step">İlk ve son harf A sabit. Geriye kalan $4$ harf: $\\{N, K, A, R\\}$ (bir A kaldı, diğerleri tek).</p>
      <p class="ales-sol-step">Ortadaki $4$ konuma bu $4$ farklı harf: $4! = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 24</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Tekrarlı Permütasyon + Bitişik/Ayrık
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Tekrarlı Permütasyon ve Koşullu Diziliş</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Tekrarlı Harfler</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      "ALMA" kelimesinin harflerinin tüm farklı diziliş sayısı kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> <span class="key">12</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$4$ harf, A iki kez tekrar. Tekrarlı permütasyon: $\\dfrac{n!}{k_1! \\cdot k_2! \\cdots}$.</p>
      <p class="ales-sol-step">$\\dfrac{4!}{2!} = \\dfrac{24}{2} = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 12</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Çoklu Tekrar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      "MATEMATİK" kelimesinin harflerinin tüm farklı diziliş sayısı kaçtır?<br><br>
      <strong>A)</strong> 45359 &nbsp; <strong>B)</strong> 45361 &nbsp; <strong>C)</strong> <span class="key">45360</span> &nbsp; <strong>D)</strong> 45358 &nbsp; <strong>E)</strong> 45362
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">"MATEMATİK" $9$ harfli. Tekrarlar: M=2, A=2, T=2; E, İ, K birer kez.</p>
      <p class="ales-sol-step">$\\dfrac{9!}{2! \\cdot 2! \\cdot 2!} = \\dfrac{362880}{8} = 45360$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 45360</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Tekrarlı Bitişik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      "KİTAP" kelimesinin harfleri ile, sesli harfler (İ, A) <strong>yan yana</strong> olacak şekilde kaç farklı dizilim oluşturulur?<br><br>
      <strong>A)</strong> 47 &nbsp; <strong>B)</strong> 49 &nbsp; <strong>C)</strong> <span class="key">48</span> &nbsp; <strong>D)</strong> 46 &nbsp; <strong>E)</strong> 50
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Blok Tekniği</div>
      <p class="ales-sol-step">İ ve A yan yana $\\Rightarrow$ blok. Bloğu tek nesne say: $\\{K, T, P, [\\text{IA}]\\}$, $4$ nesne.</p>
      <p class="ales-sol-step">$4! = 24$. Blok içinde $2! = 2$.</p>
      <p class="ales-sol-step">$24 \\cdot 2 = 48$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 48</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Sıralı Konum (Sözlük)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      "AHMET" harfleri sözlük sırasına göre dizildiğinde "AHMET" kelimesi baştan kaçıncı sırada bulunur?<br><br>
      <strong>A)</strong> <span class="key">9.</span> &nbsp; <strong>B)</strong> 8. &nbsp; <strong>C)</strong> 10. &nbsp; <strong>D)</strong> 7. &nbsp; <strong>E)</strong> 11.
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Alfabe sırasıyla harfler: A, E, H, M, T.</p>
      <p class="ales-sol-step">İlk harf A ile başlayanlar: $4! = 24$ adet.</p>
      <p class="ales-sol-step">A ile başlayanların sıralaması: ikinci harf E, H, M, T sırası.</p>
      <p class="ales-sol-step">A-E... ile başlayan: $3! = 6$. A-H... ile başlayan: $6$. A-H-... olan AHMET'e bakalım.</p>
      <p class="ales-sol-step">A-E... = $1\\dots 6$, A-H... = $7\\dots 12$. A-H ile başlayan dizilimleri sırala: A-H-E-M-T (7), A-H-E-T-M (8), A-H-M-E-T (9), A-H-M-T-E (10), A-H-T-E-M (11), A-H-T-M-E (12).</p>
      <p class="ales-sol-step">"AHMET" $\\Rightarrow$ <strong>9.</strong> sırada.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 9.</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Üçlü Bitişik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $7$ kişi bir banka oturacak. Belirli $3$ kişi <strong>üçü de yan yana</strong> olacak şekilde kaç farklı oturuş vardır?<br><br>
      <strong>A)</strong> 719 &nbsp; <strong>B)</strong> 721 &nbsp; <strong>C)</strong> 718 &nbsp; <strong>D)</strong> <span class="key">720</span> &nbsp; <strong>E)</strong> 722
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üçlü Blok</div>
      <p class="ales-sol-step">$3$ kişi tek blok: artık $5$ nesne ($4$ kişi + 1 blok).</p>
      <p class="ales-sol-step">$5! = 120$. Blok içinde $3! = 6$.</p>
      <p class="ales-sol-step">$120 \\cdot 6 = 720$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 720</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Ayrık Yerleşim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4$ matematik ve $3$ fizik kitabı bir rafa, hiçbir fizik kitabı yan yana olmayacak şekilde kaç farklı dizilebilir?<br><br>
      <strong>A)</strong> <span class="key">1440</span> &nbsp; <strong>B)</strong> 1441 &nbsp; <strong>C)</strong> 1439 &nbsp; <strong>D)</strong> 1442 &nbsp; <strong>E)</strong> 1438
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yer Tekniği</div>
      <p class="ales-sol-step">Önce $4$ matematik kitabını sırala: $4! = 24$.</p>
      <p class="ales-sol-step">Aralarda ve uçlarda $5$ "boşluk" oluşur (örn: _M_M_M_M_).</p>
      <p class="ales-sol-step">$3$ fizik kitabını $5$ boşluğun üçüne yerleştir (sıralı): $P(5, 3) = 60$.</p>
      <p class="ales-sol-step">$24 \\cdot 60 = 1440$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1440</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karma Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $6$ kişilik bir grup yuvarlak masa etrafına oturacak. İki belirli kişi <strong>karşılıklı</strong> oturmak şartıyla kaç farklı diziliş vardır?<br><br>
      <strong>A)</strong> <span class="key">24</span> &nbsp; <strong>B)</strong> 23 &nbsp; <strong>C)</strong> 25 &nbsp; <strong>D)</strong> 22 &nbsp; <strong>E)</strong> 26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Karşılıklı koşul daire dizilişinde özel: belirli kişiyi sabitle, karşıdakini de sabitle.</p>
      <p class="ales-sol-step">Geriye kalan $4$ koltuğa $4$ kişi: $4! = 24$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Daireden Türetme</div>
      <p class="ales-sol-step">Toplam daire dizilişi $(6-1)! = 120$. İki kişinin karşılıklı olma olasılığı $= 1/5$ (sabitlenmiş kişiye göre karşı sandalye 1, toplam 5 sandalye).</p>
      <p class="ales-sol-step">$120 \\cdot \\dfrac{1}{5} = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 24</span></div>
    </div>
  </div>
</section>
`
};
