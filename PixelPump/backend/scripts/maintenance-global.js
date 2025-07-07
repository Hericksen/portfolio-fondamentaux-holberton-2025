#!/usr/bin/env node

/**
 * Script de maintenance global pour PixelPump
 * Remplace plusieurs scripts individuels par un système unifié
 */

const { User, Quest, UserQuest, Achievement, UserAchievement } = require('../models');
const ExpiredQuestService = require('../services/ExpiredQuestService');
const LoginQuestService = require('../services/LoginQuestService');
const QuestInitializationService = require('../services/QuestInitializationService');

class MaintenanceScript {
  
  static async showMenu() {
    console.log('\n🔧 SCRIPT DE MAINTENANCE PIXELPUMP');
    console.log('=====================================');
    console.log('1. 🕒 Traiter les quêtes expirées');
    console.log('2. 🧹 Nettoyer les anciennes quêtes expirées');
    console.log('3. 🎭 Renouveler les quêtes demo/admin');
    console.log('4. 📊 Afficher les statistiques globales');
    console.log('5. 🔄 Réinitialiser un utilisateur spécifique');
    console.log('6. 🎯 Initialiser le système de quêtes');
    console.log('7. 👥 Lister les utilisateurs');
    console.log('8. 🏆 Débloquer un achievement pour un utilisateur');
    console.log('0. ❌ Quitter');
    console.log('=====================================');
  }

  static async processExpiredQuests() {
    console.log('\n🕒 Traitement des quêtes expirées...');
    const result = await ExpiredQuestService.processAllExpiredQuests();
    console.log(`✅ ${result.processed} quêtes traitées, ${result.replaced} remplacées`);
  }

  static async cleanupOldQuests() {
    console.log('\n🧹 Nettoyage des anciennes quêtes...');
    const deleted = await ExpiredQuestService.cleanupOldExpiredQuests();
    console.log(`✅ ${deleted} anciennes quêtes supprimées`);
  }

  static async renewDemoQuests() {
    console.log('\n🎭 Renouvellement des quêtes demo/admin...');
    
    // Trouver tous les utilisateurs demo/admin
    const allUsers = await User.findAll();
    let renewed = 0;
    
    for (const user of allUsers) {
      if (LoginQuestService.isDemoOrAdminUser(user)) {
        console.log(`   🔄 Renouvellement pour ${user.username}...`);
        const result = await LoginQuestService.renewQuestsForDemoUser(user);
        console.log(`      ✅ ${result.count} nouvelles quêtes assignées`);
        renewed++;
      }
    }
    
    console.log(`✅ ${renewed} utilisateurs demo/admin traités`);
  }

  static async showGlobalStats() {
    console.log('\n📊 Statistiques globales PixelPump');
    console.log('====================================');
    
    const totalUsers = await User.count();
    const totalQuests = await Quest.count();
    const totalUserQuests = await UserQuest.count();
    const activeQuests = await UserQuest.count({ where: { is_completed: false, is_expired: false, is_archived: false } });
    const completedQuests = await UserQuest.count({ where: { is_completed: true } });
    const expiredQuests = await UserQuest.count({ where: { is_expired: true } });
    const totalAchievements = await Achievement.count();
    const unlockedAchievements = await UserAchievement.count();
    
    console.log(`👥 Utilisateurs : ${totalUsers}`);
    console.log(`🎯 Quêtes templates : ${totalQuests}`);
    console.log(`📋 Assignations totales : ${totalUserQuests}`);
    console.log(`  ├─ 🟢 Actives : ${activeQuests}`);
    console.log(`  ├─ ✅ Complétées : ${completedQuests}`);
    console.log(`  └─ 🔴 Expirées : ${expiredQuests}`);
    console.log(`🏆 Achievements : ${totalAchievements} (${unlockedAchievements} débloqués)`);
  }

  static async resetUser() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question('\n📧 Email de l\'utilisateur à réinitialiser : ', async (email) => {
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
          console.log('❌ Utilisateur non trouvé');
          readline.close();
          resolve();
          return;
        }

        console.log(`\n🔄 Réinitialisation de ${user.username}...`);
        
        // Réinitialiser les stats
        await user.update({
          xp: 0,
          level: 1,
          streak: 0,
          total_quests_completed: 0,
          last_quest_date: null
        });

        // Réassigner des quêtes
        const result = await QuestInitializationService.assignQuestsToUser(user.id, 1, true);
        
        console.log(`✅ Utilisateur réinitialisé avec ${result.count} nouvelles quêtes`);
        readline.close();
        resolve();
      });
    });
  }

  static async initializeQuestSystem() {
    console.log('\n🎯 Initialisation du système de quêtes...');
    await QuestInitializationService.initializeQuestSystem();
    console.log('✅ Système initialisé');
  }

  static async listUsers() {
    console.log('\n👥 Liste des utilisateurs');
    console.log('=========================');
    
    const users = await User.findAll({
      attributes: ['username', 'email', 'level', 'xp', 'streak', 'role'],
      order: [['level', 'DESC'], ['xp', 'DESC']]
    });

    users.forEach((user, index) => {
      const badge = LoginQuestService.isDemoOrAdminUser(user) ? ' 🎭' : '';
      console.log(`${index + 1}. ${user.username}${badge} (${user.email})`);
      console.log(`   Level ${user.level} • ${user.xp} XP • Streak ${user.streak}`);
    });
  }

  static async unlockAchievement() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question('\n📧 Email de l\'utilisateur : ', async (email) => {
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
          console.log('❌ Utilisateur non trouvé');
          readline.close();
          resolve();
          return;
        }

        // Lister les achievements disponibles
        const achievements = await Achievement.findAll();
        console.log('\n🏆 Achievements disponibles :');
        achievements.forEach((ach, index) => {
          console.log(`${index + 1}. ${ach.title} (${ach.description})`);
        });

        readline.question('\nNuméro de l\'achievement à débloquer : ', async (num) => {
          const achievementIndex = parseInt(num) - 1;
          
          if (achievementIndex >= 0 && achievementIndex < achievements.length) {
            const achievement = achievements[achievementIndex];
            
            // Vérifier s'il l'a déjà
            const existing = await UserAchievement.findOne({
              where: { user_id: user.id, achievement_id: achievement.id }
            });

            if (existing) {
              console.log('⚠️ Achievement déjà débloqué');
            } else {
              await UserAchievement.create({
                user_id: user.id,
                achievement_id: achievement.id,
                unlocked_at: new Date()
              });
              console.log(`🎉 Achievement "${achievement.title}" débloqué pour ${user.username}!`);
            }
          } else {
            console.log('❌ Numéro invalide');
          }
          
          readline.close();
          resolve();
        });
      });
    });
  }

  static async run() {
    try {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      while (true) {
        await this.showMenu();
        
        const choice = await new Promise((resolve) => {
          readline.question('\nChoisissez une option : ', resolve);
        });

        switch (choice) {
          case '1':
            await this.processExpiredQuests();
            break;
          case '2':
            await this.cleanupOldQuests();
            break;
          case '3':
            await this.renewDemoQuests();
            break;
          case '4':
            await this.showGlobalStats();
            break;
          case '5':
            await this.resetUser();
            break;
          case '6':
            await this.initializeQuestSystem();
            break;
          case '7':
            await this.listUsers();
            break;
          case '8':
            await this.unlockAchievement();
            break;
          case '0':
            console.log('\n👋 Au revoir !');
            readline.close();
            process.exit(0);
            break;
          default:
            console.log('\n❌ Option invalide');
        }

        // Pause avant de reafficher le menu
        await new Promise((resolve) => {
          readline.question('\n⏸️  Appuyez sur Entrée pour continuer...', resolve);
        });
      }
    } catch (error) {
      console.error('❌ Erreur:', error.message);
      process.exit(1);
    }
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  MaintenanceScript.run();
}

module.exports = MaintenanceScript;
