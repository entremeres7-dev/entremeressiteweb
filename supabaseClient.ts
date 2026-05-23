import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Récupération des variables d'environnement de manière sécurisée
// Priorité : app.config.js extra > variables d'environnement > erreur
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validation stricte des variables critiques
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 
    '\n\n' +
    '╔═══════════════════════════════════════════════════════════════╗\n' +
    '║  ❌ ERREUR : Variables d\'environnement Supabase manquantes  ║\n' +
    '╚═══════════════════════════════════════════════════════════════╝\n\n' +
    '📋 SOLUTION :\n\n' +
    '1. Créez un fichier .env à la racine du projet (appdemamans/.env)\n\n' +
    '2. Ajoutez ces lignes dans le fichier .env :\n\n' +
    '   EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co\n' +
    '   EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-ici\n\n' +
    '3. Récupérez vos clés sur https://app.supabase.com\n' +
    '   → Settings > API > Project URL et anon public key\n\n' +
    '4. Redémarrez l\'application (npm start ou expo start)\n\n' +
    '📖 Consultez CREER_FICHIER_ENV.md pour plus de détails\n\n' +
    '═══════════════════════════════════════════════════════════════\n';
  
  console.error(errorMessage);
  throw new Error('Configuration Supabase manquante. Consultez CREER_FICHIER_ENV.md pour créer le fichier .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: Platform.OS === 'web',
    flowType: 'pkce',
  },
});

// Intercepter les erreurs de console pour filtrer silencieusement les erreurs de refresh token
if (__DEV__) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Filtrer les erreurs de refresh token invalide
    const errorString = args
      .map((arg) => {
        if (arg == null) return String(arg);
        if (typeof arg !== 'object') return String(arg);
        const e = arg as { message?: string; code?: string; details?: string; hint?: string };
        const fromFields = [e.message, e.code, e.details, e.hint].filter(Boolean).join(' ');
        if (fromFields) return fromFields;
        const s = JSON.stringify(arg);
        if (s !== '{}') return s;
        try {
          return String(arg);
        } catch {
          return '[object]';
        }
      })
      .join(' ');
    
    if (errorString.includes('Invalid Refresh Token') || 
        errorString.includes('Refresh Token Not Found') ||
        errorString.includes('JWT expired') ||
        errorString.includes('connection timeout') ||
        errorString.includes('upstream connect') ||
        errorString.includes('disconnect/reset')) {
      // Ne pas logger ces erreurs (réseau temporaire, token), elles sont gérées silencieusement
      return;
    }
    // Navigation : pas d’historique → bruit en dev uniquement (voir utils/safeRouter.safeBack)
    if (
      errorString.includes("GO_BACK") &&
      (errorString.includes('not handled') || errorString.includes('any navigator'))
    ) {
      return;
    }
    // Logger les autres erreurs normalement
    originalError.apply(console, args);
  };
} 