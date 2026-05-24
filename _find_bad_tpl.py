"""Locate the broken template literal in netsec/L4.js by isolating each top-level template."""
import re
src = open('tutorials/netsec/L4.js', encoding='utf-8').read()

# Find all `...` template-literal spans (handle escaped backticks)
positions = []
i = 0
start = None
while i < len(src):
    c = src[i]
    if c == '\\':
        i += 2
        continue
    if c == '`':
        if start is None:
            start = i
        else:
            positions.append((start, i+1))
            start = None
    i += 1

print(f"Found {len(positions)} template literals")
# Try each individually
import subprocess
for s, e in positions:
    chunk = src[s:e]
    line_start = src[:s].count('\n') + 1
    # try parse just this template
    test = f"var x = {chunk};"
    open('_tmp_test.js', 'w', encoding='utf-8').write(test)
    r = subprocess.run(['node', '-e', "try{new Function(require('fs').readFileSync('_tmp_test.js','utf8'))}catch(e){console.log('ERR',e.message)}"], capture_output=True, text=True)
    if 'ERR' in r.stdout:
        print(f"BROKEN template @ line {line_start}: {r.stdout.strip()}")
        # show first 200 chars and search for unescaped ${
        print(f"  preview: {chunk[:200]!r}")
        # find all ${...} (might be unclosed)
        for m in re.finditer(r'\$\{', chunk):
            ctx = chunk[max(0,m.start()-20):m.start()+60]
            print(f"  ${'{'} at offset {m.start()}: {ctx!r}")
