# Guide : Corriger les politiques RLS Supabase

## Problème
L'erreur `"new row violates row-level security policy for table \"profiles\""` indique que les politiques RLS empêchent la création/mise à jour de profils.

## Solution : Configurer les politiques RLS correctement

### Étape 1 : Ouvrir le SQL Editor dans Supabase

1. Connectez-vous à votre dashboard Supabase : https://app.supabase.com
2. Sélectionnez votre projet
3. Cliquez sur **"SQL Editor"** dans le menu de gauche
4. Cliquez sur **"New query"**

### Étape 2 : Exécuter le script de correction

1. Ouvrez le fichier `database/fix_profiles_rls.sql` depuis votre projet
2. Copiez tout le contenu du fichier
3. Collez-le dans le SQL Editor de Supabase
4. Cliquez sur **"Run"** (ou appuyez sur `Ctrl+Enter`)

### Étape 3 : Vérifier les politiques

Après avoir exécuté le script, vous devriez voir un tableau avec les politiques créées. Vérifiez qu'il y a :
- ✅ `Users can insert own profile` (INSERT)
- ✅ `Authenticated users can read profiles` (SELECT)
- ✅ `Users can update own profile` (UPDATE)
- ✅ `Users can delete own profile` (DELETE)

### Étape 4 : Vérifier que RLS est activé

Si vous voulez vérifier manuellement :

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles' 
AND schemaname = 'public';
```

Le champ `rowsecurity` doit être `true`.

### Étape 5 : Si le script principal ne fonctionne pas

Si vous avez toujours l'erreur RLS après avoir exécuté `fix_profiles_rls.sql`, essayez le script alternatif :

1. Exécutez le fichier `database/fix_profiles_rls_alternative.sql` dans le SQL Editor
2. ⚠️ **Attention** : Ce script est plus permissif et moins sécurisé. Il permet à n'importe quel utilisateur authentifié d'insérer un profil. Assurez-vous que votre code vérifie toujours que l'utilisateur crée uniquement son propre profil.

### Étape 6 : Tester

1. Redémarrez votre app Expo
2. Essayez de créer un nouveau compte et compléter le quiz
3. L'erreur RLS ne devrait plus apparaître

## Si le problème persiste

### Vérifier les permissions de la table

```sql
-- Vérifier toutes les politiques sur profiles
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';
```

### Vérifier que la table existe avec la bonne structure

```sql
-- Voir la structure de la table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Vérifier les triggers

```sql
-- Voir les triggers sur la table profiles
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles';
```

## Notes importantes

1. **Synchronisation de session** : Parfois, juste après l'inscription, la session peut prendre quelques secondes à se synchroniser. C'est pourquoi le code fait des retries.

2. **Email vérifié** : Si vous avez désactivé la vérification d'email (OTP), assurez-vous que `email_confirmed_at` est bien défini lors de l'inscription, ou ajustez les politiques RLS pour ne pas l'exiger.

3. **Test avec un utilisateur** : Pour tester les politiques RLS, vous pouvez exécuter :

```sql
-- Remplacer 'USER_ID' par un ID d'utilisateur réel
SET request.jwt.claim.sub = 'USER_ID';
SELECT * FROM profiles WHERE id = 'USER_ID';
```

## Alternative : Désactiver temporairement RLS (NON RECOMMANDÉ EN PRODUCTION)

⚠️ **ATTENTION** : Ne faites cela QUE pour tester en développement !

```sql
-- Désactiver RLS (PAS EN PRODUCTION !)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

N'oubliez pas de le réactiver après les tests :
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```
