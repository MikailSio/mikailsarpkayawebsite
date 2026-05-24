import subprocess
import re
src = open('tutorials/linalg/L5.js', encoding='utf-8').read()
# Try binary search for which line breaks parsing
lines = src.split('\n')
# Build trimmed versions
left, right = 1, len(lines)
# Add wrapper-tolerant test
def try_parse(text):
    open('_tmp.js', 'w', encoding='utf-8').write(text)
    r = subprocess.run(['node','-e',"try{new Function(require('fs').readFileSync('_tmp.js','utf8'));console.log('OK')}catch(e){console.log('ERR',e.message)}"], capture_output=True, text=True)
    return 'OK' in r.stdout, r.stdout.strip()

# Find where error starts
n = len(lines)
# Try first half
half = n // 2
ok, msg = try_parse('\n'.join(lines[:half]))
print(f"First half (1-{half}): {'OK' if ok else 'ERR'} {msg[:100]}")
ok, msg = try_parse('\n'.join(lines[:half]) + '\n`}; }')
print(f"First half wrapped: {'OK' if ok else 'ERR'} {msg[:100]}")

# Look for unmatched backticks or stray special chars
bt_count = src.count('`')
print(f"Backtick count: {bt_count}")
# Find all unescaped $ followed by { (problematic in template)
dollar_brace = [(m.start(), src[max(0,m.start()-20):m.start()+30]) for m in re.finditer(r'(?<!\\)\$\{', src)]
print(f"${'{'} matches: {len(dollar_brace)}")
for pos, ctx in dollar_brace[:5]:
    print(f"  pos {pos}: {ctx!r}")
