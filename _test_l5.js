// Just try loading the file as a real script
try {
  global.window = {};
  require('./tutorials/linalg/L5.js');
  console.log('OK, fields:', Object.keys(global.LINALG_L5 || global.window.LINALG_L5 || {}));
} catch(e) {
  // Get exact location
  console.log('err:', e.message);
  // node's stack shows file:line
  const stackLines = e.stack.split('\n');
  for (const l of stackLines.slice(0, 8)) console.log(' ', l);
}
