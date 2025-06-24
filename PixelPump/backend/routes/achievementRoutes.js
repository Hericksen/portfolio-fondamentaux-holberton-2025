const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/AchievementController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', achievementController.getAllAchievements);

// Routes protégées
router.use(authMiddleware);
router.post('/', achievementController.createAchievement);
router.get('/user/:userId', achievementController.getUserAchievements);
router.put('/:achievementId/unlock', achievementController.unlockAchievement);
router.delete('/:achievementId', achievementController.deleteAchievement);

module.exports = router;
