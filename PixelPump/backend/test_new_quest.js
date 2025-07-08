const { User, UserQuest, Quest } = require('./models');
const GamificationService = require('./services/GamificationService');

async function testWithNewQuest() {
  try {
    console.log('🔄 Test avec une nouvelle quête...');
    
    // 1. Trouver l'utilisateur admin
    const admin = await User.findOne({ where: { email: 'admin@pixelpump.com' } });
    if (!admin) {
      console.error('❌ Utilisateur admin non trouvé');
      return;
    }
    
    console.log('✅ Utilisateur admin trouvé:', admin.username);
    
    // 2. Trouver les quêtes déjà assignées
    const existingQuests = await UserQuest.findAll({
      where: { user_id: admin.id },
      include: [{ model: Quest }]
    });
    
    const assignedQuestIds = existingQuests.map(uq => uq.quest_id);
    console.log(`📋 ${assignedQuestIds.length} quêtes déjà assignées`);
    
    // 3. Trouver une quête template non assignée
    const availableQuest = await Quest.findOne({ 
      where: { 
        is_template: true, 
        is_active: true,
        id: { [require('sequelize').Op.notIn]: assignedQuestIds }
      } 
    });
    
    if (!availableQuest) {
      console.error('❌ Aucune quête non assignée trouvée');
      return;
    }
    
    console.log('📋 Quête disponible:', availableQuest.title, 'XP:', availableQuest.xp_reward);
    
    // 4. Données avant complétion
    console.log('📊 Données AVANT:', {
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 5. Assigner la quête
    const userQuest = await UserQuest.create({
      user_id: admin.id,
      quest_id: availableQuest.id,
      is_completed: false,
      assigned_at: new Date()
    });
    
    console.log('✅ Quête assignée avec succès');
    
    // 6. Compléter la quête
    console.log('🎯 Complétion de la quête...');
    const result = await GamificationService.completeQuest(admin.id, availableQuest.id);
    
    console.log('✅ Résultat complétion:', result);
    
    // 7. Recharger les données
    await admin.reload();
    console.log('📊 Données APRÈS:', {
      level: admin.level,
      xp: admin.xp,
      total_quests_completed: admin.total_quests_completed,
      streak: admin.streak
    });
    
    // 8. Vérifier la quête
    const completedQuest = await UserQuest.findByPk(userQuest.id);
    console.log('📋 Quête complétée:', {
      is_completed: completedQuest.is_completed,
      completed_at: completedQuest.completed_at
    });
    
    // 9. Tester via getUserProgress
    console.log('🎯 Test via getUserProgress...');
    const progress = await GamificationService.getUserProgress(admin.id);
    console.log('📊 Progress user:', {
      level: progress.user.level,
      xp: progress.user.xp,
      total_quests_completed: progress.user.total_quests_completed,
      streak: progress.user.streak
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error.stack);
  }
}

testWithNewQuest();
