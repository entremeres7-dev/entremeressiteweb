-- Test de la structure des tables pour les missions
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier la structure de la table articles
SELECT 
    'articles' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'articles' 
ORDER BY ordinal_position;

-- 2. Vérifier la structure de la table mission_participations
SELECT 
    'mission_participations' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'mission_participations' 
ORDER BY ordinal_position;

-- 3. Compter les enregistrements
SELECT 
    'articles' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as with_images,
    COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today_posts
FROM articles
UNION ALL
SELECT 
    'mission_participations' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN image_uri IS NOT NULL THEN 1 END) as with_images,
    COUNT(CASE WHEN completed_at >= CURRENT_DATE THEN 1 END) as today_posts
FROM mission_participations;

-- 4. Vérifier les dernières missions complétées
SELECT 
    mp.hashtag,
    mp.caption,
    mp.completed_at,
    mp.image_uri IS NOT NULL as has_image,
    a.contenu IS NOT NULL as has_post,
    a.image_url IS NOT NULL as post_has_image
FROM mission_participations mp
LEFT JOIN articles a ON a.user_id = mp.user_id 
    AND a.contenu LIKE '%' || mp.hashtag || '%'
    AND a.created_at >= mp.completed_at - INTERVAL '5 minutes'
ORDER BY mp.completed_at DESC
LIMIT 10;
