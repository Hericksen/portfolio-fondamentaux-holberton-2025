const express = require('express');
const router = express.Router();
const questController = require('../controllers/QuestController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Routes publiques (pour admin/debug et sans authentification)
router.get('/', questController.getAllQuests);

// Route unique pour le renouvellement des quêtes démo
router.post('/demo/renew', questController.renewQuestsForDemo);
router.post('/demo/renew/:userId', questController.renewQuestsForDemo);

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

// Gestion des quêtes expirées
router.post('/expired/process', questController.processUserExpiredQuests);
router.post('/expired/process/:userId', questController.processUserExpiredQuests);

// Statistiques
router.get('/stats', questController.getQuestStats);
router.get('/stats/:userId', questController.getQuestStats);

// Routes admin seulement
router.post('/assign/user', adminMiddleware, questController.assignQuestToUser);
router.post('/expired/process-all', adminMiddleware, questController.processExpiredQuests);
router.post('/expired/cleanup', adminMiddleware, questController.cleanupExpiredQuests);
router.delete('/:questId', questController.deleteQuest);
router.delete('/user/:userId', adminMiddleware, questController.deleteUser);

module.exports = router;
