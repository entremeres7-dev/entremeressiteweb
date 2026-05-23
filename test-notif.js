#!/usr/bin/env node

/**
 * 🧪 Test Ultra-Simple des Notifications EntreMeres
 * 
 * Usage: node test-notif.js
 */

const { supabase } = require('./supabaseClient');

async function testNotif() {
  console.log('🚀 Test des notifications EntreMeres...\n');
  
  try {
    // 1. Trouver un utilisateur
    const { data: users } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(1);
    
    if (!users || users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    
    const user = users[0];
    console.log(`👤 Test avec: ${user.username}`);
    
    // 2. Vérifier l'appareil
    const { data: devices } = await supabase
      .from('push_devices')
      .select('token')
      .eq('user_id', user.id)
      .eq('env', 'prod');
    
    if (!devices || devices.length === 0) {
      console.log('❌ Aucun appareil enregistré');
      console.log('💡 Installez l\'app et connectez-vous d\'abord');
      return;
    }
    
    console.log(`📱 Appareil(s): ${devices.length}`);
    
    // 3. Envoyer notification
    const tokens = devices.map(d => d.token);
    const message = {
      to: tokens,
      title: 'EntreMeres',
      body: 'Test notification - Ça fonctionne ! 🎉',
      sound: 'default',
      priority: 'high'
    };
    
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    if (response.ok) {
      console.log('✅ Notification envoyée !');
      console.log('📱 Vérifiez votre appareil maintenant');
    } else {
      console.log('❌ Erreur envoi');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

testNotif(); 