-- Debug pour vérifier pourquoi le nom d'utilisateur n'apparaît pas
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier si l'utilisateur a un profil
SELECT 
    id,
    username,
    email,
    created_at
FROM profiles 
WHERE id = 'c57577f2-81ad-42bd-b925-00728abd66a1';

-- 2. Vérifier tous les profils récents
SELECT 
    id,
    username,
    email,
    created_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 10;

-- 3. Vérifier s'il y a des profils avec username vide
SELECT 
    id,
    username,
    email,
    CASE 
        WHEN username IS NULL THEN 'NULL'
        WHEN username = '' THEN 'VIDE'
        ELSE 'OK'
    END as username_status
FROM profiles 
WHERE username IS NULL OR username = ''
ORDER BY created_at DESC;

-- 4. Compter les profils par statut username
SELECT 
    CASE 
        WHEN username IS NULL THEN 'NULL'
        WHEN username = '' THEN 'VIDE'
        ELSE 'OK'
    END as username_status,
    COUNT(*) as count
FROM profiles 
GROUP BY 
    CASE 
        WHEN username IS NULL THEN 'NULL'
        WHEN username = '' THEN 'VIDE'
        ELSE 'OK'
    END;
