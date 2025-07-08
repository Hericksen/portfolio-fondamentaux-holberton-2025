const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Créer une application Express indépendante
const app = express();

// Activer CORS
app.use(cors());
app.use(express.json());

// Route racine pour tester
app.get('/', (req, res) => {
  res.json({ 
    message: 'Service de renouvellement de quêtes PixelPump',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Initialiser la base de données et les modèles
const initDatabase = async () => {
  try {
    // Import database connection
    const sequelize = require('../config/db');
    console.log('✅ Configuration DB chargée');

    // Import models avec relations
    require('../models/index');
    console.log('✅ Modèles chargés');

    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL établie avec succès');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
};

// Route pour renouveler les quêtes (sans authentification)
app.post('/renew', async (req, res) => {
  try {
    console.log('🎮 Service indépendant: Demande de renouvellement des quêtes reçue');
    
    // Utiliser l'ID de l'utilisateur démo par défaut
    const userId = 1; // Admin démo
    
    // Importer les modèles nécessaires après l'initialisation
    const { User } = require('../models');
    const LoginQuestService = require('./LoginQuestService');
    
    // Récupérer l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur démo non trouvé'
      });
    }
    
    console.log(`✅ Utilisateur trouvé: ${user.username}`);
    
    // Renouveler les quêtes
    const result = await LoginQuestService.renewQuestsForDemoUser(user);
    
    console.log(`✅ ${result.count} nouvelles quêtes assignées`);
    
    return res.json({
      success: true,
      message: `Quêtes renouvelées avec succès pour ${user.username}`,
      data: {
        count: result.count,
        quests: result.quests
      }
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du renouvellement des quêtes',
      error: error.message
    });
  }
});

// Démarrer le serveur sur un port différent
const PORT = 3002;

// Initialiser la DB puis démarrer le serveur
async function startServer() {
  const dbInitialized = await initDatabase();
  
  if (dbInitialized) {
    app.listen(PORT, () => {
      console.log(`🚀 Service de renouvellement des quêtes démarré sur le port ${PORT}`);
    });
  } else {
    console.error('❌ Le service n\'a pas pu démarrer à cause d\'erreurs de connexion à la base de données');
    process.exit(1);
  }
}

// Exporter la fonction pour démarrer le serveur
module.exports = {
  startServer
};

// Si ce fichier est exécuté directement, démarrer le serveur
if (require.main === module) {
  startServer();
}
