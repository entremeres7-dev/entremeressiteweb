-- Correction simple des politiques RLS pour le bucket 'posts'
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer les anciennes politiques restrictives
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to posts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can view posts bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update posts bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete posts bucket files" ON storage.objects;

-- 2. Créer les nouvelles politiques pour le bucket 'posts'
-- Politique pour permettre l'upload (authentifié)
CREATE POLICY "Authenticated users can upload to posts bucket" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'posts' 
    AND auth.role() = 'authenticated'
);

-- Politique pour permettre la lecture publique
CREATE POLICY "Public can view posts bucket files" ON storage.objects
FOR SELECT USING (bucket_id = 'posts');

-- Politique pour permettre la mise à jour (pour les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can update posts bucket files" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'posts' 
    AND auth.role() = 'authenticated'
);

-- Politique pour permettre la suppression (pour les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can delete posts bucket files" ON storage.objects
FOR DELETE USING (
    bucket_id = 'posts' 
    AND auth.role() = 'authenticated'
);

-- 3. Vérifier que les politiques ont été créées
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%posts%';
