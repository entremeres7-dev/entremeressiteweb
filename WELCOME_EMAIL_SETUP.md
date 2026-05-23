# 📧 Configuration Email de Bienvenue - EntreMeres

## 🎯 Vue d'ensemble

Système d'envoi automatique d'emails de bienvenue après l'inscription des utilisateurs.

## 🏗️ Architecture

### 1. **Edge Function** (`send-welcome-email`)
- Envoie l'email via Resend API
- Template HTML personnalisé
- Gestion d'erreurs complète

### 2. **Database Trigger** (`create_welcome_email_trigger.sql`)
- Se déclenche automatiquement après inscription
- Deux méthodes : trigger direct + queue de fallback
- Gestion des retry en cas d'échec

### 3. **Service Resend**
- Service d'email moderne et fiable
- Templates HTML supportés
- Analytics et tracking

## ⚙️ Configuration

### 1. **Créer un compte Resend**
```bash
# 1. Aller sur https://resend.com
# 2. Créer un compte
# 3. Générer une API key
# 4. Configurer le domaine d'envoi
```

### 2. **Configurer les variables d'environnement Supabase**
```bash
# Dans le dashboard Supabase > Settings > Edge Functions
RESEND_API_KEY=re_xxxxxxxxxxxxx
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. **Déployer la fonction Edge**
```bash
# Dans le terminal
cd EntreMeresExpo
supabase functions deploy send-welcome-email
```

### 4. **Exécuter le script SQL**
```sql
-- Dans le SQL Editor de Supabase
-- Exécuter le contenu de create_welcome_email_trigger.sql
```

## 🧪 Tests

### 1. **Test manuel**
```javascript
// Dans test-welcome-email.js
import { sendTestWelcomeEmail } from './test-welcome-email.js'

// Tester l'envoi
await sendTestWelcomeEmail('votre-email@example.com', 'Votre Prénom')
```

### 2. **Test d'inscription**
1. Créer un nouvel utilisateur via l'app
2. Vérifier que l'email arrive
3. Contrôler les logs dans Supabase

## 📧 Template Email

L'email inclut :
- ✨ Design responsive et moderne
- 🎨 Couleurs de la marque EntreMeres
- 📱 Compatible mobile
- 🔗 Liens vers l'app
- 💼 Présentation de JobMoms
- 📞 Informations de contact

## 🔧 Personnalisation

### Modifier le template
Éditer le contenu HTML dans `send-welcome-email/index.ts` :

```typescript
const emailHTML = `
<!DOCTYPE html>
<html>
  <!-- Votre template personnalisé -->
</html>
`
```

### Ajouter des variables
```typescript
const userName = profile?.first_name || first_name || 'Maman'
const customMessage = `Message personnalisé pour ${userName}`
```

## 📊 Monitoring

### Logs Supabase
- Edge Functions > Logs
- Vérifier les erreurs d'envoi
- Contrôler les performances

### Queue d'emails
```sql
-- Voir les emails en attente
SELECT * FROM welcome_email_queue 
WHERE sent_at IS NULL 
ORDER BY created_at DESC;

-- Voir les statistiques
SELECT 
  COUNT(*) as total,
  COUNT(sent_at) as sent,
  COUNT(*) - COUNT(sent_at) as pending
FROM welcome_email_queue;
```

## 🚨 Dépannage

### Email non reçu
1. Vérifier les logs Supabase
2. Contrôler la configuration Resend
3. Vérifier le dossier spam
4. Tester avec un autre email

### Erreur de fonction
1. Vérifier les variables d'environnement
2. Contrôler les permissions Resend
3. Vérifier la configuration du domaine

### Trigger ne se déclenche pas
1. Vérifier que le script SQL est exécuté
2. Contrôler les permissions de la base
3. Tester manuellement la fonction

## 📈 Améliorations futures

- [ ] Templates multiples selon le type d'utilisateur
- [ ] Emails de suivi (onboarding)
- [ ] Analytics détaillées
- [ ] A/B testing des templates
- [ ] Intégration avec d'autres services email

## 🎉 Résultat

Chaque nouvelle inscription déclenche automatiquement :
1. ✅ Création du profil utilisateur
2. ✅ Envoi de l'email de bienvenue
3. ✅ Notification de succès dans les logs
4. ✅ Retry automatique en cas d'échec

**Le système est maintenant opérationnel !** 🚀
