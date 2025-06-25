const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize');
const GamificationService = require('../services/GamificationService');

class QuestScheduler {
  static init() {
    console.log('⏰ Initialisation du scheduler de quêtes...');
    
    // Tous les jours à minuit (00:00)
    cron.schedule('0 0 * * *', async () => {
      console.log('🌅 Assignation des quêtes quotidiennes...');
      await this.assignDailyQuestsToAllUsers();
    });

    // Tous les lundis à 00:05 pour les quêtes hebdomadaires
    cron.schedule('5 0 * * 1', async () => {
      console.log('📅 Assignation des quêtes hebdomadaires...');
      await this.assignWeeklyQuests();
    });

    console.log('✅ Scheduler de quêtes initialisé');
  }

  static async assignDailyQuestsToAllUsers() {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'level'],
        where: {
          // Utilisateurs actifs (connectés dans les 30 derniers jours)
          last_login: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      });

      let successCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          await GamificationService.assignDailyQuests(user.id);
          successCount++;
        } catch (error) {
          console.error(`❌ Erreur assignation quêtes pour ${user.username}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ Quêtes quotidiennes assignées: ${successCount} succès, ${errorCount} erreurs`);
      
      // Optionnel: envoyer des notifications push ou emails
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'assignation des quêtes quotidiennes:', error);
    }
  }

  static async assignWeeklyQuests() {
    try {
      // Logique similaire pour les quêtes hebdomadaires
      console.log('🗓️ Attribution des quêtes hebdomadaires (à implémenter)');
    } catch (error) {
      console.error('❌ Erreur lors de l\'assignation des quêtes hebdomadaires:', error);
    }
  }

  // Méthode pour tester manuellement
  static async testAssignQuests(userId) {
    try {
      const result = await GamificationService.assignDailyQuests(userId);
      console.log('🧪 Test assignation quêtes:', result);
      return result;
    } catch (error) {
      console.error('❌ Test échoué:', error);
      throw error;
    }
  }
}

module.exports = QuestScheduler;
