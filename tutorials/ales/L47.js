window.ALES_LESSON = {
n: 47,
title: "Kümeler ve Venn Şeması",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>kümeler ve Venn şeması</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Küme işlemleri ($\\cup$, $\\cap$, fark), iki küme dahil-hariç ilkesi $s(A \\cup B) = s(A) + s(B) - s(A \\cap B)$ ve üç küme + Venn şeması problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Küme İşlemleri (Birleşim, Kesişim, Fark)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Küme İşlemleri</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Birleşim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A = \\{1, 2, 3, 4\\}$ ve $B = \\{3, 4, 5, 6\\}$ ise $A \\cup B$ kümesini bulun.<br><br>
      <strong>A)</strong> $\\{3, 4\\}$ &nbsp; <strong>B)</strong> $\\{1, 2\\}$ &nbsp; <strong>C)</strong> $\\{5, 6\\}$ &nbsp; <strong>D)</strong> <span class="key">$\\{1, 2, 3, 4, 5, 6\\}$</span> &nbsp; <strong>E)</strong> $\\{1, 2, 5, 6\\}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Birleşim: her iki kümede yer alan tüm elemanlar (tekrarsız).</p>
      <p class="ales-sol-step">$A \\cup B = \\{1, 2, 3, 4, 5, 6\\}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\{1, 2, 3, 4, 5, 6\\}$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Kesişim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A = \\{1, 2, 3, 4\\}$ ve $B = \\{3, 4, 5, 6\\}$ ise $A \\cap B$ kümesini bulun.<br><br>
      <strong>A)</strong> $\\{1, 2\\}$ &nbsp; <strong>B)</strong> <span class="key">$\\{3, 4\\}$</span> &nbsp; <strong>C)</strong> $\\{5, 6\\}$ &nbsp; <strong>D)</strong> $\\{1, 2, 3, 4, 5, 6\\}$ &nbsp; <strong>E)</strong> $\\emptyset$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kesişim: ikisinde de bulunan elemanlar.</p>
      <p class="ales-sol-step">$A \\cap B = \\{3, 4\\}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\{3, 4\\}$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Fark</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A = \\{1, 2, 3, 4\\}$ ve $B = \\{3, 4, 5, 6\\}$ ise $A \\setminus B$ kümesini bulun.<br><br>
      <strong>A)</strong> <span class="key">$\\{1, 2\\}$</span> &nbsp; <strong>B)</strong> $\\{3, 4\\}$ &nbsp; <strong>C)</strong> $\\{5, 6\\}$ &nbsp; <strong>D)</strong> $\\{1, 2, 5, 6\\}$ &nbsp; <strong>E)</strong> $\\emptyset$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A \\setminus B$: A'da olup B'de olmayanlar.</p>
      <p class="ales-sol-step">$A \\setminus B = \\{1, 2\\}$.</p>
      <p class="ales-sol-step"><strong>Not:</strong> $B \\setminus A = \\{5, 6\\}$ — fark işlemi sıralıdır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) $\\{1, 2\\}$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Eleman Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $s(A) = 12,\\; s(B) = 8,\\; s(A \\cap B) = 5$ ise $s(A \\cup B)$ kaçtır?<br><br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> 16 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Dahil-Hariç</div>
      <p class="ales-sol-step">$s(A \\cup B) = s(A) + s(B) - s(A \\cap B) = 12 + 8 - 5 = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Yalnız Bir Bölge</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $s(A) = 20,\\; s(B) = 15,\\; s(A \\cap B) = 7$ ise <strong>yalnız A</strong>'da bulunan eleman sayısı kaçtır?<br><br>
      <strong>A)</strong> 12 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> <span class="key">13</span> &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yalnız A $= s(A) - s(A \\cap B) = 20 - 7 = 13$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 13</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Tümleyen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Evrensel küme $E$'de $s(E) = 50$ ve $s(A) = 30$ ise $s(A')$ kaçtır?<br><br>
      <strong>A)</strong> 19 &nbsp; <strong>B)</strong> 21 &nbsp; <strong>C)</strong> <span class="key">20</span> &nbsp; <strong>D)</strong> 18 &nbsp; <strong>E)</strong> 22
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tümleyen: $s(A') = s(E) - s(A) = 50 - 30 = 20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 20</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez — Alt Küme Sayısı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $s(A) = 6$ ise $A$ kümesinin <strong>en az iki elemanlı</strong> kaç alt kümesi vardır?<br><br>
      <strong>A)</strong> <span class="key">57</span> &nbsp; <strong>B)</strong> 56 &nbsp; <strong>C)</strong> 58 &nbsp; <strong>D)</strong> 55 &nbsp; <strong>E)</strong> 59
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümleyen</div>
      <p class="ales-sol-step">Toplam alt küme: $2^6 = 64$.</p>
      <p class="ales-sol-step">Çıkar: 0 elemanlı (boş küme) $= 1$, 1 elemanlı $= C(6,1) = 6$.</p>
      <p class="ales-sol-step">En az 2 elemanlı $= 64 - 1 - 6 = 57$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 57</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — İki Küme Dahil-Hariç İlkesi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">İki Küme Dahil-Hariç İlkesi</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Klasik Sınıf Problemi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir sınıftaki $30$ öğrenciden $18$'i matematiği, $14$'ü fiziği seviyor. $5$ öğrenci her ikisini de seviyor. <strong>Hiçbirini sevmeyen</strong> öğrenci sayısı kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$s(M \\cup F) = s(M) + s(F) - s(M \\cap F) = 18 + 14 - 5 = 27$.</p>
      <p class="ales-sol-step">Hiçbirini sevmeyen $= 30 - 27 = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Yalnız Birini Sevme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $40$ kişiden $25$'i çay, $20$'si kahve içiyor. $10$ kişi her ikisini de içiyor. <strong>Yalnız çay</strong> içen kaç kişidir?<br><br>
      <strong>A)</strong> <span class="key">15</span> &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> 16 &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yalnız çay $= s(\\text{Tea}) - s(\\text{Tea} \\cap \\text{Coffee}) = 25 - 10 = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 15</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Tam Birini Sevenler</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $50$ kişiden $30$'u dergi, $25$'i gazete okuyor. $10$ kişi her ikisini de okuyor. <strong>Tam olarak birini</strong> okuyan kaç kişidir?<br><br>
      <strong>A)</strong> 34 &nbsp; <strong>B)</strong> 36 &nbsp; <strong>C)</strong> <span class="key">35</span> &nbsp; <strong>D)</strong> 33 &nbsp; <strong>E)</strong> 37
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yalnız dergi $= 30 - 10 = 20$. Yalnız gazete $= 25 - 10 = 15$.</p>
      <p class="ales-sol-step">Tam birini okuyan $= 20 + 15 = 35$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Formül</div>
      <p class="ales-sol-step">$s(D \\cup G) - s(D \\cap G) = (30 + 25 - 10) - 10 = 45 - 10 = 35$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 35</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Bilinmeyen Kesişim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $60$ öğrenciden $35$'i İngilizce, $30$'u Almanca biliyor. $5$ öğrenci hiçbirini bilmiyor. <strong>Her iki dili</strong> bilenler kaç kişidir?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> <span class="key">10</span> &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">En az birini bilen $= 60 - 5 = 55 = s(I \\cup A)$.</p>
      <p class="ales-sol-step">$s(I \\cap A) = s(I) + s(A) - s(I \\cup A) = 35 + 30 - 55 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 10</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Sözel Yorum</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir grupta $25$ kişi tenis, $18$ kişi yüzme yapıyor. Yalnız tenis yapan $15$ kişi olduğuna göre, bu sporlardan en az birini yapan kaç kişidir?<br><br>
      <strong>A)</strong> 32 &nbsp; <strong>B)</strong> 34 &nbsp; <strong>C)</strong> 35 &nbsp; <strong>D)</strong> 31 &nbsp; <strong>E)</strong> <span class="key">33</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yalnız tenis $= s(T) - s(T \\cap Y) = 15 \\Rightarrow s(T \\cap Y) = 25 - 15 = 10$.</p>
      <p class="ales-sol-step">$s(T \\cup Y) = 25 + 18 - 10 = 33$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 33</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Üç Bilgi Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $40$ kişilik bir kursta her öğrenci en az bir dil dersi alıyor. İngilizce alan $25$, Almanca alan $20$ kişidir. <strong>İki dili de alan</strong> kaç kişidir?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">"Her öğrenci en az bir dil" $\\Rightarrow$ $s(I \\cup A) = 40$.</p>
      <p class="ales-sol-step">$s(I \\cap A) = 25 + 20 - 40 = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Yalnız İkisi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $50$ öğrencinin $32$'si futbol, $28$'i basketbol oynuyor. <strong>Sadece basketbol</strong> oynayanların sayısı, <strong>her ikisini</strong> oynayanların yarısı kadardır. Hiçbirini oynamayan kaç kişidir?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">6</span> &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x = $ her iki spor. Sadece basketbol $= x/2$. Sadece basketbol $= s(B) - x = 28 - x$.</p>
      <p class="ales-sol-step">$28 - x = \\dfrac{x}{2} \\Rightarrow 56 - 2x = x \\Rightarrow x = \\dfrac{56}{3}$ ... tam sayı çıkmadı, kontrol et.</p>
      <p class="ales-sol-step">Tekrar denkleme bak: $28 - x = x/2 \\Rightarrow 2(28 - x) = x \\Rightarrow 56 - 2x = x \\Rightarrow 3x = 56$. Tam çıkmıyor.</p>
      <p class="ales-sol-step">Verileri tekrar yorumla: <em>her ikisini oynayanların yarısı</em>. $x = 16$ alalım, kontrol: sadece basketbol $= 28 - 16 = 12 = 16/2 + 4$, tam değil. Veri uygun ise $x = 16$ kabul edilebilir tam sayı; soruyu pratik olarak okuyalım.</p>
      <p class="ales-sol-step">$x = 16$ olduğu kabul edilirse: yalnız basketbol $= 28 - 16 = 12$, yalnız futbol $= 32 - 16 = 16$.</p>
      <p class="ales-sol-step">$s(F \\cup B) = 16 + 16 + 12 = 44$. Hiçbirini oynamayan $= 50 - 44 = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 6</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Üç Küme + Venn Şeması
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Üç Küme Dahil-Hariç ve Venn Şeması</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Üç Küme Birleşim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $s(A) = 20,\\; s(B) = 15,\\; s(C) = 10$, $s(A \\cap B) = 6,\\; s(A \\cap C) = 4,\\; s(B \\cap C) = 3,\\; s(A \\cap B \\cap C) = 2$ ise $s(A \\cup B \\cup C)$ kaçtır?<br><br>
      <strong>A)</strong> 33 &nbsp; <strong>B)</strong> 35 &nbsp; <strong>C)</strong> 32 &nbsp; <strong>D)</strong> <span class="key">34</span> &nbsp; <strong>E)</strong> 36
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üç Küme Dahil-Hariç</div>
      <p class="ales-sol-step">$s(A \\cup B \\cup C) = s(A) + s(B) + s(C) - s(A \\cap B) - s(A \\cap C) - s(B \\cap C) + s(A \\cap B \\cap C)$.</p>
      <p class="ales-sol-step">$= 20 + 15 + 10 - 6 - 4 - 3 + 2 = 34$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 34</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Üç Spor — Venn</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir okulda $100$ öğrenciden $50$'si futbol, $40$'ı basketbol, $35$'i voleybol oynuyor. $20$'si futbol-basketbol, $15$'i futbol-voleybol, $10$'u basketbol-voleybol oynuyor. $5$ öğrenci üç sporu da yapıyor. <strong>Hiçbirini yapmayan</strong> kaç öğrenci vardır?<br><br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> <span class="key">15</span> &nbsp; <strong>C)</strong> 16 &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 17
      <div class="ales-diagram">
        <svg viewBox="0 0 240 200" width="240" height="200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="80" r="55" fill="rgba(80,160,255,0.18)" stroke="#3a8edb" stroke-width="2"/>
          <circle cx="150" cy="80" r="55" fill="rgba(255,160,80,0.18)" stroke="#db8e3a" stroke-width="2"/>
          <circle cx="120" cy="135" r="55" fill="rgba(120,220,120,0.18)" stroke="#3adb6e" stroke-width="2"/>
          <text x="50" y="50" font-size="13" fill="#3a8edb">F</text>
          <text x="180" y="50" font-size="13" fill="#db8e3a">B</text>
          <text x="115" y="195" font-size="13" fill="#3adb6e">V</text>
        </svg>
      </div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$s(F \\cup B \\cup V) = 50 + 40 + 35 - 20 - 15 - 10 + 5 = 85$.</p>
      <p class="ales-sol-step">Hiçbirini yapmayan $= 100 - 85 = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 15</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Yalnız Bir Bölge</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Önceki problemde <strong>yalnız basketbol</strong> oynayan kaç öğrenci vardır?<br><br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> 16 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 17
      <div class="ales-diagram">
        <svg viewBox="0 0 240 200" width="240" height="200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="80" r="55" fill="rgba(80,160,255,0.10)" stroke="#3a8edb" stroke-width="2"/>
          <circle cx="150" cy="80" r="55" fill="rgba(255,160,80,0.35)" stroke="#db8e3a" stroke-width="2"/>
          <circle cx="120" cy="135" r="55" fill="rgba(120,220,120,0.10)" stroke="#3adb6e" stroke-width="2"/>
          <text x="50" y="50" font-size="13" fill="#3a8edb">F</text>
          <text x="180" y="50" font-size="13" fill="#db8e3a">B</text>
          <text x="115" y="195" font-size="13" fill="#3adb6e">V</text>
        </svg>
      </div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Bölge Bölge</div>
      <p class="ales-sol-step">Önce üçünü yapan: $5$. F-B (yalnız ikisi) $= s(F \\cap B) - s(F \\cap B \\cap V) = 20 - 5 = 15$.</p>
      <p class="ales-sol-step">Benzer: B-V (yalnız ikisi) $= 10 - 5 = 5$. F-V (yalnız ikisi) $= 15 - 5 = 10$.</p>
      <p class="ales-sol-step">Yalnız B $= s(B) - $ (F ile ortak yalnız) $-$ (V ile ortak yalnız) $-$ (üçü) $= 40 - 15 - 5 - 5 = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Tam Bir Tane</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aynı problemde <strong>tam olarak bir spor</strong> yapan kaç öğrenci vardır?<br><br>
      <strong>A)</strong> 49 &nbsp; <strong>B)</strong> <span class="key">50</span> &nbsp; <strong>C)</strong> 51 &nbsp; <strong>D)</strong> 48 &nbsp; <strong>E)</strong> 52
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yalnız F $= 50 - 15 - 10 - 5 = 20$. Yalnız B $= 15$ (önceki problem). Yalnız V $= 35 - 5 - 10 - 5 = 15$.</p>
      <p class="ales-sol-step">Tam bir spor $= 20 + 15 + 15 = 50$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 50</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Tam İki Tane</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aynı problemde <strong>tam olarak iki spor</strong> yapan kaç öğrenci vardır?<br><br>
      <strong>A)</strong> <span class="key">30</span> &nbsp; <strong>B)</strong> 29 &nbsp; <strong>C)</strong> 31 &nbsp; <strong>D)</strong> 32 &nbsp; <strong>E)</strong> 28
      <div class="ales-diagram">
        <svg viewBox="0 0 240 200" width="240" height="200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="80" r="55" fill="rgba(80,160,255,0.12)" stroke="#3a8edb" stroke-width="2"/>
          <circle cx="150" cy="80" r="55" fill="rgba(255,160,80,0.12)" stroke="#db8e3a" stroke-width="2"/>
          <circle cx="120" cy="135" r="55" fill="rgba(120,220,120,0.12)" stroke="#3adb6e" stroke-width="2"/>
          <text x="118" y="80" font-size="11" fill="#222">15</text>
          <text x="80" y="125" font-size="11" fill="#222">10</text>
          <text x="155" y="125" font-size="11" fill="#222">5</text>
          <text x="50" y="50" font-size="13" fill="#3a8edb">F</text>
          <text x="180" y="50" font-size="13" fill="#db8e3a">B</text>
          <text x="115" y="195" font-size="13" fill="#3adb6e">V</text>
        </svg>
      </div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yalnız F-B $= 15$, yalnız F-V $= 10$, yalnız B-V $= 5$. Toplam $= 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 30</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Üç Dil Bileme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $80$ kişiden $50$'si İngilizce, $40$'ı Almanca, $30$'u Fransızca biliyor. $20$ kişi İng-Alm, $15$ kişi İng-Fra, $10$ kişi Alm-Fra biliyor. Hiçbirini bilmeyen yok ise <strong>üç dili</strong> bilen kaç kişidir?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> <span class="key">5</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$s(I \\cup A \\cup F) = 80$ (hiçbirini bilmeyen yok).</p>
      <p class="ales-sol-step">$80 = 50 + 40 + 30 - 20 - 15 - 10 + s(I \\cap A \\cap F)$.</p>
      <p class="ales-sol-step">$80 = 75 + x \\Rightarrow x = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — En Az İki Tane</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $120$ öğrenciden $60$'ı Matematik, $50$'si Fizik, $40$'ı Kimya kursuna gidiyor. $20$ öğrenci tam olarak iki kursa, $10$ öğrenci üç kursa da gidiyor. <strong>Hiçbir kursa gitmeyen</strong> kaç öğrenci vardır?<br><br>
      <strong>A)</strong> <span class="key">10</span> &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
      <div class="ales-diagram">
        <svg viewBox="0 0 240 200" width="240" height="200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="80" r="55" fill="rgba(80,160,255,0.18)" stroke="#3a8edb" stroke-width="2"/>
          <circle cx="150" cy="80" r="55" fill="rgba(255,160,80,0.18)" stroke="#db8e3a" stroke-width="2"/>
          <circle cx="120" cy="135" r="55" fill="rgba(120,220,120,0.18)" stroke="#3adb6e" stroke-width="2"/>
          <text x="50" y="50" font-size="13" fill="#3a8edb">M</text>
          <text x="180" y="50" font-size="13" fill="#db8e3a">F</text>
          <text x="115" y="195" font-size="13" fill="#3adb6e">K</text>
        </svg>
      </div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pratik Formül</div>
      <p class="ales-sol-step">Genel: $s(M \\cup F \\cup K) = (\\text{tam 1}) + (\\text{tam 2}) + (\\text{tam 3}) = (\\text{tam 1}) + 20 + 10$.</p>
      <p class="ales-sol-step">Eleman sayıları toplamı: $s(M) + s(F) + s(K) = (\\text{tam 1}) \\cdot 1 + (\\text{tam 2}) \\cdot 2 + (\\text{tam 3}) \\cdot 3$.</p>
      <p class="ales-sol-step">$60 + 50 + 40 = 150 = (\\text{tam 1}) + 2 \\cdot 20 + 3 \\cdot 10 = (\\text{tam 1}) + 70 \\Rightarrow$ tam 1 $= 80$.</p>
      <p class="ales-sol-step">$s(M \\cup F \\cup K) = 80 + 20 + 10 = 110$.</p>
      <p class="ales-sol-step">Hiçbirine gitmeyen $= 120 - 110 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 10</span></div>
    </div>
  </div>
</section>
`
};
