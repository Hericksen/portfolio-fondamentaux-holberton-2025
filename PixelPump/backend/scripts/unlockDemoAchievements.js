const { User, Achievement, UserAchievement } = require('../models');

async function unlockDemoAchievements() {
  try {
    console.log('🎯 Débloquage d\'achievements pour la démo...');

    // Trouver l'utilisateur de démo
    const demoUser = await User.findOne({
      where: { email: 'demo@pixelpump.com' }
    });

    if (!demoUser) {
      console.log('❌ Utilisateur de démo non trouvé');
      return;
    }

    console.log(`👤 Utilisateur trouvé: ${demoUser.username} (XP: ${demoUser.xp}, Level: ${demoUser.level}, Quests: ${demoUser.total_quests_completed})`);

    // Trouver quelques achievements à débloquer
    const achievementsToUnlock = await Achievement.findAll({
      where: {
        title: [
          'Premier Pas',
          'Engagé', 
          'Flamme Naissante',
          'Apprenti',
          'Collecteur d\'XP'
        ]
      }
    });

    for (const achievement of achievementsToUnlock) {
      // Vérifier si déjà débloqué
      const existing = await UserAchievement.findOne({
        where: {
          user_id: demoUser.id,
          achievement_id: achievement.id
        }
      });

      if (!existing) {
        await UserAchievement.create({
          user_id: demoUser.id,
          achievement_id: achievement.id,
          unlocked_at: new Date()
        });
        
        console.log(`🏆 Achievement débloqué: ${achievement.title} (+${achievement.xp_reward} XP)`);
      } else {
        console.log(`ℹ️  Achievement déjà débloqué: ${achievement.title}`);
      }
    }

    // Mettre à jour les stats de l'utilisateur
    const totalUnlocked = await UserAchievement.count({
      where: { user_id: demoUser.id }
    });

    console.log(`📊 Total achievements débloqués: ${totalUnlocked}`);
    console.log('🎉 Achievements de démo débloqués !');

  } catch (error) {
    console.error('❌ Erreur lors du débloquage des achievements:', error);
  }
}

// Exporter pour utilisation dans d'autres scripts
module.exports = unlockDemoAchievements;

// Exécuter si ce fichier est lancé directement
if (require.main === module) {
  unlockDemoAchievements().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
