# 🧪 Test des Notifications Push - EntreMeres

## 📱 Comment tester les notifications push

### 1. **Prérequis**
- Être connecté à l'application
- Avoir un appareil physique (pas d'émulateur)
- Avoir accordé les permissions de notification

### 2. **Test automatique**
- Le bouton de test est visible dans le header (seulement en mode développement)
- Cliquer sur "Tester Notifications" pour lancer les tests

### 3. **Test manuel des fonctionnalités**

#### **Test des likes**
1. Liker un post d'un autre utilisateur
2. Vérifier que la notification push est envoyée
3. Vérifier les logs dans la console

#### **Test des commentaires**
1. Commenter un post d'un autre utilisateur
2. Vérifier que la notification push est envoyée
3. Vérifier les logs dans la console

#### **Test des stories**
1. Publier une nouvelle story
2. Vérifier que les notifications push sont envoyées aux amies
3. Vérifier les logs dans la console

### 4. **Vérification des logs**

#### **Logs de succès**
```
✅ Token push enregistré
✅ Notification push de like envoyée
✅ Notification push de commentaire envoyée
✅ Notifications push story envoyées aux amies
```

#### **Logs d'erreur**
```
❌ Erreur enregistrement token push
❌ Erreur notification push de like
❌ Erreur notification push de commentaire
❌ Erreur notifications push story
```

### 5. **Dépannage**

#### **Problème : Pas de notifications**
1. Vérifier que l'appareil est physique
2. Vérifier les permissions de notification
3. Vérifier la connexion internet
4. Vérifier que l'utilisateur est connecté

#### **Problème : Erreurs de base de données**
1. Vérifier que la table `push_devices` existe
2. Vérifier les politiques RLS
3. Vérifier la configuration Supabase

### 6. **Configuration requise**

#### **Variables d'environnement**
```bash
EXPO_PUBLIC_PROJECT_ID=9f24c677-ba0e-4c73-b4c3-a986201b2cec
```

#### **App Config**
```json
{
  "extra": {
    "eas": {
      "projectId": "9f24c677-ba0e-4c73-b4c3-a986201b2cec"
    }
  }
}
```

### 7. **Structure de la base de données**

#### **Table `push_devices`**
- `user_id`: ID de l'utilisateur
- `device_id`: ID unique de l'appareil
- `token`: Token Expo Push
- `env`: Environnement (prod/dev/staging)
- `project_id`: ID du projet EAS

### 8. **Services implémentés**

#### **`push.ts`**
- `registerPushDevice()`: Enregistrement du token
- `unregisterPushDevice()`: Suppression du token

#### **`pushSender.ts`**
- `notifyLike()`: Notification de like
- `notifyComment()`: Notification de commentaire
- `notifyMessage()`: Notification de message
- `notifyFriendsAboutNewStory()`: Notification de story aux amies

### 9. **Intégration dans le code**

#### **Feed (`feed.tsx`)**
- Notifications automatiques lors des likes
- Notifications automatiques lors des commentaires
- Notifications automatiques lors de la publication de stories

#### **Authentification (`AuthContext.tsx`)**
- Enregistrement automatique du token au login
- Suppression automatique du token au logout

### 10. **Monitoring et logs**

#### **Console de développement**
- Tous les événements de notification sont loggés
- Utilisation du système de logging structuré
- Niveaux de log : info, success, error, warn

#### **Base de données**
- Table `push_devices` pour le suivi des tokens
- Logs des tentatives d'envoi
- Gestion des erreurs et retry

---

## 🎯 Résultat attendu

Après l'implémentation, vous devriez voir :
1. ✅ Un bouton de test dans le header (mode dev)
2. ✅ Des notifications push automatiques lors des interactions
3. ✅ Des logs détaillés dans la console
4. ✅ Une table `push_devices` fonctionnelle en base

## 🚀 Prochaines étapes

1. **Tester sur un appareil physique**
2. **Vérifier les permissions de notification**
3. **Tester avec plusieurs utilisateurs**
4. **Optimiser les performances si nécessaire** 