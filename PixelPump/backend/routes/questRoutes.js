const express = require('express');
const router = express.Router();
const questController = require('../controllers/QuestController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques (pour admin/debug)
router.get('/', questController.getAllQuests);

// Routes protégées
router.use(authMiddleware);

// Gestion des quêtes utilisateur
router.get('/user/:userId', questController.getUserQuests);
router.get('/user', questController.getUserQuests);
router.get('/today', questController.getTodayQuests);
router.post('/assign/daily', questController.assignDailyQuests);
router.put('/:questId/complete', questController.completeQuest);

// Gestion des templates (admin)
router.post('/', questController.createQuest);
router.delete('/:questId', questController.deleteQuest);

module.exports = router;
