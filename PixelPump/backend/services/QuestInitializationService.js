const { Quest, User, UserQuest } = require('../models');

class QuestInitializationService {
  
  /**
   * Initialise le système de quêtes au démarrage du serveur
   */
  static async initializeQuestSystem() {
    try {
      console.log('🎯 Initialisation du système de quêtes...');
      
      // 1. Créer les quêtes de base si elles n'existent pas
      await this.createBaseQuests();
      
      // 2. Assigner des quêtes aux utilisateurs existants qui n'en ont pas
      await this.assignQuestsToExistingUsers();
      
      console.log('✅ Système de quêtes initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des quêtes:', error);
    }
  }

  /**
   * Crée les quêtes de base nécessaires au système
   */
  static async createBaseQuests() {
    console.log('📝 Vérification des quêtes de base...');
    
    const existingQuests = await Quest.count();
    
    if (existingQuests > 0) {
      console.log(`ℹ️  ${existingQuests} quêtes déjà présentes dans la base`);
      return;
    }

    console.log('🚀 Création des quêtes de base...');
    
    const baseQuests = [
      // Quêtes quotidiennes faciles
      {
        title: 'Première connexion',
        description: 'Connectez-vous à PixelPump aujourd\'hui',
        category: 'social',
        type: 'daily',
        xp_reward: 25,
        difficulty: 'easy',
        min_level: 1,
        max_level: 5,
        is_template: true,
        is_active: true,
        requirements: { action: 'login', count: 1 }
      },
      {
        title: 'Visiteur assidu',
        description: 'Consultez votre dashboard personnalisé',
        category: 'skill',
        type: 'daily',
        xp_reward: 30,
        difficulty: 'easy',
        min_level: 1,
        max_level: 10,
        is_template: true,
        is_active: true,
        requirements: { action: 'view_dashboard', count: 1 }
      },
      {
        title: 'Explorateur curieux',
        description: 'Visitez 3 pages différentes de PixelPump',
        category: 'skill',
        type: 'daily',
        xp_reward: 40,
        difficulty: 'easy',
        min_level: 1,
        is_template: true,
        is_active: true,
        requirements: { action: 'visit_pages', count: 3 }
      },
      {
        title: 'Personnalisateur créatif',
        description: 'Modifiez votre avatar',
        category: 'customization',
        type: 'daily',
        xp_reward: 35,
        difficulty: 'easy',
        min_level: 1,
        is_template: true,
        is_active: true,
        requirements: { action: 'customize_avatar', count: 1 }
      },
      
      // Quêtes hebdomadaires
      {
        title: 'Habitué de la semaine',
        description: 'Connectez-vous 5 jours cette semaine',
        category: 'engagement',
        type: 'weekly',
        xp_reward: 100,
        difficulty: 'easy',
        min_level: 1,
        is_template: true,
        is_active: true,
        requirements: { action: 'login', count: 5 }
      },
      {
        title: 'Collectionneur d\'XP',
        description: 'Gagnez 200 XP cette semaine',
        category: 'progression',
        type: 'weekly',
        xp_reward: 150,
        difficulty: 'medium',
        min_level: 2,
        is_template: true,
        is_active: true,
        requirements: { action: 'earn_xp', count: 200 }
      },
      
      // Quêtes mensuelles
      {
        title: 'Maître du mois',
        description: 'Complétez 20 quêtes ce mois-ci',
        category: 'achievement',
        type: 'monthly',
        xp_reward: 500,
        difficulty: 'hard',
        min_level: 3,
        is_template: true,
        is_active: true,
        requirements: { action: 'complete_quests', count: 20 }
      }
    ];

    await Quest.bulkCreate(baseQuests);
    console.log(`✅ ${baseQuests.length} quêtes de base créées`);
  }

  /**
   * Assigne des quêtes aux utilisateurs existants qui n'en ont pas
   */
  static async assignQuestsToExistingUsers() {
    console.log('👥 Assignation des quêtes aux utilisateurs existants...');
    
    const users = await User.findAll({
      include: [{
        model: UserQuest,
        required: false,
        where: { is_completed: false }
      }]
    });

    let assignedCount = 0;
    
    for (const user of users) {
      const activeQuests = user.UserQuests || [];
      
      if (activeQuests.length === 0) {
        const result = await this.assignQuestsToUser(user.id, user.level);
        if (result.success && result.count > 0) {
          assignedCount++;
        }
      }
    }
    
    console.log(`✅ Quêtes assignées à ${assignedCount} utilisateur(s)`);
  }

  /**
   * Assigne automatiquement des quêtes à un utilisateur spécifique
   */
  static async assignQuestsToUser(userId, userLevel = 1, forceReset = false) {
    try {
      console.log(`🎯 Attribution de quêtes pour utilisateur niveau ${userLevel}${forceReset ? ' (réinitialisation forcée)' : ''}`);

      // Si c'est une réinitialisation forcée, supprimer toutes les quêtes actives
      if (forceReset) {
        await UserQuest.destroy({
          where: {
            user_id: userId,
            is_completed: false
          }
        });
        console.log(`   🗑️ Quêtes actives supprimées pour réinitialisation`);
      }

      // Vérifier d'abord quelles quêtes l'utilisateur a déjà
      const existingUserQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          is_completed: false
        },
        include: [Quest]
      });

      console.log(`   Quêtes existantes: ${existingUserQuests.length}`);

      // Si l'utilisateur a déjà suffisamment de quêtes et ce n'est pas un reset forcé, ne rien faire
      if (!forceReset && existingUserQuests.length >= 3) {
        console.log(`   ✓ Utilisateur a déjà ${existingUserQuests.length} quêtes actives`);
        return { success: true, count: 0, message: 'Quêtes déjà assignées' };
      }

      const questsToAssign = [];
      const existingQuestIds = existingUserQuests.map(uq => uq.quest_id);

      // Quêtes quotidiennes (2-3 selon le niveau)
      const dailyQuests = await Quest.findAll({
        where: {
          type: 'daily',
          difficulty: userLevel <= 2 ? 'easy' : ['easy', 'medium'],
          is_template: true,
          is_active: true,
          min_level: { [require('sequelize').Op.lte]: userLevel },
          id: { [require('sequelize').Op.notIn]: existingQuestIds }
        },
        limit: Math.max(0, (userLevel <= 2 ? 2 : 3) - existingUserQuests.filter(uq => uq.Quest?.type === 'daily').length),
        order: [['id', 'ASC']]
      });

      questsToAssign.push(...dailyQuests);

      // Quête hebdomadaire (1) si pas déjà assignée
      const hasWeeklyQuest = existingUserQuests.some(uq => uq.Quest?.type === 'weekly');
      if (!hasWeeklyQuest) {
        const weeklyQuest = await Quest.findOne({
          where: {
            type: 'weekly',
            difficulty: userLevel <= 3 ? 'easy' : ['easy', 'medium'],
            is_template: true,
            is_active: true,
            min_level: { [require('sequelize').Op.lte]: userLevel },
            id: { [require('sequelize').Op.notIn]: existingQuestIds }
          }
        });

        if (weeklyQuest) {
          questsToAssign.push(weeklyQuest);
        }
      }

      // Quête mensuelle pour les niveaux 3+ si pas déjà assignée
      if (userLevel >= 3) {
        const hasMonthlyQuest = existingUserQuests.some(uq => uq.Quest?.type === 'monthly');
        if (!hasMonthlyQuest) {
          const monthlyQuest = await Quest.findOne({
            where: {
              type: 'monthly',
              is_template: true,
              is_active: true,
              min_level: { [require('sequelize').Op.lte]: userLevel },
              id: { [require('sequelize').Op.notIn]: existingQuestIds }
            }
          });

          if (monthlyQuest) {
            questsToAssign.push(monthlyQuest);
          }
        }
      }

      // Créer les assignations seulement si on a de nouvelles quêtes
      if (questsToAssign.length > 0) {
        const userQuests = questsToAssign.map(quest => ({
          user_id: userId,
          quest_id: quest.id,
          cycle_id: null, // Pas de cycle pour les quêtes de base
          assigned_at: new Date(),
          expires_at: this.calculateDueDate(quest.type),
          progress: {}, // Progress en JSON vide
          is_completed: false,
          is_expired: false,
          is_archived: false,
          streak_bonus: 0,
          bonus_xp: 0
        }));

        await UserQuest.bulkCreate(userQuests);
        console.log(`   ✅ ${userQuests.length} nouvelles quêtes assignées`);
        return { success: true, count: userQuests.length };
      } else {
        console.log(`   ✓ Aucune nouvelle quête à assigner`);
        return { success: true, count: 0, message: 'Aucune nouvelle quête nécessaire' };
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'assignation des quêtes:', error.message);
      return { success: false, message: error.message };
    }
  }

  /**
   * Calcule la date d'échéance d'une quête selon son type
   */
  static calculateDueDate(questType) {
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
}

module.exports = QuestInitializationService;
