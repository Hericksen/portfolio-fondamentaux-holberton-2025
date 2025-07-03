const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Toutes les routes admin nécessitent une authentification admin
router.use(adminMiddleware);

// === Gestion des utilisateurs ===
// Récupérer tous les utilisateurs avec leurs statistiques
router.get('/users', adminController.getAllUsers);

// Supprimer un utilisateur
router.delete('/users/:userId', adminController.deleteUser);

// Supprimer plusieurs utilisateurs
router.delete('/users', adminController.deleteMultipleUsers);

// === Gestion des quêtes ===
// Assigner une quête à un utilisateur
router.post('/assign-quest', adminController.assignQuestToUser);

// Assigner plusieurs quêtes à un utilisateur
router.post('/assign-multiple-quests', adminController.assignMultipleQuestsToUser);

// Assigner une quête à plusieurs utilisateurs
router.post('/assign-quest-to-multiple-users', adminController.assignQuestToMultipleUsers);

// Créer une nouvelle quête
router.post('/quests', adminController.createQuest);

// Modifier une quête existante
router.put('/quests/:questId', adminController.updateQuest);

// Supprimer une quête
router.delete('/quests/:questId', adminController.deleteQuest);

// Obtenir toutes les quêtes avec leurs assignations
router.get('/quests', adminController.getAllQuestsAdmin);

// === Gestion des achievements ===
// Créer un nouvel achievement
router.post('/achievements', adminController.createAchievement);

// Modifier un achievement existant
router.put('/achievements/:achievementId', adminController.updateAchievement);

// Supprimer un achievement
router.delete('/achievements/:achievementId', adminController.deleteAchievement);

// Obtenir tous les achievements avec leurs débloquages
router.get('/achievements', adminController.getAllAchievementsAdmin);

// Attribuer un achievement à un utilisateur
router.post('/assign-achievement', adminController.assignAchievementToUser);

// Révoquer un achievement d'un utilisateur
router.delete('/revoke-achievement', adminController.revokeAchievementFromUser);

// === Statistiques ===
// Obtenir les statistiques générales du système
router.get('/stats', adminController.getSystemStats);

module.exports = router;
