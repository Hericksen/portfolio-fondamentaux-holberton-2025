#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

async function simplifyQuestDescriptions() {
  try {
    console.log('📝 Simplification des descriptions des quêtes...');

    // Récupérer toutes les quêtes
    const quests = await Quest.findAll();
    console.log(`📊 Nombre total de quêtes à modifier: ${quests.length}`);

    // Nettoyer les descriptions
    let updatedCount = 0;
    for (const quest of quests) {
      let description = quest.description;
      
      // Supprimer les phrases humoristiques qui ont été ajoutées
      const phrasesToRemove = [
        "Ton canapé va se sentir abandonné!",
        "Tes muscles vont te remercier... plus tard.",
        "Qui a besoin de Netflix quand on peut faire ça?",
        "Pas de douleur, pas de gain... mais surtout de la douleur!",
        "Ton corps va se demander ce qu'il a fait pour mériter ça!",
        "Ton corps est un temple, pas une poubelle!",
        "Ton futur toi te remerciera!",
        "C'est comme un spa, mais pour l'intérieur!",
        "Ta santé est comme un compte en banque, fais des dépôts!",
        "Ton corps mérite cet amour!",
        "L'occasion parfaite de montrer que tu n'es pas juste accro à ton téléphone!",
        "Prouve que tu as une vie sociale... sportive!",
        "Qui a dit que les sportifs étaient antisociaux?",
        "Faire du sport ET se faire des amis? Quel concept!",
        "Ton feed Instagram va adorer ça!",
        "Deviens le ninja du fitness que tu as toujours voulu être!",
        "Tu pourrais presque mettre ça sur ton CV!",
        "C'est comme apprendre à faire du vélo, mais avec plus de sueur!",
        "Tu vas impressionner même ton miroir!",
        "Niveau de compétence: presque pro!",
        "Si c'était facile, tout le monde le ferait!",
        "Va falloir creuser pour trouver la motivation!",
        "C'est comme un boss de jeu vidéo, mais tu transpires pour de vrai!",
        "Tu te sentiras comme un super-héros après ça!",
        "Challenge tellement intense qu'il fait peur aux autres défis!"
      ];
      
      for (const phrase of phrasesToRemove) {
        description = description.replace(phrase, '');
      }
      
      // Simplifier la structure des phrases
      description = description
        .replace(/pour une hydratation parfaite/i, '')
        .replace(/pour récupérer pleinement/i, '')
        .replace(/pour reposer vos yeux/i, '')
        .replace(/pour une hydratation optimale/i, '')
        .replace(/pour améliorer votre flexibilité/i, '')
        .replace(/pour développer votre puissance/i, '')
        .replace(/pour améliorer votre condition physique/i, '')
        .replace(/pour énergiser votre journée/i, '')
        .replace(/pour débuter votre journey fitness/i, '')
        .replace(/parfaite/i, '')
        .replace(/parfait/i, '')
        .replace(/efficacement/i, '')
        .replace(/totalement/i, '')
        .replace(/facilement/i, '')
        .trim();
      
      // Conserver un emoji au début si présent
      const emojiMatch = description.match(/^([\u{1F300}-\u{1F6FF}])\s+/u);
      const emoji = emojiMatch ? emojiMatch[1] + " " : "";
      
      // Nettoyer les espaces multiples
      description = description.replace(/\s+/g, ' ').trim();
      
      // S'assurer que la première lettre est en majuscule
      if (description.length > 0) {
        description = emoji + description.charAt(emoji.length).toUpperCase() + description.slice(emoji.length + 1);
      }
      
      // Mettre à jour la quête si la description a changé
      if (description !== quest.description) {
        await quest.update({ description });
        updatedCount++;
        
        // Afficher la progression
        if (updatedCount % 20 === 0) {
          console.log(`🔄 ${updatedCount}/${quests.length} descriptions simplifiées...`);
        }
      }
    }

    console.log(`✅ Simplification terminée! ${updatedCount} descriptions ont été simplifiées.`);
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Erreur lors de la simplification des descriptions:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  simplifyQuestDescriptions()
    .then(result => {
      if (result.success) {
        console.log('🎯 Les descriptions des quêtes sont maintenant plus simples et directes!');
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = simplifyQuestDescriptions;
}
