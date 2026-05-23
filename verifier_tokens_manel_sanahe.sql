-- Vérifier les tokens de Manel et Sanahe
-- Exécutez cette requête dans Supabase SQL Editor

-- 1. Vérifier les tokens avec les noms d'utilisateur
SELECT 
    pd.user_id,
    p.username,
    p.email,
    pd.token,
    pd.device_id,
    pd.os,
    pd.is_active,
    pd.last_seen,
    pd.created_at
FROM push_devices pd
LEFT JOIN profiles p ON pd.user_id = p.id
WHERE pd.user_id IN (
    '6b3206d7-c247-45c9-99dd-5894c9e1ec14',  -- Manel
    'ce47fcad-e7ef-43df-b756-76f98fc78152'   -- Sanahe
)
ORDER BY pd.created_at DESC;

-- 2. Compter le nombre de tokens par utilisateur
SELECT 
    p.username,
    COUNT(pd.token) as nombre_tokens,
    pd.is_active
FROM push_devices pd
LEFT JOIN profiles p ON pd.user_id = p.id
WHERE pd.user_id IN (
    '6b3206d7-c247-45c9-99dd-5894c9e1ec14',  -- Manel
    'ce47fcad-e7ef-43df-b756-76f98fc78152'   -- Sanahe
)
GROUP BY p.username, pd.is_active;

-- 3. Vérifier si les deux utilisateurs ont des tokens actifs
SELECT 
    CASE 
        WHEN COUNT(CASE WHEN pd.user_id = '6b3206d7-c247-45c9-99dd-5894c9e1ec14' THEN 1 END) > 0 
        THEN 'Manel a un token'
        ELSE 'Manel na pas de token'
    END as manel_status,
    CASE 
        WHEN COUNT(CASE WHEN pd.user_id = 'ce47fcad-e7ef-43df-b756-76f98fc78152' THEN 1 END) > 0 
        THEN 'Sanahe a un token'
        ELSE 'Sanahe na pas de token'
    END as sanahe_status
FROM push_devices pd
WHERE pd.user_id IN (
    '6b3206d7-c247-45c9-99dd-5894c9e1ec14',  -- Manel
    'ce47fcad-e7ef-43df-b756-76f98fc78152'   -- Sanahe
)
AND pd.is_active = true;
