window.ALES_LESSON = {
n: 8,
title: "Asal Sayılar ve Asal Çarpanlara Ayırma",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>asal sayılar ve asal çarpanlara ayırma</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Asal tanıma, asal merdiven yöntemi ve pozitif tam bölen sayısı $d(N) = (a+1)(b+1)\\dots$ formülü problem içinde uygulanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Asal Tanıma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Asal Tanıma — 1 Asal Değil, İlk Asallar</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Doğru/Yanlış</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden kaç tanesi <strong>doğru</strong>dur?<br>
      <strong>I.</strong> $1$ asaldır.<br>
      <strong>II.</strong> $2$ tek asaldır.<br>
      <strong>III.</strong> $2$ tek çift asaldır.<br>
      <strong>IV.</strong> Her asal sayı tektir.<br>
      <strong>V.</strong> En küçük asal $2$'dir.<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> <span class="key">$2$ (III, V)</span> &nbsp; <strong>D)</strong> $3$ &nbsp; <strong>E)</strong> $4$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Tanım:</strong> 1'den büyük, sadece 1 ve kendisine bölünen pozitif tam sayı asaldır.</p>
      <p class="ales-sol-step"><strong>I.</strong> $1$'in tek pozitif böleni var (kendisi); tanım gereği asal değil ✗</p>
      <p class="ales-sol-step"><strong>II.</strong> $2$ çifttir, tek değil ✗ &nbsp; <strong>III.</strong> $2$ tek <em>çift</em> asal — tek anlamı "yegane" ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> $2$ asal ve çift, karşı örnek ✗ &nbsp; <strong>V.</strong> ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2$ doğru (III, V)</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">İlk Asalları Listele</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $30$'a kadar olan asalları listeleyin ve kaç tane olduğunu söyleyin.<br><br>
      <strong>A)</strong> $8$ &nbsp; <strong>B)</strong> $9$ &nbsp; <strong>C)</strong> <span class="key">$10$</span> &nbsp; <strong>D)</strong> $11$ &nbsp; <strong>E)</strong> $15$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2, 3, 5, 7, 11, 13, 17, 19, 23, 29$ ⟹ <strong>10 asal</strong>.</p>
      <p class="ales-sol-step"><strong>Hatırla:</strong> İlk 10 asalı ezberle. ALES'te bu liste sürekli gerekir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $10$ (2, 3, 5, 7, 11, 13, 17, 19, 23, 29)</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Asal Test — Eratosthenes</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $97$ asal mıdır? Karar veriniz.<br><br>
      <strong>A)</strong> Hayır, $7 \\cdot 13 = 91$ &nbsp; <strong>B)</strong> Hayır, $3 \\cdot 32 = 96$ &nbsp; <strong>C)</strong> Hayır, çift &nbsp; <strong>D)</strong> <span class="key">Evet, asaldır</span> &nbsp; <strong>E)</strong> Belirlenemez</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Test:</strong> $\\sqrt{97} \\approx 9,8$ — $97$'den küçük asallarla böl: $2, 3, 5, 7$.</p>
      <p class="ales-sol-step">$97$ tek (2 değil). Rakam toplamı $9 + 7 = 16$, 3'ün katı değil. Son basamak $7$, 5'in katı değil. $97/7 = 13,8\\dots$ tam değil.</p>
      <p class="ales-sol-step">Hiçbir asal bölmüyor ⟹ <strong>asal</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) Evet, 97 asaldır</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Asal Toplam</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İlk $5$ asalın toplamı kaçtır?<br><br>
      <strong>A)</strong> 29 &nbsp; <strong>B)</strong> 23 &nbsp; <strong>C)</strong> 38 &nbsp; <strong>D)</strong> <span class="key">28</span> &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk 5 asal: $2, 3, 5, 7, 11$.</p>
      <p class="ales-sol-step">Toplam: $2 + 3 + 5 + 7 + 11 = 28$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 28</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">İki Asal Çarpımı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $p$ ve $q$ asal sayılardır. $p + q = 14$ ise $p \\cdot q$'nun en büyük değeri kaçtır?<br><br>
      <strong>A)</strong> 59 &nbsp; <strong>B)</strong> 39 &nbsp; <strong>C)</strong> <span class="key">49</span> &nbsp; <strong>D)</strong> 47 &nbsp; <strong>E)</strong> 46
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İki asalın toplamı $14$ (çift). Eğer ikisi de tek olsa toplam çift olur ✓ — ya da biri $2$ olursa diğeri $12$ (asal değil).</p>
      <p class="ales-sol-step">İkisi de tek asal: $(3, 11), (5, 9 \\to \\text{not prime}), (7, 7), (11, 3)$. Geçerli: $(3, 11)$ ve $(7, 7)$.</p>
      <p class="ales-sol-step">Çarpımlar: $3 \\cdot 11 = 33$, $7 \\cdot 7 = 49$. <strong>En büyük: 49</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 49</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">İkiz Asal</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $50$'den küçük kaç tane "ikiz asal çifti" vardır? (Aralarındaki fark $2$ olan iki asal.)<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ardışık asalları kontrol et: $(3,5), (5,7), (11,13), (17,19), (29,31), (41,43)$.</p>
      <p class="ales-sol-step"><strong>6 ikiz asal çifti</strong> ($50$'den küçük).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez — Asal mı Bileşik mi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a$ asal sayı ise $a^{2} + 2$ ifadesinin asal olabilmesi için $a$ kaç olmalıdır?<br><br>
      <strong>A)</strong> $a = 2$ &nbsp; <strong>B)</strong> <span class="key">$a = 3$</span> &nbsp; <strong>C)</strong> $a = 5$ &nbsp; <strong>D)</strong> $a = 7$ &nbsp; <strong>E)</strong> Hiçbir $a$ için</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = 2$: $4 + 2 = 6 = 2 \\cdot 3$ ⟹ asal değil.</p>
      <p class="ales-sol-step">$a = 3$: $9 + 2 = 11$ ⟹ <strong>asal</strong> ✓.</p>
      <p class="ales-sol-step">$a = 5$: $25 + 2 = 27 = 3^{3}$ ⟹ asal değil.</p>
      <p class="ales-sol-step"><strong>Genel kural:</strong> $a > 3$ asal ise $a$ ne $3$'ün katı ne çift. $a^{2} \\equiv 1 \\pmod 3$ (Fermat'tan) ⟹ $a^{2} + 2 \\equiv 0 \\pmod 3$ ⟹ $3$'e bölünür, asal değil.</p>
      <p class="ales-sol-step">Tek çözüm: $a = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $a = 3$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Asal Çarpanlara Ayırma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Asal Çarpanlara Ayırma — Asal Merdiven</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Temel Çarpanlama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $360$ sayısını asal çarpanlarına ayırınız.<br><br>
      <strong>A)</strong> $2^2 \\cdot 3^2 \\cdot 5$ &nbsp; <strong>B)</strong> $2^3 \\cdot 3 \\cdot 5^2$ &nbsp; <strong>C)</strong> <span class="key">$2^3 \\cdot 3^2 \\cdot 5$</span> &nbsp; <strong>D)</strong> $2^2 \\cdot 3^3 \\cdot 5$ &nbsp; <strong>E)</strong> $2^4 \\cdot 3 \\cdot 5$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Asal Merdiven</div>
      <p class="ales-sol-step">$360 \\div 2 = 180$. $180 \\div 2 = 90$. $90 \\div 2 = 45$. $45 \\div 3 = 15$. $15 \\div 3 = 5$. $5 \\div 5 = 1$.</p>
      <p class="ales-sol-step">$360 = 2^{3} \\cdot 3^{2} \\cdot 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2^3 \\cdot 3^2 \\cdot 5$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Faktöriyel Çarpanlama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5! = 120$ sayısını asal çarpanlarına ayırınız.<br><br>
      <strong>A)</strong> $2^2 \\cdot 3 \\cdot 5$ &nbsp; <strong>B)</strong> <span class="key">$2^3 \\cdot 3 \\cdot 5$</span> &nbsp; <strong>C)</strong> $2^2 \\cdot 3^2 \\cdot 5$ &nbsp; <strong>D)</strong> $2^4 \\cdot 3 \\cdot 5$ &nbsp; <strong>E)</strong> $2^3 \\cdot 3^2 \\cdot 5$</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5! = 1 \\cdot 2 \\cdot 3 \\cdot 4 \\cdot 5 = 2 \\cdot 3 \\cdot 2^{2} \\cdot 5 = 2^{3} \\cdot 3 \\cdot 5$.</p>
      <p class="ales-sol-step">Doğrula: $2^{3} \\cdot 3 \\cdot 5 = 8 \\cdot 15 = 120$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2^3 \\cdot 3 \\cdot 5$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üslü Çarpanlama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $1080 = 2^{a} \\cdot 3^{b} \\cdot 5^{c}$ ise $a + b + c$ kaçtır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> <span class="key">7</span> &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1080 \\div 2 = 540, \\div 2 = 270, \\div 2 = 135$ ⟹ $2$'lik üs $= 3$.</p>
      <p class="ales-sol-step">$135 \\div 3 = 45, \\div 3 = 15, \\div 3 = 5$ ⟹ $3$'lük üs $= 3$.</p>
      <p class="ales-sol-step">$5 \\div 5 = 1$ ⟹ $5$'lik üs $= 1$.</p>
      <p class="ales-sol-step">$1080 = 2^{3} \\cdot 3^{3} \\cdot 5$. $a + b + c = 3 + 3 + 1 = 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 7</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">En Küçük Bölen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2520$ sayısı kaç farklı asal çarpana sahiptir?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> <span class="key">4</span> &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2520 = 2^{3} \\cdot 3^{2} \\cdot 5 \\cdot 7$.</p>
      <p class="ales-sol-step">Hesap: $2520/2 = 1260/2 = 630/2 = 315 \\Rightarrow 2^{3}$. $315/3 = 105/3 = 35 \\Rightarrow 3^{2}$. $35 = 5 \\cdot 7$.</p>
      <p class="ales-sol-step">Asal çarpan sayısı: $2, 3, 5, 7$ ⟹ <strong>4</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Asal Çarpanların Toplamı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $84$ sayısının farklı asal çarpanlarının toplamı kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 15 &nbsp; <strong>D)</strong> 16 &nbsp; <strong>E)</strong> <span class="key">12</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$84 = 2^{2} \\cdot 3 \\cdot 7$. Farklı asal çarpanlar: $2, 3, 7$.</p>
      <p class="ales-sol-step">Toplam: $2 + 3 + 7 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 12</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">N!  İçindeki Asal</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $10!$ ifadesindeki en büyük asal çarpan kaçtır?<br><br>
      <strong>A)</strong> 13 &nbsp; <strong>B)</strong> 12 &nbsp; <strong>C)</strong> <span class="key">7</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$10! = 1 \\cdot 2 \\cdot 3 \\cdot \\dots \\cdot 10$. Çarpanlar arasındaki en büyük asal $\\leq 10$ olan $7$'dir.</p>
      <p class="ales-sol-step">($8 = 2^{3}$, $9 = 3^{2}$, $10 = 2 \\cdot 5$ — yeni asal getirmez.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Faktöriyel — 2'lik Üs</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $10!$ ifadesinde $2$'nin üssü kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">8</span> &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Legendre Formülü</div>
      <p class="ales-sol-step"><strong>Legendre:</strong> $n!$'de $p$ asalının üssü $= \\sum_{k=1}^{\\infty} \\lfloor n/p^{k} \\rfloor$.</p>
      <p class="ales-sol-step">$\\lfloor 10/2 \\rfloor + \\lfloor 10/4 \\rfloor + \\lfloor 10/8 \\rfloor = 5 + 2 + 1 = 8$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Tek Tek Sayma</div>
      <p class="ales-sol-step">$2 (1), 4 (2), 6 (1), 8 (3), 10 (1)$ ⟹ toplam üs $1 + 2 + 1 + 3 + 1 = 8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 8</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Pozitif Tam Bölen Sayısı d(N)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Pozitif Tam Bölen Sayısı — d(N) = (a+1)(b+1)... Formülü</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Temel d(N)</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $36$ sayısının kaç tane pozitif tam böleni vardır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Formül:</strong> $N = p_{1}^{a_{1}} \\cdot p_{2}^{a_{2}} \\cdots$ ⟹ $d(N) = (a_{1}+1)(a_{2}+1)\\cdots$.</p>
      <p class="ales-sol-step">$36 = 2^{2} \\cdot 3^{2}$. $d(36) = (2+1)(2+1) = 9$.</p>
      <p class="ales-sol-step">Doğrula: $\\{1, 2, 3, 4, 6, 9, 12, 18, 36\\}$ — 9 bölen.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">d(N) Uygulaması</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $200$ sayısının kaç tane pozitif tam böleni vardır?<br><br>
      <strong>A)</strong> 16 &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> <span class="key">12</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$200 = 2^{3} \\cdot 5^{2}$. $d(200) = (3+1)(2+1) = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Tek Bölen Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $360$ sayısının kaç tane <strong>tek</strong> pozitif tam böleni vardır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> 12 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> <span class="key">6</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$360 = 2^{3} \\cdot 3^{2} \\cdot 5$. <strong>Tek bölenler</strong> $2$ içermez ⟹ $360$'tan $2$'leri çıkar: $3^{2} \\cdot 5$.</p>
      <p class="ales-sol-step">$d(3^{2} \\cdot 5) = 3 \\cdot 2 = 6$.</p>
      <p class="ales-sol-step">Doğrula: $\\{1, 3, 5, 9, 15, 45\\}$ — 6 tek bölen.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 6</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Çift Bölen Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $360$ sayısının kaç tane <strong>çift</strong> pozitif tam böleni vardır?<br><br>
      <strong>A)</strong> <span class="key">18</span> &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> 21 &nbsp; <strong>D)</strong> 20 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam bölen $- $ tek bölen $=$ çift bölen.</p>
      <p class="ales-sol-step">$d(360) = (3+1)(2+1)(1+1) = 24$. Tek bölenler $= 6$ (önceki problem).</p>
      <p class="ales-sol-step">Çift bölen: $24 - 6 = 18$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif</div>
      <p class="ales-sol-step">Çift bölenler en az bir $2$ içerir. $2 \\cdot (2^{2} \\cdot 3^{2} \\cdot 5)$ formunda. $d(2^{2} \\cdot 3^{2} \\cdot 5) = 3 \\cdot 3 \\cdot 2 = 18$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 18</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Bilinmeyen Üslü</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $N = 2^{a} \\cdot 3^{2}$ sayısının $15$ tane pozitif tam böleni varsa $a$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> <span class="key">4</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$d(N) = (a+1)(2+1) = 3(a+1) = 15 \\Rightarrow a + 1 = 5 \\Rightarrow a = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 4</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Bölenlerin Toplamı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $24$ sayısının pozitif tam bölenlerinin toplamı kaçtır?<br><br>
      <strong>A)</strong> 62 &nbsp; <strong>B)</strong> 50 &nbsp; <strong>C)</strong> 58 &nbsp; <strong>D)</strong> 63 &nbsp; <strong>E)</strong> <span class="key">60</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — σ(N) Formülü</div>
      <p class="ales-sol-step"><strong>Formül:</strong> $N = p^{a} \\cdot q^{b} \\cdots$ ⟹ $\\sigma(N) = \\dfrac{p^{a+1}-1}{p-1} \\cdot \\dfrac{q^{b+1}-1}{q-1} \\cdots$.</p>
      <p class="ales-sol-step">$24 = 2^{3} \\cdot 3$. $\\sigma(24) = \\dfrac{2^{4}-1}{2-1} \\cdot \\dfrac{3^{2}-1}{3-1} = \\dfrac{15}{1} \\cdot \\dfrac{8}{2} = 15 \\cdot 4 = 60$.</p>
      <p class="ales-sol-step">Doğrula: $1+2+3+4+6+8+12+24 = 60$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 60</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — d(N²)</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $N = 12$ ise $N^{2}$'nin kaç pozitif tam böleni vardır?<br><br>
      <strong>A)</strong> 20 &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 25 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$N = 12 = 2^{2} \\cdot 3$. $N^{2} = 12^{2} = 144 = 2^{4} \\cdot 3^{2}$.</p>
      <p class="ales-sol-step">$d(N^{2}) = (4+1)(2+1) = 15$.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> $N = p^{a} \\cdot q^{b}$ ⟹ $d(N^{k}) = (ka+1)(kb+1)$. Tüm üsler $k$ ile çarpılır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>
</section>
`
};
