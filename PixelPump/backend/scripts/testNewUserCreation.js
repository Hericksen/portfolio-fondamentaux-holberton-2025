const { User } = require('../models');
const UserService = require('../services/UserService');

/**
 * Test de création d'un nouvel utilisateur avec assignation automatique de quêtes
 */
async function testNewUserCreation() {
  try {
    console.log('🧪 === TEST CRÉATION NOUVEL UTILISATEUR ===\n');

    // Test de création d'un utilisateur
    const testUserData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@pixelpump.com`,
      password: 'testpass123'
    };

    console.log(`👤 Création de l'utilisateur: ${testUserData.username}`);

    // Utiliser le service UserService qui inclut l'assignation automatique
    const newUser = await UserService.createUser(testUserData);

    if (newUser && newUser.id) {
      console.log(`✅ Utilisateur créé avec succès: ${newUser.username} (ID: ${newUser.id})`);
      console.log(`📊 Level: ${newUser.level}, XP: ${newUser.xp}`);

      // Vérifier les quêtes assignées manuellement
      const { UserQuest, Quest } = require('../models');
      const assignedQuests = await UserQuest.findAll({
        where: { user_id: newUser.id },
        include: [{ model: Quest }]
      });

      console.log(`🎯 ${assignedQuests.length} quêtes trouvées dans la base de données`);
      
      assignedQuests.forEach((userQuest, index) => {
        console.log(`  ${index + 1}. ${userQuest.Quest.title} (${userQuest.Quest.type}) - ${userQuest.Quest.xp_reward} XP`);
      });

      // Nettoyer - supprimer l'utilisateur de test et ses quêtes
      console.log('\n🧹 Nettoyage - suppression de l\'utilisateur de test...');
      await UserQuest.destroy({ where: { user_id: newUser.id } });
      await User.destroy({ where: { id: newUser.id } });
      console.log('✅ Utilisateur de test et ses quêtes supprimés');

    } else {
      console.log(`❌ Erreur création utilisateur`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécution
async function main() {
  await testNewUserCreation();
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { testNewUserCreation };
