#!/usr/bin/env node

/**
 * 🔍 Vérification des appareils enregistrés dans push_devices
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPushDevices() {
  try {
    console.log('🔍 Vérification des appareils push_devices...\n');
    
    // 1. Compter tous les appareils
    const { count: totalDevices, error: countError } = await supabase
      .from('push_devices')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erreur comptage:', countError);
      return;
    }

    console.log(`📊 Total appareils enregistrés: ${totalDevices}`);

    // 2. Lister tous les appareils avec détails
    const { data: devices, error } = await supabase
      .from('push_devices')
      .select('user_id, token, os, env, project_id, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur récupération:', error);
      return;
    }

    if (!devices || devices.length === 0) {
      console.log('⚠️ Aucun appareil trouvé dans la table push_devices');
      console.log('💡 Assurez-vous que l\'app a été installée et connectée');
      return;
    }

    console.log('\n📱 Appareils enregistrés:');
    console.log('─'.repeat(80));
    
    devices.forEach((device, index) => {
      console.log(`${index + 1}. User ID: ${device.user_id}`);
      console.log(`   Token: ${device.token.substring(0, 30)}...`);
      console.log(`   OS: ${device.os}`);
      console.log(`   Env: ${device.env}`);
      console.log(`   Project ID: ${device.project_id}`);
      console.log(`   Dernière mise à jour: ${device.updated_at}`);
      console.log('');
    });

    // 3. Statistiques par environnement
    const prodDevices = devices.filter(d => d.env === 'prod');
    const devDevices = devices.filter(d => d.env === 'dev');
    
    console.log('📊 Statistiques:');
    console.log(`   Production: ${prodDevices.length} appareil(s)`);
    console.log(`   Développement: ${devDevices.length} appareil(s)`);

    // 4. Vérifier l'utilisateur spécifique
    const targetUserId = '6b3206d7-c247-45c9-99dd-5894c9e1ec14';
    const targetDevice = devices.find(d => d.user_id === targetUserId);
    
    console.log(`\n🎯 Vérification de l'utilisateur ${targetUserId}:`);
    if (targetDevice) {
      console.log('✅ Appareil trouvé !');
      console.log(`   Token: ${targetDevice.token.substring(0, 30)}...`);
      console.log(`   OS: ${targetDevice.os}`);
      console.log(`   Env: ${targetDevice.env}`);
    } else {
      console.log('❌ Aucun appareil trouvé pour cet utilisateur');
      console.log('💡 Cet utilisateur doit installer l\'app et se connecter');
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

// Exécution
checkPushDevices();
