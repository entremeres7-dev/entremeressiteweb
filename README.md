# 🧪 Tests de Notifications EntreMeres

## 🚀 Test Ultra-Simple (Recommandé)

```bash
# Dans le dossier EntreMeresExpo
node test.js
```

## 📋 Tous les Tests Disponibles

### 1. **Test Ultra-Simple** 🧪
```bash
node test.js
```
- ✅ Test ultra-simple
- ✅ Une notification de test
- ✅ Vérification immédiate

### 2. **Test Immédiat** ⚡
```bash
node test-maintenant.js
```
- ✅ Test ultra-rapide
- ✅ Une notification de test
- ✅ Vérification immédiate

### 3. **Test Rapide** 🚀
```bash
node test-rapide.js
```
- ✅ Test simple et rapide
- ✅ Une notification de test
- ✅ Vérification immédiate

### 4. **Test Tous Types** 🧪
```bash
node test-tous-types.js
```
- ✅ Test de tous les types de notifications
- ✅ 5 notifications différentes
- ✅ Vérification complète du système

### 5. **Test Final** 🏆
```bash
node test-final.js
```
- ✅ Test final combiné
- ✅ Validation complète
- ✅ Recommandé pour validation finale

## 🎯 Ordre de Test Recommandé

1. **Commencez par** : `node test.js` (le plus simple)
2. **Si ça marche** : `node test-tous-types.js` (test complet)
3. **Pour valider tout** : `node test-final.js` (validation finale)

## 📱 Ce que vous devez voir

### ✅ Notifications attendues
1. **Test simple** : "Test notification - Ça fonctionne ! 🎉"
2. **Message** : "Sophie vous a envoyé un message 💌"
3. **Like** : "Emma a liké votre post ❤️"
4. **Commentaire** : "Julie a commenté votre post 💬"
5. **Demande d'ami** : "Camille souhaite devenir votre amie 👋"
6. **Nouvelle story** : "Léa a partagé une nouvelle story 📱"

### 🎯 Vérifications visuelles
- **Icône** : Doit être l'icône EntreMeres
- **Titre** : Doit afficher "EntreMeres"
- **Message** : Doit contenir le texte et les emojis
- **Son** : Doit faire du bruit

## 🔧 Prérequis

- ✅ App installée sur appareil physique (pas d'émulateur)
- ✅ Compte utilisateur connecté dans l'app
- ✅ Notifications activées dans les paramètres
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

## 🎉 Résumé Final

**Pour tester immédiatement** : `node test.js`
**Pour tester rapidement** : `node test-rapide.js`
**Pour tester tout** : `node test-tous-types.js`
**Pour valider tout** : `node test-final.js`

---

## 🚀 Prêt à Tester ?

**1. Ouvrez votre terminal**
**2. Allez dans le dossier EntreMeresExpo**
**3. Exécutez : `node test.js`**
**4. Vérifiez votre appareil pour la notification**

**Vos notifications doivent maintenant fonctionner parfaitement en production !** 🎉

---

**💡 Conseil** : Commencez toujours par `node test.js` - c'est le plus simple et le plus rapide !
