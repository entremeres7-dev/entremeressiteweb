-- Désactiver temporairement RLS sur push_devices pour permettre l'enregistrement des tokens
-- Exécutez cette requête dans Supabase SQL Editor

-- 1. Désactiver RLS sur la table push_devices
ALTER TABLE push_devices DISABLE ROW LEVEL SECURITY;

-- 2. Vérifier que RLS est désactivé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'push_devices';

-- 3. Pour réactiver plus tard (optionnel)
-- ALTER TABLE push_devices ENABLE ROW LEVEL SECURITY;
