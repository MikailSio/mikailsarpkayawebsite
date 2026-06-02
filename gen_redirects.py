"""gen_redirects.py — emit the nginx 301 map for the slug migration.

Imports gen_tutorials_v4 (no cloning happens on import) to reuse MIGRATE + dest_path.
Maps, for every migrated track:
  /tutorials/<oldfolder>/<n>      -> /tutorials/<cat>/<sub>/<slug>     (each old lesson)
  /tutorials/<oldfolder>          -> /tutorials/<cat>/<sub>/<first>    (old course index)
  /tutorials/<cat>/<sub>/         -> /tutorials/<cat>/<sub>/<first>    (new course index -> first lesson)
Writes _catalog/redirects.nginx.conf (location = exact-match blocks).
"""
from pathlib import Path
import gen_tutorials_v4 as G

redirects = []
for track, entry in sorted(G.MIGRATE.items()):
    dpath = G.dest_path(track, entry)
    lessons = entry["lessons"]
    first = lessons[0]["slug"]
    for les in lessons:
        redirects.append((f"/tutorials/{track}/{les['n']}", f"/tutorials/{dpath}/{les['slug']}"))
    redirects.append((f"/tutorials/{track}", f"/tutorials/{dpath}/{first}"))      # old course index
    redirects.append((f"/tutorials/{dpath}/", f"/tutorials/{dpath}/{first}"))     # new course index -> 1st

lines = [f"location = {old} {{ return 301 {new}; }}" for old, new in redirects]
out = G.CAT / "redirects.nginx.conf"
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"{len(redirects)} redirects -> {out.relative_to(G.ROOT)}")
