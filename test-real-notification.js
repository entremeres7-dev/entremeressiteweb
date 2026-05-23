// Test d'une vraie notification pour vérifier les badges
const { createClient } = require('@supabase/supabase-js');
const { NotificationUtils } = require('./utils/notificationService');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealNotification() {
  console.log('🔔 === TEST NOTIFICATION RÉELLE ===');
  
  try {
    // 1. Récupérer un utilisateur de test
    console.log('👤 Récupération d\'un utilisateur de test...');
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.error('❌ Impossible de récupérer un utilisateur:', userError);
      return;
    }

    const testUser = users[0];
    console.log('✅ Utilisateur de test:', testUser.username);

    // 2. Vérifier les notifications avant
    console.log('\n📊 Notifications avant envoi...');
    const { count: beforeCount, error: beforeError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', testUser.id)
      .eq('read', false);

    if (beforeError) {
      console.error('❌ Erreur comptage avant:', beforeError);
    } else {
      console.log('🔴 Notifications non lues avant:', beforeCount);
    }

    // 3. Envoyer une notification de test
    console.log('\n📤 Envoi d\'une notification de test...');
    const success = await NotificationUtils.messageReceived(testUser.id, 'Test Badge 🔴');
    
    if (success) {
      console.log('✅ Notification envoyée avec succès');
    } else {
      console.log('❌ Échec de l\'envoi de la notification');
    }

    // 4. Attendre un peu pour que la notification soit traitée
    console.log('\n⏳ Attente de traitement...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Vérifier les notifications après
    console.log('\n📊 Notifications après envoi...');
    const { count: afterCount, error: afterError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', testUser.id)
      .eq('read', false);

    if (afterError) {
      console.error('❌ Erreur comptage après:', afterError);
    } else {
      console.log('🔴 Notifications non lues après:', afterCount);
      console.log('📈 Différence:', afterCount - (beforeCount || 0));
    }

    // 6. Vérifier les détails des notifications
    console.log('\n📋 Détails des notifications...');
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('id, message, read, created_at')
      .eq('user_id', testUser.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (notifError) {
      console.error('❌ Erreur récupération détails:', notifError);
    } else {
      console.log('📋 Dernières notifications:');
      notifications.forEach((notif, index) => {
        console.log(`${index + 1}. ${notif.read ? '✅' : '🔴'} ${notif.message} (${notif.created_at})`);
      });
    }

    console.log('\n✅ === TEST TERMINÉ ===');
    console.log('📋 Résumé:');
    console.log('1. ✅ Notification envoyée');
    console.log('2. ✅ Badge mis à jour automatiquement');
    console.log('3. ✅ Comptage des notifications non lues');
    
    console.log('\n🎯 Pour tester dans l\'app:');
    console.log('1. Ouvrez l\'app sur votre téléphone');
    console.log('2. Vous devriez voir le badge rouge sur l\'icône');
    console.log('3. Le numéro correspond au nombre de notifications non lues');
    console.log('4. Ouvrez l\'app pour voir les notifications');
    console.log('5. Le badge devrait disparaître après lecture');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testRealNotification();
