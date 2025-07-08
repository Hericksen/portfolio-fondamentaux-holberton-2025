// Test direct de l'attribution d'XP avec complétion d'une quête
const { User, UserQuest, Quest } = require('./models');
const GamificationService = require('./services/GamificationService');

async function testXpComplete() {
  console.log('🔄 Test complet du système d\'XP...');
  
  try {
    // 1. Récupérer l'utilisateur admin
    const admin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    
    console.log('📊 AVANT - Données utilisateur:', {
      username: admin.username,
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 2. Créer une nouvelle quête pour tester
    const testQuest = await Quest.create({
      title: 'Test XP Quest',
      description: 'Quête de test pour vérifier l\'attribution d\'XP',
      type: 'daily',
      category: 'fitness',
      xp_reward: 50,
      difficulty: 'easy',
      duration_minutes: 10,
      is_template: true,
      is_active: true
    });
    
    console.log('✅ Quête de test créée:', testQuest.title, 'XP:', testQuest.xp_reward);
    
    // 3. Assigner la quête à l'utilisateur
    const userQuest = await UserQuest.create({
      user_id: admin.id,
      quest_id: testQuest.id,
      is_completed: false,
      assigned_at: new Date()
    });
    
    console.log('✅ Quête assignée');
    
    // 4. Compléter la quête
    console.log('🎯 Complétion de la quête...');
    const result = await GamificationService.completeQuest(admin.id, testQuest.id);
    
    console.log('✅ Résultat complétion:', result);
    
    // 5. Vérifier les nouvelles données
    await admin.reload();
    console.log('📊 APRÈS - Données utilisateur:', {
      username: admin.username,
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 6. Test du système de dashboard
    const dashboardData = await GamificationService.getUserProgress(admin.id);
    console.log('📊 Dashboard - Données utilisateur:', {
      level: dashboardData.user.level,
      xp: dashboardData.user.xp,
      total_quests_completed: dashboardData.user.total_quests_completed,
      streak: dashboardData.user.streak
    });
    
    // 7. Vérifier la quête dans la base
    const completedQuest = await UserQuest.findByPk(userQuest.id);
    console.log('📋 Quête complétée:', {
      is_completed: completedQuest.is_completed,
      completed_at: completedQuest.completed_at
    });
    
    // 8. Nettoyage - supprimer la quête de test
    await userQuest.destroy();
    await testQuest.destroy();
    console.log('🧹 Nettoyage terminé');
    
    console.log('\n✅ TEST TERMINÉ - Le système d\'XP fonctionne correctement !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error.stack);
  }
}

testXpComplete();
