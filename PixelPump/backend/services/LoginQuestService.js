const { User, UserQuest, Quest } = require('../models');
const { Op } = require('sequelize');
const ExpiredQuestService = require('./ExpiredQuestService');
const QuestInitializationService = require('./QuestInitializationService');

class LoginQuestService {
  
  /**
   * Traite les quêtes lors de la connexion d'un utilisateur
   * Pour les utilisateurs demo/admin : renouvelle les quêtes à chaque connexion
   * Pour les autres : traite seulement les quêtes expirées
   */
  static async processQuestsOnLogin(user) {
    try {
      console.log(`🎯 Traitement des quêtes à la connexion pour ${user.username}...`);
      
      const isDemoUser = this.isDemoOrAdminUser(user);
      
      if (isDemoUser) {
        console.log(`   🎭 Utilisateur demo/admin détecté: renouvellement complet des quêtes`);
        await this.renewQuestsForDemoUser(user);
      } else {
        console.log(`   👤 Utilisateur normal: traitement des quêtes expirées uniquement`);
        await ExpiredQuestService.processExpiredQuestsForUser(user.id);
      }
      
    } catch (error) {
      console.error(`❌ Erreur lors du traitement des quêtes à la connexion:`, error);
      // Ne pas faire échouer la connexion si les quêtes posent problème
    }
  }

  /**
   * Détermine si un utilisateur est un compte demo ou admin
   */
  static isDemoOrAdminUser(user) {
    const demoUsernames = ['testuser', 'admin', 'demo', 'NewbiePumper', 'FitnessGuru', 'CodeWarrior'];
    const demoEmails = ['admin@pixelpump.com', 'demo@pixelpump.com'];
    
    return (
      demoUsernames.includes(user.username) ||
      demoEmails.includes(user.email) ||
      user.email.includes('demo') ||
      user.role === 'admin'
    );
  }

  /**
   * Renouvelle complètement les quêtes pour un utilisateur demo/admin
   */
  static async renewQuestsForDemoUser(user) {
    try {
      console.log(`   🔄 Renouvellement des quêtes pour ${user.username}...`);
      
      // 1. Supprimer toutes les quêtes actives actuelles (non complétées)
      const deletedCount = await UserQuest.destroy({
        where: {
          user_id: user.id,
          is_completed: false
        }
      });
      
      console.log(`   🗑️ ${deletedCount} quêtes actives supprimées`);

      // 2. Assigner de nouvelles quêtes aléatoirement
      const result = await this.assignRandomQuests(user.id, user.level);
      
      console.log(`   ✅ ${result.count} nouvelles quêtes assignées`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ Erreur lors du renouvellement des quêtes demo:`, error);
      throw error;
    }
  }

  /**
   * Assigne des quêtes aléatoires pour maintenir la variété
   */
  static async assignRandomQuests(userId, userLevel) {
    try {
      // Récupérer toutes les quêtes disponibles pour ce niveau
      const availableQuests = await Quest.findAll({
        where: {
          is_template: true,
          is_active: true,
          min_level: { [Op.lte]: userLevel },
          [Op.or]: [
            { max_level: { [Op.gte]: userLevel } },
            { max_level: null }
          ]
        },
        order: [['created_at', 'ASC']]
      });

      if (availableQuests.length === 0) {
        console.log(`   ⚠️ Aucune quête disponible pour le niveau ${userLevel}`);
        return { success: false, count: 0, message: 'Aucune quête disponible' };
      }

      // Sélectionner aléatoirement des quêtes de différents types
      const selectedQuests = this.selectRandomQuestMix(availableQuests, userLevel);
      
      if (selectedQuests.length === 0) {
        console.log(`   ⚠️ Aucune quête sélectionnée après filtrage`);
        return { success: false, count: 0, message: 'Aucune quête sélectionnée' };
      }

      // Créer les assignations avec dates d'expiration appropriées
      const userQuests = selectedQuests.map(quest => ({
        user_id: userId,
        quest_id: quest.id,
        cycle_id: null,
        assigned_at: new Date(),
        expires_at: ExpiredQuestService.calculateExpirationDate(quest.type),
        progress: {},
        is_completed: false,
        is_expired: false,
        is_archived: false,
        streak_bonus: 0,
        bonus_xp: 0
      }));

      await UserQuest.bulkCreate(userQuests);
      
      console.log(`   📊 Quêtes assignées:`);
      selectedQuests.forEach(quest => {
        console.log(`      - ${quest.title} (${quest.type}, ${quest.category})`);
      });
      
      return { success: true, count: selectedQuests.length, quests: selectedQuests };
      
    } catch (error) {
      console.error(`❌ Erreur lors de l'assignation de quêtes aléatoires:`, error);
      return { success: false, count: 0, error: error.message };
    }
  }

  /**
   * Sélectionne un mélange aléatoire de quêtes de différents types
   */
  static selectRandomQuestMix(availableQuests, userLevel) {
    const questsByType = {
      daily: availableQuests.filter(q => q.type === 'daily'),
      weekly: availableQuests.filter(q => q.type === 'weekly'),
      monthly: availableQuests.filter(q => q.type === 'monthly'),
      special: availableQuests.filter(q => q.type === 'special')
    };

    const selectedQuests = [];
    
    // Sélectionner 2-3 quêtes quotidiennes aléatoirement
    const dailyCount = userLevel <= 2 ? 2 : 3;
    const selectedDaily = this.randomSelect(questsByType.daily, dailyCount);
    selectedQuests.push(...selectedDaily);
    
    // Sélectionner 1 quête hebdomadaire
    const selectedWeekly = this.randomSelect(questsByType.weekly, 1);
    selectedQuests.push(...selectedWeekly);
    
    // Sélectionner 1 quête mensuelle pour les niveaux 3+
    if (userLevel >= 3) {
      const selectedMonthly = this.randomSelect(questsByType.monthly, 1);
      selectedQuests.push(...selectedMonthly);
    }
    
    // Optionellement ajouter une quête spéciale
    if (Math.random() < 0.3) { // 30% de chance
      const selectedSpecial = this.randomSelect(questsByType.special, 1);
      selectedQuests.push(...selectedSpecial);
    }

    return selectedQuests;
  }

  /**
   * Sélectionne aléatoirement des éléments d'un tableau
   */
  static randomSelect(array, count) {
    if (!array || array.length === 0) return [];
    
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Obtient des statistiques sur les quêtes d'un utilisateur
   */
  static async getQuestStats(userId) {
    try {
      const stats = await UserQuest.findAll({
        where: { user_id: userId },
        include: [Quest],
        attributes: [
          'is_completed',
          'is_expired',
          'is_archived'
        ]
      });

      const active = stats.filter(s => !s.is_completed && !s.is_expired && !s.is_archived).length;
      const completed = stats.filter(s => s.is_completed).length;
      const expired = stats.filter(s => s.is_expired).length;
      const total = stats.length;

      return { active, completed, expired, total };
      
    } catch (error) {
      console.error('Erreur lors du calcul des stats de quêtes:', error);
      return { active: 0, completed: 0, expired: 0, total: 0 };
    }
  }
}

module.exports = LoginQuestService;
