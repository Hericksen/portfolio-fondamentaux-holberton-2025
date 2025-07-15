#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

// Génération aléatoire de quêtes pour atteindre 200 quêtes
async function createAdditionalQuests() {
  try {
    console.log('🚀 Création de quêtes supplémentaires pour atteindre 200 quêtes...');
    
    // Catégories disponibles
    const categories = ['fitness', 'health', 'social', 'skill', 'challenge'];
    
    // Types de quêtes
    const types = ['daily', 'weekly', 'monthly', 'special'];
    
    // Difficultés
    const difficulties = ['easy', 'medium', 'hard', 'epic'];
    
    // Niveaux min/max
    const minLevels = [1, 2, 3, 5, 8, 10, 15];
    
    // Quêtes supplémentaires avec variété
    const additionalQuests = [
      // FITNESS AVANCÉ - DAILY
      {
        title: "HIIT Express",
        description: "Complétez une séance HIIT de 15 minutes pour brûler des calories efficacement",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 15,
        min_level: 3,
        requirements: { workout_minutes: 15, intensity: "high" }
      },
      {
        title: "Plyométrie Power",
        description: "Effectuez 3 séries de 10 box jumps pour développer votre puissance",
        type: "daily",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 55,
        duration_minutes: 20,
        min_level: 5,
        requirements: { box_jumps: 30 }
      },
      {
        title: "Gainage Intégral",
        description: "Complétez un circuit de 5 exercices de gainage différents",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 15,
        min_level: 3,
        requirements: { core_exercises: 5 }
      },
      
      // SANTÉ - DAILY
      {
        title: "Hydratation Optimale",
        description: "Buvez 2L d'eau aujourd'hui pour une hydratation parfaite",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 0,
        min_level: 1,
        requirements: { water_liters: 2 }
      },
      {
        title: "Sommeil Réparateur",
        description: "Dormez 8 heures pour récupérer pleinement",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 480,
        min_level: 1,
        requirements: { sleep_hours: 8 }
      },
      {
        title: "Digital Detox",
        description: "Passez 2 heures sans écran pour reposer vos yeux",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 120,
        min_level: 2,
        requirements: { screen_free_hours: 2 }
      },
      
      // SOCIAL - DAILY
      {
        title: "Coach d'un Jour",
        description: "Partagez un conseil fitness avec un ami",
        type: "daily",
        category: "social",
        difficulty: "easy",
        xp_reward: 25,
        duration_minutes: 5,
        min_level: 2,
        requirements: { share_advice: true }
      },
      {
        title: "Workout Ensemble",
        description: "Faites une séance d'entraînement avec un ami",
        type: "daily",
        category: "social",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 40,
        min_level: 3,
        requirements: { group_workout: true }
      },
      {
        title: "Défi Communautaire",
        description: "Participez à un défi organisé dans votre communauté fitness locale",
        type: "daily",
        category: "social",
        difficulty: "hard",
        xp_reward: 60,
        duration_minutes: 60,
        min_level: 5,
        requirements: { community_challenge: true }
      },
      
      // SKILL - DAILY
      {
        title: "Technique Parfaite",
        description: "Maîtrisez la technique parfaite pour un exercice de base",
        type: "daily",
        category: "skill",
        difficulty: "medium",
        xp_reward: 35,
        duration_minutes: 15,
        min_level: 2,
        requirements: { perfect_form: true }
      },
      {
        title: "Nouveau Mouvement",
        description: "Apprenez et exécutez un nouvel exercice que vous n'avez jamais essayé",
        type: "daily",
        category: "skill",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 20,
        min_level: 3,
        requirements: { new_exercise: true }
      },
      {
        title: "Master Class",
        description: "Suivez un tutoriel ou une classe en ligne pour améliorer une compétence spécifique",
        type: "daily",
        category: "skill",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 30,
        min_level: 2,
        requirements: { tutorial_completed: true }
      },
      
      // CHALLENGE - DAILY
      {
        title: "Dépassement Cardio",
        description: "Battez votre record personnel sur un exercice cardio de votre choix",
        type: "daily",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 50,
        duration_minutes: 20,
        min_level: 4,
        requirements: { beat_personal_record: true }
      },
      {
        title: "Poids Maximum",
        description: "Essayez votre répétition maximale sur un exercice de force",
        type: "daily",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 55,
        duration_minutes: 30,
        min_level: 5,
        requirements: { one_rep_max: true }
      },
      {
        title: "Sans Arrêt",
        description: "Complétez une séance d'entraînement de 30 minutes sans pause",
        type: "daily",
        category: "challenge",
        difficulty: "hard",
        xp_reward: 60,
        duration_minutes: 30,
        min_level: 4,
        requirements: { no_break_workout: true }
      },
      
      // FITNESS - WEEKLY
      {
        title: "Diversité d'Entraînement",
        description: "Faites 5 types d'entraînements différents cette semaine",
        type: "weekly",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 120,
        duration_minutes: 250,
        min_level: 3,
        requirements: { different_workouts: 5 }
      },
      {
        title: "Volume Hebdomadaire",
        description: "Accumulez 180 minutes d'activité physique cette semaine",
        type: "weekly",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 150,
        duration_minutes: 180,
        min_level: 2,
        requirements: { weekly_activity_minutes: 180 }
      },
      {
        title: "Jours Consécutifs",
        description: "Entraînez-vous 4 jours d'affilée",
        type: "weekly",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 200,
        duration_minutes: 120,
        min_level: 4,
        requirements: { consecutive_days: 4 }
      },
      
      // HEALTH - WEEKLY
      {
        title: "Alimentation Équilibrée",
        description: "Suivez un plan alimentaire équilibré pendant 5 jours",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 130,
        duration_minutes: 0,
        min_level: 2,
        requirements: { balanced_diet_days: 5 }
      },
      {
        title: "Sommeil Régulier",
        description: "Maintenez un horaire de sommeil régulier pendant toute la semaine",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 140,
        duration_minutes: 0,
        min_level: 2,
        requirements: { regular_sleep_pattern: 7 }
      },
      {
        title: "Méditation Hebdomadaire",
        description: "Pratiquez la méditation 10 minutes par jour pendant 5 jours",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 120,
        duration_minutes: 50,
        min_level: 2,
        requirements: { meditation_days: 5 }
      }
    ];

    // Générer des quêtes additionnelles pour atteindre environ 200 quêtes au total
    const randomQuestTemplates = [
      // Format: [préfixe, suffixe, catégorie, type, niveau min]
      ["Intense", "Challenge", "fitness", "daily", 3],
      ["Découverte", "Workout", "fitness", "daily", 1],
      ["Power", "Training", "fitness", "daily", 4],
      ["Endurance", "Session", "fitness", "weekly", 3],
      ["Balance", "Practice", "health", "daily", 1],
      ["Mind", "Relaxation", "health", "daily", 2],
      ["Nutrition", "Plan", "health", "weekly", 2],
      ["Team", "Workout", "social", "weekly", 3],
      ["Community", "Challenge", "social", "monthly", 5],
      ["Master", "Technique", "skill", "weekly", 4],
      ["Expert", "Training", "skill", "monthly", 6],
      ["Ultimate", "Challenge", "challenge", "weekly", 5],
      ["Elite", "Performance", "challenge", "monthly", 8],
      ["Recovery", "Session", "health", "daily", 2],
      ["Flexibility", "Routine", "fitness", "daily", 1],
      ["Strength", "Building", "fitness", "weekly", 3],
      ["Cardio", "Burst", "fitness", "daily", 2],
      ["High-Intensity", "Circuit", "challenge", "weekly", 4],
      ["Mindful", "Practice", "health", "daily", 1],
      ["Social", "Engagement", "social", "weekly", 2]
    ];

    // Descriptions génériques variées
    const descriptions = [
      "Complétez cette activité pour améliorer votre condition physique",
      "Relevez ce défi pour renforcer votre mental et votre corps",
      "Une opportunité de progresser dans votre parcours fitness",
      "Un exercice conçu pour développer votre endurance",
      "Testez vos limites avec cette activité stimulante",
      "Améliorez votre technique avec cet exercice ciblé",
      "Un défi parfait pour sortir de votre zone de confort",
      "Développez votre force et votre coordination",
      "Une activité qui renforcera votre détermination",
      "Un excellent moyen de maintenir votre motivation"
    ];

    // Générer des quêtes aléatoires supplémentaires
    for (let i = 0; i < 80; i++) {
      const template = randomQuestTemplates[Math.floor(Math.random() * randomQuestTemplates.length)];
      const [prefix, suffix, category, type, minLevel] = template;
      
      // Générer un nombre pour rendre chaque titre unique
      const number = Math.floor(Math.random() * 100) + 1;
      
      const randomQuest = {
        title: `${prefix} ${suffix} ${number}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        type: type,
        category: category,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        xp_reward: type === 'daily' ? 20 + Math.floor(Math.random() * 50) : 
                   type === 'weekly' ? 80 + Math.floor(Math.random() * 120) : 
                   type === 'monthly' ? 200 + Math.floor(Math.random() * 300) : 
                   50 + Math.floor(Math.random() * 100),
        duration_minutes: 5 + Math.floor(Math.random() * 55),
        min_level: minLevel,
        requirements: { custom_action: `action_${i}`, count: 1 + Math.floor(Math.random() * 10) },
        is_template: true,
        is_active: true
      };
      
      additionalQuests.push(randomQuest);
    }

    // Insérer les quêtes supplémentaires dans la base de données
    console.log(`📝 Ajout de ${additionalQuests.length} nouvelles quêtes...`);
    await Quest.bulkCreate(additionalQuests);
    
    // Vérifier le nombre total de quêtes
    const totalQuests = await Quest.count();
    console.log(`✅ Succès! Nombre total de quêtes: ${totalQuests}`);
    
    return { success: true, totalQuests };
  } catch (error) {
    console.error('❌ Erreur lors de la création des quêtes supplémentaires:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  createAdditionalQuests()
    .then(result => {
      console.log('🏁 Script terminé!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = createAdditionalQuests;
}
