/**
 * Génère website/js/profile-setup-data.js depuis les constantes TypeScript de l'app.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const deptsPath = path.join(root, 'constants', 'frenchDepartments.ts');
const outPath = path.join(__dirname, '..', 'js', 'profile-setup-data.js');

function extractStringArray(filePath, exportName) {
  const src = fs.readFileSync(filePath, 'utf8');
  const re = new RegExp(`export const ${exportName}[^=]*=\\s*\\[([\\s\\S]*?)\\];`);
  const match = src.match(re);
  if (!match) throw new Error(`${exportName} introuvable dans ${filePath}`);
  const items = [];
  const itemRe = /'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = itemRe.exec(match[1]))) {
    items.push(m[1].replace(/\\'/g, "'"));
  }
  return items;
}

const frenchDepartments = extractStringArray(deptsPath, 'FRENCH_DEPARTMENTS');

const regionsByCountry = {
  France: frenchDepartments,
  Algérie: [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Sétif', 'Béjaïa',
    'Tizi Ouzou', 'Tlemcen', 'Mostaganem', 'Biskra', 'Boumerdès', 'Tipaza', 'Médéa',
  ],
  Belgique: [
    'Bruxelles', 'Anvers', 'Liège', 'Gand', 'Charleroi', 'Brabant wallon', 'Namur',
    'Luxembourg (BE)', 'Flandre-Occidentale',
  ],
  Suisse: ['Genève', 'Vaud', 'Valais', 'Fribourg', 'Neuchâtel', 'Berne', 'Zurich', 'Bâle', 'Ticino'],
  Canada: ['Québec', 'Ontario', 'Colombie-Britannique', 'Alberta', 'Nouveau-Brunswick', 'Manitoba'],
  Luxembourg: ['Luxembourg', 'Diekirch', 'Grevenmacher'],
  Maroc: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda'],
  Tunisie: ['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Bizerte', 'Gabès', 'Kairouan'],
  Autre: [
    'Europe (hors liste)', 'Afrique (hors liste)', 'Amérique du Nord', 'Amérique du Sud', 'Asie', 'Océanie',
  ],
};

const payload = {
  PROFILE_COUNTRIES: [
    'France', 'Algérie', 'Belgique', 'Suisse', 'Canada', 'Luxembourg', 'Maroc', 'Tunisie', 'Autre',
  ],
  REGIONS_BY_COUNTRY: regionsByCountry,
  CHILDREN_OPTIONS: ['1', '2', '3', '4+'],
  MIN_MOM_AGE: 16,
  MAX_MOM_AGE: 70,
};

const js = `/* Généré par website/scripts/generate-profile-setup-data.js — ne pas éditer à la main */
(function (global) {
  'use strict';
  global.EntreMeresProfileSetupData = ${JSON.stringify(payload, null, 2)};
})(window);
`;

fs.writeFileSync(outPath, js);
console.log('profile-setup-data.js généré');
