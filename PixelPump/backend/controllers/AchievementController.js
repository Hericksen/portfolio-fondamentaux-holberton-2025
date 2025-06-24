const Achievement = require('../models/Achievement');

const AchievementController = {
  async getAllAchievements(req, res) {
    try {
      const achievements = await Achievement.findAll();
      res.json({ success: true, data: achievements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async createAchievement(req, res) {
    try {
      const achievement = await Achievement.create(req.body);
      res.status(201).json({ success: true, data: achievement });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async getUserAchievements(req, res) {
    try {
      // Pour l'instant on retourne tous les achievements
      const achievements = await Achievement.findAll();
      res.json({ success: true, data: achievements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async unlockAchievement(req, res) {
    try {
      const { achievementId } = req.params;
      const achievement = await Achievement.findByPk(achievementId);
      
      if (!achievement) {
        return res.status(404).json({ success: false, message: 'Succès non trouvé' });
      }

      // Logique de débloquage de succès
      res.json({ success: true, message: 'Succès débloqué', data: achievement });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async deleteAchievement(req, res) {
    try {
      const { achievementId } = req.params;
      const achievement = await Achievement.findByPk(achievementId);
      
      if (!achievement) {
        return res.status(404).json({ success: false, message: 'Succès non trouvé' });
      }

      await achievement.destroy();
      res.json({ success: true, message: 'Succès supprimé' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = AchievementController;
