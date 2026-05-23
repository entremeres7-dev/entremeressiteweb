-- Script pour corriger le problème d'inscription
-- Le trigger d'email de bienvenue cause des erreurs car il essaie d'accéder à des secrets inexistants

-- 1. Désactiver temporairement le trigger d'email de bienvenue
DROP TRIGGER IF EXISTS send_welcome_email_after_signup ON auth.users;
DROP TRIGGER IF EXISTS queue_welcome_email_after_signup ON auth.users;

-- 2. Supprimer les fonctions problématiques
DROP FUNCTION IF EXISTS send_welcome_email_trigger();
DROP FUNCTION IF EXISTS queue_welcome_email();

-- 3. Vérifier que la table profiles a les bonnes politiques RLS
-- S'assurer que les utilisateurs peuvent créer leur propre profil
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Créer un trigger simple pour créer automatiquement le profil
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    username,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Utilisateur_' || SUBSTRING(NEW.id::text, 1, 8)),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, continuer sans bloquer l'inscription
    RAISE WARNING 'Erreur création profil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Créer le trigger pour créer automatiquement le profil
DROP TRIGGER IF EXISTS create_profile_after_signup ON auth.users;
CREATE TRIGGER create_profile_after_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- 6. Vérification finale
SELECT 'Trigger créé avec succès' as status;
