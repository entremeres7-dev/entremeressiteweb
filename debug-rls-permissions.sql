-- Debug pour vérifier les permissions RLS sur la table profiles
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier les politiques RLS sur la table profiles
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles' 
AND schemaname = 'public';

-- 2. Vérifier si la table profiles a RLS activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles' 
AND schemaname = 'public';

-- 3. Tester une requête simple sur profiles
SELECT 
    id,
    username,
    email
FROM profiles 
WHERE id = '3b0852c2-9306-42ed-a3b0-421b25b7353b'
LIMIT 1;
