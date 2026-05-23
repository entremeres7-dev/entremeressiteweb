# 🔧 GUIDE DE CORRECTION DES TOKENS PUSH

## 🚨 **PROBLÈME IDENTIFIÉ :**
Les tokens push sont supprimés automatiquement lors de la déconnexion, empêchant la réception de notifications.

## 🎯 **SOLUTION :**
Modifier les politiques RLS de la table `push_tokens` pour empêcher la suppression automatique.

## 📝 **ÉTAPES DE CORRECTION :**

### **Option 1 : Via Supabase Dashboard (Recommandé)**

1. **Ouvrir Supabase Dashboard**
2. **Aller dans SQL Editor**
3. **Exécuter cette requête :**

```sql
-- Correction des politiques RLS pour push_tokens
-- Empêcher la suppression automatique des tokens lors de la déconnexion

-- 1. Supprimer la politique de suppression qui cause le problème
DROP POLICY IF EXISTS "Users can delete own push tokens" ON push_tokens;

-- 2. Créer une nouvelle politique qui empêche TOUTE suppression automatique
CREATE POLICY "No automatic token deletion" ON push_tokens
FOR DELETE
TO public
USING (false); -- Empêcher TOUTE suppression automatique

-- 3. Vérifier les politiques finales
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'push_tokens'
ORDER BY policyname;
```

### **Option 2 : Via Script JavaScript**

1. **Installer les dépendances :**
```bash
npm install @supabase/supabase-js dotenv
```

2. **Configurer les variables d'environnement :**
```bash
EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service
```

3. **Exécuter le script :**
```bash
node scripts/fix-push-tokens.js
```

## ✅ **RÉSULTAT ATTENDU :**

Après la correction :
- ✅ Les tokens push **RESTENT** dans la base après déconnexion
- ✅ Les utilisateurs **RECOIVENT** des notifications même déconnectés
- ✅ **Aucune perte** de notifications importantes

## 🧪 **TEST DE VALIDATION :**

1. **Connectez-vous en tant qu'Entremeres**
2. **Vérifiez que le token est créé**
3. **Déconnectez-vous**
4. **Connectez-vous en tant que manel**
5. **Envoyez un message à Entremeres**
6. **Entremeres devrait recevoir la notification !** 🎉

## 🔍 **VÉRIFICATION :**

Après la correction, vérifiez que :
- La politique `"Users can delete own push tokens"` a été supprimée
- La nouvelle politique `"No automatic token deletion"` a été créée
- Les tokens restent dans la base après déconnexion

## 💡 **AVANTAGES :**

- **Notifications en temps réel** même si l'utilisateur est déconnecté
- **Pas de perte de messages** importants
- **Expérience utilisateur optimale** pour toutes les mamans
- **Système de notifications robuste** et fiable

---

**🎯 Objectif : Permettre aux mamans de recevoir des notifications même quand elles sont déconnectées !**
