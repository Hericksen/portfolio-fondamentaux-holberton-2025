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
    
    // Vérification plus sécurisée pour éviter les erreurs si email est null/undefined
    const emailContainsDemo = user.email && typeof user.email === 'string' && user.email.includes('demo');
    
    return (
      demoUsernames.includes(user.username) ||
      demoEmails.includes(user.email) ||
      emailContainsDemo ||
      user.role === 'admin'
    );
  }

  /**
   * Renouvelle complètement les quêtes pour un utilisateur demo/admin
   */
  static async renewQuestsForDemoUser(user) {
    try {
      console.log(`🔄 [SERVICE] Renouvellement des quêtes pour ${user.username} (ID: ${user.id})...`);
      
      // 1. Supprimer toutes les quêtes actives actuelles (non complétées)
      console.log(`   🔍 Recherche des quêtes actives actuelles...`);
      
      try {
        const deletedCount = await UserQuest.destroy({
          where: {
            user_id: user.id,
            is_completed: false
          }
        });
        
        console.log(`   🗑️ ${deletedCount} quêtes actives supprimées`);
      } catch (deleteError) {
        console.error(`   ❌ Erreur lors de la suppression des quêtes:`, deleteError);
        throw new Error(`Erreur lors de la suppression des quêtes: ${deleteError.message}`);
      }

      // 2. Assigner de nouvelles quêtes aléatoirement
      console.log(`   🎲 Assignation de nouvelles quêtes...`);
      
      try {
        const result = await this.assignRandomQuests(user.id, user.level);
        console.log(`   ✅ Résultat de l'assignation:`, result);
        return result;
      } catch (assignError) {
        console.error(`   ❌ Erreur lors de l'assignation des quêtes:`, assignError);
        throw new Error(`Erreur lors de l'assignation des quêtes: ${assignError.message}`);
      }
      
    } catch (error) {
      console.error(`❌ [SERVICE] Erreur lors du renouvellement des quêtes pour ${user.username}:`, error);
      throw error;
    }
  }

  /**
   * Assigne des quêtes aléatoires pour maintenir la variété
   * Respecte les critères: 4 journalières, 2 hebdomadaires, 1 mensuelle
   */
  static async assignRandomQuests(userId, userLevel) {
    try {
      console.log(`   🎯 [SERVICE] Assignation de quêtes pour l'utilisateur ID:${userId}, Niveau:${userLevel}`);
      
      // Vérifier si l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        console.error(`   ❌ Utilisateur ${userId} introuvable`);
        throw new Error(`Utilisateur ${userId} introuvable`);
      }
      
      // Si le niveau n'est pas fourni, utiliser celui de l'utilisateur
      if (!userLevel) {
        userLevel = user.level || 1;
        console.log(`   ℹ️ Niveau non fourni, utilisation du niveau de l'utilisateur: ${userLevel}`);
      }
      
      // Récupérer toutes les quêtes disponibles pour ce niveau
      console.log(`   🔍 Recherche des quêtes disponibles pour le niveau ${userLevel}...`);
      
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

      console.log(`   📊 ${availableQuests.length} quêtes disponibles trouvées`);

      if (availableQuests.length === 0) {
        console.log(`   ⚠️ Aucune quête disponible pour le niveau ${userLevel}`);
        return { success: false, count: 0, message: 'Aucune quête disponible' };
      }

      // Séparer les quêtes par type
      const questsByType = {
        daily: availableQuests.filter(q => q.type === 'daily'),
        weekly: availableQuests.filter(q => q.type === 'weekly'),
        monthly: availableQuests.filter(q => q.type === 'monthly')
      };

      console.log(`   📊 Quêtes disponibles: ${questsByType.daily.length}D, ${questsByType.weekly.length}H, ${questsByType.monthly.length}M`);

      const selectedQuests = [];
      
      // Sélectionner exactement 4 quêtes quotidiennes aléatoirement
      const selectedDaily = this.randomSelect(questsByType.daily, 4);
      selectedQuests.push(...selectedDaily);
      console.log(`   🗓️ ${selectedDaily.length}/4 quêtes quotidiennes sélectionnées`);
      
      // Sélectionner exactement 2 quêtes hebdomadaires
      const selectedWeekly = this.randomSelect(questsByType.weekly, 2);
      selectedQuests.push(...selectedWeekly);
      console.log(`   📅 ${selectedWeekly.length}/2 quêtes hebdomadaires sélectionnées`);
      
      // Sélectionner exactement 1 quête mensuelle
      const selectedMonthly = this.randomSelect(questsByType.monthly, 1);
      selectedQuests.push(...selectedMonthly);
      console.log(`   📆 ${selectedMonthly.length}/1 quête mensuelle sélectionnée`);
      
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
        expires_at: this.calculateExpirationDate(quest.type),
        progress: {},
        is_completed: false,
        is_expired: false,
        is_archived: false,
        streak_bonus: 0,
        bonus_xp: 0
      }));

      console.log(`   📝 Création de ${userQuests.length} assignations de quêtes...`);
      
      try {
        await UserQuest.bulkCreate(userQuests);
        console.log(`   ✅ ${userQuests.length} quêtes assignées avec succès`);
      } catch (error) {
        console.error(`   ❌ Erreur lors de la création des assignations:`, error);
        throw new Error(`Erreur lors de la création des assignations: ${error.message}`);
      }
      
      console.log(`   📊 Récapitulatif des quêtes assignées:`);
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
   * Calcule la date d'expiration d'une quête selon son type
   */
  static calculateExpirationDate(questType) {
    const now = new Date();
    
    switch (questType) {
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
        
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(0, 0, 0, 0);
        return nextWeek;
        
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setHours(0, 0, 0, 0);
        return nextMonth;
        
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h par défaut
    }
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
