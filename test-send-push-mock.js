#!/usr/bin/env node

/**
 * 🧪 Test de la fonction send-push avec un token fictif
 * Pour tester la logique de la fonction sans appareil réel
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

// UserId spécifique
const TARGET_USER_ID = '6b3206d7-c247-45c9-99dd-5894c9e1ec14';

async function testSendPushWithMockToken() {
  try {
    console.log('🧪 === TEST SEND-PUSH AVEC TOKEN FICTIF ===\n');
    
    // 1. Créer un token fictif pour l'utilisateur
    console.log('📝 Création d\'un token fictif pour les tests...');
    
    const mockToken = 'ExponentPushToken[TEST_TOKEN_FOR_TESTING_PURPOSES_ONLY]';
    const mockDevice = {
      user_id: TARGET_USER_ID,
      device_id: 'test-device-123',
      token: mockToken,
      os: 'ios',
      env: 'prod',
      project_id: '9f24c677-ba0e-4c73-b4c3-a986201b2cec',
      bundle_id: 'com.entremeres.app',
      app_version: '1.0.0',
      device_model: 'iPhone Test'
    };

    // Insérer le token fictif
    const { error: insertError } = await supabase
      .from('push_devices')
      .upsert(mockDevice, { onConflict: 'user_id,device_id' });

    if (insertError) {
      console.error('❌ Erreur insertion token fictif:', insertError);
      return;
    }

    console.log('✅ Token fictif créé avec succès');
    console.log(`📱 Token: ${mockToken}`);
    console.log(`👤 User ID: ${TARGET_USER_ID}`);

    // 2. Tester la fonction send-push
    console.log('\n📤 Test de la fonction send-push...');
    
    const testPayload = {
      toUserId: TARGET_USER_ID,
      title: 'EntreMeres',
      body: 'Test de la fonction send-push avec token fictif ! 🎉',
      data: {
        type: 'test_mock',
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
        console.log('🎉 Fonction OK ! (Le token fictif ne recevra pas de vraie notification)');
        console.log('📱 Avec un vrai token, vous auriez reçu une notification');
      } else {
        console.log('⚠️ Fonction OK mais notification non envoyée');
        console.log('Raison:', result.reason || 'Inconnue');
      }
    } else {
      console.error('❌ Erreur fonction send-push:', result);
    }

    // 3. Nettoyer le token fictif
    console.log('\n🧹 Nettoyage du token fictif...');
    const { error: deleteError } = await supabase
      .from('push_devices')
      .delete()
      .eq('device_id', 'test-device-123');

    if (deleteError) {
      console.error('⚠️ Erreur nettoyage:', deleteError);
    } else {
      console.log('✅ Token fictif supprimé');
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

// Exécution
testSendPushWithMockToken();
