const { Quest, UserQuest, QuestCycle, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const AdvancedQuestScheduler = require('../services/AdvancedQuestScheduler');

const AdvancedQuestController = {
  
  // Récupérer les quêtes actives d'un utilisateur avec détails du cycle
  async getUserActiveQuests(req, res) {
    try {
      const userId = req.user.userId;
      const now = new Date();

      const activeQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          is_completed: false,
          is_expired: false,
          [Op.or]: [
            { expires_at: null },
            { expires_at: { [Op.gte]: now } }
          ]
        },
        include: [
          {
            model: Quest,
            attributes: ['id', 'title', 'description', 'type', 'category', 'xp_reward', 'difficulty', 'requirements']
          },
          {
            model: QuestCycle,
            attributes: ['id', 'type', 'start_date', 'end_date'],
            required: false
          }
        ],
        order: [['assigned_at', 'DESC']]
      });

      // Grouper par type
      const groupedQuests = {
        daily: [],
        weekly: [],
        monthly: [],
        special: []
      };

      activeQuests.forEach(userQuest => {
        const type = userQuest.Quest.type;
        groupedQuests[type].push({
          id: userQuest.id,
          quest: userQuest.Quest,
          progress: userQuest.progress,
          assigned_at: userQuest.assigned_at,
          expires_at: userQuest.expires_at,
          cycle: userQuest.QuestCycle,
          streak_bonus: userQuest.streak_bonus,
          time_remaining: userQuest.expires_at ? 
            moment(userQuest.expires_at).diff(moment(), 'hours') : null
        });
      });

      // Statistiques des quêtes
      const stats = {
        total_active: activeQuests.length,
        by_type: {
          daily: groupedQuests.daily.length,
          weekly: groupedQuests.weekly.length,
          monthly: groupedQuests.monthly.length,
          special: groupedQuests.special.length
        },
        completion_rate: await AdvancedQuestController.getUserCompletionRate(userId),
        current_streak: await AdvancedQuestController.getUserStreak(userId)
      };

      res.json({
        success: true,
        message: 'Quêtes actives récupérées',
        data: {
          quests: groupedQuests,
          stats
        }
      });

    } catch (error) {
      console.error('Erreur getUserActiveQuests:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des quêtes',
        error: error.message
      });
    }
  },

  // Récupérer l'historique des quêtes d'un utilisateur
  async getUserQuestHistory(req, res) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 20, type, status } = req.query;

      const whereClause = { user_id: userId };
      
      if (type && ['daily', 'weekly', 'monthly', 'special'].includes(type)) {
        whereClause['$Quest.type$'] = type;
      }
      
      if (status === 'completed') {
        whereClause.is_completed = true;
      } else if (status === 'expired') {
        whereClause.is_expired = true;
      }

      const { count, rows: questHistory } = await UserQuest.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Quest,
            attributes: ['id', 'title', 'description', 'type', 'category', 'xp_reward', 'difficulty']
          },
          {
            model: QuestCycle,
            attributes: ['type', 'start_date', 'end_date'],
            required: false
          }
        ],
        order: [['assigned_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      res.json({
        success: true,
        data: {
          quests: questHistory,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(count / parseInt(limit)),
            total_items: count,
            per_page: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Erreur getUserQuestHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        error: error.message
      });
    }
  },

  // Marquer une quête comme complétée
  async completeQuest(req, res) {
    try {
      const { questId } = req.params;
      const userId = req.user.userId;
      const { progress_data, progress } = req.body;
      
      // Accepter soit progress_data soit progress pour plus de flexibilité
      const progressInfo = progress_data || progress;

      const userQuest = await UserQuest.findOne({
        where: {
          id: questId,
          user_id: userId,
          is_completed: false,
          is_expired: false
        },
        include: [Quest]
      });

      if (!userQuest) {
        return res.status(404).json({
          success: false,
          message: 'Quête non trouvée ou déjà complétée'
        });
      }

      // Vérifier si la quête n'a pas expiré
      if (userQuest.expires_at && moment().isAfter(userQuest.expires_at)) {
        await userQuest.update({ is_expired: true, expired_at: new Date() });
        return res.status(400).json({
          success: false,
          message: 'Cette quête a expiré'
        });
      }

      // Calculer les bonus
      const streak = await AdvancedQuestController.getUserStreak(userId);
      const streakBonus = Math.floor(userQuest.Quest.xp_reward * (streak * 0.1)); // 10% par jour de série
      const totalXp = userQuest.Quest.xp_reward + streakBonus;

      // Marquer comme complétée
      await userQuest.update({
        is_completed: true,
        completed_at: new Date(),
        progress: progressInfo || { completed: true },
        streak_bonus: streakBonus,
        bonus_xp: streakBonus
      });

      // Mettre à jour l'utilisateur
      const user = await User.findByPk(userId);
      await user.increment('xp', { by: totalXp });
      await user.increment('total_quests_completed', { by: 1 });
      
      // Mettre à jour la série si c'est une quête quotidienne
      if (userQuest.Quest.type === 'daily') {
        await AdvancedQuestController.updateUserStreak(userId);
      }

      // Vérifier les achievements
      await AdvancedQuestController.checkQuestAchievements(userId);

      res.json({
        success: true,
        message: 'Quête complétée avec succès !',
        data: {
          quest: userQuest,
          xp_earned: totalXp,
          streak_bonus: streakBonus,
          current_streak: streak + (userQuest.Quest.type === 'daily' ? 1 : 0)
        }
      });

    } catch (error) {
      console.error('Erreur completeQuest:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la complétion de la quête',
        error: error.message
      });
    }
  },

  // Obtenir les cycles de quêtes actifs
  async getActiveCycles(req, res) {
    try {
      const cycles = await QuestCycle.findAll({
        where: {
          is_active: true,
          end_date: { [Op.gte]: new Date() }
        },
        order: [['start_date', 'DESC']]
      });

      const cycleStats = await Promise.all(cycles.map(async (cycle) => {
        const questCount = await UserQuest.count({
          where: { cycle_id: cycle.id }
        });
        
        const completedCount = await UserQuest.count({
          where: { 
            cycle_id: cycle.id,
            is_completed: true 
          }
        });

        return {
          ...cycle.toJSON(),
          quest_count: questCount,
          completed_count: completedCount,
          completion_rate: questCount > 0 ? Math.round((completedCount / questCount) * 100) : 0,
          time_remaining: moment(cycle.end_date).diff(moment(), 'hours')
        };
      }));

      res.json({
        success: true,
        data: cycleStats
      });

    } catch (error) {
      console.error('Erreur getActiveCycles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des cycles',
        error: error.message
      });
    }
  },

  // Forcer l'assignation de quêtes manquantes (méthode admin/debug)
  async forceAssignQuests(req, res) {
    try {
      const userId = req.user.userId;
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
      }

      const { target_user_id } = req.body;
      const targetUserId = target_user_id || userId;

      const result = await AdvancedQuestScheduler.testAssignUser(targetUserId);

      res.json({
        success: true,
        message: 'Quêtes assignées manuellement',
        data: { quests_assigned: result }
      });

    } catch (error) {
      console.error('Erreur forceAssignQuests:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'assignation forcée',
        error: error.message
      });
    }
  },

  // === MÉTHODES ADMIN ===

  // Réinitialiser toutes les quêtes de tous les utilisateurs (méthode admin/debug)
  async resetAllUserQuests(req, res) {
    try {
      const userId = req.user.userId;
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé - Administrateur requis'
        });
      }

      console.log(`🔄 Admin ${userId} réinitialise toutes les quêtes utilisateurs`);

      // Supprimer toutes les quêtes utilisateur existantes
      const deletedQuests = await UserQuest.destroy({
        where: {}
      });

      // Supprimer tous les cycles existants
      const deletedCycles = await QuestCycle.destroy({
        where: {}
      });

      console.log(`✅ ${deletedQuests} quêtes supprimées, ${deletedCycles} cycles supprimés`);

      res.json({
        success: true,
        message: 'Toutes les quêtes utilisateurs ont été réinitialisées',
        data: {
          deleted_quests: deletedQuests,
          deleted_cycles: deletedCycles,
          reset_by: req.user.username,
          reset_at: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Erreur resetAllUserQuests:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réinitialisation des quêtes',
        error: error.message
      });
    }
  },

  // Obtenir des statistiques admin sur les quêtes
  async getAdminStats(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé - Administrateur requis'
        });
      }

      const totalUsers = await User.count();
      const totalQuests = await Quest.count();
      const totalUserQuests = await UserQuest.count();
      const completedQuests = await UserQuest.count({ where: { is_completed: true } });
      const activeCycles = await QuestCycle.count({ where: { is_active: true } });

      const stats = {
        total_users: totalUsers,
        total_quests: totalQuests,
        total_user_quests: totalUserQuests,
        completed_quests: completedQuests,
        active_cycles: activeCycles,
        completion_rate: totalUserQuests > 0 ? Math.round((completedQuests / totalUserQuests) * 100) : 0
      };

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Erreur getAdminStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  },

  // === MÉTHODES UTILITAIRES ===

  async getUserCompletionRate(userId) {
    try {
      const last30Days = moment().subtract(30, 'days').toDate();
      
      const totalQuests = await UserQuest.count({
        where: {
          user_id: userId,
          assigned_at: { [Op.gte]: last30Days }
        }
      });

      const completedQuests = await UserQuest.count({
        where: {
          user_id: userId,
          assigned_at: { [Op.gte]: last30Days },
          is_completed: true
        }
      });

      return totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
    } catch (error) {
      console.error('Erreur getUserCompletionRate:', error);
      return 0;
    }
  },

  async getUserStreak(userId) {
    try {
      // Pour simplifier, on récupère le streak depuis la table User
      const user = await User.findByPk(userId, {
        attributes: ['streak']
      });
      
      return user ? user.streak : 0;
    } catch (error) {
      console.error('Erreur getUserStreak:', error);
      return 0;
    }
  },

  async updateUserStreak(userId) {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        // Incrémenter le streak de 1 pour une quête quotidienne complétée
        await user.increment('streak', { by: 1 });
        console.log(`📈 Streak mis à jour pour l'utilisateur ${userId}: ${user.streak + 1}`);
      }
    } catch (error) {
      console.error('Erreur updateUserStreak:', error);
    }
  },

  async checkQuestAchievements(userId) {
    // À implémenter selon les besoins spécifiques
    console.log(`🏆 Vérification des quest achievements pour l'utilisateur ${userId}`);
  }
};

module.exports = AdvancedQuestController;
