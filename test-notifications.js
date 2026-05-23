const { testProductionNotifications, testCustomNotification } = require('./services/test-push.ts');

/**
 * Script de test des notifications EntreMeres
 * 
 * Pour tester :
 * 1. Assurez-vous que votre app est installée sur un appareil
 * 2. Connectez-vous avec un compte utilisateur
 * 3. Exécutez ce script
 * 4. Vérifiez que vous recevez les notifications avec :
 *    - L'icône EntreMeres
 *    - Le titre "EntreMeres"
 *    - Les messages de test
 */

async function runTests() {
  console.log('🚀 Démarrage des tests de notifications EntreMeres...\n');
  
  try {
    // Test 1: Tests complets des notifications
    console.log('='.repeat(50));
    console.log('🧪 TEST COMPLET DES NOTIFICATIONS');
    console.log('='.repeat(50));
    
    const success = await testProductionNotifications();
    
    if (success) {
      console.log('\n✅ Tests terminés avec succès !');
      console.log('\n📱 VÉRIFICATIONS À FAIRE SUR VOTRE APPAREIL :');
      console.log('   • Vérifiez que vous recevez 5 notifications');
      console.log('   • Chaque notification doit avoir l\'icône EntreMeres');
      console.log('   • Le titre doit être "EntreMeres"');
      console.log('   • Les messages doivent contenir des emojis');
      console.log('   • Les notifications doivent faire du son');
      
      console.log('\n🔧 EN CAS DE PROBLÈME :');
      console.log('   • Vérifiez que les notifications sont activées dans les paramètres');
      console.log('   • Vérifiez que l\'app est autorisée à envoyer des notifications');
      console.log('   • Redémarrez l\'app si nécessaire');
      
    } else {
      console.log('\n❌ Tests échoués. Vérifiez les logs ci-dessus.');
    }
    
  } catch (error) {
    console.error('\n💥 Erreur fatale lors des tests:', error);
  }
}

// Test personnalisé (optionnel)
async function testCustom() {
  console.log('\n' + '='.repeat(50));
  console.log('🎯 TEST PERSONNALISÉ');
  console.log('='.repeat(50));
  
  // Remplacez par l'ID d'un utilisateur réel de votre base
  const testUserId = 'VOTRE_USER_ID_ICI';
  
  if (testUserId === 'VOTRE_USER_ID_ICI') {
    console.log('⚠️  Modifiez testUserId avec un vrai ID utilisateur');
    return;
  }
  
  try {
    await testCustomNotification(
      testUserId,
      'EntreMeres Test',
      'Ceci est un test personnalisé de notification 🧪'
    );
  } catch (error) {
    console.error('❌ Erreur test personnalisé:', error);
  }
}

// Exécution des tests
if (require.main === module) {
  runTests().then(() => {
    console.log('\n🎉 Script terminé !');
    process.exit(0);
  }).catch((error) => {
    console.error('\n💥 Erreur:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testCustom }; 