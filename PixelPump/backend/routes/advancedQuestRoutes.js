const express = require('express');
const router = express.Router();
const AdvancedQuestController = require('../controllers/AdvancedQuestController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// === ROUTES UTILISATEUR ===

// Récupérer les quêtes actives de l'utilisateur connecté
router.get('/active', AdvancedQuestController.getUserActiveQuests);

// Récupérer l'historique des quêtes de l'utilisateur
router.get('/history', AdvancedQuestController.getUserQuestHistory);

// Marquer une quête comme complétée
router.post('/:questId/complete', AdvancedQuestController.completeQuest);

// Obtenir les cycles de quêtes actifs
router.get('/cycles', AdvancedQuestController.getActiveCycles);

// === ROUTES ADMIN ===

// Forcer l'assignation de quêtes (admin uniquement)
router.post('/admin/force-assign', adminMiddleware, AdvancedQuestController.forceAssignQuests);

// Statistiques détaillées des quêtes (admin)
router.get('/admin/stats', adminMiddleware, async (req, res) => {
  try {
    const { Quest, UserQuest, QuestCycle, User } = require('../models');
    const { Op } = require('sequelize');
    const moment = require('moment');

    // Statistiques générales
    const totalQuests = await Quest.count();
    const totalUserQuests = await UserQuest.count();
    const completedQuests = await UserQuest.count({ where: { is_completed: true } });
    const activeCycles = await QuestCycle.count({ where: { is_active: true } });

    // Statistiques par type de quête
    const questsByType = await Quest.findAll({
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type']
    });

    // Taux de complétion par difficulté
    const completionByDifficulty = await Quest.findAll({
      attributes: [
        'difficulty',
        [require('sequelize').fn('COUNT', require('sequelize').col('Quest.id')), 'total']
      ],
      group: ['Quest.difficulty'],
      raw: true
    });

    // Utilisateurs les plus actifs (derniers 7 jours)
    const weekAgo = moment().subtract(7, 'days').toDate();
    const topUsers = await User.findAll({
      attributes: ['id', 'username', 'xp', 'level', 'streak'],
      order: [['xp', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        overview: {
          total_quests: totalQuests,
          total_user_quests: totalUserQuests,
          completed_quests: completedQuests,
          active_cycles: activeCycles,
          global_completion_rate: totalUserQuests > 0 ? Math.round((completedQuests / totalUserQuests) * 100) : 0
        },
        quests_by_type: questsByType,
        completion_by_difficulty: completionByDifficulty,
        top_users: topUsers
      }
    });

  } catch (error) {
    console.error('Erreur admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

module.exports = router;
