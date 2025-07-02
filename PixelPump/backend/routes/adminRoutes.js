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

// === Statistiques ===
// Obtenir les statistiques générales du système
router.get('/stats', adminController.getSystemStats);

module.exports = router;
