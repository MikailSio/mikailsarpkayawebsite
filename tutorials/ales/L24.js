window.ALES_LESSON = {
n: 24,
title: "Kar–Zarar, KDV, İskonto",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>kar–zarar, KDV ve iskonto</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. "Maliyet üzerinden mi, satış üzerinden mi" tuzağı ve "%20 + %10 zincirleme iskonto $\\neq$ %30" üzerine ayrı vurgu.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Kar / Zarar (Maliyet vs Satış Üzerinden)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Kar / Zarar — Maliyet ve Satış Üzerinden</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Maliyet Üzerinden Kar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $400$ TL maliyetli bir ürünü maliyetinin %$25$'i kadar kârla satıyoruz. Satış fiyatı kaç TL'dir?<br><br>
      <strong>A)</strong> $250$ TL &nbsp; <strong>B)</strong> $491$ TL &nbsp; <strong>C)</strong> <span class="key">$500$ TL</span> &nbsp; <strong>D)</strong> $505$ TL &nbsp; <strong>E)</strong> $1000$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kar $= \\dfrac{25}{100} \\cdot 400 = 100$. Satış $= 400 + 100 = 500$ TL.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Çarpan</div>
      <p class="ales-sol-step">Satış $= 400 \\cdot 1.25 = 500$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $500$ TL</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Maliyet Üzerinden Zarar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $600$ TL maliyetli bir ürün maliyetinin %$15$'i kadar zararla satılıyor. Satış fiyatı kaçtır?<br><br>
      <strong>A)</strong> $501$ TL &nbsp; <strong>B)</strong> <span class="key">$510$ TL</span> &nbsp; <strong>C)</strong> $511$ TL &nbsp; <strong>D)</strong> $519$ TL &nbsp; <strong>E)</strong> $1020$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Satış $= 600 \\cdot (1 - 0.15) = 600 \\cdot 0.85 = 510$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $510$ TL</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Maliyeti Bul</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir ürün maliyetin %$20$'si kârla $480$ TL'ye satılmıştır. Maliyet kaç TL'dir?<br><br>
      <strong>A)</strong> $395$ TL &nbsp; <strong>B)</strong> <span class="key">$400$ TL</span> &nbsp; <strong>C)</strong> $405$ TL &nbsp; <strong>D)</strong> $533$ TL &nbsp; <strong>E)</strong> $800$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Maliyet $\\cdot 1.20 = 480 \\Rightarrow$ Maliyet $= \\dfrac{480}{1.20} = 400$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $400$ TL</span></div>
    </div>
  </div>

  <!-- Problem 4 — VURGULU TUZAK -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Maliyet vs Satış — Denklem İspatı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ürün maliyetinin %$25$'i kadar kârla satılmıştır. Bu kâr satış fiyatının yüzde kaçıdır?<br><br>
      <strong>A)</strong> $\\%25$ &nbsp; <strong>B)</strong> $\\%30$ &nbsp; <strong>C)</strong> $\\%15$ &nbsp; <strong>D)</strong> <span class="key">$\\%20$</span> &nbsp; <strong>E)</strong> $\\%22$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sayı Atama</div>
      <p class="ales-sol-step">Maliyet $= 100$ alalım. Kar $= 25$, satış $= 125$.</p>
      <p class="ales-sol-step">Satışın yüzdesi: $\\dfrac{25}{125} \\cdot 100 = 20$.</p>
      <p class="ales-sol-step"><strong>Kural:</strong> Maliyet üzerinden $\\%25$ kar $=$ satış üzerinden $\\%20$ kar. (TUZAK!)</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Cebirsel İspat</div>
      <p class="ales-sol-step">Maliyet $M$, kar $0.25M$, satış $1.25M$. Karın satışa oranı: $\\dfrac{0.25M}{1.25M} = \\dfrac{1}{5} = \\%20$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\%20$</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Satış Üzerinden Kar</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir tüccar satış fiyatının %$20$'si kadar kar elde ediyor. Bu kar maliyetin yüzde kaçına denktir?<br><br>
      <strong>A)</strong> $\\%20$ &nbsp; <strong>B)</strong> $\\%22$ &nbsp; <strong>C)</strong> <span class="key">$\\%25$</span> &nbsp; <strong>D)</strong> $\\%30$ &nbsp; <strong>E)</strong> $\\%18$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Satış $= 100$ alalım. Kar $= 20$, maliyet $= 80$.</p>
      <p class="ales-sol-step">Maliyetin yüzdesi: $\\dfrac{20}{80} \\cdot 100 = 25$.</p>
      <p class="ales-sol-step">Yani satış üzerinden $\\%20$ kar $=$ maliyet üzerinden $\\%25$ kar (Problem 4'ün tersi).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%25$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Toptan-Perakende</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir esnaf toptancıdan %$25$ karla aldığı malı, alış fiyatının %$20$'si kadar zararla satarsa toptancıya göre ne yapmıştır?<br><br>
      <strong>A)</strong> $\\%5$ kar &nbsp; <strong>B)</strong> $\\%5$ zarar &nbsp; <strong>C)</strong> <span class="key">Başa baş (0 kar/zarar)</span> &nbsp; <strong>D)</strong> $\\%10$ kar &nbsp; <strong>E)</strong> $\\%10$ zarar
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toptancı maliyet $= 100$ alalım. Esnafın alış fiyatı $= 125$.</p>
      <p class="ales-sol-step">Esnafın satışı $= 125 \\cdot 0.80 = 100$.</p>
      <p class="ales-sol-step">Toptancı maliyet ile aynı; esnaf hiç kar etmemiş, ne zarar.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Başa baş ($0$ kar/zarar)</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Karın Karı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir mal $%30$ karla satılıyor. Eğer maliyet %$10$ artarsa, aynı satış fiyatından ne kadar kâr/zarar olur (oran olarak)?<br><br>
      <strong>A)</strong> $\\%20$ kar &nbsp; <strong>B)</strong> <span class="key">$\\approx \\%18.2$ kar</span> &nbsp; <strong>C)</strong> $\\%30$ kar &nbsp; <strong>D)</strong> $\\%10$ zarar &nbsp; <strong>E)</strong> Başa baş
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski maliyet $= 100$, satış $= 130$.</p>
      <p class="ales-sol-step">Yeni maliyet $= 110$, satış aynı $= 130$. Kar $= 20$.</p>
      <p class="ales-sol-step">Yeni karın yüzdesi (yeni maliyet üzerinden): $\\dfrac{20}{110} \\cdot 100 \\approx 18.18$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\approx \\%18.2$ kar</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — KDV (Dahil ↔ Hariç)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">KDV Dahil–Hariç Dönüşüm</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">KDV Ekleme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      KDV hariç fiyatı $200$ TL olan bir ürüne %$20$ KDV uygulanırsa KDV dahil fiyat kaç TL olur?<br><br>
      <strong>A)</strong> $120$ TL &nbsp; <strong>B)</strong> <span class="key">$240$ TL</span> &nbsp; <strong>C)</strong> $288$ TL &nbsp; <strong>D)</strong> $320$ TL &nbsp; <strong>E)</strong> $480$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">KDV dahil $= 200 \\cdot 1.20 = 240$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $240$ TL</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">KDV Çıkarma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      KDV dahil fiyatı $360$ TL olan bir ürünün KDV oranı %$20$ ise KDV hariç fiyat kaç TL'dir?<br><br>
      <strong>A)</strong> $150$ TL &nbsp; <strong>B)</strong> $297$ TL &nbsp; <strong>C)</strong> <span class="key">$300$ TL</span> &nbsp; <strong>D)</strong> $301$ TL &nbsp; <strong>E)</strong> $600$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hariç $\\cdot 1.20 = 360 \\Rightarrow$ Hariç $= \\dfrac{360}{1.20} = 300$ TL.</p>
      <p class="ales-sol-step"><strong>TUZAK:</strong> $360 - 360 \\cdot 0.20 = 360 - 72 = 288$ değil! Çünkü KDV oran KDV hariç üzerinden hesaplanır, dahil üzerinden değil.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $300$ TL</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">KDV Tutarı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      KDV dahil $1080$ TL olan bir ürün için %$8$ KDV tutarı kaçtır?<br><br>
      <strong>A)</strong> $64$ TL &nbsp; <strong>B)</strong> $75$ TL &nbsp; <strong>C)</strong> <span class="key">$80$ TL</span> &nbsp; <strong>D)</strong> $83$ TL &nbsp; <strong>E)</strong> $89$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hariç $= \\dfrac{1080}{1.08} = 1000$ TL. KDV tutarı $= 1080 - 1000 = 80$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $80$ TL</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">İki KDV Oranı Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      KDV hariç $500$ TL'lik ürüne A senaryosunda %$8$, B senaryosunda %$18$ KDV uygulanıyor. KDV farkı kaç TL'dir?<br><br>
      <strong>A)</strong> $25$ TL &nbsp; <strong>B)</strong> $45$ TL &nbsp; <strong>C)</strong> $49$ TL &nbsp; <strong>D)</strong> <span class="key">$50$ TL</span> &nbsp; <strong>E)</strong> $60$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A KDV $= 500 \\cdot 0.08 = 40$. B KDV $= 500 \\cdot 0.18 = 90$.</p>
      <p class="ales-sol-step">Fark $= 90 - 40 = 50$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $50$ TL</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">KDV Oranını Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      KDV hariç $400$ TL olan ürün, KDV dahil $472$ TL'ye satılıyor. KDV oranı yüzde kaçtır?<br><br>
      <strong>A)</strong> $\\%8$ &nbsp; <strong>B)</strong> $\\%15$ &nbsp; <strong>C)</strong> $\\%17$ &nbsp; <strong>D)</strong> <span class="key">$\\%18$</span> &nbsp; <strong>E)</strong> $\\%20$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">KDV tutarı $= 472 - 400 = 72$ TL. Oran $= \\dfrac{72}{400} \\cdot 100 = 18$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\%18$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">KDV + Kar Birleşimi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Maliyeti $200$ TL olan bir ürünü %$25$ kâr ile satıp %$20$ KDV ekliyoruz. Müşterinin ödediği toplam kaç TL'dir?<br><br>
      <strong>A)</strong> $150$ TL &nbsp; <strong>B)</strong> $299$ TL &nbsp; <strong>C)</strong> <span class="key">$300$ TL</span> &nbsp; <strong>D)</strong> $309$ TL &nbsp; <strong>E)</strong> $400$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Karlı satış (KDV hariç) $= 200 \\cdot 1.25 = 250$.</p>
      <p class="ales-sol-step">KDV dahil $= 250 \\cdot 1.20 = 300$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $300$ TL</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Hariç → Dahil Pratik Formül</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      KDV dahil fiyatı $590$ TL ve KDV oranı %$18$ olan ürünün KDV tutarı yaklaşık kaç TL'dir?<br><br>
      <strong>A)</strong> $72$ TL &nbsp; <strong>B)</strong> $85$ TL &nbsp; <strong>C)</strong> $89$ TL &nbsp; <strong>D)</strong> <span class="key">$90$ TL</span> &nbsp; <strong>E)</strong> $99$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">KDV tutarı $= 590 \\cdot \\dfrac{18}{118} = 590 \\cdot \\dfrac{9}{59} = 90$ TL.</p>
      <p class="ales-sol-step">Kontrol: hariç $= 590 - 90 = 500$, $500 \\cdot 0.18 = 90$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $90$ TL</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Zincirleme İskonto
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Zincirleme İskonto (Önce %20 Sonra %10)</h2>
  </div>

  <!-- Problem 15 — VURGULU TUZAK -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">İki Ardışık İskonto</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir ürüne önce %$20$, ardından %$10$ iskonto yapılıyor. Net iskonto yüzdesi nedir?<br><br>
      <strong>A)</strong> $\\%30$ &nbsp; <strong>B)</strong> $\\%32$ &nbsp; <strong>C)</strong> <span class="key">$\\%28$</span> &nbsp; <strong>D)</strong> $\\%25$ &nbsp; <strong>E)</strong> $\\%18$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpan Yöntemi</div>
      <p class="ales-sol-step">Çarpan $= 0.80 \\cdot 0.90 = 0.72$ ⟹ orijinalin $\\%72$'si kalır.</p>
      <p class="ales-sol-step">Net iskonto $= 100 - 72 = \\%28$ (%30 değil!).</p>
      <p class="ales-sol-step"><strong>TUZAK:</strong> $\\%20 + \\%10 = \\%30$ değil; $\\%28$. Çünkü ikinci iskonto, birinciden inmiş fiyat üzerine uygulanır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%28$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Sıra Önemli Mi?</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $1000$ TL'lik bir ürüne önce %$10$ sonra %$20$ iskonto vs önce %$20$ sonra %$10$ iskonto. İki sonuç farklı mıdır?<br><br>
      <strong>A)</strong> Farklı (ilki 720, ikincisi 700) &nbsp; <strong>B)</strong> Farklı (ilki 700, ikincisi 720) &nbsp; <strong>C)</strong> <span class="key">Aynı (her ikisi 720 TL)</span> &nbsp; <strong>D)</strong> Aynı (her ikisi 700 TL) &nbsp; <strong>E)</strong> Aynı (her ikisi 750 TL)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlki: $1000 \\cdot 0.90 \\cdot 0.80 = 720$.</p>
      <p class="ales-sol-step">İkincisi: $1000 \\cdot 0.80 \\cdot 0.90 = 720$.</p>
      <p class="ales-sol-step">Çarpan birleşiminde sıra önemsiz ⟹ aynı sonuç.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Aynı (her ikisi $720$ TL)</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Üç Ardışık İskonto</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ürüne sırayla %$10$, %$20$ ve %$25$ iskonto yapılıyor. Net iskonto yüzdesi nedir?<br><br>
      <strong>A)</strong> $\\%55$ &nbsp; <strong>B)</strong> $\\%50$ &nbsp; <strong>C)</strong> $\\%52$ &nbsp; <strong>D)</strong> $\\%45$ &nbsp; <strong>E)</strong> <span class="key">$\\%46$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpan $= 0.90 \\cdot 0.80 \\cdot 0.75 = 0.72 \\cdot 0.75 = 0.54$ ⟹ orijinalin $\\%54$'ü kalır.</p>
      <p class="ales-sol-step">Net iskonto $= 100 - 54 = \\%46$.</p>
      <p class="ales-sol-step">Tuzak: $\\%10 + \\%20 + \\%25 = \\%55$ değil; net $\\%46$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $\\%46$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Eşdeğer Tek İskonto</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $%25$ ve $%20$ ardışık iskontolar yerine tek bir iskonto uygulansaydı, eşdeğer iskonto oranı kaç olurdu?<br><br>
      <strong>A)</strong> $\\%45$ &nbsp; <strong>B)</strong> $\\%42$ &nbsp; <strong>C)</strong> $\\%50$ &nbsp; <strong>D)</strong> <span class="key">$\\%40$</span> &nbsp; <strong>E)</strong> $\\%30$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpan $= 0.75 \\cdot 0.80 = 0.60$ ⟹ tek iskonto $\\%40$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\%40$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İskonto + KDV</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Etiket fiyatı $1000$ TL olan ürüne %$20$ iskonto yapılıyor, ardından %$18$ KDV ekleniyor. Ödenecek tutar kaç TL'dir?<br><br>
      <strong>A)</strong> $941$ TL &nbsp; <strong>B)</strong> $943$ TL &nbsp; <strong>C)</strong> <span class="key">$944$ TL</span> &nbsp; <strong>D)</strong> $953$ TL &nbsp; <strong>E)</strong> $1132$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İskontoluk fiyat $= 1000 \\cdot 0.80 = 800$ TL.</p>
      <p class="ales-sol-step">KDV dahil $= 800 \\cdot 1.18 = 944$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $944$ TL</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">İskonto Tersi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir ürün %$20$ iskonto sonrası $640$ TL'ye satılmıştır. Etiket fiyatı kaç TL'dir?<br><br>
      <strong>A)</strong> $640$ TL &nbsp; <strong>B)</strong> $791$ TL &nbsp; <strong>C)</strong> <span class="key">$800$ TL</span> &nbsp; <strong>D)</strong> $1066$ TL &nbsp; <strong>E)</strong> $1600$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Etiket $\\cdot 0.80 = 640 \\Rightarrow$ Etiket $= \\dfrac{640}{0.80} = 800$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $800$ TL</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Maliyet–Etiket–İskonto–Kar</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Maliyeti $300$ TL olan bir ürün, etiket fiyatı $500$ TL olarak yazılmış ve %$20$ iskonto ile satılmıştır. Esnafın yüzde kar oranı (maliyet üzerinden) nedir?<br><br>
      <strong>A)</strong> $\\%20$ &nbsp; <strong>B)</strong> $\\%25$ &nbsp; <strong>C)</strong> <span class="key">$\\approx \\%33.3$</span> &nbsp; <strong>D)</strong> $\\%40$ &nbsp; <strong>E)</strong> $\\%50$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Satış (iskonto sonrası) $= 500 \\cdot 0.80 = 400$ TL.</p>
      <p class="ales-sol-step">Kar $= 400 - 300 = 100$. Yüzde kar (maliyet üzerinden) $= \\dfrac{100}{300} \\cdot 100 = \\dfrac{100}{3} \\approx 33.33$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\approx \\%33.3$ kar</span></div>
    </div>
  </div>
</section>
`
};
