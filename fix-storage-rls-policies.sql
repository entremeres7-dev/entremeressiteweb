-- Correction des politiques RLS pour le bucket 'posts'
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier les politiques existantes du bucket 'posts'
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;

-- 3. Créer les nouvelles politiques pour le bucket 'posts'
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

-- 4. Vérifier que les politiques ont été créées
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%posts%';

-- 5. Vérifier que le bucket 'posts' existe et est public
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'posts';

-- 6. Si le bucket n'existe pas, le créer
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'posts', 
    'posts', 
    true, 
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
