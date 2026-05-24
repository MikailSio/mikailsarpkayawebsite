src = open('tutorials/linalg/L5.js', encoding='utf-8').read()
in_string = False
escape_next = False
last_quote_pos = -1
BS = chr(92)  # backslash
for i, c in enumerate(src):
    if escape_next:
        escape_next = False
        continue
    if c == BS:
        escape_next = True
        continue
    if c == "'":
        if not in_string:
            in_string = True
            last_quote_pos = i
        else:
            in_string = False
print(f'Final state: in_string={in_string}, last_open_pos={last_quote_pos}')
if in_string:
    line_no = src[:last_quote_pos].count('\n') + 1
    print(f'Last unmatched quote at line {line_no}')
    print(repr(src[last_quote_pos:last_quote_pos+300]))
