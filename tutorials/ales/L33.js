window.ALES_LESSON = {
n: 33,
title: "Yaş Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>yaş problemleri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Yaş problemlerinin altın kuralı: <em>"Geçen her yıl, herkesin yaşına aynı miktar eklenir; iki kişinin yaş farkı zamanla değişmez."</em> Tablo metodu (şu an / x yıl önce / x yıl sonra) en güvenilir yöntem.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — İki Kişi · Şu An Temelli
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">İki Kişi Yaş İlişkisi (Şu An)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Toplam Yaş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Ali ile Veli'nin yaşları toplamı $48$'dir. Ali, Veli'den $6$ yaş büyük olduğuna göre Ali kaç yaşındadır?<br><br>
      <strong>A)</strong> 13 &nbsp; <strong>B)</strong> 22 &nbsp; <strong>C)</strong> 24 &nbsp; <strong>D)</strong> <span class="key">27</span> &nbsp; <strong>E)</strong> 54
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Denklem</div>
      <p class="ales-sol-step">Veli'nin yaşı $x$, Ali'nin yaşı $x + 6$.</p>
      <p class="ales-sol-step">$x + (x + 6) = 48 \\Rightarrow 2x = 42 \\Rightarrow x = 21$. Ali $= 27$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Yöntem</div>
      <p class="ales-sol-step">Toplam $= 48$, fark $= 6$. Büyük $= (48 + 6)/2 = 27$, küçük $= (48 - 6)/2 = 21$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 27</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Çarpan İlişkisi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir babanın yaşı, oğlunun yaşının $4$ katıdır. Yaşları toplamı $50$ ise oğul kaç yaşındadır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 13
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Oğul $= x$, baba $= 4x$. Toplam: $x + 4x = 5x = 50 \\Rightarrow x = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Yaş Farkı Sabit</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Ayşe $14$, Burak $9$ yaşındadır. $20$ yıl sonra Ayşe ile Burak'ın yaş farkı kaç olur?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Altın kural:</strong> Yaş farkı zaman geçtikçe <em>değişmez</em>.</p>
      <p class="ales-sol-step">Şu anki fark $= 14 - 9 = 5$. $20$ yıl sonra da fark $= 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Tablo · Oran</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir babanın yaşı oğlunun yaşının $3$ katıdır. Yaş farkları $24$ olduğuna göre, baba kaç yaşındadır?<br><br>
      <strong>A)</strong> 33 &nbsp; <strong>B)</strong> 35 &nbsp; <strong>C)</strong> <span class="key">36</span> &nbsp; <strong>D)</strong> 41 &nbsp; <strong>E)</strong> 72
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tablo Metodu</div>
      <table>
        <thead><tr><th></th><th>Şu Anki Yaş</th></tr></thead>
        <tbody>
          <tr><td>Oğul</td><td>$x$</td></tr>
          <tr><td>Baba</td><td>$3x$</td></tr>
          <tr><td>Fark</td><td>$2x = 24$</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">$2x = 24 \\Rightarrow x = 12$. Baba $= 3 \\cdot 12 = 36$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 36</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Karışık Oran + Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir annenin yaşı, kızının yaşının $5$ katından $4$ eksiktir. Yaşları toplamı $50$ ise anne kaç yaşındadır?<br><br>
      <strong>A)</strong> 20 &nbsp; <strong>B)</strong> 32 &nbsp; <strong>C)</strong> <span class="key">41</span> &nbsp; <strong>D)</strong> 54 &nbsp; <strong>E)</strong> 82
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kız $= x$, anne $= 5x - 4$.</p>
      <p class="ales-sol-step">Toplam: $x + (5x - 4) = 50 \\Rightarrow 6x = 54 \\Rightarrow x = 9$.</p>
      <p class="ales-sol-step">Anne $= 5 \\cdot 9 - 4 = 41$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 41</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Üçlü Oran</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Üç kardeşin yaşları $2:3:5$ oranında ve toplamları $40$'tır. En büyük kardeşin yaşı kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> <span class="key">20</span> &nbsp; <strong>D)</strong> 26 &nbsp; <strong>E)</strong> 40
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Çarpan</div>
      <p class="ales-sol-step">Yaşlar: $2k, 3k, 5k$. Toplam: $2k + 3k + 5k = 10k = 40 \\Rightarrow k = 4$.</p>
      <p class="ales-sol-step">En büyük $= 5k = 20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 20</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İki Bilinmeyen Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Ali'nin yaşının $2$ katı ile Berk'in yaşının $3$ katının toplamı $63$'tür. Ali, Berk'ten $4$ yaş büyükse Ali kaç yaşındadır?<br><br>
      <strong>A)</strong> 12 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 18 &nbsp; <strong>E)</strong> 24
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Denklem</div>
      <p class="ales-sol-step">Ali $= a$, Berk $= b$.</p>
      <p class="ales-sol-step">$2a + 3b = 63$ &nbsp; ve &nbsp; $a = b + 4$.</p>
      <p class="ales-sol-step">Yerine koy: $2(b+4) + 3b = 63 \\Rightarrow 5b + 8 = 63 \\Rightarrow b = 11$. Ali $= 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Geçmiş / Gelecek Yaş
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Geçmiş / Gelecek Yaş (x Yıl Önce / Sonra)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Gelecek Yaş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Şu anki yaşı $12$ olan Mehmet'in $7$ yıl sonraki yaşı kaç olur?<br><br>
      <strong>A)</strong> <span class="key">19</span> &nbsp; <strong>B)</strong> 20 &nbsp; <strong>C)</strong> 22 &nbsp; <strong>D)</strong> 25 &nbsp; <strong>E)</strong> 28
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$12 + 7 = 19$. Geçen her yıl yaşa eklenir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 19</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Geçmiş — Tablo</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Babanın şu anki yaşı $46$, oğlunun yaşı $16$'dır. Kaç yıl önce baba, oğlunun yaşının $4$ katıydı?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">6</span> &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tablo Metodu</div>
      <table>
        <thead><tr><th></th><th>$x$ Yıl Önce</th></tr></thead>
        <tbody>
          <tr><td>Baba</td><td>$46 - x$</td></tr>
          <tr><td>Oğul</td><td>$16 - x$</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Koşul: $46 - x = 4(16 - x) \\Rightarrow 46 - x = 64 - 4x \\Rightarrow 3x = 18 \\Rightarrow x = 6$.</p>
      <p class="ales-sol-step"><strong>Doğrula:</strong> $6$ yıl önce baba $40$, oğul $10$. $40 = 4 \\cdot 10$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 6</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Gelecek Oran</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Şu anki yaşları $36$ ve $4$ olan baba ile oğul için, kaç yıl sonra babanın yaşı oğlunun yaşının $3$ katı olur?<br><br>
      <strong>A)</strong> 10 yıl &nbsp; <strong>B)</strong> 11 yıl &nbsp; <strong>C)</strong> <span class="key">12 yıl</span> &nbsp; <strong>D)</strong> 13 yıl &nbsp; <strong>E)</strong> 15 yıl
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tablo Metodu</div>
      <table>
        <thead><tr><th></th><th>Şu An</th><th>$x$ Yıl Sonra</th></tr></thead>
        <tbody>
          <tr><td>Baba</td><td>$36$</td><td>$36 + x$</td></tr>
          <tr><td>Oğul</td><td>$4$</td><td>$4 + x$</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Koşul: $36 + x = 3(4 + x) \\Rightarrow 36 + x = 12 + 3x \\Rightarrow 24 = 2x \\Rightarrow x = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12 yıl</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Geçmiş — Toplam Verilmiş</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Ali ile Berk'in $6$ yıl önceki yaşları toplamı $20$ idi. Bugünden $4$ yıl sonra yaşları toplamı kaç olur?<br><br>
      <strong>A)</strong> 31 &nbsp; <strong>B)</strong> <span class="key">40</span> &nbsp; <strong>C)</strong> 41 &nbsp; <strong>D)</strong> 49 &nbsp; <strong>E)</strong> 80
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hızlı Mantık</div>
      <p class="ales-sol-step"><strong>İki kişi varsa:</strong> her geçen yılda toplam yaşa $2$ eklenir.</p>
      <p class="ales-sol-step">$6$ yıl önceden $4$ yıl sonraya $= 10$ yıl. Toplam yaşa $10 \\cdot 2 = 20$ eklenir.</p>
      <p class="ales-sol-step">Yeni toplam $= 20 + 20 = 40$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Adım Adım</div>
      <p class="ales-sol-step">$6$ yıl önce $\\to$ bugün: $20 + 12 = 32$. Bugün $\\to$ $4$ yıl sonra: $32 + 8 = 40$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 40</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">İki Zaman İki Oran</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir babanın bugünkü yaşı, oğlunun bugünkü yaşının $5$ katıdır. $4$ yıl sonra babanın yaşı oğlunun yaşının $3$ katı olacaktır. Babanın bugünkü yaşı kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 17 &nbsp; <strong>C)</strong> <span class="key">20</span> &nbsp; <strong>D)</strong> 24 &nbsp; <strong>E)</strong> 26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tablo Metodu</div>
      <table>
        <thead><tr><th></th><th>Şu An</th><th>4 Yıl Sonra</th></tr></thead>
        <tbody>
          <tr><td>Oğul</td><td>$x$</td><td>$x + 4$</td></tr>
          <tr><td>Baba</td><td>$5x$</td><td>$5x + 4$</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Koşul: $5x + 4 = 3(x + 4) \\Rightarrow 5x + 4 = 3x + 12 \\Rightarrow 2x = 8 \\Rightarrow x = 4$.</p>
      <p class="ales-sol-step">Baba bugün $= 5x = 20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 20</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Geçmiş + Gelecek Birleşim</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir kişinin $5$ yıl önceki yaşının $4$ katı, $7$ yıl sonraki yaşının $3$ katına eşittir. Bu kişi bugün kaç yaşındadır?<br><br>
      <strong>A)</strong> 33 &nbsp; <strong>B)</strong> 40 &nbsp; <strong>C)</strong> <span class="key">41</span> &nbsp; <strong>D)</strong> 44 &nbsp; <strong>E)</strong> 46
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bugünkü yaş $= x$.</p>
      <p class="ales-sol-step">$4(x - 5) = 3(x + 7) \\Rightarrow 4x - 20 = 3x + 21 \\Rightarrow x = 41$.</p>
      <p class="ales-sol-step"><strong>Doğrula:</strong> $5$ yıl önce $36$ ⟹ $4 \\cdot 36 = 144$. $7$ yıl sonra $48$ ⟹ $3 \\cdot 48 = 144$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 41</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Karşılıklı Yaş Tuzağı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $4$ yıl önce yaşları toplamı $32$ olan iki kardeşten birinin bugünkü yaşı, diğerinin $8$ yıl sonraki yaşına eşittir. Büyük kardeş bugün kaç yaşındadır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> 19 &nbsp; <strong>C)</strong> 23 &nbsp; <strong>D)</strong> <span class="key">24</span> &nbsp; <strong>E)</strong> 29
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$4$ yıl önce toplam $= 32$ ⟹ bugün toplam $= 32 + 4 \\cdot 2 = 40$.</p>
      <p class="ales-sol-step">Büyük $= B$, küçük $= K$. $B + K = 40$.</p>
      <p class="ales-sol-step">İkinci koşul: $B = K + 8$ (büyüğün bugünkü yaşı = küçüğün $8$ yıl sonraki yaşı).</p>
      <p class="ales-sol-step">$(K + 8) + K = 40 \\Rightarrow 2K = 32 \\Rightarrow K = 16$, $B = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 24</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Çoklu Kişi + Ortalama Yaş
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Çoklu Kişi + Ortalama Yaş</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Ortalama → Toplam</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5$ kişilik bir ailenin yaş ortalaması $30$'dur. Aile bireylerinin yaşları toplamı kaçtır?<br><br>
      <strong>A)</strong> 120 &nbsp; <strong>B)</strong> <span class="key">150</span> &nbsp; <strong>C)</strong> 151 &nbsp; <strong>D)</strong> 155 &nbsp; <strong>E)</strong> 159
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Toplam = Ortalama × Sayı</strong> ⟹ $30 \\cdot 5 = 150$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 150</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Üye Ekleme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yaş ortalaması $25$ olan $6$ kişilik gruba $4$ yaşında bir bebek katılıyor. Yeni ortalama kaç olur?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> <span class="key">22</span> &nbsp; <strong>D)</strong> 27 &nbsp; <strong>E)</strong> 31
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 6 \\cdot 25 = 150$. Yeni toplam $= 150 + 4 = 154$.</p>
      <p class="ales-sol-step">Yeni ortalama $= 154 / 7 = 22$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 22</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Üye Çıkarma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $8$ kişilik bir grubun yaş ortalaması $14$'tür. $21$ yaşında bir öğrenci sınıftan ayrılırsa kalan grubun yaş ortalaması kaç olur?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> <span class="key">13</span> &nbsp; <strong>C)</strong> 16 &nbsp; <strong>D)</strong> 18 &nbsp; <strong>E)</strong> 22
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 8 \\cdot 14 = 112$. Yeni toplam $= 112 - 21 = 91$.</p>
      <p class="ales-sol-step">Yeni ortalama $= 91 / 7 = 13$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sapma Yöntemi</div>
      <p class="ales-sol-step">Çıkan kişi ortalamadan $21 - 14 = 7$ yaş büyük. Bu fazlalık kalan $7$ kişiye dağıtılır: $7/7 = 1$ azalma.</p>
      <p class="ales-sol-step">Yeni ortalama $= 14 - 1 = 13$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 13</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Ortalama Sabit</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5$ kişilik bir grubun yaş ortalaması $24$'tür. Gruba bir kişi katıldığında ortalama değişmemiştir. Katılan kişinin yaşı kaçtır?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> 19 &nbsp; <strong>C)</strong> <span class="key">24</span> &nbsp; <strong>D)</strong> 27 &nbsp; <strong>E)</strong> 32
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Mantık</div>
      <p class="ales-sol-step">Ortalama değişmediyse, eklenen kişi tam <strong>ortalamaya eşit</strong> yaşta olmalıdır. Yaşı $= 24$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Denklem</div>
      <p class="ales-sol-step">$\\dfrac{5 \\cdot 24 + x}{6} = 24 \\Rightarrow 120 + x = 144 \\Rightarrow x = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 24</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Yıllar Geçince</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4$ kişilik bir ailenin yaş ortalaması bugün $25$'tir. $6$ yıl sonra yaş ortalaması kaç olur?<br><br>
      <strong>A)</strong> 28 &nbsp; <strong>B)</strong> <span class="key">31</span> &nbsp; <strong>C)</strong> 32 &nbsp; <strong>D)</strong> 36 &nbsp; <strong>E)</strong> 62
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hızlı Mantık</div>
      <p class="ales-sol-step">Herkes $6$ yaş büyür ⟹ ortalama da tam $6$ artar.</p>
      <p class="ales-sol-step">Yeni ortalama $= 25 + 6 = 31$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Toplam</div>
      <p class="ales-sol-step">Eski toplam $= 100$. $6$ yılda $4 \\cdot 6 = 24$ artar ⟹ yeni toplam $= 124$. Ortalama $= 124/4 = 31$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 31</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Çocuk Doğunca Ortalama</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $3$ kişilik bir ailenin yaş ortalaması $30$'dur. Aileye bir bebek katıldığında ortalama $23$'e düşmüştür. Bebek kaç yaşındadır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski toplam $= 3 \\cdot 30 = 90$.</p>
      <p class="ales-sol-step">Yeni toplam $= 4 \\cdot 23 = 92$.</p>
      <p class="ales-sol-step">Bebeğin yaşı $= 92 - 90 = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Çıkan + Giren</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $10$ kişilik bir grubun yaş ortalaması $32$'dir. Gruptan $45$ yaşında bir kişi ayrılıp yerine $25$ yaşında bir kişi katılırsa, grubun yeni yaş ortalaması kaç olur?<br><br>
      <strong>A)</strong> 21 &nbsp; <strong>B)</strong> <span class="key">30</span> &nbsp; <strong>C)</strong> 31 &nbsp; <strong>D)</strong> 40 &nbsp; <strong>E)</strong> 60
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Toplam Değişim</div>
      <p class="ales-sol-step">Eski toplam $= 10 \\cdot 32 = 320$.</p>
      <p class="ales-sol-step">Yeni toplam $= 320 - 45 + 25 = 300$.</p>
      <p class="ales-sol-step">Yeni ortalama $= 300 / 10 = 30$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Yöntem</div>
      <p class="ales-sol-step">Net değişim $= -45 + 25 = -20$. Kişi sayısı $10$. Ortalama değişimi $= -20/10 = -2$.</p>
      <p class="ales-sol-step">Yeni ortalama $= 32 - 2 = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 30</span></div>
    </div>
  </div>
</section>
`
};
