-- Création de la table pour les lives en direct
CREATE TABLE IF NOT EXISTS public.lives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    viewer_count INTEGER DEFAULT 0,
    max_viewers INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    agora_channel_name TEXT UNIQUE,
    agora_token TEXT,
    privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_lives_user_id ON public.lives(user_id);
CREATE INDEX IF NOT EXISTS idx_lives_active ON public.lives(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_lives_started_at ON public.lives(started_at DESC);

-- Table pour les viewers des lives
CREATE TABLE IF NOT EXISTS public.live_viewers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    live_id UUID REFERENCES public.lives(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(live_id, viewer_id)
);

-- Table pour les commentaires des lives
CREATE TABLE IF NOT EXISTS public.live_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    live_id UUID REFERENCES public.lives(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false
);

-- Index pour les commentaires de lives
CREATE INDEX IF NOT EXISTS idx_live_comments_live_id ON public.live_comments(live_id);
CREATE INDEX IF NOT EXISTS idx_live_comments_created_at ON public.live_comments(created_at DESC);

-- Politiques RLS pour les lives
ALTER TABLE public.lives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_comments ENABLE ROW LEVEL SECURITY;

-- Politique pour les lives : tout le monde peut voir les lives publics
CREATE POLICY "Anyone can view public lives" ON public.lives
    FOR SELECT USING (privacy_level = 'public' OR privacy_level = 'friends');

-- Politique pour les lives : les utilisateurs peuvent créer leurs propres lives
CREATE POLICY "Users can create their own lives" ON public.live_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour les viewers : tout le monde peut rejoindre les lives publics
CREATE POLICY "Anyone can join public lives" ON public.live_viewers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.lives 
            WHERE id = live_id 
            AND (privacy_level = 'public' OR privacy_level = 'friends')
        )
    );

-- Politique pour les commentaires : tout le monde peut commenter les lives publics
CREATE POLICY "Anyone can comment on public lives" ON public.live_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.lives 
            WHERE id = live_id 
            AND (privacy_level = 'public' OR privacy_level = 'friends')
        )
    );

-- Fonction pour mettre à jour le compteur de viewers
CREATE OR REPLACE FUNCTION update_live_viewer_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lives 
        SET viewer_count = (
            SELECT COUNT(*) 
            FROM public.live_viewers 
            WHERE live_id = NEW.live_id AND left_at IS NULL
        )
        WHERE id = NEW.live_id;
        
        -- Mettre à jour le max_viewers si nécessaire
        UPDATE public.lives 
        SET max_viewers = GREATEST(max_viewers, viewer_count)
        WHERE id = NEW.live_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.left_at IS NULL AND NEW.left_at IS NOT NULL THEN
            UPDATE public.lives 
            SET viewer_count = (
                SELECT COUNT(*) 
                FROM public.live_viewers 
                WHERE live_id = NEW.live_id AND left_at IS NULL
            )
            WHERE id = NEW.live_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le compteur de viewers
CREATE TRIGGER trigger_update_live_viewer_count
    AFTER INSERT OR UPDATE ON public.live_viewers
    FOR EACH ROW
    EXECUTE FUNCTION update_live_viewer_count();

-- Fonction pour générer un nom de canal Agora unique
CREATE OR REPLACE FUNCTION generate_agora_channel_name()
RETURNS TEXT AS $$
BEGIN
    RETURN 'entremeres_live_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour démarrer un live
CREATE OR REPLACE FUNCTION start_live(
    p_title TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_privacy_level TEXT DEFAULT 'public'
)
RETURNS UUID AS $$
DECLARE
    live_id UUID;
    channel_name TEXT;
BEGIN
    -- Générer un nom de canal unique
    channel_name := generate_agora_channel_name();
    
    -- Créer le live
    INSERT INTO public.lives (
        user_id,
        title,
        description,
        privacy_level,
        agora_channel_name,
        is_active
    ) VALUES (
        auth.uid(),
        p_title,
        p_description,
        p_privacy_level,
        channel_name,
        true
    ) RETURNING id INTO live_id;
    
    -- Ajouter le créateur comme premier viewer
    INSERT INTO public.live_viewers (live_id, viewer_id)
    VALUES (live_id, auth.uid());
    
    RETURN live_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour arrêter un live
CREATE OR REPLACE FUNCTION end_live(p_live_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Vérifier que l'utilisateur est le propriétaire du live
    IF NOT EXISTS (
        SELECT 1 FROM public.lives 
        WHERE id = p_live_id AND user_id = auth.uid()
    ) THEN
        RETURN false;
    END IF;
    
    -- Marquer le live comme terminé
    UPDATE public.lives 
    SET 
        is_active = false,
        ended_at = NOW(),
        duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER
    WHERE id = p_live_id;
    
    -- Marquer tous les viewers comme ayant quitté
    UPDATE public.live_viewers 
    SET left_at = NOW()
    WHERE live_id = p_live_id AND left_at IS NULL;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
