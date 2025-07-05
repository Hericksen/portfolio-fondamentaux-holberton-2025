const { User, UserQuest } = require('../models');
const NewUserQuestService = require('../services/NewUserQuestService');

/**
 * Script pour assigner des quêtes aux utilisateurs existants qui n'en ont pas
 */
async function assignQuestsToExistingUsers() {
  try {
    console.log('🎯 Démarrage de l\'assignation de quêtes aux utilisateurs existants...\n');

    // Récupérer tous les utilisateurs
    const users = await User.findAll({
      include: [{
        model: UserQuest,
        required: false,
        where: {
          is_completed: false
        }
      }]
    });

    console.log(`👥 ${users.length} utilisateurs trouvés`);

    let processedUsers = 0;
    let usersWithQuests = 0;
    let usersWithoutQuests = 0;

    for (const user of users) {
      const activeQuests = user.UserQuests || [];
      
      if (activeQuests.length === 0) {
        console.log(`\n🎮 Utilisateur sans quêtes actives: ${user.username} (Level ${user.level})`);
        
        // Assigner des quêtes en fonction du niveau
        const result = await NewUserQuestService.assignQuestsForNewUser(user.id, user.level);
        
        if (result.success) {
          console.log(`   ✅ ${result.quests.length} quêtes assignées`);
          usersWithoutQuests++;
        } else {
          console.log(`   ❌ Échec: ${result.message}`);
        }
      } else {
        console.log(`✓ ${user.username} a déjà ${activeQuests.length} quête(s) active(s)`);
        usersWithQuests++;
      }
      
      processedUsers++;
    }

    console.log('\n📊 RÉSUMÉ:');
    console.log(`   👥 Utilisateurs traités: ${processedUsers}`);
    console.log(`   ✅ Utilisateurs avec quêtes: ${usersWithQuests}`);
    console.log(`   🎯 Utilisateurs sans quêtes (assignées): ${usersWithoutQuests}`);
    console.log('\n🎉 Assignation terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'assignation de quêtes:', error);
  }
}

/**
 * Script pour tester l'assignation de quêtes pour un nouvel utilisateur fictif
 */
async function testNewUserQuestAssignment() {
  try {
    console.log('🧪 Test d\'assignation de quêtes pour un nouvel utilisateur...\n');

    // Simuler différents niveaux d'utilisateurs
    const testLevels = [1, 3, 6, 10];

    for (const level of testLevels) {
      console.log(`\n🎮 Test pour niveau ${level}:`);
      
      // Créer un utilisateur temporaire pour le test (pas en base)
      const mockUserId = 99999 + level; // ID fictif
      
      const result = await NewUserQuestService.assignQuestsForNewUser(mockUserId, level);
      
      if (result.success) {
        console.log(`   ✅ ${result.quests.length} quêtes seraient assignées`);
        
        // Grouper par type de quête
        const dailyCount = result.quests.filter(q => {
          // Simulation du type basée sur la deadline
          const deadline = new Date(q.deadline);
          const assigned = new Date(q.assigned_at);
          const daysDiff = Math.ceil((deadline - assigned) / (1000 * 60 * 60 * 24));
          return daysDiff <= 1;
        }).length;
        
        const weeklyCount = result.quests.filter(q => {
          const deadline = new Date(q.deadline);
          const assigned = new Date(q.assigned_at);
          const daysDiff = Math.ceil((deadline - assigned) / (1000 * 60 * 60 * 24));
          return daysDiff > 1 && daysDiff <= 7;
        }).length;
        
        const monthlyCount = result.quests.length - dailyCount - weeklyCount;
        
        console.log(`     📅 Quotidiennes: ${dailyCount}`);
        console.log(`     📊 Hebdomadaires: ${weeklyCount}`);
        console.log(`     📈 Mensuelles: ${monthlyCount}`);
        
        // Nettoyer les quêtes de test
        await UserQuest.destroy({
          where: {
            user_id: mockUserId
          }
        });
        
      } else {
        console.log(`   ❌ Échec: ${result.message}`);
      }
    }

    console.log('\n🎉 Tests terminés !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécution du script
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    await testNewUserQuestAssignment();
  } else if (args.includes('--assign')) {
    await assignQuestsToExistingUsers();
  } else {
    console.log('📖 Usage:');
    console.log('  node assignNewUserQuests.js --test     # Tester l\'assignation');
    console.log('  node assignNewUserQuests.js --assign   # Assigner aux utilisateurs existants');
    console.log('');
    console.log('🚀 Exécution du test par défaut...');
    await testNewUserQuestAssignment();
  }
  
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  assignQuestsToExistingUsers,
  testNewUserQuestAssignment
};
