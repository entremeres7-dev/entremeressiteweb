#!/usr/bin/env node

/**
 * 🧪 Test de Tous les Types de Notifications EntreMeres
 * 
 * Ce script teste tous les types de notifications disponibles :
 * - Messages
 * - Likes
 * - Commentaires
 * - Demandes d'ami
 * - Nouvelles stories
 * 
 * Usage: node test-tous-types.js
 */

const { supabase } = require('./supabaseClient');

async function testTousTypes() {
  console.log('🧪 Test de tous les types de notifications...\n');
  
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
    console.log(`📱 Token: ${device.token.substring(0, 20)}...\n`);
    
    // 2. Tester tous les types de notifications
    const tests = [
      {
        name: 'Message',
        title: 'EntreMeres',
        body: 'Sophie vous a envoyé un message 💌',
        data: { type: 'message', sender: 'Sophie', conversationId: 'test-123' }
      },
      {
        name: 'Like',
        title: 'EntreMeres',
        body: 'Emma a liké votre post ❤️',
        data: { type: 'like', sender: 'Emma', postId: 'test-456' }
      },
      {
        name: 'Commentaire',
        title: 'EntreMeres',
        body: 'Julie a commenté votre post 💬',
        data: { type: 'comment', sender: 'Julie', postId: 'test-789' }
      },
      {
        name: 'Demande d\'ami',
        title: 'EntreMeres',
        body: 'Camille souhaite devenir votre amie 👋',
        data: { type: 'friend_request', sender: 'Camille' }
      },
      {
        name: 'Nouvelle story',
        title: 'EntreMeres',
        body: 'Léa a partagé une nouvelle story 📱',
        data: { type: 'story', sender: 'Léa', storyId: 'test-story-123' }
      }
    ];
    
    console.log('📤 Envoi des notifications de test...\n');
    
    let successCount = 0;
    let totalCount = tests.length;
    
    for (const test of tests) {
      try {
        console.log(`📨 Test ${test.name}...`);
        
        const message = {
          to: device.token,
          title: test.title,
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
          console.log(`   ✅ ${test.name} envoyé`);
          successCount++;
        } else {
          console.log(`   ❌ ${test.name} échoué (${response.status})`);
        }
        
        // Attendre un peu entre chaque notification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.log(`   💥 ${test.name} erreur: ${error.message}`);
      }
    }
    
    // 3. Résumé final
    console.log('\n' + '='.repeat(50));
    console.log('🎯 RÉSUMÉ DES TESTS');
    console.log('='.repeat(50));
    console.log(`✅ Succès: ${successCount}/${totalCount}`);
    console.log(`📱 Utilisateur: ${device.profils.username}`);
    
    if (successCount === totalCount) {
      console.log('\n🎉 PARFAIT ! Toutes les notifications ont été envoyées !');
      console.log('\n📱 VÉRIFIEZ SUR VOTRE APPAREIL :');
      console.log('   • Vous devriez recevoir 5 notifications');
      console.log('   • Chaque notification doit avoir l\'icône EntreMeres');
      console.log('   • Le titre doit être "EntreMeres"');
      console.log('   • Les messages doivent contenir des emojis');
      console.log('   • Les notifications doivent faire du son');
      
      console.log('\n🎯 TYPES TESTÉS :');
      tests.forEach((test, index) => {
        console.log(`   ${index + 1}. ${test.name}: ${test.body}`);
      });
      
    } else {
      console.log('\n⚠️  Certaines notifications ont échoué');
      console.log('🔧 Vérifiez les logs ci-dessus pour identifier les problèmes');
    }
    
  } catch (error) {
    console.log('💥 ERREUR FATALE:', error.message);
  }
}

// Exécution immédiate
testTousTypes(); 