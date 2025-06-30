const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const { User, Quest, Achievement } = require('./models/index');

async function testSeed() {
  try {
    console.log('🔄 Test de connexion...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie');

    console.log('🔄 Synchronisation...');
    await sequelize.sync({ force: true });
    console.log('✅ Synchronisation terminée');

    console.log('🔄 Création d\'un utilisateur test...');
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const user = await User.create({
      username: 'test_user',
      email: 'test@test.com',
      password: hashedPassword,
      level: 1,
      xp: 0,
      avatar: {
        body: 'default',
        outfit: 'casual',
        accessory: 'none',
        color: '#ff006e'
      },
      streak: 0,
      fitness_goals: {
        daily_quests: 3,
        weekly_xp: 1000,
        target_level: 10
      },
      total_quests_completed: 0
    });

    console.log('✅ Utilisateur créé:', user.username);

    console.log('🔄 Création d\'une quête test...');
    const quest = await Quest.create({
      title: 'Test Quest',
      description: 'Une quête de test',
      category: 'cardio',
      difficulty: 'facile',
      xp_reward: 50,
      duration_minutes: 30,
      requirements: {
        test: 'value'
      }
    });

    console.log('✅ Quête créée:', quest.title);
    console.log('🎯 Test terminé avec succès !');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testSeed();
