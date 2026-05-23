#!/usr/bin/env node

/**
 * 🧪 Test spécifique pour la fonction send-push
 * Utilise le userId fourni: 6b3206d7-c247-45c9-99dd-5894c9e1ec14
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

// UserId spécifique
const TARGET_USER_ID = '6b3206d7-c247-45c9-99dd-5894c9e1ec14';

async function testSendPushWithSpecificUser() {
  try {
    console.log('🔍 Vérification de l\'utilisateur...');
    
         // 1. Vérifier que l'utilisateur existe et a un token
     const { data: devices, error } = await supabase
       .from('push_devices')
       .select('user_id, token, env, project_id')
       .eq('user_id', TARGET_USER_ID)
       .eq('env', 'prod');

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    if (!devices || devices.length === 0) {
      console.log('⚠️ Aucun appareil actif trouvé pour cet utilisateur');
      console.log('💡 Assurez-vous que l\'app est installée et connectée avec ce compte');
      return;
    }

         const device = devices[0];
     
          console.log(`✅ Utilisateur trouvé: ${TARGET_USER_ID}`);
     console.log(`📱 Token: ${device.token.substring(0, 20)}...`);
     console.log(`🔗 Environnement: ${device.env}`);
     console.log(`🔗 Project ID: ${device.project_id}`);

    // 2. Tester la fonction send-push
    console.log('\n📤 Test de la fonction send-push...');
    
    const testPayload = {
      toUserId: TARGET_USER_ID,
      title: 'EntreMeres',
      body: 'Test de la fonction send-push avec userId spécifique ! 🎉',
      data: {
        type: 'test_specific',
        screen: 'feed',
        timestamp: new Date().toISOString()
      }
    };

    console.log('📋 Payload envoyé:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch('https://turljvlvqkbcqtvljvly.supabase.co/functions/v1/send-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();
    
    console.log('\n📊 Résultat de la fonction:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Fonction send-push exécutée avec succès');
      
      if (result.ok) {
        console.log('🎉 Notification envoyée ! Vérifiez votre appareil');
        console.log('📱 Vous devriez recevoir une notification avec:');
        console.log('   - Titre: EntreMeres');
        console.log('   - Message: Test de la fonction send-push avec userId spécifique ! 🎉');
      } else {
        console.log('⚠️ Fonction OK mais notification non envoyée');
        console.log('Raison:', result.reason || 'Inconnue');
      }
    } else {
      console.error('❌ Erreur fonction send-push:', result);
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

// Exécution
console.log('🧪 === TEST SEND-PUSH AVEC USERID SPÉCIFIQUE ===\n');
testSendPushWithSpecificUser();
