const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Route d'information sur les endpoints disponibles
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Endpoints d'authentification PixelPump",
    endpoints: {
      "POST /api/auth/register": "Inscription d'un nouvel utilisateur",
      "POST /api/auth/login": "Connexion utilisateur",
      "GET /api/auth/verify": "Vérification d'un token JWT"
    },
    example: {
      register: {
        url: "POST /api/auth/register",
        body: {
          username: "exemple",
          email: "exemple@email.com", 
          password: "motdepasse123"
        }
      },
      login: {
        url: "POST /api/auth/login",
        body: {
          email: "exemple@email.com",
          password: "motdepasse123" 
        }
      }
    }
  });
});

// Route d'inscription
router.post('/register', authController.register);

// Route de connexion
router.post('/login', authController.login);

// Route de test de token
router.get('/verify', authController.verifyToken);

// Route pour obtenir un token d'administrateur
router.post('/admin-token', authController.getAdminToken);

// Route de test pour vérifier les permissions d'admin
router.get('/admin-test', adminMiddleware, (req, res) => {
  res.json({
    success: true,
    message: '🔑 Accès administrateur confirmé !',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
