// polyfills.js
// Polyfills pour les dépendances manquantes

// Polyfill pour whatwg-fetch
if (typeof global !== 'undefined' && !global.fetch) {
  global.fetch = require('whatwg-fetch');
}

// Polyfill pour buffer
if (typeof global !== 'undefined' && !global.Buffer) {
  global.Buffer = require('buffer').Buffer;
}

// Polyfill pour process
if (typeof global !== 'undefined' && !global.process) {
  global.process = require('process/browser');
}
