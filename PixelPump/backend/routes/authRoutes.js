const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Route d'inscription
router.post('/register', authController.register);

// Route de connexion
router.post('/login', authController.login);

// Route de test de token
router.get('/verify', authController.verifyToken);

module.exports = router;
