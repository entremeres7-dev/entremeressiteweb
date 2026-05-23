const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

/**
 * Active le mode compatibilité pages 16 Ko (Android 15+) dans AndroidManifest.
 * Le packaging JNI est géré par expo-build-properties dans app.json.
 */
function with16KbPagesSupport(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    application.$ = {
      ...application.$,
      'android:pageSizeCompat': 'enabled',
    };

    return config;
  });
}

module.exports = with16KbPagesSupport;
