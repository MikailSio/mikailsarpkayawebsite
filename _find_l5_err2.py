"""Diagnose linalg/L5 syntax error by trying to parse smaller chunks."""
import subprocess

src = open('tutorials/linalg/L5.js', encoding='utf-8').read()
lines = src.split('\n')

# Wrap the en string only (lines until closing of en)
# Find approximate end of en field
en_end_idx = None
for i, ln in enumerate(lines):
    if ln.strip().startswith('tr:'):
        en_end_idx = i
        break
print(f'en field appears to end before line {en_end_idx}')

# Try parsing just the en assignment as a standalone
def try_chunk(chunk_text):
    test = "var x = " + chunk_text + ";"
    open('_tmp.js','w',encoding='utf-8').write(test)
    r = subprocess.run(['node','-e',"try{new Function(require('fs').readFileSync('_tmp.js','utf8'));console.log('OK')}catch(e){console.log('ERR:', e.message.slice(0,80))}"], capture_output=True, text=True)
    return r.stdout.strip()

# Get just the en value (everything between en: and ,)
# Cheap heuristic
import re
m = re.search(r"en:\s*('.*?')\s*,\s*\n\s*tr:", src, re.DOTALL)
if m:
    en_value = m.group(1)
    print(f'en field length: {len(en_value)}')
    # Test parse it
    print('Testing en alone...')
    result = try_chunk(en_value)
    print(f'  Result: {result}')

# Also try tr
m2 = re.search(r"tr:\s*('.*?')\s*\n?\};", src, re.DOTALL)
if m2:
    tr_value = m2.group(1)
    print(f'tr field length: {len(tr_value)}')
    print('Testing tr alone...')
    result = try_chunk(tr_value)
    print(f'  Result: {result}')
