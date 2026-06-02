"""gen_hubs.py — category hub landing pages at /tutorials/<cat>/index.html.

Each hub reuses a native lesson's chrome (nav + per-track theme + category-scoped
sidebar) and swaps <main> for a grid of track cards (grouped like the sidebar),
each linking to that track's first lesson. Imports gen_tutorials_v4 for shared data.
"""
import re
from pathlib import Path
import gen_tutorials_v4 as G

# cat -> (name_en, name_tr, tagline, native-template-track for theme)
CAT_META = {
    "ai":          ("AI & Machine Learning", "Yapay Zeka & ML",
                    "From math foundations to production LLM agents — the full ML-engineer path.", "ml-theory"),
    "math":        ("Mathematics", "Matematik",
                    "The mathematical backbone of machine learning.", "linalg"),
    "programming": ("Programming", "Programlama",
                    "Languages and core software-engineering skills.", "python"),
    "security":    ("Security & Safety", "Güvenlik & Etik",
                    "AI safety, ML security, privacy, and cybersecurity.", "crypto"),
    "tools":       ("Tools", "Araçlar",
                    "LaTeX, GPU programming, and developer tooling.", "latex"),
}

# relative .css/.js refs (style.css, core.js, L1.js...) -> absolute (template-track dir)
ASSET_REF_RE = re.compile(r'(href|src)="(?!https?:|//|/|#)([^"]+\.(?:css|js)(?:\?[^"]*)?)"')
MAIN_RE = re.compile(r'<main\b[^>]*>.*?</main>', re.DOTALL)
NAV_RE = re.compile(r'<div class="lesson-nav">.*?</div>\s*', re.DOTALL)
TITLE_RE = re.compile(r'<title>.*?</title>', re.DOTALL)


def card(tid):
    e = G.MIGRATE[tid]
    dpath = G.dest_path(tid, e)
    first = e["lessons"][0]["slug"]
    cnt = len(e["lessons"])
    name = e.get("name_en", tid)
    return (f'<a href="/tutorials/{dpath}/{first}" '
            'style="display:flex;flex-direction:column;gap:.3rem;padding:1.05rem 1.2rem;'
            'border:1px solid rgba(200,169,110,.18);border-radius:10px;text-decoration:none;'
            'color:inherit;background:rgba(255,255,255,.015)">'
            f'<span style="font-weight:600;font-size:1rem">{name}</span>'
            f'<span style="opacity:.5;font-size:.76rem">{cnt} lessons &rarr;</span></a>')


def hub_main(cat):
    name_en, _, tagline, _ = CAT_META[cat]
    tot_t = tot_l = 0
    blocks = []
    for label_en, _label_tr, emoji, tracks in G.TAXONOMY[cat]:
        cards = []
        for tid in tracks:
            if tid in G.MIGRATE:
                cards.append(card(tid))
                tot_t += 1
                tot_l += len(G.MIGRATE[tid]["lessons"])
        if not cards:
            continue
        blocks.append(
            '<div style="margin-bottom:2.5rem">'
            '<div style="font-family:var(--mono,monospace);font-size:.68rem;letter-spacing:.18em;'
            f'text-transform:uppercase;opacity:.5;margin-bottom:1rem">{emoji} {label_en}</div>'
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:.8rem">'
            f'{"".join(cards)}</div></div>')
    return (
        '<main id="main" class="main" style="padding:2.5rem 1.5rem 6rem">'
        '<div style="max-width:1100px;margin:0 auto">'
        '<div style="font-family:var(--mono,monospace);color:var(--accent,#c8a96e);'
        f'letter-spacing:.2em;text-transform:uppercase;font-size:.66rem;margin-bottom:1.1rem">{tot_t} tracks &middot; {tot_l} lessons</div>'
        f'<h1 style="font-size:clamp(2.4rem,6vw,4rem);line-height:1.05;margin:0 0 1rem">{name_en}</h1>'
        f'<p style="opacity:.62;max-width:640px;line-height:1.7;margin:0 0 3rem">{tagline}</p>'
        f'{"".join(blocks)}</div></main>')


def build_hub(cat):
    name_en = CAT_META[cat][0]
    tmpl = CAT_META[cat][3]
    e = G.MIGRATE[tmpl]
    dpath = G.dest_path(tmpl, e)
    first = e["lessons"][0]["slug"]
    html = (G.TUT / dpath / f"{first}.html").read_text(encoding="utf-8")
    # the hub lives one level up from the template lesson — make its asset refs absolute
    html = ASSET_REF_RE.sub(lambda m: f'{m.group(1)}="/tutorials/{dpath}/{m.group(2)}"', html)
    # category-scoped sidebar, no active lesson
    G.CUR["slug"] = None
    html = G.SIDEBAR_RE.sub(lambda _: "\n" + G.build_scoped_sidebar(tmpl), html, count=1)
    html = MAIN_RE.sub(lambda _: hub_main(cat), html, count=1)
    html = NAV_RE.sub("", html)
    html = TITLE_RE.sub(f"<title>{name_en} — Mikail Sarpkaya Tutorials</title>", html, count=1)
    html = html.replace(f"/tutorials/{dpath}/{first}", f"/tutorials/{cat}/")
    out = G.TUT / cat / "index.html"
    out.write_text(html, encoding="utf-8")
    print(f"  /tutorials/{cat}/  (template: {tmpl})")


if __name__ == "__main__":
    for c in CAT_META:
        build_hub(c)
    print("hubs done")
