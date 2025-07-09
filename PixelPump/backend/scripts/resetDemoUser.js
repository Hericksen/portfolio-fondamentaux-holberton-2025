const { User, UserQuest, UserAchievement } = require('../models');

async function resetDemoUser() {
  try {
    console.log('🔄 Réinitialisation de l\'utilisateur démo...');

    // Trouver l'utilisateur admin
    const user = await User.findOne({ where: { role: 'admin' } });
    
    if (!user) {
      console.log('❌ Aucun utilisateur admin trouvé');
      return;
    }

    console.log(`📝 Réinitialisation de ${user.username} (${user.email})`);

    // Sauvegarder l'XP et niveau actuels
    console.log(`💫 État actuel: ${user.xp} XP, Niveau ${user.level}, ${user.total_quests_completed} quêtes`);

    // Supprimer toutes les quêtes et achievements
    await UserQuest.destroy({ where: { user_id: user.id } });
    await UserAchievement.destroy({ where: { user_id: user.id } });

    // Réinitialiser les stats
    user.xp = 0;
    user.level = 1;
    user.total_quests_completed = 0;
    user.streak = 0;
    user.last_quest_date = null;
    await user.save();

    console.log(`✅ ${user.username} réinitialisé: 0 XP, Niveau 1, 0 quêtes`);
    console.log('🎮 Maintenant vous pouvez tester la première quête!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

resetDemoUser();
