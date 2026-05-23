#!/usr/bin/env node

/**
 * 🎯 Test Final Complet des Notifications EntreMeres
 * 
 * Ce script combine tous les tests en un seul pour une vérification complète
 * 
 * Usage: node test-final.js
 */

const { supabase } = require('./supabaseClient');

async function testFinal() {
  console.log('🎯 Test Final Complet des Notifications EntreMeres\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Vérification de la base de données
    console.log('🔍 ÉTAPE 1: Vérification de la base de données...');
    
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.log('❌ ERREUR: Impossible de récupérer des utilisateurs');
      console.log('💡 Vérifiez votre connexion à la base de données');
      return false;
    }
    
    const testUser = users[0];
    console.log(`✅ Utilisateur trouvé: ${testUser.username} (${testUser.id})`);
    
    // 2. Vérification des appareils enregistrés
    console.log('\n📱 ÉTAPE 2: Vérification des appareils...');
    
    const { data: devices, error: deviceError } = await supabase
      .from('push_devices')
      .select('token, os, device_model, env, project_id')
      .eq('user_id', testUser.id)
      .eq('env', 'prod');
    
    if (deviceError) {
      console.log('❌ ERREUR: Impossible de vérifier les appareils');
      return false;
    }
    
    if (!devices || devices.length === 0) {
      console.log('❌ ERREUR: Aucun appareil enregistré en production');
      console.log('💡 Assurez-vous que l\'app est installée et connectée');
      return false;
    }
    
    console.log(`✅ Appareil(s) trouvé(s): ${devices.length}`);
    devices.forEach((device, index) => {
      console.log(`   ${index + 1}. ${device.os} - ${device.device_model}`);
      console.log(`      Token: ${device.token.substring(0, 30)}...`);
      console.log(`      Projet: ${device.project_id}`);
    });
    
    // 3. Test de notification simple
    console.log('\n📤 ÉTAPE 3: Test de notification simple...');
    
    const simpleTest = await testNotificationSimple(devices[0].token);
    if (!simpleTest) {
      console.log('❌ ERREUR: Test simple échoué');
      return false;
    }
    
    // 4. Test de tous les types
    console.log('\n🧪 ÉTAPE 4: Test de tous les types de notifications...');
    
    const allTypesTest = await testAllTypes(devices[0].token);
    if (!allTypesTest) {
      console.log('❌ ERREUR: Test des types échoué');
      return false;
    }
    
    // 5. Résumé final
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TEST FINAL TERMINÉ AVEC SUCCÈS !');
    console.log('='.repeat(60));
    console.log(`✅ Utilisateur: ${testUser.username}`);
    console.log(`✅ Appareils: ${devices.length}`);
    console.log(`✅ Test simple: Réussi`);
    console.log(`✅ Test types: Réussi`);
    
    console.log('\n📱 VÉRIFICATIONS FINALES SUR VOTRE APPAREIL :');
    console.log('   • Vous devriez avoir reçu 6 notifications au total');
    console.log('   • 1 notification simple + 5 notifications de types différents');
    console.log('   • Chaque notification doit avoir l\'icône EntreMeres');
    console.log('   • Le titre doit être "EntreMeres"');
    console.log('   • Les messages doivent contenir des emojis');
    console.log('   • Les notifications doivent faire du son');
    
    console.log('\n🎯 TYPES TESTÉS :');
    console.log('   1. Test simple: "Test notification - Ça fonctionne ! 🎉"');
    console.log('   2. Message: "Sophie vous a envoyé un message 💌"');
    console.log('   3. Like: "Emma a liké votre post ❤️"');
    console.log('   4. Commentaire: "Julie a commenté votre post 💬"');
    console.log('   5. Demande d\'ami: "Camille souhaite devenir votre amie 👋"');
    console.log('   6. Nouvelle story: "Léa a partagé une nouvelle story 📱"');
    
    console.log('\n🚀 VOS NOTIFICATIONS FONCTIONNENT PARFAITEMENT EN PRODUCTION !');
    
    return true;
    
  } catch (error) {
    console.error('\n💥 ERREUR FATALE:', error);
    return false;
  }
}

async function testNotificationSimple(token) {
  try {
    const message = {
      to: token,
      title: 'EntreMeres',
      body: 'Test notification - Ça fonctionne ! 🎉',
      sound: 'default',
      priority: 'high',
      data: { test: 'simple', timestamp: Date.now() }
    };
    
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    if (response.ok) {
      console.log('   ✅ Test simple réussi');
      return true;
    } else {
      console.log(`   ❌ Test simple échoué (${response.status})`);
      return false;
    }
    
  } catch (error) {
    console.log(`   💥 Test simple erreur: ${error.message}`);
    return false;
  }
}

async function testAllTypes(token) {
  const tests = [
    {
      name: 'Message',
      body: 'Sophie vous a envoyé un message 💌',
      data: { type: 'message', sender: 'Sophie' }
    },
    {
      name: 'Like',
      body: 'Emma a liké votre post ❤️',
      data: { type: 'like', sender: 'Emma' }
    },
    {
      name: 'Commentaire',
      body: 'Julie a commenté votre post 💬',
      data: { type: 'comment', sender: 'Julie' }
    },
    {
      name: 'Demande d\'ami',
      body: 'Camille souhaite devenir votre amie 👋',
      data: { type: 'friend_request', sender: 'Camille' }
    },
    {
      name: 'Nouvelle story',
      body: 'Léa a partagé une nouvelle story 📱',
      data: { type: 'story', sender: 'Léa' }
    }
  ];
  
  let successCount = 0;
  
  for (const test of tests) {
    try {
      const message = {
        to: token,
        title: 'EntreMeres',
        body: test.body,
        sound: 'default',
        priority: 'high',
        data: { ...test.data, test: true, timestamp: Date.now() }
      };
      
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      
      if (response.ok) {
        console.log(`   ✅ ${test.name}: Réussi`);
        successCount++;
      } else {
        console.log(`   ❌ ${test.name}: Échoué (${response.status})`);
      }
      
      // Attendre entre chaque notification
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.log(`   💥 ${test.name}: Erreur - ${error.message}`);
    }
  }
  
  console.log(`   📊 Résultat: ${successCount}/${tests.length} types testés avec succès`);
  return successCount === tests.length;
}

// Exécution du test final
if (require.main === module) {
  testFinal()
    .then((success) => {
      if (success) {
        console.log('\n🎉 Test final terminé avec succès !');
        console.log('📱 Vérifiez maintenant votre appareil pour toutes les notifications');
        process.exit(0);
      } else {
        console.log('\n❌ Test final échoué. Vérifiez les logs ci-dessus.');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testFinal }; 