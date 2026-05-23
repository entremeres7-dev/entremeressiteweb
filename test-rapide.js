#!/usr/bin/env node

/**
 * ⚡ Test Ultra-Rapide des Notifications EntreMeres
 * 
 * Usage: node test-rapide.js
 * 
 * Ce script envoie immédiatement une notification de test
 * pour vérifier que tout fonctionne en production.
 */

const { supabase } = require('./supabaseClient');

async function testRapide() {
  console.log('⚡ Test ultra-rapide des notifications...\n');
  
  try {
    // 1. Trouver un utilisateur avec un appareil enregistré
    const { data: devices } = await supabase
      .from('push_devices')
      .select(`
        token,
        user_id,
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
    console.log(`📱 Token: ${device.token.substring(0, 20)}...`);
    
    // 2. Envoyer notification immédiatement
    const message = {
      to: device.token,
      title: 'EntreMeres',
      body: 'Test rapide - Notification reçue ! 🎉',
      sound: 'default',
      priority: 'high',
      data: { test: true, timestamp: Date.now() }
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
      console.log('   • Message "Test rapide - Notification reçue ! 🎉"');
      console.log('   • Son de notification');
    } else {
      console.log('❌ ÉCHEC - Erreur lors de l\'envoi');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.statusText}`);
    }
    
  } catch (error) {
    console.log('💥 ERREUR:', error.message);
  }
}

// Exécution immédiate
testRapide(); 