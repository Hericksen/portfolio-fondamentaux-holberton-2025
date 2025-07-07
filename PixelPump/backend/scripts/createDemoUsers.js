const { User, Quest, UserQuest, Achievement, UserAchievement } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Script pour créer des utilisateurs de démonstration avec données réalistes
 */
async function createDemoUsers() {
  try {
    console.log('🎭 === CRÉATION UTILISATEURS DÉMO ===\n');

    // 1. Créer des utilisateurs variés avec progressions différentes
    const demoUsers = [
      {
        username: 'FitnessGuru_Pro',
        email: 'guru@demo.pixelpump.com',
        password: await bcrypt.hash('demo2025', 10),
        level: 15,
        xp: 2450,
        streak: 30,
        total_quests_completed: 85,
        avatar: {
          hairColor: '#ff4081',
          skinColor: '#fdbcb4',
          outfit: 'sport',
          accessory: 'crown',
          expression: 'confident'
        },
        fitness_goals: {
          daily_quests: 4,
          weekly_xp: 2000,
          target_level: 20,
          preferred_activities: ['strength', 'cardio', 'nutrition']
        }
      },
      {
        username: 'YogaMaster_Zen',
        email: 'yoga@demo.pixelpump.com',
        password: await bcrypt.hash('demo2025', 10),
        level: 8,
        xp: 1200,
        streak: 12,
        total_quests_completed: 45,
        avatar: {
          hairColor: '#9c27b0',
          skinColor: '#e0ac69',
          outfit: 'casual',
          accessory: 'headphones',
          expression: 'peaceful'
        },
        fitness_goals: {
          daily_quests: 3,
          weekly_xp: 800,
          target_level: 12,
          preferred_activities: ['flexibility', 'mindfulness', 'balance']
        }
      },
      {
        username: 'RunnerBeast_2024',
        email: 'runner@demo.pixelpump.com',
        password: await bcrypt.hash('demo2025', 10),
        level: 12,
        xp: 1800,
        streak: 45,
        total_quests_completed: 67,
        avatar: {
          hairColor: '#00ffaa',
          skinColor: '#c68642',
          outfit: 'sport',
          accessory: 'sunglasses',
          expression: 'determined'
        },
        fitness_goals: {
          daily_quests: 5,
          weekly_xp: 1500,
          target_level: 15,
          preferred_activities: ['cardio', 'endurance', 'outdoor']
        }
      },
      {
        username: 'NewbiePumper',
        email: 'newbie@demo.pixelpump.com',
        password: await bcrypt.hash('demo2025', 10),
        level: 3,
        xp: 350,
        streak: 5,
        total_quests_completed: 12,
        avatar: {
          hairColor: '#ffeb3b',
          skinColor: '#fdbcb4',
          outfit: 'casual',
          accessory: 'glasses',
          expression: 'excited'
        },
        fitness_goals: {
          daily_quests: 2,
          weekly_xp: 400,
          target_level: 5,
          preferred_activities: ['beginner', 'walking', 'stretching']
        }
      },
      {
        username: 'StrengthQueen_Iron',
        email: 'strength@demo.pixelpump.com',
        password: await bcrypt.hash('demo2025', 10),
        level: 18,
        xp: 3200,
        streak: 67,
        total_quests_completed: 120,
        avatar: {
          hairColor: '#f44336',
          skinColor: '#8d5524',
          outfit: 'sport',
          accessory: 'bandana',
          expression: 'fierce'
        },
        fitness_goals: {
          daily_quests: 6,
          weekly_xp: 2500,
          target_level: 25,
          preferred_activities: ['strength', 'powerlifting', 'muscle-building']
        }
      }
    ];

    let createdCount = 0;

    for (const userData of demoUsers) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email: userData.email } });
        
        if (!existingUser) {
          const user = await User.create(userData);
          console.log(`✅ Utilisateur créé: ${userData.username} (Level ${userData.level})`);
          createdCount++;
        } else {
          console.log(`⚠️ Utilisateur existant: ${userData.username}`);
        }
      } catch (error) {
        console.log(`❌ Erreur création ${userData.username}: ${error.message}`);
      }
    }

    console.log(`\n📊 Résumé: ${createdCount} nouveaux utilisateurs créés`);

    // 2. Statistiques finales
    const totalUsers = await User.count();
    console.log(`👥 Total utilisateurs: ${totalUsers}`);

    console.log('\n🎉 === UTILISATEURS DÉMO PRÊTS ===');
    console.log('\n📋 Comptes de démonstration:');
    console.log('   📧 guru@demo.pixelpump.com / demo2025 (Level 15 - Expert)');
    console.log('   📧 yoga@demo.pixelpump.com / demo2025 (Level 8 - Zen)');
    console.log('   📧 runner@demo.pixelpump.com / demo2025 (Level 12 - Runner)');
    console.log('   📧 newbie@demo.pixelpump.com / demo2025 (Level 3 - Débutant)');
    console.log('   📧 strength@demo.pixelpump.com / demo2025 (Level 18 - Force)');

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs démo:', error);
  }
}

// Exécution
async function main() {
  await createDemoUsers();
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { createDemoUsers };
