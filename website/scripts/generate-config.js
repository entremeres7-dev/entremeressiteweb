const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', '.env');
const outPath = path.join(__dirname, '..', 'js', 'supabase-config.js');

function readFromEnvFile() {
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, 'utf8');
  return {
    url: (content.match(/^EXPO_PUBLIC_SUPABASE_URL=(.+)$/m) || [])[1]?.trim(),
    key: (content.match(/^EXPO_PUBLIC_SUPABASE_ANON_KEY=(.+)$/m) || [])[1]?.trim(),
  };
}

const fromFile = readFromEnvFile();
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || fromFile?.url;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || fromFile?.key;

if (!url || !key) {
  console.error(
    'Variables manquantes : EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY\n' +
      '(fichier .env local ou variables Vercel)',
  );
  process.exit(1);
}

fs.writeFileSync(
  outPath,
  `window.SUPABASE_URL = ${JSON.stringify(url)};\nwindow.SUPABASE_ANON_KEY = ${JSON.stringify(key)};\n`,
);
console.log('supabase-config.js généré');
