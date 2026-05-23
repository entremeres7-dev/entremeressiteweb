// Test du système de badges
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBadgeSystem() {
  console.log('🔴 === TEST SYSTÈME DE BADGES ===');
  
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

    // 2. Vérifier les notifications existantes
    console.log('\n📊 Vérification des notifications existantes...');
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('id, read, created_at')
      .eq('user_id', testUser.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (notifError) {
      console.error('❌ Erreur récupération notifications:', notifError);
    } else {
      console.log('📋 Notifications trouvées:', notifications.length);
      const unreadCount = notifications.filter(n => !n.read).length;
      console.log('🔴 Notifications non lues:', unreadCount);
    }

    // 3. Simuler l'ajout d'une notification
    console.log('\n➕ Simulation ajout notification...');
    const { data: newNotification, error: insertError } = await supabase
      .from('notifications')
      .insert({
        user_id: testUser.id,
        type: 'test',
        message: 'Ceci est un test de badge 🔴',
        read: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erreur insertion notification:', insertError);
    } else {
      console.log('✅ Notification de test créée:', newNotification.id);
    }

    // 4. Vérifier le nouveau compteur
    console.log('\n🔢 Vérification du nouveau compteur...');
    const { count: newCount, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', testUser.id)
      .eq('read', false);

    if (countError) {
      console.error('❌ Erreur comptage:', countError);
    } else {
      console.log('🔴 Nouveau nombre de notifications non lues:', newCount);
    }

    // 5. Simuler la lecture d'une notification
    console.log('\n👁️ Simulation lecture notification...');
    if (newNotification) {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', newNotification.id);

      if (updateError) {
        console.error('❌ Erreur marquage comme lue:', updateError);
      } else {
        console.log('✅ Notification marquée comme lue');
      }
    }

    console.log('\n✅ === TEST TERMINÉ ===');
    console.log('📋 Résumé du système de badges:');
    console.log('1. 🔴 Comptage automatique des notifications non lues');
    console.log('2. 📱 Mise à jour du badge sur l\'icône de l\'app');
    console.log('3. 👁️ Marquage comme lue et mise à jour du badge');
    console.log('4. 🔄 Synchronisation avec les notifications push');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testBadgeSystem();
