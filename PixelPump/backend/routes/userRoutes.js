const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

// Route publique - création d'utilisateur (inscription)
router.post('/', userController.create);

// Routes protégées
router.use(authMiddleware);

// Récupérer tous les utilisateurs
router.get('/', userController.getAll);

// Récupérer un utilisateur par ID
router.get('/:id', userController.getOne);

// Récupérer le profil utilisateur avec projets
router.get('/:id/profile', userController.getUserProfile);

// API spécifiques gamification
router.put('/:id/avatar', userController.updateAvatar);
router.patch('/:id/xp', userController.addXp);
router.get('/:id/progress', userController.getProgress);

// Mettre à jour un utilisateur
router.put('/:id', userController.update);

// Supprimer un utilisateur
router.delete('/:id', userController.remove);

module.exports = router;
