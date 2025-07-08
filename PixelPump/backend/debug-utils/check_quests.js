const { User, UserQuest, Quest } = require('./models');

async function checkExistingQuests() {
  try {
    const admin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    if (!admin) {
      console.error('❌ Utilisateur admin non trouvé');
      return;
    }
    
    console.log('✅ Utilisateur admin trouvé:', admin.username);
    
    const userQuests = await UserQuest.findAll({
      where: { user_id: admin.id },
      include: [{ model: Quest }]
    });
    
    console.log(`📋 ${userQuests.length} quêtes trouvées pour l'utilisateur:`);
    userQuests.forEach((uq, index) => {
      console.log(`${index + 1}. ${uq.Quest.title} (completed: ${uq.is_completed}, expired: ${uq.is_expired})`);
    });
    
    const incompleteQuests = userQuests.filter(uq => !uq.is_completed && !uq.is_expired);
    console.log(`\n📋 ${incompleteQuests.length} quêtes incomplètes:`);
    incompleteQuests.forEach((uq, index) => {
      console.log(`${index + 1}. ${uq.Quest.title} - XP: ${uq.Quest.xp_reward}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkExistingQuests();
