#!/usr/bin/env node

const { User, UserQuest, Quest } = require('./models');
const QuestInitializationService = require('./services/QuestInitializationService');

async function testNewUserQuests() {
  try {
    // Créer un nouvel utilisateur de test
    const username = 'testuser_' + Date.now();
    // Utiliser un mot de passe déjà hashé pour simplifier
    const hashedPassword = '$2a$10$6AARpk5RWxX6kDC3YBUOXOOWqXWS1/jZSHH61KHTVzJMV.m1Lm2ky'; // 'password123'
    
    const newUser = await User.create({
      username: username,
      email: username + '@example.com',
      password: hashedPassword
    });
    
    console.log('Nouvel utilisateur créé:', username, '(ID:', newUser.id, ')');
    
    // Assigner des quêtes au nouvel utilisateur
    await QuestInitializationService.assignQuestsToUser(newUser.id, 1);
    
    // Récupérer les quêtes assignées
    const userQuests = await UserQuest.findAll({
      where: { user_id: newUser.id },
      include: [Quest]
    });
    
    console.log('\nQuêtes assignées à l\'utilisateur', username, '(total:', userQuests.length, '):');
    
    // Compter par type
    const dailyQuests = userQuests.filter(uq => uq.Quest.type === 'daily');
    console.log('- Quêtes quotidiennes:', dailyQuests.length);
    
    const weeklyQuests = userQuests.filter(uq => uq.Quest.type === 'weekly');
    console.log('- Quêtes hebdomadaires:', weeklyQuests.length);
    
    const monthlyQuests = userQuests.filter(uq => uq.Quest.type === 'monthly');
    console.log('- Quêtes mensuelles:', monthlyQuests.length);
    
    // Afficher les détails des quêtes
    console.log('\nDétails des quêtes assignées:');
    userQuests.forEach((uq, index) => {
      console.log(`${index + 1}. [${uq.Quest.type}] ${uq.Quest.title} - ${uq.Quest.description}`);
    });
    
    console.log('\nTest terminé avec succès!');
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    process.exit(0);
  }
}

testNewUserQuests();
