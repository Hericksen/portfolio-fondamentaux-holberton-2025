const { Quest, UserQuest, User } = require('../models');
const { Op } = require('sequelize');
const GamificationService = require('../services/GamificationService');

const QuestController = {
  // Récupérer toutes les quêtes templates
  async getAllQuests(req, res) {
    try {
      const quests = await Quest.findAll({
        where: { is_template: true, is_active: true }
      });
      res.json({ success: true, data: quests });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer une nouvelle quête template (admin)
  async createQuest(req, res) {
    try {
      const quest = await Quest.create(req.body);
      res.status(201).json({ success: true, data: quest });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les quêtes assignées à un utilisateur
  async getUserQuests(req, res) {
    try {
      const { userId } = req.params;
      
      // Récupérer les quêtes de l'utilisateur connecté ou de l'utilisateur spécifié
      const targetUserId = userId || req.user.userId;
      
      const userQuests = await UserQuest.findAll({
        where: { user_id: targetUserId },
        include: [{ 
          model: Quest,
          attributes: ['id', 'title', 'description', 'type', 'category', 'xp_reward', 'difficulty', 'duration_minutes']
        }],
        order: [['assigned_at', 'DESC']]
      });

      res.json({ 
        success: true, 
        data: userQuests,
        count: userQuests.length
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Assigner les quêtes quotidiennes
  async assignDailyQuests(req, res) {
    try {
      const { userId } = req.body;
      const targetUserId = userId || req.user.userId;
      
      const result = await GamificationService.assignDailyQuests(targetUserId);
      
      res.json({
        success: true,
        message: result.message,
        data: result.quests,
        count: result.count || result.quests.length
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message,
        error: error.message 
      });
    }
  },

  // Compléter une quête
  async completeQuest(req, res) {
    try {
      const { questId } = req.params;
      const userId = req.user.userId;
      
      const result = await GamificationService.completeQuest(userId, questId);
      
      res.json({
        success: true,
        message: result.message,
        data: {
          xpGained: result.xpGained,
          leveledUp: result.leveledUp,
          newLevel: result.newLevel,
          newAchievements: result.newAchievements,
          achievements: result.achievements
        }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  // Récupérer les quêtes du jour pour l'utilisateur connecté
  async getTodayQuests(req, res) {
    try {
      const userId = req.user.userId;
      const today = new Date().toISOString().split('T')[0];
      
      const todayQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          assigned_at: {
            [Op.gte]: new Date(today + 'T00:00:00.000Z'),
            [Op.lt]: new Date(today + 'T23:59:59.999Z')
          }
        },
        include: [{ model: Quest }],
        order: [['assigned_at', 'ASC']]
      });

      res.json({
        success: true,
        data: todayQuests,
        completed: todayQuests.filter(q => q.is_completed).length,
        total: todayQuests.length
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer une quête template (admin)
  async deleteQuest(req, res) {
    try {
      const { questId } = req.params;
      const quest = await Quest.findByPk(questId);
      
      if (!quest) {
        return res.status(404).json({ success: false, message: 'Quête non trouvée' });
      }

      await quest.destroy();
      res.json({ success: true, message: 'Quête supprimée' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = QuestController;
