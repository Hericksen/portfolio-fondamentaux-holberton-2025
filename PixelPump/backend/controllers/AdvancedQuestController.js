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
      const { progress_data } = req.body;

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
        progress: progress_data || { completed: true },
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

  // === MÉTHODES UTILITAIRES ===

  async getUserCompletionRate(userId) {
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
  },

  async getUserStreak(userId) {
    const user = await User.findByPk(userId, { attributes: ['streak'] });
    return user ? user.streak : 0;
  },

  async updateUserStreak(userId) {
    const user = await User.findByPk(userId);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    // Vérifier s'il y a eu une quête complétée hier
    const yesterdayQuest = await UserQuest.findOne({
      where: {
        user_id: userId,
        is_completed: true,
        completed_at: {
          [Op.between]: [yesterday.toDate(), today.toDate()]
        }
      }
    });

    if (yesterdayQuest) {
      // Continuer la série
      await user.increment('streak');
    } else {
      // Recommencer la série
      await user.update({ streak: 1 });
    }

    return user.reload();
  },

  async checkQuestAchievements(userId) {
    // Logique pour vérifier et débloquer les achievements liés aux quêtes
    // À implémenter selon les besoins spécifiques
    console.log(`🏆 Vérification des achievements pour l'utilisateur ${userId}`);
  }
};

module.exports = AdvancedQuestController;
