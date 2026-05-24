const fs = require('fs');
const src = fs.readFileSync('tutorials/linalg/L5.js', 'utf8');
fs.writeFileSync('_wrapped.js', src);
try { require('./_wrapped.js'); console.log('OK'); }
catch(e) { console.log('err:', e.message); console.log('snippet:', e.stack.split('\n')[1]); }
