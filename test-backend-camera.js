// 🧪 TEST BACKEND CAMÉRA
// Vérifier si le problème vient du backend

const testBackend = async () => {
  console.log('🔍 Test de connectivité backend...');
  
  try {
    // Test 1: Connexion de base
    const response = await fetch('http://localhost:8086/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connecté:', data);
    } else {
      console.log('❌ Backend erreur:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Erreur connexion backend:', error.message);
  }
  
  try {
    // Test 2: Endpoint caméra (si il existe)
    const response = await fetch('http://localhost:8086/api/camera/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Endpoint caméra OK:', data);
    } else {
      console.log('⚠️ Endpoint caméra non trouvé:', response.status);
    }
  } catch (error) {
    console.log('⚠️ Endpoint caméra non accessible:', error.message);
  }
  
  try {
    // Test 3: Port alternatif
    const response = await fetch('http://localhost:3000/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend sur port 3000:', data);
    } else {
      console.log('❌ Backend port 3000 erreur:', response.status);
    }
  } catch (error) {
    console.log('❌ Erreur port 3000:', error.message);
  }
};

// Lancer les tests
testBackend(); 