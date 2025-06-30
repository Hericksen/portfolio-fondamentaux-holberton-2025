const express = require('express');
const router = express.Router();
const DatabaseController = require('../controllers/DatabaseController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Toutes les routes sont protégées par adminMiddleware
router.use(adminMiddleware);

// Route d'information sur les endpoints disponibles
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Endpoints d'administration de la base de données PixelPump",
    note: "🔒 Toutes ces routes nécessitent des permissions administrateur",
    endpoints: {
      "GET /api/database/users": "Récupérer tous les utilisateurs avec leurs relations",
      "GET /api/database/quests": "Récupérer toutes les quêtes avec les utilisateurs assignés",
      "GET /api/database/achievements": "Récupérer tous les achievements avec les utilisateurs",
      "GET /api/database/stats": "Récupérer les statistiques générales",
      "GET /api/database/users/:id": "Récupérer un utilisateur spécifique avec toutes ses données",
      "POST /api/database/reset-users": "⚠️ DANGEREUX: Réinitialiser tous les utilisateurs à 0"
    },
    adminInfo: {
      user: req.user.email,
      role: req.user.role,
      isTemporary: req.user.isTemporary || false
    }
  });
});

// Routes pour récupérer les données
router.get('/users', DatabaseController.getAllUsers);
router.get('/quests', DatabaseController.getAllQuests);
router.get('/achievements', DatabaseController.getAllAchievements);
router.get('/stats', DatabaseController.getStats);
router.get('/users/:id', DatabaseController.getUserById);

// Route dangereuse de réinitialisation (POST pour plus de sécurité)
router.post('/reset-users', DatabaseController.resetAllUsers);

module.exports = router;
