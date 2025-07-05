const cron = require('node-cron');
const { User, Quest, UserQuest, QuestCycle } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class AdvancedQuestScheduler {
  constructor() {
    this.jobs = new Map(); // Stockage des tâches cron
  }

  // Initialiser le scheduler complet
  init() {
    console.log('🚀 Initialisation du système de quêtes avancé...');
    
    // Quêtes quotidiennes - Chaque jour à 00:01
    this.scheduleDaily();
    
    // Quêtes hebdomadaires - Chaque lundi à 00:05  
    this.scheduleWeekly();
    
    // Quêtes mensuelles - Le 1er de chaque mois à 00:10
    this.scheduleMonthly();
    
    // Nettoyage et maintenance - Chaque dimanche à 23:00
    this.scheduleMaintenance();
    
    console.log('✅ Système de quêtes avancé initialisé');
    
    // Assignation immédiate pour les nouveaux utilisateurs (désactivée temporairement)
    // this.assignMissingQuests();
  }

  // === PLANIFICATION DES CYCLES ===

  scheduleDaily() {
    const job = cron.schedule('1 0 * * *', async () => {
      console.log('🌅 [DAILY] Démarrage du cycle quotidien...');
      await this.startDailyCycle();
    }, {
      scheduled: true,
      timezone: "Europe/Paris"
    });
    
    this.jobs.set('daily', job);
    console.log('📅 Planification quotidienne activée (00:01)');
  }

  scheduleWeekly() {
    const job = cron.schedule('5 0 * * 1', async () => {
      console.log('📊 [WEEKLY] Démarrage du cycle hebdomadaire...');
      await this.startWeeklyCycle();
    }, {
      scheduled: true,
      timezone: "Europe/Paris"
    });
    
    this.jobs.set('weekly', job);
    console.log('📅 Planification hebdomadaire activée (Lundi 00:05)');
  }

  scheduleMonthly() {
    const job = cron.schedule('10 0 1 * *', async () => {
      console.log('🗓️ [MONTHLY] Démarrage du cycle mensuel...');
      await this.startMonthlyCycle();
    }, {
      scheduled: true,
      timezone: "Europe/Paris"
    });
    
    this.jobs.set('monthly', job);
    console.log('📅 Planification mensuelle activée (1er du mois 00:10)');
  }

  scheduleMaintenance() {
    const job = cron.schedule('0 23 * * 0', async () => {
      console.log('🧹 [MAINTENANCE] Nettoyage des données...');
      await this.performMaintenance();
    }, {
      scheduled: true,
      timezone: "Europe/Paris"
    });
    
    this.jobs.set('maintenance', job);
    console.log('📅 Maintenance programmée (Dimanche 23:00)');
  }

  // === GESTION DES CYCLES ===

  async startDailyCycle() {
    try {
      const today = moment().startOf('day');
      const tomorrow = moment(today).add(1, 'day');

      // Créer le cycle quotidien
      const cycle = await QuestCycle.create({
        type: 'daily',
        start_date: today.toDate(),
        end_date: tomorrow.toDate()
      });

      // Clôturer les quêtes de la veille
      await this.completeExpiredQuests('daily');

      // Assigner nouvelles quêtes quotidiennes
      const activeUsers = await this.getActiveUsers();
      let assignedCount = 0;

      for (const user of activeUsers) {
        try {
          await this.assignDailyQuestsToUser(user, cycle.id);
          assignedCount++;
        } catch (error) {
          console.error(`❌ Erreur assignation quotidienne pour ${user.username}:`, error.message);
        }
      }

      console.log(`✅ [DAILY] Cycle créé - ${assignedCount}/${activeUsers.length} utilisateurs`);
      
      // Statistiques
      await this.logCycleStats('daily', cycle.id, assignedCount);

    } catch (error) {
      console.error('❌ [DAILY] Erreur cycle quotidien:', error);
    }
  }

  async startWeeklyCycle() {
    try {
      const startOfWeek = moment().startOf('week');
      const endOfWeek = moment(startOfWeek).add(1, 'week');

      const cycle = await QuestCycle.create({
        type: 'weekly',
        start_date: startOfWeek.toDate(),
        end_date: endOfWeek.toDate()
      });

      await this.completeExpiredQuests('weekly');

      const activeUsers = await this.getActiveUsers(7); // Actifs dans les 7 derniers jours
      let assignedCount = 0;

      for (const user of activeUsers) {
        try {
          await this.assignWeeklyQuestsToUser(user, cycle.id);
          assignedCount++;
        } catch (error) {
          console.error(`❌ Erreur assignation hebdomadaire pour ${user.username}:`, error.message);
        }
      }

      console.log(`✅ [WEEKLY] Cycle créé - ${assignedCount}/${activeUsers.length} utilisateurs`);
      await this.logCycleStats('weekly', cycle.id, assignedCount);

    } catch (error) {
      console.error('❌ [WEEKLY] Erreur cycle hebdomadaire:', error);
    }
  }

  async startMonthlyCycle() {
    try {
      const startOfMonth = moment().startOf('month');
      const endOfMonth = moment(startOfMonth).add(1, 'month');

      const cycle = await QuestCycle.create({
        type: 'monthly',
        start_date: startOfMonth.toDate(),
        end_date: endOfMonth.toDate()
      });

      await this.completeExpiredQuests('monthly');

      const activeUsers = await this.getActiveUsers(30); // Actifs dans les 30 derniers jours
      let assignedCount = 0;

      for (const user of activeUsers) {
        try {
          await this.assignMonthlyQuestsToUser(user, cycle.id);
          assignedCount++;
        } catch (error) {
          console.error(`❌ Erreur assignation mensuelle pour ${user.username}:`, error.message);
        }
      }

      console.log(`✅ [MONTHLY] Cycle créé - ${assignedCount}/${activeUsers.length} utilisateurs`);
      await this.logCycleStats('monthly', cycle.id, assignedCount);

    } catch (error) {
      console.error('❌ [MONTHLY] Erreur cycle mensuel:', error);
    }
  }

  // === ASSIGNATION DES QUÊTES ===

  async assignDailyQuestsToUser(user, cycleId) {
    const questsToAssign = await this.selectDailyQuests(user);
    
    for (const quest of questsToAssign) {
      await UserQuest.create({
        user_id: user.id,
        quest_id: quest.id,
        cycle_id: cycleId,
        assigned_at: new Date(),
        expires_at: moment().add(1, 'day').toDate(),
        is_completed: false,
        progress: 0
      });
    }

    return questsToAssign.length;
  }

  async assignWeeklyQuestsToUser(user, cycleId) {
    const questsToAssign = await this.selectWeeklyQuests(user);
    
    for (const quest of questsToAssign) {
      await UserQuest.create({
        user_id: user.id,
        quest_id: quest.id,
        cycle_id: cycleId,
        assigned_at: new Date(),
        expires_at: moment().add(1, 'week').toDate(),
        is_completed: false,
        progress: 0
      });
    }

    return questsToAssign.length;
  }

  async assignMonthlyQuestsToUser(user, cycleId) {
    const questsToAssign = await this.selectMonthlyQuests(user);
    
    for (const quest of questsToAssign) {
      await UserQuest.create({
        user_id: user.id,
        quest_id: quest.id,
        cycle_id: cycleId,
        assigned_at: new Date(),
        expires_at: moment().add(1, 'month').toDate(),
        is_completed: false,
        progress: 0
      });
    }

    return questsToAssign.length;
  }

  // === SÉLECTION INTELLIGENTE DES QUÊTES ===

  async selectDailyQuests(user) {
    const baseQuery = {
      type: 'daily',
      is_active: true,
      is_template: true,
      min_level: { [Op.lte]: user.level }
    };

    if (user.max_level) {
      baseQuery.max_level = { [Op.gte]: user.level };
    }

    // Récupérer toutes les quêtes potentielles
    const availableQuests = await Quest.findAll({
      where: baseQuery
    });

    // Exclure les quêtes déjà assignées aujourd'hui
    const today = moment().startOf('day');
    const alreadyAssigned = await UserQuest.findAll({
      where: {
        user_id: user.id,
        assigned_at: { [Op.gte]: today.toDate() }
      },
      attributes: ['quest_id']
    });

    const excludeIds = alreadyAssigned.map(uq => uq.quest_id);
    const eligibleQuests = availableQuests.filter(q => !excludeIds.includes(q.id));

    // Sélection intelligente basée sur le profil utilisateur
    return this.intelligentQuestSelection(eligibleQuests, user, 3); // 3 quêtes quotidiennes
  }

  async selectWeeklyQuests(user) {
    const availableQuests = await Quest.findAll({
      where: {
        type: 'weekly',
        is_active: true,
        is_template: true,
        min_level: { [Op.lte]: user.level }
      }
    });

    return this.intelligentQuestSelection(availableQuests, user, 2); // 2 quêtes hebdomadaires
  }

  async selectMonthlyQuests(user) {
    const availableQuests = await Quest.findAll({
      where: {
        type: 'monthly',
        is_active: true,
        is_template: true,
        min_level: { [Op.lte]: user.level }
      }
    });

    return this.intelligentQuestSelection(availableQuests, user, 1); // 1 quête mensuelle
  }

  intelligentQuestSelection(quests, user, maxQuests) {
    if (quests.length <= maxQuests) return quests;

    // Préférences utilisateur basées sur fitness_goals
    const userPreferences = user.fitness_goals?.preferred_activities || [];
    
    // Système de scoring
    const scoredQuests = quests.map(quest => {
      let score = Math.random(); // Base aléatoire pour la variété
      
      // Bonus si correspond aux préférences
      if (userPreferences.includes(quest.category)) {
        score += 0.5;
      }
      
      // Bonus pour la difficulté appropriée
      const difficultyScore = this.getDifficultyScore(quest.difficulty, user.level);
      score += difficultyScore;
      
      return { quest, score };
    });

    // Trier par score et prendre les meilleures
    return scoredQuests
      .sort((a, b) => b.score - a.score)
      .slice(0, maxQuests)
      .map(item => item.quest);
  }

  getDifficultyScore(difficulty, userLevel) {
    const difficultyMap = { easy: 1, medium: 2, hard: 3, epic: 4 };
    const questLevel = difficultyMap[difficulty];
    
    // Score optimal quand la difficulté correspond au niveau utilisateur
    const diff = Math.abs(questLevel - Math.min(userLevel, 4));
    return Math.max(0, 0.3 - (diff * 0.1));
  }

  // === UTILITAIRES ===

  async getActiveUsers(daysBack = 3) {
    const cutoffDate = moment().subtract(daysBack, 'days').toDate();
    
    return await User.findAll({
      where: {
        last_login: { [Op.gte]: cutoffDate }
      },
      attributes: ['id', 'username', 'level', 'fitness_goals', 'preferences']
    });
  }

  async completeExpiredQuests(type) {
    const cutoffTime = moment().subtract(
      type === 'daily' ? 1 : type === 'weekly' ? 7 : 30, 
      'days'
    ).toDate();

    await UserQuest.update(
      { 
        is_expired: true,
        expired_at: new Date()
      },
      {
        where: {
          expires_at: { [Op.lt]: cutoffTime },
          is_completed: false,
          is_expired: { [Op.not]: true }
        }
      }
    );
  }

  async assignMissingQuests() {
    // Assigner les quêtes manquantes aux utilisateurs actifs
    console.log('🔄 Vérification des quêtes manquantes...');
    
    const today = moment().startOf('day');
    const activeUsers = await this.getActiveUsers(1);
    
    for (const user of activeUsers) {
      // Vérifier si l'utilisateur a des quêtes quotidiennes pour aujourd'hui
      const todayQuests = await UserQuest.count({
        where: {
          user_id: user.id,
          assigned_at: { [Op.gte]: today.toDate() }
        }
      });
      
      if (todayQuests === 0) {
        console.log(`📋 Attribution de quêtes de rattrapage pour ${user.username}`);
        await this.assignDailyQuestsToUser(user, null);
      }
    }
  }

  async performMaintenance() {
    console.log('🧹 Début de la maintenance...');
    
    // Supprimer les anciens cycles
    const oldDate = moment().subtract(30, 'days').toDate();
    await QuestCycle.destroy({
      where: {
        created_at: { [Op.lt]: oldDate }
      }
    });
    
    // Archiver les anciennes UserQuests
    await UserQuest.update(
      { is_archived: true },
      {
        where: {
          assigned_at: { [Op.lt]: oldDate },
          is_archived: { [Op.not]: true }
        }
      }
    );
    
    console.log('✅ Maintenance terminée');
  }

  async logCycleStats(type, cycleId, userCount) {
    console.log(`📊 [${type.toUpperCase()}] Stats cycle ${cycleId}: ${userCount} utilisateurs`);
    // Ici on peut ajouter des métriques plus détaillées
  }

  // === FONCTIONS DE TEST ET UTILITAIRES ===

  async assignDailyQuestsToAllUsers() {
    try {
      console.log('🔄 Assignation manuelle de quêtes quotidiennes...');
      
      // Créer un cycle de test ou utiliser null
      let testCycleId = null;
      try {
        const testCycle = await QuestCycle.create({
          type: 'daily',
          start_date: new Date(),
          end_date: moment().add(1, 'day').toDate()
        });
        testCycleId = testCycle.id;
      } catch (error) {
        console.log('⚠️ Pas de cycle créé, assignation sans cycle');
      }
      
      const activeUsers = await this.getActiveUsers();
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const user of activeUsers) {
        try {
          await this.assignDailyQuestsToUser(user, testCycleId);
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(`${user.username}: ${error.message}`);
        }
      }

      const result = {
        success: errorCount === 0,
        message: `Assignation terminée: ${successCount} succès, ${errorCount} erreurs`,
        details: {
          total: activeUsers.length,
          success: successCount,
          errors: errorCount,
          errorDetails: errors.slice(0, 5) // Limiter à 5 erreurs pour éviter le spam
        }
      };

      console.log(`✅ ${result.message}`);
      return result;

    } catch (error) {
      console.error('❌ Erreur assignation manuelle:', error);
      return {
        success: false,
        message: `Erreur: ${error.message}`,
        details: null
      };
    }
  }

  async testAssignUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Utilisateur non trouvé');
    
    const result = await this.assignDailyQuestsToUser(user, 'test');
    console.log(`🧪 Test: ${result} quêtes assignées à ${user.username}`);
    return result;
  }

  stop() {
    console.log('🛑 Arrêt du scheduler de quêtes...');
    this.jobs.forEach((job, name) => {
      job.destroy();
      console.log(`  ❌ ${name} arrêté`);
    });
    this.jobs.clear();
  }
}

module.exports = new AdvancedQuestScheduler();
