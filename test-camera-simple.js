// 🧪 TEST CAMÉRA EXPO CAMERA V16
// Test simple pour vérifier que la caméra fonctionne

const { Camera } = require('expo-camera');

console.log('🔍 Test Expo Camera v16...');
console.log('📱 Version:', Camera.Constants.Version);
console.log('📸 Fonctions disponibles:');
console.log('- recordAsync:', typeof Camera.prototype.recordAsync);
console.log('- stopRecording:', typeof Camera.prototype.stopRecording);
console.log('- takePictureAsync:', typeof Camera.prototype.takePictureAsync);

// Test des permissions
async function testPermissions() {
  try {
    console.log('\n🔐 Test des permissions...');
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
    
    console.log('📷 Permission caméra:', cameraPermission.status);
    console.log('🎤 Permission micro:', microphonePermission.status);
    
    if (cameraPermission.status === 'granted' && microphonePermission.status === 'granted') {
      console.log('✅ Toutes les permissions sont accordées !');
    } else {
      console.log('❌ Permissions manquantes');
    }
  } catch (error) {
    console.error('❌ Erreur permissions:', error);
  }
}

// Test de la caméra
async function testCamera() {
  try {
    console.log('\n📸 Test de la caméra...');
    
    // Vérifier que CameraView est disponible
    if (Camera.CameraView) {
      console.log('✅ CameraView disponible');
    } else {
      console.log('❌ CameraView non disponible');
    }
    
    // Vérifier les propriétés
    console.log('📱 Propriétés Camera:', Object.keys(Camera));
    
  } catch (error) {
    console.error('❌ Erreur test caméra:', error);
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  await testPermissions();
  await testCamera();
  
  console.log('\n🏁 Tests terminés !');
}

runTests().catch(console.error); 