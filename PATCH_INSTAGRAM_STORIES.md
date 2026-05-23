# PATCH - Remplacements pour le système Instagram Stories

## 1. Ajouter l'import (ligne ~32)

**Ajouter après les autres imports :**
```typescript
import { createInstagramStoryData, getActiveStories, incrementStoryView } from '../../utils/instagramStories';
```

## 2. Remplacer handleInstagramStoryPublished (ligne ~2945)

**Remplacer la fonction complète par :**
```typescript
const handleInstagramStoryPublished = async (storyData: { 
  mediaUri: string; 
  mediaType: string; 
  text?: string; 
  textColor?: string; 
  textSize?: number 
}) => {
  logger.debug('=== STORY INSTAGRAM PUBLIÉ ===', storyData, 'handleInstagramStoryPublished');
  
  try {
    setAddingStory(true);
    setAddStoryError(null);
    
    const { mediaUri, mediaType, text, textColor, textSize } = storyData;
    let mediaUrl: string | null = null;
    
    // Upload du média
    if (mediaType === 'video') {
      logger.debug('=== UPLOAD VIDÉO INSTAGRAM ===', { uri: mediaUri }, 'handleInstagramStoryPublished');
      mediaUrl = await uploadVideoToSupabase(mediaUri);
      
      if (!mediaUrl) {
        setAddStoryError('Erreur lors de l\'upload de la vidéo');
        setAddingStory(false);
        return;
      }
      
      logger.success('Vidéo Instagram uploadée avec succès', null, 'handleInstagramStoryPublished');
    } else {
      logger.debug('=== UPLOAD IMAGE INSTAGRAM ===', { uri: mediaUri }, 'handleInstagramStoryPublished');
      mediaUrl = await uploadImageToSupabase(mediaUri, 'story-images');
      
      if (!mediaUrl) {
        setAddStoryError('Erreur lors de l\'upload de l\'image');
        setAddingStory(false);
        return;
      }
      
      logger.success('Image Instagram uploadée avec succès', null, 'handleInstagramStoryPublished');
    }

    // Récupérer le groupe régional de l'utilisateur
    let userRegionalGroup = null;
    if (user?.id) {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('regional_group')
        .eq('id', user.id)
        .single();

      if (!profileError && userProfile) {
        userRegionalGroup = userProfile.regional_group;
      }
    }

    // ✅ UTILISER LE NOUVEAU SYSTÈME INSTAGRAM
    const instagramStoryData = createInstagramStoryData(
      user.id,
      mediaUrl,
      mediaType === 'video' ? 'video' : 'image',
      userRegionalGroup || 'Europe',
      {
        text: text || undefined,
        textColor: textColor || undefined,
        textSize: textSize || undefined,
        durationMs: mediaType === 'video' ? 15000 : undefined,
      }
    );

    logger.debug('Données story Instagram à insérer', instagramStoryData, 'handleInstagramStoryPublished');

    const { data: insertedStory, error: insertError } = await supabase
      .from('stories')
      .insert([instagramStoryData])
      .select()
      .single();

    if (insertError) {
      logger.error('Erreur insertion story Instagram', insertError, 'handleInstagramStoryPublished');
      setAddStoryError('Erreur lors de la sauvegarde du story');
      setAddingStory(false);
      return;
    }

    logger.success('Story Instagram inséré avec succès en base', null, 'handleInstagramStoryPublished');

    // Notifier les amis
    try {
      await notifyFriendsAboutNewStory(user.id, profile?.username || 'Une maman', insertedStory.id);
      logger.success('Notifications push envoyées pour story Instagram', null, 'handleInstagramStoryPublished');
    } catch (error) {
      logger.error('❌ Erreur notifications push story Instagram', error, 'handleInstagramStoryPublished');
    }

    // Succès
    setAddingStory(false);
    setStoryImage(null);
    setStoryVideo(null);
    setStoryText('');
    setShowInstagramStories(false);
    
    // Recharger les stories
    fetchFeed();
    
    // Message de succès
    const successMessage = mediaType === 'video' 
      ? 'Vidéo publiée avec succès ! 🎬' 
      : 'Photo publiée avec succès ! 📸';
    
    Alert.alert('Succès', successMessage);
    
  } catch (error) {
    logger.error('Erreur inattendue dans handleInstagramStoryPublished', error, 'handleInstagramStoryPublished');
    setAddStoryError('Erreur inattendue lors de la publication');
    setAddingStory(false);
  }
};
```

## 3. Modifier fetchFeed - Section Stories (ligne ~1450 environ)

**Remplacer la section de récupération des stories par :**
```typescript
// ✅ UTILISER LE NOUVEAU SYSTÈME INSTAGRAM POUR LES STORIES
const { data: storiesData, error: storiesError } = await getActiveStories(userRegionalGroup);

if (storiesError) {
  console.error('Erreur chargement stories:', storiesError);
  setStories([]);
} else {
  // Filtrer les stories bloquées
  const filteredStoriesData = (storiesData || []).filter(story => !isUserBlocked(story.user_id));
  
  // Grouper les stories par utilisateur avec profils
  const groupedStories = filteredStoriesData.reduce((groups: any, story: any) => {
    const userId = story.user_id;
    if (!groups[userId]) {
      groups[userId] = {
        user_id: userId,
        username: story.profiles?.username || 'Utilisateur',
        photo: story.profiles?.photo || null,
        is_admin: story.profiles?.is_admin || false,
        stories: [],
        latest_story_time: story.created_at,
      };
    }
    groups[userId].stories.push(story);
    
    // Garder le timestamp de la story la plus récente
    if (new Date(story.created_at) > new Date(groups[userId].latest_story_time)) {
      groups[userId].latest_story_time = story.created_at;
    }
    
    return groups;
  }, {});

  // Convertir en array et trier par story la plus récente
  const storiesArray = Object.values(groupedStories).sort((a: any, b: any) => 
    new Date(b.latest_story_time).getTime() - new Date(a.latest_story_time).getTime()
  );

  setStories(storiesArray);
  logger.success(`Stories chargées: ${storiesArray.length} utilisatrices`, null, 'fetchFeed');
}
```

## 4. Ajouter le tracking des vues (nouvelle fonction)

**Ajouter cette fonction après fetchFeed :**
```typescript
// ✅ NOUVELLE FONCTION - Tracking des vues Instagram
const handleStoryView = async (storyId: string) => {
  if (!user?.id) return;
  
  try {
    const result = await incrementStoryView(storyId, user.id);
    if (result.success && !result.alreadyViewed) {
      logger.info('Nouvelle vue story comptabilisée', { storyId }, 'handleStoryView');
    }
  } catch (error) {
    logger.error('Erreur tracking vue story', { error, storyId }, 'handleStoryView');
  }
};
```

## 5. Utiliser handleStoryView dans StoriesViewer

**Dans le composant StoriesViewer, ajouter :**
```typescript
onStoryViewed={handleStoryView}
```

---

## ✅ **Résultat après patch**

- ✅ **video_url** et **duration_ms** correctement remplis
- ✅ **expires_at** calculé automatiquement (24h)
- ✅ Filtrage des stories expirées
- ✅ Tracking des vues avec **story_views**
- ✅ Support des **overlays** (texte, stickers)
- ✅ Compression silencieuse

## 🚀 **Test**

1. Appliquer ces modifications
2. Publier une story → `video_url` et `duration_ms` remplis
3. Attendre 24h → story disparaît automatiquement
4. Regarder des stories → vues comptabilisées

**Le système Instagram est maintenant complet !** 🎯✨
