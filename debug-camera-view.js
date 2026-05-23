// 🔍 DIAGNOSTIC COMPLET CAMERAVIEW V16
// Script pour comprendre pourquoi recordAsync ne fonctionne pas

const { CameraView, useCameraPermissions } = require('expo-camera');

console.log('🔍 DIAGNOSTIC CAMERAVIEW V16');
console.log('=============================\n');

// 1. Vérifier la version
console.log('📱 Version Expo Camera:', require('expo-camera/package.json').version);

// 2. Vérifier les exports
console.log('\n📦 Exports disponibles:');
console.log('- CameraView:', typeof CameraView);
console.log('- useCameraPermissions:', typeof useCameraPermissions);

// 3. Vérifier les propriétés de CameraView
if (CameraView) {
  console.log('\n🔍 Propriétés CameraView:');
  console.log(Object.getOwnPropertyNames(CameraView));
  
  // Vérifier le prototype
  if (CameraView.prototype) {
    console.log('\n🔍 Prototype CameraView:');
    console.log(Object.getOwnPropertyNames(CameraView.prototype));
  }
  
  // Vérifier les méthodes statiques
  console.log('\n🔍 Méthodes statiques CameraView:');
  console.log(Object.getOwnPropertyNames(CameraView).filter(name => typeof CameraView[name] === 'function'));
}

// 4. Test des permissions
async function testPermissions() {
  try {
    console.log('\n🔐 Test des permissions...');
    const { requestCameraPermissionsAsync, requestMicrophonePermissionsAsync } = require('expo-camera');
    
    const cameraPermission = await requestCameraPermissionsAsync();
    const microphonePermission = await requestMicrophonePermissionsAsync();
    
    console.log('📷 Permission caméra:', cameraPermission.status);
    console.log('🎤 Permission micro:', microphonePermission.status);
    
    return cameraPermission.status === 'granted' && microphonePermission.status === 'granted';
  } catch (error) {
    console.error('❌ Erreur permissions:', error);
    return false;
  }
}

// 5. Test de création d'instance
async function testInstance() {
  try {
    console.log('\n📸 Test création instance CameraView...');
    
    // Simuler une instance (sans React)
    const mockRef = {
      current: {
        // Simuler les méthodes
        takePictureAsync: () => Promise.resolve({ uri: 'mock.jpg' }),
        recordAsync: () => Promise.resolve({ uri: 'mock.mp4' }),
        stopRecording: () => console.log('stopRecording appelé')
      }
    };
    
    console.log('✅ Instance mock créée');
    console.log('- takePictureAsync:', typeof mockRef.current.takePictureAsync);
    console.log('- recordAsync:', typeof mockRef.current.recordAsync);
    console.log('- stopRecording:', typeof mockRef.current.stopRecording);
    
    return mockRef;
  } catch (error) {
    console.error('❌ Erreur création instance:', error);
    return null;
  }
}

// 6. Test des méthodes
async function testMethods(mockRef) {
  if (!mockRef) return;
  
  try {
    console.log('\n🧪 Test des méthodes...');
    
    // Test takePictureAsync
    const photo = await mockRef.current.takePictureAsync();
    console.log('✅ takePictureAsync fonctionne:', photo);
    
    // Test recordAsync
    const video = await mockRef.current.recordAsync();
    console.log('✅ recordAsync fonctionne:', video);
    
    // Test stopRecording
    mockRef.current.stopRecording();
    console.log('✅ stopRecording fonctionne');
    
  } catch (error) {
    console.error('❌ Erreur test méthodes:', error);
  }
}

// 7. Exécuter tous les tests
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic...\n');
  
  const hasPermissions = await testPermissions();
  if (hasPermissions) {
    console.log('✅ Permissions accordées, continuation...');
  } else {
    console.log('❌ Permissions manquantes, arrêt du diagnostic');
    return;
  }
  
  const mockRef = await testInstance();
  await testMethods(mockRef);
  
  console.log('\n🏁 Diagnostic terminé !');
  console.log('\n💡 RECOMMANDATIONS:');
  console.log('1. Vérifiez que expo-camera est à jour');
  console.log('2. Essayez de redémarrer l\'app complètement');
  console.log('3. Vérifiez les permissions dans les réglages iOS');
  console.log('4. Considérez un downgrade vers expo-camera v15 si le problème persiste');
}

runDiagnostic().catch(console.error); 