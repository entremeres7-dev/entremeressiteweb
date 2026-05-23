/**
 * Configuration Expo – source unique pour la version et les numéros de build.
 * Pour une nouvelle release : modifier uniquement les constantes ci-dessous.
 */
const APP_VERSION = '3.0.23';
const IOS_BUILD_NUMBER = '83';
const ANDROID_VERSION_CODE = 79;

module.exports = ({ config }) => ({
  ...config,
  version: APP_VERSION,
  ios: {
    ...config.ios,
    buildNumber: IOS_BUILD_NUMBER,
  },
  android: {
    ...config.android,
    versionCode: ANDROID_VERSION_CODE,
  },
});
