# 🏘️ Guide d'utilisation des Communautés EntreMeres

## 🎯 **Qu'est-ce que les Communautés ?**

Les Communautés sont des groupes thématiques qui permettent aux mamans de s'organiser par centres d'intérêt et de partager du contenu plus ciblé.

## ✨ **Fonctionnalités disponibles**

### 🔍 **Voir les communautés disponibles**
- Cliquer sur le bouton **"Rejoindre une communauté"** sous le bloc de création de post
- Le modal s'ouvre avec la liste des 8 communautés prédéfinies

### 🤝 **Rejoindre une communauté**
1. Cliquer sur une communauté dans la liste
2. Confirmer en cliquant sur **"Rejoindre"**
3. Un message de confirmation s'affiche : "Vous avez rejoint [Nom] ! 🎉"

### 🚪 **Quitter une communauté**
1. Cliquer sur une communauté dont vous êtes déjà membre
2. Confirmer en cliquant sur **"Quitter"**
3. Un message de confirmation s'affiche : "Vous avez quitté [Nom]"

### 📱 **Indicateurs visuels**
- **Communautés rejointes** : Affichées avec un badge "Membre" et une coche verte
- **Communautés non rejointes** : Affichées avec une icône "+" pour rejoindre
- **Header** : Affiche le nombre de communautés rejointes

## 🏷️ **Communautés disponibles**

| Communauté | Description | Icône | Couleur |
|------------|-------------|-------|---------|
| **Mamans célibataires** | Partage et soutien entre mamans célibataires | ❤️ | Rose |
| **Vente & Échange** | Vendre, acheter et échanger des articles pour bébé | 👜 | Vert |
| **Cuisine & Recettes** | Recettes et conseils culinaires pour toute la famille | 🍽️ | Orange |
| **Santé & Bien-être** | Conseils santé et bien-être pour mamans et enfants | 🏥 | Bleu |
| **Loisirs & Sorties** | Idées d'activités et sorties en famille | 😊 | Violet |
| **Conseils & Astuces** | Partage d'expériences et conseils pratiques | 💡 | Orange foncé |
| **Mode & Beauté** | Conseils mode et beauté pour mamans | 👕 | Rose foncé |
| **Éducation & École** | Soutien scolaire et conseils éducatifs | 🏫 | Bleu clair |

## 🚀 **Comment ça marche techniquement**

### 📊 **Base de données**
- **Table `communities`** : Stocke les informations des communautés
- **Table `community_members`** : Gère les membres de chaque communauté
- **Table `community_posts`** : Lie les posts aux communautés

### 🔐 **Sécurité**
- **Row Level Security (RLS)** activé sur toutes les tables
- Les utilisateurs ne peuvent voir que les membres de leurs communautés
- Chaque utilisateur peut uniquement gérer ses propres adhésions

### 🔄 **Fonctions SQL**
- `get_user_communities(user_uuid)` : Récupère les communautés d'un utilisateur
- `get_community_posts(comm_id)` : Récupère les posts d'une communauté

## 📱 **Interface utilisateur**

### 🎨 **Design**
- **Modal slide-up** depuis le bas de l'écran
- **Couleurs thématiques** pour chaque communauté
- **Badges visuels** pour les membres
- **États de chargement** et gestion d'erreurs

### 🎯 **Expérience utilisateur**
- **Feedback immédiat** lors des actions
- **Messages de confirmation** clairs
- **Gestion des erreurs** avec possibilité de réessayer
- **Indicateurs visuels** pour l'état des communautés

## 🔮 **Prochaines étapes prévues**

### 📝 **Publications ciblées**
- [ ] Permettre de publier dans des communautés spécifiques
- [ ] Filtrer le feed par communauté
- [ ] Notifications pour les nouvelles publications

### 👥 **Gestion des communautés**
- [ ] Créer de nouvelles communautés
- [ ] Modérer le contenu des communautés
- [ ] Statistiques des communautés

### 🔔 **Notifications**
- [ ] Alertes pour nouvelles publications
- [ ] Rappels d'événements communautaires
- [ ] Suggestions de communautés

## 🛠️ **Dépannage**

### ❌ **Erreurs courantes**
- **"Utilisateur non connecté"** : Vérifier la connexion
- **"Vous êtes déjà membre"** : La communauté est déjà rejoint
- **Erreur de chargement** : Utiliser le bouton "Réessayer"

### 🔧 **Solutions**
- **Redémarrer l'application** si les erreurs persistent
- **Vérifier la connexion internet** pour les opérations en ligne
- **Contacter le support** si le problème persiste

## 📞 **Support**

Pour toute question ou problème avec les Communautés :
- **Email** : support@entremeres.com
- **Chat** : Disponible dans l'application
- **Documentation** : Ce guide et la FAQ intégrée

---

*Les Communautés EntreMeres - Organisez vos centres d'intérêt, partagez vos expériences ! 🏘️✨* 