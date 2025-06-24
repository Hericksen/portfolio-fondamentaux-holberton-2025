# 🎮 PixelPump - Plateforme Gamifiée de Gestion de Projets

## 🚀 Description

PixelPump est une plateforme web moderne avec un design cyberpunk/pixel art qui gamifie la gestion de projets et le suivi de progression. Elle combine un frontend React interactif avec un backend Node.js robuste et une base de données PostgreSQL.

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Framework** : React 18 avec TypeScript
- **Build Tool** : Vite
- **Styling** : TailwindCSS avec thème cyberpunk personnalisé
- **Routing** : React Router v6
- **État global** : Context API pour l'authentification

### Backend (Node.js + Express)
- **Framework** : Express.js
- **ORM** : Sequelize
- **Base de données** : PostgreSQL
- **Authentification** : JWT tokens
- **Architecture** : MVC (Models, Views, Controllers)

## 📁 Structure du Projet

```
PixelPump/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── services/       # Services API
│   │   └── lib/           # Utilitaires
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # API Node.js
│   ├── controllers/        # Contrôleurs MVC
│   ├── models/            # Modèles Sequelize
│   ├── routes/            # Routes Express
│   ├── config/            # Configuration DB
│   ├── middleware/        # Middlewares
│   ├── services/          # Services métier
│   ├── seeds/             # Données de test
│   ├── package.json
│   └── app.js             # Point d'entrée
│
└── README.md              # Ce fichier
```

## 🎯 Fonctionnalités

### 🔐 Authentification
- Inscription/Connexion sécurisée
- Gestion des sessions JWT
- Protection des routes

### 📊 Dashboard Interactif
- Vue d'ensemble des projets
- Statistiques en temps réel
- Navigation intuitive

### 🎮 Système de Gamification
- Quêtes et défis
- Système d'achievements
- Progression personnalisée

### 👤 Gestion des Utilisateurs
- Profils personnalisables
- Avatars pixel art
- Suivi de l'activité

### 🔧 Administration
- Panel d'administration
- Exploration de la base de données
- Gestion des utilisateurs

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v16+)
- PostgreSQL
- npm ou yarn

### 1. Configuration de la Base de Données
```bash
# Créer la base de données PostgreSQL
createdb pixelpump_db
```

### 2. Installation Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurer les variables d'environnement
npm run dev           # Démarrage en mode développement (port 3001)
```

### 3. Installation Frontend
```bash
cd frontend
npm install
npm run dev          # Démarrage en mode développement (port 3000)
```

## 🎨 Design System

### Palette Couleurs Cyberpunk
- **Principal** : `#ff006e` (Rose néon)
- **Secondaire** : `#8338ec` (Violet électrique)
- **Accent** : `#3a86ff` (Bleu cyber)
- **Background** : Dégradés sombres avec nuances de violet

### Composants UI
- Boutons avec effets de glow
- Cards avec bordures néon
- Animations fluides
- Police monospace pour l'aspect cyber

## 🔗 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérification du token

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Profil utilisateur
- `PUT /api/users/:id` - Mise à jour profil

### Projets
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Création projet
- `PUT /api/projects/:id` - Mise à jour projet

### Quêtes
- `GET /api/quests` - Liste des quêtes
- `GET /api/quests/user/:userId` - Quêtes utilisateur
- `PUT /api/quests/:id/complete` - Compléter une quête

### Achievements
- `GET /api/achievements` - Liste des achievements
- `GET /api/achievements/user/:userId` - Achievements utilisateur
- `PUT /api/achievements/:id/unlock` - Débloquer un achievement

## 🛠️ Technologies Utilisées

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT
- bcrypt
- CORS

## 🚀 Déploiement

### Production
1. Build du frontend : `npm run build`
2. Configuration des variables d'environnement
3. Déploiement sur serveur (Heroku, Vercel, etc.)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Holberton School Portfolio Project**
- École : Holberton School
- Année : 2025
- Spécialisation : Développement Full-Stack

---

🎮 **PixelPump** - *Transformez vos projets en aventures cyberpunk !*
