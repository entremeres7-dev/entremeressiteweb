// setup-video-buckets.js - Configuration automatique des buckets pour les vidéos
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://turljvlvqkbcqtvljvly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1cmxqdmx2cWtiY3F0dmxqdmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzAyNTQsImV4cCI6MjA2NzgwNjI1NH0.QzT7wnzJy83iwaRF8YFttGf8rMBP_pFMxumJKrwXIko';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupVideoBuckets() {
  console.log('🔧 Configuration des buckets pour les vidéos...\n');

  try {
    // 1. Vérifier les buckets existants
    console.log('📦 1. Vérification des buckets existants:');
    const { data: existingBuckets, error: bucketsError } = await supabase
      .storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Erreur récupération buckets:', bucketsError.message);
      return;
    }

    console.log(`   Buckets trouvés: ${existingBuckets.length}`);
    existingBuckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });

    // 2. Créer le bucket story-images s'il n'existe pas
    const requiredBuckets = ['story-images', 'story-videos'];
    
    for (const bucketName of requiredBuckets) {
      const exists = existingBuckets.some(b => b.name === bucketName);
      
      if (!exists) {
        console.log(`\n📦 2. Création du bucket "${bucketName}":`);
        try {
          const { data: newBucket, error: createError } = await supabase
            .storage.createBucket(bucketName, {
              public: true, // Bucket public pour accès direct
              fileSizeLimit: 52428800, // 50MB max
              allowedMimeTypes: bucketName === 'story-videos' 
                ? ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'] 
                : ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            });

          if (createError) {
            console.log(`   ❌ Erreur création bucket "${bucketName}":`, createError.message);
          } else {
            console.log(`   ✅ Bucket "${bucketName}" créé avec succès`);
          }
        } catch (createError) {
          console.log(`   ❌ Erreur création bucket "${bucketName}":`, createError.message);
        }
      } else {
        console.log(`\n📦 2. Bucket "${bucketName}" existe déjà ✅`);
      }
    }

    // 3. Vérifier la configuration finale
    console.log('\n📦 3. Vérification finale:');
    const { data: finalBuckets, error: finalError } = await supabase
      .storage.listBuckets();
    
    if (finalError) {
      console.log('❌ Erreur vérification finale:', finalError.message);
    } else {
      console.log(`   Total buckets: ${finalBuckets.length}`);
      finalBuckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }

    // 4. Test d'upload d'un fichier test
    console.log('\n🧪 4. Test d\'upload:');
    try {
      // Créer un fichier test simple
      const testContent = 'Test file for bucket verification';
      const testBlob = new Blob([testContent], { type: 'text/plain' });
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('story-images')
        .upload('test.txt', testBlob);

      if (uploadError) {
        console.log('   ❌ Erreur upload test:', uploadError.message);
      } else {
        console.log('   ✅ Upload test réussi');
        
        // Nettoyer le fichier test
        await supabase
          .storage
          .from('story-images')
          .remove(['test.txt']);
        console.log('   🧹 Fichier test nettoyé');
      }
    } catch (testError) {
      console.log('   ❌ Erreur test upload:', testError.message);
    }

    console.log('\n✅ Configuration terminée !');
    console.log('\n📋 Prochaines étapes:');
    console.log('   1. Testez votre vidéo de 8 secondes');
    console.log('   2. Elle devrait maintenant s\'afficher correctement');
    console.log('   3. Vérifiez les logs pour confirmer le bon traitement');

  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

// Exécuter la configuration
setupVideoBuckets();
