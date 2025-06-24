const Quest = require('../models/Quest');

const QuestController = {
  async getAllQuests(req, res) {
    try {
      const quests = await Quest.findAll();
      res.json({ success: true, data: quests });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async createQuest(req, res) {
    try {
      // Récupérer l'ID utilisateur depuis le middleware d'authentification
      const questData = {
        ...req.body,
        user_id: req.user.userId
      };
      
      const quest = await Quest.create(questData);
      res.status(201).json({ success: true, data: quest });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async getUserQuests(req, res) {
    try {
      // Pour l'instant on retourne toutes les quêtes
      const quests = await Quest.findAll();
      res.json({ success: true, data: quests });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  async completeQuest(req, res) {
    try {
      const { questId } = req.params;
      const quest = await Quest.findByPk(questId);
      
      if (!quest) {
        return res.status(404).json({ success: false, message: 'Quête non trouvée' });
      }

      // Logique de complétion de quête
      res.json({ success: true, message: 'Quête complétée', data: quest });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

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
