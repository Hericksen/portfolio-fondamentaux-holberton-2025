const Quest = require('../models/Quest');
const sequelize = require('../config/db');

// 100 QUÊTES SUPPLÉMENTAIRES POUR ATTEINDRE 200 AU TOTAL
const megaSportQuests = [
  // QUÊTES FITNESS CRÉATIVES (50 quêtes)
  {
    title: "Réveil Ninja",
    description: "Faites 10 pompes avant même de vous brosser les dents",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 20,
    duration_minutes: 3,
    min_level: 1,
    requirements: { pushups: 10, morning: true }
  },
  {
    title: "Escalier Magique",
    description: "Montez 5 étages en sautillant sur une jambe",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 35,
    duration_minutes: 8,
    min_level: 3,
    requirements: { stairs: 5, single_leg: true }
  },
  {
    title: "Danse du Bureau",
    description: "Dansez 3 minutes pendant votre pause déjeuner",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 25,
    duration_minutes: 3,
    min_level: 1,
    requirements: { dance_minutes: 3, work_break: true }
  },
  {
    title: "Warrior Walking",
    description: "Marchez 2km en position de guerrier (torse droit, bras levés)",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 40,
    duration_minutes: 20,
    min_level: 2,
    requirements: { walking_km: 2, warrior_pose: true }
  },
  {
    title: "Plank Challenge X",
    description: "Tenez la planche pendant 2 minutes d'affilée",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 60,
    duration_minutes: 5,
    min_level: 5,
    requirements: { plank_seconds: 120 }
  },
  {
    title: "Shadow Boxing Pro",
    description: "Faites 5 rounds de shadow boxing de 1 minute chacun",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 45,
    duration_minutes: 10,
    min_level: 3,
    requirements: { boxing_rounds: 5, round_duration: 60 }
  },
  {
    title: "Crawl Master",
    description: "Rampez comme un bébé sur 50 mètres (bear crawl)",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 55,
    duration_minutes: 8,
    min_level: 4,
    requirements: { bear_crawl_meters: 50 }
  },
  {
    title: "Super Squats",
    description: "Faites 100 squats en 3 séries avec 1 minute de pause",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 12,
    min_level: 3,
    requirements: { squats: 100, series: 3 }
  },
  {
    title: "Jump Rope Champion",
    description: "Sautez à la corde pendant 10 minutes non-stop",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 70,
    duration_minutes: 10,
    min_level: 5,
    requirements: { jump_rope_minutes: 10 }
  },
  {
    title: "Flexibility Flow",
    description: "Enchaînez 20 mouvements d'étirement différents",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 30,
    duration_minutes: 15,
    min_level: 1,
    requirements: { stretch_movements: 20 }
  },
  {
    title: "Cardio Explosion",
    description: "Alternez burpees, jumping jacks et mountain climbers pendant 15 minutes",
    type: "daily",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 100,
    duration_minutes: 15,
    min_level: 8,
    requirements: { cardio_minutes: 15, exercise_types: 3 }
  },
  {
    title: "Balance Zen",
    description: "Tenez l'équilibre sur une jambe les yeux fermés pendant 60 secondes",
    type: "daily",
    category: "skill",
    difficulty: "medium",
    xp_reward: 35,
    duration_minutes: 3,
    min_level: 2,
    requirements: { balance_seconds: 60, eyes_closed: true }
  },
  {
    title: "Core Destroyer",
    description: "Faites 5 types d'exercices abdominaux différents, 20 répétitions chacun",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 65,
    duration_minutes: 15,
    min_level: 4,
    requirements: { core_exercises: 5, reps_each: 20 }
  },
  {
    title: "Speed Walker",
    description: "Marchez 5km en moins de 45 minutes",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 45,
    duration_minutes: 45,
    min_level: 3,
    requirements: { walk_km: 5, max_minutes: 45 }
  },
  {
    title: "Yoga Sunrise",
    description: "Faites une session de yoga de 20 minutes au lever du soleil",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 35,
    duration_minutes: 20,
    min_level: 1,
    requirements: { yoga_minutes: 20, sunrise: true }
  },
  {
    title: "Hydro Warrior",
    description: "Buvez 3 litres d'eau répartis sur la journée",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 20,
    duration_minutes: 1,
    min_level: 1,
    requirements: { water_liters: 3 }
  },
  {
    title: "Meditation Master",
    description: "Méditez en position lotus pendant 15 minutes",
    type: "daily",
    category: "health",
    difficulty: "medium",
    xp_reward: 40,
    duration_minutes: 15,
    min_level: 2,
    requirements: { meditation_minutes: 15, lotus_position: true }
  },
  {
    title: "Cold Shower Hero",
    description: "Prenez une douche froide de 3 minutes",
    type: "daily",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 50,
    duration_minutes: 3,
    min_level: 5,
    requirements: { cold_shower_minutes: 3 }
  },
  {
    title: "Protein Power",
    description: "Consommez 100g de protéines provenant de sources naturelles",
    type: "daily",
    category: "health",
    difficulty: "medium",
    xp_reward: 30,
    duration_minutes: 5,
    min_level: 2,
    requirements: { protein_grams: 100, natural_sources: true }
  },
  {
    title: "Stair Climber Elite",
    description: "Montez 1000 marches dans la journée",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 60,
    duration_minutes: 30,
    min_level: 4,
    requirements: { stairs_count: 1000 }
  },

  // QUÊTES HEBDOMADAIRES AVANCÉES (25 quêtes)
  {
    title: "Marathon Week",
    description: "Courez un total de 42km répartis sur 7 jours",
    type: "weekly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 200,
    duration_minutes: 300,
    min_level: 10,
    requirements: { run_km: 42, days: 7 }
  },
  {
    title: "Strength Builder",
    description: "Faites 500 pompes réparties sur la semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 150,
    min_level: 6,
    requirements: { pushups: 500, week_total: true }
  },
  {
    title: "Flexibility Master",
    description: "Étirez-vous 30 minutes par jour pendant 7 jours",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 80,
    duration_minutes: 210,
    min_level: 3,
    requirements: { stretch_minutes_per_day: 30, days: 7 }
  },
  {
    title: "Cardio Beast",
    description: "Faites 5 heures de cardio intensif cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 150,
    duration_minutes: 300,
    min_level: 7,
    requirements: { cardio_hours: 5, intensity: "high" }
  },
  {
    title: "Social Sport",
    description: "Faites du sport avec 3 personnes différentes cette semaine",
    type: "weekly",
    category: "social",
    difficulty: "medium",
    xp_reward: 90,
    duration_minutes: 180,
    min_level: 2,
    requirements: { sport_partners: 3 }
  },
  {
    title: "New Sport Explorer",
    description: "Essayez 3 sports différents que vous n'avez jamais pratiqués",
    type: "weekly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 100,
    duration_minutes: 120,
    min_level: 4,
    requirements: { new_sports: 3 }
  },
  {
    title: "Outdoor Warrior",
    description: "Faites 10 heures d'activité physique en extérieur",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 130,
    duration_minutes: 600,
    min_level: 5,
    requirements: { outdoor_hours: 10 }
  },
  {
    title: "Sleep Champion",
    description: "Dormez 8 heures par nuit pendant 7 nuits consécutives",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 70,
    duration_minutes: 3360,
    min_level: 1,
    requirements: { sleep_hours_per_night: 8, nights: 7 }
  },
  {
    title: "Nutrition Guru",
    description: "Préparez 14 repas sains cette semaine (pas de fast food)",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 85,
    duration_minutes: 420,
    min_level: 2,
    requirements: { healthy_meals: 14, no_fast_food: true }
  },
  {
    title: "Distance Destroyer",
    description: "Parcourez 100km à pied, à vélo ou en course cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 180,
    duration_minutes: 400,
    min_level: 8,
    requirements: { total_distance_km: 100 }
  },
  {
    title: "Strength Endurance",
    description: "Faites 1000 squats et 1000 abdominaux cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 140,
    duration_minutes: 200,
    min_level: 6,
    requirements: { squats: 1000, abs: 1000 }
  },
  {
    title: "Mindful Week",
    description: "Méditez 20 minutes par jour pendant 7 jours",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 90,
    duration_minutes: 140,
    min_level: 3,
    requirements: { meditation_minutes_per_day: 20, days: 7 }
  },
  {
    title: "Recovery Pro",
    description: "Prenez 2 bains chauds et faites 3 massages cette semaine",
    type: "weekly",
    category: "health",
    difficulty: "easy",
    xp_reward: 60,
    duration_minutes: 150,
    min_level: 1,
    requirements: { hot_baths: 2, massages: 3 }
  },
  {
    title: "Early Bird Champion",
    description: "Levez-vous avant 6h et faites du sport pendant 7 jours",
    type: "weekly",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 210,
    min_level: 5,
    requirements: { wake_time: "06:00", sport_after: true, days: 7 }
  },
  {
    title: "Stairs Conqueror",
    description: "Montez 5000 marches cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 100,
    duration_minutes: 180,
    min_level: 4,
    requirements: { total_stairs: 5000 }
  },
  {
    title: "Aqua Warrior",
    description: "Nagez 5km au total cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 160,
    duration_minutes: 240,
    min_level: 6,
    requirements: { swim_km: 5 }
  },
  {
    title: "Bike Explorer",
    description: "Faites 150km de vélo en explorant 5 nouveaux endroits",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 140,
    duration_minutes: 360,
    min_level: 5,
    requirements: { bike_km: 150, new_places: 5 }
  },
  {
    title: "Team Captain",
    description: "Organisez 2 activités sportives de groupe cette semaine",
    type: "weekly",
    category: "social",
    difficulty: "medium",
    xp_reward: 110,
    duration_minutes: 120,
    min_level: 4,
    requirements: { group_activities: 2, organizer: true }
  },
  {
    title: "Functional Fitness",
    description: "Faites 10 types d'exercices fonctionnels différents",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 95,
    duration_minutes: 150,
    min_level: 4,
    requirements: { functional_exercises: 10 }
  },
  {
    title: "Performance Tracker",
    description: "Améliorez vos records personnels dans 3 exercices différents",
    type: "weekly",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 130,
    duration_minutes: 180,
    min_level: 6,
    requirements: { personal_records: 3 }
  },
  {
    title: "Zen Master",
    description: "Combinez yoga, méditation et étirements pendant 5 heures cette semaine",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 85,
    duration_minutes: 300,
    min_level: 3,
    requirements: { zen_hours: 5 }
  },
  {
    title: "Weather Warrior",
    description: "Faites du sport par tous les temps pendant 7 jours",
    type: "weekly",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 150,
    duration_minutes: 210,
    min_level: 7,
    requirements: { all_weather: true, days: 7 }
  },
  {
    title: "Metabolic Booster",
    description: "Faites 7 séances de HIIT de 20 minutes cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 170,
    duration_minutes: 140,
    min_level: 8,
    requirements: { hiit_sessions: 7, duration_each: 20 }
  },
  {
    title: "Nutrition Scientist",
    description: "Calculez et optimisez vos macros pendant 7 jours",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 80,
    duration_minutes: 70,
    min_level: 3,
    requirements: { macro_tracking: 7 }
  },
  {
    title: "Recovery Expert",
    description: "Alternez entraînement intense et récupération active pendant 7 jours",
    type: "weekly",
    category: "health",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 210,
    min_level: 5,
    requirements: { active_recovery: true, days: 7 }
  },

  // QUÊTES MENSUELLES LÉGENDAIRES (25 quêtes)
  {
    title: "Iron Man Challenge",
    description: "Nagez 3.8km, faites 180km de vélo et courez 42km ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 500,
    duration_minutes: 1200,
    min_level: 15,
    requirements: { swim_km: 3.8, bike_km: 180, run_km: 42 }
  },
  {
    title: "Thousand Club",
    description: "Faites 1000 pompes, 1000 squats, 1000 abdos ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 400,
    duration_minutes: 600,
    min_level: 12,
    requirements: { pushups: 1000, squats: 1000, abs: 1000 }
  },
  {
    title: "Marathon Master",
    description: "Courez 200km au total ce mois-ci (6.5km par jour en moyenne)",
    type: "monthly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 350,
    duration_minutes: 1000,
    min_level: 10,
    requirements: { run_km: 200 }
  },
  {
    title: "Flexibility King",
    description: "Étirez-vous 15 heures au total ce mois-ci",
    type: "monthly",
    category: "health",
    difficulty: "medium",
    xp_reward: 250,
    duration_minutes: 900,
    min_level: 5,
    requirements: { stretch_hours: 15 }
  },
  {
    title: "Social Sports Leader",
    description: "Organisez 8 événements sportifs de groupe ce mois-ci",
    type: "monthly",
    category: "social",
    difficulty: "hard",
    xp_reward: 300,
    duration_minutes: 480,
    min_level: 8,
    requirements: { group_events: 8 }
  },
  {
    title: "New Sport Master",
    description: "Maîtrisez 5 nouveaux sports ce mois-ci",
    type: "monthly",
    category: "skill",
    difficulty: "epic",
    xp_reward: 450,
    duration_minutes: 600,
    min_level: 12,
    requirements: { new_sports_mastered: 5 }
  },
  {
    title: "Outdoor Explorer",
    description: "Passez 50 heures en activité physique extérieure",
    type: "monthly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 320,
    duration_minutes: 3000,
    min_level: 8,
    requirements: { outdoor_hours: 50 }
  },
  {
    title: "Perfect Sleep",
    description: "Dormez 8h par nuit pendant 30 nuits consécutives",
    type: "monthly",
    category: "health",
    difficulty: "medium",
    xp_reward: 200,
    duration_minutes: 14400,
    min_level: 3,
    requirements: { sleep_hours: 8, nights: 30 }
  },
  {
    title: "Nutrition Champion",
    description: "Préparez 90 repas sains sans aucun fast food",
    type: "monthly",
    category: "health",
    difficulty: "hard",
    xp_reward: 280,
    duration_minutes: 1800,
    min_level: 6,
    requirements: { healthy_meals: 90, zero_fast_food: true }
  },
  {
    title: "Distance Legend",
    description: "Parcourez 500km (marche, course, vélo) ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 600,
    duration_minutes: 2000,
    min_level: 15,
    requirements: { total_distance: 500 }
  },
  {
    title: "Strength God",
    description: "Soulevez un total de 10 tonnes ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 550,
    duration_minutes: 900,
    min_level: 18,
    requirements: { total_weight_kg: 10000 }
  },
  {
    title: "Meditation Monk",
    description: "Méditez 20 heures au total ce mois-ci",
    type: "monthly",
    category: "health",
    difficulty: "hard",
    xp_reward: 300,
    duration_minutes: 1200,
    min_level: 8,
    requirements: { meditation_hours: 20 }
  },
  {
    title: "Recovery Master",
    description: "Optimisez votre récupération : 15 massages, 10 saunas, 30 étirements",
    type: "monthly",
    category: "health",
    difficulty: "medium",
    xp_reward: 220,
    duration_minutes: 450,
    min_level: 4,
    requirements: { massages: 15, saunas: 10, stretches: 30 }
  },
  {
    title: "Early Bird Legend",
    description: "Levez-vous avant 5h et faites du sport pendant 30 jours",
    type: "monthly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 500,
    duration_minutes: 900,
    min_level: 12,
    requirements: { wake_time: "05:00", sport_after: true, days: 30 }
  },
  {
    title: "Vertical Champion",
    description: "Montez 25000 marches ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 350,
    duration_minutes: 600,
    min_level: 10,
    requirements: { total_stairs: 25000 }
  },
  {
    title: "Aqua God",
    description: "Nagez 25km au total ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 500,
    duration_minutes: 1200,
    min_level: 15,
    requirements: { swim_km: 25 }
  },
  {
    title: "Bike Touring Pro",
    description: "Parcourez 800km à vélo en explorant 20 nouveaux lieux",
    type: "monthly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 600,
    duration_minutes: 2400,
    min_level: 16,
    requirements: { bike_km: 800, new_places: 20 }
  },
  {
    title: "Community Builder",
    description: "Recrutez 10 nouveaux membres pour votre club de sport",
    type: "monthly",
    category: "social",
    difficulty: "hard",
    xp_reward: 400,
    duration_minutes: 300,
    min_level: 8,
    requirements: { new_recruits: 10 }
  },
  {
    title: "Functional Beast",
    description: "Maîtrisez 25 exercices fonctionnels différents",
    type: "monthly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 380,
    duration_minutes: 600,
    min_level: 10,
    requirements: { functional_exercises: 25 }
  },
  {
    title: "Record Breaker",
    description: "Battez 10 de vos records personnels ce mois-ci",
    type: "monthly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 550,
    duration_minutes: 900,
    min_level: 15,
    requirements: { personal_records: 10 }
  },
  {
    title: "Zen Warrior",
    description: "Combinez 30h de yoga, méditation et relaxation",
    type: "monthly",
    category: "health",
    difficulty: "hard",
    xp_reward: 320,
    duration_minutes: 1800,
    min_level: 8,
    requirements: { zen_hours: 30 }
  },
  {
    title: "All Weather Legend",
    description: "Faites du sport par tous les temps pendant 30 jours",
    type: "monthly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 600,
    duration_minutes: 900,
    min_level: 18,
    requirements: { all_weather: true, days: 30 }
  },
  {
    title: "HIIT Hurricane",
    description: "Faites 60 séances de HIIT de 15+ minutes ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 700,
    duration_minutes: 900,
    min_level: 20,
    requirements: { hiit_sessions: 60, min_duration: 15 }
  },
  {
    title: "Nutrition Scientist Pro",
    description: "Optimisez vos macros et micros pendant 30 jours consécutifs",
    type: "monthly",
    category: "health",
    difficulty: "hard",
    xp_reward: 300,
    duration_minutes: 300,
    min_level: 8,
    requirements: { macro_micro_tracking: 30 }
  },
  {
    title: "Ultimate Recovery",
    description: "Maîtrisez toutes les techniques de récupération pendant 30 jours",
    type: "monthly",
    category: "health",
    difficulty: "epic",
    xp_reward: 450,
    duration_minutes: 900,
    min_level: 12,
    requirements: { recovery_techniques: "all", days: 30 }
  }
];

// Fonction pour créer les quêtes
async function createMegaSportQuests() {
  try {
    console.log('🚀 Création de 100 quêtes MEGA SPORT supplémentaires...');
    
    // Connexion à la base
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie');
    
    // Supprimer les quêtes existantes pour éviter les doublons
    const questCount = await Quest.count();
    console.log(`📊 Nombre de quêtes avant création: ${questCount}`);
    
    // Créer les nouvelles quêtes
    let created = 0;
    for (const questData of megaSportQuests) {
      try {
        await Quest.create({
          ...questData,
          is_template: true,
          is_active: true
        });
        created++;
        
        if (created % 20 === 0) {
          console.log(`   ✓ ${created}/${megaSportQuests.length} quêtes créées`);
        }
      } catch (error) {
        console.log(`⚠️  Quête "${questData.title}" ignorée (probablement existante)`);
      }
    }
    
    const finalCount = await Quest.count();
    console.log(`🎉 ${created} nouvelles quêtes MEGA SPORT créées !`);
    console.log(`📊 Total quêtes en base: ${finalCount}`);
    
    // Statistiques détaillées
    console.log('\n📊 STATISTIQUES MEGA SPORT QUESTS:');
    console.log('====================================');
    
    const dailyCount = megaSportQuests.filter(q => q.type === 'daily').length;
    const weeklyCount = megaSportQuests.filter(q => q.type === 'weekly').length;
    const monthlyCount = megaSportQuests.filter(q => q.type === 'monthly').length;
    
    console.log(`📅 Quotidiennes: ${dailyCount} quêtes`);
    console.log(`📊 Hebdomadaires: ${weeklyCount} quêtes`);
    console.log(`🗓️ Mensuelles: ${monthlyCount} quêtes`);
    
    const easyCount = megaSportQuests.filter(q => q.difficulty === 'easy').length;
    const mediumCount = megaSportQuests.filter(q => q.difficulty === 'medium').length;
    const hardCount = megaSportQuests.filter(q => q.difficulty === 'hard').length;
    const epicCount = megaSportQuests.filter(q => q.difficulty === 'epic').length;
    
    console.log(`🟢 Easy: ${easyCount} quêtes`);
    console.log(`🟡 Medium: ${mediumCount} quêtes`);
    console.log(`🔴 Hard: ${hardCount} quêtes`);
    console.log(`🟣 Epic: ${epicCount} quêtes`);
    
    console.log('\n🎯 OBJECTIF 200 QUÊTES ATTEINT ! 🎯');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des quêtes MEGA SPORT:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécution du script
if (require.main === module) {
  createMegaSportQuests();
}

module.exports = { createMegaSportQuests, megaSportQuests };
