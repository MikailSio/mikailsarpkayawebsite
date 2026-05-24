try {
  const code = require('fs').readFileSync('tutorials/linalg/L5.js', 'utf8');
  // Try with NodeJS Vm
  const vm = require('vm');
  try {
    new vm.Script(code, { filename: 'L5.js' });
    console.log('vm.Script: OK');
  } catch(e) {
    console.log('vm.Script err:', e.message);
    console.log('stack:', e.stack.split('\n').slice(0, 3).join(' | '));
  }
} catch(e) { console.log('err:', e.message); }
