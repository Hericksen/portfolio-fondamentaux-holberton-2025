const { Quest, UserQuest, User } = require('../models');
const { Op } = require('sequelize');

class NewUserQuestService {
  
  /**
   * Assigne automatiquement des quêtes aux nouveaux utilisateurs en fonction de leur niveau
   */
  static async assignQuestsForNewUser(userId, userLevel = 1) {
    try {
      console.log(`🎯 Attribution de quêtes automatiques pour nouvel utilisateur (niveau ${userLevel})`);

      // Supprimer les anciennes quêtes actives s'il y en a
      await UserQuest.destroy({
        where: {
          user_id: userId,
          is_completed: false
        }
      });

      const questsToAssign = [];

      // Pour les utilisateurs niveau 1, assigner des quêtes simples
      if (userLevel === 1) {
        // Quêtes quotidiennes faciles (2-3 quêtes)
        const easyDailyQuests = await Quest.findAll({
          where: {
            type: 'daily',
            difficulty: 'easy',
            is_template: true,
            is_active: true
          },
          limit: 3,
          order: [['id', 'ASC']]
        });

        // Quête hebdomadaire facile (1 quête)
        const easyWeeklyQuest = await Quest.findOne({
          where: {
            type: 'weekly',
            difficulty: 'easy',
            is_template: true,
            is_active: true
          },
          order: [['id', 'ASC']]
        });

        // Ajouter les quêtes quotidiennes
        questsToAssign.push(...easyDailyQuests);
        
        // Ajouter la quête hebdomadaire si elle existe
        if (easyWeeklyQuest) {
          questsToAssign.push(easyWeeklyQuest);
        }

      } else if (userLevel >= 2 && userLevel <= 5) {
        // Utilisateurs niveau 2-5 : mix facile/medium
        const dailyQuests = await Quest.findAll({
          where: {
            type: 'daily',
            difficulty: ['easy', 'medium'],
            is_template: true,
            is_active: true
          },
          limit: 4,
          order: [['difficulty', 'ASC'], ['id', 'ASC']]
        });

        const weeklyQuests = await Quest.findAll({
          where: {
            type: 'weekly',
            difficulty: ['easy', 'medium'],
            is_template: true,
            is_active: true
          },
          limit: 2,
          order: [['difficulty', 'ASC'], ['id', 'ASC']]
        });

        questsToAssign.push(...dailyQuests, ...weeklyQuests);

      } else {
        // Utilisateurs niveau 6+ : toutes difficultés
        const dailyQuests = await Quest.findAll({
          where: {
            type: 'daily',
            is_template: true,
            is_active: true
          },
          limit: 5,
          order: [['difficulty', 'ASC'], ['id', 'ASC']]
        });

        const weeklyQuests = await Quest.findAll({
          where: {
            type: 'weekly',
            is_template: true,
            is_active: true
          },
          limit: 2,
          order: [['difficulty', 'ASC'], ['id', 'ASC']]
        });

        const monthlyQuest = await Quest.findOne({
          where: {
            type: 'monthly',
            is_template: true,
            is_active: true
          },
          order: [['difficulty', 'ASC'], ['id', 'ASC']]
        });

        questsToAssign.push(...dailyQuests, ...weeklyQuests);
        if (monthlyQuest) {
          questsToAssign.push(monthlyQuest);
        }
      }

      // Créer les assignations de quêtes
      const userQuests = [];
      const now = new Date();
      
      for (const quest of questsToAssign) {
        let deadline = new Date(now);
        
        // Calculer la deadline en fonction du type de quête
        switch (quest.type) {
          case 'daily':
            deadline.setDate(deadline.getDate() + 1); // 1 jour
            break;
          case 'weekly':
            deadline.setDate(deadline.getDate() + 7); // 7 jours
            break;
          case 'monthly':
            deadline.setMonth(deadline.getMonth() + 1); // 1 mois
            break;
          default:
            deadline.setDate(deadline.getDate() + 1);
        }

        userQuests.push({
          user_id: userId,
          quest_id: quest.id,
          assigned_at: now,
          deadline: deadline,
          is_completed: false,
          progress: 0
        });
      }

      // Insérer toutes les quêtes assignées
      if (userQuests.length > 0) {
        await UserQuest.bulkCreate(userQuests);
        
        console.log(`✅ ${userQuests.length} quêtes assignées automatiquement:`);
        console.log(`   📅 Quotidiennes: ${userQuests.filter(uq => {
          const quest = questsToAssign.find(q => q.id === uq.quest_id);
          return quest && quest.type === 'daily';
        }).length}`);
        console.log(`   📊 Hebdomadaires: ${userQuests.filter(uq => {
          const quest = questsToAssign.find(q => q.id === uq.quest_id);
          return quest && quest.type === 'weekly';
        }).length}`);
        console.log(`   📈 Mensuelles: ${userQuests.filter(uq => {
          const quest = questsToAssign.find(q => q.id === uq.quest_id);
          return quest && quest.type === 'monthly';
        }).length}`);

        return {
          success: true,
          message: `${userQuests.length} quêtes assignées automatiquement`,
          quests: userQuests
        };
      }

      return {
        success: false,
        message: 'Aucune quête disponible à assigner'
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'assignation de quêtes automatiques:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'assignation de quêtes',
        error: error.message
      };
    }
  }

  /**
   * Assigne des quêtes spécifiques pour les utilisateurs débutants
   */
  static async assignBeginnerQuests(userId) {
    try {
      console.log(`🎯 Attribution de quêtes débutant pour l'utilisateur ${userId}`);

      // Quêtes spécifiques pour débutants
      const beginnerQuestTitles = [
        'Première Marche',
        'Découverte Fitness',
        'Hydratation',
        'Étirements Matinaux',
        'Premier Défi'
      ];

      const beginnerQuests = await Quest.findAll({
        where: {
          title: {
            [Op.in]: beginnerQuestTitles
          },
          is_template: true,
          is_active: true
        }
      });

      if (beginnerQuests.length === 0) {
        // Si les quêtes spécifiques n'existent pas, utiliser des quêtes faciles par défaut
        return await this.assignQuestsForNewUser(userId, 1);
      }

      const userQuests = [];
      const now = new Date();

      for (const quest of beginnerQuests) {
        const deadline = new Date(now);
        deadline.setDate(deadline.getDate() + (quest.type === 'weekly' ? 7 : 1));

        userQuests.push({
          user_id: userId,
          quest_id: quest.id,
          assigned_at: now,
          deadline: deadline,
          is_completed: false,
          progress: 0
        });
      }

      await UserQuest.bulkCreate(userQuests);

      console.log(`✅ ${userQuests.length} quêtes débutant assignées`);
      
      return {
        success: true,
        message: `${userQuests.length} quêtes débutant assignées`,
        quests: userQuests
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'assignation de quêtes débutant:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'assignation de quêtes débutant',
        error: error.message
      };
    }
  }
}

module.exports = NewUserQuestService;
