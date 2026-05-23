# 🚨 URGENT : Créer le fichier .env

## ⚠️ Erreur Actuelle

L'application ne peut pas démarrer car le fichier `.env` est manquant.

## ✅ Solution Rapide

### Étape 1 : Créer le fichier .env

Créez un fichier nommé `.env` à la racine du projet (`appdemamans/.env`) avec ce contenu :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-ici
```

### Étape 2 : Remplacer par vos vraies valeurs

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → remplacez `https://votre-projet.supabase.co`
   - **anon public** key → remplacez `votre-clé-anon-ici`

### Étape 3 : Redémarrer l'application

Après avoir créé le fichier `.env`, redémarrez votre serveur de développement :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm start
# ou
expo start
```

## 📝 Exemple de fichier .env

```env
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.exemple
```

## ⚠️ Important

- **Ne commitez JAMAIS** le fichier `.env` dans Git (il est déjà dans `.gitignore`)
- Gardez vos clés secrètes et ne les partagez pas

## 🔧 Alternative Temporaire (DÉVELOPPEMENT UNIQUEMENT)

Si vous avez besoin de tester rapidement, vous pouvez temporairement mettre les valeurs directement dans `app.config.js` :

```javascript
extra: {
  supabaseUrl: 'https://votre-projet.supabase.co',
  supabaseAnonKey: 'votre-clé-ici',
}
```

⚠️ **Ne faites cela QUE pour le développement local. En production, utilisez toujours les variables d'environnement.**















