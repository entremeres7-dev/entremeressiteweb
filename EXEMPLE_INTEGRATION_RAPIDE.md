# ⚡ Exemple d'Intégration Rapide

## 🎯 Intégration dans Feed.tsx

### 1. Ajouter les imports

```typescript
// En haut du fichier feed.tsx
import { HapticFeedback } from '../utils/hapticFeedback';
import DoubleTapLike from '../components/DoubleTapLike';
import ReactionButton, { ReactionType } from '../components/ReactionButton';
import { useLevelSystem, XP_REWARDS } from '../hooks/useLevelSystem';
import LevelUpAnimation from '../components/LevelUpAnimation';
```

### 2. Ajouter les hooks

```typescript
export default function FeedPage() {
  // ... code existant ...
  
  // Ajouter ces hooks
  const { levelData, addXP } = useLevelSystem();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [userReactions, setUserReactions] = useState<{ [postId: string]: ReactionType }>({});
  
  // ... reste du code ...
}
```

### 3. Modifier handleLike pour utiliser XP et réactions

```typescript
const handleReaction = useCallback(async (postId: string, reaction: ReactionType) => {
  if (!user?.id) return;
  
  try {
    // Logique existante pour enregistrer la réaction
    // ...
    
    // Ajouter XP
    const leveledUp = await addXP(XP_REWARDS.LIKE, 'LIKE');
    if (leveledUp) {
      setShowLevelUp(true);
    }
    
    // Feedback haptique
    HapticFeedback.light();
    
    // Mettre à jour l'état local
    setUserReactions(prev => ({ ...prev, [postId]: reaction }));
  } catch (error) {
    console.error('Erreur réaction:', error);
  }
}, [user?.id, addXP]);
```

### 4. Modifier renderPost pour utiliser les nouveaux composants

```typescript
const renderPost = ({ item }: { item: any }) => {
  return (
    <View style={styles.postContainer}>
      {/* ... header du post ... */}
      
      {/* Image avec double-tap */}
      <DoubleTapLike
        onDoubleTap={() => {
          HapticFeedback.doubleTap();
          handleReaction(item.id, 'like');
        }}
        showHeartAnimation={true}
      >
        <PostImageCarousel images={item.images || []} />
      </DoubleTapLike>
      
      {/* Actions du post */}
      <View style={styles.postActions}>
        {/* Remplacer l'ancien bouton like par ReactionButton */}
        <ReactionButton
          currentReaction={userReactions[item.id] || null}
          reactionCount={item.reactionCount || 0}
          onReactionSelect={(reaction) => handleReaction(item.id, reaction)}
          onReactionRemove={() => {
            // Logique pour retirer la réaction
            setUserReactions(prev => {
              const newReactions = { ...prev };
              delete newReactions[item.id];
              return newReactions;
            });
          }}
          showCount={true}
        />
        
        {/* ... autres boutons ... */}
      </View>
      
      {/* Animation de level-up */}
      <LevelUpAnimation
        visible={showLevelUp}
        newLevel={levelData.level}
        onComplete={() => setShowLevelUp(false)}
      />
    </View>
  );
};
```

---

## 🎯 Intégration dans Profil.tsx

### 1. Ajouter les imports

```typescript
import { useStreak } from '../hooks/useStreak';
import { useLevelSystem } from '../hooks/useLevelSystem';
import StreakBadge from '../components/StreakBadge';
import StreakCalendar from '../components/StreakCalendar';
import LevelProgressBar from '../components/LevelProgressBar';
```

### 2. Ajouter les hooks

```typescript
export default function ProfilScreen() {
  // ... code existant ...
  
  // Ajouter ces hooks
  const { streakData, recordActivity } = useStreak();
  const { levelData } = useLevelSystem();
  
  // Enregistrer l'activité au chargement
  useEffect(() => {
    recordActivity();
  }, []);
  
  // ... reste du code ...
}
```

### 3. Ajouter dans le rendu

```typescript
return (
  <ScrollView>
    {/* ... profil existant ... */}
    
    {/* Section Streaks et Niveaux */}
    <View style={styles.statsSection}>
      <StreakBadge streakData={streakData} size="large" />
      <LevelProgressBar levelData={levelData} showText={true} />
      <StreakCalendar streakData={streakData} daysToShow={30} />
    </View>
    
    {/* ... reste du profil ... */}
  </ScrollView>
);
```

---

## 🗄️ Installation Base de Données

### 1. Aller dans Supabase SQL Editor

### 2. Exécuter le script pour les streaks :

Copier-coller le contenu de `database/create_streaks_table.sql`

### 3. Exécuter le script pour les niveaux :

Copier-coller le contenu de `database/create_levels_tables.sql`

---

## ✅ Checklist d'Intégration

- [ ] Scripts SQL exécutés dans Supabase
- [ ] Imports ajoutés dans Feed.tsx
- [ ] Hooks ajoutés dans Feed.tsx
- [ ] DoubleTapLike intégré sur les images
- [ ] ReactionButton remplace l'ancien bouton like
- [ ] Système XP intégré dans les handlers
- [ ] Imports ajoutés dans Profil.tsx
- [ ] Streaks et niveaux affichés dans le profil
- [ ] Test des animations
- [ ] Test du feedback haptique (sur iPhone)

---

## 🎨 Styles à Ajouter

```typescript
const styles = StyleSheet.create({
  // ... styles existants ...
  
  statsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

---

## 🚀 Test Rapide

1. **Tester le double-tap :** Double-tap sur une image → Animation de cœur + confetti
2. **Tester les réactions :** Long-press sur le bouton like → Menu de réactions
3. **Tester les streaks :** Ouvrir le profil → Badge de streak affiché
4. **Tester les niveaux :** Faire des actions → XP ajouté → Barre de progression mise à jour
5. **Tester le level-up :** Atteindre un nouveau niveau → Animation de célébration

---

**🎉 Votre app est maintenant beaucoup plus engageante et addictive !**
















