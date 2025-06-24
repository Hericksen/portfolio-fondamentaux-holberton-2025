const express = require('express');
const router = express.Router();
const questController = require('../controllers/QuestController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', questController.getAllQuests);

// Routes protégées
router.use(authMiddleware);
router.post('/', questController.createQuest);
router.get('/user/:userId', questController.getUserQuests);
router.put('/:questId/complete', questController.completeQuest);
router.delete('/:questId', questController.deleteQuest);

module.exports = router;
