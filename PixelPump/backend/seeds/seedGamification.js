const { User, Quest, Achievement } = require('../models');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    console.log('🌱 Démarrage du seeding...');

    // Créer des quêtes par défaut
    const defaultQuests = [
      // Quêtes faciles (niveau 1-3)
      {
        title: "Premier pas cyber",
        description: "Connectez-vous à PixelPump et explorez votre dashboard",
        type: "daily",
        category: "skill",
        xp_reward: 10,
        difficulty: "easy",
        min_level: 1,
        max_level: 5,
        duration_minutes: 5,
        requirements: { action: "login" }
      },
      {
        title: "Exploration digitale",
        description: "Visitez 3 sections différentes de l'interface",
        type: "daily",
        category: "skill",
        xp_reward: 15,
        difficulty: "easy",
        min_level: 1,
        max_level: 10,
        duration_minutes: 10,
        requirements: { sections_visited: 3 }
      },
      {
        title: "Avatar Cyber",
        description: "Personnalisez votre avatar pixel",
        type: "daily",
        category: "social",
        xp_reward: 20,
        difficulty: "easy",
        min_level: 1,
        duration_minutes: 10,
        requirements: { avatar_customized: true }
      },

      // Quêtes moyennes (niveau 3-8)
      {
        title: "Maître des projets",
        description: "Créez et configurez un nouveau projet",
        type: "daily",
        category: "skill",
        xp_reward: 25,
        difficulty: "medium",
        min_level: 3,
        max_level: 15,
        duration_minutes: 20,
        requirements: { project_created: true }
      },
      {
        title: "Série cyber",
        description: "Complétez 3 quêtes consécutives",
        type: "weekly",
        category: "challenge",
        xp_reward: 50,
        difficulty: "medium",
        min_level: 5,
        duration_minutes: 60,
        requirements: { consecutive_quests: 3 }
      },

      // Quêtes difficiles (niveau 8+)
      {
        title: "Élite digitale",
        description: "Atteignez un streak de 7 jours",
        type: "weekly",
        category: "challenge",
        xp_reward: 100,
        difficulty: "hard",
        min_level: 8,
        duration_minutes: 10080, // 7 jours
        requirements: { streak_days: 7 }
      },
      {
        title: "Légende cyber",
        description: "Complétez 50 quêtes au total",
        type: "special",
        category: "challenge",
        xp_reward: 200,
        difficulty: "epic",
        min_level: 15,
        requirements: { total_quests: 50 }
      }
    ];

    console.log('📝 Création des quêtes par défaut...');
    await Quest.bulkCreate(defaultQuests, { 
      ignoreDuplicates: true 
    });

    // Créer des achievements par défaut
    const defaultAchievements = [
      // Achievements de démarrage
      {
        title: "Nouveau Recrue",
        description: "Complétez votre première quête",
        condition: "Terminer 1 quête",
        condition_type: "quest_count",
        condition_value: 1,
        icon: "🎯",
        rarity: "common",
        xp_reward: 25
      },
      {
        title: "Explorateur Cyber",
        description: "Complétez 5 quêtes",
        condition: "Terminer 5 quêtes",
        condition_type: "quest_count",
        condition_value: 5,
        icon: "🗺️",
        rarity: "common",
        xp_reward: 50
      },

      // Achievements de progression
      {
        title: "Débutant Motivé",
        description: "Maintenez un streak de 3 jours",
        condition: "Streak de 3 jours consécutifs",
        condition_type: "streak",
        condition_value: 3,
        icon: "🔥",
        rarity: "rare",
        xp_reward: 75
      },
      {
        title: "Warrior Cyber",
        description: "Complétez 25 quêtes",
        condition: "Terminer 25 quêtes",
        condition_type: "quest_count",
        condition_value: 25,
        icon: "⚔️",
        rarity: "rare",
        xp_reward: 100
      },

      // Achievements niveau
      {
        title: "Montée en Puissance",
        description: "Atteignez le niveau 5",
        condition: "Atteindre le niveau 5",
        condition_type: "level",
        condition_value: 5,
        icon: "📈",
        rarity: "rare",
        xp_reward: 100
      },
      {
        title: "Élite Digitale",
        description: "Atteignez le niveau 10",
        condition: "Atteindre le niveau 10",
        condition_type: "level",
        condition_value: 10,
        icon: "👑",
        rarity: "epic",
        xp_reward: 200
      },

      // Achievements XP
      {
        title: "Collecteur d'XP",
        description: "Accumulez 500 XP",
        condition: "Obtenir 500 XP total",
        condition_type: "xp_total",
        condition_value: 500,
        icon: "💎",
        rarity: "rare",
        xp_reward: 100
      },

      // Achievements légendaires
      {
        title: "Maître du Cyber",
        description: "Complétez 100 quêtes",
        condition: "Terminer 100 quêtes",
        condition_type: "quest_count",
        condition_value: 100,
        icon: "🏆",
        rarity: "legendary",
        xp_reward: 500
      },
      {
        title: "Streak Master",
        description: "Maintenez un streak de 30 jours",
        condition: "Streak de 30 jours consécutifs",
        condition_type: "streak",
        condition_value: 30,
        icon: "🔥",
        rarity: "legendary",
        xp_reward: 1000
      }
    ];

    console.log('🏆 Création des achievements par défaut...');
    await Achievement.bulkCreate(defaultAchievements, { 
      ignoreDuplicates: true 
    });

    // Créer un utilisateur admin par défaut
    const adminExists = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        username: 'admin',
        email: 'admin@pixelpump.com',
        password: hashedPassword,
        xp: 1000,
        level: 5,
        avatar: {
          body: 'cyber',
          outfit: 'elite',
          accessory: 'crown',
          color: '#ff006e'
        },
        fitness_goals: {
          daily_quests: 5,
          weekly_xp: 2000,
          target_level: 20
        }
      });
      console.log('👑 Utilisateur admin créé');
    }

    // Créer un utilisateur de test
    const testExists = await User.findOne({ where: { email: 'test@pixelpump.com' } });
    
    if (!testExists) {
      const hashedPassword = await bcrypt.hash('test123', 12);
      await User.create({
        username: 'testuser',
        email: 'test@pixelpump.com',
        password: hashedPassword,
        xp: 150,
        level: 2,
        streak: 2,
        total_quests_completed: 8,
        avatar: {
          body: 'default',
          outfit: 'casual',
          accessory: 'glasses',
          color: '#8338ec'
        }
      });
      console.log('🧪 Utilisateur de test créé');
    }

    console.log('✅ Seeding terminé avec succès!');
    console.log(`📊 Quêtes créées: ${defaultQuests.length}`);
    console.log(`🏆 Achievements créés: ${defaultAchievements.length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

module.exports = seedDatabase;

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎯 Seeding terminé!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}
