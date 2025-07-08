const Quest = require('../models/Quest');
const sequelize = require('../config/db');

// 30 QUÊTES BONUS POUR ATTEINDRE 200
const bonusQuests = [
  // QUÊTES SPÉCIALES CRÉATIVES
  {
    title: "Ninja Morning",
    description: "Réveillez-vous à 4h30 et faites 30 minutes de sport avant le lever du soleil",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 150,
    duration_minutes: 30,
    min_level: 15,
    requirements: { wake_time: "04:30", sport_before_sunrise: true }
  },
  {
    title: "Speed Demon",
    description: "Courez 10km en moins de 45 minutes",
    type: "special",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 100,
    duration_minutes: 45,
    min_level: 10,
    requirements: { run_km: 10, max_time: 45 }
  },
  {
    title: "Strength Beast",
    description: "Soulevez votre poids corporel au développé couché",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 200,
    duration_minutes: 60,
    min_level: 12,
    requirements: { bench_press: "bodyweight" }
  },
  {
    title: "Flexibility God",
    description: "Réalisez le grand écart parfait",
    type: "special",
    category: "skill",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 30,
    min_level: 8,
    requirements: { full_split: true }
  },
  {
    title: "Balance Master",
    description: "Tenez en équilibre sur les mains pendant 60 secondes",
    type: "special",
    category: "skill",
    difficulty: "epic",
    xp_reward: 180,
    duration_minutes: 20,
    min_level: 15,
    requirements: { handstand_seconds: 60 }
  },
  {
    title: "Endurance King",
    description: "Courez un semi-marathon (21km) sans s'arrêter",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 300,
    duration_minutes: 120,
    min_level: 15,
    requirements: { run_km: 21, no_stop: true }
  },
  {
    title: "Iron Will",
    description: "Faites 1000 burpees en une séance",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 500,
    duration_minutes: 180,
    min_level: 20,
    requirements: { burpees: 1000, single_session: true }
  },
  {
    title: "Aqua Beast",
    description: "Nagez 5km sans pause",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 250,
    duration_minutes: 150,
    min_level: 12,
    requirements: { swim_km: 5, no_pause: true }
  },
  {
    title: "Mountain Goat",
    description: "Grimpez l'équivalent de 2000m de dénivelé en une sortie",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 400,
    duration_minutes: 300,
    min_level: 18,
    requirements: { elevation_gain: 2000 }
  },
  {
    title: "Speed Cyclist",
    description: "Parcourez 100km à vélo en moins de 3 heures",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 350,
    duration_minutes: 180,
    min_level: 16,
    requirements: { bike_km: 100, max_time: 180 }
  },

  // QUÊTES ACHIEVEMENT UNIQUES
  {
    title: "Perfectionist",
    description: "Complétez 100 quêtes avec un score parfait",
    type: "achievement",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 1000,
    duration_minutes: 1,
    min_level: 25,
    requirements: { perfect_quests: 100 }
  },
  {
    title: "Social Legend",
    description: "Invitez 50 amis à rejoindre PixelPump",
    type: "achievement",
    category: "social",
    difficulty: "hard",
    xp_reward: 500,
    duration_minutes: 1,
    min_level: 10,
    requirements: { invites: 50 }
  },
  {
    title: "Streak Master",
    description: "Maintenez une série de 365 jours",
    type: "achievement",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 2000,
    duration_minutes: 1,
    min_level: 30,
    requirements: { streak_days: 365 }
  },
  {
    title: "Level Destroyer",
    description: "Atteignez le niveau 50",
    type: "achievement",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 5000,
    duration_minutes: 1,
    min_level: 50,
    requirements: { level: 50 }
  },
  {
    title: "XP Millionaire",
    description: "Gagnez 1 million d'XP au total",
    type: "achievement",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 10000,
    duration_minutes: 1,
    min_level: 40,
    requirements: { total_xp: 1000000 }
  },

  // QUÊTES SAISONNIÈRES
  {
    title: "Summer Body",
    description: "Perdez 5kg entre juin et août",
    type: "special",
    category: "health",
    difficulty: "hard",
    xp_reward: 300,
    duration_minutes: 7200,
    min_level: 5,
    requirements: { weight_loss: 5, season: "summer" }
  },
  {
    title: "Winter Warrior",
    description: "Courez dehors par -5°C ou moins",
    type: "special",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 150,
    duration_minutes: 60,
    min_level: 8,
    requirements: { outdoor_run: true, temperature: -5 }
  },
  {
    title: "New Year Resolution",
    description: "Maintenez vos objectifs fitness pendant les 31 premiers jours de l'année",
    type: "special",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 500,
    duration_minutes: 930,
    min_level: 5,
    requirements: { january_consistency: true }
  },
  {
    title: "Spring Awakening",
    description: "Augmentez votre activité de 50% par rapport à l'hiver",
    type: "special",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 200,
    duration_minutes: 480,
    min_level: 3,
    requirements: { activity_increase: 50, season: "spring" }
  },
  {
    title: "Halloween Horror",
    description: "Faites un workout terrifiant de 666 répétitions totales",
    type: "special",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 666,
    duration_minutes: 90,
    min_level: 13,
    requirements: { total_reps: 666, halloween_theme: true }
  },

  // QUÊTES EXTRÊMES
  {
    title: "Spartan Race",
    description: "Complétez un parcours d'obstacles de 10km",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 800,
    duration_minutes: 120,
    min_level: 20,
    requirements: { obstacle_course: true, distance: 10 }
  },
  {
    title: "Triathlon Beast",
    description: "Complétez un triathlon complet en moins de 3 heures",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 1000,
    duration_minutes: 180,
    min_level: 25,
    requirements: { triathlon: "full", max_time: 180 }
  },
  {
    title: "CrossFit Hero",
    description: "Terminez un WOD héroique en Rx",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 600,
    duration_minutes: 60,
    min_level: 18,
    requirements: { hero_wod: true, rx_weight: true }
  },
  {
    title: "Powerlifting King",
    description: "Atteignez un total de 600kg sur les 3 mouvements (squat, bench, deadlift)",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 1500,
    duration_minutes: 180,
    min_level: 22,
    requirements: { powerlifting_total: 600 }
  },
  {
    title: "Marathon Sub-3",
    description: "Courez un marathon en moins de 3 heures",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 2000,
    duration_minutes: 180,
    min_level: 30,
    requirements: { marathon: true, time_under: 180 }
  },

  // QUÊTES BIEN-ÊTRE MENTAL
  {
    title: "Zen Master Supreme",
    description: "Méditez 2 heures d'affilée",
    type: "special",
    category: "health",
    difficulty: "epic",
    xp_reward: 300,
    duration_minutes: 120,
    min_level: 15,
    requirements: { meditation_minutes: 120, continuous: true }
  },
  {
    title: "Digital Detox",
    description: "Passez 7 jours sans écrans tout en maintenant votre activité physique",
    type: "special",
    category: "health",
    difficulty: "hard",
    xp_reward: 400,
    duration_minutes: 10080,
    min_level: 10,
    requirements: { no_screens: 7, maintain_activity: true }
  },
  {
    title: "Sleep Optimization",
    description: "Optimisez votre sommeil : 9h par nuit pendant 30 jours avec suivi détaillé",
    type: "special",
    category: "health",
    difficulty: "medium",
    xp_reward: 350,
    duration_minutes: 16200,
    min_level: 5,
    requirements: { sleep_hours: 9, tracking: true, days: 30 }
  },
  {
    title: "Stress Destroyer",
    description: "Réduisez votre stress de 50% mesurable sur 30 jours",
    type: "special",
    category: "health",
    difficulty: "hard",
    xp_reward: 500,
    duration_minutes: 900,
    min_level: 8,
    requirements: { stress_reduction: 50, measurable: true }
  },
  {
    title: "Ultimate Warrior",
    description: "Complétez toutes les autres quêtes de PixelPump",
    type: "achievement",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 50000,
    duration_minutes: 1,
    min_level: 100,
    requirements: { all_quests_completed: true }
  }
];

// Fonction pour créer les quêtes bonus
async function createBonusQuests() {
  try {
    console.log('🚀 Création de 30 quêtes BONUS pour atteindre 200...');
    
    // Connexion à la base
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie');
    
    const questCount = await Quest.count();
    console.log(`📊 Nombre de quêtes avant création: ${questCount}`);
    
    // Créer les quêtes bonus
    let created = 0;
    for (const questData of bonusQuests) {
      try {
        await Quest.create({
          ...questData,
          is_template: true,
          is_active: true
        });
        created++;
      } catch (error) {
        console.log(`⚠️  Quête "${questData.title}" ignorée (existe déjà)`);
      }
    }
    
    const finalCount = await Quest.count();
    console.log(`🎉 ${created} quêtes BONUS créées !`);
    console.log(`📊 Total final en base: ${finalCount}`);
    
    if (finalCount >= 200) {
      console.log('\n🎯🎯🎯 OBJECTIF 200 QUÊTES ATTEINT ! 🎯🎯🎯');
      console.log('🏆 FÉLICITATIONS ! Vous avez maintenant une base de données');
      console.log('🏆 avec plus de 200 quêtes variées et engageantes !');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des quêtes BONUS:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécution du script
if (require.main === module) {
  createBonusQuests();
}

module.exports = { createBonusQuests, bonusQuests };
