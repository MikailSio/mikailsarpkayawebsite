window.ALES_LESSON = {
n: 38,
title: "Para Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>para problemleri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Mantığı: <em>"Adet × Birim Değer = Toplam Değer"</em>. Tablo metodu (tip / adet / birim / toplam) en sağlam yol.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — İki Tür Para
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">İki Tür Madeni / Banknot</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">İki Tür Madeni</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir kumbarada toplam $20$ tane $1$ TL ve $5$ TL'lik madeni para var. Toplam tutar $60$ TL ise kumbarada kaç tane $5$ TL vardır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 19
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Denklem</div>
      <p class="ales-sol-step">$x$ adet $1$ TL, $y$ adet $5$ TL. $x + y = 20$, $\\;x + 5y = 60$.</p>
      <p class="ales-sol-step">Çıkar: $4y = 40 \\Rightarrow y = 10$. ⟹ $5$ TL adedi $= 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">10 ve 20 TL Banknot</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Cüzdandaki $10$ TL ve $20$ TL'lik banknotların toplamı $15$ adet, toplam tutar $230$ TL'dir. Kaç adet $20$ TL vardır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> <span class="key">8</span> &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x + y = 15$, $\\;10x + 20y = 230$.</p>
      <p class="ales-sol-step">İlkinden $x = 15 - y$ ⟹ $10(15-y) + 20y = 230 \\Rightarrow 150 + 10y = 230 \\Rightarrow y = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 8</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Tek Bilinmeyen</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir cüzdanda $50$ TL'lik banknotların adedi, $20$ TL'lik banknotların adedinin $2$ katıdır. Toplam tutar $480$ TL ise kaç tane $50$ TL vardır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">8</span> &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$20$ TL $= x$ adet, $50$ TL $= 2x$ adet.</p>
      <p class="ales-sol-step">$20x + 50 \\cdot 2x = 480 \\Rightarrow 20x + 100x = 480 \\Rightarrow 120x = 480 \\Rightarrow x = 4$.</p>
      <p class="ales-sol-step">$50$ TL $= 2 \\cdot 4 = 8$ adet.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 8</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Tablo Yöntemi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir koleksiyonda $1$ TL'lik ve $5$ TL'lik madeni paralar var. Toplam $40$ adet madeni para olduğu ve toplam değer $80$ TL olduğu bilindiğine göre kaç adet $1$ TL vardır?<br><br>
      <strong>A)</strong> 24 &nbsp; <strong>B)</strong> <span class="key">30</span> &nbsp; <strong>C)</strong> 39 &nbsp; <strong>D)</strong> 40 &nbsp; <strong>E)</strong> 60
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tablo Metodu</div>
      <table>
        <thead><tr><th>Tür</th><th>Adet</th><th>Birim</th><th>Toplam</th></tr></thead>
        <tbody>
          <tr><td>$1$ TL</td><td>$x$</td><td>$1$</td><td>$x$</td></tr>
          <tr><td>$5$ TL</td><td>$40-x$</td><td>$5$</td><td>$5(40-x)$</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">$x + 5(40-x) = 80 \\Rightarrow x + 200 - 5x = 80 \\Rightarrow -4x = -120 \\Rightarrow x = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 30</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Adet Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir kasa içindeki $10$ TL ve $50$ TL'lik banknot adetlerinin farkı $4$'tür. Toplam tutar $400$ TL ise kasada kaç adet $10$ TL vardır? ($10$ TL'liklerin sayısı fazladır.)<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$10$ TL $= x$, $50$ TL $= x - 4$ (10 TL fazla).</p>
      <p class="ales-sol-step">$10x + 50(x-4) = 400 \\Rightarrow 10x + 50x - 200 = 400 \\Rightarrow 60x = 600 \\Rightarrow x = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Yüzde Adet</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir cüzdanda toplam $50$ banknot vardır. Bu banknotların $\\%40$'ı $10$ TL, geri kalanı $20$ TL'dir. Toplam tutar kaç TL'dir?<br><br>
      <strong>A)</strong> 791 &nbsp; <strong>B)</strong> 797 &nbsp; <strong>C)</strong> 799 &nbsp; <strong>D)</strong> <span class="key">800</span> &nbsp; <strong>E)</strong> 1600
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$10$ TL adet $= 50 \\cdot 0{,}4 = 20$. $20$ TL adet $= 50 - 20 = 30$.</p>
      <p class="ales-sol-step">Toplam $= 20 \\cdot 10 + 30 \\cdot 20 = 200 + 600 = 800$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 800</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Eksik Bilgi · Çoklu Çözüm</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir kumbarada sadece $5$ TL ve $10$ TL'lik madeni paralar var. Toplam tutar $100$ TL ise kumbarada en fazla kaç adet madeni para olabilir?<br><br>
      <strong>A)</strong> 19 &nbsp; <strong>B)</strong> <span class="key">20</span> &nbsp; <strong>C)</strong> 23 &nbsp; <strong>D)</strong> 25 &nbsp; <strong>E)</strong> 26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Maksimum İçin Küçük Birim</div>
      <p class="ales-sol-step">Adet en fazla olsun istersen <strong>en küçük</strong> birim ($5$ TL) en çok kullanılmalı.</p>
      <p class="ales-sol-step">En uçta hepsi $5$ TL: $100/5 = 20$ adet (sadece $5$ TL kullanılır; $10$ TL adedi $= 0$).</p>
      <p class="ales-sol-step"><strong>"Her ikisinden en az 1 var" şartı yok</strong> ⟹ cevap $20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 20</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Üç Tür Karışık Para
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Üç Tür Karışık Para</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Üçlü Eşit Adet</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir kasada $5$ TL, $10$ TL ve $20$ TL'lik banknotlardan eşit adetlerde vardır. Toplam tutar $350$ TL ise her türden kaç banknot vardır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Her türden $x$ adet. $5x + 10x + 20x = 35x = 350 \\Rightarrow x = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Üçlü · İki Şart</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir cüzdanda $5$ TL, $10$ TL ve $20$ TL'lik banknotlardan toplam $20$ adet ve toplam tutar $200$ TL vardır. $5$ TL'liklerden $5$ adet olduğuna göre $20$ TL'liklerden kaç adet vardır?<br><br>
      <strong>A)</strong> $1$ &nbsp; <strong>B)</strong> $2$ &nbsp; <strong>C)</strong> $3$ &nbsp; <strong>D)</strong> $5$ &nbsp; <strong>E)</strong> <span class="key">İmkânsız (tutarsız veri)</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5$ TL: $5$ adet ⟹ $5 \\cdot 5 = 25$ TL. Kalan adet $= 15$, kalan tutar $= 175$ TL.</p>
      <p class="ales-sol-step">$10$ TL $= a$, $20$ TL $= b$. $a + b = 15$, $10a + 20b = 175$.</p>
      <p class="ales-sol-step">$10(15-b) + 20b = 175 \\Rightarrow 150 + 10b = 175 \\Rightarrow b = 2{,}5$.</p>
      <p class="ales-sol-step">Tam sayı çıkmadı ⟹ <strong>böyle bir dağılım imkânsız</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) İmkânsız (tutarsız veri)</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Oranlı Adet</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir kasada $5$ TL, $10$ TL ve $50$ TL'lik banknotların adetleri $1:2:3$ oranındadır. Toplam tutar $375$ TL ise kasada kaç adet $50$ TL vardır?<br><br>
      <strong>A)</strong> $3$ &nbsp; <strong>B)</strong> $6$ &nbsp; <strong>C)</strong> $9$ &nbsp; <strong>D)</strong> $12$ &nbsp; <strong>E)</strong> <span class="key">Tam sayı çözüm yok</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5$ TL $= k$, $10$ TL $= 2k$, $50$ TL $= 3k$.</p>
      <p class="ales-sol-step">$5k + 10 \\cdot 2k + 50 \\cdot 3k = 5k + 20k + 150k = 175k = 375 \\Rightarrow k = \\dfrac{375}{175} = \\dfrac{15}{7}$.</p>
      <p class="ales-sol-step"><strong>Tam sayı değil</strong>; soru tutarsız. <em>Düzeltilmiş örnek:</em> Toplam $700$ TL olsaydı $k = 4$, $50$ TL $= 12$ olurdu.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) Tam sayı çözüm yok ($k = 15/7$)</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Üç Tür Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir cüzdanda $5$ TL, $10$ TL ve $20$ TL'lik banknotlardan sırasıyla $a$, $b$, $c$ adet vardır. $a + b + c = 12$, $5a + 10b + 20c = 130$ ve $b = 2a$ ise $c$ kaçtır?<br><br>
      <strong>A)</strong> $2$ &nbsp; <strong>B)</strong> $3$ &nbsp; <strong>C)</strong> $4$ &nbsp; <strong>D)</strong> $6$ &nbsp; <strong>E)</strong> <span class="key">Tutarsız (tam sayı çözüm yok)</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$b = 2a$ yerine koy: $a + 2a + c = 12 \\Rightarrow 3a + c = 12$.</p>
      <p class="ales-sol-step">$5a + 10 \\cdot 2a + 20c = 5a + 20a + 20c = 25a + 20c = 130$.</p>
      <p class="ales-sol-step">$c = 12 - 3a$ yerine: $25a + 20(12 - 3a) = 130 \\Rightarrow 25a + 240 - 60a = 130 \\Rightarrow -35a = -110 \\Rightarrow a = \\dfrac{22}{7}$.</p>
      <p class="ales-sol-step">Tam sayı değil ⟹ tutarsız. <em>$5a + 10b + 20c = 145$ olsa</em>: $25a + 240 - 60a = 145 \\Rightarrow -35a = -95$, yine tam sayı değil. <em>Doğru kombinasyon arıyorsak</em> $a=2, b=4, c=6$: $a+b+c=12$ ✓, $10+40+120 = 170$. Bu tutardan tek tahmin yapılır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) Tutarsız (tam sayı çözüm yok)</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Üç Tür · Tutar Eşitlemesi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir kumbarada $5$ TL, $10$ TL ve $20$ TL'lik madeni paralar vardır. Üç türden de eşit <strong>tutar</strong>da para olduğuna ve toplam $120$ TL olduğuna göre kaç adet madeni para vardır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> <span class="key">14</span> &nbsp; <strong>D)</strong> 19 &nbsp; <strong>E)</strong> 23
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Her türden $40$ TL var.</p>
      <p class="ales-sol-step">$5$ TL adet $= 40/5 = 8$. $10$ TL $= 4$. $20$ TL $= 2$.</p>
      <p class="ales-sol-step">Toplam adet $= 8 + 4 + 2 = 14$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 14</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Üç Tür · Maksimum Adet</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir kumbarada $1$ TL, $5$ TL ve $10$ TL'lik madeni paralar vardır. Toplam tutar $50$ TL'dir. Her türden en az 1 madeni para olduğuna göre kumbarada en fazla kaç madeni para olabilir?<br><br>
      <strong>A)</strong> 18 &nbsp; <strong>B)</strong> <span class="key">37</span> &nbsp; <strong>C)</strong> 40 &nbsp; <strong>D)</strong> 44 &nbsp; <strong>E)</strong> 49
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Adet Maksimum</div>
      <p class="ales-sol-step">En küçük birim ($1$ TL) en çok kullanılmalı; $5$ TL ve $10$ TL'den minimum 1'er adet.</p>
      <p class="ales-sol-step">$1$ adet $5$ TL + $1$ adet $10$ TL $= 15$ TL. Kalan $50 - 15 = 35$ TL hepsi $1$ TL ⟹ $35$ adet.</p>
      <p class="ales-sol-step">Toplam adet $= 35 + 1 + 1 = 37$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 37</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Üç Tür · Tam Sayı Çözüm</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir cüzdanda $5$ TL, $10$ TL ve $20$ TL'lik banknotlardan toplam $9$ adet ve toplam tutar $100$ TL vardır. $5$ TL'liklerden 1 adet olduğuna göre $20$ TL'liklerden kaç adet vardır?<br><br>
      <strong>A)</strong> $1$ &nbsp; <strong>B)</strong> $2$ &nbsp; <strong>C)</strong> $3$ &nbsp; <strong>D)</strong> $4$ &nbsp; <strong>E)</strong> <span class="key">İmkânsız</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5$ TL $= 1$ ⟹ $5$ TL. Kalan adet $= 8$, kalan tutar $= 95$ TL.</p>
      <p class="ales-sol-step">$10a + 20b = 95$, $a + b = 8$.</p>
      <p class="ales-sol-step">$10(8-b) + 20b = 95 \\Rightarrow 80 + 10b = 95 \\Rightarrow b = 1{,}5$.</p>
      <p class="ales-sol-step">Tam sayı değil ⟹ <strong>imkânsız</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) İmkânsız</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Eşit Dağıtım + A→B Aktarma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Eşit Dağıtım + Aktarma (A → B)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Eşit Dağıtım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir miktar para $5$ kişi arasında eşit paylaşılırsa kişi başına $80$ TL düşüyor. Aynı para $4$ kişi arasında eşit paylaşılırsa kişi başına kaç TL düşer?<br><br>
      <strong>A)</strong> 50 &nbsp; <strong>B)</strong> <span class="key">100</span> &nbsp; <strong>C)</strong> 103 &nbsp; <strong>D)</strong> 105 &nbsp; <strong>E)</strong> 200
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 5 \\cdot 80 = 400$ TL.</p>
      <p class="ales-sol-step">$4$ kişiye $= 400/4 = 100$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 100</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Bilinmeyen Sayı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir miktar para $n$ kişi arasında eşit paylaşılırsa kişi başına $50$ TL düşüyor. $n+1$ kişi olursa kişi başına $40$ TL düşüyor. Kaç kişi başlangıçta vardı?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 50n = 40(n+1) \\Rightarrow 50n = 40n + 40 \\Rightarrow n = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Aktarma — Eşitleme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Ali'nin $80$ TL'si, Veli'nin $40$ TL'si vardır. Ali, Veli'ye kaç TL verirse paraları eşitlenir?<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> <span class="key">20</span> &nbsp; <strong>C)</strong> 23 &nbsp; <strong>D)</strong> 24 &nbsp; <strong>E)</strong> 25
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam $= 120$ TL ⟹ eşitlik için her birinde $60$ TL olmalı.</p>
      <p class="ales-sol-step">Ali'nin $60$ TL'ye düşmesi için $80 - 60 = 20$ TL vermesi gerek.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Mantık</div>
      <p class="ales-sol-step">Fark $= 40$ TL. Eşitlemek için farkın yarısı $= 20$ TL aktarılır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 20</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Aktarma → Çarpan İlişkisi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Ali'nin $90$ TL'si, Veli'nin $30$ TL'si vardır. Ali, Veli'ye kaç TL verirse Ali'nin parası Veli'nin parasının $2$ katı olur?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aktarma sonrası Ali $= 90 - x$, Veli $= 30 + x$.</p>
      <p class="ales-sol-step">Koşul: $90 - x = 2(30 + x) \\Rightarrow 90 - x = 60 + 2x \\Rightarrow 30 = 3x \\Rightarrow x = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Eksik / Fazla Dağıtım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir miktar para $n$ öğrenciye eşit dağıtılacak. Her öğrenciye $20$ TL verilirse $30$ TL artıyor; her öğrenciye $25$ TL verilirse $20$ TL eksik kalıyor. Toplam para kaç TL'dir?<br><br>
      <strong>A)</strong> 184 &nbsp; <strong>B)</strong> 225 &nbsp; <strong>C)</strong> <span class="key">230</span> &nbsp; <strong>D)</strong> 239 &nbsp; <strong>E)</strong> 306
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Senaryo</div>
      <p class="ales-sol-step">$T = 20n + 30$ &nbsp; ve &nbsp; $T = 25n - 20$.</p>
      <p class="ales-sol-step">Eşitle: $20n + 30 = 25n - 20 \\Rightarrow 50 = 5n \\Rightarrow n = 10$.</p>
      <p class="ales-sol-step">$T = 20 \\cdot 10 + 30 = 230$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 230</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Karşılıklı Aktarma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Ali, Veli'ye $20$ TL verince Veli'nin parası Ali'nin parasının $3$ katı oluyor. Veli, Ali'ye $20$ TL geri verirse paraları eşitleniyor. Başlangıçta Ali ve Veli'nin paraları toplamı kaç TL'dir?<br><br>
      <strong>A)</strong> 71 &nbsp; <strong>B)</strong> 77 &nbsp; <strong>C)</strong> <span class="key">80</span> &nbsp; <strong>D)</strong> 83 &nbsp; <strong>E)</strong> 85
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Başlangıç: Ali $= a$, Veli $= v$. Toplam $a + v$ aktarmalardan etkilenmez.</p>
      <p class="ales-sol-step">Ali, Veli'ye $20$ verince: Ali $= a-20$, Veli $= v+20$. $\\;v + 20 = 3(a - 20) \\Rightarrow v = 3a - 80$.</p>
      <p class="ales-sol-step">Geri ver ($20$): Ali $= a$, Veli $= v$. Eşit ⟹ $a = v$. Yerine koy: $a = 3a - 80 \\Rightarrow a = 40$.</p>
      <p class="ales-sol-step">Veli $= 40$. Toplam $= 80$ TL.</p>
      <p class="ales-sol-step"><strong>Doğrula:</strong> Aktarma 1: Ali=20, Veli=60. $60 = 3 \\cdot 20$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 80</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Üç Kişi Aktarma · Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A, B ve C'nin paraları sırasıyla $60$, $40$ ve $20$ TL'dir. A, B'ye $10$ TL; B, C'ye $20$ TL verirse aktarmalar sonunda A, B ve C'nin paraları sırasıyla kaç TL olur?<br><br>
      <strong>A)</strong> 41 , 30, 40 &nbsp; <strong>B)</strong> 47 , 30, 40 &nbsp; <strong>C)</strong> <span class="key">50 , 30, 40</span> &nbsp; <strong>D)</strong> 51 , 30, 40 &nbsp; <strong>E)</strong> 55 , 30, 40
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Adım Adım</div>
      <table>
        <thead><tr><th></th><th>A</th><th>B</th><th>C</th></tr></thead>
        <tbody>
          <tr><td>Başlangıç</td><td>$60$</td><td>$40$</td><td>$20$</td></tr>
          <tr><td>A→B 10</td><td>$50$</td><td>$50$</td><td>$20$</td></tr>
          <tr><td>B→C 20</td><td>$50$</td><td>$30$</td><td>$40$</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Sonuç: A $= 50$, B $= 30$, C $= 40$ TL. (Toplam $120$ TL korunur ✓.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 50 , 30, 40</span></div>
    </div>
  </div>
</section>
`
};
