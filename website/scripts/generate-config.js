const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', '.env');
const outPath = path.join(__dirname, '..', 'js', 'supabase-config.js');

if (!fs.existsSync(envPath)) {
  console.error('Fichier .env introuvable à la racine EntreMeresExpo/.env');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const url = (content.match(/^EXPO_PUBLIC_SUPABASE_URL=(.+)$/m) || [])[1]?.trim();
const key = (content.match(/^EXPO_PUBLIC_SUPABASE_ANON_KEY=(.+)$/m) || [])[1]?.trim();

if (!url || !key) {
  console.error('EXPO_PUBLIC_SUPABASE_URL ou EXPO_PUBLIC_SUPABASE_ANON_KEY manquant dans .env');
  process.exit(1);
}

fs.writeFileSync(
  outPath,
  `window.SUPABASE_URL = ${JSON.stringify(url)};\nwindow.SUPABASE_ANON_KEY = ${JSON.stringify(key)};\n`,
);
console.log('supabase-config.js généré');
