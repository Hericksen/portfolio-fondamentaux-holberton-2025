const { User, Achievement, UserAchievement } = require('../models');

async function testAchievements() {
  try {
    console.log('🎯 Test du système d\'achievements...');
    
    // Trouver un utilisateur de démo
    const user = await User.findOne({ 
      where: { email: 'guru@demo.pixelpump.com' }
    });
    
    if (!user) {
      console.log('❌ Utilisateur guru non trouvé');
      return;
    }
    
    console.log(`📋 Utilisateur trouvé: ${user.username} (ID: ${user.id})`);
    
    // Récupérer quelques achievements
    const achievements = await Achievement.findAll({ limit: 5 });
    console.log(`📊 ${achievements.length} achievements disponibles`);
    
    // Débloquer des achievements pour la démo
    for (const achievement of achievements.slice(0, 3)) {
      const existing = await UserAchievement.findOne({
        where: { user_id: user.id, achievement_id: achievement.id }
      });
      
      if (!existing) {
        await UserAchievement.create({
          user_id: user.id,
          achievement_id: achievement.id,
          unlocked_at: new Date(),
          progress: 100
        });
        console.log(`   ✅ Débloqué: ${achievement.title} (${achievement.rarity})`);
      } else {
        console.log(`   ℹ️  Déjà débloqué: ${achievement.title}`);
      }
    }
    
    // Vérifier les achievements de l'utilisateur
    const userAchievements = await UserAchievement.findAll({
      where: { user_id: user.id },
      include: [{ 
        model: Achievement,
        attributes: ['title', 'rarity']
      }]
    });
    
    console.log(`\n🏆 Achievements débloqués pour ${user.username}:`);
    userAchievements.forEach(ua => {
      console.log(`   🎖️  ${ua.Achievement.title} (${ua.Achievement.rarity})`);
    });
    
    console.log('\n✅ Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
  
  process.exit(0);
}

testAchievements();
