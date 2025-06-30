# ⚡ PixelPump - Plateforme Fitness Gamifiée

<div align="center">

![PixelPump Logo](https://img.shields.io/badge/PixelPump-Fitness%20Gamifié-ff006e?style=for-the-badge&logo=game&logoColor=white)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Transformez votre routine fitness en aventure épique !**

[🎮 Démo](#demo) • [🚀 Installation](#installation) • [📚 Documentation](#documentation) • [🤝 Contribution](#contribution)

</div>

---

## 🎯 À propos

**PixelPump** est une plateforme fitness gamifiée innovante qui transforme vos objectifs de santé en une aventure de jeu vidéo captivante. Gagnez des XP, déverrouillez des succès, personnalisez votre avatar et suivez votre progression dans un environnement motivant et engageant.

### ✨ Fonctionnalités principales

- 🎮 **Gamification complète** : Système XP, niveaux, streaks et récompenses
- 🏆 **Système de succès** : Débloquez des achievements uniques
- ⚔️ **Quêtes dynamiques** : Défis quotidiens et hebdomadaires personnalisés
- 👤 **Avatar personnalisable** : Créez votre identité fitness unique
- 📊 **Tableaux de bord** : Suivi détaillé de vos performances
- 🔄 **Progression en temps réel** : Statistiques et analyses avancées

---

## 🖥️ Aperçu de l'interface

### Dashboard Principal
Interface moderne avec statistiques en temps réel, objectifs personnalisés et suivi de progression.

### Système de Quêtes  
Défis quotidiens adaptatifs avec récompenses XP et unlocks d'achievements.

### Profil Utilisateur
Gestion complète de l'avatar, préférences et historique des performances.

---

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/pixelpump.git
cd pixelpump

# Installation des dépendances Backend
cd PixelPump/backend
npm install

# Installation des dépendances Frontend  
cd ../frontend
npm install

# Configuration de la base de données
# Créer une base PostgreSQL nommée 'pixelpump'
# Copier .env.example vers .env et configurer les variables

# Démarrage des services
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 🎮 Compte de démonstration

Utilisez ces identifiants pour tester l'application :

```
Email: test@example.com
Password: password123
```

---

## 🏗️ Architecture

### Stack technique

**Backend (Node.js + Express)**
- API RESTful avec authentication JWT
- Base de données PostgreSQL avec Sequelize ORM
- Système de gamification avec calculs XP/niveaux
- Gestion automatique des quêtes et achievements

**Frontend (React + TypeScript)**
- Interface moderne avec design responsive
- Hooks personnalisés pour la gestion d'état
- Système de routing avec protection des routes
- Animations et transitions fluides

### Structure du projet

```
PixelPump/
├── backend/                 # API Node.js
│   ├── controllers/        # Logique métier
│   ├── models/            # Modèles de données
│   ├── routes/            # Routes API
│   ├── services/          # Services (gamification, etc.)
│   └── middleware/        # Middlewares d'auth
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages principales
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── services/      # Services API
└── database/              # Scripts SQL
```

---

## 📚 API Documentation

### Endpoints principaux

#### Authentication
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/verify` - Vérification du token

#### Dashboard
- `GET /api/users/dashboard/me` - Dashboard personnalisé utilisateur
- `GET /api/users/profile/me` - Profil utilisateur complet

#### Quêtes
- `GET /api/quests` - Liste des quêtes disponibles
- `GET /api/quests/user/:userId` - Quêtes de l'utilisateur
- `PUT /api/quests/:questId/complete` - Marquer une quête terminée

#### Achievements
- `GET /api/achievements` - Liste des succès
- `GET /api/achievements/user/:userId` - Succès utilisateur
- `PUT /api/achievements/:achievementId/unlock` - Débloquer un succès

---

## 🎯 Fonctionnalités avancées

### Système de gamification

- **XP et Niveaux** : Progression basée sur l'activité
- **Streaks** : Récompenses pour la régularité  
- **Achievements** : Plus de 15 succès à débloquer
- **Quêtes adaptatives** : Défis personnalisés selon le niveau

### Analytics et suivi

- Tableaux de bord temps réel
- Statistiques hebdomadaires/mensuelles
- Historique de progression détaillé
- Objectifs intelligents et adaptatifs

---

## 🎨 Design System

### Palette de couleurs

- **Primaire**: `#ff006e` (Rose électrique)
- **Secondaire**: `#8338ec` (Violet vibrant)  
- **Accent**: `#06ffa5` (Vert néon)
- **Arrière-plan**: Dégradés sombres avec effets de lumière

### Typographie

- **Headings**: Polices bold avec effets de gradient
- **Body**: Arial/Helvetica pour la lisibilité
- **Effets**: Text-shadow et glow pour l'ambiance gaming

---

## 🔧 Développement

### Scripts disponibles

```bash
# Backend
npm run dev          # Serveur de développement
npm run start        # Production
npm run seed         # Peupler la base avec des données de test

# Frontend  
npm run dev          # Serveur de développement Vite
npm run build        # Build de production
npm run preview      # Aperçu du build
```

### Tests

```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Coverage
npm run test:coverage
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)  
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

### Guidelines

- Code clean et commenté
- Tests unitaires pour les nouvelles fonctionnalités
- Documentation à jour
- Respect des conventions de nommage

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Contact & Support

**Développeur**: Votre Nom  
**Email**: votre.email@example.com  
**Portfolio**: [votre-portfolio.com](https://votre-portfolio.com)

### Links utiles

- [🐛 Reporter un bug](https://github.com/votre-username/pixelpump/issues)
- [💡 Suggérer une fonctionnalité](https://github.com/votre-username/pixelpump/discussions)
- [📖 Documentation complète](https://pixelpump-docs.com)

---

<div align="center">

**⚡ PixelPump - Transformez votre fitness en aventure ! ⚡**

*Fait avec ❤️ et beaucoup de ☕*

</div>
