# 🧪 GUIDE DE TEST DE LA CORRECTION DES TOKENS PUSH

## 🎯 **OBJECTIF :**
Vérifier que les tokens push sont maintenant correctement enregistrés et conservés après déconnexion.

## ✅ **CORRECTIONS APPLIQUÉES :**

### **1. Politiques RLS corrigées :**
- ✅ Suppression automatique des tokens empêchée
- ✅ Tokens conservés même après déconnexion

### **2. Code côté app corrigé :**
- ✅ Utilisation d'`UPSERT` au lieu d'`INSERT/UPDATE`
- ✅ Gestion automatique des conflits sur `user_id`
- ✅ Fonction `refreshToken()` ajoutée

## 🧪 **ÉTAPES DE TEST :**

### **ÉTAPE 1 : Test de connexion d'Entremeres**

1. **Connectez-vous en tant qu'Entremeres**
2. **Vérifiez dans la console :**
```
LOG  🔐 Utilisateur connecté, initialisation des notifications...
LOG  🚀 Initialisation notifications pour utilisateur: 7d53323b-fbe4-4e0a-b925-5ffacfd413cd
LOG  ✅ Token Expo obtenu: ExponentPushToken[...]
LOG  ✅ Token Expo enregistré/mis à jour pour l'utilisateur: 7d53323b-fbe4-4e0a-b925-5ffacfd413cd
```

### **ÉTAPE 2 : Test de déconnexion d'Entremeres**

1. **Déconnectez-vous d'Entremeres**
2. **Vérifiez dans la console :**
```
LOG  🚪 Déconnexion en cours...
LOG  🔐 Changement d'état d'authentification: SIGNED_OUT
LOG  ✅ Déconnexion réussie
```

### **ÉTAPE 3 : Test de connexion de manel**

1. **Connectez-vous en tant que manel**
2. **Vérifiez dans la console :**
```
LOG  🔐 Utilisateur connecté, initialisation des notifications...
LOG  🚀 Initialisation notifications pour utilisateur: 6b3206d7-c247-45c9-99dd-5894c9e1ec14
LOG  ✅ Token Expo obtenu: ExponentPushToken[...]
LOG  ✅ Token Expo enregistré/mis à jour pour l'utilisateur: 6b3206d7-c247-45c9-99dd-5894c9e1ec14
```

### **ÉTAPE 4 : Test d'envoi de message**

1. **Depuis manel, envoyez un message à Entremeres**
2. **Vérifiez dans la console :**
```
LOG  ✅ Notification créée: manel vous a envoyé un message
LOG  🔍 sendPushNotification - Recherche token pour utilisateur: 7d53323b-fbe4-4e0a-b925-5ffacfd413cd
LOG  ✅ Tokens trouvés: 1 pour utilisateur: 7d53323b-fbe4-4e0a-b925-5ffacfd413cd
LOG  📤 Envoi de 1 notifications via Expo API
LOG  ✅ Notification push envoyée à: 7d53323b-fbe4-4e0a-b925-5ffacfd413cd
```

## 🔍 **POINTS DE VÉRIFICATION :**

### **✅ SUCCÈS :**
- Entremeres reçoit la notification push ! 🎉
- Le token est conservé après déconnexion
- Les notifications fonctionnent même si l'utilisateur est déconnecté

### **❌ ÉCHEC :**
- Aucun token trouvé pour Entremeres
- Erreur lors de l'envoi de la notification
- Token supprimé après déconnexion

## 🚀 **COMMANDES DE TEST :**

### **Test de rafraîchissement de token :**
```typescript
// Dans la console de l'app
await PushNotificationService.refreshToken();
```

### **Vérification des tokens en base :**
```sql
-- Dans Supabase SQL Editor
SELECT user_id, token, created_at, updated_at 
FROM push_tokens 
ORDER BY created_at DESC;
```

## 💡 **RÉSULTAT ATTENDU :**

Après la correction :
- ✅ **Entremeres** se connecte → Token créé
- ✅ **Entremeres** se déconnecte → Token **RESTE** dans la base
- ✅ **manel** envoie un message → **Entremeres reçoit la notification !** 🎉

## 🔧 **EN CAS DE PROBLÈME :**

### **1. Vérifiez les politiques RLS :**
```sql
SELECT * FROM pg_policies WHERE tablename = 'push_tokens';
```

### **2. Vérifiez la table push_tokens :**
```sql
SELECT * FROM push_tokens ORDER BY created_at DESC;
```

### **3. Vérifiez les logs de l'app :**
- Regardez la console pour identifier où ça bloque
- Vérifiez que `saveExpoToken` est bien appelé

---

**🎯 Objectif final : Permettre aux mamans de recevoir des notifications même quand elles sont déconnectées !**
