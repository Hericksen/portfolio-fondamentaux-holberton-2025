const Quest = require('../models/Quest');
const sequelize = require('../config/db');

// NOUVELLE COLLECTION DE PLUS DE 100 QUÊTES SPORTIVES VARIÉES
const extendedSportQuests = [
  // ========== QUÊTES FACILES (10-30 XP) - DÉBUTANTS ==========
  
  // FITNESS DÉBUTANT
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
    title: "Jumping Start",
    description: "Faites 20 jumping jacks pour activer votre cardio",
    type: "daily",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 18,
    duration_minutes: 3,
    min_level: 1,
    requirements: { jumping_jacks: 20 }
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
    title: "Flexibilité Focus",
    description: "Touchez vos orteils 10 fois pour améliorer votre souplesse",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 14,
    duration_minutes: 5,
    min_level: 1,
    requirements: { toe_touches: 10 }
  },
  {
    title: "Équilibre Zen",
    description: "Tenez-vous sur un pied pendant 30 secondes",
    type: "daily",
    category: "skill",
    difficulty: "easy",
    xp_reward: 12,
    duration_minutes: 2,
    min_level: 1,
    requirements: { balance_seconds: 30 }
  },

  // SANTÉ & BIEN-ÊTRE FACILE
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
  {
    title: "Pause Active",
    description: "Prenez 3 pauses de 2 minutes pour bouger durant votre journée",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 15,
    duration_minutes: 6,
    min_level: 1,
    requirements: { active_breaks: 3 }
  },
  {
    title: "Sommeil Réparateur",
    description: "Dormez 7-8 heures pour une récupération optimale",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 20,
    duration_minutes: 480,
    min_level: 1,
    requirements: { sleep_hours: 7 }
  },

  // ========== QUÊTES MOYENNES (40-80 XP) - INTERMÉDIAIRE ==========
  
  // FITNESS INTERMÉDIAIRE
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
    title: "Force Core",
    description: "Tenez une planche pendant 2 minutes consécutives",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 45,
    duration_minutes: 10,
    min_level: 8,
    requirements: { plank_seconds: 120 }
  },
  {
    title: "Sprint Intervalle",
    description: "Alternez 30s de sprint et 30s de marche, 10 fois",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 65,
    duration_minutes: 20,
    min_level: 6,
    requirements: { sprint_intervals: 10 }
  },
  {
    title: "Yoga Flow",
    description: "Pratiquez 20 minutes de yoga pour la flexibilité et la force",
    type: "daily",
    category: "health",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 20,
    min_level: 5,
    requirements: { yoga_minutes: 20 }
  },
  {
    title: "Burpees Challenge",
    description: "Faites 25 burpees pour un entraînement complet du corps",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 10,
    min_level: 7,
    requirements: { burpees: 25 }
  },
  {
    title: "Escalade Virtuelle",
    description: "Montez l'équivalent de 10 étages (marches ou escaliers)",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 42,
    duration_minutes: 15,
    min_level: 4,
    requirements: { stairs_floors: 10 }
  },
  {
    title: "Danse Cardio",
    description: "Dansez pendant 25 minutes pour combiner plaisir et fitness",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 48,
    duration_minutes: 25,
    min_level: 3,
    requirements: { dance_minutes: 25 }
  },
  {
    title: "Mountain Climbers",
    description: "Faites 100 mountain climbers pour travailler tout le corps",
    type: "daily",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 52,
    duration_minutes: 8,
    min_level: 6,
    requirements: { mountain_climbers: 100 }
  },

  // DÉFIS INTERMÉDIAIRES
  {
    title: "Guerrier Aquatique",
    description: "Nagez pendant 30 minutes ou faites de l'aqua-fitness",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 70,
    duration_minutes: 30,
    min_level: 5,
    requirements: { swimming_minutes: 30 }
  },
  {
    title: "Randonneur du Weekend",
    description: "Faites une randonnée de 2 heures en nature",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 75,
    duration_minutes: 120,
    min_level: 4,
    requirements: { hiking_minutes: 120 }
  },
  {
    title: "Cycliste Urbain",
    description: "Pédalez 15 km en ville ou à la campagne",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 65,
    duration_minutes: 45,
    min_level: 5,
    requirements: { cycling_km: 15 }
  },

  // ========== QUÊTES DIFFICILES (90-150 XP) - AVANCÉ ==========
  
  // FITNESS AVANCÉ
  {
    title: "Marathon Walker",
    description: "Marchez 15000 pas dans la journée",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 90,
    duration_minutes: 120,
    min_level: 10,
    requirements: { steps: 15000 }
  },
  {
    title: "Beast Mode",
    description: "Complétez 50 pompes, 50 squats, 50 sit-ups et 2 min de planche",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 30,
    min_level: 12,
    requirements: { pushups: 50, squats: 50, situps: 50, plank_seconds: 120 }
  },
  {
    title: "Cardio Warrior",
    description: "Maintenez une activité cardio intense pendant 45 minutes",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 100,
    duration_minutes: 45,
    min_level: 10,
    requirements: { intense_cardio_minutes: 45 }
  },
  {
    title: "Iron Plank",
    description: "Tenez une planche pendant 5 minutes au total (avec pauses)",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 110,
    duration_minutes: 15,
    min_level: 15,
    requirements: { total_plank_seconds: 300 }
  },
  {
    title: "HIIT Master",
    description: "Complétez 8 rounds de HIIT (30s effort max, 30s repos)",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 95,
    duration_minutes: 20,
    min_level: 12,
    requirements: { hiit_rounds: 8 }
  },
  {
    title: "Crossfit Hero",
    description: "Faites 100 burpees répartis sur la journée",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 130,
    duration_minutes: 40,
    min_level: 15,
    requirements: { burpees: 100 }
  },
  {
    title: "Endurance Runner",
    description: "Courez pendant 1 heure sans s'arrêter",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 140,
    duration_minutes: 60,
    min_level: 12,
    requirements: { running_minutes: 60 }
  },
  {
    title: "Multi-Sport Athlete",
    description: "Pratiquez 3 sports différents dans la semaine",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 125,
    duration_minutes: 180,
    min_level: 10,
    requirements: { different_sports: 3 }
  },

  // DÉFIS AVANCÉS
  {
    title: "Spartiate",
    description: "Complétez 500 squats répartis sur la journée",
    type: "daily",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 115,
    duration_minutes: 60,
    min_level: 18,
    requirements: { squats: 500 }
  },
  {
    title: "Alpiniste Digital",
    description: "Montez l'équivalent de 50 étages en une journée",
    type: "daily",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 105,
    duration_minutes: 90,
    min_level: 14,
    requirements: { stairs_floors: 50 }
  },

  // ========== QUÊTES ÉPIQUES (200+ XP) - EXPERT ==========
  
  {
    title: "Légende Urbaine",
    description: "Marchez 25000 pas en une seule journée",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 200,
    duration_minutes: 300,
    min_level: 20,
    requirements: { steps: 25000 }
  },
  {
    title: "Titan du Fitness",
    description: "Complétez 1000 répétitions d'exercices variés en une journée",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 250,
    duration_minutes: 180,
    min_level: 25,
    requirements: { total_reps: 1000 }
  },
  {
    title: "Marathon Man",
    description: "Courez ou marchez 42 km dans la semaine",
    type: "weekly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 300,
    duration_minutes: 300,
    min_level: 20,
    requirements: { weekly_km: 42 }
  },
  {
    title: "Iron Warrior",
    description: "Tenez une planche pendant 10 minutes cumulées en une journée",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 220,
    duration_minutes: 30,
    min_level: 25,
    requirements: { cumulative_plank_seconds: 600 }
  },
  {
    title: "Centurion",
    description: "Faites 100 pompes parfaites en une session",
    type: "achievement",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 280,
    duration_minutes: 45,
    min_level: 30,
    requirements: { consecutive_pushups: 100 }
  },

  // ========== QUÊTES SOCIALES ==========
  
  {
    title: "Buddy System",
    description: "Faites du sport avec un ami pendant 30 minutes",
    type: "weekly",
    category: "social",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 30,
    min_level: 5,
    requirements: { workout_with_friend: 1 }
  },
  {
    title: "Coach Motivateur",
    description: "Aidez quelqu'un à faire de l'exercice aujourd'hui",
    type: "daily",
    category: "social",
    difficulty: "easy",
    xp_reward: 25,
    duration_minutes: 20,
    min_level: 3,
    requirements: { help_someone_exercise: 1 }
  },
  {
    title: "Team Challenge",
    description: "Participez à un défi sportif en équipe",
    type: "special",
    category: "social",
    difficulty: "medium",
    xp_reward: 80,
    duration_minutes: 60,
    min_level: 8,
    requirements: { team_challenge: 1 }
  },
  {
    title: "Fitness Influencer",
    description: "Partagez votre entraînement sur les réseaux sociaux",
    type: "weekly",
    category: "social",
    difficulty: "easy",
    xp_reward: 30,
    duration_minutes: 10,
    min_level: 5,
    requirements: { share_workout: 1 }
  },
  {
    title: "Groupe Actif",
    description: "Organisez une activité sportive avec 3+ personnes",
    type: "monthly",
    category: "social",
    difficulty: "hard",
    xp_reward: 150,
    duration_minutes: 120,
    min_level: 15,
    requirements: { organize_group_activity: 1 }
  },

  // ========== QUÊTES DE COMPÉTENCES ==========
  
  {
    title: "Équilibriste",
    description: "Tenez-vous sur un pied pendant 2 minutes",
    type: "daily",
    category: "skill",
    difficulty: "medium",
    xp_reward: 40,
    duration_minutes: 5,
    min_level: 8,
    requirements: { balance_seconds: 120 }
  },
  {
    title: "Jongleur Débutant",
    description: "Apprenez à jongler avec 2 balles pendant 30 secondes",
    type: "weekly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 30,
    min_level: 5,
    requirements: { juggling_seconds: 30 }
  },
  {
    title: "Maître de la Coordination",
    description: "Faites 50 jumping jacks en coordination parfaite",
    type: "daily",
    category: "skill",
    difficulty: "easy",
    xp_reward: 22,
    duration_minutes: 5,
    min_level: 3,
    requirements: { coordinated_jumping_jacks: 50 }
  },
  {
    title: "Artiste Martial",
    description: "Pratiquez 20 minutes d'arts martiaux ou de self-défense",
    type: "weekly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 65,
    duration_minutes: 20,
    min_level: 8,
    requirements: { martial_arts_minutes: 20 }
  },
  {
    title: "Ninja de l'Agilité",
    description: "Complétez un parcours d'agilité en moins de 2 minutes",
    type: "weekly",
    category: "skill",
    difficulty: "hard",
    xp_reward: 85,
    duration_minutes: 15,
    min_level: 12,
    requirements: { agility_course_time: 120 }
  },

  // ========== QUÊTES SAISONNIÈRES & SPÉCIALES ==========
  
  {
    title: "Guerrier de l'Hiver",
    description: "Faites du sport en extérieur par temps froid",
    type: "special",
    category: "challenge",
    difficulty: "medium",
    xp_reward: 70,
    duration_minutes: 30,
    min_level: 10,
    requirements: { cold_weather_exercise: 1 }
  },
  {
    title: "Soldat de l'Été",
    description: "Faites 1 heure d'exercice sous la chaleur estivale",
    type: "special",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 90,
    duration_minutes: 60,
    min_level: 12,
    requirements: { hot_weather_exercise: 1 }
  },
  {
    title: "Champion du Nouvel An",
    description: "Commencez l'année avec 2 heures d'activité physique",
    type: "special",
    category: "challenge",
    difficulty: "medium",
    xp_reward: 100,
    duration_minutes: 120,
    min_level: 5,
    requirements: { new_year_exercise_hours: 2 }
  },
  {
    title: "Résolution Fitness",
    description: "Maintenez une routine d'exercice pendant 30 jours consécutifs",
    type: "monthly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 500,
    duration_minutes: 900,
    min_level: 15,
    requirements: { consecutive_exercise_days: 30 }
  },

  // ========== QUÊTES CRÉATIVES & VARIÉES ==========
  
  {
    title: "Explorateur Nature",
    description: "Faites une promenade de 45 min dans un parc ou en forêt",
    type: "weekly",
    category: "health",
    difficulty: "easy",
    xp_reward: 35,
    duration_minutes: 45,
    min_level: 3,
    requirements: { nature_walk_minutes: 45 }
  },
  {
    title: "Photographe Sportif",
    description: "Prenez 10 photos pendant votre séance d'exercice",
    type: "weekly",
    category: "social",
    difficulty: "easy",
    xp_reward: 25,
    duration_minutes: 30,
    min_level: 5,
    requirements: { exercise_photos: 10 }
  },
  {
    title: "Danseur de Salon",
    description: "Apprenez et pratiquez une nouvelle danse pendant 1 heure",
    type: "monthly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 75,
    duration_minutes: 60,
    min_level: 8,
    requirements: { learn_new_dance: 1 }
  },
  {
    title: "Acrobate Amateur",
    description: "Apprenez à faire une roulade ou un équilibre sur les mains",
    type: "monthly",
    category: "skill",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 180,
    min_level: 15,
    requirements: { learn_acrobatic_move: 1 }
  },
  {
    title: "Maître du Souffle",
    description: "Pratiquez 30 minutes de techniques de respiration avancées",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 30,
    min_level: 8,
    requirements: { advanced_breathing_minutes: 30 }
  },

  // ========== QUÊTES DE RÉCUPÉRATION ==========
  
  {
    title: "Zen Master",
    description: "Pratiquez 20 minutes de méditation après l'exercice",
    type: "weekly",
    category: "health",
    difficulty: "easy",
    xp_reward: 30,
    duration_minutes: 20,
    min_level: 5,
    requirements: { post_exercise_meditation: 20 }
  },
  {
    title: "Récupération Active",
    description: "Faites 30 minutes de yoga doux ou d'étirements",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 25,
    duration_minutes: 30,
    min_level: 3,
    requirements: { gentle_yoga_minutes: 30 }
  },
  {
    title: "Spa Maison",
    description: "Prenez un bain chaud avec sels après votre entraînement",
    type: "weekly",
    category: "health",
    difficulty: "easy",
    xp_reward: 20,
    duration_minutes: 30,
    min_level: 5,
    requirements: { recovery_bath: 1 }
  },
  {
    title: "Massage Thérapie",
    description: "Faites-vous masser ou utilisez un rouleau de massage",
    type: "weekly",
    category: "health",
    difficulty: "easy",
    xp_reward: 35,
    duration_minutes: 20,
    min_level: 8,
    requirements: { massage_therapy: 1 }
  },

  // ========== QUÊTES NUTRITIONNELLES ==========
  
  {
    title: "Fuel du Champion",
    description: "Mangez un repas équilibré dans les 2h après l'exercice",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 18,
    duration_minutes: 30,
    min_level: 3,
    requirements: { post_workout_meal: 1 }
  },
  {
    title: "Smoothie Power",
    description: "Préparez et buvez un smoothie protéiné maison",
    type: "daily",
    category: "health",
    difficulty: "easy",
    xp_reward: 15,
    duration_minutes: 10,
    min_level: 5,
    requirements: { protein_smoothie: 1 }
  },
  {
    title: "Détox Naturelle",
    description: "Buvez 2L d'eau et mangez 5 fruits/légumes aujourd'hui",
    type: "daily",
    category: "health",
    difficulty: "medium",
    xp_reward: 40,
    duration_minutes: 0,
    min_level: 5,
    requirements: { water_liters: 2, fruits_vegetables: 5 }
  },
  {
    title: "Chef Healthy",
    description: "Cuisinez un repas sain et équilibré de A à Z",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 45,
    duration_minutes: 45,
    min_level: 8,
    requirements: { cook_healthy_meal: 1 }
  },

  // ========== QUÊTES TECHNOLOGIQUES ==========
  
  {
    title: "Tracker Master",
    description: "Utilisez une app fitness pour suivre votre entraînement",
    type: "daily",
    category: "skill",
    difficulty: "easy",
    xp_reward: 12,
    duration_minutes: 5,
    min_level: 3,
    requirements: { use_fitness_app: 1 }
  },
  {
    title: "VR Athlete",
    description: "Faites 30 minutes d'exercice en réalité virtuelle",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 30,
    min_level: 10,
    requirements: { vr_exercise_minutes: 30 }
  },
  {
    title: "Influenceur Fitness",
    description: "Créez et partagez une vidéo de votre entraînement",
    type: "monthly",
    category: "social",
    difficulty: "medium",
    xp_reward: 70,
    duration_minutes: 60,
    min_level: 12,
    requirements: { create_workout_video: 1 }
  },

  // ========== QUÊTES D'ACHIEVEMENTS ==========
  
  {
    title: "Première Victoire",
    description: "Complétez votre première quête fitness",
    type: "achievement",
    category: "challenge",
    difficulty: "easy",
    xp_reward: 50,
    duration_minutes: 0,
    min_level: 1,
    requirements: { first_quest_completed: 1 }
  },
  {
    title: "Série de 7",
    description: "Complétez une quête fitness 7 jours consécutifs",
    type: "achievement",
    category: "challenge",
    difficulty: "medium",
    xp_reward: 150,
    duration_minutes: 0,
    min_level: 5,
    requirements: { seven_day_streak: 1 }
  },
  {
    title: "Le Persistant",
    description: "Complétez 50 quêtes fitness au total",
    type: "achievement",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 300,
    duration_minutes: 0,
    min_level: 15,
    requirements: { total_quests_completed: 50 }
  },
  {
    title: "Légende Vivante",
    description: "Atteignez le niveau 50 dans PixelPump",
    type: "achievement",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 1000,
    duration_minutes: 0,
    min_level: 50,
    requirements: { reach_level: 50 }
  },
  {
    title: "Maître de Tous",
    description: "Complétez au moins une quête de chaque catégorie",
    type: "achievement",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 250,
    duration_minutes: 0,
    min_level: 20,
    requirements: { complete_all_categories: 1 }
  },

  // ========== QUÊTES BONUS CRÉATIVES ==========
  
  {
    title: "Parkour Urbain",
    description: "Pratiquez 20 minutes de parkour ou de mouvement naturel",
    type: "weekly",
    category: "skill",
    difficulty: "hard",
    xp_reward: 95,
    duration_minutes: 20,
    min_level: 15,
    requirements: { parkour_minutes: 20 }
  },
  {
    title: "Gladiateur Moderne",
    description: "Complétez un entraînement de type bootcamp militaire",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 110,
    duration_minutes: 45,
    min_level: 18,
    requirements: { bootcamp_workout: 1 }
  },
  {
    title: "Yogi Avancé",
    description: "Maîtrisez 5 nouvelles postures de yoga avancées",
    type: "monthly",
    category: "skill",
    difficulty: "hard",
    xp_reward: 130,
    duration_minutes: 120,
    min_level: 20,
    requirements: { advanced_yoga_poses: 5 }
  },
  {
    title: "Pilates Pro",
    description: "Suivez un cours de Pilates de 45 minutes",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 45,
    min_level: 8,
    requirements: { pilates_class: 1 }
  },
  {
    title: "Calisthenics King",
    description: "Maîtrisez 3 mouvements de calisthenics (muscle-up, pistol squat, etc.)",
    type: "monthly",
    category: "skill",
    difficulty: "epic",
    xp_reward: 400,
    duration_minutes: 240,
    min_level: 25,
    requirements: { calisthenics_moves: 3 }
  }
];

// Fonction principale pour créer toutes les quêtes
async function createExtendedSportQuests() {
  try {
    console.log('🚀 Démarrage de la création des quêtes sportives étendues...');
    
    // Vérifier la connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    // Supprimer les anciennes quêtes
    console.log('🗑️ Suppression des anciennes quêtes...');
    await Quest.destroy({ where: {} });

    // Créer les nouvelles quêtes
    console.log(`📝 Création de ${extendedSportQuests.length} nouvelles quêtes sportives...`);
    
    for (let i = 0; i < extendedSportQuests.length; i++) {
      const quest = extendedSportQuests[i];
      await Quest.create(quest);
      
      // Afficher le progrès
      if ((i + 1) % 20 === 0) {
        console.log(`   ✓ ${i + 1}/${extendedSportQuests.length} quêtes créées`);
      }
    }

    console.log(`🎉 ${extendedSportQuests.length} quêtes sportives créées avec succès !`);
    console.log('\n📊 Répartition par difficulté:');
    
    const difficulties = ['easy', 'medium', 'hard', 'epic'];
    difficulties.forEach(diff => {
      const count = extendedSportQuests.filter(q => q.difficulty === diff).length;
      console.log(`   ${diff.toUpperCase()}: ${count} quêtes`);
    });

    console.log('\n📋 Répartition par type:');
    const types = ['daily', 'weekly', 'monthly', 'special', 'achievement'];
    types.forEach(type => {
      const count = extendedSportQuests.filter(q => q.type === type).length;
      console.log(`   ${type.toUpperCase()}: ${count} quêtes`);
    });

    console.log('\n🏆 Répartition par catégorie:');
    const categories = ['fitness', 'health', 'social', 'skill', 'challenge'];
    categories.forEach(cat => {
      const count = extendedSportQuests.filter(q => q.category === cat).length;
      console.log(`   ${cat.toUpperCase()}: ${count} quêtes`);
    });

    console.log('\n💎 Répartition par niveau minimum:');
    const levels = [1, 3, 5, 8, 10, 12, 15, 20, 25, 30, 50];
    levels.forEach(level => {
      const count = extendedSportQuests.filter(q => q.min_level === level).length;
      if (count > 0) {
        console.log(`   NIVEAU ${level}+: ${count} quêtes`);
      }
    });

    console.log('\n🌟 Répartition par récompense XP:');
    const xpRanges = [
      { min: 0, max: 30, label: 'Débutant (0-30 XP)' },
      { min: 31, max: 80, label: 'Intermédiaire (31-80 XP)' },
      { min: 81, max: 150, label: 'Avancé (81-150 XP)' },
      { min: 151, max: 500, label: 'Expert (151-500 XP)' },
      { min: 501, max: 9999, label: 'Légendaire (500+ XP)' }
    ];
    
    xpRanges.forEach(range => {
      const count = extendedSportQuests.filter(q => 
        q.xp_reward >= range.min && q.xp_reward <= range.max
      ).length;
      if (count > 0) {
        console.log(`   ${range.label}: ${count} quêtes`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des quêtes:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  createExtendedSportQuests();
}

module.exports = { createExtendedSportQuests, extendedSportQuests };
