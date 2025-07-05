const { User, Quest, UserQuest } = require('../models');
const NewUserQuestService = require('../services/NewUserQuestService');
const GamificationService = require('../services/GamificationService');

/**
 * Script complet pour tester le système de quêtes
 */
async function testQuestSystem() {
  try {
    console.log('🧪 === TEST COMPLET DU SYSTÈME DE QUÊTES ===\n');

    // 1. Test de création d'utilisateur et assignation automatique de quêtes
    console.log('1️⃣ Test création utilisateur et assignation automatique...');
    
    // Prendre un utilisateur existant pour les tests
    const testUser = await User.findOne({
      where: { username: 'cacaca' }
    });

    if (!testUser) {
      console.log('❌ Utilisateur de test non trouvé');
      return;
    }

    console.log(`   ✅ Utilisateur de test: ${testUser.username} (Level ${testUser.level})`);

    // 2. Vérifier les quêtes actuelles
    console.log('\n2️⃣ Vérification des quêtes actuelles...');
    const currentQuests = await UserQuest.findAll({
      where: { user_id: testUser.id, is_completed: false },
      include: [{ model: Quest }]
    });

    console.log(`   📋 Quêtes actives: ${currentQuests.length}`);
    currentQuests.forEach((uq, index) => {
      console.log(`     ${index + 1}. ${uq.Quest.title} (${uq.Quest.xp_reward} XP) - ${uq.Quest.type}`);
    });

    // 3. Test assignation de quêtes quotidiennes
    console.log('\n3️⃣ Test assignation de nouvelles quêtes quotidiennes...');
    try {
      const dailyResult = await GamificationService.assignDailyQuests(testUser.id);
      console.log(`   ✅ ${dailyResult.message}`);
      console.log(`   📝 Nombre de quêtes: ${dailyResult.count || dailyResult.quests.length}`);
    } catch (error) {
      console.log(`   ⚠️ Assignation quotidienne: ${error.message}`);
    }

    // 4. Test de complétion de quête (simulé)
    console.log('\n4️⃣ Test de complétion de quête...');
    const activeQuest = await UserQuest.findOne({
      where: { user_id: testUser.id, is_completed: false },
      include: [{ model: Quest }]
    });

    if (activeQuest) {
      console.log(`   🎯 Tentative de complétion: ${activeQuest.Quest.title}`);
      
      // Sauvegarder l'état actuel
      const initialXP = testUser.xp;
      const initialLevel = testUser.level;
      const initialQuestCount = testUser.total_quests_completed;

      try {
        const completionResult = await GamificationService.completeQuest(testUser.id, activeQuest.quest_id);
        
        console.log(`   ✅ Quête complétée !`);
        console.log(`   💎 XP gagné: ${completionResult.xpGained}`);
        console.log(`   📈 Level up: ${completionResult.leveledUp ? 'OUI' : 'NON'}`);
        console.log(`   🎖️ Nouveaux achievements: ${completionResult.newAchievements}`);

        // Vérifier les changements dans l'utilisateur
        await testUser.reload();
        console.log(`   📊 Stats après complétion:`);
        console.log(`     - XP: ${initialXP} → ${testUser.xp} (+${testUser.xp - initialXP})`);
        console.log(`     - Level: ${initialLevel} → ${testUser.level}`);
        console.log(`     - Quêtes complétées: ${initialQuestCount} → ${testUser.total_quests_completed}`);
        console.log(`     - Streak: ${testUser.streak}`);

      } catch (error) {
        console.log(`   ❌ Erreur de complétion: ${error.message}`);
      }
    } else {
      console.log('   ⚠️ Aucune quête active à compléter');
    }

    // 5. Test du système d'assignation pour nouveaux utilisateurs (logique seulement)
    console.log('\n5️⃣ Test logique d\'assignation pour nouveaux utilisateurs...');
    
    for (const level of [1, 3, 5]) {
      console.log(`   🎮 Test niveau ${level}:`);
      
      try {
        // Vérifier les quêtes disponibles pour ce niveau
        const availableQuests = await Quest.findAll({
          where: {
            is_template: true,
            is_active: true,
            min_level: { [require('sequelize').Op.lte]: level }
          },
          order: [['xp_reward', 'ASC']]
        });

        const dailyQuests = availableQuests.filter(q => q.type === 'daily').slice(0, 3);
        const weeklyQuests = availableQuests.filter(q => q.type === 'weekly').slice(0, 2);
        const monthlyQuests = availableQuests.filter(q => q.type === 'monthly').slice(0, 1);
        
        const totalQuests = dailyQuests.length + weeklyQuests.length + monthlyQuests.length;
        
        console.log(`     ✅ ${totalQuests} quêtes seraient assignées`);
        console.log(`     📝 Détail: ${dailyQuests.length} quotidiennes, ${weeklyQuests.length} hebdo, ${monthlyQuests.length} mensuelles`);
        
      } catch (error) {
        console.log(`     ❌ Erreur: ${error.message}`);
      }
    }

    // 6. Vérification de l'intégrité des données
    console.log('\n6️⃣ Vérification de l\'intégrité...');
    
    const totalQuests = await Quest.count({ where: { is_template: true, is_active: true } });
    const totalUsers = await User.count();
    const totalUserQuests = await UserQuest.count();
    
    console.log(`   📊 Statistiques générales:`);
    console.log(`     - Quêtes templates: ${totalQuests}`);
    console.log(`     - Utilisateurs: ${totalUsers}`);
    console.log(`     - Assignations: ${totalUserQuests}`);

    // Vérifier s'il y a des quêtes orphelines (assignations sans utilisateur valide)
    const orphanQuests = await UserQuest.findAll({
      include: [{
        model: User,
        required: false
      }],
      where: {
        '$User.id$': null
      }
    });

    if (orphanQuests.length > 0) {
      console.log(`   ⚠️ ${orphanQuests.length} assignations orphelines détectées`);
    } else {
      console.log(`   ✅ Aucune assignation orpheline`);
    }

    console.log('\n🎉 === TEST TERMINÉ ===');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

/**
 * Test spécifique de la planification automatique
 */
async function testQuestScheduling() {
  console.log('\n🕒 === TEST PLANIFICATION AUTOMATIQUE ===\n');

  // Vérifier si le scheduler est actif
  try {
    const AdvancedQuestScheduler = require('../services/AdvancedQuestScheduler');
    console.log('✅ Scheduler trouvé et actif');

    // Test manuel d'assignation quotidienne
    console.log('\n📅 Test assignation quotidienne manuelle...');
    
    const result = await AdvancedQuestScheduler.assignDailyQuestsToAllUsers();
    console.log(`   ${result.success ? '✅' : '❌'} ${result.message}`);
    
    if (result.details) {
      console.log(`   📊 Détails: ${JSON.stringify(result.details)}`);
    }

  } catch (error) {
    console.log(`❌ Scheduler non disponible: ${error.message}`);
  }
}

// Exécution
async function main() {
  await testQuestSystem();
  await testQuestScheduling();
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { testQuestSystem, testQuestScheduling };
