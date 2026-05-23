# 🧪 Guide de Test des Notifications EntreMeres

## 📋 Prérequis

1. **App installée** sur un appareil physique (pas d'émulateur)
2. **Compte utilisateur** connecté dans l'app
3. **Notifications activées** dans les paramètres de l'appareil
4. **Connexion internet** stable

## 🚀 Test Rapide

### Option 1: Script automatique
```bash
# Dans le dossier EntreMeresExpo
node test-notifications.js
```

### Option 2: Test manuel via la console
```javascript
// Dans la console de votre app ou via un script
import { testProductionNotifications } from './services/test-push';

// Lancer les tests
await testProductionNotifications();
```

## 📱 Ce que vous devez voir

### ✅ Notifications attendues
1. **Message** : "Nouveau message de Sophie 💌"
2. **Like** : "Emma a liké votre post ❤️"
3. **Commentaire** : "Julie a commenté votre post 💬"
4. **Demande d'ami** : "Camille souhaite devenir votre amie 👋"
5. **Nouvelle story** : "Léa a partagé une nouvelle story 📱"

### 🎯 Vérifications visuelles
- **Icône** : Doit être l'icône EntreMeres
- **Titre** : Doit afficher "EntreMeres"
- **Message** : Doit contenir le texte et les emojis
- **Son** : Doit faire du bruit (vérifiez que le volume est activé)

## 🔧 Dépannage

### ❌ Aucune notification reçue

1. **Vérifiez les permissions** :
   - Paramètres → EntreMeres → Notifications → Activées
   - Paramètres → Notifications → EntreMeres → Activées

2. **Vérifiez l'enregistrement** :
   ```javascript
   // Dans la console de votre app
   import { registerPushDevice } from './services/push';
   
   // Réenregistrer l'appareil
   await registerPushDevice('VOTRE_USER_ID', 'prod');
   ```

3. **Vérifiez la base de données** :
   ```sql
   -- Vérifier que votre appareil est enregistré
   SELECT * FROM push_devices 
   WHERE user_id = 'VOTRE_USER_ID' 
   AND env = 'prod';
   ```

### ⚠️ Notifications reçues mais sans icône

1. **Vérifiez la configuration Expo** :
   - `app.json` doit avoir la bonne configuration
   - `eas.json` doit pointer vers le bon projet

2. **Vérifiez l'icône** :
   - `assets/adaptive-icon.png` doit exister
   - `assets/icon.png` doit exister

### 🔇 Notifications silencieuses

1. **Vérifiez le son** :
   - Volume de l'appareil activé
   - Mode silencieux désactivé
   - Son des notifications activé dans l'app

## 🎯 Test personnalisé

Pour tester une notification spécifique :

```javascript
import { testCustomNotification } from './services/test-push';

await testCustomNotification(
  'VOTRE_USER_ID',
  'EntreMeres Test',
  'Message personnalisé de test 🧪'
);
```

## 📊 Vérification des logs

Les tests affichent des logs détaillés :
- ✅ Succès
- ❌ Erreurs
- ⚠️ Avertissements
- 📱 Informations sur les appareils

## 🚨 Problèmes courants

### "Aucun token push trouvé"
- L'appareil n'est pas enregistré
- L'utilisateur n'existe pas
- Problème de connexion à la base

### "Erreur envoi notification"
- Problème avec l'API Expo
- Token invalide
- Problème de réseau

### "Erreur connexion base"
- Problème de connexion Supabase
- Table `push_devices` manquante
- Permissions insuffisantes

## 🔄 Régénération des tokens

Si les notifications ne fonctionnent plus :

```javascript
import { unregisterPushDevice, registerPushDevice } from './services/push';

// Supprimer l'ancien enregistrement
await unregisterPushDevice('VOTRE_USER_ID', 'DEVICE_ID');

// Réenregistrer
await registerPushDevice('VOTRE_USER_ID', 'prod');
```

## 📞 Support

En cas de problème persistant :
1. Vérifiez les logs de la console
2. Vérifiez la base de données
3. Testez avec un autre appareil
4. Vérifiez la configuration Expo

---

**🎉 Bon test ! Vos notifications doivent maintenant fonctionner parfaitement en production !** 