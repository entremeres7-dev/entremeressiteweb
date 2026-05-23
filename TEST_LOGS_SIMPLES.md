# 🔍 Comment Voir les Logs - Guide Simple

## 📱 **Méthode 1 : Console de Développement (Plus Simple)**

### **Étapes :**
1. **Ouvrez l'app** EntreMeres sur votre téléphone
2. **Secouez le téléphone** (ou appuyez 3 fois sur l'écran)
3. **Menu apparaît** - cliquez sur **"Debug"** ou **"Console"**
4. **Les logs s'affichent** en temps réel !

---

## 💻 **Méthode 2 : Terminal (Si vous développez)**

### **Étapes :**
1. **Ouvrez votre terminal**
2. **Allez dans le dossier** `EntreMeresExpo`
3. **Lancez** : `npm start` ou `expo start`
4. **Les logs apparaissent** dans le terminal

---

## 🌐 **Méthode 3 : Navigateur Web (Recommandée)**

### **Étapes :**
1. **Ouvrez Chrome/Safari** sur votre ordinateur
2. **Allez sur** : `http://localhost:8081/debugger-ui/`
3. **Console s'ouvre** automatiquement
4. **Tous les logs** s'affichent ici !

---

## 🚨 **Logs que vous devriez voir :**

### **Quand une vidéo se charge :**
```
✅ VIDÉO CHARGÉE: [ID_DU_POST]
```

### **Quand une vidéo se lance automatiquement :**
```
🎬 VIDÉO LANCÉE AUTOMATIQUEMENT ! [ID_DU_POST]
🎬 VIDÉO LANCÉE APRÈS CHARGEMENT: [ID_DU_POST]
```

### **En cas d'erreur :**
```
❌ ERREUR lancement vidéo: [DÉTAILS_ERREUR]
```

---

## 🔧 **Si vous ne voyez toujours rien :**

### **Test simple :**
1. **Ouvrez l'app**
2. **Allez dans le feed**
3. **Trouvez une vidéo**
4. **Attendez 2-3 secondes**
5. **Regardez la console**

### **Vérifiez que :**
- [ ] L'app est en **mode développement**
- [ ] La **console est ouverte**
- [ ] Il y a des **posts avec vidéos** dans le feed
- [ ] Vous **attendez assez longtemps** (les délais sont de 200ms, 300ms, 500ms)

---

## 📱 **Test Rapide :**

### **1. Ouvrir l'app**
### **2. Aller dans Feed**
### **3. Attendre 5 secondes**
### **4. Vérifier la console**

**Vous devriez voir :**
```
✅ VIDÉO CHARGÉE: [ID]
🎬 VIDÉO LANCÉE AUTOMATIQUEMENT ! [ID]
🎬 VIDÉO LANCÉE APRÈS CHARGEMENT: [ID]
```

---

## 🎯 **Résultat Attendu :**

- **Les vidéos se lancent automatiquement** après 1-2 secondes
- **Les logs apparaissent** dans la console
- **Plus besoin de cliquer** sur play !

---

## 🚨 **En Cas de Problème :**

### **Contactez-moi avec :**
- [ ] **Screenshot** de la console
- [ ] **Description** de ce que vous voyez
- [ ] **Version** de l'app
- [ ] **Type de téléphone**

---

## 🎉 **Objectif :**

**Les vidéos doivent se lancer TOUTES SEULES** comme sur Instagram ! 🚀 