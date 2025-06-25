const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/AchievementController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques (pour admin/debug)
router.get('/', achievementController.getAllAchievements);

// Routes protégées
router.use(authMiddleware);

// Gestion des achievements utilisateur
router.get('/user/:userId', achievementController.getUserAchievements);
router.get('/user', achievementController.getUserAchievements);
router.post('/check', achievementController.checkAchievements);
router.put('/:achievementId/unlock', achievementController.unlockAchievement);

// Gestion des templates (admin)
router.post('/', achievementController.createAchievement);
router.delete('/:achievementId', achievementController.deleteAchievement);

module.exports = router;
