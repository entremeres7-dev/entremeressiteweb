-- Debug pour vérifier les deux utilisateurs spécifiques
-- À exécuter dans Supabase SQL Editor

-- Vérifier les deux utilisateurs impliqués dans la demande d'amitié
SELECT 
    'Expéditeur' as role,
    id,
    username,
    email,
    created_at
FROM profiles 
WHERE id = '3b0852c2-9306-42ed-a3b0-421b25b7353b'

UNION ALL

SELECT 
    'Destinataire' as role,
    id,
    username,
    email,
    created_at
FROM profiles 
WHERE id = 'c57577f2-81ad-42bd-b925-00728abd66a1'

ORDER BY role;
