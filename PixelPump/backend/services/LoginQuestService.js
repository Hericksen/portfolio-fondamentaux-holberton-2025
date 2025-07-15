const { User, UserQuest, Quest } = require('../models');
const { User, UserQuest, Quest, sequelize } = require('../models');
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
      console.log(`🔄 [SERVICE] Renouvellement intelligent des quêtes pour ${user.username} (ID: ${user.id})...`);
      // 1. Récupérer les quêtes actives (non terminées, non expirées, non archivées)
      const activeUserQuests = await UserQuest.findAll({
        where: {
          user_id: user.id,
          is_completed: false,
          is_expired: false,
          is_archived: false
        },
        include: [Quest]
      });

      // 2. Récupérer tous les templates valides pour le niveau de l'utilisateur
      const allTemplates = await Quest.findAll({
        where: {
          is_template: true,
          is_active: true,
          min_level: { [Op.lte]: user.level || 1 },
          [Op.or]: [
            { max_level: { [Op.gte]: user.level || 1 } },
            { max_level: null }
          ]
        }
      });

      // 3. Filtrer les templates déjà actives pour l'utilisateur
      const activeQuestIds = activeUserQuests.map(uq => uq.quest_id || (uq.Quest && uq.Quest.id));
      const availableTemplates = allTemplates.filter(q => !activeQuestIds.includes(q.id));

      // 4. Grouper par type
      const byType = type => availableTemplates.filter(q => q.type === type);
      const needCount = { daily: 4, weekly: 2, monthly: 1 };
      const resultQuests = [];

      // 5. Pour chaque type, compléter jusqu'à besoin
      for (const type of ['daily', 'weekly', 'monthly']) {
        const current = activeUserQuests.filter(uq => uq.Quest && uq.Quest.type === type);
        const toAdd = needCount[type] - current.length;
        if (toAdd > 0) {
          // Sélectionner aléatoirement des templates non actives
          const pool = byType(type);
          const shuffled = [...pool].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, toAdd);
          resultQuests.push(...selected);
        }
      }

      // 6. Créer les nouvelles assignations (si besoin)
      if (resultQuests.length > 0) {
        const { v4: uuidv4 } = require('uuid');
        const cycleId = uuidv4();
        const now = new Date();
        const userQuests = resultQuests.map(quest => ({
          user_id: user.id,
          quest_id: quest.id,
          cycle_id: cycleId,
          assigned_at: now,
          expires_at: this.calculateExpirationDate(quest.type),
          progress: {},
          is_completed: false,
          is_expired: false,
          is_archived: false,
          streak_bonus: 0,
          bonus_xp: 0
        }));
        await UserQuest.bulkCreate(userQuests);
        console.log(`   ✅ ${userQuests.length} nouvelles quêtes assignées.`);
      } else {
        console.log('   ℹ️ Aucun nouveau template à assigner, missions déjà complètes ou pas de templates disponibles.');
      }

      // 7. Retourner le résultat
      return { success: true, count: resultQuests.length, quests: resultQuests };
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

      // Créer le QuestCycle et les UserQuests dans une transaction pour garantir l'ordre
      const { v4: uuidv4 } = require('uuid');
      const now = new Date();
      let type = 'daily';
      if (selectedQuests.some(q => q.type === 'monthly')) {
        type = 'monthly';
      } else if (selectedQuests.some(q => q.type === 'weekly')) {
        type = 'weekly';
      }

      let start_date = new Date(now);
      let end_date = new Date(now);
      if (type === 'daily') {
        end_date.setDate(start_date.getDate() + 1);
      } else if (type === 'weekly') {
        end_date.setDate(start_date.getDate() + 7);
      } else if (type === 'monthly') {
        end_date.setMonth(start_date.getMonth() + 1);
      }

      let result;
      await sequelize.transaction(async (t) => {
        const cycleId = uuidv4();
        await QuestCycle.create({
          id: cycleId,
          type,
          start_date,
          end_date,
          is_active: true,
          created_at: now
        }, { transaction: t });

        const userQuests = selectedQuests.map(quest => ({
          user_id: userId,
          quest_id: quest.id,
          cycle_id: cycleId,
          assigned_at: now,
          expires_at: this.calculateExpirationDate(quest.type),
          progress: {},
          is_completed: false,
          is_expired: false,
          is_archived: false,
          streak_bonus: 0,
          bonus_xp: 0
        }));

        console.log(`   📝 Création de ${userQuests.length} assignations de quêtes...`);
        await UserQuest.bulkCreate(userQuests, { transaction: t });
        console.log(`   ✅ ${userQuests.length} quêtes assignées avec succès`);

        console.log(`   📊 Récapitulatif des quêtes assignées:`);
        selectedQuests.forEach(quest => {
          console.log(`      - ${quest.title} (${quest.type}, ${quest.category})`);
        });

        result = { success: true, count: selectedQuests.length, quests: selectedQuests };
      });
      return result;
      
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
