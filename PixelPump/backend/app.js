const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('🔄 Démarrage de PixelPump Backend...');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middlewares configurés');

// Route racine et health check
app.get('/', (req, res) => {
  res.json({
    message: 'PixelPump Backend API 🚀',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (POST /register, POST /login, GET /verify, POST /admin-token)',
      users: '/api/users (GET /, GET /:id, POST /, PUT /:id, DELETE /:id)',
      quests: '/api/quests (GET /, POST /, GET /user/:userId, PUT /:questId/complete)',
      achievements: '/api/achievements (GET /, POST /, GET /user/:userId, PUT /:achievementId/unlock)',
      database: '/api/database (🔒 Admin only - GET /users, /quests, /achievements, /stats)',
      admin: '/api/admin (🔒 Admin only - User/Quest management, system stats)'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

console.log('✅ Routes de base configurées');

// Import des routes
try {
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const questRoutes = require('./routes/questRoutes');
  const achievementRoutes = require('./routes/achievementRoutes');
  const databaseRoutes = require('./routes/databaseRoutes');
  const advancedQuestRoutes = require('./routes/advancedQuestRoutes');
  const adminRoutes = require('./routes/adminRoutes');

  // Utilisation des routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/quests', questRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/database', databaseRoutes);
  app.use('/api/advanced-quests', advancedQuestRoutes);
  app.use('/api/admin', adminRoutes);

  console.log('✅ Routes API configurées');
} catch (error) {
  console.error('❌ Erreur lors du chargement des routes:', error);
}

// Middleware de gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Middleware de gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Import database connection
    const sequelize = require('./config/db');
    console.log('✅ Configuration DB chargée');

    // Import models avec relations
    require('./models/index');
    console.log('✅ Modèles chargés');

    // Initialiser le scheduler de quêtes avancé
    const AdvancedQuestScheduler = require('./services/AdvancedQuestScheduler');
    AdvancedQuestScheduler.init();

    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès');

    // Synchronisation des modèles (force: false pour préserver les données)
    await sequelize.sync({ force: false });
    console.log('✅ Base de données synchronisée');

    // Initialiser le système de quêtes automatiquement
    const QuestInitializationService = require('./services/QuestInitializationService');
    await QuestInitializationService.initializeQuestSystem();

    // Démarrer le service de gestion des quêtes expirées
    const ExpiredQuestService = require('./services/ExpiredQuestService');
    
    // Traitement initial des quêtes expirées
    console.log('🕒 Traitement initial des quêtes expirées...');
    await ExpiredQuestService.processAllExpiredQuests();
    
    // Planifier un traitement périodique des quêtes expirées (toutes les heures)
    setInterval(async () => {
      try {
        await ExpiredQuestService.processAllExpiredQuests();
      } catch (error) {
        console.error('❌ Erreur lors du traitement périodique des quêtes expirées:', error);
      }
    }, 60 * 60 * 1000); // 1 heure = 60 * 60 * 1000 ms
    
    // Planifier un nettoyage des anciennes quêtes expirées (une fois par jour)
    setInterval(async () => {
      try {
        await ExpiredQuestService.cleanupOldExpiredQuests();
      } catch (error) {
        console.error('❌ Erreur lors du nettoyage des quêtes expirées:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 heures
    
    console.log('✅ Service de gestion des quêtes expirées démarré');

    // Créer les utilisateurs de démo si nécessaire
    const { createDemoUsers } = require('./seeds/seed');
    await createDemoUsers();

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur PixelPump Backend démarré !`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 Documentation API: http://localhost:${PORT}/`);
      console.log(`✨ Prêt pour les tests !`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  try {
    const sequelize = require('./config/db');
    await sequelize.close();
  } catch (err) {
    console.log('Fermeture DB ignorée');
  }
  process.exit(0);
});

startServer();

module.exports = app;
