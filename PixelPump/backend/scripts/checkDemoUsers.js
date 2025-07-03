const User = require('../models/User');

async function checkDemoUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs de démo...\n');

    const demoUser = await User.findOne({ where: { email: 'test@example.com' } });
    const adminUser = await User.findOne({ where: { email: 'admin@pixelpump.com' } });

    if (demoUser) {
      console.log('✅ Utilisateur de démo trouvé:');
      console.log(`   📧 Email: ${demoUser.email}`);
      console.log(`   👤 Username: ${demoUser.username}`);
      console.log(`   🔑 Role: ${demoUser.role}`);
      console.log(`   🎮 Level: ${demoUser.level}`);
      console.log(`   ⭐ XP: ${demoUser.xp}`);
    } else {
      console.log('❌ Utilisateur de démo introuvable');
    }

    console.log('');

    if (adminUser) {
      console.log('✅ Admin de démo trouvé:');
      console.log(`   📧 Email: ${adminUser.email}`);
      console.log(`   👤 Username: ${adminUser.username}`);
      console.log(`   🔑 Role: ${adminUser.role}`);
      console.log(`   🎮 Level: ${adminUser.level}`);
      console.log(`   ⭐ XP: ${adminUser.xp}`);
    } else {
      console.log('❌ Admin de démo introuvable');
    }

    console.log('\n🎯 Credentials pour test:');
    console.log('   👤 User: test@example.com / password123');
    console.log('   👑 Admin: admin@pixelpump.com / admin123');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

if (require.main === module) {
  checkDemoUsers().then(() => process.exit(0));
}

module.exports = { checkDemoUsers };
