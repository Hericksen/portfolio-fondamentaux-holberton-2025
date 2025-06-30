const User = require('../models/User');
const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');

const UserController = {
  async create(req, res) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Tous les champs sont requis' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          success: false,
          message: 'Email ou nom d\'utilisateur déjà utilisé' 
        });
      }
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async getAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async getOne(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
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
        data: user
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async getUserProfile(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
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
        data: user
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      // Si le mot de passe est fourni, le hacher
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      await user.update(req.body);
      
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      res.json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async remove(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      await user.destroy();
      res.json({ 
        success: true,
        message: 'Utilisateur supprimé' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Mettre à jour l'avatar d'un utilisateur
  async updateAvatar(req, res) {
    try {
      const { id } = req.params;
      const { avatar } = req.body;
      
      // Vérifier que l'utilisateur connecté modifie son propre profil ou qu'il soit admin
      if (req.user.userId !== id && !req.user.isAdmin) {
        return res.status(403).json({ 
          success: false,
          message: 'Non autorisé' 
        });
      }

      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      await user.update({ avatar });
      
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      res.json({
        success: true,
        message: 'Avatar mis à jour',
        data: userResponse
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Ajouter de l'XP à un utilisateur
  async addXp(req, res) {
    try {
      const { id } = req.params;
      const { xp } = req.body;
      
      if (!xp || xp <= 0) {
        return res.status(400).json({ 
          success: false,
          message: 'XP invalide' 
        });
      }

      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      const oldLevel = user.level;
      const leveledUp = await user.addXp(xp);
      
      res.json({
        success: true,
        message: `${xp} XP ajoutés`,
        data: {
          newXp: user.xp,
          newLevel: user.level,
          leveledUp,
          xpGained: xp
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Récupérer les stats de progression d'un utilisateur
  async getProgress(req, res) {
    try {
      const { id } = req.params;
      const GamificationService = require('../services/GamificationService');
      
      const progress = await GamificationService.getUserProgress(id);
      
      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },

  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // S'assurer que le profil est complet
      user.initializeProfile();
      await user.save();

      res.json({
        success: true,
        message: 'Profil récupéré avec succès',
        profile: user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const updates = req.body;

      // Champs autorisés pour la mise à jour du profil
      const allowedFields = ['username', 'avatar', 'fitness_goals', 'preferences'];
      const filteredUpdates = {};

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      await user.update(filteredUpdates);

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        profile: userResponse
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
};

module.exports = UserController;
