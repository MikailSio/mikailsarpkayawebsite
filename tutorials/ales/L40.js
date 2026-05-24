window.ALES_LESSON = {
n: 40,
title: "Ortalama Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>ortalama problemleri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Altın formül: <em>"Toplam = Sayı × Ortalama"</em>. Yeni eleman eklendiğinde: $\\overline{x}_{\\text{yeni}} = \\dfrac{n \\cdot \\overline{x}_{\\text{eski}} + x}{n+1}$.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Aritmetik Ortalama
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Aritmetik Ortalama (Toplam = Sayı × Ortalama)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Doğrudan Hesap</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $12, 15, 18, 21, 24$ sayılarının aritmetik ortalaması kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> <span class="key">18</span> &nbsp; <strong>C)</strong> 23 &nbsp; <strong>D)</strong> 27 &nbsp; <strong>E)</strong> 36
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 12 + 15 + 18 + 21 + 24 = 90$.</p>
      <p class="ales-sol-step">Ortalama $= 90/5 = 18$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Ortanca</div>
      <p class="ales-sol-step">Sayılar ardışık aralıklı (fark $3$, ardışık dizinin elemanları). Ortanca $= 18$ doğrudan ortalama.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 18</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Toplamı Bulma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $7$ sayının aritmetik ortalaması $20$'dir. Bu sayıların toplamı kaçtır?<br><br>
      <strong>A)</strong> 131 &nbsp; <strong>B)</strong> <span class="key">140</span> &nbsp; <strong>C)</strong> 149 &nbsp; <strong>D)</strong> 186 &nbsp; <strong>E)</strong> 280
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Toplam = Sayı × Ortalama</strong> $= 7 \\cdot 20 = 140$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 140</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Bilinmeyen Eleman</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a, 12, 15, 21$ sayılarının aritmetik ortalaması $16$ ise $a$ kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> <span class="key">16</span> &nbsp; <strong>D)</strong> 19 &nbsp; <strong>E)</strong> 32
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 4 \\cdot 16 = 64$.</p>
      <p class="ales-sol-step">$a = 64 - (12 + 15 + 21) = 64 - 48 = 16$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 16</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Sınav Notu Ortalaması</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir öğrencinin $4$ sınav notu ortalaması $70$'tir. Beşinci sınavdan kaç almalı ki ortalaması $75$ olsun?<br><br>
      <strong>A)</strong> 86 &nbsp; <strong>B)</strong> 92 &nbsp; <strong>C)</strong> <span class="key">95</span> &nbsp; <strong>D)</strong> 96 &nbsp; <strong>E)</strong> 100
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk $4$ sınav toplamı $= 4 \\cdot 70 = 280$.</p>
      <p class="ales-sol-step">$5$ sınav toplamı (hedef) $= 5 \\cdot 75 = 375$.</p>
      <p class="ales-sol-step">$5$. not $= 375 - 280 = 95$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 95</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">İki Grup Birleşim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5$ sayının ortalaması $12$, $7$ sayının ortalaması $20$'dir. $12$ sayının ortalaması kaçtır?<br><br>
      <strong>A)</strong> 40 /3 ≈ 16,67 &nbsp; <strong>B)</strong> 49 /3 ≈ 16,67 &nbsp; <strong>C)</strong> <span class="key">50 /3 ≈ 16,67</span> &nbsp; <strong>D)</strong> 53 /3 ≈ 16,67 &nbsp; <strong>E)</strong> 100 /3 ≈ 16,67
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam 1 $= 5 \\cdot 12 = 60$. Toplam 2 $= 7 \\cdot 20 = 140$.</p>
      <p class="ales-sol-step">Birleşik toplam $= 200$. Ortalama $= 200/12 \\approx 16{,}67$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 50 /3 ≈ 16,67</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Sapma Yöntemi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yaş ortalaması $25$ olan bir grupta üç kişinin yaşları $22, 24, 26$ ve diğer iki kişinin yaşları toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">53</span> &nbsp; <strong>B)</strong> 54 &nbsp; <strong>C)</strong> 56 &nbsp; <strong>D)</strong> 58 &nbsp; <strong>E)</strong> 63
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 5 \\cdot 25 = 125$.</p>
      <p class="ales-sol-step">Diğer ikisi $= 125 - (22 + 24 + 26) = 125 - 72 = 53$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 53</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Ortalama → Eleman Sayısı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $n$ sayının ortalaması $30$'dur. Bu sayılara $50$ eklenince ortalama $32$ olmuştur. $n$ kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> <span class="key">9</span> &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 30n$. Yeni toplam $= 30n + 50 = 32(n+1)$.</p>
      <p class="ales-sol-step">$30n + 50 = 32n + 32 \\Rightarrow 2n = 18 \\Rightarrow n = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 9</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Ağırlıklı Ortalama
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Ağırlıklı Ortalama</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Sınav Ağırlığı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir öğrencinin matematik sınavı (ağırlık $3$) notu $80$, fizik sınavı (ağırlık $2$) notu $70$ ise ağırlıklı ortalaması kaçtır?<br><br>
      <strong>A)</strong> 67 &nbsp; <strong>B)</strong> <span class="key">76</span> &nbsp; <strong>C)</strong> 81 &nbsp; <strong>D)</strong> 85 &nbsp; <strong>E)</strong> 152
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ağırlıklı $= \\dfrac{3 \\cdot 80 + 2 \\cdot 70}{3 + 2} = \\dfrac{240 + 140}{5} = \\dfrac{380}{5} = 76$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 76</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Kız+Erkek Sınıf</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir sınıftaki $10$ kız öğrencinin not ortalaması $80$, $20$ erkek öğrencinin not ortalaması $65$'tir. Sınıfın genel ortalaması kaçtır?<br><br>
      <strong>A)</strong> 56 &nbsp; <strong>B)</strong> <span class="key">70</span> &nbsp; <strong>C)</strong> 73 &nbsp; <strong>D)</strong> 75 &nbsp; <strong>E)</strong> 79
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam not $= 10 \\cdot 80 + 20 \\cdot 65 = 800 + 1300 = 2100$.</p>
      <p class="ales-sol-step">Toplam öğrenci $= 30$. Ortalama $= 2100/30 = 70$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 70</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üç Dersten Ağırlıklı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir öğrencinin notları: matematik $90$ (ağırlık $4$), Türkçe $70$ (ağırlık $3$), İngilizce $80$ (ağırlık $3$). Ağırlıklı ortalaması kaçtır?<br><br>
      <strong>A)</strong> 40 &nbsp; <strong>B)</strong> 72 &nbsp; <strong>C)</strong> 76 &nbsp; <strong>D)</strong> <span class="key">81</span> &nbsp; <strong>E)</strong> 82
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\overline{x} = \\dfrac{4 \\cdot 90 + 3 \\cdot 70 + 3 \\cdot 80}{4 + 3 + 3} = \\dfrac{360 + 210 + 240}{10} = \\dfrac{810}{10} = 81$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 81</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Ortalama Kaybı/Kazancı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir sınıfta $20$ kız öğrencinin ortalaması $60$, $30$ erkek öğrencinin ortalaması $80$'dir. Sınıfın genel ortalaması kaçtır?<br><br>
      <strong>A)</strong> 58 &nbsp; <strong>B)</strong> 69 &nbsp; <strong>C)</strong> <span class="key">72</span> &nbsp; <strong>D)</strong> 73 &nbsp; <strong>E)</strong> 86
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam not $= 20 \\cdot 60 + 30 \\cdot 80 = 1200 + 2400 = 3600$.</p>
      <p class="ales-sol-step">Ortalama $= 3600 / 50 = 72$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 72</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Bilinmeyen Sınıf Mevcudu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir sınıftaki $25$ kız öğrencinin not ortalaması $70$, $n$ erkek öğrencinin not ortalaması $80$'dir. Sınıf genel ortalaması $76$ ise $n$ kaçtır?<br><br>
      <strong>A)</strong> 37 ortalama için n = 25 &nbsp; <strong>B)</strong> 72 ortalama için n = 25 &nbsp; <strong>C)</strong> <span class="key">75 ortalama için n = 25</span> &nbsp; <strong>D)</strong> 76 ortalama için n = 25 &nbsp; <strong>E)</strong> 150 ortalama için n = 25
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{25 \\cdot 70 + n \\cdot 80}{25 + n} = 76$.</p>
      <p class="ales-sol-step">$1750 + 80n = 76(25 + n) = 1900 + 76n \\Rightarrow 4n = 150 \\Rightarrow n = 37{,}5$.</p>
      <p class="ales-sol-step">Tam sayı çıkmadı ⟹ <strong>imkânsız</strong>. <em>Ortalama 75 olsa</em>: $1750 + 80n = 75(25+n) = 1875 + 75n \\Rightarrow 5n = 125 \\Rightarrow n = 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 75 ortalama için n = 25</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Karışım Hızı (Ağırlıklı)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir araç yolun $\\dfrac{1}{3}$'ünü saatte $40$ km, $\\dfrac{2}{3}$'ünü saatte $80$ km hızla alıyor. Ortalama hızı kaçtır?<br><br>
      <strong>A)</strong> 48 &nbsp; <strong>B)</strong> 57 &nbsp; <strong>C)</strong> 59 &nbsp; <strong>D)</strong> <span class="key">60</span> &nbsp; <strong>E)</strong> 65
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Toplam Yol / Toplam Süre</div>
      <p class="ales-sol-step">Yol $= 240$ km kabul. İlk $80$ km, ikinci $160$ km.</p>
      <p class="ales-sol-step">İlk süre $= 80/40 = 2$ sa. İkinci süre $= 160/80 = 2$ sa. Toplam süre $= 4$ sa.</p>
      <p class="ales-sol-step">Ortalama hız $= 240/4 = 60$ km/h.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Aritmetik Tuzak</div>
      <p class="ales-sol-step">$\\dfrac{1}{3}$ ve $\\dfrac{2}{3}$ ağırlıklı ortalama hız hesabında <em>doğrudan ağırlıklı aritmetik kullanılmaz</em>: yanlış cevap $\\dfrac{40 + 2 \\cdot 80}{3} = 66{,}67$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 60</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Üç Grup Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Üç grupta sırasıyla $10$, $20$, $30$ kişi vardır ve grup ortalamaları $50$, $60$, $80$'dir. Tüm $60$ kişinin ortalaması kaçtır?<br><br>
      <strong>A)</strong> 164 /3 ≈ 68,33 &nbsp; <strong>B)</strong> 204 /3 ≈ 68,33 &nbsp; <strong>C)</strong> <span class="key">205 /3 ≈ 68,33</span> &nbsp; <strong>D)</strong> 210 /3 ≈ 68,33 &nbsp; <strong>E)</strong> 273 /3 ≈ 68,33
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 10 \\cdot 50 + 20 \\cdot 60 + 30 \\cdot 80 = 500 + 1200 + 2400 = 4100$.</p>
      <p class="ales-sol-step">Ortalama $= 4100/60 = 68{,}33$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 205 /3 ≈ 68,33</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Ekleme/Çıkarma Etkisi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Ekleme / Çıkarma Etkisi</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Ortalamayı Korumak</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5$ sayının ortalaması $20$'dir. $6$. sayı eklenince ortalama değişmemiştir. Eklenen sayı kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 17 &nbsp; <strong>C)</strong> <span class="key">20</span> &nbsp; <strong>D)</strong> 25 &nbsp; <strong>E)</strong> 29
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Mantık</div>
      <p class="ales-sol-step"><strong>Ortalama değişmediyse, eklenen tam ortalamaya eşit.</strong> Yani $20$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Formül</div>
      <p class="ales-sol-step">$\\dfrac{5 \\cdot 20 + x}{6} = 20 \\Rightarrow 100 + x = 120 \\Rightarrow x = 20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 20</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Yeni Eleman → Ortalama Etkisi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $4$ sayının ortalaması $25$'tir. $5$. sayı $40$ ise yeni ortalama kaçtır?<br><br>
      <strong>A)</strong> 25 &nbsp; <strong>B)</strong> <span class="key">28</span> &nbsp; <strong>C)</strong> 33 &nbsp; <strong>D)</strong> 37 &nbsp; <strong>E)</strong> 56
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 100$. Yeni toplam $= 140$.</p>
      <p class="ales-sol-step">Yeni ortalama $= 140/5 = 28$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sapma Yöntemi</div>
      <p class="ales-sol-step">Eklenen sayı ortalamadan $40 - 25 = 15$ fazla. Bu fazlalık $5$ kişiye dağıtılır: $15/5 = 3$.</p>
      <p class="ales-sol-step">Yeni ortalama $= 25 + 3 = 28$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 28</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Eleman Çıkarma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $10$ sayının ortalaması $25$'tir. Bir sayı listeden çıkarılınca kalan $9$ sayının ortalaması $24$ olmuştur. Çıkarılan sayı kaçtır?<br><br>
      <strong>A)</strong> 25 &nbsp; <strong>B)</strong> 33 &nbsp; <strong>C)</strong> <span class="key">34</span> &nbsp; <strong>D)</strong> 37 &nbsp; <strong>E)</strong> 39
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 250$. Yeni toplam $= 9 \\cdot 24 = 216$.</p>
      <p class="ales-sol-step">Çıkarılan $= 250 - 216 = 34$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 34</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Yedek Eleman</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $8$ kişilik bir grupta yaş ortalaması $30$'dur. $50$ yaşındaki kişi gruptan ayrılıp yerine $26$ yaşındaki biri katılırsa yeni ortalama kaç olur?<br><br>
      <strong>A)</strong> 18 &nbsp; <strong>B)</strong> 24 &nbsp; <strong>C)</strong> 26 &nbsp; <strong>D)</strong> <span class="key">27</span> &nbsp; <strong>E)</strong> 30
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Net Değişim</div>
      <p class="ales-sol-step">Net toplam değişim $= -50 + 26 = -24$.</p>
      <p class="ales-sol-step">Ortalama değişimi $= -24/8 = -3$.</p>
      <p class="ales-sol-step">Yeni ortalama $= 30 - 3 = 27$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 27</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Eklenen Eleman Bulma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $6$ sayının ortalaması $15$'tir. Bir sayı eklendiğinde ortalama $17$ olmuştur. Eklenen sayı kaçtır?<br><br>
      <strong>A)</strong> 24 &nbsp; <strong>B)</strong> 26 &nbsp; <strong>C)</strong> 28 &nbsp; <strong>D)</strong> <span class="key">29</span> &nbsp; <strong>E)</strong> 38
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 90$. Yeni toplam $= 7 \\cdot 17 = 119$.</p>
      <p class="ales-sol-step">Eklenen $= 119 - 90 = 29$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Formül</div>
      <p class="ales-sol-step">Yeni ortalama $= 17$, $7$ elemanın her birine $+2$ artış yansır $\\to$ "ortalamayı $2$ büyütmek için" yeni eleman ortalamadan $7 \\cdot 2 = 14$ fazla olmalı.</p>
      <p class="ales-sol-step">Yeni ortalama $17$, eklenen $= 17 + 12$? Hayır: yeni eleman eski ortalama $15$'den $14$ fazla $\\to$ $15 + 14 = 29$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 29</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">İki Eleman Ekleme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $5$ sayının ortalaması $14$'tür. Bu sayılara $24$ ve $36$ eklenince yeni ortalama kaç olur?<br><br>
      <strong>A)</strong> 125 /7 ≈ 18,57 &nbsp; <strong>B)</strong> 127 /7 ≈ 18,57 &nbsp; <strong>C)</strong> <span class="key">130 /7 ≈ 18,57</span> &nbsp; <strong>D)</strong> 133 /7 ≈ 18,57 &nbsp; <strong>E)</strong> 135 /7 ≈ 18,57
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 70$. Yeni toplam $= 70 + 24 + 36 = 130$.</p>
      <p class="ales-sol-step">Yeni eleman sayısı $= 7$. Yeni ortalama $= 130/7 \\approx 18{,}57$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 130 /7 ≈ 18,57</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Hatalı Kayıt Düzeltme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $20$ öğrencinin not ortalaması $70$ olarak hesaplanmıştır. Sonradan bir öğrencinin notu $80$ yerine yanlışlıkla $40$ yazıldığı fark edilmiştir. Düzeltilmiş ortalama kaçtır?<br><br>
      <strong>A)</strong> 67 &nbsp; <strong>B)</strong> 71 &nbsp; <strong>C)</strong> <span class="key">72</span> &nbsp; <strong>D)</strong> 75 &nbsp; <strong>E)</strong> 86
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski (yanlış) toplam $= 20 \\cdot 70 = 1400$.</p>
      <p class="ales-sol-step">Düzeltme: yanlış $40$ kaldırılır, doğru $80$ eklenir ⟹ $+40$ artış.</p>
      <p class="ales-sol-step">Doğru toplam $= 1400 + 40 = 1440$.</p>
      <p class="ales-sol-step">Düzeltilmiş ortalama $= 1440/20 = 72$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Sapma</div>
      <p class="ales-sol-step">$+40$ tutar düzeltmesi $20$ öğrenciye dağıtılır: $40/20 = 2$ artış.</p>
      <p class="ales-sol-step">Yeni ortalama $= 70 + 2 = 72$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 72</span></div>
    </div>
  </div>
</section>
`
};
