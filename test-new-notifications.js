// Test des nouvelles notifications push
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewNotifications() {
  console.log('🧪 === TEST NOUVELLES NOTIFICATIONS ===');
  
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

    // 2. Test notification rappel mission
    console.log('\n🎯 Test notification rappel mission...');
    const { data: missionData, error: missionError } = await supabase
      .from('mission_participations')
      .select('mission_id')
      .eq('user_id', testUser.id)
      .order('completed_at', { ascending: false })
      .limit(1);

    if (missionData && missionData.length > 0) {
      const missionId = missionData[0].mission_id;
      const missionTitles = {
        'monday-breakfast': 'Maman du Lundi',
        'tuesday-tip': 'Astuce Express',
        'wednesday-moment': 'Moment Magique',
        'thursday-recipe': 'Recette Express',
        'friday-selfcare': 'Self-Care Maman',
        'saturday-outing': 'Sortie Famille',
        'sunday-reflection': 'Réflexion Maman'
      };
      
      const missionTitle = missionTitles[missionId] || 'Mission du jour';
      console.log('📋 Mission trouvée:', missionTitle);
      
      // Simuler l'envoi de la notification
      console.log('📤 Envoi notification rappel mission...');
      console.log(`Message: "Mission du jour disponible ! 🎯 ${missionTitle} vous attend"`);
    } else {
      console.log('⚠️ Aucune mission trouvée pour cet utilisateur');
    }

    // 3. Test notification mise à jour app
    console.log('\n🚀 Test notification mise à jour app...');
    const currentVersion = '1.2.0';
    const newVersion = '1.3.0';
    
    console.log('📱 Version actuelle:', currentVersion);
    console.log('🆕 Nouvelle version:', newVersion);
    console.log('📤 Envoi notification mise à jour...');
    console.log(`Message: "Nouvelle version disponible ! 🚀 Version ${newVersion}"`);

    console.log('\n✅ === TESTS TERMINÉS ===');
    console.log('📋 Résumé des nouvelles notifications:');
    console.log('1. 🎯 Rappel mission du jour');
    console.log('2. 🚀 Notification mise à jour app');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testNewNotifications();
