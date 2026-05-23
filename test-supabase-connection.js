// Script de test pour diagnostiquer la connexion Supabase
// Exécutez ce script dans votre terminal

const testSupabaseConnection = async () => {
  console.log('🔍 Test de connexion Supabase...');
  
  try {
    // Test 1: Ping de l'URL Supabase
    console.log('📡 Test 1: Ping de l\'URL Supabase...');
    const response = await fetch('https://turljvlvqkbcqtvljvly.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko'
      }
    });
    
    if (response.ok) {
      console.log('✅ Connexion Supabase réussie !');
    } else {
      console.log('❌ Erreur HTTP:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('💡 Problème probable:');
      console.log('   - Connexion internet défaillante');
      console.log('   - Projet Supabase suspendu');
      console.log('   - Problème de CORS');
      console.log('   - Firewall/antivirus bloquant');
    }
  }
};

// Exécuter le test
testSupabaseConnection(); 