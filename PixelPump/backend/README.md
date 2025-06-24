# PixelPump Backend

# PixelPump Backend API

Backend API pour la plateforme de gamification PixelPump - Transformez votre portfolio en jeu !

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos paramètres

# Initialiser la base de données avec des données de test
npm run seed

# Démarrer le serveur
npm start
```

## 🔧 Configuration

Créez un fichier `.env` avec :

```env
# Base de données PostgreSQL
DB_NAME=portfolio
DB_USER=postgres
DB_PASS=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432

# JWT Secret
JWT_SECRET=votre_secret_jwt_securise

# Serveur
PORT=3001
NODE_ENV=development
```

## 📡 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier le token

### Utilisateurs

- `GET /api/users` - Liste des utilisateurs (protégé)
- `GET /api/users/:id` - Détails d'un utilisateur (protégé)
- `GET /api/users/:id/profile` - Profil complet avec projets (protégé)
- `PUT /api/users/:id` - Modifier un utilisateur (protégé)
- `DELETE /api/users/:id` - Supprimer un utilisateur (protégé)
- `GET /api/users/:id/projects` - Projets d'un utilisateur (protégé)

### Projets

- `GET /api/projects` - Liste des projets (public)
- `GET /api/projects/:id` - Détails d'un projet (public)
- `POST /api/projects` - Créer un projet (protégé)
- `PUT /api/projects/:id` - Modifier un projet (protégé)
- `DELETE /api/projects/:id` - Supprimer un projet (protégé)

### Quêtes

- `GET /api/quests` - Liste des quêtes (public)
- `POST /api/quests` - Créer une quête (protégé)
- `GET /api/quests/user/:userId` - Quêtes d'un utilisateur (protégé)
- `PUT /api/quests/:questId/complete` - Compléter une quête (protégé)
- `DELETE /api/quests/:questId` - Supprimer une quête (protégé)

### Succès

- `GET /api/achievements` - Liste des succès (public)
- `POST /api/achievements` - Créer un succès (protégé)
- `GET /api/achievements/user/:userId` - Succès d'un utilisateur (protégé)
- `PUT /api/achievements/:achievementId/unlock` - Débloquer un succès (protégé)
- `DELETE /api/achievements/:achievementId` - Supprimer un succès (protégé)

## Technologies utilisées

- **Node.js** avec Express.js
- **PostgreSQL** avec Sequelize ORM
- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe

## Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd PixelPump/backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de la base de données**
- Créer une base de données PostgreSQL nommée `portfolio`
- Copier `.env.example` vers `.env` et modifier les variables d'environnement
- Exécuter le script SQL d'initialisation:
```bash
psql -U postgres -d portfolio -f ../database/init.sql
```

4. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Créer un nouveau compte
- `POST /api/auth/login` - Se connecter

### Users
- `GET /api/users` - Obtenir tous les utilisateurs
- `GET /api/users/:id` - Obtenir un utilisateur par ID
- `GET /api/users/:id/profile` - Obtenir le profil complet d'un utilisateur
- `PUT /api/users/:id` - Mettre à jour un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Quests
- `GET /api/quests` - Obtenir toutes les quêtes
- `POST /api/quests` - Créer une nouvelle quête
- `GET /api/quests/user/:userId` - Obtenir les quêtes d'un utilisateur
- `PUT /api/quests/:questId/complete` - Marquer une quête comme terminée
- `DELETE /api/quests/:questId` - Supprimer une quête

### Achievements
- `GET /api/achievements` - Obtenir tous les achievements
- `POST /api/achievements` - Créer un nouvel achievement
- `GET /api/achievements/user/:userId` - Obtenir les achievements d'un utilisateur
- `PUT /api/achievements/:achievementId/unlock` - Débloquer un achievement
- `DELETE /api/achievements/:achievementId` - Supprimer un achievement

### Projects
- `GET /api/projects` - Obtenir tous les projets
- `POST /api/projects` - Créer un nouveau projet
- `GET /api/projects/:id` - Obtenir un projet par ID
- `PUT /api/projects/:id` - Mettre à jour un projet
- `DELETE /api/projects/:id` - Supprimer un projet

## Variables d'environnement

Créer un fichier `.env` avec les variables suivantes:

```
DB_NAME=portfolio
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

## Structure du projet

```
backend/
├── controllers/     # Logique des contrôleurs
├── models/         # Modèles Sequelize
├── routes/         # Définition des routes
├── services/       # Logique métier
├── middleware/     # Middleware personnalisé
├── config/         # Configuration (DB, etc.)
├── app.js          # Point d'entrée principal
└── package.json    # Dépendances et scripts
```

## Tests

Pour tester la base de données:
```bash
psql -U postgres -f ../database/test_init.sql
```

## Déploiement

1. Configurer les variables d'environnement de production
2. Installer les dépendances: `npm install --production`
3. Démarrer le serveur: `npm start`
