const { User } = require('./models');

async function getAdminId() {
  try {
    const admin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    if (!admin) {
      console.error('❌ Utilisateur admin non trouvé');
      return;
    }
    
    console.log('✅ Utilisateur admin trouvé:');
    console.log('ID:', admin.id);
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Level:', admin.level);
    console.log('XP:', admin.xp);
    console.log('Total quests:', admin.total_quests_completed);
    console.log('Streak:', admin.streak);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

getAdminId();
