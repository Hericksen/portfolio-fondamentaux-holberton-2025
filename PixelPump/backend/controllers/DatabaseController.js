const { User, Quest, Achievement, UserQuest, UserAchievement } = require('../models/index');
const { Op } = require('sequelize');
const { resetAllUsers } = require('../scripts/resetAllUsers');

const DatabaseController = {
  // Récupérer tous les utilisateurs avec leurs relations
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Quest,
            as: 'assignedQuests',
            through: {
              model: UserQuest,
              attributes: ['is_completed', 'completed_at', 'progress']
            },
            attributes: ['id', 'title', 'description', 'category', 'xp_reward', 'difficulty']
          },
          {
            model: Achievement,
            as: 'unlockedAchievements',
            through: {
              model: UserAchievement,
              attributes: ['unlocked_at']
            },
            attributes: ['id', 'title', 'description', 'icon', 'rarity', 'xp_reward']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message
      });
    }
  },

  // Récupérer toutes les quêtes avec les utilisateurs assignés
  async getAllQuests(req, res) {
    try {
      const quests = await Quest.findAll({
        include: [
          {
            model: User,
            as: 'assignedUsers',
            through: {
              model: UserQuest,
              attributes: ['is_completed', 'completed_at', 'progress']
            },
            attributes: ['id', 'username', 'email', 'level', 'xp']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: quests,
        count: quests.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des quêtes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des quêtes',
        error: error.message
      });
    }
  },

  // Récupérer tous les achievements avec les utilisateurs qui les ont débloqués
  async getAllAchievements(req, res) {
    try {
      const achievements = await Achievement.findAll({
        include: [
          {
            model: User,
            as: 'achievedByUsers',
            through: {
              model: UserAchievement,
              attributes: ['unlocked_at']
            },
            attributes: ['id', 'username', 'email', 'level', 'xp']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: achievements,
        count: achievements.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des achievements:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des achievements',
        error: error.message
      });
    }
  },

  // Récupérer les statistiques générales
  async getStats(req, res) {
    try {
      const [
        totalUsers,
        totalQuests,
        totalAchievements,
        completedQuests,
        unlockedAchievements,
        activeUsers
      ] = await Promise.all([
        User.count(),
        Quest.count(),
        Achievement.count(),
        UserQuest.count({ where: { is_completed: true } }),
        UserAchievement.count(),
        User.count({
          where: {
            last_login: {
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 jours
            }
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalQuests,
          totalAchievements,
          completedQuests,
          unlockedAchievements,
          activeUsers,
          completionRate: totalQuests > 0 ? (completedQuests / totalQuests * 100).toFixed(2) : 0
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  },

  // Récupérer un utilisateur spécifique avec toutes ses données
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Quest,
            as: 'assignedQuests',
            through: {
              model: UserQuest,
              attributes: ['is_completed', 'completed_at', 'progress', 'assigned_at']
            }
          },
          {
            model: Achievement,
            as: 'unlockedAchievements',
            through: {
              model: UserAchievement,
              attributes: ['unlocked_at']
            }
          }
        ]
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
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur',
        error: error.message
      });
    }
  },

  // Réinitialiser tous les utilisateurs
  async resetAllUsers(req, res) {
    try {
      console.log('🔄 Demande de réinitialisation de tous les utilisateurs par admin:', req.user?.email);
      
      // Vérifier que l'utilisateur est admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé. Seuls les administrateurs peuvent réinitialiser les utilisateurs.'
        });
      }

      // Exécuter la réinitialisation
      await resetAllUsers();
      
      // Compter les utilisateurs après réinitialisation
      const userCount = await User.count();
      
      res.json({
        success: true,
        message: 'Tous les utilisateurs ont été réinitialisés avec succès',
        data: {
          usersReset: userCount,
          resetDetails: {
            xp: 0,
            level: 1,
            streak: 0,
            totalQuestsCompleted: 0,
            lastQuestDate: null,
            avatar: 'default',
            userQuestsDeleted: true,
            userAchievementsDeleted: true
          }
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation des utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réinitialisation des utilisateurs',
        error: error.message
      });
    }
  },

  // Récupérer les statistiques globales pour l'admin
  async getAdminStats(req, res) {
    try {
      // Compter les utilisateurs totaux
      const totalUsers = await User.count();
      
      // Compter les utilisateurs actifs (connectés dans les 7 derniers jours)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const activeUsers = await User.count({
        where: {
          last_login: {
            [Op.gte]: weekAgo
          }
        }
      });
      
      // Compter les quêtes totales
      const totalQuests = await Quest.count();
      
      // Compter les achievements totaux
      const totalAchievements = await Achievement.count();
      
      // Calculer l'XP total distribué
      const allUsers = await User.findAll({
        attributes: ['xp']
      });
      const totalXpDistributed = allUsers.reduce((sum, user) => sum + user.xp, 0);
      
      // Utilisateurs par niveau
      const usersByLevel = await User.findAll({
        attributes: ['level'],
        group: ['level'],
        raw: true
      });
      
      // Quêtes complétées cette semaine
      const weeklyQuestsCompleted = await UserQuest.count({
        where: {
          is_completed: true,
          completed_at: {
            [Op.gte]: weekAgo
          }
        }
      });

      const stats = {
        totalUsers,
        activeUsers,
        totalQuests,
        totalAchievements,
        totalXpDistributed,
        usersByLevel,
        weeklyQuestsCompleted,
        generatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        message: 'Statistiques récupérées avec succès',
        data: stats
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }
};

module.exports = DatabaseController;
