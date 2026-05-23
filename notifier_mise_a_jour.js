// Script pour notifier les utilisateurs de la mise à jour
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function notifierMiseAJour() {
  console.log('🚀 Début notification de mise à jour...');
  
  try {
    // 1. Récupérer tous les utilisateurs avec des tokens actifs
    const { data: tokens, error: tokensError } = await supabase
      .from('push_devices')
      .select('user_id, last_seen')
      .eq('is_active', true)
      .order('last_seen', { ascending: false });

    if (tokensError) {
      console.error('❌ Erreur récupération tokens:', tokensError);
      return;
    }

    console.log(`📱 ${tokens.length} utilisateurs avec tokens actifs trouvés`);

    // 2. Filtrer les utilisateurs connectés récemment (dernières 7 jours)
    const recentUsers = tokens.filter(token => {
      const lastSeen = new Date(token.last_seen);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastSeen > sevenDaysAgo;
    });

    console.log(`🟢 ${recentUsers.length} utilisateurs connectés récemment`);

    // 3. Envoyer les notifications de mise à jour
    let successCount = 0;
    let errorCount = 0;

    for (const token of recentUsers) {
      try {
        const { data, error } = await supabase.functions.invoke('send-push', {
          body: {
            toUserId: token.user_id,
            title: "EntreMeres",
            body: "🎉 Nouvelle version disponible ! Découvrez les nouvelles fonctionnalités et améliorez votre expérience EntreMeres.",
            data: {
              type: "app_update",
              action: "update_available"
            }
          }
        });

        if (error) {
          console.error(`❌ Erreur notification pour ${token.user_id}:`, error);
          errorCount++;
        } else {
          console.log(`✅ Notification envoyée à ${token.user_id}`);
          successCount++;
        }

        // Pause entre les notifications pour éviter le spam
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        console.error(`❌ Erreur générale pour ${token.user_id}:`, err);
        errorCount++;
      }
    }

    console.log('🎉 Résumé des notifications :');
    console.log(`✅ Succès: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📊 Total: ${recentUsers.length}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Fonction pour notifier d'une nouvelle fonctionnalité
async function notifierNouvelleFonctionnalite(featureName) {
  console.log(`🚀 Notification nouvelle fonctionnalité: ${featureName}`);
  
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
            body: `✨ Nouvelle fonctionnalité : ${featureName} ! Mettez à jour l'app pour en profiter.`,
            data: {
              type: "new_feature",
              feature: featureName
            }
          }
        });

        if (!error) {
          successCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        console.error(`❌ Erreur pour ${token.user_id}:`, err);
      }
    }

    console.log(`✅ ${successCount} notifications envoyées pour ${featureName}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter les fonctions
if (process.argv[2] === 'feature') {
  const featureName = process.argv[3] || 'Notifications Push';
  notifierNouvelleFonctionnalite(featureName);
} else {
  notifierMiseAJour();
}
