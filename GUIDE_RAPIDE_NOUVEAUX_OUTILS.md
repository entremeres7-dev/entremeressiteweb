# 🚀 Guide Rapide - Nouveaux Outils EntreMeres

Ce guide explique comment utiliser les nouveaux outils créés pour améliorer la qualité du code.

---

## 📝 1. Système de Logger

### Utilisation de base

**Avant :**
```typescript
console.log('Chargement des posts...');
console.error('Erreur:', error);
```

**Après :**
```typescript
import logger from '../utils/logger';

logger.debug('Chargement des posts', { count: posts.length }, 'MyComponent');
logger.error('Erreur chargement posts', error, 'MyComponent');
```

### Signature
```typescript
logger.debug(message: string, data?: any, component?: string)
logger.info(message: string, data?: any, component?: string)
logger.warn(message: string, data?: any, component?: string)
logger.error(message: string, error?: any, component?: string)
```

### Avantages
- ✅ Logs désactivés automatiquement en production (sauf erreurs)
- ✅ Filtrage automatique des données sensibles (tokens, passwords)
- ✅ Contexte du composant pour faciliter le debug

---

## 🛡️ 2. Gestion d'Erreurs Centralisée

### Utilisation de base

**Avant :**
```typescript
try {
  await fetchData();
} catch (error) {
  Alert.alert('Erreur', 'Une erreur est survenue');
  console.error(error);
}
```

**Après :**
```typescript
import { handleError } from '../utils/errorHandler';

try {
  await fetchData();
} catch (error) {
  await handleError(error, {
    userMessage: 'Impossible de charger les données',
    maxRetries: 3,
    retryFn: () => fetchData(),
    component: 'MyComponent',
  });
}
```

### Avec le hook React

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';

function MyComponent() {
  const { handleError } = useErrorHandler('MyComponent');
  
  const fetchData = async () => {
    try {
      await someOperation();
    } catch (error) {
      await handleError(error, {
        userMessage: 'Erreur de chargement',
        maxRetries: 2,
        retryFn: () => someOperation(),
      });
    }
  };
}
```

### Retry automatique

```typescript
import { withRetry } from '../utils/errorHandler';

const fetchDataWithRetry = withRetry(
  async () => {
    const response = await fetch('/api/data');
    return response.json();
  },
  3, // maxRetries
  1000 // retryDelay (ms)
);

// Utilisation
const data = await fetchDataWithRetry();
```

---

## ♿ 3. Accessibilité

### Utilisation des helpers

**Avant :**
```typescript
<TouchableOpacity onPress={handlePress}>
  <Text>Publier</Text>
</TouchableOpacity>
```

**Après :**
```typescript
import { getButtonAccessibilityProps } from '../utils/accessibility';

<TouchableOpacity
  {...getButtonAccessibilityProps('Publier le post', 'Appuyez pour publier')}
  onPress={handlePress}
>
  <Text>Publier</Text>
</TouchableOpacity>
```

### Helpers disponibles

```typescript
// Bouton
getButtonAccessibilityProps(label: string, hint?: string, disabled?: boolean)

// Image
getImageAccessibilityProps(label: string, hint?: string)

// Lien
getLinkAccessibilityProps(label: string, hint?: string)

// Header
getHeaderAccessibilityProps(label: string)
```

### Exemple complet

```typescript
import { 
  getButtonAccessibilityProps,
  getImageAccessibilityProps 
} from '../utils/accessibility';

// Bouton avec état disabled
<TouchableOpacity
  {...getButtonAccessibilityProps('Suivre', 'Appuyez pour suivre cette maman', isLoading)}
  disabled={isLoading}
  onPress={handleFollow}
>

// Image avec description
<Image
  source={{ uri: profile.photo }}
  {...getImageAccessibilityProps(`Photo de ${profile.username}`)}
/>
```

---

## 🎨 4. Composants Extraits

### FeedPost

**Utilisation :**
```typescript
import FeedPost from '../../components/feed/FeedPost';

<FeedPost
  post={post}
  index={index}
  userLikes={userLikes}
  likes={likes}
  comments={comments}
  userReactions={userReactions}
  followingUsers={followingUsers}
  onLike={handleLike}
  onReaction={handleReaction}
  onComment={handleComment}
  onShare={handleShare}
  onMenu={handleMenu}
  onImagePress={handleImagePress}
  formatPostDate={formatPostDate}
  isAdminUser={isAdminUser}
/>
```

### FeedStories

**Utilisation :**
```typescript
import FeedStories from '../../components/feed/FeedStories';

<FeedStories
  stories={stories}
  profile={profile}
  onStoryPress={handleStoryPress}
  onCreateStory={handleCreateStory}
  viewedStoryIds={viewedStoryIds}
/>
```

---

## 📋 Checklist d'Utilisation

### Pour chaque nouveau composant/page :

- [ ] Utiliser `logger` au lieu de `console.log`
- [ ] Utiliser `handleError` pour la gestion d'erreurs
- [ ] Ajouter `accessibilityLabel` sur tous les boutons
- [ ] Utiliser les helpers d'accessibilité
- [ ] Typer correctement avec TypeScript (éviter `any`)

### Pour chaque fonction async :

- [ ] Wrapper avec `try/catch`
- [ ] Utiliser `handleError` avec message user-friendly
- [ ] Ajouter retry si nécessaire
- [ ] Logger les erreurs avec contexte

### Pour chaque TouchableOpacity/Button :

- [ ] Ajouter `accessibilityLabel`
- [ ] Ajouter `accessibilityRole="button"`
- [ ] Ajouter `accessibilityHint` si nécessaire
- [ ] Utiliser les helpers si possible

---

## 🔗 Ressources

- **Logger** : `utils/logger.ts`
- **Error Handler** : `utils/errorHandler.ts`
- **Hook Error Handler** : `hooks/useErrorHandler.ts`
- **Accessibility** : `utils/accessibility.ts`
- **FeedPost** : `components/feed/FeedPost.tsx`
- **FeedStories** : `components/feed/FeedStories.tsx`

---

**Dernière mise à jour** : Aujourd'hui
