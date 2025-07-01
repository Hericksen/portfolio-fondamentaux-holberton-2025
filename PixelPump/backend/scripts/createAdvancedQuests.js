#!/usr/bin/env node

// Script pour créer un jeu de quêtes complet pour le système cyclique
const { Quest, Achievement, User, UserQuest, UserAchievement, QuestCycle } = require('../models');

async function createAdvancedQuestSystem() {
  console.log('🚀 Création du système de quêtes avancé...\n');

  try {
    // === QUÊTES QUOTIDIENNES ===
    console.log('📅 Création des quêtes quotidiennes...');
    
    const dailyQuests = [
      // Quêtes de base - Niveau 1-2
      {
        title: 'Première connexion',
        description: 'Connectez-vous à PixelPump aujourd\'hui',
        category: 'social',
        type: 'daily',
        xp_reward: 25,
        difficulty: 'easy',
        min_level: 1,
        max_level: 5,
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
        requirements: { action: 'visit_pages', count: 3 }
      },
      
      // Quêtes intermédiaires - Niveau 3-6
      {
        title: 'Personnalisateur créatif',
        description: 'Modifiez votre avatar ou vos préférences',
        category: 'skill',
        type: 'daily',
        xp_reward: 50,
        difficulty: 'medium',
        min_level: 2,
        requirements: { action: 'customize_profile', count: 1 }
      },
      {
        title: 'Social butterfly',
        description: 'Consultez le profil d\'un autre utilisateur',
        category: 'social',
        type: 'daily',
        xp_reward: 35,
        difficulty: 'medium',
        min_level: 3,
        requirements: { action: 'view_other_profile', count: 1 }
      },
      {
        title: 'Maître des stats',
        description: 'Vérifiez vos statistiques de progression',
        category: 'health',
        type: 'daily',
        xp_reward: 45,
        difficulty: 'medium',
        min_level: 2,
        requirements: { action: 'check_stats', count: 1 }
      },
      
      // Quêtes avancées - Niveau 5+
      {
        title: 'Champion de la série',
        description: 'Maintenez votre série de connexions',
        category: 'challenge',
        type: 'daily',
        xp_reward: 60,
        difficulty: 'hard',
        min_level: 5,
        requirements: { action: 'maintain_streak', count: 1 }
      },
      {
        title: 'Perfectionniste',
        description: 'Complétez toutes vos quêtes quotidiennes',
        category: 'challenge',
        type: 'daily',
        xp_reward: 100,
        difficulty: 'hard',
        min_level: 3,
        requirements: { action: 'complete_all_daily', count: 1 }
      }
    ];

    // === QUÊTES HEBDOMADAIRES ===
    console.log('📊 Création des quêtes hebdomadaires...');
    
    const weeklyQuests = [
      {
        title: 'Régularité exemplaire',
        description: 'Connectez-vous 5 jours sur 7 cette semaine',
        category: 'social',
        type: 'weekly',
        xp_reward: 150,
        difficulty: 'medium',
        min_level: 2,
        requirements: { action: 'login_days', count: 5 }
      },
      {
        title: 'Explorateur hebdo',
        description: 'Visitez toutes les sections de PixelPump cette semaine',
        category: 'skill',
        type: 'weekly',
        xp_reward: 200,
        difficulty: 'medium',
        min_level: 1,
        requirements: { action: 'visit_all_sections', count: 1 }
      },
      {
        title: 'Chasseur de quêtes',
        description: 'Complétez 15 quêtes quotidiennes cette semaine',
        category: 'challenge',
        type: 'weekly',
        xp_reward: 300,
        difficulty: 'hard',
        min_level: 3,
        requirements: { action: 'complete_daily_quests', count: 15 }
      },
      {
        title: 'Mentor de la communauté',
        description: 'Aidez ou interagissez avec 3 autres utilisateurs',
        category: 'social',
        type: 'weekly',
        xp_reward: 250,
        difficulty: 'hard',
        min_level: 5,
        requirements: { action: 'help_users', count: 3 }
      },
      {
        title: 'Maître de la progression',
        description: 'Gagnez 500 XP cette semaine',
        category: 'challenge',
        type: 'weekly',
        xp_reward: 200,
        difficulty: 'medium',
        min_level: 2,
        requirements: { action: 'earn_xp', count: 500 }
      }
    ];

    // === QUÊTES MENSUELLES ===
    console.log('🗓️ Création des quêtes mensuelles...');
    
    const monthlyQuests = [
      {
        title: 'Légende de PixelPump',
        description: 'Maintenez une série de 20 jours ce mois-ci',
        category: 'challenge',
        type: 'monthly',
        xp_reward: 1000,
        difficulty: 'epic',
        min_level: 5,
        requirements: { action: 'monthly_streak', count: 20 }
      },
      {
        title: 'Collectionneur d\'achievements',
        description: 'Débloquez 5 nouveaux achievements ce mois',
        category: 'challenge',
        type: 'monthly',
        xp_reward: 800,
        difficulty: 'hard',
        min_level: 3,
        requirements: { action: 'unlock_achievements', count: 5 }
      },
      {
        title: 'Architecte de profil',
        description: 'Personnalisez complètement votre profil et avatar',
        category: 'skill',
        type: 'monthly',
        xp_reward: 600,
        difficulty: 'medium',
        min_level: 1,
        requirements: { action: 'complete_profile', count: 1 }
      },
      {
        title: 'Champion mensuel',
        description: 'Soyez dans le top 10 des utilisateurs les plus actifs',
        category: 'challenge',
        type: 'monthly',
        xp_reward: 1500,
        difficulty: 'epic',
        min_level: 10,
        requirements: { action: 'top_user', count: 1 }
      }
    ];

    // Créer toutes les quêtes
    let createdCount = 0;
    
    for (const questData of [...dailyQuests, ...weeklyQuests, ...monthlyQuests]) {
      await Quest.findOrCreate({
        where: { title: questData.title },
        defaults: questData
      });
      createdCount++;
    }

    console.log(`✅ ${createdCount} quêtes créées ou mises à jour`);

    // === ACHIEVEMENTS LIÉS AUX QUÊTES ===
    console.log('\n🏆 Création des achievements du système de quêtes...');
    
    const questAchievements = [
      {
        title: 'Premier pas',
        description: 'Complétez votre première quête quotidienne',
        icon: '👣',
        rarity: 'common',
        xp_reward: 50,
        condition_type: 'quest_count',
        condition_value: 1
      },
      {
        title: 'Habitué de la semaine',
        description: 'Complétez votre première quête hebdomadaire',
        icon: '📅',
        rarity: 'common',
        xp_reward: 100,
        condition_type: 'quest_count',
        condition_value: 1
      },
      {
        title: 'Marathonien mensuel',
        description: 'Complétez votre première quête mensuelle',
        icon: '🏃‍♂️',
        rarity: 'rare',
        xp_reward: 200,
        condition_type: 'quest_count',
        condition_value: 1
      },
      {
        title: 'Chasseur quotidien',
        description: 'Complétez 10 quêtes quotidiennes',
        icon: '🎯',
        rarity: 'common',
        xp_reward: 150,
        condition_type: 'quest_count',
        condition_value: 10
      },
      {
        title: 'Maître des quêtes',
        description: 'Complétez 50 quêtes au total',
        icon: '⚡',
        rarity: 'rare',
        xp_reward: 500,
        condition_type: 'quest_count',
        condition_value: 50
      },
      {
        title: 'Légende vivante',
        description: 'Complétez 100 quêtes au total',
        icon: '👑',
        rarity: 'epic',
        xp_reward: 1000,
        condition_type: 'quest_count',
        condition_value: 100
      },
      {
        title: 'Série de feu',
        description: 'Maintenez une série de 7 jours',
        icon: '🔥',
        rarity: 'rare',
        xp_reward: 300,
        condition_type: 'streak',
        condition_value: 7
      },
      {
        title: 'Série légendaire',
        description: 'Maintenez une série de 30 jours',
        icon: '🌟',
        rarity: 'legendary',
        xp_reward: 2000,
        condition_type: 'streak',
        condition_value: 30
      }
    ];

    let achievementCount = 0;
    for (const achData of questAchievements) {
      await Achievement.findOrCreate({
        where: { title: achData.title },
        defaults: achData
      });
      achievementCount++;
    }

    console.log(`✅ ${achievementCount} achievements créés ou mis à jour`);

    // === STATISTIQUES FINALES ===
    const totalQuests = await Quest.count();
    const totalAchievements = await Achievement.count();
    const activeUsers = await User.count();

    console.log('\n📊 SYSTÈME DE QUÊTES CRÉÉ AVEC SUCCÈS !');
    console.log('=============================================');
    console.log(`📋 Quêtes quotidiennes: ${dailyQuests.length}`);
    console.log(`📊 Quêtes hebdomadaires: ${weeklyQuests.length}`);
    console.log(`🗓️ Quêtes mensuelles: ${monthlyQuests.length}`);
    console.log('---------------------------------------------');
    console.log(`📋 Total quêtes en base: ${totalQuests}`);
    console.log(`🏆 Total achievements: ${totalAchievements}`);
    console.log(`👥 Utilisateurs actifs: ${activeUsers}`);
    console.log('=============================================');
    console.log('');
    console.log('🎯 NIVEAUX DE DIFFICULTÉ:');
    console.log('  🟢 Easy: Niveaux 1-2 (25-50 XP)');
    console.log('  🟡 Medium: Niveaux 2-5 (50-200 XP)');
    console.log('  🔴 Hard: Niveaux 3+ (200-500 XP)');
    console.log('  🟣 Epic: Niveaux 5+ (500-1500 XP)');
    console.log('');
    console.log('🔄 CYCLES TEMPORELS:');
    console.log('  📅 Quotidien: 3 quêtes/jour, renouvellement à minuit');
    console.log('  📊 Hebdomadaire: 2 quêtes/semaine, renouvellement le lundi');
    console.log('  🗓️ Mensuel: 1 quête/mois, renouvellement le 1er du mois');

  } catch (error) {
    console.error('❌ Erreur lors de la création du système:', error.message);
  }

  process.exit(0);
}

createAdvancedQuestSystem();
