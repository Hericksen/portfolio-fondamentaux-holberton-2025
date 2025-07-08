const { Quest, UserQuest, User } = require('../models');
const { Op } = require('sequelize');
const GamificationService = require('../services/GamificationService');

const QuestController = {
  // Récupérer toutes les quêtes templates
  async getAllQuests(req, res) {
    try {
      const quests = await Quest.findAll({
        where: { is_template: true, is_active: true }
      });
      res.json({ success: true, data: quests });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer une nouvelle quête template (admin)
  async createQuest(req, res) {
    try {
      const quest = await Quest.create(req.body);
      res.status(201).json({ success: true, data: quest });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer les quêtes assignées à un utilisateur
  async getUserQuests(req, res) {
    try {
      const { userId } = req.params;
      
      // Récupérer les quêtes de l'utilisateur connecté ou de l'utilisateur spécifié
      const targetUserId = userId || req.user.userId;
      
      // Vérifier et traiter les quêtes expirées avant de retourner les résultats
      const ExpiredQuestService = require('../services/ExpiredQuestService');
      await ExpiredQuestService.processExpiredQuestsForUser(targetUserId);
      
      const userQuests = await UserQuest.findAll({
        where: { 
          user_id: targetUserId,
          is_archived: false // Ne pas retourner les quêtes archivées (expirées)
        },
        include: [{ 
          model: Quest,
          attributes: ['id', 'title', 'description', 'type', 'category', 'xp_reward', 'difficulty', 'duration_minutes']
        }],
        order: [['assigned_at', 'DESC']]
      });

      res.json({ 
        success: true, 
        data: userQuests,
        count: userQuests.length
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Assigner les quêtes quotidiennes
  async assignDailyQuests(req, res) {
    try {
      const { userId } = req.body;
      const targetUserId = userId || req.user.userId;
      
      const result = await GamificationService.assignDailyQuests(targetUserId);
      
      res.json({
        success: true,
        message: result.message,
        data: result.quests,
        count: result.count || result.quests.length
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message,
        error: error.message 
      });
    }
  },

  // Compléter une quête
  async completeQuest(req, res) {
    try {
      const { questId } = req.params;
      const userId = req.user.userId;
      
      const result = await GamificationService.completeQuest(userId, questId);
      
      res.json({
        success: true,
        message: result.message,
        data: {
          xpGained: result.xpGained,
          leveledUp: result.leveledUp,
          newLevel: result.newLevel,
          newAchievements: result.newAchievements,
          achievements: result.achievements
        }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  // Récupérer les quêtes du jour pour l'utilisateur connecté
  async getTodayQuests(req, res) {
    try {
      const userId = req.user.userId;
      const today = new Date().toISOString().split('T')[0];
      
      const todayQuests = await UserQuest.findAll({
        where: {
          user_id: userId,
          assigned_at: {
            [Op.gte]: new Date(today + 'T00:00:00.000Z'),
            [Op.lt]: new Date(today + 'T23:59:59.999Z')
          }
        },
        include: [{ model: Quest }],
        order: [['assigned_at', 'ASC']]
      });

      res.json({
        success: true,
        data: todayQuests,
        completed: todayQuests.filter(q => q.is_completed).length,
        total: todayQuests.length
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer une quête template (admin)
  async deleteQuest(req, res) {
    try {
      const { questId } = req.params;
      const quest = await Quest.findByPk(questId);
      
      if (!quest) {
        return res.status(404).json({ success: false, message: 'Quête non trouvée' });
      }

      await quest.destroy();
      res.json({ success: true, message: 'Quête supprimée' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Assigner une quête à un utilisateur spécifique (admin)
  async assignQuestToUser(req, res) {
    try {
      const { userId, questId } = req.body;
      
      if (!userId || !questId) {
        return res.status(400).json({
          success: false,
          message: 'userId et questId sont requis'
        });
      }

      // Vérifier que l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier que la quête existe et est un template
      const quest = await Quest.findOne({
        where: { id: questId, is_template: true, is_active: true }
      });
      
      if (!quest) {
        return res.status(404).json({
          success: false,
          message: 'Quête non trouvée ou inactive'
        });
      }

      // Vérifier si la quête n'est pas déjà assignée à cet utilisateur
      const existingAssignment = await UserQuest.findOne({
        where: { 
          user_id: userId, 
          quest_id: questId, 
          is_completed: false,
          is_expired: false
        }
      });

      if (existingAssignment) {
        return res.status(400).json({
          success: false,
          message: 'Cette quête est déjà assignée à cet utilisateur'
        });
      }

      // Créer l'assignation
      const userQuest = await UserQuest.create({
        user_id: userId,
        quest_id: questId,
        is_completed: false,
        assigned_at: new Date()
      });

      // Récupérer les détails complets pour la réponse
      const fullUserQuest = await UserQuest.findByPk(userQuest.id, {
        include: [
          { 
            model: Quest,
            attributes: ['id', 'title', 'description', 'type', 'category', 'xp_reward', 'difficulty', 'duration_minutes']
          },
          {
            model: User,
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: `Quête "${quest.title}" assignée avec succès à ${user.username}`,
        data: fullUserQuest
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  // Supprimer un utilisateur (admin)
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      
      // Vérifier que ce n'est pas l'admin qui se supprime lui-même
      if (req.user.userId === userId) {
        return res.status(400).json({
          success: false,
          message: '🚫 Impossible de supprimer votre propre avatar ! Un héros ne peut pas disparaître de sa propre quête.'
        });
      }

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '👻 Ce pumper a déjà disparu des terres de PixelPump !'
        });
      }

      // Supprimer d'abord toutes les quêtes assignées à l'utilisateur
      await UserQuest.destroy({
        where: { user_id: userId }
      });

      // Supprimer l'utilisateur
      await user.destroy();

      res.json({
        success: true,
        message: `🎮 Le pumper ${user.username} a été supprimé de l'univers PixelPump ! Ses quêtes ont été redistribuées aux autres héros.`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  // Traiter manuellement les quêtes expirées (endpoint admin)
  async processExpiredQuests(req, res) {
    try {
      const ExpiredQuestService = require('../services/ExpiredQuestService');
      const result = await ExpiredQuestService.processAllExpiredQuests();
      
      res.json({
        success: true,
        message: `🕒 Traitement des quêtes expirées terminé`,
        data: {
          processed: result.processed,
          replaced: result.replaced,
          error: result.error
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement des quêtes expirées',
        error: error.message
      });
    }
  },

  // Traiter les quêtes expirées pour un utilisateur spécifique
  async processUserExpiredQuests(req, res) {
    try {
      const { userId } = req.params;
      const targetUserId = userId || req.user.userId;
      
      const ExpiredQuestService = require('../services/ExpiredQuestService');
      const result = await ExpiredQuestService.processExpiredQuestsForUser(targetUserId);
      
      res.json({
        success: true,
        message: `🕒 Quêtes expirées traitées pour l'utilisateur`,
        data: {
          processed: result.processed,
          replaced: result.replaced,
          error: result.error
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement des quêtes expirées',
        error: error.message
      });
    }
  },

  // Nettoyer les anciennes quêtes expirées (endpoint admin)
  async cleanupExpiredQuests(req, res) {
    try {
      const ExpiredQuestService = require('../services/ExpiredQuestService');
      const deleted = await ExpiredQuestService.cleanupOldExpiredQuests();
      
      res.json({
        success: true,
        message: `🧹 ${deleted} anciennes quêtes expirées supprimées`,
        data: { deleted }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du nettoyage des quêtes expirées',
        error: error.message
      });
    }
  },

  // Renouveler les quêtes pour les utilisateurs demo/admin
  async renewQuestsForDemo(req, res) {
    try {
      const LoginQuestService = require('../services/LoginQuestService');
      
      // Utiliser l'ID de l'utilisateur de la requête si disponible, sinon chercher un utilisateur démo
      let userId;
      let user;
      
      if (req.params.userId) {
        // ID passé en paramètre d'URL
        userId = req.params.userId;
        user = await User.findByPk(userId, {
          attributes: ['id', 'username', 'email', 'role', 'level', 'xp']
        });
      } else if (req.user && req.user.userId) {
        // ID de l'utilisateur authentifié
        userId = req.user.userId;
        user = await User.findByPk(userId, {
          attributes: ['id', 'username', 'email', 'role', 'level', 'xp']
        });
      } else {
        // Chercher un utilisateur démo par défaut
        console.log(`\n🔄 [CONTROLLER] Aucun utilisateur spécifique - Recherche d'un utilisateur démo`);
        user = await User.findOne({
          where: {
            username: 'NewbiePumper' // Nom d'utilisateur démo par défaut
          },
          attributes: ['id', 'username', 'email', 'role', 'level', 'xp']
        });
        
        if (!user) {
          // Si NewbiePumper n'existe pas, chercher n'importe quel utilisateur admin
          user = await User.findOne({
            where: {
              role: 'admin'
            },
            attributes: ['id', 'username', 'email', 'role', 'level', 'xp']
          });
        }
      }
      
      console.log(`\n🔄 [CONTROLLER] Demande de renouvellement des quêtes - UserID: ${user?.id}`);
      
      if (!user) {
        console.log(`❌ [CONTROLLER] Aucun utilisateur trouvé pour le renouvellement`);
        return res.status(404).json({
          success: false,
          message: 'Aucun utilisateur démo trouvé'
        });
      }
      
      console.log(`✅ [CONTROLLER] Utilisateur trouvé: ${user.username} (ID: ${user.id})`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Role: ${user.role || 'N/A'}`);
      console.log(`   Niveau: ${user.level || 1}`);
      console.log(`   XP: ${user.xp || 0}`);
      
      // IMPORTANT: Pour s'assurer que ça fonctionne, nous forçons le renouvellement pour tous les utilisateurs
      console.log(`🎮 [CONTROLLER] Forçage du renouvellement des quêtes pour ${user.username}...`);
      
      try {
        const result = await LoginQuestService.renewQuestsForDemoUser(user);
        
        console.log(`✅ [CONTROLLER] Quêtes renouvelées avec succès - ${result.count} quêtes`);
        
        return res.json({
          success: true,
          message: `🎮 Quêtes renouvelées pour ${user.username}`,
          data: {
            count: result.count,
            quests: result.quests
          }
        });
      } catch (renewError) {
        console.error(`❌ [CONTROLLER] Erreur lors du renouvellement:`, renewError);
        return res.status(500).json({
          success: false,
          message: `Erreur lors du renouvellement des quêtes: ${renewError.message}`,
          error: renewError.message
        });
      }
    } catch (error) {
      console.error(`❌ [CONTROLLER] Erreur générale:`, error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors du traitement de la demande',
        error: error.message
      });
    }
  },

  // Obtenir les statistiques de quêtes d'un utilisateur
  async getQuestStats(req, res) {
    try {
      const { userId } = req.params;
      const targetUserId = userId || req.user.userId;
      
      const LoginQuestService = require('../services/LoginQuestService');
      const stats = await LoginQuestService.getQuestStats(targetUserId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }
};

module.exports = QuestController;
