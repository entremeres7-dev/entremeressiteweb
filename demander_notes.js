// Script pour demander des notes sur l'App Store
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function demanderNotes() {
  console.log('⭐ Début demande de notes...');
  
  try {
    // 1. Récupérer les utilisateurs actifs et engagés
    const { data: tokens, error: tokensError } = await supabase
      .from('push_devices')
      .select('user_id, last_seen')
      .eq('is_active', true)
      .order('last_seen', { ascending: false });

    if (tokensError) {
      console.error('❌ Erreur récupération tokens:', tokensError);
      return;
    }

    console.log(`📱 ${tokens.length} utilisateurs actifs trouvés`);

    // 2. Filtrer les utilisateurs très actifs (dernières 3 jours)
    const activeUsers = tokens.filter(token => {
      const lastSeen = new Date(token.last_seen);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return lastSeen > threeDaysAgo;
    });

    console.log(`🟢 ${activeUsers.length} utilisateurs très actifs`);

    // 3. Envoyer les demandes de notes
    let successCount = 0;
    let errorCount = 0;

    for (const token of activeUsers) {
      try {
        const { data, error } = await supabase.functions.invoke('send-push', {
          body: {
            toUserId: token.user_id,
            title: "EntreMeres",
            body: "⭐ Aimez-vous EntreMeres ? Donnez-nous 5 étoiles sur l'App Store pour nous encourager !",
            data: {
              type: "rating_request",
              action: "rate_app"
            }
          }
        });

        if (error) {
          console.error(`❌ Erreur notification pour ${token.user_id}:`, error);
          errorCount++;
        } else {
          console.log(`✅ Demande de note envoyée à ${token.user_id}`);
          successCount++;
        }

        // Pause entre les notifications
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (err) {
        console.error(`❌ Erreur générale pour ${token.user_id}:`, err);
        errorCount++;
      }
    }

    console.log('🎉 Résumé des demandes de notes :');
    console.log(`✅ Succès: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📊 Total: ${activeUsers.length}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Fonction pour demander des avis détaillés
async function demanderAvis() {
  console.log('💬 Début demande d\'avis détaillés...');
  
  try {
    const { data: tokens, error: tokensError } = await supabase
      .from('push_devices')
      .select('user_id')
      .eq('is_active', true);

    if (tokensError) {
      console.error('❌ Erreur récupération tokens:', tokensError);
      return;
    }

    let successCount = 0;
    for (const token of tokens) {
      try {
        const { data, error } = await supabase.functions.invoke('send-push', {
          body: {
            toUserId: token.user_id,
            title: "EntreMeres",
            body: "💬 Votre avis compte ! Partagez votre expérience EntreMeres avec d'autres mamans.",
            data: {
              type: "feedback_request",
              action: "leave_review"
            }
          }
        });

        if (!error) {
          successCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (err) {
        console.error(`❌ Erreur pour ${token.user_id}:`, err);
      }
    }

    console.log(`✅ ${successCount} demandes d'avis envoyées`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter les fonctions
if (process.argv[2] === 'avis') {
  demanderAvis();
} else {
  demanderNotes();
}
