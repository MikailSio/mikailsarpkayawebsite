/**
 * core.i18n.js — Python Core translations (EN/TR/DE/ES)
 * Loaded after shared.i18n.js — merges into global T object.
 */

const T_LOCAL = {

  /* ── PAGE HEADER ── */
  "py.eyebrow": {
    en:"Tutorial · Python Core",
    tr:"Eğitim · Python Temelleri",
    de:"Tutorial · Python-Grundlagen",
    es:"Tutorial · Python Core"},
  "py.desc": {
    en:"The language of <strong>AI, data science, and automation</strong>. Master Python from variables to generators — with real-world patterns used in NLP pipelines, ML experiments, and web scraping workflows. Every example is practical, every concept connects to real engineering.",
    tr:"<strong>Yapay zeka, veri bilimi ve otomasyonun</strong> dili. Değişkenlerden jeneratörlere kadar Python'u öğrenin — NLP pipeline'larında, ML deneylerinde ve web kazıma iş akışlarında kullanılan gerçek dünya kalıplarıyla. Her örnek pratik, her kavram gerçek mühendisliğe bağlı.",
    de:"Die Sprache von <strong>KI, Datenwissenschaft und Automatisierung</strong>. Meistern Sie Python von Variablen bis Generatoren — mit praxisnahen Mustern aus NLP-Pipelines, ML-Experimenten und Web-Scraping-Workflows.",
    es:"El lenguaje de la <strong>IA, ciencia de datos y automatización</strong>. Domina Python desde variables hasta generadores — con patrones reales de pipelines NLP, experimentos ML y flujos de web scraping."},
  "py.level": {
    en:"Beginner → Intermediate",
    tr:"Başlangıç → Orta",
    de:"Anfänger → Mittel",
    es:"Principiante → Intermedio"},

  /* ── L01: Syntax, Variables & Data Types ── */
  "py.l1.t": {
    en:"Syntax, Variables & Data Types",
    tr:"Söz Dizimi, Değişkenler & Veri Tipleri",
    de:"Syntax, Variablen & Datentypen",
    es:"Sintaxis, Variables y Tipos de Datos"},
  "py.l1.s": {
    en:"int · float · str · bool · None · type() · f-strings · type conversion · 8 min",
    tr:"int · float · str · bool · None · type() · f-string'ler · tür dönüşümü · 8 dk",
    de:"int · float · str · bool · None · type() · f-Strings · Typkonvertierung · 8 Min.",
    es:"int · float · str · bool · None · type() · f-strings · conversión de tipos · 8 min"},
  "py.l1.p1": {
    en:"Python is a <strong>dynamically typed</strong>, interpreted language. You don't declare types — Python infers them at runtime. This makes prototyping fast, which is why it dominates AI/ML research.",
    tr:"Python <strong>dinamik tipli</strong>, yorumlanmış bir dildir. Tip bildirimi yapmazsınız — Python bunları çalışma zamanında çıkarır. Bu, hızlı prototipleme sağlar ve YZ/ML araştırmalarında baskın olmasının nedenidir.",
    de:"Python ist eine <strong>dynamisch typisierte</strong>, interpretierte Sprache. Sie deklarieren keine Typen — Python leitet sie zur Laufzeit ab. Das macht Prototyping schnell und ist der Grund für Pythons Dominanz in der KI/ML-Forschung.",
    es:"Python es un lenguaje <strong>dinámicamente tipado</strong> e interpretado. No declaras tipos — Python los infiere en tiempo de ejecución. Esto hace que el prototipado sea rápido, por eso domina la investigación en IA/ML."},
  "py.l1.p2": {
    en:"<strong>f-strings</strong> (Python 3.6+) are the cleanest way to embed variables in strings. They're faster than <code>format()</code> and <code>%</code> formatting.",
    tr:"<strong>f-string'ler</strong> (Python 3.6+) değişkenleri string'lere gömmenin en temiz yoludur. <code>format()</code> ve <code>%</code> biçimlendirmesinden daha hızlıdır.",
    de:"<strong>f-Strings</strong> (Python 3.6+) sind die sauberste Methode, Variablen in Strings einzubetten. Sie sind schneller als <code>format()</code> und <code>%</code>-Formatierung.",
    es:"Los <strong>f-strings</strong> (Python 3.6+) son la forma más limpia de incrustar variables en strings. Son más rápidos que <code>format()</code> y el formato <code>%</code>."},

  /* ── L02: Lists, Tuples, Dicts & Sets ── */
  "py.l2.t": {
    en:"Lists, Tuples, Dicts & Sets",
    tr:"Listeler, Tuple'lar, Dict'ler & Set'ler",
    de:"Listen, Tupel, Dicts & Sets",
    es:"Listas, Tuplas, Dicts y Sets"},
  "py.l2.s": {
    en:"Slicing · comprehensions · dict operations · word frequency · set ops · 10 min",
    tr:"Dilimleme · comprehension'lar · dict işlemleri · kelime frekansı · set ops · 10 dk",
    de:"Slicing · Comprehensions · Dict-Operationen · Worthäufigkeit · Set-Ops · 10 Min.",
    es:"Slicing · comprensiones · operaciones dict · frecuencia de palabras · ops de set · 10 min"},
  "py.l2.p1": {
    en:"Python's <strong>built-in data structures</strong> are the foundation of everything. Lists are ordered and mutable, tuples are immutable, dicts map keys to values, and sets store unique items. You'll use all four constantly in data science and NLP.",
    tr:"Python'un <strong>yerleşik veri yapıları</strong> her şeyin temelidir. Listeler sıralı ve değiştirilebilir, tuple'lar değiştirilemez, dict'ler anahtarları değerlere eşler ve set'ler benzersiz öğeleri saklar. Veri bilimi ve NLP'de dördünü de sürekli kullanacaksınız.",
    de:"Pythons <strong>eingebaute Datenstrukturen</strong> sind die Grundlage von allem. Listen sind geordnet und veränderbar, Tupel unveränderlich, Dicts bilden Schlüssel auf Werte ab, und Sets speichern einzigartige Elemente.",
    es:"Las <strong>estructuras de datos incorporadas</strong> de Python son la base de todo. Las listas son ordenadas y mutables, las tuplas inmutables, los dicts mapean claves a valores, y los sets almacenan elementos únicos."},

  /* ── L03: Control Flow ── */
  "py.l3.t": {
    en:"Control Flow",
    tr:"Kontrol Akışı",
    de:"Kontrollfluss",
    es:"Flujo de Control"},
  "py.l3.s": {
    en:"if/elif/else · for · while · enumerate · zip · walrus operator · 8 min",
    tr:"if/elif/else · for · while · enumerate · zip · walrus operatörü · 8 dk",
    de:"if/elif/else · for · while · enumerate · zip · Walrus-Operator · 8 Min.",
    es:"if/elif/else · for · while · enumerate · zip · operador walrus · 8 min"},
  "py.l3.p1": {
    en:"Python uses <strong>indentation</strong> to define code blocks — no curly braces. This enforces clean, readable code. Combined with <code>enumerate</code>, <code>zip</code>, and the <strong>walrus operator</strong>, Python's control flow is both powerful and elegant.",
    tr:"Python kod bloklarını tanımlamak için <strong>girintileme</strong> kullanır — süslü parantez yoktur. Bu, temiz ve okunabilir kodu zorunlu kılar. <code>enumerate</code>, <code>zip</code> ve <strong>walrus operatörü</strong> ile birleştiğinde, Python'un kontrol akışı hem güçlü hem de zariftir.",
    de:"Python verwendet <strong>Einrückung</strong> zur Definition von Codeblöcken — keine geschweiften Klammern. Zusammen mit <code>enumerate</code>, <code>zip</code> und dem <strong>Walrus-Operator</strong> ist der Kontrollfluss leistungsstark und elegant.",
    es:"Python usa <strong>indentación</strong> para definir bloques de código — sin llaves. Combinado con <code>enumerate</code>, <code>zip</code> y el <strong>operador walrus</strong>, el flujo de control es potente y elegante."},

  /* ── L04: Functions, Lambdas & Decorators ── */
  "py.l4.t": {
    en:"Functions, Lambdas & Decorators",
    tr:"Fonksiyonlar, Lambda'lar & Dekoratörler",
    de:"Funktionen, Lambdas & Dekoratoren",
    es:"Funciones, Lambdas y Decoradores"},
  "py.l4.s": {
    en:"def · *args/**kwargs · lambda · sorted with key · @decorator · type hints · 10 min",
    tr:"def · *args/**kwargs · lambda · key ile sorted · @dekoratör · tip ipuçları · 10 dk",
    de:"def · *args/**kwargs · lambda · sorted mit key · @Dekorator · Type Hints · 10 Min.",
    es:"def · *args/**kwargs · lambda · sorted con key · @decorador · type hints · 10 min"},
  "py.l4.p1": {
    en:"Functions are the building blocks of clean Python code. Combined with <strong>lambda expressions</strong>, <strong>decorators</strong>, and <strong>type hints</strong>, they let you write maintainable, self-documenting code — essential for collaborative research projects.",
    tr:"Fonksiyonlar temiz Python kodunun yapı taşlarıdır. <strong>Lambda ifadeleri</strong>, <strong>dekoratörler</strong> ve <strong>tip ipuçları</strong> ile birleştiğinde, bakımı kolay ve kendi kendini belgeleyen kod yazmanızı sağlar — ortak araştırma projeleri için çok önemlidir.",
    de:"Funktionen sind die Bausteine von sauberem Python-Code. Zusammen mit <strong>Lambda-Ausdrücken</strong>, <strong>Dekoratoren</strong> und <strong>Type Hints</strong> ermöglichen sie wartbaren, selbstdokumentierenden Code.",
    es:"Las funciones son los bloques de construcción del código Python limpio. Combinadas con <strong>expresiones lambda</strong>, <strong>decoradores</strong> y <strong>type hints</strong>, permiten escribir código mantenible y autodocumentado."},

  /* ── L05: OOP — Classes & Inheritance ── */
  "py.l5.t": {
    en:"OOP — Classes & Inheritance",
    tr:"OOP — Sınıflar & Kalıtım",
    de:"OOP — Klassen & Vererbung",
    es:"POO — Clases y Herencia"},
  "py.l5.s": {
    en:"__init__ · self · inheritance · __repr__ · __len__ · @property · dataclass · 12 min",
    tr:"__init__ · self · kalıtım · __repr__ · __len__ · @property · dataclass · 12 dk",
    de:"__init__ · self · Vererbung · __repr__ · __len__ · @property · dataclass · 12 Min.",
    es:"__init__ · self · herencia · __repr__ · __len__ · @property · dataclass · 12 min"},
  "py.l5.p1": {
    en:"<strong>Object-Oriented Programming</strong> is how PyTorch, HuggingFace, and Scikit-learn are built. Every model is a class, every dataset is a class. Understanding OOP means understanding the tools you use daily in ML.",
    tr:"<strong>Nesne Yönelimli Programlama</strong> PyTorch, HuggingFace ve Scikit-learn'ün inşa edilme şeklidir. Her model bir sınıf, her veri seti bir sınıftır. OOP'yi anlamak, ML'de günlük kullandığınız araçları anlamak demektir.",
    de:"<strong>Objektorientierte Programmierung</strong> ist die Grundlage von PyTorch, HuggingFace und Scikit-learn. Jedes Modell ist eine Klasse, jeder Datensatz ist eine Klasse. OOP zu verstehen bedeutet, die Werkzeuge zu verstehen, die Sie täglich in ML verwenden.",
    es:"La <strong>Programación Orientada a Objetos</strong> es cómo están construidos PyTorch, HuggingFace y Scikit-learn. Cada modelo es una clase, cada dataset es una clase. Entender POO significa entender las herramientas que usas diariamente en ML."},

  /* ── L06: Error Handling & Exceptions ── */
  "py.l6.t": {
    en:"Error Handling & Exceptions",
    tr:"Hata Yönetimi & İstisnalar",
    de:"Fehlerbehandlung & Ausnahmen",
    es:"Manejo de Errores y Excepciones"},
  "py.l6.s": {
    en:"try/except/finally · raise · custom exceptions · assert · common ML errors · 8 min",
    tr:"try/except/finally · raise · özel istisnalar · assert · yaygın ML hataları · 8 dk",
    de:"try/except/finally · raise · eigene Ausnahmen · assert · häufige ML-Fehler · 8 Min.",
    es:"try/except/finally · raise · excepciones personalizadas · assert · errores ML comunes · 8 min"},
  "py.l6.p1": {
    en:"Robust code handles errors gracefully. In ML projects, you'll encounter <code>FileNotFoundError</code> when loading datasets, <code>ValueError</code> when shapes mismatch, and <code>KeyError</code> when config keys are missing. Proper exception handling makes debugging faster.",
    tr:"Sağlam kod hataları zarif bir şekilde ele alır. ML projelerinde veri setlerini yüklerken <code>FileNotFoundError</code>, boyutlar uyuşmadığında <code>ValueError</code> ve yapılandırma anahtarları eksik olduğunda <code>KeyError</code> ile karşılaşırsınız.",
    de:"Robuster Code behandelt Fehler elegant. In ML-Projekten begegnen Sie <code>FileNotFoundError</code> beim Laden von Datensätzen, <code>ValueError</code> bei Form-Mismatch und <code>KeyError</code> bei fehlenden Config-Schlüsseln.",
    es:"El código robusto maneja errores con elegancia. En proyectos ML encontrarás <code>FileNotFoundError</code> al cargar datasets, <code>ValueError</code> cuando las formas no coinciden, y <code>KeyError</code> cuando faltan claves de configuración."},

  /* ── L07: File I/O, JSON & CSV ── */
  "py.l7.t": {
    en:"File I/O, JSON & CSV",
    tr:"Dosya G/Ç, JSON & CSV",
    de:"Datei-E/A, JSON & CSV",
    es:"E/S de Archivos, JSON y CSV"},
  "py.l7.s": {
    en:"open() · context manager · json · csv.DictReader · pathlib · UTF-8 · 8 min",
    tr:"open() · context manager · json · csv.DictReader · pathlib · UTF-8 · 8 dk",
    de:"open() · Kontextmanager · json · csv.DictReader · pathlib · UTF-8 · 8 Min.",
    es:"open() · gestor de contexto · json · csv.DictReader · pathlib · UTF-8 · 8 min"},
  "py.l7.p1": {
    en:"Every ML project starts with <strong>reading data</strong>. Text files, JSON configs, CSV datasets — you need to handle them all fluently. Python's <code>pathlib</code> and context managers make file operations clean and safe.",
    tr:"Her ML projesi <strong>veri okumakla</strong> başlar. Metin dosyaları, JSON yapılandırmaları, CSV veri setleri — hepsini akıcı bir şekilde kullanmanız gerekir. Python'un <code>pathlib</code> ve context manager'ları dosya işlemlerini temiz ve güvenli hale getirir.",
    de:"Jedes ML-Projekt beginnt mit dem <strong>Lesen von Daten</strong>. Textdateien, JSON-Konfigurationen, CSV-Datensätze — Sie müssen alle fließend handhaben. Pythons <code>pathlib</code> und Kontextmanager machen Dateioperationen sauber und sicher.",
    es:"Todo proyecto ML comienza con <strong>leer datos</strong>. Archivos de texto, configs JSON, datasets CSV — necesitas manejarlos todos con fluidez. <code>pathlib</code> y los gestores de contexto de Python hacen las operaciones de archivos limpias y seguras."},

  /* ── L08: Modules & Virtual Environments ── */
  "py.l8.t": {
    en:"Modules & Virtual Environments",
    tr:"Modüller & Sanal Ortamlar",
    de:"Module & Virtuelle Umgebungen",
    es:"Módulos y Entornos Virtuales"},
  "py.l8.s": {
    en:"import · __init__.py · pip · venv · requirements.txt · project structure · 6 min",
    tr:"import · __init__.py · pip · venv · requirements.txt · proje yapısı · 6 dk",
    de:"import · __init__.py · pip · venv · requirements.txt · Projektstruktur · 6 Min.",
    es:"import · __init__.py · pip · venv · requirements.txt · estructura de proyecto · 6 min"},
  "py.l8.p1": {
    en:"Every Python project should have its own <strong>virtual environment</strong>. This isolates dependencies so different projects don't interfere with each other — critical for reproducible ML experiments where version mismatches break everything.",
    tr:"Her Python projesi kendi <strong>sanal ortamına</strong> sahip olmalıdır. Bu, bağımlılıkları izole eder ve farklı projeler birbirini etkilemez — versiyon uyumsuzluklarının her şeyi bozduğu tekrarlanabilir ML deneyleri için kritik öneme sahiptir.",
    de:"Jedes Python-Projekt sollte seine eigene <strong>virtuelle Umgebung</strong> haben. Dies isoliert Abhängigkeiten — entscheidend für reproduzierbare ML-Experimente, bei denen Versionskonflikte alles kaputt machen.",
    es:"Cada proyecto Python debe tener su propio <strong>entorno virtual</strong>. Esto aísla dependencias para que diferentes proyectos no interfieran — crítico para experimentos ML reproducibles."},

  /* ── L09: Iterators & Generators ── */
  "py.l9.t": {
    en:"Iterators & Generators",
    tr:"Yineleyiciler & Jeneratörler",
    de:"Iteratoren & Generatoren",
    es:"Iteradores y Generadores"},
  "py.l9.s": {
    en:"yield · generator expressions · batch_generator · memory efficiency · 8 min",
    tr:"yield · jeneratör ifadeleri · batch_generator · bellek verimliliği · 8 dk",
    de:"yield · Generator-Ausdrücke · batch_generator · Speichereffizienz · 8 Min.",
    es:"yield · expresiones generadoras · batch_generator · eficiencia de memoria · 8 min"},
  "py.l9.p1": {
    en:"<strong>Generators</strong> produce items one at a time using <code>yield</code> instead of building entire lists in memory. This is essential when processing large NLP corpora — you can iterate through millions of text samples without loading them all into RAM.",
    tr:"<strong>Jeneratörler</strong> bellek yerine <code>yield</code> kullanarak öğeleri tek tek üretir. Büyük NLP korpuslarını işlerken bu vazgeçilmezdir — milyonlarca metin örneğini RAM'e yüklemeden dolaşabilirsiniz.",
    de:"<strong>Generatoren</strong> erzeugen Elemente einzeln mit <code>yield</code>, statt ganze Listen im Speicher aufzubauen. Unverzichtbar bei der Verarbeitung großer NLP-Korpora — Millionen von Textproben durchlaufen, ohne sie alle in den RAM zu laden.",
    es:"Los <strong>generadores</strong> producen elementos uno a la vez usando <code>yield</code> en lugar de construir listas completas en memoria. Esencial al procesar grandes corpus NLP — puedes iterar millones de muestras sin cargarlas todas en RAM."},

  /* ── L10: Regex & Text Processing ── */
  "py.l10.t": {
    en:"Regex & Text Processing",
    tr:"Regex & Metin İşleme",
    de:"Regex & Textverarbeitung",
    es:"Regex y Procesamiento de Texto"},
  "py.l10.s": {
    en:"re module · findall · sub · NLP text cleaning · Turkish character handling · 10 min",
    tr:"re modülü · findall · sub · NLP metin temizleme · Türkçe karakter yönetimi · 10 dk",
    de:"re-Modul · findall · sub · NLP-Textbereinigung · türkische Zeichenbehandlung · 10 Min.",
    es:"módulo re · findall · sub · limpieza de texto NLP · manejo de caracteres turcos · 10 min"},
  "py.l10.p1": {
    en:"<strong>Regular expressions</strong> are the surgeon's scalpel of text processing. In NLP pipelines, they handle URL removal, number normalization, special character cleaning, and language-specific preprocessing — especially important for Turkish text with its unique characters.",
    tr:"<strong>Düzenli ifadeler</strong> metin işlemenin cerrah neşteridir. NLP pipeline'larında URL kaldırma, sayı normalleştirme, özel karakter temizleme ve dile özgü ön işleme ile ilgilenirler — özellikle benzersiz karakterleriyle Türkçe metinler için önemlidir.",
    de:"<strong>Reguläre Ausdrücke</strong> sind das Skalpell der Textverarbeitung. In NLP-Pipelines behandeln sie URL-Entfernung, Zahlennormalisierung und sprachspezifische Vorverarbeitung — besonders wichtig für türkischen Text.",
    es:"Las <strong>expresiones regulares</strong> son el bisturí del procesamiento de texto. En pipelines NLP manejan eliminación de URLs, normalización de números y preprocesamiento específico del idioma — especialmente importante para texto turco."},
};

/* Merge into global T */
Object.assign(T, T_LOCAL);
