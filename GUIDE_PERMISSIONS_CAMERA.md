# 📱 Guide des Permissions Caméra - InstagramCamera

## 🔐 Permissions Requises

Le composant `InstagramCamera` nécessite **deux permissions essentielles** :

1. **📷 Permission Caméra** - Pour capturer des photos et vidéos
2. **🎤 Permission Microphone** - Pour l'enregistrement audio des vidéos

## 🚀 Utilisation Automatique

### **1. Demande Automatique des Permissions**

Le composant demande automatiquement les permissions au montage :

```typescript
useEffect(() => {
  const requestPermissions = async () => {
    // Demande permission caméra si pas accordée
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
    }
    
    // Demande permission microphone si pas accordée
    if (!microphonePermission?.granted) {
      await requestMicrophonePermission();
    }
  };
  
  // Délai de 500ms pour laisser le composant se monter
  const timer = setTimeout(requestPermissions, 500);
  return () => clearTimeout(timer);
}, [cameraPermission, microphonePermission, requestCameraPermission, requestMicrophonePermission]);
```

### **2. Interface Utilisateur Intelligente**

L'interface s'adapte automatiquement selon l'état des permissions :

- ✅ **Permissions accordées** → Affichage de la caméra
- ❌ **Permissions refusées** → Interface de demande de permissions
- ⏳ **Permissions en cours** → Indicateur de statut

## 🎯 États des Permissions

### **Status Possibles**

```typescript
type PermissionStatus = 
  | 'undetermined'    // Permission jamais demandée
  | 'granted'         // Permission accordée
  | 'denied'          // Permission refusée
  | 'restricted'      // Permission restreinte (parental, etc.)
  | 'limited'         // Permission limitée (iOS 14+)
```

### **Propriétés des Permissions**

```typescript
interface PermissionResponse {
  granted: boolean;           // Permission accordée ?
  status: PermissionStatus;   // Statut détaillé
  canAskAgain: boolean;       // Peut-on redemander ?
  expires?: string;           // Date d'expiration (si applicable)
}
```

## 🔧 Gestion Manuelle des Permissions

### **1. Vérifier l'état des permissions**

```typescript
// Dans votre composant
const [cameraPermission, requestCameraPermission] = useCameraPermissions();
const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

// Vérifier si tout est prêt
const permissionsReady = cameraPermission?.granted && microphonePermission?.granted;
```

### **2. Demander une permission spécifique**

```typescript
const handleCameraPermission = async () => {
  const result = await requestCameraPermission();
  console.log('Résultat permission caméra:', result);
  
  if (result.granted) {
    console.log('✅ Permission caméra accordée !');
  } else {
    console.log('❌ Permission caméra refusée');
  }
};
```

### **3. Gérer les permissions refusées**

```typescript
const handlePermissionDenied = () => {
  Alert.alert(
    'Permission Refusée',
    'Pour utiliser la caméra, vous devez autoriser l\'accès dans les paramètres de votre appareil.',
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Paramètres', onPress: () => Linking.openSettings() }
    ]
  );
};
```

## 📱 Configuration dans app.json

### **1. Permissions Android**

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "EntreMeres utilise votre caméra pour créer des stories et posts personnalisés.",
          "microphonePermission": "EntreMeres utilise votre microphone pour l'enregistrement audio des vidéos."
        }
      ]
    ]
  }
}
```

### **2. Permissions iOS**

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "EntreMeres utilise votre caméra pour créer des stories et posts personnalisés.",
        "NSMicrophoneUsageDescription": "EntreMeres utilise votre microphone pour l'enregistrement audio des vidéos."
      }
    }
  }
}
```

## 🚨 Dépannage des Permissions

### **Problème : Permission toujours refusée**

**Solutions :**
1. **Vérifier les paramètres système** de l'appareil
2. **Redémarrer l'application** après accord des permissions
3. **Vérifier la configuration** dans `app.json`
4. **Tester sur un appareil physique** (pas simulateur)

### **Problème : Permission accordée mais caméra ne fonctionne pas**

**Solutions :**
1. **Attendre `onCameraReady`** + une frame supplémentaire
2. **Vérifier que l'écran est focusé** (dans un navigateur)
3. **Forcer le remount** lors du flip caméra
4. **Vérifier les logs** dans la console

### **Problème : Microphone ne fonctionne pas**

**Solutions :**
1. **Vérifier la permission microphone** est accordée
2. **Tester sur appareil physique** (simulateur peut avoir des limitations)
3. **Vérifier les paramètres audio** de l'appareil

## 📋 Checklist de Test

### **Avant de tester :**
- [ ] Permissions configurées dans `app.json`
- [ ] Appareil physique (pas simulateur)
- [ ] Application redémarrée après configuration

### **Pendant le test :**
- [ ] Permissions demandées automatiquement
- [ ] Interface de permissions s'affiche si refusées
- [ ] Boutons de permission fonctionnent
- [ ] Caméra s'affiche après accord des permissions
- [ ] Photos et vidéos fonctionnent

### **Logs à vérifier :**
```
🔐 Vérification des permissions...
📷 Permission caméra: undetermined
🎤 Permission microphone: undetermined
📷 Demande permission caméra...
📷 Résultat permission caméra: { granted: true, status: 'granted' }
🎤 Demande permission microphone...
🎤 Résultat permission microphone: { granted: true, status: 'granted' }
📱 Écran caméra focusé
✅ Caméra prête ! Attendre une frame supplémentaire...
✅ Caméra vraiment active !
```

## 🎉 Résultat Attendu

Une fois les permissions accordées, vous devriez voir :

1. **Interface de la caméra** avec prévisualisation en temps réel
2. **Bouton principal** actif (blanc, pas grisé)
3. **Contrôles fonctionnels** (flash, flip, fermer)
4. **Capacité de prendre des photos** (tap simple)
5. **Capacité d'enregistrer des vidéos** (long press)

---

**💡 Conseil :** Testez toujours sur un appareil physique pour une expérience complète des permissions et de la caméra ! 