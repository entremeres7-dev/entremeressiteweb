#!/usr/bin/env node

/**
 * 🧪 Test Simple des Notifications EntreMeres
 * 
 * Ce script teste rapidement si vos notifications fonctionnent
 * en envoyant une notification de test à un utilisateur.
 */

const { supabase } = require('./supabaseClient');

async function testSimpleNotification() {
  console.log('🚀 Test simple des notifications EntreMeres...\n');
  
  try {
    // 1. Récupérer un utilisateur de test
    console.log('👤 Récupération d\'un utilisateur de test...');
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.error('❌ Impossible de récupérer un utilisateur:', userError);
      return false;
    }
    
    const testUser = users[0];
    console.log(`✅ Utilisateur trouvé: ${testUser.username} (${testUser.id})`);
    
    // 2. Vérifier que l'appareil est enregistré
    console.log('\n📱 Vérification de l\'enregistrement de l\'appareil...');
    const { data: devices, error: deviceError } = await supabase
      .from('push_devices')
      .select('token, os, device_model')
      .eq('user_id', testUser.id)
      .eq('env', 'prod');
    
    if (deviceError) {
      console.error('❌ Erreur vérification appareil:', deviceError);
      return false;
    }
    
    if (!devices || devices.length === 0) {
      console.log('⚠️  Aucun appareil enregistré pour cet utilisateur');
      console.log('💡 Assurez-vous que l\'app est installée et connectée');
      return false;
    }
    
    console.log(`✅ Appareil(s) trouvé(s): ${devices.length}`);
    devices.forEach((device, index) => {
      console.log(`   ${index + 1}. ${device.os} - ${device.device_model}`);
    });
    
    // 3. Envoyer une notification de test
    console.log('\n📤 Envoi d\'une notification de test...');
    const tokens = devices.map(d => d.token);
    
    const messages = tokens.map(token => ({
      to: token,
      title: 'EntreMeres',
      body: 'Test de notification - Si vous voyez ceci, ça fonctionne ! 🎉',
      data: { 
        test: true, 
        timestamp: Date.now(),
        message: 'Test de notification EntreMeres'
      },
      sound: 'default',
      priority: 'high'
    }));
    
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(messages),
    });
    
    if (!response.ok) {
      console.error('❌ Erreur envoi notification:', response.status, response.statusText);
      return false;
    }
    
    const result = await response.json();
    console.log('✅ Notification envoyée avec succès !');
    
    // 4. Résumé
    console.log('\n' + '='.repeat(50));
    console.log('🎯 RÉSUMÉ DU TEST');
    console.log('='.repeat(50));
    console.log(`✅ Utilisateur: ${testUser.username}`);
    console.log(`✅ Appareils: ${devices.length}`);
    console.log(`✅ Notification: Envoyée`);
    console.log('\n📱 VÉRIFIEZ SUR VOTRE APPAREIL :');
    console.log('   • Vous devriez recevoir une notification');
    console.log('   • Titre: "EntreMeres"');
    console.log('   • Message: "Test de notification - Si vous voyez ceci, ça fonctionne ! 🎉"');
    console.log('   • Icône: Doit être l\'icône EntreMeres');
    console.log('   • Son: Doit faire du bruit');
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n⚠️  AVERTISSEMENTS:');
      result.errors.forEach(error => {
        console.log(`   • ${error.message}`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('\n💥 Erreur lors du test:', error);
    return false;
  }
}

// Exécution du test
if (require.main === module) {
  testSimpleNotification()
    .then((success) => {
      if (success) {
        console.log('\n🎉 Test terminé avec succès !');
        console.log('📱 Vérifiez maintenant votre appareil pour la notification');
      } else {
        console.log('\n❌ Test échoué. Vérifiez les logs ci-dessus.');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testSimpleNotification }; 