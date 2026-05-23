// Script de test pour l'email de bienvenue
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testWelcomeEmail() {
  console.log('🧪 Test du système d\'email de bienvenue...')
  
  try {
    // Test 1: Appel direct de la fonction Edge
    console.log('\n1️⃣ Test appel direct de la fonction Edge...')
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        user_id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'Marie'
      }
    })
    
    if (error) {
      console.error('❌ Erreur appel fonction:', error)
    } else {
      console.log('✅ Fonction appelée avec succès:', data)
    }
    
    // Test 2: Vérifier la queue d'emails
    console.log('\n2️⃣ Test de la queue d\'emails...')
    
    const { data: queueData, error: queueError } = await supabase
      .from('welcome_email_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (queueError) {
      console.error('❌ Erreur récupération queue:', queueError)
    } else {
      console.log('✅ Queue d\'emails:', queueData)
    }
    
    // Test 3: Simuler une inscription (nécessite des permissions admin)
    console.log('\n3️⃣ Test simulation inscription...')
    console.log('ℹ️ Pour tester l\'inscription complète, créez un nouvel utilisateur via l\'app')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Fonction pour tester manuellement l'envoi d'email
async function sendTestWelcomeEmail(email, firstName = 'Maman') {
  console.log(`📧 Envoi d'email de test à ${email}...`)
  
  try {
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        user_id: 'test-' + Date.now(),
        email: email,
        first_name: firstName
      }
    })
    
    if (error) {
      console.error('❌ Erreur envoi email:', error)
      return false
    } else {
      console.log('✅ Email envoyé avec succès:', data)
      return true
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
    return false
  }
}

// Instructions d'utilisation
console.log(`
🚀 Système d'email de bienvenue EntreMeres

📋 Instructions de configuration:

1️⃣ Configurez Resend:
   - Créez un compte sur https://resend.com
   - Générez une API key
   - Ajoutez RESEND_API_KEY dans vos variables d'environnement Supabase

2️⃣ Déployez la fonction Edge:
   - supabase functions deploy send-welcome-email

3️⃣ Exécutez le script SQL:
   - Exécutez create_welcome_email_trigger.sql dans votre base de données

4️⃣ Testez le système:
   - node test-welcome-email.js
   - Ou appelez sendTestWelcomeEmail('votre-email@example.com', 'Votre Prénom')

📧 L'email sera envoyé automatiquement à chaque nouvelle inscription !
`)

// Exporter les fonctions pour utilisation
export { testWelcomeEmail, sendTestWelcomeEmail }

// Exécuter le test si le script est lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testWelcomeEmail()
}
