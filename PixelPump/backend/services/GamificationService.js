const { User, Quest, UserQuest, Achievement, UserAchievement } = require('../models');
const { Op } = require('sequelize');

class GamificationService {
  // Assigner des quêtes quotidiennes à un utilisateur
  static async assignDailyQuests(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('Utilisateur non trouvé');

      // Récupérer les quêtes quotidiennes adaptées au niveau de l'utilisateur
      const availableQuests = await Quest.findAll({
        where: {
          type: 'daily',
          is_template: true,
          is_active: true,
          min_level: { [Op.lte]: user.level },
          [Op.or]: [
            { max_level: null },
            { max_level: { [Op.gte]: user.level } }
          ]
        }
      });

      if (availableQuests.length === 0) {
        throw new Error('Aucune quête disponible pour ce niveau');
      }

      // Sélectionner 3 quêtes aléatoires
      const selectedQuests = availableQuests
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // Vérifier si l'utilisateur a déjà des quêtes pour aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const existingQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          assigned_at: {
            [Op.gte]: new Date(today + 'T00:00:00.000Z'),
            [Op.lt]: new Date(today + 'T23:59:59.999Z')
          }
        }
      });

      if (existingQuests.length > 0) {
        return { message: 'Quêtes déjà assignées aujourd\'hui', quests: existingQuests };
      }

      // Assigner les nouvelles quêtes
      const userQuests = await Promise.all(
        selectedQuests.map(quest => 
          UserQuest.create({
            user_id: userId,
            quest_id: quest.id,
            assigned_at: new Date()
          })
        )
      );

      return { 
        message: 'Quêtes quotidiennes assignées', 
        quests: userQuests,
        count: userQuests.length 
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'assignation des quêtes: ${error.message}`);
    }
  }

  // Compléter une quête
  static async completeQuest(userId, questId) {
    try {
      const userQuest = await UserQuest.findOne({
        where: { user_id: userId, quest_id: questId },
        include: [{ model: Quest }]
      });

      if (!userQuest) {
        throw new Error('Quête non trouvée pour cet utilisateur');
      }

      if (userQuest.is_completed) {
        throw new Error('Quête déjà complétée');
      }

      // Marquer la quête comme complétée
      userQuest.is_completed = true;
      userQuest.completed_at = new Date();
      await userQuest.save();

      // Ajouter l'XP à l'utilisateur
      const user = await User.findByPk(userId);
      console.log(`🎯 [QUEST] Ajout de ${userQuest.Quest.xp_reward} XP pour la quête "${userQuest.Quest.title}"`);
      console.log(`💫 [QUEST] XP avant: ${user.xp}, Niveau: ${user.level}`);
      
      const leveledUp = await user.addXp(userQuest.Quest.xp_reward);
      
      // Mettre à jour le streak et stats
      await user.updateStreak();
      user.total_quests_completed += 1;
      await user.save();

      console.log(`🚀 [QUEST] XP après quête: ${user.xp}, Niveau: ${user.level}, Level Up: ${leveledUp}`);

      // Vérifier les achievements
      const newAchievements = await this.checkAchievements(userId);

      // Rafraîchir les données utilisateur après les achievements
      await user.reload();
      console.log(`🌟 [FINAL] XP total après achievements: ${user.xp}, Niveau: ${user.level}`);
      console.log(`🎉 [SUMMARY] Quête: +${userQuest.Quest.xp_reward} XP, Achievements: +${newAchievements.reduce((sum, a) => sum + a.xp_reward, 0)} XP`);

      return {
        message: 'Quête complétée!',
        xpGained: userQuest.Quest.xp_reward,
        leveledUp,
        newLevel: user.level,
        newAchievements: newAchievements.length,
        achievements: newAchievements
      };
    } catch (error) {
      throw new Error(`Erreur lors de la complétion de la quête: ${error.message}`);
    }
  }

  // Vérifier et débloquer les achievements
  static async checkAchievements(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('Utilisateur non trouvé');

      // Récupérer tous les achievements disponibles
      const availableAchievements = await Achievement.findAll({
        where: { is_active: true }
      });

      // Récupérer les achievements déjà débloqués
      const unlockedAchievementIds = await UserAchievement.findAll({
        where: { user_id: userId },
        attributes: ['achievement_id']
      }).then(records => records.map(r => r.achievement_id));

      const newlyUnlocked = [];

      for (const achievement of availableAchievements) {
        // Ignorer si déjà débloqué
        if (unlockedAchievementIds.includes(achievement.id)) continue;

        let conditionMet = false;

        switch (achievement.condition_type) {
          case 'quest_count':
            conditionMet = user.total_quests_completed >= achievement.condition_value;
            break;
          case 'streak':
            conditionMet = user.streak >= achievement.condition_value;
            break;
          case 'xp_total':
            conditionMet = user.xp >= achievement.condition_value;
            break;
          case 'level':
            conditionMet = user.level >= achievement.condition_value;
            break;
          case 'login_days':
            // Logique plus complexe à implémenter si nécessaire
            break;
        }

        if (conditionMet) {
          // Débloquer l'achievement
          await UserAchievement.create({
            user_id: userId,
            achievement_id: achievement.id,
            unlocked_at: new Date()
          });

          console.log(`🏆 [ACHIEVEMENT] "${achievement.title}" débloqué! +${achievement.xp_reward} XP`);
          
          // Ajouter l'XP bonus
          await user.addXp(achievement.xp_reward);

          newlyUnlocked.push(achievement);
        }
      }

      return newlyUnlocked;
    } catch (error) {
      throw new Error(`Erreur lors de la vérification des achievements: ${error.message}`);
    }
  }

  // Récupérer les stats de progression d'un utilisateur
  static async getUserProgress(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) throw new Error('Utilisateur non trouvé');

      // Quêtes du jour
      const today = new Date().toISOString().split('T')[0];
      const todayQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          assigned_at: {
            [Op.gte]: new Date(today + 'T00:00:00.000Z'),
            [Op.lt]: new Date(today + 'T23:59:59.999Z')
          }
        },
        include: [{ model: Quest }]
      });

      const completedTodayQuests = todayQuests.filter(uq => uq.is_completed);

      // Achievements débloqués
      const userAchievements = await UserAchievement.findAll({
        where: { user_id: userId },
        include: [{ model: Achievement }],
        order: [['unlocked_at', 'DESC']]
      });

      // Stats de la semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weeklyCompletedQuests = await UserQuest.count({
        where: {
          user_id: userId,
          is_completed: true,
          completed_at: { [Op.gte]: weekAgo }
        }
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          avatar: user.avatar,
          fitness_goals: user.fitness_goals,
          total_quests_completed: user.total_quests_completed
        },
        todayQuests: {
          total: todayQuests.length,
          completed: completedTodayQuests.length,
          quests: todayQuests
        },
        achievements: {
          total: userAchievements.length,
          recent: userAchievements.slice(0, 5)
        },
        weeklyStats: {
          questsCompleted: weeklyCompletedQuests
        },
        nextLevel: {
          xpNeeded: user.getXpForNextLevel(),
          currentLevel: user.level
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des stats: ${error.message}`);
    }
  }
}

module.exports = GamificationService;
