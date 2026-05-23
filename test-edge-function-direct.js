#!/usr/bin/env node

/**
 * 🧪 Test direct de la fonction Edge send-push
 * Teste la fonction sans dépendre de la base de données
 */

const TARGET_USER_ID = '6b3206d7-c247-45c9-99dd-5894c9e1ec14';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

async function testEdgeFunctionDirect() {
  try {
    console.log('🧪 === TEST DIRECT FONCTION EDGE SEND-PUSH ===\n');
    
    const testPayload = {
      toUserId: TARGET_USER_ID,
      title: 'EntreMeres',
      body: 'Test direct de la fonction Edge ! 🎉',
      data: {
        type: 'test_direct',
        screen: 'feed',
        timestamp: new Date().toISOString()
      }
    };

    console.log('📋 Payload envoyé:');
    console.log(JSON.stringify(testPayload, null, 2));
    
    console.log('\n📤 Appel de la fonction Edge...');
    
    const response = await fetch('https://turljvlvqkbcqtvljvly.supabase.co/functions/v1/send-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();
    
    console.log('\n📊 Résultat:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Fonction Edge exécutée avec succès !');
      
      if (result.ok) {
        console.log('🎉 Fonction OK !');
        console.log('📱 Si un token était enregistré, une notification aurait été envoyée');
      } else {
        console.log('⚠️ Fonction OK mais pas de notification envoyée');
        console.log('Raison:', result.reason || 'Inconnue');
        
        if (result.reason === 'no_token') {
          console.log('💡 Cela confirme que l\'utilisateur n\'a pas de token enregistré');
        }
      }
    } else {
      console.error('❌ Erreur fonction Edge:', result);
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

// Exécution
testEdgeFunctionDirect();
