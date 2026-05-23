# ⚙️ Configuration Supabase - Réinitialisation de Mot de Passe

## ✅ Checklist de Configuration

Vous devez configurer **3 choses** dans votre Dashboard Supabase pour que la réinitialisation de mot de passe fonctionne :

---

## 1️⃣ **Configurer l'URL de Redirection** (OBLIGATOIRE)

Cette étape est **ESSENTIELLE** pour que le deep link fonctionne.

### Étapes :

1. Connectez-vous à [Dashboard Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Authentication** → **URL Configuration**
4. Dans la section **Redirect URLs**, ajoutez :
   ```
   entremeres://reset-password
   ```
5. Cliquez sur **Save**

⚠️ **Important** : Sans cette configuration, le lien dans l'email ne pourra pas ouvrir l'app.

---

## 2️⃣ **Configurer le Template d'Email** (Recommandé)

Personnalisez l'email de réinitialisation pour qu'il soit en français et professionnel.

### Étapes :

1. Dans Supabase, allez dans **Authentication** → **Email Templates**
2. Cliquez sur **Reset Password**
3. Dans l'onglet **HTML**, vérifiez que le template contient :
   ```html
   <a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a>
   ```
4. **Sujet de l'email** : 
   ```
   Réinitialisation de votre mot de passe - EntreMeres
   ```
5. Cliquez sur **Save**

💡 **Note** : Si vous voulez un template personnalisé, consultez `docs/RESET_PASSWORD_EMAIL_TEMPLATE.html`

---

## 3️⃣ **Activer l'Envoi d'Emails** (Vérification)

Assurez-vous que l'envoi d'emails est activé.

### Étapes :

1. Allez dans **Authentication** → **Settings**
2. Vérifiez que ces options sont activées :
   - ✅ **Enable email confirmations**
   - ✅ **Enable email change confirmations**
3. Si vous utilisez un service SMTP externe, configurez-le dans **Settings** → **SMTP Settings**

---

## 🧪 Test Rapide

Après configuration, testez :

1. Dans l'app, cliquez sur "Mot de passe oublié ?"
2. Entrez votre email
3. Vérifiez que vous recevez l'email
4. Cliquez sur le lien dans l'email
5. L'app devrait s'ouvrir sur l'écran de réinitialisation

---

## 🚨 Problèmes Courants

### ❌ L'email n'arrive pas

**Solutions :**
- Vérifiez les **spams/courriers indésirables**
- Vérifiez les logs dans **Logs** → **Auth Logs** dans Supabase
- Si vous utilisez le SMTP par défaut de Supabase, il y a des limites (voir [Documentation Supabase](https://supabase.com/docs/guides/auth/auth-smtp))

### ❌ Le lien dans l'email ne fonctionne pas

**Solutions :**
- Vérifiez que l'URL de redirection `entremeres://reset-password` est bien ajoutée dans **Authentication** → **URL Configuration**
- Vérifiez que le scheme `entremeres://` est bien configuré dans `app.json` (déjà fait ✅)

### ❌ Erreur "Invalid token" ou "Token expired"

**Solutions :**
- Les tokens expirent après 1 heure
- Demandez un nouveau lien de réinitialisation
- Vérifiez que le lien n'a pas été utilisé plusieurs fois

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `docs/RESET_PASSWORD_SETUP.md` - Guide complet
- `docs/CONFIGURER_EMAIL_RESET_PASSWORD.md` - Personnalisation de l'email

---

## ✅ Résumé

**Actions requises :**
1. ✅ Ajouter `entremeres://reset-password` dans **Redirect URLs**
2. ✅ Vérifier/Configurer le template d'email **Reset Password**
3. ✅ Vérifier que l'envoi d'emails est activé

**Temps estimé :** 5 minutes

Une fois ces 3 étapes faites, tout devrait fonctionner ! 🎉






