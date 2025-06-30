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
  },

  // Récupérer toutes les données du dashboard personnel de l'utilisateur
  async getDashboard(req, res) {
    try {
      const userId = req.user.userId;
      const GamificationService = require('../services/GamificationService');
      
      // Récupérer les données complètes de l'utilisateur
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

      // Récupérer les données de progression
      const progress = await GamificationService.getUserProgress(userId);

      // Calculer des statistiques additionnelles pour le dashboard
      const { UserQuest, UserAchievement, Quest, Achievement } = require('../models');
      
      // Quêtes récentes (dernières 5)
      const recentQuests = await UserQuest.findAll({
        where: { user_id: userId },
        include: [{ 
          model: Quest,
          attributes: ['id', 'title', 'description', 'category', 'xp_reward', 'difficulty']
        }],
        order: [['assigned_at', 'DESC']],
        limit: 5
      });

      // Achievements récents (derniers 3)
      const recentAchievements = await UserAchievement.findAll({
        where: { user_id: userId },
        include: [{ 
          model: Achievement,
          attributes: ['id', 'title', 'description', 'icon', 'rarity', 'xp_reward']
        }],
        order: [['unlocked_at', 'DESC']],
        limit: 3
      });

      // Statistiques hebdomadaires
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weeklyStats = {
        questsCompleted: await UserQuest.count({
          where: {
            user_id: userId,
            is_completed: true,
            completed_at: { [require('sequelize').Op.gte]: weekAgo }
          }
        }),
        xpEarned: progress.user.xp - (progress.user.xp - (progress.todayQuests.completed * 50)), // Estimation approximative
        streakDays: user.streak
      };

      // Objectifs et progression
      const goals = {
        dailyQuests: {
          target: user.fitness_goals.daily_quests,
          completed: progress.todayQuests.completed,
          remaining: Math.max(0, user.fitness_goals.daily_quests - progress.todayQuests.completed)
        },
        weeklyXp: {
          target: user.fitness_goals.weekly_xp,
          earned: weeklyStats.xpEarned,
          remaining: Math.max(0, user.fitness_goals.weekly_xp - weeklyStats.xpEarned)
        },
        targetLevel: {
          current: user.level,
          target: user.fitness_goals.target_level,
          progress: Math.min(100, Math.round((user.level / user.fitness_goals.target_level) * 100))
        }
      };

      // Dashboard data complet
      const dashboardData = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          avatar: user.avatar,
          fitness_goals: user.fitness_goals,
          preferences: user.preferences,
          stats: user.stats,
          total_quests_completed: user.total_quests_completed,
          last_login: user.last_login,
          created_at: user.created_at
        },
        progress,
        recentActivity: {
          quests: recentQuests,
          achievements: recentAchievements
        },
        weeklyStats,
        goals,
        nextLevel: {
          xpNeeded: user.getXpForNextLevel(),
          currentLevel: user.level,
          progress: Math.max(0, 100 - Math.round((user.getXpForNextLevel() / (Math.pow(user.level, 2) * 100)) * 100))
        }
      };

      res.json({
        success: true,
        message: 'Dashboard récupéré avec succès',
        data: dashboardData
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
};

module.exports = UserController;
