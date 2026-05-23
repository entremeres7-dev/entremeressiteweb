# 🧪 Résumé des Tests de Notifications EntreMeres

## 🚀 Tests Disponibles

### 1. **Test Ultra-Rapide** (Recommandé pour débuter)
```bash
node test-rapide.js
```
- ✅ Test simple et rapide
- ✅ Une seule notification de test
- ✅ Vérification immédiate

### 2. **Test Simple**
```bash
node test-notif.js
```
- ✅ Test basique
- ✅ Une notification de test
- ✅ Logs détaillés

### 3. **Test Complet - Tous Types**
```bash
node test-tous-types.js
```
- ✅ Test de tous les types de notifications
- ✅ 5 notifications différentes
- ✅ Vérification complète du système

### 4. **Test Détaillé**
```bash
node test-notifications-simple.js
```
- ✅ Test avec logs détaillés
- ✅ Vérification des appareils
- ✅ Diagnostic complet

### 5. **Test Complet avec Services**
```bash
node test-notifications.js
```
- ✅ Utilise vos services existants
- ✅ Test de l'architecture complète
- ✅ Intégration avec votre code

## 📱 Ce que vous devez voir

### ✅ Notifications attendues
1. **Message** : "Sophie vous a envoyé un message 💌"
2. **Like** : "Emma a liké votre post ❤️"
3. **Commentaire** : "Julie a commenté votre post 💬"
4. **Demande d'ami** : "Camille souhaite devenir votre amie 👋"
5. **Nouvelle story** : "Léa a partagé une nouvelle story 📱"

### 🎯 Vérifications visuelles
- **Icône** : Doit être l'icône EntreMeres
- **Titre** : Doit afficher "EntreMeres"
- **Message** : Doit contenir le texte et les emojis
- **Son** : Doit faire du bruit

## 🔧 Ordre de Test Recommandé

1. **Commencez par** : `node test-rapide.js`
2. **Si ça marche** : `node test-tous-types.js`
3. **Pour diagnostiquer** : `node test-notifications-simple.js`
4. **Pour tester l'architecture** : `node test-notifications.js`

## 📋 Prérequis

- ✅ App installée sur appareil physique
- ✅ Compte utilisateur connecté
- ✅ Notifications activées
- ✅ Connexion internet stable
- ✅ Base de données accessible

## 🚨 Dépannage Rapide

### ❌ "Aucun appareil enregistré"
```bash
# Vérifiez votre base
SELECT * FROM push_devices WHERE env = 'prod';
```

### ❌ "Aucun utilisateur trouvé"
```bash
# Vérifiez vos utilisateurs
SELECT * FROM profils LIMIT 5;
```

### ❌ "Erreur envoi"
- Vérifiez votre connexion internet
- Vérifiez que l'API Expo est accessible

## 🎯 Test Personnalisé

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

## 📊 Vérification des Résultats

### ✅ Succès
- Notifications reçues sur l'appareil
- Icône EntreMeres visible
- Titre "EntreMeres" affiché
- Messages avec emojis
- Son de notification

### ⚠️ Problèmes courants
- Notifications silencieuses → Vérifiez le volume
- Pas d'icône → Vérifiez la configuration Expo
- Pas de notification → Vérifiez les permissions

## 🔄 Régénération des Tokens

Si les notifications ne fonctionnent plus :

```javascript
// Dans votre app
import { unregisterPushDevice, registerPushDevice } from './services/push';

// Supprimer l'ancien enregistrement
await unregisterPushDevice('VOTRE_USER_ID', 'DEVICE_ID');

// Réenregistrer
await registerPushDevice('VOTRE_USER_ID', 'prod');
```

## 📞 Support et Dépannage

1. **Vérifiez les logs** de la console
2. **Vérifiez la base** de données
3. **Testez avec un autre appareil**
4. **Vérifiez la configuration Expo**

---

## 🎉 Résumé

**Pour tester rapidement** : `node test-rapide.js`
**Pour tester tout** : `node test-tous-types.js`
**Pour diagnostiquer** : `node test-notifications-simple.js`

**Vos notifications doivent maintenant fonctionner parfaitement en production !** 🚀 