-- ============================================
-- VÉRIFICATION DES MISSIONS ET POSTS
-- ============================================

-- 1. Vérifier la structure de la table articles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'articles' 
ORDER BY ordinal_position;

-- 2. Vérifier la structure de la table posts (pour comparaison)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;

-- 3. Vérifier les participations aux missions récentes
SELECT 
    mp.id,
    mp.user_id,
    mp.mission_id,
    mp.caption,
    mp.hashtag,
    mp.points,
    mp.completed_at,
    p.username
FROM mission_participations mp
LEFT JOIN profiles p ON mp.user_id = p.id
ORDER BY mp.completed_at DESC
LIMIT 10;

-- 4. Vérifier les posts récents dans la table articles
SELECT 
    a.id,
    a.user_id,
    a.contenu,
    a.created_at,
    p.username
FROM articles a
LEFT JOIN profiles p ON a.user_id = p.id
ORDER BY a.created_at DESC
LIMIT 10;

-- 5. Vérifier les posts récents dans la table posts (ancienne table)
SELECT 
    p.id,
    p.user_id,
    p.content,
    p.created_at,
    pr.username
FROM posts p
LEFT JOIN profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC
LIMIT 10;

-- 6. Compter les posts par table
SELECT 
    'articles' as table_name,
    COUNT(*) as total_posts,
    COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as posts_aujourd_hui
FROM articles
UNION ALL
SELECT 
    'posts' as table_name,
    COUNT(*) as total_posts,
    COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as posts_aujourd_hui
FROM posts;

-- 7. Vérifier si votre dernière mission a créé un post dans articles
SELECT 
    mp.caption,
    mp.hashtag,
    mp.completed_at,
    a.contenu as post_content,
    a.created_at as post_created_at
FROM mission_participations mp
LEFT JOIN articles a ON a.user_id = mp.user_id 
    AND a.contenu LIKE '%' || mp.hashtag || '%'
    AND a.created_at >= mp.completed_at - INTERVAL '1 minute'
WHERE mp.user_id = 'b7d204cc-5ac1-44bb-82a8-9ba461f8c319' -- Remplacez par votre user_id
ORDER BY mp.completed_at DESC
LIMIT 5;

-- 8. Vérifier les posts avec hashtags de missions
SELECT 
    a.id,
    a.contenu,
    a.created_at,
    p.username
FROM articles a
LEFT JOIN profiles p ON a.user_id = p.id
WHERE a.contenu LIKE '%#MamanDuLundi%'
   OR a.contenu LIKE '%#AstuceMaman%'
   OR a.contenu LIKE '%#MomentMagique%'
   OR a.contenu LIKE '%#RecetteExpress%'
   OR a.contenu LIKE '%#SelfCareMaman%'
   OR a.contenu LIKE '%#SortieFamille%'
   OR a.contenu LIKE '%#ReflexionMaman%'
ORDER BY a.created_at DESC;

-- 9. Statistiques des missions par jour
SELECT 
    CASE mp.mission_id
        WHEN 'monday-breakfast' THEN 'Lundi'
        WHEN 'tuesday-tip' THEN 'Mardi'
        WHEN 'wednesday-moment' THEN 'Mercredi'
        WHEN 'thursday-recipe' THEN 'Jeudi'
        WHEN 'friday-selfcare' THEN 'Vendredi'
        WHEN 'saturday-outing' THEN 'Samedi'
        WHEN 'sunday-reflection' THEN 'Dimanche'
        ELSE mp.mission_id
    END as jour_semaine,
    COUNT(*) as missions_completees,
    SUM(mp.points) as points_totaux
FROM mission_participations mp
GROUP BY mp.mission_id
ORDER BY 
    CASE mp.mission_id
        WHEN 'monday-breakfast' THEN 1
        WHEN 'tuesday-tip' THEN 2
        WHEN 'wednesday-moment' THEN 3
        WHEN 'thursday-recipe' THEN 4
        WHEN 'friday-selfcare' THEN 5
        WHEN 'saturday-outing' THEN 6
        WHEN 'sunday-reflection' THEN 7
    END;
