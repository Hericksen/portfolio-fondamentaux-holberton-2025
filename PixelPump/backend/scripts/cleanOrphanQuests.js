const { User, Quest, UserQuest } = require('../models');

/**
 * Script pour nettoyer les assignations orphelines
 */
async function cleanOrphanQuests() {
  try {
    console.log('🧹 === NETTOYAGE DES ASSIGNATIONS ORPHELINES ===\n');

    // Trouver les assignations sans utilisateur valide
    const orphanAssignments = await UserQuest.findAll({
      include: [{
        model: User,
        required: false
      }],
      where: {
        '$User.id$': null
      }
    });

    console.log(`🔍 ${orphanAssignments.length} assignations orphelines trouvées`);

    if (orphanAssignments.length > 0) {
      const orphanIds = orphanAssignments.map(ua => ua.id);
      
      console.log('📋 Exemples d\'assignations orphelines:');
      orphanAssignments.slice(0, 5).forEach((ua, index) => {
        console.log(`  ${index + 1}. ID: ${ua.id}, User ID: ${ua.user_id}, Quest ID: ${ua.quest_id}`);
      });

      console.log('\n🗑️ Suppression des assignations orphelines...');
      const deletedCount = await UserQuest.destroy({
        where: {
          id: orphanIds
        }
      });

      console.log(`✅ ${deletedCount} assignations orphelines supprimées`);
    } else {
      console.log('✅ Aucune assignation orpheline trouvée');
    }

    // Vérifier les assignations avec des quêtes inexistantes
    console.log('\n🔍 Vérification des quêtes inexistantes...');
    
    const assignmentsWithInvalidQuests = await UserQuest.findAll({
      include: [{
        model: Quest,
        required: false
      }],
      where: {
        '$Quest.id$': null
      }
    });

    if (assignmentsWithInvalidQuests.length > 0) {
      console.log(`❌ ${assignmentsWithInvalidQuests.length} assignations avec quêtes inexistantes`);
      
      const invalidQuestIds = assignmentsWithInvalidQuests.map(ua => ua.id);
      const deletedInvalidCount = await UserQuest.destroy({
        where: {
          id: invalidQuestIds
        }
      });

      console.log(`✅ ${deletedInvalidCount} assignations avec quêtes inexistantes supprimées`);
    } else {
      console.log('✅ Toutes les assignations ont des quêtes valides');
    }

    // Statistiques finales
    console.log('\n📊 === STATISTIQUES FINALES ===');
    const totalUsers = await User.count();
    const totalQuests = await Quest.count({ where: { is_template: true, is_active: true } });
    const totalAssignments = await UserQuest.count();
    const activeAssignments = await UserQuest.count({ where: { is_completed: false } });

    console.log(`👥 Utilisateurs: ${totalUsers}`);
    console.log(`📝 Quêtes actives: ${totalQuests}`);
    console.log(`📋 Assignations totales: ${totalAssignments}`);
    console.log(`⏳ Assignations actives: ${activeAssignments}`);

    console.log('\n✅ === NETTOYAGE TERMINÉ ===');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécution
async function main() {
  await cleanOrphanQuests();
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { cleanOrphanQuests };
