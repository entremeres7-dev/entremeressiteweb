// simple-backend-check.js - Vérification simple de la configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleBackendCheck() {
  console.log('🔍 Vérification simple de la configuration backend...\n');

  try {
    // 1. Vérifier que la table stories existe et a les bonnes colonnes
    console.log('📊 1. Test de lecture de la table stories:');
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('video_url, image_url, media_type, is_video, metadata')
      .limit(1);

    if (storiesError) {
      console.log('❌ Erreur lecture table stories:', storiesError.message);
      return;
    } else {
      console.log('✅ Table stories accessible');
      console.log('✅ Colonnes vidéo disponibles');
    }

    // 2. Vérifier les buckets de stockage
    console.log('\n📦 2. Test des buckets de stockage:');
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .storage.listBuckets();
      
      if (bucketsError) {
        console.log('❌ Erreur buckets:', bucketsError.message);
      } else {
        console.log('✅ Buckets accessibles:', buckets.length);
        buckets.forEach(bucket => {
          console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        });
      }
    } catch (bucketError) {
      console.log('❌ Erreur vérification buckets:', bucketError.message);
    }

    // 3. Test d'insertion avec un vrai UUID
    console.log('\n🧪 3. Test d\'insertion d\'une story vidéo:');
    
    // Récupérer un vrai user_id existant
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (userError || !existingUser) {
      console.log('❌ Impossible de récupérer un utilisateur pour le test');
      return;
    }

    const testStoryData = {
      user_id: existingUser.id,
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
simpleBackendCheck();
