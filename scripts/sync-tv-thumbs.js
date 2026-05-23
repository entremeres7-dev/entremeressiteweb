/**
 * Copie les affiches du site (website/assets/thumbs) vers l'app (assets/images/tv).
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'website', 'assets', 'thumbs');
const DEST = path.join(__dirname, '..', 'assets', 'images', 'tv');

const FILES = [
  'couple-apres-bebe.png',
  'couple-apres-bebe-temoignages.png',
  'recette-bebe.png',
  'mama-chef.png',
  'sos-maman.png',
  'allaitement-sans-filtre.png',
  '24h-dans-la-vie.png',
  'histoires-du-soir.png',
  'comptines-entremeres.png',
  'idees-de-jeux.png',
];

if (!fs.existsSync(SRC)) {
  console.error('Dossier source introuvable:', SRC);
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });

for (const file of FILES) {
  const from = path.join(SRC, file);
  const to = path.join(DEST, file);
  if (!fs.existsSync(from)) {
    console.warn('Manquant:', file);
    continue;
  }
  fs.copyFileSync(from, to);
  console.log('OK ', file);
}

console.log(`\n${FILES.length} affiches synchronisées.`);
