const User = require('../models/User');
const { Quest, UserQuest, Achievement, UserAchievement } = require('../models');
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
  },

  // === GESTION DES QUÊTES ===
  
  // Créer une nouvelle quête
  async createQuest(req, res) {
    try {
      const { title, description, category, xp_reward, difficulty, type, conditions, duration, max_participants } = req.body;
      
      const quest = await Quest.create({
        title,
        description,
        category,
        xp_reward: xp_reward || 100,
        difficulty: difficulty || 'normal',
        type: type || 'daily',
        conditions: conditions || {},
        duration: duration || 24,
        max_participants: max_participants || null,
        created_by: req.user.id
      });

      console.log(`✅ Nouvelle quête créée par admin ${req.user.email}: "${title}"`);

      res.status(201).json({
        success: true,
        message: 'Quête créée avec succès',
        data: quest
      });
    } catch (error) {
      console.error('Erreur création quête:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la quête',
        error: error.message
      });
    }
  },

  // Modifier une quête existante
  async updateQuest(req, res) {
    try {
      const { questId } = req.params;
      const updateData = req.body;

      const quest = await Quest.findByPk(questId);
      if (!quest) {
        return res.status(404).json({
          success: false,
          message: 'Quête non trouvée'
        });
      }

      await quest.update(updateData);

      console.log(`✅ Quête "${quest.title}" modifiée par admin ${req.user.email}`);

      res.json({
        success: true,
        message: 'Quête mise à jour avec succès',
        data: quest
      });
    } catch (error) {
      console.error('Erreur modification quête:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification de la quête',
        error: error.message
      });
    }
  },

  // Supprimer une quête
  async deleteQuest(req, res) {
    try {
      const { questId } = req.params;

      const quest = await Quest.findByPk(questId);
      if (!quest) {
        return res.status(404).json({
          success: false,
          message: 'Quête non trouvée'
        });
      }

      // Supprimer d'abord toutes les assignations de cette quête
      await UserQuest.destroy({ where: { quest_id: questId } });
      
      const questTitle = quest.title;
      await quest.destroy();

      console.log(`🗑️ Quête "${questTitle}" supprimée par admin ${req.user.email}`);

      res.json({
        success: true,
        message: 'Quête supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression quête:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la quête',
        error: error.message
      });
    }
  },

  // Obtenir toutes les quêtes avec assignations
  async getAllQuestsAdmin(req, res) {
    try {
      const quests = await Quest.findAll({
        include: [
          {
            model: UserQuest,
            required: false,
            include: [
              {
                model: User,
                attributes: ['id', 'username', 'email']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      const questsWithStats = quests.map(quest => {
        const assignments = quest.UserQuests || [];
        const completed = assignments.filter(uq => uq.is_completed).length;
        const pending = assignments.filter(uq => !uq.is_completed && !uq.is_expired).length;
        const expired = assignments.filter(uq => uq.is_expired).length;

        return {
          ...quest.toJSON(),
          stats: {
            totalAssignments: assignments.length,
            completed,
            pending,
            expired,
            completionRate: assignments.length > 0 ? Math.round((completed / assignments.length) * 100) : 0
          }
        };
      });

      res.json({
        success: true,
        data: questsWithStats,
        count: questsWithStats.length
      });
    } catch (error) {
      console.error('Erreur récupération quêtes admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des quêtes',
        error: error.message
      });
    }
  },

  // === GESTION DES ACHIEVEMENTS ===

  // Créer un nouvel achievement
  async createAchievement(req, res) {
    try {
      const { title, description, icon, rarity, xp_reward, conditions, category } = req.body;
      
      const achievement = await Achievement.create({
        title,
        description,
        icon: icon || '🏆',
        rarity: rarity || 'common',
        xp_reward: xp_reward || 50,
        conditions: conditions || {},
        category: category || 'general',
        created_by: req.user.id
      });

      console.log(`✅ Nouvel achievement créé par admin ${req.user.email}: "${title}"`);

      res.status(201).json({
        success: true,
        message: 'Achievement créé avec succès',
        data: achievement
      });
    } catch (error) {
      console.error('Erreur création achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'achievement',
        error: error.message
      });
    }
  },

  // Modifier un achievement existant
  async updateAchievement(req, res) {
    try {
      const { achievementId } = req.params;
      const updateData = req.body;

      const achievement = await Achievement.findByPk(achievementId);
      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement non trouvé'
        });
      }

      await achievement.update(updateData);

      console.log(`✅ Achievement "${achievement.title}" modifié par admin ${req.user.email}`);

      res.json({
        success: true,
        message: 'Achievement mis à jour avec succès',
        data: achievement
      });
    } catch (error) {
      console.error('Erreur modification achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification de l\'achievement',
        error: error.message
      });
    }
  },

  // Supprimer un achievement
  async deleteAchievement(req, res) {
    try {
      const { achievementId } = req.params;

      const achievement = await Achievement.findByPk(achievementId);
      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement non trouvé'
        });
      }

      // Supprimer d'abord toutes les attributions de cet achievement
      await UserAchievement.destroy({ where: { achievement_id: achievementId } });
      
      const achievementTitle = achievement.title;
      await achievement.destroy();

      console.log(`🗑️ Achievement "${achievementTitle}" supprimé par admin ${req.user.email}`);

      res.json({
        success: true,
        message: 'Achievement supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'achievement',
        error: error.message
      });
    }
  },

  // Obtenir tous les achievements avec attributions
  async getAllAchievementsAdmin(req, res) {
    try {
      const achievements = await Achievement.findAll({
        include: [
          {
            model: UserAchievement,
            required: false,
            include: [
              {
                model: User,
                attributes: ['id', 'username', 'email']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      const achievementsWithStats = achievements.map(achievement => {
        const attributions = achievement.UserAchievements || [];

        return {
          ...achievement.toJSON(),
          stats: {
            totalUnlocked: attributions.length,
            users: attributions.map(ua => ua.User)
          }
        };
      });

      res.json({
        success: true,
        data: achievementsWithStats,
        count: achievementsWithStats.length
      });
    } catch (error) {
      console.error('Erreur récupération achievements admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des achievements',
        error: error.message
      });
    }
  },

  // Attribuer un achievement à un utilisateur
  async assignAchievementToUser(req, res) {
    try {
      const { userId, achievementId } = req.body;

      // Vérifier que l'utilisateur et l'achievement existent
      const user = await User.findByPk(userId);
      const achievement = await Achievement.findByPk(achievementId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement non trouvé'
        });
      }

      // Vérifier si l'achievement n'est pas déjà attribué
      const existing = await UserAchievement.findOne({
        where: { user_id: userId, achievement_id: achievementId }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Cet achievement est déjà attribué à cet utilisateur'
        });
      }

      // Créer l'attribution
      await UserAchievement.create({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date()
      });

      // Ajouter l'XP à l'utilisateur
      await user.update({
        xp: user.xp + achievement.xp_reward
      });

      console.log(`🏆 Achievement "${achievement.title}" attribué à ${user.username} par admin ${req.user.email}`);

      res.json({
        success: true,
        message: 'Achievement attribué avec succès',
        data: {
          user: user.username,
          achievement: achievement.title,
          xp_gained: achievement.xp_reward
        }
      });
    } catch (error) {
      console.error('Erreur attribution achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'attribution de l\'achievement',
        error: error.message
      });
    }
  },

  // Révoquer un achievement d'un utilisateur
  async revokeAchievementFromUser(req, res) {
    try {
      const { userId, achievementId } = req.body;

      const userAchievement = await UserAchievement.findOne({
        where: { user_id: userId, achievement_id: achievementId },
        include: [
          { model: User, attributes: ['username', 'xp'] },
          { model: Achievement, attributes: ['title', 'xp_reward'] }
        ]
      });

      if (!userAchievement) {
        return res.status(404).json({
          success: false,
          message: 'Attribution d\'achievement non trouvée'
        });
      }

      // Retirer l'XP de l'utilisateur
      const user = userAchievement.User;
      const achievement = userAchievement.Achievement;
      
      await user.update({
        xp: Math.max(0, user.xp - achievement.xp_reward)
      });

      // Supprimer l'attribution
      await userAchievement.destroy();

      console.log(`🗑️ Achievement "${achievement.title}" révoqué de ${user.username} par admin ${req.user.email}`);

      res.json({
        success: true,
        message: 'Achievement révoqué avec succès',
        data: {
          user: user.username,
          achievement: achievement.title,
          xp_lost: achievement.xp_reward
        }
      });
    } catch (error) {
      console.error('Erreur révocation achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la révocation de l\'achievement',
        error: error.message
      });
    }
  }
};

module.exports = AdminController;
