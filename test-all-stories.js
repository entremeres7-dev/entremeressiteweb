// test-all-stories.js - Diagnostic complet de toutes les stories
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAllStories() {
  console.log('🔍 Diagnostic complet de toutes les stories...\n');

  try {
    // Récupérer TOUTES les stories
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
        duration_ms,
        text_overlays,
        sticker_overlays
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Erreur récupération stories:', error);
      return;
    }

    console.log(`📊 ${stories.length} stories trouvées au total\n`);

    // Analyser chaque story
    for (const story of stories) {
      console.log(`📱 Story ID: ${story.id}`);
      console.log(`   📅 Créée: ${story.created_at}`);
      console.log(`   👤 User ID: ${story.user_id}`);
      console.log(`   🎥 is_video: ${story.is_video}`);
      console.log(`   📹 media_type: ${story.media_type}`);
      console.log(`   🔗 video_url: ${story.video_url ? '✅' : '❌'}`);
      console.log(`   🖼️ image_url: ${story.image_url ? '✅' : '❌'}`);
      console.log(`   ⏱️ duration_ms: ${story.duration_ms || 'Non défini'}`);
      console.log(`   📋 metadata: ${story.metadata ? JSON.stringify(story.metadata) : 'Aucune'}`);
      console.log(`   📝 text_overlays: ${story.text_overlays ? '✅' : '❌'}`);
      console.log(`   🏷️ sticker_overlays: ${story.sticker_overlays ? '✅' : '❌'}`);
      
      if (story.video_url) {
        console.log(`   🔗 URL vidéo: ${story.video_url}`);
      }
      if (story.image_url) {
        console.log(`   🖼️ URL image: ${story.image_url}`);
      }
      
      console.log('');
    }

    // Statistiques détaillées
    const videoStories = stories.filter(s => s.is_video || s.media_type === 'video' || s.video_url);
    const imageStories = stories.filter(s => s.image_url && !s.is_video);
    const textStories = stories.filter(s => s.text_overlays);
    
    console.log('📈 Statistiques détaillées:');
    console.log(`   Total stories: ${stories.length}`);
    console.log(`   Stories avec vidéo: ${videoStories.length}`);
    console.log(`   Stories avec image: ${imageStories.length}`);
    console.log(`   Stories avec texte: ${textStories.length}`);
    console.log(`   Stories sans média: ${stories.length - videoStories.length - imageStories.length}`);

  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

// Exécuter le diagnostic
debugAllStories();
