const User = require('../models/User');
const { Quest, UserQuest } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const AdminController = {
  // Récupérer tous les utilisateurs avec leurs statistiques (admin seulement)
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [
          {
            model: UserQuest,
            required: false,
            attributes: ['status'],
            include: [{
              model: Quest,
              attributes: ['title', 'xp_reward']
            }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Calculer les statistiques pour chaque utilisateur
      const usersWithStats = users.map(user => {
        const userQuests = user.UserQuests || [];
        const completedQuests = userQuests.filter(uq => uq.is_completed === true);
        const pendingQuests = userQuests.filter(uq => uq.is_completed === false && !uq.is_expired);
        const expiredQuests = userQuests.filter(uq => uq.is_expired === true);
        
        return {
          ...user.toJSON(),
          stats: {
            totalQuests: userQuests.length,
            completedQuests: completedQuests.length,
            pendingQuests: pendingQuests.length,
            expiredQuests: expiredQuests.length,
            completionRate: userQuests.length > 0 ? 
              Math.round((completedQuests.length / userQuests.length) * 100) : 0
          }
        };
      });

      res.json({
        success: true,
        data: usersWithStats,
        count: usersWithStats.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  // Supprimer un utilisateur (admin seulement)
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      
      // Vérifier que ce n'est pas l'admin qui se supprime lui-même
      if (req.user.userId === userId) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte'
        });
      }

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Supprimer d'abord toutes les quêtes assignées à l'utilisateur
      await UserQuest.destroy({
        where: { user_id: userId }
      });

      // Supprimer l'utilisateur
      await user.destroy();

      res.json({
        success: true,
        message: `Utilisateur ${user.username} supprimé avec succès`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  // Supprimer plusieurs utilisateurs (admin seulement)
  async deleteMultipleUsers(req, res) {
    try {
      const { userIds } = req.body;
      
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({
          success: false,
          message: 'userIds (array) est requis'
        });
      }

      // Vérifier que l'admin ne se supprime pas lui-même
      if (userIds.includes(req.user.userId)) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte'
        });
      }

      const users = await User.findAll({
        where: { id: { [Op.in]: userIds } }
      });

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Aucun utilisateur trouvé'
        });
      }

      // Supprimer toutes les quêtes assignées à ces utilisateurs
      await UserQuest.destroy({
        where: { user_id: { [Op.in]: userIds } }
      });

      // Supprimer les utilisateurs
      const deletedCount = await User.destroy({
        where: { id: { [Op.in]: userIds } }
      });

      res.json({
        success: true,
        message: `${deletedCount} utilisateur(s) supprimé(s) avec succès`,
        data: {
          deletedCount,
          deletedUsers: users.map(u => ({ id: u.id, username: u.username }))
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

  // Assigner une quête à un utilisateur (admin seulement)
  async assignQuestToUser(req, res) {
    try {
      const { userId, questId } = req.body;
      
      if (!userId || !questId) {
        return res.status(400).json({
          success: false,
          message: 'userId et questId sont requis'
        });
      }

      // Vérifier que l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier que la quête existe et est un template
      const quest = await Quest.findOne({
        where: { id: questId, is_template: true, is_active: true }
      });
      
      if (!quest) {
        return res.status(404).json({
          success: false,
          message: 'Quête non trouvée ou inactive'
        });
      }

      // Vérifier si la quête n'est pas déjà assignée à cet utilisateur
      const existingAssignment = await UserQuest.findOne({
        where: { 
          user_id: userId, 
          quest_id: questId, 
          is_completed: false,
          is_expired: false
        }
      });

      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'Cette quête est déjà assignée à cet utilisateur'
        });
      }

      // Créer l'assignation
      const userQuest = await UserQuest.create({
        user_id: userId,
        quest_id: questId,
        is_completed: false,
        assigned_at: new Date()
      });

      // Récupérer les détails complets pour la réponse
      const fullUserQuest = await UserQuest.findByPk(userQuest.id, {
        include: [
          { 
            model: Quest,
            attributes: ['id', 'title', 'description', 'type', 'category', 'xp_reward', 'difficulty', 'duration_minutes']
          },
          {
            model: User,
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: `Quête "${quest.title}" assignée avec succès à ${user.username}`,
        data: fullUserQuest
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Assigner plusieurs quêtes à un utilisateur (admin seulement)
  async assignMultipleQuestsToUser(req, res) {
    try {
      const { userId, questIds } = req.body;
      
      if (!userId || !questIds || !Array.isArray(questIds)) {
        return res.status(400).json({
          success: false,
          message: 'userId et questIds (array) sont requis'
        });
      }

      // Vérifier que l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      const results = [];
      const errors = [];

      for (const questId of questIds) {
        try {
          // Vérifier que la quête existe et est un template
          const quest = await Quest.findOne({
            where: { id: questId, is_template: true, is_active: true }
          });
          
          if (!quest) {
            errors.push(`Quête ${questId}: non trouvée ou inactive`);
            continue;
          }

          // Vérifier si la quête n'est pas déjà assignée
          const existingAssignment = await UserQuest.findOne({
            where: { 
              user_id: userId, 
              quest_id: questId, 
              is_completed: false,
              is_expired: false
            }
          });

          if (existingAssignment) {
            errors.push(`Quête "${quest.title}": déjà assignée`);
            continue;
          }

          // Créer l'assignation
          const userQuest = await UserQuest.create({
            user_id: userId,
            quest_id: questId,
            is_completed: false,
            assigned_at: new Date()
          });

          results.push({
            questId,
            questTitle: quest.title,
            userQuestId: userQuest.id
          });
        } catch (error) {
          errors.push(`Quête ${questId}: ${error.message}`);
        }
      }

      res.status(201).json({
        success: true,
        message: `${results.length} quête(s) assignée(s) avec succès à ${user.username}`,
        data: {
          assigned: results,
          errors: errors,
          user: {
            id: user.id,
            username: user.username
          }
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

  // Assigner une quête à plusieurs utilisateurs (admin seulement)
  async assignQuestToMultipleUsers(req, res) {
    try {
      const { userIds, questId } = req.body;
      
      if (!userIds || !Array.isArray(userIds) || !questId) {
        return res.status(400).json({
          success: false,
          message: 'userIds (array) et questId sont requis'
        });
      }

      // Vérifier que la quête existe et est un template
      const quest = await Quest.findOne({
        where: { id: questId, is_template: true, is_active: true }
      });
      
      if (!quest) {
        return res.status(404).json({
          success: false,
          message: 'Quête non trouvée ou inactive'
        });
      }

      // Vérifier que tous les utilisateurs existent
      const users = await User.findAll({
        where: { id: { [Op.in]: userIds } }
      });

      if (users.length !== userIds.length) {
        return res.status(404).json({
          success: false,
          message: 'Certains utilisateurs sont introuvables'
        });
      }

      const results = [];
      const errors = [];

      for (const userId of userIds) {
        try {
          const user = users.find(u => u.id == userId);
          
          // Vérifier si la quête n'est pas déjà assignée
          const existingAssignment = await UserQuest.findOne({
            where: { 
              user_id: userId, 
              quest_id: questId, 
              is_completed: false,
              is_expired: false
            }
          });

          if (existingAssignment) {
            errors.push(`${user.username}: quête déjà assignée`);
            continue;
          }

          // Créer l'assignation
          const userQuest = await UserQuest.create({
            user_id: userId,
            quest_id: questId,
            is_completed: false,
            assigned_at: new Date()
          });

          results.push({
            userId,
            username: user.username,
            userQuestId: userQuest.id
          });
        } catch (error) {
          const user = users.find(u => u.id == userId);
          errors.push(`${user?.username || userId}: ${error.message}`);
        }
      }

      res.status(201).json({
        success: true,
        message: `Quête "${quest.title}" assignée avec succès à ${results.length} utilisateur(s)`,
        data: {
          quest: {
            id: quest.id,
            title: quest.title
          },
          assigned: results,
          errors: errors
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

  // Obtenir les statistiques générales (admin seulement)
  async getSystemStats(req, res) {
    try {
      // Compter les utilisateurs
      const totalUsers = await User.count();
      const activeUsers = await User.count({
        where: { 
          updatedAt: { 
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
          } 
        }
      });

      // Compter les quêtes
      const totalQuests = await Quest.count({ where: { is_template: true } });
      const activeQuests = await Quest.count({ where: { is_template: true, is_active: true } });

      // Compter les assignations de quêtes
      const totalAssignments = await UserQuest.count();
      const completedAssignments = await UserQuest.count({ where: { is_completed: true } });
      const pendingAssignments = await UserQuest.count({ where: { is_completed: false, is_expired: false } });

      res.json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            active: activeUsers
          },
          quests: {
            total: totalQuests,
            active: activeQuests
          },
          assignments: {
            total: totalAssignments,
            completed: completedAssignments,
            pending: pendingAssignments,
            completionRate: totalAssignments > 0 ? 
              Math.round((completedAssignments / totalAssignments) * 100) : 0
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
};

module.exports = AdminController;
