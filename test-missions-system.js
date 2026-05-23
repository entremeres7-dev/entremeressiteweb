// Test du système de missions quotidiennes
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase (vraies valeurs du projet)
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMissionsSystem() {
  console.log('🧪 === TEST SYSTÈME MISSIONS ===');
  
  try {
    // 1. Vérifier la table mission_participations
    console.log('📊 Test 1: Vérification table mission_participations');
    const { data: missions, error: missionsError } = await supabase
      .from('mission_participations')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(5);
    
    if (missionsError) {
      console.error('❌ Erreur missions:', missionsError);
    } else {
      console.log('✅ Missions trouvées:', missions.length);
      missions.forEach(mission => {
        console.log(`  - ${mission.hashtag}: ${mission.caption}`);
      });
    }

    // 2. Vérifier les posts récents dans articles
    console.log('\n📊 Test 2: Vérification posts dans articles');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (articlesError) {
      console.error('❌ Erreur articles:', articlesError);
    } else {
      console.log('✅ Articles trouvés:', articles.length);
      articles.forEach(article => {
        const hasImage = article.image_url ? '📸' : '📝';
        console.log(`  ${hasImage} ${article.username}: ${article.contenu?.substring(0, 50)}...`);
      });
    }

    // 3. Vérifier les posts avec hashtags de missions
    console.log('\n📊 Test 3: Posts avec hashtags missions');
    const { data: missionPosts, error: missionPostsError } = await supabase
      .from('articles')
      .select('*')
      .or('contenu.ilike.%#MamanDuLundi%,contenu.ilike.%#AstuceMaman%,contenu.ilike.%#MomentMagique%,contenu.ilike.%#RecetteExpress%,contenu.ilike.%#SelfCareMaman%,contenu.ilike.%#SortieFamille%,contenu.ilike.%#ReflexionMaman%')
      .order('created_at', { ascending: false });
    
    if (missionPostsError) {
      console.error('❌ Erreur posts missions:', missionPostsError);
    } else {
      console.log('✅ Posts missions trouvés:', missionPosts.length);
      missionPosts.forEach(post => {
        const hasImage = post.image_url ? '📸' : '📝';
        console.log(`  ${hasImage} ${post.username}: ${post.contenu}`);
      });
    }

    console.log('\n🎉 === TEST TERMINÉ ===');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le test
testMissionsSystem();
