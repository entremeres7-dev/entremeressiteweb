# 🚀 DÉMARRER L'APPLICATION ICI

## ⚠️ IMPORTANT : Toujours démarrer depuis ce dossier !

Le dossier s'appelle **`appdemamans`** même si le nom dans package.json est "entremeresexpo".

## 📍 Commande à utiliser

```bash
cd /Users/mohamedmeskini/Desktop/Entremeres/appdemamans
```

OU depuis le dossier parent :

```bash
cd appdemamans
```

## ✅ Vérification

Pour vérifier que vous êtes au bon endroit :

```bash
pwd
# Doit afficher : /Users/mohamedmeskini/Desktop/Entremeres/appdemamans

ls package.json
# Doit afficher : package.json
```

## 🚀 Démarrer l'application

Une fois dans le bon dossier :

```bash
npm start
```

OU

```bash
npm install  # Si les dépendances ne sont pas installées
npm start
```

## 📝 Note

- **Nom du dossier** : `appdemamans`
- **Nom dans package.json** : `entremeresexpo`
- **C'est normal** : Le nom du dossier peut être différent du nom dans package.json

## ❌ Erreur à éviter

**NE PAS faire :**
```bash
cd /Users/mohamedmeskini/Desktop/Entremeres
npm start  # ❌ ERREUR : pas de package.json ici !
```

**FAIRE :**
```bash
cd /Users/mohamedmeskini/Desktop/Entremeres/appdemamans
npm start  # ✅ CORRECT
```
















