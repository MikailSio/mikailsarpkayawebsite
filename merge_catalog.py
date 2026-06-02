"""merge_catalog.py — merge _catalog/*.json into one master slug map + validate.

Collects every track entry from the per-group catalog JSONs the agents wrote,
checks slug health (no empties, unique within a track), reports per-track and
per-category totals, and writes _catalog/_master.json (the generator's input).
Safe to re-run as more catalog files land.
"""
import json
import collections
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CAT = ROOT / "_catalog"


def main():
    files = sorted(f for f in CAT.glob("*.json") if f.name != "_master.json")
    master = {}
    issues = []

    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:
            issues.append(f"{f.name}: JSON parse error: {e}")
            continue
        for track, entry in data.items():
            if track in master:
                issues.append(f"DUPLICATE track '{track}' (also in {f.name})")
            master[track] = entry
            lessons = entry.get("lessons", [])
            slugs = [l.get("slug", "") for l in lessons]
            empties = [l.get("n") for l in lessons if not l.get("slug")]
            if empties:
                issues.append(f"{track}: empty slug at lessons {empties}")
            dups = [s for s, c in collections.Counter(slugs).items() if s and c > 1]
            if dups:
                issues.append(f"{track}: duplicate slugs {dups}")

    total_tracks = len(master)
    total_lessons = sum(len(e.get("lessons", [])) for e in master.values())
    (CAT / "_master.json").write_text(
        json.dumps(master, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Files merged : {len(files)}  ->  {[f.name for f in files]}")
    print(f"Tracks       : {total_tracks}")
    print(f"Lessons      : {total_lessons}")
    by_cat = collections.Counter(e.get("category", "?") for e in master.values())
    print(f"By category  : {dict(by_cat)}")
    print("\nPer-track:")
    for t in sorted(master):
        e = master[t]
        print(f"  {t:14s} cat={e.get('category','?'):10s} sub={e.get('subfield','?'):12s} {len(e.get('lessons',[])):3d} lessons")
    if issues:
        print(f"\n!! {len(issues)} ISSUE(S):")
        for i in issues:
            print("   -", i)
    else:
        print("\nNo slug issues. OK")


if __name__ == "__main__":
    main()
