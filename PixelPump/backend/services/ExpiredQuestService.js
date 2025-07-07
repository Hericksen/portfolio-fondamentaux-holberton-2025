const { UserQuest, Quest, User } = require('../models');
const { Op } = require('sequelize');

class ExpiredQuestService {
  
  /**
   * Vérifie et traite toutes les quêtes expirées pour tous les utilisateurs
   */
  static async processAllExpiredQuests() {
    try {
      console.log('🕒 Vérification des quêtes expirées...');
      
      const now = new Date();
      
      // Trouver toutes les quêtes expirées non encore marquées
      const expiredQuests = await UserQuest.findAll({
        where: {
          expires_at: {
            [Op.lt]: now
          },
          is_expired: false,
          is_completed: false,
          is_archived: false
        },
        include: [
          {
            model: Quest,
            attributes: ['title', 'type', 'category']
          },
          {
            model: User,
            attributes: ['username', 'level']
          }
        ]
      });

      if (expiredQuests.length === 0) {
        console.log('   ✓ Aucune quête expirée trouvée');
        return { processed: 0, replaced: 0 };
      }

      console.log(`   ⏰ ${expiredQuests.length} quêtes expirées trouvées`);

      let processedCount = 0;
      let replacedCount = 0;

      // Grouper par utilisateur pour traitement efficace
      const userQuestMap = new Map();
      expiredQuests.forEach(uq => {
        if (!userQuestMap.has(uq.user_id)) {
          userQuestMap.set(uq.user_id, []);
        }
        userQuestMap.get(uq.user_id).push(uq);
      });

      // Traiter chaque utilisateur
      for (const [userId, userExpiredQuests] of userQuestMap) {
        const user = userExpiredQuests[0].User;
        console.log(`   👤 Traitement des quêtes expirées pour ${user.username}...`);
        
        for (const expiredQuest of userExpiredQuests) {
          await this.markQuestAsExpired(expiredQuest);
          processedCount++;
          
          // Remplacer la quête expirée par une nouvelle
          const newQuest = await this.replaceExpiredQuest(userId, expiredQuest, user.level);
          if (newQuest) {
            replacedCount++;
            console.log(`      🔄 "${expiredQuest.Quest.title}" → "${newQuest.title}"`);
          }
        }
      }

      console.log(`   ✅ ${processedCount} quêtes expirées traitées, ${replacedCount} remplacées\n`);
      
      return { processed: processedCount, replaced: replacedCount };
      
    } catch (error) {
      console.error('❌ Erreur lors du traitement des quêtes expirées:', error);
      return { processed: 0, replaced: 0, error: error.message };
    }
  }

  /**
   * Vérifie et traite les quêtes expirées pour un utilisateur spécifique
   */
  static async processExpiredQuestsForUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return { processed: 0, replaced: 0, error: 'Utilisateur introuvable' };
      }

      const now = new Date();
      
      const expiredQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          expires_at: {
            [Op.lt]: now
          },
          is_expired: false,
          is_completed: false,
          is_archived: false
        },
        include: [Quest]
      });

      if (expiredQuests.length === 0) {
        return { processed: 0, replaced: 0 };
      }

      console.log(`🕒 ${expiredQuests.length} quêtes expirées trouvées pour ${user.username}`);

      let processedCount = 0;
      let replacedCount = 0;

      for (const expiredQuest of expiredQuests) {
        await this.markQuestAsExpired(expiredQuest);
        processedCount++;
        
        const newQuest = await this.replaceExpiredQuest(userId, expiredQuest, user.level);
        if (newQuest) {
          replacedCount++;
          console.log(`   🔄 "${expiredQuest.Quest.title}" → "${newQuest.title}"`);
        }
      }

      return { processed: processedCount, replaced: replacedCount };
      
    } catch (error) {
      console.error('❌ Erreur lors du traitement des quêtes expirées pour l\'utilisateur:', error);
      return { processed: 0, replaced: 0, error: error.message };
    }
  }

  /**
   * Marque une quête comme expirée
   */
  static async markQuestAsExpired(userQuest) {
    await userQuest.update({
      is_expired: true,
      expired_at: new Date(),
      is_archived: true // Archiver automatiquement les quêtes expirées
    });
  }

  /**
   * Remplace une quête expirée par une nouvelle quête appropriée
   */
  static async replaceExpiredQuest(userId, expiredUserQuest, userLevel) {
    try {
      const expiredQuest = expiredUserQuest.Quest;
      
      // Trouver les quêtes déjà assignées à l'utilisateur (actives)
      const existingUserQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          is_completed: false,
          is_expired: false,
          is_archived: false
        }
      });
      
      const existingQuestIds = existingUserQuests.map(uq => uq.quest_id);

      // Chercher une nouvelle quête du même type et catégorie si possible
      let replacementQuest = await Quest.findOne({
        where: {
          type: expiredQuest.type,
          category: expiredQuest.category,
          is_template: true,
          is_active: true,
          min_level: { [Op.lte]: userLevel },
          [Op.or]: [
            { max_level: { [Op.gte]: userLevel } },
            { max_level: null }
          ],
          id: { [Op.notIn]: existingQuestIds }
        },
        order: [['created_at', 'ASC']]
      });

      // Si pas trouvé, chercher dans la même catégorie avec un type différent
      if (!replacementQuest) {
        replacementQuest = await Quest.findOne({
          where: {
            category: expiredQuest.category,
            is_template: true,
            is_active: true,
            min_level: { [Op.lte]: userLevel },
            [Op.or]: [
              { max_level: { [Op.gte]: userLevel } },
              { max_level: null }
            ],
            id: { [Op.notIn]: existingQuestIds }
          },
          order: [['created_at', 'ASC']]
        });
      }

      // Si toujours pas trouvé, prendre n'importe quelle quête disponible
      if (!replacementQuest) {
        replacementQuest = await Quest.findOne({
          where: {
            is_template: true,
            is_active: true,
            min_level: { [Op.lte]: userLevel },
            [Op.or]: [
              { max_level: { [Op.gte]: userLevel } },
              { max_level: null }
            ],
            id: { [Op.notIn]: existingQuestIds }
          },
          order: [['created_at', 'ASC']]
        });
      }

      if (!replacementQuest) {
        console.log(`   ⚠️ Aucune quête de remplacement trouvée pour ${expiredQuest.title}`);
        return null;
      }

      // Calculer la date d'expiration basée sur le type de quête
      const expiresAt = this.calculateExpirationDate(replacementQuest.type);

      // Créer la nouvelle UserQuest
      const newUserQuest = await UserQuest.create({
        user_id: userId,
        quest_id: replacementQuest.id,
        cycle_id: expiredUserQuest.cycle_id, // Garder le même cycle si applicable
        assigned_at: new Date(),
        expires_at: expiresAt,
        progress: {}
      });

      return replacementQuest;
      
    } catch (error) {
      console.error('❌ Erreur lors du remplacement de la quête expirée:', error);
      return null;
    }
  }

  /**
   * Calcule la date d'expiration basée sur le type de quête
   */
  static calculateExpirationDate(questType) {
    const now = new Date();
    
    switch (questType) {
      case 'daily':
        // Expire à la fin de la journée
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay;
        
      case 'weekly':
        // Expire dans 7 jours
        const weekLater = new Date(now);
        weekLater.setDate(weekLater.getDate() + 7);
        return weekLater;
        
      case 'monthly':
        // Expire dans 30 jours
        const monthLater = new Date(now);
        monthLater.setDate(monthLater.getDate() + 30);
        return monthLater;
        
      case 'special':
        // Expire dans 3 jours par défaut
        const specialExpiry = new Date(now);
        specialExpiry.setDate(specialExpiry.getDate() + 3);
        return specialExpiry;
        
      default:
        // Par défaut, expire dans 1 jour
        const defaultExpiry = new Date(now);
        defaultExpiry.setDate(defaultExpiry.getDate() + 1);
        return defaultExpiry;
    }
  }

  /**
   * Nettoie les anciennes quêtes expirées (supprime celles de plus de 30 jours)
   */
  static async cleanupOldExpiredQuests() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deleted = await UserQuest.destroy({
        where: {
          is_expired: true,
          expired_at: {
            [Op.lt]: thirtyDaysAgo
          }
        }
      });

      if (deleted > 0) {
        console.log(`🧹 ${deleted} quêtes expirées anciennes supprimées`);
      }

      return deleted;
      
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage des quêtes expirées:', error);
      return 0;
    }
  }
}

module.exports = ExpiredQuestService;
