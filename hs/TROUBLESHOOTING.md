# 🔧 Guide de résolution des problèmes de connexion PixelPump

## ❌ Problème : "Identifiants invalides" ou "Erreur 404 dashboard"

### 🚀 Solution rapide (recommandée)

1. **Redémarrez complètement PixelPump :**
   ```bash
   # Arrêter tous les services
   pkill -f "npm run dev" || pkill -f "nodemon"
   
   # Utiliser le script de démarrage automatique
   ./start_demo.sh
   ```

2. **Les comptes seront créés automatiquement** avec les bonnes données

### 🎮 Comptes de démo disponibles

| Type | Email | Password | Accès |
|------|-------|----------|-------|
| 👤 Utilisateur | `test@example.com` | `password123` | Dashboard, Profil, Quêtes |
| 👑 Admin | `admin@pixelpump.com` | `admin123` | Interface d'admin + tout le reste |

### 🔍 Diagnostic manuel

Si le problème persiste, vérifiez :

1. **Backend accessible :**
   ```bash
   curl http://localhost:3001/health
   # Doit retourner: {"status":"healthy",...}
   ```

2. **Comptes existants :**
   ```bash
   cd PixelPump/backend
   node scripts/createDemoAccounts.js
   ```

3. **Test de connexion :**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```

### ⚡ Causes communes

- **Base de données recréée** : Le backend était configuré pour recréer les tables à chaque démarrage
- **Services non démarrés** : Backend ou frontend non accessibles
- **Cache navigateur** : Ancien token expiré dans localStorage
- **Port occupé** : Conflit sur les ports 3000/3001

### 🛠️ Solutions spécifiques

**Si le backend ne démarre pas :**
```bash
cd PixelPump/backend
npm install
npm run dev
```

**Si le frontend ne se connecte pas :**
1. Vider le cache du navigateur (F12 → Application → Storage → Clear)
2. Rafraîchir la page
3. Utiliser les boutons de démo sur la page de login

**Si les données sont manquantes :**
```bash
cd PixelPump/backend
node scripts/createDemoData.js
```

### ✅ Vérification du bon fonctionnement

1. **Frontend** accessible sur http://localhost:3000
2. **Backend** accessible sur http://localhost:3001
3. **Page de login** affiche les boutons "🎮 Démo Utilisateur" et "👑 Démo Admin"
4. **Connexion** fonctionne avec les comptes de démo
5. **Dashboard** affiche les statistiques, quêtes et achievements
6. **Interface admin** accessible via le lien "👑 Admin" (pour les admins)

### 📞 Support

En cas de problème persistant :
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez que Node.js 18+ est installé
3. Consultez les logs du terminal pour les erreurs spécifiques

---

**Date de mise à jour :** 1er juillet 2025  
**Version PixelPump :** 1.0.0
