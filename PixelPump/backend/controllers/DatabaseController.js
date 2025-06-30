const { User, Project, Quest, Achievement, UserQuest, UserAchievement } = require('../models/index');
const { Op } = require('sequelize');

const DatabaseController = {
  // Récupérer tous les utilisateurs avec leurs relations
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Project,
            as: 'projects',
            attributes: ['id', 'title', 'description', 'createdAt']
          },
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

  // Récupérer tous les projets avec leurs utilisateurs
  async getAllProjects(req, res) {
    try {
      const projects = await Project.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'level', 'xp']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: projects,
        count: projects.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des projets',
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
        totalProjects,
        completedQuests,
        unlockedAchievements,
        activeUsers
      ] = await Promise.all([
        User.count(),
        Quest.count(),
        Achievement.count(),
        Project.count(),
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
          totalProjects,
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
            model: Project,
            as: 'projects'
          },
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
  }
};

module.exports = DatabaseController;
