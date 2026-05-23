// check-backend-video-support.js - Vérification de la configuration backend
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBackendVideoSupport() {
  console.log('🔍 Vérification de la configuration backend pour les vidéos...\n');

  try {
    // 1. Vérifier la structure de la table stories
    console.log('📊 1. Structure de la table stories:');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'stories' });

    if (columnsError) {
      console.log('❌ Erreur récupération colonnes:', columnsError);
    } else {
      const requiredColumns = [
        'video_url', 'image_url', 'media_type', 'is_video', 
        'metadata', 'duration_ms', 'user_regional_group', 'is_complete_story'
      ];
      
      const existingColumns = columns.map(col => col.column_name);
      
      for (const col of requiredColumns) {
        const exists = existingColumns.includes(col);
        console.log(`   ${col}: ${exists ? '✅' : '❌'}`);
      }
    }

    // 2. Vérifier les buckets de stockage
    console.log('\n📦 2. Buckets de stockage:');
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .storage.listBuckets();
      
      if (bucketsError) {
        console.log('❌ Erreur récupération buckets:', bucketsError);
      } else {
        const requiredBuckets = ['story-images', 'story-videos'];
        for (const bucket of requiredBuckets) {
          const exists = buckets.some(b => b.name === bucket);
          console.log(`   ${bucket}: ${exists ? '✅' : '❌'}`);
        }
      }
    } catch (bucketError) {
      console.log('❌ Erreur vérification buckets:', bucketError.message);
    }

    // 3. Vérifier les politiques RLS
    console.log('\n🔐 3. Politiques RLS (Row Level Security):');
    try {
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_table_policies', { table_name: 'stories' });
      
      if (policiesError) {
        console.log('❌ Erreur récupération politiques:', policiesError);
      } else {
        console.log(`   Politiques trouvées: ${policies.length}`);
        policies.forEach(policy => {
          console.log(`   - ${policy.policyname}: ${policy.cmd}`);
        });
      }
    } catch (policyError) {
      console.log('❌ Erreur vérification politiques:', policyError.message);
    }

    // 4. Test d'insertion d'une story vidéo
    console.log('\n🧪 4. Test d\'insertion d\'une story vidéo:');
    const testStoryData = {
      user_id: 'test-user-id',
      video_url: 'https://example.com/test-video.mp4',
      image_url: null,
      media_type: 'video',
      is_video: true,
      metadata: JSON.stringify({
        media_type: 'video',
        is_video: true,
        duration: 8000,
        uploaded_as_complete: true,
        timestamp: new Date().toISOString()
      }),
      user_regional_group: 'test',
      is_complete_story: true
    };

    try {
      const { data: testInsert, error: testError } = await supabase
        .from('stories')
        .insert(testStoryData)
        .select('id')
        .single();

      if (testError) {
        console.log('❌ Erreur test insertion:', testError.message);
      } else {
        console.log('✅ Test insertion réussi, ID:', testInsert.id);
        
        // Nettoyer le test
        await supabase
          .from('stories')
          .delete()
          .eq('id', testInsert.id);
        console.log('🧹 Test nettoyé');
      }
    } catch (testError) {
      console.log('❌ Erreur test insertion:', testError.message);
    }

    console.log('\n✅ Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

// Exécuter la vérification
checkBackendVideoSupport();
