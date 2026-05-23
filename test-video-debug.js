// test-video-debug.js - Diagnostic vidéo qui ne s'affiche pas
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugVideoStories() {
  console.log('🔍 Diagnostic des vidéos dans les stories...\n');

  try {
    // 1. Récupérer les stories avec vidéos
    const { data: stories, error } = await supabase
      .from('stories')
      .select(`
        id,
        user_id,
        created_at,
        image_url,
        video_url,
        media_type,
        is_video,
        metadata,
        duration_ms
      `)
      .or('is_video.eq.true,media_type.eq.video,video_url.not.is.null')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Erreur récupération stories:', error);
      return;
    }

    console.log(`📊 ${stories.length} stories avec vidéos trouvées\n`);

    // 2. Analyser chaque story
    for (const story of stories) {
      console.log(`🎬 Story ID: ${story.id}`);
      console.log(`   📅 Créée: ${story.created_at}`);
      console.log(`   👤 User ID: ${story.user_id}`);
      console.log(`   🎥 is_video: ${story.is_video}`);
      console.log(`   📹 media_type: ${story.media_type}`);
      console.log(`   🔗 video_url: ${story.video_url ? '✅' : '❌'}`);
      console.log(`   🖼️ image_url: ${story.image_url ? '✅' : '❌'}`);
      console.log(`   ⏱️ duration_ms: ${story.duration_ms || 'Non défini'}`);
      console.log(`   📋 metadata: ${story.metadata ? JSON.stringify(story.metadata) : 'Aucune'}`);
      
      if (story.video_url) {
        console.log(`   🔗 URL complète: ${story.video_url}`);
        
        // Vérifier si l'URL est accessible
        try {
          const response = await fetch(story.video_url, { method: 'HEAD' });
          console.log(`   🌐 Accessible: ${response.ok ? '✅' : '❌'} (${response.status})`);
        } catch (urlError) {
          console.log(`   🌐 Accessible: ❌ Erreur - ${urlError.message}`);
        }
      }
      
      console.log('');
    }

    // 3. Statistiques générales
    const { count: totalStories } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true });

    const { count: videoStories } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .or('is_video.eq.true,media_type.eq.video,video_url.not.is.null');

    console.log('📈 Statistiques:');
    console.log(`   Total stories: ${totalStories}`);
    console.log(`   Stories avec vidéo: ${videoStories}`);
    console.log(`   Pourcentage vidéos: ${((videoStories / totalStories) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

// Exécuter le diagnostic
debugVideoStories();
