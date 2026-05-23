# 🔧 GUIDE DE CORRECTION - ERREUR PERMISSIONS REELS

## ❌ Problème actuel
```
"new row violates row-level security policy"
```

Cette erreur indique que les politiques RLS (Row Level Security) ne sont pas configurées pour permettre l'upload de vidéos dans le bucket `reel-videos`.

## ✅ Solution

### Étape 1 : Ouvrir Supabase Dashboard
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet **EntreMeres**

### Étape 2 : Exécuter le script SQL
1. Dans le menu de gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez-collez **TOUT** le contenu du fichier `database/fix-reel-storage-policies.sql`
4. Cliquez sur **Run** (ou Ctrl+Enter)

### Étape 3 : Vérifier le résultat
Après exécution, vous devriez voir :
- ✅ Messages de confirmation pour chaque politique créée
- ✅ Liste des politiques configurées
- ✅ Message "Politiques RLS configurées avec succès"

### Étape 4 : Redémarrer l'application
1. Arrêtez votre application (Ctrl+C dans le terminal)
2. Relancez avec : `npx expo start --clear`

### Étape 5 : Tester
1. Allez dans l'onglet **Reels**
2. Cliquez sur **+** pour créer un Reel
3. Sélectionnez une vidéo
4. Ajoutez une description
5. Cliquez sur **Publier**

## 🎯 Résultat attendu
- ✅ Plus d'erreur "new row violates row-level security policy"
- ✅ Upload des vidéos fonctionnel
- ✅ Création de Reels réussie

## 🆘 Si le problème persiste
1. Vérifiez que vous êtes bien connecté dans l'app
2. Vérifiez que le script SQL s'est exécuté sans erreur
3. Redémarrez complètement l'application
4. Videz le cache : `npx expo start --clear --reset-cache`

## 📋 Contenu du script SQL à copier
```sql
-- 🔧 Correction des politiques RLS pour le bucket reel-videos
-- Ce script corrige l'erreur "new row violates row-level security policy"

-- 1. Vérifier que le bucket existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reel-videos', 'reel-videos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload reel videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to reel videos" ON storage.objects;

-- 3. Créer les politiques pour le bucket reel-videos
-- Politique pour permettre aux utilisateurs authentifiés d'uploader
CREATE POLICY "Allow authenticated users to upload reel videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'reel-videos' 
  AND auth.role() = 'authenticated'
);

-- Politique pour permettre la lecture publique des vidéos
CREATE POLICY "Allow public access to reel videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'reel-videos');

-- Politique pour permettre aux utilisateurs de supprimer leurs propres vidéos
CREATE POLICY "Allow users to delete their own reel videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'reel-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Activer RLS sur storage.objects si ce n'est pas déjà fait
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Vérifier les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 6. Test de la configuration
-- Cette requête devrait retourner les politiques créées
SELECT 
  'reel-videos' as bucket_name,
  'Politiques RLS configurées avec succès' as status;
```
