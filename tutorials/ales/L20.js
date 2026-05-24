window.ALES_LESSON = {
n: 20,
title: "Oran ve Orantı",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>oran ve orantı</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Bölüştürme problemlerinde "k-sabiti" tekniğini ve zincirleme oran $a:b:c$ kullanımını refleks haline getireceksin.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Temel Oran ve Denklik
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Temel Oran ve Denklik (İçler-Dışlar)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Sade Oran</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $24$'ün $36$'ya oranı en sade biçimde nedir?<br><br>
      <strong>A)</strong> $3 : 2$ &nbsp; <strong>B)</strong> $3 : 4$ &nbsp; <strong>C)</strong> <span class="key">$2 : 3$</span> &nbsp; <strong>D)</strong> $1 : 2$ &nbsp; <strong>E)</strong> $2 : 5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{24}{36}$. EBOB$(24,36) = 12$. $\\dfrac{24 \\div 12}{36 \\div 12} = \\dfrac{2}{3}$.</p>
      <p class="ales-sol-step">Yani $24 : 36 = 2 : 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2 : 3$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">İçler-Dışlar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x}{12} = \\dfrac{5}{4}$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">15</span> &nbsp; <strong>C)</strong> 16 &nbsp; <strong>D)</strong> 17 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçler-Dışlar Çarpımı</div>
      <p class="ales-sol-step">$\\dfrac{a}{b} = \\dfrac{c}{d} \\Rightarrow ad = bc$.</p>
      <p class="ales-sol-step">$x \\cdot 4 = 12 \\cdot 5 \\Rightarrow 4x = 60 \\Rightarrow x = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 15</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Birim Çevirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir sınıfta kız sayısının erkek sayısına oranı $3:5$. Sınıfta $40$ öğrenci varsa kaç kız vardır?<br><br>
      <strong>A)</strong> 12 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 16 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — k-Sabiti Tekniği</div>
      <p class="ales-sol-step">Kız $= 3k$, erkek $= 5k$. Toplam $= 8k = 40 \\Rightarrow k = 5$.</p>
      <p class="ales-sol-step">Kız $= 3 \\cdot 5 = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">İki Bilinmeyen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{a}{b} = \\dfrac{3}{7}$ ve $b - a = 12$ ise $a + b$ kaçtır?<br><br>
      <strong>A)</strong> 29 &nbsp; <strong>B)</strong> 32 &nbsp; <strong>C)</strong> 31 &nbsp; <strong>D)</strong> 28 &nbsp; <strong>E)</strong> <span class="key">30</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — k-Sabiti</div>
      <p class="ales-sol-step">$a = 3k, \\; b = 7k$. $b - a = 4k = 12 \\Rightarrow k = 3$.</p>
      <p class="ales-sol-step">$a + b = 10k = 30$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Çapraz Çarpım + Sistem</div>
      <p class="ales-sol-step">$7a = 3b$ ⟹ $b = \\dfrac{7a}{3}$. $b - a = \\dfrac{7a - 3a}{3} = \\dfrac{4a}{3} = 12 \\Rightarrow a = 9, \\; b = 21$.</p>
      <p class="ales-sol-step">$a + b = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 30</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Oran Değişimi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir sepetteki elma sayısının armut sayısına oranı $4:5$'tir. $6$ elma daha eklendiğinde oran $5:5 = 1:1$ olur. Başlangıçta kaç elma vardı?<br><br>
      <strong>A)</strong> <span class="key">24</span> &nbsp; <strong>B)</strong> 22 &nbsp; <strong>C)</strong> 19 &nbsp; <strong>D)</strong> 29 &nbsp; <strong>E)</strong> 27
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Başlangıç: elma $= 4k$, armut $= 5k$.</p>
      <p class="ales-sol-step">$+6$ elma sonra: $\\dfrac{4k + 6}{5k} = 1 \\Rightarrow 4k + 6 = 5k \\Rightarrow k = 6$.</p>
      <p class="ales-sol-step">Başlangıçtaki elma: $4k = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 24</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Karışık Oran</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir maddenin yoğunluğu (kütle/hacim) oranı $7:2$'dir. Hacim $10$ cm³ ise kütle kaç gramdır?<br><br>
      <strong>A)</strong> $14$ g &nbsp; <strong>B)</strong> $20$ g &nbsp; <strong>C)</strong> $70$ g &nbsp; <strong>D)</strong> <span class="key">$35$ g</span> &nbsp; <strong>E)</strong> $45$ g
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{m}{V} = \\dfrac{7}{2} \\Rightarrow \\dfrac{m}{10} = \\dfrac{7}{2}$.</p>
      <p class="ales-sol-step">$2m = 70 \\Rightarrow m = 35$ g.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $35$ g</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Çift Oran Sistemi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{a}{b} = \\dfrac{3}{4}$ ve $\\dfrac{b}{c} = \\dfrac{2}{5}$ ise $\\dfrac{a}{c}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{10}{3}$ &nbsp; <strong>B)</strong> $\\dfrac{15}{8}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{3}{10}$</span> &nbsp; <strong>D)</strong> $\\dfrac{8}{15}$ &nbsp; <strong>E)</strong> $\\dfrac{5}{12}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Zincirleme Çarpım</div>
      <p class="ales-sol-step">$\\dfrac{a}{c} = \\dfrac{a}{b} \\cdot \\dfrac{b}{c} = \\dfrac{3}{4} \\cdot \\dfrac{2}{5} = \\dfrac{6}{20} = \\dfrac{3}{10}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{3}{10}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Bölüştürme (k-Sabiti)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Bölüştürme (k-Sabiti Tekniği)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">İki Kişiye Bölüştürme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $84$ TL, iki kardeşe yaşları oranında ($3:4$) paylaştırılıyor. Küçük kardeş kaç TL alır?<br><br>
      <strong>A)</strong> $42$ TL &nbsp; <strong>B)</strong> <span class="key">$36$ TL</span> &nbsp; <strong>C)</strong> $48$ TL &nbsp; <strong>D)</strong> $28$ TL &nbsp; <strong>E)</strong> $24$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Küçük $= 3k$, büyük $= 4k$. Toplam $7k = 84 \\Rightarrow k = 12$.</p>
      <p class="ales-sol-step">Küçük $= 3 \\cdot 12 = 36$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $36$ TL</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Üç Kişiye Bölüştürme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $120$ TL üç kişiye $1:2:3$ oranında paylaştırılıyor. En çok pay kaç TL'dir?<br><br>
      <strong>A)</strong> $40$ TL &nbsp; <strong>B)</strong> $20$ TL &nbsp; <strong>C)</strong> $80$ TL &nbsp; <strong>D)</strong> $50$ TL &nbsp; <strong>E)</strong> <span class="key">$60$ TL</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Paylar $k, 2k, 3k$. Toplam $6k = 120 \\Rightarrow k = 20$.</p>
      <p class="ales-sol-step">En çok pay $= 3k = 60$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $60$ TL</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Fark ile Verilen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki sayının oranı $5:8$. Aralarındaki fark $24$ ise büyük sayı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">64</span> &nbsp; <strong>B)</strong> 61 &nbsp; <strong>C)</strong> 74 &nbsp; <strong>D)</strong> 66 &nbsp; <strong>E)</strong> 63
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar $5k$ ve $8k$. $8k - 5k = 3k = 24 \\Rightarrow k = 8$.</p>
      <p class="ales-sol-step">Büyük $= 8k = 64$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 64</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Karışım Oranı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir karışımda su ile süt $3:7$ oranındadır. Karışım $50$ litre ise su miktarı kaç litredir?<br><br>
      <strong>A)</strong> $35$ L &nbsp; <strong>B)</strong> $21$ L &nbsp; <strong>C)</strong> <span class="key">$15$ L</span> &nbsp; <strong>D)</strong> $25$ L &nbsp; <strong>E)</strong> $10$ L
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Su $= 3k$, süt $= 7k$. Toplam $10k = 50 \\Rightarrow k = 5$.</p>
      <p class="ales-sol-step">Su $= 3 \\cdot 5 = 15$ L.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $15$ L</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Sermayeye Göre Pay</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Üç ortak işe sırasıyla $20\\,000$, $30\\,000$ ve $50\\,000$ TL koyuyor. Yıl sonunda $40\\,000$ TL kar edildiğinde en çok kar payı kaç TL olur?<br><br>
      <strong>A)</strong> $12\\,000$ TL &nbsp; <strong>B)</strong> $16\\,000$ TL &nbsp; <strong>C)</strong> $25\\,000$ TL &nbsp; <strong>D)</strong> $30\\,000$ TL &nbsp; <strong>E)</strong> <span class="key">$20\\,000$ TL</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sermayeleri sadeleştir: $20\\,000 : 30\\,000 : 50\\,000 = 2:3:5$.</p>
      <p class="ales-sol-step">Paylar $2k, 3k, 5k$. Toplam $10k = 40\\,000 \\Rightarrow k = 4\\,000$.</p>
      <p class="ales-sol-step">En çok pay $= 5k = 20\\,000$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $20\\,000$ TL</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Sözel Tuzak</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Ahmet ile Burak'ın paralarının oranı $5:3$'tür. Burak Ahmet'ten $40$ TL daha az parası varsa, Ahmet'in kaç TL'si vardır?<br><br>
      <strong>A)</strong> $60$ TL &nbsp; <strong>B)</strong> <span class="key">$100$ TL</span> &nbsp; <strong>C)</strong> $80$ TL &nbsp; <strong>D)</strong> $200$ TL &nbsp; <strong>E)</strong> $120$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ahmet $= 5k$, Burak $= 3k$. Fark $= 2k = 40 \\Rightarrow k = 20$.</p>
      <p class="ales-sol-step">Ahmet $= 5 \\cdot 20 = 100$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $100$ TL</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">İki Aşamalı Bölüştürme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir miras üç kardeşe $4:5:6$ oranında bölüştürülecektir. Ortanca kardeş diğer iki kardeşe verdikten sonra $30\\,000$ TL alıyorsa toplam miras kaç TL'dir?<br><br>
      <strong>A)</strong> $75\\,000$ TL &nbsp; <strong>B)</strong> $80\\,000$ TL &nbsp; <strong>C)</strong> <span class="key">$90\\,000$ TL</span> &nbsp; <strong>D)</strong> $60\\,000$ TL &nbsp; <strong>E)</strong> $100\\,000$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Paylar $4k, 5k, 6k$. Ortanca $5k = 30\\,000 \\Rightarrow k = 6\\,000$.</p>
      <p class="ales-sol-step">Toplam $= 15k = 15 \\cdot 6\\,000 = 90\\,000$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $90\\,000$ TL</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Zincirleme Orantı (a:b:c) ve Ölçek
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Zincirleme Orantı (a:b:c) ve Ölçek</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Zincirleme Birleştirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a:b = 2:3$ ve $b:c = 4:5$ ise $a:b:c$ oranı nedir?<br><br>
      <strong>A)</strong> $2:3:5$ &nbsp; <strong>B)</strong> $2:3:4:5$ &nbsp; <strong>C)</strong> $6:9:10$ &nbsp; <strong>D)</strong> <span class="key">$8:12:15$</span> &nbsp; <strong>E)</strong> $4:6:5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak $b$'yi Eşitle</div>
      <p class="ales-sol-step">İlk oranda $b = 3$, ikincide $b = 4$. EKOK$(3,4) = 12$.</p>
      <p class="ales-sol-step">İlk oran $\\times 4$: $a:b = 8:12$.</p>
      <p class="ales-sol-step">İkinci oran $\\times 3$: $b:c = 12:15$.</p>
      <p class="ales-sol-step">$a:b:c = 8:12:15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $8:12:15$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Zincirleme + Toplam</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a:b = 1:2$ ve $b:c = 3:4$ ise, $a + b + c = 34$ olduğunda $a$ kaçtır?<br><br>
      <strong>A)</strong> $3$ &nbsp; <strong>B)</strong> $4$ &nbsp; <strong>C)</strong> <span class="key">$6$</span> &nbsp; <strong>D)</strong> $8$ &nbsp; <strong>E)</strong> $9$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$b$'yi eşitle: $b = 2$ ve $b = 3$. EKOK $= 6$. İlk $\\times 3$: $a:b = 3:6$. İkinci $\\times 2$: $b:c = 6:8$.</p>
      <p class="ales-sol-step">$a:b:c = 3:6:8$. Paylar $3k, 6k, 8k$. Toplam $17k = 34 \\Rightarrow k = 2$.</p>
      <p class="ales-sol-step">$a = 3k = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $a = 6$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Üç Sayılı Bölüştürme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $A, B, C$ için $A:B:C = 2:3:5$. $A + B + C = 100$ ise $C - A$ kaçtır?<br><br>
      <strong>A)</strong> 25 &nbsp; <strong>B)</strong> 35 &nbsp; <strong>C)</strong> 40 &nbsp; <strong>D)</strong> 29 &nbsp; <strong>E)</strong> <span class="key">30</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Paylar $2k, 3k, 5k$. Toplam $10k = 100 \\Rightarrow k = 10$.</p>
      <p class="ales-sol-step">$C - A = 5k - 2k = 3k = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 30</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Ölçek (Harita)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Ölçeği $1:50\\,000$ olan bir haritada iki kent arası $8$ cm'dir. Gerçek mesafe kaç km'dir?<br><br>
      <strong>A)</strong> $40$ km &nbsp; <strong>B)</strong> $0.4$ km &nbsp; <strong>C)</strong> $400$ km &nbsp; <strong>D)</strong> <span class="key">$4$ km</span> &nbsp; <strong>E)</strong> $8$ km
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Gerçek $=$ harita uzunluğu $\\times$ ölçek paydası $= 8 \\cdot 50\\,000 = 400\\,000$ cm.</p>
      <p class="ales-sol-step">Birim çevirme: $400\\,000 \\div 100\\,000 = 4$ km. (1 km $= 100\\,000$ cm.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $4$ km</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Ölçek (Plan)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir oda planında ölçek $1:100$'dür. Gerçek odanın uzun kenarı $5$ m ise plandaki uzunluk kaç cm olur?<br><br>
      <strong>A)</strong> $50$ cm &nbsp; <strong>B)</strong> $0.5$ cm &nbsp; <strong>C)</strong> $500$ cm &nbsp; <strong>D)</strong> $10$ cm &nbsp; <strong>E)</strong> <span class="key">$5$ cm</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5$ m $= 500$ cm. Plan $=$ gerçek $\\div$ ölçek paydası $= 500 \\div 100 = 5$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $5$ cm</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Üç Oran + Fark</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a:b:c = 3:5:7$ ve $c - a = 16$ ise $a + b + c$ kaçtır?<br><br>
      <strong>A)</strong> 62 &nbsp; <strong>B)</strong> <span class="key">60</span> &nbsp; <strong>C)</strong> 59 &nbsp; <strong>D)</strong> 70 &nbsp; <strong>E)</strong> 58
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = 3k, b = 5k, c = 7k$. $c - a = 4k = 16 \\Rightarrow k = 4$.</p>
      <p class="ales-sol-step">$a + b + c = 15k = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 60</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Çift Eşitleme — 3 Oran</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{a}{b} = \\dfrac{2}{3}, \\;\\; \\dfrac{b}{c} = \\dfrac{4}{5}$ ise $\\dfrac{a + c}{b}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{7}{12}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{23}{12}$</span> &nbsp; <strong>C)</strong> $\\dfrac{12}{23}$ &nbsp; <strong>D)</strong> $\\dfrac{23}{15}$ &nbsp; <strong>E)</strong> $\\dfrac{11}{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$b$'yi ortak yap: $b = 3$ ve $b = 4$. EKOK $= 12$. $a:b = 8:12$, $b:c = 12:15$. ⟹ $a:b:c = 8:12:15$.</p>
      <p class="ales-sol-step">$\\dfrac{a + c}{b} = \\dfrac{8 + 15}{12} = \\dfrac{23}{12}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{23}{12}$</span></div>
    </div>
  </div>
</section>
`
};
