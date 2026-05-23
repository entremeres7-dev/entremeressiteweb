# 🧪 Comment Tester vos Notifications EntreMeres

## 🚀 Test Ultra-Simple (Recommandé)

```bash
# Dans le dossier EntreMeresExpo
node test.js
```

**Ce script va :**
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
- L'app doit être installée sur un appareil physique (pas d'émulateur)
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

- **`test.js`** - Test ultra-simple (recommandé pour débuter)
- **`test-maintenant.js`** - Test immédiat
- **`test-rapide.js`** - Test rapide
- **`test-tous-types.js`** - Test de tous les types de notifications
- **`test-final.js`** - Test final combiné

## 🎯 Ordre de test recommandé

1. **Commencez par** : `node test.js`
2. **Si ça marche** : `node test-tous-types.js`
3. **Pour valider tout** : `node test-final.js`

## 🚨 Problèmes courants

- **"Aucun utilisateur trouvé"** → Vérifiez votre base de données
- **"Aucun appareil enregistré"** → Installez l'app et connectez-vous
- **"Erreur envoi"** → Vérifiez votre connexion internet

## 🎉 Test réussi !

Si vous recevez la notification avec :
- ✅ L'icône EntreMeres
- ✅ Le titre "EntreMeres"
- ✅ Le message de test
- ✅ Le son de notification

**Alors vos notifications fonctionnent parfaitement en production !** 🚀

---

**💡 Conseil** : Commencez toujours par `node test.js` - c'est le plus simple ! 