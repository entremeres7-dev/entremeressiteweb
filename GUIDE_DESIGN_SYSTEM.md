# 🎨 Guide du Système de Design EntreMeres

## 📋 Vue d'ensemble

Le nouveau système de design EntreMeres offre une identité visuelle moderne, cohérente et professionnelle. Il remplace l'ancien système avec trop d'effets néon et une palette limitée.

---

## 🎯 Principes de Design

### 1. **Hiérarchie Visuelle Claire**
- **Niveau 1** : Actions primaires (CTA importants) → NeonGlow uniquement ici
- **Niveau 2** : Actions secondaires → Ombres douces
- **Niveau 3** : Éléments interactifs → Bordures subtiles
- **Niveau 4** : Éléments passifs → Pas d'effets

### 2. **Palette de Couleurs Élargie**
- **Rose Corail** (`#FF6A88`) : Identité de marque principale
- **Pêche** (`#FF9F7A`) : Couleur secondaire harmonieuse
- **Turquoise** (`#4ECDC4`) : Succès (au lieu de vert classique)
- **Bleu doux** (`#6B9BD1`) : Informations
- **Orange doux** (`#FFB84D`) : Avertissements
- **Rouge corail** (`#FF6B6B`) : Erreurs (cohérent avec la palette)

### 3. **Effets Visuels Modérés**
- ✅ **Ombres douces** : Pour les cartes et élévations
- ✅ **NeonGlow** : Uniquement pour les CTA importants
- ✅ **Gradients** : Pour les boutons principaux
- ❌ **Pas de néon partout** : Réduit la fatigue visuelle

---

## 📦 Composants Disponibles

### Button

```tsx
import { Button } from '@/components/design';

<Button
  title="Publier"
  onPress={handlePublish}
  variant="primary"      // 'primary' | 'secondary' | 'tertiary' | 'outline'
  size="medium"          // 'small' | 'medium' | 'large'
  useGlow={true}         // NeonGlow uniquement pour CTA importants
  fullWidth={false}
/>
```

**Variantes :**
- `primary` : Bouton principal (rose corail)
- `secondary` : Bouton secondaire (pêche)
- `tertiary` : Bouton outlined (bordure rose)
- `outline` : Bouton outlined neutre

### Card

```tsx
import { Card } from '@/components/design';

<Card
  variant="elevated"     // 'default' | 'elevated' | 'outlined'
  padding="medium"       // 'none' | 'small' | 'medium' | 'large'
>
  <Text>Contenu de la carte</Text>
</Card>
```

### Badge

```tsx
import { Badge } from '@/components/design';

<Badge
  label="Nouveau"
  variant="success"      // 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size="medium"          // 'small' | 'medium'
/>
```

---

## 🎨 Utilisation du Système de Design

### Couleurs

```tsx
import { useTheme } from '@/context/ThemeContext';

const { colors } = useTheme();

// Couleurs disponibles
colors.primary          // Rose corail principal
colors.secondary        // Pêche
colors.accent           // Corail doux
colors.background       // Fond principal
colors.surface          // Surface des cartes
colors.surfaceElevated  // Surface élevée
colors.text             // Texte principal
colors.textSecondary    // Texte secondaire
colors.textTertiary     // Texte tertiaire
colors.border           // Bordures
colors.success          // Turquoise
colors.info             // Bleu doux
colors.warning          // Orange doux
colors.error            // Rouge corail
```

### Espacements

```tsx
import { spacing } from '@/constants/designSystem';

padding: spacing.xs      // 4
padding: spacing.sm      // 8
padding: spacing.md      // 16
padding: spacing.lg      // 24
padding: spacing.xl      // 32
```

### Border Radius

```tsx
import { borderRadius } from '@/constants/designSystem';

borderRadius: borderRadius.sm      // 8
borderRadius: borderRadius.md     // 12
borderRadius: borderRadius.lg     // 16
borderRadius: borderRadius.xl     // 24
borderRadius: borderRadius.button // 12
borderRadius: borderRadius.card   // 16
```

### Ombres

```tsx
import { shadows } from '@/constants/designSystem';

// Utiliser les ombres au lieu de néon partout
...shadows.sm    // Ombre petite
...shadows.md    // Ombre moyenne
...shadows.lg    // Ombre grande
...shadows.glow  // Glow uniquement pour CTA importants
```

### Typographie

```tsx
import { typography } from '@/constants/designSystem';

...typography.h1         // Titre principal
...typography.h2         // Titre secondaire
...typography.body       // Corps de texte
...typography.caption    // Légende
...typography.button     // Texte de bouton
```

---

## 🔄 Migration depuis l'Ancien Système

### Avant (Ancien)

```tsx
// ❌ Trop de néon partout
<NeonGlow color="#ff6a88" intensity="medium">
  <View style={{ backgroundColor: '#ff6a88', borderRadius: 20 }}>
    <Text>Bouton</Text>
  </View>
</NeonGlow>
```

### Après (Nouveau)

```tsx
// ✅ Néon uniquement pour CTA importants
<Button
  title="Bouton"
  variant="primary"
  useGlow={true}  // NeonGlow uniquement ici
/>

// ✅ Ombres douces pour les autres éléments
<Card variant="elevated">
  <Text>Contenu</Text>
</Card>
```

---

## 📊 Comparaison Avant/Après

| Aspect | Avant | Après |
|--------|-------|-------|
| **Couleurs** | 2-3 couleurs (rose uniquement) | 10+ couleurs harmonieuses |
| **Effets néon** | Partout (fatigue visuelle) | Uniquement CTA importants |
| **Ombres** | Néon uniquement | Ombres douces + néon stratégique |
| **Hiérarchie** | Tous les éléments égaux | 4 niveaux clairs |
| **Cohérence** | Incohérent | Système unifié |

---

## ✅ Bonnes Pratiques

### ✅ À FAIRE

1. **Utiliser les composants de design** (`Button`, `Card`, `Badge`)
2. **Utiliser les constantes** (`spacing`, `borderRadius`, `shadows`)
3. **Respecter la hiérarchie visuelle** (4 niveaux)
4. **Utiliser NeonGlow uniquement** pour les CTA très importants
5. **Utiliser les ombres douces** pour les cartes et élévations

### ❌ À ÉVITER

1. **Ne pas utiliser NeonGlow partout** (fatigue visuelle)
2. **Ne pas hardcoder les couleurs** (utiliser `colors` du thème)
3. **Ne pas créer des border-radius arbitraires** (utiliser les constantes)
4. **Ne pas ignorer la hiérarchie visuelle**
5. **Ne pas mélanger les anciens et nouveaux styles**

---

## 🚀 Prochaines Étapes

1. ✅ Système de design créé
2. ✅ Composants réutilisables créés
3. ⏳ Migration progressive des écrans existants
4. ⏳ Réduction de l'utilisation excessive de NeonGlow
5. ⏳ Uniformisation des styles dans toute l'app

---

**Dernière mise à jour :** Aujourd'hui
**Version :** 1.0.0















