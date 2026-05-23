# 🔐 Configuration des Variables d'Environnement

## 📋 Instructions

Pour sécuriser votre application, vous devez configurer les variables d'environnement Supabase.

### Étape 1 : Créer le fichier .env

Créez un fichier `.env` à la racine du projet (`appdemamans/.env`) avec le contenu suivant :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-ici
```

### Étape 2 : Récupérer vos clés Supabase

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Étape 3 : Vérifier la configuration

Le fichier `.env` est déjà dans `.gitignore`, donc vos clés ne seront pas commitées.

### ⚠️ Important

- **Ne commitez JAMAIS** le fichier `.env` dans Git
- Le fichier `.env.example` sert de modèle (sans valeurs réelles)
- En production, configurez les variables dans votre plateforme de déploiement (EAS, etc.)

### 🔧 Alternative : Configuration dans app.config.js

Si vous préférez, vous pouvez aussi configurer les variables directement dans `app.config.js` :

```javascript
extra: {
  supabaseUrl: 'https://votre-projet.supabase.co',
  supabaseAnonKey: 'votre-clé-ici',
}
```

Mais cette méthode est **moins sécurisée** car les valeurs sont visibles dans le code.















