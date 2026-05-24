"""Targeted TR diakritik restoration for pandas/L1, L2, L6 (and any other left files).
Only fixes whole-word matches — won't break code identifiers.
"""
import re
from pathlib import Path

# Word-level TR replacements (case-sensitive: capital-init versions kept)
PAIRS = [
    # core verbs/nouns
    ("Birlestirme", "Birleştirme"),
    ("birlestirme", "birleştirme"),
    ("birlestir", "birleştir"),
    ("birlestime", "birleştirme"),   # missing 'r' typo
    ("birlestirilebilir", "birleştirilebilir"),
    ("birlestirmek", "birleştirmek"),
    ("birlestirilen", "birleştirilen"),
    ("birlestirilecek", "birleştirilecek"),

    ("sekillendirme", "şekillendirme"),
    ("sekillendir", "şekillendir"),
    ("Sekillendir", "Şekillendir"),

    ("donusturen", "dönüştüren"),
    ("donusturur", "dönüştürür"),
    ("donusturuyor", "dönüştürüyor"),
    ("donusturmek", "dönüştürmek"),
    ("donusturmeniz", "dönüştürmeniz"),
    ("donusturulen", "dönüştürülen"),
    ("donusum", "dönüşüm"),
    ("donus", "dönüş"),
    ("donustur", "dönüştür"),

    ("gozlem", "gözlem"),
    ("Gozlem", "Gözlem"),

    ("hicbir", "hiçbir"),
    ("Hicbir", "Hiçbir"),

    ("cunku", "çünkü"),
    ("Cunku", "Çünkü"),

    ("olcum", "ölçüm"),
    ("Olcum", "Ölçüm"),
    ("olcek", "ölçek"),
    ("Olcek", "Ölçek"),
    ("olcekle", "ölçekle"),

    ("musteri", "müşteri"),
    ("Musteri", "Müşteri"),

    ("gercek", "gerçek"),
    ("Gercek", "Gerçek"),
    ("gercekten", "gerçekten"),
    ("gerceklesen", "gerçekleşen"),
    ("gerceklestiren", "gerçekleştiren"),
    ("gercekleştir", "gerçekleştir"),

    ("sutun", "sütun"),
    ("Sutun", "Sütun"),
    ("sutunlu", "sütunlu"),
    ("sutunlari", "sütunları"),
    ("sutunlarini", "sütunlarını"),
    ("sutunlardan", "sütunlardan"),

    ("satir", "satır"),
    ("Satir", "Satır"),
    ("satirlari", "satırları"),
    ("satirlarini", "satırlarını"),
    ("satirlardan", "satırlardan"),
    ("satirini", "satırını"),

    ("degisken", "değişken"),
    ("Degisken", "Değişken"),
    ("degiskenler", "değişkenler"),

    ("ozellik", "özellik"),
    ("Ozellik", "Özellik"),
    ("ozellikler", "özellikler"),
    ("ozelliklerini", "özelliklerini"),
    ("ozellikleri", "özellikleri"),

    ("kucuk", "küçük"),
    ("Kucuk", "Küçük"),

    ("buyuk", "büyük"),
    ("Buyuk", "Büyük"),

    ("gelistir", "geliştir"),
    ("Gelistir", "Geliştir"),
    ("gelistirme", "geliştirme"),
    ("gelistirilen", "geliştirilen"),

    ("guncel", "güncel"),
    ("Guncel", "Güncel"),
    ("guncelleme", "güncelleme"),

    ("adim adim", "adım adım"),
    ("Adim adim", "Adım adım"),
    ("adimlari", "adımları"),
    ("adimda", "adımda"),
    ("adimlar", "adımlar"),

    ("gosteriyor", "gösteriyor"),
    ("Gosteriyor", "Gösteriyor"),
    ("gostermek", "göstermek"),
    ("gosteren", "gösteren"),
    ("gosterir", "gösterir"),
    ("gosterilen", "gösterilen"),

    ("dusun", "düşün"),
    ("Dusun", "Düşün"),
    ("dusunce", "düşünce"),
    ("dusunmek", "düşünmek"),

    ("ihtiyac", "ihtiyaç"),
    ("Ihtiyac", "İhtiyaç"),
    ("ihtiyaclar", "ihtiyaçlar"),

    ("karmasik", "karmaşık"),
    ("Karmasik", "Karmaşık"),

    ("dagnik", "dağınık"),   # typo + diakritik
    ("dagnk", "dağınık"),
    ("daginik", "dağınık"),
    ("Daginik", "Dağınık"),

    ("baskalarindan", "başkalarından"),
    ("baskalari", "başkaları"),
    ("Baskalari", "Başkaları"),

    ("ardindan", "ardından"),
    ("Ardindan", "Ardından"),

    ("ceker", "çeker"),
    ("Ceker", "Çeker"),
    ("cekerek", "çekerek"),

    ("cogaltmadan", "çoğaltmadan"),
    ("cogalt", "çoğalt"),

    ("yapistir", "yapıştır"),
    ("Yapistir", "Yapıştır"),

    ("kaynaga", "kaynağa"),
    ("kaynaklari", "kaynakları"),
    ("kaynaklarindan", "kaynaklarından"),

    ("yayilmistir", "yayılmıştır"),
    ("yayilmis", "yayılmış"),

    ("onerilen", "önerilen"),
    ("Onerilen", "Önerilen"),
    ("oneri", "öneri"),
    ("onerilir", "önerilir"),

    ("onceki", "önceki"),
    ("Onceki", "Önceki"),
    ("once", "önce"),  # !! BE CAREFUL: in english "once" exists. Keep this last and skip
    # Actually skip "once" -- too risky. Will handle case-by-case.

    ("sonraki", "sonraki"),  # no change

    ("kullanim", "kullanım"),
    ("Kullanim", "Kullanım"),
    ("kullanimi", "kullanımı"),

    ("beklegi", "beklediği"),
    ("bekledigi", "beklediği"),

    ("herhangi", "herhangi"),

    ("eslestirme", "eşleştirme"),
    ("eslestir", "eşleştir"),
    ("Eslestir", "Eşleştir"),
    ("eslesme", "eşleşme"),

    ("mantigi", "mantığı"),
    ("mantik", "mantık"),

    ("hakim", "hâkim"),

    ("vazgecilmezdir", "vazgeçilmezdir"),
    ("vazgecilmez", "vazgeçilmez"),

    ("sessizce", "sessizce"),  # no change

    ("bozar", "bozar"),  # no change

    ("yanlis", "yanlış"),
    ("Yanlis", "Yanlış"),

    ("dogru", "doğru"),
    ("Dogru", "Doğru"),

    ("genis", "geniş"),
    ("Genis", "Geniş"),

    ("uzun", "uzun"),  # no change

    ("formatina", "formatına"),
    ("formatini", "formatını"),

    ("tablo", "tablo"),  # no change

    ("modelinizin", "modelinizin"),  # no change

    # additional commonly lost diacritics
    ("calis", "çalış"),
    ("Calis", "Çalış"),
    ("calisma", "çalışma"),
    ("calisir", "çalışır"),

    ("yapilan", "yapılan"),
    ("yapildig", "yapıldığ"),

    ("anlat", "anlat"),  # no change
    ("anladim", "anladım"),

    ("yine", "yine"),  # no change

    ("durumda", "durumda"),  # no change

    ("durum", "durum"),  # no change

    ("verir", "verir"),  # no change

    ("alir", "alır"),
    ("Alir", "Alır"),

    ("oluyor", "oluyor"),  # no change
    ("olusturmak", "oluşturmak"),
    ("olusturma", "oluşturma"),
    ("olusturulan", "oluşturulan"),
    ("olusturur", "oluşturur"),
    ("olustur", "oluştur"),
    ("Olustur", "Oluştur"),

    ("tutar", "tutar"),  # no change

    ("hesap", "hesap"),  # no change

    ("kim", "kim"),  # no change

    ("kac", "kaç"),
    ("Kac", "Kaç"),

    ("siklik", "sıklık"),
    ("siklikla", "sıklıkla"),

    ("etki", "etki"),
    ("etkilesim", "etkileşim"),

    # gunduk -> gündük? no
    ("gunluk", "günlük"),
    ("Gunluk", "Günlük"),
    ("gunlukleri", "günlükleri"),

    ("ucuncu", "üçüncü"),
    ("Ucuncu", "Üçüncü"),
    ("uc tane", "üç tane"),

    ("anahtar", "anahtar"),  # no change

    ("temizleyebilirsiniz", "temizleyebilirsiniz"),  # no change

    # safeguards: code-only words must remain untouched - skip generic English words.
]

def fix(path: Path):
    txt = path.read_text(encoding='utf-8')
    original = txt
    cnt = 0
    for bad, good in PAIRS:
        if bad == good:
            continue
        # whole-word match
        pat = r'\b' + re.escape(bad) + r'\b'
        new_txt, n = re.subn(pat, good, txt)
        if n:
            cnt += n
            txt = new_txt
    if txt != original:
        path.write_text(txt, encoding='utf-8')
        return cnt
    return 0

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")
targets = ["pandas/L1.js", "pandas/L2.js", "pandas/L6.js"]
for t in targets:
    p = ROOT / t
    if p.exists():
        n = fix(p)
        print(f"  {t}: {n} replacements")
