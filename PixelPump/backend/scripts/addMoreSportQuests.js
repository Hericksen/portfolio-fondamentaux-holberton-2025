const Quest = require('../models/Quest');
const sequelize = require('../config/db');

// COLLECTION ADDITIONNELLE DE QUÊTES POUR DÉPASSER 100
const additionalSportQuests = [
  // ========== QUÊTES SPÉCIALISÉES - SPORTS D'ÉQUIPE ==========
  
  {
    title: "Basketteur Urbain",
    description: "Shootez 50 paniers dans un panier de basket public",
    type: "weekly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 45,
    min_level: 8,
    requirements: { basketball_shots: 50 }
  },
  {
    title: "Footballeur du Dimanche",
    description: "Jouez au football pendant 1 heure avec des amis",
    type: "weekly",
    category: "social",
    difficulty: "medium",
    xp_reward: 70,
    duration_minutes: 60,
    min_level: 5,
    requirements: { football_minutes: 60 }
  },
  {
    title: "Volleyeur de Plage",
    description: "Jouez au volley-ball ou beach-volley pendant 45 minutes",
    type: "weekly",
    category: "social",
    difficulty: "medium",
    xp_reward: 65,
    duration_minutes: 45,
    min_level: 6,
    requirements: { volleyball_minutes: 45 }
  },
  {
    title: "Tennisman Amateur",
    description: "Jouez au tennis ou ping-pong pendant 30 minutes",
    type: "weekly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 30,
    min_level: 7,
    requirements: { tennis_minutes: 30 }
  },
  {
    title: "Pongiste Pro",
    description: "Faites une partie de ping-pong de 100 échanges",
    type: "daily",
    category: "skill",
    difficulty: "easy",
    xp_reward: 25,
    duration_minutes: 15,
    min_level: 5,
    requirements: { pingpong_rallies: 100 }
  },

  // ========== QUÊTES D'ENDURANCE EXTRÊME ==========
  
  {
    title: "Ultra Walker",
    description: "Marchez 30000 pas en une seule journée",
    type: "special",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 350,
    duration_minutes: 360,
    min_level: 25,
    requirements: { steps: 30000 }
  },
  {
    title: "Centurion des Pompes",
    description: "Faites 1000 pompes réparties sur une semaine",
    type: "weekly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 400,
    duration_minutes: 300,
    min_level: 30,
    requirements: { weekly_pushups: 1000 }
  },
  {
    title: "Roi des Squats",
    description: "Effectuez 2000 squats en une semaine",
    type: "weekly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 450,
    duration_minutes: 350,
    min_level: 28,
    requirements: { weekly_squats: 2000 }
  },
  {
    title: "Marathon Virtuel",
    description: "Parcourez 42.2 km en courant/marchant sur le mois",
    type: "monthly",
    category: "challenge",
    difficulty: "epic",
    xp_reward: 600,
    duration_minutes: 600,
    min_level: 20,
    requirements: { monthly_km: 42.2 }
  },

  // ========== QUÊTES DE FLEXIBILITÉ & MOBILITÉ ==========
  
  {
    title: "Contorsionniste Débutant",
    description: "Travaillez votre flexibilité pendant 45 minutes",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 45,
    min_level: 8,
    requirements: { flexibility_minutes: 45 }
  },
  {
    title: "Maître du Grand Écart",
    description: "Travaillez pour atteindre le grand écart facial",
    type: "monthly",
    category: "skill",
    difficulty: "hard",
    xp_reward: 150,
    duration_minutes: 300,
    min_level: 15,
    requirements: { split_training_sessions: 20 }
  },
  {
    title: "Yogi du Lever",
    description: "Faites 15 minutes de yoga chaque matin pendant une semaine",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 80,
    duration_minutes: 105,
    min_level: 10,
    requirements: { morning_yoga_days: 7 }
  },
  {
    title: "Stretching Master",
    description: "Étirez-vous 10 minutes après chaque entraînement pendant un mois",
    type: "monthly",
    category: "health",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 300,
    min_level: 12,
    requirements: { post_workout_stretches: 30 }
  },

  // ========== QUÊTES AQUATIQUES ==========
  
  {
    title: "Poisson dans l'Eau",
    description: "Nagez 1000 mètres en piscine",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 75,
    duration_minutes: 45,
    min_level: 8,
    requirements: { swimming_meters: 1000 }
  },
  {
    title: "Triton des Profondeurs",
    description: "Nagez 2 km en mer ou lac (avec sécurité)",
    type: "monthly",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 200,
    duration_minutes: 90,
    min_level: 18,
    requirements: { open_water_swim_km: 2 }
  },
  {
    title: "Aqua Fitness Warrior",
    description: "Participez à un cours d'aqua-fitness ou aqua-zumba",
    type: "weekly",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 40,
    duration_minutes: 45,
    min_level: 5,
    requirements: { aqua_fitness_class: 1 }
  },
  {
    title: "Plongeur Apnéiste",
    description: "Pratiquez l'apnée : restez 2 minutes sous l'eau",
    type: "weekly",
    category: "skill",
    difficulty: "hard",
    xp_reward: 100,
    duration_minutes: 30,
    min_level: 20,
    requirements: { underwater_seconds: 120 }
  },

  // ========== QUÊTES DE FORCE FONCTIONNELLE ==========
  
  {
    title: "Porteur de Charges",
    description: "Portez 20 kg sur 1 km (sac à dos, sacs de courses, etc.)",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 20,
    min_level: 10,
    requirements: { carry_weight_km: 1 }
  },
  {
    title: "Déménageur Pro",
    description: "Soulevez et déplacez des objets lourds pendant 1 heure",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 90,
    duration_minutes: 60,
    min_level: 15,
    requirements: { heavy_lifting_minutes: 60 }
  },
  {
    title: "Farmer's Walk",
    description: "Marchez 500m en portant des poids dans chaque main",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 55,
    duration_minutes: 15,
    min_level: 12,
    requirements: { farmers_walk_meters: 500 }
  },
  {
    title: "Atlas Moderne",
    description: "Portez quelqu'un sur votre dos sur 100 mètres",
    type: "monthly",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 110,
    duration_minutes: 10,
    min_level: 20,
    requirements: { piggyback_meters: 100 }
  },

  // ========== QUÊTES CRÉATIVES & ORIGINALES ==========
  
  {
    title: "Ninja des Escaliers",
    description: "Montez 100 étages en courant (répartis sur la semaine)",
    type: "weekly",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 120,
    duration_minutes: 60,
    min_level: 15,
    requirements: { running_stairs_floors: 100 }
  },
  {
    title: "Flashmob Dancer",
    description: "Organisez ou participez à un flashmob dansé",
    type: "special",
    category: "social",
    difficulty: "medium",
    xp_reward: 80,
    duration_minutes: 60,
    min_level: 10,
    requirements: { flashmob_participation: 1 }
  },
  {
    title: "Jardinier Athlète",
    description: "Faites 2 heures de jardinage intensif (bêcher, porter, etc.)",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 65,
    duration_minutes: 120,
    min_level: 8,
    requirements: { gardening_minutes: 120 }
  },
  {
    title: "Ménage Sportif",
    description: "Nettoyez votre maison en musique pendant 1h (intensité élevée)",
    type: "weekly",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 35,
    duration_minutes: 60,
    min_level: 3,
    requirements: { active_cleaning_minutes: 60 }
  },
  {
    title: "Chasseur de Pokémon",
    description: "Marchez 10 km en jouant à Pokémon GO ou jeu similaire",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 50,
    duration_minutes: 120,
    min_level: 5,
    requirements: { gaming_walk_km: 10 }
  },

  // ========== QUÊTES HIVERNALES & SAISONNIÈRES ==========
  
  {
    title: "Skieur des Neiges",
    description: "Faites 4 heures de ski ou snowboard",
    type: "special",
    category: "fitness",
    difficulty: "hard",
    xp_reward: 150,
    duration_minutes: 240,
    min_level: 15,
    requirements: { winter_sports_hours: 4 }
  },
  {
    title: "Patineur Artistique",
    description: "Patinez pendant 1 heure sur glace ou en roller",
    type: "weekly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 60,
    min_level: 8,
    requirements: { skating_minutes: 60 }
  },
  {
    title: "Constructeur d'Igloos",
    description: "Construisez un bonhomme de neige ou igloo (activité physique)",
    type: "special",
    category: "fitness",
    difficulty: "easy",
    xp_reward: 30,
    duration_minutes: 45,
    min_level: 3,
    requirements: { snow_construction: 1 }
  },
  {
    title: "Surfeur d'Été",
    description: "Surfez ou faites du bodyboard pendant 2 heures",
    type: "special",
    category: "skill",
    difficulty: "medium",
    xp_reward: 90,
    duration_minutes: 120,
    min_level: 12,
    requirements: { surfing_minutes: 120 }
  },

  // ========== QUÊTES DE COMPÉTITION ==========
  
  {
    title: "Compétiteur Né",
    description: "Participez à une course locale (5K, 10K, etc.)",
    type: "special",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 200,
    duration_minutes: 60,
    min_level: 18,
    requirements: { race_participation: 1 }
  },
  {
    title: "Challenger Personnel",
    description: "Battez votre record personnel dans n'importe quel exercice",
    type: "monthly",
    category: "challenge",
    difficulty: "medium",
    xp_reward: 100,
    duration_minutes: 30,
    min_level: 10,
    requirements: { personal_record_beaten: 1 }
  },
  {
    title: "Team Captain",
    description: "Menez votre équipe à la victoire dans un sport collectif",
    type: "special",
    category: "social",
    difficulty: "hard",
    xp_reward: 180,
    duration_minutes: 90,
    min_level: 20,
    requirements: { team_victory_as_captain: 1 }
  },

  // ========== QUÊTES TECHNOLOGIQUES & MODERNES ==========
  
  {
    title: "Gamer Actif",
    description: "Jouez 2 heures à des jeux vidéo actifs (VR, Wii, Ring Fit, etc.)",
    type: "weekly",
    category: "fitness",
    difficulty: "medium",
    xp_reward: 70,
    duration_minutes: 120,
    min_level: 8,
    requirements: { active_gaming_minutes: 120 }
  },
  {
    title: "Streamer Sportif",
    description: "Diffusez en live votre entraînement pendant 1 heure",
    type: "monthly",
    category: "social",
    difficulty: "medium",
    xp_reward: 85,
    duration_minutes: 60,
    min_level: 15,
    requirements: { stream_workout: 1 }
  },
  {
    title: "Data Analyst du Sport",
    description: "Analysez vos données sportives sur 1 mois complet",
    type: "monthly",
    category: "skill",
    difficulty: "easy",
    xp_reward: 40,
    duration_minutes: 60,
    min_level: 10,
    requirements: { analyze_fitness_data: 1 }
  },

  // ========== QUÊTES DE RÉCUPÉRATION AVANCÉE ==========
  
  {
    title: "Cryothérapeute",
    description: "Prenez 5 bains glacés ou douches froides cette semaine",
    type: "weekly",
    category: "health",
    difficulty: "hard",
    xp_reward: 80,
    duration_minutes: 50,
    min_level: 15,
    requirements: { cold_baths: 5 }
  },
  {
    title: "Sauna Master",
    description: "Passez 2 heures en sauna/hammam réparties sur la semaine",
    type: "weekly",
    category: "health",
    difficulty: "medium",
    xp_reward: 60,
    duration_minutes: 120,
    min_level: 12,
    requirements: { sauna_minutes: 120 }
  },
  {
    title: "Foam Roller Pro",
    description: "Utilisez un rouleau de massage 15 min après chaque entraînement",
    type: "weekly",
    category: "health",
    difficulty: "easy",
    xp_reward: 35,
    duration_minutes: 105,
    min_level: 8,
    requirements: { foam_rolling_sessions: 7 }
  },

  // ========== QUÊTES PHILOSOPHIQUES & MENTALES ==========
  
  {
    title: "Moine Guerrier",
    description: "Combinez 1h d'arts martiaux avec 30min de méditation",
    type: "weekly",
    category: "skill",
    difficulty: "medium",
    xp_reward: 90,
    duration_minutes: 90,
    min_level: 12,
    requirements: { martial_arts_meditation: 1 }
  },
  {
    title: "Philosophe Athlète",
    description: "Lisez un livre sur le sport/fitness tout en faisant du cardio léger",
    type: "monthly",
    category: "skill",
    difficulty: "easy",
    xp_reward: 45,
    duration_minutes: 120,
    min_level: 10,
    requirements: { reading_while_exercising: 1 }
  },
  {
    title: "Stoïcien du Sport",
    description: "Continuez votre entraînement malgré des conditions difficiles",
    type: "special",
    category: "challenge",
    difficulty: "hard",
    xp_reward: 130,
    duration_minutes: 60,
    min_level: 18,
    requirements: { adverse_conditions_workout: 1 }
  }
];

// Fonction pour ajouter les quêtes additionnelles
async function addAdditionalSportQuests() {
  try {
    console.log('🚀 Ajout de quêtes supplémentaires pour dépasser 100...');
    
    // Vérifier la connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    // Compter les quêtes existantes
    const existingCount = await Quest.count();
    console.log(`📊 Quêtes existantes: ${existingCount}`);

    // Ajouter les nouvelles quêtes
    console.log(`📝 Ajout de ${additionalSportQuests.length} nouvelles quêtes...`);
    
    for (let i = 0; i < additionalSportQuests.length; i++) {
      const quest = additionalSportQuests[i];
      await Quest.create(quest);
      
      // Afficher le progrès
      if ((i + 1) % 10 === 0) {
        console.log(`   ✓ ${i + 1}/${additionalSportQuests.length} quêtes ajoutées`);
      }
    }

    // Compter le total final
    const finalCount = await Quest.count();
    console.log(`🎉 ${additionalSportQuests.length} quêtes ajoutées avec succès !`);
    console.log(`📊 TOTAL FINAL: ${finalCount} quêtes sportives`);

    // Afficher les statistiques finales
    const allQuests = await Quest.findAll();
    
    console.log('\n📊 STATISTIQUES FINALES:');
    console.log('═══════════════════════════════');
    
    console.log('\n🏅 Répartition par difficulté:');
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

    console.log('\n🌟 Répartition par récompense XP:');
    const xpRanges = [
      { min: 0, max: 30, label: 'Débutant (0-30 XP)' },
      { min: 31, max: 80, label: 'Intermédiaire (31-80 XP)' },
      { min: 81, max: 150, label: 'Avancé (81-150 XP)' },
      { min: 151, max: 300, label: 'Expert (151-300 XP)' },
      { min: 301, max: 9999, label: 'Légendaire (300+ XP)' }
    ];
    
    xpRanges.forEach(range => {
      const count = allQuests.filter(q => 
        q.xp_reward >= range.min && q.xp_reward <= range.max
      ).length;
      console.log(`   ${range.label}: ${count} quêtes`);
    });

    if (finalCount >= 100) {
      console.log('\n🎯 OBJECTIF ATTEINT: Plus de 100 quêtes sportives créées !');
      console.log('🚀 La base de données contient maintenant une collection complète et variée !');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des quêtes:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  addAdditionalSportQuests();
}

module.exports = { addAdditionalSportQuests, additionalSportQuests };
