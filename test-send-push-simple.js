#!/usr/bin/env node

/**
 * 🧪 Test simple pour la fonction send-push
 * Trouve automatiquement un userId et teste la fonction Edge
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSendPush() {
  try {
    console.log('🔍 Recherche d\'un utilisateur avec token push...');
    
    // 1. Trouver un utilisateur avec un token actif
    const { data: devices, error } = await supabase
      .from('push_devices')
      .select('user_id, token, profiles!push_devices_user_id_fkey(username)')
      .eq('is_active', true)
      .limit(1);

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    if (!devices || devices.length === 0) {
      console.log('⚠️ Aucun appareil actif trouvé');
      console.log('💡 Assurez-vous que l\'app est installée et connectée');
      return;
    }

    const device = devices[0];
    const userId = device.user_id;
    const username = device.profiles?.username || 'Utilisateur';
    
    console.log(`✅ Utilisateur trouvé: ${username} (${userId})`);
    console.log(`📱 Token: ${device.token.substring(0, 20)}...`);

    // 2. Tester la fonction send-push
    console.log('\n📤 Test de la fonction send-push...');
    
    const response = await fetch('https://turljvlvqkbcqtvljvly.supabase.co/functions/v1/send-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        toUserId: userId,
        title: 'EntreMeres',
        body: 'Test de la fonction send-push ! 🎉',
        data: {
          type: 'test',
          screen: 'feed'
        }
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Fonction send-push exécutée avec succès');
      console.log('📊 Résultat:', result);
      
      if (result.ok) {
        console.log('🎉 Notification envoyée ! Vérifiez votre appareil');
      } else {
        console.log('⚠️ Fonction OK mais notification non envoyée:', result.reason);
      }
    } else {
      console.error('❌ Erreur fonction send-push:', result);
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

// Exécution
testSendPush();
