#!/usr/bin/env node

/**
 * ⚡ Test Immédiat des Notifications EntreMeres
 * 
 * Usage: node test-maintenant.js
 * 
 * Ce script teste vos notifications en 30 secondes !
 */

const { supabase } = require('./supabaseClient');

async function testMaintenant() {
  console.log('⚡ Test immédiat des notifications EntreMeres...\n');
  
  try {
    // 1. Trouver un appareil en production
    const { data: devices } = await supabase
      .from('push_devices')
      .select(`
        token,
        profils!inner(username)
      `)
      .eq('env', 'prod')
      .limit(1);
    
    if (!devices || devices.length === 0) {
      console.log('❌ Aucun appareil enregistré en production');
      console.log('💡 Installez l\'app et connectez-vous d\'abord');
      return;
    }
    
    const device = devices[0];
    console.log(`👤 Test avec: ${device.profils.username}`);
    
    // 2. Envoyer notification immédiatement
    const message = {
      to: device.token,
      title: 'EntreMeres',
      body: 'Test immédiat - Si vous voyez ceci, ça fonctionne ! 🎉',
      sound: 'default',
      priority: 'high'
    };
    
    console.log('\n📤 Envoi de la notification...');
    
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    if (response.ok) {
      console.log('✅ SUCCÈS ! Notification envoyée !');
      console.log('📱 Vérifiez votre appareil maintenant');
      console.log('\n🎯 Vous devriez voir :');
      console.log('   • Icône EntreMeres');
      console.log('   • Titre "EntreMeres"');
      console.log('   • Message "Test immédiat - Si vous voyez ceci, ça fonctionne ! 🎉"');
      console.log('   • Son de notification');
      
      console.log('\n🚀 VOS NOTIFICATIONS FONCTIONNENT EN PRODUCTION !');
      
    } else {
      console.log('❌ ÉCHEC - Erreur lors de l\'envoi');
      console.log(`   Status: ${response.status}`);
    }
    
  } catch (error) {
    console.log('💥 ERREUR:', error.message);
  }
}

// Exécution immédiate
testMaintenant(); 