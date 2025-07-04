const Quest = require('../models/Quest');
const sequelize = require('../config/db');

// Définition des catégories de quêtes sportives
const fitnessQuests = [
  // QUÊTES FACILES (10-30 XP)
  {
    title: "Premier Pas",
    description: "Marchez 1000 pas aujourd'hui pour débuter votre journey fitness",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 10,
    duration_minutes: 10,
    min_level: 1,
    requirements: { steps: 1000 }
  },
  {
    title: "Réveil Matinal",
    description: "Faites 5 pompes au réveil pour énergiser votre journée",
    type: "daily",
    category: "fitness", 
    difficulty: "easy",
    xp_reward: 15,
    duration_minutes: 5,
    min_level: 1,
    requirements: { pushups: 5 }
  },
  {
    title: "Étirement Quotidien",
    description: "Prenez 5 minutes pour vous étirer et améliorer votre flexibilité",
    type: "daily",
    category: "health",
    difficulty: "easy", 
    xp_reward: 12,
    duration_minutes: 5,
    min_level: 1,
    requirements: { stretching_minutes: 5 }
  },
  {
    title: "Hydratation Hero",
    description: "Buvez 8 verres d'eau aujourd'hui pour rester hydraté",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 10,
    duration_minutes: 0,
    min_level: 1,
    requirements: { water_glasses: 8 }
  },
  {
    title: "Montée d'Escaliers",
    description: "Montez 3 étages par les escaliers au lieu de prendre l'ascenseur",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 15,
    duration_minutes: 5,
    min_level: 1,
    requirements: { stairs_floors: 3 }
  },
  {
    title: "Plank Débutant", 
    description: "Tenez une planche pendant 30 secondes",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 20,
    duration_minutes: 5,
    min_level: 1,
    requirements: { plank_seconds: 30 }
  },
  {
    title: "Marche Découverte",
    description: "Marchez 15 minutes en extérieur pour découvrir votre quartier",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 18,
    duration_minutes: 15,
    min_level: 1,
    requirements: { walk_minutes: 15 }
  },
  {
    title: "Squats Morning",
    description: "Faites 10 squats pour réveiller vos jambes",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 16,
    duration_minutes: 5,
    min_level: 1,
    requirements: { squats: 10 }
  },
  {
    title: "Respiration Zen",
    description: "Pratiquez 5 minutes d'exercices de respiration profonde",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 14,
    duration_minutes: 5,
    min_level: 1,
    requirements: { breathing_minutes: 5 }
  },
  {
    title: "Posture Perfect",
    description: "Maintenez une bonne posture pendant 1 heure de travail",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 12,
    duration_minutes: 60,
    min_level: 1,
    requirements: { posture_hours: 1 }
  },

  // QUÊTES MOYENNES (40-80 XP)
  {
    title: "Explorateur Urbain",
    description: "Marchez 5000 pas en explorant de nouveaux endroits",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 40,
    duration_minutes: 45,
    min_level: 3,
    requirements: { steps: 5000 }
  },
  {
    title: "Circuit Training",
    description: "Complétez un circuit de 20 pompes, 20 squats, 20 jumping jacks",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 15,
    min_level: 5,
    requirements: { pushups: 20, squats: 20, jumping_jacks: 20 }
  },
  {
    title: "Cardio Blast",
    description: "Faites 30 minutes d'activité cardio (course, vélo, natation)",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 30,
    min_level: 4,
    requirements: { cardio_minutes: 30 }
  },
  {
    title: "Plank Master",
    description: "Tenez une planche pendant 2 minutes consécutives",
    type: "daily",
    category: "fitness", 
    difficulty: "medium",
    xp_reward: 45,
    duration_minutes: 10,
    min_level: 6,
    requirements: { plank_seconds: 120 }
  },
  {
    title: "Yoga Flow",
    description: "Pratiquez 20 minutes de yoga pour améliorer flexibilité et force",
    type: "daily",
    category: "health",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 20,
    min_level: 3,
    requirements: { yoga_minutes: 20 }
  },
  {
    title: "Force Progression",
    description: "Faites 3 séries de 15 pompes avec 1 minute de repos",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 48,
    duration_minutes: 10,
    min_level: 7,
    requirements: { pushup_sets: 3, pushups_per_set: 15 }
  },
  {
    title: "Endurance Runner",
    description: "Courez 3 km sans s'arrêter",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 65,
    duration_minutes: 25,
    min_level: 8,
    requirements: { run_km: 3 }
  },
  {
    title: "Strength Builder", 
    description: "Faites 50 squats répartis dans la journée",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 42,
    duration_minutes: 15,
    min_level: 5,
    requirements: { squats: 50 }
  },
  {
    title: "Active Recovery",
    description: "Marchez 30 minutes à rythme modéré pour récupérer activement",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 38,
    duration_minutes: 30,
    min_level: 3,
    requirements: { walk_minutes: 30 }
  },
  {
    title: "Mobility Master",
    description: "Consacrez 15 minutes aux étirements et à la mobilité articulaire",
    type: "daily",
    category: "health",
    difficulty: "medium",
    xp_reward: 35,
    duration_minutes: 15,
    min_level: 2,
    requirements: { mobility_minutes: 15 }
  },

  // QUÊTES DIFFICILES (90-150 XP)
  {
    title: "Iron Warrior",
    description: "Complétez 100 pompes dans la journée (réparties en séries)",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 100,
    duration_minutes: 30,
    min_level: 10,
    requirements: { pushups: 100 }
  },
  {
    title: "Distance Champion",
    description: "Marchez ou courez 10 km aujourd'hui",
    type: "daily", 
    category: "fitness",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 60,
    min_level: 12,
    requirements: { distance_km: 10 }
  },
  {
    title: "HIIT Destroyer",
    description: "Complétez 45 minutes d'entraînement HIIT intense",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 140,
    duration_minutes: 45,
    min_level: 15,
    requirements: { hiit_minutes: 45 }
  },
  {
    title: "Plank Titan",
    description: "Tenez une planche pendant 5 minutes (avec pauses autorisées)",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 110,
    duration_minutes: 15,
    min_level: 12,
    requirements: { plank_total_seconds: 300 }
  },
  {
    title: "Squat Challenge",
    description: "Faites 200 squats répartis dans la journée",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 95,
    duration_minutes: 25,
    min_level: 10,
    requirements: { squats: 200 }
  },
  {
    title: "Cardio Endurance",
    description: "Maintenez une activité cardio pendant 60 minutes",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 130,
    duration_minutes: 60,
    min_level: 14,
    requirements: { cardio_minutes: 60 }
  },
  {
    title: "Mountain Climber",
    description: "Faites 500 mountain climbers (250 par jambe)",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 105,
    duration_minutes: 20,
    min_level: 11,
    requirements: { mountain_climbers: 500 }
  },
  {
    title: "Strength Circuit Pro",
    description: "Circuit: 50 pompes, 75 squats, 100 jumping jacks, planche 3min",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 125,
    duration_minutes: 35,
    min_level: 13,
    requirements: { pushups: 50, squats: 75, jumping_jacks: 100, plank_seconds: 180 }
  },
  {
    title: "Runner's High",
    description: "Courez 8 km sans pause",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 135,
    duration_minutes: 50,
    min_level: 16,
    requirements: { run_km: 8 }
  },
  {
    title: "Burpee Beast",
    description: "Faites 75 burpees répartis dans la journée",
    type: "daily",
    category: "fitness", 
    difficulty: "hard",
    xp_reward: 115,
    duration_minutes: 25,
    min_level: 12,
    requirements: { burpees: 75 }
  },

  // QUÊTES ÉPIQUES (200+ XP)
  {
    title: "Spartan Warrior",
    description: "Défi ultime: 200 pompes, 300 squats, 10 km course",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 300,
    duration_minutes: 120,
    min_level: 20,
    requirements: { pushups: 200, squats: 300, run_km: 10 }
  },
  {
    title: "Iron Man Challenge",
    description: "Nagez 1km, pédalez 20km, courez 5km dans la même journée",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 400,
    duration_minutes: 180,
    min_level: 25,
    requirements: { swim_km: 1, bike_km: 20, run_km: 5 }
  },
  {
    title: "Centurion",
    description: "Faites 100 pompes, 100 squats, 100 burpees, 100 jumping jacks",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 250,
    duration_minutes: 90,
    min_level: 18,
    requirements: { pushups: 100, squats: 100, burpees: 100, jumping_jacks: 100 }
  },
  {
    title: "Marathon Prep",
    description: "Courez 15 km d'affilée pour préparer votre marathon",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 350,
    duration_minutes: 90,
    min_level: 22,
    requirements: { run_km: 15 }
  },
  {
    title: "Plank Legend",
    description: "Tenez une planche pendant 10 minutes cumulées dans la journée",
    type: "special",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 200,
    duration_minutes: 30,
    min_level: 20,
    requirements: { plank_total_seconds: 600 }
  }
];

// Quêtes hebdomadaires
const weeklyQuests = [
  {
    title: "Explorateur de la Semaine",
    description: "Marchez au moins 35 000 pas cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 60,
    duration_minutes: 300,
    min_level: 1,
    requirements: { weekly_steps: 35000 }
  },
  {
    title: "Consistance Champion",
    description: "Faites au moins 30 minutes d'exercice 5 jours cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 100,
    duration_minutes: 150,
    min_level: 5,
    requirements: { workout_days: 5, min_minutes_per_day: 30 }
  },
  {
    title: "Cardio Master",
    description: "Accumulez 3 heures de cardio cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 120,
    duration_minutes: 180,
    min_level: 8,
    requirements: { weekly_cardio_minutes: 180 }
  },
  {
    title: "Strength Week",
    description: "Faites 500 pompes et 750 squats cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 180,
    duration_minutes: 120,
    min_level: 12,
    requirements: { weekly_pushups: 500, weekly_squats: 750 }
  },
  {
    title: "Distance Runner",
    description: "Courez un total de 25 km cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 200,
    duration_minutes: 150,
    min_level: 15,
    requirements: { weekly_run_km: 25 }
  },
  {
    title: "Wellness Warrior",
    description: "Méditez 10 min/jour et dormez 8h/nuit toute la semaine",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 140,
    duration_minutes: 70,
    min_level: 3,
    requirements: { daily_meditation: 10, daily_sleep: 8, consistency_days: 7 }
  },
  {
    title: "Cross Training",
    description: "Pratiquez 4 activités différentes cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 110,
    duration_minutes: 200,
    min_level: 6,
    requirements: { different_activities: 4 }
  },
  {
    title: "Early Bird",
    description: "Faites de l'exercice avant 8h du matin 5 jours cette semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 90,
    duration_minutes: 150,
    min_level: 4,
    requirements: { morning_workouts: 5 }
  }
];

// Quêtes mensuelles  
const monthlyQuests = [
  {
    title: "Transformation Month",
    description: "Complétez 20 jours d'entraînement ce mois-ci",
    type: "monthly",
    category: "fitness", 
    difficulty: "medium",
    xp_reward: 300,
    duration_minutes: 600,
    min_level: 5,
    requirements: { monthly_workout_days: 20 }
  },
  {
    title: "Distance Legend",
    description: "Parcourez 150 km en marche/course ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 500,
    duration_minutes: 900,
    min_level: 10,
    requirements: { monthly_distance_km: 150 }
  },
  {
    title: "Strength Evolution",
    description: "Augmentez vos records de pompes et squats de 25% ce mois-ci",
    type: "monthly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 400,
    duration_minutes: 480,
    min_level: 8,
    requirements: { pushup_improvement: 25, squat_improvement: 25 }
  },
  {
    title: "Wellness Master",
    description: "Méditez, faites du sport et dormez bien 25 jours ce mois-ci",
    type: "monthly",
    category: "health",
    difficulty: "epic",
    xp_reward: 600,
    duration_minutes: 750,
    min_level: 12,
    requirements: { wellness_days: 25 }
  }
];

// Achievements spéciaux
const achievements = [
  {
    title: "First Steps",
    description: "Complétez votre première quête fitness",
    type: "achievement",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 25,
    duration_minutes: 0,
    min_level: 1,
    requirements: { first_quest: true }
  },
  {
    title: "Week Warrior",
    description: "Complétez 7 jours consécutifs d'exercice",
    type: "achievement",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 100,
    duration_minutes: 0,
    min_level: 1,
    requirements: { consecutive_days: 7 }
  },
  {
    title: "Month Master",
    description: "Maintenez une routine d'exercice pendant 30 jours",
    type: "achievement",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 300,
    duration_minutes: 0,
    min_level: 1,
    requirements: { consecutive_days: 30 }
  },
  {
    title: "Push-up Pro",
    description: "Faites 1000 pompes au total",
    type: "achievement",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 150,
    duration_minutes: 0,
    min_level: 1,
    requirements: { total_pushups: 1000 }
  },
  {
    title: "Squat Sensation",
    description: "Faites 2000 squats au total",
    type: "achievement",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 180,
    duration_minutes: 0,
    min_level: 1,
    requirements: { total_squats: 2000 }
  },
  {
    title: "Distance Destroyer",
    description: "Parcourez 100 km au total",
    type: "achievement",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 250,
    duration_minutes: 0,
    min_level: 1,
    requirements: { total_distance_km: 100 }
  },
  {
    title: "Marathon Hero",
    description: "Parcourez 500 km au total",
    type: "achievement",
    category: "fitness",
    difficulty: "epic",
    xp_reward: 500,
    duration_minutes: 0,
    min_level: 1,
    requirements: { total_distance_km: 500 }
  },
  {
    title: "Cardio King",
    description: "Accumulez 50 heures de cardio",
    type: "achievement",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 400,
    duration_minutes: 0,
    min_level: 1,
    requirements: { total_cardio_hours: 50 }
  },
  {
    title: "Plank Master",
    description: "Tenez une planche 60 minutes au total",
    type: "achievement",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 200,
    duration_minutes: 0,
    min_level: 1,
    requirements: { total_plank_minutes: 60 }
  },
  {
    title: "Early Riser",
    description: "Faites de l'exercice avant 7h du matin 50 fois",
    type: "achievement",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 120,
    duration_minutes: 0,
    min_level: 1,
    requirements: { early_workouts: 50 }
  },
  {
    title: "Zen Master",
    description: "Méditez pendant 100 sessions",
    type: "achievement",
    category: "health",
    difficulty: "medium",
    xp_reward: 200,
    duration_minutes: 0,
    min_level: 1,
    requirements: { meditation_sessions: 100 }
  },
  {
    title: "Hydration Hero",
    description: "Buvez 8 verres d'eau pendant 30 jours",
    type: "achievement",
    category: "health",
    difficulty: "easy",
    xp_reward: 80,
    duration_minutes: 0,
    min_level: 1,
    requirements: { hydration_days: 30 }
  }
];

// Quêtes spécialisées par sport
const specializedQuests = [
  // Course à pied
  {
    title: "Sprint Starter",
    description: "Faites 5 sprints de 30 secondes avec 1 minute de repos",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 45,
    duration_minutes: 15,
    min_level: 6,
    requirements: { sprints: 5, sprint_duration: 30 }
  },
  {
    title: "Interval Training",
    description: "Alternez 1 min course rapide / 2 min marche pendant 20 minutes",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 20,
    min_level: 8,
    requirements: { interval_minutes: 20 }
  },
  {
    title: "Hill Climber",
    description: "Courez en montée pendant 15 minutes",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 75,
    duration_minutes: 15,
    min_level: 10,
    requirements: { hill_run_minutes: 15 }
  },

  // Natation
  {
    title: "Pool Beginner",
    description: "Nagez 500 mètres à votre rythme",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 30,
    duration_minutes: 20,
    min_level: 3,
    requirements: { swim_meters: 500 }
  },
  {
    title: "Aqua Athlete",
    description: "Nagez 1000 mètres en variant les nages",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 30,
    min_level: 8,
    requirements: { swim_meters: 1000, different_strokes: 3 }
  },

  // Cyclisme
  {
    title: "Bike Explorer",
    description: "Pédalez 10 km en découvrant de nouveaux itinéraires",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 30,
    min_level: 5,
    requirements: { bike_km: 10 }
  },
  {
    title: "Cycling Champion",
    description: "Parcourez 25 km à vélo",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 90,
    duration_minutes: 60,
    min_level: 12,
    requirements: { bike_km: 25 }
  },

  // Musculation
  {
    title: "Upper Body Blast",
    description: "Séance haut du corps: pompes, tractions, dips",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 25,
    min_level: 7,
    requirements: { pushups: 30, pullups: 10, dips: 15 }
  },
  {
    title: "Leg Day Warrior",
    description: "Séance jambes: squats, fentes, mollets",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 25,
    min_level: 6,
    requirements: { squats: 50, lunges: 30, calf_raises: 50 }
  },

  // Sports d'équipe
  {
    title: "Team Player",
    description: "Jouez 45 minutes d'un sport d'équipe (foot, basket, volley...)",
    type: "daily",
    category: "social",
    difficulty: "medium",
    xp_reward: 65,
    duration_minutes: 45,
    min_level: 4,
    requirements: { team_sport_minutes: 45 }
  },

  // Arts martiaux
  {
    title: "Martial Artist",
    description: "Pratiquez 30 minutes d'arts martiaux ou self-défense",
    type: "daily",
    category: "skill",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 30,
    min_level: 5,
    requirements: { martial_arts_minutes: 30 }
  },

  // Danse
  {
    title: "Dance Fever",
    description: "Dansez pendant 20 minutes pour allier cardio et plaisir",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 35,
    duration_minutes: 20,
    min_level: 2,
    requirements: { dance_minutes: 20 }
  },

  // Escalade
  {
    title: "Rock Climber",
    description: "Pratiquez l'escalade pendant 45 minutes",
    type: "daily",
    category: "skill",
    difficulty: "hard",
    xp_reward: 80,
    duration_minutes: 45,
    min_level: 12,
    requirements: { climbing_minutes: 45 }
  }
];

// Combiner toutes les quêtes
const allQuests = [
  ...fitnessQuests,
  ...weeklyQuests,
  ...monthlyQuests,
  ...achievements,
  ...specializedQuests
];

async function createSportQuests() {
  try {
    console.log('🏃‍♂️ Création des quêtes sportives...');
    
    // Vérifier la connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    // Supprimer les anciennes quêtes (optionnel)
    console.log('🗑️ Suppression des anciennes quêtes...');
    await Quest.destroy({ where: {} });

    // Créer les nouvelles quêtes
    console.log(`📝 Création de ${allQuests.length} nouvelles quêtes sportives...`);
    
    for (let i = 0; i < allQuests.length; i++) {
      const quest = allQuests[i];
      await Quest.create(quest);
      
      // Afficher le progrès
      if ((i + 1) % 10 === 0) {
        console.log(`   ✓ ${i + 1}/${allQuests.length} quêtes créées`);
      }
    }

    console.log(`🎉 ${allQuests.length} quêtes sportives créées avec succès !`);
    console.log('\n📊 Répartition par difficulté:');
    
    const difficulties = ['easy', 'medium', 'hard', 'epic'];
    difficulties.forEach(diff => {
      const count = allQuests.filter(q => q.difficulty === diff).length;
      console.log(`   ${diff.toUpperCase()}: ${count} quêtes`);
    });

    console.log('\n📋 Répartition par type:');
    const types = ['daily', 'weekly', 'monthly', 'special', 'achievement'];
    types.forEach(type => {
      const count = allQuests.filter(q => q.type === type).length;
      console.log(`   ${type.toUpperCase()}: ${count} quêtes`);
    });

    console.log('\n🏆 Répartition par catégorie:');
    const categories = ['fitness', 'health', 'social', 'skill', 'challenge'];
    categories.forEach(cat => {
      const count = allQuests.filter(q => q.category === cat).length;
      console.log(`   ${cat.toUpperCase()}: ${count} quêtes`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des quêtes:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  createSportQuests();
}

module.exports = { createSportQuests, allQuests };
