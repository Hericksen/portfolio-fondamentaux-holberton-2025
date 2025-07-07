const { User, Quest, UserQuest, Achievement, UserAchievement } = require('../models');
const GamificationService = require('../services/GamificationService');

async function simulateQuestCompletion() {
  try {
    console.log('🎮 Simulation d\'une complétion de quête...');
    
    // Trouver l'utilisateur guru
    const user = await User.findOne({ 
      where: { email: 'guru@demo.pixelpump.com' }
    });
    
    if (!user) {
      console.log('❌ Utilisateur guru non trouvé');
      return;
    }
    
    console.log(`👤 Utilisateur: ${user.username} (Level ${user.level}, ${user.xp} XP)`);
    
    // Trouver une quête active pour cet utilisateur
    const userQuest = await UserQuest.findOne({
      where: { 
        user_id: user.id,
        is_completed: false
      },
      include: [Quest]
    });
    
    if (!userQuest) {
      console.log('❌ Aucune quête active trouvée');
      return;
    }
    
    console.log(`🎯 Quête active: ${userQuest.Quest.title}`);
    
    // Compléter la quête
    await userQuest.update({
      is_completed: true,
      completed_at: new Date(),
      progress: { completion: 100 }
    });
    
    // Ajouter XP
    const xpGained = userQuest.Quest.xp_reward;
    await user.addXp(xpGained);
    
    console.log(`✅ Quête complétée ! +${xpGained} XP`);
    
    // Vérifier et débloquer des achievements automatiquement
    console.log('🏆 Vérification des achievements...');
    const newAchievements = await GamificationService.checkAchievements(user.id);
    
    if (newAchievements.length > 0) {
      console.log(`🎉 ${newAchievements.length} nouveaux achievements débloqués !`);
      newAchievements.forEach(achievement => {
        console.log(`   🏆 ${achievement.title} (${achievement.rarity}) - +${achievement.xp_reward} XP`);
      });
    } else {
      console.log('📋 Aucun nouvel achievement débloqué');
    }
    
    // Afficher le résumé final
    const finalUser = await User.findByPk(user.id);
    const totalAchievements = await UserAchievement.count({
      where: { user_id: user.id }
    });
    
    console.log(`\n📊 Résumé final:`);
    console.log(`   👤 Level: ${finalUser.level}`);
    console.log(`   ⭐ XP: ${finalUser.xp}`);
    console.log(`   🏆 Achievements: ${totalAchievements}`);
    
    console.log('\n✅ Simulation terminée ! Les succès devraient maintenant apparaître sur le profil.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error.message);
  }
  
  process.exit(0);
}

simulateQuestCompletion();
