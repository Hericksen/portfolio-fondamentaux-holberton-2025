const User = require('../models/User');
const bcrypt = require('bcrypt');

async function createDemoUsers() {
  try {
    console.log('🌱 Création des utilisateurs de démo...');

    // Vérifier si les utilisateurs existent déjà
    const existingAdmin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    const existingUser = await User.findOne({ where: { email: 'test@example.com' } });

    // Créer l'admin de démo
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        username: 'admin',
        email: 'admin@pixelpump.com',
        password: hashedAdminPassword,
        role: 'admin'
      });
      console.log('✅ Admin de démo créé: admin@pixelpump.com / admin123');
    } else {
      console.log('ℹ️  Admin de démo existe déjà');
    }

    // Créer l'utilisateur de démo
    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash('password123', 12);
      await User.create({
        username: 'demouser',
        email: 'test@example.com',
        password: hashedUserPassword,
        role: 'user'
      });
      console.log('✅ Utilisateur de démo créé: test@example.com / password123');
    } else {
      console.log('ℹ️  Utilisateur de démo existe déjà');
    }

    console.log('🎉 Utilisateurs de démo prêts !');
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs de démo:', error);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  createDemoUsers().then(() => process.exit(0));
}

module.exports = { createDemoUsers };
