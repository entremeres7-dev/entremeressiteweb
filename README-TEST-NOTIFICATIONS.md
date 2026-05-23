# 🧪 Test des Notifications EntreMeres

## 🚀 Test Rapide (Recommandé)

```bash
# Dans le dossier EntreMeresExpo
node test-notif.js
```

Ce script va :
1. Trouver un utilisateur dans votre base
2. Vérifier qu'un appareil est enregistré
3. Envoyer une notification de test
4. Vous dire si ça a marché

## 📱 Ce que vous devez voir

Après avoir exécuté le test, vous devriez recevoir sur votre appareil :

- **Icône** : L'icône EntreMeres
- **Titre** : "EntreMeres"
- **Message** : "Test notification - Ça fonctionne ! 🎉"
- **Son** : Un bruit de notification

## 🔧 Si ça ne marche pas

### 1. Vérifiez que l'app est installée et connectée
- L'app doit être installée sur un appareil physique
- Vous devez être connecté avec un compte utilisateur

### 2. Vérifiez les permissions
- Paramètres → EntreMeres → Notifications → Activées
- Paramètres → Notifications → EntreMeres → Activées

### 3. Vérifiez la base de données
```sql
-- Vérifier que votre appareil est enregistré
SELECT * FROM push_devices WHERE env = 'prod';
```

## 📋 Tests disponibles

- **`test-notif.js`** - Test ultra-simple (recommandé)
- **`test-notifications-simple.js`** - Test détaillé
- **`test-notifications.js`** - Test complet avec tous les types

## 🎯 Test personnalisé

Pour tester une notification spécifique :

```javascript
// Dans la console de votre app
import { testCustomNotification } from './services/test-push';

await testCustomNotification(
  'VOTRE_USER_ID',
  'EntreMeres Test',
  'Message personnalisé 🧪'
);
```

## 🚨 Problèmes courants

- **"Aucun utilisateur trouvé"** → Vérifiez votre base de données
- **"Aucun appareil enregistré"** → Installez l'app et connectez-vous
- **"Erreur envoi"** → Vérifiez votre connexion internet

---

**💡 Conseil** : Commencez par `node test-notif.js` - c'est le plus simple ! 