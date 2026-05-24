"""Fix L3.js Plotly setTimeout scripts that mistakenly use ` + ` template-literal concat."""
import re
from pathlib import Path

p = Path(r"E:\web\mikailsarpkaya.com\tutorials\fourier\L3.js")
src = p.read_text(encoding='utf-8')

# Strategy: find each <script>setTimeout(function(){`...`...`,250);</script>
# Within the function body, remove the spurious `` ` `` and `+ \`` patterns

# Match each <script>...</script> and clean it
def clean_script(m):
    body = m.group(1)
    if not body.strip().startswith('setTimeout(function(){`'):
        return m.group(0)  # don't touch
    # Inside: replace `\n+ ` with just `\n` and remove the opening/closing backticks
    # Be careful: setTimeout(function(){`\n+ `var th=[];...`\n+ `},250);
    cleaned = body
    # Remove "`\n+ `" patterns (template literal concat)
    cleaned = re.sub(r'`\s*\n\s*\+\s*`', '\n', cleaned)
    # Remove the initial backtick right after function(){
    cleaned = re.sub(r'setTimeout\(function\(\)\{`\s*\n?', 'setTimeout(function(){\n', cleaned)
    # Remove a trailing backtick that's right before `,250);` or just before `}`
    cleaned = re.sub(r'`\s*,\s*250\s*\)\s*;\s*$', ',250);', cleaned.rstrip())
    # Also handle if there's a `\n },250); pattern
    cleaned = re.sub(r'`\s*\n?\s*\}\s*,\s*250\s*\)', '\n},250)', cleaned)
    return '<script>' + cleaned + '</script>'

new_src = re.sub(r'<script>(.*?)</script>', clean_script, src, flags=re.DOTALL)

# Save and validate
p.write_text(new_src, encoding='utf-8')

# Validate outer
import subprocess
r = subprocess.run(['node', '-e', "try{new Function(require('fs').readFileSync('tutorials/fourier/L3.js','utf8'));console.log('OUTER OK')}catch(e){console.log('OUTER ERR:',e.message)}"], capture_output=True, text=True)
print(r.stdout)

# Validate each inner script
inner_scripts = re.findall(r'<script>(.*?)</script>', new_src, re.DOTALL)
err_count = 0
for i, scr in enumerate(inner_scripts):
    open('_tmp.js', 'w', encoding='utf-8').write(scr)
    r = subprocess.run(['node', '-e', "try{new Function(require('fs').readFileSync('_tmp.js','utf8'))}catch(e){console.log('ERR', e.message)}"], capture_output=True, text=True)
    if 'ERR' in r.stdout:
        err_count += 1
        print(f"  script #{i+1}: {r.stdout.strip()[:100]}")
print(f"Inner scripts: {len(inner_scripts) - err_count}/{len(inner_scripts)} OK")
