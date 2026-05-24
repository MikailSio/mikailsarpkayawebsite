"""For each fourier lesson, simulate what happens when the lesson HTML is injected.
We extract the inner <script>...</script> blocks and check each one for syntax errors.
"""
import re
import subprocess
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

for n in range(1, 9):
    src = open(f'tutorials/fourier/L{n}.js', encoding='utf-8').read()
    # The outer file is `window.FOURIER_LN = { en: \`...\`, tr: \`...\` };`
    # We need to simulate what each template literal evaluates to.
    # Since the outer parses OK, we can use Node to actually evaluate it.

    # Test script: load the file, get the .en and .tr content, find all <script>...</script>, validate each
    test = f"""
const fs = require('fs');
const code = fs.readFileSync('tutorials/fourier/L{n}.js', 'utf8');
// Evaluate to get the object
const win = {{}};
const f = new Function('window', code);
f(win);
const mod = win.FOURIER_L{n};
for (const lang of ['en', 'tr']) {{
  const html = mod[lang];
  const scripts = [];
  let m;
  const re = /<script>([\\s\\S]*?)<\\/script>/g;
  while ((m = re.exec(html)) !== null) {{ scripts.push(m[1]); }}
  for (let i = 0; i < scripts.length; i++) {{
    try {{
      new Function(scripts[i]);
    }} catch(e) {{
      console.log(`L{n}/${{lang}}/script-${{i}}: ${{e.message}}`);
      console.log(`  preview: ${{JSON.stringify(scripts[i].slice(0, 200))}}`);
    }}
  }}
}}
"""
    open('_tmp.js', 'w', encoding='utf-8').write(test)
    r = subprocess.run(['node', '_tmp.js'], capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.stdout.strip():
        print(r.stdout)
    if r.stderr.strip():
        print(f"L{n} STDERR:", r.stderr[:200])
