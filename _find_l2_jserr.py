"""Find the script in L2.js that has Invalid or unexpected token."""
import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

# Read the L2 file
t = open('tutorials/fourier/L2.js', encoding='utf-8').read()

# Find each <script>...</script> block that would be re-executed by loader.js
# In the template literal, scripts are HTML-encoded but they're real <script> tags
# The pattern: <script>...</script>
scripts = re.findall(r'<script>(.*?)</script>', t, re.DOTALL)
print(f"Found {len(scripts)} <script> blocks")

import subprocess
for i, scr in enumerate(scripts):
    # Try to parse it
    test_src = scr
    try:
        # The script content might contain unescaped \\ that needs unwrapping for testing
        # But since the OUTER template literal escapes them, the rendered HTML will have just \
        # For our test we use the source as-is
        with open('_tmp_scr.js', 'w', encoding='utf-8') as f:
            f.write(test_src)
        r = subprocess.run(['node', '-e', "try{new Function(require('fs').readFileSync('_tmp_scr.js','utf8'))}catch(e){console.log('ERR',e.message)}"], capture_output=True, text=True)
        if 'ERR' in r.stdout:
            print(f"\n--- BROKEN SCRIPT #{i+1} ---")
            print(f"  msg: {r.stdout.strip()}")
            print(f"  preview: {scr[:200]!r}")
            # Show last 200 chars too
            print(f"  end: {scr[-200:]!r}")
    except Exception as e:
        print(f"  script {i}: error testing: {e}")
