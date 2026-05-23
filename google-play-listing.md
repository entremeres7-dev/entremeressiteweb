# Guide de Publication Google Play Store - EntreMeres

## ⚠️ **ALERTES IMPORTANTES - CORRECTIONS APPLIQUÉES**

### ✅ **Problèmes résolus :**
- **Version harmonisée** : package.json et app.json maintenant en 1.0.2
- **Build type corrigé** : AAB au lieu d'APK (requis par Google Play)
- **SDK cible stabilisé** : Android 13 (SDK 33) pour plus de stabilité
- **Permissions modernisées** : Mise à jour pour Android 13+ (READ_MEDIA_*)

### 🔧 **Commandes de vérification :**
```bash
# Vérifier la configuration
eas build:configure

# Build de production (génère AAB)
eas build --platform android --profile production

# Vérifier la structure du projet
expo doctor
```

---

## Informations de l'Application

### Titre de l'application
**EntreMeres** (25 caractères max ✓)

### Description courte
**Communauté de mamans pour partager des moments de vie** (80 caractères max ✓)

### Description complète
EntreMeres est une application sociale dédiée aux mamans qui souhaitent partager leurs expériences maternelles dans un environnement bienveillant et sécurisé.

**Fonctionnalités principales :**
• Partage de stories et posts personnalisés
• Création de contenu photo et vidéo
• Communauté de mamans bienveillante
• Découverte de contenu adapté à vos intérêts
• Messagerie privée entre utilisatrices
• Notifications personnalisées

**Pourquoi EntreMeres ?**
Rejoignez une communauté de mamans qui comprennent les joies et défis de la maternité. Partagez vos moments précieux, découvrez des conseils pratiques, et créez des connexions authentiques avec d'autres mamans.

**Sécurité et confidentialité :**
Votre vie privée est notre priorité. Toutes les données sont protégées et l'application respecte les normes de sécurité les plus strictes.

Téléchargez EntreMeres et rejoignez une communauté de mamans extraordinaires !

### Mots-clés suggérés
mamans, communauté, partage, stories, photos, vidéos, maternité, famille, conseils, social, bienveillance, expériences, moments, vie quotidienne

### Catégorie principale
**Social** (ou Lifestyle si Social n'est pas disponible)

### Catégorie secondaire
**Lifestyle**

## Classification du Contenu

### Contenu de l'application
- **Violence** : Aucune
- **Sexualité** : Aucune
- **Langage** : Aucun contenu offensant
- **Contenu contrôlé** : Aucun

### Public cible
- **Âge minimum** : 13 ans
- **Public principal** : Adultes (18+)

## Éléments visuels requis

### Icône de l'application
- Format : PNG
- Taille : 512x512 px
- Fichier : `./assets/images/icon.png`

### Capture d'écran
- **Téléphone** : Au moins 2 captures (portrait)
- **Tablette** : Au moins 2 captures (paysage et portrait)
- Format : PNG ou JPEG
- Résolution minimale : 320x320 px

### Image de présentation
- Format : PNG ou JPEG
- Taille : 1024x500 px
- Style : Bannière horizontale avec logo et texte

## Informations techniques

### Version
- Version actuelle : 1.0.2
- Code de version : 20
- Package : com.entremeres.app
- **⚠️ IMPORTANT** : Version harmonisée avec package.json

### Permissions
- Caméra : Pour prendre des photos et vidéos
- Stockage : Accès aux médias (images, vidéos, audio) - **Permissions modernes Android 13+**
- Microphone : Pour l'enregistrement audio
- Internet : Pour la synchronisation et la communication
- Notifications : Pour les alertes et mises à jour
- **⚠️ IMPORTANT** : Permissions mises à jour pour Android 13+

### Configuration de build
- SDK minimum : 21 (Android 5.0)
- SDK cible : 33 (Android 13) - **Stable pour la production**
- Architecture : ARM64, x86_64
- Build type : AAB (Android App Bundle) - **Requis par Google Play**

## Checklist de publication

### Avant la soumission
- [ ] Build de production créé avec EAS
- [ ] Tests sur différents appareils effectués
- [ ] Toutes les permissions justifiées
- [ ] Politique de confidentialité mise à jour
- [ ] Conditions d'utilisation finalisées

### Éléments à préparer
- [ ] Icône 512x512 px
- [ ] Captures d'écran (téléphone + tablette)
- [ ] Image de présentation 1024x500 px
- [ ] Description courte et complète
- [ ] Mots-clés optimisés
- [ ] Classification du contenu

### Après la soumission
- [ ] Révision Google Play (1-7 jours)
- [ ] Publication en production
- [ ] Monitoring des crashs et performances
- [ ] Réponses aux avis utilisateurs

## Commandes utiles

### Build de production
```bash
cd EntreMeresExpo
eas build --platform android --profile production
# ⚠️ IMPORTANT : Génère maintenant un fichier AAB au lieu d'APK
```

### Vérification de la configuration
```bash
eas build:configure
```

### Soumission automatique (optionnel)
```bash
eas submit --platform android
```

## Support et contact

- **Email** : contact@entremeres.fr
- **Site web** : https://entremeres.fr
- **Documentation** : Voir le README.md du projet 