"""gen_tutorials_v4.py — Slug-based category IA generator (full rollout + scoped sidebar).

Reads _catalog/_master.json and clones every System-A numbered lesson into
    tutorials/<category>/<subfield>/<slug>.html
with (a) GLOBAL cross-track link rewriting, (b) per-track assets copied so the new
dirs are self-contained, and (c) a CATEGORY-SCOPED sidebar injected into each page
(shows only the lesson's category tracks; cross-listed prerequisites included).

Old numbered files are untouched. A redirect map (old→new) is written for nginx.
Turkish exam content (category "tr": matematik) is excluded from this pass.
"""
import json
import re
import shutil
from pathlib import Path

import gen_sidebar_v3 as g3          # reuse the proven sb-v3 inline CSS

ROOT = Path(__file__).resolve().parent
TUT = ROOT / "tutorials"
CAT = ROOT / "_catalog"
SIDEBAR_STYLE = g3.SIDEBAR_STYLE

MASTER = json.loads((CAT / "_master.json").read_text(encoding="utf-8"))

# NLP curated in the pilot — full bilingual data so the sidebar labels render.
NLP_LESSONS = [
    ("text-preprocessing", "Text Preprocessing", "Metin Ön İşleme"),
    ("bow-tfidf-ngrams", "BoW, TF-IDF & n-grams", "TDF, TF-IDF & n-gramlar"),
    ("text-classification", "Text Classification", "Metin Sınıflandırma"),
    ("sentiment-analysis", "Sentiment Analysis", "Duygu Analizi"),
    ("word-embeddings", "Word Embeddings", "Kelime Gömmeleri"),
    ("topic-modeling", "Topic Modeling", "Konu Modelleme"),
    ("sequence-labeling", "Sequence Labeling & IE", "Dizi Etiketleme & BÇ"),
    ("language-models", "Language Models", "Dil Modelleri"),
    ("seq2seq-attention", "Seq2Seq & Attention", "Seq2Seq & Dikkat"),
    ("transformers-bert", "Transformers & BERT", "Transformerler & BERT"),
    ("generative-llms", "Generative LLMs", "Üretici LLM'ler"),
    ("applied-nlp", "Applied NLP", "Uygulamalı NLP"),
    ("subword-tokenization", "Subword Tokenization", "Alt-kelime Tokenleştirme"),
    ("reasoning-models", "Reasoning Models", "Akıl Yürütme Modelleri"),
    ("llm-evaluation", "LLM Evaluation", "LLM Değerlendirme"),
]
MASTER["nlp"] = {
    "category": "ai", "subfield": "nlp",
    "name_en": "NLP & LLMs", "name_tr": "NLP & LLM'ler",
    "lessons": [{"n": i + 1, "slug": s, "en": en, "tr": tr}
                for i, (s, en, tr) in enumerate(NLP_LESSONS)],
}

ASSET_EXTS = {".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".gif",
              ".webp", ".woff", ".woff2", ".ico", ".json", ".map"}


def dest_path(track, entry):
    cat, sub = entry["category"], entry["subfield"]
    if track == "math":               # "ML Mathematics" lives in the AI path
        return "ai/probability"
    if cat == "tr":
        return sub
    return f"{cat}/{sub}"


MIGRATE = {t: e for t, e in MASTER.items() if e.get("category") != "tr"}

# ── GLOBAL link rewrite map ──
GLOBAL, COURSE = {}, {}
for track, entry in MIGRATE.items():
    base = "/tutorials/" + dest_path(track, entry)
    COURSE[track] = base + "/"
    for les in entry["lessons"]:
        GLOBAL[(track, les["n"])] = f"{base}/{les['slug']}"

_alt = "|".join(re.escape(f) for f in sorted(MIGRATE, key=len, reverse=True))
LINK_RE = re.compile(r"/tutorials/(" + _alt + r")/(\d+)\b")
COURSE_RE = re.compile(r"/tutorials/(" + _alt + r")/(?=[\"'\s<#?]|$)")


def rewrite(html):
    html = LINK_RE.sub(lambda m: GLOBAL.get((m.group(1), int(m.group(2))), m.group(0)), html)
    html = COURSE_RE.sub(lambda m: COURSE.get(m.group(1), m.group(0)), html)
    return html


# ── category taxonomy for the SCOPED sidebar: cat -> [(label_en, label_tr, emoji, [tracks])] ──
TAXONOMY = {
    "ai": [
        ("Foundations", "Temeller", "\U0001F9F1", ["python"]),
        ("Math for AI", "AI için Matematik", "\U0001F4D0", ["linalg", "calculus", "math"]),
        ("Data", "Veri", "\U0001F4CA", ["numpy", "pandas", "sql", "matplotlib"]),
        ("Core ML", "Temel ML", "\U0001F9E0", ["ml-theory", "sklearn"]),
        ("Deep Learning", "Derin Öğrenme", "\U0001F916", ["deep", "pytorch"]),
        ("NLP & LLMs", "NLP & LLM", "\U0001F4AC", ["nlp", "huggingface", "langchain", "agents", "vectordb"]),
        ("Domains", "Alanlar", "\U0001F3AF", ["cv", "audio", "multimodal", "timeseries", "gnn", "recsys", "rl", "causal", "bio"]),
        ("Production", "Üretim", "⚙️", ["mlops", "edge", "gpu"]),
    ],
    "math": [
        ("Mathematics", "Matematik", "\U0001F4D0", ["linalg", "calculus", "discrete", "complex", "fourier", "diffeq", "markov", "control"]),
    ],
    "programming": [
        ("Programming", "Programlama", "\U0001F4BB", ["python", "c", "cpp", "js"]),
    ],
    "security": [
        ("AI Safety", "AI Güvenliği", "\U0001F6E1️", ["safety", "mlsec", "privacy", "fairness", "compliance"]),
        ("Cybersecurity", "Siber Güvenlik", "\U0001F512", ["crypto", "netsec", "forensics", "blockchain", "iot"]),
    ],
    "tools": [
        ("Tools", "Araçlar", "\U0001F6E0️", ["latex", "gpu"]),
    ],
}


def home_cat(track):
    """Which category sidebar a lesson of this track shows."""
    if track == "math":
        return "ai"
    return MIGRATE[track]["category"]


def _esc(s):
    return (s or "").replace('"', "&quot;")


def lesson_row(url, idx, te, tt, active):
    cls = "sb-lesson" + (" active" if active else "")
    return (f'              <a href="{url}" class="{cls}">'
            f'<span class="num">{idx:02d}</span>'
            f'<span class="lbl" data-en="{_esc(te)}" data-tr="{_esc(tt or te)}">{te}</span></a>')


def track_block(tid, cur_track):
    e = MIGRATE.get(tid)
    if not e:
        return ""
    base = "/tutorials/" + dest_path(tid, e)
    is_cur = (tid == cur_track)
    rows = "\n".join(
        lesson_row(f"{base}/{l['slug']}", i, l.get("en", l["slug"]), l.get("tr", ""),
                   is_cur and l["slug"] == CUR["slug"])
        for i, l in enumerate(e["lessons"], 1)
    )
    name_en = e.get("name_en", tid)
    name_tr = e.get("name_tr", name_en)
    open_cls = " open" if is_cur else ""
    cur_cls = " current" if is_cur else ""
    return (f'          <div class="sb-track{open_cls}{cur_cls}">\n'
            f'            <a href="{base}/" class="sb-track-label" data-en="{_esc(name_en)}" data-tr="{_esc(name_tr)}">{name_en}</a>\n'
            f'            <div class="sb-track-items">\n{rows}\n            </div>\n'
            f'          </div>')


CUR = {"slug": None}   # set per page before building


def build_scoped_sidebar(cur_track):
    cat = home_cat(cur_track)
    groups = TAXONOMY[cat]
    e = MIGRATE[cur_track]
    name_en = e.get("name_en", cur_track)
    name_tr = e.get("name_tr", name_en)
    # current-lesson card
    cur_lesson_html = ""
    for i, l in enumerate(e["lessons"], 1):
        if l["slug"] == CUR["slug"]:
            cur_lesson_html = (
                f'      <div class="sb-current-lesson"><span class="num">L{i:02d}</span>'
                f'<span class="ttl" data-en="{_esc(l.get("en",""))}" data-tr="{_esc(l.get("tr",""))}">{l.get("en","")}</span></div>\n')
            break
    sections = []
    for label_en, label_tr, emoji, tracks in groups:
        is_open = cur_track in tracks
        blocks = "\n".join(track_block(t, cur_track) for t in tracks if t in MIGRATE)
        sections.append(
            f'    <div class="sb-section{" open" if is_open else ""}">\n'
            f'      <div class="sb-section-label"><span class="sb-icon" aria-hidden="true">{emoji}</span>'
            f'<span class="sb-label-text" data-en="{label_en}" data-tr="{label_tr}">{label_en}</span></div>\n'
            f'      <div class="sb-section-items">\n{blocks}\n      </div>\n'
            f'    </div>')
    cat_label = {"ai": ("AI & ML", "Yapay Zeka & ML"), "math": ("Mathematics", "Matematik"),
                 "programming": ("Programming", "Programlama"), "security": ("Security", "Güvenlik"),
                 "tools": ("Tools", "Araçlar")}.get(cat, (cat, cat))
    return f'''  <aside class="sidebar sb-v3" id="sidebar">
{SIDEBAR_STYLE}
    <a href="/tutorials/" class="sb-back" data-en="← All Tutorials" data-tr="← Tüm Eğitimler">← All Tutorials</a>

    <div class="sb-current">
      <div class="sb-current-eyebrow" data-en="{cat_label[0]}" data-tr="{cat_label[1]}">{cat_label[0]}</div>
      <div class="sb-current-title" data-en="{_esc(name_en)}" data-tr="{_esc(name_tr)}">{name_en}</div>
      <div class="sb-current-sub" data-en="{len(e['lessons'])} Lessons" data-tr="{len(e['lessons'])} Ders">{len(e['lessons'])} Lessons</div>
{cur_lesson_html}    </div>

{chr(10).join(sections)}
  </aside>'''


SIDEBAR_RE = re.compile(r'\s*<aside class="sidebar[^"]*"[^>]*>.*?</aside>', re.DOTALL)


def clone_track(track, entry, redirects):
    src_dir = TUT / track
    dpath = dest_path(track, entry)
    dest_dir = TUT / dpath
    if not src_dir.is_dir():
        print(f"  ! MISSING source dir {src_dir.relative_to(ROOT)}")
        return 0, 0
    dest_dir.mkdir(parents=True, exist_ok=True)
    same = dest_dir.resolve() == src_dir.resolve()

    copied = 0
    if not same:
        for f in sorted(src_dir.iterdir()):
            if not (f.is_file() and f.suffix.lower() in ASSET_EXTS):
                continue
            if f.suffix.lower() == ".js":
                # lesson JS (L#.js) embeds HTML fragments with numbered lesson links
                (dest_dir / f.name).write_text(
                    rewrite(f.read_text(encoding="utf-8")), encoding="utf-8")
            else:
                shutil.copy2(f, dest_dir / f.name)
            copied += 1

    made = 0
    for les in entry["lessons"]:
        n, slug = les["n"], les["slug"]
        src = src_dir / f"{n}.html"
        if not src.exists():
            print(f"  ! MISSING {src.relative_to(ROOT)}")
            continue
        html = rewrite(src.read_text(encoding="utf-8"))
        CUR["slug"] = slug
        sidebar = build_scoped_sidebar(track)
        if SIDEBAR_RE.search(html):
            html = SIDEBAR_RE.sub(lambda _: "\n" + sidebar, html, count=1)
        (dest_dir / f"{slug}.html").write_text(html, encoding="utf-8")
        redirects.append((f"/tutorials/{track}/{n}", f"/tutorials/{dpath}/{slug}"))
        made += 1
    redirects.append((f"/tutorials/{track}", f"/tutorials/{dpath}/"))
    print(f"  {track:14s} -> {dpath:22s} {made:3d} lessons, {copied:3d} assets")
    return made, copied


def main():
    redirects = []
    tl = ta = 0
    for track in sorted(MIGRATE):
        m, a = clone_track(track, MIGRATE[track], redirects)
        tl += m
        ta += a
    lines = [f"location = {old} {{ return 301 {new}; }}" for old, new in redirects]
    (CAT / "redirects.nginx.conf").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nDONE: {tl} lessons, {ta} assets, {len(MIGRATE)} tracks, "
          f"{len(redirects)} redirects -> _catalog/redirects.nginx.conf")


if __name__ == "__main__":
    main()
