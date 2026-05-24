/* ============================================================
   tutorials/interactive-runner.js
   Adds a "▶ RUN" button to every PYTHON code block.
   Click → executes via shared Pyodide instance → shows stdout/stderr below.
   Reuses Pyodide if already loaded on the page (bottom lab); else loads lazily.
   ============================================================ */
(function(){
'use strict';

// ----- Shared Pyodide instance (lazy load) -----
let pyodidePromise = null;

async function loadScriptOnce(src){
  return new Promise((resolve, reject) => {
    if ([...document.scripts].some(s => s.src === src)) return resolve();
    const sc = document.createElement('script');
    sc.src = src; sc.onload = () => resolve(); sc.onerror = reject;
    document.head.appendChild(sc);
  });
}

// Comprehensive preamble: imports common libraries + defines sample data.
// User's lesson code can reference KMeans, train_test_split, X, y, df etc. without re-importing.
const LESSON_PREAMBLE = `
import numpy as np
import pandas as pd
import math, random, json, re, os, sys, io
from collections import Counter, defaultdict, OrderedDict
np.random.seed(42)
random.seed(42)

# ---- sklearn (lazy: only if package loaded) ----
try:
    from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder, LabelEncoder
    from sklearn.model_selection import train_test_split, KFold, cross_val_score, GridSearchCV
    from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
    from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
    from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
    from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
    from sklearn.decomposition import PCA, TruncatedSVD
    from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
    from sklearn.metrics import (
        accuracy_score, precision_score, recall_score, f1_score,
        confusion_matrix, classification_report, roc_auc_score, roc_curve,
        mean_squared_error, mean_absolute_error, r2_score, silhouette_score
    )
    from sklearn.pipeline import Pipeline
    from sklearn.compose import ColumnTransformer
    from sklearn.datasets import load_iris, load_digits, make_classification, make_blobs, make_regression
except ImportError:
    pass  # sklearn not yet loaded; will be loaded by user code if needed

# ---- matplotlib (lazy) ----
try:
    import matplotlib
    matplotlib.use('Agg')  # non-interactive backend (no Tk)
    import matplotlib.pyplot as plt
except ImportError:
    pass

# ---- Site-hosted real datasets (loaded by JS via fetch) ----
import io, sqlite3
def _load_csv(varname):
    raw = globals().get(f'__csv_{varname}__')
    if raw is None: return None
    try: return pd.read_csv(io.StringIO(raw))
    except Exception as e:
        print(f"[dataset load warning] {varname}: {e}")
        return None

df_churn     = _load_csv('churn')      # 500 customers, target: churned
df_reviews   = _load_csv('reviews')    # 300 product/movie reviews
df_tweets    = _load_csv('tweets')     # 300 bilingual tweets
df_housing   = _load_csv('housing')    # 200 housing prices
df_stocks    = _load_csv('stocks')     # 261 daily stock OHLCV
df_iris      = _load_csv('iris')       # 150 iris flowers
df_customers = _load_csv('customers')  # 500 customer profiles (joins to churn)
df_products  = _load_csv('products')   # 39 products
df_orders    = _load_csv('orders')     # 2000 orders (joins to customers + products)

# ---- SQLite in-memory database with all datasets as tables ----
# Use run_sql("SELECT ...") in lessons to execute SQL queries against real data
_SQL_CONN = sqlite3.connect(':memory:')
for _name, _df in [('churn', df_churn), ('reviews', df_reviews), ('tweets', df_tweets),
                   ('housing', df_housing), ('stocks', df_stocks), ('iris', df_iris),
                   ('customers', df_customers), ('products', df_products), ('orders', df_orders)]:
    if _df is not None:
        try: _df.to_sql(_name, _SQL_CONN, index=False, if_exists='replace')
        except Exception as _e: print(f"[sql load warning] {_name}: {_e}")

def run_sql(query):
    """Execute SQL query against the in-memory database and return result as DataFrame.
    Tables: churn, reviews, tweets, housing, stocks, iris, customers, products, orders."""
    return pd.read_sql_query(query, _SQL_CONN)

# ---- Backwards-compat synthetic data (X, y, df) ----
# If df_churn loaded, derive X/y from real data; else fall back to random
if df_churn is not None:
    _num = df_churn.select_dtypes(include=[np.number]).drop(columns=['churned'], errors='ignore')
    X = _num.values.astype(float)
    y = df_churn['churned'].values if 'churned' in df_churn.columns else np.zeros(len(X), dtype=int)
    df = df_churn.copy()
    features = list(_num.columns)
else:
    X = np.random.randn(200, 5).astype(float)
    y = np.random.randint(0, 2, 200)
    features = ['age', 'income', 'tenure', 'spending', 'support_calls']
    df = pd.DataFrame(X, columns=features)
    df['churned'] = y
_split = int(0.8 * len(X))
X_train, X_test = X[:_split], X[_split:]
y_train, y_test = y[:_split], y[_split:]
# Standardized version (zero mean, unit variance per feature)
_xstd = X.std(axis=0); _xstd[_xstd == 0] = 1
X_scaled = (X - X.mean(axis=0)) / _xstd

# ---- NLP corpus ----
texts = [
    "This product is amazing, I love it!",
    "Terrible experience, do not buy.",
    "Decent quality for the price.",
    "Best purchase I have made this year.",
    "Disappointed with the service.",
    "Mukemmel bir urun, kesinlikle tavsiye ederim!",
    "Hayal kirikligi yaratti, geri iade edicegim.",
    "Idare eder, fiyatina gore makul.",
]
labels_text = [1, 0, 1, 1, 0, 1, 0, 1]

# ---- CV image (small fake image) ----
img = np.random.randint(0, 256, (64, 64, 3), dtype=np.uint8)

# ---- Audio (1 second 440Hz tone) ----
sr = 16000
audio = (0.3 * np.sin(2 * np.pi * 440 * np.arange(sr) / sr)).astype(np.float32)
`;

// Site-hosted training datasets — auto-loaded into Python globals as DataFrames + SQLite tables.
// Python: df_churn, df_reviews, etc.   SQL: run_sql("SELECT * FROM churn LIMIT 5")
const SITE_DATASETS = [
  { name: 'churn',     var: 'df_churn',     url: 'https://mikailsarpkaya.com/data/churn.csv' },
  { name: 'reviews',   var: 'df_reviews',   url: 'https://mikailsarpkaya.com/data/reviews.csv' },
  { name: 'tweets',    var: 'df_tweets',    url: 'https://mikailsarpkaya.com/data/tweets.csv' },
  { name: 'housing',   var: 'df_housing',   url: 'https://mikailsarpkaya.com/data/housing.csv' },
  { name: 'stocks',    var: 'df_stocks',    url: 'https://mikailsarpkaya.com/data/stocks.csv' },
  { name: 'iris',      var: 'df_iris',      url: 'https://mikailsarpkaya.com/data/iris.csv' },
  { name: 'customers', var: 'df_customers', url: 'https://mikailsarpkaya.com/data/customers.csv' },
  { name: 'products',  var: 'df_products',  url: 'https://mikailsarpkaya.com/data/products.csv' },
  { name: 'orders',    var: 'df_orders',    url: 'https://mikailsarpkaya.com/data/orders.csv' },
];

async function fetchDatasets(py){
  const results = await Promise.all(SITE_DATASETS.map(async d => {
    try {
      const res = await fetch(d.url);
      if (!res.ok) return { ...d, ok: false };
      const text = await res.text();
      return { ...d, ok: true, text };
    } catch(e) {
      return { ...d, ok: false, error: e.message };
    }
  }));
  // Inject as Python globals
  let ok = 0;
  for (const r of results) {
    if (r.ok) {
      py.globals.set(`__csv_${r.name}__`, r.text);
      ok++;
    }
  }
  return { ok, total: results.length };
}

async function ensurePyodide(){
  if (pyodidePromise) return pyodidePromise;
  // If page already has a global pyodide instance (bottom lab), reuse it
  if (window.__lessonPyodide) return window.__lessonPyodide;
  pyodidePromise = (async () => {
    setLoadingStage('Pyodide runtime indiriliyor… (~5MB)');
    if (typeof loadPyodide !== 'function') {
      await loadScriptOnce('https://cdn.jsdelivr.net/pyodide/v0.28.1/full/pyodide.js');
    }
    const py = await loadPyodide();
    setLoadingStage('Bilim paketleri yükleniyor (numpy, pandas, sklearn…)');
    try {
      // Pyodide v0.28 unvendored sqlite3 — must load explicitly for run_sql() helper
      await py.loadPackage(['numpy', 'pandas', 'scipy', 'joblib', 'scikit-learn', 'matplotlib', 'sqlite3']);
    } catch(e) {
      console.warn('Pre-load warning:', e);
    }
    setLoadingStage('Veri kümeleri çekiliyor (9 dataset)…');
    try {
      const r = await fetchDatasets(py);
      console.log(`Loaded ${r.ok}/${r.total} datasets`);
    } catch(e) { console.warn('Dataset fetch warning:', e); }
    setLoadingStage('Ortam hazırlanıyor (sklearn imports + datasets → DataFrames)…');
    try { py.runPython(LESSON_PREAMBLE); } catch(e) { console.warn('Preamble warning:', e); }
    window.__lessonPyodide = py;
    setLoadingStage('READY', true);
    return py;
  })();
  return pyodidePromise;
}

// ----- Floating loading badge (Pyodide preload UX) -----
let __badge = null;
function ensureBadge() {
  if (__badge) return __badge;
  __badge = document.createElement('div');
  __badge.id = 'pyodide-loading-badge';
  __badge.style.cssText = [
    'position:fixed','bottom:18px','right:18px','z-index:9999',
    'background:rgba(20,20,30,0.92)','color:#9ee','padding:10px 16px',
    'border-radius:24px','font:13px/1.4 system-ui,sans-serif',
    'box-shadow:0 4px 16px rgba(0,0,0,.35)','border:1px solid rgba(120,180,200,.3)',
    'transition:opacity .4s,transform .4s','max-width:340px','user-select:none',
    'backdrop-filter:blur(8px)'
  ].join(';');
  __badge.innerHTML = '<span style="font-size:16px;margin-right:6px">🐍</span><span class="text">Python ortamı hazırlanıyor…</span>';
  document.body.appendChild(__badge);
  return __badge;
}
function setLoadingStage(text, done) {
  const b = ensureBadge();
  const span = b.querySelector('.text');
  if (done) {
    span.textContent = 'Python ortamı hazır — RUN tıklayabilirsiniz';
    b.style.background = 'rgba(40,80,60,0.92)';
    b.style.color = '#9fc';
    setTimeout(() => {
      b.style.opacity = '0';
      b.style.transform = 'translateY(20px)';
      setTimeout(() => b.remove(), 500);
    }, 2500);
  } else {
    span.textContent = text;
  }
}

// Tracks where Pyodide-runnable Python lessons are the norm (whitelist).
// Other tracks rely on DEMO labels — see the DEMO/READ-ONLY gate in attachRunButton.
const STABLE_PYODIDE_TRACKS = [
  '/tutorials/python/',     '/tutorials/numpy/',
  '/tutorials/pandas/',     '/tutorials/sql/',
  '/tutorials/matplotlib/', '/tutorials/sklearn/',
  '/tutorials/ml-theory/',  '/tutorials/nlp/',
  '/tutorials/rl/',         '/tutorials/causal/',
  '/tutorials/timeseries/', '/tutorials/fairness/',
  '/tutorials/recsys/',     '/tutorials/gnn/',
  '/tutorials/privacy/',    '/tutorials/crypto/',
  '/tutorials/linalg/',     '/tutorials/calculus/',
  '/tutorials/math/',
];
function isStablePyodideTrack() {
  return STABLE_PYODIDE_TRACKS.some(p => location.pathname.includes(p));
}

// Preload Pyodide as soon as the page loads IF this lesson has any Python code
function maybePreloadPyodide() {
  // Skip preload if user already disabled it via querystring (?nopreload)
  if (location.search.includes('nopreload')) return;
  // Skip preload on BLOCKED tracks (saves ~5MB download per page-view).
  // Users can still trigger Pyodide manually via the playground textarea button.
  if (!isStablePyodideTrack()) return;
  // Only preload if the page has any PYTHON-labelled code-wrap
  const pythonBlocks = document.querySelectorAll('.code-label');
  let hasRunnable = false;
  for (const lbl of pythonBlocks) {
    const txt = (lbl.textContent || '').toUpperCase();
    if (txt.includes('PYTHON') && !txt.includes('DEMO') && !txt.includes('READ-ONLY')) {
      hasRunnable = true; break;
    }
  }
  if (!hasRunnable) return;
  // Kick off ensurePyodide in background (don't await)
  ensurePyodide().catch(e => {
    const b = ensureBadge();
    b.querySelector('.text').textContent = 'Python ortamı yüklenemedi — sayfayı yenileyin';
    b.style.background = 'rgba(120,30,30,0.92)'; b.style.color = '#fbb';
  });
}

// Hide the "Free Playground" lab-section on BLOCKED tracks (CSS-driven).
// Runs once on DOMContentLoaded via attach hook in main IIFE below.
function hideLabSectionOnBlockedTracks() {
  if (isStablePyodideTrack()) return;
  document.querySelectorAll('.lab-section').forEach(el => { el.style.display = 'none'; });
}

// Packages that are NOT available in Pyodide (would cause infinite hang on loadPackage)
const PYODIDE_UNAVAILABLE = {
  'umap':           'umap-learn (use sklearn.decomposition.TruncatedSVD or PCA in browser)',
  'umap-learn':     'umap-learn',
  'torch':          'PyTorch (browser cannot run torch — open lesson code in Google Colab)',
  'torchvision':    'torchvision',
  'transformers':   'HuggingFace Transformers (use Colab for this code)',
  'tensorflow':     'TensorFlow',
  'keras':          'Keras (try sklearn neural_network.MLPClassifier as a small alternative)',
  'librosa':        'librosa (audio in browser is limited; try numpy FFT instead)',
  'soundfile':      'soundfile',
  'whisper':        'OpenAI Whisper (Colab only)',
  'spacy':          'spaCy (use nltk in browser)',
  'gensim':         'gensim',
  'pyannote':       'pyannote.audio (Colab only)',
  'cv2':            'OpenCV (no wheel for Pyodide — use PIL+numpy for browser demos, or Colab)',
  'opencv':         'OpenCV (no wheel for Pyodide — use PIL+numpy for browser demos, or Colab)',
  'opencv-python':  'OpenCV (no wheel for Pyodide — use PIL+numpy for browser demos, or Colab)',
  'pefile':         'pefile (Windows PE parser — pip install in local Python; Pyodide repo missing)',
  'frida':          'Frida (process injection — local Python or Colab only)',
  'cupy':           'CuPy (GPU array; needs CUDA — local/Colab)',
  'triton':         'Triton GPU kernels (NVIDIA only)',
  'coremltools':    'CoreMLTools (macOS only)',
  'tflite_runtime': 'TFLite runtime (use plain TF in Colab)',
  'tensorflow_lite':'TensorFlow Lite (use plain TF in Colab)',
  'auto_gptq':      'auto-gptq quantization (GPU)',
  'albumentations': 'Albumentations (depends on opencv-python)',
  'sentence_transformers':'Sentence-Transformers (needs torch — Colab only)',
  'web3':           'web3.py (Ethereum SDK; needs network/RPC — local Python only)',
  'solcx':          'py-solc-x (Solidity compiler — local only)',
  'volatility':     'Volatility 3 (memory forensics CLI — local Python only)',
  'volatility3':    'Volatility 3 (memory forensics CLI — local Python only)',
  'paho':           'paho-mqtt (network broker — local Python only)',
  'binwalk':        'binwalk (firmware extraction — local CLI tool)',
  'subprocess':     'subprocess (Pyodide has no OS process model — local Python only)',
  'polars':         'Polars (browser cannot build the Rust core — use pandas equivalents in Pyodide, or run the Polars snippets locally / in Colab)',
  'pyspark':        'PySpark (JVM-only; run in a Spark cluster or Colab)',
  'jax':            'JAX (no XLA in browser — use numpy equivalents here, or run in Colab)',
  'flax':           'Flax (depends on JAX; run in Colab)',
  'lightning':      'PyTorch Lightning (depends on torch; Colab only)',
  'datasets':       'HuggingFace datasets (use a small local CSV in browser, or Colab)',
  'faiss':          'FAISS (C++ extension; use sklearn.neighbors.NearestNeighbors as a small alternative)',
  'chromadb':       'ChromaDB (server/SQLite-backed; Colab or local Python only)',
  'langchain':      'LangChain (network/SDK heavy; run snippets in Colab or local Python)',
  'openai':         'openai SDK (needs network credentials; run locally with your API key)',
  'anthropic':      'anthropic SDK (run locally with your API key)',
};

// Synonyms / submodule roots → canonical key in PYODIDE_UNAVAILABLE
const PYODIDE_UNAVAILABLE_ALIASES = {
  'pl':                 'polars',
  'tf':                 'tensorflow',
  'pyspark.sql':        'pyspark',
  'transformers.utils': 'transformers',
};

function detectPackages(code){
  const pkgs = new Set();
  if (/\bnumpy\b|\bnp\./.test(code)) pkgs.add('numpy');
  if (/\bpandas\b|\bpd\./.test(code)) pkgs.add('pandas');
  if (/\bmatplotlib\b|\bplt\./.test(code)) pkgs.add('matplotlib');
  if (/\bsklearn\b|\bscikit/.test(code)) {
    pkgs.add('scikit-learn');
    pkgs.add('scipy');
    pkgs.add('joblib');
    pkgs.add('numpy');
  }
  if (/\bscipy\b/.test(code)) pkgs.add('scipy');
  if (/\bnetworkx\b/.test(code)) pkgs.add('networkx');
  if (/\bregex\b/.test(code)) pkgs.add('regex');
  if (/\bnltk\b/.test(code)) pkgs.add('nltk');
  if (/\bPIL\b|\bpillow\b/.test(code)) pkgs.add('Pillow');
  if (/\bopencv\b|\bcv2\b/.test(code)) pkgs.add('opencv-python');
  if (/\bsympy\b/.test(code)) pkgs.add('sympy');
  return [...pkgs];
}

function detectUnavailable(code){
  // Returns array of {pkg, hint} for unavailable imports detected in code
  const found = [];
  const importRe = /\b(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
  let m;
  const seen = new Set();
  while ((m = importRe.exec(code)) !== null) {
    const raw = m[1].toLowerCase();
    const pkg = PYODIDE_UNAVAILABLE_ALIASES[raw] || raw;
    if (PYODIDE_UNAVAILABLE[pkg] && !seen.has(pkg)) {
      seen.add(pkg);
      found.push({ pkg: m[1], hint: PYODIDE_UNAVAILABLE[pkg] });
    }
  }
  // Also catch `import polars as pl` style — already covered by the `polars` key above.
  // Catch bare alias usage like `pl.DataFrame(...)` if there is no explicit import (rare).
  if (!seen.has('polars') && /\bpl\.(DataFrame|Series|read_csv|scan_csv|col|lit|when)\b/.test(code)) {
    found.push({ pkg: 'polars', hint: PYODIDE_UNAVAILABLE['polars'] });
  }
  // Catch bare cv2.X(...) calls without explicit `import cv2` (inheriting from a prior DEMO block)
  if (!seen.has('cv2') && /\bcv2\.[A-Za-z_]+\(/.test(code) && !/\bimport\s+cv2\b/.test(code)) {
    found.push({ pkg: 'cv2', hint: PYODIDE_UNAVAILABLE['cv2'] });
  }
  return found;
}

async function runPython(code, outEl, btn){
  outEl.classList.remove('err');
  outEl.classList.add('running');
  outEl.textContent = '⏳ Loading Python runtime…';
  outEl.style.display = 'block';
  if (btn) { btn.disabled = true; btn.textContent = '⏳ RUNNING'; }

  // Check for browser-incompatible packages BEFORE loading Pyodide
  const blockers = detectUnavailable(code);
  if (blockers.length) {
    const lines = blockers.map(b => `  • ${b.pkg} — ${b.hint}`);
    outEl.classList.remove('running');
    outEl.classList.add('err');
    outEl.textContent =
      '⚠ This lesson code requires packages not available in the browser:\n\n' +
      lines.join('\n') +
      '\n\nThis is a "demo only" code block — read it for understanding, ' +
      'but to actually run it, copy the code and paste into Google Colab or a local Python environment.';
    if (btn) { btn.disabled = false; btn.textContent = '▶ RUN'; }
    return;
  }

  try {
    const py = await ensurePyodide();

    // Detect and pre-load packages (with sklearn deps)
    const pkgs = detectPackages(code);
    if (pkgs.length) {
      outEl.textContent = '⏳ Loading packages: ' + pkgs.join(', ') + '…';
      try { await py.loadPackage(pkgs); }
      catch(e) { console.warn('loadPackage warning:', e); }
    }

    outEl.textContent = '⏳ Running…';

    // Use Python wrapper that captures full traceback
    py.globals.set('__user_code__', code);
    py.runPython(`
import sys, io, traceback
__so = io.StringIO()
__se = io.StringIO()
__old_out = sys.stdout
__old_err = sys.stderr
sys.stdout = __so
sys.stderr = __se
__exit_code = 0
try:
    exec(compile(__user_code__, '<lesson>', 'exec'), globals())
except SystemExit:
    pass
except BaseException:
    __exit_code = 1
    traceback.print_exc(file=__se)
finally:
    sys.stdout = __old_out
    sys.stderr = __old_err
`);
    const out = py.globals.get('__so').getvalue();
    const err = py.globals.get('__se').getvalue();
    const exitCode = py.globals.get('__exit_code');

    outEl.classList.remove('running');
    if (exitCode !== 0) {
      outEl.classList.add('err');
      outEl.textContent = (out ? out + '\n' : '') + (err || '(error without message)');
    } else if (out) {
      outEl.textContent = out + (err ? '\n' + err : '');
    } else if (err) {
      outEl.textContent = '[no stdout]\n' + err;
    } else {
      outEl.textContent = '✓ Ran successfully (no output)';
    }
  } catch (e) {
    outEl.classList.remove('running');
    outEl.classList.add('err');
    outEl.textContent = 'Runtime error: ' + (e.message || e);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '▶ RUN'; }
  }
}

function attachRunButton(codeEl){
  const wrap = codeEl.closest('.code-wrap');
  if (!wrap) return;
  // Only attach to PYTHON code (check label)
  const labelEl = wrap.querySelector('.code-label');
  if (!labelEl) return;
  const labelText = (labelEl.textContent || '').toUpperCase();
  if (!labelText.includes('PYTHON')) return;
  // Skip non-runnable code (DEMO, READ-ONLY) — these reference packages
  // unavailable in Pyodide (torch, transformers, opencv, librosa, etc.)
  // and would force the user to wait ~7-10s for Pyodide to load only to error.
  if (labelText.includes('DEMO') || labelText.includes('READ-ONLY') ||
      labelText.includes('READONLY') || labelText.includes('READ ONLY')) return;
  // Skip if already attached
  if (wrap.querySelector('.run-btn')) return;

  // CAPTURE original plain-text code BEFORE making editable (so syntax-highlighted spans
  // and contenteditable DOM manipulations don't corrupt our newlines).
  const originalPlainText = codeEl.textContent;
  codeEl.dataset.original = originalPlainText;

  // Make code editable (click, type, modify before running)
  codeEl.setAttribute('contenteditable', 'plaintext-only');
  codeEl.setAttribute('spellcheck', 'false');
  codeEl.setAttribute('autocorrect', 'off');
  codeEl.classList.add('editable-code');
  // Tab key inserts spaces instead of changing focus
  codeEl.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode('    '));
      range.collapse(false);
      sel.removeAllRanges(); sel.addRange(range);
    }
  });

  // Create RUN button (placed before COPY)
  const btn = document.createElement('button');
  btn.className = 'run-btn';
  btn.textContent = '▶ RUN';
  const copy = labelEl.querySelector('.copy-btn, .code-copy');
  if (copy) copy.parentNode.insertBefore(btn, copy);
  else labelEl.appendChild(btn);

  // RESET button to restore original code (uses captured pre-edit text)
  const resetBtn = document.createElement('button');
  resetBtn.className = 'reset-btn';
  resetBtn.textContent = '↺ RESET';
  resetBtn.title = 'Restore original code';
  if (copy) copy.parentNode.insertBefore(resetBtn, copy);
  else labelEl.appendChild(resetBtn);
  resetBtn.addEventListener('click', () => {
    codeEl.textContent = originalPlainText;
    // strip syntax-highlight spans permanently (so re-edit is plain text)
  });

  // Track whether user edited the code (compared to original)
  let userEdited = false;

  // Code persistence — restore previously saved edit from localStorage
  const storageKey = 'mikail:code:' + location.pathname + ':' + (codeEl.dataset.idx || (codeEl.dataset.idx = String(Date.now() + Math.random())));
  // Better key: stable hash of original code so it survives idx reshuffles
  const stableKey = 'mikail:code:' + location.pathname + ':' + simpleHash(originalPlainText);
  try {
    const saved = localStorage.getItem(stableKey);
    if (saved && saved !== originalPlainText) {
      codeEl.textContent = saved;
      userEdited = true;
      // Show subtle indicator that edits were restored
      const restored = document.createElement('span');
      restored.textContent = '↻ kayıtlı';
      restored.style.cssText = 'font-size:.7rem;color:#a2c;margin-left:6px;opacity:.7';
      restored.title = 'Önceki düzenlemen geri yüklendi (RESET ile orijinale dön)';
      labelEl.appendChild(restored);
    }
  } catch(e) {}

  // Auto-save edits (debounced)
  let saveTimer = null;
  codeEl.addEventListener('input', () => {
    userEdited = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        const cur = codeEl.innerText || codeEl.textContent || '';
        if (cur === originalPlainText) localStorage.removeItem(stableKey);
        else localStorage.setItem(stableKey, cur);
      } catch(e) {}
    }, 700);
  });

  // RESET also clears storage
  resetBtn.addEventListener('click', () => {
    try { localStorage.removeItem(stableKey); } catch(e) {}
  });

  // Output container (created on first run)
  let out = wrap.querySelector('.run-output');
  if (!out) {
    out = document.createElement('div');
    out.className = 'run-output';
    out.style.display = 'none';
    wrap.appendChild(out);
  }

  // Read code:
  // - If user has NOT edited, use the captured pre-edit plain text (most reliable)
  // - If user HAS edited, use innerText (preserves visual newlines from contenteditable)
  function readCode(){
    if (!userEdited) return originalPlainText;
    let raw = codeEl.innerText || codeEl.textContent || '';
    raw = raw.replace(/\r\n?/g, '\n');
    return raw;
  }

  btn.addEventListener('click', () => {
    runPython(readCode(), out, btn);
  });
  // Ctrl+Enter / Cmd+Enter inside the code block runs it
  codeEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      btn.click();
    }
  });
}

function attachAllButtons(root){
  (root || document).querySelectorAll('.code-block code, pre.code-block code').forEach(attachRunButton);
}

function simpleHash(str) {
  // Small non-cryptographic hash for stable code-block identity
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

// Initial pass + Pyodide preload
function initAll() {
  attachAllButtons();
  // Hide Free Playground on BLOCKED tracks (no point — Pyodide won't load those libs)
  hideLabSectionOnBlockedTracks();
  // Defer preload slightly so it doesn't compete with critical render
  setTimeout(maybePreloadPyodide, 800);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

// Re-run after lesson content is dynamically loaded (loadLesson() innerHTMLs the content)
const obs = new MutationObserver(muts => {
  for (const m of muts) {
    if (m.addedNodes.length) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1) attachAllButtons(n);
      }
    }
  }
});
const lessonContent = document.getElementById('lessonContent') || document.querySelector('.lesson-content');
if (lessonContent) obs.observe(lessonContent, {childList: true, subtree: true});

// Expose for manual re-attach
window.__attachRunButtons = attachAllButtons;

})();
