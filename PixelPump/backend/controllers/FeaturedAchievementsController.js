const { User } = require('../models');

// Extension du contrôleur UserController pour gérer les succès mis en avant
const FeaturedAchievementsController = {
  // Récupérer les achievements mis en avant de l'utilisateur
  async getFeaturedAchievements(req, res) {
    try {
      const userId = req.user.userId;
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      
      // Vérifier si l'utilisateur a des préférences pour les achievements mis en avant
      const preferences = user.preferences || {};
      const featuredAchievements = preferences.featured_achievements || [];
      
      res.json({ success: true, featured_achievements: featuredAchievements });
    } catch (error) {
      console.error('Erreur lors de la récupération des achievements mis en avant:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },
  
  // Mettre à jour les achievements mis en avant de l'utilisateur
  async updateFeaturedAchievements(req, res) {
    try {
      const userId = req.user.userId;
      const { featured_achievements } = req.body;
      
      // Valider l'entrée
      if (!Array.isArray(featured_achievements)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Le format des achievements mis en avant est invalide' 
        });
      }
      
      // Limiter à 3 achievements
      if (featured_achievements.length > 3) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vous ne pouvez pas sélectionner plus de 3 achievements' 
        });
      }
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      
      // Mettre à jour les préférences de l'utilisateur
      const preferences = user.preferences || {};
      preferences.featured_achievements = featured_achievements;
      
      await user.update({ preferences });
      
      res.json({ 
        success: true, 
        message: 'Achievements mis en avant mis à jour avec succès',
        featured_achievements
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des achievements mis en avant:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = FeaturedAchievementsController;
