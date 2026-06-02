"""update_nav.py — point the tutorials homepage nav bar at the new category hubs."""
import re
from pathlib import Path

p = Path(__file__).resolve().parent / "tutorials" / "index.html"
html = p.read_text(encoding="utf-8")

new_navcats = '''<div class="nav-cats">
      <a class="nav-cat-btn" href="/tutorials/ai/"><span data-en="AI / ML" data-tr="Yapay Zeka / ML">AI / ML</span></a>
      <a class="nav-cat-btn" href="/tutorials/math/"><span data-en="Mathematics" data-tr="Matematik">Mathematics</span></a>
      <a class="nav-cat-btn" href="/tutorials/programming/"><span data-en="Programming" data-tr="Programlama">Programming</span></a>
      <a class="nav-cat-btn" href="/tutorials/security/"><span data-en="Security" data-tr="Güvenlik">Security</span></a>
      <a class="nav-cat-btn" href="/tutorials/tools/"><span data-en="Tools" data-tr="Araçlar">Tools</span></a>
      <a class="nav-cat-btn" href="/tutorials/ales/dogal-sayilar"><span data-en="ALES (TR)" data-tr="ALES (TR)">ALES (TR)</span></a>
    </div>'''

# replace the whole <div class="nav-cats"> ... </div></div> block (anchored on nav-controls)
pat = re.compile(r'<div class="nav-cats">.*?</div>\s*</div>(\s*<div class="nav-controls">)', re.DOTALL)
html2, n = pat.subn(new_navcats + "\n  </div>\\1", html)
print("nav-cats blocks replaced:", n)
if n:
    p.write_text(html2, encoding="utf-8")
    print("written")
