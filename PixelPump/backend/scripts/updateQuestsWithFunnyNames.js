#!/usr/bin/env node

const { Quest } = require('../models');
const sequelize = require('../config/db');

async function updateQuestsWithFunnyNames() {
  try {
    console.log('🎭 Mise à jour des quêtes avec des noms plus rigolos...');

    // Récupérer toutes les quêtes
    const quests = await Quest.findAll();
    console.log(`📊 Nombre total de quêtes à mettre à jour: ${quests.length}`);

    // Définir des noms drôles par catégorie
    const funnyNamesByCategory = {
      fitness: [
        { pattern: /pompe/i, newTitle: "Pompe-toi les Biceps!" },
        { pattern: /plank|gainage/i, newTitle: "Rigide comme une Planche!" },
        { pattern: /squat/i, newTitle: "Fesses de Fer" },
        { pattern: /cardio|course|run/i, newTitle: "Course-Moi Après!" },
        { pattern: /jump|sauter/i, newTitle: "Kangourou en Action" },
        { pattern: /HIIT/i, newTitle: "Essoufflé en 5 Minutes" },
        { pattern: /marche|pas/i, newTitle: "Un Pas de Géant" },
        { pattern: /étirement|stretch/i, newTitle: "Élastique Humain" },
        { pattern: /circuit/i, newTitle: "Le Manège Infernal" },
        { pattern: /escalier/i, newTitle: "Grimpeur de Grattes-Ciel" },
        { pattern: /force/i, newTitle: "Hulk en Herbe" },
        { pattern: /puissance/i, newTitle: "SuperSaiyan Mode" },
        { pattern: /pull-up|traction/i, newTitle: "Accroche-toi au Lustre" },
        { pattern: /burpee/i, newTitle: "Torture Volontaire" },
        { pattern: /muscle/i, newTitle: "Gonflette Party" },
        { pattern: /yoga/i, newTitle: "Pretzel Humain" },
        { pattern: /flexibilité/i, newTitle: "Contorsionniste Amateur" },
        { pattern: /entraînement|training/i, newTitle: "Sueur et Bonheur" },
        { pattern: /record/i, newTitle: "Dépasse-toi, Champion!" },
        // Par défaut pour la catégorie fitness
        { pattern: /.*/, newTitle: "Mission: Transpiration" }
      ],
      health: [
        { pattern: /eau|hydrat/i, newTitle: "Glouglou le Dauphin" },
        { pattern: /sommeil|dormir/i, newTitle: "Belle au Bois Dormant" },
        { pattern: /méditation|zen/i, newTitle: "Zen Attitude Maximale" },
        { pattern: /écran|digital/i, newTitle: "Déconnexion Forcée" },
        { pattern: /nutrition|aliment|manger/i, newTitle: "Gourmet Sain" },
        { pattern: /fruit|légume/i, newTitle: "Arc-en-Ciel dans l'Assiette" },
        { pattern: /protéine/i, newTitle: "Muscles Affamés" },
        { pattern: /repas/i, newTitle: "Chef Cuisto Healthy" },
        { pattern: /équilibre/i, newTitle: "Funambule Nutritionnel" },
        { pattern: /régime|diet/i, newTitle: "Adieu Calories Coquines" },
        { pattern: /detox/i, newTitle: "Nettoyage de Printemps" },
        { pattern: /stress/i, newTitle: "Anti-Panique Totale" },
        { pattern: /respirat/i, newTitle: "Souffle du Dragon" },
        { pattern: /posture/i, newTitle: "Dos de Ballerine" },
        { pattern: /recovery|récupérat/i, newTitle: "Batterie Rechargée" },
        // Par défaut pour la catégorie health
        { pattern: /.*/, newTitle: "Opération Corps Heureux" }
      ],
      social: [
        { pattern: /ami|friend|ensemble/i, newTitle: "Squad Goals" },
        { pattern: /partag|share/i, newTitle: "L'Influenceur Fitness" },
        { pattern: /groupe|team|communaut/i, newTitle: "Meute en Mouvement" },
        { pattern: /coach/i, newTitle: "Sensei du Fitness" },
        { pattern: /défi|challenge/i, newTitle: "Défi Entre Potes" },
        { pattern: /motiv/i, newTitle: "Cheerleader Personnel" },
        { pattern: /event/i, newTitle: "La Fiesta Sportive" },
        { pattern: /rencontre/i, newTitle: "Speed Dating Sportif" },
        { pattern: /compétition/i, newTitle: "La Battle Amicale" },
        { pattern: /équipe/i, newTitle: "Dream Team en Action" },
        // Par défaut pour la catégorie social
        { pattern: /.*/, newTitle: "Fitness & Friends" }
      ],
      skill: [
        { pattern: /technique/i, newTitle: "Le Geste Parfait" },
        { pattern: /apprendre|learn/i, newTitle: "Cerveau Musclé" },
        { pattern: /maîtris/i, newTitle: "Sensei du Mouvement" },
        { pattern: /nouveau|new/i, newTitle: "Explorateur de Mouvements" },
        { pattern: /form/i, newTitle: "L'Art du Mouvement Parfait" },
        { pattern: /progress/i, newTitle: "Évolution Pokémon" },
        { pattern: /tutoriel|class/i, newTitle: "L'Élève Appliqué" },
        { pattern: /compétence|skill/i, newTitle: "Collectionneur de Skills" },
        { pattern: /expert|master/i, newTitle: "Jedi du Fitness" },
        { pattern: /débutant/i, newTitle: "Padawan en Formation" },
        { pattern: /balance|équilibre/i, newTitle: "Funambule Sans Filet" },
        // Par défaut pour la catégorie skill
        { pattern: /.*/, newTitle: "Level Up: Compétence Fitness" }
      ],
      challenge: [
        { pattern: /record|max/i, newTitle: "Briseur de Records" },
        { pattern: /défi|challenge/i, newTitle: "Challenge Accepted!" },
        { pattern: /ultime|ultimate/i, newTitle: "Boss Final du Fitness" },
        { pattern: /marathon/i, newTitle: "Course Sans Fin" },
        { pattern: /transformation/i, newTitle: "Métamorphose Totale" },
        { pattern: /intense/i, newTitle: "Mode Bête Activé" },
        { pattern: /épreuve/i, newTitle: "Koh-Lanta du Fitness" },
        { pattern: /limite/i, newTitle: "Au-delà des Limites" },
        { pattern: /consécutif|streak/i, newTitle: "Combo Infernal" },
        { pattern: /sans pause|non-stop/i, newTitle: "Machine Infatigable" },
        { pattern: /champion/i, newTitle: "Légende du Gymnase" },
        { pattern: /élite/i, newTitle: "Club des Surhommes" },
        { pattern: /complet/i, newTitle: "Le Parcours du Combattant" },
        // Par défaut pour la catégorie challenge
        { pattern: /.*/, newTitle: "Défi pour les Braves" }
      ]
    };

    // Obtenir un nom drôle basé sur la catégorie et la description
    function getFunnyName(quest) {
      const categoryPatterns = funnyNamesByCategory[quest.category] || funnyNamesByCategory.fitness;
      
      // Chercher un pattern qui correspond à la description ou au titre
      const searchText = (quest.description + ' ' + quest.title).toLowerCase();
      for (const { pattern, newTitle } of categoryPatterns) {
        if (pattern.test(searchText)) {
          return newTitle;
        }
      }
      
      // Si aucun pattern ne correspond, utiliser le dernier titre (par défaut)
      return categoryPatterns[categoryPatterns.length - 1].newTitle;
    }
    
    // Améliorer une description pour la rendre plus amusante
    function enhanceDescription(quest) {
      // Liste d'émojis par catégorie
      const emojis = {
        fitness: ['💪', '🏋️', '🤸', '🏃', '⚡', '🔥', '🦵', '🦾'],
        health: ['🥗', '💧', '😴', '🧘', '🌿', '🍎', '🥦', '❤️'],
        social: ['👯', '🤝', '👨‍👩‍👧‍👦', '🗣️', '📱', '🎉', '🤜🤛', '📢'],
        skill: ['🧠', '📚', '🎯', '🏆', '📈', '🔄', '⚙️', '🧩'],
        challenge: ['🏅', '🚀', '⚡', '💯', '🌋', '⏱️', '🔱', '👑']
      };
      
      const categoryEmojis = emojis[quest.category] || emojis.fitness;
      const randomEmoji = categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
      
      // Ajouter un emoji et une touche d'humour à la description
      let enhancedDesc = quest.description;
      
      // Ajouter des phrases humoristiques spécifiques par catégorie
      const funnyPhrases = {
        fitness: [
          "Ton canapé va se sentir abandonné!",
          "Tes muscles vont te remercier... plus tard.",
          "Qui a besoin de Netflix quand on peut faire ça?",
          "Pas de douleur, pas de gain... mais surtout de la douleur!",
          "Ton corps va se demander ce qu'il a fait pour mériter ça!"
        ],
        health: [
          "Ton corps est un temple, pas une poubelle!",
          "Ton futur toi te remerciera!",
          "C'est comme un spa, mais pour l'intérieur!",
          "Ta santé est comme un compte en banque, fais des dépôts!",
          "Ton corps mérite cet amour!"
        ],
        social: [
          "L'occasion parfaite de montrer que tu n'es pas juste accro à ton téléphone!",
          "Prouve que tu as une vie sociale... sportive!",
          "Qui a dit que les sportifs étaient antisociaux?",
          "Faire du sport ET se faire des amis? Quel concept!",
          "Ton feed Instagram va adorer ça!"
        ],
        skill: [
          "Deviens le ninja du fitness que tu as toujours voulu être!",
          "Tu pourrais presque mettre ça sur ton CV!",
          "C'est comme apprendre à faire du vélo, mais avec plus de sueur!",
          "Tu vas impressionner même ton miroir!",
          "Niveau de compétence: presque pro!"
        ],
        challenge: [
          "Si c'était facile, tout le monde le ferait!",
          "Va falloir creuser pour trouver la motivation!",
          "C'est comme un boss de jeu vidéo, mais tu transpires pour de vrai!",
          "Tu te sentiras comme un super-héros après ça!",
          "Challenge tellement intense qu'il fait peur aux autres défis!"
        ]
      };
      
      const categoryPhrases = funnyPhrases[quest.category] || funnyPhrases.fitness;
      const randomPhrase = categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)];
      
      // Si la description ne contient pas déjà d'emoji, en ajouter un
      if (!enhancedDesc.match(/[\u{1F300}-\u{1F6FF}]/u)) {
        enhancedDesc = `${randomEmoji} ${enhancedDesc}`;
      }
      
      // Ajouter la phrase humoristique si la description n'est pas trop longue
      if (enhancedDesc.length < 100) {
        enhancedDesc = `${enhancedDesc} ${randomPhrase}`;
      }
      
      return enhancedDesc;
    }

    // Mettre à jour chaque quête
    let updatedCount = 0;
    for (const quest of quests) {
      const funnyTitle = getFunnyName(quest);
      const enhancedDescription = enhanceDescription(quest);
      
      // Ne pas mettre à jour si le titre est déjà drôle ou si c'est une quête d'achievement
      if (quest.type === 'achievement') {
        continue;
      }
      
      // Mettre à jour le titre et la description
      await quest.update({
        title: funnyTitle,
        description: enhancedDescription
      });
      
      updatedCount++;
      
      // Afficher la progression
      if (updatedCount % 20 === 0) {
        console.log(`🔄 ${updatedCount}/${quests.length} quêtes mises à jour...`);
      }
    }

    console.log(`✅ Mise à jour terminée! ${updatedCount} quêtes ont été rendues plus amusantes.`);
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des quêtes:', error);
    return { success: false, error: error.message };
  }
}

// Exécuter la fonction si le script est appelé directement
if (require.main === module) {
  updateQuestsWithFunnyNames()
    .then(result => {
      if (result.success) {
        console.log('🎉 Les quêtes ont maintenant des noms plus rigolos et pertinents!');
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Exporter pour utilisation dans d'autres scripts
  module.exports = updateQuestsWithFunnyNames;
}
