const { Achievement } = require('../models');

async function createAchievements() {
  try {
    console.log('🏆 Création des achievements de démo...');

    const achievements = [
      // Achievements pour les quêtes
      {
        title: 'Premier Pas',
        description: 'Complétez votre première quête',
        condition_type: 'quest_count',
        condition_value: 1,
        rarity: 'common',
        icon: '🎯',
        xp_reward: 50
      },
      {
        title: 'Engagé',
        description: 'Complétez 5 quêtes',
        condition_type: 'quest_count',
        condition_value: 5,
        rarity: 'common',
        icon: '✅',
        xp_reward: 100
      },
      {
        title: 'Dévoué',
        description: 'Complétez 10 quêtes',
        condition_type: 'quest_count',
        condition_value: 10,
        rarity: 'rare',
        icon: '🎖️',
        xp_reward: 200
      },
      {
        title: 'Héros du Fitness',
        description: 'Complétez 25 quêtes',
        condition_type: 'quest_count',
        condition_value: 25,
        rarity: 'epic',
        icon: '🏆',
        xp_reward: 500
      },
      {
        title: 'Légende PixelPump',
        description: 'Complétez 50 quêtes',
        condition_type: 'quest_count',
        condition_value: 50,
        rarity: 'legendary',
        icon: '👑',
        xp_reward: 1000
      },

      // Achievements pour les streaks
      {
        title: 'Flamme Naissante',
        description: 'Maintenez un streak de 3 jours',
        condition_type: 'streak',
        condition_value: 3,
        rarity: 'common',
        icon: '🔥',
        xp_reward: 75
      },
      {
        title: 'Feu Ardent',
        description: 'Maintenez un streak de 7 jours',
        condition_type: 'streak',
        condition_value: 7,
        rarity: 'rare',
        icon: '🚀',
        xp_reward: 250
      },
      {
        title: 'Brasier Éternel',
        description: 'Maintenez un streak de 30 jours',
        condition_type: 'streak',
        condition_value: 30,
        rarity: 'legendary',
        icon: '🌟',
        xp_reward: 1500
      },

      // Achievements pour les niveaux
      {
        title: 'Apprenti',
        description: 'Atteignez le niveau 5',
        condition_type: 'level',
        condition_value: 5,
        rarity: 'common',
        icon: '📚',
        xp_reward: 100
      },
      {
        title: 'Expert',
        description: 'Atteignez le niveau 10',
        condition_type: 'level',
        condition_value: 10,
        rarity: 'rare',
        icon: '🎓',
        xp_reward: 300
      },
      {
        title: 'Maître',
        description: 'Atteignez le niveau 20',
        condition_type: 'level',
        condition_value: 20,
        rarity: 'epic',
        icon: '⚡',
        xp_reward: 750
      },
      {
        title: 'Grand Maître',
        description: 'Atteignez le niveau 50',
        condition_type: 'level',
        condition_value: 50,
        rarity: 'legendary',
        icon: '💎',
        xp_reward: 2000
      },

      // Achievements pour l'XP
      {
        title: 'Collecteur d\'XP',
        description: 'Gagnez 1000 XP au total',
        condition_type: 'xp_total',
        condition_value: 1000,
        rarity: 'common',
        icon: '💰',
        xp_reward: 100
      },
      {
        title: 'Fermier d\'XP',
        description: 'Gagnez 5000 XP au total',
        condition_type: 'xp_total',
        condition_value: 5000,
        rarity: 'rare',
        icon: '🌾',
        xp_reward: 400
      },
      {
        title: 'Empereur de l\'XP',
        description: 'Gagnez 10000 XP au total',
        condition_type: 'xp_total',
        condition_value: 10000,
        rarity: 'epic',
        icon: '👑',
        xp_reward: 1000
      }
    ];

    for (const achievementData of achievements) {
      // Vérifier si l'achievement existe déjà
      const existing = await Achievement.findOne({
        where: { title: achievementData.title }
      });

      if (!existing) {
        await Achievement.create(achievementData);
        console.log(`✅ Achievement créé: ${achievementData.title}`);
      } else {
        console.log(`ℹ️  Achievement existe déjà: ${achievementData.title}`);
      }
    }

    console.log('🎉 Achievements de démo créés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la création des achievements:', error);
  }
}

// Exporter pour utilisation dans d'autres scripts
module.exports = createAchievements;

// Exécuter si ce fichier est lancé directement
if (require.main === module) {
  createAchievements().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
