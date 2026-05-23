// Test pour vérifier les variables d'environnement de l'Edge Function
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEdgeFunctionVariables() {
  console.log('🔍 Test des variables d\'environnement de l\'Edge Function...');
  
  try {
    // Test simple de l'Edge Function
    const { data, error } = await supabase.functions.invoke('send-push', {
      body: {
        toUserId: 'test-user-id',
        title: 'Test Variables',
        body: 'Test des variables d\'environnement'
      }
    });

    if (error) {
      console.log('❌ Erreur Edge Function:', error);
      
      // Si c'est une erreur de variables d'environnement
      if (error.message.includes('SUPABASE_URL') || error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        console.log('⚠️ Variables d\'environnement manquantes dans l\'Edge Function');
        console.log('📋 Allez dans Supabase Dashboard → Edge Functions → Settings → Environment Variables');
      }
    } else {
      console.log('✅ Edge Function accessible');
      console.log('📋 Variables d\'environnement OK');
    }

  } catch (err) {
    console.log('❌ Erreur de connexion:', err.message);
  }
}

testEdgeFunctionVariables();
