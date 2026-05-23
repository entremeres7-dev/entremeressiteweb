/**
 * Duplique app/index.html pour chaque route Expo afin que
 * python -m http.server serve les pages sans repli SPA.
 */
const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'website', 'app');
const INDEX = path.join(APP_DIR, 'index.html');

const ROUTES = [
  'accueil',
  'ma-liste',
  'messages',
  'rencontrer',
  'profil',
  'sos-maman',
  'login',
  'signup',
  'parametres',
  'mes-mamans',
  'cgu',
  'charte',
  'aide-contact',
];

if (!fs.existsSync(INDEX)) {
  console.error('app/index.html introuvable — lancez npm run build:web');
  process.exit(1);
}

const html = fs.readFileSync(INDEX, 'utf8');

for (const route of ROUTES) {
  const dir = path.join(APP_DIR, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`OK  app/${route}/index.html`);
}

console.log(`\n${ROUTES.length} routes prêtes pour le serveur statique.`);
