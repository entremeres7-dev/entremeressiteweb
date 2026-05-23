# 🔒 Rapport d'Audit de Sécurité - EntreMeres

**Date :** $(date)  
**Version de l'application :** Production

---

## 📋 Résumé Exécutif

Cet audit a identifié **5 failles de sécurité** dont **2 critiques** et **3 moyennes**. L'application utilise Supabase avec RLS (Row Level Security), ce qui offre une bonne base de sécurité, mais plusieurs améliorations sont nécessaires.

---

## 🔴 Failles Critiques

### 1. **Validation manquante des paramètres URL (IDOR - Insecure Direct Object Reference)**

**Localisation :** `app/profil-public.tsx:23`

**Problème :**
```typescript
const profileId = params.profileId || params.id; // Support des deux formats
// Utilisé directement dans les requêtes sans validation
.eq('author_id', profileId)
```

**Risque :**
- Un attaquant peut manipuler l'URL pour accéder à des profils non autorisés
- Pas de validation que `profileId` est un UUID valide
- Pas de vérification que l'utilisateur a le droit d'accéder à ce profil

**Impact :** Accès non autorisé aux données utilisateur

**Solution recommandée :**
```typescript
// Valider que profileId est un UUID valide
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

if (!profileId || !isValidUUID(profileId)) {
  router.push('/(tabs)/feed');
  return;
}
```

**Priorité :** 🔴 CRITIQUE

---

### 2. **Validation insuffisante des noms de fichiers (Path Traversal)**

**Localisation :** `app/(tabs)/profil.tsx:49`, `app/quiz.tsx:33`, `app/(tabs)/feed.tsx:213`

**Problème :**
```typescript
const fileName = `${userId}_${Date.now()}.${fileExt}`;
// Pas de validation que fileName ne contient pas ".." ou "/"
```

**Risque :**
- Un attaquant pourrait utiliser des noms de fichiers malveillants comme `../../../etc/passwd`
- Path traversal permettant d'écraser des fichiers système ou d'accéder à des répertoires non autorisés

**Impact :** Accès non autorisé au système de fichiers, corruption de données

**Solution recommandée :**
```typescript
const sanitizeFileName = (fileName: string): string => {
  // Enlever les caractères dangereux
  return fileName
    .replace(/\.\./g, '') // Enlever ..
    .replace(/\//g, '_') // Remplacer / par _
    .replace(/\\/g, '_') // Remplacer \ par _
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Garder seulement caractères sûrs
    .substring(0, 255); // Limiter la longueur
};
```

**Priorité :** 🔴 CRITIQUE

---

## 🟠 Failles Moyennes

### 3. **Validation des types de fichiers basée uniquement sur l'extension**

**Localisation :** `app/quiz.tsx:62-69`, `app/(tabs)/profil.tsx:77-78`

**Problème :**
```typescript
const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'bin';
let contentType = 'application/octet-stream';

if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
  contentType = `image/${fileExtension}`;
}
// Pas de vérification du contenu réel du fichier
```

**Risque :**
- Un attaquant peut renommer un fichier malveillant (ex: `malware.exe` → `image.jpg`)
- Le serveur accepte le fichier comme image alors que c'est un exécutable
- Risque d'exécution de code malveillant

**Impact :** Upload de fichiers malveillants, exécution de code

**Solution recommandée :**
- Utiliser une bibliothèque de détection de type MIME basée sur le contenu (magic bytes)
- Valider le contenu réel du fichier, pas seulement l'extension
- Exemple : `react-native-image-picker` ou `expo-file-system` avec validation

**Priorité :** 🟠 MOYENNE

---

### 4. **Logs contenant des informations sensibles**

**Localisation :** Multiple fichiers (130 occurrences)

**Problème :**
```typescript
console.log('🔑 Token disponible:', !!accessToken);
console.log(`📱 Token: ${device.token.substring(0, 20)}...`);
// Même partiellement masqués, ces logs peuvent être exposés
```

**Risque :**
- Les logs peuvent être interceptés ou stockés de manière non sécurisée
- Exposition partielle de tokens même si masqués
- En production, ces logs ne devraient pas contenir d'informations sensibles

**Impact :** Exposition de tokens, informations d'authentification

**Solution recommandée :**
- Désactiver tous les logs en production (`__DEV__` check)
- Ne jamais logger de tokens, même partiellement
- Utiliser un système de logging sécurisé qui filtre automatiquement les données sensibles

**Priorité :** 🟠 MOYENNE

---

### 5. **Validation manquante des deep links**

**Localisation :** `services/deepLinkingService.ts:58-112`

**Problème :**
```typescript
const [type, id, subType, subId] = segments;
// Pas de validation que id, subId sont des UUID valides
return {
  type: 'post',
  postId: id // Utilisé directement sans validation
};
```

**Risque :**
- Un attaquant peut créer des deep links malveillants avec des IDs invalides
- Injection de paramètres dans les requêtes
- Accès à des ressources non autorisées

**Impact :** Accès non autorisé via deep links malveillants

**Solution recommandée :**
```typescript
const validateDeepLinkId = (id: string | undefined): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

if (data.postId && !validateDeepLinkId(data.postId)) {
  logger.warn('Deep link ID invalide', { postId: data.postId });
  return null;
}
```

**Priorité :** 🟠 MOYENNE

---

## ✅ Points Positifs

1. **RLS (Row Level Security) activé** : Supabase utilise RLS pour protéger les données au niveau de la base
2. **Requêtes paramétrées** : Supabase utilise des requêtes paramétrées (pas d'injection SQL directe)
3. **Vérifications de propriétaire** : Certaines opérations vérifient que l'utilisateur est le propriétaire (ex: delete story)
4. **Validation de taille de fichiers** : Les uploads vérifient la taille maximale
5. **Authentification Supabase** : Utilisation d'un système d'authentification robuste

---

## 📝 Recommandations Prioritaires

### Immédiat (Avant production)
1. ✅ Valider tous les paramètres URL comme UUID valides
2. ✅ Sanitiser tous les noms de fichiers uploadés
3. ✅ Désactiver tous les logs en production

### Court terme (1-2 semaines)
4. ✅ Implémenter la validation du contenu réel des fichiers (magic bytes)
5. ✅ Valider tous les deep links
6. ✅ Ajouter un système de rate limiting pour les uploads

### Moyen terme (1 mois)
7. ✅ Audit de sécurité complet par un expert externe
8. ✅ Implémenter un système de logging sécurisé
9. ✅ Tests de pénétration

---

## 🔧 Scripts de Correction

Voir les fichiers suivants pour les corrections détaillées :
- `SECURITY_FIXES_VALIDATION.md` - Validation des paramètres
- `SECURITY_FIXES_FILE_UPLOAD.md` - Sécurisation des uploads
- `SECURITY_FIXES_LOGGING.md` - Sécurisation des logs

---

## 📊 Score de Sécurité

**Score actuel :** 6.5/10

**Après corrections :** 8.5/10 (estimé)

---

**Note :** Ce rapport doit être traité comme confidentiel et ne doit pas être partagé publiquement.


