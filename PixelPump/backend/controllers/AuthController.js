const User = require('../models/User');
const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs sont requis'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email déjà utilisé'
        });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Créer l'utilisateur avec un profil complet par défaut via UserService
      const user = await UserService.createUserWithProfile({
        username,
        email,
        password
      });

      console.log(`✅ Nouvel utilisateur créé: ${username} (${email})`);
      console.log(`🎮 Profil vierge initialisé avec avatar par défaut`);
      console.log(`📊 Stats initiales: Level 1, 0 XP, 0 streak`);
      console.log(`🎯 Objectifs fitness configurés par défaut`);
      console.log(`⚙️ Préférences utilisateur initialisées`);

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'pixelpump_secret_key_2025',
        { expiresIn: '24h' }
      );

      // Réponse sans le mot de passe
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
      }

      // Trouver l'utilisateur
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides'
        });
      }

      // Mettre à jour les stats de connexion
      await user.updateLoginStats();
      
      // S'assurer que le profil est complet (pour les anciens utilisateurs)
      user.initializeProfile();
      await user.save();

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'pixelpump_secret_key_2025',
        { expiresIn: '24h' }
      );

      // Réponse sans le mot de passe
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Connexion réussie',
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  async verifyToken(req, res) {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader) {
        return res.status(401).json({ 
          success: false,
          message: 'Token manquant' 
        });
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pixelpump_secret_key_2025');
      
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Token valide',
        user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  },

  async getAdminToken(req, res) {
    try {
      const { adminSecret } = req.body;
      
      // Vérifier le secret d'admin (pour des raisons de sécurité en développement)
      const ADMIN_SECRET = process.env.ADMIN_SECRET || 'pixelpump_admin_2025';
      
      if (adminSecret !== ADMIN_SECRET) {
        return res.status(401).json({
          success: false,
          message: 'Secret administrateur invalide'
        });
      }

      // Créer un token d'administrateur temporaire
      const adminToken = jwt.sign(
        { 
          userId: 'admin-temp', 
          email: 'admin@pixelpump.dev', 
          role: 'admin',
          isTemporary: true 
        },
        process.env.JWT_SECRET || 'pixelpump_secret_key_2025',
        { expiresIn: '1h' }
      );

      res.json({
        success: true,
        message: 'Token administrateur généré',
        token: adminToken,
        expiresIn: '1h',
        note: 'Token temporaire pour les permissions administrateur'
      });
    } catch (error) {
      console.error('Erreur lors de la génération du token admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
};

module.exports = AuthController;
