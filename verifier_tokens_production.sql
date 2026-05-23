-- Vérification des tokens push pour la production
-- Exécutez cette requête dans Supabase SQL Editor

-- 1. Compter le nombre total de tokens actifs
SELECT 
    COUNT(*) as total_tokens_actifs,
    COUNT(DISTINCT user_id) as utilisateurs_avec_tokens
FROM push_devices 
WHERE is_active = true;

-- 2. Voir les détails des tokens actifs
SELECT 
    pd.user_id,
    p.username,
    p.email,
    pd.token,
    pd.os,
    pd.last_seen,
    pd.created_at,
    CASE 
        WHEN pd.is_active = true THEN '✅ ACTIF'
        ELSE '❌ INACTIF'
    END as statut
FROM push_devices pd
LEFT JOIN profiles p ON pd.user_id = p.id
WHERE pd.is_active = true
ORDER BY pd.last_seen DESC;

-- 3. Vérifier les utilisateurs connectés récemment (dernières 24h)
SELECT 
    pd.user_id,
    p.username,
    p.email,
    pd.last_seen,
    CASE 
        WHEN pd.last_seen > NOW() - INTERVAL '24 hours' THEN '🟢 Connecté récemment'
        WHEN pd.last_seen > NOW() - INTERVAL '7 days' THEN '🟡 Connecté cette semaine'
        ELSE '🔴 Connecté il y a longtemps'
    END as activite
FROM push_devices pd
LEFT JOIN profiles p ON pd.user_id = p.id
WHERE pd.is_active = true
ORDER BY pd.last_seen DESC;
