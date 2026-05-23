# 🚀 Implémentation Notifications Push - EntreMeres

## 📋 Vue d'ensemble

Cette implémentation remplace complètement l'ancien système de notifications push par une solution propre et sécurisée utilisant Expo Push API.

## 🏗️ Architecture

### 1. **Table `push_devices`**
- Stockage des tokens par utilisateur et appareil
- Vérification stricte du `project_id` pour la production
- RLS (Row Level Security) activé
- Contraintes d'unicité et de validation

### 2. **Service Frontend (`services/push.ts`)**
- Enregistrement automatique du token au login
- Suppression automatique au logout
- Gestion des permissions et des erreurs
- Persistance du `device_id` en local

### 3. **Service Backend (`services/pushSender.ts`)**
- Envoi via l'API Expo Push
- Filtrage strict sur `env='prod'` et `project_id` correct
- Gestion des erreurs et du batch (max 100 par requête)
- Fonctions spécialisées pour chaque type de notification

## 🔧 Configuration

### Variables d'environnement
```bash
EXPO_PUBLIC_PROJECT_ID=9f24c677-ba0e-4c73-b4c3-a986201b2cec
```

### App Config
```json
{
  "extra": {
    "eas": {
      "projectId": "9f24c677-ba0e-4c73-b4c3-a986201b2cec"
    }
  }
}
```

## 📱 Utilisation

### Enregistrement automatique
Le token est automatiquement enregistré lors du login/inscription et supprimé lors du logout.

### Envoi de notifications
```typescript
import { notifyLike, notifyMessage } from './services/pushSender';

// Notification de like
await notifyLike(targetUserId, 'Marie', postId);

// Notification de message
await notifyMessage(targetUserId, 'Sophie', conversationId);
```

## 🧪 Tests

### Test de l'implémentation
```typescript
import { testPushImplementation } from './services/test-push';

// Lancer les tests
await testPushImplementation();
```

### Test de la base de données
```typescript
import { testDatabaseConnection } from './services/test-push';

// Tester la connexion
await testDatabaseConnection();
```

## 🔒 Sécurité

### Contraintes
- ✅ `project_id` vérifié pour la production
- ✅ RLS activé sur la table
- ✅ Filtrage strict sur `env='prod'`
- ✅ Suppression automatique au logout

### Validation
- ✅ Vérification des permissions
- ✅ Gestion des erreurs
- ✅ Logs détaillés
- ✅ Fallback en cas d'échec

## 📊 Monitoring

### Logs à surveiller
```
✅ Token Expo obtenu: [token]
✅ Token push enregistré
✅ Notifications push envoyées à X appareils
✅ Token push supprimé
```

### Erreurs courantes
```
❌ Erreur enregistrement token push: [détails]
❌ Erreur suppression token push: [détails]
❌ Erreur envoi notifications push: [détails]
```

## 🚨 Dépannage

### Problème : Token non enregistré
1. Vérifier les permissions de notification
2. Vérifier que l'appareil est physique (pas d'émulateur)
3. Vérifier la connexion internet
4. Vérifier les logs de l'app

### Problème : Notifications non reçues
1. Vérifier que `env='prod'` en base
2. Vérifier que `project_id` correspond au GUID EAS
3. Vérifier que l'app est fermée ou en arrière-plan
4. Tester avec l'API Expo directement

### Problème : Erreur de base de données
1. Vérifier que la table `push_devices` existe
2. Vérifier les politiques RLS
3. Vérifier les contraintes et triggers
4. Exécuter le script SQL de création

## 🔄 Mise à jour

### Ajouter un nouveau type de notification
1. Créer la fonction dans `pushSender.ts`
2. Utiliser `getProdTokensForUser()` et `sendExpoPush()`
3. Tester avec `testPushImplementation()`

### Modifier la configuration
1. Mettre à jour `PROD_PROJECT_ID` dans les services
2. Mettre à jour `app.json` si nécessaire
3. Rebuilder l'app
4. Tester l'enregistrement du token

## 📞 Support

En cas de problème :
1. Vérifier les logs de l'application
2. Vérifier la structure de la base de données
3. Tester avec les fonctions de test
4. Vérifier la configuration Expo/EAS

---

**Note** : Cette implémentation est conçue pour être robuste et sécurisée. Elle n'utilise que des tokens de production et vérifie strictement toutes les contraintes. 