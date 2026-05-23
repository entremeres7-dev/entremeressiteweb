-- Debug pour l'utilisateur spécifique qui pose problème
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier le profil de l'utilisateur spécifique
SELECT 
    id,
    username,
    email,
    created_at,
    updated_at
FROM profiles 
WHERE id = 'c57577f2-81ad-42bd-b925-00728abd66a1';

-- 2. Vérifier s'il y a des demandes d'amitié récentes pour cet utilisateur
SELECT 
    id,
    user_id,
    friend_id,
    status,
    created_at
FROM friends 
WHERE user_id = 'c57577f2-81ad-42bd-b925-00728abd66a1'
   OR friend_id = 'c57577f2-81ad-42bd-b925-00728abd66a1'
ORDER BY created_at DESC
LIMIT 5;

-- 3. Vérifier les notifications récentes pour cet utilisateur
SELECT 
    id,
    user_id,
    type,
    title,
    body,
    created_at
FROM notifications 
WHERE user_id = 'c57577f2-81ad-42bd-b925-00728abd66a1'
ORDER BY created_at DESC
LIMIT 5;
