"""Double-escape backslashes in KaTeX expressions inside template literals.
Only touches content inside $...$ and $$...$$ delimiters, not JS code.
"""
import re
import sys
from pathlib import Path

def fix(path):
    src = Path(path).read_text(encoding='utf-8')
    # Find all $$...$$ blocks
    def fix_block(m):
        content = m.group(0)
        # Double every single \ that's not already \\
        # Use regex: \ not preceded by \ and not followed by \
        fixed = re.sub(r'(?<!\\)\\(?!\\)', r'\\\\', content)
        return fixed
    # Block math $$...$$
    new = re.sub(r'\$\$[\s\S]*?\$\$', fix_block, src)
    # Inline math $...$ (careful: skip if it looks like dollar amount)
    new = re.sub(r'\$[^$\n]+?\$', fix_block, new)
    Path(path).write_text(new, encoding='utf-8')
    return src != new

if __name__ == '__main__':
    for fp in sys.argv[1:]:
        changed = fix(fp)
        print(f"{fp}: {'updated' if changed else 'unchanged'}")
