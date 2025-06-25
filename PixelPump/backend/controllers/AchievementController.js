const { Achievement, UserAchievement, User } = require('../models');
const { Op } = require('sequelize');
const GamificationService = require('../services/GamificationService');

const AchievementController = {
  // Récupérer tous les achievements templates
  async getAllAchievements(req, res) {
    try {
      const achievements = await Achievement.findAll({
        where: { is_active: true },
        order: [['rarity', 'ASC'], ['title', 'ASC']]
      });
      res.json({ success: true, data: achievements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer un nouvel achievement template (admin)
  async createAchievement(req, res) {
    try {
      const achievement = await Achievement.create(req.body);
      res.status(201).json({ success: true, data: achievement });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les achievements débloqués par un utilisateur
  async getUserAchievements(req, res) {
    try {
      const { userId } = req.params;
      const targetUserId = userId || req.user.userId;
      
      const userAchievements = await UserAchievement.findAll({
        where: { user_id: targetUserId },
        include: [{ 
          model: Achievement,
          attributes: ['id', 'title', 'description', 'rarity', 'icon', 'xp_reward']
        }],
        order: [['unlocked_at', 'DESC']]
      });

      // Statistiques des achievements
      const totalAchievements = await Achievement.count({ where: { is_active: true } });
      const unlockedCount = userAchievements.length;
      const progressPercentage = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;

      res.json({ 
        success: true, 
        data: userAchievements,
        stats: {
          unlocked: unlockedCount,
          total: totalAchievements,
          progress: progressPercentage
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Débloquer manuellement un achievement (admin/debug)
  async unlockAchievement(req, res) {
    try {
      const { achievementId } = req.params;
      const { userId } = req.body;
      const targetUserId = userId || req.user.userId;
      
      // Vérifier si l'achievement existe
      const achievement = await Achievement.findByPk(achievementId);
      if (!achievement) {
        return res.status(404).json({ success: false, message: 'Achievement non trouvé' });
      }

      // Vérifier si déjà débloqué
      const existingUnlock = await UserAchievement.findOne({
        where: { user_id: targetUserId, achievement_id: achievementId }
      });

      if (existingUnlock) {
        return res.status(400).json({ success: false, message: 'Achievement déjà débloqué' });
      }

      // Débloquer l'achievement
      const userAchievement = await UserAchievement.create({
        user_id: targetUserId,
        achievement_id: achievementId,
        unlocked_at: new Date()
      });

      // Ajouter l'XP bonus
      const user = await User.findByPk(targetUserId);
      if (user) {
        await user.addXp(achievement.xp_reward);
      }

      res.json({
        success: true,
        message: 'Achievement débloqué!',
        data: userAchievement,
        xpGained: achievement.xp_reward
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Vérifier et débloquer automatiquement les achievements d'un utilisateur
  async checkAchievements(req, res) {
    try {
      const userId = req.body.userId || req.user.userId;
      
      // Utiliser le service de gamification pour vérifier les achievements
      const newAchievements = await GamificationService.checkAchievements(userId);
      
      res.json({
        success: true,
        message: `${newAchievements.length} nouveaux achievements débloqués`,
        data: newAchievements
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async deleteAchievement(req, res) {
    try {
      const { achievementId } = req.params;
      const achievement = await Achievement.findByPk(achievementId);
      
      if (!achievement) {
        return res.status(404).json({ success: false, message: 'Achievement non trouvé' });
      }

      await achievement.destroy();
      res.json({ success: true, message: 'Achievement supprimé' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = AchievementController;
