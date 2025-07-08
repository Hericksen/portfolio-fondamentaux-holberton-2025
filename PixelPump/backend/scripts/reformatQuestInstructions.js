#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

async function reformatQuestInstructions() {
  try {
    console.log('🔧 Reformulation des quêtes en instructions claires...');

    // Récupérer toutes les quêtes
    const quests = await Quest.findAll();
    console.log(`📊 Nombre total de quêtes à reformuler: ${quests.length}`);

    // Convertir les descriptions en instructions claires
    let updatedCount = 0;
    for (const quest of quests) {
      // Extraire les informations nécessaires de la quête
      const { title, description, requirements, type, category, difficulty } = quest;
      let newDescription = '';
      
      // Obtenir l'action principale à partir des requirements
      const requirementKeys = Object.keys(requirements || {});
      
      // Patterns communs à rechercher
      const patterns = {
        steps: /pas|steps|marche/i,
        pushups: /pomp|push/i,
        squats: /squat/i,
        jumping: /jump|saut/i,
        plank: /plank|gainage/i,
        stretch: /étir|stretch|flex/i,
        stairs: /escalier|stair/i,
        walk: /walk|marche/i,
        run: /run|course|courir/i,
        water: /eau|water|hydrat/i,
        sleep: /dorm|sleep|sommeil/i,
        meditation: /médit|zen/i,
        screen: /écran|screen|digital/i,
        workout: /workout|entraîn|training/i,
        diet: /diet|aliment|nutrit|manger|repas/i,
        friend: /ami|friend|social|groupe|team/i,
        challenge: /challenge|défi/i,
        technique: /technique|form|skill/i
      };
      
      // Identifier le type d'action principal
      let actionType = 'action';
      for (const [key, pattern] of Object.entries(patterns)) {
        if (pattern.test(title) || pattern.test(description) || requirementKeys.some(k => pattern.test(k))) {
          actionType = key;
          break;
        }
      }
      
      // Construire l'instruction en fonction du type d'action et des requirements
      switch (actionType) {
        case 'steps':
          const stepCount = requirements.steps || requirements.step_count || 1000;
          newDescription = `Faites au moins ${stepCount} pas aujourd'hui.`;
          break;
          
        case 'pushups':
          const pushupCount = requirements.pushups || requirements.push_ups || 5;
          newDescription = `Réalisez ${pushupCount} pompes.`;
          break;
          
        case 'squats':
          const squatCount = requirements.squats || 10;
          newDescription = `Effectuez ${squatCount} squats.`;
          break;
          
        case 'jumping':
          const jumpCount = requirements.jumping_jacks || requirements.jumps || 20;
          newDescription = `Faites ${jumpCount} jumping jacks.`;
          break;
          
        case 'plank':
          const plankTime = requirements.plank_seconds || 30;
          newDescription = `Tenez la position de planche pendant ${plankTime} secondes.`;
          break;
          
        case 'stretch':
          const stretchTime = requirements.stretching_minutes || 5;
          newDescription = `Étirez-vous pendant ${stretchTime} minutes.`;
          break;
          
        case 'stairs':
          const floorCount = requirements.stairs_floors || 3;
          newDescription = `Montez ${floorCount} étages par les escaliers.`;
          break;
          
        case 'walk':
          const walkTime = requirements.walk_minutes || 15;
          newDescription = `Marchez pendant ${walkTime} minutes.`;
          break;
          
        case 'run':
          const runTime = requirements.run_minutes || requirements.cardio_minutes || 20;
          newDescription = `Courez ou faites du cardio pendant ${runTime} minutes.`;
          break;
          
        case 'water':
          const waterAmount = requirements.water_liters || 2;
          newDescription = `Buvez ${waterAmount}L d'eau aujourd'hui.`;
          break;
          
        case 'sleep':
          const sleepHours = requirements.sleep_hours || 8;
          newDescription = `Dormez pendant ${sleepHours} heures.`;
          break;
          
        case 'meditation':
          const meditationTime = requirements.meditation_minutes || 10;
          newDescription = `Méditez pendant ${meditationTime} minutes.`;
          break;
          
        case 'screen':
          const screenFreeHours = requirements.screen_free_hours || 2;
          newDescription = `Restez ${screenFreeHours} heures sans écran.`;
          break;
          
        case 'workout':
          const workoutMinutes = requirements.workout_minutes || 30;
          newDescription = `Faites une séance d'entraînement de ${workoutMinutes} minutes.`;
          break;
          
        case 'diet':
          if (requirements.meal_prep_days) {
            newDescription = `Préparez vos repas pour ${requirements.meal_prep_days} jours à l'avance.`;
          } else if (requirements.balanced_diet_days) {
            newDescription = `Suivez un régime alimentaire équilibré pendant ${requirements.balanced_diet_days} jours.`;
          } else if (requirements.colorful_foods) {
            newDescription = `Mangez ${requirements.colorful_foods} fruits et légumes de couleurs différentes aujourd'hui.`;
          } else {
            newDescription = `Suivez un régime alimentaire sain aujourd'hui.`;
          }
          break;
          
        case 'friend':
          newDescription = `Participez à une activité fitness avec un ami ou en groupe.`;
          if (requirements.share_advice) {
            newDescription = `Partagez un conseil fitness avec un ami.`;
          } else if (requirements.group_workout) {
            newDescription = `Faites une séance d'entraînement avec un partenaire ou en groupe.`;
          }
          break;
          
        case 'challenge':
          if (requirements.beat_personal_record) {
            newDescription = `Battez votre record personnel sur un exercice de votre choix.`;
          } else if (requirements.one_rep_max) {
            newDescription = `Testez votre répétition maximale sur un exercice de force.`;
          } else if (requirements.no_break_workout) {
            newDescription = `Faites une séance d'entraînement sans pause.`;
          } else if (requirements.all_goals_weeks) {
            newDescription = `Atteignez tous vos objectifs fitness pendant ${requirements.all_goals_weeks} semaines consécutives.`;
          } else {
            newDescription = `Relevez un défi fitness personnel aujourd'hui.`;
          }
          break;
          
        case 'technique':
          if (requirements.perfect_form) {
            newDescription = `Pratiquez et maîtrisez la technique parfaite d'un exercice de base.`;
          } else if (requirements.new_exercise) {
            newDescription = `Apprenez et exécutez un nouvel exercice que vous n'avez jamais essayé.`;
          } else if (requirements.tutorial_completed) {
            newDescription = `Suivez un tutoriel pour améliorer une technique fitness spécifique.`;
          } else {
            newDescription = `Améliorez votre technique sur un exercice de votre choix.`;
          }
          break;
          
        default:
          // Utiliser les requirements pour déduire l'action
          if (requirementKeys.length > 0) {
            const key = requirementKeys[0];
            const value = requirements[key];
            
            if (typeof value === 'number') {
              newDescription = `Complétez ${value} ${key.replace(/_/g, ' ')}.`;
            } else if (typeof value === 'boolean' && value === true) {
              newDescription = `Accomplissez l'action: ${key.replace(/_/g, ' ')}.`;
            } else {
              // Extraire l'action de la description originale
              // Convertir en instruction directe
              let desc = description.replace(/^[\u{1F300}-\u{1F6FF}]\s+/u, ''); // Supprimer l'emoji au début
              
              // Mettre à l'impératif
              desc = desc
                .replace(/^Complétez/, 'Complétez')
                .replace(/^Faites/, 'Faites')
                .replace(/^Marchez/, 'Marchez')
                .replace(/^Tenez/, 'Tenez')
                .replace(/^Effectuez/, 'Effectuez')
                .replace(/^Montez/, 'Montez')
                .replace(/^Buvez/, 'Buvez')
                .replace(/^Dormez/, 'Dormez')
                .replace(/^Méditez/, 'Méditez')
                .replace(/^Pratiquez/, 'Pratiquez')
                .replace(/^Suivez/, 'Suivez')
                .replace(/^Mangez/, 'Mangez')
                .replace(/^Participez/, 'Participez')
                .replace(/^Apprenez/, 'Apprenez')
                .replace(/^Relevez/, 'Relevez')
                .replace(/^Testez/, 'Testez')
                .replace(/^Battez/, 'Battez')
                .replace(/^Atteignez/, 'Atteignez');
              
              // Si ce n'est pas déjà une instruction, la convertir
              if (!desc.match(/^[A-Z][a-z]+ez/)) {
                // Extraire l'action principale
                const actionMatch = desc.match(/([a-z]+er|[a-z]+ir|[a-z]+oir)\s/i);
                if (actionMatch) {
                  const action = actionMatch[1];
                  let imperative = '';
                  
                  // Convertir à l'impératif
                  if (action.endsWith('er')) {
                    imperative = action.slice(0, -2) + 'ez';
                  } else if (action.endsWith('ir')) {
                    imperative = action.slice(0, -2) + 'issez';
                  } else if (action.endsWith('oir')) {
                    imperative = action.slice(0, -3) + 'oyez';
                  }
                  
                  desc = desc.replace(action, imperative);
                } else {
                  // Commencer par un verbe à l'impératif
                  desc = "Réalisez " + desc.charAt(0).toLowerCase() + desc.slice(1);
                }
              }
              
              newDescription = desc;
            }
          } else {
            // Dernière solution: rendre la description originale plus directe
            newDescription = description
              .replace(/^[\u{1F300}-\u{1F6FF}]\s+/u, '') // Supprimer l'emoji au début
              .replace(/^[A-Z][a-z]+r/, match => match.slice(0, -1) + 'z') // Convertir infinitif en impératif
              .trim();
            
            // S'assurer que ça commence par un verbe à l'impératif
            if (!newDescription.match(/^[A-Z][a-z]+ez/)) {
              newDescription = "Réalisez " + newDescription.charAt(0).toLowerCase() + newDescription.slice(1);
            }
          }
      }
      
      // S'assurer que la description se termine par un point
      if (!newDescription.endsWith('.')) {
        newDescription += '.';
      }
      
      // Ajouter un emoji approprié en fonction de la catégorie
      const categoryEmojis = {
        fitness: '💪',
        health: '❤️',
        social: '👯',
        skill: '🎯',
        challenge: '🏆'
      };
      
      const emoji = categoryEmojis[category] || '✅';
      newDescription = `${emoji} ${newDescription}`;
      
      // Mettre à jour la quête
      if (newDescription !== description) {
        await quest.update({ description: newDescription });
        updatedCount++;
        
        // Afficher la progression
        if (updatedCount % 20 === 0) {
          console.log(`🔄 ${updatedCount}/${quests.length} quêtes reformulées...`);
        }
      }
    }

    console.log(`✅ Reformulation terminée! ${updatedCount} quêtes ont été reformulées avec des instructions claires.`);
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Erreur lors de la reformulation des quêtes:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  reformatQuestInstructions()
    .then(result => {
      if (result.success) {
        console.log('🎯 Toutes les quêtes indiquent maintenant clairement ce que l\'utilisateur doit faire!');
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = reformatQuestInstructions;
}
