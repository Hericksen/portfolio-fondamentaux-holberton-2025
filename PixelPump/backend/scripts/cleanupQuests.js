inue
#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

async function cleanupQuests() {
  try {
    console.log('🧹 Nettoyage des quêtes: suppression des doublons, emojis et traduction...');

    // Récupérer toutes les quêtes
    const quests = await Quest.findAll();
    console.log(`📊 Nombre total de quêtes avant nettoyage: ${quests.length}`);

    // 1. Supprimer les doublons basés sur le titre
    console.log('🔍 Recherche et suppression des doublons...');
    const titleMap = new Map();
    const duplicateIds = [];

    for (const quest of quests) {
      const titleKey = quest.title.toLowerCase().trim();
      if (titleMap.has(titleKey)) {
        // Garder la quête avec l'ID le plus ancien
        const existing = titleMap.get(titleKey);
        if (quest.id > existing.id) {
          duplicateIds.push(quest.id);
        } else {
          duplicateIds.push(existing.id);
          titleMap.set(titleKey, quest);
        }
      } else {
        titleMap.set(titleKey, quest);
      }
    }

    if (duplicateIds.length > 0) {
      console.log(`🗑️ Suppression de ${duplicateIds.length} doublons...`);
      await Quest.destroy({
        where: {
          id: duplicateIds
        }
      });
    }

    // 2. Récupérer les quêtes restantes et nettoyer les descriptions
    console.log('🧽 Nettoyage des descriptions...');
    const remainingQuests = await Quest.findAll();
    console.log(`📊 Nombre de quêtes après suppression des doublons: ${remainingQuests.length}`);

    let updatedCount = 0;
    for (const quest of remainingQuests) {
      let description = quest.description;
      let title = quest.title;
      
      // Supprimer tous les emojis des descriptions (méthode plus complète)
      description = description
        .replace(/[\u{1F300}-\u{1F6FF}]/gu, '')  // Emojis standards
        .replace(/[\u{2700}-\u{27BF}]/gu, '')    // Dingbats
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')  // Emojis supplémentaires
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')  // Drapeaux
        .replace(/[\u{2600}-\u{26FF}]/gu, '')    // Symboles divers
        .replace(/[\u{2300}-\u{23FF}]/gu, '')    // Symboles techniques
        .replace(/[\u{1F000}-\u{1F02F}]/gu, '')  // Mahjong
        .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '')  // Cartes à jouer
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')  // Transport et symboles
        .replace(/[\u{1F190}-\u{1F1FF}]/gu, '')  // Symboles alphabétiques
        .replace(/[\u{1F910}-\u{1F96B}]/gu, '')  // Emojis faciaux supplémentaires
        .replace(/[\u{1F980}-\u{1F991}]/gu, '')  // Animaux et nature
        .replace(/❤️|✅|🎯|🔍|🗑️|🧽|📊|🔄/g, '')   // Emojis spécifiques
        .trim();
      
      // Traductions français pour les termes anglais courants
      const translations = {
        // Termes fitness
        'workout': 'entraînement',
        'training': 'entraînement',
        'pushups': 'pompes',
        'push-ups': 'pompes',
        'squats': 'squats',
        'plank': 'planche',
        'jumping jacks': 'jumping jacks',
        'burpees': 'burpees',
        'pullups': 'tractions',
        'pull-ups': 'tractions',
        'deadlift': 'soulevé de terre',
        'benchpress': 'développé couché',
        'HIIT': 'HIIT',
        'cardio': 'cardio',
        'stretching': 'étirements',
        'yoga': 'yoga',
        'meditation': 'méditation',
        'steps': 'pas',
        'stairs': 'escaliers',
        'running': 'course',
        'walking': 'marche',
        
        // Termes généraux
        'challenge': 'défi',
        'goal': 'objectif',
        'record': 'record',
        'level': 'niveau',
        'skill': 'compétence',
        'technique': 'technique',
        'form': 'technique',
        'balance': 'équilibre',
        'flexibility': 'flexibilité',
        'strength': 'force',
        'endurance': 'endurance',
        'power': 'puissance',
        
        // Termes de santé
        'diet': 'régime alimentaire',
        'nutrition': 'nutrition',
        'hydration': 'hydratation',
        'sleep': 'sommeil',
        'recovery': 'récupération',
        'wellness': 'bien-être',
        'health': 'santé',
        
        // Termes sociaux
        'friend': 'ami',
        'team': 'équipe',
        'group': 'groupe',
        'community': 'communauté',
        'social': 'social',
        'share': 'partager'
      };

      // Appliquer les traductions
      for (const [english, french] of Object.entries(translations)) {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        description = description.replace(regex, french);
        title = title.replace(regex, french);
      }

      // Corriger la grammaire et les formulations françaises
      description = description
        .replace(/Faites au moins (\d+) pas aujourd'hui/i, 'Marchez au moins $1 pas aujourd\'hui')
        .replace(/Réalisez (\d+) pompes/i, 'Effectuez $1 pompes')
        .replace(/Effectuez (\d+) squats/i, 'Faites $1 squats')
        .replace(/Faites (\d+) jumping jacks/i, 'Effectuez $1 jumping jacks')
        .replace(/Tenez la position de planche pendant (\d+) secondes/i, 'Maintenez la position de planche pendant $1 secondes')
        .replace(/Étirez-vous pendant (\d+) minutes/i, 'Faites des étirements pendant $1 minutes')
        .replace(/Montez (\d+) étages par les escaliers/i, 'Montez $1 étages à pied')
        .replace(/Marchez pendant (\d+) minutes/i, 'Marchez $1 minutes')
        .replace(/Courez ou faites du cardio pendant (\d+) minutes/i, 'Faites $1 minutes de cardio')
        .replace(/Buvez (\d+)L d'eau aujourd'hui/i, 'Buvez $1 litres d\'eau')
        .replace(/Dormez pendant (\d+) heures/i, 'Dormez $1 heures')
        .replace(/Méditez pendant (\d+) minutes/i, 'Méditez $1 minutes')
        .replace(/Restez (\d+) heures sans écran/i, 'Évitez les écrans pendant $1 heures')
        .replace(/Faites une séance d'entraînement de (\d+) minutes/i, 'Entraînez-vous pendant $1 minutes')
        .replace(/Accomplissez l'action: (.+)\./i, function(match, p1) {
          // Traduire les actions spécifiques
          if (p1.includes('tutorial_completed') || p1.includes('tutorial completed')) {
            return 'Suivez un tutoriel pour améliorer une technique fitness.';
          } else if (p1.includes('beat_personal_record') || p1.includes('beat personal record')) {
            return 'Battez votre record personnel sur un exercice de votre choix.';
          } else if (p1.includes('one_rep_max') || p1.includes('one rep max')) {
            return 'Testez votre répétition maximale sur un exercice de force.';
          } else if (p1.includes('custom')) {
            return 'Accomplissez votre objectif fitness du jour.';
          } else {
            // Convertir format snake_case vers un texte lisible
            const readableAction = p1
              .replace(/_/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())
              .trim();
            return `Accomplissez l'action: ${readableAction}.`;
          }
        });

      // Nettoyer les espaces multiples
      description = description.replace(/\s+/g, ' ').trim();
      title = title.replace(/\s+/g, ' ').trim();

      // S'assurer que la première lettre est en majuscule
      if (description.length > 0) {
        description = description.charAt(0).toUpperCase() + description.slice(1);
      }

      // S'assurer que la description se termine par un point
      if (!description.endsWith('.')) {
        description += '.';
      }

      // Mettre à jour la quête si quelque chose a changé
      if (description !== quest.description || title !== quest.title) {
        await quest.update({ 
          description: description,
          title: title
        });
        updatedCount++;
        
        // Afficher la progression
        if (updatedCount % 20 === 0) {
          console.log(`🔄 ${updatedCount}/${remainingQuests.length} quêtes nettoyées...`);
        }
      }
    }

    // Vérifier le nombre final
    const finalCount = await Quest.count();
    console.log(`✅ Nettoyage terminé! ${finalCount} quêtes restantes, ${updatedCount} mises à jour.`);
    
    return { success: true, finalCount, updatedCount, duplicatesRemoved: duplicateIds.length };
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des quêtes:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  cleanupQuests()
    .then(result => {
      if (result.success) {
        console.log(`🎯 Nettoyage réussi!`);
        console.log(`   • ${result.duplicatesRemoved} doublons supprimés`);
        console.log(`   • ${result.updatedCount} quêtes mises à jour`);
        console.log(`   • ${result.finalCount} quêtes finales`);
        console.log(`   • Emojis supprimés des descriptions`);
        console.log(`   • Traduction en français complétée`);
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = cleanupQuests;
}
