#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

// Ajout de quêtes supplémentaires pour arriver exactement à 200
async function createExactlyTwoHundredQuests() {
  try {
    // Vérifier le nombre actuel de quêtes
    const currentCount = await Quest.count();
    console.log(`📊 Nombre actuel de quêtes: ${currentCount}`);
    
    const neededQuests = 200 - currentCount;
    
    if (neededQuests <= 0) {
      console.log('✅ Il y a déjà au moins 200 quêtes dans la base de données.');
      return { success: true, totalQuests: currentCount };
    }
    
    console.log(`🚀 Ajout de ${neededQuests} quêtes pour atteindre exactement 200 quêtes...`);
    
    // Nouvelles quêtes spécifiques à ajouter
    const newQuests = [
      // STRENGTH TRAINING - Série dédiée (4 quêtes)
      {
        title: "Force Fondamentale",
        description: "Soulevez votre poids corporel en soulevé de terre",
        type: "weekly",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 80,
        duration_minutes: 45,
        min_level: 3,
        requirements: { deadlift_bodyweight: true }
      },
      {
        title: "Puissance Supérieure",
        description: "Effectuez 5 tractions parfaites",
        type: "daily",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 60,
        duration_minutes: 15,
        min_level: 4,
        requirements: { perfect_pullups: 5 }
      },
      {
        title: "Base Solide",
        description: "Complétez 3 séries de squats avec 80% de votre poids corporel",
        type: "weekly",
        category: "fitness",
        difficulty: "hard",
        xp_reward: 90,
        duration_minutes: 40,
        min_level: 5,
        requirements: { weighted_squats: true }
      },
      {
        title: "Épaules de Titan",
        description: "Effectuez un entraînement complet des épaules",
        type: "weekly",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 75,
        duration_minutes: 35,
        min_level: 3,
        requirements: { shoulder_workout: true }
      },

      // YOGA & FLEXIBILITÉ - Série dédiée (4 quêtes)
      {
        title: "Posture Parfaite",
        description: "Maintenez la posture du guerrier pendant 60 secondes de chaque côté",
        type: "daily",
        category: "fitness",
        difficulty: "medium",
        xp_reward: 40,
        duration_minutes: 10,
        min_level: 2,
        requirements: { warrior_pose_seconds: 120 }
      },
      {
        title: "Équilibre Zen",
        description: "Pratiquez l'arbre (vrksasana) pendant 30 secondes sur chaque jambe",
        type: "daily",
        category: "health",
        difficulty: "medium",
        xp_reward: 45,
        duration_minutes: 10,
        min_level: 2,
        requirements: { tree_pose_seconds: 60 }
      },
      {
        title: "Flow Complet",
        description: "Complétez une séquence complète de salutation au soleil",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 35,
        duration_minutes: 15,
        min_level: 1,
        requirements: { sun_salutation: true }
      },
      {
        title: "Flexibilité Maximale",
        description: "Atteignez vos orteils en position assise jambes tendues",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 70,
        duration_minutes: 20,
        min_level: 2,
        requirements: { seated_forward_bend: true }
      },

      // NUTRITION - Série dédiée (4 quêtes)
      {
        title: "Protéines Optimales",
        description: "Consommez votre objectif de protéines quotidien pendant 3 jours consécutifs",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 65,
        duration_minutes: 0,
        min_level: 2,
        requirements: { protein_goal_days: 3 }
      },
      {
        title: "Hydratation Élite",
        description: "Buvez 3L d'eau quotidiennement pendant 5 jours",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 75,
        duration_minutes: 0,
        min_level: 2,
        requirements: { hydration_days: 5 }
      },
      {
        title: "Alimentation Colorée",
        description: "Mangez au moins 5 fruits et légumes de couleurs différentes en une journée",
        type: "daily",
        category: "health",
        difficulty: "easy",
        xp_reward: 30,
        duration_minutes: 0,
        min_level: 1,
        requirements: { colorful_foods: 5 }
      },
      {
        title: "Préparation Stratégique",
        description: "Préparez vos repas pour 3 jours à l'avance",
        type: "weekly",
        category: "health",
        difficulty: "medium",
        xp_reward: 80,
        duration_minutes: 90,
        min_level: 2,
        requirements: { meal_prep_days: 3 }
      },

      // QUÊTES SPÉCIALES - Série dédiée (4 quêtes)
      {
        title: "Champion du Mois",
        description: "Complétez 30 quêtes en un mois",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 300,
        duration_minutes: 0,
        min_level: 5,
        requirements: { monthly_quests_completed: 30 }
      },
      {
        title: "Marathon Fitness",
        description: "Accumulez 1000 minutes d'exercice en un mois",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 350,
        duration_minutes: 1000,
        min_level: 6,
        requirements: { monthly_exercise_minutes: 1000 }
      },
      {
        title: "Défi Ultime",
        description: "Atteignez tous vos objectifs fitness pendant deux semaines consécutives",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 400,
        duration_minutes: 0,
        min_level: 8,
        requirements: { all_goals_weeks: 2 }
      },
      {
        title: "Transformation Totale",
        description: "Complétez un programme d'entraînement de 4 semaines sans manquer une séance",
        type: "monthly",
        category: "challenge",
        difficulty: "epic",
        xp_reward: 500,
        duration_minutes: 0,
        min_level: 10,
        requirements: { perfect_program_completion: true }
      }
    ];

    // Si nous avons besoin de plus ou de moins de quêtes que celles définies ci-dessus
    if (neededQuests > newQuests.length) {
      // Générer des quêtes supplémentaires si nécessaire
      const extraNeeded = neededQuests - newQuests.length;
      console.log(`📝 Génération de ${extraNeeded} quêtes supplémentaires...`);

      const categories = ['fitness', 'health', 'social', 'skill', 'challenge'];
      const types = ['daily', 'weekly', 'monthly', 'special'];
      const difficulties = ['easy', 'medium', 'hard', 'epic'];
      
      for (let i = 0; i < extraNeeded; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        // Générer un XP approprié selon le type et la difficulté
        let xpReward;
        if (type === 'daily') {
          xpReward = difficulty === 'easy' ? 20 + Math.floor(Math.random() * 20) :
                     difficulty === 'medium' ? 35 + Math.floor(Math.random() * 25) :
                     difficulty === 'hard' ? 50 + Math.floor(Math.random() * 30) :
                     70 + Math.floor(Math.random() * 30);
        } else if (type === 'weekly') {
          xpReward = 70 + Math.floor(Math.random() * 130);
        } else {
          xpReward = 200 + Math.floor(Math.random() * 300);
        }
        
        newQuests.push({
          title: `Quête Supplémentaire ${i+1}`,
          description: `Une quête ${difficulty} de type ${type} dans la catégorie ${category}`,
          type: type,
          category: category,
          difficulty: difficulty,
          xp_reward: xpReward,
          duration_minutes: 10 + Math.floor(Math.random() * 50),
          min_level: difficulty === 'easy' ? 1 : 
                     difficulty === 'medium' ? 3 :
                     difficulty === 'hard' ? 5 : 8,
          requirements: { custom_requirement: `requirement_${i+1}` }
        });
      }
    } else if (neededQuests < newQuests.length) {
      // Utiliser seulement le nombre nécessaire de quêtes
      newQuests.splice(neededQuests);
    }

    // Ajouter les quêtes à la base de données
    await Quest.bulkCreate(newQuests);
    
    // Vérifier le nombre final de quêtes
    const finalCount = await Quest.count();
    console.log(`✅ Succès! Nombre total de quêtes: ${finalCount}`);
    
    return { success: true, totalQuests: finalCount };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des quêtes:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  createExactlyTwoHundredQuests()
    .then(result => {
      if (result.totalQuests === 200) {
        console.log('🎯 Objectif atteint: Exactement 200 quêtes dans la base de données!');
      } else {
        console.log(`⚠️ Le nombre final de quêtes est ${result.totalQuests}, pas exactement 200.`);
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = createExactlyTwoHundredQuests;
}
