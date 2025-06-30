const { User, UserQuest, UserAchievement, Quest, Achievement } = require('../models');
const sequelize = require('../config/db');

/**
 * Script pour réinitialiser tous les utilisateurs à 0
 * - Remet l'XP, level, streak et total_quests_completed à 0
 * - Supprime toutes les quêtes complétées
 * - Supprime tous les achievements débloqués
 * - Remet l'avatar par défaut
 */
async function resetAllUsers() {
  try {
    console.log('🔄 Début de la réinitialisation de tous les utilisateurs...');
    
    // 1. Supprimer toutes les quêtes utilisateur (complétées et en cours)
    console.log('📋 Suppression de toutes les quêtes utilisateur...');
    await UserQuest.destroy({
      where: {},
      truncate: true
    });
    console.log('✅ Quêtes utilisateur supprimées');

    // 2. Supprimer tous les achievements utilisateur
    console.log('🏆 Suppression de tous les achievements utilisateur...');
    await UserAchievement.destroy({
      where: {},
      truncate: true
    });
    console.log('✅ Achievements utilisateur supprimés');

    // 3. Réinitialiser tous les utilisateurs
    console.log('👤 Réinitialisation des données utilisateur...');
    await User.update({
      xp: 0,
      level: 1,
      streak: 0,
      total_quests_completed: 0,
      last_quest_date: null,
      avatar: {
        body: 'default',
        outfit: 'casual',
        accessory: 'none',
        color: '#ff006e'
      },
      fitness_goals: {
        daily_quests: 3,
        weekly_xp: 1000,
        target_level: 10
      }
    }, {
      where: {} // Applique à tous les utilisateurs
    });

    // 4. Compter le nombre d'utilisateurs réinitialisés
    const userCount = await User.count();
    
    console.log('✅ Réinitialisation terminée avec succès !');
    console.log(`📊 ${userCount} utilisateur(s) réinitialisé(s)`);
    console.log('');
    console.log('📋 Détails de la réinitialisation :');
    console.log('  - XP: 0');
    console.log('  - Level: 1');
    console.log('  - Streak: 0');
    console.log('  - Total quêtes complétées: 0');
    console.log('  - Dernière date de quête: null');
    console.log('  - Avatar: par défaut');
    console.log('  - Objectifs fitness: par défaut');
    console.log('  - Toutes les quêtes supprimées');
    console.log('  - Tous les achievements supprimés');

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  }
}

// Fonction pour confirmer avant d'exécuter
async function confirmAndReset() {
  console.log('⚠️  ATTENTION: Cette opération va réinitialiser TOUS les utilisateurs !');
  console.log('   - Toutes les données de progression seront perdues');
  console.log('   - Cette action est IRREVERSIBLE');
  console.log('');
  
  // Si on exécute le script directement
  if (require.main === module) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Êtes-vous sûr de vouloir continuer ? (tapez "RESET" pour confirmer): ', async (answer) => {
      if (answer === 'RESET') {
        try {
          await resetAllUsers();
          console.log('🎉 Réinitialisation terminée !');
        } catch (error) {
          console.error('💥 Erreur:', error.message);
        }
      } else {
        console.log('❌ Opération annulée');
      }
      rl.close();
      process.exit(0);
    });
  }
}

// Exporter la fonction pour pouvoir l'utiliser depuis d'autres scripts
module.exports = { resetAllUsers, confirmAndReset };

// Si le script est exécuté directement
if (require.main === module) {
  confirmAndReset();
}
