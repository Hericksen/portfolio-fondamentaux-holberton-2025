# PixelPump 🎮

Une application de gamification fitness avec système de quêtes, avatars personnalisables et interface cyberpunk.

## 🚀 Installation

### Prérequis
- Node.js 18+
- PostgreSQL 13+
- npm

### Démarrage rapide
```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend  
cd frontend
npm install
npm run dev
```

## � Fonctionnalités

- Système de quêtes quotidiennes/hebdomadaires/mensuelles
- Avatars pixel art personnalisables
- Progression par niveaux et XP
- Interface cyberpunk responsive
- Authentification sécurisée
- Dashboard administrateur

## 📡 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Doc: http://localhost:3001/

## 🛠️ Scripts

### Backend
```bash
npm run dev              # Développement
npm run maintenance      # Nettoyage BD
npm run create-quests    # Créer quêtes
npm run update-role      # Modifier rôle
```

### Frontend
```bash
npm run dev              # Développement
npm run build            # Build production
npm run preview          # Prévisualiser build
```

## 📖 API

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Quêtes
- `GET /api/advanced-quests/active` - Quêtes actives
- `POST /api/advanced-quests/:id/complete` - Compléter quête

### Utilisateurs
- `GET /api/users/dashboard/me` - Dashboard utilisateur
- `PUT /api/users/profile` - Modifier profil

## 📄 Licence

MIT
