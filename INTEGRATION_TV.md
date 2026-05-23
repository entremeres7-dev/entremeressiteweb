# EntreMeres TV — intégration

## Fichiers ajoutés

```
components/tv/          → UI streaming (hero, carrousels, nav interne)
constants/tvColors.ts
context/TabBarVisibilityContext.tsx
components/CustomTabBar.tsx   → onglet TV ajouté
app/(tabs)/tv.tsx
```

## Utilisation

1. Onglet **TV** dans la barre du bas (icône télévision).
2. Sur l’écran TV : navigation interne Accueil / Explorer / Live / Ma liste / Profil.
3. La barre principale se masque automatiquement sur TV.

## Fusion avec le dépôt complet

Si vous avez déjà `CustomTabBar.tsx` et `TabBarVisibilityContext` :

- Ajoutez l’entrée `tv` dans `TAB_CONFIG` et `VISIBLE_TABS` (voir ce repo).
- Copiez le dossier `components/tv/` et `app/(tabs)/tv.tsx`.
- Dans `(tabs)/_layout.tsx`, ajoutez `<Tabs.Screen name="tv" />`.

## Prochaines étapes

- Brancher Supabase (table `tv_shows`, `tv_episodes`).
- Lecteur : `expo-video` sur écran `app/tv/watch/[id].tsx`.
- Vignettes : URLs stockage Supabase dans les cartes.
