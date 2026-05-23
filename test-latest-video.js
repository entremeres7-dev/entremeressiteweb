// test-latest-video.js - Vérifier la dernière vidéo uploadée
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLatestVideo() {
  console.log('🔍 Vérification de la dernière vidéo uploadée...\n');

  try {
    // Récupérer les 5 dernières stories
    const { data: stories, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Erreur récupération stories:', error.message);
      return;
    }

    console.log(`📊 ${stories.length} stories trouvées:\n`);

    stories.forEach((story, index) => {
      console.log(`🎬 Story ${index + 1} (${story.created_at}):`);
      console.log(`   ID: ${story.id}`);
      console.log(`   User ID: ${story.user_id}`);
      console.log(`   Media Type: ${story.media_type}`);
      console.log(`   Is Video: ${story.is_video}`);
      console.log(`   Image URL: ${story.image_url ? 'Oui' : 'Non'}`);
      console.log(`   Video URL: ${story.video_url ? 'Oui' : 'Non'}`);
      
      if (story.metadata) {
        try {
          const metadata = JSON.parse(story.metadata);
          console.log(`   Metadata:`, metadata);
        } catch (e) {
          console.log(`   Metadata: ${story.metadata}`);
        }
      } else {
        console.log(`   Metadata: null`);
      }
      
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

// Exécuter le test
testLatestVideo();
