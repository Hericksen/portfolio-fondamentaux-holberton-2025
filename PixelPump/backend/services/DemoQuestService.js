const { Quest, UserQuest, User, QuestCycle } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class DemoQuestService {
  
  // Identifier les utilisateurs démo
  static isDemoUser(email) {
    return email === 'test@example.com' || email === 'admin@pixelpump.com';
  }

  // Assigner des quêtes aléatoires pour les utilisateurs démo
  static async assignRandomQuestsForDemo(userId, userEmail) {
    if (!this.isDemoUser(userEmail)) {
      return { message: 'Non-demo user, skipping random quest assignment' };
    }

    try {
      console.log(`🎮 Assignation de quêtes démo pour ${userEmail}`);

      // Supprimer les anciennes quêtes non complétées
      await UserQuest.destroy({
        where: {
          user_id: userId,
          is_completed: false
        }
      });

      // Obtenir toutes les quêtes disponibles par type
      const dailyQuests = await Quest.findAll({
        where: { 
          type: 'daily',
          is_template: true,
          is_active: true
        }
      });

      const weeklyQuests = await Quest.findAll({
        where: { 
          type: 'weekly',
          is_template: true,
          is_active: true
        }
      });

      const monthlyQuests = await Quest.findAll({
        where: { 
          type: 'monthly',
          is_template: true,
          is_active: true
        }
      });

      let assignedQuests = 0;

      // Assigner 3-5 quêtes quotidiennes aléatoires
      const randomDailyQuests = this.getRandomQuests(dailyQuests, Math.floor(Math.random() * 3) + 3);
      for (const quest of randomDailyQuests) {
        await UserQuest.create({
          user_id: userId,
          quest_id: quest.id,
          assigned_at: new Date(),
          expires_at: moment().add(1, 'day').toDate(),
          is_completed: false,
          progress: 0
        });
        assignedQuests++;
      }

      // Assigner 2-3 quêtes hebdomadaires aléatoires
      const randomWeeklyQuests = this.getRandomQuests(weeklyQuests, Math.floor(Math.random() * 2) + 2);
      for (const quest of randomWeeklyQuests) {
        await UserQuest.create({
          user_id: userId,
          quest_id: quest.id,
          assigned_at: new Date(),
          expires_at: moment().add(1, 'week').toDate(),
          is_completed: false,
          progress: 0
        });
        assignedQuests++;
      }

      // Assigner 1-2 quêtes mensuelles aléatoires
      const randomMonthlyQuests = this.getRandomQuests(monthlyQuests, Math.floor(Math.random() * 2) + 1);
      for (const quest of randomMonthlyQuests) {
        await UserQuest.create({
          user_id: userId,
          quest_id: quest.id,
          assigned_at: new Date(),
          expires_at: moment().add(1, 'month').toDate(),
          is_completed: false,
          progress: 0
        });
        assignedQuests++;
      }

      console.log(`✅ ${assignedQuests} quêtes démo assignées à ${userEmail}`);
      console.log(`   📅 Quotidiennes: ${randomDailyQuests.length}`);
      console.log(`   📊 Hebdomadaires: ${randomWeeklyQuests.length}`);
      console.log(`   🗓️ Mensuelles: ${randomMonthlyQuests.length}`);

      return {
        success: true,
        message: `${assignedQuests} quêtes démo assignées`,
        quests: {
          daily: randomDailyQuests.length,
          weekly: randomWeeklyQuests.length,
          monthly: randomMonthlyQuests.length
        }
      };

    } catch (error) {
      console.error('❌ Erreur assignation quêtes démo:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'assignation des quêtes démo',
        error: error.message
      };
    }
  }

  // Obtenir des quêtes aléatoires d'un tableau
  static getRandomQuests(questsArray, count) {
    if (questsArray.length === 0) return [];
    
    const shuffled = [...questsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questsArray.length));
  }

  // Créer des quêtes par défaut si elles n'existent pas
  static async ensureDefaultQuests() {
    const defaultQuests = [
      // Quêtes quotidiennes
      {
        title: '🏃‍♂️ Échauffement matinal',
        description: 'Faites 10 minutes d\'exercices d\'échauffement',
        type: 'daily',
        category: 'fitness',
        xp_reward: 50,
        difficulty: 'easy',
        is_template: true,
        is_active: true,
        duration: 10
      },
      {
        title: '💪 Force et endurance',
        description: 'Effectuez 20 pompes et 30 squats',
        type: 'daily',
        category: 'strength',
        xp_reward: 75,
        difficulty: 'medium',
        is_template: true,
        is_active: true,
        duration: 15
      },
      {
        title: '🧘‍♀️ Moment de détente',
        description: 'Pratiquez 15 minutes de méditation ou relaxation',
        type: 'daily',
        category: 'wellness',
        xp_reward: 60,
        difficulty: 'easy',
        is_template: true,
        is_active: true,
        duration: 15
      },
      {
        title: '🚶‍♂️ Marche quotidienne',
        description: 'Marchez pendant 30 minutes',
        type: 'daily',
        category: 'cardio',
        xp_reward: 80,
        difficulty: 'easy',
        is_template: true,
        is_active: true,
        duration: 30
      },
      {
        title: '💧 Hydratation optimale',
        description: 'Buvez 8 verres d\'eau aujourd\'hui',
        type: 'daily',
        category: 'health',
        xp_reward: 40,
        difficulty: 'easy',
        is_template: true,
        is_active: true,
        duration: 5
      },

      // Quêtes hebdomadaires
      {
        title: '🏋️‍♂️ Défis de la semaine',
        description: 'Complétez 5 séances d\'entraînement cette semaine',
        type: 'weekly',
        category: 'fitness',
        xp_reward: 300,
        difficulty: 'medium',
        is_template: true,
        is_active: true,
        duration: 60
      },
      {
        title: '🎯 Consistance parfaite',
        description: 'Maintenez votre série quotidienne pendant 7 jours',
        type: 'weekly',
        category: 'challenge',
        xp_reward: 250,
        difficulty: 'hard',
        is_template: true,
        is_active: true,
        duration: 30
      },
      {
        title: '🍎 Nutrition équilibrée',
        description: 'Mangez 5 portions de fruits et légumes chaque jour',
        type: 'weekly',
        category: 'nutrition',
        xp_reward: 200,
        difficulty: 'medium',
        is_template: true,
        is_active: true,
        duration: 20
      },
      {
        title: '🏃‍♀️ Endurance cardio',
        description: 'Accumulez 2 heures de cardio cette semaine',
        type: 'weekly',
        category: 'cardio',
        xp_reward: 350,
        difficulty: 'medium',
        is_template: true,
        is_active: true,
        duration: 120
      },

      // Quêtes mensuelles
      {
        title: '🏆 Champion du mois',
        description: 'Complétez 80% de vos quêtes quotidiennes ce mois',
        type: 'monthly',
        category: 'challenge',
        xp_reward: 800,
        difficulty: 'hard',
        is_template: true,
        is_active: true,
        duration: 60
      },
      {
        title: '💎 Transformation totale',
        description: 'Atteignez vos objectifs fitness du mois',
        type: 'monthly',
        category: 'fitness',
        xp_reward: 1000,
        difficulty: 'epic',
        is_template: true,
        is_active: true,
        duration: 90
      },
      {
        title: '🌟 Maître du bien-être',
        description: 'Pratiquez au moins une activité de bien-être chaque semaine',
        type: 'monthly',
        category: 'wellness',
        xp_reward: 600,
        difficulty: 'medium',
        is_template: true,
        is_active: true,
        duration: 45
      }
    ];

    for (const questData of defaultQuests) {
      const existingQuest = await Quest.findOne({
        where: { 
          title: questData.title,
          type: questData.type
        }
      });

      if (!existingQuest) {
        await Quest.create(questData);
        console.log(`✅ Quête par défaut créée: ${questData.title}`);
      }
    }
  }
}

module.exports = DemoQuestService;
