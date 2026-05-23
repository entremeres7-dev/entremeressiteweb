-- Ajout des colonnes manquantes à la table push_devices
-- Exécutez ces requêtes dans Supabase SQL Editor

-- 1. Ajouter la colonne is_active (boolean)
ALTER TABLE push_devices 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- 2. Ajouter la colonne provider (text)
ALTER TABLE push_devices 
ADD COLUMN provider TEXT DEFAULT 'expo';

-- 3. Ajouter la colonne last_seen (timestamptz)
ALTER TABLE push_devices 
ADD COLUMN last_seen TIMESTAMPTZ DEFAULT now();

-- 4. Créer un index sur is_active pour optimiser les requêtes
CREATE INDEX ix_push_devices_is_active ON push_devices (is_active);

-- 5. Mettre à jour les enregistrements existants
UPDATE push_devices 
SET 
  is_active = true,
  provider = 'expo',
  last_seen = updated_at
WHERE is_active IS NULL;

-- 6. Vérifier la structure finale
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'push_devices' 
ORDER BY ordinal_position;
