-- 📊 REQUÊTES POUR ANALYSER LES INSCRIPTIONS UTILISATEURS
-- EntreMeres - Analyse de la base d'utilisateurs

-- 1. 📈 NOMBRE TOTAL D'UTILISATEURS INSCRITS
SELECT COUNT(*) as total_inscrits
FROM auth.users;

-- 2. 📋 LISTE COMPLÈTE DES UTILISATEURS AVEC USERNAME ET DATE D'INSCRIPTION
SELECT 
    u.id,
    u.email,
    p.username,
    u.created_at as date_inscription,
    u.last_sign_in_at as derniere_connexion,
    u.email_confirmed_at as email_confirme,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN 'Email confirmé'
        ELSE 'Email non confirmé'
    END as statut_email
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 3. 📊 STATISTIQUES PAR MOIS D'INSCRIPTION
SELECT 
    DATE_TRUNC('month', created_at) as mois_inscription,
    COUNT(*) as nombre_inscrits,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as emails_confirmes,
    COUNT(CASE WHEN last_sign_in_at IS NOT NULL THEN 1 END) as utilisateurs_actifs
FROM auth.users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mois_inscription DESC;

-- 4. 📈 CROISSANCE CUMULÉE DES INSCRIPTIONS
SELECT 
    DATE_TRUNC('month', created_at) as mois,
    COUNT(*) as nouveaux_inscrits,
    SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as total_cumule
FROM auth.users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mois;

-- 5. 🎯 UTILISATEURS LES PLUS RÉCENTS (30 derniers jours)
SELECT 
    u.id,
    u.email,
    p.username,
    u.created_at as date_inscription,
    u.last_sign_in_at as derniere_connexion,
    EXTRACT(EPOCH FROM (NOW() - u.created_at))/86400 as jours_depuis_inscription
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at >= NOW() - INTERVAL '30 days'
ORDER BY u.created_at DESC;

-- 6. 📊 RÉPARTITION PAR STATUT EMAIL
SELECT 
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Email confirmé'
        ELSE 'Email non confirmé'
    END as statut_email,
    COUNT(*) as nombre,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as pourcentage
FROM auth.users
GROUP BY 
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Email confirmé'
        ELSE 'Email non confirmé'
    END;

-- 7. 🔍 UTILISATEURS AVEC PROFILS COMPLETS
SELECT 
    u.id,
    u.email,
    p.username,
    p.full_name,
    p.created_at as profil_cree_le,
    u.created_at as compte_cree_le
FROM auth.users u
INNER JOIN public.profiles p ON u.id = p.id
WHERE p.username IS NOT NULL AND p.username != ''
ORDER BY u.created_at DESC;

-- 8. 📱 UTILISATEURS ACTIFS (connexions récentes)
SELECT 
    u.id,
    u.email,
    p.username,
    u.last_sign_in_at,
    EXTRACT(EPOCH FROM (NOW() - u.last_sign_in_at))/86400 as jours_depuis_derniere_connexion
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.last_sign_in_at >= NOW() - INTERVAL '30 days'
ORDER BY u.last_sign_in_at DESC;

-- 9. 🎯 STATISTIQUES GÉNÉRALES
SELECT 
    'Total utilisateurs' as metrique,
    COUNT(*) as valeur
FROM auth.users
UNION ALL
SELECT 
    'Emails confirmés',
    COUNT(*)
FROM auth.users
WHERE email_confirmed_at IS NOT NULL
UNION ALL
SELECT 
    'Emails non confirmés',
    COUNT(*)
FROM auth.users
WHERE email_confirmed_at IS NULL
UNION ALL
SELECT 
    'Utilisateurs avec profil',
    COUNT(*)
FROM auth.users u
INNER JOIN public.profiles p ON u.id = p.id
UNION ALL
SELECT 
    'Connexions récentes (30j)',
    COUNT(*)
FROM auth.users
WHERE last_sign_in_at >= NOW() - INTERVAL '30 days';

-- 10. 📊 ÉVOLUTION HEBDOMADAIRE
SELECT 
    DATE_TRUNC('week', created_at) as semaine,
    COUNT(*) as nouveaux_inscrits
FROM auth.users
WHERE created_at >= NOW() - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY semaine DESC;
