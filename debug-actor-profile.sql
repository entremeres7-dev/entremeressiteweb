-- Debug pour vérifier le profil de l'utilisateur qui a envoyé la demande
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier le profil de l'utilisateur qui a envoyé la demande (actorId)
SELECT 
    id,
    username,
    email,
    created_at,
    updated_at
FROM profiles 
WHERE id = '3b0852c2-9306-42ed-a3b0-421b25b7353b';

-- 2. Vérifier le profil de l'utilisateur qui a reçu la demande (targetUserId)
SELECT 
    id,
    username,
    email,
    created_at,
    updated_at
FROM profiles 
WHERE id = 'c57577f2-81ad-42bd-b925-00728abd66a1';

-- 3. Vérifier tous les profils créés récemment
SELECT 
    id,
    username,
    email,
    created_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 10;
