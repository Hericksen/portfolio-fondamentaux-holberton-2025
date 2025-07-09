const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const featuredAchievementsController = require('../controllers/FeaturedAchievementsController');

// Route publique - création d'utilisateur (inscription)
router.post('/', userController.create);

// Routes protégées
router.use(authMiddleware);

// Routes du profil utilisateur courant (AVANT les routes avec :id)
router.get('/profile/me', userController.getProfile);
router.put('/profile/me', userController.updateProfile);

// Route pour récupérer les données du dashboard personnel (AVANT les routes avec :id)
router.get('/dashboard/me', userController.getDashboard);

// Routes pour les achievements mis en avant
router.get('/profile/featured-achievements', featuredAchievementsController.getFeaturedAchievements);
router.put('/profile/featured-achievements', featuredAchievementsController.updateFeaturedAchievements);

// Route pour mettre à jour l'avatar de l'utilisateur connecté
router.put('/avatar', userController.updateMyAvatar);

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

// Mettre à jour partiellement un utilisateur (PATCH)
router.patch('/:id', userController.update);

// Supprimer un utilisateur
router.delete('/:id', userController.remove);

module.exports = router;
