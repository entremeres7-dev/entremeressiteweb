const QRCode = require('qrcode');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fonction pour obtenir l'adresse IP locale avec méthode alternative
function getLocalIPWithCommand() {
  try {
    // Sur macOS, utiliser la commande route
    if (process.platform === 'darwin') {
      const result = execSync('route get default 2>/dev/null | grep interface | awk \'{print $2}\' | head -1', { encoding: 'utf-8' }).trim();
      if (result) {
        const ipResult = execSync(`ifconfig ${result} 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk \'{print $2}\' | head -1`, { encoding: 'utf-8' }).trim();
        if (ipResult) {
          return ipResult;
        }
      }
    }
    // Sur Linux
    if (process.platform === 'linux') {
      const ipResult = execSync("ip route get 8.8.8.8 2>/dev/null | awk '{print $7}' | head -1", { encoding: 'utf-8' }).trim();
      if (ipResult && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipResult)) {
        return ipResult;
      }
    }
  } catch (error) {
    // Ignorer les erreurs de commande
  }
  return null;
}

// Fonction pour obtenir l'adresse IP locale
function getLocalIP() {
  // Vérifier si une IP est fournie en argument
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const providedIP = args[0];
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(providedIP)) {
      return providedIP;
    } else {
      console.warn('⚠️  Format d\'IP invalide, tentative de détection automatique...\n');
    }
  }
  
  // Essayer d'abord avec os.networkInterfaces()
  try {
    const interfaces = os.networkInterfaces();
    if (interfaces) {
      for (const name of Object.keys(interfaces)) {
        // Ignorer les interfaces loopback et certaines interfaces système
        if (name.startsWith('lo') || name.startsWith('docker') || name.startsWith('veth')) {
          continue;
        }
        
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address;
          }
        }
      }
    }
  } catch (error) {
    // Si os.networkInterfaces() échoue, essayer avec une commande système
    console.warn('⚠️  Détection automatique via os.networkInterfaces() échouée, tentative alternative...\n');
  }
  
  // Essayer avec une commande système
  const ipFromCommand = getLocalIPWithCommand();
  if (ipFromCommand) {
    return ipFromCommand;
  }
  
  // Si tout échoue, utiliser localhost et afficher des instructions
  console.warn('⚠️  Impossible de détecter automatiquement votre IP locale.');
  console.log('💡 Pour utiliser votre IP locale, exécutez:');
  console.log('   node generate-qr.js <VOTRE_IP>');
  console.log('   Exemple: node generate-qr.js 192.168.1.100\n');
  console.log('📋 Pour trouver votre IP locale:');
  if (process.platform === 'darwin') {
    console.log('   ifconfig | grep "inet " | grep -v 127.0.0.1');
  } else {
    console.log('   ip addr show | grep "inet " | grep -v 127.0.0.1');
  }
  console.log('');
  
  return 'localhost';
}

// Générer l'URL Expo
const localIP = getLocalIP();
const expoURL = `exp://${localIP}:8081`;

console.log('\n🔗 URL Expo:', expoURL);
console.log('\n📱 Scannez le QR code ci-dessous avec Expo Go:\n');

// Générer le QR code dans le terminal
QRCode.toString(expoURL, { type: 'terminal', small: true }, (err, qr) => {
  if (err) {
    console.error('Erreur lors de la génération du QR code:', err);
    return;
  }
  console.log(qr);
  console.log('\n💡 Si le QR code ne fonctionne pas, essayez cette URL dans Expo Go:');
  console.log('   ' + expoURL);
  console.log('\n📄 Un fichier HTML avec le QR code a été créé: qr-code.html\n');
});

// Générer aussi un fichier HTML avec le QR code
QRCode.toDataURL(expoURL, { width: 300, margin: 2 }, (err, url) => {
  if (err) {
    console.error('Erreur:', err);
    return;
  }
  
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code - EntreMeres</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #ff6a88 0%, #ff8e8e 100%);
            color: white;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            color: #333;
        }
        h1 {
            margin-top: 0;
            color: #ff6a88;
        }
        .qr-code {
            margin: 20px 0;
        }
        .url {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            word-break: break-all;
            font-family: monospace;
            font-size: 14px;
        }
        .instructions {
            margin-top: 20px;
            text-align: left;
            color: #666;
        }
        .instructions ol {
            padding-left: 20px;
        }
        .instructions li {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 EntreMeres - QR Code</h1>
        <div class="qr-code">
            <img src="${url}" alt="QR Code Expo" />
        </div>
        <div class="url">
            <strong>URL:</strong><br>
            ${expoURL}
        </div>
        <div class="instructions">
            <h3>Instructions:</h3>
            <ol>
                <li>Ouvrez l'application <strong>Expo Go</strong> sur votre iPhone</li>
                <li>Scannez le QR code ci-dessus</li>
                <li>Ou entrez manuellement l'URL dans Expo Go</li>
            </ol>
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(__dirname, 'qr-code.html'), html);
});


