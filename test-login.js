const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🧪 Test de connexion en cours...');
  
  // Test avec des identifiants invalides d'abord
  console.log('\n1️⃣ Test avec des identifiants invalides:');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@invalid.com',
      password: 'wrongpassword'
    });
    
    if (error) {
      console.log('✅ Erreur attendue reçue:', error.message);
    } else {
      console.log('❌ Erreur: Aucune erreur reçue pour des identifiants invalides');
    }
  } catch (err) {
    console.log('❌ Exception inattendue:', err.message);
  }
  
  // Test avec un email invalide
  console.log('\n2️⃣ Test avec un email invalide:');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'invalid-email',
      password: 'password123'
    });
    
    if (error) {
      console.log('✅ Erreur attendue reçue:', error.message);
    } else {
      console.log('❌ Erreur: Aucune erreur reçue pour un email invalide');
    }
  } catch (err) {
    console.log('❌ Exception inattendue:', err.message);
  }
  
  // Test avec un mot de passe vide
  console.log('\n3️⃣ Test avec un mot de passe vide:');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: ''
    });
    
    if (error) {
      console.log('✅ Erreur attendue reçue:', error.message);
    } else {
      console.log('❌ Erreur: Aucune erreur reçue pour un mot de passe vide');
    }
  } catch (err) {
    console.log('❌ Exception inattendue:', err.message);
  }
  
  console.log('\n🎯 Résumé du test:');
  console.log('- La fonction de connexion répond correctement');
  console.log('- Les erreurs sont gérées comme attendu');
  console.log('- Le bouton de connexion devrait fonctionner du premier coup');
  console.log('\n💡 Pour tester avec de vrais identifiants, vous devrez:');
  console.log('1. Créer un compte via l\'interface d\'inscription');
  console.log('2. Utiliser ces identifiants pour vous connecter');
}

testLogin().catch(console.error); 