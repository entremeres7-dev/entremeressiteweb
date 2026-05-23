# Guide de Publication Android - EntreMeres

## 🚀 Démarrage Rapide

### 1. Prérequis
- Compte Google Play Console (25$ USD)
- EAS CLI installé : `npm install -g @expo/eas-cli`
- Connexion EAS : `eas login`

### 2. Build de Production
```bash
cd EntreMeresExpo
eas build --platform android --profile production
```

### 3. Soumission (optionnel)
```bash
eas submit --platform android
```

## 📱 Configuration Actuelle

Votre application est déjà configurée pour la publication avec :

- ✅ Package : `com.entremeres.app`
- ✅ Version : 1.0.2
- ✅ Code de version : 20
- ✅ Permissions justifiées
- ✅ Configuration EAS optimisée
- ✅ Deep linking configuré

## 🔧 Scripts Automatisés

### Windows (PowerShell)
```powershell
.\scripts\publish-android.ps1
```

### Linux/Mac (Bash)
```bash
./scripts/publish-android.sh
```

## 📋 Checklist de Publication

### Avant le Build
- [ ] Vérifier la version dans `app.json`
- [ ] Vérifier le code de version dans `eas.json`
- [ ] Tester l'application sur un appareil Android
- [ ] Vérifier toutes les fonctionnalités

### Éléments Visuels Requis
- [ ] Icône 512x512 px (`./assets/images/icon.png`)
- [ ] Captures d'écran téléphone (2+)
- [ ] Captures d'écran tablette (2+)
- [ ] Image de présentation 1024x500 px

### Métadonnées Google Play
- [ ] Titre : "EntreMeres"
- [ ] Description courte (80 caractères max)
- [ ] Description complète (4000 caractères max)
- [ ] Mots-clés optimisés
- [ ] Catégorie : Social
- [ ] Classification du contenu

## 🎯 Processus de Publication

### Étape 1 : Build
```bash
eas build --platform android --profile production
```

### Étape 2 : Google Play Console
1. Créer une nouvelle application
2. Remplir les informations de base
3. Télécharger l'APK/AAB
4. Configurer les métadonnées
5. Définir la classification
6. Soumettre pour révision

### Étape 3 : Révision
- **Délai** : 1-7 jours
- **Statuts possibles** : En cours, Approuvé, Rejeté
- **Actions** : Répondre aux demandes de modification

### Étape 4 : Publication
- **Déploiement** : Progressif ou immédiat
- **Monitoring** : Crashs, performances, avis

## 📊 Optimisation Google Play

### Mots-clés Recommandés
- mamans, communauté, partage
- stories, photos, vidéos
- maternité, famille, conseils
- social, bienveillance, expériences

### Captures d'Écran
- **Format** : PNG ou JPEG
- **Résolution** : 320x320 px minimum
- **Contenu** : Fonctionnalités principales
- **Ordre** : Plus importantes en premier

### Description Optimisée
- **Début** : Hook accrocheur
- **Milieu** : Fonctionnalités clés
- **Fin** : Call-to-action
- **Longueur** : 4000 caractères max

## 🚨 Résolution de Problèmes

### Erreurs Communes

#### Build Échoue
```bash
# Vérifier la configuration
eas build:configure

# Nettoyer le cache
eas build:clean

# Vérifier les dépendances
npm install
```

#### Soumission Échoue
```bash
# Vérifier la connexion
eas whoami

# Reconnecter si nécessaire
eas login
```

#### Permissions Rejetées
- Justifier chaque permission dans la description
- Expliquer l'usage concret
- Fournir des exemples d'utilisation

### Support
- **Documentation EAS** : https://docs.expo.dev/eas/
- **Google Play Console** : https://play.google.com/console
- **Email** : contact@entremeres.fr

## 📈 Post-Publication

### Monitoring
- **Google Play Console** : Statistiques, crashs
- **Firebase** : Analytics, crashlytics
- **Avis utilisateurs** : Répondre aux commentaires

### Mises à Jour
- **Version** : Incrémenter dans `app.json`
- **Code de version** : Incrémenter dans `eas.json`
- **Build** : `eas build --platform android --profile production`
- **Soumission** : `eas submit --platform android`

### Bonnes Pratiques
- Tester avant chaque publication
- Communiquer les changements
- Surveiller les métriques
- Répondre aux retours utilisateurs

## 🎉 Félicitations !

Votre application EntreMeres est maintenant prête pour Google Play Store ! 

**Prochaines étapes :**
1. Créer votre compte Google Play Console
2. Lancer le build de production
3. Préparer les métadonnées
4. Soumettre pour révision
5. Publier et célébrer ! 🎊

---

**Besoin d'aide ?** Consultez le guide détaillé dans `google-play-listing.md` ou contactez l'équipe de développement. 