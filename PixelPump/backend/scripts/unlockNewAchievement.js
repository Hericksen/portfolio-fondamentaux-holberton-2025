const { User, Achievement, UserAchievement } = require('../models');

async function unlockNewAchievement() {
  try {
    console.log('🎯 Test de déblocage d\'un nouveau succès...');
    
    // Trouver l'utilisateur guru
    const user = await User.findOne({ 
      where: { email: 'guru@demo.pixelpump.com' }
    });
    
    if (!user) {
      console.log('❌ Utilisateur guru non trouvé');
      return;
    }
    
    console.log(`👤 Utilisateur: ${user.username}`);
    
    // Trouver un achievement pas encore débloqué
    const allAchievements = await Achievement.findAll();
    const userAchievements = await UserAchievement.findAll({
      where: { user_id: user.id }
    });
    
    const unlockedIds = userAchievements.map(ua => ua.achievement_id);
    const availableAchievements = allAchievements.filter(a => !unlockedIds.includes(a.id));
    
    if (availableAchievements.length === 0) {
      console.log('📊 Tous les achievements sont déjà débloqués !');
      return;
    }
    
    // Débloquer le premier achievement disponible
    const newAchievement = availableAchievements[0];
    
    await UserAchievement.create({
      user_id: user.id,
      achievement_id: newAchievement.id,
      unlocked_at: new Date(),
      progress: 100
    });
    
    console.log(`✅ Nouveau succès débloqué: ${newAchievement.title} (${newAchievement.rarity})`);
    console.log(`🎁 Récompense: +${newAchievement.xp_reward} XP`);
    
    // Ajouter l'XP à l'utilisateur
    await user.addXp(newAchievement.xp_reward);
    
    // Afficher le total final
    const finalUserAchievements = await UserAchievement.count({
      where: { user_id: user.id }
    });
    
    console.log(`📈 Total achievements: ${finalUserAchievements}`);
    console.log('🎉 Le nouveau succès devrait maintenant apparaître sur le profil !');
    console.log('');
    console.log('📱 Pour tester:');
    console.log('   1. Ouvrir http://localhost:3002');
    console.log('   2. Se connecter avec: guru@demo.pixelpump.com / demo2025');
    console.log('   3. Aller sur le profil utilisateur');
    console.log('   4. Voir la section "Succès Récents"');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

unlockNewAchievement();
