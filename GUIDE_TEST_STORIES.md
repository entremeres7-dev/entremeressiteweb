# 🧪 Guide de Test - Problème StoriesViewer

## 🔍 **Problème Identifié**

Le composant `StoriesViewer` ne s'affiche pas correctement. Les logs montrent :
- `visible = false`
- `currentStoryExists = false`

## 🛠️ **Solution Temporaire Implémentée**

J'ai remplacé `StoriesViewer` par `TestStoriesViewer` pour tester la logique de base.

## 📋 **Étapes de Test**

### 1. **Lancer l'Application**
```bash
cd EntreMeresExpo
npm start
```

### 2. **Ouvrir l'App sur Mobile/Simulateur**

### 3. **Aller sur l'Onglet Feed**

### 4. **Tester les Stories**
- **Cliquer sur une story** (la vôtre ou celle d'un autre utilisateur)
- **Vérifier les logs** dans la console

### 5. **Logs à Surveiller**

#### **Lors du Clic sur une Story :**
```
🎯 OUVERTURE MODAL STORY - Données reçues: {...}
🎯 OUVERTURE MODAL STORY - États après setState: {...}
```

#### **Lors du Changement d'État :**
```
🔄 useEffect StoriesViewer - Changement d'état: {...}
```

#### **Lors du Rendu :**
```
🔍 StoriesViewer - ÉTAT AVANT RENDU: {...}
🧪 TestStoriesViewer - Props reçues: {...}
```

## 🔍 **Diagnostic Attendu**

### **Si TestStoriesViewer Fonctionne :**
- Le problème est dans `StoriesViewer` lui-même
- Vérifier la logique de rendu conditionnel

### **Si TestStoriesViewer Ne Fonctionne Pas :**
- Le problème est dans la logique de `feed.tsx`
- Vérifier les variables d'état :
  - `showStoryModal`
  - `selectedStoryGroup`
  - `selectedStoryGroup.stories`

## 📊 **Variables à Vérifier**

```typescript
// Dans feed.tsx
const [showStoryModal, setShowStoryModal] = useState(false);
const [selectedStoryGroup, setSelectedStoryGroup] = useState<any | null>(null);
const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
```

## 🎯 **Actions à Effectuer**

1. **Cliquer sur une story**
2. **Vérifier que `showStoryModal` devient `true`**
3. **Vérifier que `selectedStoryGroup` contient des données**
4. **Vérifier que `selectedStoryGroup.stories` n'est pas vide**

## 🚨 **Problèmes Possibles**

### **Problème 1 : Stories Non Chargées**
- `selectedStoryGroup.stories` est `undefined` ou vide
- Vérifier la fonction `fetchFeed()`

### **Problème 2 : État Non Mis à Jour**
- `setShowStoryModal(true)` ne fonctionne pas
- Vérifier les `useEffect` et la logique de rendu

### **Problème 3 : Conflit de Composants**
- Plusieurs composants `StoriesViewer` dans l'app
- Vérifier l'import et l'utilisation

## 🔧 **Prochaines Étapes**

1. **Tester avec TestStoriesViewer**
2. **Analyser les logs**
3. **Identifier la cause racine**
4. **Corriger le problème**
5. **Remettre StoriesViewer en place**

## 📝 **Notes de Débogage**

- Les logs sont ajoutés dans `feed.tsx` et `TestStoriesViewer.tsx`
- Vérifier la console Metro/Expo pour voir les logs
- Comparer les logs avec le comportement attendu 