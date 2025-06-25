const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Quest = require('../models/Quest');
const Achievement = require('../models/Achievement');

async function seedDatabase() {
  try {
    // Synchroniser la base de données
    await sequelize.sync({ force: true });
    console.log('✅ Base de données synchronisée');

    // Créer des utilisateurs de test
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.bulkCreate([
      {
        username: 'alice_dev',
        email: 'alice@pixelpump.com',
        password: hashedPassword,
        level: 3,
        xp: 250
      },
      {
        username: 'bob_designer',
        email: 'bob@pixelpump.com',
        password: hashedPassword,
        level: 2,
        xp: 150
      },
      {
        username: 'charlie_fullstack',
        email: 'charlie@pixelpump.com',
        password: hashedPassword,
        level: 5,
        xp: 500
      }
    ]);

    console.log('✅ Utilisateurs créés');

    // Créer des projets de test
    await Project.bulkCreate([
      {
        title: 'Portfolio Personnel',
        description: 'Mon portfolio développé en React et Node.js',
        status: 'termine',
        difficulty: 3,
        technologies: ['React', 'Node.js', 'MongoDB'],
        githubUrl: 'https://github.com/alice/portfolio',
        demoUrl: 'https://alice-portfolio.com',
        userId: users[0].id
      },
      {
        title: 'App E-commerce',
        description: 'Application de commerce en ligne avec panier et paiement',
        status: 'en_cours',
        difficulty: 4,
        technologies: ['Vue.js', 'Express', 'PostgreSQL'],
        githubUrl: 'https://github.com/bob/ecommerce',
        userId: users[1].id
      },
      {
        title: 'API REST Blog',
        description: 'API complète pour un système de blog avec authentification',
        status: 'termine',
        difficulty: 3,
        technologies: ['Node.js', 'Express', 'JWT', 'PostgreSQL'],
        githubUrl: 'https://github.com/charlie/blog-api',
        userId: users[2].id
      }
    ]);

    console.log('✅ Projets créés');

    // Créer des quêtes de test
    await Quest.bulkCreate([
      {
        title: 'Premier pas en React',
        description: 'Créer votre premier composant React fonctionnel',
        category: 'skill',
        xp_reward: 50,
        difficulty: 'easy'
      },
      {
        title: 'API avec Express',
        description: 'Développer une API REST complète avec Express.js',
        category: 'skill',
        xp_reward: 100,
        difficulty: 'medium'
      },
      {
        title: 'Base de données PostgreSQL',
        description: 'Configurer et utiliser PostgreSQL dans votre projet',
        category: 'skill',
        xp_reward: 75,
        difficulty: 'medium'
      },
      {
        title: 'Déploiement en production',
        description: 'Déployer votre application sur un serveur de production',
        category: 'challenge',
        xp_reward: 150,
        difficulty: 'hard'
      },
      {
        title: 'Interface responsive',
        description: 'Créer une interface qui s\'adapte à tous les écrans',
        category: 'skill',
        xp_reward: 80,
        difficulty: 'medium'
      }
    ]);

    console.log('✅ Quêtes créées');

    // Créer des succès de test
    await Achievement.bulkCreate([
      {
        title: 'Premier projet',
        description: 'Félicitations ! Vous avez créé votre premier projet',
        icon: '🎉',
        condition: 'create_first_project'
      },
      {
        title: 'Développeur Frontend',
        description: 'Maîtrisez les technologies frontend',
        icon: '💻',
        condition: 'complete_5_frontend_quests'
      },
      {
        title: 'Maître Backend',
        description: 'Expert en développement backend',
        icon: '⚙️',
        condition: 'complete_5_backend_quests'
      },
      {
        title: 'Full Stack Hero',
        description: 'Vous maîtrisez le développement complet',
        icon: '🦸',
        condition: 'complete_fullstack_project',
        isRare: true
      },
      {
        title: 'Niveau 5 atteint',
        description: 'Vous avez atteint le niveau 5 !',
        icon: '🏆',
        condition: 'reach_level_5'
      }
    ]);

    console.log('✅ Succès créés');
    console.log('🎯 Base de données initialisée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
